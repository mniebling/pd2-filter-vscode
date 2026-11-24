import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const formulaKeywordScope = 'keyword.control.formula.pd2filter'
const formulaNameScope = 'entity.name.function.formula.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const formulaBodyScope = 'meta.definition.formula.pd2filter'
const formulaOperatorScope = 'keyword.operator.formula.pd2filter'
const formulaNumberScope = 'constant.numeric.formula.pd2filter'
const formulaDelimiterScope = 'punctuation.definition.formula.pd2filter'

describe('Formula', () => {
	it.each(['A', '_A', 'DAMAGE_TOTAL', '__'])('scopes the %s formula wrapper and key', async (key) => {
		await expectScopes(`Formula[${key}]: STAT1+STAT2`, [
			{ text: 'Formula', scope: formulaKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: key, scope: formulaNameScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' STAT1', scope: formulaBodyScope },
			{ text: '+', scope: formulaOperatorScope },
			{ text: 'STAT2', scope: formulaBodyScope },
		])
	})

	it('scopes formula expression punctuation and numbers in the definition body', async () => {
		await expectScopes('Formula[_A]: ROUND(STAT1+1.5, 0)', [
			{ text: 'Formula', scope: formulaKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: '_A', scope: formulaNameScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ROUND', scope: formulaBodyScope },
			{ text: '(', scope: formulaDelimiterScope },
			{ text: 'STAT1', scope: formulaBodyScope },
			{ text: '+', scope: formulaOperatorScope },
			{ text: '1.5', scope: formulaNumberScope },
			{ text: ',', scope: 'punctuation.separator.formula.pd2filter' },
			{ text: ' ', scope: formulaBodyScope },
			{ text: '0', scope: formulaNumberScope },
			{ text: ')', scope: formulaDelimiterScope },
		])
	})

	it('preserves comments after formula definitions', async () => {
		await expectScopes('Formula[TOTAL]: STAT1+STAT2 // note', [
			{ text: 'Formula', scope: formulaKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'TOTAL', scope: formulaNameScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' STAT1', scope: formulaBodyScope },
			{ text: '+', scope: formulaOperatorScope },
			{ text: 'STAT2 ', scope: formulaBodyScope },
			{ text: '// note', scope: 'comment.line.double-slash.pd2filter' },
		])
	})

	it.each(['A2', 'lower', 'A-B', ''])('keeps invalid formula key %s plain', async (key) => {
		await expectScopes(`Formula[${key}]: STAT1`, [{ text: `Formula[${key}]: STAT1` }])
	})

	it.each([
		['leading identifier', 'NotFormula[TOTAL]: STAT1'],
		['trailing identifier', 'Formula-ish[TOTAL]: STAT1'],
	])('does not scope a partial keyword with a %s', async (_, line) => {
		await expectScopes(line, [{ text: line }])
	})

	it('does not treat Formula text inside ItemDisplay conditions as a definition wrapper', async () => {
		await expectScopes('ItemDisplay[Formula]: %NAME%', [
			{ text: 'ItemDisplay', scope: 'keyword.control.item-display.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'Formula', scope: 'meta.rule.item-display.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: 'meta.output.item-display.pd2filter' },
			{ text: '%NAME%', scope: 'constant.other.value-reference.pd2filter' },
		])
	})

	it('uses the formula meta scope around the definition', async () => {
		await expectScopes('Formula[T]: 1', [
			{ text: 'Formula', scope: formulaKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'T', scope: formulaNameScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: formulaBodyScope },
			{ text: '1', scope: formulaNumberScope },
		])
	})
})
