// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { Handle as HandleChirho } from '@sveltejs/kit';
import { getSessionChirho } from '$lib/server/session-chirho';

export const handle: HandleChirho = async ({ event: eventChirho, resolve: resolveChirho }) => {
	// Load session data for all requests
	const sessionDataChirho = await getSessionChirho(eventChirho.cookies);

	if (sessionDataChirho) {
		eventChirho.locals.sessionChirho = sessionDataChirho.sessionChirho;
		eventChirho.locals.userChirho = sessionDataChirho.userChirho;
	} else {
		eventChirho.locals.sessionChirho = null;
		eventChirho.locals.userChirho = null;
	}

	const responseChirho = await resolveChirho(eventChirho);
	return responseChirho;
};
