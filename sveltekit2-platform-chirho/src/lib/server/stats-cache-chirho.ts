// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { queryRawChirho } from './db-chirho';

export interface TranslationProgressChirho {
	codeChirho: string;
	nameChirho: string;
	glossCountChirho: number;
	bookCountChirho: number;
}

export interface LanguageWithStatsChirho {
	idChirho: string;
	codeChirho: string;
	nameChirho: string;
	glossCountChirho: number;
	bookCountChirho: number;
}

// In-memory cache for translation progress stats (top 12 for landing page)
let cachedProgressChirho: TranslationProgressChirho[] | null = null;
// In-memory cache for all languages with stats (for /read-chirho page)
let cachedAllLanguagesChirho: LanguageWithStatsChirho[] | null = null;
let cacheTimestampChirho: number = 0;
let lastGlossCountChirho: number = 0;

// Cache TTL for front page fallback (2 hours)
const CACHE_MAX_AGE_CHIRHO = 2 * 60 * 60 * 1000;

/**
 * Get cached translation stats. Returns null if cache is empty.
 * Use refreshTranslationStatsCacheChirho() to populate/refresh the cache.
 */
export function getTranslationStatsCacheChirho(): TranslationProgressChirho[] | null {
	return cachedProgressChirho;
}

/**
 * Get cache age in milliseconds. Returns Infinity if cache is empty.
 */
export function getCacheAgeChirho(): number {
	if (!cacheTimestampChirho) return Infinity;
	return Date.now() - cacheTimestampChirho;
}

/**
 * Check if cache is stale (older than 2 hours).
 */
export function isCacheStaleChirho(): boolean {
	return getCacheAgeChirho() > CACHE_MAX_AGE_CHIRHO;
}

/**
 * Get total gloss count (fast query ~10ms).
 */
async function getTotalGlossCountChirho(): Promise<number> {
	const resultChirho = await queryRawChirho<{ countChirho: number }>(`
		SELECT COUNT(*)::int AS "countChirho" FROM gloss WHERE gloss IS NOT NULL
	`, []);
	return resultChirho[0]?.countChirho ?? 0;
}

/**
 * Refresh the translation stats cache by running the expensive query.
 * Called by the cron endpoint. Skips if gloss count hasn't changed.
 *
 * @param forceChirho - Force refresh even if gloss count hasn't changed
 * @returns Object with stats and whether it was skipped
 */
export async function refreshTranslationStatsCacheChirho(forceChirho: boolean = false): Promise<{
	progressChirho: TranslationProgressChirho[];
	allLanguagesChirho: LanguageWithStatsChirho[];
	skippedChirho: boolean;
	glossCountChirho: number;
}> {
	// Check if gloss count changed (fast query)
	const currentGlossCountChirho = await getTotalGlossCountChirho();

	if (!forceChirho && cachedProgressChirho && cachedAllLanguagesChirho && currentGlossCountChirho === lastGlossCountChirho) {
		console.log(`[stats-cache] Skipping refresh - gloss count unchanged (${currentGlossCountChirho})`);
		return {
			progressChirho: cachedProgressChirho,
			allLanguagesChirho: cachedAllLanguagesChirho,
			skippedChirho: true,
			glossCountChirho: currentGlossCountChirho
		};
	}

	console.log(`[stats-cache] Refreshing cache (glosses: ${lastGlossCountChirho} -> ${currentGlossCountChirho})...`);
	const startChirho = Date.now();

	// Get ALL languages with stats in one query (used for both caches)
	const allLanguagesChirho = await queryRawChirho<LanguageWithStatsChirho>(`
		SELECT
			l.id AS "idChirho",
			l.code AS "codeChirho",
			l.name AS "nameChirho",
			COALESCE(stats_chirho.gloss_count_chirho, 0)::int AS "glossCountChirho",
			COALESCE(stats_chirho.book_count_chirho, 0)::int AS "bookCountChirho"
		FROM language l
		LEFT JOIN LATERAL (
			SELECT
				COUNT(DISTINCT g.phrase_id) AS gloss_count_chirho,
				COUNT(DISTINCT SUBSTRING(w.verse_id, 1, 2)) AS book_count_chirho
			FROM phrase p
			JOIN phrase_word pw ON pw.phrase_id = p.id
			JOIN word w ON w.id = pw.word_id
			JOIN gloss g ON g.phrase_id = p.id AND g.gloss IS NOT NULL
			WHERE p.language_id = l.id
				AND p.deleted_at IS NULL
		) stats_chirho ON true
		ORDER BY l.name
	`, []);

	// Extract top 12 with translations for landing page
	const progressChirho: TranslationProgressChirho[] = allLanguagesChirho
		.filter(langChirho => langChirho.glossCountChirho > 0)
		.sort((aChirho, bChirho) => bChirho.glossCountChirho - aChirho.glossCountChirho)
		.slice(0, 12)
		.map(langChirho => ({
			codeChirho: langChirho.codeChirho,
			nameChirho: langChirho.nameChirho,
			glossCountChirho: langChirho.glossCountChirho,
			bookCountChirho: langChirho.bookCountChirho
		}));

	// Update both caches
	cachedProgressChirho = progressChirho;
	cachedAllLanguagesChirho = allLanguagesChirho;
	cacheTimestampChirho = Date.now();
	lastGlossCountChirho = currentGlossCountChirho;

	const durationChirho = Date.now() - startChirho;
	console.log(`[stats-cache] Cache refreshed in ${durationChirho}ms, ${allLanguagesChirho.length} languages (${progressChirho.length} with translations)`);

	return {
		progressChirho,
		allLanguagesChirho,
		skippedChirho: false,
		glossCountChirho: currentGlossCountChirho
	};
}

/**
 * Get stats, refreshing if cache is stale (>2 hours) or empty.
 * Used by front page as fallback when cron hasn't run.
 */
export async function getOrRefreshStatsChirho(): Promise<TranslationProgressChirho[]> {
	if (cachedProgressChirho && !isCacheStaleChirho()) {
		return cachedProgressChirho;
	}

	console.log('[stats-cache] Cache stale or empty, refreshing from page load...');
	const resultChirho = await refreshTranslationStatsCacheChirho(true);
	return resultChirho.progressChirho;
}

/**
 * Get all languages with stats, refreshing if cache is stale (>2 hours) or empty.
 * Used by /read-chirho page as fallback when cron hasn't run.
 */
export async function getOrRefreshAllLanguagesChirho(): Promise<LanguageWithStatsChirho[]> {
	if (cachedAllLanguagesChirho && !isCacheStaleChirho()) {
		return cachedAllLanguagesChirho;
	}

	console.log('[stats-cache] All languages cache stale or empty, refreshing from page load...');
	const resultChirho = await refreshTranslationStatsCacheChirho(true);
	return resultChirho.allLanguagesChirho;
}
