<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	interface NoteChirho {
		phraseIdChirho: number;
		authorIdChirho: string;
		authorNameChirho: string | null;
		timestampChirho: string;
		contentChirho: string;
		typeChirho: 'footnote' | 'translator_note';
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
	let notesChirho = $state<NoteChirho[]>([]);

	// New note form state
	let newNoteContentChirho = $state('');
	let newNoteTypeChirho = $state<'footnote' | 'translator_note'>('translator_note');
	let savingChirho = $state(false);

	// Fetch notes when wordId changes
	$effect(() => {
		if (wordIdChirho && isOpenChirho) {
			fetchNotesChirho(wordIdChirho);
		}
	});

	async function fetchNotesChirho(wordIdChirho: string) {
		loadingChirho = true;
		errorChirho = null;

		try {
			const responseChirho = await fetch(
				`/api-chirho/notes-chirho?wordId=${encodeURIComponent(wordIdChirho)}&languageCode=${encodeURIComponent(languageCodeChirho)}`
			);

			if (!responseChirho.ok) {
				const errChirho = await responseChirho.json();
				throw new Error(errChirho.errorChirho || 'Failed to fetch notes');
			}

			const dataChirho = await responseChirho.json();
			notesChirho = dataChirho.notesChirho;
		} catch (errChirho) {
			errorChirho = errChirho instanceof Error ? errChirho.message : 'Unknown error';
		} finally {
			loadingChirho = false;
		}
	}

	async function saveNoteChirho() {
		if (!wordIdChirho || !newNoteContentChirho.trim()) return;

		savingChirho = true;
		errorChirho = null;

		try {
			const formDataChirho = new FormData();
			formDataChirho.set('wordId', wordIdChirho);
			formDataChirho.set('languageCode', languageCodeChirho);
			formDataChirho.set('content', newNoteContentChirho.trim());
			formDataChirho.set('type', newNoteTypeChirho);

			const responseChirho = await fetch('/api-chirho/notes-chirho', {
				method: 'POST',
				body: formDataChirho
			});

			if (!responseChirho.ok) {
				const errChirho = await responseChirho.json();
				throw new Error(errChirho.errorChirho || 'Failed to save note');
			}

			// Refresh notes
			await fetchNotesChirho(wordIdChirho);
			newNoteContentChirho = '';
		} catch (errChirho) {
			errorChirho = errChirho instanceof Error ? errChirho.message : 'Unknown error';
		} finally {
			savingChirho = false;
		}
	}

	function formatDateChirho(dateStringChirho: string): string {
		const dateChirho = new Date(dateStringChirho);
		return dateChirho.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getNoteTypeIconChirho(typeChirho: 'footnote' | 'translator_note'): string {
		return typeChirho === 'footnote' ? '📝' : '💬';
	}

	function getNoteTypeLabelChirho(typeChirho: 'footnote' | 'translator_note'): string {
		return typeChirho === 'footnote' ? 'Footnote' : 'Translator Note';
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
		class="fixed right-0 top-0 z-50 flex h-full w-96 max-w-full flex-col bg-white shadow-xl"
		role="dialog"
		aria-modal="true"
		aria-labelledby="notes-title-chirho"
	>
		<!-- Header -->
		<header
			class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3"
		>
			<h2 id="notes-title-chirho" class="text-lg font-semibold text-slate-900">Notes</h2>
			<button
				type="button"
				onclick={onCloseChirho}
				class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
				aria-label="Close"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</header>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto p-4">
			{#if loadingChirho}
				<div class="flex items-center justify-center py-12">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
					></div>
				</div>
			{:else if errorChirho}
				<div class="rounded-lg bg-red-50 p-4 text-red-700">
					<p class="font-medium">Error</p>
					<p class="text-sm">{errorChirho}</p>
				</div>
			{:else}
				<!-- Notes list -->
				{#if notesChirho.length > 0}
					<ul class="space-y-3">
						{#each notesChirho as noteChirho}
							<li class="rounded-lg border border-slate-200 bg-white p-3">
								<div class="mb-2 flex items-center justify-between text-xs text-slate-500">
									<span class="flex items-center gap-1">
										<span>{getNoteTypeIconChirho(noteChirho.typeChirho)}</span>
										<span class="font-medium"
											>{getNoteTypeLabelChirho(noteChirho.typeChirho)}</span
										>
									</span>
									<span>{formatDateChirho(noteChirho.timestampChirho)}</span>
								</div>
								<p class="text-sm text-slate-700">{noteChirho.contentChirho}</p>
								{#if noteChirho.authorNameChirho}
									<p class="mt-2 text-xs text-slate-400">
										— {noteChirho.authorNameChirho}
									</p>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="py-8 text-center text-sm italic text-slate-400">
						No notes yet for this word
					</p>
				{/if}
			{/if}
		</div>

		<!-- Add note form -->
		<form
			class="border-t border-slate-200 bg-slate-50 p-4"
			onsubmit={(e) => {
				e.preventDefault();
				saveNoteChirho();
			}}
		>
			<h3 class="mb-2 text-sm font-medium text-slate-700">Add Note</h3>

			<!-- Note type selector -->
			<div class="mb-3 flex gap-2">
				<button
					type="button"
					class="flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors {newNoteTypeChirho ===
					'translator_note'
						? 'bg-blue-600 text-white'
						: 'bg-white text-slate-600 hover:bg-slate-100'}"
					onclick={() => (newNoteTypeChirho = 'translator_note')}
				>
					💬 Translator Note
				</button>
				<button
					type="button"
					class="flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors {newNoteTypeChirho ===
					'footnote'
						? 'bg-blue-600 text-white'
						: 'bg-white text-slate-600 hover:bg-slate-100'}"
					onclick={() => (newNoteTypeChirho = 'footnote')}
				>
					📝 Footnote
				</button>
			</div>

			<!-- Note content -->
			<textarea
				bind:value={newNoteContentChirho}
				placeholder={newNoteTypeChirho === 'footnote'
					? 'Add a footnote that will be visible to readers...'
					: 'Add an internal note for translators...'}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				rows="3"
			></textarea>

			<!-- Submit button -->
			<button
				type="submit"
				disabled={!newNoteContentChirho.trim() || savingChirho}
				class="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if savingChirho}
					<span class="flex items-center justify-center gap-2">
						<span
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></span>
						Saving...
					</span>
				{:else}
					Save Note
				{/if}
			</button>

			<!-- Help text -->
			<p class="mt-2 text-xs text-slate-500">
				{#if newNoteTypeChirho === 'footnote'}
					Footnotes are visible to readers in the published translation.
				{:else}
					Translator notes are internal and only visible to the translation team.
				{/if}
			</p>
		</form>
	</div>
{/if}
