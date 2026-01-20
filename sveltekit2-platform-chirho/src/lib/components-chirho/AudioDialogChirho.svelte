<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { onMount as onMountChirho, onDestroy as onDestroyChirho } from 'svelte';

	interface VerseAudioTimingChirho {
		verseIdChirho: string;
		startChirho: number;
	}

	interface PropsChirho {
		chapterIdChirho: string;
		verseIdChirho?: string;
		onVerseChangeChirho?: (verseIdChirho: string | undefined) => void;
		onCloseChirho?: () => void;
	}

	let { chapterIdChirho, verseIdChirho, onVerseChangeChirho, onCloseChirho }: PropsChirho = $props();

	const SPEEDS_CHIRHO = [0.5, 0.75, 1, 1.25, 1.5];
	const PREV_THRESHOLD_CHIRHO = 1.5;

	// Book keys for audio file paths
	const bookKeysChirho = [
		'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
		'1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
		'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO',
		'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL',
		'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH',
		'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS',
		'1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'
	];

	let audioRefChirho: HTMLAudioElement | null = $state(null);
	let isPlayingChirho = $state(false);
	let speakerChirho = $state('HEB');
	let speedIndexChirho = $state(2); // Default 1x
	let lengthChirho = $state(0);
	let progressChirho = $state(0);
	let timingsChirho = $state<VerseAudioTimingChirho[]>([]);
	let loadingChirho = $state(true);

	const bookIdChirho = $derived(parseInt(chapterIdChirho.slice(0, 2)) || 1);
	const chapterChirho = $derived(parseInt(chapterIdChirho.slice(2, 5)) || 1);
	const isVersePlayerChirho = $derived(!!verseIdChirho);

	const audioSrcChirho = $derived(
		`https://assets.globalbibletools.com/audio/${speakerChirho}/${bookKeysChirho[bookIdChirho - 1]}/${chapterChirho.toString().padStart(3, '0')}.mp3`
	);

	const timeRangeChirho = $derived.by(() => {
		if (!verseIdChirho) {
			const startChirho = timingsChirho[0]?.startChirho ?? 0;
			return {
				startChirho,
				endChirho: lengthChirho,
				lengthChirho: lengthChirho - startChirho
			};
		}
		const timingIndexChirho = timingsChirho.findIndex((eChirho) => eChirho.verseIdChirho === verseIdChirho);
		if (timingIndexChirho < 0) {
			const startChirho = timingsChirho[0]?.startChirho ?? 0;
			return {
				startChirho,
				endChirho: lengthChirho,
				lengthChirho: lengthChirho - startChirho
			};
		}
		const startChirho = timingsChirho[timingIndexChirho].startChirho;
		const endChirho = timingsChirho[timingIndexChirho + 1]?.startChirho ?? lengthChirho;
		return {
			startChirho,
			endChirho,
			lengthChirho: endChirho - startChirho
		};
	});

	const shiftedProgressChirho = $derived(progressChirho - timeRangeChirho.startChirho);
	const progressPercentChirho = $derived(
		timeRangeChirho.lengthChirho > 0
			? Math.min(1, shiftedProgressChirho / timeRangeChirho.lengthChirho)
			: 0
	);

	async function loadTimingsChirho() {
		loadingChirho = true;
		try {
			const responseChirho = await fetch(`/api-chirho/audio-chirho/${speakerChirho}/${chapterIdChirho}`);
			if (responseChirho.ok) {
				timingsChirho = await responseChirho.json();
			}
		} catch (errChirho) {
			console.error('Failed to load audio timings:', errChirho);
		}
		loadingChirho = false;
	}

	function togglePlayChirho() {
		const elChirho = audioRefChirho;
		if (!elChirho) return;

		if (elChirho.currentTime >= timeRangeChirho.endChirho) {
			resetChirho();
		}

		if (elChirho.currentTime < timeRangeChirho.startChirho) {
			elChirho.currentTime = timeRangeChirho.startChirho;
		}

		if (elChirho.paused) {
			elChirho.play();
		} else {
			elChirho.pause();
		}
	}

	function resetChirho() {
		const elChirho = audioRefChirho;
		if (!elChirho) return;
		elChirho.currentTime = timeRangeChirho.startChirho;
		progressChirho = timeRangeChirho.startChirho;
	}

	function toggleSpeedChirho() {
		speedIndexChirho = (speedIndexChirho + 1) % SPEEDS_CHIRHO.length;
		if (audioRefChirho) {
			audioRefChirho.playbackRate = SPEEDS_CHIRHO[speedIndexChirho];
		}
	}

	function prevVerseChirho(countChirho = 1) {
		if (isVersePlayerChirho) return;
		const elChirho = audioRefChirho;
		if (!elChirho || timingsChirho.length === 0) return;

		const currentIndexChirho = timingsChirho.reduce(
			(lastChirho, vChirho, iChirho) => (vChirho.startChirho > elChirho.currentTime ? lastChirho : iChirho),
			-1
		);
		if (currentIndexChirho < 0) return;

		if (elChirho.currentTime - timingsChirho[currentIndexChirho].startChirho < PREV_THRESHOLD_CHIRHO || countChirho > 1) {
			elChirho.currentTime = timingsChirho[Math.max(0, currentIndexChirho - countChirho)].startChirho;
		} else {
			elChirho.currentTime = timingsChirho[currentIndexChirho].startChirho;
		}
	}

	function nextVerseChirho(countChirho = 1) {
		if (isVersePlayerChirho) return;
		const elChirho = audioRefChirho;
		if (!elChirho || timingsChirho.length === 0) return;

		const currentIndexChirho = timingsChirho.reduce(
			(lastChirho, vChirho, iChirho) => (vChirho.startChirho > elChirho.currentTime ? lastChirho : iChirho),
			-1
		);
		if (currentIndexChirho < 0) return;

		elChirho.currentTime = timingsChirho[Math.min(timingsChirho.length - 1, currentIndexChirho + countChirho)].startChirho;
	}

	function seekChirho(newProgressChirho: number) {
		const elChirho = audioRefChirho;
		if (!elChirho) return;
		elChirho.currentTime = timeRangeChirho.startChirho + newProgressChirho;
	}

	function onTimeUpdateChirho() {
		const elChirho = audioRefChirho;
		if (!elChirho) return;

		progressChirho = elChirho.currentTime;

		if (progressChirho >= timeRangeChirho.endChirho) {
			elChirho.pause();
		}

		const verseChirho = timingsChirho.reduce<VerseAudioTimingChirho | undefined>(
			(lastChirho, vChirho) => (vChirho.startChirho > elChirho.currentTime ? lastChirho : vChirho),
			undefined
		);

		onVerseChangeChirho?.(verseChirho?.verseIdChirho);
	}

	function formatTimeChirho(secondsChirho: number): string {
		const minsChirho = Math.floor(secondsChirho / 60);
		const secsChirho = Math.round(secondsChirho % 60);
		return `${minsChirho.toString().padStart(2, '0')}:${secsChirho.toString().padStart(2, '0')}`;
	}

	function handleScrubChirho(eventChirho: MouseEvent) {
		const targetChirho = eventChirho.currentTarget as HTMLElement;
		const rectChirho = targetChirho.getBoundingClientRect();
		const posChirho = Math.max(rectChirho.left, Math.min(rectChirho.right, eventChirho.clientX));
		const percentChirho = (posChirho - rectChirho.left) / rectChirho.width;
		seekChirho(percentChirho * timeRangeChirho.lengthChirho);
	}

	onMountChirho(() => {
		loadTimingsChirho();
	});

	$effect(() => {
		// Reload timings when speaker or chapter changes
		loadTimingsChirho();
	});
</script>

<dialog
	open
	class="fixed border border-slate-400 shadow-lg bg-white rounded-lg flex flex-col items-center px-4 pt-8 pb-3 gap-4 z-50"
>
	<button
		type="button"
		class="absolute text-red-700 -end-1 -top-1 w-8 h-8 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-green-400"
		onclick={onCloseChirho}
	>
		<svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		</svg>
		<span class="sr-only">Close</span>
	</button>

	<audio
		bind:this={audioRefChirho}
		src={audioSrcChirho}
		onplay={() => (isPlayingChirho = true)}
		onpause={() => {
			isPlayingChirho = false;
			onVerseChangeChirho?.(undefined);
		}}
		onloadedmetadata={() => {
			if (audioRefChirho) lengthChirho = audioRefChirho.duration;
		}}
		ontimeupdate={onTimeUpdateChirho}
	></audio>

	<div class="flex gap-2">
		{#if !isVersePlayerChirho}
			<button
				type="button"
				class="w-10 h-10 rounded-lg hover:bg-slate-100 disabled:opacity-50"
				disabled={loadingChirho}
				onclick={() => prevVerseChirho()}
			>
				<svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
					<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
				</svg>
				<span class="sr-only">Previous verse</span>
			</button>
		{/if}

		<button
			type="button"
			class="w-10 h-10 rounded-lg hover:bg-slate-100 disabled:opacity-50"
			disabled={loadingChirho}
			onclick={resetChirho}
		>
			<svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
			</svg>
			<span class="sr-only">Restart</span>
		</button>

		<button
			type="button"
			class="w-10 h-10 rounded-lg hover:bg-slate-100 disabled:opacity-50"
			disabled={loadingChirho}
			onclick={togglePlayChirho}
		>
			{#if isPlayingChirho}
				<svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
					<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
				</svg>
				<span class="sr-only">Pause</span>
			{:else}
				<svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
					<path d="M8 5v14l11-7z" />
				</svg>
				<span class="sr-only">Play</span>
			{/if}
		</button>

		{#if !isVersePlayerChirho}
			<button
				type="button"
				class="w-10 h-10 rounded-lg hover:bg-slate-100 disabled:opacity-50"
				disabled={loadingChirho}
				onclick={() => nextVerseChirho()}
			>
				<svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
					<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
				</svg>
				<span class="sr-only">Next verse</span>
			</button>
		{/if}
	</div>

	<div class="w-full flex justify-between gap-3 items-center">
		<span class="text-sm text-slate-600 min-w-[40px]">{formatTimeChirho(shiftedProgressChirho)}</span>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			class="flex-1 group relative bg-slate-300 rounded-full h-2 cursor-pointer"
			onclick={handleScrubChirho}
			role="slider"
			tabindex="0"
			aria-label="Audio progress"
			aria-valuemin={0}
			aria-valuemax={timeRangeChirho.lengthChirho}
			aria-valuenow={shiftedProgressChirho}
		>
			<div
				class="bg-emerald-400 absolute h-2 start-0 rounded-full"
				style="width: {progressPercentChirho * 100}%"
			></div>
			<div
				class="bg-emerald-600 absolute h-4 w-4 -top-1 -ml-2 rounded-full"
				style="left: {progressPercentChirho * 100}%"
			></div>
		</div>

		<span class="text-sm text-slate-600 min-w-[40px]">{formatTimeChirho(timeRangeChirho.lengthChirho)}</span>
	</div>

	<div class="flex items-center justify-between w-full">
		<button
			type="button"
			class="px-3 py-1 rounded-lg hover:bg-slate-100 text-sm font-medium"
			disabled={loadingChirho}
			onclick={toggleSpeedChirho}
		>
			{SPEEDS_CHIRHO[speedIndexChirho]}x
		</button>

		<select
			bind:value={speakerChirho}
			class="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
		>
			<option value="HEB">Schmueloff</option>
			<option value="RDB">Beeri</option>
		</select>
	</div>
</dialog>
