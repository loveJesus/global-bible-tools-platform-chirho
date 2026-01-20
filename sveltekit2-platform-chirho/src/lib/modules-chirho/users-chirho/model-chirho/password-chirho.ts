// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { Scrypt } from 'oslo/password';

export interface PasswordPropsChirho {
	hashChirho: string;
}

const scryptChirho = new Scrypt();

export class PasswordChirho {
	constructor(private readonly propsChirho: PasswordPropsChirho) {}

	get hashChirho(): string {
		return this.propsChirho.hashChirho;
	}

	static async createChirho(passwordChirho: string): Promise<PasswordChirho> {
		return new PasswordChirho({
			hashChirho: await scryptChirho.hash(passwordChirho)
		});
	}

	async verifyChirho(passwordChirho: string): Promise<boolean> {
		return await scryptChirho.verify(this.propsChirho.hashChirho, passwordChirho);
	}
}
