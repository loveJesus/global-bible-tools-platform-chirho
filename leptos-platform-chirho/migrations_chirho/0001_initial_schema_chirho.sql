-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- Initial schema migration for Leptos platform
-- This creates the core tables for user authentication and feedback

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    hashed_password TEXT NOT NULL,
    profile_picture_chirho TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions_chirho (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token_chirho ON sessions_chirho(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_chirho ON sessions_chirho(user_id);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback_chirho (
    id_chirho SERIAL PRIMARY KEY,
    user_id_chirho UUID REFERENCES users(id) ON DELETE SET NULL,
    email_chirho TEXT,
    category_chirho TEXT NOT NULL,
    message_chirho TEXT NOT NULL,
    page_url_chirho TEXT,
    status_chirho TEXT NOT NULL DEFAULT 'new',
    ai_sentiment_chirho TEXT,
    admin_reply_chirho TEXT,
    created_at_chirho TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at_chirho TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_status_chirho ON feedback_chirho(status_chirho);
CREATE INDEX IF NOT EXISTS idx_feedback_created_chirho ON feedback_chirho(created_at_chirho DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_chirho()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_chirho();
