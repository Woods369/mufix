# Mufix

Nuxt 4 site for **Mufix** — MIDI keyboard & electric guitar repairs (Midlands, UK).

- Public marketing site + Calendly booking
- Web MIDI diagnostic tool (`/diagnostic`)
- Admin repair orders dashboard (`/orders`) protected by WebAuthn (security key)

## Stack

- Nuxt 4 / Vue 3 / Nitro
- WebAuthn via `@simplewebauthn/*`
- Storage: Upstash Redis REST (preferred on Vercel), TCP `REDIS_URL`, or local `server/data/*.json`
- Images: Vercel Blob (`BLOB_READ_WRITE_TOKEN`) or base64 in local dev

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Production env (Vercel)

| Variable | Required | Notes |
|----------|----------|--------|
| `SESSION_SECRET` | **yes** | `openssl rand -hex 32` |
| `WEBAUTHN_RP_ID` | recommended | e.g. `www.mufix.co.uk` |
| `WEBAUTHN_ORIGIN` | recommended | e.g. `https://www.mufix.co.uk` |
| `UPSTASH_REDIS_REST_URL` + `TOKEN` | recommended | serverless-safe KV |
| `BLOB_READ_WRITE_TOKEN` | for uploads | Vercel Blob |
| `REGISTER_SECRET` | optional | gates first key registration |
| `ALLOW_WEBAUTHN_REREGISTER` | optional | `true` only when replacing admin key |

Deploy with **`nuxt build`** (server/API routes). Do not use pure static `generate` for the admin/API.

## Auth model

- Single admin WebAuthn credential
- Registration **locks** after the first key (unless `ALLOW_WEBAUTHN_REREGISTER=true`)
- Optional `REGISTER_SECRET` via header `x-register-secret` or `/auth?secret=...`

## Scripts

- `npm run dev` — local dev
- `npm run build` — production build
- `npm run preview` — preview production build

## Legal

Stub pages: `/privacy`, `/terms`. Review with a solicitor before relying on them.
