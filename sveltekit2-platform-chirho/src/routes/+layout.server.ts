// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { LayoutServerLoad as LayoutServerLoadChirho } from './$types';
import { loadTranslationsChirho, defaultLocaleChirho } from '$lib/i18n-chirho';

export const load: LayoutServerLoadChirho = async ({ locals: localsChirho, url: urlChirho }) => {
	const { pathname: pathnameChirho } = urlChirho;

	// Load translations for the current route
	await loadTranslationsChirho(defaultLocaleChirho, pathnameChirho);

	return {
		userChirho: localsChirho.userChirho
			? {
					idChirho: localsChirho.userChirho.idChirho,
					nameChirho: localsChirho.userChirho.nameChirho,
					emailChirho: localsChirho.userChirho.emailChirho
				}
			: null,
		localeChirho: defaultLocaleChirho
	};
};
