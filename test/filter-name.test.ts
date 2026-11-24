import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const filterNameKeywordScope = 'keyword.control.filter-name.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'

describe('ItemDisplayFilterName', () => {
	it('scopes only the wrapper', async () => {
		await expectScopes('ItemDisplayFilterName[]: My PD2 Filter', [
			{ text: 'ItemDisplayFilterName', scope: filterNameKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' My PD2 Filter' },
		])
	})

	it('scopes an empty filter name', async () => {
		await expectScopes('ItemDisplayFilterName[]:', [
			{ text: 'ItemDisplayFilterName', scope: filterNameKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
		])
	})

	it('does not scope partial keywords', async () => {
		for (const line of [
			'NotItemDisplayFilterName[]: My Filter',
			'ItemDisplayFilterName-ish[]: My Filter',
		]) {
			await expectScopes(line, [{ text: line }])
		}
	})

	it('does not match ItemDisplay inside the longer keyword', async () => {
		await expectScopes('ItemDisplayFilterName[]: My Filter', [
			{ text: 'ItemDisplayFilterName', scope: filterNameKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' My Filter' },
		])
	})
})
