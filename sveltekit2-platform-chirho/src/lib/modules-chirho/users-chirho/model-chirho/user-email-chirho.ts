// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { EmailStatusChirho } from './email-status-chirho';

export interface UserEmailPropsChirho {
	addressChirho: string;
	statusChirho: EmailStatusChirho;
}

export class UserEmailChirho {
	constructor(private readonly propsChirho: UserEmailPropsChirho) {}

	get addressChirho(): string {
		return this.propsChirho.addressChirho;
	}

	get statusChirho(): EmailStatusChirho {
		return this.propsChirho.statusChirho;
	}

	static createForNewUserChirho(emailChirho: string): UserEmailChirho {
		return new UserEmailChirho({
			addressChirho: emailChirho.toLowerCase(),
			statusChirho: EmailStatusChirho.UnverifiedChirho
		});
	}

	updateStatusChirho(statusChirho: EmailStatusChirho): UserEmailChirho {
		return new UserEmailChirho({
			addressChirho: this.propsChirho.addressChirho,
			statusChirho
		});
	}
}
