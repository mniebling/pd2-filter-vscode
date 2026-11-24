import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { tokenizeFile } from './tokenize.js'

const fixtureUrl = new URL('./fixtures/corpus-smoke.filter', import.meta.url)

describe('representative filter corpus', () => {
	it('tokenizes a whole file with expected contextual scopes', async () => {
		const contents = await readFile(fixtureUrl, 'utf8')
		const lines = await tokenizeFile(contents)
		const scopedText = new Map<string, string[]>()

		for (const tokens of lines) {
			for (const { text, scopes } of tokens) {
				for (const scope of scopes) {
					const values = scopedText.get(scope) ?? []
					values.push(text)
					scopedText.set(scope, values)
				}
			}
		}

		expect(scopedText.get('comment.line.double-slash.pd2filter')).toContain('// Representative PD2 filter corpus for grammar regression smoke testing.')
		expect(scopedText.get('keyword.control.filter-name.pd2filter')).toContain('ItemDisplayFilterName')
		expect(scopedText.get('keyword.control.alias.pd2filter')).toEqual(['Alias', 'Alias'])
		expect(scopedText.get('entity.name.function.formula.pd2filter')).toContain('RES_TOTAL')
		expect(scopedText.get('constant.other.formula-reference.pd2filter')).toEqual(['FORMULA_RES_TOTAL', '%FORMULA_RES_TOTAL%'])
		expect(scopedText.get('keyword.control.notification.pd2filter')).toEqual(['%TIER-12%', '%MAP-9B%', '%SOUNDID-4714%'])
		expect(scopedText.get('keyword.control.output.pd2filter')).toContain('%CONTINUE%')
		expect(scopedText.get('meta.description.item-display.pd2filter')).toEqual(expect.arrayContaining(['{', 'Resist total: ', '}']))
		expect(scopedText.get('meta.output.item-display.pd2filter')).toEqual(expect.arrayContaining([' ', '%NAME%', ' Socket Me']))
		expect(scopedText.get('source.pd2filter-basic')).toContain('RWBASES')
	})
})
