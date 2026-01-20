<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import { goto as gotoChirho } from '$app/navigation';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	// Reference display mode state
	let referenceDisplayModeChirho = $state<'below' | 'side' | 'hidden'>('hidden');

	// Get CSS class for gloss based on state - improved styling
	// Source values: USER (manually entered), MACHINE (AI-generated imports), IMPORT (legacy), null
	function getGlossClassChirho(stateChirho: string | null, sourceChirho: string | null): string {
		if (!stateChirho) return 'text-slate-400 italic'; // No translation
		if (stateChirho === 'APPROVED') return 'text-emerald-700 font-medium'; // Approved
		if (sourceChirho === 'MACHINE' || sourceChirho === 'IMPORT') return 'text-purple-600 underline decoration-purple-400 decoration-2'; // Machine/imported - purple underline
		return 'text-amber-700 bg-amber-50 rounded px-0.5'; // Pending (USER source) - amber background
	}

	// Navigate to selected book/chapter
	function navigateToChapterChirho(bookIdChirho: number, chapterNumChirho: number): void {
		const chapterIdChirho = `${bookIdChirho.toString().padStart(2, '0')}${chapterNumChirho.toString().padStart(3, '0')}`;
		gotoChirho(`/read-chirho/${dataChirho.codeChirho}/${chapterIdChirho}`);
	}

	function onBookChangeChirho(eventChirho: Event): void {
		const selectChirho = eventChirho.target as HTMLSelectElement;
		const bookIdChirho = parseInt(selectChirho.value, 10);
		navigateToChapterChirho(bookIdChirho, 1);
	}

	function onChapterChangeChirho(eventChirho: Event): void {
		const selectChirho = eventChirho.target as HTMLSelectElement;
		const chapterNumChirho = parseInt(selectChirho.value, 10);
		navigateToChapterChirho(dataChirho.bookChirho?.idChirho ?? 1, chapterNumChirho);
	}

	function onLanguageChangeChirho(eventChirho: Event): void {
		const selectChirho = eventChirho.target as HTMLSelectElement;
		const langCodeChirho = selectChirho.value;
		const chapterIdChirho = `${(dataChirho.bookChirho?.idChirho ?? 1).toString().padStart(2, '0')}${(dataChirho.chapterChirho ?? 1).toString().padStart(3, '0')}`;
		gotoChirho(`/read-chirho/${langCodeChirho}/${chapterIdChirho}`);
	}

	function onRefVersionChangeChirho(eventChirho: Event): void {
		const selectChirho = eventChirho.target as HTMLSelectElement;
		const versionIdChirho = selectChirho.value;
		const urlChirho = new URL(window.location.href);
		urlChirho.searchParams.set('ref', versionIdChirho);
		gotoChirho(urlChirho.pathname + urlChirho.search);
	}

	// Group reference versions by language, with current language first
	function getGroupedVersionsChirho() {
		const versionsChirho = dataChirho.referenceVersionsChirho ?? [];
		const currentLangChirho = dataChirho.codeChirho;
		const langNamesChirho: Record<string, string> = {
			eng: 'English',
			spa: 'Spanish',
			hin: 'Hindi',
			tur: 'Turkish',
			ben: 'Bengali'
		};

		// Group by language
		const groupedChirho = versionsChirho.reduce(
			(accChirho, vChirho) => {
				const langChirho = vChirho.languageCodeChirho;
				if (!accChirho[langChirho]) accChirho[langChirho] = [];
				accChirho[langChirho].push(vChirho);
				return accChirho;
			},
			{} as Record<string, typeof versionsChirho>
		);

		// Sort: current language first, then alphabetically
		const sortedKeysChirho = Object.keys(groupedChirho).sort((aChirho, bChirho) => {
			if (aChirho === currentLangChirho) return -1;
			if (bChirho === currentLangChirho) return 1;
			return (langNamesChirho[aChirho] ?? aChirho).localeCompare(langNamesChirho[bChirho] ?? bChirho);
		});

		return sortedKeysChirho.map((langChirho) => ({
			langCodeChirho: langChirho,
			langNameChirho: langNamesChirho[langChirho] ?? langChirho.toUpperCase(),
			versionsChirho: groupedChirho[langChirho]
		}));
	}

	// Get reference text for a verse and render OSIS markup as HTML
	function getReferenceTextChirho(verseIdChirho: string): string {
		const rawChirho = dataChirho.referenceVersesMapChirho?.[verseIdChirho] ?? '';
		// Convert OSIS markup to HTML
		// <transChange type="added">text</transChange> -> <em>text</em> (italics for supplied words)
		// <w>text</w> -> text (strip word tags)
		return rawChirho
			.replace(/<transChange[^>]*>([^<]*)<\/transChange>/g, '<em>$1</em>')
			.replace(/<w[^>]*>([^<]*)<\/w>/g, '$1')
			.replace(/<[^>]+>/g, ''); // Strip any remaining tags
	}

	// Get PDF download URL for current chapter
	function getPdfUrlChirho(): string {
		const bookNameChirho = dataChirho.bookChirho?.nameChirho?.toLowerCase() ?? 'unknown';
		return `/api-chirho/pdf-chirho/${dataChirho.codeChirho}/${bookNameChirho}?chapter=${dataChirho.chapterChirho}`;
	}
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

		<!-- Navigation: Language / Book / Chapter -->
		<div class="mt-4 flex flex-wrap gap-4 items-center">
			<!-- Language Switcher -->
			<label class="flex items-center gap-2">
				<span class="text-sm text-slate-600">Language:</span>
				<select
					class="border border-slate-300 rounded px-2 py-1 text-sm bg-white"
					value={dataChirho.codeChirho}
					onchange={onLanguageChangeChirho}
				>
					{#each dataChirho.languagesWithTranslationsChirho ?? [] as langChirho}
						<option value={langChirho.codeChirho}>{langChirho.nameChirho}</option>
					{/each}
					{#if !dataChirho.languagesWithTranslationsChirho?.some((lChirho) => lChirho.codeChirho === dataChirho.codeChirho)}
						<option value={dataChirho.codeChirho}>{dataChirho.languageChirho?.nameChirho}</option>
					{/if}
				</select>
			</label>

			<label class="flex items-center gap-2">
				<span class="text-sm text-slate-600">Book:</span>
				<select
					class="border border-slate-300 rounded px-2 py-1 text-sm bg-white"
					value={String(dataChirho.bookChirho?.idChirho ?? '')}
					onchange={onBookChangeChirho}
				>
					{#each dataChirho.allBooksChirho ?? [] as bookOptionChirho}
						<option value={String(bookOptionChirho.idChirho)}>{bookOptionChirho.nameChirho}</option>
					{/each}
				</select>
			</label>

			<label class="flex items-center gap-2">
				<span class="text-sm text-slate-600">Chapter:</span>
				<select
					class="border border-slate-300 rounded px-2 py-1 text-sm bg-white"
					value={String(dataChirho.chapterChirho ?? '')}
					onchange={onChapterChangeChirho}
				>
					{#each dataChirho.chaptersInBookChirho ?? [] as chapterNumChirho}
						<option value={String(chapterNumChirho)}>{chapterNumChirho}</option>
					{/each}
				</select>
			</label>
		</div>

		<!-- Reference Version Controls -->
		<div class="mt-3 flex flex-wrap gap-3 items-center text-sm">
			<span class="text-slate-600">Reference:</span>
			<div class="flex rounded border border-slate-300 overflow-hidden">
				<button
					type="button"
					class="px-2 py-1 {referenceDisplayModeChirho === 'hidden' ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}"
					onclick={() => (referenceDisplayModeChirho = 'hidden')}
					aria-label="Close reference panel"
				>
					Hidden
				</button>
				<button
					type="button"
					class="px-2 py-1 border-x border-slate-300 {referenceDisplayModeChirho === 'below' ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}"
					onclick={() => (referenceDisplayModeChirho = 'below')}
				>
					Below
				</button>
				<button
					type="button"
					class="px-2 py-1 {referenceDisplayModeChirho === 'side' ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}"
					onclick={() => (referenceDisplayModeChirho = 'side')}
				>
					Side
				</button>
			</div>
			{#if dataChirho.referenceVersionsChirho?.length}
				<select
					class="border border-slate-300 rounded px-2 py-1 bg-white text-sm"
					onchange={onRefVersionChangeChirho}
				>
					{#each getGroupedVersionsChirho() as groupChirho}
						<optgroup label={groupChirho.langNameChirho}>
							{#each groupChirho.versionsChirho as versionChirho}
								<option
									value={versionChirho.idChirho}
									selected={versionChirho.idChirho === dataChirho.selectedRefVersionIdChirho}
								>
									{versionChirho.nameChirho}
								</option>
							{/each}
						</optgroup>
					{/each}
				</select>
			{/if}
			<a
				href={getPdfUrlChirho()}
				class="ml-auto px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1"
				download
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
				</svg>
				PDF
			</a>
		</div>

		<!-- Legend for gloss styling -->
		<div class="mt-4 flex flex-wrap gap-4 text-xs">
			<span class="flex items-center gap-1">
				<span class="text-emerald-700 font-medium">text</span>
				<span class="text-slate-600">Approved</span>
			</span>
			<span class="flex items-center gap-1">
				<span class="text-amber-700 bg-amber-50 rounded px-1">text</span>
				<span class="text-slate-600">Pending review</span>
			</span>
			<span class="flex items-center gap-1">
				<span class="text-purple-600 underline decoration-purple-400 decoration-2">text</span>
				<span class="text-slate-600">Imported</span>
			</span>
			<span class="flex items-center gap-1">
				<span class="text-slate-400 italic">—</span>
				<span class="text-slate-600">No translation</span>
			</span>
		</div>

		<div class="mt-6 space-y-6 {referenceDisplayModeChirho === 'side' ? 'mr-80' : ''}">
			{#each dataChirho.versesChirho as verseChirho}
				<div class="verse-container-chirho">
					<!-- Word-by-word gloss view -->
					<div class="flex gap-3">
						<span class="text-sm font-semibold text-slate-400 w-8 pt-1 flex-shrink-0">
							{verseChirho.verseNumberChirho}
						</span>
						<div class="flex flex-wrap gap-x-1 gap-y-3">
							{#each verseChirho.wordsChirho as wordChirho}
								<span
									class="inline-flex flex-col items-center hover:bg-yellow-50 cursor-pointer rounded px-1 py-0.5 transition-colors"
									title="{wordChirho.lemmaIdChirho ?? ''} | {wordChirho.grammarChirho ?? ''}"
								>
									<span class="text-slate-800 text-sm">{wordChirho.textChirho}</span>
									<span
										class="text-xs leading-tight {getGlossClassChirho(wordChirho.glossStateChirho, wordChirho.glossSourceChirho)}"
										style="font-family: {dataChirho.languageChirho?.fontChirho ?? 'Noto Sans'}"
									>
										{wordChirho.glossChirho ?? '—'}
									</span>
								</span>
							{/each}
						</div>
					</div>

					<!-- Reference translation (below mode) -->
					{#if referenceDisplayModeChirho === 'below'}
						{@const refTextChirho = getReferenceTextChirho(verseChirho.verseIdChirho)}
						{#if refTextChirho}
							<div class="ml-8 mt-2 text-sm text-slate-600 border-l-2 border-slate-200 pl-3">
								{@html refTextChirho}
							</div>
						{/if}
					{/if}
				</div>
			{/each}
		</div>

		<!-- Side panel mode for reference translations -->
		{#if referenceDisplayModeChirho === 'side'}
			<aside class="fixed right-0 top-0 w-80 h-full bg-white shadow-lg border-l border-slate-200 overflow-y-auto z-40">
				<div class="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
					<h3 class="font-semibold text-slate-800">{dataChirho.selectedRefVersionNameChirho}</h3>
					<button
						type="button"
						class="text-slate-500 hover:text-slate-700"
						onclick={() => (referenceDisplayModeChirho = 'hidden')}
						aria-label="Close reference panel"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
				<div class="p-4 space-y-4">
					{#each dataChirho.versesChirho as verseChirho}
						{@const refTextChirho = getReferenceTextChirho(verseChirho.verseIdChirho)}
						{#if refTextChirho}
							<p class="text-sm">
								<strong class="text-slate-500">{verseChirho.verseNumberChirho}</strong>
								<span class="text-slate-700">{@html refTextChirho}</span>
							</p>
						{/if}
					{/each}
				</div>
			</aside>
		{/if}

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
