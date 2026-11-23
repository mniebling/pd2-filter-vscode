# PD2 Filter Grammar Plan

## Goal

Evolve this repository from a comments-only grammar into an accurate, maintainable syntax highlighter for Project Diablo 2 loot filters.

The initial grammar must remain deliberately conservative: ambiguous text stays plain rather than receiving a misleading token type.

## Current phase: comments only

- Contribute the `pd2filter-basic` language without claiming the shared `.filter` extension globally.
- Document path-scoped `files.associations` so projects can opt in only their PD2 files.
- Highlight only `//` through the end of the line.
- Treat rule names, aliases, condition codes, operators, values, output keywords, and plain output text as text.
- Support VS Code's toggle-line-comment behavior.

## Planned phases

### 1. Capture examples and expected scopes

Build a representative fixture suite before adding token rules. Cover:

- `ItemDisplay[conditions]: output`
- `Alias[name]: replacement`
- `ItemDisplayFilterName[]:`
- Comments, including inline comments
- `AND`, `OR`, `!`, comparisons, and `~` ranges
- Parenthesized boolean groups
- `%NAME%` and other value references
- Color and notification keywords
- `%CONTINUE%`, `%NL%`, and descriptions in braces
- Formula syntax once its scope is understood

Store each sample with an expected scope description so grammar regressions are visible.

### 2. Establish token boundaries

All keyword matches must require a token boundary. In particular, never tokenize `MAG` inside an alias such as `DAMAGING_POTIONS`, `SOCK` inside `SOCKETS`, or `THROWING` inside a longer identifier.

Prefer context-specific grammar regions over one global keyword list.

### 3. Parse line structure first

Recognize these top-level forms separately:

- `Alias[...]`: replacement
- `ItemDisplay[...]`: output
- `ItemDisplayFilterName[]:` output
- Comment-only lines

Within `ItemDisplay` conditions, distinguish operators, condition codes, item codes, numbers, identifiers, and aliases. Within output, distinguish output keywords, literal text, descriptions, and comments.

### 4. Keep the code catalog external to the grammar

Maintain PD2 item/condition/output code lists as structured data once the language becomes rich enough to benefit. Generate grammar fragments from that data where practical instead of hand-editing repeated giant regular expressions.

Do not treat this repository as the canonical PD2 syntax specification. Use the current Project Diablo 2 wiki as the source of truth and record the documentation date when updating code lists.

## Working documentation

This repository intentionally does not use `.agents` for the implementation plan. The future grammar workflow, research notes, and test expectations live under `docs/` and alongside tests.

If agent-specific instructions are added later, keep detailed product and syntax documentation in `docs/` and make any skill reference it rather than duplicating it.

## Validation plan

- Add fixture-driven TextMate scope tests.
- Verify keyword-boundary cases explicitly.
- Package the extension with `@vscode/vsce`.
- Manually test in a VS Code Extension Development Host.
- Test with a real PD2 filter containing aliases, hide rules, `%CONTINUE%`, and item tags.

## Non-goals for the initial release

- No semantic validation or diagnostics.
- No attempt to prove that every item code or stat is current.
- No automatic editing of a user's PD2 installation.
- No auto-fixing rules that could silently change filter behavior.
