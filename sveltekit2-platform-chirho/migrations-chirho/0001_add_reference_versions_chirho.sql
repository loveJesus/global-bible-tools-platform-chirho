-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- Reference Version table - public domain Bible translations
CREATE TABLE IF NOT EXISTS reference_version_chirho (
    id_chirho SERIAL PRIMARY KEY,
    code_chirho TEXT NOT NULL UNIQUE,
    name_chirho TEXT NOT NULL,
    language_code_chirho TEXT NOT NULL,
    source_chirho TEXT,
    created_at_chirho TIMESTAMP DEFAULT NOW()
);

-- Reference Verse table - verse text for each version
CREATE TABLE IF NOT EXISTS reference_verse_chirho (
    version_id_chirho INTEGER NOT NULL REFERENCES reference_version_chirho(id_chirho),
    verse_id_chirho TEXT NOT NULL,
    text_chirho TEXT NOT NULL,
    osis_chirho TEXT,
    PRIMARY KEY (version_id_chirho, verse_id_chirho)
);

-- Index for fast verse lookups by verse ID
CREATE INDEX IF NOT EXISTS idx_ref_verse_id_chirho ON reference_verse_chirho(verse_id_chirho);

-- Index for fast lookups by version + verse prefix (chapter queries)
CREATE INDEX IF NOT EXISTS idx_ref_verse_chapter_chirho ON reference_verse_chirho(version_id_chirho, verse_id_chirho text_pattern_ops);

-- Insert initial reference versions (public domain)
INSERT INTO reference_version_chirho (code_chirho, name_chirho, language_code_chirho, source_chirho)
VALUES
    ('kjv', 'King James Version', 'eng', 'ebible'),
    ('web', 'World English Bible', 'eng', 'ebible'),
    ('rv1909', 'Reina Valera 1909', 'spa', 'ebible'),
    ('hin-irv', 'Hindi IRV', 'hin', 'ebible')
ON CONFLICT (code_chirho) DO NOTHING;
