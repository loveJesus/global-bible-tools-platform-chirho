<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { browser as browserChirho } from '$app/environment';
	import { page as pageChirho } from '$app/stores';
	import { tChirho } from '$lib/i18n-chirho';

	let isOpenChirho = $state(false);
	let isSubmittingChirho = $state(false);
	let isSubmittedChirho = $state(false);
	let categoryChirho = $state<'bug' | 'suggestion' | 'praise'>('suggestion');
	let messageChirho = $state('');
	let emailChirho = $state('');

	function toggleChirho() {
		isOpenChirho = !isOpenChirho;
		if (!isOpenChirho) {
			// Reset form when closing
			resetFormChirho();
		}
	}

	function resetFormChirho() {
		categoryChirho = 'suggestion';
		messageChirho = '';
		isSubmittedChirho = false;
	}

	async function submitFeedbackChirho(eventChirho: SubmitEvent) {
		eventChirho.preventDefault();
		if (!messageChirho.trim()) return;

		isSubmittingChirho = true;

		try {
			const responseChirho = await fetch('/api-chirho/feedback-chirho', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					categoryChirho,
					messageChirho: messageChirho.trim(),
					emailChirho: emailChirho.trim() || null,
					pageUrlChirho: browserChirho ? window.location.href : $pageChirho.url.href
				})
			});

			if (responseChirho.ok) {
				isSubmittedChirho = true;
				// Auto-close after 2 seconds
				setTimeout(() => {
					isOpenChirho = false;
					resetFormChirho();
				}, 2000);
			}
		} catch (errorChirho) {
			console.error('Failed to submit feedback:', errorChirho);
		} finally {
			isSubmittingChirho = false;
		}
	}

	function getCategoryIconChirho(catChirho: string): string {
		switch (catChirho) {
			case 'bug':
				return '🐛';
			case 'suggestion':
				return '💡';
			case 'praise':
				return '🙏';
			default:
				return '💬';
		}
	}
</script>

<!-- Floating feedback button -->
<div class="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
	{#if !isOpenChirho}
		<button
			type="button"
			onclick={toggleChirho}
			class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			aria-label="Give feedback"
		>
			<svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
				/>
			</svg>
		</button>
	{:else}
		<!-- Feedback form panel -->
		<div
			class="bg-white rounded-xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:w-80 max-w-sm overflow-hidden"
		>
			<!-- Header -->
			<div class="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
				<h3 class="font-semibold text-sm sm:text-base">{$tChirho('common.feedbackChirho.titleChirho')}</h3>
				<button
					type="button"
					onclick={toggleChirho}
					class="text-white/80 hover:text-white transition-colors"
					aria-label="Close"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			{#if isSubmittedChirho}
				<!-- Success state -->
				<div class="p-6 text-center">
					<div class="text-4xl mb-2">🙏</div>
					<p class="text-slate-700 font-medium">{$tChirho('common.feedbackChirho.thankYouChirho')}</p>
					<p class="text-slate-500 text-sm mt-1">{$tChirho('common.feedbackChirho.receivedChirho')}</p>
				</div>
			{:else}
				<!-- Feedback form -->
				<form onsubmit={submitFeedbackChirho} class="p-4 space-y-3">
					<!-- Category selector -->
					<div class="flex gap-2">
						{#each ['bug', 'suggestion', 'praise'] as catChirho}
							<button
								type="button"
								onclick={() => (categoryChirho = catChirho as typeof categoryChirho)}
								class="flex-1 px-2 py-1.5 text-xs sm:text-sm rounded-lg border transition-all {categoryChirho ===
								catChirho
									? 'bg-indigo-50 border-indigo-300 text-indigo-700'
									: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}"
							>
								<span class="mr-1">{getCategoryIconChirho(catChirho)}</span>
								{catChirho === 'bug'
									? $tChirho('common.feedbackChirho.bugChirho')
									: catChirho === 'suggestion'
										? $tChirho('common.feedbackChirho.suggestionChirho')
										: $tChirho('common.feedbackChirho.praiseChirho')}
							</button>
						{/each}
					</div>

					<!-- Message textarea -->
					<textarea
						bind:value={messageChirho}
						placeholder={$tChirho('common.feedbackChirho.messagePlaceholderChirho')}
						rows="3"
						class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						required
					></textarea>

					<!-- Optional email -->
					<input
						type="email"
						bind:value={emailChirho}
						placeholder={$tChirho('common.feedbackChirho.emailPlaceholderChirho')}
						class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>

					<!-- Submit button -->
					<button
						type="submit"
						disabled={isSubmittingChirho || !messageChirho.trim()}
						class="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmittingChirho ? $tChirho('common.feedbackChirho.sendingChirho') : $tChirho('common.feedbackChirho.sendChirho')}
					</button>
				</form>
			{/if}
		</div>
	{/if}
</div>
