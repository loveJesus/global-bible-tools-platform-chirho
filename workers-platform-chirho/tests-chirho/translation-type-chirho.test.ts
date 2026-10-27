// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { describe, expect, it } from 'bun:test';
import { chooseTranslationTypeChirho } from '../src/lib/server/translation-type-chirho';

/** A chapter-coverage callback that records whether the loader had to query D1. */
function chapterCoverageChirho(wordsChirho: number, terseCoveredChirho: number, readersCoveredChirho: number) {
	const callsChirho = { countChirho: 0 };
	const countCoverageChirho = async () => {
		callsChirho.countChirho += 1;
		return { wordsChirho, terseCoveredChirho, readersCoveredChirho };
	};
	return { callsChirho, countCoverageChirho };
}

const BOTH_TYPES_CHIRHO = { hasTerseChirho: true, hasReadersChirho: true };
const DEFAULT_CHIRHO = { requestedChirho: null, ...BOTH_TYPES_CHIRHO };

describe('chooseTranslationTypeChirho', () => {
	it('opens a chapter in readers when the language only has a terse sample elsewhere', async () => {
		// Hindi Exodus 1 in production: no terse phrases, readers complete
		const { countCoverageChirho } = chapterCoverageChirho(240, 0, 240);
		expect(await chooseTranslationTypeChirho(DEFAULT_CHIRHO, countCoverageChirho)).toBe('readers');
	});

	it('opens readers when a terse sample covers only part of the chapter', async () => {
		// Hindi Matthew 27 in production (2026-10-27): terse sample 880 of 1,042 words, readers all
		const { countCoverageChirho } = chapterCoverageChirho(1042, 880, 1042);
		expect(await chooseTranslationTypeChirho(DEFAULT_CHIRHO, countCoverageChirho)).toBe('readers');
	});

	it('keeps terse wherever terse covers the whole chapter', async () => {
		// English John 3: both editions complete
		const { countCoverageChirho: bothChirho } = chapterCoverageChirho(664, 664, 664);
		expect(await chooseTranslationTypeChirho(DEFAULT_CHIRHO, bothChirho)).toBe('terse');
		const { countCoverageChirho: terseOnlyChirho } = chapterCoverageChirho(664, 664, 0);
		expect(await chooseTranslationTypeChirho(DEFAULT_CHIRHO, terseOnlyChirho)).toBe('terse');
	});

	it('keeps terse when neither edition covers more of an incomplete chapter', async () => {
		const { countCoverageChirho: lessChirho } = chapterCoverageChirho(100, 80, 50);
		expect(await chooseTranslationTypeChirho(DEFAULT_CHIRHO, lessChirho)).toBe('terse');
		const { countCoverageChirho: tieChirho } = chapterCoverageChirho(100, 80, 80);
		expect(await chooseTranslationTypeChirho(DEFAULT_CHIRHO, tieChirho)).toBe('terse');
	});

	it('honors an explicit type without counting the chapter', async () => {
		const { callsChirho, countCoverageChirho } = chapterCoverageChirho(240, 0, 240);
		expect(await chooseTranslationTypeChirho({ ...DEFAULT_CHIRHO, requestedChirho: 'terse' }, countCoverageChirho)).toBe('terse');
		expect(await chooseTranslationTypeChirho({ ...DEFAULT_CHIRHO, requestedChirho: 'readers' }, countCoverageChirho)).toBe('readers');
		expect(callsChirho.countChirho).toBe(0);
	});

	it('falls back to the type the language has, without counting', async () => {
		const { callsChirho, countCoverageChirho } = chapterCoverageChirho(0, 0, 0);
		const readersOnlyChirho = { hasTerseChirho: false, hasReadersChirho: true };
		const terseOnlyChirho = { hasTerseChirho: true, hasReadersChirho: false };
		expect(await chooseTranslationTypeChirho({ requestedChirho: 'terse', ...readersOnlyChirho }, countCoverageChirho)).toBe('readers');
		expect(await chooseTranslationTypeChirho({ requestedChirho: 'readers', ...terseOnlyChirho }, countCoverageChirho)).toBe('terse');
		expect(await chooseTranslationTypeChirho({ requestedChirho: null, hasTerseChirho: false, hasReadersChirho: false }, countCoverageChirho)).toBe('terse');
		expect(callsChirho.countChirho).toBe(0);
	});
});
