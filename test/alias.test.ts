import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const aliasScope = 'meta.rule.alias.pd2filter'
const aliasKeywordScope = 'keyword.control.alias.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'

describe('Alias', () => {
	it('scopes only the wrapper', async () => {
		await expectScopes('Alias[UTILITY_POTIONS]: (yps OR wms OR vps)', [
			{ text: 'Alias', scope: aliasKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'UTILITY_POTIONS', scope: aliasScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' (yps OR wms OR vps)' },
		])
	})

	it('scopes an empty name wrapper', async () => {
		await expectScopes('Alias[]: replacement', [
			{ text: 'Alias', scope: aliasKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' replacement' },
		])
	})

	it.each([
		['leading identifier', 'NotAlias[UTILITY]: replacement'],
		['trailing identifier', 'Alias-like[UTILITY]: replacement'],
	])('does not scope a partial keyword with a %s', async (_, line) => {
		await expectScopes(line, [{ text: line }])
	})
})
