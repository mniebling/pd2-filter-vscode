import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const rootScope = 'source.pd2filter-basic'
const itemDisplayScope = 'meta.rule.item-display.pd2filter'
const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const logicalOperatorScope = 'keyword.operator.logical.pd2filter'
const parenScope = 'punctuation.section.parens.pd2filter'
const comparisonOperatorScope = 'keyword.operator.comparison.pd2filter'

describe('ItemDisplay', () => {
	it('scopes the rule structure and comparison operator', async () => {
		await expectScopes('ItemDisplay[GROUND DAMAGING_POTIONS CLVL>9]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'GROUND DAMAGING_POTIONS CLVL', scope: itemDisplayScope },
			{ text: '>', scope: comparisonOperatorScope },
			{ text: '9', scope: itemDisplayScope },
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

	describe('boolean syntax', () => {
		it.each(['AND', 'OR'])('scopes the %s operator', async (operator) => {
			await expectScopes(`ItemDisplay[MAG ${operator} RARE]: %NAME%`, [
				{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
				{ text: '[', scope: bracketScope },
				{ text: 'MAG ', scope: itemDisplayScope },
				{ text: operator, scope: logicalOperatorScope },
				{ text: ' RARE', scope: itemDisplayScope },
				{ text: ']', scope: bracketScope },
				{ text: ':', scope: colonScope },
				{ text: ' %NAME%' },
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
				{ text: ' %NAME%' },
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
	})

	describe('comparison syntax', () => {
		it.each(['>', '<', '=', '>=', '<=', '!=', '=='])(
			'scopes the %s operator',
			async (operator) => {
				await expectScopes(`ItemDisplay[CLVL${operator}30]: %NAME%`, [
					{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
					{ text: '[', scope: bracketScope },
					{ text: 'CLVL', scope: itemDisplayScope },
					{ text: operator, scope: comparisonOperatorScope },
					{ text: '30', scope: itemDisplayScope },
					{ text: ']', scope: bracketScope },
					{ text: ':', scope: colonScope },
					{ text: ' %NAME%' },
				])
			},
		)

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
				{ text: ' %NAME%' },
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
	})

	it.each([
		['leading identifier', 'NotItemDisplay[MAG]: %NAME%'],
		['trailing identifier', 'ItemDisplay-ish[MAG]: %NAME%'],
	])('does not scope a partial keyword with a %s', async (_, line) => {
		await expectScopes(line, [{ text: line }])
	})
})
