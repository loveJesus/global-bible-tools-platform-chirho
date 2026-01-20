// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { fail as failChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { env as envChirho } from '$env/dynamic/private';
import { UserChirho, UserAlreadyExistsErrorChirho } from '$lib/modules-chirho/users-chirho/model-chirho';
import { userRepositoryChirho } from '$lib/modules-chirho/users-chirho/data-access-chirho/user-repository-chirho';
import { sendEmailChirho, verificationEmailChirho } from '$lib/server/email-chirho';

export const load: PageServerLoadChirho = async ({ locals: localsChirho }) => {
	// Redirect if already logged in
	if (localsChirho.userChirho) {
		throw redirectChirho(302, '/');
	}
	return {};
};

export const actions: ActionsChirho = {
	default: async ({ request: requestChirho, url: urlChirho }) => {
		const formDataChirho = await requestChirho.formData();
		const nameChirho = formDataChirho.get('nameChirho') as string;
		const emailChirho = formDataChirho.get('emailChirho') as string;
		const passwordChirho = formDataChirho.get('passwordChirho') as string;
		const confirmPasswordChirho = formDataChirho.get('confirmPasswordChirho') as string;

		// Validation
		if (!nameChirho || !emailChirho || !passwordChirho) {
			return failChirho(400, {
				errorChirho: 'All fields are required',
				nameChirho,
				emailChirho
			});
		}

		if (passwordChirho.length < 8) {
			return failChirho(400, {
				errorChirho: 'Password must be at least 8 characters',
				nameChirho,
				emailChirho
			});
		}

		if (passwordChirho !== confirmPasswordChirho) {
			return failChirho(400, {
				errorChirho: 'Passwords do not match',
				nameChirho,
				emailChirho
			});
		}

		// Check if email already exists
		const existsChirho = await userRepositoryChirho.existsByEmailChirho(emailChirho);
		if (existsChirho) {
			return failChirho(400, {
				errorChirho: 'An account with this email already exists',
				nameChirho,
				emailChirho
			});
		}

		try {
			// Create user with pending email verification
			const { userChirho, verificationTokenChirho } = await UserChirho.registerChirho({
				nameChirho,
				emailChirho,
				passwordChirho
			});

			// Save to database
			await userRepositoryChirho.commitChirho(userChirho);

			// Build verification link
			const baseUrlChirho = envChirho.PUBLIC_URL_CHIRHO || urlChirho.origin;
			const verificationLinkChirho = `${baseUrlChirho}/verify-email-chirho?token=${verificationTokenChirho}`;

			// Send verification email
			const emailContentChirho = verificationEmailChirho(nameChirho, verificationLinkChirho);
			await sendEmailChirho({
				toChirho: emailChirho,
				subjectChirho: emailContentChirho.subjectChirho,
				htmlChirho: emailContentChirho.htmlChirho
			});

			// Redirect to verification pending page
			throw redirectChirho(302, '/verify-email-chirho?sent=true');
		} catch (errorChirho) {
			if (errorChirho instanceof UserAlreadyExistsErrorChirho) {
				return failChirho(400, {
					errorChirho: 'An account with this email already exists',
					nameChirho,
					emailChirho
				});
			}
			// Re-throw redirects
			throw errorChirho;
		}
	}
};
