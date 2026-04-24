// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { LayoutServerLoad as LayoutServerLoadChirho } from './$types';
import { defaultLocaleChirho } from '$lib/i18n-chirho';

export const load: LayoutServerLoadChirho = async ({ locals: localsChirho }) => {
	return {
		localeChirho: localsChirho.localeChirho ?? defaultLocaleChirho
	};
};
