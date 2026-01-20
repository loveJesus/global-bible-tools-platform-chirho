<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';

	let { data: dataChirho }: { data: PageDataChirho } = $props();
</script>

<svelte:head>
	<title>Translate - Global Bible Tools</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 p-8">
	<div class="mx-auto max-w-4xl">
		<h1 class="text-3xl font-bold text-slate-900">Translate</h1>
		<p class="mt-2 text-slate-600">Select a language to contribute translations</p>

		{#if !dataChirho.userChirho}
			<div class="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
				<p class="text-yellow-800">
					<a href="/login-chirho" class="font-semibold underline">Sign in</a> to contribute translations.
				</p>
			</div>
		{/if}

		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each dataChirho.languagesChirho as languageChirho}
				<a
					href="/translate-chirho/{languageChirho.codeChirho}"
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
