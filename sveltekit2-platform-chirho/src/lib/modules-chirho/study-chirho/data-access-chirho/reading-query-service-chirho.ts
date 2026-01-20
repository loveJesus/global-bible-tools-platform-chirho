// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

// NOTE: Raw SQL queries reference upstream database tables (verse, word, phrase, etc.)
// which don't have Chirho suffix - they're from the nextjs-platform-chirho schema.

import { queryRawChirho } from '$lib/server/db-chirho';
import type { VerseChirho, LemmaResourceChirho } from '../model-chirho';

interface DbVerseRowChirho {
	id: string;
	number: number;
	words: Array<{
		id: string;
		text: string;
		gloss?: string;
		linkedWords?: string[];
		lemma: string;
		grammar: string;
		footnote?: string;
		nativeLexicon?: string;
	}>;
}

interface DbLemmaResourceRowChirho {
	lemmaId: string;
	name: string;
	entry: string;
}

export const readingQueryServiceChirho = {
	async fetchChapterVersesChirho(
		bookIdChirho: number,
		chapterIdChirho: number,
		codeChirho: string
	): Promise<VerseChirho[]> {
		const resultChirho = await queryRawChirho<DbVerseRowChirho>(
			`
        SELECT
          v.id,
          v.number,
          words.words
        FROM verse AS v
        JOIN LATERAL (
            SELECT
              json_agg(json_strip_nulls(json_build_object(
                'id', w.id,
                'text', w.text,
                'gloss', g.gloss,
                'linkedWords', ph.linked_words,
                'footnote', fn.content,
                'lemma', lf.lemma_id,
                'grammar', lf.grammar,
                'nativeLexicon', wl.content
              )) ORDER BY w.id) AS words
            FROM word AS w
            LEFT JOIN LATERAL (
              SELECT ph.id, wds.words AS linked_words FROM phrase_word AS phw
              JOIN phrase AS ph ON ph.id = phw.phrase_id
              LEFT JOIN LATERAL (
                SELECT array_agg(phw2.word_id) AS words FROM phrase_word AS phw2
                WHERE phw2.phrase_id = ph.id
                  AND phw2.word_id != phw.word_id
                GROUP BY phw2.phrase_id
              ) AS wds ON true
              WHERE phw.word_id = w.id
                AND ph.deleted_at IS NULL
                AND ph.language_id = (SELECT id FROM language WHERE code = $3)
            ) AS ph ON true
            LEFT JOIN word_lexicon AS wl on wl.word_id = w.id
            LEFT JOIN gloss AS g ON g.phrase_id = ph.id AND g.state = 'APPROVED'
            LEFT JOIN footnote AS fn ON fn.phrase_id = ph.id
            JOIN lemma_form AS lf ON lf.id = w.form_id
            WHERE w.verse_id = v.id
        ) AS words ON true
        WHERE v.book_id = $1 AND v.chapter = $2
      `,
			[bookIdChirho, chapterIdChirho, codeChirho]
		);

		return resultChirho.map((rowChirho) => ({
			idChirho: rowChirho.id,
			numberChirho: rowChirho.number,
			wordsChirho: (rowChirho.words || []).map((wordItemChirho) => ({
				idChirho: wordItemChirho.id,
				textChirho: wordItemChirho.text,
				glossChirho: wordItemChirho.gloss,
				linkedWordsChirho: wordItemChirho.linkedWords,
				lemmaChirho: wordItemChirho.lemma,
				grammarChirho: wordItemChirho.grammar,
				footnoteChirho: wordItemChirho.footnote,
				nativeLexiconChirho: wordItemChirho.nativeLexicon
			}))
		}));
	},

	async fetchResourceForLemmaIdChirho(
		lemmaIdChirho: string
	): Promise<LemmaResourceChirho | undefined> {
		const resultChirho = await queryRawChirho<DbLemmaResourceRowChirho>(
			`
        SELECT
          lr.lemma_id as "lemmaId",
          lr.resource_code as name,
          lr.content as entry
        FROM lemma_resource AS lr
        WHERE lr.lemma_id = $1
        LIMIT 1
      `,
			[lemmaIdChirho]
		);

		if (resultChirho.length === 0) {
			return undefined;
		}

		const rowChirho = resultChirho[0];
		return {
			lemmaIdChirho: rowChirho.lemmaId,
			nameChirho: rowChirho.name,
			entryChirho: rowChirho.entry
		};
	}
};

export default readingQueryServiceChirho;
