# Project Diablo 2 Filter for VS Code

A VSCode syntax highlighter for Project Diablo 2 loot filters.

It highlights verified PD2 wrapper syntax, based on the [PD2 Wiki item filtering](https://wiki.projectdiablo2.com/wiki/Item_Filtering) reference.

The extension intentionally does not assign itself to every `.filter` file, because that extension is also used by other games' loot filters. You can configure whatever associations you prefer in `.vscode/settings.json`:

```jsonc
{
  "files.associations": {
    // All filter files:
    "*.filter": "pd2filter-basic",
    // Filter files in a certain folder:
    "**/pd2/*.filter": "pd2filter-basic"
  }
}
```

## Scope

The filter tries to handle all uppercase keywords and operators, but opts out of highlighting lowercase item codes.
There are a zillion of those item codes and they change with new PD2 seasons, so maintaining a grammar for all of them would be challenging.


## Local development

1. Open this folder in VS Code.
2. Run `npm run package` to produce a local `vsix` file.
3. In VSCode, choose `Extensions: Install from VSIX...` in the command palette and install the local extension.
4. Open a `.filter` file and select **PD2 Filter (Basic)** as its language mode.


To associate a single file, run `Change Language Mode` in the command palette and select **PD2 Filter (Basic)** from the picker.


## Testing

Run the grammar tests with:

```sh
npm test
```

The tests use [`vscode-textmate`](https://github.com/microsoft/vscode-textmate) to tokenize inline input with the same TextMate grammar that VS Code loads.
[`vscode-oniguruma`](https://github.com/microsoft/vscode-oniguruma) supplies the compatible regex engine to the test process.
