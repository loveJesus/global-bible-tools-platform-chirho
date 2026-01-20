// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { Config as ConfigChirho } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	// Disable automatic dark mode - we'll add it manually when ready
	darkMode: 'selector',
	theme: {
		extend: {}
	},
	plugins: []
} satisfies ConfigChirho;
