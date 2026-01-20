// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { dbChirho, countChirho } from '$lib/server/db-chirho';
import { bookTableChirho } from '$lib/server/schema-chirho';

export const load: PageServerLoadChirho = async () => {
	try {
		const resultChirho = await dbChirho
			.select({ countChirho: countChirho() })
			.from(bookTableChirho);

		return {
			booksCountChirho: resultChirho[0]?.countChirho ?? 0
		};
	} catch (errorChirho) {
		console.error('Database connection error:', errorChirho);
		return {
			booksCountChirho: 0
		};
	}
};
