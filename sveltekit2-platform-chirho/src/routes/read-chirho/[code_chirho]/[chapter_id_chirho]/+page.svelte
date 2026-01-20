<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import { goto as gotoChirho } from '$app/navigation';
	import AudioDialogChirho from '$lib/components-chirho/AudioDialogChirho.svelte';
	import { tChirho } from '$lib/i18n-chirho';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	// Audio dialog state
	let showAudioChirho = $state(false);
	let highlightedVerseChirho = $state<string | undefined>(undefined);

	// Reference display mode state
	let referenceDisplayModeChirho = $state<'below' | 'side' | 'hidden'>('hidden');

	// RTL state - auto-detect for Hebrew (OT books 1-39)
	const isHebrewBookChirho = $derived((dataChirho.bookChirho?.idChirho ?? 40) <= 39);
	let forceRtlChirho = $state<boolean | null>(null); // null = auto, true = force RTL, false = force LTR
	const isRtlChirho = $derived(forceRtlChirho === null ? isHebrewBookChirho : forceRtlChirho);

	// N-dash toggle - hide n-dashes (–) when true
	let hideNdashChirho = $state(false);

	// Format gloss text - optionally remove n-dashes
	function formatGlossChirho(glossChirho: string | null): string {
		if (!glossChirho) return '—';
		if (hideNdashChirho) {
			return glossChirho.replace(/–/g, ' ').replace(/\s+/g, ' ').trim();
		}
		return glossChirho;
	}

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
			<a href="/read-chirho" class="text-blue-600 hover:underline">{$tChirho('common.readChirho.languagesChirho')}</a>
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
				<span class="text-sm text-slate-600">{$tChirho('common.readChirho.languageChirho')}:</span>
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

			<!-- N-dash toggle (next to language) -->
			<label class="flex items-center gap-1.5 cursor-pointer text-sm">
				<input
					type="checkbox"
					bind:checked={hideNdashChirho}
					class="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
				/>
				<span class="text-slate-600">{$tChirho('common.readChirho.hideDashesChirho')}</span>
			</label>

			<label class="flex items-center gap-2">
				<span class="text-sm text-slate-600">{$tChirho('common.bibleChirho.bookChirho')}:</span>
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
				<span class="text-sm text-slate-600">{$tChirho('common.bibleChirho.chapterChirho')}:</span>
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

			<span class="text-slate-300">|</span>

			<!-- Audio Button -->
			<button
				type="button"
				onclick={() => (showAudioChirho = true)}
				class="flex items-center gap-1.5 px-2 py-1 rounded border border-slate-300 text-sm text-slate-600 bg-white hover:bg-slate-50 transition-colors"
				title={$tChirho('common.readChirho.listenAudioChirho')}
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
				</svg>
				{$tChirho('common.readChirho.audioChirho')}
			</button>

			<!-- Biblical Hebrew GPT Link -->
			<a
				href="https://chatgpt.com/g/g-67721a4d937c81918c7daf9e4ad7a803-biblical-hebrew-encyclopedia-and-grammar"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-1.5 px-2 py-1 rounded border border-slate-300 text-sm text-slate-600 bg-white hover:bg-slate-50 transition-colors"
				title="Biblical Hebrew GPT"
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
					<path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
				</svg>
				GPT
			</a>
		</div>

		<!-- Display Controls: RTL toggle + Reference -->
		<div class="mt-3 flex flex-wrap gap-3 items-center text-sm">
			<!-- RTL Toggle -->
			<span class="text-slate-600">{$tChirho('common.readChirho.directionChirho')}:</span>
			<div class="flex rounded border border-slate-300 overflow-hidden">
				<button
					type="button"
					class="px-2 py-1 {!isRtlChirho ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}"
					onclick={() => (forceRtlChirho = false)}
				>
					LTR →
				</button>
				<button
					type="button"
					class="px-2 py-1 border-x border-slate-300 {forceRtlChirho === null ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}"
					onclick={() => (forceRtlChirho = null)}
				>
					Auto
				</button>
				<button
					type="button"
					class="px-2 py-1 {isRtlChirho && forceRtlChirho !== null ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}"
					onclick={() => (forceRtlChirho = true)}
				>
					← RTL
				</button>
			</div>

			<span class="text-slate-300">|</span>

			<span class="text-slate-600">{$tChirho('common.readChirho.referenceChirho')}:</span>
			<div class="flex rounded border border-slate-300 overflow-hidden">
				<button
					type="button"
					class="px-2 py-1 {referenceDisplayModeChirho === 'hidden' ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}"
					onclick={() => (referenceDisplayModeChirho = 'hidden')}
					aria-label={$tChirho('common.readChirho.closeReferencePanelChirho')}
				>
					{$tChirho('common.readChirho.hiddenChirho')}
				</button>
				<button
					type="button"
					class="px-2 py-1 border-x border-slate-300 {referenceDisplayModeChirho === 'below' ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}"
					onclick={() => (referenceDisplayModeChirho = 'below')}
				>
					{$tChirho('common.readChirho.belowChirho')}
				</button>
				<button
					type="button"
					class="px-2 py-1 {referenceDisplayModeChirho === 'side' ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}"
					onclick={() => (referenceDisplayModeChirho = 'side')}
				>
					{$tChirho('common.readChirho.sideChirho')}
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
				<span class="text-slate-600">{$tChirho('common.translateChirho.approvedChirho')}</span>
			</span>
			<span class="flex items-center gap-1">
				<span class="text-amber-700 bg-amber-50 rounded px-1">text</span>
				<span class="text-slate-600">{$tChirho('common.translateChirho.pendingReviewChirho')}</span>
			</span>
			<span class="flex items-center gap-1">
				<span class="text-purple-600 underline decoration-purple-400 decoration-2">text</span>
				<span class="text-slate-600">{$tChirho('common.translateChirho.importedChirho')}</span>
			</span>
			<span class="flex items-center gap-1">
				<span class="text-slate-400 italic">—</span>
				<span class="text-slate-600">{$tChirho('common.translateChirho.noTranslationChirho')}</span>
			</span>
		</div>

		<div class="mt-6 space-y-6 {referenceDisplayModeChirho === 'side' ? 'mr-80' : ''}">
			{#each dataChirho.versesChirho as verseChirho}
				<div class="verse-container-chirho">
					<!-- Word-by-word gloss view -->
					<div class="flex gap-3" dir={isRtlChirho ? 'rtl' : 'ltr'}>
						<span class="text-sm font-semibold text-slate-400 w-8 pt-1 flex-shrink-0">
							{verseChirho.verseNumberChirho}
						</span>
						<div class="flex flex-wrap gap-x-1 gap-y-3">
							{#each verseChirho.wordsChirho as wordChirho}
								<span
									class="inline-flex flex-col items-center hover:bg-yellow-50 cursor-pointer rounded px-1 py-0.5 transition-colors"
									dir="ltr"
									title="{wordChirho.lemmaIdChirho ?? ''} | {wordChirho.grammarChirho ?? ''}"
								>
									<span class="text-slate-800 text-sm">{wordChirho.textChirho}</span>
									<span
										class="text-xs leading-tight {getGlossClassChirho(wordChirho.glossStateChirho, wordChirho.glossSourceChirho)}"
										style="font-family: {dataChirho.languageChirho?.fontChirho ?? 'Noto Sans'}"
									>
										{formatGlossChirho(wordChirho.glossChirho)}
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
					← {$tChirho('common.readChirho.previousChapterChirho')}
				</a>
			{:else}
				<span></span>
			{/if}

			{#if dataChirho.nextChapterIdChirho}
				<a
					href="/read-chirho/{dataChirho.codeChirho}/{dataChirho.nextChapterIdChirho}"
					class="text-blue-600 hover:underline"
				>
					{$tChirho('common.readChirho.nextChapterChirho')} →
				</a>
			{/if}
		</div>
	</div>
</main>

<!-- Audio Dialog -->
{#if showAudioChirho}
	<AudioDialogChirho
		chapterIdChirho={`${(dataChirho.bookChirho?.idChirho ?? 1).toString().padStart(2, '0')}${(dataChirho.chapterChirho ?? 1).toString().padStart(3, '0')}`}
		onVerseChangeChirho={(verseIdChirho) => (highlightedVerseChirho = verseIdChirho)}
		onCloseChirho={() => {
			showAudioChirho = false;
			highlightedVerseChirho = undefined;
		}}
	/>
{/if}
