# Swahili Translation: 2 Kings (ch. 8-25) + 1 Chronicles (ch. 1-7)

> For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16

## Overview

This document outlines the Swahili (swa) translation effort for two books of the Hebrew Bible:
- **2 Kings**: Chapters 8-25 (18 chapters, ~12,403 words)
- **1 Chronicles**: Chapters 1-7 (7 chapters, ~11,000 words)
- **Total**: ~23,403 words

## Books to Translate

| Book | Chapters | Coverage | Words | Language |
|------|----------|----------|-------|----------|
| 2 Kings | 8–25 | 18/25 chapters | ~12,403 | Swahili (swa) |
| 1 Chronicles | 1–7 | 7/29 chapters | ~11,000 | Swahili (swa) |
| **TOTAL** | — | — | **~23,403** | **Swahili (swa)** |

## Translation Tools

### Tool Files

The translation infrastructure consists of three Bun scripts:

#### 1. `generate-2ki-1ch-swa-glosses-chirho.ts`

Comprehensive Hebrew-to-Swahili glossary mapping with 293 entries covering:

- **Verbs** (~60 entries): היה, אמר, הלך, בוא, עשה, לקח, נתן, שלח, שמע, נכה, מות, ישׁב, שׁוב
- **Nouns** (~15 entries): מלך, בית, עם, ארץ, איש, אלהים, יהוה, בן, בת
- **Adjectives** (~8 entries): טוב, רע, גָּדוֹל
- **Numbers** (~10 entries): 1–10
- **Prepositions & Particles** (~20 entries): וְ, בְּ, לְ, מִ, אֶל, שֶׁ
- **Miscellaneous** (~162 entries): Connecting words, abstract nouns, common phrases

**Run:**
```bash
bun run generate-2ki-1ch-swa-glosses-chirho
```

#### 2. `translate-2ki-1ch-swa-chirho.ts`

Token-efficient translation script that:
1. Parses Hebrew word lists
2. Maps to Swahili glosses using the comprehensive glossary
3. Handles fallback transliteration for unmapped words
4. Prepares data for MCP tool expansion

**Run:**
```bash
bun run translate-2ki-1ch-swa-chirho
```

#### 3. `translate-2ki-1ch-swa-final-chirho.ts`

Comprehensive translation plan document showing:
- Books and scope
- Glossary statistics
- Translation categories and approach
- Workflow steps
- Example translations
- Swahili conventions

**Run:**
```bash
bun run translate-2ki-1ch-swa-final-chirho
```

This provides a detailed view of the entire translation project.

## Translation Workflow

### Step 1: Retrieve Word Lists

Using MCP tools via `get_words_for_translation_chirho`:

```bash
# For 2 Kings
MCP Tool: get_words_for_translation_chirho(book_chirho: "2Ki")
Returns: ~12,403 word entries with IDs and Hebrew text

# For 1 Chronicles
MCP Tool: get_words_for_translation_chirho(book_chirho: "1Ch")
Returns: ~11,000 word entries with IDs and Hebrew text
```

### Step 2: Map to Swahili Glosses

Each word ID is mapped to a Swahili gloss:
- **Glossary lookup**: Direct match in the 293-entry glossary
- **Fallback**: Transliteration with diacritics removed, lowercased

Example:
```json
{
  "1200100101": "na–apigania",      // וַיִּפְשַׁע
  "1200100102": "Moabu",            // מוֹאָב
  "1200100103": "kwa–Israeli",      // בְּיִשְׂרָאֵל
  "1200100104": "baada–ya",         // אַחֲרֵי
  "1200100105": "kifo",             // מוֹת
  "1200100106": "Ahaabu"            // אַחְאָב
}
```

### Step 3: Expand Glosses with MCP Tool

Using `expand_glosses_chirho` MCP tool:

```bash
MCP Tool: expand_glosses_chirho(
  language_code_chirho: "swa",
  book_name_chirho: "2ki",
  glosses_chirho: { word_id: "swahili_gloss", ... }
)
```

**Output:**
- SQL INSERT statements for the Gloss table
- Files generated at: `translations-chirho/2ki-swa-chirho/`
- File name: `glosses-insert-chirho.sql`

### Step 4: Repeat for 1 Chronicles

```bash
MCP Tool: expand_glosses_chirho(
  language_code_chirho: "swa",
  book_name_chirho: "1ch",
  glosses_chirho: { word_id: "swahili_gloss", ... }
)
```

### Step 5: Import to Database

```bash
# Import 2 Kings Swahili translations
psql -U postgres < translations-chirho/2ki-swa-chirho/glosses-insert-chirho.sql

# Import 1 Chronicles Swahili translations
psql -U postgres < translations-chirho/1ch-swa-chirho/glosses-insert-chirho.sql

# Or combine into single import
cat translations-chirho/*/glosses-insert-chirho.sql | \
  psql -U postgres
```

## Swahili Translation Conventions

### 1. Particles with N-Dash Hyphenation

Particles and connecting words are hyphenated with n-dash (–):

| Hebrew | Swahili | Example |
|--------|---------|---------|
| וְ / וַ | na– | na–akasema (and he said) |
| בְּ | kwa– | kwa–Israeli (to Israel) |
| לְ | kwa– | kwa–mfalme (to the king) |
| מִ | kutoka– | kutoka–mfalme (from the king) |
| לְ (infinitive) | ku– | kusema (to say) |

### 2. Divine Names

Preserved in transliterated form maintaining biblical significance:

| Hebrew | Swahili | Meaning |
|--------|---------|---------|
| יְהוָה (YHWH) | YAHWE | God (covenant name) |
| אֱלֹהִים | Mungu | God (generic) |
| אֲדֹנָי | Bwana | Lord |
| אֵל | Mungu | God |

### 3. Proper Names

Transliterated to Swahili phonology:

| Hebrew | Swahili | Example |
|--------|---------|---------|
| Moab (מוֹאָב) | Moabu | Nation |
| Israel (יִשְׂרָאֵל) | Israeli | Nation |
| Judah (יְהוּדָה) | Yuda | Kingdom |
| Ephraim (אֶפְרָיִם) | Efraimu | Tribe |
| Egypt (מִצְרַיִם) | Misri | Country |

### 4. Verb Forms

Infinitive prefix (ku-) used for clarity:

| Hebrew Root | Swahili Infinitive | Past Form |
|-------------|-------------------|-----------|
| אמר (say) | kusema | akasema |
| הלך (go) | kwenda | akaenda |
| בוא (come) | kuja | akaja |
| עשה (do/make) | kufanya | akafanya |
| לקח (take) | kuchukua | akachukua |
| נתן (give) | kuapa | akapa |

### 5. Object Marker

Optional in Swahili narrative style (different from English):

```
Hebrew: את + object
Swahili: (obj) marker or implicit from context

Example:
"He took the book" = "Akachukua (obj) kitabu"
Simplified: "Akachukua kitabu"
```

## Glossary Categories

### Verbs (60+ entries)

Core biblical verbs with multiple diacritical variants:

```
היה   → ilikuwa, itakuwa (be)
אמר   → akasema, kusema (say)
הלך   → akaenda, kwenda (go)
בוא   → akaja, kuja (come)
עשה   → akafanya, kufanya (do/make)
לקח   → akachukua, kuchukua (take)
נתן   → akapa, kuapa (give)
שׁלח  → akatuma, kutuma (send)
שׁמע  → akasikia, kusikia (hear)
נכה   → akapiga, kupiga (strike)
מות   → akafa, kufa (die)
ישׁב  → akakaa, kukaa (sit/dwell)
שׁוב  → akarudi, kurudi (return)
```

### Nouns (15+ entries)

Key biblical nouns:

```
מלך    → mfalme (king)
בית   → nyumba (house)
עם    → watu (people)
ארץ   → nchi (land)
איש   → mtu (man)
אלהים → Mungu (God)
יהוה  → YAHWE (God's name)
בן    → mwana (son)
בת    → binti (daughter)
יום   → siku (day)
לילה  → usiku (night)
```

### Adjectives (8+ entries)

Descriptive words:

```
טוב    → njema (good)
רע     → mbaya (evil)
גדול   → mkubwa (great)
קטן    → ndogo (small)
```

### Numbers (10 entries)

Cardinal numbers 1-10:

```
אחד    → mmoja (one)
שנים   → wawili (two)
שלוש   → watatu (three)
ארבע   → wanne (four)
חמש   → watano (five)
שש    → sita (six)
שבעה  → saba (seven)
שמונה  → nane (eight)
תשעה  → tisa (nine)
עשרה  → kumi (ten)
```

## Example Translations

### 2 Kings 8:1

**Hebrew:**
> וַיִּפְשַׁע מוֹאָב בְּיִשְׂרָאֵל אַחֲרֵי מוֹת אַחְאָב׃

**Swahili (word-by-word):**
> na–apigania Moabu kwa–Israeli baada–ya–kifo–cha–Ahaabu

**English (reference):**
> "And Moab rebelled against Israel after the death of Ahab."

### 1 Chronicles 1:1

**Hebrew:**
> אָדָם שֵׁת אֱנוֹשׁ׃

**Swahili (word-by-word):**
> Adamu Seti Enoshi

**English (reference):**
> "Adam, Seth, Enosh..."

### 1 Chronicles 1:4

**Hebrew:**
> נוֹחַ בְּנֵי־נוֹחַ שׁם חָם וְיָפֶת׃

**Swahili (word-by-word):**
> Nuahu wana–wa–Nuahu Shemu Hamu na–Yafeti

**English (reference):**
> "Noah, the sons of Noah: Shem, Ham, and Japheth."

## Implementation Status

### Completed

- ✅ Created `generate-2ki-1ch-swa-glosses-chirho.ts` with 293 glossary entries
- ✅ Created `translate-2ki-1ch-swa-chirho.ts` for word list parsing
- ✅ Created `translate-2ki-1ch-swa-final-chirho.ts` showing translation plan
- ✅ Added npm scripts to `package.json`
- ✅ Documented Swahili conventions and examples

### Ready for Execution

1. Run MCP tool `expand_glosses_chirho` for 2 Kings
2. Run MCP tool `expand_glosses_chirho` for 1 Chronicles
3. Import generated SQL files to database
4. Verify translations in UI

## Database Schema

Translations are stored in the `Gloss` table:

```sql
INSERT INTO gloss_chirho (
  word_id_chirho,
  language_code_chirho,
  gloss_chirho,
  created_at_chirho,
  updated_at_chirho
) VALUES
  ('1200100101', 'swa', 'na–apigania', NOW(), NOW()),
  ('1200100102', 'swa', 'Moabu', NOW(), NOW()),
  -- ... ~23,403 rows
;
```

## Future Work

1. **Verification**: Native Swahili speakers should review translations
2. **Lemma consistency**: Ensure same root words have consistent translations
3. **Additional books**: Extend to remaining OT books as needed
4. **Interlinear PDF**: Generate PDF with Swahili interlinear format
5. **SWORD module**: Create LJMTIntSwaChirho SWORD module for Swahili

## Files Created

```
tools-chirho/
├── generate-2ki-1ch-swa-glosses-chirho.ts      # 293-entry glossary
├── translate-2ki-1ch-swa-chirho.ts             # Word list parser
├── translate-2ki-1ch-swa-final-chirho.ts       # Translation plan
└── [Generated SQL at runtime]

translations-chirho/
├── 2ki-swa-chirho/
│   └── glosses-insert-chirho.sql              # ~12,403 inserts
└── 1ch-swa-chirho/
    └── glosses-insert-chirho.sql              # ~11,000 inserts
```

## Running the Translation

```bash
# View translation plan
bun run translate-2ki-1ch-swa-final-chirho

# View glossary
bun run generate-2ki-1ch-swa-glosses-chirho

# Use MCP tools to expand and generate SQL
# (See Step 3-5 in Workflow section above)
```

## References

- **AGENTS.md**: Project standards and naming conventions
- **Tools**: All tools follow Chirho naming conventions (`-chirho` suffix)
- **Languages**: ISO 639-3 code `swa` for Swahili
- **Books**: Standard abbreviations from BibleGateway (2Ki, 1Ch)

---

**Status**: Ready for MCP tool execution
**Created**: 2026-02-03
**Modified**: 2026-02-03
