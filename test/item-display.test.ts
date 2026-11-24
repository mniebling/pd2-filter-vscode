import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const rootScope = 'source.pd2filter-basic'
const itemDisplayScope = 'meta.rule.item-display.pd2filter'
const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const logicalOperatorScope = 'keyword.operator.logical.pd2filter'
const parenScope = 'punctuation.section.parens.pd2filter'

describe('ItemDisplay', () => {
	it('scopes only the wrapper', async () => {
		await expectScopes('ItemDisplay[GROUND DAMAGING_POTIONS CLVL>9]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'GROUND DAMAGING_POTIONS CLVL>9', scope: itemDisplayScope },
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

	it('scopes boolean operators and grouping parentheses', async () => {
		await expectScopes('ItemDisplay[(MAG OR RARE) AND !ID]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: '(', scope: parenScope },
			{ text: 'MAG ', scope: itemDisplayScope },
			{ text: 'OR', scope: logicalOperatorScope },
			{ text: ' RARE', scope: itemDisplayScope },
			{ text: ')', scope: parenScope },
			{ text: ' ', scope: itemDisplayScope },
			{ text: 'AND', scope: logicalOperatorScope },
			{ text: ' ', scope: itemDisplayScope },
			{ text: '!', scope: logicalOperatorScope },
			{ text: 'ID', scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' %NAME%' },
		])
	})

	it('requires token boundaries around boolean keywords', async () => {
		await expectScopes('ItemDisplay[ORACLE DAMAGING_POTIONS]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'ORACLE DAMAGING_POTIONS', scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' %NAME%' },
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

	it('does not scope partial keywords', async () => {
		for (const line of [
			'NotItemDisplay[MAG]: %NAME%',
			'ItemDisplay-ish[MAG]: %NAME%',
		]) {
			await expectScopes(line, [{ text: line }])
		}
	})
})
