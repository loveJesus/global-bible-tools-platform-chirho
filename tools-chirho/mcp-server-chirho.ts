#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * MCP Server for Bible Translation Tools
 *
 * Exposes translation tools as MCP functions that Claude can call directly.
 * Start with: bun run tools-chirho/mcp-server-chirho.ts
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getPgChirho, closePgChirho, getSqliteChirho, initSqliteChirho, initPgConnectionChirho, shouldUseDockerExecChirho, dockerExecJsonQueryChirho } from "./db-chirho";

// Initialize SQLite on startup
try {
  initSqliteChirho();
} catch (_eChirho) {
  // Already initialized
}

// Initialize PostgreSQL connection (will fallback to docker exec if needed)
let pgInitializedChirho = false;
async function ensurePgChirho(): Promise<void> {
  if (!pgInitializedChirho) {
    await initPgConnectionChirho();
    pgInitializedChirho = true;
  }
}

/**
 * Escape a value for SQL (prevents SQL injection)
 */
function escSqlChirho(valChirho: unknown): string {
  if (valChirho === null || valChirho === undefined) return 'NULL';
  if (typeof valChirho === 'number') return String(valChirho);
  if (typeof valChirho === 'boolean') return valChirho ? 'TRUE' : 'FALSE';
  // Escape single quotes by doubling them
  return `'${String(valChirho).replace(/'/g, "''")}'`;
}

/**
 * Execute a SQL query - uses direct connection or docker exec as appropriate
 * @param queryStrChirho - Raw SQL query string
 * @returns Query results as array of objects
 */
async function queryPgChirho<T = Record<string, unknown>>(queryStrChirho: string): Promise<T[]> {
  await ensurePgChirho();
  if (shouldUseDockerExecChirho()) {
    return dockerExecJsonQueryChirho(queryStrChirho) as Promise<T[]>;
  } else {
    const pgChirho = getPgChirho();
    return pgChirho.unsafe(queryStrChirho) as Promise<T[]>;
  }
}

const serverChirho = new Server(
  {
    name: "bible-translation-tools-chirho",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
serverChirho.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_books_chirho",
        description: "List all books in the Bible with chapter and word counts",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "get_verse_chirho",
        description: "Get a verse with all words, lemmas, and current glosses",
        inputSchema: {
          type: "object",
          properties: {
            verse_ref_chirho: {
              type: "string",
              description: 'Verse reference like "Genesis 1:1" or verse ID like "01001001"',
            },
          },
          required: ["verse_ref_chirho"],
        },
      },
      {
        name: "get_chapter_chirho",
        description: "Get entire chapter with all words and glosses as JSON",
        inputSchema: {
          type: "object",
          properties: {
            book_chirho: {
              type: "string",
              description: 'Book name like "Genesis" or book ID like "1"',
            },
            chapter_chirho: {
              type: "integer",
              description: "Chapter number",
            },
          },
          required: ["book_chirho", "chapter_chirho"],
        },
      },
      {
        name: "query_lemma_chirho",
        description: "Get lemma info including lexicon entries, forms, and gloss usage statistics",
        inputSchema: {
          type: "object",
          properties: {
            lemma_id_chirho: {
              type: "string",
              description: 'Lemma ID like "H3820" (Hebrew) or "G2588" (Greek)',
            },
          },
          required: ["lemma_id_chirho"],
        },
      },
      {
        name: "set_decision_chirho",
        description: "Record a translation decision for a lemma to ensure consistency",
        inputSchema: {
          type: "object",
          properties: {
            lemma_id_chirho: {
              type: "string",
              description: "Lemma ID",
            },
            gloss_chirho: {
              type: "string",
              description: "The decided translation",
            },
            notes_chirho: {
              type: "string",
              description: "Optional notes about this decision",
            },
          },
          required: ["lemma_id_chirho", "gloss_chirho"],
        },
      },
      {
        name: "get_decisions_chirho",
        description: "Get all recorded translation decisions",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "check_consistency_chirho",
        description: "Find lemmas with inconsistent translations",
        inputSchema: {
          type: "object",
          properties: {
            min_count_chirho: {
              type: "integer",
              description: "Minimum occurrences to report (default: 10)",
            },
            max_variants_chirho: {
              type: "integer",
              description: "Report lemmas with more than this many variants (default: 3)",
            },
          },
          required: [],
        },
      },
      {
        name: "generate_translation_sql_chirho",
        description: "Generate idempotent SQL for translation data",
        inputSchema: {
          type: "object",
          properties: {
            language_code_chirho: {
              type: "string",
              description: 'Language code like "fra", "deu", "spa"',
            },
            verses_chirho: {
              type: "array",
              description: "Array of verse translations",
              items: {
                type: "object",
                properties: {
                  verse_id_chirho: { type: "string" },
                  glosses_chirho: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        word_id_chirho: { type: "string" },
                        gloss_chirho: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          required: ["language_code_chirho", "verses_chirho"],
        },
      },
      {
        name: "expand_glosses_chirho",
        description: "TOKEN-EFFICIENT: Takes minimal word_id→gloss JSON, fetches Greek from DB, writes SQL files. Use this for bulk translation.",
        inputSchema: {
          type: "object",
          properties: {
            language_code_chirho: {
              type: "string",
              description: 'Language code like "spa", "fra", "deu"',
            },
            book_name_chirho: {
              type: "string",
              description: 'Book name like "jude", "genesis"',
            },
            glosses_chirho: {
              type: "object",
              description: 'Minimal word ID to gloss map: {"6500100101": "Ioudas", "6500100102": "de–Iēsoû"}',
              additionalProperties: { type: "string" },
            },
          },
          required: ["language_code_chirho", "book_name_chirho", "glosses_chirho"],
        },
      },
      {
        name: "get_words_for_translation_chirho",
        description: "Get word IDs and Greek text for a chapter/book. Use this to see what needs translating.",
        inputSchema: {
          type: "object",
          properties: {
            book_chirho: {
              type: "string",
              description: 'Book name or ID',
            },
            chapter_chirho: {
              type: "integer",
              description: "Chapter number (optional - omit for whole book)",
            },
          },
          required: ["book_chirho"],
        },
      },
    ],
  };
});

// Tool implementations
serverChirho.setRequestHandler(CallToolRequestSchema, async (requestChirho) => {
  const { name, arguments: argsChirho } = requestChirho.params;
  const sqliteChirho = getSqliteChirho();

  // Ensure PostgreSQL connection is initialized (with docker exec fallback)
  await ensurePgChirho();

  try {
    switch (name) {
      case "list_books_chirho": {
        const booksChirho = await queryPgChirho(`
          SELECT b.id, b.name,
            MAX(v.chapter) as chapter_count,
            COUNT(DISTINCT v.id) as verse_count,
            COUNT(w.id) as word_count
          FROM book b
          JOIN verse v ON v.book_id = b.id
          JOIN word w ON w.verse_id = v.id
          GROUP BY b.id, b.name
          ORDER BY b.id
        `);
        return {
          content: [{ type: "text", text: JSON.stringify(booksChirho, null, 2) }],
        };
      }

      case "get_verse_chirho": {
        const refChirho = argsChirho?.verse_ref_chirho as string;
        let verseIdChirho = refChirho;

        // Parse "Genesis 1:1" format
        if (!/^\d{8}$/.test(refChirho)) {
          const matchChirho = refChirho.match(/^(\w+)\s+(\d+):(\d+)$/);
          if (matchChirho) {
            const [, bookChirho, chapChirho, verseChirho] = matchChirho;
            const resultChirho = await queryPgChirho<{id: string}>(`
              SELECT v.id FROM verse v
              JOIN book b ON b.id = v.book_id
              WHERE LOWER(b.name) LIKE ${escSqlChirho(bookChirho.toLowerCase() + "%")}
                AND v.chapter = ${parseInt(chapChirho)}
                AND v.number = ${parseInt(verseChirho)}
              LIMIT 1
            `);
            if (resultChirho.length === 0) {
              return { content: [{ type: "text", text: `Verse not found: ${refChirho}` }] };
            }
            verseIdChirho = resultChirho[0].id;
          }
        }

        const wordsChirho = await queryPgChirho(`
          SELECT w.id as word_id, w.text, lf.lemma_id, lf.grammar,
            g.gloss, g.state, b.name as book_name, v.chapter, v.number as verse_number
          FROM word w
          JOIN verse v ON v.id = w.verse_id
          JOIN book b ON b.id = v.book_id
          JOIN lemma_form lf ON lf.id = w.form_id
          LEFT JOIN phrase_word pw ON pw.word_id = w.id
          LEFT JOIN phrase p ON p.id = pw.phrase_id AND p.deleted_at IS NULL
            AND p.language_id = (SELECT id FROM language WHERE code = 'eng')
          LEFT JOIN gloss g ON g.phrase_id = p.id
          WHERE w.verse_id = ${escSqlChirho(verseIdChirho)}
          ORDER BY w.id
        `);

        return {
          content: [{ type: "text", text: JSON.stringify(wordsChirho, null, 2) }],
        };
      }

      case "get_chapter_chirho": {
        const bookRefChirho = argsChirho?.book_chirho as string;
        const chapterChirho = argsChirho?.chapter_chirho as number;

        let bookIdChirho: number;
        if (/^\d+$/.test(bookRefChirho)) {
          bookIdChirho = parseInt(bookRefChirho);
        } else {
          const bookResultChirho = await queryPgChirho<{id: number}>(`
            SELECT id FROM book WHERE LOWER(name) LIKE ${escSqlChirho(bookRefChirho.toLowerCase() + "%")} LIMIT 1
          `);
          if (bookResultChirho.length === 0) {
            return { content: [{ type: "text", text: `Book not found: ${bookRefChirho}` }] };
          }
          bookIdChirho = bookResultChirho[0].id;
        }

        const wordsChirho = await queryPgChirho(`
          SELECT v.number as verse_number, w.id as word_id, w.text,
            lf.lemma_id, lf.grammar, g.gloss, g.state
          FROM verse v
          JOIN word w ON w.verse_id = v.id
          JOIN lemma_form lf ON lf.id = w.form_id
          LEFT JOIN phrase_word pw ON pw.word_id = w.id
          LEFT JOIN phrase p ON p.id = pw.phrase_id AND p.deleted_at IS NULL
            AND p.language_id = (SELECT id FROM language WHERE code = 'eng')
          LEFT JOIN gloss g ON g.phrase_id = p.id
          WHERE v.book_id = ${bookIdChirho} AND v.chapter = ${chapterChirho}
          ORDER BY w.id
        `);

        return {
          content: [{ type: "text", text: JSON.stringify(wordsChirho, null, 2) }],
        };
      }

      case "query_lemma_chirho": {
        const lemmaIdChirho = argsChirho?.lemma_id_chirho as string;

        const formsChirho = await queryPgChirho(`
          SELECT lf.id as form_id, lf.grammar, COUNT(w.id) as word_count
          FROM lemma_form lf
          LEFT JOIN word w ON w.form_id = lf.id
          WHERE lf.lemma_id = ${escSqlChirho(lemmaIdChirho)}
          GROUP BY lf.id, lf.grammar
          ORDER BY word_count DESC
        `);

        const resourcesChirho = await queryPgChirho(`
          SELECT resource_code, content
          FROM lemma_resource
          WHERE lemma_id = ${escSqlChirho(lemmaIdChirho)}
        `);

        const glossUsageChirho = await queryPgChirho(`
          SELECT g.gloss, COUNT(*) as count, g.state
          FROM word w
          JOIN lemma_form lf ON lf.id = w.form_id
          JOIN phrase_word pw ON pw.word_id = w.id
          JOIN phrase p ON p.id = pw.phrase_id AND p.deleted_at IS NULL
          JOIN gloss g ON g.phrase_id = p.id
          JOIN language l ON l.id = p.language_id AND l.code = 'eng'
          WHERE lf.lemma_id = ${escSqlChirho(lemmaIdChirho)}
            AND g.gloss IS NOT NULL AND g.gloss != ''
          GROUP BY g.gloss, g.state
          ORDER BY count DESC
          LIMIT 15
        `);

        // Check our decision
        const decisionChirho = sqliteChirho
          .query(`SELECT * FROM lemma_decision_chirho WHERE lemma_id_chirho = ?`)
          .get(lemmaIdChirho);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              lemmaIdChirho,
              formsChirho,
              resourcesChirho,
              glossUsageChirho,
              ourDecisionChirho: decisionChirho,
            }, null, 2),
          }],
        };
      }

      case "set_decision_chirho": {
        const lemmaIdChirho = argsChirho?.lemma_id_chirho as string;
        const glossChirho = argsChirho?.gloss_chirho as string;
        const notesChirho = argsChirho?.notes_chirho as string | undefined;

        sqliteChirho
          .query(`
            INSERT INTO lemma_decision_chirho (lemma_id_chirho, primary_gloss_chirho, notes_chirho)
            VALUES (?, ?, ?)
            ON CONFLICT (lemma_id_chirho) DO UPDATE SET
              primary_gloss_chirho = excluded.primary_gloss_chirho,
              notes_chirho = COALESCE(excluded.notes_chirho, lemma_decision_chirho.notes_chirho),
              updated_at_chirho = CURRENT_TIMESTAMP
          `)
          .run(lemmaIdChirho, glossChirho, notesChirho ?? null);

        return {
          content: [{ type: "text", text: `✓ Recorded: ${lemmaIdChirho} → "${glossChirho}"` }],
        };
      }

      case "get_decisions_chirho": {
        const decisionsChirho = sqliteChirho
          .query(`SELECT * FROM lemma_decision_chirho ORDER BY updated_at_chirho DESC`)
          .all();

        return {
          content: [{ type: "text", text: JSON.stringify(decisionsChirho, null, 2) }],
        };
      }

      case "check_consistency_chirho": {
        const minCountChirho = (argsChirho?.min_count_chirho as number) ?? 10;
        const maxVariantsChirho = (argsChirho?.max_variants_chirho as number) ?? 3;

        const resultsChirho = await queryPgChirho(`
          WITH lemma_glosses AS (
            SELECT lf.lemma_id, g.gloss, COUNT(*) as count
            FROM word w
            JOIN lemma_form lf ON lf.id = w.form_id
            JOIN phrase_word pw ON pw.word_id = w.id
            JOIN phrase p ON p.id = pw.phrase_id AND p.deleted_at IS NULL
            JOIN gloss g ON g.phrase_id = p.id
            JOIN language l ON l.id = p.language_id AND l.code = 'eng'
            WHERE g.gloss IS NOT NULL AND g.gloss != ''
            GROUP BY lf.lemma_id, g.gloss
          )
          SELECT lemma_id, SUM(count) as total_words,
            COUNT(DISTINCT gloss) as variant_count,
            STRING_AGG(gloss || ' (' || count || ')', ', ' ORDER BY count DESC) as glosses
          FROM lemma_glosses
          GROUP BY lemma_id
          HAVING SUM(count) >= ${minCountChirho}
            AND COUNT(DISTINCT gloss) > ${maxVariantsChirho}
          ORDER BY variant_count DESC, total_words DESC
          LIMIT 30
        `);

        return {
          content: [{ type: "text", text: JSON.stringify(resultsChirho, null, 2) }],
        };
      }

      case "generate_translation_sql_chirho": {
        const languageCodeChirho = argsChirho?.language_code_chirho as string;
        const versesChirho = argsChirho?.verses_chirho as Array<{
          verse_id_chirho: string;
          glosses_chirho: Array<{ word_id_chirho: string; gloss_chirho: string }>;
        }>;

        const escapeChirho = (sChirho: string) => sChirho.replace(/'/g, "''");

        let sqlChirho = `-- Translation for ${languageCodeChirho}\n`;
        sqlChirho += `-- Generated: ${new Date().toISOString()}\n\n`;
        sqlChirho += `BEGIN;\n\n`;
        sqlChirho += `INSERT INTO language (code, name) VALUES ('${languageCodeChirho}', '${languageCodeChirho}') ON CONFLICT (code) DO NOTHING;\n\n`;

        for (const verseChirho of versesChirho) {
          for (const glossChirho of verseChirho.glosses_chirho) {
            const escapedGlossChirho = escapeChirho(glossChirho.gloss_chirho);
            sqlChirho += `-- Word ${glossChirho.word_id_chirho}\n`;
            sqlChirho += `WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = '${languageCodeChirho}'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p
    JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '${glossChirho.word_id_chirho}'
      AND p.language_id = (SELECT id FROM language WHERE code = '${languageCodeChirho}')
      AND p.deleted_at IS NULL
  )
  RETURNING id
), ensure_phrase_word AS (
  INSERT INTO phrase_word (phrase_id, word_id)
  SELECT id, '${glossChirho.word_id_chirho}' FROM ensure_phrase
  ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, '${escapedGlossChirho}', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p
JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '${glossChirho.word_id_chirho}'
  AND p.language_id = (SELECT id FROM language WHERE code = '${languageCodeChirho}')
  AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET
  gloss = EXCLUDED.gloss,
  updated_at = EXCLUDED.updated_at
WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;\n\n`;
          }
        }

        sqlChirho += `COMMIT;\n`;

        return {
          content: [{ type: "text", text: sqlChirho }],
        };
      }

      case "expand_glosses_chirho": {
        const { writeFileSync: writeFileSyncChirho, mkdirSync: mkdirSyncChirho } = await import('fs');
        const { join: joinChirho } = await import('path');

        const langCodeChirho = argsChirho?.language_code_chirho as string;
        const bookNameChirho = argsChirho?.book_name_chirho as string;
        const glossesChirho = argsChirho?.glosses_chirho as Record<string, string>;

        const wordIdsChirho = Object.keys(glossesChirho);

        // Fetch word info from DB
        const wordIdsListChirho = wordIdsChirho.map(idChirho => escSqlChirho(idChirho)).join(',');
        const wordInfoChirho = await queryPgChirho<{word_id: string; text: string; lemma_id: string; verse_num: number; chapter: number}>(`
          SELECT w.id as word_id, w.text, lf.lemma_id, v.number as verse_num, v.chapter
          FROM word w
          JOIN lemma_form lf ON lf.id = w.form_id
          JOIN verse v ON v.id = w.verse_id
          WHERE w.id IN (${wordIdsListChirho})
          ORDER BY w.id
        `);

        const wordMapChirho = new Map(wordInfoChirho.map(w => [w.word_id, w]));

        // Group by verse
        const verseGroupsChirho = new Map<number, Array<{ wordIdChirho: string; glossChirho: string; textChirho: string; lemmaIdChirho: string }>>();
        for (const [wordIdChirho, glossChirho] of Object.entries(glossesChirho)) {
          const infoChirho = wordMapChirho.get(wordIdChirho);
          if (!infoChirho) continue;
          const vChirho = infoChirho.verse_num;
          if (!verseGroupsChirho.has(vChirho)) verseGroupsChirho.set(vChirho, []);
          verseGroupsChirho.get(vChirho)!.push({
            wordIdChirho,
            glossChirho,
            textChirho: infoChirho.text,
            lemmaIdChirho: infoChirho.lemma_id,
          });
        }

        const sortedVersesChirho = Array.from(verseGroupsChirho.entries()).sort((a, b) => a[0] - b[0]);

        // Create output directory
        const outDirChirho = joinChirho(process.cwd(), 'translations-chirho', `${bookNameChirho.toLowerCase()}-${langCodeChirho}-chirho`);
        mkdirSyncChirho(outDirChirho, { recursive: true });

        const headerChirho = `-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16\n\n`;

        const escChirho = (sChirho: string) => sChirho.replace(/'/g, "''");
        const genWordSqlChirho = (wIdChirho: string, glChirho: string, txtChirho: string, lemChirho: string) => `-- ${wIdChirho}: ${txtChirho} (${lemChirho}) → "${glChirho}"
WITH ep AS (INSERT INTO phrase (language_id, created_at) SELECT (SELECT id FROM language WHERE code = '${langCodeChirho}'), NOW() WHERE NOT EXISTS (SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id WHERE pw.word_id = '${wIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${langCodeChirho}') AND p.deleted_at IS NULL) RETURNING id), epw AS (INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '${wIdChirho}' FROM ep ON CONFLICT DO NOTHING) INSERT INTO gloss (phrase_id, gloss, state, updated_at, source) SELECT p.id, '${escChirho(glChirho)}', 'UNAPPROVED', NOW(), 'IMPORT' FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id WHERE pw.word_id = '${wIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${langCodeChirho}') AND p.deleted_at IS NULL ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;\n`;

        let filesGeneratedChirho = 0;
        let combinedSqlChirho = headerChirho + `-- ${bookNameChirho.toUpperCase()} - ${langCodeChirho.toUpperCase()} Combined\n-- Generated: ${new Date().toISOString()}\n\n`;

        for (const [verseNumChirho, wordsChirho] of sortedVersesChirho) {
          wordsChirho.sort((a, b) => a.wordIdChirho.localeCompare(b.wordIdChirho));
          const summaryChirho = wordsChirho.map(w => w.glossChirho).join(' ');

          let verseSqlChirho = headerChirho + `-- ${bookNameChirho.toUpperCase()} v${verseNumChirho} - ${langCodeChirho.toUpperCase()}\n-- ${summaryChirho}\n\nBEGIN;\n`;
          for (const wChirho of wordsChirho) {
            verseSqlChirho += genWordSqlChirho(wChirho.wordIdChirho, wChirho.glossChirho, wChirho.textChirho, wChirho.lemmaIdChirho);
          }
          verseSqlChirho += 'COMMIT;\n';

          writeFileSyncChirho(joinChirho(outDirChirho, `v${String(verseNumChirho).padStart(2, '0')}-chirho.sql`), verseSqlChirho);
          filesGeneratedChirho++;

          combinedSqlChirho += `-- v${verseNumChirho}: ${summaryChirho}\n`;
        }

        combinedSqlChirho += '\n';
        for (const [verseNumChirho, wordsChirho] of sortedVersesChirho) {
          wordsChirho.sort((a, b) => a.wordIdChirho.localeCompare(b.wordIdChirho));
          combinedSqlChirho += `BEGIN;\n`;
          for (const wChirho of wordsChirho) {
            combinedSqlChirho += genWordSqlChirho(wChirho.wordIdChirho, wChirho.glossChirho, wChirho.textChirho, wChirho.lemmaIdChirho);
          }
          combinedSqlChirho += 'COMMIT;\n\n';
        }

        writeFileSyncChirho(joinChirho(outDirChirho, 'all-verses-chirho.sql'), combinedSqlChirho);

        return {
          content: [{
            type: "text",
            text: `✓ Generated ${filesGeneratedChirho} verse files + combined SQL in ${outDirChirho}\nTotal words: ${wordIdsChirho.length}`,
          }],
        };
      }

      case "get_words_for_translation_chirho": {
        const bookRefChirho = argsChirho?.book_chirho as string;
        const chapterChirho = argsChirho?.chapter_chirho as number | undefined;

        let bookIdChirho: number;
        if (/^\d+$/.test(bookRefChirho)) {
          bookIdChirho = parseInt(bookRefChirho);
        } else {
          const bookResultChirho = await queryPgChirho<{id: number}>(`
            SELECT id FROM book WHERE LOWER(name) LIKE ${escSqlChirho(bookRefChirho.toLowerCase() + "%")} LIMIT 1
          `);
          if (bookResultChirho.length === 0) {
            return { content: [{ type: "text", text: `Book not found: ${bookRefChirho}` }] };
          }
          bookIdChirho = bookResultChirho[0].id;
        }

        // Return compact format: just word_id and text
        const wordsChirho = chapterChirho
          ? await queryPgChirho<{id: string; text: string}>(`
              SELECT w.id, w.text FROM verse v JOIN word w ON w.verse_id = v.id
              WHERE v.book_id = ${bookIdChirho} AND v.chapter = ${chapterChirho} ORDER BY w.id`)
          : await queryPgChirho<{id: string; text: string}>(`
              SELECT w.id, w.text FROM verse v JOIN word w ON w.verse_id = v.id
              WHERE v.book_id = ${bookIdChirho} ORDER BY w.id`);

        // Return as minimal key-value pairs for easy copying
        const compactChirho: Record<string, string> = {};
        for (const wChirho of wordsChirho) {
          compactChirho[wChirho.id] = wChirho.text;
        }

        return {
          content: [{ type: "text", text: JSON.stringify(compactChirho) }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (errorChirho) {
    return {
      content: [{ type: "text", text: `Error: ${errorChirho}` }],
      isError: true,
    };
  }
});

// Start server
async function mainChirho() {
  const transportChirho = new StdioServerTransport();
  await serverChirho.connect(transportChirho);
  console.error("Bible Translation MCP Server running...");
}

mainChirho().catch(console.error);
