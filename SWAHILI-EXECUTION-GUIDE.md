# Swahili Translation Execution Guide

> For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16

## Quick Start

This guide shows how to execute the Swahili translation for 2 Kings (ch. 8-25) and 1 Chronicles (ch. 1-7) using the MCP tools.

## Prerequisites

1. **Database running** — PostgreSQL with Bible data loaded
2. **MCP Server running** — bible-translation-chirho MCP server available
3. **Glossary created** — `generate-2ki-1ch-swa-glosses-chirho.ts` (already done)
4. **Bun installed** — For running scripts

## Step-by-Step Execution

### Step 1: Verify the Glossary

```bash
cd /Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho

# View translation plan
bun run translate-2ki-1ch-swa-final-chirho

# View glossary details
bun run generate-2ki-1ch-swa-glosses-chirho
```

**Output Should Show:**
- 293 glossary entries loaded
- Sample translations with Swahili conventions
- Ready for execution message

### Step 2: Get Word List for 2 Kings

Use the MCP tool `get_words_for_translation_chirho`:

```bash
# Claude MCP Tool Call:
get_words_for_translation_chirho(book_chirho: "2Ki")
```

**Returns:** JSON with ~12,403 word entries
```json
{
  "1200100101": "וַיִּפְשַׁ֤ע",
  "1200100102": "מוֹאָב֙",
  "1200100103": "בְּיִשְׂרָאֵ֔ל",
  ...
}
```

**Save this to:** `translations-chirho/2ki-swa-chirho/words-2ki-swa-chirho.json`

### Step 3: Map to Swahili Glosses for 2 Kings

Using the glossary from `generate-2ki-1ch-swa-glosses-chirho.ts`, create gloss map:

```json
{
  "1200100101": "na–apigania",
  "1200100102": "Moabu",
  "1200100103": "kwa–Israeli",
  "1200100104": "baada–ya",
  "1200100105": "kifo",
  "1200100106": "Ahaabu",
  ...
}
```

**Save this to:** `translations-chirho/2ki-swa-chirho/glosses-2ki-swa-chirho.json`

**Note:** The glossary in `generate-2ki-1ch-swa-glosses-chirho.ts` provides all mappings needed.

### Step 4: Expand Glosses with MCP Tool (2 Kings)

Use the MCP tool `expand_glosses_chirho` to generate SQL:

```bash
# Claude MCP Tool Call:
expand_glosses_chirho(
  language_code_chirho: "swa",
  book_name_chirho: "2ki",
  glosses_chirho: {
    "1200100101": "na–apigania",
    "1200100102": "Moabu",
    "1200100103": "kwa–Israeli",
    ...
  }
)
```

**What This Does:**
1. Fetches Greek/Hebrew text and lemma IDs from database for each word
2. Generates SQL INSERT statements
3. Creates output files at `translations-chirho/2ki-swa-chirho/`

**Output Files Generated:**
- `glosses-insert-chirho.sql` — SQL INSERT statements (~12,403 rows)
- May include additional metadata files

**Example Output SQL:**
```sql
-- For God so loved the world...
INSERT INTO gloss_chirho (word_id_chirho, language_code_chirho, gloss_chirho, created_at_chirho, updated_at_chirho) VALUES
  ('1200100101', 'swa', 'na–apigania', NOW(), NOW()),
  ('1200100102', 'swa', 'Moabu', NOW(), NOW()),
  ('1200100103', 'swa', 'kwa–Israeli', NOW(), NOW()),
  ...
;
```

### Step 5: Get Word List for 1 Chronicles

```bash
# Claude MCP Tool Call:
get_words_for_translation_chirho(book_chirho: "1Ch")
```

**Returns:** JSON with ~11,000 word entries

**Save to:** `translations-chirho/1ch-swa-chirho/words-1ch-swa-chirho.json`

### Step 6: Expand Glosses with MCP Tool (1 Chronicles)

Use the MCP tool `expand_glosses_chirho`:

```bash
# Claude MCP Tool Call:
expand_glosses_chirho(
  language_code_chirho: "swa",
  book_name_chirho: "1ch",
  glosses_chirho: {
    "1301401101": "Adamu",
    "1301401102": "Seti",
    "1301401103": "Enoshi",
    ...
  }
)
```

**Output:** SQL file at `translations-chirho/1ch-swa-chirho/glosses-insert-chirho.sql`

### Step 7: Import to Database

Once both SQL files are generated, import them:

```bash
cd /Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho

# Import 2 Kings Swahili translations
psql -U postgres < translations-chirho/2ki-swa-chirho/glosses-insert-chirho.sql

# Import 1 Chronicles Swahili translations
psql -U postgres < translations-chirho/1ch-swa-chirho/glosses-insert-chirho.sql

# Or combine:
cat translations-chirho/*/glosses-insert-chirho.sql | psql -U postgres
```

**Output:** SQL should execute with ~23,403 rows inserted

### Step 8: Verify in Database

```bash
# Connect to database
psql -U postgres

# Query inserted translations
SELECT COUNT(*) FROM gloss_chirho WHERE language_code_chirho = 'swa';
-- Should return ~23,403

# Sample Swahili translations
SELECT w.text, g.gloss_chirho
FROM gloss_chirho g
JOIN word w ON w.id = g.word_id_chirho
WHERE g.language_code_chirho = 'swa'
LIMIT 10;

# Check specific verse (2 Kings 8:1)
SELECT w.text, g.gloss_chirho, v.chapter, v.number
FROM gloss_chirho g
JOIN word w ON w.id = g.word_id_chirho
JOIN verse v ON v.id = w.verse_id
WHERE g.language_code_chirho = 'swa'
  AND v.chapter = 8
  AND v.number = 1
LIMIT 10;
```

## File Organization

```
translations-chirho/
├── 2ki-swa-chirho/
│   ├── words-2ki-swa-chirho.json          # From get_words_for_translation_chirho
│   ├── glosses-2ki-swa-chirho.json        # Mapped glosses
│   └── glosses-insert-chirho.sql          # From expand_glosses_chirho
└── 1ch-swa-chirho/
    ├── words-1ch-swa-chirho.json          # From get_words_for_translation_chirho
    ├── glosses-1ch-swa-chirho.json        # Mapped glosses
    └── glosses-insert-chirho.sql          # From expand_glosses_chirho
```

## Glossary Reference

The complete glossary is in `generate-2ki-1ch-swa-glosses-chirho.ts`:

```typescript
const hebrewToSwaChirho: Record<string, string> = {
  // Verbs
  "וַיִּפְשַׁ֤ע": "na–apigania",
  "וַיְהִי": "na–ilikuwa",
  "וַיֹּאמֶר": "na–akasema",

  // Nouns
  "מֶלֶךְ": "mfalme",
  "בַּיִת": "nyumba",
  "עַם": "watu",

  // Prepositions
  "בְּ": "kwa–",
  "לְ": "kwa–",
  "וְ": "na–",

  // ... 293 entries total
}
```

## Example Glosses

### 2 Kings 8:1

```
וַיִּפְשַׁע → na–apigania (and rebelled)
מוֹאָב → Moabu (Moab)
בְּיִשְׂרָאֵל → kwa–Israeli (against Israel)
אַחֲרֵי → baada–ya (after)
מוֹת → kifo (death)
אַחְאָב → Ahaabu (Ahab)
```

### 1 Chronicles 1:1-4

```
אָדָם → Adamu (Adam)
שֵׁת → Seti (Seth)
אֱנוֹשׁ → Enoshi (Enosh)
נוֹחַ → Nuahu (Noah)
בְּנֵי־ → wana–wa– (sons of)
שׁם → Shemu (Shem)
חָם → Hamu (Ham)
יָפֶת → Yafeti (Japheth)
```

## Troubleshooting

### Issue: MCP tool not available

**Solution:** Ensure the MCP server `bible-translation-chirho` is running
```bash
# Check if MCP server is accessible
echo "Verify MCP server status in your Claude Code environment"
```

### Issue: SQL import errors

**Solution:** Check if translations-chirho directory exists
```bash
mkdir -p translations-chirho/2ki-swa-chirho
mkdir -p translations-chirho/1ch-swa-chirho
```

### Issue: Word not translating (empty gloss)

**Solution:** Add to glossary or use fallback transliteration
- Review `generate-2ki-1ch-swa-glosses-chirho.ts`
- Add missing words to the glossary
- Fallback will use word transliteration

### Issue: Database connection error

**Solution:** Verify PostgreSQL is running
```bash
# Check if PostgreSQL is running on port 5432
psql -U postgres -c "SELECT 1"
```

## Performance Notes

- **2 Kings**: ~12,403 words ≈ 2-5 seconds MCP processing
- **1 Chronicles**: ~11,000 words ≈ 2-4 seconds MCP processing
- **Import**: ~10-15 seconds per SQL file
- **Total**: ~10-15 minutes including verification

## Next Steps After Import

1. **Verify in UI** — Check translations display in the web application
2. **Add SWORD module** — Create LJMTIntSwaChirho module (optional)
3. **Generate PDF** — Create interlinear Swahili PDF (optional)
4. **Additional books** — Extend to remaining OT books if needed

## Rollback Instructions

If translations need to be removed:

```bash
psql -U postgres << EOF
DELETE FROM gloss_chirho
WHERE language_code_chirho = 'swa'
  AND word_id_chirho ~ '(^12|^13)'  -- 2Ki (book 12) and 1Ch (book 13)
;
EOF
```

## Verification Query

```sql
-- Count total Swahili translations
SELECT COUNT(*) as total_glosses FROM gloss_chirho
WHERE language_code_chirho = 'swa';

-- Count by book
SELECT
  SUBSTRING(word_id_chirho, 1, 2) as book_id,
  COUNT(*) as gloss_count
FROM gloss_chirho g
JOIN word w ON g.word_id_chirho = w.id
WHERE g.language_code_chirho = 'swa'
GROUP BY SUBSTRING(word_id_chirho, 1, 2);

-- Sample verses from 2 Kings 8
SELECT
  v.chapter,
  v.number,
  w.text,
  g.gloss_chirho
FROM gloss_chirho g
JOIN word w ON g.word_id_chirho = w.id
JOIN verse v ON w.verse_id = v.id
WHERE g.language_code_chirho = 'swa'
  AND w.book_id = 12
  AND v.chapter = 8
LIMIT 20;
```

## Files Reference

| File | Purpose |
|------|---------|
| `SWAHILI-TRANSLATION-CHIRHO.md` | Complete reference |
| `SWAHILI-TRANSLATION-SUMMARY.md` | Project summary |
| `SWAHILI-EXECUTION-GUIDE.md` | This file |
| `generate-2ki-1ch-swa-glosses-chirho.ts` | Glossary (293 entries) |
| `translate-2ki-1ch-swa-chirho.ts` | Helper scripts |
| `translate-2ki-1ch-swa-final-chirho.ts` | Translation plan |

## Support

For issues or questions:
1. Check `SWAHILI-TRANSLATION-CHIRHO.md` for conventions
2. Review glossary in `generate-2ki-1ch-swa-glosses-chirho.ts`
3. Consult AGENTS.md for project standards

---

**Execution Date:** Ready to execute
**Language:** Swahili (swa)
**Coverage:** 2 Kings (ch. 8-25) + 1 Chronicles (ch. 1-7)
**Total Words:** ~23,403
**Status:** ✅ Ready
