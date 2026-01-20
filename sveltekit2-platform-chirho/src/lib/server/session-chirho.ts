// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { Cookies as CookiesChirho } from '@sveltejs/kit';
import { dbChirho, eqChirho } from './db-chirho';
import { sessionTableChirho, userTableChirho, type UserChirho, type SessionChirho } from './schema-chirho';

const SESSION_COOKIE_NAME_CHIRHO = 'session_id';
const SESSION_DURATION_MS_CHIRHO = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface SessionDataChirho {
	sessionChirho: SessionChirho;
	userChirho: UserChirho;
}

export async function getSessionChirho(cookiesChirho: CookiesChirho): Promise<SessionDataChirho | null> {
	const sessionIdChirho = cookiesChirho.get(SESSION_COOKIE_NAME_CHIRHO);
	if (!sessionIdChirho) {
		return null;
	}

	const resultChirho = await dbChirho
		.select({
			sessionChirho: sessionTableChirho,
			userChirho: userTableChirho
		})
		.from(sessionTableChirho)
		.innerJoin(userTableChirho, eqChirho(sessionTableChirho.userIdChirho, userTableChirho.idChirho))
		.where(eqChirho(sessionTableChirho.idChirho, sessionIdChirho))
		.limit(1);

	const rowChirho = resultChirho[0];
	if (!rowChirho) {
		return null;
	}

	// Check if session is expired
	if (new Date(rowChirho.sessionChirho.expiresAtChirho) < new Date()) {
		await deleteSessionChirho(sessionIdChirho);
		return null;
	}

	return rowChirho;
}

export async function createSessionChirho(
	userIdChirho: string,
	cookiesChirho: CookiesChirho
): Promise<string> {
	const sessionIdChirho = generateSessionIdChirho();
	const expiresAtChirho = new Date(Date.now() + SESSION_DURATION_MS_CHIRHO);

	await dbChirho.insert(sessionTableChirho).values({
		idChirho: sessionIdChirho,
		userIdChirho: userIdChirho,
		expiresAtChirho: expiresAtChirho
	});

	cookiesChirho.set(SESSION_COOKIE_NAME_CHIRHO, sessionIdChirho, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: SESSION_DURATION_MS_CHIRHO / 1000
	});

	return sessionIdChirho;
}

export async function deleteSessionChirho(sessionIdChirho: string): Promise<void> {
	await dbChirho
		.delete(sessionTableChirho)
		.where(eqChirho(sessionTableChirho.idChirho, sessionIdChirho));
}

export async function logoutChirho(cookiesChirho: CookiesChirho): Promise<void> {
	const sessionIdChirho = cookiesChirho.get(SESSION_COOKIE_NAME_CHIRHO);
	if (sessionIdChirho) {
		await deleteSessionChirho(sessionIdChirho);
	}
	cookiesChirho.delete(SESSION_COOKIE_NAME_CHIRHO, { path: '/' });
}

function generateSessionIdChirho(): string {
	const bytesChirho = new Uint8Array(32);
	crypto.getRandomValues(bytesChirho);
	return Array.from(bytesChirho)
		.map((byteChirho) => byteChirho.toString(16).padStart(2, '0'))
		.join('');
}

// Re-export types for convenience
export type { SessionChirho, UserChirho };
