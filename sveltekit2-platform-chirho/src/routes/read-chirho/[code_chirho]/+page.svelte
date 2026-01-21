<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import { tChirho } from '$lib/i18n-chirho';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	function formatVerseCountChirho(countChirho: number): string {
		if (countChirho >= 30000) return $tChirho('common.readChirho.fullBibleChirho');
		if (countChirho >= 7000) return $tChirho('common.bibleChirho.newTestamentChirho');
		if (countChirho >= 1000) return `${Math.round(countChirho / 1000)}k ${$tChirho('common.readChirho.versesChirho')}`;
		return `${countChirho} ${$tChirho('common.readChirho.versesChirho')}`;
	}
</script>

<svelte:head>
	<title>{dataChirho.languageChirho?.nameChirho ?? $tChirho('common.navChirho.readChirho')} - {$tChirho('common.appNameChirho')}</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 p-8">
	<div class="mx-auto max-w-4xl">
		<nav class="mb-4">
			<a href="/read-chirho" class="text-blue-600 hover:underline">← {$tChirho('common.readChirho.languagesChirho')}</a>
		</nav>

		<h1 class="text-3xl font-bold text-slate-900">
			{dataChirho.languageChirho?.nameChirho ?? $tChirho('common.readChirho.unknownLanguageChirho')}
		</h1>
		<p class="mt-2 text-slate-600">{$tChirho('common.bibleChirho.selectBookChirho')}</p>

		<!-- PDF Downloads Section -->
		{#if dataChirho.hasInterlinearPdfChirho || dataChirho.interlinearVersionsChirho?.length > 0 || dataChirho.referenceVersionsChirho.length > 0}
			<section class="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
				<h2 class="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-900">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					{$tChirho('common.downloadsChirho.downloadPdfBiblesChirho')}
				</h2>

				<!-- Interlinear Bibles (GREEN buttons) -->
				{#if dataChirho.interlinearVersionsChirho?.length > 0}
					<div class="mb-3">
						<span class="text-xs font-medium text-emerald-800 uppercase tracking-wide">{$tChirho('common.downloadsChirho.interlinearChirho')}</span>
						<div class="mt-1 flex flex-wrap gap-2">
							<!-- Interlinear PDFs by reference version -->
							{#each dataChirho.interlinearVersionsChirho as versionChirho}
								<a
									href={versionChirho.pdfPathChirho}
									class="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
									download
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
									</svg>
									{versionChirho.nameChirho} Interlinear
								</a>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Reference Bibles (BLUE buttons) -->
				{#if dataChirho.referenceVersionsChirho.length > 0}
					<div>
						<span class="text-xs font-medium text-blue-800 uppercase tracking-wide">{$tChirho('common.downloadsChirho.referenceTextOnlyChirho')}</span>
						<div class="mt-1 flex flex-wrap gap-2">
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
					</div>
				{/if}
			</section>
		{/if}

		<h2 class="mt-8 text-xl font-semibold text-slate-800">{$tChirho('common.readChirho.booksWithTranslationsChirho')}</h2>
		{#if dataChirho.booksChirho.length > 0}
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
		{:else}
			<p class="mt-4 text-slate-500 italic">
				{$tChirho('common.readChirho.noTranslationsForChirho')} {dataChirho.languageChirho?.nameChirho ?? $tChirho('common.readChirho.thisLanguageChirho')}.
			</p>
		{/if}
	</div>
</main>
