# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Platform Overview - Global Bible Tools

## What It Does

Global Bible Tools is a collaborative Bible translation platform that helps translators:
1. View original Hebrew/Greek text with morphological analysis
2. Access lexicon resources (BDB, LSJ, Strongs)
3. Translate word-by-word or phrase-by-phrase
4. Get AI-assisted translation suggestions
5. Track translation progress per language
6. Export completed translations

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Stack                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Next.js    │  │ Job Worker  │  │    LocalStack S3    │ │
│  │  Server     │  │ (Lambda)    │  │    (File Storage)   │ │
│  │  :3000      │  │  :9000      │  │      :4566          │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘ │
│         │                │                                  │
│         └────────┬───────┘                                  │
│                  │                                          │
│         ┌───────┴────────┐                                  │
│         │   PostgreSQL   │                                  │
│         │     :5432      │                                  │
│         └────────────────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

## Translation Workflow

### Core Concept: Phrases

A **Phrase** is the unit of translation. It can be:
- A single word (default)
- Multiple words linked together (for idioms, compound expressions)

Each phrase belongs to a specific target language and has:
- A **Gloss** (the translation text)
- A **State** (APPROVED or UNAPPROVED)
- Optional **Footnotes** and **Translator Notes**

### Workflow States

```
Word in original text
        │
        ▼
   ┌─────────┐
   │ No Gloss│ (phrase exists but no translation yet)
   └────┬────┘
        │ User types translation
        ▼
   ┌─────────────┐
   │ UNAPPROVED  │ (translation entered but not reviewed)
   └──────┬──────┘
        │ User approves
        ▼
   ┌─────────────┐
   │  APPROVED   │ (translation verified)
   └─────────────┘
```

### Word Linking

Translators can link multiple original words into a single phrase when:
- Words form an idiom
- A compound expression needs single translation
- Better semantic grouping is needed

```typescript
// Example: linking words
await phraseRepository.linkWords({
  code: 'spa',      // Spanish
  wordIds: ['H1234-01', 'H1234-02'],  // Hebrew words to link
  userId: 'user-uuid'
});
```

## Key Entities

### Bible Text (Immutable)
- **Books**: Genesis through Revelation (66 books)
- **Verses**: ~31,000 verses
- **Words**: ~800,000 original language words
- **Lemmas**: Dictionary headwords (~8,000 Hebrew, ~5,000 Greek)
- **Forms**: Inflected word forms with grammar tags

### Translation (Mutable per Language)
- **Languages**: Target languages (Spanish, French, etc.)
- **Phrases**: Translation units (one per word by default)
- **Glosses**: The actual translations
- **Machine Glosses**: AI-generated suggestions

## Module Responsibilities

| Module | What It Handles |
|--------|-----------------|
| `bible-core` | Book, Verse, Word data access |
| `translation` | Phrase, Gloss, Notes management |
| `languages` | Language settings, membership |
| `users` | Authentication, sessions, invites |
| `access` | Authorization, role checks |
| `snapshots` | Data export, backups |
| `reporting` | Progress analytics |

## API Patterns

The codebase uses Next.js App Router with:
- Server Actions for mutations
- API routes for external integrations
- Direct database queries in server components

### Data Access Pattern
```
Route/Action → Repository → query/transaction → PostgreSQL
```

Repositories encapsulate SQL and return typed results.

## External Integrations

- **S3 (LocalStack in dev)**: File storage for exports
- **Email Service**: User invitations, password reset
- **AI Models**: Machine translation suggestions

## Development Commands

From `nextjs-platform-chirho/`:
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f server

# Run migrations
docker compose exec db psql -U postgres -f /db/migrations/...

# Access database
docker compose exec db psql -U postgres
```

## Our Tooling Layer

This repo (`platform-chirho/`) provides Bun-based tooling:
- Translation batch processing
- Data export utilities
- Migration helpers
- Testing tools

The tooling connects to the same PostgreSQL database used by the Next.js app.
