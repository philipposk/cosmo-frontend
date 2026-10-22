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
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
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
  lib/auth/                  Supabase session -> Cosmo JWT (client provider + server helper)
  store/                     Zustand stores
  styles/tokens.css          full design system (palette, accent, fonts, layout primitives)
  instrumentation.ts         env-gated Sentry hook
```

## Design system

Tokens in `src/styles/tokens.css`. Re-themable at runtime via the Tweaks panel (bottom-right floating button). Fonts loaded through `next/font` (Instrument Serif, Newsreader, Geist, Geist Mono).

## Auth flow

Sign-in is passwordless: "Continue with Google" or "Email me a sign-in link" (an emailed one-time link plus a typed code), both through the shared 6x7 Supabase login (one session cookie, `sb-6x7-auth` on `.6x7.gr`). There are no passwords, no password signup, and no forgot/reset flow. People who used a password before sign in with the emailed link (same email, same account).

The app then exchanges the Supabase access token for a Cosmo JWT via the backend's `POST /auth/supabase-exchange`. The JWT is stored under `session.user.token` and forwarded on every backend call via the `apiFetch` helper in `lib/api/client.ts`.

Routes: `/login` (sign-in page), `/auth/callback` (Google and emailed-link return), `/auth/confirm` + `POST /auth/verify` (token-hash links: the token is only spent when the person taps the button).
