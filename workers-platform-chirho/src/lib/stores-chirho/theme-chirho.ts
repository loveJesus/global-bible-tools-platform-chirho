// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemeChirho = 'light' | 'dark' | 'system';

// Get initial theme from localStorage or default to 'system'
function getInitialThemeChirho(): ThemeChirho {
	if (!browser) return 'system';
	const storedChirho = localStorage.getItem('theme-chirho');
	if (storedChirho === 'light' || storedChirho === 'dark' || storedChirho === 'system') {
		return storedChirho;
	}
	return 'system';
}

// Create the theme store
function createThemeStoreChirho() {
	const { subscribe, set, update } = writable<ThemeChirho>(getInitialThemeChirho());

	return {
		subscribe,
		set: (valueChirho: ThemeChirho) => {
			if (browser) {
				localStorage.setItem('theme-chirho', valueChirho);
			}
			set(valueChirho);
			applyThemeChirho(valueChirho);
		},
		toggle: () => {
			update((currentChirho) => {
				const nextChirho: ThemeChirho = currentChirho === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('theme-chirho', nextChirho);
				}
				applyThemeChirho(nextChirho);
				return nextChirho;
			});
		}
	};
}

// Apply the theme to the document
export function applyThemeChirho(themeChirho: ThemeChirho) {
	if (!browser) return;

	const rootChirho = document.documentElement;
	const prefersDarkChirho = window.matchMedia('(prefers-color-scheme: dark)').matches;

	if (themeChirho === 'dark' || (themeChirho === 'system' && prefersDarkChirho)) {
		rootChirho.classList.add('dark');
	} else {
		rootChirho.classList.remove('dark');
	}
}

// Initialize theme on load
export function initThemeChirho() {
	if (!browser) return;

	const themeChirho = getInitialThemeChirho();
	applyThemeChirho(themeChirho);

	// Listen for system theme changes
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (eChirho) => {
		const currentThemeChirho = localStorage.getItem('theme-chirho') as ThemeChirho | null;
		if (currentThemeChirho === 'system' || !currentThemeChirho) {
			applyThemeChirho('system');
		}
	});
}

export const themeChirho = createThemeStoreChirho();
