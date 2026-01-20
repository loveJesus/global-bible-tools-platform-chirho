// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { ulidChirho } from '$lib/shared-chirho/ulid-chirho';
import { EmailStatusChirho } from './email-status-chirho';
import { EmailVerificationChirho } from './email-verification-chirho';
import {
	InvalidEmailVerificationTokenChirho,
	InvalidInvitationTokenErrorChirho,
	InvalidPasswordResetTokenChirho,
	UserAlreadyActiveErrorChirho,
	UserDisabledErrorChirho,
	UserPendingInviteErrorChirho
} from './errors-chirho';
import { InvitationChirho } from './invitation-chirho';
import { PasswordChirho } from './password-chirho';
import { PasswordResetChirho } from './password-reset-chirho';
import { SystemRoleChirho } from './system-role-chirho';
import { UserEmailChirho } from './user-email-chirho';
import { UserStatusChirho } from './user-status-chirho';

export interface UserPropsChirho {
	idChirho: string;
	nameChirho?: string;
	emailChirho: UserEmailChirho;
	passwordChirho?: PasswordChirho;
	passwordResetsChirho: PasswordResetChirho[];
	emailVerificationChirho?: EmailVerificationChirho;
	invitationsChirho: InvitationChirho[];
	statusChirho: UserStatusChirho;
	systemRolesChirho: SystemRoleChirho[];
}

export interface AcceptInviteOptionsChirho {
	tokenChirho: string;
	firstNameChirho: string;
	lastNameChirho: string;
	passwordChirho: string;
}

export class UserChirho {
	constructor(private propsChirho: UserPropsChirho) {}

	static inviteChirho(emailChirho: string): { userChirho: UserChirho; tokenChirho: string } {
		const inviteChirho = InvitationChirho.generateChirho();
		const userChirho = new UserChirho({
			idChirho: ulidChirho(),
			emailChirho: UserEmailChirho.createForNewUserChirho(emailChirho),
			invitationsChirho: [inviteChirho],
			passwordResetsChirho: [],
			statusChirho: UserStatusChirho.ActiveChirho,
			systemRolesChirho: []
		});

		return { userChirho, tokenChirho: inviteChirho.tokenChirho };
	}

	/**
	 * Register a new user with email and password (self-registration).
	 * Creates user with pending email verification.
	 */
	static async registerChirho(optionsChirho: {
		nameChirho: string;
		emailChirho: string;
		passwordChirho: string;
	}): Promise<{ userChirho: UserChirho; verificationTokenChirho: string }> {
		const passwordHashChirho = await PasswordChirho.createChirho(optionsChirho.passwordChirho);
		const verificationChirho = EmailVerificationChirho.createForEmailChirho(optionsChirho.emailChirho);

		const userChirho = new UserChirho({
			idChirho: ulidChirho(),
			nameChirho: optionsChirho.nameChirho,
			emailChirho: new UserEmailChirho({
				addressChirho: optionsChirho.emailChirho.toLowerCase(),
				statusChirho: EmailStatusChirho.UnverifiedChirho
			}),
			passwordChirho: passwordHashChirho,
			emailVerificationChirho: verificationChirho,
			invitationsChirho: [],
			passwordResetsChirho: [],
			statusChirho: UserStatusChirho.ActiveChirho,
			systemRolesChirho: []
		});

		return { userChirho, verificationTokenChirho: verificationChirho.tokenChirho };
	}

	get idChirho(): string {
		return this.propsChirho.idChirho;
	}

	get nameChirho(): string | undefined {
		return this.propsChirho.nameChirho;
	}

	get emailChirho(): UserEmailChirho {
		return this.propsChirho.emailChirho;
	}

	get emailVerificationChirho(): EmailVerificationChirho | undefined {
		return this.propsChirho.emailVerificationChirho;
	}

	get passwordChirho(): PasswordChirho | undefined {
		return this.propsChirho.passwordChirho;
	}

	get passwordResetsChirho(): PasswordResetChirho[] {
		return this.propsChirho.passwordResetsChirho;
	}

	get invitationsChirho(): InvitationChirho[] {
		return this.propsChirho.invitationsChirho;
	}

	get statusChirho(): UserStatusChirho {
		return this.propsChirho.statusChirho;
	}

	get systemRolesChirho(): SystemRoleChirho[] {
		return this.propsChirho.systemRolesChirho;
	}

	isActiveChirho(): boolean {
		return Boolean(this.propsChirho.passwordChirho);
	}

	updateNameChirho(nameChirho: string): void {
		this.propsChirho.nameChirho = nameChirho;
	}

	updatePasswordChirho(pwChirho: PasswordChirho): void {
		this.propsChirho.passwordChirho = pwChirho;
	}

	reinviteChirho(): string {
		if (this.isActiveChirho()) throw new UserAlreadyActiveErrorChirho();

		const inviteChirho = InvitationChirho.generateChirho();
		this.propsChirho.invitationsChirho.push(inviteChirho);
		this.propsChirho.statusChirho = UserStatusChirho.ActiveChirho;
		return inviteChirho.tokenChirho;
	}

	async acceptInviteChirho(optionsChirho: AcceptInviteOptionsChirho): Promise<void> {
		if (
			!this.propsChirho.invitationsChirho.some((inviteChirho) =>
				inviteChirho.validateTokenChirho(optionsChirho.tokenChirho)
			)
		) {
			throw new InvalidInvitationTokenErrorChirho();
		}

		this.propsChirho.nameChirho = `${optionsChirho.firstNameChirho} ${optionsChirho.lastNameChirho}`;
		this.propsChirho.passwordChirho = await PasswordChirho.createChirho(optionsChirho.passwordChirho);
		this.propsChirho.invitationsChirho = [];
		this.propsChirho.emailChirho = this.propsChirho.emailChirho.updateStatusChirho(
			EmailStatusChirho.VerifiedChirho
		);
	}

	startPasswordResetChirho(): PasswordResetChirho {
		if (this.propsChirho.statusChirho === UserStatusChirho.DisabledChirho) {
			throw new UserDisabledErrorChirho();
		}
		if (!this.propsChirho.passwordChirho) throw new UserPendingInviteErrorChirho();

		const resetChirho = PasswordResetChirho.generateChirho();
		this.propsChirho.passwordResetsChirho.push(resetChirho);
		return resetChirho;
	}

	async completePasswordResetChirho(tokenChirho: string, newPasswordChirho: string): Promise<void> {
		if (
			!this.propsChirho.passwordResetsChirho.some((resetChirho) =>
				resetChirho.validateTokenChirho(tokenChirho)
			)
		) {
			throw new InvalidPasswordResetTokenChirho();
		}

		this.propsChirho.passwordChirho = await PasswordChirho.createChirho(newPasswordChirho);
		this.propsChirho.passwordResetsChirho = [];
	}

	startEmailChangeChirho(emailChirho: string): EmailVerificationChirho {
		if (this.propsChirho.statusChirho === UserStatusChirho.DisabledChirho) {
			throw new UserDisabledErrorChirho();
		}

		const verificationChirho = EmailVerificationChirho.createForEmailChirho(emailChirho);
		this.propsChirho.emailVerificationChirho = verificationChirho;
		return verificationChirho;
	}

	confirmEmailChangeChirho(tokenChirho: string): void {
		if (!this.propsChirho.emailVerificationChirho?.validateTokenChirho(tokenChirho)) {
			throw new InvalidEmailVerificationTokenChirho();
		}

		this.propsChirho.emailChirho = new UserEmailChirho({
			statusChirho: EmailStatusChirho.VerifiedChirho,
			addressChirho: this.propsChirho.emailVerificationChirho.emailChirho
		});
		this.propsChirho.emailVerificationChirho = undefined;
	}

	rejectEmailChirho(reasonChirho: EmailStatusChirho): void {
		this.propsChirho.emailChirho = this.propsChirho.emailChirho.updateStatusChirho(reasonChirho);
	}

	disableChirho(): void {
		this.propsChirho.statusChirho = UserStatusChirho.DisabledChirho;
		this.propsChirho.invitationsChirho = [];
		this.propsChirho.passwordResetsChirho = [];
		delete this.propsChirho.passwordChirho;
		delete this.propsChirho.emailVerificationChirho;
	}

	changeSystemRolesChirho(rolesChirho: SystemRoleChirho[]): void {
		if (this.propsChirho.statusChirho === UserStatusChirho.DisabledChirho) {
			throw new UserDisabledErrorChirho();
		}

		this.propsChirho.systemRolesChirho = rolesChirho.slice();
	}
}
