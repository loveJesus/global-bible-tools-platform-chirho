// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

// NOTE: Raw SQL queries reference upstream database tables (language, gloss_history, etc.)
// which don't have Chirho suffix - they're from the nextjs-platform-chirho schema.

import { queryRawChirho } from '$lib/server/db-chirho';
import type {
	LanguageContributionsChirho,
	ReportingContributionChirho,
	ReportingUserChirho,
	ReportingLanguageChirho,
	ReportingBookChirho,
	ReportingProgressSnapshotChirho,
	ApprovalStatsChirho
} from '../model-chirho';

interface DbLanguageContributionsRowChirho {
	week: string;
	users: Array<{ glosses: number; userId: string }>;
}

interface DbReportingContributionRowChirho {
	id: string;
	week: string;
	languageId: string;
	userId: string;
	approvedCount: number;
	revokedCount: number;
	editedApprovedCount: number;
	editedUnapprovedCount: number;
}

interface DbReportingUserRowChirho {
	id: string;
	name: string;
	email: string;
	status: string;
}

interface DbReportingLanguageRowChirho {
	id: string;
	name: string;
	code: string;
}

interface DbReportingBookRowChirho {
	id: string;
	name: string;
	wordCount: number;
}

interface DbReportingProgressSnapshotRowChirho {
	id: string;
	week: string;
	languageId: string;
	userId?: string;
	bookId: string;
	approvedCount: string;
	unapprovedCount: string;
}

interface DbApprovalStatsRowChirho {
	chunkId: number;
	languageId: string;
	method: string;
	chunkCount: number;
	cumulativeCount: number;
	language: string;
}

export const reportingQueryServiceChirho = {
	async findContributionsByLanguageIdChirho({
		languageIdChirho,
		limitChirho
	}: {
		languageIdChirho: string;
		limitChirho: number;
	}): Promise<LanguageContributionsChirho[]> {
		const resultChirho = await queryRawChirho<DbLanguageContributionsRowChirho>(
			`
        SELECT
          week.date AS week,
          json_agg(json_build_object('glosses', approved_count, 'userId', user_id)) AS users
        FROM (
          SELECT
            (current_date - extract(dow from current_date) * interval '1 day')
              - interval '7 days' * generate_series(0, $2) AS date
        ) AS week
        LEFT JOIN weekly_contribution_statistics s
          ON s.week = week.date AND s.language_id = $1
        GROUP BY week.date
        ORDER BY week.date;
      `,
			[languageIdChirho, limitChirho - 1]
		);
		return resultChirho.map((rowChirho) => ({
			weekChirho: new Date(rowChirho.week),
			usersChirho: (rowChirho.users || []).map((userItemChirho) => ({
				glossesChirho: userItemChirho.glosses,
				userIdChirho: userItemChirho.userId
			}))
		}));
	},

	async findContributionsChirho(): Promise<ReportingContributionChirho[]> {
		const resultChirho = await queryRawChirho<DbReportingContributionRowChirho>(
			`
        SELECT
          id,
          week,
          language_id AS "languageId",
          user_id AS "userId",
          approved_count AS "approvedCount",
          revoked_count AS "revokedCount",
          edited_approved_count AS "editedApprovedCount",
          edited_unapproved_count AS "editedUnapprovedCount"
        FROM weekly_contribution_statistics
        ORDER BY week DESC, user_id, language_id
      `,
			[]
		);
		return resultChirho.map((rowChirho) => ({
			idChirho: rowChirho.id,
			weekChirho: new Date(rowChirho.week),
			languageIdChirho: rowChirho.languageId,
			userIdChirho: rowChirho.userId,
			approvedCountChirho: rowChirho.approvedCount,
			revokedCountChirho: rowChirho.revokedCount,
			editedApprovedCountChirho: rowChirho.editedApprovedCount,
			editedUnapprovedCountChirho: rowChirho.editedUnapprovedCount
		}));
	},

	async findUsersChirho(): Promise<ReportingUserChirho[]> {
		const resultChirho = await queryRawChirho<DbReportingUserRowChirho>(
			`
        SELECT
          id,
          name,
          email,
          CASE invite.is_invited
            WHEN true THEN 'invited'
            ELSE 'active'
          END AS status
        FROM users AS u
        LEFT JOIN LATERAL (
            SELECT count(*) > 0 AS is_invited
            FROM user_invitation i
            WHERE i.user_id = u.id
        ) AS invite ON true
        WHERE u.status <> 'disabled'
      `,
			[]
		);
		return resultChirho.map((rowChirho) => ({
			idChirho: rowChirho.id,
			nameChirho: rowChirho.name,
			emailChirho: rowChirho.email,
			statusChirho: rowChirho.status
		}));
	},

	async findLanguagesChirho(): Promise<ReportingLanguageChirho[]> {
		const resultChirho = await queryRawChirho<DbReportingLanguageRowChirho>(
			`SELECT id, name, code FROM language`,
			[]
		);
		return resultChirho.map((rowChirho) => ({
			idChirho: rowChirho.id,
			nameChirho: rowChirho.name,
			codeChirho: rowChirho.code
		}));
	},

	async findBooksChirho(): Promise<ReportingBookChirho[]> {
		const resultChirho = await queryRawChirho<DbReportingBookRowChirho>(
			`
        SELECT
          id,
          name,
          words.count AS "wordCount"
        FROM book
        JOIN LATERAL (
            SELECT count(*) AS count FROM word
            WHERE EXISTS (
                SELECT * FROM verse
                WHERE verse.book_id = book.id
                    AND word.verse_id = verse.id
            )
        ) AS words ON true
        ORDER BY book.id
      `,
			[]
		);
		return resultChirho.map((rowChirho) => ({
			idChirho: rowChirho.id,
			nameChirho: rowChirho.name,
			wordCountChirho: rowChirho.wordCount
		}));
	},

	async findProgressSnapshotsChirho(): Promise<ReportingProgressSnapshotChirho[]> {
		const resultChirho = await queryRawChirho<DbReportingProgressSnapshotRowChirho>(
			`
        SELECT
            id,
            week,
            language_id AS "languageId",
            user_id AS "userId",
            book_id AS "bookId",
            approved_count AS "approvedCount",
            unapproved_count AS "unapprovedCount"
        FROM weekly_gloss_statistics
        ORDER BY week DESC, language_id, book_id, user_id
      `,
			[]
		);
		return resultChirho.map((rowChirho) => ({
			idChirho: rowChirho.id,
			weekChirho: new Date(rowChirho.week),
			languageIdChirho: rowChirho.languageId,
			userIdChirho: rowChirho.userId,
			bookIdChirho: rowChirho.bookId,
			approvedCountChirho: rowChirho.approvedCount,
			unapprovedCountChirho: rowChirho.unapprovedCount
		}));
	},

	async findApprovalStatsChirho(): Promise<ApprovalStatsChirho[]> {
		const resultChirho = await queryRawChirho<DbApprovalStatsRowChirho>(
			`
        WITH data AS (
          SELECT
            language_id,
            data->>'method' AS method,
            CASE WHEN book.book_id < 40 THEN 'hebrew' ELSE 'greek' END AS language,
            created_at,
            row_number() OVER (
              PARTITION BY language_id, book_id < 40
              ORDER BY created_at
            ) AS rn
          FROM tracking_event
          JOIN LATERAL (
            SELECT verse.book_id FROM phrase_word
            JOIN word ON phrase_word.word_id = word.id
            JOIN verse ON verse.id = word.verse_id
            WHERE phrase_word.phrase_id = (data->>'phraseId')::integer
            LIMIT 1
          ) AS book ON true
        ),
        bucketed_data AS (
          SELECT *,
            (rn - 1) / 1000 AS chunk_id
          FROM data
        ),
        chunk_counts AS (
          SELECT
            language_id AS "languageId",
            chunk_id AS "chunkId",
            method,
            language,
            count(*) AS "chunkCount"
          FROM bucketed_data
          GROUP BY "languageId", "chunkId", method, language
        )
        SELECT
          cc.*,
          sum("chunkCount") OVER (
            PARTITION BY "languageId", method, language
            ORDER BY "chunkId"
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
          ) AS "cumulativeCount"
        FROM chunk_counts cc
        ORDER BY "languageId", "chunkId", language DESC, method;
      `,
			[]
		);
		return resultChirho.map((rowChirho) => ({
			chunkIdChirho: rowChirho.chunkId,
			languageIdChirho: rowChirho.languageId,
			methodChirho: rowChirho.method,
			chunkCountChirho: rowChirho.chunkCount,
			cumulativeCountChirho: rowChirho.cumulativeCount,
			languageChirho: rowChirho.language
		}));
	}
};

export default reportingQueryServiceChirho;
