import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayScope = 'meta.rule.item-display.pd2filter'
const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const booleanConditionScope = 'constant.language.condition-boolean.pd2filter'
const nameOutput = [
	{ text: ' ', scope: 'meta.output.item-display.pd2filter' },
	{ text: '%NAME%', scope: 'constant.other.value-reference.pd2filter' },
]

describe('Boolean item conditions', () => {
	it.each([
		'NMAG',
		'MAG',
		'RARE',
		'UNI',
		'SET',
		'CRAFT',
		'NORM',
		'EXC',
		'ELT',
		'ID',
		'INF',
		'SUP',
		'ETH',
		'RW',
		'GEMMED',
		'AMAZON',
		'ASSASSIN',
		'BARBARIAN',
		'DRUID',
		'NECROMANCER',
		'PALADIN',
		'SORCERESS',
		'SHOP',
		'EQUIPPED',
		'MERC',
		'INVENTORY',
		'CUBE',
		'STASH',
		'GROUND',
		'ANYDISCOVERED',
		'ALLDISCOVERED',
		'ANYOWNED',
		'ALLOWNED',
	])('scopes the verified Boolean item condition %s', async (condition) => {
		await expectScopes(`ItemDisplay[${condition}]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: condition, scope: booleanConditionScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it.each(['mag', 'Rare', 'id', 'eth', 'ground', 'Amazon'])('does not scope mixed-case Boolean item condition %s', async (condition) => {
		await expectScopes(`ItemDisplay[${condition}]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: condition, scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it.each([
		'NMAGIC',
		'MAGICAL',
		'RAREST',
		'UNIDENTIFIED',
		'SETITEM',
		'CRAFTED',
		'NORMAL',
		'EXCELLENT',
		'ELT2',
		'2ID',
		'INFERIOR',
		'SUPERIOR',
		'ETHEREAL',
		'RUNEWORD',
		'GEMMED2',
		'AMAZON2',
		'ASSASSINATION',
		'BARBARIANHELM',
		'DRUIDIC',
		'NECROMANCERISH',
		'PALADIN2',
		'SORCERESSORB',
		'SHOPPING',
		'EQUIPPED2',
		'MERCENARY',
		'INVENTORYITEM',
		'CUBE2',
		'STASHED',
		'GROUND2',
		'UNDISCOVERED',
		'ALLDISCOVERED2',
		'ANYOWNEDITEM',
		'ALLOWNED2',
	])('does not scope a longer identifier %s', async (condition) => {
		await expectScopes(`ItemDisplay[${condition}]: %NAME%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: condition, scope: itemDisplayScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			...nameOutput,
		])
	})

	it.each(['MAG', 'RARE', 'ID', 'GROUND', 'SHOP'])('does not scope Boolean item condition %s outside ItemDisplay', async (condition) => {
		await expectScopes(`Alias[VISIBLE]: ${condition}`, [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'VISIBLE', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ` ${condition}` },
		])
	})
})
