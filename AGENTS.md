# Repository guidance

## Purpose

This repository provides a VS Code syntax-highlighting extension for Project Diablo 2 loot filters. The initial grammar is intentionally conservative: only `//` comments receive special scopes; all other filter content remains plain text until a complete, tested PD2 grammar is added.

## Editing workflow

- Add or update inline scope tests whenever grammar behavior changes. Keep short grammar inputs inline in unit tests so the text and expected scopes can be reviewed together.
- Use `test/fixtures/` only when the test must consume an entire file, such as multi-line state or whole-file regression cases. Do not hide small, representative lines in fixture files.
- Put browsable `.filter` samples and reference examples under `examples/`; these are intended to show what the extension supports rather than act as per-test data.
- Run `npm run check` after edits.
- Run `npm run package` when validating the extension artifact.
- Do not add a global `.filter` extension association: other tools and games also use that extension. Document path-scoped workspace associations instead.

## Grammar design

- Treat the Project Diablo 2 wiki as the source of truth for PD2 syntax and codes; record when catalog data is refreshed.
- Prefer contextual grammar regions over one global keyword list.
- Require token boundaries around keywords. Never tokenize substrings such as `MAG` in an alias, `SOCK` in `SOCKETS`, or `THROWING` in a longer identifier.

## Security and untrusted input

Consumers will open untrusted `.filter` files. The untrusted content follows this path during highlighting:

```text
filter text -> vscode-textmate -> vscode-oniguruma -> token scopes
```

Filter text must remain data and must never be evaluated as JavaScript or shell commands. The main realistic grammar risk is regular-expression denial of service from expensive matching on very long or crafted lines. Keep patterns simple, bounded, and independently testable.
