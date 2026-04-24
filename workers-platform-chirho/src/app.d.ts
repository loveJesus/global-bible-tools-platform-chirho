// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Error {
			message: string;
			messageChirho?: string;
			codeChirho?: string;
		}
		interface Locals {
			localeChirho: string;
		}
		interface Platform {
			env: {
				DB_META_CHIRHO: D1Database;
				// Per-language D1 databases — binding name pattern: DB_LANG_<CODE>_CHIRHO
				[key: string]: D1Database | undefined;
			};
			context: ExecutionContext;
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
