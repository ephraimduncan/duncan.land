# Environment

Environment variables, external dependencies, and setup notes.

**What belongs here:** required env vars, external services, dependency quirks, platform notes.
**What does NOT belong here:** service ports or command definitions. Those live in `.factory/services.yaml`.

---

## Required Environment Variables

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_TRUSTED_ORIGINS`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## External Dependencies

- Turso/libSQL is the active database backing the app through `@libsql/client` and Drizzle.
- Better Auth and GitHub OAuth power login/session flows.
- Vercel Blob is used by the signature upload route.

## Mission Notes

- This mission does not change env variable names or external service topology.
- Workers must never write secrets into tracked files.
- If a refactor appears to require env or service changes, return to the orchestrator instead of guessing.
