import { it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayScope = 'meta.rule.item-display.pd2filter'
const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const nameOutput = [
	{ text: ' ', scope: 'meta.output.item-display.pd2filter' },
	{ text: '%NAME%', scope: 'constant.other.value-reference.pd2filter' },
]
const comparisonOperatorScope = 'keyword.operator.comparison.pd2filter'
const integerScope = 'constant.numeric.integer.pd2filter'

it('scopes the rule structure and condition content', async () => {
	await expectScopes('ItemDisplay[GROUND DAMAGING_POTIONS CLVL>9]: %NAME%', [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		{ text: 'GROUND', scope: 'constant.language.condition-boolean.pd2filter' },
		{ text: ' DAMAGING_POTIONS ', scope: itemDisplayScope },
		{ text: 'CLVL', scope: 'support.function.condition-value.pd2filter' },
		{ text: '>', scope: comparisonOperatorScope },
		{ text: '9', scope: integerScope },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		{ text: ' ', scope: 'meta.output.item-display.pd2filter' },
		{ text: '%NAME%', scope: 'constant.other.value-reference.pd2filter' },
	])
})

it('scopes an empty condition wrapper', async () => {
	await expectScopes('ItemDisplay[]: %NAME%', [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		...nameOutput,
	])
})

it.each([
	['leading identifier', 'NotItemDisplay[MAG]: %NAME%'],
	['trailing identifier', 'ItemDisplay-ish[MAG]: %NAME%'],
])('does not scope a partial keyword with a %s', async (_, line) => {
	await expectScopes(line, [{ text: line }])
})
