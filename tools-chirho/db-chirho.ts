// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Database connections for translation tools
 * - PostgreSQL: Main Bible/translation database via Docker (read-only for tools)
 * - SQLite: Local tracking database for translation decisions
 *
 * IMPORTANT: PostgreSQL runs inside Docker. We use docker exec to avoid
 * conflicts with any local PostgreSQL installation on the host machine.
 */

import { Database } from "bun:sqlite";
import postgres from "postgres";
import { join } from "path";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { $ } from "bun";

// =============================================================================
// PostgreSQL Connection (Bible Database via Docker)
// =============================================================================

// SvelteKit platform is now the primary dev environment
const DOCKER_CONTAINER_CHIRHO =
  process.env.DOCKER_CONTAINER_CHIRHO ?? "sveltekit2-platform-chirho-db-chirho-1";

const DATABASE_URL_CHIRHO =
  process.env.DATABASE_URL_CHIRHO ??
  "postgresql://postgres:asdfasdf@localhost:5435/postgres";

let pgClientChirho: ReturnType<typeof postgres> | null = null;
let useDockerExecChirho = false;

/**
 * Execute a SQL query via docker exec (fallback when direct connection fails)
 */
async function dockerExecQueryChirho(queryChirho: string): Promise<unknown[]> {
  const resultChirho = await $`docker exec ${DOCKER_CONTAINER_CHIRHO} psql -U postgres -t -A -F '	' -c ${queryChirho}`.text();
  const linesChirho = resultChirho.trim().split('\n').filter((lineChirho: string) => lineChirho.length > 0);
  return linesChirho;
}

/**
 * Execute a SQL query and parse JSON result via docker exec
 */
export async function dockerExecJsonQueryChirho(queryChirho: string): Promise<unknown[]> {
  // Wrap query to return JSON
  const jsonQueryChirho = `SELECT json_agg(t) FROM (${queryChirho}) t`;
  const resultChirho = await $`docker exec ${DOCKER_CONTAINER_CHIRHO} psql -U postgres -t -A -c ${jsonQueryChirho}`.text();
  const trimmedChirho = resultChirho.trim();
  if (!trimmedChirho || trimmedChirho === '' || trimmedChirho === 'null') {
    return [];
  }
  return JSON.parse(trimmedChirho) || [];
}

/**
 * Get PostgreSQL connection to the Bible database
 * Falls back to docker exec if direct connection fails
 */
export function getPgChirho(): ReturnType<typeof postgres> {
  if (!pgClientChirho) {
    pgClientChirho = postgres(DATABASE_URL_CHIRHO, {
      max: 5,
      idle_timeout: 30,
      connect_timeout: 5,
    });
  }
  return pgClientChirho;
}

/**
 * Test database connection and switch to docker exec if needed
 */
export async function initPgConnectionChirho(): Promise<void> {
  try {
    const pgChirho = getPgChirho();
    await pgChirho`SELECT 1`;
    useDockerExecChirho = false;
    console.error("✓ PostgreSQL: Direct connection");
  } catch (errChirho) {
    console.error("⚠ PostgreSQL: Direct connection failed, using docker exec");
    useDockerExecChirho = true;
    // Verify docker exec works
    try {
      await dockerExecQueryChirho("SELECT 1");
      console.error("✓ PostgreSQL: Docker exec connection");
    } catch (dockerErrChirho) {
      console.error("✗ PostgreSQL: Both connection methods failed");
      console.error("  Ensure Docker is running: cd nextjs-platform-chirho && docker compose up -d");
      throw new Error("Cannot connect to PostgreSQL database");
    }
  }
}

/**
 * Check if we should use docker exec for queries
 */
export function shouldUseDockerExecChirho(): boolean {
  return useDockerExecChirho;
}

/**
 * Close PostgreSQL connection
 */
export async function closePgChirho(): Promise<void> {
  if (pgClientChirho) {
    await pgClientChirho.end();
    pgClientChirho = null;
  }
}

// =============================================================================
// SQLite Connection (Tracking Database)
// =============================================================================

const SQLITE_PATH_CHIRHO =
  process.env.SQLITE_PATH_CHIRHO ??
  join(import.meta.dir, "..", "data-chirho", "translation-tracking-chirho.db");

let sqliteDbChirho: Database | null = null;

/**
 * Get SQLite connection to the tracking database
 */
export function getSqliteChirho(): Database {
  if (!sqliteDbChirho) {
    // Ensure data directory exists
    const dataDirChirho = join(import.meta.dir, "..", "data-chirho");
    if (!existsSync(dataDirChirho)) {
      mkdirSync(dataDirChirho, { recursive: true });
    }

    sqliteDbChirho = new Database(SQLITE_PATH_CHIRHO, { create: true });
    sqliteDbChirho.exec("PRAGMA journal_mode = WAL");
    sqliteDbChirho.exec("PRAGMA foreign_keys = ON");
  }
  return sqliteDbChirho;
}

/**
 * Initialize SQLite database with schema
 */
export function initSqliteChirho(): void {
  const dbChirho = getSqliteChirho();
  const schemaPathChirho = join(import.meta.dir, "schema-chirho.sql");
  const schemaChirho = readFileSync(schemaPathChirho, "utf-8");
  dbChirho.exec(schemaChirho);
  console.log("✓ SQLite database initialized");
}

/**
 * Close SQLite connection
 */
export function closeSqliteChirho(): void {
  if (sqliteDbChirho) {
    sqliteDbChirho.close();
    sqliteDbChirho = null;
  }
}

// =============================================================================
// Type Definitions
// =============================================================================

export interface WordInfoChirho {
  wordIdChirho: string;
  textChirho: string;
  verseIdChirho: string;
  formIdChirho: string;
  grammarChirho: string;
  lemmaIdChirho: string;
}

export interface LemmaInfoChirho {
  lemmaIdChirho: string;
  formsChirho: Array<{
    formIdChirho: string;
    grammarChirho: string;
    wordCountChirho: number;
  }>;
  resourcesChirho: Array<{
    resourceCodeChirho: string;
    contentChirho: string;
  }>;
}

export interface VerseInfoChirho {
  verseIdChirho: string;
  bookNameChirho: string;
  chapterChirho: number;
  verseNumberChirho: number;
  wordsChirho: Array<{
    wordIdChirho: string;
    textChirho: string;
    lemmaIdChirho: string;
    grammarChirho: string;
    glossChirho: string | null;
    glossStateChirho: string | null;
  }>;
}

export interface LemmaDecisionChirho {
  lemmaIdChirho: string;
  primaryGlossChirho: string;
  semanticDomainChirho: string | null;
  notesChirho: string | null;
  isPolysemousChirho: boolean;
}

export interface ConsistencyIssueChirho {
  lemmaIdChirho: string;
  issueTypeChirho: string;
  descriptionChirho: string;
  glossVariantsChirho: string[];
  countChirho: number;
}

// =============================================================================
// Cleanup on exit
// =============================================================================

process.on("exit", () => {
  closeSqliteChirho();
});

process.on("SIGINT", async () => {
  await closePgChirho();
  closeSqliteChirho();
  process.exit(0);
});
