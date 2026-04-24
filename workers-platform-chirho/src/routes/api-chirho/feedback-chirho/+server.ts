// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json as jsonChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { getMetaDbChirho } from '$lib/server/d1-resolver-chirho';

export const POST: RequestHandlerChirho = async ({ request: requestChirho, platform: platformChirho }) => {
	const metaDbChirho = getMetaDbChirho(platformChirho);
	if (!metaDbChirho) {
		return jsonChirho({ errorChirho: 'Database not available' }, { status: 500 });
	}

	const bodyChirho = await requestChirho.json();
	const messageChirho = bodyChirho.messageChirho?.trim();
	const categoryChirho = bodyChirho.categoryChirho ?? 'suggestion';
	const emailChirho = bodyChirho.emailChirho?.trim() ?? null;
	const pageUrlChirho = bodyChirho.pageUrlChirho ?? '';

	if (!messageChirho) {
		return jsonChirho({ errorChirho: 'Message is required' }, { status: 400 });
	}

	const fullMessageChirho = `[${categoryChirho}]${emailChirho ? ` (${emailChirho})` : ''} ${messageChirho}`;

	await metaDbChirho
		.prepare(
			`INSERT INTO feedback_chirho (page_chirho, message_chirho, user_agent_chirho)
			 VALUES (?, ?, ?)`
		)
		.bind(pageUrlChirho, fullMessageChirho, requestChirho.headers.get('user-agent') ?? '')
		.run();

	return jsonChirho({ successChirho: true });
};
