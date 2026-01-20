<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	function formatCountChirho(countChirho: number): string {
		if (countChirho >= 1000) {
			return `${(countChirho / 1000).toFixed(1)}k`;
		}
		return countChirho.toString();
	}
</script>

<svelte:head>
	<title>Read - Global Bible Tools</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 p-8">
	<div class="mx-auto max-w-4xl">
		<h1 class="text-3xl font-bold text-slate-900">Select a Language</h1>
		<p class="mt-2 text-slate-600">Choose a language to read the Bible translation</p>

		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each dataChirho.languagesChirho as languageChirho}
				<a
					href="/read-chirho/{languageChirho.codeChirho}"
					class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
				>
					<h2 class="text-lg font-semibold text-slate-900">{languageChirho.nameChirho}</h2>
					<p class="text-sm text-slate-500">{languageChirho.codeChirho}</p>
					{#if languageChirho.glossCountChirho > 0}
						<div class="mt-2 flex gap-3 text-xs text-slate-600">
							<span class="flex items-center gap-1">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
								{languageChirho.bookCountChirho} books
							</span>
							<span class="flex items-center gap-1">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
								</svg>
								{formatCountChirho(languageChirho.glossCountChirho)} glosses
							</span>
						</div>
					{:else}
						<p class="mt-2 text-xs text-slate-400 italic">No translations yet</p>
					{/if}
				</a>
			{/each}
		</div>

		{#if dataChirho.languagesChirho.length === 0}
			<p class="mt-8 text-slate-500">No languages available yet.</p>
		{/if}
	</div>
</main>
