# Architecture

Architecture notes and stable boundaries discovered during planning.

**What belongs here:** route structure, shared module responsibilities, stable integration points.

---

## Top-Level Structure

- `app/layout.tsx` is the root shell for fonts, providers, analytics, and global metadata.
- `app/(main)` contains the primary site routes and guestbook/auth routes.
- `app/wall` contains the signature wall surface and its interaction-specific hooks/components.
- `components/` holds reusable UI primitives plus a few feature-specific components.
- `lib/` holds shared helpers, auth, data access, query utilities, and hooks.

## Refactor Boundaries

- `components/button.tsx`, `dialog.tsx`, `fieldset.tsx`, `textarea.tsx`, `link.tsx`, and related shared primitives are foundational. Narrowing their APIs should happen before broader page cleanup.
- Guestbook contracts span server routes, client API/hooks, shared types, and guestbook UI files. Those changes should move together within the guestbook milestone.
- Interactive wall work spans `app/wall/hooks/*`, `app/wall/components/*`, `app/wall/lib/signature-layout.ts`, `lib/data/wall.ts`, and `components/signature-pad/*`.
- `components/token-usage/source.tsx` is in scope for light cleanup only.

## Route Inventory Relevant To The Mission

- `/`
- `/blog`
- `/thoughts`
- `/talks`
- `/archive`
- `/guestbook`
- `/login`
- `/wall`
- `/token-usage`
- Guestbook/auth API routes under `/api/*`

## Validation Shape For This Mission

- The user explicitly chose validator-only verification.
- Success is defined by simpler contracts plus clean `typecheck`, `lint`, and `build` results.
