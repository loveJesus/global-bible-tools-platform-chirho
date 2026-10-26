# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Publish a Language to Production (Worker + D1)

Production is the Cloudflare Worker `bible-reader-chirho` (`workers-platform-chirho/`) on the
custom domains global-tools.bible.systems and global-chirho.bible.systems. The local Postgres is
the source of truth; production only reads D1 and R2. (The Hetzner VPS path was retired
2026-10-26.) Step-by-step commands: `.claude/skills/publish-language-chirho/SKILL.md`.

```mermaid
flowchart TD
  sql_chirho["translations-chirho/ verse SQL files"] --> pg_chirho["Local Postgres (sveltekit2-platform-chirho)"]
  pg_chirho --> pdf_chirho["generate-interlinear-bible-pdf-chirho.ts"]
  pdf_chirho --> r2_chirho["R2: media-global-tools.bible.systems/bibles-chirho/"]
  pg_chirho --> exists_chirho{"D1 bible-lang-LANG-chirho exists?"}
  exists_chirho -- no --> create_chirho["wrangler d1 create + DB_LANG_LANG_CHIRHO binding in wrangler.toml"]
  exists_chirho -- yes --> sync_chirho
  create_chirho --> sync_chirho["d1-migration-chirho/sync-per-language-chirho.ts LANG --remote"]
  sync_chirho --> stats_chirho["update-stats-chirho.ts"]
  stats_chirho --> verify_chirho["verify-d1-data-chirho.ts"]
  r2_chirho --> downloads_chirho["Worker downloads page entry"]
  verify_chirho --> deploy_chirho["workers-platform-chirho: build-chirho, deploy-chirho"]
  downloads_chirho --> deploy_chirho
  deploy_chirho --> live_chirho["global-tools.bible.systems + global-chirho.bible.systems"]
```

`wrangler deploy` replaces the Worker's custom-domain set with the `routes` list in
`workers-platform-chirho/wrangler.toml`, so both hostnames must stay listed there.
