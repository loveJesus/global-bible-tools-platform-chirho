// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

export type SystemRoleValueChirho = 'ADMIN';

export enum SystemRoleRawChirho {
	AdminChirho = 'ADMIN'
}

export class SystemRoleChirho {
	private constructor(readonly valueChirho: SystemRoleValueChirho) {}

	static readonly AdminChirho = new SystemRoleChirho('ADMIN');

	static fromRawChirho(valueChirho: string): SystemRoleChirho {
		switch (valueChirho) {
			case 'ADMIN':
			case SystemRoleRawChirho.AdminChirho:
				return SystemRoleChirho.AdminChirho;
			default:
				throw new Error(`Unknown system role: ${valueChirho}`);
		}
	}
}
