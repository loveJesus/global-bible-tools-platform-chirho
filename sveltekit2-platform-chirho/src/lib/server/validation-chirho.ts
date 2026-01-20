// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { z as zChirho } from 'zod';

/**
 * Common validation schemas for API endpoints
 */

// Gloss update validation
export const glossUpdateSchemaChirho = zChirho.object({
	verseIdChirho: zChirho.string().min(1, 'Verse ID is required'),
	languageCodeChirho: zChirho.string().min(2).max(10, 'Invalid language code'),
	phraseIdChirho: zChirho.coerce.number().int().positive('Invalid phrase ID'),
	stateChirho: zChirho.enum(['APPROVED', 'UNAPPROVED']),
	glossChirho: zChirho.string().max(500, 'Gloss too long'),
	methodChirho: zChirho.enum(['USER', 'IMPORT']).optional().default('USER')
});

// Phrase creation validation
export const phraseCreateSchemaChirho = zChirho.object({
	wordIdsChirho: zChirho.array(zChirho.string().min(1)).min(2, 'Need at least 2 words'),
	languageCodeChirho: zChirho.string().min(2).max(10, 'Invalid language code')
});

// Phrase deletion validation
export const phraseDeleteSchemaChirho = zChirho.object({
	phraseIdChirho: zChirho.coerce.number().int().positive('Invalid phrase ID')
});

// Note creation validation
export const noteCreateSchemaChirho = zChirho.object({
	wordIdChirho: zChirho.string().min(1, 'Word ID is required'),
	languageCodeChirho: zChirho.string().min(2).max(10, 'Invalid language code'),
	contentChirho: zChirho.string().min(1, 'Note content is required').max(5000, 'Note too long'),
	typeChirho: zChirho.enum(['footnote', 'translator_note'])
});

// Word detail query validation
export const wordDetailQuerySchemaChirho = zChirho.object({
	wordIdChirho: zChirho.string().min(1, 'Word ID is required'),
	languageCodeChirho: zChirho.string().optional()
});

// Notes query validation
export const notesQuerySchemaChirho = zChirho.object({
	wordIdChirho: zChirho.string().min(1, 'Word ID is required'),
	languageCodeChirho: zChirho.string().min(2).max(10, 'Invalid language code')
});

// Language update validation
export const languageUpdateSchemaChirho = zChirho.object({
	idChirho: zChirho.coerce.number().int().positive('Invalid language ID'),
	nameChirho: zChirho.string().min(1, 'Name is required').max(100),
	fontChirho: zChirho.string().max(100).optional(),
	textDirectionChirho: zChirho.enum(['ltr', 'rtl']).optional().default('ltr')
});

// Language creation validation
export const languageCreateSchemaChirho = zChirho.object({
	codeChirho: zChirho.string().min(2).max(10).regex(/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/, 'Invalid language code format'),
	nameChirho: zChirho.string().min(1, 'Name is required').max(100),
	fontChirho: zChirho.string().max(100).optional().default('Noto Sans'),
	textDirectionChirho: zChirho.enum(['ltr', 'rtl']).optional().default('ltr')
});

// User profile update validation
export const profileUpdateSchemaChirho = zChirho.object({
	nameChirho: zChirho.string().min(1, 'Name is required').max(100)
});

/**
 * Helper to validate form data against a schema
 */
export function validateFormDataChirho<TChirho>(
	schemaChirho: zChirho.ZodType<TChirho>,
	formDataChirho: FormData
): { successChirho: true; dataChirho: TChirho } | { successChirho: false; errorChirho: string } {
	const objChirho: Record<string, unknown> = {};

	formDataChirho.forEach((valueChirho, keyChirho) => {
		// Handle array fields (e.g., wordIds)
		if (keyChirho.endsWith('[]') || keyChirho === 'wordIds') {
			const cleanKeyChirho = keyChirho.replace('[]', '');
			try {
				// Try to parse as JSON array
				objChirho[cleanKeyChirho + 'Chirho'] = JSON.parse(valueChirho as string);
			} catch {
				// If not JSON, collect as array
				if (!objChirho[cleanKeyChirho + 'Chirho']) {
					objChirho[cleanKeyChirho + 'Chirho'] = [];
				}
				(objChirho[cleanKeyChirho + 'Chirho'] as unknown[]).push(valueChirho);
			}
		} else {
			// Map form field names to Chirho suffix versions
			objChirho[keyChirho + 'Chirho'] = valueChirho;
		}
	});

	const resultChirho = schemaChirho.safeParse(objChirho);

	if (resultChirho.success) {
		return { successChirho: true, dataChirho: resultChirho.data };
	}

	const errorsChirho = resultChirho.error.issues.map((issueChirho: { message: string }) => issueChirho.message).join(', ');
	return { successChirho: false, errorChirho: errorsChirho };
}

/**
 * Helper to validate URL search params
 */
export function validateSearchParamsChirho<TChirho>(
	schemaChirho: zChirho.ZodType<TChirho>,
	searchParamsChirho: URLSearchParams
): { successChirho: true; dataChirho: TChirho } | { successChirho: false; errorChirho: string } {
	const objChirho: Record<string, string | null> = {};

	searchParamsChirho.forEach((valueChirho, keyChirho) => {
		objChirho[keyChirho + 'Chirho'] = valueChirho;
	});

	const resultChirho = schemaChirho.safeParse(objChirho);

	if (resultChirho.success) {
		return { successChirho: true, dataChirho: resultChirho.data };
	}

	const errorsChirho = resultChirho.error.issues.map((issueChirho: { message: string }) => issueChirho.message).join(', ');
	return { successChirho: false, errorChirho: errorsChirho };
}
