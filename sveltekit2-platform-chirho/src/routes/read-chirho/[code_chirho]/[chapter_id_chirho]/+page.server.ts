// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { dbChirho, eqChirho, andChirho, queryRawChirho } from '$lib/server/db-chirho';
import { languageTableChirho, bookTableChirho, verseTableChirho } from '$lib/server/schema-chirho';
import { error as errorChirho } from '@sveltejs/kit';
import { parseChapterIdChirho } from '$lib/modules-chirho/bible-core-chirho/queries-chirho';

// NOTE: Raw SQL queries reference upstream database tables (word, phrase, gloss, etc.)
// which don't have Chirho suffix - they're from the nextjs-platform-chirho schema.

interface WordWithGlossRowChirho {
	wordId: string;
	text: string;
	lemmaId: string | null;
	grammar: string | null;
	gloss: string | null;
	state: string | null;
}

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

	// Get words with glosses for each verse using raw SQL with lateral join
	// to avoid duplicates when a word has phrases in multiple languages
	const versesWithWordsChirho = await Promise.all(
		versesChirho.map(async (verseChirho) => {
			const wordsResultChirho = await queryRawChirho<WordWithGlossRowChirho>(
				`
				SELECT
					w.id AS "wordId",
					w.text,
					lf.lemma_id AS "lemmaId",
					lf.grammar,
					ph.gloss,
					ph.state
				FROM word AS w
				LEFT JOIN lemma_form AS lf ON lf.id = w.form_id
				LEFT JOIN LATERAL (
					SELECT g.gloss, g.state
					FROM phrase_word AS pw
					JOIN phrase AS p ON p.id = pw.phrase_id
					LEFT JOIN gloss AS g ON g.phrase_id = p.id
					WHERE pw.word_id = w.id
						AND p.language_id = $2
						AND p.deleted_at IS NULL
					LIMIT 1
				) AS ph ON true
				WHERE w.verse_id = $1
				ORDER BY w.id
				`,
				[verseChirho.idChirho, languageChirho.idChirho]
			);

			return {
				verseIdChirho: verseChirho.idChirho,
				verseNumberChirho: verseChirho.numberChirho,
				wordsChirho: wordsResultChirho.map((rowChirho) => ({
					wordIdChirho: rowChirho.wordId,
					textChirho: rowChirho.text,
					lemmaIdChirho: rowChirho.lemmaId,
					grammarChirho: rowChirho.grammar,
					glossChirho: rowChirho.state === 'APPROVED' ? rowChirho.gloss : null
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
