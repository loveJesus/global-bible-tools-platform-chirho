<!-- For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16 -->

# Production gloss gaps: D1 vs sources (step 6, read-only diagnosis)

Companion to `26-10-27_07-20-tasklist-bible_systems_https_svelte_sword_and_gloss_gaps-chirho.md`. The scratchpad
paths below were session-local working data and may no longer exist.

2026-10-27. Scope: all 29 production languages, 66 books, both translation types. Nothing was written to D1,
local Postgres, git, R2, the progress DB, the tasklist or memory. Working data:
`/private/tmp/claude-501/-Users-hallelujah-dev-chirho-friends-chirho-andrewbeth-chirho-platform-chirho/af3ffb65-c731-432b-981b-1c145ede4085/scratchpad/gloss-gaps-chirho/`

## Could not check: local Postgres

Docker Desktop 4.61.0 would not start from this session. The backend crashed 3 times, including once launched outside the sandbox, with
`backend crashed ... opening tray: starting electron: sending file descriptors: broken pipe`
(`~/Library/Containers/com.docker.docker/Data/log/host/com.docker.backend.log`). The VM disk
(`Docker.raw`, 13 GB used) is present, so the database is probably intact but unreadable until Docker runs (likely
needs L.J. to open Docker Desktop at the console). What stands in for it:

- **D1 = local Postgres as of the 2026-03-09/10 sync.** Every language's phrase count in
  `d1-migration-chirho/sync-all-log-chirho.txt` equals what D1 holds now (meta `language_stats_chirho`,
  `last_sync` 2026-03-09). Whether local Postgres changed after 10 March is unknown.
- **The VPS prod dump** (`vps-retirement-backup-chirho/26-10-26-chirho/prod-postgres-chirho.dump`, untrusted: the
  attacker had superuser) streamed into a scratch DuckDB (`vps-chirho.duckdb`, 245 MB; row counts identical to the
  backup README: 45 languages, 13,922,612 phrases, 13,806,275 non-empty glosses).
- **The translation SQL in git.** `translations-chirho` is a dangling symlink (see "Data durability"), but its git
  dir `.git/modules/translations-chirho` holds commit b9d9a64 (2026-02-21), read with `git cat-file` and a scratch
  work tree.

## Bottom line

1. **Six languages open on an empty view.** The reader (`read-chirho/[code_chirho]/[chapter_id_chirho]/+page.server.ts`
   ~L102) picks `terse` whenever ANY terse phrase exists, and the language page links chapters with no `?type=`.
   hin, ben, guj, jpn, tel and tha have only terse *samples* in D1 (guj/tel: Obadiah + Jude; jpn/tha: + Genesis;
   hin: 145 words of Hosea + 880 of Matthew; ben: 404 scattered words), so nearly every chapter shows no glosses by
   default. Verified live: hin Exodus 1 shows 978 Devanagari characters (page chrome) by default vs 3,750 with
   `?type=readers`; ben 962 vs 4,412. Two of these (hin, ben) are homepage cards. This is probably the most visible
   "missing glosses" problem.
2. **Real gaps: 35,396 words with no phrase at all** in their language's main type, across 26 languages (deu, ita,
   vie have none). Largest: swa 13,666 · hin 5,541 · ukr 3,208 · amh 2,748 · tel 2,201 · heb 1,690 · rus 1,646 ·
   tur 1,108 · nep 728 · jav 643 · urd 507 · ben 404 · eng 339 · kor 332 · fra 160 · arb 116 · mya 104 · ind 103.
3. **Empty glosses are mostly by design**, not gaps: the object marker H0853, the article G3588 (readers style folds
   it into the noun), H0413, H5921a, H6240 (compound numbers) and the 3,159 paragraph markers פ/ס. A remainder on
   other lemmas deserves a review (column "other lemmas" below; e.g. vie leaves H3068 "LORD" empty 161 times and
   H3091 "Joshua" 95 times; nep 5,277; srp 2,651; jpn 2,612; guj 2,616).
4. **Classification of the real gaps** (by the evidence above; local Postgres still to confirm):
   - **Recover, then sync, for Swahili: 13,654 of 13,666 words.** The VPS dump has them glossed (terse; phrases created
     2026-01-21: 1,221 and 2026-02-06: 13,095); the committed SQL does not; local Postgres lacked them on 10 March.
     Fix: check local Postgres; if still absent, export these glosses from the VPS dump (review a sample first,
     it is untrusted), write them as per-verse SQL in the usual format, import, sync swa.
   - **Import, then sync, for Russian Matthew 4 (430 words) and 3 Amharic words.** The committed SQL
     (`terse-chirho/rus-chirho/matthew-chirho/c004-v*-chirho.sql`) has non-empty glosses for them; neither D1 nor the
     VPS does.
   - **Translate: everything else, about 21,300 words.** The verse files exist but skip these words, or (for readers
     languages) no SQL was ever committed. Concentrated in chapter tails and runs: ukr Jer 49–52 (2,780 words, 183
     whole verses), hin Matt 27–28 (1,378) and Hos 6–14 (1,220), rus Rom 5–16 (925), hin Acts 1–5 (850),
     nep Ps 79–92 (716), tel 2 Kgs 23–24, Acts 28, Jer 52, 1 Chr 29, hin Mark 1–7 / Neh, urd Luke 5–7; plus
     scattered words in amh/heb, mostly lemma-less tokens (H????). Those tokens are both paragraph markers (leave
     blank: heb 741, amh 962) and real suffixed prepositions such as לָכֶם / בּוֹ / לָהֶם (heb 924, amh 1,096), which
     do need glosses.
   - For **hin** readers, 2,585 of the missing words (Matt 27–28, Hos 6–14) exist in the VPS dump as *terse* glosses
     only; for **ben** readers, all 404 do. Those can guide translation but are not readers glosses.
5. **The VPS dump holds translations D1 lacks entirely:** a complete Hindi *terse* Bible (440,280 glossed words,
   Jan 2026) and Bengali as *terse* (446,639; D1 holds Bengali as readers 438,434). The Hindi terse PDFs on R2
   (`interlinear-hin-hinerv-chirho.pdf` 2026-02-04, `interlinear-hin-hinfbi-chirho.pdf` 2026-02-11) and SWORD
   `ljmtinthinchirho` (2026-01-29) were built from it. In local Postgres it was gone (or re-typed) by 9 March.
   Restoring it would give Hindi a full terse view and fix that language's empty default.
6. **Data durability: the translations working tree is missing.** `platform-chirho/translations-chirho` points to
   `/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho/translations-chirho`,
   which does not exist (that folder holds only `vps-retirement-backup-chirho/`). There is no copy on any mounted
   volume (`find` to depth 7–9), Spotlight finds no verse SQL file anywhere, and no Time Machine destination is
   configured. The submodule index (last touched 2026-04-24) equals commit b9d9a64, so nothing newer was ever staged.
   b9d9a64 is **not on GitHub** (GitHub `loveJesus/bible-translations-chirho` ends at 6e7d7f4, 2026-02-20). Readers
   SQL for ben, guj, hin, jpn, nep, tel, tha, vie and eng-readers was never committed, so their only copies are
   local Postgres (inside Docker's VM disk) and D1.

## Reader default per language (production)

Default = `terse` if any terse phrase exists, else `readers`. The API
`/api-chirho/v1-chirho/glosses-chirho/...` also defaults to terse.

| Default terse, though terse is a sample | Default terse (full) | Default readers (no terse) |
|---|---|---|
| ben (terse 0.09%), guj (0.17%), hin (0.23%), jpn (4.8%), tel (0.17%), tha (4.6%) | amh arb deu eng fra heb ind ita jav kor mya por rus spa swa tam tur urd zho | nep srp ukr vie |

## Per-language coverage (main type = the type with most glosses)

Total words per type: 448,269. "Style blanks" = empty glosses on H0853, G3588, H0413, H5921a, H6240 or H????.
| Lang | Main type | Reader default | Glossed | Empty gloss: style blanks | Empty gloss: other lemmas | No phrase (real gap) | No-phrase words in VPS dump (same type) | …with non-empty gloss in committed SQL |
|---|---|---|---|---|---|---|---|---|
| amh | terse | terse | 445,521 (99.387%) | 0 | 0 | 2,748 | 0 | 3 |
| arb | terse | terse | 447,701 (99.873%) | 345 | 107 | 116 | 0 | 0 |
| ben | readers | **terse** (0.09% glossed) | 438,434 (97.806%) | 7,508 | 1,923 | 404 | 0 | 0 |
| deu | terse | terse | 447,829 (99.902%) | 171 | 269 | 0 | 0 | 0 |
| eng | terse | terse | 447,481 (99.824%) | 418 | 31 | 339 | 0 | 0 |
| fra | terse | terse | 448,077 (99.957%) | 0 | 32 | 160 | 0 | 0 |
| guj | readers | **terse** (0.168% glossed) | 436,430 (97.359%) | 9,214 | 2,616 | 9 | 0 | 0 |
| heb | terse | terse | 446,579 (99.623%) | 0 | 0 | 1,690 | 0 | 0 |
| hin | readers | **terse** (0.229% glossed) | 440,503 (98.268%) | 2,008 | 217 | 5,541 | 0 | 0 |
| ind | terse | terse | 447,670 (99.866%) | 458 | 38 | 103 | 0 | 0 |
| ita | terse | terse | 448,109 (99.964%) | 160 | 0 | 0 | 0 | 0 |
| jav | terse | terse | 446,795 (99.671%) | 694 | 137 | 643 | 0 | 0 |
| jpn | readers | **terse** (4.776% glossed) | 441,924 (98.585%) | 3,728 | 2,612 | 5 | 0 | 0 |
| kor | terse | terse | 446,993 (99.715%) | 876 | 68 | 332 | 0 | 0 |
| mya | terse | terse | 444,933 (99.256%) | 2,885 | 347 | 104 | 0 | 0 |
| nep | readers | readers | 433,049 (96.605%) | 9,215 | 5,277 | 728 | 0 | 0 |
| por | terse | terse | 448,068 (99.955%) | 67 | 119 | 15 | 0 | 0 |
| rus | terse | terse | 445,492 (99.381%) | 992 | 139 | 1,646 | 0 | 430 |
| spa | terse | terse | 448,040 (99.949%) | 204 | 12 | 13 | 0 | 0 |
| srp | readers | readers | 429,473 (95.807%) | 16,104 | 2,651 | 41 | 0 | 0 |
| swa | terse | terse | 433,940 (96.803%) | 522 | 141 | 13,666 | 13,654 | 0 |
| tam | terse | terse | 445,622 (99.41%) | 2,137 | 504 | 6 | 0 | 0 |
| tel | readers | **terse** (0.168% glossed) | 441,296 (98.444%) | 3,922 | 850 | 2,201 | 0 | 0 |
| tha | readers | **terse** (4.605% glossed) | 445,877 (99.466%) | 2,075 | 292 | 25 | 0 | 0 |
| tur | terse | terse | 446,759 (99.663%) | 361 | 41 | 1,108 | 0 | 0 |
| ukr | readers | readers | 425,653 (94.955%) | 17,192 | 2,216 | 3,208 | 0 | 0 |
| urd | terse | terse | 446,638 (99.636%) | 970 | 154 | 507 | 0 | 0 |
| vie | readers | readers | 441,264 (98.437%) | 4,629 | 2,376 | 0 | 0 | 0 |
| zho | terse | terse | 447,509 (99.83%) | 623 | 99 | 38 | 0 | 0 |

D1 vs VPS dump, glossed words: identical for 23 language/type pairs. Differences: swa terse VPS +13,654; hin terse
VPS 440,280 vs D1 1,025; ben terse VPS 446,639 vs D1 404 (and ben readers VPS 0 vs D1 438,434); hin readers D1 +48;
vie readers D1 +1,736; jpn/tha terse D1 has Genesis (+20,656 / +19,891) the VPS lacks. So the VPS copy is older for
some languages and holds data local Postgres later lost for others.

## Per-book real gaps (words with no phrase), 269 rows, largest first

"Whole verses" = verses with no word phrased; "partial" = verses missing some words. Last column: of those words,
how many the VPS dump has glossed in the same type / only in the other type.

| Lang/type | Book | No-phrase words / book words | Whole verses missing | Verses missing some words | Chapters (chapter:words) | In VPS dump (same type / other type only) |
|---|---|---|---|---|---|---|
| swa/terse | 1Sam | 9689 / 13462 (72.0%) | 0 | 782 | 1:275 2:374 3:202 4:273 5:171 6:238 7:217 8:183 9:369 10:306 11:208 12:315 13:250 14:661 15:397 16:263 17:652 18:320 19:312 20:558 21:214 22:313 23:330 24:296 2 … | 9677 / 0 |
| ukr/readers | Jer | 2780 / 22264 (12.5%) | 183 | 0 | 49:596 50:710 51:905 52:569 | 0 / 0 |
| hin/readers | Matt | 1378 / 18528 (7.4%) | 86 | 0 | 27:1042 28:336 | 0 / 1378 |
| swa/terse | Gen | 1305 / 20656 (6.3%) | 0 | 116 | 1:1 10:8 19:50 20:63 21:146 23:111 28:17 33:67 34:67 35:41 36:21 39:169 40:86 42:76 43:135 44:88 45:26 49:89 50:44 | 1305 / 0 |
| swa/terse | Matt | 1221 / 18528 (6.6%) | 0 | 67 | 19:22 20:145 21:318 22:127 23:302 24:307 | 1221 / 0 |
| hin/readers | Hos | 1220 / 2396 (50.9%) | 105 | 0 | 6:19 7:190 8:157 9:206 10:83 11:138 12:145 13:176 14:106 | 0 / 1206 |
| rus/terse | Rom | 925 / 7173 (12.9%) | 0 | 277 | 5:81 6:54 7:79 8:119 9:82 10:61 11:102 12:61 13:55 14:72 15:82 16:77 | 0 / 0 |
| hin/readers | Acts | 850 / 18590 (4.6%) | 0 | 172 | 1:127 2:209 3:142 4:185 5:187 | 0 / 0 |
| swa/terse | 1Kgs | 797 / 13245 (6.0%) | 0 | 284 | 1:84 2:120 3:77 4:59 5:44 6:78 7:134 8:201 | 797 / 0 |
| nep/readers | Ps | 716 / 19655 (3.6%) | 0 | 203 | 79:20 80:2 81:24 82:24 83:45 84:49 85:33 86:68 87:22 88:58 89:185 90:67 91:55 92:63 138:1 | 0 / 0 |
| amh/terse | Jer | 674 / 22264 (3.0%) | 0 | 532 | 1:6 2:15 3:14 4:16 5:14 6:19 7:17 8:11 9:13 10:13 11:14 12:10 13:11 14:16 15:17 16:14 17:14 18:10 19:5 20:12 21:5 22:20 23:16 24:8 25:11 26:6 27:12 28:3 29:19 3 … | 0 / 0 |
| amh/terse | Ezek | 630 / 19045 (3.3%) | 0 | 459 | 1:5 2:8 3:9 4:12 5:18 6:5 7:9 8:2 9:2 10:2 11:17 12:15 13:6 14:23 15:4 16:50 17:12 18:19 19:4 20:37 21:18 22:20 23:30 24:21 25:18 26:8 27:11 28:17 29:26 30:26 3 … | 0 / 0 |
| hin/readers | Mark | 559 / 11451 (4.9%) | 0 | 177 | 1:16 2:45 3:70 4:69 5:86 6:137 7:136 | 0 / 0 |
| heb/terse | Gen | 558 / 20656 (2.7%) | 0 | 447 | 1:13 2:5 3:11 4:7 5:10 6:12 7:2 8:1 9:8 10:4 11:16 12:9 13:5 14:5 15:10 16:9 17:10 18:4 19:9 20:13 21:18 22:9 23:14 24:19 25:12 26:13 27:27 28:15 29:17 30:17 31 … | 0 / 0 |
| tel/readers | 2Kgs | 476 / 12403 (3.8%) | 0 | 58 | 17:1 19:1 23:326 24:148 | 0 / 0 |
| tel/readers | Acts | 448 / 18590 (2.4%) | 0 | 34 | 23:5 24:1 26:1 28:441 | 0 / 0 |
| rus/terse | Matt | 430 / 18528 (2.3%) | 25 | 0 | 4:430 | 0 / 0 |
| hin/readers | Neh | 382 / 5439 (7.0%) | 0 | 41 | 2:31 3:49 4:33 5:33 6:27 7:32 8:23 9:64 10:15 11:11 12:20 13:44 | 0 / 0 |
| tel/readers | Jer | 365 / 22264 (1.6%) | 0 | 36 | 25:1 35:1 52:363 | 0 / 0 |
| heb/terse | 2Chr | 350 / 13497 (2.6%) | 0 | 269 | 1:11 2:14 3:5 4:10 5:4 6:20 7:10 8:7 9:10 10:9 11:10 12:8 13:13 14:8 15:10 16:8 17:11 18:9 19:2 20:14 21:7 22:4 23:5 24:12 25:12 26:8 27:4 28:22 29:12 30:11 31: … | 0 / 0 |
| amh/terse | Isa | 342 / 17186 (2.0%) | 0 | 255 | 36:36 37:33 38:15 39:9 40:21 41:20 42:10 43:17 44:13 45:15 46:5 47:7 48:9 49:15 50:12 51:11 52:7 53:6 54:5 55:4 56:8 57:5 58:2 59:5 60:10 61:6 62:10 63:8 64:4 6 … | 0 / 0 |
| tel/readers | 1Chr | 315 / 10984 (2.9%) | 0 | 31 | 21:1 29:314 | 0 / 0 |
| urd/terse | Luke | 303 / 19631 (1.5%) | 0 | 109 | 5:60 6:131 7:112 | 0 / 0 |
| heb/terse | 1Chr | 299 / 10984 (2.7%) | 0 | 252 | 6:23 7:9 8:5 9:7 10:8 11:35 12:26 13:2 14:6 15:20 16:11 17:17 18:3 19:9 20:4 21:18 22:11 23:11 24:6 25:4 26:7 27:30 28:14 29:13 | 0 / 0 |
| swa/terse | 1Cor | 293 / 6858 (4.3%) | 0 | 23 | 12:293 | 293 / 0 |
| ben/readers | Heb | 283 / 4974 (5.7%) | 0 | 82 | 11:96 12:89 13:98 | 0 / 283 |
| hin/readers | Lev | 278 / 12059 (2.3%) | 0 | 88 | 11:15 12:17 13:120 14:99 15:27 | 0 / 0 |
| ukr/readers | Isa | 256 / 17186 (1.5%) | 22 | 0 | 2:256 | 0 / 0 |
| eng/terse | Isa | 249 / 17186 (1.4%) | 0 | 175 | 1:8 2:7 3:12 24:14 25:8 26:8 27:10 28:13 29:16 30:24 31:7 32:6 33:4 34:4 35:3 36:30 37:27 38:10 39:9 40:14 41:15 | 0 / 249 |
| hin/readers | Ezra | 246 / 3918 (6.3%) | 0 | 29 | 2:10 3:6 4:26 5:36 6:34 7:36 8:44 9:27 10:27 | 0 / 0 |
| kor/terse | Acts | 246 / 18590 (1.3%) | 0 | 66 | 1:35 2:152 3:22 4:15 5:22 | 0 / 0 |
| jav/terse | Ps | 243 / 19655 (1.2%) | 0 | 52 | 47:15 48:26 49:19 51:17 52:24 53:14 54:15 55:17 56:23 57:19 58:13 59:19 60:22 | 0 / 0 |
| hin/readers | Esth | 229 / 3080 (7.4%) | 0 | 20 | 1:8 2:43 3:23 5:7 6:31 8:73 9:44 | 0 / 0 |
| tur/terse | 1Cor | 214 / 6858 (3.1%) | 0 | 127 | 1:52 2:11 3:13 4:13 5:4 6:15 7:9 8:8 9:11 10:18 11:10 12:3 13:5 14:17 15:10 16:15 | 0 / 0 |
| heb/terse | Neh | 212 / 5439 (3.9%) | 0 | 175 | 1:4 2:19 3:34 4:11 5:12 6:10 7:48 8:9 9:31 10:3 11:7 12:6 13:18 | 0 / 0 |
| tel/readers | Eccl | 200 / 3002 (6.7%) | 0 | 22 | 11:95 12:105 | 0 / 0 |
| tur/terse | Judg | 177 / 9940 (1.8%) | 0 | 37 | 6:83 7:16 8:17 9:4 10:11 14:13 19:5 20:28 | 0 / 0 |
| tur/terse | Acts | 174 / 18590 (0.9%) | 0 | 88 | 1:23 2:29 3:15 4:8 6:3 7:9 28:87 | 0 / 0 |
| heb/terse | Ezra | 173 / 3918 (4.4%) | 0 | 151 | 1:7 2:48 3:7 4:17 5:19 6:7 7:9 8:26 9:10 10:23 | 0 / 0 |
| hin/readers | Ezek | 172 / 19045 (0.9%) | 0 | 75 | 15:5 32:22 33:65 34:40 35:8 36:20 37:12 | 0 / 0 |
| swa/terse | Esth | 164 / 3080 (5.3%) | 0 | 83 | 1:16 2:28 3:19 4:19 5:14 6:3 7:8 8:16 9:41 | 164 / 0 |
| amh/terse | 1Sam | 160 / 13462 (1.2%) | 0 | 126 | 16:13 17:36 18:23 19:23 20:38 21:3 22:6 23:9 24:6 25:3 | 0 / 0 |
| fra/terse | 1Sam | 160 / 13462 (1.2%) | 0 | 126 | 16:13 17:36 18:23 19:23 20:38 21:3 22:6 23:9 24:6 25:3 | 0 / 0 |
| ukr/readers | Ezek | 155 / 19045 (0.8%) | 0 | 111 | 9:11 10:7 11:12 12:12 13:13 14:18 15:7 16:49 25:4 26:4 27:1 28:5 29:6 30:6 | 0 / 0 |
| amh/terse | Dan | 146 / 6048 (2.4%) | 0 | 115 | 1:9 2:20 3:14 4:22 5:17 6:12 7:16 8:3 9:10 10:10 11:10 12:3 | 0 / 0 |
| rus/terse | 1Chr | 140 / 10984 (1.3%) | 0 | 75 | 1:66 2:73 4:1 | 0 / 0 |
| rus/terse | Ezek | 131 / 19045 (0.7%) | 0 | 74 | 19:3 20:68 21:35 22:3 23:10 24:8 25:4 | 0 / 0 |
| tur/terse | 2Kgs | 128 / 12403 (1.0%) | 0 | 13 | 2:10 3:2 5:14 6:6 8:12 9:10 10:29 12:5 13:2 15:10 16:18 17:10 | 0 / 0 |
| amh/terse | Lam | 127 / 1653 (7.7%) | 0 | 99 | 1:36 2:28 3:30 4:26 5:7 | 0 / 0 |
| jav/terse | Ezra | 126 / 3918 (3.2%) | 0 | 39 | 3:34 4:44 5:36 6:12 | 0 / 0 |
| amh/terse | Num | 115 / 16543 (0.7%) | 0 | 105 | 3:3 4:7 5:1 6:3 7:17 8:1 9:2 10:5 11:10 14:2 15:2 16:3 17:3 18:2 19:2 20:2 21:2 22:3 25:2 26:4 30:1 31:4 32:11 33:17 34:3 35:3 | 0 / 0 |
| urd/terse | John | 111 / 15727 (0.7%) | 0 | 74 | 4:22 5:35 6:54 | 0 / 0 |
| tur/terse | Ezek | 107 / 19045 (0.6%) | 0 | 88 | 1:8 2:3 3:6 4:5 5:10 6:4 7:2 8:3 9:5 10:1 11:8 12:4 13:4 14:11 15:1 16:14 17:8 18:10 | 0 / 0 |
| jav/terse | Isa | 98 / 17186 (0.6%) | 0 | 53 | 9:2 34:11 35:10 36:30 37:31 38:13 39:1 | 0 / 0 |
| amh/terse | Deut | 96 / 14472 (0.7%) | 0 | 86 | 1:7 2:4 3:5 4:7 5:10 6:3 7:5 8:2 9:6 11:2 12:1 13:2 14:2 15:1 16:3 17:3 18:1 19:1 22:4 23:2 25:1 26:2 27:2 28:7 29:1 30:2 31:8 32:1 34:1 | 0 / 0 |
| arb/terse | Eccl | 87 / 3002 (2.9%) | 0 | 24 | 1:2 2:2 3:2 4:3 5:71 6:2 7:4 8:1 | 0 / 0 |
| hin/readers | Deut | 85 / 14472 (0.6%) | 0 | 42 | 1:2 2:11 3:35 4:37 | 0 / 0 |
| amh/terse | Exod | 83 / 16886 (0.5%) | 0 | 74 | 2:1 3:1 4:1 6:1 7:3 8:1 9:1 10:1 11:3 12:3 13:3 14:7 15:2 16:4 17:3 18:1 19:1 20:5 21:1 22:1 23:2 25:1 26:2 27:3 28:1 29:3 30:3 31:1 32:4 33:2 34:7 35:3 36:1 37 … | 0 / 0 |
| tur/terse | Rev | 83 / 9893 (0.8%) | 0 | 48 | 1:25 2:25 3:14 4:3 5:11 6:2 8:3 | 0 / 0 |
| mya/terse | Ezek | 81 / 19045 (0.4%) | 0 | 74 | 14:10 15:2 16:21 17:5 18:5 19:2 20:4 21:9 22:4 23:8 24:5 25:5 39:1 | 0 / 0 |
| jav/terse | Amos | 79 / 2065 (3.8%) | 0 | 51 | 3:10 4:11 5:22 6:5 7:11 8:9 9:11 | 0 / 0 |
| hin/readers | Rev | 78 / 9893 (0.8%) | 0 | 20 | 22:78 | 0 / 0 |
| tel/readers | 1Sam | 77 / 13462 (0.6%) | 0 | 34 | 9:1 10:1 11:1 12:3 19:1 20:1 26:2 27:4 28:41 29:12 30:8 31:2 | 0 / 0 |
| amh/terse | Zech | 75 / 3168 (2.4%) | 0 | 63 | 5:5 6:6 7:3 8:15 9:8 10:6 11:11 12:11 13:4 14:6 | 0 / 0 |
| heb/terse | Esth | 73 / 3080 (2.4%) | 0 | 61 | 1:4 2:12 3:8 4:8 5:11 6:5 7:5 8:6 9:14 | 0 / 0 |
| swa/terse | 2Sam | 61 / 11240 (0.5%) | 0 | 6 | 13:40 14:21 | 61 / 0 |
| amh/terse | Ezra | 60 / 3918 (1.5%) | 0 | 57 | 6:6 7:5 8:22 9:4 10:23 | 0 / 0 |
| swa/terse | Exod | 60 / 16886 (0.4%) | 0 | 11 | 10:60 | 60 / 0 |
| tur/terse | Heb | 60 / 4974 (1.2%) | 0 | 4 | 2:5 4:22 5:22 7:11 | 0 / 0 |
| ben/readers | Jude | 58 / 462 (12.6%) | 0 | 21 | 1:58 | 0 / 58 |
| hin/readers | 2Chr | 57 / 13497 (0.4%) | 0 | 12 | 12:26 18:17 25:14 | 0 / 0 |
| tel/readers | 2Chr | 56 / 13497 (0.4%) | 0 | 54 | 18:1 23:2 25:5 27:1 28:13 29:8 30:8 31:8 32:4 34:6 | 0 / 0 |
| amh/terse | 1Chr | 55 / 10984 (0.5%) | 0 | 44 | 17:1 26:9 27:36 28:4 29:5 | 0 / 0 |
| ind/terse | 2Chr | 55 / 13497 (0.4%) | 0 | 24 | 11:39 12:16 | 0 / 0 |
| amh/terse | Lev | 54 / 12059 (0.4%) | 0 | 52 | 4:2 5:2 7:4 8:3 10:9 11:7 12:1 13:8 14:3 15:1 16:3 19:1 20:2 21:1 22:1 23:3 25:2 27:1 | 0 / 0 |
| tur/terse | Gen | 47 / 20656 (0.2%) | 0 | 25 | 25:47 | 0 / 0 |
| jav/terse | Hos | 45 / 2396 (1.9%) | 0 | 33 | 5:3 6:4 7:5 8:6 9:11 10:4 11:4 12:3 13:5 | 0 / 0 |
| amh/terse | 2Chr | 44 / 13497 (0.3%) | 0 | 42 | 1:2 2:3 3:5 4:6 5:4 11:3 12:6 13:6 14:5 15:4 | 0 / 0 |
| amh/terse | Mark | 44 / 11451 (0.4%) | 0 | 5 | 16:44 | 0 / 0 |
| eng/terse | Mark | 44 / 11451 (0.4%) | 0 | 5 | 16:44 | 0 / 42 |
| tel/readers | Isa | 44 / 17186 (0.3%) | 0 | 23 | 44:1 48:1 51:1 54:5 55:6 58:7 60:11 62:10 65:1 66:1 | 0 / 0 |
| tur/terse | 2Cor | 43 / 4479 (1.0%) | 0 | 39 | 1:9 2:4 3:5 4:6 5:3 6:7 7:2 8:7 | 0 / 0 |
| tur/terse | Eph | 40 / 2437 (1.6%) | 0 | 22 | 1:1 2:11 3:2 4:6 5:15 6:5 | 0 / 0 |
| ind/terse | Lev | 39 / 12059 (0.3%) | 0 | 32 | 25:9 26:19 27:11 | 0 / 0 |
| eng/terse | Zech | 35 / 3168 (1.1%) | 0 | 28 | 5:2 6:2 7:1 8:6 9:1 10:3 11:6 12:9 13:2 14:3 | 0 / 35 |
| tel/readers | Zech | 34 / 3168 (1.1%) | 0 | 17 | 6:1 7:24 8:9 | 0 / 0 |
| urd/terse | Num | 31 / 16543 (0.2%) | 0 | 31 | 1:31 | 0 / 0 |
| jav/terse | 2Kgs | 30 / 12403 (0.2%) | 0 | 21 | 9:1 20:6 21:23 | 0 / 0 |
| kor/terse | Exod | 29 / 16886 (0.2%) | 0 | 15 | 2:29 | 0 / 0 |
| tel/readers | 2Sam | 29 / 11240 (0.3%) | 0 | 17 | 5:1 6:1 11:10 12:1 13:1 14:1 15:1 18:7 21:1 23:5 | 0 / 0 |
| amh/terse | Mal | 26 / 883 (2.9%) | 0 | 21 | 1:6 2:9 3:8 4:3 | 0 / 0 |
| ben/readers | 3John | 26 / 219 (11.9%) | 0 | 13 | 1:26 | 0 / 26 |
| ben/readers | 2John | 25 / 246 (10.2%) | 0 | 11 | 1:25 | 0 / 25 |
| urd/terse | Zech | 25 / 3168 (0.8%) | 0 | 3 | 4:12 6:1 8:12 | 0 / 0 |
| tel/readers | Judg | 24 / 9940 (0.2%) | 0 | 17 | 8:3 9:9 11:1 13:10 18:1 | 0 / 0 |
| kor/terse | 2Sam | 21 / 11240 (0.2%) | 0 | 20 | 14:11 15:3 16:5 19:2 | 0 / 0 |
| swa/terse | 2Kgs | 21 / 12403 (0.2%) | 0 | 2 | 6:5 7:16 | 21 / 0 |
| tel/readers | Ps | 21 / 19655 (0.1%) | 0 | 11 | 15:1 19:1 22:2 24:1 33:3 34:2 39:7 40:1 110:1 125:1 135:1 | 0 / 0 |
| tur/terse | 1Chr | 21 / 10984 (0.2%) | 0 | 8 | 1:8 6:13 | 0 / 0 |
| heb/terse | Matt | 20 / 18528 (0.1%) | 0 | 10 | 22:20 | 0 / 0 |
| urd/terse | 1Kgs | 20 / 13245 (0.2%) | 0 | 1 | 12:20 | 0 / 0 |
| arb/terse | 1Kgs | 19 / 13245 (0.1%) | 0 | 11 | 10:19 | 0 / 0 |
| kor/terse | Jer | 19 / 22264 (0.1%) | 0 | 19 | 15:3 16:1 17:7 18:5 19:2 20:1 | 0 / 0 |
| mya/terse | Deut | 18 / 14472 (0.1%) | 0 | 18 | 11:4 12:4 13:2 14:8 | 0 / 0 |
| tel/readers | Luke | 18 / 19631 (0.1%) | 0 | 1 | 14:18 | 0 / 0 |
| tel/readers | Eph | 18 / 2437 (0.7%) | 0 | 3 | 1:18 | 0 / 0 |
| swa/terse | Phlm | 17 / 336 (5.1%) | 0 | 1 | 1:17 | 17 / 0 |
| zho/terse | Num | 17 / 16543 (0.1%) | 0 | 2 | 4:1 16:16 | 0 / 0 |
| srp/readers | Job | 16 / 8438 (0.2%) | 0 | 16 | 21:1 22:1 24:1 25:1 26:1 28:3 31:2 32:2 33:1 34:1 35:1 37:1 | 0 / 0 |
| tel/readers | 1Kgs | 15 / 13245 (0.1%) | 0 | 14 | 2:1 3:2 7:6 8:6 | 0 / 0 |
| swa/terse | Eph | 14 / 2437 (0.6%) | 0 | 1 | 4:14 | 14 / 0 |
| zho/terse | Deut | 14 / 14472 (0.1%) | 0 | 5 | 21:10 32:4 | 0 / 0 |
| rus/terse | Ps | 13 / 19655 (0.1%) | 0 | 12 | 63:1 147:4 148:5 149:3 | 0 / 0 |
| tel/readers | Ezek | 13 / 19045 (0.1%) | 0 | 4 | 20:1 23:10 29:1 40:1 | 0 / 0 |
| ukr/readers | Zech | 13 / 3168 (0.4%) | 0 | 10 | 5:4 6:5 7:4 | 0 / 0 |
| srp/readers | 2Chr | 12 / 13497 (0.1%) | 0 | 1 | 28:12 | 0 / 0 |
| urd/terse | Job | 12 / 8438 (0.1%) | 0 | 8 | 30:12 | 0 / 0 |
| swa/terse | Ezra | 11 / 3918 (0.3%) | 0 | 4 | 1:10 10:1 | 11 / 0 |
| tha/readers | Ezra | 10 / 3918 (0.3%) | 0 | 9 | 5:7 7:3 | 0 / 0 |
| tel/readers | Deut | 9 / 14472 (0.1%) | 0 | 9 | 11:1 29:1 30:3 31:4 | 0 / 0 |
| tel/readers | 2Cor | 9 / 4479 (0.2%) | 0 | 5 | 3:1 11:8 | 0 / 0 |
| por/terse | Gen | 8 / 20656 (0.0%) | 0 | 7 | 26:5 41:3 | 0 / 0 |
| swa/terse | Isa | 8 / 17186 (0.0%) | 0 | 2 | 5:1 10:7 | 8 / 0 |
| tel/readers | Josh | 7 / 10055 (0.1%) | 0 | 2 | 8:1 24:6 | 0 / 0 |
| amh/terse | Eph | 6 / 2437 (0.2%) | 0 | 2 | 3:6 | 0 / 0 |
| eng/terse | Eph | 6 / 2437 (0.2%) | 0 | 2 | 3:6 | 0 / 6 |
| jav/terse | Jer | 6 / 22264 (0.0%) | 0 | 6 | 17:2 20:1 23:2 29:1 | 0 / 0 |
| spa/terse | Jer | 6 / 22264 (0.0%) | 0 | 6 | 7:1 38:5 | 0 / 0 |
| tel/readers | Job | 6 / 8438 (0.1%) | 0 | 3 | 12:4 41:1 42:1 | 0 / 0 |
| tha/readers | Isa | 6 / 17186 (0.0%) | 0 | 4 | 5:1 19:1 63:1 65:3 | 0 / 0 |
| tur/terse | Hos | 6 / 2396 (0.3%) | 0 | 6 | 4:2 6:1 7:1 9:1 13:1 | 0 / 0 |
| amh/terse | Mic | 5 / 1411 (0.4%) | 0 | 4 | 3:4 6:1 | 0 / 0 |
| arb/terse | Josh | 5 / 10055 (0.0%) | 0 | 5 | 10:5 | 0 / 0 |
| spa/terse | Neh | 5 / 5439 (0.1%) | 0 | 4 | 11:5 | 0 / 0 |
| jav/terse | Lam | 4 / 1653 (0.2%) | 0 | 4 | 1:1 2:1 3:1 4:1 | 0 / 0 |
| kor/terse | Num | 4 / 16543 (0.0%) | 0 | 1 | 26:4 | 0 / 0 |
| srp/readers | Gen | 4 / 20656 (0.0%) | 0 | 4 | 24:2 25:1 26:1 | 0 / 0 |
| tel/readers | Lev | 4 / 12059 (0.0%) | 0 | 2 | 21:1 26:3 | 0 / 0 |
| amh/terse | Gen | 3 / 20656 (0.0%) | 0 | 3 | 24:3 | 0 / 0 |
| ben/readers | Isa | 3 / 17186 (0.0%) | 0 | 3 | 34:1 38:1 43:1 | 0 / 3 |
| ben/readers | Jer | 3 / 22264 (0.0%) | 0 | 3 | 16:1 23:1 50:1 | 0 / 3 |
| guj/readers | Job | 3 / 8438 (0.0%) | 0 | 3 | 15:1 30:1 32:1 | 0 / 0 |
| heb/terse | Rom | 3 / 7173 (0.0%) | 0 | 2 | 6:2 15:1 | 0 / 0 |
| ind/terse | 1Chr | 3 / 10984 (0.0%) | 0 | 3 | 11:2 27:1 | 0 / 0 |
| jav/terse | Rom | 3 / 7173 (0.0%) | 0 | 1 | 13:3 | 0 / 0 |
| por/terse | 2Chr | 3 / 13497 (0.0%) | 0 | 3 | 17:3 | 0 / 0 |
| rus/terse | Acts | 3 / 18590 (0.0%) | 0 | 1 | 4:3 | 0 / 0 |
| srp/readers | Rom | 3 / 7173 (0.0%) | 0 | 3 | 14:1 16:2 | 0 / 0 |
| swa/terse | Acts | 3 / 18590 (0.0%) | 0 | 3 | 7:3 | 3 / 0 |
| tam/terse | Dan | 3 / 6048 (0.0%) | 0 | 1 | 4:3 | 0 / 0 |
| ukr/readers | Hab | 3 / 681 (0.4%) | 0 | 1 | 1:3 | 0 / 0 |
| zho/terse | Gen | 3 / 20656 (0.0%) | 0 | 3 | 27:1 29:1 43:1 | 0 / 0 |
| ben/readers | Ps | 2 / 19655 (0.0%) | 0 | 2 | 35:1 107:1 | 0 / 2 |
| heb/terse | Phil | 2 / 1639 (0.1%) | 0 | 2 | 3:1 4:1 | 0 / 0 |
| hin/readers | Song | 2 / 1272 (0.2%) | 0 | 2 | 8:2 | 0 / 0 |
| ind/terse | Jer | 2 / 22264 (0.0%) | 0 | 2 | 14:1 16:1 | 0 / 0 |
| ind/terse | 1Pet | 2 / 1696 (0.1%) | 0 | 2 | 1:1 2:1 | 0 / 0 |
| jav/terse | Lev | 2 / 12059 (0.0%) | 0 | 2 | 9:1 11:1 | 0 / 0 |
| jav/terse | 1Sam | 2 / 13462 (0.0%) | 0 | 2 | 15:1 22:1 | 0 / 0 |
| jav/terse | 2Chr | 2 / 13497 (0.0%) | 0 | 2 | 17:1 26:1 | 0 / 0 |
| jpn/readers | Josh | 2 / 10055 (0.0%) | 0 | 2 | 7:1 17:1 | 0 / 0 |
| kor/terse | 2Chr | 2 / 13497 (0.0%) | 0 | 2 | 15:1 30:1 | 0 / 0 |
| kor/terse | Job | 2 / 8438 (0.0%) | 0 | 2 | 27:1 29:1 | 0 / 0 |
| kor/terse | Hos | 2 / 2396 (0.1%) | 0 | 2 | 4:1 11:1 | 0 / 0 |
| mya/terse | Ps | 2 / 19655 (0.0%) | 0 | 2 | 33:1 145:1 | 0 / 0 |
| nep/readers | Gen | 2 / 20656 (0.0%) | 0 | 1 | 21:2 | 0 / 0 |
| nep/readers | Matt | 2 / 18528 (0.0%) | 0 | 2 | 13:1 27:1 | 0 / 0 |
| por/terse | 1Chr | 2 / 10984 (0.0%) | 0 | 2 | 11:1 27:1 | 0 / 0 |
| spa/terse | Josh | 2 / 10055 (0.0%) | 0 | 2 | 24:2 | 0 / 0 |
| srp/readers | Ps | 2 / 19655 (0.0%) | 0 | 2 | 119:1 140:1 | 0 / 0 |
| tel/readers | Gen | 2 / 20656 (0.0%) | 0 | 2 | 37:1 38:1 | 0 / 0 |
| tel/readers | Exod | 2 / 16886 (0.0%) | 0 | 2 | 36:1 38:1 | 0 / 0 |
| tel/readers | Ezra | 2 / 3918 (0.1%) | 0 | 2 | 8:1 9:1 | 0 / 0 |
| tel/readers | Hos | 2 / 2396 (0.1%) | 0 | 2 | 12:2 | 0 / 0 |
| tel/readers | Rom | 2 / 7173 (0.0%) | 0 | 2 | 9:1 11:1 | 0 / 0 |
| tha/readers | Exod | 2 / 16886 (0.0%) | 0 | 2 | 1:1 36:1 | 0 / 0 |
| tha/readers | Job | 2 / 8438 (0.0%) | 0 | 2 | 33:2 | 0 / 0 |
| tha/readers | Ps | 2 / 19655 (0.0%) | 0 | 2 | 119:1 122:1 | 0 / 0 |
| tur/terse | Jer | 2 / 22264 (0.0%) | 0 | 2 | 16:1 20:1 | 0 / 0 |
| tur/terse | Zech | 2 / 3168 (0.1%) | 0 | 2 | 10:2 | 0 / 0 |
| amh/terse | Ps | 1 / 19655 (0.0%) | 0 | 1 | 119:1 | 0 / 0 |
| amh/terse | John | 1 / 15727 (0.0%) | 0 | 1 | 13:1 | 0 / 0 |
| amh/terse | Heb | 1 / 4974 (0.0%) | 0 | 1 | 7:1 | 0 / 0 |
| arb/terse | Gen | 1 / 20656 (0.0%) | 0 | 1 | 30:1 | 0 / 0 |
| arb/terse | 2Chr | 1 / 13497 (0.0%) | 0 | 1 | 24:1 | 0 / 0 |
| arb/terse | Ps | 1 / 19655 (0.0%) | 0 | 1 | 127:1 | 0 / 0 |
| arb/terse | Amos | 1 / 2065 (0.0%) | 0 | 1 | 3:1 | 0 / 0 |
| arb/terse | Mal | 1 / 883 (0.1%) | 0 | 1 | 2:1 | 0 / 0 |
| ben/readers | Lev | 1 / 12059 (0.0%) | 0 | 1 | 21:1 | 0 / 1 |
| ben/readers | 2Kgs | 1 / 12403 (0.0%) | 0 | 1 | 12:1 | 0 / 1 |
| ben/readers | Dan | 1 / 6048 (0.0%) | 0 | 1 | 8:1 | 0 / 1 |
| ben/readers | Mic | 1 / 1411 (0.1%) | 0 | 1 | 1:1 | 0 / 1 |
| eng/terse | 1Chr | 1 / 10984 (0.0%) | 0 | 1 | 17:1 | 0 / 1 |
| eng/terse | Ps | 1 / 19655 (0.0%) | 0 | 1 | 119:1 | 0 / 0 |
| eng/terse | Lam | 1 / 1653 (0.1%) | 0 | 1 | 5:1 | 0 / 1 |
| eng/terse | John | 1 / 15727 (0.0%) | 0 | 1 | 13:1 | 0 / 1 |
| eng/terse | Heb | 1 / 4974 (0.0%) | 0 | 1 | 7:1 | 0 / 1 |
| guj/readers | Gen | 1 / 20656 (0.0%) | 0 | 1 | 31:1 | 0 / 0 |
| guj/readers | 2Sam | 1 / 11240 (0.0%) | 0 | 1 | 15:1 | 0 / 0 |
| guj/readers | Ps | 1 / 19655 (0.0%) | 0 | 1 | 148:1 | 0 / 0 |
| guj/readers | Ezek | 1 / 19045 (0.0%) | 0 | 1 | 24:1 | 0 / 0 |
| guj/readers | Dan | 1 / 6048 (0.0%) | 0 | 1 | 8:1 | 0 / 0 |
| guj/readers | Rev | 1 / 9893 (0.0%) | 0 | 1 | 6:1 | 0 / 0 |
| hin/readers | Gen | 1 / 20656 (0.0%) | 0 | 1 | 27:1 | 0 / 1 |
| hin/readers | Num | 1 / 16543 (0.0%) | 0 | 1 | 13:1 | 0 / 0 |
| hin/readers | 2Kgs | 1 / 12403 (0.0%) | 0 | 1 | 12:1 | 0 / 0 |
| hin/readers | Dan | 1 / 6048 (0.0%) | 0 | 1 | 3:1 | 0 / 0 |
| hin/readers | Luke | 1 / 19631 (0.0%) | 0 | 1 | 14:1 | 0 / 0 |
| ind/terse | Prov | 1 / 7036 (0.0%) | 0 | 1 | 16:1 | 0 / 0 |
| ind/terse | Matt | 1 / 18528 (0.0%) | 0 | 1 | 11:1 | 0 / 0 |
| jav/terse | 2Sam | 1 / 11240 (0.0%) | 0 | 1 | 3:1 | 0 / 0 |
| jav/terse | 1Chr | 1 / 10984 (0.0%) | 0 | 1 | 11:1 | 0 / 0 |
| jav/terse | 1Cor | 1 / 6858 (0.0%) | 0 | 1 | 3:1 | 0 / 0 |
| jpn/readers | 1Chr | 1 / 10984 (0.0%) | 0 | 1 | 1:1 | 0 / 0 |
| jpn/readers | Ezra | 1 / 3918 (0.0%) | 0 | 1 | 10:1 | 0 / 0 |
| jpn/readers | Prov | 1 / 7036 (0.0%) | 0 | 1 | 7:1 | 0 / 0 |
| kor/terse | 1Sam | 1 / 13462 (0.0%) | 0 | 1 | 23:1 | 0 / 0 |
| kor/terse | 2Kgs | 1 / 12403 (0.0%) | 0 | 1 | 9:1 | 0 / 0 |
| kor/terse | 1Chr | 1 / 10984 (0.0%) | 0 | 1 | 11:1 | 0 / 0 |
| kor/terse | Prov | 1 / 7036 (0.0%) | 0 | 1 | 16:1 | 0 / 0 |
| kor/terse | Lam | 1 / 1653 (0.1%) | 0 | 1 | 4:1 | 0 / 0 |
| kor/terse | Mark | 1 / 11451 (0.0%) | 0 | 1 | 9:1 | 0 / 0 |
| kor/terse | 1Tim | 1 / 1598 (0.1%) | 0 | 1 | 6:1 | 0 / 0 |
| mya/terse | Exod | 1 / 16886 (0.0%) | 0 | 1 | 31:1 | 0 / 0 |
| mya/terse | Isa | 1 / 17186 (0.0%) | 0 | 1 | 48:1 | 0 / 0 |
| mya/terse | 1Pet | 1 / 1696 (0.1%) | 0 | 1 | 1:1 | 0 / 0 |
| nep/readers | Lev | 1 / 12059 (0.0%) | 0 | 1 | 26:1 | 0 / 0 |
| nep/readers | Josh | 1 / 10055 (0.0%) | 0 | 1 | 24:1 | 0 / 0 |
| nep/readers | Ruth | 1 / 1300 (0.1%) | 0 | 1 | 2:1 | 0 / 0 |
| nep/readers | Prov | 1 / 7036 (0.0%) | 0 | 1 | 16:1 | 0 / 0 |
| nep/readers | Isa | 1 / 17186 (0.0%) | 0 | 1 | 28:1 | 0 / 0 |
| nep/readers | Amos | 1 / 2065 (0.0%) | 0 | 1 | 5:1 | 0 / 0 |
| nep/readers | Jonah | 1 / 691 (0.1%) | 0 | 1 | 3:1 | 0 / 0 |
| nep/readers | Mic | 1 / 1411 (0.1%) | 0 | 1 | 4:1 | 0 / 0 |
| por/terse | Job | 1 / 8438 (0.0%) | 0 | 1 | 19:1 | 0 / 0 |
| por/terse | Mic | 1 / 1411 (0.1%) | 0 | 1 | 6:1 | 0 / 0 |
| rus/terse | 2Sam | 1 / 11240 (0.0%) | 0 | 1 | 17:1 | 0 / 0 |
| rus/terse | Neh | 1 / 5439 (0.0%) | 0 | 1 | 11:1 | 0 / 0 |
| rus/terse | Eccl | 1 / 3002 (0.0%) | 0 | 1 | 12:1 | 0 / 0 |
| rus/terse | Luke | 1 / 19631 (0.0%) | 0 | 1 | 2:1 | 0 / 0 |
| srp/readers | Lev | 1 / 12059 (0.0%) | 0 | 1 | 18:1 | 0 / 0 |
| srp/readers | 2Sam | 1 / 11240 (0.0%) | 0 | 1 | 7:1 | 0 / 0 |
| srp/readers | Jer | 1 / 22264 (0.0%) | 0 | 1 | 40:1 | 0 / 0 |
| srp/readers | Ezek | 1 / 19045 (0.0%) | 0 | 1 | 23:1 | 0 / 0 |
| swa/terse | Nah | 1 / 565 (0.2%) | 0 | 1 | 1:1 | 1 / 0 |
| swa/terse | Col | 1 / 1587 (0.1%) | 0 | 1 | 1:1 | 1 / 0 |
| tam/terse | Ps | 1 / 19655 (0.0%) | 0 | 1 | 73:1 | 0 / 0 |
| tam/terse | Lam | 1 / 1653 (0.1%) | 0 | 1 | 1:1 | 0 / 0 |
| tam/terse | Rom | 1 / 7173 (0.0%) | 0 | 1 | 4:1 | 0 / 0 |
| tel/readers | Amos | 1 / 2065 (0.0%) | 0 | 1 | 5:1 | 0 / 0 |
| tel/readers | Matt | 1 / 18528 (0.0%) | 0 | 1 | 28:1 | 0 / 0 |
| tel/readers | Phlm | 1 / 336 (0.3%) | 0 | 1 | 1:1 | 0 / 0 |
| tha/readers | Deut | 1 / 14472 (0.0%) | 0 | 1 | 28:1 | 0 / 0 |
| tha/readers | 1Kgs | 1 / 13245 (0.0%) | 0 | 1 | 5:1 | 0 / 0 |
| tha/readers | Lam | 1 / 1653 (0.1%) | 0 | 1 | 2:1 | 0 / 0 |
| tur/terse | Num | 1 / 16543 (0.0%) | 0 | 1 | 35:1 | 0 / 0 |
| tur/terse | Joel | 1 / 964 (0.1%) | 0 | 1 | 2:1 | 0 / 0 |
| tur/terse | Zeph | 1 / 774 (0.1%) | 0 | 1 | 2:1 | 0 / 0 |
| tur/terse | 1Tim | 1 / 1598 (0.1%) | 0 | 1 | 6:1 | 0 / 0 |
| ukr/readers | Job | 1 / 8438 (0.0%) | 0 | 1 | 36:1 | 0 / 0 |
| urd/terse | Josh | 1 / 10055 (0.0%) | 0 | 1 | 10:1 | 0 / 0 |
| urd/terse | Judg | 1 / 9940 (0.0%) | 0 | 1 | 18:1 | 0 / 0 |
| urd/terse | 2Sam | 1 / 11240 (0.0%) | 0 | 1 | 15:1 | 0 / 0 |
| urd/terse | 1Chr | 1 / 10984 (0.0%) | 0 | 1 | 11:1 | 0 / 0 |
| urd/terse | Esth | 1 / 3080 (0.0%) | 0 | 1 | 10:1 | 0 / 0 |
| zho/terse | 2Chr | 1 / 13497 (0.0%) | 0 | 1 | 12:1 | 0 / 0 |
| zho/terse | Ezra | 1 / 3918 (0.0%) | 0 | 1 | 7:1 | 0 / 0 |
| zho/terse | Jer | 1 / 22264 (0.0%) | 0 | 1 | 2:1 | 0 / 0 |
| zho/terse | Lam | 1 / 1653 (0.1%) | 0 | 1 | 3:1 | 0 / 0 |

## How a re-sync works (`d1-migration-chirho/sync-per-language-chirho.ts`)

- Whole language only: `bun run sync-per-language-chirho.ts <lang> --remote [--skip-source]` (or `all`). There is no
  per-book or per-word mode.
- Additive upsert, never deletes: schema `CREATE ... IF NOT EXISTS` (no drops); source tables `INSERT OR IGNORE`
  (skippable with `--skip-source`); that language's `phrase` (only `deleted_at IS NULL`), `phrase_word` and `gloss`
  as `INSERT OR REPLACE` in files of 5,000 rows (200 rows per INSERT), 3 retries, 0.5 s pacing; then all 37
  reference versions (~1.1 M verse rows, `INSERT OR IGNORE`) every run, even with `--skip-source`; then `meta_chirho`.
- **Consequences:** no reader downtime (nothing dropped), but mid-sync a word can briefly have a phrase without its
  gloss. Rows deleted or re-typed in Postgres **stay in D1**: a re-sync will not remove the terse samples behind the
  empty default views. A failed run leaves a partial but harmless upsert (re-run). It reads Postgres through
  `docker exec sveltekit2-platform-chirho-db-chirho-1 psql`, so Docker must be up, and it only copies what local
  Postgres has (for swa that is not enough today).
- **Cost:** on 9–10 March each full language sync took 35–62 min (most 56–62; log). `--skip-source` still sends ~1.35 M
  phrase/phrase_word/gloss rows plus the reference verses, so expect roughly 40–60 min per language. Writes are about
  1.35 M rows per language (paid plan includes 50 M/month). Afterwards run `bun run update-stats-chirho.ts` (meta
  counts) and `bun run verify-d1-data-chirho.ts`.
- A cheaper targeted path would be a small script that upserts only the changed words' phrase/phrase_word/gloss rows
  (thousands of rows instead of ~2.5 M).

## Downstream (PDFs on R2, SWORD modules)

R2 PDFs were uploaded 2026-02-04 … 2026-03-03 and SWORD modules built 2026-01-29 … 2026-03-03, all before the
9 March sync, from local Postgres. So they most likely carry the same no-phrase gaps as D1 (not opened, per
instructions). Specifically, the Swahili PDF (`interlinear-swa-swhulb-chirho.pdf`, 2026-02-04) and SWORD
`ljmtintswachirho` (2026-02-04) predate the VPS's 2026-02-06 Swahili import, so they almost certainly lack 1 Sam,
Gen, Matt and 1 Kgs as D1 does. The Hindi terse PDFs and `ljmtinthinchirho` were built from the full terse. Any gap
fill implies regenerating that language's PDF(s) and SWORD module, then re-uploading.

## SQL used

D1 (one call per language DB, from `workers-platform-chirho/`, `bunx wrangler d1 execute bible-lang-<code>-chirho --remote --json --command ...`):

```sql
-- 1. coverage per chapter and type (~2.6 M rows read, ~2.5 s)
SELECT 'total' AS t, substr(id,1,5) AS c, COUNT(*) AS n FROM word GROUP BY c
UNION ALL
SELECT COALESCE(p.translation_type_chirho,'terse') AS t, substr(pw.word_id,1,5) AS c, COUNT(DISTINCT pw.word_id) AS n
FROM phrase p JOIN gloss g ON g.phrase_id = p.id JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE p.deleted_at IS NULL AND g.gloss IS NOT NULL AND trim(g.gloss) <> ''
GROUP BY 1, 2;

-- 2. unglossed words of the main type per verse (TF = p.translation_type_chirho IS NULL | = 'readers')
SELECT w.verse_id AS v, COUNT(*) AS n, group_concat(substr(w.id,9,2)) AS ws FROM word w
WHERE NOT EXISTS (SELECT 1 FROM phrase_word pw
  JOIN phrase p ON p.id = pw.phrase_id AND p.deleted_at IS NULL AND <TF>
  JOIN gloss g ON g.phrase_id = p.id AND g.gloss IS NOT NULL AND trim(g.gloss) <> ''
  WHERE pw.word_id = w.id)
GROUP BY w.verse_id;

-- 3. same, words with no phrase at all: query 2 without the gloss join.

-- 4. no-phrase vs empty-gloss by lemma
WITH m AS (SELECT w.id, w.form_id,
    EXISTS (SELECT 1 FROM phrase_word pw JOIN phrase p ON p.id = pw.phrase_id AND p.deleted_at IS NULL AND <TF> WHERE pw.word_id = w.id) AS hp
  FROM word w WHERE NOT EXISTS (<query 2's subquery>))
SELECT m.hp, lf.lemma_id AS lemma, COUNT(*) AS n FROM m LEFT JOIN lemma_form lf ON lf.id = m.form_id GROUP BY 1, 2 ORDER BY n DESC;
```

Local Postgres, to run once Docker is up (same definitions; compare with D1 per language/type/book):

```sql
SELECT l.code, COALESCE(p.translation_type_chirho,'terse') AS t, substr(pw.word_id,1,2) AS book,
       COUNT(DISTINCT pw.word_id) AS with_phrase,
       COUNT(DISTINCT pw.word_id) FILTER (WHERE trim(coalesce(g.gloss,'')) <> '') AS glossed
FROM phrase p JOIN language l ON l.id = p.language_id
JOIN phrase_word pw ON pw.phrase_id = p.id LEFT JOIN gloss g ON g.phrase_id = p.id
WHERE p.deleted_at IS NULL GROUP BY 1, 2, 3 ORDER BY 1, 2, 3;
-- and: did hin/ben terse get soft-deleted?  SELECT l.code, p.translation_type_chirho, p.deleted_at IS NOT NULL, count(*)
--      FROM phrase p JOIN language l ON l.id = p.language_id WHERE l.code IN ('hin','ben','swa') GROUP BY 1,2,3;
```

VPS dump: `pg_restore -a -t <table> -f - prod-postgres-chirho.dump` streamed (COPY rows only) into DuckDB tables
`lang`, `phrase (id, language_id, deleted_at, tt)`, `phrase_word`, `gloss (phrase_id, ne)`, then the same
per-language/type/book grouping, and a join of D1's no-phrase word list (`d1-nophrase-words-chirho.tsv`) against it.

## Commands per fix class (none run)

```bash
# Docker first (L.J. at the console): open Docker Desktop; then
cd /Users/hallelujah/dev-chirho/friends-chirho/andrewbeth-chirho/platform-chirho/sveltekit2-platform-chirho && docker compose up -d db-chirho

# (a) re-sync one language after its local data is complete (whole language, ~40-60 min)
cd /Users/hallelujah/dev-chirho/friends-chirho/andrewbeth-chirho/platform-chirho/d1-migration-chirho
eval "$(grep -E '^export CLOUDFLARE_GLOBAL_API_(EMAIL|KEY)_CHIRHO=' ../.env)"
CLOUDFLARE_EMAIL="$CLOUDFLARE_GLOBAL_API_EMAIL_CHIRHO" CLOUDFLARE_API_KEY="$CLOUDFLARE_GLOBAL_API_KEY_CHIRHO" \
  bun run sync-per-language-chirho.ts swa --remote --skip-source
bun run update-stats-chirho.ts && bun run verify-d1-data-chirho.ts

# (b1) import committed SQL that never reached Postgres (rus Matthew 4), straight from git objects
G=/Users/hallelujah/dev-chirho/friends-chirho/andrewbeth-chirho/platform-chirho/.git/modules/translations-chirho
W=$(mktemp -d)   # core.worktree points at the missing folder, so give git an empty one
for f in $(git --git-dir=$G --work-tree=$W ls-tree -r --name-only b9d9a64 terse-chirho/rus-chirho/matthew-chirho/ | grep '/c004-'); do
  git --git-dir=$G --work-tree=$W show "b9d9a64:$f"; done | docker exec -i sveltekit2-platform-chirho-db-chirho-1 psql -U postgres -v ON_ERROR_STOP=1

# (a') Swahili recovery from the VPS dump: in DuckDB select the 13,654 (word_id, gloss) pairs for swa terse
#      (needs gloss text: re-stream `gloss` with column 1 kept), review a sample, write per-verse SQL in the
#      terse format above, import, then (a).

# (b2) translate: MCP bible-translation tools (get_words_for_translation_chirho / expand_glosses_chirho with the
#      language's type), Opus agents, max 3 at a time, ~4 chapters each, exact verse lists from the per-book table.

# Default view: in workers-platform-chirho, choose the default type by coverage (or a per-language default in
#      language_stats_chirho), or remove/complete the terse samples for hin ben guj jpn tel tha.
```
