// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Import all translation SQL files from translations-chirho/ into the database.
 * Runs each SQL file through docker exec psql.
 *
 * Usage:
 *   bun run tools-chirho/import-translations-chirho.ts [--dry-run]
 */

import { readdir as readdirChirho, stat as statChirho } from 'node:fs/promises';
import { join as joinPathChirho } from 'node:path';
import { spawn as spawnChirho } from 'node:child_process';

const TRANSLATIONS_DIR_CHIRHO = '/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho/translations-chirho';
const CONTAINER_NAME_CHIRHO = 'sveltekit2-platform-chirho-db-chirho-1';

interface ImportResultChirho {
	fileChirho: string;
	successChirho: boolean;
	errorChirho?: string;
}

async function findSqlFilesChirho(dirChirho: string): Promise<string[]> {
	const filesChirho: string[] = [];
	const entriesChirho = await readdirChirho(dirChirho, { withFileTypes: true });

	for (const entryChirho of entriesChirho) {
		const fullPathChirho = joinPathChirho(dirChirho, entryChirho.name);

		if (entryChirho.isDirectory()) {
			// Recurse into subdirectories
			const subFilesChirho = await findSqlFilesChirho(fullPathChirho);
			filesChirho.push(...subFilesChirho);
		} else if (entryChirho.name.endsWith('.sql') && entryChirho.name !== 'all-verses-chirho.sql') {
			// Skip combined files, we want individual verse files for incremental import
			// Actually, let's use all-verses-chirho.sql for efficiency if it exists
			filesChirho.push(fullPathChirho);
		}
	}

	return filesChirho;
}

async function findCombinedFilesChirho(dirChirho: string): Promise<string[]> {
	const filesChirho: string[] = [];
	const entriesChirho = await readdirChirho(dirChirho, { withFileTypes: true });

	for (const entryChirho of entriesChirho) {
		const fullPathChirho = joinPathChirho(dirChirho, entryChirho.name);

		if (entryChirho.isDirectory()) {
			// Check for all-verses-chirho.sql in each book directory
			const combinedPathChirho = joinPathChirho(fullPathChirho, 'all-verses-chirho.sql');
			try {
				await statChirho(combinedPathChirho);
				filesChirho.push(combinedPathChirho);
			} catch {
				// No combined file, will use individual files
			}
		} else if (entryChirho.name.endsWith('.sql') && !entryChirho.name.startsWith('c0')) {
			// Top-level SQL files (like spa-psalm1-jude-chirho.sql)
			filesChirho.push(fullPathChirho);
		}
	}

	return filesChirho;
}

async function importSqlFileChirho(filePathChirho: string, dryRunChirho: boolean): Promise<ImportResultChirho> {
	const fileNameChirho = filePathChirho.split('/').pop() || filePathChirho;

	if (dryRunChirho) {
		console.log(`[DRY RUN] Would import: ${fileNameChirho}`);
		return { fileChirho: filePathChirho, successChirho: true };
	}

	try {
		// Read file content
		const contentChirho = await Bun.file(filePathChirho).text();

		// Spawn docker exec and pipe SQL content
		return new Promise((resolveChirho) => {
			const procChirho = spawnChirho('docker', ['exec', '-i', CONTAINER_NAME_CHIRHO, 'psql', '-U', 'postgres', '-q'], {
				stdio: ['pipe', 'pipe', 'pipe']
			});

			let stderrChirho = '';

			procChirho.stderr.on('data', (dataChirho: Buffer) => {
				stderrChirho += dataChirho.toString();
			});

			procChirho.on('close', (codeChirho: number | null) => {
				if (codeChirho === 0) {
					resolveChirho({ fileChirho: filePathChirho, successChirho: true });
				} else {
					resolveChirho({
						fileChirho: filePathChirho,
						successChirho: false,
						errorChirho: stderrChirho || `Exit code: ${codeChirho}`
					});
				}
			});

			procChirho.on('error', (errChirho: Error) => {
				resolveChirho({
					fileChirho: filePathChirho,
					successChirho: false,
					errorChirho: errChirho.message
				});
			});

			// Write SQL content to stdin
			procChirho.stdin.write(contentChirho);
			procChirho.stdin.end();
		});
	} catch (errChirho) {
		return {
			fileChirho: filePathChirho,
			successChirho: false,
			errorChirho: errChirho instanceof Error ? errChirho.message : String(errChirho)
		};
	}
}

async function mainChirho(): Promise<void> {
	const dryRunChirho = process.argv.includes('--dry-run');

	console.log('Finding translation SQL files...');

	// First try combined files for efficiency
	const combinedFilesChirho = await findCombinedFilesChirho(TRANSLATIONS_DIR_CHIRHO);
	console.log(`Found ${combinedFilesChirho.length} combined/top-level SQL files`);

	// Track which directories have combined files
	const coveredDirsChirho = new Set<string>();
	for (const fileChirho of combinedFilesChirho) {
		const dirChirho = fileChirho.replace('/all-verses-chirho.sql', '');
		if (fileChirho.includes('all-verses-chirho.sql')) {
			coveredDirsChirho.add(dirChirho);
		}
	}

	// Find individual files for directories without combined files
	const allFilesChirho: string[] = [...combinedFilesChirho];
	const entriesChirho = await readdirChirho(TRANSLATIONS_DIR_CHIRHO, { withFileTypes: true });

	for (const entryChirho of entriesChirho) {
		if (entryChirho.isDirectory()) {
			const dirPathChirho = joinPathChirho(TRANSLATIONS_DIR_CHIRHO, entryChirho.name);
			if (!coveredDirsChirho.has(dirPathChirho)) {
				// This directory doesn't have a combined file, find individual verse files
				const indivFilesChirho = await findSqlFilesChirho(dirPathChirho);
				allFilesChirho.push(...indivFilesChirho);
			}
		}
	}

	console.log(`Total files to import: ${allFilesChirho.length}`);

	if (dryRunChirho) {
		console.log('\n[DRY RUN MODE - No changes will be made]\n');
	}

	let successCountChirho = 0;
	let failCountChirho = 0;
	const failedFilesChirho: ImportResultChirho[] = [];

	for (let iChirho = 0; iChirho < allFilesChirho.length; iChirho++) {
		const fileChirho = allFilesChirho[iChirho];
		const fileNameChirho = fileChirho.split('/').slice(-2).join('/');

		process.stdout.write(`\r[${iChirho + 1}/${allFilesChirho.length}] Importing ${fileNameChirho}...`.padEnd(80));

		const resultChirho = await importSqlFileChirho(fileChirho, dryRunChirho);

		if (resultChirho.successChirho) {
			successCountChirho++;
		} else {
			failCountChirho++;
			failedFilesChirho.push(resultChirho);
		}
	}

	console.log('\n');
	console.log('='.repeat(60));
	console.log(`Import complete!`);
	console.log(`  Success: ${successCountChirho}`);
	console.log(`  Failed:  ${failCountChirho}`);

	if (failedFilesChirho.length > 0) {
		console.log('\nFailed files:');
		for (const failedChirho of failedFilesChirho.slice(0, 10)) {
			console.log(`  - ${failedChirho.fileChirho}`);
			console.log(`    Error: ${failedChirho.errorChirho?.slice(0, 200)}`);
		}
		if (failedFilesChirho.length > 10) {
			console.log(`  ... and ${failedFilesChirho.length - 10} more`);
		}
	}
}

mainChirho().catch((errChirho) => {
	console.error('Import failed:', errChirho);
	process.exit(1);
});
