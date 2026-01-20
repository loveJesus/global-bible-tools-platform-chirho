<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';

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
	<meta name="description" content="Free interlinear Bible translations with Greek and Hebrew. Collaborative platform for Bible translation into every language." />
</svelte:head>

<main class="min-h-screen">
	<!-- Hero Section -->
	<section class="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
		<div class="mx-auto max-w-5xl px-4 py-20 text-center">
			<h1 class="text-4xl font-bold sm:text-5xl">Global Bible Tools</h1>
			<p class="mt-6 text-xl text-slate-300 max-w-2xl mx-auto">
				The global Church needs access to serious biblical language study tools in their own language.
				We're building free, open resources for Bible translation and study.
			</p>
			<div class="mt-8 flex flex-wrap justify-center gap-4">
				<a
					href="/read-chirho"
					class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
				>
					Read the Bible
				</a>
				<a
					href="#vision-chirho"
					class="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
				>
					Learn More
				</a>
			</div>
		</div>
	</section>

	<!-- Quick Access Cards -->
	<section class="bg-white border-b border-slate-200">
		<div class="mx-auto max-w-5xl px-4 py-12">
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<a
					href="/read-chirho"
					class="group rounded-xl border border-slate-200 bg-slate-50 p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors"
				>
					<div class="flex items-center gap-3">
						<div class="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
							</svg>
						</div>
						<div>
							<h2 class="text-lg font-semibold text-slate-900">Read</h2>
							<p class="text-sm text-slate-600">Interlinear translations</p>
						</div>
					</div>
				</a>

				<a
					href="/translate-chirho"
					class="group rounded-xl border border-slate-200 bg-slate-50 p-6 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
				>
					<div class="flex items-center gap-3">
						<div class="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:bg-emerald-200">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
							</svg>
						</div>
						<div>
							<h2 class="text-lg font-semibold text-slate-900">Translate</h2>
							<p class="text-sm text-slate-600">Contribute translations</p>
						</div>
					</div>
				</a>

				<a
					href="/downloads-chirho"
					class="group rounded-xl border border-slate-200 bg-slate-50 p-6 hover:border-purple-300 hover:bg-purple-50 transition-colors"
				>
					<div class="flex items-center gap-3">
						<div class="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-200">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
						</div>
						<div>
							<h2 class="text-lg font-semibold text-slate-900">Downloads</h2>
							<p class="text-sm text-slate-600">PDF Bibles (KJV, WEB)</p>
						</div>
					</div>
				</a>
			</div>
		</div>
	</section>

	<!-- Vision Section -->
	<section id="vision-chirho" class="bg-slate-50">
		<div class="mx-auto max-w-5xl px-4 py-16">
			<h2 class="text-3xl font-bold text-slate-900 text-center">Our Vision</h2>
			<p class="mt-4 text-lg text-slate-600 text-center max-w-3xl mx-auto">
				We believe every person should have access to tools that help them study the Bible in its original languages.
				Our platform provides free, word-for-word interlinear translations.
			</p>

			<div class="mt-12 grid gap-8 md:grid-cols-2">
				<div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
					<h3 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
						<span class="text-2xl">📖</span> Interlinear Translations
					</h3>
					<p class="mt-3 text-slate-600">
						Each Greek or Hebrew word is paired with its translation, allowing readers to see
						exactly how the original text maps to their language.
					</p>
				</div>

				<div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
					<h3 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
						<span class="text-2xl">🌍</span> Many Languages
					</h3>
					<p class="mt-3 text-slate-600">
						Translations are being created for languages around the world, making biblical
						language study accessible to more people than ever before.
					</p>
				</div>

				<div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
					<h3 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
						<span class="text-2xl">🔓</span> Free & Open
					</h3>
					<p class="mt-3 text-slate-600">
						All our resources are freely available. We believe in removing barriers to
						biblical language study and empowering the global Church.
					</p>
				</div>

				<div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
					<h3 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
						<span class="text-2xl">🤝</span> Collaborative
					</h3>
					<p class="mt-3 text-slate-600">
						Anyone can contribute to translations. Our platform enables collaboration
						between translators, reviewers, and language experts.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Progress Section -->
	{#if dataChirho.progressChirho && dataChirho.progressChirho.length > 0}
		<section class="bg-white">
			<div class="mx-auto max-w-5xl px-4 py-16">
				<h2 class="text-3xl font-bold text-slate-900 text-center">Translation Progress</h2>
				<p class="mt-4 text-lg text-slate-600 text-center">
					Languages with active translations
				</p>

				<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each dataChirho.progressChirho as langChirho}
						<a
							href="/read-chirho/{langChirho.codeChirho}"
							class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition-colors"
						>
							<div>
								<span class="font-medium text-slate-900">{langChirho.nameChirho}</span>
								<span class="ml-2 text-xs text-slate-500 uppercase">{langChirho.codeChirho}</span>
							</div>
							<div class="text-right">
								<span class="text-sm font-medium text-blue-600">{langChirho.bookCountChirho} books</span>
								<span class="text-xs text-slate-500 ml-1">({formatCountChirho(langChirho.glossCountChirho)} glosses)</span>
							</div>
						</a>
					{/each}
				</div>

				<div class="mt-8 text-center">
					<a href="/read-chirho" class="text-blue-600 hover:underline font-medium">
						View all languages →
					</a>
				</div>
			</div>
		</section>
	{/if}

	<!-- About Section -->
	<section class="bg-slate-800 text-white">
		<div class="mx-auto max-w-5xl px-4 py-16">
			<h2 class="text-3xl font-bold text-center">About</h2>
			<p class="mt-4 text-lg text-slate-300 text-center max-w-2xl mx-auto">
				Global Bible Tools is a collaborative project to create free interlinear Bible translations
				for languages around the world. We are part of a global community working to make
				biblical language study accessible to everyone.
			</p>

			<div class="mt-10 flex flex-wrap justify-center gap-6">
				<a
					href="https://github.com/globalbibletools/platform"
					target="_blank"
					rel="noopener noreferrer"
					class="px-5 py-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
					GitHub
				</a>
				<a
					href="https://globalbibletools.com"
					target="_blank"
					rel="noopener noreferrer"
					class="px-5 py-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
				>
					Original Project
				</a>
			</div>

			{#if dataChirho.booksCountChirho}
				<p class="mt-10 text-center text-sm text-slate-400">
					{dataChirho.booksCountChirho} books in database
				</p>
			{/if}
		</div>
	</section>
</main>
