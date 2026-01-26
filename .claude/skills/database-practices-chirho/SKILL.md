# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

---
name: "database-practices"
description: "Database best practices for PostgreSQL, migrations, and query safety"
---

# Database Practices Skill

## Purpose

Ensure safe, performant, and maintainable database operations.

## Schema Design

### Naming Conventions
```sql
-- Tables: snake_case with _chirho suffix
CREATE TABLE users_chirho (
  id_chirho UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_chirho TEXT NOT NULL UNIQUE,
  name_chirho TEXT,
  created_at_chirho TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at_chirho TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes: descriptive names
CREATE INDEX idx_users_email_chirho ON users_chirho(email_chirho);
```

### Required Columns
Every table should have:
- Primary key (prefer UUID)
- `created_at_chirho` timestamp
- `updated_at_chirho` timestamp (update via trigger or application)

### Foreign Keys
```sql
-- Always use foreign keys for referential integrity
ALTER TABLE feedback_chirho
  ADD CONSTRAINT fk_feedback_user_chirho
  FOREIGN KEY (user_id_chirho) REFERENCES users_chirho(id_chirho)
  ON DELETE SET NULL;
```

## Query Safety

### Parameterized Queries (REQUIRED)
```typescript
// GOOD: Parameterized query
const userChirho = await queryRawChirho<UserChirho>(
  `SELECT * FROM users_chirho WHERE id_chirho = $1`,
  [userIdChirho]
);

// BAD: SQL injection vulnerability
const user = await queryRaw(
  `SELECT * FROM users WHERE id = '${userId}'`  // NEVER DO THIS
);
```

### Input Validation
```typescript
// Always validate before querying
if (!userIdChirho || typeof userIdChirho !== 'string') {
  throw errorChirho(400, 'Invalid user ID');
}

// Validate enum values
const validStatusesChirho = ['new', 'reviewed', 'resolved'];
if (!validStatusesChirho.includes(statusChirho)) {
  throw errorChirho(400, 'Invalid status');
}
```

### Limit Results
```sql
-- Always use LIMIT for potentially large result sets
SELECT * FROM feedback_chirho
ORDER BY created_at_chirho DESC
LIMIT 200;  -- Prevent unbounded queries
```

## Migrations

### Migration File Structure
```
migrations/
├── 0001_create_users_chirho.sql
├── 0002_add_profile_picture_chirho.sql
└── 0003_create_feedback_chirho.sql
```

### Migration Best Practices
```sql
-- Use IF NOT EXISTS for idempotency
CREATE TABLE IF NOT EXISTS feedback_chirho (
  id_chirho SERIAL PRIMARY KEY,
  message_chirho TEXT NOT NULL
);

-- Use IF NOT EXISTS for columns
ALTER TABLE users_chirho
  ADD COLUMN IF NOT EXISTS profile_picture_chirho TEXT;

-- Include rollback comments
-- ROLLBACK: ALTER TABLE users_chirho DROP COLUMN profile_picture_chirho;
```

### Never Do
- Never drop tables in production without backup
- Never modify column types without data migration plan
- Never run migrations without testing on staging first

## Performance

### Indexing Strategy
```sql
-- Index columns used in WHERE clauses
CREATE INDEX idx_feedback_status_chirho ON feedback_chirho(status_chirho);

-- Index columns used in ORDER BY
CREATE INDEX idx_feedback_created_chirho ON feedback_chirho(created_at_chirho DESC);

-- Composite indexes for common query patterns
CREATE INDEX idx_feedback_status_created_chirho
  ON feedback_chirho(status_chirho, created_at_chirho DESC);
```

### Query Optimization
```sql
-- Use EXPLAIN ANALYZE to check query plans
EXPLAIN ANALYZE
SELECT * FROM feedback_chirho
WHERE status_chirho = 'new'
ORDER BY created_at_chirho DESC
LIMIT 50;
```

### Avoid N+1 Queries
```typescript
// BAD: N+1 query pattern
for (const feedbackChirho of feedbackListChirho) {
  const userChirho = await getUserChirho(feedbackChirho.userIdChirho);
}

// GOOD: Single JOIN query
const feedbackWithUsersChirho = await queryRawChirho(`
  SELECT f.*, u.name_chirho as user_name_chirho
  FROM feedback_chirho f
  LEFT JOIN users_chirho u ON f.user_id_chirho = u.id_chirho
`);
```

## Transactions

### When to Use Transactions
```typescript
// Use transactions for multi-step operations
await queryRawChirho('BEGIN');
try {
  await queryRawChirho(
    'UPDATE accounts_chirho SET balance_chirho = balance_chirho - $1 WHERE id_chirho = $2',
    [amountChirho, fromAccountChirho]
  );
  await queryRawChirho(
    'UPDATE accounts_chirho SET balance_chirho = balance_chirho + $1 WHERE id_chirho = $2',
    [amountChirho, toAccountChirho]
  );
  await queryRawChirho('COMMIT');
} catch (errChirho) {
  await queryRawChirho('ROLLBACK');
  throw errChirho;
}
```

## Connection Management

### Docker Development
```bash
# SvelteKit database (primary)
docker exec sveltekit2-platform-chirho-db-chirho-1 psql -U postgres -c "SELECT 1"

# Check connection from Bun tools
bun run tools-chirho/check-db-chirho.ts
```

### Environment Variables
```bash
# Never commit real credentials
DATABASE_URL_CHIRHO=postgresql://postgres:asdfasdf@localhost:5435/postgres
```
