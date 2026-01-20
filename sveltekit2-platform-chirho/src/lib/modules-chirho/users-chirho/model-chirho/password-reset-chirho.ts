// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { generateRandomString, alphabet } from 'oslo/crypto';

export interface PasswordResetPropsChirho {
	tokenChirho: string;
	expiresAtChirho: Date;
}

const PASSWORD_RESET_EXPIRY_HOURS_CHIRHO = 1;

export class PasswordResetChirho {
	constructor(private readonly propsChirho: PasswordResetPropsChirho) {}

	get tokenChirho(): string {
		return this.propsChirho.tokenChirho;
	}

	get expiresAtChirho(): Date {
		return this.propsChirho.expiresAtChirho;
	}

	static generateChirho(): PasswordResetChirho {
		const expiresAtChirho = new Date();
		expiresAtChirho.setHours(expiresAtChirho.getHours() + PASSWORD_RESET_EXPIRY_HOURS_CHIRHO);

		return new PasswordResetChirho({
			tokenChirho: generateRandomString(40, alphabet('a-z', '0-9')),
			expiresAtChirho
		});
	}

	validateTokenChirho(tokenChirho: string): boolean {
		if (this.propsChirho.tokenChirho !== tokenChirho) return false;
		if (new Date() > this.propsChirho.expiresAtChirho) return false;
		return true;
	}
}
