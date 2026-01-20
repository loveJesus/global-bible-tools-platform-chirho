<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';

	let { data: dataChirho }: { data: PageDataChirho } = $props();
</script>

<svelte:head>
	<title>
		{dataChirho.bookChirho?.nameChirho} {dataChirho.chapterChirho} - {dataChirho.languageChirho?.nameChirho}
	</title>
</svelte:head>

<main class="min-h-screen bg-slate-50">
	<div class="mx-auto max-w-4xl px-4 py-8">
		<nav class="mb-4 flex gap-2 text-sm">
			<a href="/read-chirho" class="text-blue-600 hover:underline">Languages</a>
			<span class="text-slate-400">/</span>
			<a href="/read-chirho/{dataChirho.codeChirho}" class="text-blue-600 hover:underline">
				{dataChirho.languageChirho?.nameChirho}
			</a>
			<span class="text-slate-400">/</span>
			<span class="text-slate-600">{dataChirho.bookChirho?.nameChirho} {dataChirho.chapterChirho}</span>
		</nav>

		<h1 class="text-2xl font-bold text-slate-900">
			{dataChirho.bookChirho?.nameChirho} {dataChirho.chapterChirho}
		</h1>

		<div class="mt-6 space-y-4">
			{#each dataChirho.versesChirho as verseChirho}
				<div class="flex gap-2">
					<span class="text-sm font-semibold text-slate-400 w-8">
						{verseChirho.verseNumberChirho}
					</span>
					<p class="text-slate-800 leading-relaxed" style="font-family: {dataChirho.languageChirho?.fontChirho ?? 'Noto Sans'}">
						{#each verseChirho.wordsChirho as wordChirho, indexChirho}
							<span
								class="inline hover:bg-yellow-100 cursor-pointer rounded"
								title={wordChirho.lemmaIdChirho ?? ''}
							>{wordChirho.glossChirho ?? wordChirho.textChirho}{indexChirho < verseChirho.wordsChirho.length - 1 ? ' ' : ''}</span>
						{/each}
					</p>
				</div>
			{/each}
		</div>

		<!-- Chapter navigation -->
		<div class="mt-8 flex justify-between">
			{#if dataChirho.prevChapterIdChirho}
				<a
					href="/read-chirho/{dataChirho.codeChirho}/{dataChirho.prevChapterIdChirho}"
					class="text-blue-600 hover:underline"
				>
					← Previous Chapter
				</a>
			{:else}
				<span></span>
			{/if}

			{#if dataChirho.nextChapterIdChirho}
				<a
					href="/read-chirho/{dataChirho.codeChirho}/{dataChirho.nextChapterIdChirho}"
					class="text-blue-600 hover:underline"
				>
					Next Chapter →
				</a>
			{/if}
		</div>
	</div>
</main>
