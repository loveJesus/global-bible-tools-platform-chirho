// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { redirect as redirectChirho } from '@sveltejs/kit';
import { userRepositoryChirho } from '$lib/modules-chirho/users-chirho/data-access-chirho/user-repository-chirho';
import { createSessionChirho } from '$lib/server/session-chirho';

export const load: PageServerLoadChirho = async ({ url: urlChirho, cookies: cookiesChirho }) => {
	const tokenChirho = urlChirho.searchParams.get('token');
	const sentChirho = urlChirho.searchParams.get('sent') === 'true';

	// If 'sent' param is present, show the "check your email" message
	if (sentChirho) {
		return {
			modeChirho: 'sent' as const,
			successChirho: false,
			errorChirho: null
		};
	}

	// If no token, show instructions
	if (!tokenChirho) {
		return {
			modeChirho: 'instructions' as const,
			successChirho: false,
			errorChirho: null
		};
	}

	// Find user by verification token
	const userChirho = await userRepositoryChirho.findByEmailVerificationTokenChirho(tokenChirho);

	if (!userChirho) {
		return {
			modeChirho: 'error' as const,
			successChirho: false,
			errorChirho: 'Invalid or expired verification link. Please request a new one.'
		};
	}

	// Verify the token
	try {
		userChirho.confirmEmailChangeChirho(tokenChirho);
		await userRepositoryChirho.commitChirho(userChirho);

		// Create a session for the user
		await createSessionChirho(userChirho.idChirho, cookiesChirho);

		// Redirect to home with success message
		throw redirectChirho(302, '/?verified=true');
	} catch (errorChirho) {
		// If it's a redirect, re-throw it
		if (errorChirho instanceof Response || (errorChirho as { status?: number }).status === 302) {
			throw errorChirho;
		}

		return {
			modeChirho: 'error' as const,
			successChirho: false,
			errorChirho: 'Invalid or expired verification link. Please request a new one.'
		};
	}
};
