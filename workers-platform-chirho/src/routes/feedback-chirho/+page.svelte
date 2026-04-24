<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { tChirho } from '$lib/i18n-chirho';
	import { page as pageChirho } from '$app/state';

	let messageChirho = $state('');
	let submittedChirho = $state(false);
	let errorChirho = $state('');

	async function submitFeedbackChirho(eventChirho: SubmitEvent): Promise<void> {
		eventChirho.preventDefault();
		errorChirho = '';

		if (!messageChirho.trim()) {
			errorChirho = 'Please enter your feedback.';
			return;
		}

		const responseChirho = await fetch('/api-chirho/v1-chirho/feedback-chirho', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				page_chirho: pageChirho.url.pathname,
				message_chirho: messageChirho.trim()
			})
		});

		if (responseChirho.ok) {
			submittedChirho = true;
			messageChirho = '';
		} else {
			errorChirho = 'Failed to submit feedback. Please try again.';
		}
	}
</script>

<svelte:head>
	<title>Feedback - bible.systems</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 dark:bg-slate-900">
	<div class="mx-auto max-w-2xl px-4 py-12">
		<h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Feedback</h1>

		{#if submittedChirho}
			<div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
				<p class="text-green-800 dark:text-green-300">Thank you for your feedback!</p>
				<button
					type="button"
					onclick={() => (submittedChirho = false)}
					class="mt-2 text-sm text-green-600 dark:text-green-400 hover:underline"
				>
					Submit more feedback
				</button>
			</div>
		{:else}
			<form onsubmit={submitFeedbackChirho} class="space-y-4">
				{#if errorChirho}
					<div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-300 text-sm">
						{errorChirho}
					</div>
				{/if}

				<div>
					<label for="feedback-message-chirho" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
						Your feedback
					</label>
					<textarea
						id="feedback-message-chirho"
						bind:value={messageChirho}
						rows="5"
						class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Tell us what you think, report a bug, or suggest an improvement..."
					></textarea>
				</div>

				<button
					type="submit"
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
				>
					Submit Feedback
				</button>
			</form>
		{/if}
	</div>
</main>
