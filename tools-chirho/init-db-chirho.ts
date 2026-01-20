#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Initialize the SQLite tracking database
 * Run: bun run tools-chirho/init-db-chirho.ts
 */

import { initSqliteChirho, closeSqliteChirho } from "./db-chirho";

console.log("Initializing translation tracking database...");
initSqliteChirho();
closeSqliteChirho();
console.log("✓ Done");
