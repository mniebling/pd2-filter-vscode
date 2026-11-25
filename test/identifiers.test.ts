import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayScope = 'meta.rule.item-display.pd2filter'
const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const nameOutput = [
	{ text: ' ', scope: 'meta.output.item-display.pd2filter' },
	{ text: '%NAME%', scope: 'constant.other.value-reference.pd2filter' },
]
const comparisonOperatorScope = 'keyword.operator.comparison.pd2filter'
const integerScope = 'constant.numeric.integer.pd2filter'
const valueConditionScope = 'support.function.condition-value.pd2filter'

describe('condition identifiers', () => {
	it.each([
		'ALVL',
		'AR',
		'CLVL',
		'CRAFTALVL',
		'CRES',
		'DEX',
		'DIFF',
		'EDAM',
		'EDEF',
		'FILTLVL',
		'FCR',
		'FRES',
		'GEM',
		'GEMLEVEL',
		'GEMTYPE',
		'GOLD',
		'ILVL',
		'LIFE',
		'LRES',
		'LVLREQ',
		'MANA',
		'MAPID',
		'MAPTIER',
		'PRES',
		'PRICE',
		'QLVL',
		'QTY',
		'REPLIFE',
		'REROLLALVL',
		'RUNE',
		'SOCKETS',
		'STR',
	])('scopes the verified value condition %s', async (condition) => {
		await expectScopes(`ItemDisplay[${condition}>1]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: condition, scope: valueConditionScope },
			{ text: '>', scope: comparisonOperatorScope },
			{ text: '1', scope: integerScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it.each(['clvl', 'gold', 'ilvl', 'rune', 'sockets', 'str', 'fres', 'replife'])('does not scope lowercase identifier %s', async (identifier) => {
		await expectScopes(`ItemDisplay[${identifier}>1]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: identifier, scope: itemDisplayScope },
			{ text: '>', scope: comparisonOperatorScope },
			{ text: '1', scope: integerScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it.each([
		'ALVLISH',
		'CLVLMAX',
		'CRAFTALVL2',
		'GEMSTONE',
		'GEMTYPE2',
		'GOLDEN',
		'ILVLISH',
		'MAPIDENTIFIER',
		'PRICELESS',
		'REROLLALVL2',
		'RUNENAME',
		'SOCKETS2',
		'2SOCKETS',
		'SOCKETSTONE',
		'STRENGTH',
		'DEX2',
		'LIFETIME',
		'MANATOTAL',
		'FRESIST',
		'CRES2',
		'EDEFENSE',
		'EDAMAGE',
		'FCRATE',
		'ARMORATING',
		'REPLIFE2',
	])('does not scope a longer identifier %s', async (identifier) => {
		await expectScopes(`ItemDisplay[${identifier}>1]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: identifier, scope: itemDisplayScope },
			{ text: '>', scope: comparisonOperatorScope },
			{ text: '1', scope: integerScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it.each(['Alias[LEVEL]: CLVL', 'Alias[SOCKETS]: SOCKETS'])('does not scope value conditions outside ItemDisplay: %s', async (line) => {
		await expectScopes(line, [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: line.slice(6, line.indexOf(']')), scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: line.slice(line.indexOf(':') + 1) },
		])
	})
})
