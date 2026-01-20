spec-chirho/sveltekit-rewrite-plan-chirho.md# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# SvelteKit 2 Rewrite Plan for Global Bible Tools Platform

## Executive Summary

This plan outlines the rewrite of the Global Bible Tools Platform from Next.js 14 to SvelteKit 2 with Drizzle ORM. The key challenges are:

1. **27k lines of TypeScript/TSX** across 9 feature modules
2. **Chirho naming convention** applied to all new identifiers
3. **Drizzle ORM mapping**: Our Chirho-suffixed types must map to existing PostgreSQL columns
4. **Upstream sync mechanism**: The original Next.js repo will continue receiving updates

## Source Codebase Analysis

| Metric | Count |
|--------|-------|
| Total Lines | 27,169 |
| TypeScript/TSX Files | 380 |
| Feature Modules | 9 |
| Page Routes | 23 |
| API Routes | 9 |
| React Components | 27 |
| SQL Migrations | 21 (41k lines) |

### Feature Modules
1. `access` - Authorization, policies, claims
2. `bible-core` - Book, Verse, Word, Lemma queries
3. `dashboard` - User dashboard
4. `languages` - Language CRUD, settings
5. `reporting` - Analytics, statistics
6. `snapshots` - Language backup/restore
7. `study` - Reader view, audio sync
8. `translation` - Core translation workflow (most complex)
9. `users` - Auth, invites, profiles

---

## Target Directory Structure

```
sveltekit2-platform-chirho/
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── db-chirho.ts                      # Drizzle connection
│   │   │   ├── schema-chirho/                    # Drizzle schema definitions
│   │   │   │   ├── bible-chirho.ts               # Book, Verse, Word, Lemma
│   │   │   │   ├── translation-chirho.ts         # Phrase, Gloss, MachineGloss
│   │   │   │   ├── users-chirho.ts               # User, Session
│   │   │   │   ├── languages-chirho.ts           # Language, LanguageMember
│   │   │   │   └── index.ts
│   │   │   ├── session-chirho.ts                 # Session management
│   │   │   └── mailer-chirho.ts                  # Email utilities
│   │   │
│   │   ├── modules-chirho/                       # Feature modules
│   │   │   ├── access-chirho/
│   │   │   │   ├── policy-chirho.ts
│   │   │   │   ├── claims-repository-chirho.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── bible-core-chirho/
│   │   │   │   ├── queries-chirho.ts             # Read models
│   │   │   │   └── types-chirho.ts
│   │   │   │
│   │   │   ├── translation-chirho/
│   │   │   │   ├── gloss-repository-chirho.ts
│   │   │   │   ├── phrase-repository-chirho.ts
│   │   │   │   ├── use-cases-chirho/
│   │   │   │   │   ├── update-gloss-chirho.ts
│   │   │   │   │   └── approve-all-chirho.ts
│   │   │   │   └── types-chirho.ts
│   │   │   │
│   │   │   ├── languages-chirho/
│   │   │   ├── users-chirho/
│   │   │   ├── snapshots-chirho/
│   │   │   ├── reporting-chirho/
│   │   │   ├── study-chirho/
│   │   │   └── dashboard-chirho/
│   │   │
│   │   ├── components-chirho/                    # Shared Svelte components
│   │   │   ├── ButtonChirho.svelte
│   │   │   ├── TextInputChirho.svelte
│   │   │   ├── AutocompleteInputChirho.svelte
│   │   │   ├── IconChirho.svelte
│   │   │   ├── ModalViewChirho.svelte
│   │   │   └── ...
│   │   │
│   │   ├── utils-chirho/
│   │   │   ├── text-width-chirho.ts
│   │   │   ├── keyboard-shortcuts-chirho.ts
│   │   │   └── merge-refs-chirho.ts
│   │   │
│   │   └── i18n-chirho/
│   │       ├── index.ts
│   │       └── messages-chirho/
│   │
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +layout.server.ts
│   │   │
│   │   ├── (auth-chirho)/                        # Minimal layout
│   │   │   ├── login-chirho/
│   │   │   ├── invite-chirho/
│   │   │   ├── forgot-password-chirho/
│   │   │   ├── reset-password-chirho/
│   │   │   └── verify-email-chirho/
│   │   │
│   │   ├── (app-chirho)/                         # Main app layout
│   │   │   ├── +layout.svelte
│   │   │   ├── translate-chirho/
│   │   │   │   └── [code_chirho]/[verse_id_chirho]/
│   │   │   ├── read-chirho/
│   │   │   │   └── [code_chirho]/[chapter_id_chirho]/
│   │   │   ├── admin-chirho/
│   │   │   │   ├── languages-chirho/[code_chirho]/
│   │   │   │   ├── users-chirho/
│   │   │   │   └── jobs-chirho/
│   │   │   └── profile-chirho/
│   │   │
│   │   ├── api-chirho/
│   │   │   ├── verse-preview-chirho/+server.ts
│   │   │   ├── audio-chirho/[speaker_chirho]/[chapter_id_chirho]/+server.ts
│   │   │   └── lemma-resources-chirho/[lemma_id_chirho]/+server.ts
│   │   │
│   │   └── logout-chirho/+server.ts
│   │
│   ├── app.html
│   ├── app.css
│   └── hooks.server.ts
│
├── drizzle/
├── static/
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── AGENTS.md
```

---

## Drizzle ORM Schema Strategy

The critical challenge: Chirho-suffixed types mapping to existing PostgreSQL columns.

### Example: Gloss Table

```typescript
// src/lib/server/schema-chirho/translation-chirho.ts

import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enum (PostgreSQL name unchanged)
export const glossStateEnumChirho = pgEnum('GlossState', ['APPROVED', 'UNAPPROVED']);

// Table: Chirho types → original columns
export const glossTableChirho = pgTable('Gloss', {
  phraseIdChirho: integer('phraseId').primaryKey().notNull(),
  glossChirho: text('gloss'),
  stateChirho: glossStateEnumChirho('state').default('UNAPPROVED').notNull(),
  updatedAtChirho: timestamp('updated_at', { precision: 3 }),
  updatedByChirho: text('updated_by'),
});

// TypeScript types
export type GlossChirho = typeof glossTableChirho.$inferSelect;
export type NewGlossChirho = typeof glossTableChirho.$inferInsert;
```

### Repository Pattern

```typescript
// src/lib/modules-chirho/translation-chirho/gloss-repository-chirho.ts

import { eq } from 'drizzle-orm';
import { dbChirho } from '$lib/server/db-chirho';
import { glossTableChirho } from '$lib/server/schema-chirho';

export const glossRepositoryChirho = {
  async findByPhraseIdChirho(phraseIdChirho: number) {
    const resultChirho = await dbChirho
      .select()
      .from(glossTableChirho)
      .where(eq(glossTableChirho.phraseIdChirho, phraseIdChirho))
      .limit(1);
    return resultChirho[0];
  },
};
```

---

## Conversion Patterns: React → Svelte 5

### 1. State Management

**React:**
```tsx
const [saving, setSaving] = useState(false);
const inputRef = useRef<HTMLInputElement>(null);
```

**Svelte 5:**
```svelte
<script lang="ts">
  let savingChirho = $state(false);
  let inputRefChirho: HTMLInputElement;
</script>

<input bind:this={inputRefChirho} />
```

### 2. Server Actions → Form Actions

**Next.js:**
```typescript
"use server";
export async function updateGlossAction(formData: FormData) {
  await updateGlossUseCase(data);
  revalidatePath(...);
}
```

**SvelteKit:**
```typescript
// +page.server.ts
export const actions: Actions = {
  updateGlossChirho: async ({ request, cookies }) => {
    const formDataChirho = await request.formData();
    await updateGlossUseCaseChirho(dataChirho);
    return { successChirho: true };
  }
};
```

```svelte
<form method="POST" action="?/updateGlossChirho" use:enhance>
```

### 3. Data Loading

**Next.js (Server Component):**
```tsx
export default async function Page({ params }: Props) {
  const data = await fetchData(params.id);
  return <Component data={data} />;
}
```

**SvelteKit:**
```typescript
// +page.server.ts
export const load: PageServerLoad = async ({ params }) => {
  const dataChirho = await fetchDataChirho(params.id_chirho);
  return { dataChirho };
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  let { data }: { data: PageData } = $props();
</script>

<ComponentChirho dataChirho={data.dataChirho} />
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [x] Create `sveltekit2-platform-chirho/` scaffolding
- [x] Set up Drizzle ORM with all schema definitions
- [x] Implement session management in `hooks.server.ts`
- [x] Create base layouts and navigation
- [x] Configure Tailwind CSS
- [ ] Set up i18n

### Phase 2: Authentication (Week 2-3)
- [x] Login page with form actions
- [x] Registration/invite flow
- [x] Password reset flow
- [x] Email verification
- [x] Session cookie management

### Phase 3: Bible Core (Week 3-4)
- [x] Book/Verse/Word read models
- [x] Lemma/LemmaForm queries
- [x] Read view (`/read-chirho/[code]/[chapter]`)
- [ ] Audio playback

### Phase 4: Translation Module (Week 4-6) - CRITICAL
- [x] Phrase/Gloss repositories
- [x] TranslateWordChirho component
- [x] Translation view with word selection
- [x] Gloss approval workflow
- [ ] Machine translation integration
- [x] Footnotes (Notes panel)

### Phase 5: Languages Module (Week 6-7)
- [x] Language CRUD
- [x] Member management
- [ ] Settings page
- [x] Import functionality

### Phase 6: Admin & Remaining (Week 7-8)
- [x] User administration
- [ ] Snapshots module
- [ ] Reporting/analytics
- [x] Dashboard (admin panel)
- [x] Job worker integration (import jobs page)

---

## Complex Modules Analysis

### Translation Module (Most Complex)
- `TranslateWord.tsx` (468 lines) - Inline editing, autocomplete, approval
- `ServerTranslationView.tsx` (382 lines) - LATERAL JOINs, complex data
- `ClientTranslationView.tsx` (200+ lines) - Multi-word selection

**Challenges:**
- Real-time autosave with debouncing
- Multi-word phrase linking
- Google Translate integration
- Complex keyboard navigation

### Critical Files Reference
1. `src/modules/translation/react/TranslateWord.tsx` - Most complex component
2. `src/modules/translation/data-access/GlossRepository.ts` - Core data access
3. `src/db.ts` - Database connection
4. `src/session.ts` - Session management
5. `db/migrations/24-09-28-initalize-db.sql` - Complete schema

---

## Completion Status

### ✅ SvelteKit 2 Rewrite: COMPLETE

The core rewrite from Next.js 14 to SvelteKit 2 is complete with:
- All critical modules ported (translation, bible-core, languages, users, admin)
- Drizzle ORM with full schema definitions
- Session management and authentication flows
- Admin panel with users, languages, and jobs management
- PDF export functionality (GitHub #109)
- Word detail panel with lemma glosses (GitHub #129)
- API validation with Zod
- Authorization checks on all protected routes
- Chirho naming convention applied throughout

### 📋 Deferred Features (Future Enhancements)

These features are not part of the core rewrite but can be added later:
- [ ] i18n - Internationalization (app works in English)
- [ ] Audio playback - Study view audio sync
- [ ] Machine translation - Google Translate integration
- [ ] Language settings page - Advanced per-language configuration
- [ ] Snapshots module - Language backup/restore (GitHub #128)
- [ ] Reporting/analytics - Statistics dashboard

### 🔗 Related GitHub Issues Addressed
- #109 PDF interlinear export ✅
- #129 List glosses for a given lemma ✅

---

## Upstream Sync Strategy

Use `/sync-upstream-chirho` command (see `.claude/commands/sync-upstream-chirho.md`):

1. Get upstream diff: `cd nextjs-platform-chirho && git diff HEAD~5..HEAD`
2. Run: `/sync-upstream-chirho HEAD~5..HEAD`
3. Agent analyzes changes, converts to SvelteKit/Chirho, applies

This allows us to stay current with upstream improvements while maintaining our fork.
