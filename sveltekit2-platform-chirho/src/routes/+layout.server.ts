// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { LayoutServerLoad as LayoutServerLoadChirho } from './$types';
import { loadTranslationsChirho, defaultLocaleChirho } from '$lib/i18n-chirho';
import { isUserAdminChirho } from '$lib/server/auth-helpers-chirho';

export const load: LayoutServerLoadChirho = async ({ locals: localsChirho, url: urlChirho }) => {
	const { pathname: pathnameChirho } = urlChirho;

	// Load translations for the current route
	await loadTranslationsChirho(defaultLocaleChirho, pathnameChirho);

	let isAdminChirho = false;
	if (localsChirho.userChirho) {
		isAdminChirho = await isUserAdminChirho(localsChirho.userChirho.idChirho);
	}

	return {
		userChirho: localsChirho.userChirho
			? {
					idChirho: localsChirho.userChirho.idChirho,
					nameChirho: localsChirho.userChirho.nameChirho,
					emailChirho: localsChirho.userChirho.emailChirho,
					isAdminChirho
				}
			: null,
		localeChirho: defaultLocaleChirho
	};
};
