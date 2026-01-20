// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { LayoutServerLoad as LayoutServerLoadChirho } from './$types';
import { loadTranslationsChirho, defaultLocaleChirho } from '$lib/i18n-chirho';
import { isUserAdminChirho } from '$lib/server/auth-helpers-chirho';

export const load: LayoutServerLoadChirho = async ({ locals: localsChirho, url: urlChirho, cookies: cookiesChirho }) => {
	const { pathname: pathnameChirho } = urlChirho;

	// Get locale from cookie or use default
	const savedLocaleChirho = cookiesChirho.get('locale');
	const supportedLocalesChirho = ['en', 'es', 'hi'];
	const currentLocaleChirho = savedLocaleChirho && supportedLocalesChirho.includes(savedLocaleChirho)
		? savedLocaleChirho
		: defaultLocaleChirho;

	// Load translations for the current route
	await loadTranslationsChirho(currentLocaleChirho, pathnameChirho);

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
		localeChirho: currentLocaleChirho
	};
};
