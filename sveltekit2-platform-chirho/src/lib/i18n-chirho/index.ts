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
		},
		{
			locale: 'en',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/en-chirho/landing-chirho.json')).default
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

// Available UI locales (for the language switcher)
export interface UiLocaleChirho {
	codeChirho: string;
	nameChirho: string;
	nativeNameChirho: string;
	dirChirho: 'ltr' | 'rtl';
}

export const availableLocalesChirho: UiLocaleChirho[] = [
	{ codeChirho: 'en', nameChirho: 'English', nativeNameChirho: 'English', dirChirho: 'ltr' },
	{ codeChirho: 'es', nameChirho: 'Spanish', nativeNameChirho: 'Español', dirChirho: 'ltr' },
	{ codeChirho: 'ar', nameChirho: 'Arabic', nativeNameChirho: 'اَلْعَرَبِيَّةُ', dirChirho: 'rtl' },
	{ codeChirho: 'hi', nameChirho: 'Hindi', nativeNameChirho: 'हिन्दी', dirChirho: 'ltr' },
	{ codeChirho: 'zh', nameChirho: 'Chinese', nativeNameChirho: '中文', dirChirho: 'ltr' },
	{ codeChirho: 'fr', nameChirho: 'French', nativeNameChirho: 'Français', dirChirho: 'ltr' },
	{ codeChirho: 'de', nameChirho: 'German', nativeNameChirho: 'Deutsch', dirChirho: 'ltr' },
	{ codeChirho: 'pt', nameChirho: 'Portuguese', nativeNameChirho: 'Português', dirChirho: 'ltr' }
];
