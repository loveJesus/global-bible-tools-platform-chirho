// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { Handle as HandleChirho } from '@sveltejs/kit';

export const handle: HandleChirho = async ({ event: eventChirho, resolve: resolveChirho }) => {
	// Locale from cookie (no auth — read-only platform)
	const savedLocaleChirho = eventChirho.cookies.get('locale');
	const supportedLocalesChirho = ['en', 'es', 'hi', 'fr', 'de', 'pt', 'ru', 'zh', 'ar', 'ja', 'ko', 'id', 'it', 'nl'];
	eventChirho.locals.localeChirho = savedLocaleChirho && supportedLocalesChirho.includes(savedLocaleChirho)
		? savedLocaleChirho
		: 'en';

	const responseChirho = await resolveChirho(eventChirho);
	return responseChirho;
};
