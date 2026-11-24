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
const logicalOperatorScope = 'keyword.operator.logical.pd2filter'
const parenScope = 'punctuation.section.parens.pd2filter'

it.each(['AND', 'OR'])('scopes the %s operator', async (operator) => {
	await expectScopes(`ItemDisplay[MAG ${operator} RARE]: %NAME%`, [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		{ text: 'MAG ', scope: itemDisplayScope },
		{ text: operator, scope: logicalOperatorScope },
		{ text: ' RARE', scope: itemDisplayScope },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		...nameOutput,
	])
})

it('scopes logical negation', async () => {
	await expectScopes('ItemDisplay[!ID]: %NAME%', [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		{ text: '!', scope: logicalOperatorScope },
		{ text: 'ID', scope: itemDisplayScope },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		...nameOutput,
	])
})

it.each(['(', ')'])('scopes the %s grouping parenthesis', async (paren) => {
	const condition = paren === '(' ? '(MAG' : 'MAG)'
	const expectedCondition = paren === '('
		? [
			{ text: '(', scope: parenScope },
			{ text: 'MAG', scope: itemDisplayScope },
		]
		: [
			{ text: 'MAG', scope: itemDisplayScope },
			{ text: ')', scope: parenScope },
		]

	await expectScopes(`ItemDisplay[${condition}]: %NAME%`, [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		...expectedCondition,
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		...nameOutput,
	])
})

it('requires token boundaries around boolean keywords', async () => {
	await expectScopes('ItemDisplay[ORACLE DAMAGING_POTIONS]: %NAME%', [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		{ text: 'ORACLE DAMAGING_POTIONS', scope: itemDisplayScope },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		...nameOutput,
	])
})

it('does not scope boolean syntax outside ItemDisplay', async () => {
	await expectScopes('Alias[VISIBLE]: (MAG OR RARE) !ID', [
		{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
		{ text: '[', scope: bracketScope },
		{ text: 'VISIBLE', scope: 'meta.rule.alias.pd2filter' },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		{ text: ' (MAG OR RARE) !ID' },
	])
})
