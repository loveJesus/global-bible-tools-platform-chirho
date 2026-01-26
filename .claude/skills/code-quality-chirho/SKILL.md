# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

---
name: "code-quality"
description: "Enforces DRY principles, code quality standards, and best practices"
---

# Code Quality Skill

## Purpose

Maintain high code quality through DRY principles, clean architecture, and consistent practices.

## DRY Principles (Don't Repeat Yourself)

### Identify Duplication
Before writing new code, search for existing:
- Helper functions that do similar work
- Components with similar UI patterns
- Database queries with similar logic
- API handlers with similar validation

### Extract Common Patterns
When you see similar code 2-3 times:
1. Extract to a shared utility function
2. Create a reusable component
3. Build a shared type/interface

### Acceptable Repetition
Not all repetition is bad:
- Test fixtures can have some duplication for clarity
- Similar but distinct business logic should remain separate
- Don't over-abstract too early (Rule of Three)

## Code Quality Standards

### TypeScript Best Practices
```typescript
// GOOD: Explicit types, clear naming
async function fetchUserByIdChirho(userIdChirho: string): Promise<UserChirho | null> {
  const resultChirho = await queryRawChirho<UserChirho>(
    `SELECT * FROM users WHERE id = $1`,
    [userIdChirho]
  );
  return resultChirho[0] ?? null;
}

// BAD: Any types, unclear naming
async function fetch(id: any) {
  const r = await queryRawChirho(`SELECT * FROM users WHERE id = $1`, [id]);
  return r[0];
}
```

### Error Handling
```typescript
// GOOD: Specific error handling with context
try {
  const userChirho = await fetchUserChirho(userIdChirho);
  if (!userChirho) {
    throw errorChirho(404, 'User not found');
  }
  return userChirho;
} catch (errChirho) {
  if (errChirho instanceof HttpError) throw errChirho;
  console.error('Failed to fetch user:', errChirho);
  throw errorChirho(500, 'Internal server error');
}

// BAD: Swallowing errors
try {
  return await fetchUser(id);
} catch {
  return null;  // Lost error context
}
```

### Function Size
- Functions should do ONE thing
- If a function needs comments to explain sections, split it
- Aim for functions under 30 lines
- Extract validation, transformation, and persistence into separate functions

### Component Structure (Svelte)
```svelte
<!-- GOOD: Clear sections, typed props -->
<script lang="ts">
  import { enhance } from '$app/forms';

  interface PropsChirho {
    dataChirho: PageDataChirho;
  }

  let { dataChirho }: PropsChirho = $props();

  // Derived state
  const filteredItemsChirho = $derived(
    dataChirho.itemsChirho.filter(itemChirho => itemChirho.activeChirho)
  );
</script>

<!-- Template -->
{#each filteredItemsChirho as itemChirho}
  <ItemCardChirho {itemChirho} />
{/each}
```

## Avoid Anti-Patterns

### God Objects
- Don't create massive utility files with unrelated functions
- Split by domain: `auth-utils-chirho.ts`, `date-utils-chirho.ts`, etc.

### Prop Drilling
- Use Svelte stores or context for deeply nested state
- Don't pass data through 5+ component levels

### Magic Numbers/Strings
```typescript
// BAD
if (user.role === 1) { ... }

// GOOD
const ROLE_ADMIN_CHIRHO = 1;
if (userChirho.roleChirho === ROLE_ADMIN_CHIRHO) { ... }
```

### Premature Optimization
- Write clear code first
- Profile before optimizing
- Document why optimizations exist

## Incremental Development

### Commit Early and Often
| Changeset Size | Commit Frequency |
|----------------|------------------|
| Single file fix | Commit immediately |
| Feature (2-5 files) | Commit per logical unit |
| Large refactor | Commit every 15-30 minutes |

### Validation Checkpoints
After each change:
1. Does it compile? (`bun run build`)
2. TypeScript errors? (`bun run check`)
3. Tests pass? (`bun run test`)
4. Only then: `git commit`

## File Headers

All new source files must include the John 3:16 header:

```typescript
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16
```
