// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { dbChirho, eqChirho, andChirho, sqlChirho } from '$lib/server/db-chirho';
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

export const load: PageServerLoadChirho = async ({ params: paramsChirho }) => {
	const codeChirho = paramsChirho.code_chirho;
	const verseIdChirho = paramsChirho.verse_id_chirho;

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

	// Get words with glosses
	const wordsChirho = await dbChirho
		.select({
			wordIdChirho: wordTableChirho.idChirho,
			textChirho: wordTableChirho.textChirho,
			formIdChirho: wordTableChirho.formIdChirho,
			lemmaIdChirho: lemmaFormTableChirho.lemmaIdChirho,
			grammarChirho: lemmaFormTableChirho.grammarChirho,
			phraseIdChirho: phraseTableChirho.idChirho,
			glossChirho: glossTableChirho.glossChirho,
			stateChirho: glossTableChirho.stateChirho
		})
		.from(wordTableChirho)
		.leftJoin(lemmaFormTableChirho, eqChirho(wordTableChirho.formIdChirho, lemmaFormTableChirho.idChirho))
		.leftJoin(phraseWordTableChirho, eqChirho(wordTableChirho.idChirho, phraseWordTableChirho.wordIdChirho))
		.leftJoin(
			phraseTableChirho,
			andChirho(
				eqChirho(phraseWordTableChirho.phraseIdChirho, phraseTableChirho.idChirho),
				eqChirho(phraseTableChirho.languageIdChirho, languageChirho.idChirho),
				sqlChirho`${phraseTableChirho.deletedAtChirho} IS NULL`
			)
		)
		.leftJoin(glossTableChirho, eqChirho(phraseTableChirho.idChirho, glossTableChirho.phraseIdChirho))
		.where(eqChirho(wordTableChirho.verseIdChirho, verseIdChirho))
		.orderBy(wordTableChirho.idChirho);

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
		codeChirho,
		languageChirho,
		bookChirho,
		chapterChirho,
		verseNumberChirho,
		wordsChirho,
		prevVerseIdChirho: prevVerseChirho[0]?.idChirho ?? null,
		nextVerseIdChirho: nextVerseChirho[0]?.idChirho ?? null
	};
};

export const actions: ActionsChirho = {
	updateGlossChirho: async ({ request: requestChirho, params: paramsChirho, locals: localsChirho }) => {
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
					createdByChirho: localsChirho.userChirho?.idChirho ?? null
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
				sourceChirho: 'USER',
				updatedAtChirho: new Date(),
				updatedByChirho: localsChirho.userChirho?.idChirho ?? null
			})
			.onConflictDoUpdate({
				target: glossTableChirho.phraseIdChirho,
				set: {
					glossChirho: glossChirho || null,
					stateChirho: stateChirho,
					sourceChirho: 'USER',
					updatedAtChirho: new Date(),
					updatedByChirho: localsChirho.userChirho?.idChirho ?? null
				}
			});

		// Add to history
		await dbChirho.insert(glossHistoryTableChirho).values({
			phraseIdChirho: phraseIdChirho,
			updatedAtChirho: new Date(),
			updatedByChirho: localsChirho.userChirho?.idChirho ?? null,
			glossChirho: glossChirho || null,
			stateChirho: stateChirho,
			sourceChirho: 'USER'
		});

		return { successChirho: true };
	}
};
