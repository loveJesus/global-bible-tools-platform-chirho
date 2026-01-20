// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { error as errorChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { isUserAdminChirho } from '$lib/server/auth-helpers-chirho';
import { queryRawChirho } from '$lib/server/db-chirho';

interface OverviewStatsChirho {
	totalLanguagesChirho: number;
	totalUsersChirho: number;
	totalGlossesChirho: number;
	approvedGlossesChirho: number;
	machineGlossesChirho: number;
}

interface LanguageProgressChirho {
	codeChirho: string;
	nameChirho: string;
	wordCountChirho: number;
	approvedCountChirho: number;
	pendingCountChirho: number;
	memberCountChirho: number;
}

interface RecentActivityChirho {
	dateChirho: string;
	languageCodeChirho: string;
	languageNameChirho: string;
	glossCountChirho: number;
	approvedCountChirho: number;
}

interface BookProgressChirho {
	bookIdChirho: number;
	bookNameChirho: string;
	languageCodeChirho: string;
	totalWordsChirho: number;
	approvedCountChirho: number;
}

export const load: PageServerLoadChirho = async ({ locals: localsChirho }) => {
	const sessionChirho = localsChirho.sessionChirho;

	// Check authentication
	if (!sessionChirho?.userIdChirho) {
		throw redirectChirho(302, '/login-chirho');
	}

	// Check admin role
	const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
	if (!isAdminChirho) {
		throw errorChirho(403, 'Access denied. Admin privileges required.');
	}

	// Get overview stats
	const overviewStatsChirho = await queryRawChirho<OverviewStatsChirho>(
		`
		SELECT
			(SELECT COUNT(*) FROM language)::int AS "totalLanguagesChirho",
			(SELECT COUNT(*) FROM "user" WHERE status = 'active')::int AS "totalUsersChirho",
			(SELECT COUNT(*) FROM gloss)::int AS "totalGlossesChirho",
			(SELECT COUNT(*) FROM gloss WHERE state = 'APPROVED')::int AS "approvedGlossesChirho",
			(SELECT COUNT(*) FROM machine_gloss)::int AS "machineGlossesChirho"
		`
	);

	// Get language progress
	const languageProgressChirho = await queryRawChirho<LanguageProgressChirho>(
		`
		SELECT
			l.code AS "codeChirho",
			l.name AS "nameChirho",
			COALESCE(word_stats.word_count, 0)::int AS "wordCountChirho",
			COALESCE(word_stats.approved_count, 0)::int AS "approvedCountChirho",
			COALESCE(word_stats.pending_count, 0)::int AS "pendingCountChirho",
			COALESCE(member_stats.member_count, 0)::int AS "memberCountChirho"
		FROM language l
		LEFT JOIN LATERAL (
			SELECT
				COUNT(DISTINCT pw.word_id)::int AS word_count,
				COUNT(DISTINCT CASE WHEN g.state = 'APPROVED' THEN pw.word_id END)::int AS approved_count,
				COUNT(DISTINCT CASE WHEN g.state != 'APPROVED' OR g.state IS NULL THEN pw.word_id END)::int AS pending_count
			FROM phrase p
			JOIN phrase_word pw ON pw.phrase_id = p.id
			LEFT JOIN gloss g ON g.phrase_id = p.id
			WHERE p.language_id = l.id AND p.deleted_at IS NULL
		) AS word_stats ON true
		LEFT JOIN LATERAL (
			SELECT COUNT(DISTINCT user_id)::int AS member_count
			FROM language_member
			WHERE language_id = l.id
		) AS member_stats ON true
		ORDER BY l.name
		`
	);

	// Get recent activity (last 7 days by language)
	const recentActivityChirho = await queryRawChirho<RecentActivityChirho>(
		`
		SELECT
			DATE(g.updated_at)::text AS "dateChirho",
			l.code AS "languageCodeChirho",
			l.name AS "languageNameChirho",
			COUNT(*)::int AS "glossCountChirho",
			COUNT(CASE WHEN g.state = 'APPROVED' THEN 1 END)::int AS "approvedCountChirho"
		FROM gloss g
		JOIN phrase p ON p.id = g.phrase_id
		JOIN language l ON l.id = p.language_id
		WHERE g.updated_at >= CURRENT_DATE - INTERVAL '7 days'
			AND p.deleted_at IS NULL
		GROUP BY DATE(g.updated_at), l.code, l.name
		ORDER BY DATE(g.updated_at) DESC, l.name
		LIMIT 50
		`
	);

	// Get top 10 languages by progress for book progress view
	const topLanguagesChirho = await queryRawChirho<{ codeChirho: string }>(
		`
		SELECT l.code AS "codeChirho"
		FROM language l
		LEFT JOIN (
			SELECT p.language_id, COUNT(DISTINCT pw.word_id) AS count
			FROM phrase p
			JOIN phrase_word pw ON pw.phrase_id = p.id
			JOIN gloss g ON g.phrase_id = p.id AND g.state = 'APPROVED'
			WHERE p.deleted_at IS NULL
			GROUP BY p.language_id
		) AS progress ON progress.language_id = l.id
		ORDER BY COALESCE(progress.count, 0) DESC
		LIMIT 5
		`
	);

	// Get book progress for top languages
	let bookProgressChirho: BookProgressChirho[] = [];
	if (topLanguagesChirho.length > 0) {
		const topCodesChirho = topLanguagesChirho.map((lChirho) => lChirho.codeChirho);

		bookProgressChirho = await queryRawChirho<BookProgressChirho>(
			`
			SELECT
				b.id::int AS "bookIdChirho",
				b.name AS "bookNameChirho",
				l.code AS "languageCodeChirho",
				COALESCE(word_counts.total, 0)::int AS "totalWordsChirho",
				COALESCE(approved_counts.approved, 0)::int AS "approvedCountChirho"
			FROM book b
			CROSS JOIN language l
			LEFT JOIN LATERAL (
				SELECT COUNT(*)::int AS total
				FROM word w
				JOIN verse v ON v.id = w.verse_id
				WHERE v.book_id = b.id
			) AS word_counts ON true
			LEFT JOIN LATERAL (
				SELECT COUNT(DISTINCT pw.word_id)::int AS approved
				FROM phrase p
				JOIN phrase_word pw ON pw.phrase_id = p.id
				JOIN gloss g ON g.phrase_id = p.id AND g.state = 'APPROVED'
				JOIN word w ON w.id = pw.word_id
				JOIN verse v ON v.id = w.verse_id
				WHERE p.language_id = l.id
					AND p.deleted_at IS NULL
					AND v.book_id = b.id
			) AS approved_counts ON true
			WHERE l.code = ANY($1)
			ORDER BY b.id, l.code
			`,
			[topCodesChirho]
		);
	}

	return {
		overviewStatsChirho: overviewStatsChirho[0] || {
			totalLanguagesChirho: 0,
			totalUsersChirho: 0,
			totalGlossesChirho: 0,
			approvedGlossesChirho: 0,
			machineGlossesChirho: 0
		},
		languageProgressChirho,
		recentActivityChirho,
		bookProgressChirho,
		topLanguagesChirho: topLanguagesChirho.map((lChirho) => lChirho.codeChirho)
	};
};
