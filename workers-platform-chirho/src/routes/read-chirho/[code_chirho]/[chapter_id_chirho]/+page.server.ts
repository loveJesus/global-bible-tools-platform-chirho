// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { error as errorChirho } from '@sveltejs/kit';
import { parseChapterIdChirho, buildChapterIdChirho } from '$lib/modules-chirho/bible-core-chirho/queries-chirho';
import { resolveLanguageDbChirho, getMetaDbChirho } from '$lib/server/d1-resolver-chirho';
import { queryD1Chirho, queryD1OneChirho, isNotDistinctFromD1Chirho } from '$lib/server/db-d1-chirho';
import type { BookRowChirho, ReferenceVersionRowChirho, ReferenceVerseRowChirho } from '$lib/server/db-d1-chirho';
import { getBookNameChirho } from '$lib/shared-chirho/book-names-chirho';

// ============================================================================
// Types
// ============================================================================

interface ChapterWordRowChirho {
	verseId: string;
	verseNumber: number;
	wordId: string;
	text: string;
	lemmaId: string | null;
	grammar: string | null;
	gloss: string | null;
	state: string | null;
	source: string | null;
	ipaChirho: string | null;
}

interface LanguageRowChirho {
	id: string;
	code: string;
	name: string;
	font: string | null;
}

interface TypeCheckRowChirho {
	hasTerseChirho: number;
	hasReadersChirho: number;
}

interface BookWithMaxChapterChirho {
	id: number;
	name: string;
	maxChapter: number;
}

// ============================================================================
// Loader
// ============================================================================

export const load: PageServerLoadChirho = async ({ params: paramsChirho, url: urlChirho, platform: platformChirho, setHeaders: setHeadersChirho }) => {
	const codeChirho = paramsChirho.code_chirho;
	const chapterIdChirho = paramsChirho.chapter_id_chirho;
	const refVersionParamChirho = urlChirho.searchParams.get('ref');
	const typeParamChirho = urlChirho.searchParams.get('type');
	const ipaParamChirho = urlChirho.searchParams.get('ipa') ?? 'off';

	setHeadersChirho({
		'cache-control': 'public, s-maxage=86400, stale-while-revalidate=604800'
	});

	// Parse chapter ID
	const { bookIdChirho, chapterChirho } = parseChapterIdChirho(chapterIdChirho);

	// Resolve per-language D1 database
	const dbChirho = resolveLanguageDbChirho(platformChirho, codeChirho);
	if (!dbChirho) {
		throw errorChirho(404, `Language '${codeChirho}' not available`);
	}

	// Get language info from the per-language DB's meta table
	const languageChirho = await queryD1OneChirho<LanguageRowChirho>(
		dbChirho,
		`SELECT id, code, name, font FROM language WHERE code = ?`,
		[codeChirho]
	);
	if (!languageChirho) {
		throw errorChirho(404, `Language '${codeChirho}' not found`);
	}

	// Check which translation types exist (language-wide, fast query on indexed column)
	const typeCheckChirho = await queryD1OneChirho<TypeCheckRowChirho>(
		dbChirho,
		`SELECT
			EXISTS(
				SELECT 1 FROM phrase
				WHERE language_id = ? AND translation_type_chirho IS NULL AND deleted_at IS NULL
				LIMIT 1
			) AS hasTerseChirho,
			EXISTS(
				SELECT 1 FROM phrase
				WHERE language_id = ? AND translation_type_chirho = 'readers' AND deleted_at IS NULL
				LIMIT 1
			) AS hasReadersChirho`,
		[languageChirho.id, languageChirho.id]
	);
	const hasTerseChirho = Boolean(typeCheckChirho?.hasTerseChirho);
	const hasReadersChirho = Boolean(typeCheckChirho?.hasReadersChirho);

	// Determine effective type
	let effectiveTypeChirho: 'terse' | 'readers';
	if (typeParamChirho === 'readers' && hasReadersChirho) {
		effectiveTypeChirho = 'readers';
	} else if (typeParamChirho === 'terse' && hasTerseChirho) {
		effectiveTypeChirho = 'terse';
	} else {
		effectiveTypeChirho = hasTerseChirho ? 'terse' : (hasReadersChirho ? 'readers' : 'terse');
	}

	const translationTypeDbChirho: string | null = effectiveTypeChirho === 'readers' ? 'readers' : null;

	// Get book
	const bookChirho = await queryD1OneChirho<BookRowChirho>(
		dbChirho,
		`SELECT id, name FROM book WHERE id = ?`,
		[bookIdChirho]
	);
	if (!bookChirho) {
		throw errorChirho(404, 'Book not found');
	}

	// =========================================================================
	// HOT PATH: Single query for entire chapter (replaces PG LATERAL JOIN loop)
	// Uses a subquery for phrase+gloss to avoid duplicate rows when a word
	// has both terse and readers phrases in phrase_word.
	// =========================================================================
	const typeFilterChirho = isNotDistinctFromD1Chirho('p.translation_type_chirho');

	const chapterWordsChirho = await queryD1Chirho<ChapterWordRowChirho>(
		dbChirho,
		`SELECT
			v.id AS verseId,
			v.number AS verseNumber,
			w.id AS wordId,
			w.text,
			lf.lemma_id AS lemmaId,
			lf.grammar,
			pg.gloss,
			pg.state,
			pg.source,
			CASE ?1
				WHEN 'erasmian' THEN ipa.greek_erasmian_chirho
				WHEN 'koine' THEN ipa.greek_koine_chirho
				WHEN 'modern' THEN ipa.greek_modern_chirho
				WHEN 'tiberian' THEN ipa.hebrew_tiberian_chirho
				ELSE COALESCE(ipa.hebrew_tiberian_chirho, ipa.greek_erasmian_chirho)
			END AS ipaChirho
		FROM word w
		JOIN verse v ON v.id = w.verse_id
		LEFT JOIN lemma_form lf ON lf.id = w.form_id
		LEFT JOIN word_ipa_chirho ipa ON ipa.word_text_chirho = w.text
		LEFT JOIN (
			SELECT pw.word_id, g.gloss, g.state, g.source
			FROM phrase_word pw
			JOIN phrase p ON p.id = pw.phrase_id
				AND p.language_id = ?2
				AND p.deleted_at IS NULL
				AND ${typeFilterChirho}
			LEFT JOIN gloss g ON g.phrase_id = p.id
			WHERE pw.word_id IN (
				SELECT w2.id FROM word w2
				JOIN verse v2 ON v2.id = w2.verse_id
				WHERE v2.book_id = ?5 AND v2.chapter = ?6
			)
		) pg ON pg.word_id = w.id
		WHERE v.book_id = ?5 AND v.chapter = ?6
		ORDER BY v.number, w.id`,
		[ipaParamChirho, languageChirho.id, translationTypeDbChirho, translationTypeDbChirho, bookIdChirho, chapterChirho]
	);

	// Group by verse in JS
	const versesMapChirho = new Map<string, {
		verseIdChirho: string;
		verseNumberChirho: number;
		wordsChirho: Array<{
			wordIdChirho: string;
			textChirho: string;
			lemmaIdChirho: string | null;
			grammarChirho: string | null;
			glossChirho: string | null;
			glossStateChirho: string | null;
			glossSourceChirho: string | null;
			ipaChirho: string | null;
		}>;
	}>();

	for (const rowChirho of chapterWordsChirho) {
		let verseChirho = versesMapChirho.get(rowChirho.verseId);
		if (!verseChirho) {
			verseChirho = {
				verseIdChirho: rowChirho.verseId,
				verseNumberChirho: rowChirho.verseNumber,
				wordsChirho: []
			};
			versesMapChirho.set(rowChirho.verseId, verseChirho);
		}
		verseChirho.wordsChirho.push({
			wordIdChirho: rowChirho.wordId,
			textChirho: rowChirho.text,
			lemmaIdChirho: rowChirho.lemmaId,
			grammarChirho: rowChirho.grammar,
			glossChirho: rowChirho.gloss,
			glossStateChirho: rowChirho.state,
			glossSourceChirho: rowChirho.source,
			ipaChirho: rowChirho.ipaChirho
		});
	}

	const versesWithWordsChirho = Array.from(versesMapChirho.values());
	if (versesWithWordsChirho.length === 0) {
		throw errorChirho(404, 'Chapter not found');
	}

	// Prev/next chapter
	const prevChapterIdChirho = chapterChirho > 1
		? buildChapterIdChirho(bookIdChirho, chapterChirho - 1)
		: null;

	const nextCheckChirho = await queryD1OneChirho<{ cnt: number }>(
		dbChirho,
		`SELECT COUNT(*) AS cnt FROM verse WHERE book_id = ? AND chapter = ?`,
		[bookIdChirho, chapterChirho + 1]
	);
	const nextChapterIdChirho = (nextCheckChirho?.cnt ?? 0) > 0
		? buildChapterIdChirho(bookIdChirho, chapterChirho + 1)
		: null;

	// All books with max chapter (using subquery to avoid full verse scan)
	const allBooksChirho = await queryD1Chirho<BookWithMaxChapterChirho>(
		dbChirho,
		`SELECT b.id, b.name,
			(SELECT MAX(v.chapter) FROM verse v WHERE v.book_id = b.id) AS maxChapter
		 FROM book b
		 ORDER BY b.id`
	);

	// Chapters in current book
	const currentBookInfoChirho = allBooksChirho.find((bChirho) => bChirho.id === bookIdChirho);
	const maxChapterChirho = currentBookInfoChirho?.maxChapter ?? 1;
	const chaptersInBookChirho = Array.from(
		{ length: maxChapterChirho },
		(_, iChirho) => iChirho + 1
	);

	// Languages with translations (from meta DB)
	const metaDbChirho = getMetaDbChirho(platformChirho);
	let languagesWithTranslationsChirho: Array<{ codeChirho: string; nameChirho: string }>;
	if (metaDbChirho) {
		const langRowsChirho = await queryD1Chirho<{ code: string; name: string }>(
			metaDbChirho,
			`SELECT code, name FROM language_stats_chirho ORDER BY name`
		);
		languagesWithTranslationsChirho = langRowsChirho.map((rChirho) => ({
			codeChirho: rChirho.code,
			nameChirho: rChirho.name
		}));
	} else {
		languagesWithTranslationsChirho = [
			{ codeChirho: languageChirho.code, nameChirho: languageChirho.name }
		];
	}

	// Reference versions
	const referenceVersionsChirho = await queryD1Chirho<ReferenceVersionRowChirho>(
		dbChirho,
		`SELECT id, code, name, language_code FROM reference_version_chirho ORDER BY name`
	);

	// Find preferred reference version
	let preferredVersionIdChirho: number;
	if (refVersionParamChirho) {
		preferredVersionIdChirho = parseInt(refVersionParamChirho, 10);
	} else {
		const matchingVersionChirho = referenceVersionsChirho.find(
			(vChirho) => vChirho.language_code === codeChirho
		);
		if (matchingVersionChirho) {
			preferredVersionIdChirho = matchingVersionChirho.id;
		} else {
			const kjvChirho = referenceVersionsChirho.find((vChirho) => vChirho.code === 'KJV');
			preferredVersionIdChirho = kjvChirho?.id ?? referenceVersionsChirho[0]?.id ?? 1;
		}
	}

	// Reference verses
	const chapterPrefixChirho = `${bookIdChirho.toString().padStart(2, '0')}${chapterChirho.toString().padStart(3, '0')}`;
	const referenceVersesChirho = await queryD1Chirho<ReferenceVerseRowChirho>(
		dbChirho,
		`SELECT verse_id, text FROM reference_verse_chirho
		 WHERE version_id = ? AND verse_id LIKE ?
		 ORDER BY verse_id`,
		[preferredVersionIdChirho, `${chapterPrefixChirho}%`]
	);

	const referenceVersesMapChirho: Record<string, string> = {};
	for (const rvChirho of referenceVersesChirho) {
		referenceVersesMapChirho[rvChirho.verse_id] = rvChirho.text;
	}

	// Selected ref version info
	const selectedRefVersionChirho = referenceVersionsChirho.find(
		(vChirho) => vChirho.id === preferredVersionIdChirho
	);

	const rtlLanguagesChirho = ['hbo', 'heb', 'arc', 'arb', 'ara', 'fas', 'urd'];
	const isRefRtlChirho = selectedRefVersionChirho
		? rtlLanguagesChirho.includes(selectedRefVersionChirho.language_code)
		: false;

	return {
		codeChirho,
		languageChirho: {
			idChirho: languageChirho.id,
			codeChirho: languageChirho.code,
			nameChirho: languageChirho.name,
			fontChirho: languageChirho.font
		},
		bookChirho: { idChirho: bookChirho.id, nameChirho: getBookNameChirho(bookChirho.id, codeChirho) },
		chapterChirho,
		versesChirho: versesWithWordsChirho,
		prevChapterIdChirho,
		nextChapterIdChirho,
		allBooksChirho: allBooksChirho.map((bChirho) => ({
			idChirho: bChirho.id,
			nameChirho: getBookNameChirho(bChirho.id, codeChirho),
			maxChapterChirho: bChirho.maxChapter
		})),
		chaptersInBookChirho,
		languagesWithTranslationsChirho,
		referenceVersionsChirho: referenceVersionsChirho.map((vChirho) => ({
			idChirho: vChirho.id,
			codeChirho: vChirho.code,
			nameChirho: vChirho.name,
			languageCodeChirho: vChirho.language_code
		})),
		referenceVersesMapChirho,
		selectedRefVersionIdChirho: preferredVersionIdChirho,
		selectedRefLangCodeChirho: selectedRefVersionChirho?.language_code ?? 'eng',
		isRefRtlChirho,
		selectedRefVersionNameChirho: selectedRefVersionChirho?.name ?? 'Reference',
		hasTerseChirho,
		hasReadersChirho,
		translationTypeChirho: effectiveTypeChirho,
		ipaModeChirho: ipaParamChirho
	};
};
