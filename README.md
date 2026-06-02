# Cosmo frontend

Next.js 16 App Router app for [Cosmo](../README.md) — a quiet creative home for stories, art, libraries, forums, and goals.

## Local development

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH"
npm install
npm run dev -- -p 5176
```

Backend must be running on `http://localhost:4000` (see [../backend/README.md](../backend/README.md)).

## Environment

`/.env.local` — minimum:

```
NEXTAUTH_SECRET=at-least-16-chars
NEXTAUTH_URL=http://localhost:5176
BACKEND_API_URL=http://localhost:4000
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000
NEXT_PUBLIC_MINIO_PUBLIC_URL=http://localhost:9100
```

Optional: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_TRACES_SAMPLE_RATE`.

## Scripts

- `npm run dev` — Turbopack dev server.
- `npm run build` — production build.
- `npm run lint` — ESLint (Next config).
- `npm run test` — Vitest.
- `npm run storybook` — component playground.

## Code layout

```
src/
  app/                       App Router routes (auth, app shell, settings, onboarding)
  components/                shell, feed, forums, goals, libraries, search, settings, auth
  lib/api/                   typed clients per backend module
  lib/auth/                  next-auth credentials provider config
  store/                     Zustand stores
  styles/tokens.css          full design system (palette, accent, fonts, layout primitives)
  instrumentation.ts         env-gated Sentry hook
```

## Design system

Tokens in `src/styles/tokens.css`. Re-themable at runtime via the Tweaks panel (bottom-right floating button). Fonts loaded through `next/font` (Instrument Serif, Newsreader, Geist, Geist Mono).

## Auth flow

`next-auth` credentials provider hits the Nest backend's `/auth/login`. The JWT is stored under `session.user.token` and forwarded on every backend call via the `apiFetch` helper in `lib/api/client.ts`.
