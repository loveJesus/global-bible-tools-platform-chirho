# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Global Bible Tools Platform

A Bun-based tooling project for Bible translation with word-by-word interlinear support.

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) runtime
- [Docker](https://docker.com) for PostgreSQL
- macOS: `brew install sword` for reference Bible tools

### 1. Clone and Install

```bash
git clone https://github.com/loveJesus/global-bible-tools-platform-chirho.git
cd global-bible-tools-platform-chirho
bun install
```

### 2. Start Database Services

```bash
cd sveltekit2-platform-chirho
docker compose up -d
```

Services started:
| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5435 | Main database |
| MinIO | 9000/9001 | S3-compatible storage |

### 3. Run Migrations

Apply all database migrations:

```bash
# Apply all migrations in order
for f in sveltekit2-platform-chirho/migrations-chirho/*.sql; do
  echo "Running $f..."
  cat "$f" | docker exec -i sveltekit2-platform-chirho-db-chirho-1 psql -U postgres
done
```

Or run individually:

```bash
# Reference versions (KJV, WEB, RV1909, Hindi IRV)
cat sveltekit2-platform-chirho/migrations-chirho/0001_add_reference_versions_chirho.sql | \
  docker exec -i sveltekit2-platform-chirho-db-chirho-1 psql -U postgres
```

### 4. Start Development Server

```bash
cd sveltekit2-platform-chirho
bun run dev
```

Open http://localhost:5173

## Translation Tools

### Import Translations

Import all translation SQL files from `translations-chirho/`:

```bash
bun run tools-chirho/import-translations-chirho.ts
# Or dry-run first:
bun run tools-chirho/import-translations-chirho.ts --dry-run
```

### Import Reference Bibles

Using SWORD tools (install via `brew install sword`):

```bash
# List available modules
diatheke -b system -k modulelist

# Import a reference version
bun run tools-chirho/import-reference-chirho.ts kjv ./data-chirho/kjv.txt
```

### Generate PDFs

Generate interlinear PDFs with Greek/Hebrew, Strong's numbers, and translations:

```bash
# Generate PDF for a book
bun run tools-chirho/generate-pdf-chirho.ts spa jude

# Specify chapter range
bun run tools-chirho/generate-pdf-chirho.ts hin genesis --chapter 1-10

# Custom page size (a4, a5, letter)
bun run tools-chirho/generate-pdf-chirho.ts spa psalms --size a5
```

Output: `output-chirho/pdfs-chirho/<book>-<lang>-chirho.pdf`

## MCP Server

The Bible translation MCP server provides tools for Claude Code:

```bash
bun run mcp-chirho
```

Available tools:
- `list_books_chirho` - List all Bible books
- `get_verse_chirho` - Get verse with words and glosses
- `get_chapter_chirho` - Get entire chapter as JSON
- `query_lemma_chirho` - Get lemma info with lexicon entries
- `expand_glosses_chirho` - Generate SQL from minimal gloss JSON

## Project Structure

```
platform-chirho/
├── sveltekit2-platform-chirho/   # Primary SvelteKit app
│   ├── src/routes/               # Pages and API routes
│   ├── src/lib/server/           # Drizzle schema
│   ├── migrations-chirho/        # SQL migrations
│   └── compose.yaml              # Docker services
├── tools-chirho/                 # Bun CLI tools
├── translations-chirho/          # Translation SQL files (submodule)
├── spec-chirho/                  # Architecture docs
└── AGENTS.md                     # Full AI agent instructions
```

## Reference Bible Sources

The following reference Bible versions are available in the platform. All are public domain or permissively licensed.

### English

| Version | Code | Verses | Source | License |
|---------|------|--------|--------|---------|
| King James Version | KJV | 29,208 | [CrossWire SWORD](https://crosswire.org) | Public Domain |
| American Standard Version | ASV | 29,368 | [CrossWire SWORD](https://crosswire.org) | Public Domain |
| World English Bible | WEB | ~31,000 | [CrossWire SWORD](https://crosswire.org) | Public Domain |

### Spanish

| Version | Code | Verses | Source | License |
|---------|------|--------|--------|---------|
| Reina-Valera 1909 | SpaRV1909 | 31,084 | [CrossWire SWORD](https://crosswire.org) | Public Domain |

### Bengali

| Version | Code | Verses | Source | License |
|---------|------|--------|--------|---------|
| Bengali Bible 2006 | ben2006eb | 29,396 | [eBible.org](https://ebible.org) | CC BY-SA 4.0 |

### Hindi

| Version | Code | Verses | Source | License |
|---------|------|--------|--------|---------|
| Hindi Easy-to-Read Version | HinERV | 29,258 | [eBible.org](https://ebible.org) | CC BY-SA 4.0 |

### Russian

| Version | Code | Verses | Source | License |
|---------|------|--------|--------|---------|
| Russian Synodal Bible | RusSynodal | 30,811 | [CrossWire SWORD](https://crosswire.org) | Public Domain |

### Swahili

| Version | Code | Verses | Source | License |
|---------|------|--------|--------|---------|
| Swahili Union Version | swhonen | 27,691 | [eBible.org](https://ebible.org/Scriptures/swhonen_vpl.zip) | CC BY-SA 4.0 |

### Turkish

| Version | Code | Verses | Source | License |
|---------|------|--------|--------|---------|
| Turkish Bible | TurHADI | 30,683 | NT: [eBible.org](https://ebible.org), OT: [Sacred Texts](https://sacred-texts.com/bib/wb/trk/) | Public Domain |

### Import Tools

```bash
# Import from SWORD module (requires `brew install sword` on macOS)
bun run tools-chirho/import-sword-chirho.ts <module_name>

# Import from eBible.org VPL format
bun run tools-chirho/import-ebible-vpl-chirho.ts <zip_url> <version_code> [version_name] [language_code]

# Example: Import Swahili Bible
bun run tools-chirho/import-ebible-vpl-chirho.ts \
  https://ebible.org/Scriptures/swhonen_vpl.zip \
  swhonen "Swahili Union Version" swa

# Import Turkish OT from sacred-texts.com
bun run tools-chirho/import-turkish-ot-chirho.ts
```

## Documentation

- [AGENTS.md](./AGENTS.md) - Full agent instructions and naming conventions
- [spec-chirho/platform-overview-chirho.md](./spec-chirho/platform-overview-chirho.md) - Architecture overview
- [spec-chirho/database-architecture-chirho.md](./spec-chirho/database-architecture-chirho.md) - Database schema

## License

All code is released for the glory of God. See individual file headers.
