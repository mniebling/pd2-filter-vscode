import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const commentScope = 'comment.line.double-slash.pd2filter'
const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const aliasKeywordScope = 'keyword.control.alias.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'

describe('comments', () => {
	it('scopes a full-line comment', async () => {
		await expectScopes('// Hide utility potions at level 30', [
			{ text: '// Hide utility potions at level 30', scope: commentScope },
		])
	})

	it('preserves inline comments after an ItemDisplay rule', async () => {
		await expectScopes('ItemDisplay[MAG]: %NAME% // keep visible', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'MAG', scope: 'constant.language.condition-boolean.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: 'meta.output.item-display.pd2filter' },
			{ text: '%NAME%', scope: 'constant.other.value-reference.pd2filter' },
			{ text: ' ', scope: 'meta.output.item-display.pd2filter' },
			{ text: '// keep visible', scope: commentScope },
		])
	})

	it('preserves inline comments after an Alias rule', async () => {
		await expectScopes('Alias[UTILITY_POTIONS]: (yps OR wms OR vps) // common potions', [
			{ text: 'Alias', scope: aliasKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'UTILITY_POTIONS', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' (yps OR wms OR vps) ' },
			{ text: '// common potions', scope: commentScope },
		])
	})
})
