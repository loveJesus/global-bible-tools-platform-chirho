// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { queryRawChirho, transactionChirho } from '$lib/server/db-chirho';
import type { PhraseChirho } from '../model-chirho';

interface DbPhraseRowChirho {
	id: number;
	language: { id: string; code: string };
	wordIds: string[];
	createdAt: string;
	createdBy: string | null;
	deletedAt: string | null;
	deletedBy: string | null;
}

interface DbExistsRowChirho {
	exists: boolean;
}

export const phraseRepositoryChirho = {
	async findWithinLanguageByIdChirho(
		languageCodeChirho: string,
		idChirho: number
	): Promise<PhraseChirho | undefined> {
		const resultChirho = await queryRawChirho<DbPhraseRowChirho>(
			`
        SELECT
          id,
          json_build_object(
              'id', phrase.language_id,
              'code', (SELECT code FROM language WHERE language.id = phrase.language_id)
          ) AS language,
          (SELECT json_agg(phrase_word.word_id) FROM phrase_word WHERE phrase_word.phrase_id = phrase.id) AS "wordIds",
          created_at AS "createdAt",
          created_by AS "createdBy",
          deleted_at AS "deletedAt",
          deleted_by AS "deletedBy"
        FROM phrase
        WHERE id = $2
          AND language_id = (SELECT id FROM language WHERE code = $1)
      `,
			[languageCodeChirho, idChirho]
		);

		if (resultChirho.length === 0) {
			return undefined;
		}

		const rowChirho = resultChirho[0];
		return {
			idChirho: rowChirho.id,
			languageChirho: {
				idChirho: rowChirho.language.id,
				codeChirho: rowChirho.language.code
			},
			wordIdsChirho: rowChirho.wordIds || [],
			createdAtChirho: new Date(rowChirho.createdAt),
			createdByChirho: rowChirho.createdBy,
			deletedAtChirho: rowChirho.deletedAt ? new Date(rowChirho.deletedAt) : null,
			deletedByChirho: rowChirho.deletedBy
		};
	},

	async findByIdChirho(idChirho: number): Promise<PhraseChirho | undefined> {
		const resultChirho = await queryRawChirho<DbPhraseRowChirho>(
			`
        SELECT
          id,
          json_build_object(
              'id', phrase.language_id,
              'code', (SELECT code FROM language WHERE language.id = phrase.language_id)
          ) AS language,
          (SELECT json_agg(phrase_word.word_id) FROM phrase_word WHERE phrase_word.phrase_id = phrase.id) AS "wordIds",
          created_at AS "createdAt",
          created_by AS "createdBy",
          deleted_at AS "deletedAt",
          deleted_by AS "deletedBy"
        FROM phrase
        WHERE id = $1
      `,
			[idChirho]
		);

		if (resultChirho.length === 0) {
			return undefined;
		}

		const rowChirho = resultChirho[0];
		return {
			idChirho: rowChirho.id,
			languageChirho: {
				idChirho: rowChirho.language.id,
				codeChirho: rowChirho.language.code
			},
			wordIdsChirho: rowChirho.wordIds || [],
			createdAtChirho: new Date(rowChirho.createdAt),
			createdByChirho: rowChirho.createdBy,
			deletedAtChirho: rowChirho.deletedAt ? new Date(rowChirho.deletedAt) : null,
			deletedByChirho: rowChirho.deletedBy
		};
	},

	async existsForLanguageChirho(
		languageCodeChirho: string,
		phraseIdsChirho: number[]
	): Promise<boolean> {
		if (phraseIdsChirho.length === 0) {
			throw new Error('[existsForLanguageChirho] expected at least one phrase ID');
		}

		const resultChirho = await queryRawChirho<DbExistsRowChirho>(
			`
        SELECT
            (count(*) FILTER (WHERE phrase.id IS NULL)) = 0 AS exists
        FROM unnest($2::int[]) data (phrase_id)
        LEFT JOIN phrase ON phrase.id = data.phrase_id
          AND phrase.language_id = (SELECT id FROM language WHERE code = $1)
      `,
			[languageCodeChirho, phraseIdsChirho]
		);

		return resultChirho[0].exists;
	},

	async linkWordsChirho({
		codeChirho,
		wordIdsChirho,
		userIdChirho
	}: {
		codeChirho: string;
		wordIdsChirho: string[];
		userIdChirho: string;
	}) {
		await transactionChirho(async (txChirho) => {
			const phrasesQueryChirho = await queryRawChirho<Record<string, unknown>>(
				`
          SELECT FROM phrase AS ph
          JOIN phrase_word AS phw ON phw.phrase_id = ph.id
          JOIN LATERAL (
            SELECT count(*) AS count FROM phrase_word AS phw
            WHERE phw.phrase_id = ph.id
          ) AS words ON true
          WHERE ph.language_id = (SELECT id FROM language WHERE code = $1)
            AND ph.deleted_at IS NULL
            AND phw.word_id = ANY($2::text[])
            AND words.count > 1
        `,
				[codeChirho, wordIdsChirho]
			);

			if (phrasesQueryChirho.length > 0) {
				throw new Error('Words already linked');
			}

			await queryRawChirho(
				`
          UPDATE phrase AS ph
            SET deleted_at = now(),
              deleted_by = $3
          FROM phrase_word AS phw
          WHERE phw.phrase_id = ph.id
            AND phw.word_id = ANY($2::text[])
            AND ph.deleted_at IS NULL
            AND ph.language_id = (SELECT id FROM language WHERE code = $1)
        `,
				[codeChirho, wordIdsChirho, userIdChirho]
			);

			await queryRawChirho(
				`
          WITH phrase AS (
            INSERT INTO phrase (language_id, created_by, created_at)
            VALUES ((SELECT id FROM language WHERE code = $1), $3, now())
            RETURNING id
          )
          INSERT INTO phrase_word (phrase_id, word_id)
          SELECT phrase.id, unnest($2::text[]) FROM phrase
        `,
				[codeChirho, wordIdsChirho, userIdChirho]
			);
		});
	},

	async unlinkChirho({
		codeChirho,
		phraseIdChirho,
		userIdChirho
	}: {
		codeChirho: string;
		phraseIdChirho: number;
		userIdChirho: string;
	}) {
		await queryRawChirho(
			`
        UPDATE phrase AS ph
          SET
            deleted_at = now(),
            deleted_by = $3
        WHERE ph.language_id = (SELECT id FROM language WHERE code = $1)
          AND ph.id = $2
      `,
			[codeChirho, phraseIdChirho, userIdChirho]
		);
	}
};

export default phraseRepositoryChirho;
