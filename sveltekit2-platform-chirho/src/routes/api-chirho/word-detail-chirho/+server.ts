// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryRawChirho } from '$lib/server/db-chirho';
import { z as zChirho } from 'zod';

// Validation schema
const wordDetailQuerySchemaChirho = zChirho.object({
	wordIdChirho: zChirho.string().min(1, 'Word ID is required'),
	languageCodeChirho: zChirho.string().optional()
});

interface WordDetailRowChirho {
	wordId: string;
	wordText: string;
	formId: string | null;
	lemmaId: string | null;
	grammar: string | null;
}

interface LexiconEntryChirho {
	resourceCode: string;
	content: string;
}

interface LemmaTranslationChirho {
	languageCode: string;
	languageName: string;
	gloss: string;
	state: string | null;
	verseId: string;
}

export const GET: RequestHandler = async ({ url: urlChirho }) => {
	try {
		// Validate query params with Zod
		const validationChirho = wordDetailQuerySchemaChirho.safeParse({
			wordIdChirho: urlChirho.searchParams.get('wordId'),
			languageCodeChirho: urlChirho.searchParams.get('languageCode')
		});

		if (!validationChirho.success) {
			const errorsChirho = validationChirho.error.issues.map((eChirho: { message: string }) => eChirho.message).join(', ');
			return json({ errorChirho: errorsChirho }, { status: 400 });
		}

		const wordIdChirho = validationChirho.data.wordIdChirho;

		// Get word with form and lemma info
		const wordDetailChirho = await queryRawChirho<WordDetailRowChirho>(
			`
			SELECT
				w.id AS "wordId",
				w.text AS "wordText",
				w.form_id AS "formId",
				lf.lemma_id AS "lemmaId",
				lf.grammar
			FROM word AS w
			LEFT JOIN lemma_form AS lf ON lf.id = w.form_id
			WHERE w.id = $1
			`,
			[wordIdChirho]
		);

		if (wordDetailChirho.length === 0) {
			return json({ errorChirho: 'Word not found' }, { status: 404 });
		}

		const wordChirho = wordDetailChirho[0];
		const lemmaIdChirho = wordChirho.lemmaId;

		// Get lexicon entries if lemma exists
		let lexiconEntriesChirho: LexiconEntryChirho[] = [];
		if (lemmaIdChirho) {
			lexiconEntriesChirho = await queryRawChirho<LexiconEntryChirho>(
				`
				SELECT
					resource_code AS "resourceCode",
					content
				FROM lemma_resource
				WHERE lemma_id = $1
				ORDER BY resource_code
				`,
				[lemmaIdChirho]
			);
		}

		// Get other translations of this lemma (in the current language and other languages)
		let otherTranslationsChirho: LemmaTranslationChirho[] = [];
		if (lemmaIdChirho) {
			otherTranslationsChirho = await queryRawChirho<LemmaTranslationChirho>(
				`
				SELECT DISTINCT ON (l.code, g.gloss)
					l.code AS "languageCode",
					l.name AS "languageName",
					g.gloss,
					g.state,
					w.verse_id AS "verseId"
				FROM word AS w
				JOIN lemma_form AS lf ON lf.id = w.form_id
				JOIN phrase_word AS pw ON pw.word_id = w.id
				JOIN phrase AS p ON p.id = pw.phrase_id
				JOIN gloss AS g ON g.phrase_id = p.id
				JOIN language AS l ON l.id = p.language_id
				WHERE lf.lemma_id = $1
					AND g.gloss IS NOT NULL
					AND p.deleted_at IS NULL
				ORDER BY l.code, g.gloss, g.state DESC
				LIMIT 20
				`,
				[lemmaIdChirho]
			);
		}

		// Get count of occurrences of this lemma in the Bible
		let lemmaOccurrenceCountChirho = 0;
		if (lemmaIdChirho) {
			const countResultChirho = await queryRawChirho<{ count: string }>(
				`
				SELECT COUNT(*)::text AS count
				FROM word AS w
				JOIN lemma_form AS lf ON lf.id = w.form_id
				WHERE lf.lemma_id = $1
				`,
				[lemmaIdChirho]
			);
			lemmaOccurrenceCountChirho = parseInt(countResultChirho[0]?.count ?? '0', 10);
		}

		// Parse grammar code if present
		const grammarParsingChirho = parseGrammarCodeChirho(wordChirho.grammar);

		return json({
			wordChirho: {
				idChirho: wordChirho.wordId,
				textChirho: wordChirho.wordText,
				formIdChirho: wordChirho.formId,
				lemmaIdChirho: lemmaIdChirho,
				grammarChirho: wordChirho.grammar,
				grammarParsingChirho
			},
			lemmaOccurrenceCountChirho,
			lexiconEntriesChirho: lexiconEntriesChirho.map((entryChirho) => ({
				resourceCodeChirho: entryChirho.resourceCode,
				contentChirho: entryChirho.content
			})),
			otherTranslationsChirho: otherTranslationsChirho.map((transChirho) => ({
				languageCodeChirho: transChirho.languageCode,
				languageNameChirho: transChirho.languageName,
				glossChirho: transChirho.gloss,
				stateChirho: transChirho.state,
				verseIdChirho: transChirho.verseId
			}))
		});
	} catch (errorChirho) {
		console.error('Error fetching word detail:', errorChirho);
		return json({ errorChirho: 'Failed to fetch word detail' }, { status: 500 });
	}
};

// Parse grammar codes - Hebrew and Greek have different formats
function parseGrammarCodeChirho(grammarChirho: string | null): Record<string, string> | null {
	if (!grammarChirho) return null;

	// Hebrew parsing codes (e.g., "HNcmpc" = Hebrew Noun common masculine plural construct)
	// Greek parsing codes (e.g., "V-AAI-3S" = Verb-Aorist Active Indicative-3rd Singular)

	const parsingChirho: Record<string, string> = {};

	// Try Greek format first (uses dashes)
	if (grammarChirho.includes('-')) {
		const partsChirho = grammarChirho.split('-');
		const posChirho = partsChirho[0];

		// Part of speech
		const posMapChirho: Record<string, string> = {
			V: 'Verb',
			N: 'Noun',
			A: 'Adjective',
			D: 'Adverb',
			P: 'Preposition',
			C: 'Conjunction',
			T: 'Article',
			R: 'Pronoun',
			I: 'Interjection',
			X: 'Particle'
		};
		parsingChirho['Part of Speech'] = posMapChirho[posChirho] ?? posChirho;

		if (partsChirho[1]) {
			// Tense-Voice-Mood
			const tvmChirho = partsChirho[1];
			if (tvmChirho.length >= 1) {
				const tenseMapChirho: Record<string, string> = {
					P: 'Present',
					I: 'Imperfect',
					F: 'Future',
					A: 'Aorist',
					X: 'Perfect',
					Y: 'Pluperfect'
				};
				parsingChirho['Tense'] = tenseMapChirho[tvmChirho[0]] ?? tvmChirho[0];
			}
			if (tvmChirho.length >= 2) {
				const voiceMapChirho: Record<string, string> = {
					A: 'Active',
					M: 'Middle',
					P: 'Passive',
					E: 'Middle/Passive',
					D: 'Deponent'
				};
				parsingChirho['Voice'] = voiceMapChirho[tvmChirho[1]] ?? tvmChirho[1];
			}
			if (tvmChirho.length >= 3) {
				const moodMapChirho: Record<string, string> = {
					I: 'Indicative',
					S: 'Subjunctive',
					O: 'Optative',
					M: 'Imperative',
					N: 'Infinitive',
					P: 'Participle'
				};
				parsingChirho['Mood'] = moodMapChirho[tvmChirho[2]] ?? tvmChirho[2];
			}
		}

		if (partsChirho[2]) {
			// Person-Number (e.g., "3S" = 3rd Singular)
			const pnChirho = partsChirho[2];
			if (pnChirho.length >= 1 && /[123]/.test(pnChirho[0])) {
				parsingChirho['Person'] = pnChirho[0] + (['st', 'nd', 'rd'][parseInt(pnChirho[0]) - 1] ?? 'th');
			}
			if (pnChirho.length >= 2) {
				const numberMapChirho: Record<string, string> = { S: 'Singular', P: 'Plural', D: 'Dual' };
				parsingChirho['Number'] = numberMapChirho[pnChirho[1]] ?? pnChirho[1];
			}
		}
	} else if (grammarChirho.length >= 2) {
		// Hebrew format (concatenated codes)
		// First char: language (H=Hebrew, A=Aramaic)
		// Second char: POS (V=Verb, N=Noun, etc.)
		const langCharChirho = grammarChirho[0];
		const posCharChirho = grammarChirho[1];

		if (langCharChirho === 'H' || langCharChirho === 'A') {
			parsingChirho['Language'] = langCharChirho === 'H' ? 'Hebrew' : 'Aramaic';
		}

		const hebrewPosMapChirho: Record<string, string> = {
			V: 'Verb',
			N: 'Noun',
			A: 'Adjective',
			P: 'Pronoun',
			R: 'Preposition',
			C: 'Conjunction',
			D: 'Adverb',
			T: 'Particle',
			S: 'Suffix'
		};
		parsingChirho['Part of Speech'] = hebrewPosMapChirho[posCharChirho] ?? posCharChirho;

		// Additional Hebrew parsing codes would follow...
		// For brevity, just show the raw grammar for now
		if (grammarChirho.length > 2) {
			parsingChirho['Full Code'] = grammarChirho;
		}
	}

	return Object.keys(parsingChirho).length > 0 ? parsingChirho : null;
}
