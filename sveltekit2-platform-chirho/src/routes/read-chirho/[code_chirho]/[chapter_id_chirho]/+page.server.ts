// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { dbChirho, eqChirho, andChirho, sqlChirho } from '$lib/server/db-chirho';
import {
	languageTableChirho,
	bookTableChirho,
	verseTableChirho,
	wordTableChirho,
	phraseWordTableChirho,
	phraseTableChirho,
	glossTableChirho,
	lemmaFormTableChirho
} from '$lib/server/schema-chirho';
import { error as errorChirho } from '@sveltejs/kit';
import { parseChapterIdChirho } from '$lib/modules-chirho/bible-core-chirho/queries-chirho';

export const load: PageServerLoadChirho = async ({ params: paramsChirho }) => {
	const codeChirho = paramsChirho.code_chirho;
	const chapterIdChirho = paramsChirho.chapter_id_chirho;

	// Parse chapter ID
	const { bookIdChirho, chapterChirho } = parseChapterIdChirho(chapterIdChirho);

	// Get language
	const languageResultChirho = await dbChirho
		.select()
		.from(languageTableChirho)
		.where(eqChirho(languageTableChirho.codeChirho, codeChirho))
		.limit(1);

	const languageChirho = languageResultChirho[0];
	if (!languageChirho) {
		throw errorChirho(404, `Language '${codeChirho}' not found`);
	}

	// Get book
	const bookResultChirho = await dbChirho
		.select()
		.from(bookTableChirho)
		.where(eqChirho(bookTableChirho.idChirho, bookIdChirho))
		.limit(1);

	const bookChirho = bookResultChirho[0];
	if (!bookChirho) {
		throw errorChirho(404, `Book not found`);
	}

	// Get verses for chapter
	const versesChirho = await dbChirho
		.select()
		.from(verseTableChirho)
		.where(
			andChirho(
				eqChirho(verseTableChirho.bookIdChirho, bookIdChirho),
				eqChirho(verseTableChirho.chapterChirho, chapterChirho)
			)
		)
		.orderBy(verseTableChirho.numberChirho);

	if (versesChirho.length === 0) {
		throw errorChirho(404, `Chapter not found`);
	}

	// Get words with glosses for each verse
	const versesWithWordsChirho = await Promise.all(
		versesChirho.map(async (verseChirho) => {
			// Get words for this verse with their glosses
			const wordsResultChirho = await dbChirho
				.select({
					wordIdChirho: wordTableChirho.idChirho,
					textChirho: wordTableChirho.textChirho,
					formIdChirho: wordTableChirho.formIdChirho,
					lemmaIdChirho: lemmaFormTableChirho.lemmaIdChirho,
					glossChirho: glossTableChirho.glossChirho,
					stateChirho: glossTableChirho.stateChirho
				})
				.from(wordTableChirho)
				.leftJoin(lemmaFormTableChirho, eqChirho(wordTableChirho.formIdChirho, lemmaFormTableChirho.idChirho))
				.leftJoin(phraseWordTableChirho, eqChirho(wordTableChirho.idChirho, phraseWordTableChirho.wordIdChirho))
				.leftJoin(
					phraseTableChirho,
					andChirho(
						eqChirho(phraseWordTableChirho.phraseIdChirho, phraseTableChirho.idChirho),
						eqChirho(phraseTableChirho.languageIdChirho, languageChirho.idChirho),
						sqlChirho`${phraseTableChirho.deletedAtChirho} IS NULL`
					)
				)
				.leftJoin(glossTableChirho, eqChirho(phraseTableChirho.idChirho, glossTableChirho.phraseIdChirho))
				.where(eqChirho(wordTableChirho.verseIdChirho, verseChirho.idChirho))
				.orderBy(wordTableChirho.idChirho);

			return {
				verseIdChirho: verseChirho.idChirho,
				verseNumberChirho: verseChirho.numberChirho,
				wordsChirho: wordsResultChirho.map((wordItemChirho) => ({
					wordIdChirho: wordItemChirho.wordIdChirho,
					textChirho: wordItemChirho.textChirho,
					lemmaIdChirho: wordItemChirho.lemmaIdChirho,
					glossChirho: wordItemChirho.stateChirho === 'APPROVED' ? wordItemChirho.glossChirho : null
				}))
			};
		})
	);

	// Calculate prev/next chapter IDs
	const prevChapterIdChirho = chapterChirho > 1
		? `${bookIdChirho.toString().padStart(2, '0')}${(chapterChirho - 1).toString().padStart(3, '0')}`
		: null;

	// Check if next chapter exists
	const nextChapterCheckChirho = await dbChirho
		.select()
		.from(verseTableChirho)
		.where(
			andChirho(
				eqChirho(verseTableChirho.bookIdChirho, bookIdChirho),
				eqChirho(verseTableChirho.chapterChirho, chapterChirho + 1)
			)
		)
		.limit(1);

	const nextChapterIdChirho = nextChapterCheckChirho.length > 0
		? `${bookIdChirho.toString().padStart(2, '0')}${(chapterChirho + 1).toString().padStart(3, '0')}`
		: null;

	return {
		codeChirho,
		languageChirho,
		bookChirho,
		chapterChirho,
		versesChirho: versesWithWordsChirho,
		prevChapterIdChirho,
		nextChapterIdChirho
	};
};
