// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Pure utility functions for Bible data (no DB dependency).
 * DB queries live in the route server files using D1 directly.
 */

// Parse chapter ID (e.g., "01001" -> { bookId: 1, chapter: 1 })
export function parseChapterIdChirho(chapterIdChirho: string): { bookIdChirho: number; chapterChirho: number } {
	const bookIdChirho = parseInt(chapterIdChirho.slice(0, 2), 10);
	const chapterChirho = parseInt(chapterIdChirho.slice(2), 10);
	return { bookIdChirho, chapterChirho };
}

// Parse verse ID (e.g., "01001001" -> { bookId: 1, chapter: 1, verse: 1 })
export function parseVerseIdChirho(verseIdChirho: string): {
	bookIdChirho: number;
	chapterChirho: number;
	verseNumberChirho: number;
} {
	const bookIdChirho = parseInt(verseIdChirho.slice(0, 2), 10);
	const chapterChirho = parseInt(verseIdChirho.slice(2, 5), 10);
	const verseNumberChirho = parseInt(verseIdChirho.slice(5), 10);
	return { bookIdChirho, chapterChirho, verseNumberChirho };
}

// Build chapter ID from book and chapter numbers
export function buildChapterIdChirho(bookIdChirho: number, chapterChirho: number): string {
	return `${bookIdChirho.toString().padStart(2, '0')}${chapterChirho.toString().padStart(3, '0')}`;
}
