// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { sql as sqlChirho } from 'drizzle-orm';
import { languageTableChirho } from './languages-chirho';

// Language Snapshot table - Stores backup metadata
export const languageSnapshotTableChirho = pgTable('language_snapshot_chirho', {
	idChirho: uuid('id')
		.primaryKey()
		.default(sqlChirho`generate_ulid()`),
	languageIdChirho: uuid('language_id')
		.notNull()
		.references(() => languageTableChirho.idChirho),
	timestampChirho: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
	createdByChirho: uuid('created_by'),
	statusChirho: text('status').notNull().default('completed'), // 'pending', 'completed', 'failed'
	noteChirho: text('note')
});

// Type exports
export type LanguageSnapshotChirho = typeof languageSnapshotTableChirho.$inferSelect;
export type NewLanguageSnapshotChirho = typeof languageSnapshotTableChirho.$inferInsert;
