import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const outputScope = 'meta.output.item-display.pd2filter'
const descriptionScope = 'meta.description.item-display.pd2filter'
const braceScope = 'punctuation.section.braces.pd2filter'
const valueReferenceScope = 'constant.other.value-reference.pd2filter'
const colorScope = 'constant.language.color.pd2filter'

describe('ItemDisplay descriptions', () => {
	it('scopes description braces and literal description text', async () => {
		await expectScopes('ItemDisplay[]: %NAME%{Item details}', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: '%NAME%', scope: valueReferenceScope },
			{ text: '{', scope: braceScope },
			{ text: 'Item details', scope: descriptionScope },
			{ text: '}', scope: braceScope },
		])
	})

	it('scopes output keywords inside a description', async () => {
		await expectScopes('ItemDisplay[]: {%DARK_GREEN%$%PRICE%%NL%Sockets: %SOCKETS%}', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: '{', scope: braceScope },
			{ text: '%DARK_GREEN%', scope: colorScope },
			{ text: '$', scope: descriptionScope },
			{ text: '%PRICE%', scope: valueReferenceScope },
			{ text: '%NL%', scope: 'keyword.control.output.pd2filter' },
			{ text: 'Sockets: ', scope: descriptionScope },
			{ text: '%SOCKETS%', scope: valueReferenceScope },
			{ text: '}', scope: braceScope },
		])
	})

	it('scopes multiple descriptions and resumes item-name output', async () => {
		await expectScopes('ItemDisplay[]: %NAME%{First}{Second}%CONTINUE%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: '%NAME%', scope: valueReferenceScope },
			{ text: '{', scope: braceScope },
			{ text: 'First', scope: descriptionScope },
			{ text: '}', scope: braceScope },
			{ text: '{', scope: braceScope },
			{ text: 'Second', scope: descriptionScope },
			{ text: '}', scope: braceScope },
			{ text: '%CONTINUE%', scope: 'keyword.control.output.pd2filter' },
		])
	})

	it.each(['ItemDisplay[]: {unfinished', 'ItemDisplay[]: stray}'])(
		'keeps unmatched braces as output text: %s',
		async (line) => {
			await expectScopes(line, [
				{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
				{ text: '[', scope: bracketScope },
				{ text: ']', scope: bracketScope },
				{ text: ':', scope: colonScope },
				{ text: line.slice(line.indexOf(':') + 1), scope: outputScope },
			])
		},
	)

	it('does not scope description braces outside ItemDisplay output', async () => {
		await expectScopes('Alias[DETAIL]: {Item Level: %ILVL%}', [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'DETAIL', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' {Item Level: %ILVL%}' },
		])
	})
})
