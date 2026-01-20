// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { dbChirho, eqChirho, andChirho } from '$lib/server/db-chirho';
import {
	bookTableChirho,
	verseTableChirho,
	wordTableChirho,
	lemmaFormTableChirho,
	lemmaTableChirho,
	type BookChirho,
	type VerseChirho,
	type WordChirho
} from '$lib/server/schema-chirho';

// Get all books
export async function getAllBooksChirho(): Promise<BookChirho[]> {
	return await dbChirho
		.select()
		.from(bookTableChirho)
		.orderBy(bookTableChirho.idChirho);
}

// Get book by ID
export async function getBookByIdChirho(bookIdChirho: number): Promise<BookChirho | undefined> {
	const resultChirho = await dbChirho
		.select()
		.from(bookTableChirho)
		.where(eqChirho(bookTableChirho.idChirho, bookIdChirho))
		.limit(1);
	return resultChirho[0];
}

// Get verses for a chapter
export async function getVersesForChapterChirho(
	bookIdChirho: number,
	chapterChirho: number
): Promise<VerseChirho[]> {
	return await dbChirho
		.select()
		.from(verseTableChirho)
		.where(
			andChirho(
				eqChirho(verseTableChirho.bookIdChirho, bookIdChirho),
				eqChirho(verseTableChirho.chapterChirho, chapterChirho)
			)
		)
		.orderBy(verseTableChirho.numberChirho);
}

// Get verse by ID
export async function getVerseByIdChirho(verseIdChirho: string): Promise<VerseChirho | undefined> {
	const resultChirho = await dbChirho
		.select()
		.from(verseTableChirho)
		.where(eqChirho(verseTableChirho.idChirho, verseIdChirho))
		.limit(1);
	return resultChirho[0];
}

// Word with lemma information
export interface WordWithLemmaChirho extends WordChirho {
	lemmaIdChirho: string | null;
	grammarChirho: string | null;
}

// Get words for a verse with lemma info
export async function getWordsForVerseChirho(verseIdChirho: string): Promise<WordWithLemmaChirho[]> {
	const resultChirho = await dbChirho
		.select({
			idChirho: wordTableChirho.idChirho,
			textChirho: wordTableChirho.textChirho,
			verseIdChirho: wordTableChirho.verseIdChirho,
			formIdChirho: wordTableChirho.formIdChirho,
			lemmaIdChirho: lemmaFormTableChirho.lemmaIdChirho,
			grammarChirho: lemmaFormTableChirho.grammarChirho
		})
		.from(wordTableChirho)
		.leftJoin(lemmaFormTableChirho, eqChirho(wordTableChirho.formIdChirho, lemmaFormTableChirho.idChirho))
		.where(eqChirho(wordTableChirho.verseIdChirho, verseIdChirho))
		.orderBy(wordTableChirho.idChirho);

	return resultChirho;
}

// Get chapter count for a book
export async function getChapterCountChirho(bookIdChirho: number): Promise<number> {
	const resultChirho = await dbChirho
		.selectDistinct({ chapterChirho: verseTableChirho.chapterChirho })
		.from(verseTableChirho)
		.where(eqChirho(verseTableChirho.bookIdChirho, bookIdChirho));

	return resultChirho.length;
}

// Parse chapter ID (e.g., "01001" -> { bookId: 1, chapter: 1 })
export function parseChapterIdChirho(chapterIdChirho: string): { bookIdChirho: number; chapterChirho: number } {
	const bookIdChirho = parseInt(chapterIdChirho.slice(0, 2), 10);
	const chapterChirho = parseInt(chapterIdChirho.slice(2), 10);
	return { bookIdChirho, chapterChirho };
}

// Parse verse ID (e.g., "01001001" -> { bookId: 1, chapter: 1, verse: 1 })
export function parseVerseIdChirho(verseIdChirho: string): {
	bookIdChirho: number;
	chapterChirho: number;
	verseNumberChirho: number;
} {
	const bookIdChirho = parseInt(verseIdChirho.slice(0, 2), 10);
	const chapterChirho = parseInt(verseIdChirho.slice(2, 5), 10);
	const verseNumberChirho = parseInt(verseIdChirho.slice(5), 10);
	return { bookIdChirho, chapterChirho, verseNumberChirho };
}
