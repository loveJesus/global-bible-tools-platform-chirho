<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import '../../app.css';
	import type { LayoutData as LayoutDataChirho } from './$types';
	import FeedbackBubbleChirho from '$lib/components-chirho/FeedbackBubbleChirho.svelte';
	import { localeChirho, loadTranslationsChirho } from '$lib/i18n-chirho';
	import { browser as browserChirho } from '$app/environment';

	let { children: childrenChirho, data: dataChirho }: { children: any; data: LayoutDataChirho } = $props();

	// Initialize locale on client only, after hydration
	// This prevents the flash of empty content during SSR->client transition
	$effect(() => {
		if (browserChirho && dataChirho.localeChirho) {
			// Load translations for this locale before setting it
			loadTranslationsChirho(dataChirho.localeChirho, '/').then(() => {
				localeChirho.set(dataChirho.localeChirho);
			});
		}
	});
</script>

<!-- Landing pages have their own navigation/footer, no wrapper needed -->
<!-- Always render content - server has already rendered with translations -->
{@render childrenChirho()}

<!-- Feedback bubble - appears on all pages -->
<FeedbackBubbleChirho />
