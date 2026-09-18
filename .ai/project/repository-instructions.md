## Next.js local-version rule

This repository's installed Next.js version may differ materially from
training data. Before writing or changing Next.js-sensitive code, read the
relevant local guide in `node_modules/next/dist/docs/` and heed any
deprecation notices there rather than relying on remembered conventions.

## What this repository is

Leerplatform is a game-based learning platform for primary-school children
(ages 6-12). Code, design and content must stay aligned with that
educational purpose and audience.

## Child-safety context

This platform serves children. Avoid patterns that weaken safeguards or
expose unnecessary personal data. Treat child safety as a core engineering
concern, not an afterthought.

## Accessibility

Accessibility is not optional for this audience:

- all interactive elements must be keyboard-accessible;
- color contrast must meet WCAG AA (4.5:1 normal text, 3:1 large text);
- touch targets must be at least 44x44px;
- do not rely on color alone to convey meaning.

## Authentication model

Auth is magic-link and student-login based (`src/app/api/auth/magic-link`,
`src/app/api/auth/student-login`, `.../logout`, `.../register`,
`.../verify`), not password-first. Treat auth/session changes as
security-sensitive: positive- and negative-path test coverage is required
for them (see `CONTRIBUTING.md`).

## Token-first design-system discipline

All visual values must flow through the design-token system defined in
`src/app/globals.css`. Do not use hardcoded hex colors in `className`
strings, inline `style` props for colors/spacing/shadows, or arbitrary
Tailwind bracket values for colors — use the token utility classes instead.

## Local commit guards

This repository uses local Git hooks in `.githooks/`:

- a pre-commit **documentation guard** blocks code-impacting commits that
  stage no documentation update (bypass only when genuinely no doc impact:
  `SKIP_DOC_GUARD=1 git commit ...`);
- a commit-msg **verification guard** requires code-impacting commits to
  include a `Verification:` / `Tests: pnpm test` / `Gaps: ...` block
  (bypass only when genuinely not applicable: `SKIP_TEST_GUARD=1 git commit ...`).
