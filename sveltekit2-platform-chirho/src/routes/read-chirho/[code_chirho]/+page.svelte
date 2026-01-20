<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	function formatVerseCountChirho(countChirho: number): string {
		if (countChirho >= 30000) return 'Full Bible';
		if (countChirho >= 7000) return 'New Testament';
		if (countChirho >= 1000) return `${Math.round(countChirho / 1000)}k verses`;
		return `${countChirho} verses`;
	}
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

		<!-- PDF Downloads Section -->
		{#if dataChirho.hasInterlinearPdfChirho || dataChirho.referenceVersionsChirho.length > 0}
			<section class="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
				<h2 class="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-900">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Download Bible PDFs
				</h2>

				<div class="flex flex-wrap gap-2">
					<!-- Interlinear Bible (our translation) -->
					{#if dataChirho.hasInterlinearPdfChirho}
						<a
							href="/bibles-chirho/interlinear-{dataChirho.codeChirho}.pdf"
							class="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
							download
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Interlinear Bible
							<span class="text-xs text-emerald-200">(Greek/Hebrew + {dataChirho.languageChirho?.nameChirho})</span>
						</a>
					{/if}

					<!-- Reference Bibles for this language -->
					{#each dataChirho.referenceVersionsChirho as versionChirho}
						<a
							href="/api-chirho/pdf-chirho/full-bible-chirho/{versionChirho.codeChirho}"
							class="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
							download
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							{versionChirho.nameChirho}
							<span class="text-xs text-blue-200">({formatVerseCountChirho(versionChirho.verseCountChirho)})</span>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<h2 class="mt-8 text-xl font-semibold text-slate-800">Books</h2>
		<div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
