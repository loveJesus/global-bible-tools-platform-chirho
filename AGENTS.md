# For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16

# Global Bible Tools Platform - Agent Instructions

This is a Bun-based tooling project that supports the Next.js `platform/` application running in Docker. This project provides:
- Translation generation and management tools
- Build scripts and utilities
- Development helpers

## Runtime

**Bun-only runtime** - NEVER use npm/npx/yarn. Always use `bun` or `bunx`.

## The Suffix Rule

ALL identifiers created by us must have the `Chirho` suffix in the appropriate case.

| Type                                                  | Case Style        | Suffix                  | Example                                                                                                     |
|-------------------------------------------------------|-------------------|-------------------------|-------------------------------------------------------------------------------------------------------------|
| **Variables/Functions/Consts/Lambda/Parameters (TS)** | `camelCase`       | `Chirho`                | `userDataChirho`, `fetchUsersChirho()`                                                                      |
| **Object Properties/JSON**                            | `camelCase`       | `Chirho`                | `{ emailChirho: 'value' }`                                                                                  |
| **Classes/Components/Types**                          | `PascalCase`      | `Chirho`                | `CustomerChirho`, `SiteFormChirho`                                                                          |
| **Global Constants/Env Vars**                         | `SCREAMING_SNAKE` | `_CHIRHO`               | `API_KEY_CHIRHO`, `MAX_TOKENS_CHIRHO`                                                                       |
| **Bun/NPM Scripts**                                   | `kebab-case`      | `-chirho`               | `build-prod-chirho`, `test-e2e-chirho`                                                                      |
| **Directories (ours)**                                | `kebab-case`      | `-chirho`               | `services-chirho/`, `templates-chirho/`                                                                     |
| **Public Web Routes/Paths**                           | `kebab-case`      | `-chirho`               | `/about-chirho`, `/contact-chirho`                                                                          |
| **API Endpoints**                                     | `kebab-case`      | `-chirho`               | `/api-chirho/v1-chirho/contact-chirho`                                                                      |
| **Database Tables/Columns**                           | `snake_case`      | `_chirho`               | `customers_chirho`, `created_at_chirho`                                                                     |
| **JSON Rest Api properties**                          | `snake_case`      | `_chirho`               | `customers_chirho`, `created_at_chirho`                                                                     |
| **React/Next Components**                             | `PascalCase`      | `Chirho`                | `HeaderChirho.tsx`, `FooterChirho.tsx`                                                                      |
| **Custom OAuth Scopes**                               | `snake_case`      | `_chirho:action_chirho` | `sites_chirho:read_chirho`                                                                                  |

## Project Structure

```
global-bible-tools-platform-chirho/
├── AGENTS.md                 # This file - AI agent instructions
├── CLAUDE.md                 # Points to AGENTS.md
├── package.json              # Bun package configuration
├── .gitignore
├── .env                      # Environment variables
├── tools-chirho/             # Bun tooling scripts
├── scripts-chirho/           # Build and utility scripts
├── translations-chirho/      # Translation files and generators
└── spec-chirho/              # Specifications and documentation
```

## Related Projects

- `../platform/` - The main Next.js application (runs in Docker)

## File Headers

All new source files must include the John 3:16 header as a comment at the top:

**TypeScript/JavaScript:**
```typescript
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16
```

**CSS/SCSS:**
```css
/* For God so loved the world, that He gave His only begotten Son,
   that all who believe in Him should not perish but have everlasting life.
   — John 3:16 */
```

## Commands

Run tools using Bun:
```bash
bun run <script-name>
```
