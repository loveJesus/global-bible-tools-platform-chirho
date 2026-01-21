# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Immediate Action Items

**Based on:** Unified Vision PRD
**Date:** January 2026

---

## What We Proved in 24 Hours

| Accomplishment | Traditional Estimate | Actual Time |
|----------------|---------------------|-------------|
| Next.js → SvelteKit 2 migration | 5 months | 24 hours |
| Hindi Bible translation (32,904 glosses) | 6+ months | 8 hours |
| Romanized → Devanagari conversion | 2 weeks | 2 hours |
| 139MB interlinear PDF generation | 1 week | 30 minutes |
| i18n for 14 UI languages | 2 weeks | 3 hours |
| Production deployment | 1 week | 1 hour |

**Total traditional estimate: ~7 months**
**Actual time: ~24 hours**
**Acceleration factor: ~200x**

---

## This Week's Priorities

### 1. Complete Next Priority Language Translations

**Candidates (by speaker population):**

| Language | Speakers | Script | Status |
|----------|----------|--------|--------|
| Bengali | 300M | Bengali | Not started |
| Arabic | 400M | Arabic | Not started |
| Swahili | 100M | Latin | Not started |
| Urdu | 230M | Arabic | Not started |
| Indonesian | 200M | Latin | Not started |

**Recommended:** Bengali or Arabic (largest unreached populations)

**Process:**
1. Use `get_words_for_translation_chirho` to get source text
2. Generate glosses with appropriate script support
3. Use `expand_glosses_chirho` to generate SQL files
4. Run SQL on production database
5. Generate interlinear PDF
6. Deploy to production

### 2. Script Support Expansion

Current `transliterateChirho` supports:
- ✅ Devanagari (Hindi)
- ⏳ Arabic script (needs implementation)
- ⏳ Bengali script (needs implementation)
- ✅ Latin (Swahili, Indonesian - no conversion needed)

**Arabic Script Map Template:**
```typescript
const arabicConsonantMapChirho: [string, string][] = [
  ['th', 'ث'], ['kh', 'خ'], ['dh', 'ذ'], ['sh', 'ش'], ['gh', 'غ'],
  ['b', 'ب'], ['t', 'ت'], ['j', 'ج'], ['ḥ', 'ح'], ['d', 'د'],
  ['r', 'ر'], ['z', 'ز'], ['s', 'س'], ['ṣ', 'ص'], ['ḍ', 'ض'],
  ['ṭ', 'ط'], ['ẓ', 'ظ'], ['ʿ', 'ع'], ['f', 'ف'], ['q', 'ق'],
  ['k', 'ك'], ['l', 'ل'], ['m', 'م'], ['n', 'ن'], ['h', 'ه'],
  ['w', 'و'], ['y', 'ي'], ['ʾ', 'ء'],
];
```

### 3. Bible.systems D1 Setup

**Immediate Tasks:**
1. Create D1 database: `bible-data-chirho`
2. Set up initial schema (books, verses, words)
3. Import source text data
4. Create basic API endpoints
5. Test MCP tool integration

**Commands:**
```bash
cd ~/dev-aleluya/personal-aleluya/bible.systems-chirho
bunx wrangler d1 create bible-data-chirho
bunx wrangler d1 execute bible-data-chirho --local --file=migrations/001-init-chirho.sql
```

### 4. Free Hebrew Integration Points

**Immediate Opportunities:**
1. Link CI lessons to specific biblical passages
2. Use translation glosses for vocabulary lists
3. Generate flashcards from lemma data
4. Create "learn while you read" mode in Global Bible Tools

**API Needed:**
```typescript
// GET /api-chirho/vocabulary-chirho/:passage
{
  lemmasChirho: [
    {
      idChirho: "H3068",
      hebrewChirho: "יְהוָה",
      transliterationChirho: "YHWH",
      meaningChirho: "the LORD",
      frequencyChirho: 6828,
      familiarityChirho: 0.85 // user-specific
    }
  ],
  lessonLinkChirho: "/learn-chirho/hebrew/lesson-12"
}
```

---

## Technical Debt to Address

### High Priority
- [ ] Chirho suffix audit on all SvelteKit files (flagged by stop hook)
- [ ] Add TypeScript strict mode
- [ ] Implement proper error boundaries
- [ ] Add loading states for async operations

### Medium Priority
- [ ] Optimize PDF generation (currently 139MB for Hindi)
- [ ] Add caching layer for translation API
- [ ] Implement batch gloss submission
- [ ] Add progress indicators for long operations

### Low Priority
- [ ] Dark mode improvements
- [ ] Mobile navigation refinements
- [ ] Keyboard shortcuts for translation UI
- [ ] Offline support via service worker

---

## Infrastructure Decisions Needed

### Question 1: Single Platform or Federated?

**Option A: Single Unified Platform**
- One codebase, one deployment
- Simpler to maintain
- Potential scaling challenges

**Option B: Federated Services**
- bible.systems = data API (Cloudflare Edge)
- global-tools.bible.systems = translation app (Hetzner VPS)
- freehebrew.online = learning app (separate)
- Shared auth via OAuth

**Recommendation:** Option B with shared authentication and data layer

### Question 2: Database Strategy

**Current:**
- Global Bible Tools: PostgreSQL on Hetzner
- bible.systems: D1 on Cloudflare (planned)

**Options:**
1. Keep separate, sync via API
2. Migrate everything to D1
3. Migrate everything to PostgreSQL
4. Hybrid with read replicas

**Recommendation:** Keep PostgreSQL for write-heavy translation work, use D1 for read-heavy public API

### Question 3: AI Provider Strategy

**Current Providers:**
- Translation: Claude Opus 4.5 (via MCP)
- Voice: ElevenLabs (planned)
- Images: Various (see media-chirho MCP)

**Considerations:**
- Cost per operation
- Quality requirements
- Latency constraints
- Offline capabilities

---

## Communication Plan

### For Adrian/Andrew/Beth (Global Bible Tools)
- Share PRD document
- Discuss SvelteKit deployment collaboration
- Propose shared infrastructure where beneficial
- Maintain independent development paths

### For Free Hebrew Team
- Explore content licensing
- Discuss integration opportunities
- Propose vocabulary/progress sharing API
- Consider joint learning features

### For Bible Publishers
- Draft publisher portal proposal
- Identify pilot partners
- Define licensing framework
- Create onboarding documentation

---

## Metrics to Track

### This Week
- [ ] Languages with draft translations
- [ ] PDF downloads from production
- [ ] API response times
- [ ] Error rates

### This Month
- [ ] Active translators
- [ ] Glosses reviewed/approved
- [ ] New language requests
- [ ] Community feedback submissions

### This Quarter
- [ ] Translation completion percentage by language
- [ ] User registration growth
- [ ] Publisher inquiries
- [ ] Integration requests (MCP, API)

---

## Resource Allocation

### AI-Assisted Development (Primary)
- Translation generation
- Code scaffolding
- Documentation
- Testing

### Human Focus (Critical Path)
- Theological review of translations
- Publisher relationship building
- User experience design decisions
- Community management

### Volunteer Opportunities
- Translation review in native languages
- Bug reporting and testing
- Documentation translation
- Social media and outreach

---

## Next 24-Hour Sprint Options

Given our proven 200x acceleration, pick ONE:

### Option A: Bengali Translation
- 300M speakers
- Complex script (Bengali/Bangla)
- Strong Christian community in Bangladesh/West Bengal
- **Deliverable:** Complete NT interlinear in Bengali

### Option B: Arabic Translation
- 400M speakers
- Right-to-left script challenges
- Critical for Middle East/North Africa
- **Deliverable:** Complete NT interlinear in Arabic

### Option C: Bible.systems API Launch
- Foundation for all future integrations
- Enables MCP tools
- Publisher portal prerequisite
- **Deliverable:** Public API with 5 core endpoints

### Option D: Learning Mode Integration
- Connect translations to vocabulary learning
- Implement spaced repetition
- Link to Free Hebrew content
- **Deliverable:** "Learn while you read" feature

---

**Recommendation:** Option A (Bengali) or Option B (Arabic) - maximize immediate Kingdom impact with largest unreached populations.

---

*"Whatever you do, work at it with all your heart, as working for the Lord."* — Colossians 3:23
