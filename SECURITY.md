# Security Policy

## Reporting a Vulnerability

If you discover a security issue in OffMic, please report it privately. Do **not** open a public GitHub issue.

**Preferred channel:** GitHub Security Advisories
→ https://github.com/offmic/offmic/security/advisories/new

**Alternative:** email `security@offmic.org`

We aim to acknowledge reports within 48 hours and provide a status update within 7 days.

## Scope

In scope:

- Cryptographic flaws in the E2EE design or implementation
- Key leakage to the server
- Authentication or authorization bypass
- Information disclosure (transcripts, audio, metadata)
- Denial-of-service that compromises availability of stored interviews

Out of scope:

- Issues requiring physical access to a participant's device
- Social engineering of users
- Vulnerabilities in unmodified upstream dependencies (please report to the upstream)
- Reports without a clear, reproducible impact

## Supported Versions

OffMic is in pre-alpha. No version is currently supported for production use. The `main` branch is the only target for security reports.

## Threat Model

A summary is in [README.md](./README.md). The full threat model is in [THREAT-MODEL.md](./THREAT-MODEL.md).

## Disclosure Timeline

We follow coordinated disclosure:

1. Reporter submits a vulnerability privately
2. We confirm and develop a fix
3. Fix is deployed to the hosted instance
4. Public disclosure with credit to the reporter (if desired) within 90 days of the report, or sooner if mutually agreed
