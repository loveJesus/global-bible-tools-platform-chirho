<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	let selectedWordIdChirho = $state<string | null>(null);
	let glossInputChirho = $state('');

	function selectWordChirho(wordIdChirho: string, currentGlossChirho: string | null) {
		selectedWordIdChirho = wordIdChirho;
		glossInputChirho = currentGlossChirho ?? '';
	}
</script>

<svelte:head>
	<title>
		Translate {dataChirho.bookChirho?.nameChirho} {dataChirho.chapterChirho}:{dataChirho.verseNumberChirho} - {dataChirho.languageChirho?.nameChirho}
	</title>
</svelte:head>

<main class="min-h-screen bg-slate-50">
	<div class="mx-auto max-w-6xl px-4 py-8">
		<!-- Navigation -->
		<nav class="mb-4 flex gap-2 text-sm">
			<a href="/translate-chirho" class="text-blue-600 hover:underline">Languages</a>
			<span class="text-slate-400">/</span>
			<a href="/translate-chirho/{dataChirho.codeChirho}" class="text-blue-600 hover:underline">
				{dataChirho.languageChirho?.nameChirho}
			</a>
			<span class="text-slate-400">/</span>
			<span class="text-slate-600">
				{dataChirho.bookChirho?.nameChirho} {dataChirho.chapterChirho}:{dataChirho.verseNumberChirho}
			</span>
		</nav>

		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Source Text Column -->
			<div class="rounded-lg border border-slate-200 bg-white p-6">
				<h2 class="text-lg font-semibold text-slate-900 mb-4">Source Text</h2>
				<div class="flex flex-wrap gap-1">
					{#each dataChirho.wordsChirho as wordChirho}
						<button
							type="button"
							onclick={() => selectWordChirho(wordChirho.wordIdChirho, wordChirho.glossChirho)}
							class="px-2 py-1 rounded text-lg {selectedWordIdChirho === wordChirho.wordIdChirho
								? 'bg-blue-100 ring-2 ring-blue-500'
								: wordChirho.glossChirho
									? 'bg-green-50 hover:bg-green-100'
									: 'bg-slate-100 hover:bg-slate-200'}"
						>
							{wordChirho.textChirho}
						</button>
					{/each}
				</div>
			</div>

			<!-- Translation Column -->
			<div class="rounded-lg border border-slate-200 bg-white p-6">
				<h2 class="text-lg font-semibold text-slate-900 mb-4">Translation</h2>

				{#if selectedWordIdChirho}
					{@const selectedWordChirho = dataChirho.wordsChirho.find((wordItemChirho) => wordItemChirho.wordIdChirho === selectedWordIdChirho)}
					{#if selectedWordChirho}
						<div class="space-y-4">
							<div>
								<p class="text-2xl font-bold">{selectedWordChirho.textChirho}</p>
								{#if selectedWordChirho.lemmaIdChirho}
									<p class="text-sm text-slate-500">Lemma: {selectedWordChirho.lemmaIdChirho}</p>
								{/if}
								{#if selectedWordChirho.grammarChirho}
									<p class="text-sm text-slate-500">Grammar: {selectedWordChirho.grammarChirho}</p>
								{/if}
							</div>

							<form
								method="POST"
								action="?/updateGlossChirho"
								use:enhanceChirho={() => {
									return async ({ update: updateChirho }) => {
										await updateChirho();
									};
								}}
							>
								<input type="hidden" name="wordIdChirho" value={selectedWordIdChirho} />
								<div class="space-y-2">
									<label for="gloss-input" class="block text-sm font-medium text-slate-700">
										Translation
									</label>
									<input
										id="gloss-input"
										type="text"
										name="glossChirho"
										bind:value={glossInputChirho}
										class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										placeholder="Enter translation..."
									/>
									<div class="flex gap-2">
										<button
											type="submit"
											class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
										>
											Save
										</button>
										<button
											type="submit"
											name="approveChirho"
											value="true"
											class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
										>
											Save & Approve
										</button>
									</div>
								</div>
							</form>
						</div>
					{/if}
				{:else}
					<p class="text-slate-500">Select a word to translate</p>
				{/if}
			</div>
		</div>

		<!-- Preview -->
		<div class="mt-8 rounded-lg border border-slate-200 bg-white p-6">
			<h2 class="text-lg font-semibold text-slate-900 mb-4">Preview</h2>
			<p class="text-lg leading-relaxed" style="font-family: {dataChirho.languageChirho?.fontChirho ?? 'Noto Sans'}">
				{#each dataChirho.wordsChirho as wordChirho, indexChirho}
					<span class="{wordChirho.glossChirho ? '' : 'text-slate-400'}">
						{wordChirho.glossChirho ?? `[${wordChirho.textChirho}]`}{indexChirho < dataChirho.wordsChirho.length - 1 ? ' ' : ''}
					</span>
				{/each}
			</p>
		</div>

		<!-- Verse navigation -->
		<div class="mt-8 flex justify-between">
			{#if dataChirho.prevVerseIdChirho}
				<a
					href="/translate-chirho/{dataChirho.codeChirho}/{dataChirho.prevVerseIdChirho}"
					class="text-blue-600 hover:underline"
				>
					← Previous Verse
				</a>
			{:else}
				<span></span>
			{/if}

			{#if dataChirho.nextVerseIdChirho}
				<a
					href="/translate-chirho/{dataChirho.codeChirho}/{dataChirho.nextVerseIdChirho}"
					class="text-blue-600 hover:underline"
				>
					Next Verse →
				</a>
			{/if}
		</div>
	</div>
</main>
