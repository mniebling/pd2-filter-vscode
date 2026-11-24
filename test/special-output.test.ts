import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const outputScope = 'meta.output.item-display.pd2filter'
const specialOutputScope = 'keyword.control.output.pd2filter'
const valueReferenceScope = 'constant.other.value-reference.pd2filter'
const colorScope = 'constant.language.color.pd2filter'

describe('ItemDisplay special output keywords', () => {
	it.each(['CL', 'CONTINUE', 'CS', 'NL'])('scopes %%%s%%', async (keyword) => {
		await expectScopes(`ItemDisplay[]: %${keyword}%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: `%${keyword}%`, scope: specialOutputScope },
		])
	})

	it('scopes adjacent special, value, and color keywords', async () => {
		await expectScopes('ItemDisplay[]: %RED%%NAME%%CS%[%ILVL%]%NL%%CONTINUE%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: '%RED%', scope: colorScope },
			{ text: '%NAME%', scope: valueReferenceScope },
			{ text: '%CS%', scope: specialOutputScope },
			{ text: '[', scope: outputScope },
			{ text: '%ILVL%', scope: valueReferenceScope },
			{ text: ']', scope: outputScope },
			{ text: '%NL%', scope: specialOutputScope },
			{ text: '%CONTINUE%', scope: specialOutputScope },
		])
	})

	it.each([
		'%continue%',
		'%CONTINUE2%',
		'%NL-1%',
		'%CL2%',
		'%CSS%',
		'%NEWLINE%',
	])('does not scope unsupported special output keyword %s', async (keyword) => {
		await expectScopes(`ItemDisplay[]: ${keyword}`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ` ${keyword}`, scope: outputScope },
		])
	})

	it('does not scope special output keywords outside ItemDisplay output', async () => {
		await expectScopes('Alias[NEXT]: %NAME%%CONTINUE%', [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'NEXT', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' %NAME%%CONTINUE%' },
		])
	})
})
