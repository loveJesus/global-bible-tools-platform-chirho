// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { dbChirho, eqChirho, andChirho, sqlChirho, queryRawChirho } from '$lib/server/db-chirho';
import {
	languageTableChirho,
	bookTableChirho,
	verseTableChirho,
	wordTableChirho,
	phraseWordTableChirho,
	phraseTableChirho,
	glossTableChirho,
	glossHistoryTableChirho,
	lemmaFormTableChirho
} from '$lib/server/schema-chirho';
import { error as errorChirho, fail as failChirho } from '@sveltejs/kit';
import { parseVerseIdChirho } from '$lib/modules-chirho/bible-core-chirho/queries-chirho';

// NOTE: Raw SQL queries reference upstream database tables (word, phrase, gloss, etc.)
// which don't have Chirho suffix - they're from the nextjs-platform-chirho schema.

interface WordWithGlossRowChirho {
	wordId: string;
	text: string;
	formId: string | null;
	lemmaId: string | null;
	grammar: string | null;
	phraseId: number | null;
	gloss: string | null;
	state: string | null;
}

export const load: PageServerLoadChirho = async ({ params: paramsChirho, locals: localsChirho }) => {
	const codeChirho = paramsChirho.code_chirho;
	const verseIdChirho = paramsChirho.verse_id_chirho;
	const userChirho = localsChirho.userChirho;

	// Parse verse ID
	const { bookIdChirho, chapterChirho, verseNumberChirho } = parseVerseIdChirho(verseIdChirho);

	// Get language
	const languageResultChirho = await dbChirho
		.select()
		.from(languageTableChirho)
		.where(eqChirho(languageTableChirho.codeChirho, codeChirho))
		.limit(1);

	const languageChirho = languageResultChirho[0];
	if (!languageChirho) {
		throw errorChirho(404, `Language '${codeChirho}' not found`);
	}

	// Get book
	const bookResultChirho = await dbChirho
		.select()
		.from(bookTableChirho)
		.where(eqChirho(bookTableChirho.idChirho, bookIdChirho))
		.limit(1);

	const bookChirho = bookResultChirho[0];
	if (!bookChirho) {
		throw errorChirho(404, `Book not found`);
	}

	// Get verse
	const verseResultChirho = await dbChirho
		.select()
		.from(verseTableChirho)
		.where(eqChirho(verseTableChirho.idChirho, verseIdChirho))
		.limit(1);

	const verseChirho = verseResultChirho[0];
	if (!verseChirho) {
		throw errorChirho(404, `Verse not found`);
	}

	// Get words with glosses - using raw SQL with lateral join to avoid duplicates
	// when a word has phrases in multiple languages
	const wordsResultChirho = await queryRawChirho<WordWithGlossRowChirho>(
		`
		SELECT
			w.id AS "wordId",
			w.text,
			w.form_id AS "formId",
			lf.lemma_id AS "lemmaId",
			lf.grammar,
			ph.phrase_id AS "phraseId",
			ph.gloss,
			ph.state
		FROM word AS w
		LEFT JOIN lemma_form AS lf ON lf.id = w.form_id
		LEFT JOIN LATERAL (
			SELECT p.id AS phrase_id, g.gloss, g.state
			FROM phrase_word AS pw
			JOIN phrase AS p ON p.id = pw.phrase_id
			LEFT JOIN gloss AS g ON g.phrase_id = p.id
			WHERE pw.word_id = w.id
				AND p.language_id = $2
				AND p.deleted_at IS NULL
			LIMIT 1
		) AS ph ON true
		WHERE w.verse_id = $1
		ORDER BY w.id
		`,
		[verseIdChirho, languageChirho.idChirho]
	);

	const wordsChirho = wordsResultChirho.map((rowChirho) => ({
		wordIdChirho: rowChirho.wordId,
		textChirho: rowChirho.text,
		formIdChirho: rowChirho.formId,
		lemmaIdChirho: rowChirho.lemmaId,
		grammarChirho: rowChirho.grammar,
		phraseIdChirho: rowChirho.phraseId,
		glossChirho: rowChirho.gloss,
		stateChirho: rowChirho.state
	}));

	// Calculate prev/next verse IDs
	const prevVerseChirho = await dbChirho
		.select()
		.from(verseTableChirho)
		.where(
			andChirho(
				eqChirho(verseTableChirho.bookIdChirho, bookIdChirho),
				eqChirho(verseTableChirho.chapterChirho, chapterChirho),
				sqlChirho`${verseTableChirho.numberChirho} < ${verseNumberChirho}`
			)
		)
		.orderBy(sqlChirho`${verseTableChirho.numberChirho} DESC`)
		.limit(1);

	const nextVerseChirho = await dbChirho
		.select()
		.from(verseTableChirho)
		.where(
			andChirho(
				eqChirho(verseTableChirho.bookIdChirho, bookIdChirho),
				eqChirho(verseTableChirho.chapterChirho, chapterChirho),
				sqlChirho`${verseTableChirho.numberChirho} > ${verseNumberChirho}`
			)
		)
		.orderBy(verseTableChirho.numberChirho)
		.limit(1);

	return {
		userChirho: userChirho ? {
			idChirho: userChirho.idChirho,
			nameChirho: userChirho.nameChirho,
			emailChirho: userChirho.emailChirho
		} : null,
		codeChirho,
		languageChirho,
		bookChirho,
		chapterChirho,
		verseNumberChirho,
		verseIdChirho,
		wordsChirho,
		prevVerseIdChirho: prevVerseChirho[0]?.idChirho ?? null,
		nextVerseIdChirho: nextVerseChirho[0]?.idChirho ?? null
	};
};

export const actions: ActionsChirho = {
	updateGlossChirho: async ({ request: requestChirho, params: paramsChirho, locals: localsChirho }) => {
		// Check authentication
		const sessionChirho = localsChirho.sessionChirho;
		if (!sessionChirho?.userIdChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized. Please log in to update translations.' });
		}

		const formDataChirho = await requestChirho.formData();
		const wordIdChirho = formDataChirho.get('wordIdChirho') as string;
		const glossChirho = formDataChirho.get('glossChirho') as string;
		const approveChirho = formDataChirho.get('approveChirho') === 'true';

		if (!wordIdChirho) {
			return failChirho(400, { errorChirho: 'Word ID required' });
		}

		const codeChirho = paramsChirho.code_chirho;

		// Get language
		const languageResultChirho = await dbChirho
			.select()
			.from(languageTableChirho)
			.where(eqChirho(languageTableChirho.codeChirho, codeChirho))
			.limit(1);

		const languageChirho = languageResultChirho[0];
		if (!languageChirho) {
			return failChirho(404, { errorChirho: 'Language not found' });
		}

		// Find or create phrase for this word
		const existingPhraseChirho = await dbChirho
			.select({ phraseIdChirho: phraseWordTableChirho.phraseIdChirho })
			.from(phraseWordTableChirho)
			.innerJoin(phraseTableChirho, eqChirho(phraseWordTableChirho.phraseIdChirho, phraseTableChirho.idChirho))
			.where(
				andChirho(
					eqChirho(phraseWordTableChirho.wordIdChirho, wordIdChirho),
					eqChirho(phraseTableChirho.languageIdChirho, languageChirho.idChirho)
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
					languageIdChirho: languageChirho.idChirho,
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

		// Upsert gloss
		const stateChirho = approveChirho ? 'APPROVED' : 'UNAPPROVED';

		await dbChirho
			.insert(glossTableChirho)
			.values({
				phraseIdChirho: phraseIdChirho,
				glossChirho: glossChirho || null,
				stateChirho: stateChirho,
				sourceChirho: 'USER' as const,
				updatedAtChirho: new Date(),
				updatedByChirho: sessionChirho.userIdChirho
			})
			.onConflictDoUpdate({
				target: glossTableChirho.phraseIdChirho,
				set: {
					glossChirho: glossChirho || null,
					stateChirho: stateChirho,
					sourceChirho: 'USER' as const,
					updatedAtChirho: new Date(),
					updatedByChirho: sessionChirho.userIdChirho
				}
			});

		// Add to history
		await dbChirho.insert(glossHistoryTableChirho).values({
			phraseIdChirho: phraseIdChirho,
			updatedAtChirho: new Date(),
			updatedByChirho: sessionChirho.userIdChirho,
			glossChirho: glossChirho || null,
			stateChirho: stateChirho,
			sourceChirho: 'USER'
		});

		return { successChirho: true };
	}
};
