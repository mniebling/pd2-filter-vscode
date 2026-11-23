# Project Diablo 2 Filter for VS Code

A minimal VS Code extension for Project Diablo 2 loot filters.

The initial `0.0.x` grammar intentionally highlights only `//` comments and leaves all other filter text unstyled.

## Current development setup

1. Open this folder in VS Code.
2. Press `F5` to launch an Extension Development Host.
3. Open a `.filter` file and select **PD2 Filter (Basic)** as its language mode.

The extension intentionally does not claim every `.filter` file because that extension is also used by other loot-filter tools. To associate only a PD2 filter in a workspace, add a path-specific association to `.vscode/settings.json`:

```json
{
  "files.associations": {
    "pd2/*.filter": "pd2filter-basic"
  }
}
```

Adjust the glob to match your repository layout. VS Code language associations can also be configured per file by selecting **PD2 Filter (Basic)** from the language-mode picker.

## Scope

- `//` comments are highlighted.
- Everything else is treated as plain text.
- Full PD2 filter tokenization is planned in `docs/pd2-grammar-plan.md`.


## Local packaging

Install dependencies, then run the repository's package script:

```sh
npm ci
npm run package
```

The script uses [`@vscode/vsce`](https://github.com/microsoft/vscode-vsce) to write a versioned `.vsix` such as `pd2-filter-0.0.1.vsix`.
Install that file through VS Code's **Extensions: Install from VSIX...** command.


## Testing

Run the grammar tests with:

```sh
npm test
```

The tests use [`vscode-textmate`](https://github.com/microsoft/vscode-textmate) to tokenize inline input with the same TextMate grammar that VS Code loads.
[`vscode-oniguruma`](https://github.com/microsoft/vscode-oniguruma) supplies the compatible regex engine to the test process.
