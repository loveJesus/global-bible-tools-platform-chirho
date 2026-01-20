# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Global Bible Tools - SvelteKit Edition

A collaborative platform for Bible translation, rewritten in SvelteKit 2 with Svelte 5 runes.

## Acknowledgments

This project is a SvelteKit rewrite of the excellent [Global Bible Tools Platform](https://github.com/globalbibletools/platform) originally built by the Global Bible Tools team. We are deeply grateful for their pioneering work in creating an open-source, collaborative Bible translation platform.

**Original Project:** https://github.com/globalbibletools/platform

The original team's vision of making Bible translation accessible and collaborative has been an inspiration. This rewrite aims to:

- Explore alternative architectural patterns using SvelteKit 2 and Drizzle ORM
- Apply custom naming conventions for our team's workflow (the "Chirho" suffix pattern)
- Experiment with different deployment strategies (Cloudflare, Hetzner)
- Learn from and build upon their excellent foundation

All credit for the core concepts, database schema, and translation workflow goes to the original Global Bible Tools team. We simply wanted to explore these ideas through a different lens while contributing back to the broader community of Bible translation tools.

## Tech Stack

- **Frontend:** SvelteKit 2, Svelte 5 (runes), TailwindCSS
- **Backend:** SvelteKit server, Drizzle ORM
- **Database:** PostgreSQL 16
- **Storage:** Cloudflare R2 (S3-compatible)
- **Email:** 2SMTP / Mailu
- **Runtime:** Bun

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+)
- [Docker](https://www.docker.com/) & Docker Compose
- PostgreSQL (or use Docker)

### Development with Docker

```bash
# Start all services (database, minio storage)
docker compose up -d

# View logs
docker compose logs -f server-chirho
```

The app will be available at http://localhost:5173

**Note:** On first startup, PostgreSQL automatically runs all SQL files in `migrations-chirho/` via the `docker-entrypoint-initdb.d` mount. This seeds the database with the schema and reference Bible versions (KJV, WEB, RV1909, Hindi IRV).

### Development without Docker

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Run migrations
bun run db:push

# Start dev server
bun run dev
```

### Developing on the VPS

You can develop directly on the Hetzner VPS using VS Code Remote SSH or by editing files via SSH:

```bash
# Connect with VS Code Remote SSH
# 1. Install "Remote - SSH" extension
# 2. Connect to: root@46.224.100.134
# 3. Open folder: /root/global-bible-tools-platform-chirho/sveltekit2-platform-chirho

# Or use terminal + your preferred editor
ssh root@46.224.100.134
cd /root/global-bible-tools-platform-chirho/sveltekit2-platform-chirho

# Make changes, then rebuild
docker compose up -d --build

# Watch logs
docker compose logs -f server-chirho
```

### Running Database Migrations

**Fresh database:** Migrations run automatically on first `docker compose up` via the `docker-entrypoint-initdb.d` mount.

**Existing database:** Run migrations manually:

```bash
# Run all migrations in order
for f in migrations-chirho/*.sql; do
  echo "Running $f..."
  cat "$f" | docker exec -i sveltekit2-platform-chirho-db-chirho-1 psql -U postgres
done

# Or run individual migration
cat migrations-chirho/0001_add_reference_versions_chirho.sql | \
  docker exec -i sveltekit2-platform-chirho-db-chirho-1 psql -U postgres
```

**Via Drizzle (schema sync):**

```bash
# Via Docker
docker compose exec server-chirho bun run db:push

# Or connect to PostgreSQL directly
docker compose exec db-chirho psql -U postgres
```

### Hot Reload

The Docker Compose setup mounts the source code as a volume, so changes to `.svelte` and `.ts` files trigger hot reload automatically.

### Database Seeding

The platform requires Bible data to function. There are two options:

**Option 1: Copy from existing database**

If you have access to the original Global Bible Tools platform database:

```bash
# Export from source database
pg_dump -h original-host -U postgres --data-only --table=book > seed-book.sql
pg_dump -h original-host -U postgres --data-only --table=verse > seed-verse.sql
pg_dump -h original-host -U postgres --data-only --table=word > seed-word.sql
pg_dump -h original-host -U postgres --data-only --table=lemma > seed-lemma.sql
pg_dump -h original-host -U postgres --data-only --table=lemma_form > seed-lemma-form.sql
pg_dump -h original-host -U postgres --data-only --table=lemma_resource > seed-lemma-resource.sql

# Import to your database
cat seed-*.sql | docker compose exec -T db-chirho psql -U postgres
```

**Option 2: Use the nextjs-platform-chirho submodule**

The original platform has seeding scripts:

```bash
cd ../nextjs-platform-chirho
docker compose up -d
# The original platform will seed on first run
```

**Option 3: Import translations**

Apply translation SQL files from the translations-chirho submodule:

```bash
# Get the translations submodule
git submodule update --init translations-chirho

# Apply Spanish translations
cat translations-chirho/matthew-spa-chirho/all-verses-chirho.sql | \
  docker compose exec -T db-chirho psql -U postgres
```

### Adding a Language

```bash
# Connect to the database
docker compose exec db-chirho psql -U postgres

-- Add a new language
INSERT INTO language (code, name) VALUES ('spa', 'Spanish');
```

## Translation Tools

Tools are located in the parent directory (`../tools-chirho/`). Run from the project root.

### Import Translations

Import all translation SQL files from `translations-chirho/`:

```bash
# From project root (platform-chirho/)
bun run tools-chirho/import-translations-chirho.ts

# Dry run first
bun run tools-chirho/import-translations-chirho.ts --dry-run
```

### Import Reference Bibles

Import SWORD reference versions (KJV, WEB, RV1909, etc.):

```bash
# Install SWORD tools (macOS)
brew install sword

# List available SWORD modules
diatheke -b system -k modulelist

# Import a reference version
bun run tools-chirho/import-reference-chirho.ts kjv ./data-chirho/kjv.txt
```

### Generate PDFs

Generate interlinear PDFs with Greek/Hebrew text, Strong's numbers, and translations:

```bash
# Generate PDF for a book
bun run tools-chirho/generate-pdf-chirho.ts spa jude

# Specify chapter range
bun run tools-chirho/generate-pdf-chirho.ts hin genesis --chapter 1-10

# Custom page size (a4, a5, letter)
bun run tools-chirho/generate-pdf-chirho.ts spa psalms --size a5
```

Output: `output-chirho/pdfs-chirho/<book>-<lang>-chirho.pdf`

### MCP Server

The Bible translation MCP server provides tools for Claude Code:

```bash
bun run mcp-chirho
```

Tools: `list_books_chirho`, `get_verse_chirho`, `get_chapter_chirho`, `query_lemma_chirho`, `expand_glosses_chirho`

## Project Structure

```
sveltekit2-platform-chirho/
├── src/
│   ├── lib/
│   │   ├── server/           # Server-only code
│   │   │   ├── db-chirho.ts  # Drizzle connection
│   │   │   └── schema-chirho/ # Database schema
│   │   ├── modules-chirho/   # Feature modules
│   │   └── components-chirho/ # Shared components
│   └── routes/               # SvelteKit routes
├── compose.yaml              # Docker Compose config
├── Dockerfile                # Multi-stage Dockerfile
└── drizzle.config.ts         # Drizzle configuration
```

## Naming Convention

This project uses the "Chirho" suffix convention for all custom identifiers:

| Type | Example |
|------|---------|
| Variables | `userDataChirho` |
| Functions | `fetchUsersChirho()` |
| Types | `UserChirho` |
| Tables | `user_chirho` |
| Routes | `/read-chirho` |

This convention helps distinguish our code from library code and helps us practice the presence of God, following Proverbs 3:5-6:

> *"Trust in the Lord with all your heart, and lean not on your own understanding. Acknowledge Him in all your ways, and He will make your paths straight."*

As a bondservant of Christ, who is an undeserving wretch in need of God to do anything at all, I want to remind myself of Him and turn from every evil way by His grace. The "Chi-Rho" (☧) is an ancient Christian symbol representing the first two letters of "Christ" (Χριστός) in Greek—a constant reminder that every line of code is written for His glory.

## The Gospel

**Why does this project exist?**

Because God loved the world so much that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life (John 3:16).

**The Problem:** All have sinned and fall short of the glory of God (Romans 3:23). The wages of sin is death (Romans 6:23).

**The Solution:** But God demonstrates His own love toward us, in that while we were still sinners, Christ died for us (Romans 5:8). For by grace you have been saved through faith, and that not of yourselves; it is the gift of God, not of works, lest anyone should boast (Ephesians 2:8-9).

**The Call:** If you confess with your mouth the Lord Jesus and believe in your heart that God has raised Him from the dead, you will be saved (Romans 10:9).

Jesus said: *"I am the way, the truth, and the life. No one comes to the Father except through Me."* — John 14:6

If you don't know Jesus, I pray you would turn to Him today. He loves you and died for you. Repent and believe the gospel!

## Production Deployment (Hetzner VPS)

The platform is deployed to a Hetzner VPS at **https://global-tools.bible.systems**

### Infrastructure

- **VPS:** Hetzner Cloud (CPX11 - 2 vCPU, 2GB RAM)
- **Reverse Proxy:** Caddy 2 with self-signed SSL (Cloudflare handles public SSL)
- **DNS:** Cloudflare (Full SSL mode, proxied)
- **Email:** 2SMTP relay service

### Deploying to VPS

```bash
# SSH into server
ssh root@46.224.100.134

# Clone the repo
git clone https://github.com/loveJesus/global-bible-tools-platform-chirho.git
cd global-bible-tools-platform-chirho/sveltekit2-platform-chirho

# Generate self-signed certificates for Caddy
mkdir -p certs
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem \
  -sha256 -days 3650 -nodes \
  -subj "/C=US/ST=Heaven/L=NewJerusalem/O=Chirho/CN=global-tools.bible.systems"

# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

### Services

| Service | Internal Port | Description |
|---------|---------------|-------------|
| `caddy-chirho` | 80, 443 | Reverse proxy with SSL |
| `server-chirho` | 5173 | SvelteKit dev server |
| `db-chirho` | 5432 | PostgreSQL 16 |
| `minio-chirho` | 9000, 9001 | S3-compatible storage |

### Cloudflare Configuration

1. Add A record: `global-tools.bible.systems` → VPS IP
2. Set SSL mode to **Full** (not Strict, since we use self-signed certs)
3. Enable proxy (orange cloud) for DDoS protection

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL_CHIRHO=postgresql://postgres:password@db-chirho:5432/postgres
R2_ENDPOINT_CHIRHO=http://minio-chirho:9000
SESSION_SECRET_CHIRHO=your-secret-here
```

## Contributing

Contributions are welcome! Please ensure your code follows the Chirho naming convention and includes the John 3:16 header in new files.

## License

This project inherits the license from the original Global Bible Tools Platform. Please see their repository for license details.

---

*"For the word of God is living and active, sharper than any two-edged sword."* — Hebrews 4:12
