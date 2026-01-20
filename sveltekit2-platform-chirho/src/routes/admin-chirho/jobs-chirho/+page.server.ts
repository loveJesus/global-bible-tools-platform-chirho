// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { queryRawChirho } from '$lib/server/db-chirho';
import { error as errorChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { isUserAdminChirho } from '$lib/server/auth-helpers-chirho';

interface ImportJobRowChirho {
	languageIdChirho: string;
	languageCodeChirho: string;
	languageNameChirho: string;
	startDateChirho: string;
	endDateChirho: string | null;
	succeededChirho: boolean | null;
	userNameChirho: string | null;
	userEmailChirho: string | null;
	durationSecondsChirho: number | null;
}

export const load: PageServerLoadChirho = async ({ locals: localsChirho }) => {
	// Check authentication
	const sessionChirho = localsChirho.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		throw redirectChirho(302, '/login-chirho');
	}

	// Check admin role
	const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
	if (!isAdminChirho) {
		throw errorChirho(403, 'Access denied. Admin privileges required.');
	}

	// Get all import jobs with language and user info
	const jobsChirho = await queryRawChirho<ImportJobRowChirho>(
		`
		SELECT
			j.language_id AS "languageIdChirho",
			l.code AS "languageCodeChirho",
			l.name AS "languageNameChirho",
			j.start_date AS "startDateChirho",
			j.end_date AS "endDateChirho",
			j.succeeded AS "succeededChirho",
			u.name AS "userNameChirho",
			u.email AS "userEmailChirho",
			CASE WHEN j.end_date IS NOT NULL
				THEN EXTRACT(EPOCH FROM (j.end_date - j.start_date))::int
				ELSE NULL
			END AS "durationSecondsChirho"
		FROM language_import_job AS j
		JOIN language AS l ON l.id = j.language_id
		LEFT JOIN users AS u ON u.id = j.user_id
		ORDER BY j.start_date DESC
		LIMIT 100
		`
	);

	// Get summary stats
	const statsChirho = await queryRawChirho<{
		totalJobsChirho: number;
		successfulJobsChirho: number;
		failedJobsChirho: number;
		pendingJobsChirho: number;
	}>(
		`
		SELECT
			COUNT(*)::int AS "totalJobsChirho",
			COUNT(CASE WHEN succeeded = true THEN 1 END)::int AS "successfulJobsChirho",
			COUNT(CASE WHEN succeeded = false THEN 1 END)::int AS "failedJobsChirho",
			COUNT(CASE WHEN succeeded IS NULL AND end_date IS NULL THEN 1 END)::int AS "pendingJobsChirho"
		FROM language_import_job
		`
	);

	return {
		jobsChirho,
		statsChirho: statsChirho[0] ?? {
			totalJobsChirho: 0,
			successfulJobsChirho: 0,
			failedJobsChirho: 0,
			pendingJobsChirho: 0
		}
	};
};
