// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { SystemRoleRawChirho } from '$lib/modules-chirho/users-chirho/model-chirho';

export interface ActorClaimsChirho {
	idChirho: string;
	systemRolesChirho: SystemRoleRawChirho[];
}

export interface LanguageClaimsChirho {
	codeChirho: string;
	isMemberChirho: boolean;
}
