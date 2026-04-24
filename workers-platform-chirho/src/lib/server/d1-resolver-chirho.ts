// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Maps a language code (e.g., 'spa', 'fra') to the D1 binding name
 * in the Cloudflare Workers environment.
 *
 * Binding pattern: DB_LANG_<CODE_UPPER>_CHIRHO
 */
export function getBindingNameChirho(langCodeChirho: string): string {
	return `DB_LANG_${langCodeChirho.toUpperCase()}_CHIRHO`;
}

/**
 * Resolve a per-language D1 database from the platform env.
 * Returns null if the binding doesn't exist (language not provisioned).
 */
export function resolveLanguageDbChirho(
	platformChirho: App.Platform | undefined,
	langCodeChirho: string
): D1Database | null {
	if (!platformChirho?.env) return null;
	const bindingChirho = getBindingNameChirho(langCodeChirho);
	const dbChirho = platformChirho.env[bindingChirho];
	return dbChirho ?? null;
}

/**
 * Get the meta database (language listing, stats, feedback).
 */
export function getMetaDbChirho(platformChirho: App.Platform | undefined): D1Database | null {
	if (!platformChirho?.env) return null;
	return platformChirho.env.DB_META_CHIRHO ?? null;
}
