// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { userRepositoryChirho } from '../data-access-chirho/user-repository-chirho';
import { UserNotFoundErrorChirho, IncorrectPasswordErrorChirho } from '../model-chirho';

export interface LogInRequestChirho {
	emailChirho: string;
	passwordChirho: string;
}

export interface LogInResponseChirho {
	userIdChirho: string;
}

export async function logInChirho(requestChirho: LogInRequestChirho): Promise<LogInResponseChirho> {
	const userChirho = await userRepositoryChirho.findByEmailChirho(requestChirho.emailChirho);
	if (!userChirho) throw new UserNotFoundErrorChirho();

	const passwordMatchedChirho = await userChirho.passwordChirho?.verifyChirho(requestChirho.passwordChirho);
	if (!passwordMatchedChirho) {
		throw new IncorrectPasswordErrorChirho();
	}

	return { userIdChirho: userChirho.idChirho };
}
