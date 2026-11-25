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
		'ALLSK',
		'ALVL',
		'AR',
		'ARPER',
		'CLVL',
		'CRAFTALVL',
		'CRES',
		'DEF',
		'DEX',
		'DIFF',
		'DTM',
		'ED',
		'EDAM',
		'EDEF',
		'FBR',
		'FILTLVL',
		'FCR',
		'FHR',
		'FRES',
		'FRW',
		'GEM',
		'GEMLEVEL',
		'GEMTYPE',
		'GFIND',
		'GOLD',
		'IAS',
		'ILVL',
		'LIFE',
		'LRES',
		'LVLREQ',
		'MAEK',
		'MANA',
		'MAPID',
		'MAPTIER',
		'MAXDMG',
		'MAXDUR',
		'MFIND',
		'MINDMG',
		'PRES',
		'PRICE',
		'QLVL',
		'QTY',
		'REPAIR',
		'REPLIFE',
		'REROLLALVL',
		'RES',
		'RUNE',
		'SOCK',
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

	it.each(['STAT0', 'STAT60', 'STAT504', 'STAT9999', 'CHARSTAT14', 'CHARSTAT15', 'CHARSTAT9999', 'CLSK2', 'OS74', 'SK20', 'TABSK25', 'MULTI83,2', 'MULTI97,74', 'MULTI9999,9999'])('scopes the numbered value-condition form %s', async (condition) => {
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

	it.each(['clvl', 'gold', 'ilvl', 'rune', 'sockets', 'sock', 'str', 'fres', 'replife', 'mindmg', 'maxdur', 'mfind', 'gfind', 'dtm', 'repair', 'stat60', 'charstat15', 'clsk2', 'allsk'])('does not scope lowercase identifier %s', async (identifier) => {
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

	it('does not scope a lowercase MULTI form as a value condition', async () => {
		await expectScopes('ItemDisplay[multi83,2>1]: %NAME%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: 'multi83,', scope: itemDisplayScope },
			{ text: '2', scope: integerScope },
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
		'SOCKET',
		'DEFENSE',
		'EDITOR',
		'FIREWALK',
		'IAS2',
		'FHRATE',
		'FBREAK',
		'MAXDURABILITY',
		'MINDAMAGE',
		'MAXDAMAGE',
		'RESIST',
		'MFINDING',
		'GFINDER',
		'MAEK2',
		'DTMODE',
		'REPAIRED',
		'ARPER2',
		'STAT',
		'STAT_60',
		'STAT60_EXTRA',
		'CHARSTAT',
		'CHARSTAT15_EXTRA',
		'CLSK',
		'CLSK2_EXTRA',
		'OS74_EXTRA',
		'SK20_EXTRA',
		'TABSK25_EXTRA',
		'MULTI83',
		'MULTI83,',
		'MULTI83,2_EXTRA',
		'ALLSKILLS',
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

	it.each(['Alias[LEVEL]: CLVL', 'Alias[SOCKETS]: SOCKETS', 'Alias[LEECH]: STAT60', 'Alias[CHAR]: CHARSTAT15', 'Alias[SKILL]: SK20', 'Alias[MULTI]: MULTI83,2'])('does not scope value conditions outside ItemDisplay: %s', async (line) => {
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
