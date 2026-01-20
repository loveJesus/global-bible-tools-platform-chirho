// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { SystemRoleRawChirho } from '$lib/modules-chirho/users-chirho/model-chirho';
import { claimsRepositoryChirho } from './data-access-chirho/claims-repository-chirho';

export interface PolicyOptionsChirho {
	systemRolesChirho?: SystemRoleRawChirho[];
	languageMemberChirho?: boolean;
}

export interface AuthorizationContextChirho {
	actorIdChirho?: string;
	languageCodeChirho?: string;
}

export class PolicyChirho {
	constructor(private readonly optionsChirho: PolicyOptionsChirho) {}

	async authorizeChirho(contextChirho: AuthorizationContextChirho): Promise<boolean> {
		if (!contextChirho.actorIdChirho) return false;

		const [actorChirho, languageChirho] = await Promise.all([
			claimsRepositoryChirho.findActorClaimsChirho(contextChirho.actorIdChirho),
			contextChirho.languageCodeChirho
				? claimsRepositoryChirho.findLanguageClaimsChirho(
						contextChirho.languageCodeChirho,
						contextChirho.actorIdChirho
					)
				: undefined
		]);

		const systemRoleMatchesChirho = this.optionsChirho.systemRolesChirho?.some((roleChirho) =>
			actorChirho.systemRolesChirho.includes(roleChirho)
		);

		const languageRoleMatchesChirho = this.optionsChirho.languageMemberChirho
			? languageChirho?.isMemberChirho
			: false;

		return (systemRoleMatchesChirho || languageRoleMatchesChirho) ?? false;
	}

	static SystemRoleChirho = SystemRoleRawChirho;
}

export default PolicyChirho;
