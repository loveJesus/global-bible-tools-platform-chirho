// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { LayoutLoad as LayoutLoadChirho } from './$types';
import { loadTranslationsChirho } from '$lib/i18n-chirho';

export const load: LayoutLoadChirho = async ({ data: dataChirho, url: urlChirho }) => {
	const localeChirho = dataChirho.localeChirho ?? 'en';
	await loadTranslationsChirho(localeChirho, urlChirho.pathname);
	return {
		...dataChirho
	};
};
