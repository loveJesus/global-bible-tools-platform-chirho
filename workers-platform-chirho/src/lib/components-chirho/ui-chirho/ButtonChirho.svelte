<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { Snippet as SnippetChirho } from 'svelte';
	import type { HTMLButtonAttributes as HTMLButtonAttributesChirho } from 'svelte/elements';

	type VariantChirho = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
	type SizeChirho = 'sm' | 'md' | 'lg';

	interface PropsChirho extends HTMLButtonAttributesChirho {
		variantChirho?: VariantChirho;
		sizeChirho?: SizeChirho;
		fullWidthChirho?: boolean;
		loadingChirho?: boolean;
		children: SnippetChirho;
	}

	let {
		variantChirho = 'primary',
		sizeChirho = 'md',
		fullWidthChirho = false,
		loadingChirho = false,
		children,
		class: classNameChirho = '',
		disabled: disabledChirho,
		...restChirho
	}: PropsChirho = $props();

	const baseClassesChirho =
		'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClassesChirho: Record<VariantChirho, string> = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500',
		success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
		ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500'
	};

	const sizeClassesChirho: Record<SizeChirho, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const computedClassChirho = $derived(
		[
			baseClassesChirho,
			variantClassesChirho[variantChirho],
			sizeClassesChirho[sizeChirho],
			fullWidthChirho ? 'w-full' : '',
			classNameChirho
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<button class={computedClassChirho} disabled={disabledChirho || loadingChirho} {...restChirho}>
	{#if loadingChirho}
		<svg
			class="animate-spin -ml-1 mr-2 h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{/if}
	{@render children()}
</button>
