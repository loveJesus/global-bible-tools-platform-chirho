// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { error as errorChirho, fail as failChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { isUserAdminChirho, isLanguageMemberChirho } from '$lib/server/auth-helpers-chirho';
import { createSnapshotChirho, restoreSnapshotChirho, listSnapshotsChirho } from '$lib/server/snapshot-service-chirho';
import { queryRawChirho } from '$lib/server/db-chirho';

const PAGE_SIZE_CHIRHO = 10;

export const load: PageServerLoadChirho = async ({ params: paramsChirho, url: urlChirho, locals: localsChirho }) => {
	const codeChirho = paramsChirho.code_chirho;
	const sessionChirho = localsChirho.sessionChirho;

	// Check authentication
	if (!sessionChirho?.userIdChirho) {
		throw redirectChirho(302, '/login-chirho');
	}

	// Check if user is admin or language member
	const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
	const isMemberChirho = await isLanguageMemberChirho(sessionChirho.userIdChirho, codeChirho);

	if (!isAdminChirho && !isMemberChirho) {
		throw errorChirho(403, 'Access denied. You must be an admin or language member.');
	}

	// Get language info
	const languageChirho = await queryRawChirho<{
		idChirho: string;
		nameChirho: string;
		codeChirho: string;
	}>(
		`SELECT id AS "idChirho", name AS "nameChirho", code AS "codeChirho"
		FROM language WHERE code = $1`,
		[codeChirho]
	);

	if (languageChirho.length === 0) {
		throw errorChirho(404, 'Language not found');
	}

	// Get page number from URL
	const pageChirho = parseInt(urlChirho.searchParams.get('page') || '1') || 1;

	// List snapshots
	const { snapshotsChirho, totalChirho } = await listSnapshotsChirho(codeChirho, pageChirho, PAGE_SIZE_CHIRHO);

	return {
		languageChirho: languageChirho[0],
		snapshotsChirho,
		totalChirho,
		pageChirho,
		pageSizeChirho: PAGE_SIZE_CHIRHO,
		isAdminChirho
	};
};

export const actions: ActionsChirho = {
	createSnapshotChirho: async ({ params: paramsChirho, locals: localsChirho, request: requestChirho }) => {
		const codeChirho = paramsChirho.code_chirho;
		const sessionChirho = localsChirho.sessionChirho;

		// Check authentication
		if (!sessionChirho?.userIdChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized' });
		}

		// Check if user is admin
		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		if (!isAdminChirho) {
			return failChirho(403, { errorChirho: 'Admin privileges required to create snapshots' });
		}

		const formDataChirho = await requestChirho.formData();
		const noteChirho = (formDataChirho.get('note') as string) || undefined;

		try {
			const snapshotChirho = await createSnapshotChirho(codeChirho, sessionChirho.userIdChirho, noteChirho);
			return {
				successChirho: true,
				messageChirho: `Snapshot created successfully at ${snapshotChirho.timestampChirho.toISOString()}`
			};
		} catch (errChirho) {
			console.error('Error creating snapshot:', errChirho);
			return failChirho(500, { errorChirho: 'Failed to create snapshot' });
		}
	},

	restoreSnapshotChirho: async ({ params: paramsChirho, locals: localsChirho, request: requestChirho }) => {
		const codeChirho = paramsChirho.code_chirho;
		const sessionChirho = localsChirho.sessionChirho;

		// Check authentication
		if (!sessionChirho?.userIdChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized' });
		}

		// Check if user is admin
		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		if (!isAdminChirho) {
			return failChirho(403, { errorChirho: 'Admin privileges required to restore snapshots' });
		}

		const formDataChirho = await requestChirho.formData();
		const snapshotIdChirho = formDataChirho.get('snapshotId') as string;

		if (!snapshotIdChirho) {
			return failChirho(400, { errorChirho: 'Snapshot ID is required' });
		}

		try {
			await restoreSnapshotChirho(snapshotIdChirho);
			return {
				successChirho: true,
				messageChirho: 'Snapshot restored successfully'
			};
		} catch (errChirho) {
			console.error('Error restoring snapshot:', errChirho);
			return failChirho(500, { errorChirho: 'Failed to restore snapshot' });
		}
	}
};
