---
name: publish-language-chirho
description: Complete end-to-end checklist for publishing a finished Bible translation language. Covers SQL import, PDF generation, R2 upload, downloads page, reader page PDF button, SWORD module, sword repo website, and production deploy. Use when a language translation reaches 100% completion.
disable-model-invocation: true
---

# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Publishing a Completed Language Translation

Full end-to-end checklist for going from 100% SQL files → live on production.

## Variables (fill in before starting)

| Variable | Example (Telugu) | Description |
|----------|-----------------|-------------|
| `LANG` | `tel` | 3-letter language code |
| `LANG_NAME` | `Telugu` | English name |
| `LANG_NATIVE` | `తెలుగు` | Native script name |
| `REF_CODE` | `telirv` | Reference version code (from `reference_version_chirho` table), or empty if none |
| `TYPE` | `readers` | `terse` or `readers` |
| `PDF_FILE` | `interlinear-readers-tel-telirv-chirho.pdf` | See naming convention below |
| `MODULE_NAME` | `LJMTIntTelRChirho` | SWORD module name (see naming below) |

## PDF Filename Naming Convention

| Type | Has Reference | Pattern | Example |
|------|--------------|---------|---------|
| Terse | Yes | `interlinear-{lang}-{ref}-chirho.pdf` | `interlinear-spa-rv1909-chirho.pdf` |
| Readers | Yes | `interlinear-readers-{lang}-{ref}-chirho.pdf` | `interlinear-readers-tel-telirv-chirho.pdf` |
| Readers | No | `interlinear-readers-{lang}-chirho.pdf` | `interlinear-readers-tha-chirho.pdf` |

## SWORD Module Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Terse | `LJMTInt{Lang}Chirho` | `LJMTIntSpaChirho` |
| Readers | `LJMTInt{Lang}RChirho` | `LJMTIntTelRChirho` |

Conf file: `ljmtint{lang}rchirho.conf` (all lowercase)

## Check Reference Version in DB

```bash
docker exec sveltekit2-platform-chirho-db-chirho-1 psql -U postgres -t -c \
  "SELECT id_chirho, code_chirho, name_chirho FROM reference_version_chirho WHERE language_code_chirho = 'LANG';"
```

---

## Step 1: Import SQL to Local DB

```bash
BASE="translations-chirho/readers-chirho/LANG-chirho"  # or terse-chirho/

# Import all books (run from project root)
for book_dir in $(ls -d "$BASE"/*/ | sort); do
    book=$(basename "$book_dir")
    echo "Importing $book..."
    cat "$book_dir/all-verses-chirho.sql" | \
        docker exec -i sveltekit2-platform-chirho-db-chirho-1 psql -U postgres -q
done
echo "Done importing LANG"
```

Verify the import:
```bash
docker exec sveltekit2-platform-chirho-db-chirho-1 psql -U postgres -t -c "
SELECT COUNT(*) as phrase_count
FROM phrase p JOIN language l ON l.id = p.language_id
WHERE l.code = 'LANG' AND p.deleted_at IS NULL
  AND p.translation_type_chirho IS NOT DISTINCT FROM 'readers';"
```
Expected: ~446,000 phrases for readers (one per word).

---

## Step 2: Generate PDF

**CRITICAL: Must run from `sveltekit2-platform-chirho/` directory.**

First verify the language font is a real TTF (not an HTML page):
```bash
file static/fonts-chirho/NotoSans{Script}-Regular.ttf
# Must say "TrueType Font data" — if it says "HTML document text", download it fresh
```

```bash
cd sveltekit2-platform-chirho

# With reference version (most common):
bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts \
    LANG \
    static/bibles-chirho/interlinear-readers-LANG-REFCODE-chirho.pdf \
    REFCODE \
    --type readers

# Without reference version:
bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts \
    LANG \
    static/bibles-chirho/interlinear-readers-LANG-chirho.pdf \
    --type readers
```

After generation:
- Open PDF to verify it renders correctly (first and last page)
- Note file size: `ls -lh static/bibles-chirho/PDF_FILE`
- Expected: 130–175 MB depending on script

---

## Step 3: Upload to R2

```bash
cd sveltekit2-platform-chirho
source ../.env

AWS_ACCESS_KEY_ID="$LOVEJESUS_R2_KEY_CHIRHO" \
AWS_SECRET_ACCESS_KEY="$LOVEJESUS_R2_SECRET_CHIRHO" \
aws s3 cp static/bibles-chirho/PDF_FILE \
    s3://global-bible-tools-media-chirho/bibles-chirho/PDF_FILE \
    --endpoint-url="$LOVEJESUS_R2_ENDPOINT_CHIRHO" \
    --content-type "application/pdf" \
    --no-verify-ssl \
    --cli-read-timeout 600
```

Verify accessible:
```bash
curl -I https://media-global-tools.bible.systems/bibles-chirho/PDF_FILE
# Must return HTTP 200
```

---

## Step 4: Add to PDF Registry

File: `sveltekit2-platform-chirho/src/lib/server/interlinear-pdfs-chirho.ts`

Add to `INTERLINEAR_PDFS_CHIRHO` object (before closing `}`):

```typescript
tel: [
    {
        codeChirho: 'telirv-readers',
        nameChirho: 'Telugu IRV (2019)',
        hasPdfChirho: true,
        pdfPathChirho: `${R2_BASE_CHIRHO}/interlinear-readers-tel-telirv-chirho.pdf`,
        badgeChirho: 'Readers Edition'
    }
],
```

This drives the **Download PDF** button on the reader page (`/read-chirho/tel`).

---

## Step 5: Add to Downloads Page

File: `sveltekit2-platform-chirho/src/routes/downloads-chirho/+page.svelte`

Add to `downloadsChirho` array (before closing `]`):

```typescript
{
    nameChirho: 'Telugu Interlinear Bible (Natural Reading)',
    descriptionChirho: 'Hebrew & Greek text with Telugu natural-reading translation and Telugu IRV (2019) reference text (తెలుగు అంతర్రేఖ బైబిల్)',
    pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-tel-telirv-chirho.pdf',
    sizeChirho: '??? MB',    // Fill in actual size after Step 2
    versesChirho: '31,102',
    badgeChirho: 'Readers Edition'
},
```

Include native-script name of the Bible in description (like Japanese `日本語逐語対照聖書`).

---

## Step 6: Generate SWORD Module

**Required step** — SWORD modules allow installation in Xiphos, BibleTime, AndBible, etc.

First, add the language to `tools-chirho/generate-sword-module-chirho.ts` `LANGUAGE_NAMES_CHIRHO` map if not already there:
```typescript
tel: { nameChirho: "Telugu", nativeNameChirho: "తెలుగు" },
```

Then generate:
```bash
cd /path/to/platform-chirho
# Uses the local DB (must be imported in Step 1)
bun run tools-chirho/generate-sword-module-chirho.ts tel readers
```

This generates a SWORD module zip in `sword-modules-chirho/` (auto-named).

---

## Step 7: Add to SWORD Repository

The SWORD repo lives at `sword-repo-chirho/` and publishes to `https://sword-modules-chirho.bible.systems`.

### 7a. Copy module zip
```bash
cp sword-modules-chirho/LJMTIntTelRChirho.zip sword-repo-chirho/raw/
```

### 7b. Create conf file
`sword-repo-chirho/mods.d/ljmtinttelrchirho.conf`:
```ini
[LJMTIntTelRChirho]
DataPath=./modules/texts/ztext/LJMTIntTelRChirho/
ModDrv=zText
SourceType=OSIS
Encoding=UTF-8
CompressType=ZIP
BlockType=BOOK
Versification=KJV

# Module Information
Description=Love Jesus Machine Translation Interlinear - Telugu (Readers)
About=Word-by-word interlinear Bible translation from Greek/Hebrew.\par\par\
Includes Strong's numbers, morphology codes, and Telugu glosses for each word.\par\par\
Generated by Love Jesus (https://sword-modules-chirho.bible.systems)\par\
66 books, 31102 verses translated.\par\par\
Creative Commons Attribution 4.0 International License

# Language
Lang=tel
LangSortOrder=tel

# Version and Updates
Version=1.0
SwordVersionDate=YYYY-MM-DD
MinimumVersion=1.7.0

# Features
Feature=StrongsNumbers
GlobalOptionFilter=OSISStrongs
GlobalOptionFilter=OSISMorph
GlobalOptionFilter=OSISLemma
GlobalOptionFilter=OSISGlosses

# Distribution
DistributionLicense=Creative Commons: by 4.0
DistributionSource=https://sword-modules-chirho.bible.systems
TextSource=Love Jesus Project

Category=Biblical Texts
```

### 7c. Regenerate mods.d.tar.gz
```bash
cd sword-repo-chirho
tar czf mods.d.tar.gz mods.d/
```

### 7d. Add to sword-repo-chirho/index.html

Find the table of languages in `index.html` and add a row following the existing pattern. Each row has: Language name, native name, module name, download link, and description.

### 7e. Commit and push
```bash
cd sword-repo-chirho
git add raw/LJMTIntTelRChirho.zip mods.d/ljmtinttelrchirho.conf mods.d.tar.gz index.html
git commit -m "Add Telugu readers interlinear module LJMTIntTelRChirho"
git push origin main
# Auto-deploys via GitHub Pages to https://sword-modules-chirho.bible.systems
```

---

## Step 8: Import SQL to Production DB

```bash
# Option A: Tar + copy + SSH import
tar czf /tmp/LANG-sql-chirho.tar.gz translations-chirho/readers-chirho/LANG-chirho/

scp /tmp/LANG-sql-chirho.tar.gz root@46.224.100.134:/tmp/

ssh root@46.224.100.134 << 'EOF'
cd /tmp && tar xzf LANG-sql-chirho.tar.gz
for d in translations-chirho/readers-chirho/LANG-chirho/*/; do
    cat "$d/all-verses-chirho.sql" | docker exec -i app-chirho-db-chirho-1 psql -U postgres -q
done
echo "Production import done"
EOF
```

Verify on production:
```bash
ssh root@46.224.100.134 "docker exec app-chirho-db-chirho-1 psql -U postgres -t -c \
  \"SELECT COUNT(*) FROM phrase p JOIN language l ON l.id = p.language_id \
    WHERE l.code = 'LANG' AND p.deleted_at IS NULL \
    AND p.translation_type_chirho IS NOT DISTINCT FROM 'readers';\""
```

---

## Step 9: Deploy SvelteKit

```bash
git add sveltekit2-platform-chirho/src/lib/server/interlinear-pdfs-chirho.ts
git add sveltekit2-platform-chirho/src/routes/downloads-chirho/+page.svelte
git add sveltekit2-platform-chirho/static/fonts-chirho/  # if font was fixed
git add tools-chirho/generate-sword-module-chirho.ts
git commit -m "Add Telugu readers interlinear Bible: PDF, SWORD module, downloads page"
git push origin main_chirho

ssh root@46.224.100.134 << 'EOF'
cd /opt/app-chirho
git pull origin main_chirho
docker compose down && docker compose up -d --build
EOF
```

Verify live (after ~60s):
- https://global-tools.bible.systems/downloads-chirho — new entry appears
- https://global-tools.bible.systems/read-chirho/LANG — **Download PDF** button visible
- https://sword-modules-chirho.bible.systems — new module listed

---

## Full Checklist

- [ ] All 31,102 verse SQL files present (verified with file count)
- [ ] `all-verses-chirho.sql` regenerated for all books
- [ ] Language font file verified as real TTF (`file static/fonts-chirho/...`)
- [ ] SQL imported to local DB — verify phrase count ~446k
- [ ] PDF generated and opens correctly
- [ ] PDF size noted (for downloads page)
- [ ] PDF uploaded to R2, HTTP 200 confirmed
- [ ] `interlinear-pdfs-chirho.ts` updated (drives reader page Download button)
- [ ] `downloads-chirho/+page.svelte` updated with correct size
- [ ] Telugu added to `LANGUAGE_NAMES_CHIRHO` in `generate-sword-module-chirho.ts`
- [ ] SWORD module generated
- [ ] Module zip copied to `sword-repo-chirho/raw/`
- [ ] Conf file created in `sword-repo-chirho/mods.d/`
- [ ] `mods.d.tar.gz` regenerated
- [ ] `index.html` updated with new language row
- [ ] sword-repo-chirho committed and pushed
- [ ] SQL imported to production DB — phrase count matches local
- [ ] SvelteKit committed, pushed, and deployed
- [ ] Downloads page live with new entry
- [ ] Reader page shows Download PDF button: `/read-chirho/LANG`
- [ ] SWORD repo lists new module: `https://sword-modules-chirho.bible.systems`
- [ ] MEMORY.md updated (PDF size, completion date)
