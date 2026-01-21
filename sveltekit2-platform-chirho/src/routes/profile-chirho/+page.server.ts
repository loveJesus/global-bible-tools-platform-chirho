// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { dbChirho, eqChirho, queryRawChirho } from '$lib/server/db-chirho';
import { userTableChirho } from '$lib/server/schema-chirho/users-chirho';
import { fail as failChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { PasswordChirho } from '$lib/modules-chirho/users-chirho/model-chirho/password-chirho';

const MAX_PICTURE_SIZE_CHIRHO = 70000; // ~50KB base64 limit

interface LanguageMembershipRowChirho {
	languageIdChirho: string;
	languageCodeChirho: string;
	languageNameChirho: string;
	roleChirho: string | null;
}

export const load: PageServerLoadChirho = async ({ locals: localsChirho }) => {
	const userChirho = localsChirho.userChirho;
	if (!userChirho) {
		throw redirectChirho(302, '/login-chirho');
	}

	// Get user's language memberships
	const languagesChirho = await queryRawChirho<LanguageMembershipRowChirho>(
		`
		SELECT
			l.id AS "languageIdChirho",
			l.code AS "languageCodeChirho",
			l.name AS "languageNameChirho",
			lmr.role AS "roleChirho"
		FROM language_member AS lm
		JOIN language AS l ON l.id = lm.language_id
		LEFT JOIN language_member_role AS lmr ON lmr.language_id = lm.language_id AND lmr.user_id = lm.user_id
		WHERE lm.user_id = $1
		ORDER BY l.name
		`,
		[userChirho.idChirho]
	);

	// Check if user is admin
	const adminCheckChirho = await queryRawChirho<{ isAdminChirho: boolean }>(
		`
		SELECT EXISTS(
			SELECT 1 FROM user_system_role
			WHERE user_id = $1 AND role = 'ADMIN'
		) AS "isAdminChirho"
		`,
		[userChirho.idChirho]
	);

	return {
		userChirho: {
			idChirho: userChirho.idChirho,
			nameChirho: userChirho.nameChirho,
			emailChirho: userChirho.emailChirho,
			emailStatusChirho: userChirho.emailStatusChirho,
			hasPasswordChirho: !!userChirho.hashedPasswordChirho,
			profilePictureChirho: userChirho.profilePictureChirho ?? null
		},
		languagesChirho,
		isAdminChirho: adminCheckChirho[0]?.isAdminChirho ?? false
	};
};

export const actions: ActionsChirho = {
	// Update profile name
	updateNameChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const userChirho = localsChirho.userChirho;
		if (!userChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await requestChirho.formData();
		const newNameChirho = formDataChirho.get('name') as string;

		if (!newNameChirho || newNameChirho.trim().length === 0) {
			return failChirho(400, { errorChirho: 'Name is required' });
		}

		try {
			await dbChirho
				.update(userTableChirho)
				.set({ nameChirho: newNameChirho.trim() })
				.where(eqChirho(userTableChirho.idChirho, userChirho.idChirho));

			return { successChirho: true, messageChirho: 'Name updated successfully' };
		} catch (errChirho) {
			console.error('Error updating name:', errChirho);
			return failChirho(500, { errorChirho: 'Failed to update name' });
		}
	},

	// Upload profile picture (base64 data URI)
	uploadPictureChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const userChirho = localsChirho.userChirho;
		if (!userChirho) {
			return failChirho(401, { pictureErrorChirho: 'Unauthorized' });
		}

		const formDataChirho = await requestChirho.formData();
		const pictureChirho = formDataChirho.get('picture') as string;

		// Validate it's a proper data URI
		if (!pictureChirho?.startsWith('data:image/jpeg;base64,')) {
			return failChirho(400, { pictureErrorChirho: 'Invalid image format. Please use JPEG.' });
		}

		// Check size (~50KB limit for base64)
		if (pictureChirho.length > MAX_PICTURE_SIZE_CHIRHO) {
			return failChirho(400, { pictureErrorChirho: 'Image too large. Please use a smaller image.' });
		}

		try {
			await dbChirho
				.update(userTableChirho)
				.set({ profilePictureChirho: pictureChirho })
				.where(eqChirho(userTableChirho.idChirho, userChirho.idChirho));

			return { pictureSuccessChirho: true, messageChirho: 'Profile picture updated' };
		} catch (errChirho) {
			console.error('Error uploading profile picture:', errChirho);
			return failChirho(500, { pictureErrorChirho: 'Failed to upload profile picture' });
		}
	},

	// Remove profile picture
	removePictureChirho: async ({ locals: localsChirho }) => {
		const userChirho = localsChirho.userChirho;
		if (!userChirho) {
			return failChirho(401, { pictureErrorChirho: 'Unauthorized' });
		}

		try {
			await dbChirho
				.update(userTableChirho)
				.set({ profilePictureChirho: null })
				.where(eqChirho(userTableChirho.idChirho, userChirho.idChirho));

			return { pictureSuccessChirho: true, messageChirho: 'Profile picture removed' };
		} catch (errChirho) {
			console.error('Error removing profile picture:', errChirho);
			return failChirho(500, { pictureErrorChirho: 'Failed to remove profile picture' });
		}
	},

	// Update password
	updatePasswordChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const userChirho = localsChirho.userChirho;
		if (!userChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await requestChirho.formData();
		const currentPasswordChirho = formDataChirho.get('currentPassword') as string;
		const newPasswordChirho = formDataChirho.get('newPassword') as string;
		const confirmPasswordChirho = formDataChirho.get('confirmPassword') as string;

		// Validate input
		if (!newPasswordChirho || newPasswordChirho.length < 8) {
			return failChirho(400, { passwordErrorChirho: 'Password must be at least 8 characters' });
		}

		if (newPasswordChirho !== confirmPasswordChirho) {
			return failChirho(400, { passwordErrorChirho: 'Passwords do not match' });
		}

		// If user has a password, verify the current one
		if (userChirho.hashedPasswordChirho) {
			if (!currentPasswordChirho) {
				return failChirho(400, { passwordErrorChirho: 'Current password is required' });
			}

			const existingPasswordChirho = new PasswordChirho({ hashChirho: userChirho.hashedPasswordChirho });
			const isValidChirho = await existingPasswordChirho.verifyChirho(currentPasswordChirho);
			if (!isValidChirho) {
				return failChirho(400, { passwordErrorChirho: 'Current password is incorrect' });
			}
		}

		try {
			const newPasswordObjChirho = await PasswordChirho.createChirho(newPasswordChirho);
			const hashedChirho = newPasswordObjChirho.hashChirho;

			await dbChirho
				.update(userTableChirho)
				.set({ hashedPasswordChirho: hashedChirho })
				.where(eqChirho(userTableChirho.idChirho, userChirho.idChirho));

			return { passwordSuccessChirho: true, messageChirho: 'Password updated successfully' };
		} catch (errChirho) {
			console.error('Error updating password:', errChirho);
			return failChirho(500, { passwordErrorChirho: 'Failed to update password' });
		}
	}
};
