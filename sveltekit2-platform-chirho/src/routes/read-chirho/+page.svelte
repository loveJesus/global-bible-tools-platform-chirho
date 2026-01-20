<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';

	let { data: dataChirho }: { data: PageDataChirho } = $props();
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
				</a>
			{/each}
		</div>

		{#if dataChirho.languagesChirho.length === 0}
			<p class="mt-8 text-slate-500">No languages available yet.</p>
		{/if}
	</div>
</main>
