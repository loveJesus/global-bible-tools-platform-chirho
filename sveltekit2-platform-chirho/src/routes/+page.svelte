<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';

	let { data: dataChirho }: { data: PageDataChirho } = $props();
</script>

<main class="min-h-screen bg-slate-50">
	<div class="mx-auto max-w-4xl px-4 py-16">
		<h1 class="text-4xl font-bold text-slate-900">Global Bible Tools</h1>
		<p class="mt-4 text-lg text-slate-600">
			Collaborative platform for Bible translation
		</p>

		<div class="mt-8 grid gap-4 sm:grid-cols-2">
			<a
				href="/read-chirho"
				class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
			>
				<h2 class="text-xl font-semibold text-slate-900">Read</h2>
				<p class="mt-2 text-slate-600">Browse translations in different languages</p>
			</a>

			<a
				href="/translate-chirho"
				class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
			>
				<h2 class="text-xl font-semibold text-slate-900">Translate</h2>
				<p class="mt-2 text-slate-600">Contribute to Bible translations</p>
			</a>
		</div>

		{#if dataChirho.booksCountChirho}
			<p class="mt-8 text-sm text-slate-500">
				Database connected: {dataChirho.booksCountChirho} books loaded
			</p>
		{/if}
	</div>
</main>
