---
name: interlinear-pdf-chirho
description: Generate complete interlinear Bible PDFs with Greek/Hebrew text, glosses, and reference translations. Use when creating downloadable Bible study PDFs.
disable-model-invocation: true
---

# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Interlinear Bible PDF Generation

Generate complete interlinear Bible PDFs showing Greek/Hebrew source text with word-by-word glosses for any translated language.

## Tool Location

The generation tool is located at:
```
sveltekit2-platform-chirho/tools-chirho/generate-interlinear-bible-pdf-chirho.ts
```

## Usage

**IMPORTANT**: Run from the `sveltekit2-platform-chirho/` directory (needs fonts and DB connection).

```bash
cd sveltekit2-platform-chirho

# Basic usage - generates interlinear-{lang}-chirho.pdf
bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts <language_code>

# Custom output path
bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts <language_code> <output_path>

# With reference translation
bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts <language_code> <output_path> <reference_version>
```

## Examples

```bash
# Portuguese interlinear (glosses only)
bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts por static/bibles-chirho/interlinear-por-chirho.pdf

# Spanish with RV1909 reference
bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts spa static/bibles-chirho/interlinear-spa-rv1909-chirho.pdf rv1909

# Hindi with KJV reference
bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts hin static/bibles-chirho/interlinear-hin-kjv-chirho.pdf kjv

# Bengali with Bengali2006EB reference
bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts ben static/bibles-chirho/interlinear-ben-ben2006eb-chirho.pdf ben2006eb
```

## Output Location

PDFs should be placed in:
```
sveltekit2-platform-chirho/static/bibles-chirho/
```

## Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Glosses only | `interlinear-{lang}-chirho.pdf` | `interlinear-por-chirho.pdf` |
| With reference | `interlinear-{lang}-{ref}-chirho.pdf` | `interlinear-spa-rv1909-chirho.pdf` |

## PDF Structure

Each PDF contains:
1. **Title page** with language and generation info
2. **Table of contents** with all 66 books
3. **Book chapters** with:
   - Greek/Hebrew source text
   - Strong's numbers (H/G codes)
   - Word-by-word glosses in target language
   - Optional reference translation text

## Required Fonts

The tool requires these fonts in `static/fonts-chirho/`:
- `NotoSans-Regular.ttf` - For Latin script
- `NotoSans-Bold.ttf` - For headings
- `EzraSIL-Regular.ttf` - For Hebrew text

## Database Dependency

The tool reads glosses from PostgreSQL. Ensure:
1. Docker is running (`docker compose up -d`)
2. Translations are imported into the database
3. Language code exists in the `language` table

## File Size

Complete Bible PDFs are approximately 130-145 MB depending on:
- Number of glosses available
- Reference translation inclusion
- Font embedding

## Deployment

After generating:
1. Verify PDF opens correctly
2. Check file size is reasonable (~130 MB)
3. Commit to Git
4. Deploy to production (auto-syncs static files)

## Available Reference Versions

| Code | Version | Language |
|------|---------|----------|
| `kjv` | King James Version | English |
| `web` | World English Bible | English |
| `rv1909` | Reina-Valera 1909 | Spanish |
| `hinerv` | Hindi Easy-to-Read | Hindi |
| `ben2006eb` | Bengali Common Language | Bengali |
