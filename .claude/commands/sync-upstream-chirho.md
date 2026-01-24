# /sync-upstream-chirho - Upstream Synchronization Command

Synchronize changes from the upstream Next.js repository to our SvelteKit 2 codebase.

## Usage

```
/sync-upstream-chirho [commit-range|diff-file]
```

**Arguments:**
- `commit-range`: Git commit range (e.g., `abc123..def456`, `HEAD~5..HEAD`, or a single commit hash)
- `diff-file`: Path to a `.diff` or `.patch` file

**Examples:**
```
/sync-upstream-chirho HEAD~3..HEAD
/sync-upstream-chirho abc123
/sync-upstream-chirho /tmp/upstream-changes.diff
```

---

## Process

### Step 1: Fetch and Analyze Changes

```bash
cd nextjs-platform-chirho
git fetch origin
git diff $COMMIT_RANGE
```

Categorize changes by type:
- **Schema changes**: Database migrations, type definitions
- **Component changes**: React components (.tsx)
- **Logic changes**: Use cases, repositories, actions
- **Route changes**: New pages or API endpoints
- **Test changes**: Unit/integration tests

### Step 2: File Mapping

Map upstream paths to SvelteKit equivalents:

| Upstream Path | SvelteKit Path |
|---------------|----------------|
| `src/modules/{name}/` | `src/lib/modules-chirho/{name}-chirho/` |
| `src/modules/{name}/react/*.tsx` | `src/lib/components-chirho/*Chirho.svelte` |
| `src/modules/{name}/actions/*.ts` | `src/routes/**/+page.server.ts` (actions) |
| `src/modules/{name}/data-access/*.ts` | `src/lib/modules-chirho/{name}-chirho/*-repository-chirho.ts` |
| `app/[locale]/(main)/{route}/page.tsx` | `src/routes/(app-chirho)/{route}-chirho/+page.svelte` |
| `app/api/{route}/route.ts` | `src/routes/api-chirho/{route}-chirho/+server.ts` |
| `src/db.ts` | `src/lib/server/db-chirho.ts` |
| `src/shared/ui/*.tsx` | `src/lib/components-chirho/*Chirho.svelte` |

### Step 3: Conversion Rules

#### Naming Transformations

| Type | Upstream | Chirho |
|------|----------|--------|
| Variables/functions | `camelCase` | `camelCaseChirho` |
| Types/interfaces | `PascalCase` | `PascalCaseChirho` |
| Files | `kebab-case.ts` | `kebab-case-chirho.ts` |
| Routes | `/path/` | `/path-chirho/` |
| Route params | `[param]` | `[param_chirho]` |
| Components | `Component.tsx` | `ComponentChirho.svelte` |

#### React → Svelte 5 Runes

```typescript
// React
const [value, setValue] = useState(initial);
const computed = useMemo(() => calc(value), [value]);
useEffect(() => { sideEffect(); }, [deps]);
const ref = useRef<HTMLElement>(null);

// Svelte 5
let valueChirho = $state(initial);
let computedChirho = $derived(calcChirho(valueChirho));
$effect(() => { sideEffectChirho(); });
let refChirho: HTMLElement;
```

#### JSX → Svelte Template

```tsx
// React JSX
<div className="foo" onClick={handleClick}>
  {condition && <Child />}
  {items.map(item => <Item key={item.id} {...item} />)}
</div>

// Svelte
<div class="foo" onclick={handleClickChirho}>
  {#if conditionChirho}
    <ChildChirho />
  {/if}
  {#each itemsChirho as itemChirho (itemChirho.idChirho)}
    <ItemChirho {...itemChirho} />
  {/each}
</div>
```

#### Server Actions → Form Actions

```typescript
// Next.js
"use server";
export async function updateGloss(formData: FormData) {
  const session = await verifySession();
  const data = parseFormData(formData);
  await updateGlossUseCase(data);
  revalidatePath('/translate');
}

// SvelteKit +page.server.ts
export const actions: Actions = {
  updateGlossChirho: async ({ request, cookies }) => {
    const sessionChirho = await verifySessionChirho(cookies);
    const formDataChirho = await request.formData();
    const dataChirho = parseFormDataChirho(formDataChirho);
    await updateGlossUseCaseChirho(dataChirho);
    return { successChirho: true };
  }
};
```

#### Kysely → Drizzle

```typescript
// Kysely
const result = await db
  .selectFrom('Gloss')
  .where('phraseId', '=', phraseId)
  .selectAll()
  .executeTakeFirst();

// Drizzle (with Chirho types mapping to original columns)
const resultChirho = await dbChirho
  .select()
  .from(glossTableChirho)
  .where(eq(glossTableChirho.phraseIdChirho, phraseIdChirho))
  .limit(1);
```

#### Route Conversions

```typescript
// Next.js notFound/redirect
import { notFound, redirect } from 'next/navigation';
if (!data) notFound();
redirect('/login');

// SvelteKit
import { error, redirect } from '@sveltejs/kit';
if (!dataChirho) throw error(404, 'Not found');
throw redirect(303, '/login-chirho');
```

### Step 4: Apply Changes

For each changed file:

1. **New file**: Create equivalent in SvelteKit structure with conversions
2. **Modified file**:
   - If SvelteKit equivalent exists: Apply diff with conversions
   - If not: Flag for manual review
3. **Deleted file**: Mark SvelteKit equivalent for deletion review

### Step 5: Validation

```bash
cd sveltekit2-platform-chirho
bun run check          # Type checking
bun run lint           # ESLint
bun run test           # Unit tests
```

### Step 6: Generate Report

Output summary:
- Files created/modified/deleted
- Manual review items
- Type errors to fix
- Missing dependencies

---

## Manual Review Required

These patterns need human verification:
- Complex SQL with LATERAL JOINs or window functions
- Custom React hooks with complex side effects
- Third-party library integrations (may need Svelte equivalents)
- Performance-critical real-time features
- Any code touching authentication/security

---

## Example Session

```
User: /sync-upstream-chirho HEAD~2..HEAD

Claude: Analyzing upstream changes from HEAD~2 to HEAD...

Found 5 changed files:
1. src/modules/translation/react/TranslateWord.tsx (modified)
2. src/modules/translation/actions/updateGloss.ts (modified)
3. src/modules/languages/data-access/LanguageRepository.ts (modified)
4. app/[locale]/(main)/translate/[code]/[verseId]/page.tsx (modified)
5. db/migrations/25-01-20-new-feature.sql (added)

Converting to SvelteKit with Chirho naming...

✓ TranslateWordChirho.svelte - Updated state handling
✓ +page.server.ts (translate) - Added updateGlossChirho action
✓ language-repository-chirho.ts - New query method
✓ translate/[code_chirho]/[verse_id_chirho]/+page.svelte - Layout fix
⚠ Migration 25-01-20 - Manual review needed (new column)

4 files updated, 1 requires manual review.
Run `bun run check` to verify types.
```

---

## Drizzle Schema Updates

When upstream adds new columns/tables:

1. **Add to Drizzle schema** with Chirho suffix mapping:
```typescript
// New column added upstream: "priority" INTEGER
// Add to schema-chirho:
priorityChirho: integer('priority').default(0),
```

2. **No migration needed** - We use the existing PostgreSQL database
3. **Update TypeScript types** - Drizzle infers from schema

---

## Tips

- Run `/sync-upstream-chirho` frequently (weekly) for smaller diffs
- Check upstream releases/changelog for breaking changes
- Test translation workflow thoroughly after sync
- Keep `nextjs-platform-chirho` submodule updated: `git submodule update --remote`
