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
  - [x] 7b. Local Postgres found and backed up. It was never in Docker Desktop (no containers or
        volumes there): it lives in colima (`docker --context colima`, stopped since 2026-10-08).
        Started with `colima start --activate=false`; `pg_dump -Fc` to the encrypted volume
        (`local-postgres-backup-chirho/26-10-27-chirho/`, 253 MB + globals), restored into a scratch
        DB: all 25 tables match row for row, 51/51 indexes. PG equals D1 (newest phrase 2026-03-03)
  - [x] 7c. Translations working tree restored from the submodule git dir (b9d9a64; GitHub's
        6e7d7f4 is its parent) at the symlink's target on the encrypted volume: 715,346 files,
        14 GB, clean. The platform's `git status` already failed on the symlinked submodule (Apple
        git 2.54); `submodule.translations-chirho.ignore=all` in .git/config fixes it
  - [x] 7d. rus Matthew 4 (430 words) and 3 amh words (Gen 24:23, 27, 30) imported to Postgres and
        published to D1. The committed rus Matthew 4 SQL said `code = 'swa'` (why it never reached
        rus; replayed, it would have overwritten Swahili); fixed in translations 7781e42. A scan of
        all 46 type/language dirs found no other wrong-language files
  - [x] 7g′. `sync-per-language-chirho.ts --since '<PG time>'` publishes only changed rows (seconds
        instead of ~1 h per language); used for rus and amh, verified in D1 and on the live reader
  - [ ] 7e. Swahili: 13,654 words are glossed in the VPS dump (created 2026-01-21 and 2026-02-06);
        validate them (the dump came from a compromised server), import, with L.J.'s yes
  - [ ] 7f. Translate the remaining words (Opus agents, at most 3 at a time). Work list from
        Postgres after 7d: 34,963 words, of which swa 13,654 may come from the VPS dump (7e) and
        ~1,700 amh/heb paragraph markers stay blank, so ~19,600 to translate. After each batch:
        merge verse files that already existed (expand_glosses overwrites a verse file with only
        the words passed, and rewrites the book's all-verses-chirho.sql with only that call's
        words), import only the new blocks, publish with --since, check D1 and the live page
    - [x] Batch 1: hin readers Matthew 27 (1,042), ukr readers Jeremiah 49-50 (1,306), ukr
          readers Jeremiah 51 (905); all validated, imported, published with --since, checked in
          D1 and live; translations 172ac7d. hin Matthew 27 still opened in terse (an 880-word
          terse sample sits in that chapter), so the reader rule changed again: terse only where
          terse covers every word, else the type covering more (workers 4077b42, version
          0f0c3911, previous 9a5fed18, cache purged; live: hin Matt 27 and eng Mark 16 open in
          readers, eng John 3 and jpn Gen 1 stay terse)
      - [x] hin Matthew 27 review notes: names where the edition disagrees with itself (पिलातुस,
            राज्यपाल, सरकण्डा, शमौन, बरब्बा…); 27:4 and 27:46 (ἵνα τί → क्यों क्या) copy
            awkward earlier choices; one bracket in 27:19
      - [x] ukr Jeremiah 49-50 review notes: lemma tags that do not fit (50:17 H6105a, 50:11
            H1877, 50:44 H0970), אֲדֹנָי יְהוִה as "Господь БОГ"; full text for review in the
            scratchpad file review-jer49-50-chirho.txt
      - [x] ukr Jeremiah 51: 905/905 validated (no missing, no extra, ukr/readers in every
            block), imported, published (`--since '2026-10-27 21:40'`), D1 905 words / 857 glossed
            (48 deliberate blanks: 26 H0853, 10 ס, 8 ketiv, 4 prepositions before a direct object),
            live page checked. 51:15-16 match the edition's 10:12-13 word for word.
            For review: 51:3 follows the vowels and Ohienko ("Проти…", eng/srp readers chose "let
            not"), and the DB lemma tags of 2405100306 (H0408) and 2405100309 (H0413) look
            swapped; the existing Jer 10:14 ("Нерозумний кожен людина від–знання") and 10:16
            (נַחֲלָתוֹ as "спадкоємця–Його") look wrong and were left as they are
    - [x] Batch 2: hin readers Hosea 6:10-14:9 (1,220; ketiv blank, ¶ for markers as Hosea 1-6
          does), hin readers Matthew 28 (336), ukr readers Jeremiah 52 (569) + Isaiah 2 (256) +
          Ezekiel's 155 blank-type tokens (merged into the 111 existing verse files, blocks kept,
          summary line recomputed); validated, imported, published, D1 and live checked;
          translations 75cc78e, 41b4b27. Ukrainian readers now lacks only 17 words
    - [x] Held (not imported), copies on the encrypted volume under
          `gloss-gaps-held-chirho/26-10-27-chirho/`: hin Acts 1-5 (850 gap words) and ukr Zech
          5-7 / Hab 1:4 / Job 36:12 (17) with a 175-id realignment proposal. In those verses the
          existing glosses sit on the wrong source words, so filling only the gaps repeats text
    - [ ] **Decision for L.J.: re-gloss misaligned verses whole, replacing their glosses.** After
          batches 1-2, 29,174 words remain and no whole verse is missing anywhere: 10,092 words
          in 3,231 verses are trailing gaps (the verse's last words; hin 2,064, tel 2,028, rus
          1,173, tur 820, nep 725, jav 568, urd 469, kor 283, eng 265…), 14,827 are holes (swa
          12,472, mostly in the VPS dump; amh 616; hin Acts 850; ben 342), 4,255 marker-only.
          Samples: rus Romans 8:1 shifted one word from τοῖς on; tel Acts 28:1 a Telugu sentence
          over the first slots; hin Acts 1:1 Θεόφιλε = "येशू"; swa 1 Samuel 14:1 correctly placed
          but partial. Trailing gaps are the misalignment signature; misaligned verses without
          gaps (hin Acts 2:31, Zech 5:5) need a separate detector
      - Cause (found 2026-10-28): the Feb-Mar 2026 Opus 4.5 agents numbered word ids in sequence
        instead of taking each word's own id. rus Romans: Greek articles got no gloss (Russian
        has none) but the ids kept counting, so each later gloss sits one slot early per article
        (in 198 of the 277 broken verses the unglossed tail equals the article count exactly;
        259 within one). hin/tel readers: a target-language sentence chunked over the ids, as the
        readers rule then asked ("Natural target-language word order", AGENTS.md until ce6259f
        on 2026-03-03; Hindi's glosses predate the readers type and became its readers edition on
        2026-02-12). `expand_glosses_chirho` accepts any id map and "complete" counted verses, so
        nothing flagged it; its per-word file comments show the mismatch (`πάντων → हे–थियुफिलुस`).
        Prevention: a coverage/shift check in the tool and a lemma-based shift detector. The
        agent definition's fix (source order for readers too) has sat uncommitted since 2026-02-26
      - Not a word-split change (checked 2026-10-28, on L.J.'s question): the word table is the
        same in local Postgres, the VPS dump (row by row) and all 29 production D1s (per-book
        fingerprints); the words recorded in every gloss file (10,256,552 lines) are today's words
        at the same ids, apart from 38 cosmetic differences from hand-written scripts; in 2,689 of
        the 3,231 slipped verses Postgres holds exactly the file's glosses (507 have no committed
        file: tel, nep, tha, guj, mya, jpn). Translations do differ: the VPS also had hin and ben
        terse and 13,654 swa words. Scripts: `gloss-gaps-held-chirho/26-10-27-chirho/scripts-chirho/word-checks-chirho/`
  - [ ] 7g. Re-sync each changed language (`sync-per-language-chirho.ts LANG --remote
        --skip-source`, ~40-60 min each, upserts only), then update-stats and verify
- [ ] 8. Downstream of 7: PDFs (R2) and SWORD modules built from gapped data get rebuilt (the
      Swahili PDF and module date from 2026-02-04, before the 2026-02-06 Swahili import)
- [ ] 9. Records: this tasklist, progress log, skills, memory; commits (no push without L.J.)
- [ ] 10. Found on the way (L.J. to decide): the landing cards say "448,269 verses" and the reader
      index shows "words" above the Bible's total, because `language_stats_chirho` (meta D1)
      stores phrase counts and no script writes it (`update-stats-chirho.ts` writes an unbound DB);
      `d1-migration-chirho/` (the production publish scripts) has never been committed; GitHub's
      translations repo lacks b9d9a64 and 7781e42; two stray Cyrillic glosses (tel 1 Chr 19:19 w3,
      tur Joel 2:17 w9)

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
