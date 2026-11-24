import { describe, it } from 'vitest'
import { expectScopes } from './tokenize.js'

const itemDisplayKeywordScope = 'keyword.control.item-display.pd2filter'
const bracketScope = 'punctuation.section.brackets.pd2filter'
const colonScope = 'punctuation.separator.rule.pd2filter'
const outputScope = 'meta.output.item-display.pd2filter'
const notificationScope = 'keyword.control.notification.pd2filter'

describe('ItemDisplay map notifications', () => {
	it.each(['BORDER', 'DOT', 'MAP', 'PX'])('scopes %%%s-XX%% with a hexadecimal color', async (icon) => {
		await expectScopes(`ItemDisplay[]: %${icon}-9B%`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: `%${icon}-9B%`, scope: notificationScope },
		])
	})

	it('scopes MAP without an explicit color', async () => {
		await expectScopes('ItemDisplay[]: %MAP%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: '%MAP%', scope: notificationScope },
		])
	})

	it('scopes multiple adjacent icon keywords', async () => {
		await expectScopes('ItemDisplay[]: %BORDER-00%%DOT-62%%MAP%', [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' ', scope: outputScope },
			{ text: '%BORDER-00%', scope: notificationScope },
			{ text: '%DOT-62%', scope: notificationScope },
			{ text: '%MAP%', scope: notificationScope },
		])
	})

	it.each([
		'%BORDER%',
		'%DOT%',
		'%PX%',
		'%MAP-0%',
		'%MAP-000%',
		'%MAP-GG%',
		'%MAP-zz%',
		'%map-9B%',
		'%MAP2-9B%',
	])('does not scope malformed map notification %s', async (keyword) => {
		await expectScopes(`ItemDisplay[]: ${keyword}`, [
			{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
			{ text: '[', scope: bracketScope },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ` ${keyword}`, scope: outputScope },
		])
	})

	describe('sound, text notification, and tier keywords', () => {
		it.each(['%SOUNDID-0%', '%SOUNDID-4714%', '%SOUNDID-99999%'])('scopes sound keyword %s', async (keyword) => {
			await expectScopes(`ItemDisplay[]: ${keyword}`, [
				{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
				{ text: '[', scope: bracketScope },
				{ text: ']', scope: bracketScope },
				{ text: ':', scope: colonScope },
				{ text: ' ', scope: outputScope },
				{ text: keyword, scope: notificationScope },
			])
		})

		it.each(['%NOTIFY-0%', '%NOTIFY-9%', '%NOTIFY-A%', '%NOTIFY-F%', '%NOTIFY-DEAD%'])('scopes text notification keyword %s', async (keyword) => {
			await expectScopes(`ItemDisplay[]: ${keyword}`, [
				{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
				{ text: '[', scope: bracketScope },
				{ text: ']', scope: bracketScope },
				{ text: ':', scope: colonScope },
				{ text: ' ', scope: outputScope },
				{ text: keyword, scope: notificationScope },
			])
		})

		it.each(['0', '1', '9', '10', '11', '12'])('scopes tier %s', async (tier) => {
			await expectScopes(`ItemDisplay[]: %TIER-${tier}%`, [
				{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
				{ text: '[', scope: bracketScope },
				{ text: ']', scope: bracketScope },
				{ text: ':', scope: colonScope },
				{ text: ' ', scope: outputScope },
				{ text: `%TIER-${tier}%`, scope: notificationScope },
			])
		})

		it.each([
			'%SOUNDID%',
			'%SOUNDID--1%',
			'%SOUNDID-1.5%',
			'%NOTIFY%',
			'%NOTIFY-10%',
			'%NOTIFY-G%',
			'%NOTIFY-dead%',
			'%TIER%',
			'%TIER-00%',
			'%TIER-09%',
			'%TIER-13%',
			'%TIER-A%',
		])('does not scope malformed parameter keyword %s', async (keyword) => {
			await expectScopes(`ItemDisplay[]: ${keyword}`, [
				{ text: 'ItemDisplay', scope: itemDisplayKeywordScope },
				{ text: '[', scope: bracketScope },
				{ text: ']', scope: bracketScope },
				{ text: ':', scope: colonScope },
				{ text: ` ${keyword}`, scope: outputScope },
			])
		})
	})

	it('does not scope map notifications outside ItemDisplay output', async () => {
		await expectScopes('Alias[MAP_ICON]: %MAP-9B%', [
			{ text: 'Alias', scope: 'keyword.control.alias.pd2filter' },
			{ text: '[', scope: bracketScope },
			{ text: 'MAP_ICON', scope: 'meta.rule.alias.pd2filter' },
			{ text: ']', scope: bracketScope },
			{ text: ':', scope: colonScope },
			{ text: ' %MAP-9B%' },
		])
	})
})
