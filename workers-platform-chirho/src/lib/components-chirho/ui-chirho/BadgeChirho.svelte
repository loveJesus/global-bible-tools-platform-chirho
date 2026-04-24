<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { Snippet as SnippetChirho } from 'svelte';

	type VariantChirho = 'default' | 'success' | 'warning' | 'error' | 'info';
	type SizeChirho = 'sm' | 'md';

	interface PropsChirho {
		variantChirho?: VariantChirho;
		sizeChirho?: SizeChirho;
		children: SnippetChirho;
	}

	let { variantChirho = 'default', sizeChirho = 'sm', children }: PropsChirho = $props();

	const variantClassesChirho: Record<VariantChirho, string> = {
		default: 'bg-slate-100 text-slate-700',
		success: 'bg-emerald-100 text-emerald-700',
		warning: 'bg-amber-100 text-amber-700',
		error: 'bg-red-100 text-red-700',
		info: 'bg-blue-100 text-blue-700'
	};

	const sizeClassesChirho: Record<SizeChirho, string> = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-sm'
	};

	const computedClassChirho = $derived(
		`inline-flex items-center font-medium rounded-full ${variantClassesChirho[variantChirho]} ${sizeClassesChirho[sizeChirho]}`
	);
</script>

<span class={computedClassChirho}>
	{@render children()}
</span>
