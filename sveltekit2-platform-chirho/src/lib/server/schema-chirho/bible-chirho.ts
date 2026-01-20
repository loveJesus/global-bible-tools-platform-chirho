// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { pgTable, integer, text } from 'drizzle-orm/pg-core';
import { resourceCodeEnumChirho } from './enums-chirho';

// Book table - Bible books (Genesis through Revelation)
export const bookTableChirho = pgTable('book', {
	idChirho: integer('id').primaryKey().notNull(),
	nameChirho: text('name').notNull()
});

// Verse table - Individual verses
export const verseTableChirho = pgTable('verse', {
	idChirho: text('id').primaryKey().notNull(), // e.g., "01001001" for Gen 1:1
	numberChirho: integer('number').notNull(),
	bookIdChirho: integer('book_id')
		.notNull()
		.references(() => bookTableChirho.idChirho),
	chapterChirho: integer('chapter').notNull()
});

// Word table - Individual words in verses
export const wordTableChirho = pgTable('word', {
	idChirho: text('id').primaryKey().notNull(), // e.g., "0100100101"
	textChirho: text('text').notNull(),
	verseIdChirho: text('verse_id')
		.notNull()
		.references(() => verseTableChirho.idChirho),
	formIdChirho: text('form_id').references(() => lemmaFormTableChirho.idChirho)
});

// Lemma table - Root words/lexemes
export const lemmaTableChirho = pgTable('lemma', {
	idChirho: text('id').primaryKey().notNull() // e.g., "H3820" or "G2588"
});

// LemmaForm table - Grammatical forms of lemmas
export const lemmaFormTableChirho = pgTable('lemma_form', {
	idChirho: text('id').primaryKey().notNull(),
	grammarChirho: text('grammar').notNull(),
	lemmaIdChirho: text('lemma_id')
		.notNull()
		.references(() => lemmaTableChirho.idChirho)
});

// LemmaResource table - Lexicon entries (BDB, LSJ, Strongs)
export const lemmaResourceTableChirho = pgTable('lemma_resource', {
	lemmaIdChirho: text('lemma_id')
		.notNull()
		.references(() => lemmaTableChirho.idChirho),
	resourceCodeChirho: resourceCodeEnumChirho('resource_code').notNull(),
	contentChirho: text('content').notNull()
});

// Type exports
export type BookChirho = typeof bookTableChirho.$inferSelect;
export type NewBookChirho = typeof bookTableChirho.$inferInsert;

export type VerseChirho = typeof verseTableChirho.$inferSelect;
export type NewVerseChirho = typeof verseTableChirho.$inferInsert;

export type WordChirho = typeof wordTableChirho.$inferSelect;
export type NewWordChirho = typeof wordTableChirho.$inferInsert;

export type LemmaChirho = typeof lemmaTableChirho.$inferSelect;
export type NewLemmaChirho = typeof lemmaTableChirho.$inferInsert;

export type LemmaFormChirho = typeof lemmaFormTableChirho.$inferSelect;
export type NewLemmaFormChirho = typeof lemmaFormTableChirho.$inferInsert;

export type LemmaResourceChirho = typeof lemmaResourceTableChirho.$inferSelect;
export type NewLemmaResourceChirho = typeof lemmaResourceTableChirho.$inferInsert;
