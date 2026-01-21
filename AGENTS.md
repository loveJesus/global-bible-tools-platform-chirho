# For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16

# Global Bible Tools Platform - Agent Instructions

This is a Bun-based tooling project with two platforms:
- **SvelteKit 2** (`sveltekit2-platform-chirho/`) - Our primary dev environment (Chirho naming)
- **Next.js** (`nextjs-platform-chirho/`) - Upstream reference (no Chirho naming)

This project provides:
- Translation generation and management tools
- Build scripts and utilities
- Database tooling and queries
- Development helpers

## Architecture Documentation

**Read these first to understand the platform:**
- `spec-chirho/platform-overview-chirho.md` - High-level architecture and workflow
- `spec-chirho/database-architecture-chirho.md` - Database schema and access patterns
- `erd-bible-chirho.txt` - Bible data ERD (books, verses, words, lemmas)
- `erd-translation-chirho.txt` - Translation workflow ERD (phrases, glosses)

## Runtime

**Bun-only runtime** - NEVER use npm/npx/yarn. Always use `bun` or `bunx`.

## The Suffix Rule

**IMPORTANT:** The `nextjs-platform-chirho/` submodule is upstream code and does NOT follow Chirho naming.
ALL identifiers created by us (outside the submodule) must have the `Chirho` suffix in the appropriate case.

| Type                                                  | Case Style        | Suffix                  | Example                                                                                                     |
|-------------------------------------------------------|-------------------|-------------------------|-------------------------------------------------------------------------------------------------------------|
| **Variables/Functions/Consts/Lambda/Parameters (TS)** | `camelCase`       | `Chirho`                | `userDataChirho`, `fetchUsersChirho()`                                                                      |
| **Object Properties/JSON**                            | `camelCase`       | `Chirho`                | `{ emailChirho: 'value' }`                                                                                  |
| **Classes/Components/Types**                          | `PascalCase`      | `Chirho`                | `CustomerChirho`, `SiteFormChirho`                                                                          |
| **Global Constants/Env Vars**                         | `SCREAMING_SNAKE` | `_CHIRHO`               | `API_KEY_CHIRHO`, `MAX_TOKENS_CHIRHO`                                                                       |
| **Bun/NPM Scripts**                                   | `kebab-case`      | `-chirho`               | `build-prod-chirho`, `test-e2e-chirho`                                                                      |
| **Directories (ours)**                                | `kebab-case`      | `-chirho`               | `services-chirho/`, `templates-chirho/`                                                                     |
| **Public Web Routes/Paths**                           | `kebab-case`      | `-chirho`               | `/about-chirho`, `/contact-chirho`                                                                          |
| **API Endpoints**                                     | `kebab-case`      | `-chirho`               | `/api-chirho/v1-chirho/contact-chirho`                                                                      |
| **Database Tables/Columns**                           | `snake_case`      | `_chirho`               | `customers_chirho`, `created_at_chirho`                                                                     |
| **JSON Rest Api properties**                          | `snake_case`      | `_chirho`               | `customers_chirho`, `created_at_chirho`                                                                     |
| **React/Next Components**                             | `PascalCase`      | `Chirho`                | `HeaderChirho.tsx`, `FooterChirho.tsx`                                                                      |
| **Custom OAuth Scopes**                               | `snake_case`      | `_chirho:action_chirho` | `sites_chirho:read_chirho`                                                                                  |

## Project Structure

```
platform-chirho/
├── AGENTS.md                     # This file - AI agent instructions
├── CLAUDE.md                     # Points to AGENTS.md
├── package.json                  # Bun package configuration
├── .gitignore
├── .gitmodules                   # Submodule config
├── .env                          # Environment variables
├── erd-bible-chirho.txt          # Bible data ERD diagram
├── erd-translation-chirho.txt    # Translation workflow ERD
├── sveltekit2-platform-chirho/   # PRIMARY: SvelteKit 2 app (Chirho naming)
│   ├── src/lib/server/           # Server code, Drizzle schema
│   ├── src/routes/               # SvelteKit routes
│   ├── compose.yaml              # Docker: PostgreSQL, MinIO, Caddy
│   └── Caddyfile                 # Reverse proxy config
├── nextjs-platform-chirho/       # [SUBMODULE] Next.js app (upstream reference)
│   ├── src/modules/              # Feature modules
│   ├── db/migrations/            # SQL migrations
│   └── compose.yaml              # Docker services
├── translations-chirho/          # [SUBMODULE] Translation SQL files
├── tools-chirho/                 # Bun tooling scripts (MCP server)
├── scripts-chirho/               # Build and utility scripts
└── spec-chirho/                  # Specifications and AI notes
    ├── platform-overview-chirho.md
    ├── database-architecture-chirho.md
    └── sveltekit-rewrite-plan-chirho.md
```

## SvelteKit Platform (Primary)

The `sveltekit2-platform-chirho/` directory is our primary development environment.
**Production:** https://global-tools.bible.systems

### Production VPS (Hetzner)
- **IP:** 46.224.100.134
- **SSH:** `ssh root@46.224.100.134`
- **App Directory:** `/opt/app-chirho`
- **Deployment Repo:** Uses `global-bible-tools-sveltekit-chirho` (separate from platform repo)

**To deploy updates:**
```bash
ssh root@46.224.100.134
cd /opt/app-chirho
git pull origin main_chirho
docker compose down && docker compose up -d --build
```

### Running Locally
```bash
cd sveltekit2-platform-chirho
docker compose up -d        # Start all services
docker compose logs -f      # View logs
```

### Troubleshooting Docker

**"Cannot find module" errors after adding dependencies:**

The SvelteKit Docker setup uses a named volume (`sveltekit-node-modules-chirho`) to persist
`node_modules` for faster rebuilds. If you add new dependencies to `package.json`, the stale
volume will override the newly built image's `node_modules`. To fix:

```bash
cd sveltekit2-platform-chirho
docker compose down server-chirho
docker volume rm sveltekit2-platform-chirho_sveltekit-node-modules-chirho
docker compose up -d server-chirho
```

This removes the cached volume so it gets populated fresh from the rebuilt image.

### Services (Local Development)
| Service | Port | URL |
|---------|------|-----|
| SvelteKit Server | 5173 | http://localhost:5173 |
| PostgreSQL | 5435 | postgresql://postgres:asdfasdf@localhost:5435/postgres |
| Test DB | 5433 | postgresql://postgres:asdfasdf@localhost:5433/postgres |
| MinIO (S3) | 9000 | http://localhost:9000 |
| MinIO Console | 9001 | http://localhost:9001 |

### Key Paths
- `src/lib/server/db-chirho.ts` - Database connection (Drizzle + pg)
- `src/lib/server/schema-chirho/` - Drizzle schema definitions
- `src/lib/modules-chirho/` - Feature modules
- `src/routes/` - SvelteKit routes
- `compose.yaml` - Docker services

### Routes
- `/read-chirho/[code]/[chapter]` - Reader view
- `/translate-chirho/[code]/[verse]` - Translation view
- `/login-chirho` - Authentication

---

## Next.js Platform (Upstream Reference)

The `nextjs-platform-chirho/` directory is a git submodule pointing to:
`https://github.com/globalbibletools/platform.git`

**Note:** This is used as a reference for upstream features. Use SvelteKit for development.

### Key Paths in Submodule
- `src/db.ts` - Database connection (Kysely + pg)
- `src/modules/` - Feature modules (translation, languages, users, etc.)
- `db/migrations/` - SQL migrations
- `compose.yaml` - Docker services

### Running (if needed for reference)
```bash
cd nextjs-platform-chirho
docker compose up -d        # Start all services
docker compose logs -f      # View logs
```

### Services
| Service | Port | URL |
|---------|------|-----|
| Next.js Server | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | postgresql://postgres:asdfasdf@localhost:5432/postgres |
| Test DB | 5433 | postgresql://postgres:asdfasdf@localhost:5433/postgres |
| LocalStack S3 | 4566 | http://localhost:4566 |

## Database Quick Reference

### Key Tables
**Bible Data (read-only):**
- `Book`, `Verse`, `Word` - Bible text
- `Lemma`, `LemmaForm`, `LemmaResource` - Lexicon data

**Translation Data (per language):**
- `Language` - Target languages
- `Phrase`, `PhraseWord` - Translation units
- `Gloss`, `GlossHistory` - Translations and audit trail
- `MachineGloss` - AI suggestions

**Users:**
- `User`, `Session`, `LanguageMemberRole`

### Connecting from Bun Tools

**IMPORTANT:** PostgreSQL runs inside Docker. The tools automatically detect connection issues
and fall back to `docker exec` if a local PostgreSQL is intercepting the port.

```typescript
// tools-chirho/db-chirho.ts provides:
import { queryPgChirho, initPgConnectionChirho, dockerExecJsonQueryChirho } from './db-chirho';

// Initialize connection (auto-detects docker exec fallback)
await initPgConnectionChirho();

// Query using raw SQL (works with both direct and docker exec)
const booksChirho = await queryPgChirho(`SELECT * FROM book ORDER BY id`);
```

**Direct Query via Docker (for debugging):**
```bash
# SvelteKit database (primary)
docker exec sveltekit2-platform-chirho-db-chirho-1 psql -U postgres -c "SELECT * FROM book LIMIT 5"

# Next.js database (if running)
docker exec nextjs-platform-chirho-db-1 psql -U postgres -c "SELECT * FROM book LIMIT 5"
```

**If you have local PostgreSQL running (Homebrew, etc.):**
The MCP server and tools will automatically fall back to docker exec.
No action needed - just ensure Docker is running.

## File Headers

All new source files must include the John 3:16 header as a comment at the top:

**TypeScript/JavaScript:**
```typescript
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16
```

**SQL:**
```sql
-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16
```

**Markdown:**
```markdown
# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16
```

## Translation Tools

### MCP Server
The `bible-translation-chirho` MCP server provides these tools directly to Claude:
- `list_books_chirho` - List all Bible books
- `get_verse_chirho` - Get verse with words and glosses
- `get_chapter_chirho` - Get entire chapter as JSON
- `query_lemma_chirho` - Get lemma info with lexicon entries
- `set_decision_chirho` - Record translation decision for consistency
- `get_decisions_chirho` - List all recorded decisions
- `check_consistency_chirho` - Find inconsistent translations
- `generate_translation_sql_chirho` - Generate idempotent SQL

### CLI Commands
```bash
bun run init-db-chirho              # Initialize SQLite tracking DB
bun run list-books-chirho           # List all Bible books
bun run get-verse-chirho "Gen 1:1"  # Get single verse
bun run get-chapter-chirho "Gen 1"  # Get chapter as JSON
bun run query-lemma-chirho H3820    # Query lemma info
bun run set-decision-chirho H3820 "heart" "Always literal"
bun run check-consistency-chirho    # Find inconsistencies
bun run generate-sql-chirho fra translations.json
```

### Translation Philosophy
1. **Literal word-for-word** - Each Hebrew/Greek word gets a translation
2. **Lemma consistency** - Same root word → same translation
3. **Particles hyphenated** with n-dash: "the–heavens", "in–beginning"
4. **Names transliterated from Greek** with accents (e.g., Iēsoûs, Christós, Pétros)
5. **Word order preserved** unless meaning would be lost

### Token-Efficient Translation Workflow (MCP Tools)

**IMPORTANT:** Use MCP tools directly for maximum token efficiency:

1. **Get words to translate** via MCP tool:
   ```
   get_words_for_translation_chirho(book: "jude")
   ```
   Returns: `{"6500100101":"Ἰούδας","6500100102":"Ἰησοῦ",...}`

2. **Create translation** - output ONLY the gloss values:
   ```json
   {
     "6500100101": "Ioudas",
     "6500100102": "de–Iēsoû",
     "6500100103": "Christoû"
   }
   ```

3. **Generate SQL files** via MCP tool:
   ```
   expand_glosses_chirho(
     language_code: "spa",
     book_name: "jude",
     glosses: {"6500100101": "Ioudas", ...}
   )
   ```
   This fetches Greek/lemmas from DB and writes SQL files automatically.

**Token savings:** ~70% vs verbose JSON. Agent outputs only gloss decisions.

### SQLite Tracking Database
Located at `data-chirho/translation-tracking-chirho.db`:
- `lemma_decision_chirho` - Decided translations for lemmas
- `lemma_sense_chirho` - Multiple senses for polysemous words
- `particle_rule_chirho` - How to handle particles
- `semantic_domain_chirho` - Word categorization

### Claude Command
Use `/translate-chirho <language> <scope>` to create translations:
```
/translate-chirho fra "Genesis 1"
/translate-chirho deu "Psalm 23"
```

## Common Tasks

### Query the database directly
```bash
# SvelteKit database (primary)
cd sveltekit2-platform-chirho && docker compose exec db-chirho psql -U postgres

# Or directly:
docker exec -it sveltekit2-platform-chirho-db-chirho-1 psql -U postgres
```

### Start local development
```bash
cd sveltekit2-platform-chirho
docker compose up -d        # Start PostgreSQL, MinIO
bun install                 # Install dependencies
bun run dev                 # Start dev server at http://localhost:5173
```

### Update nextjs submodule (for upstream changes)
```bash
cd nextjs-platform-chirho
git pull origin main
cd ..
git add nextjs-platform-chirho
git commit -m "Update platform submodule"
```

### Sync data from nextjs to sveltekit DB
```bash
# Export from nextjs
docker exec nextjs-platform-chirho-db-1 pg_dump -U postgres --data-only > /tmp/data.sql

# Import to sveltekit
docker exec -i sveltekit2-platform-chirho-db-chirho-1 psql -U postgres < /tmp/data.sql
```

---

## Development Best Practices

These guidelines help maintain quality during AI-assisted rapid development.

### Incremental Commits

**Commit early and often.** Don't accumulate large changesets.

| Changeset Size | Commit Frequency |
|----------------|------------------|
| Single file fix | Commit immediately |
| Feature (2-5 files) | Commit per logical unit |
| Large refactor | Commit every 15-30 minutes |

**Benefits:**
- Easy rollback if something breaks
- Clear history of what changed when
- Reduces merge conflicts
- Documents decision points

```bash
# Good: Frequent, descriptive commits
git add src/routes/login-chirho/
git commit -m "Add login page UI with form validation"

git add src/lib/server/auth-chirho.ts
git commit -m "Implement session management"

# Bad: One massive commit
git add .
git commit -m "Add authentication"  # What changed? Hard to review.
```

### Validation Checkpoints

**Test at natural breakpoints**, not just at the end.

| Checkpoint | What to Verify |
|------------|----------------|
| After schema changes | Run migrations, check DB state |
| After API changes | Test endpoints with curl/httpie |
| After UI changes | Visual check in browser |
| After deploy scripts | Run in test environment first |

**Checkpoint Script Pattern:**
```bash
# After each major change:
bun run build           # Does it compile?
bun run check           # TypeScript errors?
bun run test            # Tests pass?
# Only then: git commit
```

### Understand Before Proceeding

**Never copy-paste generated code without understanding it.**

Questions to ask before accepting AI-generated code:
1. What does this code do?
2. Why is it structured this way?
3. What could go wrong?
4. How would I debug this?

**Red flags to watch for:**
- Code that "looks right" but you can't explain
- Complex regex or algorithms you don't understand
- External API calls you haven't verified
- Security-sensitive operations (auth, crypto, file I/O)

### Scope Management

**Break large tasks into smaller, verifiable pieces.**

```
# Instead of:
"Implement user authentication"

# Break into:
1. Create user table schema
2. Add registration endpoint
3. Add login endpoint
4. Implement session management
5. Add auth middleware
6. Protect routes
7. Add logout
8. Test full flow
```

Each step should be:
- Independently testable
- Independently committable
- Rollback-able without affecting other steps

### Error Recovery

**When something breaks:**

1. **Don't panic** - Git has your back
2. **Identify the last working state** - `git log --oneline`
3. **Isolate the change** - `git diff HEAD~1`
4. **Decide: fix forward or rollback** - Depends on complexity
5. **Document what happened** - Future you will thank you

```bash
# Quick rollback of last commit (keeps changes staged)
git reset --soft HEAD~1

# Full rollback (discards changes)
git reset --hard HEAD~1

# Rollback specific file
git checkout HEAD~1 -- path/to/file.ts
```

### AI Collaboration Guidelines

**Working effectively with AI assistants:**

| Do | Don't |
|----|-------|
| Verify output before committing | Blindly trust generated code |
| Ask for explanations | Accept "magic" solutions |
| Test incrementally | Wait until everything is "done" |
| Keep context focused | Mix unrelated tasks |
| Commit working states | Let changes accumulate |

**The 200x Rule:** AI can accelerate development 200x, but a bug introduced at 200x speed is still a bug. Quality gates remain essential.
