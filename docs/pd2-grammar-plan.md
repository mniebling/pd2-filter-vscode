# PD2 Filter Grammar Plan

## Goal

Evolve this repository from a comments-only grammar into an accurate, maintainable syntax highlighter for Project Diablo 2 loot filters.

The grammar remains deliberately conservative: ambiguous text stays plain rather than receiving a misleading token type. PD2 syntax and code catalogs use the current Project Diablo 2 wiki as their source of truth, and no catalog refresh should be implied without recording its date.

## Development approach

- Implement one small syntax slice at a time with inline scope tests.
- Keep representative inputs readable in the unit tests.
- Use `examples/` for browsable examples that demonstrate current highlighting.
- Reserve `test/fixtures/` for tests that consume a whole or multi-line file.
- Prefer contextual grammar regions over global keyword lists.
- Require token boundaries and retain explicit false-positive tests.
- Keep syntax recognition separate from diagnostics and semantic validation.

## Completed milestones

### 0. Comments

- The `pd2filter-basic` language is contributed without globally claiming `.filter`.
- Full-line and inline `//` comments are highlighted.
- VS Code's toggle-line-comment behavior is configured.

### 1. Top-level structure

The following wrappers are recognized separately:

- `ItemDisplay[...]`: output
- `Alias[...]`: replacement
- `ItemDisplayFilterName[]:` name

Only rule names, brackets, and separators are styled. Names, conditions, replacements, and output remain plain where later slices have not added syntax.

### 2. Boolean conditions

Inside `ItemDisplay[...]` only:

- `AND`
- `OR`
- `!`
- Parentheses

Tests cover keyword boundaries, including `ORACLE` and `DAMAGING_POTIONS`, and verify these tokens remain plain in Alias replacements.

### 3. Comparison conditions

Inside `ItemDisplay[...]` only:

- `>`
- `<`
- `=`
- `>=`
- `<=`
- `!=`
- `==`
- `~`
- `+`

Tests cover longest-match behavior, separated `! =`, the documented BETWEEN form, arithmetic addition, every operator, and context isolation outside `ItemDisplay`.

### 4. Numeric condition values and ranges

Inside `ItemDisplay[...]` only:

- standalone unsigned integer literals;
- the documented `~` BETWEEN operator.

Digits embedded in identifiers remain plain, and range bounds retain ordinary integer scopes. PD2's `SOCKETS~1-2` form was verified against the Item Filtering wiki on 2026-11-24; the hyphen itself is intentionally not yet assigned a range-specific scope.

### 5. Test and package workflow

- Scope expectations use the shared `expectScopes` helper in `test/tokenize.ts`.
- Tests are organized by flat, feature-focused files, including `item-display-structure.test.ts`, `item-display-boolean.test.ts`, `item-display-comparison.test.ts`, `item-display-values.test.ts`, and `item-display-identifiers.test.ts` under `test/`.
- `examples/basic-structure.filter` demonstrates supported structure.
- Workspace settings associate this project's `.filter` files with `pd2filter-basic`.
- `npm run check` validates lint, types, and scope tests.
- `npm run package` creates a versioned VSIX for Extension Development Host or reinstall testing.

### 6. Condition-value research

The Item Filtering wiki's ordinary condition examples and code ranges document unsigned integer values. Decimal and signed literals appear only in the separate formula grammar, so they were not added to ordinary value conditions. Research was recorded on 2026-11-24.

### 7. Initial condition identifiers

Inside `ItemDisplay[...]` only, the following verified value-condition info codes are highlighted separately from arbitrary identifiers:

- `ALVL`, `CLVL`, `CRAFTALVL`, `REROLLALVL`
- `DIFF`, `FILTLVL`, `GEM`, `GEMLEVEL`, `GEMTYPE`
- `GOLD`, `ILVL`, `LVLREQ`, `PRICE`, `QLVL`, `QTY`
- `MAPID`, `MAPTIER`, `RUNE`, `SOCKETS`

Tests cover uppercase matching, token boundaries, lowercase text, embedded numeric identifiers, and isolation from Alias replacements. The deliberately small catalog was verified against the Item Filtering wiki on 2026-11-24.

## Handoff: current next action

Continue milestone 8 with a focused notification/action-keyword group; keep literal output text plain and do not combine unrelated output features.

After each slice, update the completed-milestone summary and keep `examples/basic-structure.filter` aligned with implemented behavior.

## Next slices

### 8. ItemDisplay output

Output references are highlighted inside `ItemDisplay` output only:

- `%NAME%`, `%BASENAME%`
- `%ALVL%`, `%CRAFTALVL%`, `%ILVL%`, `%REROLLALVL%`, `%LVLREQ%`
- `%QTY%`, `%RANGE%`, `%SOCKETS%`, `%MAXSOCKETS%`, `%WPNSPD%`
- `%PRICE%`, `%SELLPRICE%`, `%BUYPRICE%`
- `%RUNENUM%`, `%RUNENAME%`, `%GEMLEVEL%`, `%GEMTYPE%`, `%CODE%`
- base damage references: `%BASEMINONEH%`, `%BASEMAXONEH%`, `%BASEMINTWOH%`, `%BASEMAXTWOH%`, `%BASEMINTHROW%`, `%BASEMAXTHROW%`, `%BASEMINKICK%`, `%BASEMAXKICK%`, `%BASEMINSMITE%`, `%BASEMAXSMITE%`
- requirements/upgrades: `%REQDEX%`, `%REQSTR%`, `%REQLVL%`, `%UPDEX%`, `%UPSTR%`, `%UPLVL%`
- base properties: `%MAXRES%`, `%ALLATTRIB%`, `%BASEBLOCK%`, `%HEIGHT%`, `%WIDTH%`, `%AREA%`

Output color keywords are highlighted separately: `%WHITE%`, `%GRAY%`, `%BLUE%`, `%YELLOW%`, `%GOLD%`, `%GREEN%`, `%DARK_GREEN%`, `%TAN%`, `%BLACK%`, `%PURPLE%`, `%RED%`, `%ORANGE%`, `%CORAL%`, `%SAGE%`, `%TEAL%`, and `%LIGHT_GRAY%`.

Literal output remains plain, and unsupported or malformed percent references retain output text scopes. These references were verified against the Item Filtering wiki on 2026-11-24.

Continue output syntax in separate slices:

- notification/action keywords;
- `%CONTINUE%`, `%NL%`, and `%CL%`;
- descriptions in braces;
- formula interpolation if confirmed by the wiki.

Literal output text remains plain.

### 9. Aliases and formulas

- Determine whether alias references need a distinct scope inside condition/output contexts.
- Add `Formula[...]` structure separately.
- Add `$f(...)` and named formula references only after their grammar is verified.
- Keep alias and formula expansion semantic behavior out of the highlighter.

## Catalog strategy

Once enough contextual syntax exists to benefit:

- Maintain PD2 condition, item, and output catalogs as structured data.
- Generate large grammar alternatives instead of hand-editing giant regular expressions.
- Record the source URL and refresh date for every catalog update.
- Use current Project Diablo 2 wiki documentation as the source of truth.
- Do not claim that this extension is the canonical PD2 syntax specification.

The prior VS Code extension and public filters are useful for examples and migration ideas, but their old or broad keyword sets must not bypass wiki verification and boundary tests.

## Validation plan

- Continue inline TextMate scope tests for focused behavior.
- Add whole-file fixtures only when multi-line state or whole-file behavior matters.
- Verify every keyword boundary explicitly where substring matches are plausible.
- Add a bounded corpus smoke test using selected real filters.
- Validate copies locally rather than vendoring large or restrictively licensed filter files as fixtures.
- Package milestone builds with `@vscode/vsce`.
- Inspect scopes and rendering in a VS Code Extension Development Host.
- Test a real PD2 filter containing aliases, hide rules, `%CONTINUE%`, and item tags before a complete-grammar release.

## Security

Filter text remains data and is never evaluated as JavaScript or shell commands. Grammar patterns should stay simple and bounded to reduce regular-expression denial-of-service risk on long or crafted lines.

## Non-goals

- No semantic validation or diagnostics.
- No automatic proving that every item code or stat is current.
- No automatic editing of a user's PD2 installation.
- No auto-fixing rules that could silently change filter behavior.
- No global `.filter` association; other tools and games use that extension.
