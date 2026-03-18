---
name: simplification-worker
description: Refactor shared modules, routes, and data-flow code into simpler, narrower, skimmable implementations.
---

# Simplification Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the work procedure.

## When to Use This Skill

Use this skill for features that simplify shared UI primitives, helpers, providers, auth/query contracts, guestbook data flow, and non-interactive route/page code.

## Work Procedure

1. Read the assigned feature, `mission.md`, mission `AGENTS.md`, and the relevant `.factory/library/*.md` notes before editing.
2. Inspect the target files and their direct callers. Do not narrow a contract until you know every caller that depends on it.
3. Refactor toward the mission style:
   - fewer arguments
   - fewer optional values
   - early returns
   - explicit asserted data paths
   - no defensive fallback branches for impossible states
4. Keep behavior the same unless the feature explicitly narrows invalid states.
5. Update all direct consumers in the same feature when you tighten a shared contract.
6. Do not add new tests for this mission. Instead, verify by reading the changed flows carefully and then running the required validators.
7. Run `bun run typecheck` and `bun run lint` before ending the feature. If the feature touches app-wide contracts, layouts, or route integration, also run `bun run build`.
8. Commit completed work on the existing branch `mission/whole-repo-simplification`. Do not create a new branch for the feature.
9. Record exact commands, outputs, and observations in the handoff. If something is incomplete or suspicious, say so explicitly.

## Example Handoff

```json
{
  "salientSummary": "Simplified the shared guestbook client contract and removed fallback-heavy optimistic state. Updated the direct guestbook consumers to use the narrower shapes and confirmed the repo still typechecks and lints cleanly.",
  "whatWasImplemented": "Refactored lib/api/guestbook.ts, lib/hooks/use-guestbook.ts, lib/query/query-keys.ts, and types/guestbook.ts so the guestbook client data flow now uses one explicit request/response contract. Removed optional optimistic user fallbacks that were not required by the current callers and updated the guestbook UI call sites to match the stricter types.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      {
        "command": "bun run typecheck",
        "exitCode": 0,
        "observation": "TypeScript/native preview finished without errors after the contract cleanup."
      },
      {
        "command": "bun run lint",
        "exitCode": 0,
        "observation": "Next.js ESLint passed with no new diagnostics."
      }
    ],
    "interactiveChecks": [
      {
        "action": "Manual code review of the edited guestbook flow",
        "observed": "All direct callers now pass the required fields explicitly and no optional fallback branch remains for optimistic user data."
      }
    ]
  },
  "tests": {
    "added": []
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- Tightening a contract would require a schema, env, or auth-provider change.
- A shared helper is used in more places than the feature can safely update in one session.
- `typecheck`, `lint`, or `build` fail for reasons that appear unrelated to the assigned feature.
- The only way to continue would be to add new tests, browser validation, or new dependencies that the mission currently forbids.
