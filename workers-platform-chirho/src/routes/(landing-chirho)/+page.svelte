<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import { tChirho } from '$lib/i18n-chirho';
	import LocaleSwitcherChirho from '$lib/components-chirho/LocaleSwitcherChirho.svelte';
	import ThemeSwitcherChirho from '$lib/components-chirho/ThemeSwitcherChirho.svelte';

	let { data: dataChirho }: { data: PageDataChirho } = $props();
</script>

<svelte:head>
	<title>bible.systems - Interlinear Bible in Every Language</title>
	<meta name="description" content="Read the Bible word-by-word in {dataChirho.totalLanguagesChirho} languages with interlinear translations." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
	<!-- Top bar with switchers -->
	<div class="mx-auto max-w-5xl px-4 pt-4 flex justify-end gap-3">
		<ThemeSwitcherChirho />
		<LocaleSwitcherChirho />
	</div>

	<!-- Hero -->
	<header class="mx-auto max-w-5xl px-4 pt-8 pb-12 text-center">
		<div class="flex justify-center mb-6">
			<img
				src="https://assets.globalbibletools.com/landing/logo.png"
				alt="bible.systems"
				class="h-16 w-16"
			/>
		</div>
		<h1 class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
			bible.systems
		</h1>
		<p class="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
			Interlinear Bible in every language. Word-by-word translations from the original Hebrew and Greek.
		</p>
		<div class="mt-6 flex justify-center gap-4">
			<a
				href="/read-chirho"
				class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium transition-colors"
			>
				Start Reading
			</a>
			<a
				href="/downloads-chirho"
				class="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-lg font-medium transition-colors"
			>
				Download PDFs
			</a>
		</div>
	</header>

	<!-- Stats -->
	<section class="mx-auto max-w-5xl px-4 py-8">
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
			<div>
				<p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{dataChirho.totalLanguagesChirho}</p>
				<p class="text-sm text-slate-600 dark:text-slate-400">Languages</p>
			</div>
			<div>
				<p class="text-3xl font-bold text-blue-600 dark:text-blue-400">31,102</p>
				<p class="text-sm text-slate-600 dark:text-slate-400">Verses per language</p>
			</div>
			<div class="col-span-2 sm:col-span-1">
				<p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{(dataChirho.totalVersesChirho / 1_000_000).toFixed(1)}M+</p>
				<p class="text-sm text-slate-600 dark:text-slate-400">Total translated verses</p>
			</div>
		</div>
	</section>

	<!-- Language Grid -->
	<section class="mx-auto max-w-5xl px-4 py-8">
		<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Available Languages</h2>
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
			{#each dataChirho.languagesChirho as langChirho}
				<a
					href="/read-chirho/{langChirho.codeChirho}"
					class="block p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all bg-white dark:bg-slate-800"
				>
					<p class="font-medium text-slate-900 dark:text-white">{langChirho.nameChirho}</p>
					<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
						{langChirho.verseCountChirho.toLocaleString()} verses
					</p>
				</a>
			{/each}
		</div>
	</section>

	<!-- Attribution -->
	<section class="mx-auto max-w-5xl px-4 py-12 text-center">
		<p class="text-slate-600 dark:text-slate-400">
			Pre-authorized data powering
			<a href="https://globalbibletools.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">
				globalbibletools.com
			</a>
		</p>
	</section>

	<!-- Footer -->
	<footer class="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-8">
		<div class="mx-auto max-w-5xl px-4 text-center text-sm text-slate-500 dark:text-slate-400">
			<p class="italic mb-2">
				"For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life."
			</p>
			<p class="font-medium">John 3:16</p>
		</div>
	</footer>
</div>
