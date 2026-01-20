<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import LocaleSwitcherChirho from '$lib/components-chirho/LocaleSwitcherChirho.svelte';
	import { tChirho } from '$lib/i18n-chirho';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	function formatCountChirho(countChirho: number): string {
		if (countChirho >= 1000) {
			return `${(countChirho / 1000).toFixed(1)}k`;
		}
		return countChirho.toString();
	}
</script>

<svelte:head>
	<title>Global Bible Tools - Interlinear Bible Translation Platform</title>
	<meta
		name="description"
		content="Free interlinear Bible translations with Greek and Hebrew. Collaborative platform for Bible translation into every language."
	/>
</svelte:head>

<div class="min-h-screen bg-amber-50 text-slate-800">
	<!-- Navigation -->
	<nav
		class="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200 bg-white px-4 md:px-8"
	>
		<a href="#hero-chirho" class="mr-4 flex items-center lg:mr-12">
			<img
				src="https://assets.globalbibletools.com/landing/logo.png"
				alt="Global Bible Tools"
				class="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14"
			/>
			<h1 class="ml-2 text-base font-bold sm:text-lg lg:text-2xl">Global Bible Tools</h1>
		</a>
		<div class="flex-grow md:flex-grow-0"></div>
		<a class="mx-3 hidden pt-1 font-bold min-[800px]:block" href="#vision-chirho">{$tChirho('landing.navChirho.visionChirho')}</a>
		<a class="mx-3 hidden pt-1 font-bold min-[800px]:block" href="#contribute-chirho">{$tChirho('landing.navChirho.contributeChirho')}</a>
		<a class="mx-3 hidden pt-1 font-bold min-[800px]:block" href="#progress-chirho">{$tChirho('landing.navChirho.progressChirho')}</a>
		<a class="mx-3 hidden pt-1 font-bold min-[800px]:block" href="#about-chirho">{$tChirho('landing.navChirho.aboutChirho')}</a>
		<div class="md:flex-grow"></div>
		<div class="mr-2 hidden sm:block">
			<LocaleSwitcherChirho />
		</div>
		<a
			href="/read-chirho"
			class="ml-2 flex h-8 items-center justify-center rounded-lg bg-blue-800 px-4 font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
		>
			{$tChirho('landing.navChirho.readersBibleChirho')}
		</a>
	</nav>

	<main>
		<!-- Hero Section -->
		<section id="hero-chirho" class="relative">
			<img
				src="https://assets.globalbibletools.com/landing/hero.png"
				alt="Bible study"
				class="w-full brightness-90"
			/>
			<div
				class="absolute inset-0 flex flex-col items-center justify-center px-8 sm:mb-10 md:mb-20"
			>
				<p
					class="mb-6 max-w-[600px] text-center text-base font-bold text-white sm:mb-16 sm:text-lg md:text-xl lg:text-2xl"
				>
					{$tChirho('landing.heroChirho.missionChirho')}
				</p>
				<a
					href="#vision-chirho"
					class="flex h-8 items-center justify-center rounded-lg bg-blue-800 px-4 font-bold text-white shadow-xl hover:bg-blue-700 transition-colors md:h-10 md:px-6 md:text-lg lg:h-12 lg:px-8 lg:text-xl"
				>
					{$tChirho('landing.heroChirho.learnMoreChirho')}
				</a>
			</div>
		</section>

		<!-- Quick Access Cards -->
		<section class="border-b border-slate-200 bg-white">
			<div class="mx-auto max-w-5xl px-4 py-12">
				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<a
						href="/read-chirho"
						class="group rounded-xl border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-blue-300 hover:bg-blue-50"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-blue-100 p-2 text-blue-600 group-hover:bg-blue-200">
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<div>
								<h2 class="text-lg font-semibold text-slate-900">{$tChirho('landing.quickAccessChirho.readChirho.titleChirho')}</h2>
								<p class="text-sm text-slate-600">{$tChirho('landing.quickAccessChirho.readChirho.descriptionChirho')}</p>
							</div>
						</div>
					</a>

					<a
						href="/translate-chirho"
						class="group rounded-xl border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-emerald-100 p-2 text-emerald-600 group-hover:bg-emerald-200">
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
									/>
								</svg>
							</div>
							<div>
								<h2 class="text-lg font-semibold text-slate-900">{$tChirho('landing.quickAccessChirho.translateChirho.titleChirho')}</h2>
								<p class="text-sm text-slate-600">{$tChirho('landing.quickAccessChirho.translateChirho.descriptionChirho')}</p>
							</div>
						</div>
					</a>

					<a
						href="/downloads-chirho"
						class="group rounded-xl border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-purple-300 hover:bg-purple-50"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-purple-100 p-2 text-purple-600 group-hover:bg-purple-200">
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
							</div>
							<div>
								<h2 class="text-lg font-semibold text-slate-900">{$tChirho('landing.quickAccessChirho.downloadsChirho.titleChirho')}</h2>
								<p class="text-sm text-slate-600">{$tChirho('landing.quickAccessChirho.downloadsChirho.descriptionChirho')}</p>
							</div>
						</div>
					</a>
				</div>
			</div>
		</section>

		<!-- Vision Section -->
		<section id="vision-chirho" class="bg-amber-50 px-6 pb-32 pt-12 md:px-8 md:pt-16 lg:pt-24">
			<div class="mx-auto w-full max-w-[1000px]">
				<h2 class="mb-8 text-3xl font-bold md:text-5xl">{$tChirho('landing.visionChirho.titleChirho')}</h2>
				<div class="relative mb-8 w-full shadow-lg">
					<div class="pb-[56.25%]"></div>
					<video
						class="absolute left-0 top-0 h-full w-full"
						controls
						poster="https://assets.globalbibletools.com/landing/info.jpg"
					>
						<source type="video/mp4" src="https://assets.globalbibletools.com/landing/info.mp4" />
						<track kind="captions" />
					</video>
				</div>
				<div class="mb-16 flex justify-center">
					<a
						class="font-bold text-blue-800 underline"
						href="https://docs.google.com/document/d/1PfgkStvqrCJutpcQzq73zN_fZkfl17zs3MdQIhT3xg4/"
						target="_blank"
						rel="noopener noreferrer"
					>
						{$tChirho('landing.visionChirho.preferToReadChirho')}
						<svg class="ml-1 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</a>
				</div>

				<div
					class="grid grid-flow-col grid-cols-1 grid-rows-[auto_1fr_1fr_auto_1fr_1fr_1fr] gap-8 md:grid-cols-2 md:grid-rows-[auto_1fr_1fr_1fr] lg:gap-x-16"
				>
					<h3 class="mx-4 border-b-4 border-black pb-2 text-center text-xl font-bold">
						{$tChirho('landing.visionChirho.languageLearningChirho')}
					</h3>
					<div class="rounded-2xl bg-white p-6 shadow">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.visionChirho.languageLessonsChirho.titleChirho')}</h4>
						<p>
							YouTube courses
							<a
								class="font-bold text-blue-800 underline"
								href="https://www.youtube.com/@AlephwithBeth"
								target="_blank"
								rel="noopener noreferrer"
							>
								Aleph with Beth
							</a>
							and
							<a
								class="font-bold text-blue-800 underline"
								href="https://www.youtube.com/@AlphawithAngela"
								target="_blank"
								rel="noopener noreferrer"
							>
								Alpha with Angela
							</a>
							provide free Greek and Hebrew training to everyone.
						</p>
					</div>
					<div class="rounded-2xl bg-white p-6 shadow">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.visionChirho.readersBibleChirho.titleChirho')}</h4>
						<p>
							{$tChirho('landing.visionChirho.readersBibleChirho.descriptionChirho')}
						</p>
					</div>

					<h3
						class="mx-4 border-b-4 border-black pb-2 text-center text-xl font-bold md:col-start-2"
					>
						{$tChirho('landing.visionChirho.biblicalStudyChirho')}
					</h3>
					<div class="rounded-2xl bg-white p-6 shadow md:col-start-2">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.visionChirho.lexiconsChirho.titleChirho')}</h4>
						<p>
							{$tChirho('landing.visionChirho.lexiconsChirho.descriptionChirho')}
						</p>
					</div>
					<div class="rounded-2xl bg-white p-6 shadow md:col-start-2">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.visionChirho.grammarsChirho.titleChirho')}</h4>
						<p>
							{$tChirho('landing.visionChirho.grammarsChirho.descriptionChirho')}
						</p>
					</div>
					<div class="rounded-2xl bg-white p-6 shadow md:col-start-2">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.visionChirho.textCriticalChirho.titleChirho')}</h4>
						<p>
							{$tChirho('landing.visionChirho.textCriticalChirho.descriptionChirho')}
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Contribute Section -->
		<section
			id="contribute-chirho"
			class="-mt-10 bg-blue-800 px-6 pb-40 pt-20 md:px-8 md:pt-24"
			style="clip-path: polygon(0 0, 100% 40px, 100% 100%, 0 100%)"
		>
			<div class="mx-auto w-full max-w-[1000px]">
				<h2 class="mb-8 text-3xl font-bold text-white md:text-5xl">{$tChirho('landing.contributeChirho.titleChirho')}</h2>
				<ul
					class="mb-16 flex flex-col gap-8 md:grid md:grid-cols-2 lg:flex lg:flex-row"
				>
					<li class="w-full rounded-2xl bg-white p-6 shadow md:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.contributeChirho.giveChirho.titleChirho')}</h4>
						<p>
							Please give through
							<a
								class="font-bold text-blue-800 underline"
								href="https://freehebrew.online/give/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Betheden Ministries
							</a>
							to fund this work. Email
							<a class="font-bold text-blue-800 underline" href="mailto:andrewdcase@gmail.com">
								Andrew Case
							</a>
							to indicate that your donation is for Global Bible Tools.
						</p>
					</li>
					<li class="w-full rounded-2xl bg-white p-6 shadow md:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.contributeChirho.softwareChirho.titleChirho')}</h4>
						<p>
							If you can help with software development or UI design, check out our
							<a
								class="font-bold text-blue-800 underline"
								href="https://github.com/globalbibletools/platform"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub repository
							</a>.
						</p>
					</li>
					<li class="w-full rounded-2xl bg-white p-6 shadow md:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.contributeChirho.translateChirho.titleChirho')}</h4>
						<p>
							If you can help translate glosses for the Reader's Hebrew or Greek Bible, please
							<a
								class="font-bold text-blue-800 underline"
								href="https://docs.google.com/forms/d/e/1FAIpQLSer70LItS-738tlwL3bDuku1qRpoWTmQBNfFd9b3NbPIH3G9w/viewform"
								target="_blank"
								rel="noopener noreferrer"
							>
								fill out this form
							</a>.
						</p>
					</li>
					<li class="w-full rounded-2xl bg-white p-6 shadow md:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.contributeChirho.resourcesChirho.titleChirho')}</h4>
						<p>
							If you have original language study resources you would like to contribute or help
							digitize, contact
							<a class="font-bold text-blue-800 underline" href="mailto:andrewdcase@gmail.com">
								Andrew Case
							</a>.
						</p>
					</li>
				</ul>
				<div class="relative w-full shadow-lg">
					<div class="pb-[56.25%]"></div>
					<video
						class="absolute left-0 top-0 h-full w-full"
						controls
						poster="https://assets.globalbibletools.com/landing/contributing.jpg"
					>
						<source
							type="video/mp4"
							src="https://assets.globalbibletools.com/landing/contributing.mp4"
						/>
						<track kind="captions" />
					</video>
				</div>
			</div>
		</section>

		<!-- Progress Section -->
		<section
			id="progress-chirho"
			class="-mt-10 bg-amber-50 px-6 pb-40 pt-20 md:px-8 md:pt-24"
			style="clip-path: polygon(0 40px, 100% 0, 100% 100%, 0 100%)"
		>
			<div class="mx-auto w-full max-w-[1000px]">
				<h2 class="mb-8 text-3xl font-bold md:text-5xl">{$tChirho('landing.progressChirho.titleChirho')}</h2>
				<div class="max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow">
					<h3 class="mb-4 text-center text-lg font-bold">{$tChirho('landing.progressChirho.translationProgressChirho')}</h3>

					{#if dataChirho.progressChirho && dataChirho.progressChirho.length > 0}
						<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{#each dataChirho.progressChirho as langChirho}
								<a
									href="/read-chirho/{langChirho.codeChirho}"
									class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition-colors hover:bg-slate-100"
								>
									<div>
										<span class="font-medium text-slate-900">{langChirho.nameChirho}</span>
										<span class="ml-2 text-xs uppercase text-slate-500"
											>{langChirho.codeChirho}</span
										>
									</div>
									<div class="text-right">
										<span class="text-sm font-medium text-blue-600"
											>{langChirho.bookCountChirho} books</span
										>
										<span class="ml-1 text-xs text-slate-500"
											>({formatCountChirho(langChirho.glossCountChirho)} glosses)</span
										>
									</div>
								</a>
							{/each}
						</div>

						<div class="mt-6 text-center">
							<a href="/read-chirho" class="font-medium text-blue-600 hover:underline">
								View all languages →
							</a>
						</div>
					{:else}
						<p class="text-center text-slate-500">No translations available yet.</p>
					{/if}
				</div>
			</div>
		</section>

		<!-- About Section -->
		<section
			id="about-chirho"
			class="-mt-10 bg-blue-800 px-6 pb-8 pt-20 md:px-8 md:pb-12 md:pt-24 lg:pb-16"
			style="clip-path: polygon(0 0, 100% 40px, 100% 100%, 0 100%)"
		>
			<div class="mx-auto w-full max-w-[1000px]">
				<h2 class="mb-8 text-3xl font-bold text-white md:text-5xl">{$tChirho('landing.aboutChirho.titleChirho')}</h2>
				<p class="mb-4 text-white">
					{$tChirho('landing.aboutChirho.descriptionChirho')}
				</p>
				<div class="mb-8 flex flex-wrap justify-center gap-8 text-white">
					<a
						class="font-bold underline"
						href="https://freehebrew.online/statement-of-faith/"
						target="_blank"
						rel="noopener noreferrer"
					>
						{$tChirho('landing.aboutChirho.statementOfFaithChirho')}
						<svg class="ml-1 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</a>
					<a
						class="font-bold underline"
						href="https://hismagnificence.com/betheden-ministries-constitution/"
						target="_blank"
						rel="noopener noreferrer"
					>
						{$tChirho('landing.aboutChirho.constitutionChirho')}
						<svg class="ml-1 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</a>
				</div>

				<h3 class="mx-4 mb-8 border-b-4 border-white pb-2 text-center text-xl font-bold text-white">
					{$tChirho('landing.aboutChirho.coreValuesChirho')}
				</h3>
				<ul class="mb-16 flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3">
					<li class="w-full rounded-2xl bg-white p-6 shadow sm:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.aboutChirho.pursuitOfJoyChirho.titleChirho')}</h4>
						<p>{$tChirho('landing.aboutChirho.pursuitOfJoyChirho.descriptionChirho')}</p>
					</li>
					<li class="w-full rounded-2xl bg-white p-6 shadow sm:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.aboutChirho.partnershipChirho.titleChirho')}</h4>
						<p>
							{$tChirho('landing.aboutChirho.partnershipChirho.descriptionChirho')}
						</p>
					</li>
					<li class="w-full rounded-2xl bg-white p-6 shadow sm:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.aboutChirho.eagernessToLearnChirho.titleChirho')}</h4>
						<p>
							{$tChirho('landing.aboutChirho.eagernessToLearnChirho.descriptionChirho')}
						</p>
					</li>
					<li class="w-full rounded-2xl bg-white p-6 shadow sm:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.aboutChirho.humilityChirho.titleChirho')}</h4>
						<p>
							{$tChirho('landing.aboutChirho.humilityChirho.descriptionChirho')}
						</p>
					</li>
					<li class="w-full rounded-2xl bg-white p-6 shadow sm:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.aboutChirho.freelyGivingChirho.titleChirho')}</h4>
						<p>
							{$tChirho('landing.aboutChirho.freelyGivingChirho.descriptionChirho')}
						</p>
					</li>
					<li class="w-full rounded-2xl bg-white p-6 shadow sm:text-center">
						<h4 class="mb-3 text-lg font-bold">{$tChirho('landing.aboutChirho.empoweringChirho.titleChirho')}</h4>
						<p>
							{$tChirho('landing.aboutChirho.empoweringChirho.descriptionChirho')}
						</p>
					</li>
				</ul>

				<!-- Footer info -->
				<div class="border-t border-white/20 pt-8 text-center text-white">
					<div class="mb-4 flex flex-wrap justify-center gap-4">
						<a
							href="https://github.com/globalbibletools/platform"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 transition-colors hover:bg-white/20"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
							GitHub
						</a>
						<a
							href="https://globalbibletools.com"
							target="_blank"
							rel="noopener noreferrer"
							class="rounded-lg bg-white/10 px-5 py-2.5 transition-colors hover:bg-white/20"
						>
							Original Project
						</a>
					</div>
					{#if dataChirho.booksCountChirho}
						<p class="text-sm text-white/60">{dataChirho.booksCountChirho} books in database</p>
					{/if}
				</div>
			</div>
		</section>
	</main>
</div>
