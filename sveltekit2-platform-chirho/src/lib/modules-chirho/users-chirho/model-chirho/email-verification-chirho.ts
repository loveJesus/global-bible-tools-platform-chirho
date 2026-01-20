// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { generateRandomString, alphabet } from 'oslo/crypto';

export interface EmailVerificationPropsChirho {
	emailChirho: string;
	tokenChirho: string;
	expiresAtChirho: Date;
}

const EMAIL_VERIFICATION_EXPIRY_HOURS_CHIRHO = 24;

export class EmailVerificationChirho {
	constructor(private readonly propsChirho: EmailVerificationPropsChirho) {}

	get emailChirho(): string {
		return this.propsChirho.emailChirho;
	}

	get tokenChirho(): string {
		return this.propsChirho.tokenChirho;
	}

	get expiresAtChirho(): Date {
		return this.propsChirho.expiresAtChirho;
	}

	static createForEmailChirho(emailChirho: string): EmailVerificationChirho {
		const expiresAtChirho = new Date();
		expiresAtChirho.setHours(expiresAtChirho.getHours() + EMAIL_VERIFICATION_EXPIRY_HOURS_CHIRHO);

		return new EmailVerificationChirho({
			emailChirho,
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
