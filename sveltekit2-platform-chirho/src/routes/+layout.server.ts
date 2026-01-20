// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { LayoutServerLoad as LayoutServerLoadChirho } from './$types';

export const load: LayoutServerLoadChirho = async ({ locals: localsChirho }) => {
	return {
		userChirho: localsChirho.userChirho
			? {
					idChirho: localsChirho.userChirho.idChirho,
					nameChirho: localsChirho.userChirho.nameChirho,
					emailChirho: localsChirho.userChirho.emailChirho
				}
			: null
	};
};
