// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { pgTable, text, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';
import { sql as sqlChirho } from 'drizzle-orm';
import { languageRoleEnumChirho, textDirectionEnumChirho } from './enums-chirho';
import { userTableChirho } from './users-chirho';

// Language table - Target translation languages
export const languageTableChirho = pgTable('language', {
	idChirho: uuid('id')
		.primaryKey()
		.default(sqlChirho`generate_ulid()`),
	codeChirho: text('code').notNull().unique(), // e.g., "spa", "fra", "deu"
	nameChirho: text('name').notNull(),
	fontChirho: text('font').default('Noto Sans').notNull(),
	translationIdsChirho: text('translation_ids').array(),
	textDirectionChirho: textDirectionEnumChirho('text_direction').default('ltr').notNull(),
	referenceLanguageIdChirho: uuid('reference_language_id')
});

// LanguageMember table - User membership in a language
export const languageMemberTableChirho = pgTable('language_member', {
	languageIdChirho: uuid('language_id')
		.notNull()
		.references(() => languageTableChirho.idChirho),
	userIdChirho: uuid('user_id')
		.notNull()
		.references(() => userTableChirho.idChirho),
	invitedAtChirho: timestamp('invited_at').notNull()
});

// LanguageMemberRole table - User permissions per language
export const languageMemberRoleTableChirho = pgTable('language_member_role', {
	userIdChirho: uuid('user_id')
		.notNull()
		.references(() => userTableChirho.idChirho),
	languageIdChirho: uuid('language_id')
		.notNull()
		.references(() => languageTableChirho.idChirho),
	roleChirho: languageRoleEnumChirho('role').notNull()
});

// LanguageImportJob table - Track import job status
export const languageImportJobTableChirho = pgTable('language_import_job', {
	languageIdChirho: uuid('language_id')
		.notNull()
		.references(() => languageTableChirho.idChirho),
	startDateChirho: timestamp('start_date', { precision: 3 }).notNull(),
	endDateChirho: timestamp('end_date', { precision: 3 }),
	succeededChirho: boolean('succeeded'),
	userIdChirho: uuid('user_id').references(() => userTableChirho.idChirho)
});

// Type exports
export type LanguageChirho = typeof languageTableChirho.$inferSelect;
export type NewLanguageChirho = typeof languageTableChirho.$inferInsert;

export type LanguageMemberChirho = typeof languageMemberTableChirho.$inferSelect;
export type NewLanguageMemberChirho = typeof languageMemberTableChirho.$inferInsert;

export type LanguageMemberRoleChirho = typeof languageMemberRoleTableChirho.$inferSelect;
export type NewLanguageMemberRoleChirho = typeof languageMemberRoleTableChirho.$inferInsert;

export type LanguageImportJobChirho = typeof languageImportJobTableChirho.$inferSelect;
export type NewLanguageImportJobChirho = typeof languageImportJobTableChirho.$inferInsert;
