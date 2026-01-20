// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface ErrorChirho {
			messageChirho: string;
			codeChirho?: string;
		}
		interface Locals {
			sessionChirho: import('$lib/server/session-chirho').SessionChirho | null;
			userChirho: import('$lib/server/schema-chirho').UserChirho | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
