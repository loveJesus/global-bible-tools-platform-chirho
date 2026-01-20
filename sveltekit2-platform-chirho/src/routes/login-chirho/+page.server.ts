// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { fail as failChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { logInChirho } from '$lib/modules-chirho/users-chirho/use-cases-chirho/login-chirho';
import {
	UserNotFoundErrorChirho,
	IncorrectPasswordErrorChirho
} from '$lib/modules-chirho/users-chirho/model-chirho';
import { createSessionChirho } from '$lib/server/session-chirho';

export const load: PageServerLoadChirho = async ({ locals: localsChirho }) => {
	// Redirect if already logged in
	if (localsChirho.userChirho) {
		throw redirectChirho(302, '/');
	}
	return {};
};

export const actions: ActionsChirho = {
	default: async ({ request: requestChirho, cookies: cookiesChirho }) => {
		const formDataChirho = await requestChirho.formData();
		const emailChirho = formDataChirho.get('emailChirho') as string;
		const passwordChirho = formDataChirho.get('passwordChirho') as string;

		if (!emailChirho || !passwordChirho) {
			return failChirho(400, {
				errorChirho: 'Email and password are required',
				emailChirho
			});
		}

		try {
			const resultChirho = await logInChirho({
				emailChirho,
				passwordChirho
			});

			// Create session
			await createSessionChirho(resultChirho.userIdChirho, cookiesChirho);

			throw redirectChirho(302, '/');
		} catch (errorChirho) {
			if (
				errorChirho instanceof UserNotFoundErrorChirho ||
				errorChirho instanceof IncorrectPasswordErrorChirho
			) {
				return failChirho(400, {
					errorChirho: 'Invalid email or password',
					emailChirho
				});
			}
			throw errorChirho;
		}
	}
};
