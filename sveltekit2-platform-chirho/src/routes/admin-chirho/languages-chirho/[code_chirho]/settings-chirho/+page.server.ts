// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { dbChirho, eqChirho, queryRawChirho } from '$lib/server/db-chirho';
import { languageTableChirho } from '$lib/server/schema-chirho/languages-chirho';
import { error as errorChirho, fail as failChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { isUserAdminChirho, isLanguageMemberChirho } from '$lib/server/auth-helpers-chirho';
import { z as zChirho } from 'zod';

// Available fonts (commonly used for Bible translations)
const AVAILABLE_FONTS_CHIRHO = [
	'Noto Sans',
	'Noto Serif',
	'Charis SIL',
	'Gentium Plus',
	'Roboto',
	'Open Sans',
	'Lato',
	'Source Sans Pro',
	'Liberation Sans',
	'DejaVu Sans',
	'Arial Unicode MS',
	'Ezra SIL',
	'SBL Hebrew',
	'SBL Greek'
];

// Zod schema for validation
const updateSettingsSchemaChirho = zChirho.object({
	nameChirho: zChirho.string().min(1, 'Name is required'),
	fontChirho: zChirho.string().min(1, 'Font is required'),
	textDirectionChirho: zChirho.enum(['ltr', 'rtl']),
	translationIdsChirho: zChirho.array(zChirho.string()).optional(),
	referenceLanguageIdChirho: zChirho.string().uuid().optional().nullable()
});

interface LanguageRowChirho {
	idChirho: string;
	codeChirho: string;
	nameChirho: string;
	fontChirho: string;
	textDirectionChirho: string;
	translationIdsChirho: string[] | null;
	referenceLanguageIdChirho: string | null;
}

export const load: PageServerLoadChirho = async ({ params: paramsChirho, locals: localsChirho }) => {
	const codeChirho = paramsChirho.code_chirho;
	const sessionChirho = localsChirho.sessionChirho;

	// Check authentication
	if (!sessionChirho?.userIdChirho) {
		throw redirectChirho(302, '/login-chirho');
	}

	// Check if user is admin or language member
	const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
	const isMemberChirho = await isLanguageMemberChirho(sessionChirho.userIdChirho, codeChirho);

	if (!isAdminChirho && !isMemberChirho) {
		throw errorChirho(403, 'Access denied. You must be an admin or language member.');
	}

	// Get language settings
	const languageResultChirho = await queryRawChirho<LanguageRowChirho>(
		`
		SELECT
			id AS "idChirho",
			code AS "codeChirho",
			name AS "nameChirho",
			font AS "fontChirho",
			text_direction AS "textDirectionChirho",
			translation_ids AS "translationIdsChirho",
			reference_language_id AS "referenceLanguageIdChirho"
		FROM language
		WHERE code = $1
		`,
		[codeChirho]
	);

	if (languageResultChirho.length === 0) {
		throw errorChirho(404, 'Language not found');
	}

	const languageChirho = languageResultChirho[0];

	// Get all languages for reference language dropdown
	const allLanguagesChirho = await queryRawChirho<{ idChirho: string; codeChirho: string; nameChirho: string }>(
		`
		SELECT
			id AS "idChirho",
			code AS "codeChirho",
			name AS "nameChirho"
		FROM language
		ORDER BY name
		`
	);

	return {
		languageChirho,
		allLanguagesChirho,
		fontsChirho: AVAILABLE_FONTS_CHIRHO,
		isAdminChirho
	};
};

export const actions: ActionsChirho = {
	updateSettingsChirho: async ({ request: requestChirho, params: paramsChirho, locals: localsChirho }) => {
		const codeChirho = paramsChirho.code_chirho;
		const sessionChirho = localsChirho.sessionChirho;

		// Check authentication
		if (!sessionChirho?.userIdChirho) {
			return failChirho(401, { errorChirho: 'Unauthorized' });
		}

		// Check if user is admin or language member
		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		const isMemberChirho = await isLanguageMemberChirho(sessionChirho.userIdChirho, codeChirho);

		if (!isAdminChirho && !isMemberChirho) {
			return failChirho(403, { errorChirho: 'Access denied' });
		}

		// Parse form data
		const formDataChirho = await requestChirho.formData();
		const nameChirho = (formDataChirho.get('name') as string)?.trim();
		const fontChirho = (formDataChirho.get('font') as string)?.trim();
		const textDirectionChirho = formDataChirho.get('textDirection') as string;
		const translationIdsRawChirho = formDataChirho.get('translationIds') as string;
		const referenceLanguageIdChirho = (formDataChirho.get('referenceLanguageId') as string) || null;

		// Parse translation IDs (comma-separated)
		const translationIdsChirho = translationIdsRawChirho
			? translationIdsRawChirho.split(',').filter((idChirho) => idChirho.trim())
			: [];

		// Validate with Zod
		const validationChirho = updateSettingsSchemaChirho.safeParse({
			nameChirho,
			fontChirho,
			textDirectionChirho,
			translationIdsChirho,
			referenceLanguageIdChirho: referenceLanguageIdChirho || null
		});

		if (!validationChirho.success) {
			const errorsChirho = validationChirho.error.flatten().fieldErrors;
			return failChirho(400, {
				errorChirho: 'Validation failed',
				fieldErrorsChirho: errorsChirho
			});
		}

		try {
			// Get language ID from code
			const languageResultChirho = await dbChirho
				.select({ idChirho: languageTableChirho.idChirho })
				.from(languageTableChirho)
				.where(eqChirho(languageTableChirho.codeChirho, codeChirho))
				.limit(1);

			if (languageResultChirho.length === 0) {
				return failChirho(404, { errorChirho: 'Language not found' });
			}

			const languageIdChirho = languageResultChirho[0].idChirho;

			// Update language settings
			await dbChirho
				.update(languageTableChirho)
				.set({
					nameChirho: validationChirho.data.nameChirho,
					fontChirho: validationChirho.data.fontChirho,
					textDirectionChirho: validationChirho.data.textDirectionChirho,
					translationIdsChirho: validationChirho.data.translationIdsChirho?.length
						? validationChirho.data.translationIdsChirho
						: null,
					referenceLanguageIdChirho: validationChirho.data.referenceLanguageIdChirho || null
				})
				.where(eqChirho(languageTableChirho.idChirho, languageIdChirho));

			return { successChirho: true, messageChirho: 'Settings saved successfully' };
		} catch (errChirho) {
			console.error('Error updating language settings:', errChirho);
			return failChirho(500, { errorChirho: 'Failed to save settings' });
		}
	}
};
