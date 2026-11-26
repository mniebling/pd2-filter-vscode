import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadWASM, OnigScanner, OnigString } from 'vscode-oniguruma'
import { parseRawGrammar, Registry } from 'vscode-textmate'
import type { IRawGrammar, StateStack } from 'vscode-textmate'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const scopeName = 'source.pd2-filter'

// Reuse one initialized engine so the test suite exercises a stable grammar environment.
let registryPromise: Promise<Registry> | undefined

async function createRegistry(): Promise<Registry> {
	// Match VS Code's TextMate regex behavior rather than approximating it with native JavaScript regexes.
	const wasmPath = require.resolve('vscode-oniguruma/release/onig.wasm')
	await loadWASM(await readFile(wasmPath))

	return new Registry({
		onigLib: Promise.resolve({ createOnigScanner: (patterns) => new OnigScanner(patterns), createOnigString: (string) => new OnigString(string) }),
		loadGrammar: async (requestedScope) => {
			if (requestedScope !== scopeName) return null

			// Load the shipped grammar directly so tests cannot drift from extension behavior.
			const grammarPath = path.join(root, 'syntaxes/pd2-filter.tmLanguage.json')
			return parseRawGrammar(await fs.readFile(grammarPath, 'utf8'), grammarPath) as IRawGrammar
		},
	})
}

export async function tokenizeLine(line: string) {
	registryPromise ??= createRegistry()
	const registry = await registryPromise
	const grammar = await registry.loadGrammar(scopeName)
	if (!grammar) throw new Error(`Failed to load grammar ${scopeName}`)

	return grammar.tokenizeLine(line, null).tokens.map((token) => ({
		text: line.slice(token.startIndex, token.endIndex),
		scopes: token.scopes,
	}))
}

export async function tokenizeFile(contents: string) {
	registryPromise ??= createRegistry()
	const registry = await registryPromise
	const grammar = await registry.loadGrammar(scopeName)
	if (!grammar) throw new Error(`Failed to load grammar ${scopeName}`)

	let ruleStack: StateStack | null = null
	return contents.split('\n').map((line) => {
		const result = grammar.tokenizeLine(line, ruleStack)
		ruleStack = result.ruleStack
		return result.tokens.map((token) => ({
			text: line.slice(token.startIndex, token.endIndex),
			scopes: token.scopes,
		}))
	})
}

export interface ExpectedToken {
	text: string
	scope?: string
}

export async function expectScopes(line: string, expected: ExpectedToken[]) {
	const tokens = await tokenizeLine(line)
	const actual = tokens.map(({ text, scopes }) => ({ text, scope: scopes.at(-1) }))
	const normalizedExpected = expected.map(({ text, scope = scopeName }) => ({ text, scope }))

	if (JSON.stringify(actual) !== JSON.stringify(normalizedExpected)) {
		throw new Error(`Unexpected scopes for ${JSON.stringify(line)}\nExpected: ${JSON.stringify(normalizedExpected, null, 2)}\nActual: ${JSON.stringify(actual, null, 2)}`)
	}
}
