// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbChirho } from '$lib/server/db-chirho';
import { phraseTableChirho, phraseWordTableChirho } from '$lib/server/schema-chirho/translation-chirho';
import { languageTableChirho } from '$lib/server/schema-chirho/languages-chirho';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	const sessionChirho = locals.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		return json({ errorChirho: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formDataChirho = await request.formData();

		const wordIdsJsonChirho = formDataChirho.get('wordIds') as string;
		const languageCodeChirho = formDataChirho.get('languageCode') as string;

		if (!wordIdsJsonChirho || !languageCodeChirho) {
			return json({ errorChirho: 'Missing required fields' }, { status: 400 });
		}

		const wordIdsChirho: string[] = JSON.parse(wordIdsJsonChirho);

		if (wordIdsChirho.length < 2) {
			return json({ errorChirho: 'Need at least 2 words to create a phrase' }, { status: 400 });
		}

		// Get language ID
		const languageChirho = await dbChirho
			.select({ idChirho: languageTableChirho.idChirho })
			.from(languageTableChirho)
			.where(eq(languageTableChirho.codeChirho, languageCodeChirho))
			.limit(1);

		if (languageChirho.length === 0) {
			return json({ errorChirho: 'Language not found' }, { status: 404 });
		}

		const languageIdChirho = languageChirho[0].idChirho;

		// Create new phrase
		const newPhraseChirho = await dbChirho
			.insert(phraseTableChirho)
			.values({
				languageIdChirho: languageIdChirho,
				createdAtChirho: new Date(),
				createdByChirho: sessionChirho.userIdChirho
			})
			.returning();

		const phraseIdChirho = newPhraseChirho[0].idChirho;

		// Link words to phrase
		await dbChirho.insert(phraseWordTableChirho).values(
			wordIdsChirho.map((wordIdChirho) => ({
				phraseIdChirho: phraseIdChirho,
				wordIdChirho: wordIdChirho
			}))
		);

		return json({
			successChirho: true,
			phraseIdChirho: phraseIdChirho,
			wordCountChirho: wordIdsChirho.length
		});
	} catch (errorChirho) {
		console.error('Error creating phrase:', errorChirho);
		return json({ errorChirho: 'Failed to create phrase' }, { status: 500 });
	}
};

// DELETE endpoint to unlink phrase
export const DELETE: RequestHandler = async ({ request, locals }) => {
	const sessionChirho = locals.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		return json({ errorChirho: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formDataChirho = await request.formData();
		const phraseIdChirho = parseInt(formDataChirho.get('phraseId') as string, 10);

		if (isNaN(phraseIdChirho)) {
			return json({ errorChirho: 'Invalid phrase ID' }, { status: 400 });
		}

		// Delete phrase words first
		await dbChirho
			.delete(phraseWordTableChirho)
			.where(eq(phraseWordTableChirho.phraseIdChirho, phraseIdChirho));

		// Delete phrase
		await dbChirho.delete(phraseTableChirho).where(eq(phraseTableChirho.idChirho, phraseIdChirho));

		return json({ successChirho: true });
	} catch (errorChirho) {
		console.error('Error deleting phrase:', errorChirho);
		return json({ errorChirho: 'Failed to delete phrase' }, { status: 500 });
	}
};
