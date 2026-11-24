import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const commentScope = 'comment.line.double-slash.pd2filter'
const rootScope = 'source.pd2filter-basic'
const itemDisplayScope = 'meta.rule.item-display.pd2filter'
const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'

describe('pd2filter-basic grammar', () => {
	it('scopes only the ItemDisplay wrapper', async () => {
		await expectScopes('ItemDisplay[GROUND DAMAGING_POTIONS CLVL>9]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'GROUND DAMAGING_POTIONS CLVL>9', scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' %NAME%', scope: rootScope },
		])
	})

	it('scopes an empty ItemDisplay condition wrapper', async () => {
		await expectScopes('ItemDisplay[]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' %NAME%' },
		])
	})

	it('does not scope partial ItemDisplay keywords', async () => {
		for (const line of [
			'NotItemDisplay[MAG]: %NAME%',
			'ItemDisplay-ish[MAG]: %NAME%',
		]) {
			await expectScopes(line, [{ text: line }])
		}
	})

	it('scopes a full-line comment', async () => {
		await expectScopes('// Hide utility potions at level 30', [
			{ text: '// Hide utility potions at level 30', scope: commentScope },
		])
	})

	it('preserves inline comments after an ItemDisplay rule', async () => {
		await expectScopes('ItemDisplay[MAG]: %NAME% // keep visible', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'MAG', scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' %NAME% ' },
			{ text: '// keep visible', scope: commentScope },
		])
	})

	it('leaves aliases unstyled for this slice', async () => {
		await expectScopes('Alias[UTILITY_POTIONS]: (yps OR wms OR vps)', [
			{ text: 'Alias[UTILITY_POTIONS]: (yps OR wms OR vps)' },
		])
	})
})
