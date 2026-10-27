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

/** Words in one chapter with a non-empty gloss, per type. */
export interface ChapterGlossCountsChirho {
	terseGlossedChirho: number;
	readersGlossedChirho: number;
}

/**
 * An explicit ?type= wins when the language has that type. Otherwise terse is the default, unless
 * this chapter's readers glosses outnumber its terse glosses more than two to one: some languages
 * (hin, ben, guj, jpn, tel, tha in 2026-10) have a complete readers edition and only a small terse
 * sample, and a language-wide terse default opened nearly every chapter without glosses. The
 * chapter is counted only when both types exist and none was requested.
 */
export async function chooseTranslationTypeChirho(
	optionsChirho: TranslationTypeOptionsChirho,
	countGlossesChirho: () => Promise<ChapterGlossCountsChirho>
): Promise<TranslationTypeChirho> {
	const { requestedChirho, hasTerseChirho, hasReadersChirho } = optionsChirho;
	if (requestedChirho === 'readers' && hasReadersChirho) return 'readers';
	if (requestedChirho === 'terse' && hasTerseChirho) return 'terse';
	if (!hasReadersChirho) return 'terse';
	if (!hasTerseChirho) return 'readers';

	const { terseGlossedChirho, readersGlossedChirho } = await countGlossesChirho();
	return readersGlossedChirho > terseGlossedChirho * 2 ? 'readers' : 'terse';
}

/**
 * Count one chapter's glossed words per type. The LEFT JOINs keep SQLite on the chapter's indexes
 * (verse → word → phrase_word → phrase → gloss); written with inner joins, it may start from the
 * language's whole phrase table instead, which exceeded D1's CPU limit on 2026-10-27.
 */
export async function countChapterGlossesChirho(
	dbChirho: D1Database,
	languageIdChirho: string,
	bookIdChirho: number,
	chapterChirho: number
): Promise<ChapterGlossCountsChirho> {
	const rowChirho = await dbChirho
		.prepare(
			`SELECT
				COUNT(DISTINCT CASE WHEN p.translation_type_chirho IS NULL AND g.gloss <> '' THEN w.id END) AS terseGlossedChirho,
				COUNT(DISTINCT CASE WHEN p.translation_type_chirho = 'readers' AND g.gloss <> '' THEN w.id END) AS readersGlossedChirho
			FROM verse v
			JOIN word w ON w.verse_id = v.id
			LEFT JOIN phrase_word pw ON pw.word_id = w.id
			LEFT JOIN phrase p ON p.id = pw.phrase_id AND p.language_id = ?1 AND p.deleted_at IS NULL
			LEFT JOIN gloss g ON g.phrase_id = p.id
			WHERE v.book_id = ?2 AND v.chapter = ?3`
		)
		.bind(languageIdChirho, bookIdChirho, chapterChirho)
		.first<ChapterGlossCountsChirho>();
	return rowChirho ?? { terseGlossedChirho: 0, readersGlossedChirho: 0 };
}
