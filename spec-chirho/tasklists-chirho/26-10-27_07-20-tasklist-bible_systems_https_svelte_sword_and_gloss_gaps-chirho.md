# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# bible.systems HTTPS, SWORD count and Svelte upgrade; production gloss gaps

Started 2026-10-27 07:20 EDT. L.J., on the findings from the VPS retirement follow-ups (tasklist
`26-10-26_09-30-tasklist-retire_hetzner_vps_to_worker-chirho.md`, step 12): "could you fix what you
found of https, stale sword, upgrade svelte, and fix those missing glosses".

The bible.systems site is its own repo and Worker (`bible-systems-chirho`):
`/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/personal-aleluya/bible.systems-chirho`. Its working tree
holds someone else's uncommitted edits (AGENTS.md, CLAUDE.md, a global-tools → global-chirho link
swap on two pages); work happens in a scratch worktree and those edits are carried over untouched.

## Steps

- [x] 1. HTTPS: `http://bible.systems` pages answer 200 over plain HTTP (HSTS is already sent);
      redirect plain-HTTP apex requests to HTTPS in `src/hooks.server.ts`, with tests
- [x] 2. Found while checking 1: the server bundle's source map is public
      (`https://bible.systems/_worker.js.map`, 200). It held only Cloudflare's always-pass Turnstile
      test secret, but any real secret read through `$env/static/private` would leak; stop serving it
- [x] 3. SWORD: the homepage and features page say 16 languages; the live repository has 29
      modules in 27 languages. Move the count into `global-tools-catalog-chirho.ts`
- [x] 4. Upgrade Svelte 5.46.1 → 5.57.2 (and the toolchain on SvelteKit 2: kit 2.70.3,
      vite-plugin-svelte 6.2.4, adapter-cloudflare 7.2.9, svelte-check 4.7.7, vite 6.4.4); then fix
      the 28 svelte-check errors with real types; zero errors and warnings
- [x] 5. Deploy bible.systems from a clean worktree; verify live (HTTP → HTTPS on pages, map gone,
      counts, links, reader, feedback endpoint)
- [x] 6. Gloss gaps: per-book coverage, local Postgres vs production D1, for every language (D1
      showed Swahili 1 Samuel 28%, Hindi Hosea 55%, Bengali Revelation 78%, Russian Romans 87%).
      Done against D1, the VPS dump and committed SQL; local Postgres could not be read (7b)
- [ ] 7. Fill the gaps at their source, then verify in D1 and on the live reader:
  - [x] 7a. Reader default type: languages with a complete readers edition and a small terse
        sample (hin, ben, guj, jpn, tel, tha) no longer open chapters without glosses
  - [ ] 7b. L.J.: open Docker Desktop at the console (it crashes when an agent session launches
        it); then back up local Postgres to the encrypted volume before anything else
  - [ ] 7c. Find or restore the translations-chirho working tree (the link, made 2026-05-11,
        points at a folder that does not exist; committed SQL through b9d9a64 is in .git/modules)
  - [ ] 7d. Import committed SQL that never reached Postgres: rus Matthew 4 (430 words), 3 amh words
  - [ ] 7e. Swahili: 13,654 words are glossed in the VPS dump (created 2026-01-21 and 2026-02-06);
        validate them (the dump came from a compromised server), import, with L.J.'s yes
  - [ ] 7f. Translate the remaining ~21,300 words (Opus agents, at most 3 at a time, ~4 chapters
        each); largest runs: ukr Jeremiah 49-52, hin Matthew 27-28 / Hosea 6-14 / Acts 1-5, rus
        Romans 5-16, nep Psalms 79-92, tel, urd Luke 5-7, amh and heb scattered words
  - [ ] 7g. Re-sync each changed language (`sync-per-language-chirho.ts LANG --remote
        --skip-source`, ~40-60 min each, upserts only), then update-stats and verify
- [ ] 8. Downstream of 7: PDFs (R2) and SWORD modules built from gapped data get rebuilt (the
      Swahili PDF and module date from 2026-02-04, before the 2026-02-06 Swahili import)
- [ ] 9. Records: this tasklist, progress log, skills, memory; commits (no push without L.J.)

## Outcomes

- **bible.systems (steps 1-5):** commits 368ec75..d5e7235 in that repo (main_chirho, not pushed),
  deployed as version d0fcac73-6444-4e39-b7a3-2155b4e2ef37 (previous 0625f8f1). Svelte 5.46.1 →
  5.57.2 with kit 2.70.3, vite-plugin-svelte 6.2.4 (4.x had expected Vite 5), svelte-check 4.7.7,
  vite 6.4.4 and adapter-cloudflare 4.9.0 → 7.2.9; set-cookie-parser is held at 3.1.4 by
  `overrides` until 3.2.x is a week old (2026-10-28). SvelteKit 3.1 exists (needs Vite 8, TS 6,
  Node 22.17) and was left for a separate migration. svelte-check went from 28 errors to 0 with
  real types (feedback bubble, interlinear view, chapter reader typed through PageServerLoad /
  PageProps; shared `FEEDBACK_TYPES_CHIRHO` and `VerseCrossReferencesChirho` contracts). The old
  Pages-era adapter had bundled `_worker.js` with a linked source map into the assets directory and
  its `.assetsignore` missed the map, so `/_worker.js.map` was public; it held only Cloudflare's
  always-pass Turnstile test secret. Adapter 7 builds for Workers static assets (binding
  `ASSETS_CHIRHO`), wrangler bundles `main`, and the map path is 404. `http://bible.systems/*` now
  301s to HTTPS keeping path and query; static files (robots.txt, images) are served before the
  hook and still answer HTTP, and HSTS (already sent) covers returning browsers. `wrangler dev`
  presents requests under the route host over http, so `[dev] upstream_protocol = "https"` keeps
  the redirect out of local dev. SWORD: the live repository has 29 modules in 27 languages, now
  `SWORD_MODULE_LANGUAGE_COUNT_CHIRHO`. Verified live: redirects, worker files 404, reader, APIs,
  counts, 56/56 homepage links 200, and a 12-check browser run (counts, feedback form, chapter
  page cross-references, share menu, outside click, arrow-key navigation, no console errors).
  The e2e suite waited on port 5173 (another project's dev server here) instead of 5180; fixed. 9
  of its 19 tests fail identically before and after the upgrade because they pin old copy and the
  old `/read-chirho/<book>/<chapter>` URLs. Also found: the feedback form's Turnstile uses
  Cloudflare's always-pass test keys, so it has no bot protection.
- **Gloss gaps (steps 6-7a):** full report (per-language and 269-row per-book tables, SQL, fix
  commands): `26-10-27_07-20-report-gloss_gaps-chirho.md` beside this tasklist. D1 equals local Postgres as of
  the 2026-03-09/10 sync. 35,396 words have no phrase in their language's main type, across 26
  languages (deu, ita, vie have none); largest swa 13,666, hin 5,541, ukr 3,208, amh 2,748, tel
  2,201, heb 1,690, rus 1,646, tur 1,108. Empty glosses on H0853, G3588, H0413, H5921a, compound
  numbers and 3,159 paragraph markers are deliberate blanks, so Bengali Revelation (78%) has no
  missing words; Swahili 1 Samuel, Hindi Hosea and Russian Romans are real gaps. The bigger visible
  problem was the reader's default type: any terse phrase made terse the default, and hin, ben,
  guj, jpn, tel and tha have only a terse sample, so nearly every chapter opened without glosses.
  Fixed in workers-platform-chirho b00d147 (per-chapter choice: terse unless readers glosses
  outnumber terse more than two to one; the toggle always sets ?type=), version 9a5fed18
  (previous 90a25d4e), edge cache purged for both reader hostnames. An inner-join version of the
  count query exceeded D1's CPU limit and reset bible-lang-hin-chirho once during testing (the
  reader stayed up); the shipped LEFT JOIN form reads at most ~5.4k rows. Re-syncs never delete D1
  rows and send ~1.1M reference verses each run. The VPS dump also holds a complete Hindi terse
  Bible (440,280 words) and Bengali terse, which D1 never had. Blocked on Docker Desktop and the
  missing translations working tree (7b, 7c); every PDF and SWORD module predates the March sync
  and likely carries the same gaps.
