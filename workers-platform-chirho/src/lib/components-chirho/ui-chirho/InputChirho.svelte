<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { HTMLInputAttributes as HTMLInputAttributesChirho } from 'svelte/elements';

	interface PropsChirho extends HTMLInputAttributesChirho {
		labelChirho?: string;
		errorChirho?: string;
		hintChirho?: string;
	}

	let {
		labelChirho,
		errorChirho,
		hintChirho,
		id: idChirho,
		class: classNameChirho = '',
		...restChirho
	}: PropsChirho = $props();

	const inputIdChirho = idChirho ?? `input-${Math.random().toString(36).slice(2, 9)}`;

	const baseInputClassChirho =
		'w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2';

	const stateClassChirho = $derived(
		errorChirho
			? 'border-red-300 focus:border-red-500 focus:ring-red-500'
			: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
	);
</script>

<div class="space-y-1">
	{#if labelChirho}
		<label for={inputIdChirho} class="block text-sm font-medium text-slate-700">
			{labelChirho}
		</label>
	{/if}

	<input
		id={inputIdChirho}
		class="{baseInputClassChirho} {stateClassChirho} {classNameChirho}"
		aria-invalid={errorChirho ? 'true' : undefined}
		aria-describedby={errorChirho ? `${inputIdChirho}-error` : hintChirho ? `${inputIdChirho}-hint` : undefined}
		{...restChirho}
	/>

	{#if errorChirho}
		<p id="{inputIdChirho}-error" class="text-sm text-red-600">
			{errorChirho}
		</p>
	{:else if hintChirho}
		<p id="{inputIdChirho}-hint" class="text-sm text-slate-500">
			{hintChirho}
		</p>
	{/if}
</div>
