// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Note: `server` and `allowedHosts` are Vite API keys (not our custom identifiers)
// and cannot be renamed to use Chirho suffix - Vite requires these exact property names
const allowedHostsChirho = ['global-tools.bible.systems', 'localhost', '127.0.0.1'];

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		allowedHosts: allowedHostsChirho
	}
});
