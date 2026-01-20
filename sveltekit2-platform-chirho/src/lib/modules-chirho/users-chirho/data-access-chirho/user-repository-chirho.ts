// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { dbChirho, eqChirho, sqlChirho } from '$lib/server/db-chirho';
import {
	userTableChirho,
	userInvitationTableChirho,
	userEmailVerificationTableChirho,
	resetPasswordTokenTableChirho,
	userSystemRoleTableChirho
} from '$lib/server/schema-chirho';
import {
	UserChirho,
	UserEmailChirho,
	EmailStatusChirho,
	UserStatusChirho,
	PasswordChirho,
	InvitationChirho,
	PasswordResetChirho,
	EmailVerificationChirho,
	SystemRoleChirho
} from '../model-chirho';

interface DbUserModelChirho {
	idChirho: string;
	nameChirho: string | null;
	hashedPasswordChirho: string | null;
	emailChirho: string;
	emailStatusChirho: string;
	statusChirho: string;
	passwordResetsChirho: Array<{ tokenChirho: string; expiresAtChirho: Date }> | null;
	emailVerificationChirho: { emailChirho: string; tokenChirho: string; expiresAtChirho: Date } | null;
	invitationsChirho: Array<{ tokenChirho: string; expiresAtChirho: Date }> | null;
	systemRolesChirho: string[] | null;
}

export const userRepositoryChirho = {
	async existsByEmailChirho(emailChirho: string): Promise<boolean> {
		const resultChirho = await dbChirho
			.select({ idChirho: userTableChirho.idChirho })
			.from(userTableChirho)
			.where(eqChirho(userTableChirho.emailChirho, emailChirho.toLowerCase()))
			.limit(1);
		return resultChirho.length > 0;
	},

	async findByIdChirho(idChirho: string): Promise<UserChirho | undefined> {
		const resultChirho = await selectUserFieldsChirho(
			eqChirho(userTableChirho.idChirho, idChirho)
		);
		if (!resultChirho) return undefined;
		return dbToUserChirho(resultChirho);
	},

	async findByEmailChirho(emailChirho: string): Promise<UserChirho | undefined> {
		const resultChirho = await selectUserFieldsChirho(
			eqChirho(userTableChirho.emailChirho, emailChirho.toLowerCase())
		);
		if (!resultChirho) return undefined;
		return dbToUserChirho(resultChirho);
	},

	async findByInvitationTokenChirho(tokenChirho: string): Promise<UserChirho | undefined> {
		// First find the user_id from the invitation
		const invitationChirho = await dbChirho
			.select({ userIdChirho: userInvitationTableChirho.userIdChirho })
			.from(userInvitationTableChirho)
			.where(eqChirho(userInvitationTableChirho.tokenChirho, tokenChirho))
			.limit(1);

		if (invitationChirho.length === 0) return undefined;

		return await userRepositoryChirho.findByIdChirho(invitationChirho[0].userIdChirho);
	},

	async findByResetPasswordTokenChirho(tokenChirho: string): Promise<UserChirho | undefined> {
		const resetChirho = await dbChirho
			.select({ userIdChirho: resetPasswordTokenTableChirho.userIdChirho })
			.from(resetPasswordTokenTableChirho)
			.where(eqChirho(resetPasswordTokenTableChirho.tokenChirho, tokenChirho))
			.limit(1);

		if (resetChirho.length === 0) return undefined;

		return await userRepositoryChirho.findByIdChirho(resetChirho[0].userIdChirho);
	},

	async findByEmailVerificationTokenChirho(tokenChirho: string): Promise<UserChirho | undefined> {
		const verificationChirho = await dbChirho
			.select({ userIdChirho: userEmailVerificationTableChirho.userIdChirho })
			.from(userEmailVerificationTableChirho)
			.where(eqChirho(userEmailVerificationTableChirho.tokenChirho, tokenChirho))
			.limit(1);

		if (verificationChirho.length === 0) return undefined;

		return await userRepositoryChirho.findByIdChirho(verificationChirho[0].userIdChirho);
	},

	async commitChirho(userChirho: UserChirho): Promise<void> {
		await dbChirho.transaction(async (txChirho) => {
			// Upsert user
			await txChirho
				.insert(userTableChirho)
				.values({
					idChirho: userChirho.idChirho,
					nameChirho: userChirho.nameChirho ?? null,
					emailChirho: userChirho.emailChirho.addressChirho,
					emailStatusChirho: userChirho.emailChirho.statusChirho.valueChirho,
					hashedPasswordChirho: userChirho.passwordChirho?.hashChirho ?? null,
					statusChirho: userChirho.statusChirho.valueChirho
				})
				.onConflictDoUpdate({
					target: userTableChirho.idChirho,
					set: {
						nameChirho: sqlChirho`excluded.name`,
						emailChirho: sqlChirho`excluded.email`,
						emailStatusChirho: sqlChirho`excluded.email_status`,
						hashedPasswordChirho: sqlChirho`excluded.hashed_password`,
						statusChirho: sqlChirho`excluded.status`
					}
				});

			// Handle invitations
			await txChirho
				.delete(userInvitationTableChirho)
				.where(eqChirho(userInvitationTableChirho.userIdChirho, userChirho.idChirho));

			if (userChirho.invitationsChirho.length > 0) {
				await txChirho.insert(userInvitationTableChirho).values(
					userChirho.invitationsChirho.map((invChirho) => ({
						userIdChirho: userChirho.idChirho,
						tokenChirho: invChirho.tokenChirho,
						expiresChirho: invChirho.expiresAtChirho.valueOf()
					}))
				);
			}

			// Handle email verification
			await txChirho
				.delete(userEmailVerificationTableChirho)
				.where(eqChirho(userEmailVerificationTableChirho.userIdChirho, userChirho.idChirho));

			if (userChirho.emailVerificationChirho) {
				await txChirho.insert(userEmailVerificationTableChirho).values({
					userIdChirho: userChirho.idChirho,
					emailChirho: userChirho.emailVerificationChirho.emailChirho,
					tokenChirho: userChirho.emailVerificationChirho.tokenChirho,
					expiresChirho: userChirho.emailVerificationChirho.expiresAtChirho.valueOf()
				});
			}

			// Handle password resets
			await txChirho
				.delete(resetPasswordTokenTableChirho)
				.where(eqChirho(resetPasswordTokenTableChirho.userIdChirho, userChirho.idChirho));

			if (userChirho.passwordResetsChirho.length > 0) {
				await txChirho.insert(resetPasswordTokenTableChirho).values(
					userChirho.passwordResetsChirho.map((resetChirho) => ({
						userIdChirho: userChirho.idChirho,
						tokenChirho: resetChirho.tokenChirho,
						expiresChirho: resetChirho.expiresAtChirho.valueOf()
					}))
				);
			}

			// Handle system roles
			await txChirho
				.delete(userSystemRoleTableChirho)
				.where(eqChirho(userSystemRoleTableChirho.userIdChirho, userChirho.idChirho));

			if (userChirho.systemRolesChirho.length > 0) {
				await txChirho.insert(userSystemRoleTableChirho).values(
					userChirho.systemRolesChirho.map((roleChirho) => ({
						userIdChirho: userChirho.idChirho,
						roleChirho: roleChirho.valueChirho
					}))
				);
			}
		});
	}
};

async function selectUserFieldsChirho(
	whereConditionChirho: ReturnType<typeof eqChirho>
): Promise<DbUserModelChirho | undefined> {
	// Get the base user
	const usersChirho = await dbChirho
		.select({
			idChirho: userTableChirho.idChirho,
			nameChirho: userTableChirho.nameChirho,
			hashedPasswordChirho: userTableChirho.hashedPasswordChirho,
			emailChirho: userTableChirho.emailChirho,
			emailStatusChirho: userTableChirho.emailStatusChirho,
			statusChirho: userTableChirho.statusChirho
		})
		.from(userTableChirho)
		.where(whereConditionChirho)
		.limit(1);

	if (usersChirho.length === 0) return undefined;

	const userChirho = usersChirho[0];

	// Get password resets
	const passwordResetsChirho = await dbChirho
		.select({
			tokenChirho: resetPasswordTokenTableChirho.tokenChirho,
			expiresChirho: resetPasswordTokenTableChirho.expiresChirho
		})
		.from(resetPasswordTokenTableChirho)
		.where(eqChirho(resetPasswordTokenTableChirho.userIdChirho, userChirho.idChirho));

	// Get email verification
	const emailVerificationsChirho = await dbChirho
		.select({
			emailChirho: userEmailVerificationTableChirho.emailChirho,
			tokenChirho: userEmailVerificationTableChirho.tokenChirho,
			expiresChirho: userEmailVerificationTableChirho.expiresChirho
		})
		.from(userEmailVerificationTableChirho)
		.where(eqChirho(userEmailVerificationTableChirho.userIdChirho, userChirho.idChirho))
		.limit(1);

	// Get invitations
	const invitationsChirho = await dbChirho
		.select({
			tokenChirho: userInvitationTableChirho.tokenChirho,
			expiresChirho: userInvitationTableChirho.expiresChirho
		})
		.from(userInvitationTableChirho)
		.where(eqChirho(userInvitationTableChirho.userIdChirho, userChirho.idChirho));

	// Get system roles
	const systemRolesChirho = await dbChirho
		.select({
			roleChirho: userSystemRoleTableChirho.roleChirho
		})
		.from(userSystemRoleTableChirho)
		.where(eqChirho(userSystemRoleTableChirho.userIdChirho, userChirho.idChirho));

	return {
		idChirho: userChirho.idChirho,
		nameChirho: userChirho.nameChirho,
		hashedPasswordChirho: userChirho.hashedPasswordChirho,
		emailChirho: userChirho.emailChirho,
		emailStatusChirho: userChirho.emailStatusChirho,
		statusChirho: userChirho.statusChirho,
		passwordResetsChirho: passwordResetsChirho.map((resetItemChirho) => ({
			tokenChirho: resetItemChirho.tokenChirho,
			expiresAtChirho: new Date(Number(resetItemChirho.expiresChirho))
		})),
		emailVerificationChirho:
			emailVerificationsChirho.length > 0
				? {
						emailChirho: emailVerificationsChirho[0].emailChirho,
						tokenChirho: emailVerificationsChirho[0].tokenChirho,
						expiresAtChirho: new Date(Number(emailVerificationsChirho[0].expiresChirho))
					}
				: null,
		invitationsChirho: invitationsChirho.map((invitationItemChirho) => ({
			tokenChirho: invitationItemChirho.tokenChirho,
			expiresAtChirho: new Date(Number(invitationItemChirho.expiresChirho))
		})),
		systemRolesChirho: systemRolesChirho.map((roleItemChirho) => roleItemChirho.roleChirho)
	};
}

function dbToUserChirho(dbModelChirho: DbUserModelChirho): UserChirho {
	return new UserChirho({
		idChirho: dbModelChirho.idChirho,
		nameChirho: dbModelChirho.nameChirho ?? undefined,
		emailChirho: new UserEmailChirho({
			addressChirho: dbModelChirho.emailChirho,
			statusChirho: EmailStatusChirho.fromRawChirho(dbModelChirho.emailStatusChirho)
		}),
		emailVerificationChirho:
			dbModelChirho.emailVerificationChirho
				? new EmailVerificationChirho({
						emailChirho: dbModelChirho.emailVerificationChirho.emailChirho,
						tokenChirho: dbModelChirho.emailVerificationChirho.tokenChirho,
						expiresAtChirho: dbModelChirho.emailVerificationChirho.expiresAtChirho
					})
				: undefined,
		passwordChirho:
			dbModelChirho.hashedPasswordChirho
				? new PasswordChirho({ hashChirho: dbModelChirho.hashedPasswordChirho })
				: undefined,
		passwordResetsChirho:
			dbModelChirho.passwordResetsChirho?.map(
				(resetChirho) =>
					new PasswordResetChirho({
						tokenChirho: resetChirho.tokenChirho,
						expiresAtChirho: resetChirho.expiresAtChirho
					})
			) ?? [],
		invitationsChirho:
			dbModelChirho.invitationsChirho?.map(
				(inviteChirho) =>
					new InvitationChirho({
						tokenChirho: inviteChirho.tokenChirho,
						expiresAtChirho: inviteChirho.expiresAtChirho
					})
			) ?? [],
		statusChirho: UserStatusChirho.fromRawChirho(dbModelChirho.statusChirho),
		systemRolesChirho:
			dbModelChirho.systemRolesChirho?.map((roleChirho) =>
				SystemRoleChirho.fromRawChirho(roleChirho)
			) ?? []
	});
}

export default userRepositoryChirho;
