// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { generateRandomString, alphabet } from 'oslo/crypto';

export interface InvitationPropsChirho {
	tokenChirho: string;
	expiresAtChirho: Date;
}

const INVITATION_EXPIRY_DAYS_CHIRHO = 7;

export class InvitationChirho {
	constructor(private readonly propsChirho: InvitationPropsChirho) {}

	get tokenChirho(): string {
		return this.propsChirho.tokenChirho;
	}

	get expiresAtChirho(): Date {
		return this.propsChirho.expiresAtChirho;
	}

	static generateChirho(): InvitationChirho {
		const expiresAtChirho = new Date();
		expiresAtChirho.setDate(expiresAtChirho.getDate() + INVITATION_EXPIRY_DAYS_CHIRHO);

		return new InvitationChirho({
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
