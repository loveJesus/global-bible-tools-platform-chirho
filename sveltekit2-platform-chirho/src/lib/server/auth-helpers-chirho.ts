// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { queryRawChirho } from './db-chirho';

/**
 * Check if a user has admin role
 */
export async function isUserAdminChirho(userIdChirho: string): Promise<boolean> {
	const resultChirho = await queryRawChirho<{ existsChirho: boolean }>(
		`SELECT EXISTS(
			SELECT 1 FROM user_system_role
			WHERE user_id = $1 AND role = 'ADMIN'
		) AS "existsChirho"`,
		[userIdChirho]
	);
	return resultChirho[0]?.existsChirho ?? false;
}

/**
 * Check if a user is a member of a language team
 */
export async function isLanguageMemberChirho(
	userIdChirho: string,
	languageCodeChirho: string
): Promise<boolean> {
	const resultChirho = await queryRawChirho<{ existsChirho: boolean }>(
		`SELECT EXISTS(
			SELECT 1 FROM language_member lm
			JOIN language l ON l.id = lm.language_id
			WHERE lm.user_id = $1 AND l.code = $2
		) AS "existsChirho"`,
		[userIdChirho, languageCodeChirho]
	);
	return resultChirho[0]?.existsChirho ?? false;
}

/**
 * Get user's role in a language team
 */
export async function getLanguageRoleChirho(
	userIdChirho: string,
	languageCodeChirho: string
): Promise<string | null> {
	const resultChirho = await queryRawChirho<{ roleChirho: string }>(
		`SELECT lmr.role AS "roleChirho"
		FROM language_member_role lmr
		JOIN language l ON l.id = lmr.language_id
		WHERE lmr.user_id = $1 AND l.code = $2
		LIMIT 1`,
		[userIdChirho, languageCodeChirho]
	);
	return resultChirho[0]?.roleChirho ?? null;
}
