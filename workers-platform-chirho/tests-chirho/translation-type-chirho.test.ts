// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { describe, expect, it } from 'bun:test';
import { chooseTranslationTypeChirho } from '../src/lib/server/translation-type-chirho';

/** A chapter-count callback that records whether the loader had to query D1. */
function chapterCountsChirho(terseGlossedChirho: number, readersGlossedChirho: number) {
	const callsChirho = { countChirho: 0 };
	const countGlossesChirho = async () => {
		callsChirho.countChirho += 1;
		return { terseGlossedChirho, readersGlossedChirho };
	};
	return { callsChirho, countGlossesChirho };
}

const BOTH_TYPES_CHIRHO = { hasTerseChirho: true, hasReadersChirho: true };

describe('chooseTranslationTypeChirho', () => {
	it('opens a chapter in readers when the language only has a terse sample elsewhere', async () => {
		// Hindi Exodus 1 in production: 0 terse, 240 readers glosses
		const { countGlossesChirho } = chapterCountsChirho(0, 240);
		const typeChirho = await chooseTranslationTypeChirho({ requestedChirho: null, ...BOTH_TYPES_CHIRHO }, countGlossesChirho);
		expect(typeChirho).toBe('readers');
	});

	it('keeps terse when both types cover the chapter', async () => {
		// English John 3: 664 glossed words in each type
		const { countGlossesChirho } = chapterCountsChirho(664, 664);
		const typeChirho = await chooseTranslationTypeChirho({ requestedChirho: null, ...BOTH_TYPES_CHIRHO }, countGlossesChirho);
		expect(typeChirho).toBe('terse');
	});

	it('keeps terse unless readers covers more than twice as many words', async () => {
		const { countGlossesChirho: atTwiceChirho } = chapterCountsChirho(100, 200);
		expect(await chooseTranslationTypeChirho({ requestedChirho: null, ...BOTH_TYPES_CHIRHO }, atTwiceChirho)).toBe('terse');
		const { countGlossesChirho: aboveTwiceChirho } = chapterCountsChirho(100, 201);
		expect(await chooseTranslationTypeChirho({ requestedChirho: null, ...BOTH_TYPES_CHIRHO }, aboveTwiceChirho)).toBe('readers');
	});

	it('honors an explicit type without counting the chapter', async () => {
		const { callsChirho, countGlossesChirho } = chapterCountsChirho(0, 240);
		expect(await chooseTranslationTypeChirho({ requestedChirho: 'terse', ...BOTH_TYPES_CHIRHO }, countGlossesChirho)).toBe('terse');
		expect(await chooseTranslationTypeChirho({ requestedChirho: 'readers', ...BOTH_TYPES_CHIRHO }, countGlossesChirho)).toBe('readers');
		expect(callsChirho.countChirho).toBe(0);
	});

	it('falls back to the type the language has, without counting', async () => {
		const { callsChirho, countGlossesChirho } = chapterCountsChirho(0, 0);
		const readersOnlyChirho = { hasTerseChirho: false, hasReadersChirho: true };
		const terseOnlyChirho = { hasTerseChirho: true, hasReadersChirho: false };
		expect(await chooseTranslationTypeChirho({ requestedChirho: 'terse', ...readersOnlyChirho }, countGlossesChirho)).toBe('readers');
		expect(await chooseTranslationTypeChirho({ requestedChirho: 'readers', ...terseOnlyChirho }, countGlossesChirho)).toBe('terse');
		expect(await chooseTranslationTypeChirho({ requestedChirho: null, hasTerseChirho: false, hasReadersChirho: false }, countGlossesChirho)).toBe('terse');
		expect(callsChirho.countChirho).toBe(0);
	});
});
