# Refactor Rules

Mission-specific coding rules for workers.

---

- Write extremely simple code that is easy to skim.
- Bias for fewer lines of code and fewer arguments.
- Remove or narrow state whenever possible.
- Prefer discriminated unions when they reduce the number of valid states.
- Exhaustively handle known variants and fail on unknown variants.
- Do not add defensive fallback code for values that the type system should already guarantee.
- Use assertions for required loaded data.
- Prefer early returns.
- Avoid clever abstractions and avoid splitting work into many tiny helpers when inline code is clearer.
- Do not keep optional parameters unless callers truly omit them.
- Do not pass overrides unless they are strictly necessary.
- Remove non-essential changes.
- Keep `components/token-usage/source.tsx` to light cleanup only.
