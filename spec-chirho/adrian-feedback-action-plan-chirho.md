# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Action Plan: Addressing Adrian's Feedback on SvelteKit Platform

**Date:** 2026-01-24
**Status:** Planning
**Purpose:** Address concerns raised by Adrian to demonstrate quality and enable collaboration

---

## Summary of Adrian's Concerns

| # | Concern | Priority | Estimated Effort |
|---|---------|----------|------------------|
| 1 | No tests | HIGH | 2-3 days |
| 2 | No reusable components | MEDIUM | 1-2 days |
| 3 | Inconsistent code organization | MEDIUM | 1-2 days |
| 4 | Raw SQL instead of Drizzle typed queries | HIGH | 1 day |
| 5 | Incomplete features | LOW | Ongoing |
| 6 | Localization not externalized | LOW | 1 day |

---

## 1. Testing Strategy

**Adrian's concern:** "I don't see any tests... That doesn't give me any confidence that the behavior is the same."

### Action Items

- [ ] Set up Vitest with SvelteKit configuration
- [ ] Create test utilities for database mocking
- [ ] Write tests for critical paths:

#### Unit Tests
```
src/lib/server/__tests__/
├── pdf-generator-chirho.test.ts      # Font selection, PUA filtering, RTL
├── db-queries-chirho.test.ts         # Verse, chapter, book queries
├── auth-chirho.test.ts               # Session management
└── translation-chirho.test.ts        # Gloss CRUD operations
```

#### Integration Tests
```
src/routes/__tests__/
├── read-chirho.test.ts               # Reader page loads correct data
├── translate-chirho.test.ts          # Translation workflow
├── downloads-chirho.test.ts          # PDF generation endpoints
└── api-chirho.test.ts                # API endpoint contracts
```

#### E2E Tests (Playwright)
```
e2e-chirho/
├── reader-flow-chirho.spec.ts        # Navigate books, chapters, verses
├── translation-flow-chirho.spec.ts   # Complete translation workflow
└── pdf-download-chirho.spec.ts       # PDF generation and download
```

### Success Criteria
- 80%+ coverage on server-side code
- All critical user flows covered by E2E tests
- Tests pass in CI before merge

---

## 2. Reusable Components

**Adrian's concern:** "No reusable components - buttons, inputs, navigation..."

### Current State
We have some components in `src/lib/components-chirho/`:
- FeedbackBubbleChirho.svelte
- Some page-specific components

### Action Items

- [ ] Audit existing components
- [ ] Create component library:

```
src/lib/components-chirho/
├── ui-chirho/
│   ├── ButtonChirho.svelte
│   ├── InputChirho.svelte
│   ├── SelectChirho.svelte
│   ├── CardChirho.svelte
│   ├── ModalChirho.svelte
│   └── ToastChirho.svelte
├── layout-chirho/
│   ├── NavChirho.svelte
│   ├── SidebarChirho.svelte
│   ├── PageTitleChirho.svelte
│   ├── BreadcrumbChirho.svelte
│   └── FooterChirho.svelte
└── domain-chirho/
    ├── VerseDisplayChirho.svelte
    ├── WordDetailChirho.svelte
    ├── GlossEditorChirho.svelte
    └── LanguageSelectorChirho.svelte
```

- [ ] Document component props and usage
- [ ] Refactor existing pages to use shared components

---

## 3. Code Organization

**Adrian's concern:** "Some database access are abstracted out of server side rendering and others are not."

### Action Items

- [ ] Audit all `+page.server.ts` files for direct DB queries
- [ ] Create consistent data access layer:

```
src/lib/server/
├── db-chirho.ts                      # Connection only
├── queries-chirho/
│   ├── books-chirho.ts               # Book queries
│   ├── verses-chirho.ts              # Verse/chapter queries
│   ├── translations-chirho.ts        # Gloss/phrase queries
│   ├── users-chirho.ts               # User/auth queries
│   └── languages-chirho.ts           # Language queries
└── services-chirho/
    ├── pdf-service-chirho.ts         # PDF generation
    ├── auth-service-chirho.ts        # Authentication logic
    └── translation-service-chirho.ts # Translation workflow
```

### Pattern to Follow
```typescript
// +page.server.ts should only call service/query functions
import { getChapterWithGlossesChirho } from '$lib/server/queries-chirho/verses-chirho';

export const load = async ({ params }) => {
    return {
        chapter: await getChapterWithGlossesChirho(params.code, params.chapter)
    };
};
```

---

## 4. Migrate Raw SQL to Drizzle

**Adrian's concern:** "Raw sql queries are used in several places rather than a typed query builder."

### Current State
Mixed usage - some Drizzle, some raw SQL via `db.execute(sql\`...\`)`

### Action Items

- [ ] Audit all raw SQL usage
- [ ] Convert to Drizzle query builder:

```typescript
// Before (raw SQL)
const results = await db.execute(sql`
    SELECT * FROM "Verse" WHERE id = ${verseId}
`);

// After (Drizzle)
const results = await db
    .select()
    .from(verseChirho)
    .where(eq(verseChirho.id, verseId));
```

- [ ] Ensure all queries have proper TypeScript types
- [ ] Add query result validation with Zod where appropriate

---

## 5. Incomplete Features

**Adrian's concern:** Navigation hidden on mobile, no dark mode, no server jobs, no logging

### Action Items

#### Mobile Navigation
- [ ] Fix responsive nav (currently hidden on small screens)
- [ ] Add hamburger menu or bottom nav for mobile

#### Dark Mode
- [ ] Add dark mode CSS variables
- [ ] Add theme toggle component
- [ ] Persist preference in localStorage

#### Server Jobs
- [ ] Review existing background jobs implementation
- [ ] Ensure job queue is properly configured
- [ ] Add job monitoring UI (partially exists)

#### Logging/Observability
- [ ] Add structured logging (pino or similar)
- [ ] Add request tracing
- [ ] Add error tracking integration

---

## 6. Localization

**Adrian's concern:** "Not all text is externalized for localization."

### Action Items

- [ ] Audit all hardcoded strings in Svelte files
- [ ] Create i18n structure:

```
src/lib/i18n-chirho/
├── index.ts
├── en-chirho.json
├── es-chirho.json
└── ...
```

- [ ] Replace hardcoded strings with i18n keys
- [ ] Add language switcher for UI (separate from Bible language)

---

## 7. API for External Integration

**Proposed addition:** Create REST API that both platforms could use

### Endpoints
```
/api-chirho/v1-chirho/
├── books-chirho/                     # List books
├── verses-chirho/:id                 # Get verse with glosses
├── chapters-chirho/:book/:chapter    # Get chapter data
├── glosses-chirho/                   # CRUD for glosses
├── languages-chirho/                 # Available languages
└── translations-chirho/              # Translation management
```

### Benefits
- Next.js could consume same API
- Mobile apps could use it
- External tools (MCP server) already partially use this pattern
- Clear contract between frontend and backend

---

## Timeline Proposal

| Week | Focus |
|------|-------|
| 1 | Testing setup + critical path tests |
| 2 | Component library + code organization |
| 3 | Drizzle migration + API layer |
| 4 | Polish: mobile nav, dark mode, i18n |

---

## What Adrian Liked (Keep/Enhance)

- ✅ Keyboard shortcut aids
- ✅ Breadcrumb navigation
- ✅ Downloads page
- ✅ Card navigation
- ✅ Background jobs UI

These could potentially be contributed back to the Next.js version.

---

## Collaboration Options

1. **Parallel Development:** Continue SvelteKit as lab, share learnings
2. **API Bridge:** Create shared API both platforms can use
3. **Feature PRs:** Port specific features (downloads, keyboard shortcuts) to Next.js
4. **Gloss Generation:** Document and share the Claude/MCP translation workflow

---

## Notes

This plan assumes the SvelteKit version remains a "parallel lab" for experimentation while addressing quality concerns. The goal is not to replace the Next.js version but to:

1. Demonstrate that AI-assisted development can produce quality code
2. Learn and share best practices for LLM-guided development
3. Potentially contribute features back to the main project
