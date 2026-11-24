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
const comparisonOperatorScope = 'keyword.operator.comparison.pd2filter'
const integerScope = 'constant.numeric.integer.pd2filter'
const valueConditionScope = 'support.function.condition-value.pd2filter'

it.each(['>', '<', '=', '>=', '<=', '!=', '=='])(
	'scopes the %s operator',
	async (operator) => {
		await expectScopes(`ItemDisplay[CLVL${operator}30]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'CLVL', scope: valueConditionScope },
			{ text: operator, scope: comparisonOperatorScope },
			{ text: '30', scope: integerScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	},
)

it('scopes the BETWEEN range operator', async () => {
	await expectScopes('ItemDisplay[SOCKETS~1-2]: %NAME%', [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		{ text: 'SOCKETS', scope: valueConditionScope },
		{ text: '~', scope: comparisonOperatorScope },
		{ text: '1', scope: integerScope },
		{ text: '-', scope: itemDisplayScope },
		{ text: '2', scope: integerScope },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		...nameOutput,
	])
})

it('does not combine separated comparison characters', async () => {
	await expectScopes('ItemDisplay[! =MAG]: %NAME%', [
		{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
		{ text: '[', scope: bracketScope },
		{ text: '!', scope: logicalOperatorScope },
		{ text: ' ', scope: itemDisplayScope },
		{ text: '=', scope: comparisonOperatorScope },
		{ text: 'MAG', scope: itemDisplayScope },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		...nameOutput,
	])
})

it('does not scope range syntax outside ItemDisplay', async () => {
	await expectScopes('Alias[SOCKET_RANGE]: SOCKETS~1-2', [
		{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
		{ text: '[', scope: bracketScope },
		{ text: 'SOCKET_RANGE', scope: 'meta.rule.alias.pd2filter' },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		{ text: ' SOCKETS~1-2' },
	])
})

it('does not scope comparison syntax outside ItemDisplay', async () => {
	await expectScopes('Alias[HIGH_LEVEL]: CLVL>=30', [
		{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
		{ text: '[', scope: bracketScope },
		{ text: 'HIGH_LEVEL', scope: 'meta.rule.alias.pd2filter' },
		{ text: ']', scope: bracketScope },
		{ text: ':', scope: colonScope },
		{ text: ' CLVL>=30' },
	])
})
