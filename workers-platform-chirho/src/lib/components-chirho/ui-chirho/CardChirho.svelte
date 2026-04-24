<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { Snippet as SnippetChirho } from 'svelte';

	interface PropsChirho {
		titleChirho?: string;
		subtitleChirho?: string;
		paddingChirho?: 'none' | 'sm' | 'md' | 'lg';
		headerChirho?: SnippetChirho;
		footerChirho?: SnippetChirho;
		children: SnippetChirho;
	}

	let {
		titleChirho,
		subtitleChirho,
		paddingChirho = 'md',
		headerChirho,
		footerChirho,
		children
	}: PropsChirho = $props();

	const paddingClassesChirho: Record<string, string> = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};
</script>

<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
	{#if titleChirho || headerChirho}
		<div class="px-6 py-4 border-b border-slate-200">
			{#if headerChirho}
				{@render headerChirho()}
			{:else}
				<h3 class="text-lg font-semibold text-slate-800">{titleChirho}</h3>
				{#if subtitleChirho}
					<p class="mt-1 text-sm text-slate-600">{subtitleChirho}</p>
				{/if}
			{/if}
		</div>
	{/if}

	<div class={paddingClassesChirho[paddingChirho]}>
		{@render children()}
	</div>

	{#if footerChirho}
		<div class="px-6 py-4 border-t border-slate-200 bg-slate-50">
			{@render footerChirho()}
		</div>
	{/if}
</div>
