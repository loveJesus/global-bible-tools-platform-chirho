// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Filter out PUA (Private Use Area) characters from text.
 * PUA characters are in the Unicode range U+E000 to U+F8FF.
 * These are sometimes used in specialized linguistic fonts but don't render
 * properly in standard fonts, causing display issues.
 *
 * @param textChirho - The text to filter, or null/undefined
 * @returns The filtered text with PUA characters removed, or empty string if input is null/undefined
 */
export function filterPuaChirho(textChirho: string | null | undefined): string {
	if (!textChirho) return '';
	// eslint-disable-next-line no-control-regex
	return textChirho.replace(/[\uE000-\uF8FF]/g, '');
}

/**
 * Format gloss text with optional n-dash removal and PUA filtering.
 *
 * @param glossChirho - The gloss text to format
 * @param removeNdashChirho - Whether to replace n-dashes with spaces
 * @returns Formatted gloss text, or em-dash if input is empty
 */
export function formatGlossChirho(
	glossChirho: string | null | undefined,
	removeNdashChirho: boolean = false
): string {
	if (!glossChirho) return '—';
	const filteredChirho = filterPuaChirho(glossChirho);
	if (removeNdashChirho) {
		return filteredChirho.replace(/–/g, ' ').replace(/\s+/g, ' ').trim();
	}
	return filteredChirho;
}
