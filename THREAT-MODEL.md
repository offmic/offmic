# OffMic Threat Model

> Status: draft v0.1. Subject to revision before MVP release.

## Goals

OffMic is designed to let a journalist, researcher, or human rights worker receive a recorded interview answer from a source with the following guarantees:

1. The OffMic server cannot read the recording or the transcript.
2. The source's IP address is not stored.
3. The source needs no account.
4. The recording is destroyed within a defined retention window.
5. The journalist can prove the recording was not altered after submission.

## Actors

| Actor | Role |
|---|---|
| Journalist | Creates the interview link, receives and reads the answer |
| Source | Receives the link via a separate channel, records and submits the answer |
| Server | Holds ciphertext, routes notifications, enforces retention |
| Operator (us) | Runs the hosted instance |
| Network | Carries traffic between actors and the server |

## Adversaries we protect against

- **Server compromise.** An attacker who steals our database or filesystem gets ciphertext only. AES-256-GCM keys are never on the server.
- **Honest-but-curious operator.** Even with full access to our infrastructure, we cannot decrypt content. The cryptographic design forbids it; we are not a trusted party.
- **Passive network observer.** TLS protects in transit. Audio bodies are double-encrypted (TLS + AES-GCM payload).
- **Long-term retention.** Auto-destruct means a compromise of historical backups discloses nothing decryptable.

## Adversaries we do NOT protect against

These are explicit limits. We tell users honestly.

- **Compromised endpoint.** If malware is on the source's device, it can read the audio before encryption. We cannot defend against this. Use a clean device.
- **Compromised journalist device.** Same. The journalist's browser holds the decryption key during reading.
- **State-level adversary with active interception.** If your threat is a nation-state with active control of your network, you should use [SecureDrop](https://securedrop.org) over Tor, not OffMic.
- **Subpoena of the journalist.** E2EE protects from technical adversaries, not legal ones. If the journalist is compelled to turn over their decryption key, the content is exposed.
- **Source coercion.** If a source is forced to submit content they don't want to, we cannot detect it.
- **Traffic analysis.** A global passive adversary can correlate timing and size of upload events. We do not pad traffic.

## Cryptographic design

### Symmetric encryption

- **Algorithm:** AES-256-GCM (authenticated encryption)
- **Key length:** 256 bits
- **Nonce:** 96-bit random per message
- **Library:** Web Crypto API (`SubtleCrypto.encrypt`, `SubtleCrypto.decrypt`)

### Key transport

- The encryption key is generated client-side in the source's browser (or pre-generated client-side by the journalist).
- The key is encoded in the URL **fragment** (`#k=base64`). Fragments are never sent in HTTP requests to the server.
- The journalist transmits the link to the source via a separate authenticated channel (Signal, encrypted email, in person).

### Key rotation

- Each interview has a unique random key.
- Keys are not reused across interviews.
- Keys are not stored server-side at any point.

### Integrity

- AES-GCM provides authenticated encryption, so tampering of ciphertext is detected on decryption.
- The export PDF includes a SHA-256 hash of the ciphertext and a server-attested timestamp.

## Storage

- **Audio.** Stored as ciphertext only. Auto-destructed after read or after the retention window (configurable, default 30 days).
- **Transcript.** Generated client-side via Whisper WASM in the journalist's browser. Stored on the journalist's device. Never sent to the server.
- **Metadata.** Minimal. We store: interview ID (random), creator user ID, creation time, expiry time, status (pending / answered / expired).
- **No IP logs.** nginx is configured to not log client IPs for endpoints handling source traffic.
- **No analytics.** No third-party trackers. No fingerprinting.

## Authentication

- The **journalist** authenticates with a magic link sent to their email.
- The **source** does not authenticate. The interview link is the access token. Optional passphrase (PBKDF2-derived AES key wrapping) for additional protection if the link is intercepted.

## Trust assumptions

- We trust the journalist's browser to handle decryption keys correctly.
- We trust TLS and the certificate authority chain for transport.
- We trust the Web Crypto API implementation in modern browsers.
- We do **not** trust the server with content.
- We do **not** trust ourselves (the operators) with content.

## Open questions

- How to handle key escrow for journalists who lose access to their account? (Currently: no recovery, by design.)
- How to verify a recording was not tampered with by the source after creation? (Audio hash plus timestamp helps but is not strong evidence.)
- How to mitigate against malicious journalists submitting fake interviews and attributing them to real sources?

## Audit plan

- External cryptographic audit planned post-MVP, target H2 2026.
- Candidate auditors: Cure53, Trail of Bits, Radically Open Security.
- Funding: NLnet, Open Tech Fund, or self-funded.

---

This document is versioned. Material changes are tracked in git history.
