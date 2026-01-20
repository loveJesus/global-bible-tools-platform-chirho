// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { dbChirho, eqChirho, andChirho } from '$lib/server/db-chirho';
import {
	languageTableChirho,
	languageMemberTableChirho,
	languageMemberRoleTableChirho,
	userTableChirho,
	type LanguageRoleChirho
} from '$lib/server/schema-chirho';

export interface LanguageWithStatsChirho {
	idChirho: string;
	codeChirho: string;
	nameChirho: string;
	fontChirho: string;
	textDirectionChirho: 'ltr' | 'rtl';
	translationIdsChirho: string[] | null;
}

export interface LanguageMemberWithRolesChirho {
	userIdChirho: string;
	emailChirho: string;
	nameChirho: string | null;
	rolesChirho: string[];
}

/**
 * Get all languages
 */
export async function getAllLanguagesChirho(): Promise<LanguageWithStatsChirho[]> {
	const languagesChirho = await dbChirho
		.select({
			idChirho: languageTableChirho.idChirho,
			codeChirho: languageTableChirho.codeChirho,
			nameChirho: languageTableChirho.nameChirho,
			fontChirho: languageTableChirho.fontChirho,
			textDirectionChirho: languageTableChirho.textDirectionChirho,
			translationIdsChirho: languageTableChirho.translationIdsChirho
		})
		.from(languageTableChirho)
		.orderBy(languageTableChirho.nameChirho);

	return languagesChirho;
}

/**
 * Get a language by code
 */
export async function getLanguageByCodeChirho(
	codeChirho: string
): Promise<LanguageWithStatsChirho | undefined> {
	const languagesChirho = await dbChirho
		.select({
			idChirho: languageTableChirho.idChirho,
			codeChirho: languageTableChirho.codeChirho,
			nameChirho: languageTableChirho.nameChirho,
			fontChirho: languageTableChirho.fontChirho,
			textDirectionChirho: languageTableChirho.textDirectionChirho,
			translationIdsChirho: languageTableChirho.translationIdsChirho
		})
		.from(languageTableChirho)
		.where(eqChirho(languageTableChirho.codeChirho, codeChirho))
		.limit(1);

	return languagesChirho[0];
}

/**
 * Get a language by ID
 */
export async function getLanguageByIdChirho(
	idChirho: string
): Promise<LanguageWithStatsChirho | undefined> {
	const languagesChirho = await dbChirho
		.select({
			idChirho: languageTableChirho.idChirho,
			codeChirho: languageTableChirho.codeChirho,
			nameChirho: languageTableChirho.nameChirho,
			fontChirho: languageTableChirho.fontChirho,
			textDirectionChirho: languageTableChirho.textDirectionChirho,
			translationIdsChirho: languageTableChirho.translationIdsChirho
		})
		.from(languageTableChirho)
		.where(eqChirho(languageTableChirho.idChirho, idChirho))
		.limit(1);

	return languagesChirho[0];
}

/**
 * Get user's languages with their roles
 */
export async function getUserLanguagesChirho(
	userIdChirho: string
): Promise<Array<LanguageWithStatsChirho & { rolesChirho: string[] }>> {
	// Get all languages the user is a member of
	const membershipChirho = await dbChirho
		.select({
			languageIdChirho: languageMemberTableChirho.languageIdChirho
		})
		.from(languageMemberTableChirho)
		.where(eqChirho(languageMemberTableChirho.userIdChirho, userIdChirho));

	if (membershipChirho.length === 0) {
		return [];
	}

	const languageIdsChirho = membershipChirho.map((membershipItemChirho) => membershipItemChirho.languageIdChirho);

	const resultsChirho: Array<LanguageWithStatsChirho & { rolesChirho: string[] }> = [];

	for (const languageIdChirho of languageIdsChirho) {
		const languageChirho = await getLanguageByIdChirho(languageIdChirho);
		if (!languageChirho) continue;

		const rolesChirho = await dbChirho
			.select({ roleChirho: languageMemberRoleTableChirho.roleChirho })
			.from(languageMemberRoleTableChirho)
			.where(
				andChirho(
					eqChirho(languageMemberRoleTableChirho.userIdChirho, userIdChirho),
					eqChirho(languageMemberRoleTableChirho.languageIdChirho, languageIdChirho)
				)
			);

		resultsChirho.push({
			...languageChirho,
			rolesChirho: rolesChirho.map((roleItemChirho) => roleItemChirho.roleChirho)
		});
	}

	return resultsChirho;
}

/**
 * Get members of a language with their roles
 */
export async function getLanguageMembersChirho(
	languageIdChirho: string
): Promise<LanguageMemberWithRolesChirho[]> {
	const membersChirho = await dbChirho
		.select({
			userIdChirho: languageMemberTableChirho.userIdChirho,
			emailChirho: userTableChirho.emailChirho,
			nameChirho: userTableChirho.nameChirho
		})
		.from(languageMemberTableChirho)
		.innerJoin(
			userTableChirho,
			eqChirho(languageMemberTableChirho.userIdChirho, userTableChirho.idChirho)
		)
		.where(eqChirho(languageMemberTableChirho.languageIdChirho, languageIdChirho));

	const resultsChirho: LanguageMemberWithRolesChirho[] = [];

	for (const memberChirho of membersChirho) {
		const rolesChirho = await dbChirho
			.select({ roleChirho: languageMemberRoleTableChirho.roleChirho })
			.from(languageMemberRoleTableChirho)
			.where(
				andChirho(
					eqChirho(languageMemberRoleTableChirho.userIdChirho, memberChirho.userIdChirho),
					eqChirho(languageMemberRoleTableChirho.languageIdChirho, languageIdChirho)
				)
			);

		resultsChirho.push({
			...memberChirho,
			rolesChirho: rolesChirho.map((roleItemChirho) => roleItemChirho.roleChirho)
		});
	}

	return resultsChirho;
}

/**
 * Check if user has a specific role in a language
 */
export async function userHasLanguageRoleChirho(
	userIdChirho: string,
	languageIdChirho: string,
	roleChirho: LanguageRoleChirho
): Promise<boolean> {
	const rolesChirho = await dbChirho
		.select({ roleChirho: languageMemberRoleTableChirho.roleChirho })
		.from(languageMemberRoleTableChirho)
		.where(
			andChirho(
				eqChirho(languageMemberRoleTableChirho.userIdChirho, userIdChirho),
				eqChirho(languageMemberRoleTableChirho.languageIdChirho, languageIdChirho),
				eqChirho(languageMemberRoleTableChirho.roleChirho, roleChirho)
			)
		)
		.limit(1);

	return rolesChirho.length > 0;
}

/**
 * Check if user is a member of a language
 */
export async function isLanguageMemberChirho(
	userIdChirho: string,
	languageIdChirho: string
): Promise<boolean> {
	const membershipChirho = await dbChirho
		.select({ userIdChirho: languageMemberTableChirho.userIdChirho })
		.from(languageMemberTableChirho)
		.where(
			andChirho(
				eqChirho(languageMemberTableChirho.userIdChirho, userIdChirho),
				eqChirho(languageMemberTableChirho.languageIdChirho, languageIdChirho)
			)
		)
		.limit(1);

	return membershipChirho.length > 0;
}
