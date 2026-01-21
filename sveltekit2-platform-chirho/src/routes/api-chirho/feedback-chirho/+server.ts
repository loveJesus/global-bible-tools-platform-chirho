// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json as jsonChirho, error as errorChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { queryRawChirho } from '$lib/server/db-chirho';

interface FeedbackRequestChirho {
	categoryChirho: 'bug' | 'suggestion' | 'praise';
	messageChirho: string;
	emailChirho?: string | null;
	pageUrlChirho?: string;
}

export const POST: RequestHandlerChirho = async ({ request: requestChirho, locals: localsChirho }) => {
	try {
		const bodyChirho: FeedbackRequestChirho = await requestChirho.json();

		// Validate required fields
		if (!bodyChirho.messageChirho?.trim()) {
			throw errorChirho(400, 'Message is required');
		}

		if (!['bug', 'suggestion', 'praise'].includes(bodyChirho.categoryChirho)) {
			throw errorChirho(400, 'Invalid category');
		}

		// Get user ID if logged in
		const userIdChirho = localsChirho.userChirho?.idChirho ?? null;

		// Simple sentiment analysis based on category
		const sentimentChirho =
			bodyChirho.categoryChirho === 'praise'
				? 'positive'
				: bodyChirho.categoryChirho === 'bug'
					? 'negative'
					: 'neutral';

		// Try to insert into database (create table if not exists)
		try {
			await queryRawChirho(
				`
				CREATE TABLE IF NOT EXISTS feedback_chirho (
					id_chirho SERIAL PRIMARY KEY,
					user_id_chirho UUID REFERENCES users(id),
					email_chirho TEXT,
					category_chirho TEXT NOT NULL,
					message_chirho TEXT NOT NULL,
					page_url_chirho TEXT,
					status_chirho TEXT DEFAULT 'new',
					ai_sentiment_chirho TEXT,
					admin_reply_chirho TEXT,
					created_at_chirho TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
					updated_at_chirho TIMESTAMP WITH TIME ZONE DEFAULT NOW()
				)
			`,
				[]
			);
		} catch {
			// Table might already exist, ignore
		}

		// Insert feedback
		await queryRawChirho(
			`
			INSERT INTO feedback_chirho (
				user_id_chirho,
				email_chirho,
				category_chirho,
				message_chirho,
				page_url_chirho,
				ai_sentiment_chirho
			) VALUES ($1, $2, $3, $4, $5, $6)
		`,
			[
				userIdChirho,
				bodyChirho.emailChirho || null,
				bodyChirho.categoryChirho,
				bodyChirho.messageChirho.trim(),
				bodyChirho.pageUrlChirho || null,
				sentimentChirho
			]
		);

		// Log for monitoring
		console.log(
			`[feedback] ${sentimentChirho.toUpperCase()} ${bodyChirho.categoryChirho}: "${bodyChirho.messageChirho.substring(0, 50)}..." from ${bodyChirho.pageUrlChirho ?? 'unknown page'}`
		);

		return jsonChirho({ successChirho: true });
	} catch (errChirho) {
		console.error('[feedback] Error:', errChirho);
		throw errorChirho(500, 'Failed to submit feedback');
	}
};
