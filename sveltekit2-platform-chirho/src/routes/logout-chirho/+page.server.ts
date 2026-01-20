// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { Actions as ActionsChirho } from './$types';
import { redirect as redirectChirho } from '@sveltejs/kit';
import { logoutChirho } from '$lib/server/session-chirho';

export const actions: ActionsChirho = {
	default: async ({ cookies: cookiesChirho }) => {
		await logoutChirho(cookiesChirho);
		throw redirectChirho(302, '/');
	}
};
