<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	interface PropsChirho {
		valueChirho?: string;
		placeholderChirho?: string;
		onchangeChirho?: (valueChirho: string) => void;
	}

	let {
		valueChirho = $bindable(''),
		placeholderChirho = 'Search...',
		onchangeChirho
	}: PropsChirho = $props();

	function handleInputChirho(eventChirho: Event) {
		const targetChirho = eventChirho.target as HTMLInputElement;
		valueChirho = targetChirho.value;
		onchangeChirho?.(valueChirho);
	}
</script>

<div class="relative">
	<input
		type="text"
		value={valueChirho}
		oninput={handleInputChirho}
		placeholder={placeholderChirho}
		class="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
	/>
	<svg
		class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		></path>
	</svg>
</div>
