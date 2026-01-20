// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { dbChirho, eqChirho, andChirho, likeChirho, queryRawChirho } from '$lib/server/db-chirho';
import {
	languageTableChirho,
	bookTableChirho,
	verseTableChirho,
	referenceVersionTableChirho,
	referenceVerseTableChirho
} from '$lib/server/schema-chirho';
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
	source: string | null;
}

interface BookWithChaptersRowChirho {
	idChirho: number;
	nameChirho: string;
	maxChapterChirho: number;
}

interface LanguageWithTranslationsRowChirho {
	codeChirho: string;
	nameChirho: string;
}

interface ReferenceVerseRowChirho {
	verseIdChirho: string;
	textChirho: string;
}

export const load: PageServerLoadChirho = async ({ params: paramsChirho, url: urlChirho }) => {
	const codeChirho = paramsChirho.code_chirho;
	const chapterIdChirho = paramsChirho.chapter_id_chirho;
	const refVersionParamChirho = urlChirho.searchParams.get('ref');

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
					ph.state,
					ph.source
				FROM word AS w
				LEFT JOIN lemma_form AS lf ON lf.id = w.form_id
				LEFT JOIN LATERAL (
					SELECT g.gloss, g.state, g.source
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
					glossChirho: rowChirho.gloss,
					glossStateChirho: rowChirho.state,
					glossSourceChirho: rowChirho.source
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

	// Get all books with their chapter counts for navigation
	const allBooksChirho = await queryRawChirho<BookWithChaptersRowChirho>(
		`SELECT b.id AS "idChirho", b.name AS "nameChirho", MAX(v.chapter) as "maxChapterChirho"
		 FROM book b
		 JOIN verse v ON v.book_id = b.id
		 GROUP BY b.id, b.name
		 ORDER BY b.id`
	);

	// Generate chapter list for current book using maxChapter from query
	const currentBookInfoChirho = allBooksChirho.find((bChirho) => bChirho.idChirho === bookIdChirho);
	const maxChapterChirho = currentBookInfoChirho?.maxChapterChirho ?? 1;
	const chaptersInBookChirho = Array.from(
		{ length: maxChapterChirho },
		(_, iChirho) => iChirho + 1
	);

	// Get languages that have translations for current book
	const languagesWithTranslationsChirho = await queryRawChirho<LanguageWithTranslationsRowChirho>(
		`SELECT DISTINCT l.code AS "codeChirho", l.name AS "nameChirho"
		 FROM language l
		 JOIN phrase p ON p.language_id = l.id
		 JOIN phrase_word pw ON pw.phrase_id = p.id
		 JOIN word w ON w.id = pw.word_id
		 JOIN verse v ON v.id = w.verse_id
		 WHERE v.book_id = $1 AND p.deleted_at IS NULL
		 ORDER BY l.name`,
		[bookIdChirho]
	);

	// Get all reference versions
	const referenceVersionsChirho = await dbChirho
		.select({
			idChirho: referenceVersionTableChirho.idChirho,
			codeChirho: referenceVersionTableChirho.codeChirho,
			nameChirho: referenceVersionTableChirho.nameChirho,
			languageCodeChirho: referenceVersionTableChirho.languageCodeChirho
		})
		.from(referenceVersionTableChirho)
		.orderBy(referenceVersionTableChirho.nameChirho);

	// Find the best reference version: URL param > language default > KJV
	const langToVersionMapChirho: Record<string, number> = {
		eng: 1, // KJV
		spa: 3, // RV1909
		hin: 4, // HinERV
		tur: 5 // TurHADI
	};
	const preferredVersionIdChirho = refVersionParamChirho
		? parseInt(refVersionParamChirho, 10)
		: (langToVersionMapChirho[codeChirho] ?? 1);

	// Get reference verses for the chapter using the preferred version
	// Chapter verses match pattern: bookId (2 digits) + chapter (3 digits) + verse (3 digits)
	const chapterPrefixChirho = `${bookIdChirho.toString().padStart(2, '0')}${chapterChirho.toString().padStart(3, '0')}`;
	const referenceVersesChirho = await queryRawChirho<ReferenceVerseRowChirho>(
		`SELECT verse_id_chirho AS "verseIdChirho", text_chirho AS "textChirho"
		 FROM reference_verse_chirho
		 WHERE version_id_chirho = $1 AND verse_id_chirho LIKE $2
		 ORDER BY verse_id_chirho`,
		[preferredVersionIdChirho, `${chapterPrefixChirho}%`]
	);

	// Convert reference verses to a map for easy lookup
	const referenceVersesMapChirho: Record<string, string> = {};
	for (const rvChirho of referenceVersesChirho) {
		referenceVersesMapChirho[rvChirho.verseIdChirho] = rvChirho.textChirho;
	}

	// Get the selected reference version name
	const selectedRefVersionChirho = referenceVersionsChirho.find(
		(vChirho) => vChirho.idChirho === preferredVersionIdChirho
	);

	return {
		codeChirho,
		languageChirho,
		bookChirho,
		chapterChirho,
		versesChirho: versesWithWordsChirho,
		prevChapterIdChirho,
		nextChapterIdChirho,
		allBooksChirho,
		chaptersInBookChirho,
		languagesWithTranslationsChirho,
		referenceVersionsChirho,
		referenceVersesMapChirho,
		selectedRefVersionIdChirho: preferredVersionIdChirho,
		selectedRefVersionNameChirho: selectedRefVersionChirho?.nameChirho ?? 'Reference'
	};
};
