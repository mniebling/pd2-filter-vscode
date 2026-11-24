import { it } from 'vitest'
import { expectScopes } from './tokenize.js'

const rootScope = 'source.pd2filter-basic'
const itemDisplayScope = 'meta.rule.item-display.pd2filter'
const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const comparisonOperatorScope = 'keyword.operator.comparison.pd2filter'
const integerScope = 'constant.numeric.integer.pd2filter'

it('scopes the rule structure and condition content', async () => {
	await expectScopes('ItemDisplay[GROUND DAMAGING_POTIONS CLVL>9]: %NAME%', [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		{ text: 'GROUND DAMAGING_POTIONS CLVL', scope: itemDisplayScope },
		{ text: '>', scope: comparisonOperatorScope },
		{ text: '9', scope: integerScope },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		{ text: ' %NAME%', scope: rootScope },
	])
})

it('scopes an empty condition wrapper', async () => {
	await expectScopes('ItemDisplay[]: %NAME%', [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		{ text: ' %NAME%' },
	])
})

it.each([
	['leading identifier', 'NotItemDisplay[MAG]: %NAME%'],
	['trailing identifier', 'ItemDisplay-ish[MAG]: %NAME%'],
])('does not scope a partial keyword with a %s', async (_, line) => {
	await expectScopes(line, [{ text: line }])
})
