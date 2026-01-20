<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';

	let { data: dataChirho }: { data: PageDataChirho } = $props();
</script>

<svelte:head>
	<title>{dataChirho.languageChirho?.nameChirho ?? 'Read'} - Global Bible Tools</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 p-8">
	<div class="mx-auto max-w-4xl">
		<nav class="mb-4">
			<a href="/read-chirho" class="text-blue-600 hover:underline">← Languages</a>
		</nav>

		<h1 class="text-3xl font-bold text-slate-900">
			{dataChirho.languageChirho?.nameChirho ?? 'Unknown Language'}
		</h1>
		<p class="mt-2 text-slate-600">Select a book to read</p>

		<div class="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
			{#each dataChirho.booksChirho as bookChirho}
				<a
					href="/read-chirho/{dataChirho.codeChirho}/{bookChirho.idChirho.toString().padStart(2, '0')}001"
					class="rounded border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
				>
					{bookChirho.nameChirho}
				</a>
			{/each}
		</div>
	</div>
</main>
