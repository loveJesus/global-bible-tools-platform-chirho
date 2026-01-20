// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

export type UserStatusValueChirho = 'active' | 'disabled';

export class UserStatusChirho {
	private constructor(readonly valueChirho: UserStatusValueChirho) {}

	static readonly ActiveChirho = new UserStatusChirho('active');
	static readonly DisabledChirho = new UserStatusChirho('disabled');

	static fromRawChirho(valueChirho: string): UserStatusChirho {
		switch (valueChirho.toLowerCase()) {
			case 'active':
				return UserStatusChirho.ActiveChirho;
			case 'disabled':
				return UserStatusChirho.DisabledChirho;
			default:
				throw new Error(`Unknown user status: ${valueChirho}`);
		}
	}
}
