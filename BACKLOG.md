# OffMic — Backlog projet

**Statut : conception capturée, dev shelvé en attente fin sprint distribution Punkto.**
**Date capture : 2026-05-07**
**Domaine : offmic.org (acquis)**

---

## Pitch

> Outil d'interview asynchrone chiffré bout-en-bout, pour journalistes d'investigation, chercheurs SHS sur sujets sensibles, ONG droits humains.
>
> Le journaliste génère un lien unique avec une question. La source ouvre dans son navigateur, enregistre sa réponse audio, l'audio est chiffré côté client avant upload. Le serveur ne peut rien lire. La transcription se fait dans le navigateur du journaliste via Whisper WASM. Open source AGPL-3.0.

**Slogan** : *Off mic. End-to-end. By design.*

---

## Positionnement marché

**Entre Signal (trop léger, sync) et SecureDrop (trop lourd, texte uniquement).**

Pour les **95% de cas** d'interviews sensibles qui n'exigent pas le niveau Snowden mais méritent mieux qu'un Zoom + Otter.

### Concurrents

| Outil | Limite |
|---|---|
| VideoAsk, Hirevire, Willo | Pas E2EE, pas open source |
| Outset, UserCall, Marvin | UX research AI-moderated, pas privacy |
| SecureDrop | Texte uniquement, lourd (Tor + Tails) |
| Signal | Sync, pas de transcription, pas structuré |
| Loom | Pas E2EE, pas anonyme côté source |

**Aucun concurrent ne combine** : E2EE applicatif + open source + transcription + flux interview structuré.

---

## ICP (cible client)

| Segment | Taille EU | Conversion estimée |
|---|---|---|
| Journalistes investigation freelance | 1-3k | 10-15% |
| Rédactions investigation | 50-200 | 20% |
| Chercheurs SHS sujets sensibles | 5-20k | 5% |
| ONG droits humains | 500-2k orgs | 20% |

**SOM réaliste 3 ans** : 300-1500 clients payants. **ARR plafond** : 200k-1M€.

Pas un unicorn, mais une niche défendable.

---

## Architecture technique

### Flux côté journaliste

1. Auth (magic link)
2. Création interview : tape question(s), expiration
3. Génération lien unique avec **clé AES-256 dans fragment URL** (`#k=...`)
4. Partage lien via canal séparé (Signal, email)
5. Réception notification quand source répond
6. Ouverture : déchiffrement local + Whisper WASM = transcript
7. Export PDF signé (hash audio + timestamp)

### Flux côté source

1. Reçoit lien (canal séparé)
2. Ouvre dans navigateur, **zéro compte, zéro install**
3. Lit question
4. Enregistre audio (vidéo optionnel)
5. **Chiffrement AES-GCM dans navigateur**, clé du fragment URL
6. Upload chiffré (serveur ne peut pas lire)
7. Soumet, ferme onglet

### Stack

- Next.js (réutilisable de Punkto)
- Supabase (auth + storage chiffré) ou stockage VPS direct
- MediaRecorder browser API (pas LiveKit)
- Whisper WASM (port depuis migration Punkto session 52)
- AES-256-GCM Web Crypto API
- Hébergement Hetzner EU (DE/FI)

### Couches de sécurité

**MVP :**
- E2EE applicatif (clé fragment URL)
- No IP logging (nginx config + politique)
- Métadonnées minimales (zéro analytics, zéro cookie)
- Auto-destruct après lecture ou expiry
- Hash audio signé dans export PDF

**V2 :**
- Onion service mirror (.onion optionnel)
- Multi-question structurée
- Audit logs côté journaliste signés

**Hors scope (skip) :**
- Tor obligatoire (tue UX)
- No-JS fallback (tue WASM/recording)
- Decoy traffic (overkill)

---

## Modèle économique

**Open source AGPL-3.0 + SaaS hébergé EU.**

Repo public dès commit 1. AGPL force forks à rester open. Self-hosting autorisé mais SaaS = business model.

### Pricing

| Plan | Prix | Cible |
|---|---|---|
| Free | 0€ | 3 interviews/mois, 30 min, 7j rétention |
| Pro | 19€/mo | journaliste freelance, illimité, 1h, 30j |
| Newsroom | 99€/mo | rédaction (5 sièges), audit logs, branding |
| Academic | 9€/mo | chercheur SHS, IRB-compatible |

---

## Documentation indispensable au lancement

- `README.md` — install + screenshots
- `SECURITY.md` — threat model détaillé, choix crypto, disclosure policy
- `THREAT-MODEL.md` — qui on protège, contre quoi, ce qu'on **ne couvre pas** (être honnête : pas adversaire étatique avec accès device → SecureDrop)
- `INSTALL.md` — self-hosting

---

## Distribution

**Cycle réaliste** : 12-24 mois pour traction.

**Canaux :**
- GIJN (Global Investigative Journalism Network) — sponsoring + partenariat éditorial
- RSF / Reporters Without Borders
- CFJ / J++ / Bureau Local — écoles journalisme + collectifs
- Posts techniques : "Comment chiffrer une interview source de bout en bout"
- Bouche-à-oreille via 5 ambassadeurs initiaux

**Audit externe** à 3-6 mois (Cure53, Trail of Bits, ROC) — 5-15k€.

**Financement audit possible :** NLnet, Open Tech Fund, RSF.

---

## MVP — 6-8 semaines

| Semaine | Livrable |
|---|---|
| 1-2 | Auth journaliste + création interview + génération lien E2EE |
| 3-4 | Page source : question + recorder + chiffrement client + upload |
| 5 | Page journaliste : déchiffrement + Whisper WASM (port Punkto) |
| 6 | Auto-destruct + audit logs basiques + export PDF signé |
| 7-8 | Polish, landing offmic.org, doc sécurité |

---

## Pourquoi shelvé maintenant

1. **Punkto distribution sprint en cours** (2 mois full distribution, décidé 2026-05-07).
2. OffMic prend 18-24 mois à payer — pas urgent.
3. Niche trop petite/technique pour être copiée vite.
4. Domaine acquis = coût 12€/an, zéro perte à attendre.

**Trigger de reprise :**
- Punkto trouve traction → OffMic devient projet 2
- OU Punkto cale après sprint distribution → OffMic devient porte de sortie
- OU contact direct journaliste/rédaction qui valide le besoin

**Réévaluation prévue : ~2026-08-07** (3 mois).

---

## Notes architecture à porter de Punkto

- **Whisper WASM migration** (session 52, tag `pre-whisper-migration @ ea62db9`) — pipeline transcription client-side réutilisable
- **AES-GCM at-rest** (migration 0023) — pattern chiffrement applicatif
- **E2E Phase 2 client-keys** (session 63, grisé) — flux clé fragment URL
- **Recorder Pattern A** (timeslice + fix-webm-duration) — capture audio robuste

Tout ça est déjà dans Punkto, à porter quand on relance OffMic.
