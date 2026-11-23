import { describe, expect, it } from 'vitest'
import { tokenizeLine } from './tokenize.js'

const commentScope = 'comment.line.double-slash.pd2filter'
const rootScope = 'source.pd2filter-basic'

describe('pd2filter-basic grammar', () => {
	it('leaves rule text unstyled', async () => {
		const tokens = await tokenizeLine('ItemDisplay[GROUND DAMAGING_POTIONS CLVL>9]:')

		expect(tokens).toEqual([
			{
				text: 'ItemDisplay[GROUND DAMAGING_POTIONS CLVL>9]:',
				scopes: [rootScope],
			},
		])
	})

	it('scopes a full-line comment', async () => {
		const tokens = await tokenizeLine('// Hide utility potions at level 30')

		expect(tokens).toEqual([
			{
				text: '// Hide utility potions at level 30',
				scopes: [rootScope, commentScope],
			},
		])
	})

	it('scopes an inline comment without styling the preceding rule', async () => {
		const tokens = await tokenizeLine('ItemDisplay[tsc CLVL>29]: // hide TP scrolls')

		expect(tokens).toEqual([
			{
				text: 'ItemDisplay[tsc CLVL>29]: ',
				scopes: [rootScope],
			},
			{
				text: '// hide TP scrolls',
				scopes: [rootScope, commentScope],
			},
		])
	})

	it('does not partially highlight filter keywords or aliases', async () => {
		const tokens = await tokenizeLine('Alias[UTILITY_POTIONS]: (yps OR wms OR vps)')

		expect(tokens).toHaveLength(1)
		expect(tokens[0].scopes).toEqual([rootScope])
	})
})
