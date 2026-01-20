// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { dbChirho } from '$lib/server/db-chirho';
import { languageTableChirho } from '$lib/server/schema-chirho';

export const load: PageServerLoadChirho = async () => {
	const languagesChirho = await dbChirho
		.select({
			idChirho: languageTableChirho.idChirho,
			codeChirho: languageTableChirho.codeChirho,
			nameChirho: languageTableChirho.nameChirho
		})
		.from(languageTableChirho)
		.orderBy(languageTableChirho.nameChirho);

	return {
		languagesChirho
	};
};
