# Swahili Translation Quality Assurance Checklist

**Language**: Swahili (swa) - Kiswahili sanifu
**Translation Type**: Literal word-for-word glosses (reader's Bible)
**Source Model**: Claude Opus 4.5 AI-generated (opus-4.5-chirho & haiku-4.5-20251001)
**Date**: 2026-02-03

---

## 📋 Pre-Import Verification

### File Structure Checks
- [ ] All 59 book directories exist in `/translations-chirho/`
- [ ] Each book has `all-verses-chirho.sql` (combined file)
- [ ] Individual verse files follow pattern: `c{chapter}-v{verse}-chirho.sql`
- [ ] No corrupted or empty SQL files
  ```bash
  find translations-chirho/*-swa-chirho -name "*-chirho.sql" -size 0
  ```

### SQL Syntax Validation
- [ ] Test one file from each book for SQL errors
  ```bash
  docker exec sveltekit2-platform-chirho-db-chirho-1 psql -U postgres \
    < translations-chirho/matthew-swa-chirho/c001-v001-chirho.sql
  ```
- [ ] All files have proper headers and COMMIT statements
- [ ] Language code is consistently 'swa' across all files

### Content Verification
- [ ] Sample verses have actual Swahili words (not just transliterations)
- [ ] Divine names appear correct (Yahwe, Bwana, Mungu)
- [ ] Particles use n-dashes (–) not regular hyphens (-)
- [ ] Source attribution present in comments

---

## 🔍 Post-Import Testing

### Database Connectivity
```bash
# Connect to database
docker exec -it sveltekit2-platform-chirho-db-chirho-1 psql -U postgres

# Verify Swahili language exists
SELECT * FROM language WHERE code = 'swa';

# Count total Swahili glosses
SELECT COUNT(*) FROM gloss
WHERE phrase_id IN (
  SELECT id FROM phrase WHERE language_id = (SELECT id FROM language WHERE code = 'swa')
);
```

### Sample Verse Checks

**Matthew 1:1** (Genesis of Jesus)
```sql
SELECT w.display, pw.word_id, g.gloss
FROM phrase p
JOIN phrase_word pw ON p.id = pw.phrase_id
JOIN word w ON pw.word_id = w.id
JOIN gloss g ON p.id = g.phrase_id
WHERE p.language_id = (SELECT id FROM language WHERE code = 'swa')
  AND w.verse_id IN (SELECT id FROM verse WHERE book_id = 40 AND chapter = 1 AND number = 1)
ORDER BY pw.id;
```

Expected first words: Kitabu, cha–uzazi, wa–Iēsoûs, Christós, mwana, wa–Daudí, mwana, wa–Abraám

**John 3:16** (Greatest verse)
```sql
SELECT w.display, g.gloss
FROM phrase p
JOIN phrase_word pw ON p.id = pw.phrase_id
JOIN word w ON pw.word_id = w.id
JOIN gloss g ON p.id = g.phrase_id
WHERE p.language_id = (SELECT id FROM language WHERE code = 'swa')
  AND w.verse_id IN (SELECT id FROM verse WHERE book_id = 43 AND chapter = 3 AND number = 16)
ORDER BY pw.id;
```

**Psalm 23** (Lord is my shepherd)
```sql
SELECT COUNT(*) as verse_count FROM verse WHERE book_id = 19 AND chapter = 23;
SELECT COUNT(*) as swahili_glosses FROM gloss
WHERE phrase_id IN (
  SELECT p.id FROM phrase p
  JOIN phrase_word pw ON p.id = pw.phrase_id
  JOIN word w ON pw.word_id = w.id
  WHERE p.language_id = (SELECT id FROM language WHERE code = 'swa')
    AND w.verse_id IN (SELECT id FROM verse WHERE book_id = 19 AND chapter = 23)
);
```

---

## ✅ Quality Checks by Section

### Divine Names Consistency

**Test YHWH rendering:**
```sql
-- Should find consistent translations for YHWH (lemma H3068)
SELECT DISTINCT g.gloss, COUNT(*)
FROM gloss g
JOIN phrase p ON g.phrase_id = p.id
WHERE p.language_id = (SELECT id FROM language WHERE code = 'swa')
GROUP BY g.gloss
HAVING g.gloss LIKE '%Yahwe%' OR g.gloss LIKE '%Bwana%';
```

**Expected variants**: Yahwe, Bwana (both acceptable per standards)

**Test Elohim/God:**
```sql
-- Check Greek lemma G2316 (Theos)
SELECT DISTINCT g.gloss FROM gloss g
WHERE g.phrase_id IN (
  SELECT p.id FROM phrase p
  JOIN phrase_word pw ON p.id = pw.phrase_id
  JOIN word w ON pw.word_id = w.id
  WHERE p.language_id = (SELECT id FROM language WHERE code = 'swa')
    AND w.lemma_id = 'G2316'
);
```

**Expected**: Primarily "Mungu" (God)

### Noun Class Agreement

**Test Bantu prefixes for accuracy:**
```bash
# Count words starting with Bantu class prefixes
grep -r "wa–" translations-chirho/*-swa-chirho/*.sql | wc -l  # People class (1/2)
grep -r "mi–\|m–" translations-chirho/*-swa-chirho/*.sql | wc -l  # Plant class (3/4)
grep -r "ki–\|vi–" translations-chirho/*-swa-chirho/*.sql | wc -l  # Thing class (7/8)
grep -r "u–" translations-chirho/*-swa-chirho/*.sql | wc -l  # Long/thin class (11)
```

### Consistency Checks

**Find lemmas with multiple translations:**
```sql
SELECT w.lemma_id, COUNT(DISTINCT g.gloss) as variant_count,
       STRING_AGG(DISTINCT g.gloss, ', ') as variants
FROM word w
JOIN phrase_word pw ON w.id = pw.word_id
JOIN phrase p ON pw.phrase_id = p.id
JOIN gloss g ON p.id = g.phrase_id
WHERE p.language_id = (SELECT id FROM language WHERE code = 'swa')
GROUP BY w.lemma_id
HAVING COUNT(DISTINCT g.gloss) > 3
ORDER BY variant_count DESC
LIMIT 20;
```

**Action**: Check these high-variance lemmas - they may indicate inconsistency

---

## 🧪 UI Testing

### Setup
```bash
cd sveltekit2-platform-chirho
docker compose up -d
npm run dev  # or bun run dev
```

### Test Routes

**1. Translation Interface**
- Navigate to: `http://localhost:5173/translate-chirho/swa/matthew-1:1`
- Expected: Display Swahili glosses word-by-word
- Verify: Each Greek word shows its Swahili translation

**2. Multiple Verses**
- Try: `http://localhost:5173/translate-chirho/swa/john-3:16`
- Check: All 33 Greek words have glosses
- Verify: Glosses are readable Swahili (not just Greek transliterations)

**3. Search Functionality**
- Search for: "Yesu" (Jesus)
- Search for: "Bwana" (Lord)
- Search for: "upendo" (love)
- Verify: Results return correct passages

**4. Navigation**
- Navigate between chapters
- Switch languages (if others are approved)
- Check pagination works correctly

---

## 👤 Translator Review Guidelines

### For Professional Reviewer

1. **Read entire verse in context**
   - Check if translation makes linguistic sense
   - Verify Swahili sentence structure (SVO word order)
   - Confirm particles are hyphenated correctly

2. **Check Bantu grammar**
   - Verify noun class prefixes match nouns
   - Ensure all modifiers agree with noun class
   - Confirm verb subject/object markers are correct

3. **Validate key theological terms**
   - Heart (moyo) - check consistency across Psalms, Jeremiah
   - Love (upendo) - verify in 1 John, Romans
   - Faith (imani) - check Hebrews, Galatians
   - Grace (neema) - check Ephesians, Romans

4. **Cultural appropriateness**
   - Some terms may need cultural adaptation
   - Check if transliteration of names is acceptable
   - Verify metaphors translate well (e.g., "shepherd" → "mchungaji")

5. **Mark as APPROVED**
   ```sql
   UPDATE gloss SET state = 'APPROVED'
   WHERE phrase_id IN (
     SELECT id FROM phrase WHERE language_id = (SELECT id FROM language WHERE code = 'swa')
   )
   AND reviewed_by_id = {translator_user_id};
   ```

---

## 📊 Statistical Validation

### Expected Totals
```sql
-- Total verses with Swahili glosses
SELECT COUNT(DISTINCT w.verse_id) FROM word w
JOIN phrase_word pw ON w.id = pw.word_id
JOIN phrase p ON pw.phrase_id = p.id
WHERE p.language_id = (SELECT id FROM language WHERE code = 'swa');

-- Should be: ~29,000+

-- Total glosses (words)
SELECT COUNT(*) FROM gloss
WHERE phrase_id IN (SELECT id FROM phrase WHERE language_id = (SELECT id FROM language WHERE code = 'swa'));

-- Should be: ~120,000-150,000 (4-5 words per verse on average)

-- Coverage by book
SELECT b.name, COUNT(DISTINCT w.verse_id) as covered_verses,
       b.verse_count,
       ROUND(100.0 * COUNT(DISTINCT w.verse_id) / b.verse_count, 1) as percent_complete
FROM word w
JOIN phrase_word pw ON w.id = pw.word_id
JOIN phrase p ON pw.phrase_id = p.id
JOIN verse v ON w.verse_id = v.id
JOIN book b ON v.book_id = b.id
WHERE p.language_id = (SELECT id FROM language WHERE code = 'swa')
GROUP BY b.id, b.name, b.verse_count
ORDER BY b.id;
```

---

## 🐛 Troubleshooting

### Issue: SQL Import Fails
```bash
# Check error message
docker exec sveltekit2-platform-chirho-db-chirho-1 psql -U postgres \
  < translations-chirho/matthew-swa-chirho/c001-v001-chirho.sql

# Common issue: Language 'swa' doesn't exist
INSERT INTO language (name, code) VALUES ('Swahili', 'swa')
ON CONFLICT (code) DO NOTHING;
```

### Issue: No Glosses Showing in UI
```bash
# Verify glosses exist in database
SELECT COUNT(*) FROM gloss WHERE state IN ('APPROVED', 'UNAPPROVED');

# Check language filter
SELECT * FROM language WHERE code = 'swa';

# Test query from phrase table
SELECT * FROM phrase WHERE language_id = (SELECT id FROM language WHERE code = 'swa') LIMIT 5;
```

### Issue: Broken Particle Hyphenation
```bash
# Check for n-dashes (correct) vs regular hyphens (incorrect)
grep -r " – " translations-chirho/*-swa-chirho/*.sql | wc -l  # Should be high
grep -r " - " translations-chirho/*-swa-chirho/*.sql | wc -l  # Should be 0
```

---

## 📝 Sign-Off Template

When QA is complete, update this document:

```
## Final QA Sign-Off

- **QA Reviewer**: [Name]
- **Date Completed**: [Date]
- **Total Verses Verified**: [Number]
- **Books Spot-Checked**: [List]
- **Issues Found**: [Number]
- **Status**: ✅ APPROVED for production use

### Notes:
[Any additional notes about quality, recommendations, known issues]
```

---

## 🔗 Related Documentation

- **SWAHILI-TRANSLATION-COMPLETION.md** - Full project completion report
- **AGENTS.md** - Project architecture and naming conventions
- **translate-swa-chirho/SKILL.md** - Translation standards and lemma decisions
- **Database schema** - `/spec-chirho/database-architecture-chirho.md`

---

> "For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life." — John 3:16
