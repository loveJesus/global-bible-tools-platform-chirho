<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { themeChirho, type ThemeChirho } from '$lib/stores-chirho/theme-chirho';

	let menuOpenChirho = $state(false);

	function selectThemeChirho(newThemeChirho: ThemeChirho) {
		themeChirho.set(newThemeChirho);
		menuOpenChirho = false;
	}
</script>

<div class="relative">
	<button
		type="button"
		onclick={() => (menuOpenChirho = !menuOpenChirho)}
		class="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
		aria-label="Toggle theme"
		aria-expanded={menuOpenChirho}
	>
		{#if $themeChirho === 'light'}
			<!-- Sun icon -->
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
			</svg>
		{:else if $themeChirho === 'dark'}
			<!-- Moon icon -->
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
			</svg>
		{:else}
			<!-- System icon -->
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
			</svg>
		{/if}
	</button>

	{#if menuOpenChirho}
		<div class="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-lg bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
			<button
				type="button"
				onclick={() => selectThemeChirho('light')}
				class="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 {$themeChirho === 'light' ? 'bg-slate-100 dark:bg-slate-700' : ''}"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
				Light
			</button>
			<button
				type="button"
				onclick={() => selectThemeChirho('dark')}
				class="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 {$themeChirho === 'dark' ? 'bg-slate-100 dark:bg-slate-700' : ''}"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
				</svg>
				Dark
			</button>
			<button
				type="button"
				onclick={() => selectThemeChirho('system')}
				class="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 {$themeChirho === 'system' ? 'bg-slate-100 dark:bg-slate-700' : ''}"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
				System
			</button>
		</div>

		<button
			type="button"
			class="fixed inset-0 z-40 cursor-default"
			onclick={() => (menuOpenChirho = false)}
			onkeydown={(eChirho) => eChirho.key === 'Escape' && (menuOpenChirho = false)}
			aria-label="Close menu"
			tabindex="-1"
		></button>
	{/if}
</div>
