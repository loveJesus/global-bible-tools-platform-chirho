// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { queryRawChirho } from '$lib/server/db-chirho';

interface VerseAudioTimingChirho {
	verseIdChirho: string;
	startChirho: number;
}

export const GET: RequestHandlerChirho = async ({ params: paramsChirho }) => {
	const speakerChirho = paramsChirho.speaker_chirho;
	const chapterIdChirho = paramsChirho.chapter_id_chirho;

	const bookIdChirho = parseInt(chapterIdChirho.slice(0, 2)) || 1;
	const chapterNumberChirho = parseInt(chapterIdChirho.slice(2, 5)) || 1;

	const verseTimingsChirho = await queryRawChirho<{ verseId: string; start: number }>(
		`
		SELECT t.verse_id AS "verseId", t.start
		FROM verse_audio_timing AS t
		JOIN verse AS v ON v.id = t.verse_id
		WHERE t.recording_id = $1
			AND v.book_id = $2
			AND v.chapter = $3
			AND t.start IS NOT NULL
		ORDER BY t.verse_id
		`,
		[speakerChirho, bookIdChirho, chapterNumberChirho]
	);

	if (verseTimingsChirho.length === 0) {
		return json({ errorChirho: 'No audio timings found' }, { status: 404 });
	}

	// Map to Chirho naming
	const resultChirho: VerseAudioTimingChirho[] = verseTimingsChirho.map((tChirho) => ({
		verseIdChirho: tChirho.verseId,
		startChirho: tChirho.start
	}));

	return json(resultChirho);
};
