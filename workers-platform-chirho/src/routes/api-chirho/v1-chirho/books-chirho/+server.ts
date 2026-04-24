// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json as jsonChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { getMetaDbChirho } from '$lib/server/d1-resolver-chirho';
import { queryD1Chirho } from '$lib/server/db-d1-chirho';

export const GET: RequestHandlerChirho = async ({ platform: platformChirho }) => {
	// Use any language DB since book data is duplicated — or meta DB if it has books
	const metaDbChirho = getMetaDbChirho(platformChirho);
	if (!metaDbChirho) {
		return jsonChirho({ error_chirho: 'Database not available' }, { status: 503 });
	}

	const booksChirho = await queryD1Chirho<{ id: number; name: string }>(
		metaDbChirho,
		`SELECT id, name FROM book ORDER BY id`
	);

	return jsonChirho({
		data_chirho: booksChirho.map((bChirho) => ({
			id_chirho: bChirho.id,
			name_chirho: bChirho.name
		}))
	});
};
