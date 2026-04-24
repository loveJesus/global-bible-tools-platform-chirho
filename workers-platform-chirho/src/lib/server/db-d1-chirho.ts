// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Typed D1 query helpers for the Workers platform.
 *
 * Each per-language D1 database contains:
 * - Bible source data (book, verse, word, lemma, lemma_form, lemma_resource, word_ipa_chirho)
 * - Translation data for that language (phrase, phrase_word, gloss)
 * - Reference Bible text (reference_version_chirho, reference_verse_chirho)
 * - Meta table (language code, sync timestamp)
 */

/**
 * Execute a D1 query and return typed results.
 */
export async function queryD1Chirho<T>(
	dbChirho: D1Database,
	sqlChirho: string,
	paramsChirho: unknown[] = []
): Promise<T[]> {
	const stmtChirho = dbChirho.prepare(sqlChirho).bind(...paramsChirho);
	const resultChirho = await stmtChirho.all<T>();
	return resultChirho.results;
}

/**
 * Execute a D1 query and return the first result.
 */
export async function queryD1OneChirho<T>(
	dbChirho: D1Database,
	sqlChirho: string,
	paramsChirho: unknown[] = []
): Promise<T | null> {
	const stmtChirho = dbChirho.prepare(sqlChirho).bind(...paramsChirho);
	const resultChirho = await stmtChirho.first<T>();
	return resultChirho;
}

/**
 * SQLite replacement for PG's `IS NOT DISTINCT FROM`.
 * In PG: `col IS NOT DISTINCT FROM $1` treats NULL = NULL as true.
 * In SQLite: `(col IS ? OR (col IS NULL AND ? IS NULL))` achieves the same.
 * The caller must bind the parameter TWICE.
 */
export function isNotDistinctFromD1Chirho(columnChirho: string): string {
	return `(${columnChirho} IS ? OR (${columnChirho} IS NULL AND ? IS NULL))`;
}

// ============================================================================
// Common query result types
// ============================================================================

export interface BookRowChirho {
	id: number;
	name: string;
}

export interface VerseRowChirho {
	id: string;
	number: number;
	book_id: number;
	chapter: number;
}

export interface WordWithGlossRowChirho {
	wordId: string;
	text: string;
	lemmaId: string | null;
	grammar: string | null;
	gloss: string | null;
	state: string | null;
	source: string | null;
	ipaChirho: string | null;
}

export interface LanguageMetaRowChirho {
	id: string;
	code: string;
	name: string;
	font: string | null;
	text_direction: string;
	verse_count_chirho: number | null;
	word_count_chirho: number | null;
	last_sync_chirho: string | null;
}

export interface ReferenceVersionRowChirho {
	id: number;
	code: string;
	name: string;
	language_code: string;
}

export interface ReferenceVerseRowChirho {
	verse_id: string;
	text: string;
}
