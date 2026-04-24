<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { Snippet as SnippetChirho } from 'svelte';
	import type { HTMLSelectAttributes as HTMLSelectAttributesChirho } from 'svelte/elements';

	interface OptionChirho {
		valueChirho: string;
		labelChirho: string;
		disabledChirho?: boolean;
	}

	interface PropsChirho extends Omit<HTMLSelectAttributesChirho, 'children'> {
		labelChirho?: string;
		optionsChirho?: OptionChirho[];
		errorChirho?: string;
		hintChirho?: string;
		placeholderChirho?: string;
		children?: SnippetChirho;
	}

	let {
		labelChirho,
		optionsChirho,
		errorChirho,
		hintChirho,
		placeholderChirho,
		id: idChirho,
		class: classNameChirho = '',
		children,
		...restChirho
	}: PropsChirho = $props();

	const selectIdChirho = idChirho ?? `select-${Math.random().toString(36).slice(2, 9)}`;

	const baseSelectClassChirho =
		'w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 bg-white appearance-none cursor-pointer';

	const stateClassChirho = $derived(
		errorChirho
			? 'border-red-300 focus:border-red-500 focus:ring-red-500'
			: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
	);
</script>

<div class="space-y-1">
	{#if labelChirho}
		<label for={selectIdChirho} class="block text-sm font-medium text-slate-700">
			{labelChirho}
		</label>
	{/if}

	<div class="relative">
		<select
			id={selectIdChirho}
			class="{baseSelectClassChirho} {stateClassChirho} {classNameChirho} pr-10"
			aria-invalid={errorChirho ? 'true' : undefined}
			aria-describedby={errorChirho
				? `${selectIdChirho}-error`
				: hintChirho
					? `${selectIdChirho}-hint`
					: undefined}
			{...restChirho}
		>
			{#if placeholderChirho}
				<option value="" disabled selected>{placeholderChirho}</option>
			{/if}
			{#if optionsChirho}
				{#each optionsChirho as optionChirho}
					<option value={optionChirho.valueChirho} disabled={optionChirho.disabledChirho}>
						{optionChirho.labelChirho}
					</option>
				{/each}
			{:else if children}
				{@render children()}
			{/if}
		</select>

		<svg
			class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
			></path>
		</svg>
	</div>

	{#if errorChirho}
		<p id="{selectIdChirho}-error" class="text-sm text-red-600">
			{errorChirho}
		</p>
	{:else if hintChirho}
		<p id="{selectIdChirho}-hint" class="text-sm text-slate-500">
			{hintChirho}
		</p>
	{/if}
</div>
