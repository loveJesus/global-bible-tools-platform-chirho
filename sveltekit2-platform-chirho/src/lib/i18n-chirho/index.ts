// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import i18nChirho from 'sveltekit-i18n';
import type { Config as ConfigChirho } from 'sveltekit-i18n';

const configChirho: ConfigChirho = {
	fallbackLocale: 'en',
	loaders: [
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./messages-chirho/en-chirho/common-chirho.json')).default
		}
	]
};

export const {
	t: tChirho,
	locale: localeChirho,
	locales: localesChirho,
	loading: loadingChirho,
	loadTranslations: loadTranslationsChirho
} = new i18nChirho(configChirho);

// Default locale
export const defaultLocaleChirho = 'en';

// Available locales
export const availableLocalesChirho = [
	{ codeChirho: 'en', nameChirho: 'English' }
];
