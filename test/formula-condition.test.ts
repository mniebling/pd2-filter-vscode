import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayScope = 'meta.rule.item-display.pd2filter'
const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const formulaReferenceScope = 'constant.other.formula-reference.pd2filter'
const comparisonOperatorScope = 'keyword.operator.comparison.pd2filter'
const integerScope = 'constant.numeric.integer.pd2filter'
const nameOutput = [
	{ text: ' ', scope: 'meta.output.item-display.pd2filter' },
	{ text: '%NAME%', scope: 'constant.other.value-reference.pd2filter' },
]

describe('ItemDisplay formula conditions', () => {
	it.each(['A', '_A', 'DAMAGE_TOTAL', '__'])('scopes bare formula reference %s', async (key) => {
		await expectScopes(`ItemDisplay[FORMULA_${key}>1]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: `FORMULA_${key}`, scope: formulaReferenceScope },
			{ text: '>', scope: comparisonOperatorScope },
			{ text: '1', scope: integerScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it('requires uppercase F but allows the rest of an input reference to vary in case', async () => {
		await expectScopes('ItemDisplay[Formula_damage_total]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'Formula_damage_total', scope: formulaReferenceScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it('does not scope output-style percent references as condition references', async () => {
		await expectScopes('ItemDisplay[%FORMULA_A%>1]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: '%FORMULA_A%', scope: itemDisplayScope },
			{ text: '>', scope: comparisonOperatorScope },
			{ text: '1', scope: integerScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it.each([
		'formula_a',
		'FORMULA_',
		'FORMULA_A2',
		'FORMULA-A',
		'2FORMULA_A',
	])('does not scope malformed or longer condition reference %s', async (reference) => {
		await expectScopes(`ItemDisplay[${reference}]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: reference, scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})
})
