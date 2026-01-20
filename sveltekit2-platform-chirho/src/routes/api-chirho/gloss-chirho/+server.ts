// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbChirho } from '$lib/server/db-chirho';
import { glossTableChirho } from '$lib/server/schema-chirho/translation-chirho';
import { glossUpdateSchemaChirho, validateFormDataChirho } from '$lib/server/validation-chirho';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	const sessionChirho = locals.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		return json({ errorChirho: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formDataChirho = await request.formData();

		// Validate input with Zod
		const validationChirho = validateFormDataChirho(glossUpdateSchemaChirho, formDataChirho);
		if (!validationChirho.successChirho) {
			return json({ errorChirho: validationChirho.errorChirho }, { status: 400 });
		}

		const { verseIdChirho, languageCodeChirho, phraseIdChirho, stateChirho, glossChirho, methodChirho } = validationChirho.dataChirho;

		// Update or insert gloss
		const resultChirho = await dbChirho
			.insert(glossTableChirho)
			.values({
				phraseIdChirho: phraseIdChirho,
				glossChirho: glossChirho,
				stateChirho: stateChirho,
				updatedAtChirho: new Date(),
				updatedByChirho: sessionChirho.userIdChirho,
				sourceChirho: methodChirho
			})
			.onConflictDoUpdate({
				target: glossTableChirho.phraseIdChirho,
				set: {
					glossChirho: glossChirho,
					stateChirho: stateChirho,
					updatedAtChirho: new Date(),
					updatedByChirho: sessionChirho.userIdChirho,
					sourceChirho: methodChirho
				}
			})
			.returning();

		return json({
			successChirho: true,
			glossChirho: resultChirho[0]
		});
	} catch (errorChirho) {
		console.error('Error saving gloss:', errorChirho);
		return json({ errorChirho: 'Failed to save gloss' }, { status: 500 });
	}
};
