// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

export class IncorrectPasswordErrorChirho extends Error {
	constructor() {
		super('Incorrect password');
		this.name = 'IncorrectPasswordErrorChirho';
	}
}

export class InvalidInvitationTokenErrorChirho extends Error {
	constructor() {
		super('Invalid or expired invitation token');
		this.name = 'InvalidInvitationTokenErrorChirho';
	}
}

export class InvalidPasswordResetTokenChirho extends Error {
	constructor() {
		super('Invalid or expired password reset token');
		this.name = 'InvalidPasswordResetTokenChirho';
	}
}

export class InvalidEmailVerificationTokenChirho extends Error {
	constructor() {
		super('Invalid or expired email verification token');
		this.name = 'InvalidEmailVerificationTokenChirho';
	}
}

export class UserAlreadyActiveErrorChirho extends Error {
	constructor() {
		super('User is already active');
		this.name = 'UserAlreadyActiveErrorChirho';
	}
}

export class UserDisabledErrorChirho extends Error {
	constructor() {
		super('User is disabled');
		this.name = 'UserDisabledErrorChirho';
	}
}

export class UserPendingInviteErrorChirho extends Error {
	constructor() {
		super('User has pending invite and cannot reset password');
		this.name = 'UserPendingInviteErrorChirho';
	}
}

export class UserNotFoundErrorChirho extends Error {
	constructor() {
		super('User not found');
		this.name = 'UserNotFoundErrorChirho';
	}
}

export class EmailAlreadyExistsErrorChirho extends Error {
	constructor() {
		super('Email already exists');
		this.name = 'EmailAlreadyExistsErrorChirho';
	}
}

export class UserAlreadyExistsErrorChirho extends Error {
	constructor() {
		super('User already exists');
		this.name = 'UserAlreadyExistsErrorChirho';
	}
}
