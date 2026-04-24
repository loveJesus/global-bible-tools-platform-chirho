<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { page as pageChirho } from '$app/state';
	import { availableLocalesChirho, localeChirho, loadTranslationsChirho } from '$lib/i18n-chirho';

	interface PropsChirho {
		variantChirho?: 'light' | 'dark';
	}

	let { variantChirho = 'light' }: PropsChirho = $props();

	let isOpenChirho = $state(false);
	let currentCodeChirho = $state('en');

	// All available locales from i18n config
	const supportedLocaleCodesChirho = [
		'en', 'es', 'hi', 'fr', 'de', 'pt', 'ru', 'zh', 'ar', 'ja', 'ko', 'id', 'it', 'nl'
	];
	const supportedLocalesChirho = $derived(
		availableLocalesChirho.filter((localeItemChirho) =>
			supportedLocaleCodesChirho.includes(localeItemChirho.codeChirho)
		)
	);

	// Subscribe to locale store
	$effect(() => {
		const unsubscribeChirho = localeChirho.subscribe((valueChirho) => {
			if (valueChirho) {
				currentCodeChirho = valueChirho;
			}
		});
		return unsubscribeChirho;
	});

	// Initialize from cookie/localStorage on mount
	onMount(async () => {
		// Check cookie first
		const cookieMatchChirho = document.cookie.match(/locale=([^;]+)/);
		const savedChirho = cookieMatchChirho?.[1] || localStorage.getItem('locale-chirho');

		// Check if saved locale is in our supported list
		const isValidLocaleChirho = savedChirho && supportedLocalesChirho.some(
			(localeItemChirho) => localeItemChirho.codeChirho === savedChirho
		);

		if (isValidLocaleChirho) {
			await loadTranslationsChirho(savedChirho, pageChirho.url.pathname);
			localeChirho.set(savedChirho);
			currentCodeChirho = savedChirho;
		}
	});

	async function selectLocaleChirho(codeChirho: string) {
		// Load translations for new locale
		await loadTranslationsChirho(codeChirho, pageChirho.url.pathname);
		localeChirho.set(codeChirho);
		currentCodeChirho = codeChirho;
		isOpenChirho = false;

		// Store preference in cookie (accessible by server) and localStorage
		document.cookie = `locale=${codeChirho};path=/;max-age=31536000;SameSite=Lax`;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('locale-chirho', codeChirho);
		}
	}

	const currentLocaleChirho = $derived(
		supportedLocalesChirho.find((localeItemChirho) => localeItemChirho.codeChirho === currentCodeChirho) ||
			supportedLocalesChirho[0]
	);

	const buttonClassChirho = $derived(
		variantChirho === 'dark'
			? 'bg-white/10 text-white hover:bg-white/20'
			: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
	);
</script>

<div class="relative">
	<button
		type="button"
		onclick={() => (isOpenChirho = !isOpenChirho)}
		class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {buttonClassChirho}"
		aria-haspopup="listbox"
		aria-expanded={isOpenChirho}
	>
		<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
			/>
		</svg>
		<span>{currentLocaleChirho?.nativeNameChirho ?? 'English'}</span>
		<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpenChirho}
		<div
			class="absolute right-0 top-full mt-1 z-50 min-w-[160px] max-h-80 overflow-y-auto rounded-lg bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
			role="listbox"
		>
			{#each supportedLocalesChirho as localeItemChirho}
				<button
					type="button"
					role="option"
					aria-selected={localeItemChirho.codeChirho === currentCodeChirho}
					class="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors {localeItemChirho.codeChirho ===
					currentCodeChirho
						? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
						: 'text-slate-700 dark:text-slate-300'}"
					onclick={() => selectLocaleChirho(localeItemChirho.codeChirho)}
				>
					<span>{localeItemChirho.nativeNameChirho}</span>
					{#if localeItemChirho.codeChirho === currentCodeChirho}
						<svg class="h-4 w-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if isOpenChirho}
	<!-- Backdrop to close dropdown -->
	<button
		type="button"
		class="fixed inset-0 z-40 cursor-default"
		onclick={() => (isOpenChirho = false)}
		onkeydown={(eChirho) => eChirho.key === 'Escape' && (isOpenChirho = false)}
		aria-label="Close menu"
		tabindex="-1"
	></button>
{/if}
