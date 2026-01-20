-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- Translation Tracking Database Schema
-- This SQLite database tracks translation decisions for consistency

-- Semantic domains for categorizing words
CREATE TABLE IF NOT EXISTS semantic_domain_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    name_chirho TEXT NOT NULL UNIQUE,
    description_chirho TEXT,
    parent_id_chirho INTEGER REFERENCES semantic_domain_chirho(id_chirho),
    created_at_chirho TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Lemma translation decisions (the core consistency table)
CREATE TABLE IF NOT EXISTS lemma_decision_chirho (
    lemma_id_chirho TEXT PRIMARY KEY,  -- matches lemma.id in PostgreSQL (e.g., 'H3820' for לֵב)
    primary_gloss_chirho TEXT NOT NULL,  -- the decided English translation
    semantic_domain_id_chirho INTEGER REFERENCES semantic_domain_chirho(id_chirho),
    notes_chirho TEXT,  -- rationale for this translation choice
    is_polysemous_chirho INTEGER DEFAULT 0,  -- 1 if word has multiple valid meanings
    created_at_chirho TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at_chirho TEXT DEFAULT CURRENT_TIMESTAMP
);

-- For polysemous words, track the different senses
CREATE TABLE IF NOT EXISTS lemma_sense_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    lemma_id_chirho TEXT NOT NULL REFERENCES lemma_decision_chirho(lemma_id_chirho),
    sense_number_chirho INTEGER NOT NULL,  -- 1, 2, 3...
    gloss_chirho TEXT NOT NULL,  -- translation for this sense
    definition_chirho TEXT,  -- when to use this sense
    semantic_domain_id_chirho INTEGER REFERENCES semantic_domain_chirho(id_chirho),
    examples_chirho TEXT,  -- JSON array of verse references
    created_at_chirho TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lemma_id_chirho, sense_number_chirho)
);

-- Track which sense is used for specific word occurrences
CREATE TABLE IF NOT EXISTS word_sense_assignment_chirho (
    word_id_chirho TEXT PRIMARY KEY,  -- matches word.id in PostgreSQL
    lemma_id_chirho TEXT NOT NULL,
    sense_number_chirho INTEGER,  -- NULL means use primary gloss
    override_gloss_chirho TEXT,  -- if we need a one-off different translation
    notes_chirho TEXT,
    created_at_chirho TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lemma_id_chirho, sense_number_chirho)
        REFERENCES lemma_sense_chirho(lemma_id_chirho, sense_number_chirho)
);

-- Particle and prefix handling rules
CREATE TABLE IF NOT EXISTS particle_rule_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    particle_type_chirho TEXT NOT NULL,  -- 'definite_article', 'preposition', 'conjunction', 'object_marker'
    hebrew_form_chirho TEXT NOT NULL,  -- הַ, בְּ, לְ, וְ, אֵת
    gloss_pattern_chirho TEXT NOT NULL,  -- 'the–', 'in–', 'to–', 'and–', '–' (n-dash separator)
    notes_chirho TEXT,
    created_at_chirho TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(particle_type_chirho, hebrew_form_chirho)
);

-- Name transliteration decisions
CREATE TABLE IF NOT EXISTS name_transliteration_chirho (
    lemma_id_chirho TEXT PRIMARY KEY,
    hebrew_chirho TEXT NOT NULL,
    transliteration_chirho TEXT NOT NULL,
    type_chirho TEXT,  -- 'person', 'place', 'divine', 'nation'
    notes_chirho TEXT,
    created_at_chirho TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Translation session log (for tracking progress)
CREATE TABLE IF NOT EXISTS translation_session_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at_chirho TEXT DEFAULT CURRENT_TIMESTAMP,
    ended_at_chirho TEXT,
    verses_reviewed_chirho INTEGER DEFAULT 0,
    decisions_made_chirho INTEGER DEFAULT 0,
    notes_chirho TEXT
);

-- Consistency issues found
CREATE TABLE IF NOT EXISTS consistency_issue_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    lemma_id_chirho TEXT NOT NULL,
    issue_type_chirho TEXT NOT NULL,  -- 'multiple_glosses', 'missing_decision', 'sense_ambiguity'
    description_chirho TEXT,
    resolved_chirho INTEGER DEFAULT 0,
    created_at_chirho TEXT DEFAULT CURRENT_TIMESTAMP,
    resolved_at_chirho TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lemma_sense_lemma_chirho ON lemma_sense_chirho(lemma_id_chirho);
CREATE INDEX IF NOT EXISTS idx_word_sense_lemma_chirho ON word_sense_assignment_chirho(lemma_id_chirho);
CREATE INDEX IF NOT EXISTS idx_consistency_lemma_chirho ON consistency_issue_chirho(lemma_id_chirho);
CREATE INDEX IF NOT EXISTS idx_consistency_resolved_chirho ON consistency_issue_chirho(resolved_chirho);

-- Insert default particle rules
INSERT OR IGNORE INTO particle_rule_chirho (particle_type_chirho, hebrew_form_chirho, gloss_pattern_chirho, notes_chirho)
VALUES
    ('definite_article', 'הַ', 'the–', 'Prefixed definite article'),
    ('definite_article', 'הָ', 'the–', 'Prefixed definite article (qamets)'),
    ('preposition', 'בְּ', 'in–', 'Prefixed preposition "in/with"'),
    ('preposition', 'לְ', 'to–', 'Prefixed preposition "to/for"'),
    ('preposition', 'כְּ', 'like–', 'Prefixed preposition "like/as"'),
    ('preposition', 'מִ', 'from–', 'Prefixed preposition "from"'),
    ('conjunction', 'וְ', 'and–', 'Prefixed conjunction'),
    ('conjunction', 'וּ', 'and–', 'Prefixed conjunction (shureq)'),
    ('object_marker', 'אֵת', '–', 'Direct object marker - use n-dash placeholder'),
    ('interrogative', 'הֲ', '?–', 'Interrogative prefix');

-- Insert base semantic domains (Louw-Nida inspired categories)
INSERT OR IGNORE INTO semantic_domain_chirho (name_chirho, description_chirho) VALUES
    ('Existence', 'Being, becoming, existing'),
    ('Motion', 'Movement, travel, direction'),
    ('Communication', 'Speaking, writing, language'),
    ('Emotion', 'Feelings, attitudes, desires'),
    ('Cognition', 'Thinking, knowing, understanding'),
    ('Perception', 'Seeing, hearing, sensing'),
    ('Body', 'Body parts, physical states'),
    ('Nature', 'Natural world, weather, elements'),
    ('Time', 'Temporal concepts'),
    ('Space', 'Location, position, spatial relations'),
    ('Quantity', 'Numbers, amounts, measures'),
    ('Relation', 'Relationships, connections'),
    ('Authority', 'Power, rule, governance'),
    ('Worship', 'Religious acts, sacred things'),
    ('Morality', 'Good, evil, righteousness'),
    ('Social', 'People, groups, society'),
    ('Artifact', 'Made objects, tools, buildings'),
    ('Food', 'Eating, drinking, nourishment'),
    ('Conflict', 'War, strife, opposition'),
    ('Legal', 'Law, judgment, covenant');
