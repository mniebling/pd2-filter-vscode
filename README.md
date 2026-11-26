# Project Diablo 2 Loot Filter for VS Code

A VSCode syntax highlighter for Project Diablo 2 loot filters.

It highlights verified PD2 wrapper syntax, based on the [PD2 Wiki item filtering](https://wiki.projectdiablo2.com/wiki/Item_Filtering) reference.

The extension doesn’t automatically take over `.filter` files because other games use that extension too. To enable highlighting automatically, choose one of these examples for your workspace’s `.vscode/settings.json`.

**Only in a `pd2` folder** (recommended for mixed workspaces):

```json
{
  "files.associations": {
    "**/pd2/*.filter": "pd2-filter"
  }
}
```

**Every `.filter` file in this workspace** (if they’re all PD2 filters):

```json
{
  "files.associations": {
    "*.filter": "pd2-filter"
  }
}
```

To associate a single file, run `Change Language Mode` in the command palette and select **Project Diablo 2 Loot Filter** from the picker.


## Scope

The extension highlights PD2 rule headers and comments, common conditions and operators, and output syntax such as value placeholders, colors, notifications, and item descriptions. Formula highlighting is partial.

Lowercase item codes are intentionally left unhighlighted. The extension doesn’t validate filters or evaluate rules.

[Browse the syntax examples](https://github.com/mniebling/pd2-filter-vscode/blob/main/examples/supported-syntax.filter).


## Local development

From a fresh checkout, use the Node.js version specified in `.node-version` and run `npm ci` from the repository root before building or testing.

1. Open this folder in VS Code.
2. In **Run and Debug**, select **Run Extension** and start debugging. This opens a separate Extension Development Host window with the local extension loaded.
3. In that window, open a PD2 `.filter` file. If needed, run **Change Language Mode** from the Command Palette and select **Project Diablo 2 Loot Filter**.

To test an installable build instead, run `npm run package`, then use **Extensions: Install from VSIX...** in the Command Palette to install the generated `.vsix` file.


## Testing

Run the grammar tests with:

```sh
npm test
```

Run `npm run check` to run linting, type checking, and the grammar tests together.

The tests use [`vscode-textmate`](https://github.com/microsoft/vscode-textmate) to tokenize inline input with the same TextMate grammar that VS Code loads.
[`vscode-oniguruma`](https://github.com/microsoft/vscode-oniguruma) supplies the compatible regex engine to the test process.
