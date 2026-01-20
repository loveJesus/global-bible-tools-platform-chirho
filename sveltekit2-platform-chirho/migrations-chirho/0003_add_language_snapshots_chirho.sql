-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- Language Snapshot table - backup metadata for language translations
CREATE TABLE IF NOT EXISTS language_snapshot_chirho (
    id_chirho UUID PRIMARY KEY DEFAULT generate_ulid(),
    language_id_chirho UUID NOT NULL REFERENCES language(id),
    timestamp_chirho TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by_chirho UUID REFERENCES "user"(id),
    status_chirho TEXT NOT NULL DEFAULT 'completed',
    note_chirho TEXT
);

-- Index for fast lookup by language
CREATE INDEX IF NOT EXISTS idx_snapshot_language_chirho ON language_snapshot_chirho(language_id_chirho);

-- Index for ordering by timestamp
CREATE INDEX IF NOT EXISTS idx_snapshot_timestamp_chirho ON language_snapshot_chirho(timestamp_chirho DESC);
