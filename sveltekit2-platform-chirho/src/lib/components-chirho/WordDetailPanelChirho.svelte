<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	interface WordDetailChirho {
		wordChirho: {
			idChirho: string;
			textChirho: string;
			formIdChirho: string | null;
			lemmaIdChirho: string | null;
			grammarChirho: string | null;
			grammarParsingChirho: Record<string, string> | null;
		};
		lemmaOccurrenceCountChirho: number;
		lexiconEntriesChirho: Array<{
			resourceCodeChirho: string;
			contentChirho: string;
		}>;
		otherTranslationsChirho: Array<{
			languageCodeChirho: string;
			languageNameChirho: string;
			glossChirho: string;
			stateChirho: string | null;
			verseIdChirho: string;
		}>;
	}

	let {
		wordIdChirho,
		languageCodeChirho,
		isOpenChirho = $bindable(false),
		onCloseChirho
	}: {
		wordIdChirho: string | null;
		languageCodeChirho: string;
		isOpenChirho: boolean;
		onCloseChirho: () => void;
	} = $props();

	let loadingChirho = $state(false);
	let errorChirho = $state<string | null>(null);
	let detailChirho = $state<WordDetailChirho | null>(null);
	let expandedSectionsChirho = $state<Set<string>>(new Set(['grammar', 'lexicon']));

	// Fetch word details when wordId changes
	$effect(() => {
		if (wordIdChirho && isOpenChirho) {
			fetchWordDetailChirho(wordIdChirho);
		}
	});

	async function fetchWordDetailChirho(wordIdChirho: string) {
		loadingChirho = true;
		errorChirho = null;

		try {
			const responseChirho = await fetch(
				`/api-chirho/word-detail-chirho?wordId=${encodeURIComponent(wordIdChirho)}&languageCode=${encodeURIComponent(languageCodeChirho)}`
			);

			if (!responseChirho.ok) {
				const errChirho = await responseChirho.json();
				throw new Error(errChirho.errorChirho || 'Failed to fetch word details');
			}

			detailChirho = await responseChirho.json();
		} catch (errChirho) {
			errorChirho = errChirho instanceof Error ? errChirho.message : 'Unknown error';
		} finally {
			loadingChirho = false;
		}
	}

	function toggleSectionChirho(sectionChirho: string) {
		const newSetChirho = new Set(expandedSectionsChirho);
		if (newSetChirho.has(sectionChirho)) {
			newSetChirho.delete(sectionChirho);
		} else {
			newSetChirho.add(sectionChirho);
		}
		expandedSectionsChirho = newSetChirho;
	}

	function getResourceNameChirho(codeChirho: string): string {
		const namesChirho: Record<string, string> = {
			BDB: "Brown-Driver-Briggs (Hebrew)",
			LSJ: "Liddell-Scott-Jones (Greek)",
			STRONGS: "Strong's Concordance"
		};
		return namesChirho[codeChirho] ?? codeChirho;
	}

	// Close on escape key
	function handleKeydownChirho(eventChirho: KeyboardEvent) {
		if (eventChirho.key === 'Escape' && isOpenChirho) {
			onCloseChirho();
		}
	}
</script>

<svelte:window on:keydown={handleKeydownChirho} />

{#if isOpenChirho}
	<!-- Backdrop -->
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/30"
		onclick={onCloseChirho}
		aria-label="Close panel"
	></button>

	<!-- Panel -->
	<div
		class="fixed right-0 top-0 z-50 h-full w-96 max-w-full overflow-y-auto bg-white shadow-xl"
		role="dialog"
		aria-modal="true"
		aria-labelledby="word-detail-title-chirho"
	>
		<!-- Header -->
		<header class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
			<h2 id="word-detail-title-chirho" class="text-lg font-semibold text-slate-900">
				Word Details
			</h2>
			<button
				type="button"
				onclick={onCloseChirho}
				class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
				aria-label="Close"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</header>

		<div class="p-4">
			{#if loadingChirho}
				<div class="flex items-center justify-center py-12">
					<div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
				</div>
			{:else if errorChirho}
				<div class="rounded-lg bg-red-50 p-4 text-red-700">
					<p class="font-medium">Error</p>
					<p class="text-sm">{errorChirho}</p>
				</div>
			{:else if detailChirho}
				<!-- Word Display -->
				<div class="mb-6 text-center">
					<p class="text-4xl font-medium text-slate-900" dir="auto">
						{detailChirho.wordChirho.textChirho}
					</p>
					{#if detailChirho.wordChirho.lemmaIdChirho}
						<p class="mt-2 text-sm text-slate-500">
							Lemma: <span class="font-mono text-blue-600">{detailChirho.wordChirho.lemmaIdChirho}</span>
							<span class="ml-2">({detailChirho.lemmaOccurrenceCountChirho} occurrences)</span>
						</p>
					{/if}
				</div>

				<!-- Grammar Section -->
				<section class="mb-4">
					<button
						type="button"
						class="flex w-full items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-200"
						onclick={() => toggleSectionChirho('grammar')}
					>
						<span>Grammar</span>
						<svg
							class="h-4 w-4 transition-transform {expandedSectionsChirho.has('grammar') ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if expandedSectionsChirho.has('grammar')}
						<div class="mt-2 rounded-lg border border-slate-200 bg-white p-3">
							{#if detailChirho.wordChirho.grammarParsingChirho}
								<dl class="space-y-1 text-sm">
									{#each Object.entries(detailChirho.wordChirho.grammarParsingChirho) as [keyChirho, valueChirho]}
										<div class="flex justify-between">
											<dt class="text-slate-500">{keyChirho}</dt>
											<dd class="font-medium text-slate-900">{valueChirho}</dd>
										</div>
									{/each}
								</dl>
							{:else if detailChirho.wordChirho.grammarChirho}
								<p class="font-mono text-sm text-slate-600">{detailChirho.wordChirho.grammarChirho}</p>
							{:else}
								<p class="text-sm italic text-slate-400">No grammar data available</p>
							{/if}
						</div>
					{/if}
				</section>

				<!-- Lexicon Section -->
				<section class="mb-4">
					<button
						type="button"
						class="flex w-full items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-200"
						onclick={() => toggleSectionChirho('lexicon')}
					>
						<span>Lexicon</span>
						<svg
							class="h-4 w-4 transition-transform {expandedSectionsChirho.has('lexicon') ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if expandedSectionsChirho.has('lexicon')}
						<div class="mt-2 space-y-3">
							{#if detailChirho.lexiconEntriesChirho.length > 0}
								{#each detailChirho.lexiconEntriesChirho as entryChirho}
									<div class="rounded-lg border border-slate-200 bg-white p-3">
										<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
											{getResourceNameChirho(entryChirho.resourceCodeChirho)}
										</h4>
										<div class="prose prose-sm max-w-none text-slate-700">
											{@html entryChirho.contentChirho}
										</div>
									</div>
								{/each}
							{:else}
								<div class="rounded-lg border border-slate-200 bg-white p-3">
									<p class="text-sm italic text-slate-400">No lexicon entries available</p>
								</div>
							{/if}
						</div>
					{/if}
				</section>

				<!-- Other Translations Section -->
				<section class="mb-4">
					<button
						type="button"
						class="flex w-full items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-200"
						onclick={() => toggleSectionChirho('translations')}
					>
						<span>Other Translations ({detailChirho.otherTranslationsChirho.length})</span>
						<svg
							class="h-4 w-4 transition-transform {expandedSectionsChirho.has('translations') ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if expandedSectionsChirho.has('translations')}
						<div class="mt-2 rounded-lg border border-slate-200 bg-white">
							{#if detailChirho.otherTranslationsChirho.length > 0}
								<ul class="divide-y divide-slate-100">
									{#each detailChirho.otherTranslationsChirho as transChirho}
										<li class="flex items-center justify-between px-3 py-2">
											<div>
												<span class="font-medium text-slate-900">{transChirho.glossChirho}</span>
												<span class="ml-2 text-xs text-slate-500">({transChirho.languageNameChirho})</span>
											</div>
											<span class="text-xs {transChirho.stateChirho === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'}">
												{transChirho.stateChirho === 'APPROVED' ? '✓' : '○'}
											</span>
										</li>
									{/each}
								</ul>
							{:else}
								<p class="p-3 text-sm italic text-slate-400">No translations found for this lemma</p>
							{/if}
						</div>
					{/if}
				</section>

				<!-- Word ID (for debugging/reference) -->
				<div class="mt-6 text-center text-xs text-slate-400">
					Word ID: {detailChirho.wordChirho.idChirho}
				</div>
			{:else}
				<p class="text-center text-slate-500">Select a word to view details</p>
			{/if}
		</div>
	</div>
{/if}
