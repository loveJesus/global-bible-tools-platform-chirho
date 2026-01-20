// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

// NOTE: Raw SQL queries reference upstream database tables (word, phrase, gloss, etc.)
// which don't have Chirho suffix - they're from the nextjs-platform-chirho schema.

import { queryRawChirho } from '$lib/server/db-chirho';
import type {
	DbGlossChirho,
	UpdateGlossOptionsChirho,
	ApproveManyGlossesOptionsChirho,
	GlossStateRawChirho,
	GlossSourceRawChirho
} from '../model-chirho';

interface DbGlossRowChirho {
	phraseId: number;
	gloss: string | null;
	state: string;
	updatedAt: string;
	updatedBy: string | null;
	source: string | null;
}

interface DbNextUnapprovedRowChirho {
	nextUnapprovedVerseId: string;
}

export const glossRepositoryChirho = {
	async findByPhraseIdChirho(phraseIdChirho: number): Promise<DbGlossChirho | undefined> {
		const resultChirho = await queryRawChirho<DbGlossRowChirho>(
			`
        SELECT
          phrase_id AS "phraseId",
          gloss,
          state,
          updated_at AS "updatedAt",
          updated_by AS "updatedBy",
          source
        FROM gloss
        WHERE phrase_id = $1
      `,
			[phraseIdChirho]
		);

		if (resultChirho.length === 0) {
			return undefined;
		}

		const rowChirho = resultChirho[0];
		return {
			phraseIdChirho: rowChirho.phraseId,
			glossChirho: rowChirho.gloss,
			stateChirho: rowChirho.state as GlossStateRawChirho,
			updatedAtChirho: new Date(rowChirho.updatedAt),
			updatedByChirho: rowChirho.updatedBy,
			sourceChirho: rowChirho.source as GlossSourceRawChirho | null
		};
	},

	async findManyByPhraseIdChirho(phraseIdsChirho: number[]): Promise<DbGlossChirho[]> {
		const resultChirho = await queryRawChirho<DbGlossRowChirho>(
			`
        SELECT
          phrase_id AS "phraseId",
          gloss,
          state,
          updated_at AS "updatedAt",
          updated_by AS "updatedBy",
          source
        FROM gloss
        WHERE phrase_id = ANY($1)
      `,
			[phraseIdsChirho]
		);

		return resultChirho.map((rowChirho) => ({
			phraseIdChirho: rowChirho.phraseId,
			glossChirho: rowChirho.gloss,
			stateChirho: rowChirho.state as GlossStateRawChirho,
			updatedAtChirho: new Date(rowChirho.updatedAt),
			updatedByChirho: rowChirho.updatedBy,
			sourceChirho: rowChirho.source as GlossSourceRawChirho | null
		}));
	},

	async findNextUnapprovedChirho(
		languageCodeChirho: string,
		verseIdChirho: string
	): Promise<string | undefined> {
		let resultChirho = await queryRawChirho<DbNextUnapprovedRowChirho>(
			`
        SELECT w.verse_id AS "nextUnapprovedVerseId"
        FROM word AS w
        LEFT JOIN LATERAL (
          SELECT g.state AS state FROM phrase_word AS phw
          JOIN phrase AS ph ON ph.id = phw.phrase_id
          LEFT JOIN gloss AS g ON g.phrase_id = ph.id
          WHERE phw.word_id = w.id
            AND ph.language_id = (SELECT id FROM language WHERE code = $1)
            AND ph.deleted_at IS NULL
        ) AS g ON true
        WHERE w.verse_id > $2
          AND (g.state = 'UNAPPROVED' OR g.state IS NULL)
        ORDER BY w.id
        LIMIT 1
      `,
			[languageCodeChirho, verseIdChirho]
		);

		if (resultChirho.length === 0) {
			resultChirho = await queryRawChirho<DbNextUnapprovedRowChirho>(
				`
          SELECT w.verse_id AS "nextUnapprovedVerseId"
          FROM word AS w
          LEFT JOIN LATERAL (
            SELECT g.state AS state FROM phrase_word AS phw
            JOIN phrase AS ph ON ph.id = phw.phrase_id
            LEFT JOIN gloss AS g ON g.phrase_id = ph.id
            WHERE phw.word_id = w.id
              AND ph.language_id = (SELECT id FROM language WHERE code = $1)
              AND ph.deleted_at IS NULL
          ) AS g ON true
          WHERE (g.state = 'UNAPPROVED' OR g.state IS NULL)
          ORDER BY w.id
          LIMIT 1
        `,
				[languageCodeChirho]
			);
		}

		return resultChirho[0]?.nextUnapprovedVerseId;
	},

	async updateChirho(optionsChirho: UpdateGlossOptionsChirho) {
		await queryRawChirho(
			`INSERT INTO gloss (phrase_id, state, gloss, updated_at, updated_by, source)
        VALUES ($1, $2, $3, now(), $4, $5)
        ON CONFLICT (phrase_id) DO UPDATE SET
          state = COALESCE(excluded.state, gloss.state),
          gloss = COALESCE(excluded.gloss, gloss.gloss),
          updated_at = excluded.updated_at,
          updated_by = excluded.updated_by,
          source = excluded.source
          WHERE excluded.state <> gloss.state OR excluded.gloss <> gloss.gloss
      `,
			[
				optionsChirho.phraseIdChirho,
				optionsChirho.stateChirho,
				optionsChirho.glossChirho,
				optionsChirho.updatedByChirho,
				optionsChirho.sourceChirho
			]
		);
	},

	async approveManyChirho(optionsChirho: ApproveManyGlossesOptionsChirho) {
		await queryRawChirho(
			`
        INSERT INTO gloss (phrase_id, gloss, state, updated_at, updated_by, source)
        SELECT ph.id, data.gloss, 'APPROVED', now(), $3, 'USER'
        FROM unnest($1::integer[], $2::text[]) data (phrase_id, gloss)
        JOIN phrase AS ph ON ph.id = data.phrase_id
        WHERE ph.deleted_at IS NULL
        ON CONFLICT (phrase_id)
            DO UPDATE SET
                gloss = COALESCE(excluded.gloss, gloss.gloss),
                state = excluded.state,
                updated_at = excluded.updated_at,
                updated_by = excluded.updated_by,
                source = excluded.source
                WHERE excluded.state <> gloss.state OR excluded.gloss <> gloss.gloss
      `,
			[
				optionsChirho.phrasesChirho.map((phraseItemChirho) => phraseItemChirho.phraseIdChirho),
				optionsChirho.phrasesChirho.map((phraseItemChirho) => phraseItemChirho.glossChirho),
				optionsChirho.updatedByChirho
			]
		);
	}
};

export default glossRepositoryChirho;
