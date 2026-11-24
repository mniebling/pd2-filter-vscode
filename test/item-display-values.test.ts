import { describe, it } from 'vitest'
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
const arithmeticOperatorScope = 'keyword.operator.arithmetic.pd2filter'
const integerScope = 'constant.numeric.integer.pd2filter'
const booleanScope = 'constant.language.boolean.pd2filter'
const valueConditionScope = 'support.function.condition-value.pd2filter'

describe('arithmetic syntax', () => {
	it('scopes addition inside ItemDisplay conditions', async () => {
		await expectScopes('ItemDisplay[FRES+CRES+LRES+PRES>79]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'FRES', scope: itemDisplayScope },
			{ text: '+', scope: arithmeticOperatorScope },
			{ text: 'CRES', scope: itemDisplayScope },
			{ text: '+', scope: arithmeticOperatorScope },
			{ text: 'LRES', scope: itemDisplayScope },
			{ text: '+', scope: arithmeticOperatorScope },
			{ text: 'PRES', scope: itemDisplayScope },
			{ text: '>', scope: comparisonOperatorScope },
			{ text: '79', scope: integerScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it('does not scope addition in an Alias replacement', async () => {
		await expectScopes('Alias[RES_TOTAL]: FRES+CRES', [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'RES_TOTAL', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' FRES+CRES' },
		])
	})

	it('does not scope addition in ItemDisplay output', async () => {
		await expectScopes('ItemDisplay[RARE]: +%NAME%+', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'RARE', scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' +', scope: 'meta.output.item-display.pd2filter' },
			{ text: '%NAME%', scope: 'constant.other.value-reference.pd2filter' },
			{ text: '+', scope: 'meta.output.item-display.pd2filter' },
		])
	})
})

describe('boolean values', () => {
	it.each(['TRUE', 'FALSE'])('scopes the %s value', async (value) => {
		await expectScopes(`ItemDisplay[${value}]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: value, scope: booleanScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it.each([
		['lowercase true', 'true'],
		['lowercase false', 'false'],
		['TRUE in a longer identifier', 'TRUEISH'],
		['FALSE in a longer identifier', 'FALSEHOOD'],
	])('%s is not scoped', async (_, value) => {
		await expectScopes(`ItemDisplay[${value}]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: value, scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it('does not scope boolean constants outside ItemDisplay', async () => {
		await expectScopes('Alias[ENABLED]: TRUE', [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'ENABLED', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' TRUE' },
		])
	})
})

describe('integer values', () => {
	it.each(['0', '9', '30', '5000'])('scopes the unsigned integer %s', async (integer) => {
		await expectScopes(`ItemDisplay[CLVL>${integer}]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'CLVL', scope: valueConditionScope },
			{ text: '>', scope: comparisonOperatorScope },
			{ text: integer, scope: integerScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it.each(['ITEM2', 'SKILL30', '2POTIONS'])('does not scope digits inside identifier %s', async (identifier) => {
		await expectScopes(`ItemDisplay[${identifier}]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: identifier, scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it('does not scope integers outside ItemDisplay', async () => {
		await expectScopes('Alias[UTILITY]: CLVL>30', [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'UTILITY', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' CLVL>30' },
		])
	})
})
