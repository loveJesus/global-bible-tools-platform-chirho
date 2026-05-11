// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { Handle as HandleChirho } from '@sveltejs/kit';

const SUPPORTED_LOCALES_CHIRHO = ['en', 'es', 'hi', 'fr', 'de', 'pt', 'ru', 'zh', 'ar', 'ja', 'ko', 'id', 'it', 'nl'];

export const handle: HandleChirho = async ({ event: eventChirho, resolve: resolveChirho }) => {
	const savedLocaleChirho = eventChirho.cookies.get('locale');
	const localeChirho = savedLocaleChirho && SUPPORTED_LOCALES_CHIRHO.includes(savedLocaleChirho)
		? savedLocaleChirho
		: 'en';
	eventChirho.locals.localeChirho = localeChirho;

	if (eventChirho.request.method !== 'GET') {
		return resolveChirho(eventChirho);
	}

	const cacheChirho = eventChirho.platform?.caches?.default
		?? (typeof caches !== 'undefined' ? caches.default : undefined);
	if (!cacheChirho) {
		return resolveChirho(eventChirho);
	}

	// Locale is part of the key so each locale gets its own cached HTML.
	const cacheUrlChirho = new URL(eventChirho.url.toString());
	cacheUrlChirho.searchParams.set('_locale_chirho', localeChirho);
	const cacheKeyChirho = new Request(cacheUrlChirho.toString(), { method: 'GET' });

	const cachedChirho = await cacheChirho.match(cacheKeyChirho);
	if (cachedChirho) {
		return cachedChirho;
	}

	const responseChirho = await resolveChirho(eventChirho);

	const cacheControlChirho = responseChirho.headers.get('cache-control') ?? '';
	const shouldCacheChirho =
		responseChirho.status === 200 &&
		cacheControlChirho.includes('public') &&
		/s-maxage=\d+/.test(cacheControlChirho);

	if (shouldCacheChirho) {
		const cloneChirho = responseChirho.clone();
		const cleanHeadersChirho = new Headers(cloneChirho.headers);
		cleanHeadersChirho.delete('set-cookie');
		const cacheableChirho = new Response(cloneChirho.body, {
			status: cloneChirho.status,
			statusText: cloneChirho.statusText,
			headers: cleanHeadersChirho
		});

		const putChirho = cacheChirho.put(cacheKeyChirho, cacheableChirho);
		const ctxChirho = eventChirho.platform?.context;
		if (ctxChirho?.waitUntil) {
			ctxChirho.waitUntil(putChirho);
		} else {
			void putChirho.catch(() => {});
		}
	}

	return responseChirho;
};
