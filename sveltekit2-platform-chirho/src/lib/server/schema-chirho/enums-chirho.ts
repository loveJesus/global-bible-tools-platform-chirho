// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { pgEnum } from 'drizzle-orm/pg-core';

// PostgreSQL ENUMs - names match existing database
export const emailStatusEnumChirho = pgEnum('EmailStatus', [
	'UNVERIFIED',
	'VERIFIED',
	'BOUNCED',
	'COMPLAINED'
]);

export const glossSourceEnumChirho = pgEnum('GlossSource', ['USER', 'IMPORT']);

export const glossStateEnumChirho = pgEnum('GlossState', ['APPROVED', 'UNAPPROVED']);

export const languageRoleEnumChirho = pgEnum('LanguageRole', ['ADMIN', 'TRANSLATOR', 'VIEWER']);

export const resourceCodeEnumChirho = pgEnum('ResourceCode', ['BDB', 'LSJ', 'STRONGS']);

export const systemRoleEnumChirho = pgEnum('SystemRole', ['ADMIN']);

export const textDirectionEnumChirho = pgEnum('TextDirection', ['ltr', 'rtl']);

export const userStatusEnumChirho = pgEnum('user_status', ['active', 'disabled']);

// TypeScript type exports
export type EmailStatusChirho = (typeof emailStatusEnumChirho.enumValues)[number];
export type GlossSourceChirho = (typeof glossSourceEnumChirho.enumValues)[number];
export type GlossStateChirho = (typeof glossStateEnumChirho.enumValues)[number];
export type LanguageRoleChirho = (typeof languageRoleEnumChirho.enumValues)[number];
export type ResourceCodeChirho = (typeof resourceCodeEnumChirho.enumValues)[number];
export type SystemRoleChirho = (typeof systemRoleEnumChirho.enumValues)[number];
export type TextDirectionChirho = (typeof textDirectionEnumChirho.enumValues)[number];
export type UserStatusEnumChirho = (typeof userStatusEnumChirho.enumValues)[number];
