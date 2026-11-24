import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const valueReferenceScope = 'constant.other.value-reference.pd2filter'
const outputScope = 'meta.output.item-display.pd2filter'

describe('ItemDisplay value references', () => {
	it.each([
		'ALLATTRIB',
		'ALVL',
		'AREA',
		'BASEBLOCK',
		'BASEMAXKICK',
		'BASEMAXONEH',
		'BASEMAXSMITE',
		'BASEMAXTHROW',
		'BASEMAXTWOH',
		'BASEMINKICK',
		'BASEMINONEH',
		'BASEMINSMITE',
		'BASEMINTHROW',
		'BASEMINTWOH',
		'BASENAME',
		'BUYPRICE',
		'CODE',
		'CRAFTALVL',
		'GEMLEVEL',
		'GEMTYPE',
		'HEIGHT',
		'ILVL',
		'LVLREQ',
		'MAXRES',
		'MAXSOCKETS',
		'NAME',
		'PRICE',
		'QTY',
		'RANGE',
		'REQLVL',
		'REQDEX',
		'REQSTR',
		'REROLLALVL',
		'RUNENAME',
		'RUNENUM',
		'SELLPRICE',
		'SOCKETS',
		'UPDEX',
		'UPLVL',
		'UPSTR',
		'WIDTH',
		'WPNSPD',
	])('scopes the %%%s%% value reference', async (reference) => {
		await expectScopes(`ItemDisplay[]: %${reference}%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: `%${reference}%`, scope: valueReferenceScope },
		])
	})

	it('scopes value references beside literal output text', async () => {
		await expectScopes('ItemDisplay[]: Name: %NAME% [%SOCKETS%]', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' Name: ', scope: outputScope },
			{ text: '%NAME%', scope: valueReferenceScope },
			{ text: ' [', scope: outputScope },
			{ text: '%SOCKETS%', scope: valueReferenceScope },
			{ text: ']', scope: outputScope },
		])
	})

	it.each([
		'%name%',
		'%BUYPRICELESS%',
		'%BASEMINONEHISH%',
		'%CODE2%',
		'%HEIGHT2%',
		'%ILVLISH%',
		'%MAXRESIST%',
		'%MAXSOCKETS2%',
		'%QTY2%',
		'%REQDEX2%',
		'%SOCKET%',
		'%UPDEXISH%',
		'%SOCKETS2%',
		'%2SOCKETS%',
		'%NAMEISH%',
	])(
		'does not scope unsupported value reference %s',
		async (reference) => {
			await expectScopes(`ItemDisplay[]: ${reference}`, [
				{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
				{ text: '[', scope: bracketScope },
				{ text: ']', scope: bracketScope },
				{ text: ':', scope: colonScope },
				{ text: ` ${reference}`, scope: outputScope },
			])
		},
	)

	it('does not scope value references outside ItemDisplay output', async () => {
		await expectScopes('Alias[SOCKET_LABEL]: %NAME% [%SOCKETS%]', [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'SOCKET_LABEL', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' %NAME% [%SOCKETS%]' },
		])
	})
})
