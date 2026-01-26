# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

---
name: "test-coverage"
description: "Test coverage requirements and testing best practices"
---

# Test Coverage Skill

## Purpose

Ensure adequate test coverage for reliability and maintainability.

## Testing Philosophy

### Test What Matters
Focus testing effort on:
1. **Business logic** - Core translation workflow, user permissions
2. **Data transformations** - Input validation, format conversions
3. **Edge cases** - Empty states, boundary conditions, error paths
4. **Integration points** - Database queries, API endpoints

### Practical Testing (Not 100% Coverage)
- Don't test framework boilerplate
- Don't test simple getters/setters
- Don't test third-party library behavior
- DO test your business logic

## Test Structure

### Unit Tests
```typescript
// tests-chirho/utils-chirho/format-date-chirho.test.ts
import { describe, it, expect } from 'vitest';
import { formatDateChirho } from '$lib/utils-chirho/format-date-chirho';

describe('formatDateChirho', () => {
  it('formats date in user locale', () => {
    const dateChirho = new Date('2024-01-15T10:30:00Z');
    const resultChirho = formatDateChirho(dateChirho, 'en-US');
    expect(resultChirho).toBe('Jan 15, 2024');
  });

  it('handles null date gracefully', () => {
    const resultChirho = formatDateChirho(null, 'en-US');
    expect(resultChirho).toBe('—');
  });
});
```

### Integration Tests
```typescript
// tests-chirho/api-chirho/feedback-chirho.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestUserChirho, cleanupTestDataChirho } from '../helpers-chirho';

describe('Feedback API', () => {
  beforeEach(async () => {
    await cleanupTestDataChirho();
  });

  it('creates feedback for authenticated user', async () => {
    const userChirho = await createTestUserChirho();
    const responseChirho = await fetch('/api-chirho/feedback-chirho', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userChirho.tokenChirho}` },
      body: JSON.stringify({
        categoryChirho: 'bug',
        messageChirho: 'Test feedback'
      })
    });

    expect(responseChirho.status).toBe(200);
    const dataChirho = await responseChirho.json();
    expect(dataChirho.idChirho).toBeDefined();
  });

  it('rejects unauthenticated requests', async () => {
    const responseChirho = await fetch('/api-chirho/feedback-chirho', {
      method: 'POST',
      body: JSON.stringify({ messageChirho: 'Test' })
    });

    expect(responseChirho.status).toBe(401);
  });
});
```

### E2E Tests (Playwright)
```typescript
// tests-chirho/e2e-chirho/login-chirho.test.ts
import { test, expect } from '@playwright/test';

test('user can log in with valid credentials', async ({ page }) => {
  await page.goto('/login-chirho');

  await page.fill('[data-testid="email-input-chirho"]', 'test@example.com');
  await page.fill('[data-testid="password-input-chirho"]', 'password123');
  await page.click('[data-testid="login-button-chirho"]');

  await expect(page).toHaveURL('/dashboard-chirho');
  await expect(page.locator('[data-testid="user-menu-chirho"]')).toBeVisible();
});
```

## Coverage Requirements

### Minimum Coverage by Area

| Area | Minimum Coverage | Focus |
|------|-----------------|-------|
| Business Logic | 80% | Translation workflow, permissions |
| API Endpoints | 70% | Happy path + common errors |
| Utilities | 90% | Pure functions, formatters |
| Components | 50% | User interactions, state changes |

### Critical Paths (Must Test)
- [ ] User authentication (login, logout, session)
- [ ] Translation CRUD operations
- [ ] Permission checks (admin vs user)
- [ ] Data validation and sanitization

## Test Data

### Fixtures
```typescript
// tests-chirho/fixtures-chirho/users-chirho.ts
export const testUserChirho = {
  idChirho: 'test-user-123',
  emailChirho: 'test@example.com',
  nameChirho: 'Test User',
  roleChirho: 'user'
};

export const testAdminChirho = {
  idChirho: 'test-admin-456',
  emailChirho: 'admin@example.com',
  nameChirho: 'Test Admin',
  roleChirho: 'admin'
};
```

### Database Seeding
```typescript
// tests-chirho/helpers-chirho/seed-chirho.ts
export async function seedTestDatabaseChirho() {
  await queryRawChirho(`
    INSERT INTO users_chirho (id_chirho, email_chirho, name_chirho)
    VALUES ($1, $2, $3)
    ON CONFLICT (id_chirho) DO NOTHING
  `, [testUserChirho.idChirho, testUserChirho.emailChirho, testUserChirho.nameChirho]);
}

export async function cleanupTestDataChirho() {
  await queryRawChirho(`DELETE FROM feedback_chirho WHERE user_id_chirho LIKE 'test-%'`);
  await queryRawChirho(`DELETE FROM users_chirho WHERE id_chirho LIKE 'test-%'`);
}
```

## Running Tests

```bash
# Run all tests
bun run test

# Run with coverage
bun run test:coverage

# Run specific test file
bun run test tests-chirho/api-chirho/feedback-chirho.test.ts

# Run E2E tests
bun run test:e2e

# Watch mode during development
bun run test:watch
```

## Test Naming

```typescript
// Use descriptive names that explain the behavior
describe('FeedbackService', () => {
  describe('submitFeedbackChirho', () => {
    it('saves feedback to database when user is authenticated', () => {});
    it('throws error when message is empty', () => {});
    it('sanitizes HTML in message content', () => {});
    it('sends notification email to admin for bug reports', () => {});
  });
});
```

## Mocking

### Mock External Services
```typescript
import { vi } from 'vitest';

// Mock email service
vi.mock('$lib/server/email-chirho', () => ({
  sendEmailChirho: vi.fn().mockResolvedValue({ successChirho: true })
}));

// Mock database for unit tests
vi.mock('$lib/server/db-chirho', () => ({
  queryRawChirho: vi.fn()
}));
```

### Don't Mock
- Your own business logic (test it directly)
- Database in integration tests (use test database)
- The thing you're testing
