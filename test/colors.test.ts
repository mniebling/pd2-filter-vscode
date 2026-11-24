import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const outputScope = 'meta.output.item-display.pd2filter'
const colorScope = 'constant.language.color.pd2filter'
const valueReferenceScope = 'constant.other.value-reference.pd2filter'

describe('ItemDisplay color keywords', () => {
	it.each([
		'BLACK',
		'BLUE',
		'CORAL',
		'DARK_GREEN',
		'GOLD',
		'GRAY',
		'GREEN',
		'LIGHT_GRAY',
		'ORANGE',
		'PURPLE',
		'RED',
		'SAGE',
		'TAN',
		'TEAL',
		'WHITE',
		'YELLOW',
	])('scopes the %%%s%% color keyword', async (color) => {
		await expectScopes(`ItemDisplay[]: %${color}%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: `%${color}%`, scope: colorScope },
		])
	})

	it('scopes adjacent color and value-reference keywords', async () => {
		await expectScopes('ItemDisplay[]: %RED%%NAME%%GRAY%[%SOCKETS%]', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: '%RED%', scope: colorScope },
			{ text: '%NAME%', scope: valueReferenceScope },
			{ text: '%GRAY%', scope: colorScope },
			{ text: '[', scope: outputScope },
			{ text: '%SOCKETS%', scope: valueReferenceScope },
			{ text: ']', scope: outputScope },
		])
	})

	it.each(['%red%', '%RED2%', '%DARKGREEN%', '%LIGHTER_GRAY%', '%UNKNOWN%'])(
		'does not scope unsupported color keyword %s',
		async (keyword) => {
			await expectScopes(`ItemDisplay[]: ${keyword}`, [
				{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
				{ text: '[', scope: bracketScope },
				{ text: ']', scope: bracketScope },
				{ text: ':', scope: colonScope },
				{ text: ` ${keyword}`, scope: outputScope },
			])
		},
	)

	it('does not scope color keywords outside ItemDisplay output', async () => {
		await expectScopes('Alias[HIGHLIGHT]: %RED%%NAME%', [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'HIGHLIGHT', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' %RED%%NAME%' },
		])
	})
})
