// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import i18nChirho from 'sveltekit-i18n';
import type { Config as ConfigChirho } from 'sveltekit-i18n';

const configChirho: ConfigChirho = {
	fallbackLocale: 'en',
	loaders: [
		// English
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./messages-chirho/en-chirho/common-chirho.json')).default
		},
		{
			locale: 'en',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/en-chirho/landing-chirho.json')).default
		},
		{
			locale: 'en',
			key: 'admin',
			loader: async () => (await import('./messages-chirho/en-chirho/admin-chirho.json')).default
		},
		// Spanish
		{
			locale: 'es',
			key: 'common',
			loader: async () => (await import('./messages-chirho/es-chirho/common-chirho.json')).default
		},
		{
			locale: 'es',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/es-chirho/landing-chirho.json')).default
		},
		{
			locale: 'es',
			key: 'admin',
			loader: async () => (await import('./messages-chirho/es-chirho/admin-chirho.json')).default
		},
		// Hindi
		{
			locale: 'hi',
			key: 'common',
			loader: async () => (await import('./messages-chirho/hi-chirho/common-chirho.json')).default
		},
		{
			locale: 'hi',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/hi-chirho/landing-chirho.json')).default
		},
		{
			locale: 'hi',
			key: 'admin',
			loader: async () => (await import('./messages-chirho/hi-chirho/admin-chirho.json')).default
		},
		// French
		{
			locale: 'fr',
			key: 'common',
			loader: async () => (await import('./messages-chirho/fr-chirho/common-chirho.json')).default
		},
		{
			locale: 'fr',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/fr-chirho/landing-chirho.json')).default
		},
		// German
		{
			locale: 'de',
			key: 'common',
			loader: async () => (await import('./messages-chirho/de-chirho/common-chirho.json')).default
		},
		{
			locale: 'de',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/de-chirho/landing-chirho.json')).default
		},
		// Portuguese
		{
			locale: 'pt',
			key: 'common',
			loader: async () => (await import('./messages-chirho/pt-chirho/common-chirho.json')).default
		},
		{
			locale: 'pt',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/pt-chirho/landing-chirho.json')).default
		},
		{
			locale: 'pt',
			key: 'admin',
			loader: async () => (await import('./messages-chirho/pt-chirho/admin-chirho.json')).default
		},
		// Russian
		{
			locale: 'ru',
			key: 'common',
			loader: async () => (await import('./messages-chirho/ru-chirho/common-chirho.json')).default
		},
		{
			locale: 'ru',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/ru-chirho/landing-chirho.json')).default
		},
		// Chinese
		{
			locale: 'zh',
			key: 'common',
			loader: async () => (await import('./messages-chirho/zh-chirho/common-chirho.json')).default
		},
		{
			locale: 'zh',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/zh-chirho/landing-chirho.json')).default
		},
		// Arabic
		{
			locale: 'ar',
			key: 'common',
			loader: async () => (await import('./messages-chirho/ar-chirho/common-chirho.json')).default
		},
		{
			locale: 'ar',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/ar-chirho/landing-chirho.json')).default
		},
		// Japanese
		{
			locale: 'ja',
			key: 'common',
			loader: async () => (await import('./messages-chirho/ja-chirho/common-chirho.json')).default
		},
		{
			locale: 'ja',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/ja-chirho/landing-chirho.json')).default
		},
		// Korean
		{
			locale: 'ko',
			key: 'common',
			loader: async () => (await import('./messages-chirho/ko-chirho/common-chirho.json')).default
		},
		{
			locale: 'ko',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/ko-chirho/landing-chirho.json')).default
		},
		// Indonesian
		{
			locale: 'id',
			key: 'common',
			loader: async () => (await import('./messages-chirho/id-chirho/common-chirho.json')).default
		},
		{
			locale: 'id',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/id-chirho/landing-chirho.json')).default
		},
		// Italian
		{
			locale: 'it',
			key: 'common',
			loader: async () => (await import('./messages-chirho/it-chirho/common-chirho.json')).default
		},
		{
			locale: 'it',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/it-chirho/landing-chirho.json')).default
		},
		// Dutch
		{
			locale: 'nl',
			key: 'common',
			loader: async () => (await import('./messages-chirho/nl-chirho/common-chirho.json')).default
		},
		{
			locale: 'nl',
			key: 'landing',
			loader: async () => (await import('./messages-chirho/nl-chirho/landing-chirho.json')).default
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
	{ codeChirho: 'hi', nameChirho: 'Hindi', nativeNameChirho: 'हिन्दी', dirChirho: 'ltr' },
	{ codeChirho: 'fr', nameChirho: 'French', nativeNameChirho: 'Français', dirChirho: 'ltr' },
	{ codeChirho: 'de', nameChirho: 'German', nativeNameChirho: 'Deutsch', dirChirho: 'ltr' },
	{ codeChirho: 'pt', nameChirho: 'Portuguese', nativeNameChirho: 'Português', dirChirho: 'ltr' },
	{ codeChirho: 'ru', nameChirho: 'Russian', nativeNameChirho: 'Русский', dirChirho: 'ltr' },
	{ codeChirho: 'zh', nameChirho: 'Chinese', nativeNameChirho: '中文', dirChirho: 'ltr' },
	{ codeChirho: 'ar', nameChirho: 'Arabic', nativeNameChirho: 'العربية', dirChirho: 'rtl' },
	{ codeChirho: 'ja', nameChirho: 'Japanese', nativeNameChirho: '日本語', dirChirho: 'ltr' },
	{ codeChirho: 'ko', nameChirho: 'Korean', nativeNameChirho: '한국어', dirChirho: 'ltr' },
	{ codeChirho: 'id', nameChirho: 'Indonesian', nativeNameChirho: 'Bahasa Indonesia', dirChirho: 'ltr' },
	{ codeChirho: 'it', nameChirho: 'Italian', nativeNameChirho: 'Italiano', dirChirho: 'ltr' },
	{ codeChirho: 'nl', nameChirho: 'Dutch', nativeNameChirho: 'Nederlands', dirChirho: 'ltr' }
];
