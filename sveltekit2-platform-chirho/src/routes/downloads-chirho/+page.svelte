<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	interface PdfDownloadChirho {
		nameChirho: string;
		descriptionChirho: string;
		pathChirho: string;
		sizeChirho: string;
		versesChirho: string;
	}

	const downloadsChirho: PdfDownloadChirho[] = [
		{
			nameChirho: 'KJV Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with English word-by-word translation and King James Version text',
			pathChirho: '/bibles-chirho/interlinear-kjv-chirho.pdf',
			sizeChirho: '136 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'WEB Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with English word-by-word translation and World English Bible text',
			pathChirho: '/bibles-chirho/interlinear-web-chirho.pdf',
			sizeChirho: '136 MB',
			versesChirho: '31,102'
		}
	];
</script>

<svelte:head>
	<title>Downloads | Global Bible Tools</title>
	<meta name="description" content="Download interlinear Bible PDFs with Hebrew & Greek text and word-by-word translations" />
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<header class="text-center mb-12">
			<h1 class="text-3xl font-bold text-slate-800">Interlinear Bible Downloads</h1>
			<p class="mt-2 text-slate-600">
				Free PDF downloads with Hebrew & Greek text, Strong's numbers, and word-by-word translations
			</p>
		</header>

		<div class="grid gap-6">
			{#each downloadsChirho as downloadChirho}
				<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<h2 class="text-xl font-semibold text-slate-800">{downloadChirho.nameChirho}</h2>
							<p class="mt-1 text-slate-600">{downloadChirho.descriptionChirho}</p>
							<div class="mt-3 flex items-center gap-4 text-sm text-slate-500">
								<span class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									PDF
								</span>
								<span class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
									</svg>
									{downloadChirho.sizeChirho}
								</span>
								<span class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
									{downloadChirho.versesChirho} verses
								</span>
							</div>
						</div>
						<a
							href={downloadChirho.pathChirho}
							download
							class="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download
						</a>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
			<h3 class="font-semibold text-blue-800">About These Downloads</h3>
			<p class="mt-2 text-blue-700 text-sm">
				Each PDF contains the complete Bible with original Hebrew (Old Testament) and Greek (New Testament) text,
				Strong's numbers with links to BibleHub, and word-by-word interlinear translation.
				The reference translation text appears below each verse for easy reading.
			</p>
			<p class="mt-2 text-blue-700 text-sm">
				These PDFs are provided free of charge for personal study and ministry use.
				All reference Bible texts used are in the public domain.
			</p>
		</div>

		<footer class="mt-8 text-center text-sm text-slate-500">
			<a href="/" class="text-blue-600 hover:underline">← Back to Home</a>
		</footer>
	</div>
</div>
