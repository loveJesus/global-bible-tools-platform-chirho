# Create Bible Translation

Literal word-for-word "reader's gloss" translation of the Bible.

## Translation Rules

1. Each word → one translation
2. Same lemma → same translation (consistency)
3. Particles hyphenated: "the–heavens", "in–beginning"
4. Names transliterated from Greek with accents: Iēsoûs, Christós, Pétros, Paûlos
5. Word order follows original

## Token-Efficient Workflow (REQUIRED)

**Step 1:** Get source words via MCP tool:
```
get_words_for_translation_chirho(book: "<book>", chapter: <num>)
```

**Step 2:** Output ONLY minimal JSON - word ID → gloss:
```json
{"6500100101":"Ioudas","6500100102":"de–Iēsoû","6500100103":"Christoû"}
```

**Step 3:** Generate SQL via MCP tool:
```
expand_glosses_chirho(
  language_code: "<lang>",
  book_name: "<book>",
  glosses: { ... your translations ... }
)
```

This auto-fetches Greek/lemmas from DB and writes SQL files.

## Other MCP Tools

- `list_books_chirho` - Book list with word counts
- `query_lemma_chirho(lemma_id)` - Lexicon lookup when unsure
- `set_decision_chirho(lemma_id, gloss, notes)` - Record translation decision
- `get_decisions_chirho` - Get all decisions
- `check_consistency_chirho` - Find inconsistencies

## Arguments

$ARGUMENTS

Parse: **language** (spa, fra, deu) and **scope** (Genesis 1, Jude, etc.)

## Database Note

Tables (`verse`, `word`, `phrase`, `gloss`) are upstream - no `_chirho` suffix.

**Prerequisite:** Docker must be running (`cd nextjs-platform-chirho && docker compose up -d`).
MCP tools auto-detect and use docker exec if local PostgreSQL intercepts the port.

## Output Files

Generated to: `translations-chirho/<book>-<lang>-chirho/`
- `v01-chirho.sql`, `v02-chirho.sql`, ... per verse
- `all-verses-chirho.sql` combined
