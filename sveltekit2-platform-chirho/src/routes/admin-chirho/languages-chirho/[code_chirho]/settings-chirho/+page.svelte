<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho, ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';

	let { data: dataChirho, form: formChirho }: { data: PageDataChirho; form: ActionDataChirho } =
		$props();

	// Form state
	let nameChirho = $state(dataChirho.languageChirho.nameChirho);
	let fontChirho = $state(dataChirho.languageChirho.fontChirho);
	let textDirectionChirho = $state(dataChirho.languageChirho.textDirectionChirho);
	let translationIdsChirho = $state<string[]>(dataChirho.languageChirho.translationIdsChirho || []);
	let referenceLanguageIdChirho = $state(dataChirho.languageChirho.referenceLanguageIdChirho || '');

	let savingChirho = $state(false);
	let savedChirho = $state(false);

	// Handle form submission
	function handleSubmitChirho() {
		savingChirho = true;
		savedChirho = false;
	}

	// Show saved status after successful submission
	$effect(() => {
		if (formChirho?.successChirho) {
			savingChirho = false;
			savedChirho = true;
			setTimeout(() => {
				savedChirho = false;
			}, 3000);
		} else if (formChirho?.errorChirho) {
			savingChirho = false;
		}
	});

	// Filter out current language from reference language options
	const referenceLanguageOptionsChirho = $derived(
		dataChirho.allLanguagesChirho.filter(
			(langChirho) => langChirho.idChirho !== dataChirho.languageChirho.idChirho
		)
	);
</script>

<svelte:head>
	<title>Language Settings - {dataChirho.languageChirho.nameChirho} | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-8 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-slate-800">Language Settings</h1>
				<p class="text-slate-600">
					Configure settings for {dataChirho.languageChirho.nameChirho}
				</p>
			</div>
			<div class="flex items-center gap-4">
				{#if savingChirho}
					<span class="text-sm text-slate-500 flex items-center gap-2">
						<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
				{:else if savedChirho}
					<span class="text-sm text-emerald-600 flex items-center gap-1">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Saved
					</span>
				{/if}
				<a
					href="/admin-chirho/languages-chirho"
					class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
				>
					← Back to Languages
				</a>
			</div>
		</div>

		<!-- Error Message -->
		{#if formChirho?.errorChirho}
			<div
				class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
			>
				{formChirho.errorChirho}
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateSettingsChirho"
			use:enhanceChirho={() => {
				handleSubmitChirho();
				return async ({ update: updateChirho }) => {
					await updateChirho();
				};
			}}
		>
			<!-- Hidden field for translation IDs -->
			<input type="hidden" name="translationIds" value={translationIdsChirho.join(',')} />

			<!-- Identification Section -->
			<section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
				<div class="flex flex-col lg:flex-row lg:gap-12">
					<div class="flex-grow mb-4 lg:mb-0">
						<h3 class="font-bold text-lg text-slate-800 mb-2">Identification</h3>
						<p class="text-sm text-slate-600 mb-2">
							The name displayed for this language throughout the platform.
						</p>
						<p class="text-sm text-slate-600">
							The code follows the
							<a
								href="https://en.wikipedia.org/wiki/ISO_639-3"
								target="_blank"
								rel="noopener"
								class="text-blue-600 hover:underline"
							>
								ISO 639-3
								<svg class="inline w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
							</a>
							standard.
						</p>
					</div>
					<div class="flex-shrink-0 w-full lg:w-80">
						<div class="mb-4">
							<label for="name" class="block text-sm font-medium text-slate-700 mb-1">
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								bind:value={nameChirho}
								required
								class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label for="code" class="block text-sm font-medium text-slate-700 mb-1">
								CODE
							</label>
							<input
								type="text"
								id="code"
								value={dataChirho.languageChirho.codeChirho}
								disabled
								class="w-20 px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed"
							/>
						</div>
					</div>
				</div>
			</section>

			<!-- Text Settings Section -->
			<section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
				<div class="flex flex-col lg:flex-row lg:gap-12">
					<div class="flex-grow mb-4 lg:mb-0">
						<h3 class="font-bold text-lg text-slate-800 mb-2">Text Settings</h3>
						<p class="text-sm text-slate-600">
							Configure how text is displayed for this language, including font and reading
							direction.
						</p>
					</div>
					<div class="flex-shrink-0 w-full lg:w-80">
						<div class="mb-4">
							<label for="font" class="block text-sm font-medium text-slate-700 mb-1">
								FONT
							</label>
							<select
								id="font"
								name="font"
								bind:value={fontChirho}
								class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{#each dataChirho.fontsChirho as fontOptionChirho}
									<option value={fontOptionChirho}>{fontOptionChirho}</option>
								{/each}
							</select>
						</div>
						<div>
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="block text-sm font-medium text-slate-700 mb-2">
								TEXT DIRECTION
							</label>
							<div class="flex gap-2">
								<button
									type="button"
									onclick={() => (textDirectionChirho = 'ltr')}
									class="flex-1 px-4 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors {textDirectionChirho ===
									'ltr'
										? 'bg-blue-50 border-blue-500 text-blue-700'
										: 'border-slate-300 text-slate-600 hover:bg-slate-50'}"
								>
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
										<path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"
										/>
									</svg>
									LTR
								</button>
								<button
									type="button"
									onclick={() => (textDirectionChirho = 'rtl')}
									class="flex-1 px-4 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors {textDirectionChirho ===
									'rtl'
										? 'bg-blue-50 border-blue-500 text-blue-700'
										: 'border-slate-300 text-slate-600 hover:bg-slate-50'}"
								>
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
										<path d="M3 3h18v2H3V3zm6 4h12v2H9V7zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z"
										/>
									</svg>
									RTL
								</button>
							</div>
							<input type="hidden" name="textDirection" value={textDirectionChirho} />
						</div>
					</div>
				</div>
			</section>

			<!-- Gloss Prediction Section -->
			<section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
				<div class="flex flex-col lg:flex-row lg:gap-12">
					<div class="flex-grow mb-4 lg:mb-0">
						<h3 class="font-bold text-lg text-slate-800 mb-2">Gloss Prediction</h3>
						<p class="text-sm text-slate-600">
							Select a reference language to help predict glosses. The system will use approved
							translations from the reference language to suggest glosses for this language.
						</p>
					</div>
					<div class="flex-shrink-0 w-full lg:w-80">
						<label for="referenceLanguageId" class="block text-sm font-medium text-slate-700 mb-1">
							REFERENCE LANGUAGE
						</label>
						<select
							id="referenceLanguageId"
							name="referenceLanguageId"
							bind:value={referenceLanguageIdChirho}
							class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">None (no predictions)</option>
							{#each referenceLanguageOptionsChirho as langChirho}
								<option value={langChirho.idChirho}>
									{langChirho.nameChirho} ({langChirho.codeChirho})
								</option>
							{/each}
						</select>
					</div>
				</div>
			</section>

			<!-- Bible Translations Section -->
			<section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
				<div class="flex flex-col lg:flex-row lg:gap-12">
					<div class="flex-grow mb-4 lg:mb-0">
						<h3 class="font-bold text-lg text-slate-800 mb-2">Bible Translations</h3>
						<p class="text-sm text-slate-600">
							Select Bible translations to display alongside the interlinear text. These help
							translators understand context and compare translations.
						</p>
					</div>
					<div class="flex-shrink-0 w-full lg:w-80">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="block text-sm font-medium text-slate-700 mb-2">
							TRANSLATIONS
						</label>
						{#if translationIdsChirho.length > 0}
							<div class="mb-2 flex flex-wrap gap-2">
								{#each translationIdsChirho as translationIdChirho}
									<span
										class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
									>
										{translationIdChirho}
										<button
											type="button"
											aria-label="Remove translation"
											onclick={() => {
												translationIdsChirho = translationIdsChirho.filter(
													(idChirho) => idChirho !== translationIdChirho
												);
											}}
											class="text-blue-500 hover:text-blue-700"
										>
											<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</button>
									</span>
								{/each}
							</div>
						{:else}
							<p class="text-sm text-slate-500 mb-2">No translations selected</p>
						{/if}
						<p class="text-xs text-slate-400 mt-2">
							Translation IDs can be added via API or database import.
						</p>
					</div>
				</div>
			</section>

			<!-- Submit Button -->
			<div class="flex justify-end">
				<button
					type="submit"
					disabled={savingChirho}
					class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
				>
					{#if savingChirho}
						<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
					{:else}
						Save Settings
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
