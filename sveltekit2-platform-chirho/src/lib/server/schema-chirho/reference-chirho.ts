// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';
import { sql as sqlChirho } from 'drizzle-orm';

// Reference Version table - Bible versions like KJV, WEB, RV1909
export const referenceVersionTableChirho = pgTable('reference_version_chirho', {
	idChirho: serial('id_chirho').primaryKey(),
	codeChirho: text('code_chirho').notNull().unique(), // e.g., 'kjv', 'web', 'rv1909'
	nameChirho: text('name_chirho').notNull(), // e.g., 'King James Version'
	languageCodeChirho: text('language_code_chirho').notNull(), // e.g., 'eng', 'spa', 'hin'
	sourceChirho: text('source_chirho'), // e.g., 'crosswire', 'ebible'
	createdAtChirho: timestamp('created_at_chirho').default(sqlChirho`NOW()`)
});

// Reference Verse table - Verse text for each version
export const referenceVerseTableChirho = pgTable('reference_verse_chirho', {
	versionIdChirho: serial('version_id_chirho')
		.notNull()
		.references(() => referenceVersionTableChirho.idChirho),
	verseIdChirho: text('verse_id_chirho').notNull(), // '01001001' format
	textChirho: text('text_chirho').notNull(), // Plain text verse
	osisChirho: text('osis_chirho') // Raw OSIS XML if needed
});

// Type exports
export type ReferenceVersionChirho = typeof referenceVersionTableChirho.$inferSelect;
export type NewReferenceVersionChirho = typeof referenceVersionTableChirho.$inferInsert;

export type ReferenceVerseChirho = typeof referenceVerseTableChirho.$inferSelect;
export type NewReferenceVerseChirho = typeof referenceVerseTableChirho.$inferInsert;
