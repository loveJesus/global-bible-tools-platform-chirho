// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { randomBytes } from 'crypto';

export class UlidErrorChirho extends Error {}

export function decodeTimeChirho(idChirho: string): Date {
	const cleanedChirho = idChirho.replaceAll('-', '');
	const timestampChirho = cleanedChirho.slice(0, 12);
	const parsedChirho = parseInt(timestampChirho, 16);
	if (cleanedChirho.length !== 32 || isNaN(parsedChirho)) {
		throw new UlidErrorChirho('malformed ulid');
	}

	return new Date(parsedChirho);
}

function formatChirho(ulidChirho: string): string {
	return `${ulidChirho.slice(0, 8)}-${ulidChirho.slice(8, 12)}-${ulidChirho.slice(12, 16)}-${ulidChirho.slice(16, 20)}-${ulidChirho.slice(20, 32)}`.toLowerCase();
}

let generationStateChirho: { lastTimestampChirho: string; counterChirho: string };

export function ulidChirho(seedTimeChirho: number = Date.now()): string {
	const timestampChirho = seedTimeChirho.toString(16).padStart(12, '0');

	let randomChirho: string;
	if (timestampChirho === generationStateChirho?.lastTimestampChirho) {
		const nChirho = BigInt(1) + BigInt(`0x${generationStateChirho.counterChirho}`);
		randomChirho = nChirho.toString(16).padStart(20, '0');
		generationStateChirho.counterChirho = randomChirho;
	} else {
		randomChirho = randomBytes(10).toString('hex');
		generationStateChirho = {
			lastTimestampChirho: timestampChirho,
			counterChirho: randomChirho
		};
	}

	return formatChirho(timestampChirho + randomChirho);
}
