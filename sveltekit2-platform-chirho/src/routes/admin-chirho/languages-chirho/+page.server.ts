// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { dbChirho, eqChirho, queryRawChirho } from '$lib/server/db-chirho';
import {
	languageTableChirho,
	languageMemberTableChirho,
	languageMemberRoleTableChirho
} from '$lib/server/schema-chirho/languages-chirho';
import { error as errorChirho, fail as failChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { isUserAdminChirho } from '$lib/server/auth-helpers-chirho';

interface LanguageWithStatsRowChirho {
	idChirho: string;
	codeChirho: string;
	nameChirho: string;
	fontChirho: string;
	textDirectionChirho: string;
	memberCountChirho: number;
	wordCountChirho: number;
	approvedCountChirho: number;
}

export const load: PageServerLoadChirho = async ({ locals: localsChirho }) => {
	// Check authentication and admin status
	const sessionChirho = localsChirho.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		throw redirectChirho(302, '/login-chirho');
	}

	// Check admin role
	const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
	if (!isAdminChirho) {
		throw errorChirho(403, 'Access denied. Admin privileges required.');
	}

	// Get all languages with stats
	const languagesChirho = await queryRawChirho<LanguageWithStatsRowChirho>(
		`
		SELECT
			l.id AS "idChirho",
			l.code AS "codeChirho",
			l.name AS "nameChirho",
			l.font AS "fontChirho",
			l.text_direction AS "textDirectionChirho",
			COALESCE(member_counts.count, 0)::int AS "memberCountChirho",
			COALESCE(gloss_counts.word_count, 0)::int AS "wordCountChirho",
			COALESCE(gloss_counts.approved_count, 0)::int AS "approvedCountChirho"
		FROM language AS l
		LEFT JOIN (
			SELECT language_id, COUNT(DISTINCT user_id)::int AS count
			FROM language_member
			GROUP BY language_id
		) AS member_counts ON member_counts.language_id = l.id
		LEFT JOIN (
			SELECT
				p.language_id,
				COUNT(DISTINCT pw.word_id)::int AS word_count,
				COUNT(DISTINCT CASE WHEN g.state = 'APPROVED' THEN pw.word_id END)::int AS approved_count
			FROM phrase AS p
			JOIN phrase_word AS pw ON pw.phrase_id = p.id
			LEFT JOIN gloss AS g ON g.phrase_id = p.id
			WHERE p.deleted_at IS NULL
			GROUP BY p.language_id
		) AS gloss_counts ON gloss_counts.language_id = l.id
		ORDER BY l.name
		`
	);

	return {
		languagesChirho
	};
};

export const actions: ActionsChirho = {
	// Add new language
	addLanguageChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const sessionChirho = localsChirho.sessionChirho;
		if (!sessionChirho?.userIdChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized' });
		}

		// Verify admin role
		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		if (!isAdminChirho) {
			return failChirho(403, { errorChirho: 'Admin privileges required' });
		}

		const formDataChirho = await requestChirho.formData();
		const codeChirho = (formDataChirho.get('code') as string)?.trim().toLowerCase();
		const nameChirho = (formDataChirho.get('name') as string)?.trim();
		const fontChirho = (formDataChirho.get('font') as string)?.trim() || 'Noto Sans';
		const textDirectionChirho = (formDataChirho.get('textDirection') as string) || 'ltr';

		if (!codeChirho || !nameChirho) {
			return failChirho(400, { errorChirho: 'Code and name are required' });
		}

		// Validate code format (ISO 639-3 style: 3 lowercase letters)
		if (!/^[a-z]{3}$/.test(codeChirho)) {
			return failChirho(400, { errorChirho: 'Code must be 3 lowercase letters (ISO 639-3)' });
		}

		try {
			// Check if code already exists
			const existingChirho = await dbChirho
				.select({ idChirho: languageTableChirho.idChirho })
				.from(languageTableChirho)
				.where(eqChirho(languageTableChirho.codeChirho, codeChirho))
				.limit(1);

			if (existingChirho.length > 0) {
				return failChirho(400, { errorChirho: 'Language code already exists' });
			}

			// Insert new language
			await dbChirho.insert(languageTableChirho).values({
				codeChirho: codeChirho,
				nameChirho: nameChirho,
				fontChirho: fontChirho,
				textDirectionChirho: textDirectionChirho as 'ltr' | 'rtl'
			});

			return { successChirho: true, messageChirho: `Language "${nameChirho}" added successfully` };
		} catch (errChirho) {
			console.error('Error adding language:', errChirho);
			return failChirho(500, { errorChirho: 'Failed to add language' });
		}
	},

	// Update language
	updateLanguageChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const sessionChirho = localsChirho.sessionChirho;
		if (!sessionChirho?.userIdChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized' });
		}

		// Verify admin role
		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		if (!isAdminChirho) {
			return failChirho(403, { errorChirho: 'Admin privileges required' });
		}

		const formDataChirho = await requestChirho.formData();
		const idChirho = formDataChirho.get('id') as string;
		const nameChirho = (formDataChirho.get('name') as string)?.trim();
		const fontChirho = (formDataChirho.get('font') as string)?.trim() || 'Noto Sans';
		const textDirectionChirho = (formDataChirho.get('textDirection') as string) || 'ltr';

		if (!idChirho || !nameChirho) {
			return failChirho(400, { errorChirho: 'ID and name are required' });
		}

		try {
			await dbChirho
				.update(languageTableChirho)
				.set({
					nameChirho: nameChirho,
					fontChirho: fontChirho,
					textDirectionChirho: textDirectionChirho as 'ltr' | 'rtl'
				})
				.where(eqChirho(languageTableChirho.idChirho, idChirho));

			return { successChirho: true, messageChirho: `Language "${nameChirho}" updated` };
		} catch (errChirho) {
			console.error('Error updating language:', errChirho);
			return failChirho(500, { errorChirho: 'Failed to update language' });
		}
	}
};
