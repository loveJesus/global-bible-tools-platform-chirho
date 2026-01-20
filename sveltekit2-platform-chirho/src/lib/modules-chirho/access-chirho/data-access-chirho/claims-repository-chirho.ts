// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { dbChirho, eqChirho, andChirho } from '$lib/server/db-chirho';
import {
	userSystemRoleTableChirho,
	languageMemberTableChirho,
	languageTableChirho
} from '$lib/server/schema-chirho';
import type { ActorClaimsChirho, LanguageClaimsChirho } from '../model-chirho';
import type { SystemRoleRawChirho } from '$lib/modules-chirho/users-chirho/model-chirho';

export const claimsRepositoryChirho = {
	async findActorClaimsChirho(userIdChirho: string): Promise<ActorClaimsChirho> {
		const resultChirho = await dbChirho
			.select({
				roleChirho: userSystemRoleTableChirho.roleChirho
			})
			.from(userSystemRoleTableChirho)
			.where(eqChirho(userSystemRoleTableChirho.userIdChirho, userIdChirho));

		return {
			idChirho: userIdChirho,
			systemRolesChirho: resultChirho.map((roleItemChirho) => roleItemChirho.roleChirho as SystemRoleRawChirho)
		};
	},

	async findLanguageClaimsChirho(
		languageCodeChirho: string,
		actorIdChirho: string
	): Promise<LanguageClaimsChirho> {
		// First get the language ID for the code
		const languageChirho = await dbChirho
			.select({ idChirho: languageTableChirho.idChirho })
			.from(languageTableChirho)
			.where(eqChirho(languageTableChirho.codeChirho, languageCodeChirho))
			.limit(1);

		if (languageChirho.length === 0) {
			return {
				codeChirho: languageCodeChirho,
				isMemberChirho: false
			};
		}

		const membershipChirho = await dbChirho
			.select({ userIdChirho: languageMemberTableChirho.userIdChirho })
			.from(languageMemberTableChirho)
			.where(
				andChirho(
					eqChirho(languageMemberTableChirho.userIdChirho, actorIdChirho),
					eqChirho(languageMemberTableChirho.languageIdChirho, languageChirho[0].idChirho)
				)
			)
			.limit(1);

		return {
			codeChirho: languageCodeChirho,
			isMemberChirho: membershipChirho.length > 0
		};
	}
};

export default claimsRepositoryChirho;
