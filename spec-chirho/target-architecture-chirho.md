# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# SvelteKit Platform Target Architecture

This document defines the target architecture for the SvelteKit 2 rewrite of Global Bible Tools, including feature parity requirements, testing strategy, and GitHub issues to address.

---

## 1. Project Structure Target

```
sveltekit2-platform-chirho/
├── src/
│   ├── lib/
│   │   ├── components-chirho/           # Shared UI components
│   │   │   ├── ui-chirho/               # Base UI (buttons, inputs, modals)
│   │   │   ├── bible-chirho/            # Bible-specific (verse display, word hover)
│   │   │   ├── translation-chirho/      # Translation editor components
│   │   │   └── layout-chirho/           # Layout components (header, sidebar)
│   │   │
│   │   ├── modules-chirho/              # Feature modules (domain logic)
│   │   │   ├── access-chirho/           # Authorization & policies
│   │   │   ├── bible-core-chirho/       # Bible data (books, verses, words)
│   │   │   ├── languages-chirho/        # Language management
│   │   │   ├── translation-chirho/      # Glosses, phrases, machine translation
│   │   │   ├── users-chirho/            # User accounts, sessions, passwords
│   │   │   ├── study-chirho/            # Reading experience
│   │   │   ├── snapshots-chirho/        # Backup/restore functionality
│   │   │   ├── reporting-chirho/        # Statistics & analytics
│   │   │   └── admin-chirho/            # Admin dashboard features
│   │   │
│   │   ├── server/                      # Server-only code
│   │   │   ├── db-chirho.ts             # Database connection
│   │   │   ├── schema-chirho/           # Drizzle schema definitions
│   │   │   ├── session-chirho.ts        # Session management
│   │   │   └── email-chirho.ts          # Email sending
│   │   │
│   │   └── shared-chirho/               # Shared utilities
│   │       ├── ulid-chirho.ts           # ID generation
│   │       ├── validation-chirho.ts     # Zod schemas
│   │       └── i18n-chirho.ts           # Internationalization
│   │
│   ├── routes/
│   │   ├── (public-chirho)/             # Public routes (no auth)
│   │   │   ├── +page.svelte             # Landing page
│   │   │   ├── login-chirho/
│   │   │   ├── register-chirho/
│   │   │   ├── forgot-password-chirho/
│   │   │   ├── reset-password-chirho/
│   │   │   └── verify-email-chirho/
│   │   │
│   │   ├── (app-chirho)/                # Authenticated app routes
│   │   │   ├── read-chirho/
│   │   │   │   ├── +page.svelte         # Language selection
│   │   │   │   └── [code_chirho]/
│   │   │   │       ├── +page.svelte     # Book selection
│   │   │   │       └── [chapter_id_chirho]/
│   │   │   │           └── +page.svelte # Chapter reader
│   │   │   │
│   │   │   ├── translate-chirho/
│   │   │   │   ├── +page.svelte         # Language selection
│   │   │   │   └── [code_chirho]/
│   │   │   │       ├── +page.svelte     # Book/verse selection
│   │   │   │       ├── books-chirho/
│   │   │   │       │   └── [book_id_chirho]/
│   │   │   │       │       └── progress-chirho/
│   │   │   │       └── [verse_id_chirho]/
│   │   │   │           └── +page.svelte # Translation editor
│   │   │   │
│   │   │   └── profile-chirho/
│   │   │       └── +page.svelte         # User profile
│   │   │
│   │   ├── (admin-chirho)/              # Admin routes
│   │   │   └── admin-chirho/
│   │   │       ├── +layout.svelte       # Admin layout
│   │   │       ├── languages-chirho/
│   │   │       │   ├── +page.svelte     # Language list
│   │   │       │   ├── new-chirho/
│   │   │       │   └── [code_chirho]/
│   │   │       │       ├── settings-chirho/
│   │   │       │       ├── users-chirho/
│   │   │       │       │   └── invite-chirho/
│   │   │       │       ├── snapshots-chirho/
│   │   │       │       └── import-chirho/
│   │   │       ├── users-chirho/
│   │   │       │   ├── +page.svelte
│   │   │       │   └── invite-chirho/
│   │   │       └── jobs-chirho/
│   │   │
│   │   ├── api-chirho/                  # API routes
│   │   │   └── v1-chirho/
│   │   │       ├── verses-chirho/
│   │   │       ├── glosses-chirho/
│   │   │       └── languages-chirho/
│   │   │
│   │   ├── +layout.svelte
│   │   ├── +layout.server.ts
│   │   ├── +error.svelte
│   │   └── +hooks.server.ts
│   │
│   ├── app.html
│   ├── app.css
│   └── app.d.ts
│
├── tests/                               # Test files
│   ├── unit-chirho/                     # Unit tests
│   │   └── modules-chirho/
│   ├── integration-chirho/              # Integration tests
│   │   └── api-chirho/
│   └── e2e-chirho/                      # End-to-end tests
│       ├── auth-chirho.spec.ts
│       ├── read-chirho.spec.ts
│       └── translate-chirho.spec.ts
│
├── static/
├── drizzle/                             # Drizzle migrations
├── package.json
├── svelte.config.js
├── vite.config.ts
└── vitest.config.ts
```

---

## 2. Module Architecture

Each module follows a consistent structure:

```
modules-chirho/[module-name]-chirho/
├── index.ts                    # Public exports
├── model-chirho/               # Domain models & types
│   ├── index.ts
│   └── [entity]-chirho.ts
├── data-access-chirho/         # Database operations
│   ├── [entity]-repository-chirho.ts
│   └── [entity]-query-service-chirho.ts
├── use-cases-chirho/           # Business logic
│   ├── [action]-chirho.ts
│   └── [action]-chirho.test.ts
└── api-chirho/                 # API handlers (if needed)
    └── [endpoint]-chirho.ts
```

### Module Responsibilities

| Module | Responsibility |
|--------|----------------|
| `access-chirho` | Policy evaluation, claims, authorization |
| `bible-core-chirho` | Books, verses, words, lemmas (read-only) |
| `languages-chirho` | Language CRUD, membership, roles |
| `translation-chirho` | Glosses, phrases, machine translation |
| `users-chirho` | Auth, sessions, passwords, profiles |
| `study-chirho` | Reading experience, verse navigation |
| `snapshots-chirho` | Backup/restore, export jobs |
| `reporting-chirho` | Statistics, progress tracking |
| `admin-chirho` | Admin dashboard, system management |

---

## 3. Feature Parity Checklist

### 3.1 Authentication & Users

| Feature | Next.js | SvelteKit | Status |
|---------|---------|-----------|--------|
| Email/password login | ✅ | ✅ | Done |
| User registration | ✅ | ❌ | TODO |
| Email verification | ✅ | ❌ | TODO |
| Password reset | ✅ | ❌ | TODO |
| User invitation | ✅ | ❌ | TODO |
| Profile management | ✅ | ❌ | TODO |
| Session management | ✅ | ✅ | Done |
| System roles (ADMIN) | ✅ | ❌ | TODO |

### 3.2 Language Management

| Feature | Next.js | SvelteKit | Status |
|---------|---------|-----------|--------|
| List languages | ✅ | ✅ | Done |
| Create language | ✅ | ❌ | TODO |
| Language settings | ✅ | ❌ | TODO |
| Invite members | ✅ | ❌ | TODO |
| Manage roles | ✅ | ❌ | TODO |
| Import translations | ✅ | ❌ | TODO |
| Reference language | ✅ | ❌ | TODO |

### 3.3 Reading Experience

| Feature | Next.js | SvelteKit | Status |
|---------|---------|-----------|--------|
| Book selection | ✅ | ✅ | Done |
| Chapter reading | ✅ | ⚠️ | Partial |
| Verse display | ✅ | ⚠️ | Partial |
| Word hover (lexicon) | ✅ | ❌ | TODO |
| Interlinear view | ✅ | ❌ | TODO |
| Font settings | ✅ | ❌ | TODO |
| RTL support | ✅ | ❌ | TODO |

### 3.4 Translation Editor

| Feature | Next.js | SvelteKit | Status |
|---------|---------|-----------|--------|
| Verse selection | ✅ | ⚠️ | Partial |
| Gloss editing | ✅ | ❌ | TODO |
| Phrase creation | ✅ | ❌ | TODO |
| Machine suggestions | ✅ | ❌ | TODO |
| Approval workflow | ✅ | ❌ | TODO |
| Gloss history | ✅ | ❌ | TODO |
| Footnotes | ✅ | ❌ | TODO |
| Translator notes | ✅ | ❌ | TODO |
| Progress tracking | ✅ | ❌ | TODO |

### 3.5 Admin Features

| Feature | Next.js | SvelteKit | Status |
|---------|---------|-----------|--------|
| User management | ✅ | ❌ | TODO |
| Language admin | ✅ | ❌ | TODO |
| Snapshots/backups | ✅ | ❌ | TODO |
| Job monitoring | ✅ | ❌ | TODO |
| System settings | ✅ | ❌ | TODO |

### 3.6 API & Integrations

| Feature | Next.js | SvelteKit | Status |
|---------|---------|-----------|--------|
| REST API | ✅ | ❌ | TODO |
| Verse API | ✅ | ❌ | TODO |
| Export API | ✅ | ❌ | TODO |
| Machine translation | ✅ | ❌ | TODO |

---

## 4. GitHub Issues to Address

### Priority 1: Bugs

| Issue | Title | Effort |
|-------|-------|--------|
| #137 | User roles don't refresh with pagination | Small |

### Priority 2: UX Improvements

| Issue | Title | Effort |
|-------|-------|--------|
| #138 | Help people know whether they need an account | Small |
| #89 | Return to last verse and language visited | Medium |
| #70 | Save font size setting in browser | Small |
| #90 | Select language details from dropdown when creating | Small |

### Priority 3: Features

| Issue | Title | Effort |
|-------|-------|--------|
| #129 | List glosses for a given lemma | Medium |
| #128 | Snapshot backup/restore | Large |
| #120 | Language and Volunteer Counter for Homepage | Small |
| #118 | Advanced search | Large |
| #109 | PDF interlinear export | Large |
| #95 | Gloss version of the critical text | Medium |

### Priority 4: Architecture

| Issue | Title | Effort |
|-------|-------|--------|
| #71 | Architecture Evolution | Ongoing |

---

## 5. Testing Strategy

### 5.1 Unit Tests (Vitest)

Test individual functions and modules in isolation.

```typescript
// tests/unit-chirho/modules-chirho/users-chirho/password-chirho.test.ts
import { describe, it, expect } from 'vitest';
import { hashPasswordChirho, verifyPasswordChirho } from '$lib/modules-chirho/users-chirho';

describe('PasswordChirho', () => {
  it('should hash and verify password', async () => {
    const passwordChirho = 'TestPassword123!';
    const hashChirho = await hashPasswordChirho(passwordChirho);

    expect(hashChirho).not.toBe(passwordChirho);
    expect(await verifyPasswordChirho(hashChirho, passwordChirho)).toBe(true);
    expect(await verifyPasswordChirho(hashChirho, 'wrong')).toBe(false);
  });
});
```

### 5.2 Integration Tests (Vitest + Test DB)

Test database operations against a test database.

```typescript
// tests/integration-chirho/modules-chirho/languages-chirho.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestDbChirho, cleanupTestDbChirho } from '../helpers-chirho';
import { getAllLanguagesChirho } from '$lib/modules-chirho/languages-chirho';

describe('LanguagesChirho Integration', () => {
  beforeAll(async () => {
    await getTestDbChirho();
  });

  afterAll(async () => {
    await cleanupTestDbChirho();
  });

  it('should return all languages', async () => {
    const languagesChirho = await getAllLanguagesChirho();
    expect(languagesChirho).toBeInstanceOf(Array);
    expect(languagesChirho.length).toBeGreaterThan(0);
  });
});
```

### 5.3 E2E Tests (Playwright)

Test complete user flows.

```typescript
// tests/e2e-chirho/auth-chirho.spec.ts
import { test, expect } from '@playwright/test';

test.describe('AuthenticationChirho', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login-chirho');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login-chirho');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid')).toBeVisible();
  });
});
```

### 5.4 Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    globals: true,
    setupFiles: ['tests/setup-chirho.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    }
  }
});
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e-chirho',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'bun run dev-chirho',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 6. Code Conventions

### 6.1 Chirho Naming (Mandatory)

| Type | Convention | Example |
|------|------------|---------|
| Variables/Functions | camelCaseChirho | `userDataChirho`, `fetchUsersChirho()` |
| Types/Interfaces | PascalCaseChirho | `UserChirho`, `LanguageDataChirho` |
| Constants | SCREAMING_SNAKE_CHIRHO | `MAX_RETRIES_CHIRHO` |
| DB Tables/Columns | snake_case (no suffix) | `users`, `created_at` |
| Routes | kebab-case-chirho | `/login-chirho`, `/read-chirho` |
| Files | kebab-case-chirho.ts | `user-repository-chirho.ts` |

### 6.2 SvelteKit Conventions (Keep As-Is)

These framework-provided names must NOT be renamed:
- `load`, `actions`, `handle` - SvelteKit functions
- `params`, `data`, `error` - SvelteKit props
- `cookies`, `locals`, `request`, `url` - Event properties
- `children` - Svelte slot prop

### 6.3 File Headers

All source files must include:

```typescript
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16
```

---

## 7. Implementation Phases

### Phase 1: Core Auth & Reading (Current)
- [x] Basic login/logout
- [x] Session management
- [x] Language list
- [x] Book list
- [ ] Chapter reading (fix issues)
- [ ] Word hover/lexicon

### Phase 2: Full Auth Flow
- [ ] User registration
- [ ] Email verification
- [ ] Password reset
- [ ] User profiles

### Phase 3: Translation Editor
- [ ] Verse selection
- [ ] Gloss editing
- [ ] Phrase creation
- [ ] Approval workflow

### Phase 4: Admin Features
- [ ] Language admin
- [ ] User management
- [ ] Snapshots
- [ ] Import/export

### Phase 5: Advanced Features
- [ ] Machine translation
- [ ] Advanced search
- [ ] PDF export
- [ ] Statistics dashboard

---

## 8. Known Issues to Fix

### 8.1 Current Bugs

1. **Editor shows duplicate words** - Translation editor repeats original language words twice
2. **Missing translationIdsChirho** - Interface property still references `bibleTranslationIdsChirho`
3. **Loop variables need suffixes** - `mChirho`, `rChirho` should be `memberChirho`, `roleChirho`

### 8.2 Schema Mismatches

Verify all Drizzle schema columns match upstream database:
- `language.translation_ids` (not `bible_translation_ids`)
- `language.reference_language_id`
- Other tables need audit

### 8.3 Missing Error Handling

- Database connection errors
- Auth failures
- Form validation
- API error responses

---

## 9. Dependencies

### Runtime
- `@sveltejs/kit` - Framework
- `svelte` - UI library
- `drizzle-orm` - Database ORM
- `pg` - PostgreSQL client
- `oslo` - Auth utilities (password hashing, sessions)
- `tailwindcss` - Styling

### Dev
- `vitest` - Unit/integration testing
- `@playwright/test` - E2E testing
- `drizzle-kit` - Migrations
- `typescript` - Type checking
- `svelte-check` - Svelte type checking

---

## 10. Success Criteria

The SvelteKit rewrite is complete when:

1. **Feature Parity**: All Next.js features are implemented
2. **Tests Passing**: >80% code coverage, all E2E tests pass
3. **Performance**: Equal or better than Next.js version
4. **No Regressions**: All GitHub issues addressed
5. **Documentation**: Complete API docs and user guides
6. **Deployment**: Successful production deployment

---

*Last updated: January 2026*
