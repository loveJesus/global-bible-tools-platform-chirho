<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { enhance } from '$app/forms';

	// Props interface
	interface WordChirho {
		idChirho: string;
		textChirho: string;
		referenceGlossChirho?: string;
		suggestionsChirho: string[];
		machineSuggestionChirho?: string;
	}

	interface PhraseChirho {
		idChirho: number;
		wordIdsChirho: string[];
		glossChirho?: { textChirho: string; stateChirho: string };
		translatorNoteChirho?: {
			authorNameChirho: string;
			timestampChirho: string;
			contentChirho: string;
		};
		footnoteChirho?: { authorNameChirho: string; timestampChirho: string; contentChirho: string };
	}

	interface LanguageChirho {
		codeChirho: string;
		fontChirho: string;
		textDirectionChirho: 'ltr' | 'rtl';
		isMemberChirho: boolean;
	}

	interface PropsChirho {
		verseIdChirho: string;
		wordChirho: WordChirho;
		phraseChirho: PhraseChirho;
		backtranslationChirho?: string;
		languageChirho: LanguageChirho;
		isHebrewChirho: boolean;
		wordSelectedChirho: boolean;
		phraseFocusedChirho: boolean;
		onSelectChirho?: () => void;
		onFocusChirho?: () => void;
		onShowDetailChirho?: () => void;
		onOpenNotesChirho?: () => void;
	}

	let {
		verseIdChirho,
		wordChirho,
		phraseChirho,
		backtranslationChirho,
		languageChirho,
		isHebrewChirho,
		wordSelectedChirho,
		phraseFocusedChirho,
		onSelectChirho,
		onFocusChirho,
		onShowDetailChirho,
		onOpenNotesChirho
	}: PropsChirho = $props();

	// State
	let savingChirho = $state(false);
	let inputValueChirho = $state('');
	// Element refs don't need to be reactive - Svelte handles bind:this specially
	let inputRefChirho: HTMLInputElement = $state(null!);
	let rootRefChirho: HTMLLIElement = $state(null!);
	let autosaveQueuedChirho = $state(false);
	// Track local save state until page refresh
	let savedStateChirho = $state<'APPROVED' | 'UNAPPROVED' | null>(null);

	// Computed values
	const editableChirho = $derived(languageChirho.isMemberChirho);
	const isMultiWordChirho = $derived((phraseChirho?.wordIdsChirho.length ?? 0) > 1);
	const googleTranslateSuggestionChirho = $derived(wordChirho.machineSuggestionChirho);

	const hasMachineSuggestionChirho = $derived(
		!isMultiWordChirho &&
			!phraseChirho.glossChirho?.textChirho &&
			wordChirho.suggestionsChirho.length === 0 &&
			!!googleTranslateSuggestionChirho
	);

	const glossValueChirho = $derived(
		phraseChirho?.glossChirho?.textChirho ||
			(isMultiWordChirho
				? undefined
				: wordChirho.suggestionsChirho[0] || googleTranslateSuggestionChirho)
	);

	const hasNoteChirho = $derived(
		!!phraseChirho.footnoteChirho?.contentChirho ||
			!!phraseChirho.translatorNoteChirho?.contentChirho
	);

	const statusChirho = $derived.by(() => {
		if (savingChirho) return 'saving';
		// Use local saved state if we saved in this session
		if (savedStateChirho) {
			return savedStateChirho === 'APPROVED' ? 'approved' : 'saved';
		}
		if (phraseChirho?.glossChirho?.textChirho) {
			return phraseChirho.glossChirho.stateChirho === 'APPROVED' ? 'approved' : 'saved';
		}
		return 'empty';
	});

	const isFirstWordInPhraseChirho = $derived(
		phraseChirho.wordIdsChirho.indexOf(wordChirho.idChirho) === 0
	);

	// Initialize input value
	$effect(() => {
		if (glossValueChirho !== undefined) {
			inputValueChirho = glossValueChirho;
		}
	});

	// Save function
	async function saveGlossChirho(stateChirho: 'APPROVED' | 'UNAPPROVED') {
		savingChirho = true;
		autosaveQueuedChirho = false;

		const formDataChirho = new FormData();
		formDataChirho.set('wordId', wordChirho.idChirho);
		formDataChirho.set('languageCode', languageChirho.codeChirho);
		formDataChirho.set('phraseId', phraseChirho.idChirho.toString());
		formDataChirho.set('state', stateChirho);
		formDataChirho.set('gloss', inputValueChirho);

		try {
			const responseChirho = await fetch('/api-chirho/gloss-chirho', {
				method: 'POST',
				body: formDataChirho
			});

			if (responseChirho.ok) {
				// Track local saved state until page refresh
				savedStateChirho = stateChirho;
			} else {
				console.error('Failed to save gloss');
			}
		} catch (errorChirho) {
			console.error('Error saving gloss:', errorChirho);
		}

		savingChirho = false;
	}

	// Autosave with debounce
	function handleInputChangeChirho() {
		autosaveQueuedChirho = true;
		setTimeout(() => {
			if (autosaveQueuedChirho && inputValueChirho !== phraseChirho.glossChirho?.textChirho) {
				saveGlossChirho('UNAPPROVED');
			}
		}, 200);
	}

	// Keyboard navigation
	function handleKeyDownChirho(eventChirho: KeyboardEvent) {
		if (eventChirho.altKey) return;

		switch (eventChirho.key) {
			case 'Enter': {
				eventChirho.preventDefault();
				if (eventChirho.shiftKey) {
					// Go to previous word
					const prevChirho = rootRefChirho?.previousElementSibling;
					(prevChirho?.querySelector('input') as HTMLInputElement)?.focus();
				} else if (eventChirho.metaKey || eventChirho.ctrlKey) {
					// Select word for linking
					if (!isMultiWordChirho) {
						onSelectChirho?.();
					}
				} else {
					// Approve and go to next
					saveGlossChirho('APPROVED');
					const nextRootChirho = rootRefChirho?.nextElementSibling;
					const nextChirho =
						nextRootChirho?.querySelector('input:not([type])') ??
						nextRootChirho?.querySelector('button');
					if (nextChirho instanceof HTMLElement) {
						nextChirho.focus();
					}
				}
				break;
			}
			case 'Escape': {
				if (eventChirho.metaKey || eventChirho.ctrlKey || eventChirho.shiftKey) return;
				saveGlossChirho('UNAPPROVED');
				break;
			}
		}
	}

	// Handle word click with Alt
	function handleWordClickChirho(eventChirho: MouseEvent) {
		if (!eventChirho.altKey) return;
		if (!isMultiWordChirho) {
			onSelectChirho?.();
		}
	}

	// Suggestions including Google
	const allSuggestionsChirho = $derived(
		googleTranslateSuggestionChirho
			? [...wordChirho.suggestionsChirho, googleTranslateSuggestionChirho]
			: wordChirho.suggestionsChirho
	);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li
	bind:this={rootRefChirho}
	dir={isHebrewChirho ? 'rtl' : 'ltr'}
	class="group/word relative rounded p-2 {phraseFocusedChirho && !wordSelectedChirho
		? 'bg-amber-50'
		: ''} {wordSelectedChirho ? 'bg-amber-100 shadow-inner' : ''}"
	onclick={handleWordClickChirho}
	onkeydown={(eventChirho) => eventChirho.altKey && eventChirho.key === 'Enter' && onSelectChirho?.()}
>
	<!-- Ancient word row -->
	<div
		id="word-{wordChirho.idChirho}"
		class="flex h-8 cursor-pointer items-center gap-1.5 font-serif {isHebrewChirho
			? 'pr-3 text-right'
			: 'pl-3 text-left'}"
	>
		<span
			class="inline-block text-lg"
			tabindex="-1"
			onclick={() => {
				onFocusChirho?.();
				onShowDetailChirho?.();
			}}
			onkeydown={(eChirho) => eChirho.key === 'Enter' && onShowDetailChirho?.()}
			role="button"
		>
			{wordChirho.textChirho}
		</span>

		{#if hasNoteChirho}
			<button
				type="button"
				class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
				title="Open notes"
				tabindex="-1"
				onclick={(eChirho) => {
					if (eChirho.altKey) return;
					onFocusChirho?.();
					onShowDetailChirho?.();
					onOpenNotesChirho?.();
				}}
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
					/>
				</svg>
			</button>
		{/if}

		<div class="flex-grow"></div>

		{#if isMultiWordChirho}
			<svg
				class="h-4 w-4 text-gray-600"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-label="Linked to another word"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
				/>
			</svg>
		{:else if editableChirho}
			<input
				type="checkbox"
				class="invisible h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 group-hover/word:visible group-focus-within/word:visible [&:checked]:visible"
				aria-label="word selected"
				tabindex="-1"
				checked={wordSelectedChirho}
				onchange={() => onSelectChirho?.()}
				onfocus={() => onFocusChirho?.()}
			/>
		{/if}
	</div>

	<!-- Reference gloss row -->
	<div class="h-8 text-slate-600 {isHebrewChirho ? 'pr-3 text-right' : 'pl-3 text-left'}" dir="ltr">
		<span class="inline-block text-sm">{wordChirho.referenceGlossChirho ?? ''}</span>
	</div>

	<!-- Target gloss row -->
	{#if !editableChirho}
		<div
			class="h-8 {isHebrewChirho ? 'pr-3 text-right' : 'pl-3 text-left'}"
			dir={languageChirho.textDirectionChirho}
		>
			<span class="inline-block" style="font-family: {languageChirho.fontChirho}">
				{phraseChirho.glossChirho?.textChirho ?? ''}
			</span>
		</div>
	{:else if isFirstWordInPhraseChirho}
		<div
			class="group/input-row flex min-w-[128px] items-center gap-2 {isHebrewChirho
				? 'flex-row'
				: 'flex-row-reverse'}"
			dir={languageChirho.textDirectionChirho}
		>
			<!-- Approve/Revoke button -->
			<div class="hidden group-focus-within/input-row:block">
				{#if statusChirho !== 'approved'}
					<button
						type="button"
						class="flex h-9 w-9 items-center justify-center rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
						title="Approve (Enter)"
						tabindex="-1"
						disabled={savingChirho}
						onclick={(eChirho) => {
							eChirho.stopPropagation();
							saveGlossChirho('APPROVED');
							inputRefChirho?.focus();
						}}
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</button>
				{:else}
					<button
						type="button"
						class="flex h-9 w-9 items-center justify-center rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
						title="Revoke approval"
						tabindex="-1"
						disabled={savingChirho}
						onclick={(eChirho) => {
							eChirho.stopPropagation();
							saveGlossChirho('UNAPPROVED');
							inputRefChirho?.focus();
						}}
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
							/>
						</svg>
					</button>
				{/if}
			</div>

			<!-- Input with autocomplete -->
			<div class="relative grow">
				<input
					bind:this={inputRefChirho}
					bind:value={inputValueChirho}
					type="text"
					class="w-full rounded border px-3 py-2 text-sm {isHebrewChirho
						? 'text-right'
						: 'text-left'} {statusChirho === 'approved'
						? 'border-green-500 bg-green-50'
						: 'border-slate-300'} focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					style="font-family: {languageChirho.fontChirho}"
					data-phrase={phraseChirho.idChirho}
					aria-labelledby="word-{wordChirho.idChirho}"
					list="suggestions-{wordChirho.idChirho}"
					onchange={handleInputChangeChirho}
					onkeydown={handleKeyDownChirho}
					onfocus={() => onFocusChirho?.()}
				/>

				<!-- Suggestions datalist -->
				<datalist id="suggestions-{wordChirho.idChirho}">
					{#each allSuggestionsChirho as suggestionChirho}
						<option value={suggestionChirho}></option>
					{/each}
				</datalist>

				<!-- Google icon for machine suggestion -->
				{#if hasMachineSuggestionChirho}
					<svg
						class="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 {isHebrewChirho
							? 'left-3'
							: 'right-3'}"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
				{/if}
			</div>
		</div>

		<!-- Status indicator -->
		<div
			class="mt-1 text-sm {statusChirho === 'approved'
				? 'text-green-600'
				: statusChirho === 'saved'
					? 'text-blue-600'
					: 'text-slate-500'} {isHebrewChirho ? 'text-right' : 'text-left'}"
		>
			{#if statusChirho === 'saving'}
				<span class="flex items-center gap-1">
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Saving...
				</span>
			{:else if statusChirho === 'approved'}
				<span class="flex items-center gap-1">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
					Approved
				</span>
			{:else if statusChirho === 'saved'}
				<span class="flex items-center gap-1">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
					Saved
				</span>
			{/if}
		</div>
	{/if}

	<!-- Backtranslation row -->
	{#if backtranslationChirho}
		<div
			class="h-8 italic text-slate-500 {isHebrewChirho ? 'pr-3 text-right' : 'pl-3 text-left'}"
			dir="ltr"
		>
			<span class="inline-block text-sm">{backtranslationChirho}</span>
		</div>
	{/if}
</li>
