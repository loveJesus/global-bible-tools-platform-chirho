// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { queryRawChirho, dbChirho, eqChirho } from './db-chirho';
import { languageSnapshotTableChirho } from './schema-chirho/snapshots-chirho';
import { languageTableChirho } from './schema-chirho/languages-chirho';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

// S3/MinIO client configuration
const s3ClientChirho = new S3Client({
	endpoint: env.S3_ENDPOINT || 'http://localhost:9000',
	region: env.S3_REGION || 'us-east-1',
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY || 'minioadmin',
		secretAccessKey: env.S3_SECRET_KEY || 'minioadmin'
	},
	forcePathStyle: true // Required for MinIO
});

const SNAPSHOT_BUCKET_CHIRHO = env.S3_SNAPSHOT_BUCKET || 'gbt-snapshots-chirho';

// Ensure bucket exists
async function ensureBucketExistsChirho(): Promise<void> {
	try {
		await s3ClientChirho.send(new HeadBucketCommand({ Bucket: SNAPSHOT_BUCKET_CHIRHO }));
	} catch (errorChirho: unknown) {
		if (errorChirho && typeof errorChirho === 'object' && 'name' in errorChirho && errorChirho.name === 'NotFound') {
			await s3ClientChirho.send(new CreateBucketCommand({ Bucket: SNAPSHOT_BUCKET_CHIRHO }));
		}
	}
}

// Tables to backup (in order of dependencies)
const SNAPSHOT_TABLES_CHIRHO = ['phrase', 'phrase_word', 'gloss', 'gloss_history', 'footnote', 'translator_note', 'machine_gloss'] as const;

interface SnapshotInfoChirho {
	idChirho: string;
	languageIdChirho: string;
	languageCodeChirho: string;
	languageNameChirho: string;
	timestampChirho: Date;
	statusChirho: string;
	noteChirho: string | null;
}

/**
 * Create a snapshot of all translation data for a language
 */
export async function createSnapshotChirho(
	languageCodeChirho: string,
	userIdChirho: string,
	noteChirho?: string
): Promise<SnapshotInfoChirho> {
	// Get language info
	const languageChirho = await dbChirho
		.select()
		.from(languageTableChirho)
		.where(eqChirho(languageTableChirho.codeChirho, languageCodeChirho))
		.limit(1);

	if (languageChirho.length === 0) {
		throw new Error(`Language ${languageCodeChirho} not found`);
	}

	const langChirho = languageChirho[0];

	// Create snapshot record
	const snapshotResultChirho = await dbChirho
		.insert(languageSnapshotTableChirho)
		.values({
			languageIdChirho: langChirho.idChirho,
			createdByChirho: userIdChirho,
			statusChirho: 'pending',
			noteChirho: noteChirho || null
		})
		.returning();

	const snapshotChirho = snapshotResultChirho[0];

	try {
		await ensureBucketExistsChirho();

		// Export each table
		for (const tableNameChirho of SNAPSHOT_TABLES_CHIRHO) {
			const dataChirho = await exportTableDataChirho(langChirho.idChirho, tableNameChirho);

			if (dataChirho.length > 0) {
				const jsonlChirho = dataChirho.map((rowChirho) => JSON.stringify(rowChirho)).join('\n');

				await s3ClientChirho.send(
					new PutObjectCommand({
						Bucket: SNAPSHOT_BUCKET_CHIRHO,
						Key: `${langChirho.idChirho}/${snapshotChirho.idChirho}/${tableNameChirho}.jsonl`,
						Body: jsonlChirho,
						ContentType: 'application/jsonl'
					})
				);
			}
		}

		// Mark snapshot as completed
		await dbChirho
			.update(languageSnapshotTableChirho)
			.set({ statusChirho: 'completed' })
			.where(eqChirho(languageSnapshotTableChirho.idChirho, snapshotChirho.idChirho));

		return {
			idChirho: snapshotChirho.idChirho,
			languageIdChirho: langChirho.idChirho,
			languageCodeChirho: langChirho.codeChirho,
			languageNameChirho: langChirho.nameChirho,
			timestampChirho: snapshotChirho.timestampChirho,
			statusChirho: 'completed',
			noteChirho: snapshotChirho.noteChirho
		};
	} catch (errorChirho) {
		// Mark snapshot as failed
		await dbChirho
			.update(languageSnapshotTableChirho)
			.set({ statusChirho: 'failed' })
			.where(eqChirho(languageSnapshotTableChirho.idChirho, snapshotChirho.idChirho));

		throw errorChirho;
	}
}

/**
 * Restore a snapshot
 */
export async function restoreSnapshotChirho(snapshotIdChirho: string): Promise<void> {
	// Get snapshot info
	const snapshotChirho = await queryRawChirho<{
		idChirho: string;
		languageIdChirho: string;
	}>(
		`SELECT id AS "idChirho", language_id AS "languageIdChirho"
		FROM language_snapshot_chirho
		WHERE id = $1`,
		[snapshotIdChirho]
	);

	if (snapshotChirho.length === 0) {
		throw new Error('Snapshot not found');
	}

	const languageIdChirho = snapshotChirho[0].languageIdChirho;

	// Clear existing data (in reverse order to respect foreign keys)
	for (let iChirho = SNAPSHOT_TABLES_CHIRHO.length - 1; iChirho >= 0; iChirho--) {
		const tableNameChirho = SNAPSHOT_TABLES_CHIRHO[iChirho];
		await clearTableDataChirho(languageIdChirho, tableNameChirho);
	}

	// Restore data from snapshot
	for (const tableNameChirho of SNAPSHOT_TABLES_CHIRHO) {
		try {
			const responseChirho = await s3ClientChirho.send(
				new GetObjectCommand({
					Bucket: SNAPSHOT_BUCKET_CHIRHO,
					Key: `${languageIdChirho}/${snapshotIdChirho}/${tableNameChirho}.jsonl`
				})
			);

			if (responseChirho.Body) {
				const bodyStringChirho = await responseChirho.Body.transformToString();
				const linesChirho = bodyStringChirho.trim().split('\n').filter((lineChirho) => lineChirho);
				const rowsChirho = linesChirho.map((lineChirho) => JSON.parse(lineChirho));

				if (rowsChirho.length > 0) {
					await importTableDataChirho(tableNameChirho, rowsChirho);
				}
			}
		} catch (errorChirho: unknown) {
			// File might not exist for this table (no data was exported)
			if (errorChirho && typeof errorChirho === 'object' && 'name' in errorChirho && errorChirho.name !== 'NoSuchKey') {
				throw errorChirho;
			}
		}
	}
}

/**
 * List snapshots for a language
 */
export async function listSnapshotsChirho(
	languageCodeChirho: string,
	pageChirho = 1,
	limitChirho = 10
): Promise<{ snapshotsChirho: SnapshotInfoChirho[]; totalChirho: number }> {
	const offsetChirho = (pageChirho - 1) * limitChirho;

	const snapshotsChirho = await queryRawChirho<SnapshotInfoChirho>(
		`SELECT
			s.id AS "idChirho",
			s.language_id AS "languageIdChirho",
			l.code AS "languageCodeChirho",
			l.name AS "languageNameChirho",
			s.timestamp AS "timestampChirho",
			s.status AS "statusChirho",
			s.note AS "noteChirho"
		FROM language_snapshot_chirho s
		JOIN language l ON l.id = s.language_id
		WHERE l.code = $1
		ORDER BY s.timestamp DESC
		LIMIT $2 OFFSET $3`,
		[languageCodeChirho, limitChirho, offsetChirho]
	);

	const countResultChirho = await queryRawChirho<{ countChirho: string }>(
		`SELECT COUNT(*)::text AS "countChirho"
		FROM language_snapshot_chirho s
		JOIN language l ON l.id = s.language_id
		WHERE l.code = $1`,
		[languageCodeChirho]
	);

	return {
		snapshotsChirho,
		totalChirho: parseInt(countResultChirho[0]?.countChirho || '0')
	};
}

// Helper functions for exporting/importing table data

async function exportTableDataChirho(
	languageIdChirho: string,
	tableNameChirho: string
): Promise<Record<string, unknown>[]> {
	switch (tableNameChirho) {
		case 'phrase':
			return queryRawChirho(
				`SELECT * FROM phrase WHERE language_id = $1 AND deleted_at IS NULL`,
				[languageIdChirho]
			);

		case 'phrase_word':
			return queryRawChirho(
				`SELECT pw.* FROM phrase_word pw
				JOIN phrase p ON p.id = pw.phrase_id
				WHERE p.language_id = $1 AND p.deleted_at IS NULL`,
				[languageIdChirho]
			);

		case 'gloss':
			return queryRawChirho(
				`SELECT g.* FROM gloss g
				JOIN phrase p ON p.id = g.phrase_id
				WHERE p.language_id = $1 AND p.deleted_at IS NULL`,
				[languageIdChirho]
			);

		case 'gloss_history':
			return queryRawChirho(
				`SELECT gh.* FROM gloss_history gh
				JOIN phrase p ON p.id = gh.phrase_id
				WHERE p.language_id = $1 AND p.deleted_at IS NULL`,
				[languageIdChirho]
			);

		case 'footnote':
			return queryRawChirho(
				`SELECT f.* FROM footnote f
				JOIN phrase p ON p.id = f.phrase_id
				WHERE p.language_id = $1 AND p.deleted_at IS NULL`,
				[languageIdChirho]
			);

		case 'translator_note':
			return queryRawChirho(
				`SELECT tn.* FROM translator_note tn
				JOIN phrase p ON p.id = tn.phrase_id
				WHERE p.language_id = $1 AND p.deleted_at IS NULL`,
				[languageIdChirho]
			);

		case 'machine_gloss':
			return queryRawChirho(
				`SELECT * FROM machine_gloss WHERE language_id = $1`,
				[languageIdChirho]
			);

		default:
			return [];
	}
}

async function clearTableDataChirho(
	languageIdChirho: string,
	tableNameChirho: string
): Promise<void> {
	switch (tableNameChirho) {
		case 'phrase':
			await queryRawChirho(
				`DELETE FROM phrase WHERE language_id = $1`,
				[languageIdChirho]
			);
			break;

		case 'phrase_word':
			await queryRawChirho(
				`DELETE FROM phrase_word
				WHERE EXISTS (SELECT 1 FROM phrase WHERE language_id = $1 AND phrase.id = phrase_word.phrase_id)`,
				[languageIdChirho]
			);
			break;

		case 'gloss':
			await queryRawChirho(
				`DELETE FROM gloss
				WHERE EXISTS (SELECT 1 FROM phrase WHERE language_id = $1 AND phrase.id = gloss.phrase_id)`,
				[languageIdChirho]
			);
			break;

		case 'gloss_history':
			await queryRawChirho(
				`DELETE FROM gloss_history
				WHERE EXISTS (SELECT 1 FROM phrase WHERE language_id = $1 AND phrase.id = gloss_history.phrase_id)`,
				[languageIdChirho]
			);
			break;

		case 'footnote':
			await queryRawChirho(
				`DELETE FROM footnote
				WHERE EXISTS (SELECT 1 FROM phrase WHERE language_id = $1 AND phrase.id = footnote.phrase_id)`,
				[languageIdChirho]
			);
			break;

		case 'translator_note':
			await queryRawChirho(
				`DELETE FROM translator_note
				WHERE EXISTS (SELECT 1 FROM phrase WHERE language_id = $1 AND phrase.id = translator_note.phrase_id)`,
				[languageIdChirho]
			);
			break;

		case 'machine_gloss':
			await queryRawChirho(
				`DELETE FROM machine_gloss WHERE language_id = $1`,
				[languageIdChirho]
			);
			break;
	}
}

async function importTableDataChirho(
	tableNameChirho: string,
	rowsChirho: Record<string, unknown>[]
): Promise<void> {
	if (rowsChirho.length === 0) return;

	// Get column names from first row
	const columnsChirho = Object.keys(rowsChirho[0]);
	const columnListChirho = columnsChirho.map((cChirho) => `"${cChirho}"`).join(', ');

	// Build values placeholder
	let paramCountChirho = 1;
	const valuesListChirho = rowsChirho.map((rowChirho) => {
		const placeholdersChirho = columnsChirho.map(() => `$${paramCountChirho++}`);
		return `(${placeholdersChirho.join(', ')})`;
	});

	// Flatten all values
	const allValuesChirho = rowsChirho.flatMap((rowChirho) =>
		columnsChirho.map((colChirho) => rowChirho[colChirho])
	);

	await queryRawChirho(
		`INSERT INTO ${tableNameChirho} (${columnListChirho})
		VALUES ${valuesListChirho.join(', ')}
		ON CONFLICT DO NOTHING`,
		allValuesChirho
	);
}
