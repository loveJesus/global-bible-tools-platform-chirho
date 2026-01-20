// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { pgTable, text, integer, uuid, timestamp, serial } from 'drizzle-orm/pg-core';
import { glossStateEnumChirho, glossSourceEnumChirho } from './enums-chirho';
import { languageTableChirho } from './languages-chirho';
import { userTableChirho } from './users-chirho';
import { wordTableChirho } from './bible-chirho';

// Phrase table - Translation units (can span multiple words)
export const phraseTableChirho = pgTable('phrase', {
	idChirho: serial('id').primaryKey(),
	languageIdChirho: uuid('language_id')
		.notNull()
		.references(() => languageTableChirho.idChirho),
	createdAtChirho: timestamp('created_at', { precision: 3 }).notNull(),
	createdByChirho: uuid('created_by').references(() => userTableChirho.idChirho),
	deletedAtChirho: timestamp('deleted_at', { precision: 3 }),
	deletedByChirho: uuid('deleted_by').references(() => userTableChirho.idChirho)
});

// PhraseWord table - Links phrases to words (many-to-many)
export const phraseWordTableChirho = pgTable('phrase_word', {
	phraseIdChirho: integer('phrase_id')
		.notNull()
		.references(() => phraseTableChirho.idChirho),
	wordIdChirho: text('word_id')
		.notNull()
		.references(() => wordTableChirho.idChirho)
});

// Gloss table - The actual translation text for a phrase
export const glossTableChirho = pgTable('gloss', {
	phraseIdChirho: integer('phrase_id')
		.primaryKey()
		.notNull()
		.references(() => phraseTableChirho.idChirho),
	glossChirho: text('gloss'),
	stateChirho: glossStateEnumChirho('state').default('UNAPPROVED').notNull(),
	sourceChirho: glossSourceEnumChirho('source'),
	updatedAtChirho: timestamp('updated_at', { precision: 3 }),
	updatedByChirho: uuid('updated_by').references(() => userTableChirho.idChirho)
});

// GlossHistory table - Audit trail for gloss changes
export const glossHistoryTableChirho = pgTable('gloss_history', {
	idChirho: serial('id').primaryKey(),
	phraseIdChirho: integer('phrase_id')
		.notNull()
		.references(() => phraseTableChirho.idChirho),
	updatedAtChirho: timestamp('updated_at').defaultNow().notNull(),
	updatedByChirho: uuid('updated_by').references(() => userTableChirho.idChirho),
	glossChirho: text('gloss'),
	stateChirho: glossStateEnumChirho('state'),
	sourceChirho: glossSourceEnumChirho('source')
});

// MachineGloss table - AI-generated translation suggestions
export const machineGlossTableChirho = pgTable('machine_gloss', {
	wordIdChirho: text('word_id')
		.notNull()
		.references(() => wordTableChirho.idChirho),
	languageIdChirho: uuid('language_id')
		.notNull()
		.references(() => languageTableChirho.idChirho),
	glossChirho: text('gloss')
});

// Footnote table - Translator footnotes
export const footnoteTableChirho = pgTable('footnote', {
	phraseIdChirho: integer('phrase_id')
		.notNull()
		.references(() => phraseTableChirho.idChirho),
	authorIdChirho: uuid('author_id')
		.notNull()
		.references(() => userTableChirho.idChirho),
	timestampChirho: timestamp('timestamp', { precision: 3 }).notNull(),
	contentChirho: text('content').notNull()
});

// TranslatorNote table - Internal notes for translators
export const translatorNoteTableChirho = pgTable('translator_note', {
	phraseIdChirho: integer('phrase_id')
		.notNull()
		.references(() => phraseTableChirho.idChirho),
	authorIdChirho: uuid('author_id')
		.notNull()
		.references(() => userTableChirho.idChirho),
	timestampChirho: timestamp('timestamp', { precision: 3 }).notNull(),
	contentChirho: text('content').notNull()
});

// Type exports
export type PhraseChirho = typeof phraseTableChirho.$inferSelect;
export type NewPhraseChirho = typeof phraseTableChirho.$inferInsert;

export type PhraseWordChirho = typeof phraseWordTableChirho.$inferSelect;
export type NewPhraseWordChirho = typeof phraseWordTableChirho.$inferInsert;

export type GlossChirho = typeof glossTableChirho.$inferSelect;
export type NewGlossChirho = typeof glossTableChirho.$inferInsert;

export type GlossHistoryChirho = typeof glossHistoryTableChirho.$inferSelect;
export type NewGlossHistoryChirho = typeof glossHistoryTableChirho.$inferInsert;

export type MachineGlossChirho = typeof machineGlossTableChirho.$inferSelect;
export type NewMachineGlossChirho = typeof machineGlossTableChirho.$inferInsert;

export type FootnoteChirho = typeof footnoteTableChirho.$inferSelect;
export type NewFootnoteChirho = typeof footnoteTableChirho.$inferInsert;

export type TranslatorNoteChirho = typeof translatorNoteTableChirho.$inferSelect;
export type NewTranslatorNoteChirho = typeof translatorNoteTableChirho.$inferInsert;
