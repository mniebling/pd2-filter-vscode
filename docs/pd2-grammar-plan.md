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
- `Formula[...]`: named formula definition

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
- Tests are organized by flat, feature-focused files.
- `examples/supported-syntax.filter` demonstrates supported syntax.
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

## Completed output and formula milestones

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

Map notification keywords are highlighted separately. `%BORDER%`, `%MAP%`, `%DOT%`, and `%PX%` accept a two-digit hexadecimal color suffix; `%MAP%` also works without a suffix.

Additional notification keywords support `%SOUNDID-#%` with a decimal sound index, `%NOTIFY-0%` through `%NOTIFY-F%` plus `%NOTIFY-DEAD%`, and `%TIER-0%` through `%TIER-12%`.

Parameterless special output controls `%CONTINUE%`, `%NL%`, `%CL%`, and `%CS%` are highlighted separately.

Balanced item-description braces are highlighted as structural punctuation with a description meta-scope. Output keywords continue to highlight inside descriptions; literal description text remains plain. `%CONTINUE%` is recognized syntactically inside braces but, per the wiki, only functions outside them. These forms were verified against the Item Filtering wiki on 2026-11-24.

ItemDisplay output recognizes balanced inline `$f(...)` formulas and named `%FORMULA_[A-Z_]+%` references. Inline delimiters, documented operators, numbers, and argument separators receive structural scopes; expression identifiers remain plain, and this does not perform semantic formula validation.

Literal output remains plain, and unsupported or malformed percent references retain output text scopes. These references were verified against the Item Filtering wiki on 2026-11-24.

### 9. Formula definitions and references

- `Formula[KEY]: expression` wrappers are recognized for non-empty keys containing only `A-Z` or `_`.
- Formula names, wrapper punctuation, expression operators, decimals, parentheses, commas, and inline comments are highlighted structurally.
- `$f(...)` and `%FORMULA_KEY%` references are recognized in ItemDisplay output and remain contextual.
- Bare formula references are recognized inside ItemDisplay conditions. Input references require uppercase `F`; the remaining letters are case-insensitive. Percent-wrapped references remain output-only.
- Alias and formula expansion semantics remain outside the highlighter.

## Completed corpus milestone

### 10. Alias research and whole-file smoke coverage

Aliases are simple find-and-replace directives and may be defined anywhere in a filter. Bare condition aliases cannot be distinguished from arbitrary item or condition identifiers without whole-file symbol tracking, while `%ALIAS%` output uses cannot be distinguished from `%KEYWORD%` references by local syntax alone. Alias names and replacements therefore remain contextual rule text; no alias-reference scope is assigned.

A bounded synthetic corpus fixture exercises a full file containing aliases, formulas, descriptions, output aliases, `%CONTINUE%`, notifications, and final fallback rules. The smoke test verifies grammar state and representative scopes without replacing focused inline scope tests. Alias behavior was verified against the Item Filtering wiki on 2026-11-24.

### 11. Initial Boolean item conditions

Inside `ItemDisplay[...]` only, verified rarity, tier, and item-property Boolean conditions are highlighted separately from arbitrary identifiers:

- `NMAG`, `MAG`, `RARE`, `UNI`, `SET`, `CRAFT`
- `NORM`, `EXC`, `ELT`
- `ID`, `INF`, `SUP`, `ETH`, `RW`, `GEMMED`

Tests cover uppercase matching, identifier boundaries, longer identifiers, and isolation from Alias replacements. These codes were verified against the Item Filtering wiki on 2026-11-24.

### 12. Mutable Boolean item conditions

The Boolean item-condition list also recognizes verified mutable character, location, and discovery/ownership conditions:

- `AMAZON`, `ASSASSIN`, `BARBARIAN`, `DRUID`, `NECROMANCER`, `PALADIN`, `SORCERESS`
- `SHOP`, `EQUIPPED`, `MERC`, `INVENTORY`, `CUBE`, `STASH`, `GROUND`
- `ANYDISCOVERED`, `ALLDISCOVERED`, `ANYOWNED`, `ALLOWNED`

Matching remains uppercase-only, token-bounded, and contextual to `ItemDisplay[...]`. The wiki's documented `ALLOWNED` spelling is retained verbatim. Tests cover exact matches, mixed case, longer identifiers, and isolation from Alias replacements. These codes were verified against the Item Filtering wiki on 2026-11-24.

### 13. Miscellaneous item groups

The Boolean item-condition list recognizes the verified miscellaneous item groups:

- `JEWELRY`
- `CHARM`
- `QUIVER`
- `MISC`

Tests cover exact matches, mixed case, longer identifiers, and isolation from Alias replacements. These codes were verified against the Item Filtering wiki on 2026-11-24.

### 14. Armor item groups

The Boolean item-condition list recognizes the verified armor group aliases and aggregate:

- `EQ1`/`HELM`, `EQ2`/`CHEST`, `EQ3`/`SHIELD`
- `EQ4`/`GLOVES`, `EQ5`/`BOOTS`, `EQ6`/`BELT`, `EQ7`/`CIRC`
- `ARMOR`

Tests cover exact matches, mixed case, longer identifiers, numeric suffix boundaries, and isolation from Alias replacements. These codes were verified against the Item Filtering wiki on 2026-11-24.

### 15. Weapon item groups

The Boolean item-condition list recognizes the verified weapon group aliases, aggregate, handedness groups, and subtype groups:

- `WP1`/`AXE` through `WP13`/`SCEPTER`
- `WEAPON`, `1H`, `2H`
- `CLUB`, `TMACE`, `HAMMER`

Tests cover exact matches, mixed case, longer identifiers, numeric suffix boundaries, and isolation from Alias replacements. These codes were verified against the Item Filtering wiki on 2026-11-24.

### 16. Class-restricted item groups

The Boolean item-condition list recognizes the verified class-restricted item group aliases and aggregate:

- `CL1`/`DRU`, `CL2`/`BAR`, `CL3`/`DIN`, `CL4`/`NEC`
- `CL5`/`SIN`, `CL6`/`SOR`, `CL7`/`ZON`
- `CLASS`

Tests cover exact matches, mixed case, longer identifiers, numeric suffix boundaries, and isolation from Alias replacements. These codes were verified against the Item Filtering wiki on 2026-11-24.

### 17. Lowercase item-code policy

Lowercase item codes are intentionally not cataloged or validated by the highlighter. They remain plain condition text, including runes, gems, armor and weapon bases, quest items, maps, and PD2-specific items.

This avoids a large, season-sensitive catalog that cannot be distinguished reliably from arbitrary aliases or custom identifiers using local syntax. Scope tests assert that representative lowercase item codes remain plain. Users should verify item-code validity against current PD2 documentation rather than infer it from highlighting.

Uppercase Boolean group aliases remain highlighted because they are stable syntax-level keywords rather than individual item codes.

### 18. Named value-condition shortcuts

Inside `ItemDisplay[...]`, the documented arithmetic shortcut codes are highlighted as value conditions:

- `STR`, `DEX`, `LIFE`, `MANA`
- `FRES`, `CRES`, `LRES`, `PRES`
- `EDEF`, `EDAM`, `FCR`, `AR`, `REPLIFE`

Tests cover exact matches, arithmetic expressions, lowercase text, longer identifiers, and context isolation. These codes were verified against the Item Filtering wiki on 2026-11-24.

### 19. Core named attribute conditions

The named value-condition list recognizes the verified core equipment attributes:

- `SOCK`, `DEF`, `ED`, `MAXDUR`, `RES`
- `FRW`, `IAS`, `FHR`, `FBR`
- `MINDMG`, `MAXDMG`

`SOCK` is recognized alongside the existing `SOCKETS` name. Tests cover exact matches, arithmetic use, lowercase text, longer identifiers, and context isolation. These codes were verified against the Item Filtering wiki on 2026-11-24.

### 20. Utility named attribute conditions

The named value-condition list recognizes the remaining non-Boolean utility attributes:

- `MFIND`, `GFIND`
- `MAEK`, `DTM`, `REPAIR`, `ARPER`

Tests cover exact matches, arithmetic use, lowercase text, longer identifiers, and context isolation. `FOOLS` remains a separate Boolean-condition candidate because the wiki documents it as a Boolean condition. These codes were verified against the Item Filtering wiki on 2026-11-24.

### 21. Fool's modifier Boolean condition

The named-attribute table's `FOOLS` entry is highlighted as a Boolean item condition, matching the wiki's documented Boolean classification. Tests cover exact matches, mixed case, longer identifiers, and isolation from Alias replacements. This code was verified against the Item Filtering wiki on 2026-11-24.

### 22. Numbered value-condition syntax

Inside `ItemDisplay[...]`, `STAT` and `CHARSTAT` followed by one or more decimal digits are highlighted as value conditions.

The wiki's numbered IDs are sparse and season-sensitive, so the grammar recognizes their syntax without validating whether a particular numeric ID currently exists. Tests cover representative documented IDs, arbitrary numeric forms, lowercase text, malformed suffixes, and context isolation. This form was verified against the Item Filtering wiki on 2026-11-24.

### 23. Multi-layered and skill value-condition syntax

Inside `ItemDisplay[...]`, the following patterned forms are highlighted as value conditions without validating semantic IDs:

- `MULTI<number>,<number>`
- `CLSK<number>`, `OS<number>`, `SK<number>`, `TABSK<number>`
- `ALLSK`

The complete `MULTI` parameter form receives the value-condition scope, including its comma and layer number. Tests cover representative wiki examples, arbitrary numeric IDs, lowercase text, malformed forms, longer identifiers, and context isolation. These forms were verified against the Item Filtering wiki on 2026-11-24.

## Handoff: current next action

Continue with remaining upper-case value-condition syntax, beginning with special ID forms such as prefixes and numeric ranges, then review output-reference coverage.

After each slice, update the completed-milestone summary and keep `examples/supported-syntax.filter` aligned with implemented behavior.

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
