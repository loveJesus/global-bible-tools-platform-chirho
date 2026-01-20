// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbChirho, eqChirho } from '$lib/server/db-chirho';
import { phraseTableChirho, phraseWordTableChirho } from '$lib/server/schema-chirho/translation-chirho';
import { languageTableChirho } from '$lib/server/schema-chirho/languages-chirho';
import { z as zChirho } from 'zod';

// Validation schemas
const phraseCreateSchemaChirho = zChirho.object({
	wordIdsChirho: zChirho.array(zChirho.string().min(1)).min(2, 'Need at least 2 words to create a phrase'),
	languageCodeChirho: zChirho.string().min(2).max(10, 'Invalid language code')
});

const phraseDeleteSchemaChirho = zChirho.object({
	phraseIdChirho: zChirho.coerce.number().int().positive('Invalid phrase ID')
});

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	const sessionChirho = locals.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		return json({ errorChirho: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formDataChirho = await request.formData();

		// Parse word IDs from JSON
		let wordIdsChirho: string[];
		try {
			const wordIdsJsonChirho = formDataChirho.get('wordIds') as string;
			wordIdsChirho = JSON.parse(wordIdsJsonChirho);
		} catch {
			return json({ errorChirho: 'Invalid wordIds JSON format' }, { status: 400 });
		}

		const languageCodeChirho = formDataChirho.get('languageCode') as string;

		// Validate with Zod
		const validationChirho = phraseCreateSchemaChirho.safeParse({
			wordIdsChirho,
			languageCodeChirho
		});

		if (!validationChirho.success) {
			const errorsChirho = validationChirho.error.issues.map((eChirho: { message: string }) => eChirho.message).join(', ');
			return json({ errorChirho: errorsChirho }, { status: 400 });
		}

		// Get language ID
		const languageChirho = await dbChirho
			.select({ idChirho: languageTableChirho.idChirho })
			.from(languageTableChirho)
			.where(eqChirho(languageTableChirho.codeChirho, validationChirho.data.languageCodeChirho))
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
			validationChirho.data.wordIdsChirho.map((wordIdChirho) => ({
				phraseIdChirho: phraseIdChirho,
				wordIdChirho: wordIdChirho
			}))
		);

		return json({
			successChirho: true,
			phraseIdChirho: phraseIdChirho,
			wordCountChirho: validationChirho.data.wordIdsChirho.length
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
		const phraseIdRawChirho = formDataChirho.get('phraseId') as string;

		// Validate with Zod
		const validationChirho = phraseDeleteSchemaChirho.safeParse({
			phraseIdChirho: phraseIdRawChirho
		});

		if (!validationChirho.success) {
			const errorsChirho = validationChirho.error.issues.map((eChirho: { message: string }) => eChirho.message).join(', ');
			return json({ errorChirho: errorsChirho }, { status: 400 });
		}

		const phraseIdChirho = validationChirho.data.phraseIdChirho;

		// Delete phrase words first
		await dbChirho
			.delete(phraseWordTableChirho)
			.where(eqChirho(phraseWordTableChirho.phraseIdChirho, phraseIdChirho));

		// Delete phrase
		await dbChirho.delete(phraseTableChirho).where(eqChirho(phraseTableChirho.idChirho, phraseIdChirho));

		return json({ successChirho: true });
	} catch (errorChirho) {
		console.error('Error deleting phrase:', errorChirho);
		return json({ errorChirho: 'Failed to delete phrase' }, { status: 500 });
	}
};
