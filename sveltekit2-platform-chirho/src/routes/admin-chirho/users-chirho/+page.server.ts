// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { dbChirho, eqChirho, queryRawChirho } from '$lib/server/db-chirho';
import { userTableChirho, userSystemRoleTableChirho } from '$lib/server/schema-chirho/users-chirho';
import { error as errorChirho, fail as failChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { isUserAdminChirho } from '$lib/server/auth-helpers-chirho';

interface UserWithRolesRowChirho {
	idChirho: string;
	nameChirho: string | null;
	emailChirho: string;
	emailStatusChirho: string;
	statusChirho: string;
	isAdminChirho: boolean;
	languageCountChirho: number;
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

	// Get all users with their roles and language memberships
	const usersChirho = await queryRawChirho<UserWithRolesRowChirho>(
		`
		SELECT
			u.id AS "idChirho",
			u.name AS "nameChirho",
			u.email AS "emailChirho",
			u.email_status AS "emailStatusChirho",
			u.status AS "statusChirho",
			COALESCE(admin_role.is_admin, false) AS "isAdminChirho",
			COALESCE(lang_count.count, 0)::int AS "languageCountChirho"
		FROM users AS u
		LEFT JOIN (
			SELECT user_id, true AS is_admin
			FROM user_system_role
			WHERE role = 'ADMIN'
		) AS admin_role ON admin_role.user_id = u.id
		LEFT JOIN (
			SELECT user_id, COUNT(DISTINCT language_id)::int AS count
			FROM language_member
			GROUP BY user_id
		) AS lang_count ON lang_count.user_id = u.id
		ORDER BY u.name, u.email
		`
	);

	return {
		usersChirho,
		currentUserIdChirho: sessionChirho.userIdChirho
	};
};

export const actions: ActionsChirho = {
	// Toggle admin role
	toggleAdminChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const sessionChirho = localsChirho.sessionChirho;
		if (!sessionChirho?.userIdChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized' });
		}

		// Verify admin role
		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		if (!isAdminChirho) {
			return failChirho(403, { errorChirho: 'Admin privileges required' });
		}

		const formDataChirho = await requestChirho.formData();
		const userIdChirho = formDataChirho.get('userId') as string;
		const makeAdminChirho = formDataChirho.get('makeAdmin') === 'true';

		if (!userIdChirho) {
			return failChirho(400, { errorChirho: 'User ID is required' });
		}

		// Don't allow users to modify their own admin status
		if (userIdChirho === sessionChirho.userIdChirho) {
			return failChirho(400, { errorChirho: "You cannot modify your own admin status" });
		}

		try {
			if (makeAdminChirho) {
				// Add admin role
				await dbChirho
					.insert(userSystemRoleTableChirho)
					.values({
						userIdChirho: userIdChirho,
						roleChirho: 'ADMIN'
					})
					.onConflictDoNothing();
			} else {
				// Remove admin role
				await dbChirho
					.delete(userSystemRoleTableChirho)
					.where(eqChirho(userSystemRoleTableChirho.userIdChirho, userIdChirho));
			}

			return { successChirho: true, messageChirho: makeAdminChirho ? 'Admin role granted' : 'Admin role removed' };
		} catch (errChirho) {
			console.error('Error toggling admin role:', errChirho);
			return failChirho(500, { errorChirho: 'Failed to update role' });
		}
	},

	// Toggle user status (active/disabled)
	toggleStatusChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const sessionChirho = localsChirho.sessionChirho;
		if (!sessionChirho?.userIdChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized' });
		}

		// Verify admin role
		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		if (!isAdminChirho) {
			return failChirho(403, { errorChirho: 'Admin privileges required' });
		}

		const formDataChirho = await requestChirho.formData();
		const userIdChirho = formDataChirho.get('userId') as string;
		const newStatusChirho = formDataChirho.get('status') as 'active' | 'disabled';

		if (!userIdChirho || !newStatusChirho) {
			return failChirho(400, { errorChirho: 'User ID and status are required' });
		}

		// Don't allow users to disable themselves
		if (userIdChirho === sessionChirho.userIdChirho) {
			return failChirho(400, { errorChirho: "You cannot modify your own status" });
		}

		try {
			await dbChirho
				.update(userTableChirho)
				.set({ statusChirho: newStatusChirho })
				.where(eqChirho(userTableChirho.idChirho, userIdChirho));

			return { successChirho: true, messageChirho: `User ${newStatusChirho === 'active' ? 'enabled' : 'disabled'}` };
		} catch (errChirho) {
			console.error('Error updating user status:', errChirho);
			return failChirho(500, { errorChirho: 'Failed to update status' });
		}
	}
};
