# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Retire the Hetzner VPS; serve global-tools.bible.systems from the Worker

Started 2026-10-26 09:30 EDT. L.J.: take the server down after grabbing all the useful data
locally, and point global-tools.bible.systems at the Cloudflare Worker.

Context: global-tools.bible.systems was a proxied A record to Hetzner Cloud server
`global-bible-tools-chirho` (id 117871386, 46.224.100.134, cpx32). It ran `vite dev` in Docker
with Postgres (5435/5433), MinIO (9000/9001) and the dev server (5173) published to the internet.
Both Postgres containers were compromised (miner since 2026-09-05), and every page has returned
500 since 10:57 UTC today. No other DNS record in the 100 Cloudflare zones points at that IP.

Backups go to the encrypted volume, outside git (other people's data + secrets):
`/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho/vps-retirement-backup-chirho/26-10-26-chirho/`

## Steps

- [x] 1. Progress logger (`spec-chirho/log_step_chirho.ts`) + this tasklist
- [x] 2. Point global-tools.bible.systems at Worker `bible-reader-chirho` (remove the A record,
      attach a Workers custom domain); verify `/`, `/read-chirho/…`, `/downloads-chirho`
- [x] 3. `workers-platform-chirho/wrangler.toml`: `routes` sat inside `[assets]` (ignored);
      declare both custom domains so a future deploy keeps them; validate with a dry run
- [x] 4. Contain the VPS for a clean backup: Hetzner Cloud firewall (inbound SSH only), stop
      web/caddy/test-db/minio containers, kill the malware processes, check Postgres persistence
- [x] 5. Back up prod Postgres (`pg_dump -Fc` over SSH); verify the archive decompresses fully and
      row counts match the live counts taken just before the dump
- [x] 6. Back up files: server `.env`, compose/Caddyfile, certs, rclone config, root crontab and
      history, untracked scripts, `static/downloads-chirho`, `static/sword-modules`,
      `/opt/translations-chirho`, `/root`; PDFs only where R2 lacks them
- [x] 7. Shut down the VPS (`hcloud server shutdown 117871386`)
- [x] 8. L.J. decides: delete now / snapshot then delete / keep powered off → snapshot, then delete
- [x] 9. Docs that still call the VPS production: AGENTS.md, sveltekit README,
      publish-language skill; add the Worker deploy workflow DAG
- [ ] 10. Follow-ups: rotate keys that lived on the server (2SMTP, R2 if shared, API_KEY), draft a
      note to the 13 users for L.J., compare prod-only data (users, feedback, gloss_history) with
      local/D1. (No origin cert to revoke: the Caddy certs were self-signed.)
- [x] 11. L.J.: fix the bible.systems links to the PDFs. bible.systems homepage grid and the
      global-tools language pages' PDF buttons pointed at VPS-only paths; repoint both to R2

## Outcomes

- **Site restored 09:35 EDT** (13:35 UTC) after ~2.6 h of 500s: global-tools.bible.systems is a
  Workers custom domain on `bible-reader-chirho`. The old record was A 46.224.100.134, proxied,
  TTL auto (id 9e1e503eef44b153f5c05ff7fbdc004a). Login, translate, admin and the per-book PDF API
  no longer exist publicly.
- **Containment:** Hetzner firewall 11896167 (`global-bible-tools-retire-ssh-only-chirho`, inbound
  TCP 22 only). The attacker persisted with `session_preload_libraries` →
  `$PGDATA/gcmanager-1.so` (`postgresql.conf:747`, dated 2026-10-04), so the data volume itself
  is tainted. Two malware processes killed; a fresh miner had been dropped at 13:36 UTC. No
  SQL-level persistence (no foreign C functions, event triggers, large objects or extra roles).
- **Backup** (encrypted volume, path above; README-chirho.md there lists contents, checksums and
  IOCs): `prod-postgres-chirho.dump` 463 MB, restore-verified (38/38 tables, row counts identical
  to the live counts); `server-files-chirho.tar.gz` 188 MB (5,881 entries, equal to the server-side
  count); the one PDF missing from R2 (`interlinear-por-acf-chirho.pdf`), sha256-verified. 20 of
  22 server PDFs were already on R2 at identical sizes. MinIO was empty.
- **Server deleted 10:15 EDT.** Snapshot 448346058 (33.8 GB, labels `retired-chirho=2026-10-26`,
  `compromised-chirho=true`) is kept in Hetzner: never boot it, delete it after 2026-11-26. Primary
  IPv4 46.224.100.134 and IPv6 auto-deleted with the server; firewall 11896167 deleted.
- **Unused IPv4 check (L.J.):** all 8 IPv4s in the Hetzner project (the only project; 136 `.env`
  files share one token) were attached to servers, and there were no floating IPs, so nothing else
  to remove. DNS was scanned but not changed: 304 A records / 187 IPs across 100 zones, about 60
  pointing at Hetzner IPs outside this project (likely clients' or third-party servers). A
  dangling-record audit would be separate work.
- **Git remotes:** at L.J.'s direction, renamed our GitHub remotes to the standard `gh_chirho`
  (platform: was `github_chirho`; `sveltekit2-platform-chirho` and `sword-repo-chirho`: were
  `origin`). `nextjs-platform-chirho` keeps `origin` (upstream globalbibletools).
- **PDF links (step 11):** the bible.systems homepage (separate Worker `bible-systems-chirho`, repo
  `/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/personal-aleluya/bible.systems-chirho`) linked 19 PDFs
  at `global-tools.bible.systems/bibles-chirho/`, which only the VPS served; they now point at R2
  (`media-global-tools.bible.systems/bibles-chirho/`), and two reader links were fixed (`cmn` →
  `zho`, `eng/jhn/3` → `eng/43003`). Commit f49f892 there, deployed as version 51e1d984 (previous
  01ff88b5), built from a clean worktree: that repo's working tree holds someone's uncommitted
  2026-03-14 global-tools → global-chirho link swap, left in place with its PDF lines moved to R2.
  On global-tools, every `/read-chirho/<code>` page's only PDF buttons were "reference text only"
  links to the VPS's on-demand generator (404). Commit 96ec20e moves the 35-entry list into
  `workers-platform-chirho/src/lib/shared-chirho/pdf-downloads-chirho.ts`, so each language page
  shows its interlinear PDFs (29/29 languages, 35 links, all 200 `application/pdf`); Worker
  version 90a25d4e at a7ca345 (previous df9350ae), built from a clean export because
  `word-detail-chirho/+server.ts` has someone's uncommitted, never-deployed cache header. That
  deploy also turned off the Worker's `*.workers.dev` URL (nothing referenced it); `wrangler.toml`
  now says so explicitly. Reference-text-only PDFs exist nowhere now; generating them into R2 is
  open, after checking each reference text's license.
