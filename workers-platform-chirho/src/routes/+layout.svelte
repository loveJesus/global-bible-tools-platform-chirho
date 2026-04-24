<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import '../app.css';
	import { page as pageChirho } from '$app/state';
	import type { LayoutData as LayoutDataChirho } from './$types';
	import LocaleSwitcherChirho from '$lib/components-chirho/LocaleSwitcherChirho.svelte';
	import ThemeSwitcherChirho from '$lib/components-chirho/ThemeSwitcherChirho.svelte';
	import FeedbackBubbleChirho from '$lib/components-chirho/FeedbackBubbleChirho.svelte';
	import { tChirho, localeChirho } from '$lib/i18n-chirho';
	import { initThemeChirho } from '$lib/stores-chirho/theme-chirho';

	let { children: childrenChirho, data: dataChirho }: { children: any; data: LayoutDataChirho } = $props();

	// Initialize theme on mount
	$effect(() => {
		initThemeChirho();
	});

	// Initialize locale from server data
	$effect(() => {
		if (dataChirho.localeChirho) {
			localeChirho.set(dataChirho.localeChirho);
		}
	});

	let mobileMenuOpenChirho = $state(false);

	// Hide the default header/footer on landing page (it has its own)
	const isLandingPageChirho = $derived(pageChirho.url.pathname === '/');

	// Close mobile menu on route change
	$effect(() => {
		pageChirho.url.pathname;
		mobileMenuOpenChirho = false;
	});
</script>

<svelte:head>
	<title>bible.systems - Interlinear Bible Reader</title>
	<meta name="description" content="Read the Bible in every language with word-by-word interlinear translations. Powered by globalbibletools.com" />
</svelte:head>

<div class="min-h-screen flex flex-col bg-white dark:bg-slate-900">
	{#if !isLandingPageChirho}
	<header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
		<div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-4 sm:gap-6">
				<!-- Mobile menu button -->
				<button
					type="button"
					onclick={() => (mobileMenuOpenChirho = !mobileMenuOpenChirho)}
					class="sm:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
					aria-label="Toggle menu"
					aria-expanded={mobileMenuOpenChirho}
				>
					{#if mobileMenuOpenChirho}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{:else}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					{/if}
				</button>

				<a href="/" class="flex items-center gap-2">
					<img
						src="https://assets.globalbibletools.com/landing/logo.png"
						alt="bible.systems"
						class="h-8 w-8"
					/>
					<span class="text-xl font-bold text-slate-900 dark:text-white hidden xs:inline">bible.systems</span>
				</a>
				<nav class="hidden sm:flex gap-4">
					<a href="/read-chirho" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">{$tChirho('common.navChirho.readChirho')}</a>
					<a href="/downloads-chirho" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">{$tChirho('common.navChirho.downloadsChirho')}</a>
					<a href="https://globalbibletools.com" target="_blank" rel="noopener noreferrer" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
						Contribute
					</a>
				</nav>
			</div>
			<div class="flex items-center gap-3">
				<ThemeSwitcherChirho />
				<LocaleSwitcherChirho />
			</div>
		</div>
	</header>

	<!-- Mobile navigation menu -->
	{#if mobileMenuOpenChirho}
		<div class="sm:hidden fixed inset-0 z-40">
			<!-- Backdrop -->
			<button
				type="button"
				class="absolute inset-0 bg-black/50"
				onclick={() => (mobileMenuOpenChirho = false)}
				aria-label="Close menu"
			></button>

			<!-- Slide-out menu -->
			<nav class="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-xl flex flex-col">
				<div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
					<span class="font-semibold text-slate-900 dark:text-white">Menu</span>
					<button
						type="button"
						onclick={() => (mobileMenuOpenChirho = false)}
						class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
						aria-label="Close menu"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="flex-1 overflow-y-auto py-2">
					<a href="/read-chirho" class="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
						</svg>
						{$tChirho('common.navChirho.readChirho')}
					</a>
					<a href="/downloads-chirho" class="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						{$tChirho('common.navChirho.downloadsChirho')}
					</a>
					<a href="https://globalbibletools.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
						</svg>
						Contribute
					</a>
				</div>
			</nav>
		</div>
	{/if}
	{/if}

	<main class="flex-1">
		{@render childrenChirho()}
	</main>

	{#if !isLandingPageChirho}
	<footer class="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6">
		<div class="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 dark:text-slate-400">
			<p>bible.systems - Interlinear Bible Reader</p>
			<p class="mt-1">
				Pre-authorized data powering <a href="https://globalbibletools.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">globalbibletools.com</a>
			</p>
		</div>
	</footer>
	{/if}

	<!-- Feedback bubble - appears on all pages -->
	<FeedbackBubbleChirho />
</div>
