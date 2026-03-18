---
name: interactive-refactor-worker
description: Refactor interaction-heavy wall and signature-pad code into narrower, explicit state models without changing the feature shape.
---

# Interactive Refactor Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the work procedure.

## When to Use This Skill

Use this skill for features touching `components/signature-pad/*`, `app/wall/hooks/*`, `app/wall/components/*`, `app/wall/lib/*`, and closely related interactive support code.

## Work Procedure

1. Read the assigned feature, `mission.md`, mission `AGENTS.md`, and `.factory/library/refactor-rules.md` before editing.
2. Trace the interaction flow first: identify the exact state values, refs, callbacks, and props that move through the target files.
3. Collapse state carefully:
   - remove optional configuration that callers never vary
   - replace broad booleans/nullable combinations with narrower explicit shapes
   - keep event handling exhaustive and obvious
   - use assertions when an expected runtime value must exist
4. Preserve the current feature shape. This mission is not a redesign of the signature wall or signature pad.
5. Keep code local and readable. Do not split logic into many helper functions unless doing so clearly reduces confusion.
6. Because browser validation is out of scope, do a manual code-path review after editing: trace pointer/drawing/dialog flows end to end and confirm every branch is still explained by a real interaction.
7. Run `bun run typecheck` and `bun run lint`. Run `bun run build` when the feature touches route integration or app-wide interactive contracts.
8. Commit completed work on the existing branch `mission/whole-repo-simplification`. Do not create a new branch for the feature.
9. In the handoff, name the exact interaction paths you reviewed and any risks that remain.

## Example Handoff

```json
{
  "salientSummary": "Simplified the wall viewport hooks by removing unused optional configuration and making pan/zoom state transitions easier to trace. Verified the interactive modules still compile and recorded the remaining risk around browser-free validation.",
  "whatWasImplemented": "Refactored app/wall/hooks/use-canvas-viewport.ts, use-canvas-scale-controls.ts, use-canvas-pan-state.ts, and use-viewport-culling.ts so the wall interaction state is narrower and more explicit. Removed unnecessary option defaults that callers never changed, tightened callback contracts, and kept the pan/zoom flow readable from top to bottom.",
  "whatWasLeftUndone": "No browser runtime validation was performed because the mission explicitly forbids browser-based verification.",
  "verification": {
    "commandsRun": [
      {
        "command": "bun run typecheck",
        "exitCode": 0,
        "observation": "Interactive hook refactor compiled cleanly across the wall surface."
      },
      {
        "command": "bun run lint",
        "exitCode": 0,
        "observation": "Lint passed after simplifying hook inputs and state updates."
      }
    ],
    "interactiveChecks": [
      {
        "action": "Manual code-path review of wall pan, zoom, and culling flows",
        "observed": "Every remaining branch maps to a real interaction path, and removed optional config values were not required by any current caller."
      }
    ]
  },
  "tests": {
    "added": []
  },
  "discoveredIssues": [
    {
      "severity": "medium",
      "description": "Interactive behavior was validated through code-path review and build/lint/typecheck only because browser validation is intentionally out of scope for this mission."
    }
  ]
}
```

## When to Return to Orchestrator

- The interaction code appears to need live browser validation to proceed safely.
- A state simplification would require changing the user-visible interaction model instead of just clarifying it.
- The feature depends on wall or signature data contracts that are not yet stable.
- `typecheck`, `lint`, or `build` fail for reasons that are not clearly caused by the assigned refactor.
