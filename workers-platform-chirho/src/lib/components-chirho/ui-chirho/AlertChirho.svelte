<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { Snippet as SnippetChirho } from 'svelte';

	type VariantChirho = 'success' | 'error' | 'warning' | 'info';

	interface PropsChirho {
		variantChirho?: VariantChirho;
		dismissibleChirho?: boolean;
		ondismissChirho?: () => void;
		children: SnippetChirho;
	}

	let {
		variantChirho = 'info',
		dismissibleChirho = false,
		ondismissChirho,
		children
	}: PropsChirho = $props();

	const variantStylesChirho: Record<
		VariantChirho,
		{ containerChirho: string; iconChirho: string; pathChirho: string }
	> = {
		success: {
			containerChirho: 'bg-emerald-50 border-emerald-200 text-emerald-800',
			iconChirho: 'text-emerald-500',
			pathChirho: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		error: {
			containerChirho: 'bg-red-50 border-red-200 text-red-800',
			iconChirho: 'text-red-500',
			pathChirho:
				'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		warning: {
			containerChirho: 'bg-amber-50 border-amber-200 text-amber-800',
			iconChirho: 'text-amber-500',
			pathChirho:
				'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
		},
		info: {
			containerChirho: 'bg-blue-50 border-blue-200 text-blue-800',
			iconChirho: 'text-blue-500',
			pathChirho: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		}
	};

	const stylesChirho = $derived(variantStylesChirho[variantChirho]);
</script>

<div class="flex items-start gap-3 p-4 border rounded-lg {stylesChirho.containerChirho}" role="alert">
	<svg
		class="w-5 h-5 flex-shrink-0 {stylesChirho.iconChirho}"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		aria-hidden="true"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={stylesChirho.pathChirho}
		></path>
	</svg>

	<div class="flex-1 text-sm">
		{@render children()}
	</div>

	{#if dismissibleChirho}
		<button
			type="button"
			onclick={ondismissChirho}
			class="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
			aria-label="Dismiss"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				></path>
			</svg>
		</button>
	{/if}
</div>
