# User Testing

Validation surface and validator-planning notes for this mission.

**What belongs here:** validation surfaces, setup notes, concurrency limits, accepted limitations.

---

## Validation Surface

### CLI validators only

The user explicitly chose to skip browser-based validation for this refactor mission.

Use only:
- `bun run typecheck`
- `bun run lint`
- `bun run build`

### Accepted Limitations

- No browser automation
- No manual browser walkthroughs
- No new automated tests
- Validation evidence is terminal output plus source inspection for the refactored files

## Validation Concurrency

### CLI surface

- **Max concurrent validators:** 1
- **Why:** the machine has 16 GB RAM, 10 CPU cores, and relatively low comfortable memory headroom during planning. `next build` is the heaviest required command, so validators should stay conservative.

## Dry Run Notes

- Local route checks returned `200` for `/` and `/guestbook` during planning.
- Browser automation was intentionally not adopted after user direction.
- The repository currently exposes `lint`, `typecheck`, and `build`; there is no test script, so `.factory/services.yaml` maps `test` to `bun run build` for the hard validation gate.
