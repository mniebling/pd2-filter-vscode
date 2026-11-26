import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const outputScope = 'meta.output.item-display.pd2filter'
const formulaScope = 'meta.formula.inline.pd2filter'
const formulaDelimiterScope = 'punctuation.definition.formula.pd2filter'
const operatorScope = 'keyword.operator.formula.pd2filter'
const numberScope = 'constant.numeric.formula.pd2filter'
const separatorScope = 'punctuation.separator.formula.pd2filter'
const formulaReferenceScope = 'constant.other.formula-reference.pd2filter'

describe('ItemDisplay formula output', () => {
	it.each(['A', '_A', 'DAMAGE_TOTAL', '__'])('scopes named formula reference %s', async (key) => {
		await expectScopes(`ItemDisplay[]: %FORMULA_${key}%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: `%FORMULA_${key}%`, scope: formulaReferenceScope },
		])
	})

	it('scopes a simple inline formula', async () => {
		await expectScopes('ItemDisplay[]: $f(STAT1+STAT2)', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: '$f(', scope: formulaDelimiterScope },
			{ text: 'STAT1', scope: formulaScope },
			{ text: '+', scope: operatorScope },
			{ text: 'STAT2', scope: formulaScope },
			{ text: ')', scope: formulaDelimiterScope },
		])
	})

	it('scopes nested calls, decimals, operators, and separators', async () => {
		await expectScopes('ItemDisplay[]: $f(MAX((STAT1+1.5)/2, 0))', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: '$f(', scope: formulaDelimiterScope },
			{ text: 'MAX', scope: formulaScope },
			{ text: '(', scope: formulaDelimiterScope },
			{ text: '(', scope: formulaDelimiterScope },
			{ text: 'STAT1', scope: formulaScope },
			{ text: '+', scope: operatorScope },
			{ text: '1.5', scope: numberScope },
			{ text: ')', scope: formulaDelimiterScope },
			{ text: '/', scope: operatorScope },
			{ text: '2', scope: numberScope },
			{ text: ',', scope: separatorScope },
			{ text: ' ', scope: formulaScope },
			{ text: '0', scope: numberScope },
			{ text: ')', scope: formulaDelimiterScope },
			{ text: ')', scope: formulaDelimiterScope },
		])
	})

	it.each([
		'%FORMULA_%',
		'%FORMULA_A2%',
		'%FORMULA_lower%',
		'%FORMULA-A%',
		'$F(STAT1+STAT2)',
		'$f(STAT1+STAT2',
		'$formula(STAT1)',
	])('keeps unsupported formula syntax plain: %s', async (formula) => {
		await expectScopes(`ItemDisplay[]: ${formula}`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ` ${formula}`, scope: outputScope },
		])
	})

	it('does not scope formula output outside ItemDisplay', async () => {
		await expectScopes('Alias[FORMULA_DISPLAY]: $f(STAT1+STAT2) %FORMULA_A%', [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'FORMULA_DISPLAY', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' $f(STAT1+STAT2) %FORMULA_A%' },
		])
	})
})
