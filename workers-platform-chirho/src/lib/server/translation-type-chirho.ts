// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Which translation type a chapter page shows: terse (word-by-word, `translation_type_chirho`
 * NULL) or readers (`'readers'`).
 */

export type TranslationTypeChirho = 'terse' | 'readers';

export interface TranslationTypeOptionsChirho {
	/** The page's ?type= parameter. */
	requestedChirho: string | null;
	/** Whether the language has any phrase of each type. */
	hasTerseChirho: boolean;
	hasReadersChirho: boolean;
}

/** A chapter's word count, and how many of its words have a phrase of each type. */
export interface ChapterCoverageChirho {
	wordsChirho: number;
	terseCoveredChirho: number;
	readersCoveredChirho: number;
}

/**
 * An explicit ?type= wins when the language has that type. Otherwise terse is the default wherever
 * it covers the whole chapter; where it does not, the chapter opens in whichever type covers more of
 * it. Some languages (hin, ben, guj, jpn, tel, tha in 2026-10) have a complete readers edition and
 * only a terse sample, and a sample can cover part of a chapter (hin terse: 880 of Matthew 27's
 * 1,042 words). Coverage counts words that have a phrase, so the edition's deliberate blank glosses
 * (H0853, paragraph markers) do not make a complete chapter look incomplete. The chapter is counted
 * only when both types exist and none was requested.
 */
export async function chooseTranslationTypeChirho(
	optionsChirho: TranslationTypeOptionsChirho,
	countCoverageChirho: () => Promise<ChapterCoverageChirho>
): Promise<TranslationTypeChirho> {
	const { requestedChirho, hasTerseChirho, hasReadersChirho } = optionsChirho;
	if (requestedChirho === 'readers' && hasReadersChirho) return 'readers';
	if (requestedChirho === 'terse' && hasTerseChirho) return 'terse';
	if (!hasReadersChirho) return 'terse';
	if (!hasTerseChirho) return 'readers';

	const { wordsChirho, terseCoveredChirho, readersCoveredChirho } = await countCoverageChirho();
	if (terseCoveredChirho >= wordsChirho) return 'terse';
	return readersCoveredChirho > terseCoveredChirho ? 'readers' : 'terse';
}

/**
 * Count one chapter's words and those with a phrase of each type. The LEFT JOINs keep SQLite on the
 * chapter's indexes (verse → word → phrase_word → phrase); written with inner joins, it may start
 * from the language's whole phrase table instead, which exceeded D1's CPU limit on 2026-10-27. A
 * word with no phrase reaches the CASEs with p.id NULL, so terse needs `p.id IS NOT NULL` as well.
 */
export async function countChapterCoverageChirho(
	dbChirho: D1Database,
	languageIdChirho: string,
	bookIdChirho: number,
	chapterChirho: number
): Promise<ChapterCoverageChirho> {
	const rowChirho = await dbChirho
		.prepare(
			`SELECT
				COUNT(DISTINCT w.id) AS wordsChirho,
				COUNT(DISTINCT CASE WHEN p.id IS NOT NULL AND p.translation_type_chirho IS NULL THEN w.id END) AS terseCoveredChirho,
				COUNT(DISTINCT CASE WHEN p.translation_type_chirho = 'readers' THEN w.id END) AS readersCoveredChirho
			FROM verse v
			JOIN word w ON w.verse_id = v.id
			LEFT JOIN phrase_word pw ON pw.word_id = w.id
			LEFT JOIN phrase p ON p.id = pw.phrase_id AND p.language_id = ?1 AND p.deleted_at IS NULL
			WHERE v.book_id = ?2 AND v.chapter = ?3`
		)
		.bind(languageIdChirho, bookIdChirho, chapterChirho)
		.first<ChapterCoverageChirho>();
	return rowChirho ?? { wordsChirho: 0, terseCoveredChirho: 0, readersCoveredChirho: 0 };
}
