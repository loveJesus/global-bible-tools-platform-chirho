<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import TranslateWordChirho from '$lib/components-chirho/TranslateWordChirho.svelte';
	import WordDetailPanelChirho from '$lib/components-chirho/WordDetailPanelChirho.svelte';
	import NotesPanelChirho from '$lib/components-chirho/NotesPanelChirho.svelte';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	// Selected words for multi-word linking
	let selectedWordIdsChirho = $state<Set<string>>(new Set());
	let focusedPhraseIdChirho = $state<number | null>(null);

	// Word detail panel state
	let detailPanelOpenChirho = $state(false);
	let detailWordIdChirho = $state<string | null>(null);

	// Notes panel state
	let notesPanelOpenChirho = $state(false);
	let notesWordIdChirho = $state<string | null>(null);

	// Determine if the verse contains Hebrew (OT) or Greek (NT)
	const isHebrewChirho = $derived(
		dataChirho.bookChirho?.idChirho ? dataChirho.bookChirho.idChirho <= 39 : false
	);

	// Toggle word selection for multi-word phrases
	function toggleWordSelectionChirho(wordIdChirho: string) {
		const newSetChirho = new Set(selectedWordIdsChirho);
		if (newSetChirho.has(wordIdChirho)) {
			newSetChirho.delete(wordIdChirho);
		} else {
			newSetChirho.add(wordIdChirho);
		}
		selectedWordIdsChirho = newSetChirho;
	}

	// Create phrase from selected words
	async function linkSelectedWordsChirho() {
		if (selectedWordIdsChirho.size < 2) return;

		const formDataChirho = new FormData();
		formDataChirho.set('wordIds', JSON.stringify([...selectedWordIdsChirho]));
		formDataChirho.set('languageCode', dataChirho.codeChirho);

		try {
			const responseChirho = await fetch('/api-chirho/phrase-chirho', {
				method: 'POST',
				body: formDataChirho
			});

			if (responseChirho.ok) {
				selectedWordIdsChirho = new Set();
				// Reload page to get updated phrases
				window.location.reload();
			}
		} catch (errorChirho) {
			console.error('Error linking words:', errorChirho);
		}
	}
</script>

<svelte:head>
	<title>
		Translate {dataChirho.bookChirho?.nameChirho}
		{dataChirho.chapterChirho}:{dataChirho.verseNumberChirho} - {dataChirho.languageChirho
			?.nameChirho}
	</title>
</svelte:head>

<main class="min-h-screen bg-slate-50">
	<div class="mx-auto max-w-6xl px-4 py-8">
		<!-- Navigation -->
		<nav class="mb-4 flex items-center gap-2 text-sm">
			<a href="/translate-chirho" class="text-blue-600 hover:underline">Languages</a>
			<span class="text-slate-400">/</span>
			<a href="/translate-chirho/{dataChirho.codeChirho}" class="text-blue-600 hover:underline">
				{dataChirho.languageChirho?.nameChirho}
			</a>
			<span class="text-slate-400">/</span>
			<span class="text-slate-600">
				{dataChirho.bookChirho?.nameChirho}
				{dataChirho.chapterChirho}:{dataChirho.verseNumberChirho}
			</span>

			<!-- Link words button -->
			{#if selectedWordIdsChirho.size >= 2}
				<button
					type="button"
					onclick={linkSelectedWordsChirho}
					class="ml-auto rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
				>
					Link {selectedWordIdsChirho.size} Words
				</button>
			{/if}
		</nav>

		<!-- Interlinear Translation View -->
		<div class="rounded-lg border border-slate-200 bg-white p-6">
			<h2 class="mb-4 text-lg font-semibold text-slate-900">
				{dataChirho.bookChirho?.nameChirho}
				{dataChirho.chapterChirho}:{dataChirho.verseNumberChirho}
			</h2>

			<ul
				class="flex flex-wrap gap-1"
				dir={isHebrewChirho ? 'rtl' : 'ltr'}
				role="list"
				aria-label="Words to translate"
			>
				{#each dataChirho.wordsChirho as wordChirho (wordChirho.wordIdChirho)}
					<TranslateWordChirho
						verseIdChirho={dataChirho.verseIdChirho}
						wordChirho={{
							idChirho: wordChirho.wordIdChirho,
							textChirho: wordChirho.textChirho,
							referenceGlossChirho: undefined,
							suggestionsChirho: [],
							machineSuggestionChirho: undefined
						}}
						phraseChirho={{
							idChirho: wordChirho.phraseIdChirho ?? 0,
							wordIdsChirho: [wordChirho.wordIdChirho],
							glossChirho: wordChirho.glossChirho
								? {
										textChirho: wordChirho.glossChirho,
										stateChirho: wordChirho.stateChirho ?? 'UNAPPROVED'
									}
								: undefined
						}}
						languageChirho={{
							codeChirho: dataChirho.codeChirho,
							fontChirho: dataChirho.languageChirho?.fontChirho ?? 'Noto Sans',
							textDirectionChirho: dataChirho.languageChirho?.textDirectionChirho ?? 'ltr',
							isMemberChirho: true
						}}
						isHebrewChirho={isHebrewChirho}
						wordSelectedChirho={selectedWordIdsChirho.has(wordChirho.wordIdChirho)}
						phraseFocusedChirho={focusedPhraseIdChirho === wordChirho.phraseIdChirho}
						onSelectChirho={() => toggleWordSelectionChirho(wordChirho.wordIdChirho)}
						onFocusChirho={() => {
							focusedPhraseIdChirho = wordChirho.phraseIdChirho ?? null;
						}}
						onShowDetailChirho={() => {
							detailWordIdChirho = wordChirho.wordIdChirho;
							detailPanelOpenChirho = true;
						}}
						onOpenNotesChirho={() => {
							notesWordIdChirho = wordChirho.wordIdChirho;
							notesPanelOpenChirho = true;
						}}
					/>
				{/each}
			</ul>
		</div>

		<!-- Preview -->
		<div class="mt-8 rounded-lg border border-slate-200 bg-white p-6">
			<h2 class="mb-4 text-lg font-semibold text-slate-900">Preview</h2>
			<p
				class="text-lg leading-relaxed"
				style="font-family: {dataChirho.languageChirho?.fontChirho ?? 'Noto Sans'}"
				dir={dataChirho.languageChirho?.textDirectionChirho ?? 'ltr'}
			>
				{#each dataChirho.wordsChirho as wordChirho, indexChirho}
					<span class={wordChirho.glossChirho ? '' : 'text-slate-400'}>
						{wordChirho.glossChirho ?? `[${wordChirho.textChirho}]`}{indexChirho <
						dataChirho.wordsChirho.length - 1
							? ' '
							: ''}
					</span>
				{/each}
			</p>
		</div>

		<!-- Keyboard shortcuts help -->
		<div class="mt-4 text-sm text-slate-500">
			<p>
				<strong>Keyboard shortcuts:</strong>
				<kbd class="rounded bg-slate-200 px-1">Enter</kbd> Approve & next •
				<kbd class="rounded bg-slate-200 px-1">Shift+Enter</kbd> Previous •
				<kbd class="rounded bg-slate-200 px-1">Ctrl/Cmd+Enter</kbd> Select for linking •
				<kbd class="rounded bg-slate-200 px-1">Esc</kbd> Save draft
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

	<!-- Word Detail Panel -->
	<WordDetailPanelChirho
		wordIdChirho={detailWordIdChirho}
		languageCodeChirho={dataChirho.codeChirho}
		bind:isOpenChirho={detailPanelOpenChirho}
		onCloseChirho={() => {
			detailPanelOpenChirho = false;
		}}
	/>

	<!-- Notes Panel -->
	<NotesPanelChirho
		wordIdChirho={notesWordIdChirho}
		languageCodeChirho={dataChirho.codeChirho}
		bind:isOpenChirho={notesPanelOpenChirho}
		onCloseChirho={() => {
			notesPanelOpenChirho = false;
		}}
	/>
</main>
