// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbChirho, eqChirho, andChirho, queryRawChirho } from '$lib/server/db-chirho';
import {
	footnoteTableChirho,
	translatorNoteTableChirho,
	phraseTableChirho,
	phraseWordTableChirho
} from '$lib/server/schema-chirho/translation-chirho';
import { languageTableChirho } from '$lib/server/schema-chirho/languages-chirho';
import { z as zChirho } from 'zod';

// Validation schemas
const notesQuerySchemaChirho = zChirho.object({
	wordIdChirho: zChirho.string().min(1, 'Word ID is required'),
	languageCodeChirho: zChirho.string().min(2).max(10, 'Invalid language code')
});

const noteCreateSchemaChirho = zChirho.object({
	wordIdChirho: zChirho.string().min(1, 'Word ID is required'),
	languageCodeChirho: zChirho.string().min(2).max(10, 'Invalid language code'),
	contentChirho: zChirho.string().min(1, 'Note content is required').max(5000, 'Note too long'),
	typeChirho: zChirho.enum(['footnote', 'translator_note'], { message: 'Type must be footnote or translator_note' })
});

interface NoteRowChirho {
	phraseId: number;
	authorId: string;
	authorName: string | null;
	timestamp: Date;
	content: string;
	type: 'footnote' | 'translator_note';
}

// GET - Fetch notes for a word/phrase
export const GET: RequestHandler = async ({ url: urlChirho }) => {
	try {
		const wordIdChirho = urlChirho.searchParams.get('wordId');
		const languageCodeChirho = urlChirho.searchParams.get('languageCode');

		// Validate query params with Zod
		const validationChirho = notesQuerySchemaChirho.safeParse({
			wordIdChirho,
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

		// Fetch footnotes and translator notes for this word's phrase
		const notesChirho = await queryRawChirho<NoteRowChirho>(
			`
			SELECT
				f.phrase_id AS "phraseId",
				f.author_id AS "authorId",
				u.name AS "authorName",
				f.timestamp,
				f.content,
				'footnote' AS type
			FROM footnote AS f
			JOIN phrase_word AS pw ON pw.phrase_id = f.phrase_id
			JOIN phrase AS p ON p.id = f.phrase_id
			LEFT JOIN "user" AS u ON u.id = f.author_id
			WHERE pw.word_id = $1
				AND p.language_id = $2
				AND p.deleted_at IS NULL

			UNION ALL

			SELECT
				tn.phrase_id AS "phraseId",
				tn.author_id AS "authorId",
				u.name AS "authorName",
				tn.timestamp,
				tn.content,
				'translator_note' AS type
			FROM translator_note AS tn
			JOIN phrase_word AS pw ON pw.phrase_id = tn.phrase_id
			JOIN phrase AS p ON p.id = tn.phrase_id
			LEFT JOIN "user" AS u ON u.id = tn.author_id
			WHERE pw.word_id = $1
				AND p.language_id = $2
				AND p.deleted_at IS NULL

			ORDER BY timestamp DESC
			`,
			[validationChirho.data.wordIdChirho, languageIdChirho]
		);

		return json({
			notesChirho: notesChirho.map((noteChirho) => ({
				phraseIdChirho: noteChirho.phraseId,
				authorIdChirho: noteChirho.authorId,
				authorNameChirho: noteChirho.authorName,
				timestampChirho: noteChirho.timestamp,
				contentChirho: noteChirho.content,
				typeChirho: noteChirho.type
			}))
		});
	} catch (errorChirho) {
		console.error('Error fetching notes:', errorChirho);
		return json({ errorChirho: 'Failed to fetch notes' }, { status: 500 });
	}
};

// POST - Create a new note
export const POST: RequestHandler = async ({ request: requestChirho, locals: localsChirho }) => {
	// Check authentication
	const sessionChirho = localsChirho.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		return json({ errorChirho: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formDataChirho = await requestChirho.formData();

		// Validate with Zod
		const validationChirho = noteCreateSchemaChirho.safeParse({
			wordIdChirho: formDataChirho.get('wordId'),
			languageCodeChirho: formDataChirho.get('languageCode'),
			contentChirho: formDataChirho.get('content'),
			typeChirho: formDataChirho.get('type')
		});

		if (!validationChirho.success) {
			const errorsChirho = validationChirho.error.issues.map((eChirho: { message: string }) => eChirho.message).join(', ');
			return json({ errorChirho: errorsChirho }, { status: 400 });
		}

		const { wordIdChirho, languageCodeChirho, contentChirho, typeChirho } = validationChirho.data;

		// Get language
		const languageChirho = await dbChirho
			.select({ idChirho: languageTableChirho.idChirho })
			.from(languageTableChirho)
			.where(eqChirho(languageTableChirho.codeChirho, languageCodeChirho))
			.limit(1);

		if (languageChirho.length === 0) {
			return json({ errorChirho: 'Language not found' }, { status: 404 });
		}

		const languageIdChirho = languageChirho[0].idChirho;

		// Find or create phrase for this word
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
					eqChirho(phraseTableChirho.languageIdChirho, languageIdChirho)
				)
			)
			.limit(1);

		let phraseIdChirho: number;

		if (existingPhraseChirho.length > 0) {
			phraseIdChirho = existingPhraseChirho[0].phraseIdChirho;
		} else {
			// Create new phrase
			const newPhraseChirho = await dbChirho
				.insert(phraseTableChirho)
				.values({
					languageIdChirho: languageIdChirho,
					createdAtChirho: new Date(),
					createdByChirho: sessionChirho.userIdChirho
				})
				.returning({ idChirho: phraseTableChirho.idChirho });

			phraseIdChirho = newPhraseChirho[0].idChirho;

			// Link phrase to word
			await dbChirho.insert(phraseWordTableChirho).values({
				phraseIdChirho: phraseIdChirho,
				wordIdChirho: wordIdChirho
			});
		}

		// Insert the note
		const nowChirho = new Date();

		if (typeChirho === 'footnote') {
			await dbChirho.insert(footnoteTableChirho).values({
				phraseIdChirho: phraseIdChirho,
				authorIdChirho: sessionChirho.userIdChirho,
				timestampChirho: nowChirho,
				contentChirho: contentChirho
			});
		} else {
			await dbChirho.insert(translatorNoteTableChirho).values({
				phraseIdChirho: phraseIdChirho,
				authorIdChirho: sessionChirho.userIdChirho,
				timestampChirho: nowChirho,
				contentChirho: contentChirho
			});
		}

		return json({
			successChirho: true,
			noteChirho: {
				phraseIdChirho: phraseIdChirho,
				authorIdChirho: sessionChirho.userIdChirho,
				timestampChirho: nowChirho,
				contentChirho: contentChirho,
				typeChirho: typeChirho
			}
		});
	} catch (errorChirho) {
		console.error('Error creating note:', errorChirho);
		return json({ errorChirho: 'Failed to create note' }, { status: 500 });
	}
};
