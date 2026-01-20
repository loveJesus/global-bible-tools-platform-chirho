// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbChirho, eqChirho, andChirho } from '$lib/server/db-chirho';
import {
	glossTableChirho,
	phraseTableChirho,
	phraseWordTableChirho,
	glossHistoryTableChirho
} from '$lib/server/schema-chirho/translation-chirho';
import { languageTableChirho } from '$lib/server/schema-chirho/languages-chirho';
import { z as zChirho } from 'zod';

// Validation schema - accepts wordId for creating new phrases
const glossSaveSchemaChirho = zChirho.object({
	wordIdChirho: zChirho.string().min(1, 'Word ID is required'),
	languageCodeChirho: zChirho.string().min(2).max(10, 'Invalid language code'),
	phraseIdChirho: zChirho.coerce.number().int().nonnegative().optional(),
	stateChirho: zChirho.enum(['APPROVED', 'UNAPPROVED']),
	glossChirho: zChirho.string().max(500, 'Gloss too long')
});

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	const sessionChirho = locals.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		return json({ errorChirho: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formDataChirho = await request.formData();

		// Parse form data
		const rawDataChirho: Record<string, unknown> = {};
		formDataChirho.forEach((valueChirho, keyChirho) => {
			rawDataChirho[keyChirho + 'Chirho'] = valueChirho;
		});

		// Validate
		const validationChirho = glossSaveSchemaChirho.safeParse(rawDataChirho);
		if (!validationChirho.success) {
			const errorsChirho = validationChirho.error.issues
				.map((issueChirho) => issueChirho.message)
				.join(', ');
			return json({ errorChirho: errorsChirho }, { status: 400 });
		}

		const { wordIdChirho, languageCodeChirho, phraseIdChirho, stateChirho, glossChirho } =
			validationChirho.data;

		// Get language
		const languageResultChirho = await dbChirho
			.select()
			.from(languageTableChirho)
			.where(eqChirho(languageTableChirho.codeChirho, languageCodeChirho))
			.limit(1);

		const languageChirho = languageResultChirho[0];
		if (!languageChirho) {
			return json({ errorChirho: 'Language not found' }, { status: 404 });
		}

		let actualPhraseIdChirho = phraseIdChirho;

		// If no phrase ID or phrase ID is 0, find or create phrase for this word
		if (!actualPhraseIdChirho || actualPhraseIdChirho === 0) {
			// Check if phrase already exists for this word+language
			const existingPhraseChirho = await dbChirho
				.select({ phraseIdChirho: phraseWordTableChirho.phraseIdChirho })
				.from(phraseWordTableChirho)
				.innerJoin(
					phraseTableChirho,
					eqChirho(phraseWordTableChirho.phraseIdChirho, phraseTableChirho.idChirho)
				)
				.where(
					andChirho(
						eqChirho(phraseWordTableChirho.wordIdChirho, wordIdChirho),
						eqChirho(phraseTableChirho.languageIdChirho, languageChirho.idChirho)
					)
				)
				.limit(1);

			if (existingPhraseChirho.length > 0) {
				actualPhraseIdChirho = existingPhraseChirho[0].phraseIdChirho;
			} else {
				// Create new phrase
				const newPhraseChirho = await dbChirho
					.insert(phraseTableChirho)
					.values({
						languageIdChirho: languageChirho.idChirho,
						createdAtChirho: new Date(),
						createdByChirho: sessionChirho.userIdChirho
					})
					.returning({ idChirho: phraseTableChirho.idChirho });

				actualPhraseIdChirho = newPhraseChirho[0].idChirho;

				// Link phrase to word
				await dbChirho.insert(phraseWordTableChirho).values({
					phraseIdChirho: actualPhraseIdChirho,
					wordIdChirho: wordIdChirho
				});
			}
		}

		// Update or insert gloss
		const resultChirho = await dbChirho
			.insert(glossTableChirho)
			.values({
				phraseIdChirho: actualPhraseIdChirho,
				glossChirho: glossChirho || null,
				stateChirho: stateChirho,
				updatedAtChirho: new Date(),
				updatedByChirho: sessionChirho.userIdChirho,
				sourceChirho: 'USER'
			})
			.onConflictDoUpdate({
				target: glossTableChirho.phraseIdChirho,
				set: {
					glossChirho: glossChirho || null,
					stateChirho: stateChirho,
					updatedAtChirho: new Date(),
					updatedByChirho: sessionChirho.userIdChirho,
					sourceChirho: 'USER'
				}
			})
			.returning();

		// Add to history
		await dbChirho.insert(glossHistoryTableChirho).values({
			phraseIdChirho: actualPhraseIdChirho,
			updatedAtChirho: new Date(),
			updatedByChirho: sessionChirho.userIdChirho,
			glossChirho: glossChirho || null,
			stateChirho: stateChirho,
			sourceChirho: 'USER'
		});

		return json({
			successChirho: true,
			phraseIdChirho: actualPhraseIdChirho,
			glossChirho: resultChirho[0]
		});
	} catch (errorChirho) {
		console.error('Error saving gloss:', errorChirho);
		return json({ errorChirho: 'Failed to save gloss' }, { status: 500 });
	}
};
