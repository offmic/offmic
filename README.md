# OffMic

**End-to-end encrypted async voice interviews. Source-protective by design.**

> Pre-alpha. Active development. Not ready for production use.

OffMic lets a journalist, researcher, or human rights worker collect a recorded answer from a source without ever exposing the recording to a third-party server. The audio is encrypted in the source's browser before it leaves their device. The OffMic server stores ciphertext only — it cannot decrypt what it holds.

## What OffMic is

- **Async voice interview.** One party asks, the other answers later, no scheduling.
- **Browser-only.** The source needs no account, no install, no Tor.
- **End-to-end encrypted.** AES-256-GCM, key carried in the URL fragment, never sent to the server.
- **Open source.** AGPL-3.0, fully auditable.
- **Privacy-first by default.** No analytics, no IP logging, no metadata harvesting.

## What OffMic is not

- **Not a replacement for SecureDrop.** If your threat model includes state-level adversaries with active network or device access, use [SecureDrop](https://securedrop.org) instead.
- **Not a real-time call tool.** For that, use Signal.
- **Not a generic recorder.** It is structured around the journalist↔source interview flow.

## Threat model summary

OffMic protects against:

- Server compromise (we hold ciphertext only)
- Honest-but-curious operators, including ourselves
- Passive network observers between source and server
- Long-term metadata harvesting

OffMic does **not** protect against:

- Compromised endpoints (malware on the journalist's or source's device)
- Targeted active attacks at the network layer (use Tor)
- Coercion of the journalist (E2EE doesn't survive subpoena of the holder)

See [THREAT-MODEL.md](./THREAT-MODEL.md) for the full document.

## Status

| Component | Status |
|---|---|
| Concept and threat model | Drafted |
| Cryptographic design | In review |
| MVP code | In progress |
| External audit | Planned post-MVP |

## License

[GNU Affero General Public License v3.0](./LICENSE)

You can use, modify, and self-host this code. If you run a modified version as a hosted service, you must publish your modifications under the same license.

## Security disclosure

See [SECURITY.md](./SECURITY.md). Please report vulnerabilities responsibly.
