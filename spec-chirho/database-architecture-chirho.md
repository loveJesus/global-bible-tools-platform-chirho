# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Database Architecture - Global Bible Tools Platform

## Overview

PostgreSQL database powering a Bible translation platform. The schema supports:
- Original language Bible text (Hebrew/Greek words with morphological data)
- Multi-language translation workflows
- User management and permissions
- Translation history and audit trails

## Connection Details (Docker Development)

```
DATABASE_URL: postgresql://postgres:asdfasdf@db:5432/postgres
TEST_DATABASE_URL: postgresql://postgres:asdfasdf@test_db:5432/postgres

# From host machine:
Main DB: localhost:5432
Test DB: localhost:5433
```

## Database Access Patterns

### 1. Kysely (Type-Safe Query Builder)
```typescript
import { getDb } from "@/db";
const db = getDb();
// Used for simple CRUD with type safety
```

### 2. Raw pg Queries
```typescript
import { query, transaction } from "@/db";
// Used for complex queries, especially with lateral joins
await query<ResultType>(`SELECT ...`, [params]);
```

### 3. Repository Pattern
Located in `src/modules/*/data-access/`:
- `GlossRepository.ts` - Translation glosses
- `PhraseRepository.ts` - Word groupings for translation
- Type definitions in `types.ts`

## Schema Domains

### Domain 1: Bible Core (Read-Only Reference Data)
Source ERD: `erd-bible-chirho.txt`

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `Book` | 66 Bible books | `id`, `name` |
| `Verse` | Bible verses | `id`, `book_id`, `chapter`, `number` |
| `Word` | Original language words | `id`, `text`, `verse_id`, `form_id` |
| `Lemma` | Dictionary headwords | `id` (e.g., "H1234" for Hebrew) |
| `LemmaForm` | Inflected forms | `id`, `grammar`, `lemma_id` |
| `LemmaResource` | Lexicon entries (BDB, LSJ, Strongs) | `lemma_id`, `resource_code`, `content` |
| `Recording` | Audio recordings | `id`, `name` |
| `VerseAudioTiming` | Audio sync timestamps | `verse_id`, `recording_id`, `start`, `end` |

**Relationships:**
- Word → Verse → Book (Bible structure)
- Word → LemmaForm → Lemma (Morphological chain)
- Lemma → LemmaResource (Dictionary definitions)

### Domain 2: Translation Workflow
Source ERD: `erd-translation-chirho.txt`

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `Language` | Target languages | `id` (UUID), `code`, `name`, `font`, `textDirection` |
| `Phrase` | Group of words to translate together | `id`, `language_id`, `created_at`, `deleted_at` |
| `PhraseWord` | Junction: phrase ↔ word | `phrase_id`, `word_id` |
| `Gloss` | Human translation | `phrase_id`, `gloss`, `state` (APPROVED/UNAPPROVED) |
| `GlossHistory` | Audit trail | `phrase_id`, `gloss`, `state`, `updated_at`, `updated_by` |
| `MachineGloss` | AI suggestions | `word_id`, `language_id`, `gloss`, `model_id` |
| `MachineGlossModel` | AI model registry | `id`, `code` |
| `Footnote` | Translation footnotes | `phrase_id`, `author_id`, `content` |
| `TranslatorNote` | Internal notes | `phrase_id`, `author_id`, `content` |
| `LemmaFormSuggestion` | Form-based suggestions | `language_id`, `form_id`, `gloss`, `count` |

**Translation States:**
```typescript
type GlossState = 'APPROVED' | 'UNAPPROVED';
type GlossSource = 'USER' | 'IMPORT';
```

### Domain 3: User Management

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `User` | User accounts | `id` (UUID), `email`, `name`, `emailStatus` |
| `Session` | Auth sessions | `id`, `userId`, `expiresAt` |
| `LanguageMemberRole` | Per-language permissions | `userId`, `languageId`, `role` |
| `UserSystemRole` | System-wide admin | `userId`, `role` |
| `UserInvitation` | Pending invites | `userId`, `token`, `expires` |
| `ResetPasswordToken` | Password reset | `userId`, `token`, `expires` |
| `UserEmailVerification` | Email verification | `userId`, `email`, `token` |

**Role Types:**
```typescript
type LanguageRole = 'ADMIN' | 'TRANSLATOR' | 'VIEWER';
type SystemRole = 'ADMIN';
type EmailStatus = 'UNVERIFIED' | 'VERIFIED' | 'BOUNCED' | 'COMPLAINED';
```

## Key Queries

### Find translation progress for a verse
```sql
SELECT w.id, w.text, ph.id as phrase_id, g.gloss, g.state
FROM word w
LEFT JOIN phrase_word phw ON phw.word_id = w.id
LEFT JOIN phrase ph ON ph.id = phw.phrase_id
  AND ph.language_id = $language_id
  AND ph.deleted_at IS NULL
LEFT JOIN gloss g ON g.phrase_id = ph.id
WHERE w.verse_id = $verse_id
ORDER BY w.id;
```

### Find next unapproved verse
Uses `LATERAL JOIN` pattern - see `GlossRepository.findNextUnapproved()`

### Batch approve glosses
Uses `unnest()` for efficient bulk operations - see `GlossRepository.approveMany()`

## Custom PostgreSQL Features

- **ULID Generation:** `generate_ulid()` function for time-sortable UUIDs
- **ENUM Types:** `GlossState`, `GlossSource`, `LanguageRole`, `SystemRole`, `EmailStatus`, `TextDirection`, `ResourceCode`
- **pgcrypto Extension:** For cryptographic functions

## Module Structure in Next.js

```
src/modules/
├── access/        # Authentication/authorization
├── bible-core/    # Book, Verse, Word schemas
├── dashboard/     # Admin dashboard
├── languages/     # Language management
├── reporting/     # Analytics
├── snapshots/     # Data export/backup
├── study/         # Study features
├── translation/   # Core translation workflow
└── users/         # User management
```

## Docker Services

| Service | Port | Purpose |
|---------|------|---------|
| `server` | 3000 | Next.js app |
| `job_worker` | 9000 | Async job processor |
| `db` | 5432 | PostgreSQL main |
| `test_db` | 5433 | PostgreSQL test |
| `localstack` | 4566 | S3-compatible storage |
| `docs` | 4000 | Documentation site |

## Tooling Integration Points

For our Bun tools, we can connect to the database:

```typescript
// tools-chirho/db-client-chirho.ts
import postgres from 'postgres';

const DATABASE_URL_CHIRHO = process.env.DATABASE_URL_CHIRHO
  ?? 'postgresql://postgres:asdfasdf@localhost:5432/postgres';

export const sqlChirho = postgres(DATABASE_URL_CHIRHO);
```

Or use fetch to call the Next.js API endpoints when the server is running.
