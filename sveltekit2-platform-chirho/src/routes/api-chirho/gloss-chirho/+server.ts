// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbChirho } from '$lib/server/db-chirho';
import { glossTableChirho } from '$lib/server/schema-chirho/translation-chirho';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	const sessionChirho = locals.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		return json({ errorChirho: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formDataChirho = await request.formData();

		const verseIdChirho = formDataChirho.get('verseId') as string;
		const languageCodeChirho = formDataChirho.get('languageCode') as string;
		const phraseIdChirho = parseInt(formDataChirho.get('phraseId') as string, 10);
		const stateChirho = formDataChirho.get('state') as 'APPROVED' | 'UNAPPROVED';
		const glossChirho = formDataChirho.get('gloss') as string;
		const methodRawChirho = formDataChirho.get('method') as string;
		const methodChirho: 'USER' | 'IMPORT' = methodRawChirho === 'IMPORT' ? 'IMPORT' : 'USER';

		if (!verseIdChirho || !languageCodeChirho || isNaN(phraseIdChirho)) {
			return json({ errorChirho: 'Missing required fields' }, { status: 400 });
		}

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
