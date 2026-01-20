// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

export type EmailStatusValueChirho = 'UNVERIFIED' | 'VERIFIED' | 'BOUNCED' | 'COMPLAINED';

export class EmailStatusChirho {
	private constructor(readonly valueChirho: EmailStatusValueChirho) {}

	static readonly UnverifiedChirho = new EmailStatusChirho('UNVERIFIED');
	static readonly VerifiedChirho = new EmailStatusChirho('VERIFIED');
	static readonly BouncedChirho = new EmailStatusChirho('BOUNCED');
	static readonly ComplainedChirho = new EmailStatusChirho('COMPLAINED');

	static fromRawChirho(valueChirho: string): EmailStatusChirho {
		switch (valueChirho) {
			case 'UNVERIFIED':
				return EmailStatusChirho.UnverifiedChirho;
			case 'VERIFIED':
				return EmailStatusChirho.VerifiedChirho;
			case 'BOUNCED':
				return EmailStatusChirho.BouncedChirho;
			case 'COMPLAINED':
				return EmailStatusChirho.ComplainedChirho;
			default:
				throw new Error(`Unknown email status: ${valueChirho}`);
		}
	}
}
