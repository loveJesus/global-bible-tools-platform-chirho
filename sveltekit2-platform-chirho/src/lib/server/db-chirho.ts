// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env as envChirho } from '$env/dynamic/private';
import * as schemaChirho from './schema-chirho';

// Type alias for Chirho naming compliance
type PoolChirho = pg.Pool;
type DbChirho = NodePgDatabase<typeof schemaChirho>;

const { Pool: PoolConstructorChirho } = pg;

let poolChirho: PoolChirho | undefined;
let dbInstanceChirho: DbChirho | undefined;

export function getPoolChirho(): PoolChirho {
	if (!poolChirho) {
		const databaseUrlChirho = envChirho.DATABASE_URL_CHIRHO;
		if (!databaseUrlChirho) {
			throw new Error('DATABASE_URL_CHIRHO environment variable is not set');
		}

		poolChirho = new PoolConstructorChirho({
			connectionString: databaseUrlChirho,
			max: 20
		});

		poolChirho.on('error', (errorChirho) => {
			console.error('Unexpected PostgreSQL pool error:', errorChirho);
		});
	}
	return poolChirho;
}

export function getDbChirho(): DbChirho {
	if (!dbInstanceChirho) {
		dbInstanceChirho = drizzle(getPoolChirho(), { schema: schemaChirho });
	}
	return dbInstanceChirho;
}

// Lazy getter for backwards compatibility
export const dbChirho = new Proxy({} as DbChirho, {
	get(_targetChirho, propChirho) {
		return Reflect.get(getDbChirho(), propChirho);
	}
});

export async function queryRawChirho<TChirho>(
	textChirho: string,
	paramsChirho?: unknown[]
): Promise<TChirho[]> {
	const resultChirho = await getPoolChirho().query(textChirho, paramsChirho);
	return resultChirho.rows as TChirho[];
}

export async function transactionChirho<TChirho>(
	fnChirho: Parameters<typeof dbChirho.transaction<TChirho>>[0]
): Promise<TChirho> {
	return await dbChirho.transaction(fnChirho);
}

export async function closeDbChirho(): Promise<void> {
	await poolChirho?.end();
	poolChirho = undefined;
}

// Re-export common Drizzle functions with Chirho suffix wrappers
export {
	count as countChirho,
	eq as eqChirho,
	and as andChirho,
	or as orChirho,
	sql as sqlChirho,
	ne as neChirho,
	gt as gtChirho,
	gte as gteChirho,
	lt as ltChirho,
	lte as lteChirho,
	isNull as isNullChirho,
	isNotNull as isNotNullChirho,
	inArray as inArrayChirho,
	notInArray as notInArrayChirho,
	like as likeChirho,
	ilike as ilikeChirho,
	desc as descChirho,
	asc as ascChirho
} from 'drizzle-orm';
