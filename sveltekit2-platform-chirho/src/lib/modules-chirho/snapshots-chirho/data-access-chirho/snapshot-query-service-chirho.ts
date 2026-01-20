// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { queryRawChirho } from '$lib/server/db-chirho';
import { SNAPSHOT_JOB_TYPES_CHIRHO } from '../jobs-chirho/job-types-chirho';
import type {
	SnapshotChirho,
	SnapshotPageChirho,
	SnapshotJobChirho,
	PaginatedSnapshotChirho
} from '../model-chirho';

interface DbSnapshotPageRowChirho {
	total: string;
	page: Array<{ id: string; timestamp: string }>;
}

interface DbSnapshotRowChirho {
	id: string;
	languageId: string;
	timestamp: string;
}

interface DbSnapshotJobRowChirho {
	id: string;
	type: string;
}

export const snapshotQueryServiceChirho = {
	async findSnapshotsForLanguageChirho({
		pageChirho,
		limitChirho = 10,
		languageIdChirho
	}: {
		pageChirho: number;
		limitChirho?: number;
		languageIdChirho: string;
	}): Promise<SnapshotPageChirho> {
		const resultChirho = await queryRawChirho<DbSnapshotPageRowChirho>(
			`
        SELECT
          (
              SELECT count(*) FROM language_snapshot
              WHERE language_id = $1
          ) AS total,
          (
            SELECT
              coalesce(json_agg(p.json), '[]')
            FROM (
              SELECT
                json_build_object(
                  'id', id,
                  'timestamp', timestamp
                ) AS json
              FROM language_snapshot
              WHERE language_id = $1
              ORDER BY timestamp DESC
              OFFSET $2
              LIMIT $3
            ) AS p
          ) AS page
      `,
			[languageIdChirho, limitChirho * (pageChirho - 1), limitChirho]
		);

		const rowChirho = resultChirho[0];
		return {
			totalChirho: parseInt(rowChirho.total, 10),
			pageChirho: (rowChirho.page || []).map(
				(snapshotItemChirho): PaginatedSnapshotChirho => ({
					idChirho: snapshotItemChirho.id,
					timestampChirho: new Date(snapshotItemChirho.timestamp)
				})
			)
		};
	},

	async findForLanguageByIdChirho(
		languageCodeChirho: string,
		snapshotIdChirho: string
	): Promise<SnapshotChirho | undefined> {
		const resultChirho = await queryRawChirho<DbSnapshotRowChirho>(
			`
        SELECT
          id,
          language_id AS "languageId",
          timestamp
        FROM language_snapshot
        WHERE id = $2
          AND language_id = (SELECT id FROM language WHERE code = $1)
      `,
			[languageCodeChirho, snapshotIdChirho]
		);

		if (resultChirho.length === 0) {
			return undefined;
		}

		const rowChirho = resultChirho[0];
		return {
			idChirho: rowChirho.id,
			languageIdChirho: rowChirho.languageId,
			timestampChirho: new Date(rowChirho.timestamp)
		};
	},

	async findByIdChirho(snapshotIdChirho: string): Promise<SnapshotChirho | undefined> {
		const resultChirho = await queryRawChirho<DbSnapshotRowChirho>(
			`
        SELECT
          id,
          language_id AS "languageId",
          timestamp
        FROM language_snapshot
        WHERE id = $1
      `,
			[snapshotIdChirho]
		);

		if (resultChirho.length === 0) {
			return undefined;
		}

		const rowChirho = resultChirho[0];
		return {
			idChirho: rowChirho.id,
			languageIdChirho: rowChirho.languageId,
			timestampChirho: new Date(rowChirho.timestamp)
		};
	},

	async findPendingSnapshotJobForLanguageChirho({
		languageIdChirho
	}: {
		languageIdChirho: string;
	}): Promise<SnapshotJobChirho | undefined> {
		const resultChirho = await queryRawChirho<DbSnapshotJobRowChirho>(
			`
        SELECT
          id,
          (SELECT name FROM job_type WHERE job_type.id = job.type_id) AS type
        FROM job
        WHERE
          type_id IN (
            SELECT id FROM job_type
            WHERE name IN ($2, $3)
          )
          AND payload->>'languageId' = $1
          AND status IN ('pending', 'in-progress')
      `,
			[
				languageIdChirho,
				SNAPSHOT_JOB_TYPES_CHIRHO.CREATE_SNAPSHOT_CHIRHO,
				SNAPSHOT_JOB_TYPES_CHIRHO.RESTORE_SNAPSHOT_CHIRHO
			]
		);

		if (resultChirho.length === 0) {
			return undefined;
		}

		const rowChirho = resultChirho[0];
		return {
			idChirho: rowChirho.id,
			typeChirho: rowChirho.type
		};
	}
};

export default snapshotQueryServiceChirho;
