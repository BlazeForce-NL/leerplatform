# Contributing

## Purpose

Leerplatform is a game-based learning platform for primary school children.

Code, design, and content must stay aligned with the educational purpose and the target audience: children aged 6–12.

## Core Rules

- Keep all repository documentation and code comments in English.
- Prefer small, reviewable changes over large batches.
- Do not document future behavior as if it already exists.
- Treat accessibility, child safety, and performance as core engineering concerns.

## Definition of Done

A change is only done when all relevant items are complete:

- implementation is complete
- tests are added or updated when needed
- relevant automated tests have been run successfully
- code review concerns are addressed
- relevant documentation is updated
- the feature works correctly in the browser at the intended screen sizes

## Testing Expectations

- UI behavior changes should be verified in the browser before marking done
- Logic changes (game scoring, progression rules, content filtering) should have unit tests
- Auth and session changes must include positive and negative-path coverage

## Verification Rule

Before opening or merging a change:

- run the relevant automated tests for the affected scope
- verify the change in the browser
- include the verification performed in the pull request
- if a relevant test could not be run, say so explicitly and explain why

## Documentation Update Rule

If a change affects any of the following, update documentation in the same change:

- architecture or data model
- public component API or design token
- operational setup or deployment
- game rules or content structure

## Where Documentation Lives

- repository overview: `README.md`
- architecture and decisions: `docs/`
- component usage: colocated with the component

## Pull Request Expectations

Every pull request should:

- describe what changed
- explain why the change is needed
- identify testing or verification performed
- call out any remaining test gaps or known verification limits
- call out follow-up work if the implementation is intentionally partial

Use the pull request template in `.github/pull_request_template.md`.

## Line Ending Policy

This repository uses LF (`\n`) as the only allowed line ending on all platforms, including Windows.

Enforcement is automatic:

- **Editor** — `.editorconfig` configures LF by default.
- **Git** — `.gitattributes` normalizes all text files to LF on every commit.

**Windows developers:** your global `core.autocrlf=true` is overridden by `.gitattributes` for this repo.

## Local Commit Guards

This repository uses local Git hooks in `.githooks/`.

### Documentation guard

The pre-commit hook blocks code-impacting commits that stage no documentation update.

Bypass when genuinely no doc impact:

```bash
SKIP_DOC_GUARD=1 git commit ...
```

### Verification guard

The commit-msg hook requires code-impacting commits to include:

```text
Verification:
Tests: pnpm test
Gaps: None
```

Bypass when genuinely not applicable:

```bash
SKIP_TEST_GUARD=1 git commit ...
```

## Visual Design: Token-First Principle

All visual values must flow through the design token system defined in `src/app/globals.css`.

**Do not use:**

- Hardcoded hex colors in `className` strings
- Inline `style` props for colors, spacing, or shadows
- Arbitrary Tailwind bracket values for colors

**Use instead:**

- CSS custom property references: `text-[color:var(--color-*)]`
- Token utility classes defined in `globals.css`

## Accessibility

This platform is used by children. Accessibility is not optional:

- All interactive elements must be keyboard-accessible
- Color contrast must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Touch targets must be at minimum 44×44px
- Do not rely on color alone to convey meaning
