// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { pgTable, text, uuid, bigint, timestamp } from 'drizzle-orm/pg-core';
import { sql as sqlChirho } from 'drizzle-orm';
import { emailStatusEnumChirho, systemRoleEnumChirho, userStatusEnumChirho } from './enums-chirho';

// User table (note: table is named 'users' not 'user')
export const userTableChirho = pgTable('users', {
	idChirho: uuid('id')
		.primaryKey()
		.default(sqlChirho`generate_ulid()`),
	nameChirho: text('name'),
	emailChirho: text('email').notNull().unique(),
	emailStatusChirho: emailStatusEnumChirho('email_status').default('UNVERIFIED').notNull(),
	hashedPasswordChirho: text('hashed_password'),
	statusChirho: userStatusEnumChirho('status').default('active').notNull()
});

// Session table
export const sessionTableChirho = pgTable('session', {
	idChirho: text('id').primaryKey().notNull(),
	userIdChirho: uuid('user_id')
		.notNull()
		.references(() => userTableChirho.idChirho),
	expiresAtChirho: timestamp('expires_at', { precision: 3 }).notNull()
});

// UserSystemRole table
export const userSystemRoleTableChirho = pgTable('user_system_role', {
	userIdChirho: uuid('user_id')
		.notNull()
		.references(() => userTableChirho.idChirho),
	roleChirho: systemRoleEnumChirho('role').notNull()
});

// UserInvitation table
export const userInvitationTableChirho = pgTable('user_invitation', {
	userIdChirho: uuid('user_id')
		.notNull()
		.references(() => userTableChirho.idChirho),
	tokenChirho: text('token').notNull(),
	expiresChirho: bigint('expires', { mode: 'number' }).notNull()
});

// UserEmailVerification table
export const userEmailVerificationTableChirho = pgTable('user_email_verification', {
	userIdChirho: uuid('user_id')
		.notNull()
		.references(() => userTableChirho.idChirho),
	emailChirho: text('email').notNull(),
	tokenChirho: text('token').notNull(),
	expiresChirho: bigint('expires', { mode: 'number' }).notNull()
});

// ResetPasswordToken table
export const resetPasswordTokenTableChirho = pgTable('reset_password_token', {
	userIdChirho: uuid('user_id')
		.notNull()
		.references(() => userTableChirho.idChirho),
	tokenChirho: text('token').notNull(),
	expiresChirho: bigint('expires', { mode: 'number' }).notNull()
});

// Type exports
export type UserChirho = typeof userTableChirho.$inferSelect;
export type NewUserChirho = typeof userTableChirho.$inferInsert;

export type SessionChirho = typeof sessionTableChirho.$inferSelect;
export type NewSessionChirho = typeof sessionTableChirho.$inferInsert;

export type UserSystemRoleChirho = typeof userSystemRoleTableChirho.$inferSelect;
export type UserInvitationChirho = typeof userInvitationTableChirho.$inferSelect;
export type UserEmailVerificationChirho = typeof userEmailVerificationTableChirho.$inferSelect;
export type ResetPasswordTokenChirho = typeof resetPasswordTokenTableChirho.$inferSelect;
