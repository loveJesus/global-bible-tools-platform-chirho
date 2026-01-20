// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { dbChirho, eqChirho } from '$lib/server/db-chirho';
import { languageTableChirho, bookTableChirho } from '$lib/server/schema-chirho';
import { error as errorChirho, redirect as redirectChirho } from '@sveltejs/kit';

export const load: PageServerLoadChirho = async ({ params: paramsChirho, locals: localsChirho }) => {
	// Require authentication for translate pages
	if (!localsChirho.userChirho) {
		throw redirectChirho(302, '/login-chirho');
	}
	const codeChirho = paramsChirho.code_chirho;

	// Get language
	const languageResultChirho = await dbChirho
		.select()
		.from(languageTableChirho)
		.where(eqChirho(languageTableChirho.codeChirho, codeChirho))
		.limit(1);

	const languageChirho = languageResultChirho[0];
	if (!languageChirho) {
		throw errorChirho(404, `Language '${codeChirho}' not found`);
	}

	// Get all books
	const booksChirho = await dbChirho
		.select()
		.from(bookTableChirho)
		.orderBy(bookTableChirho.idChirho);

	return {
		codeChirho,
		languageChirho,
		booksChirho
	};
};
