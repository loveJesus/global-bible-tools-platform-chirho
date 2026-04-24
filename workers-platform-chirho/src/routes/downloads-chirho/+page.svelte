<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { tChirho } from '$lib/i18n-chirho';

	interface PdfDownloadChirho {
		nameChirho: string;
		descriptionChirho: string;
		pathChirho: string;
		sizeChirho: string;
		versesChirho: string;
		badgeChirho?: string;
	}

	// Readers Edition PDFs can be added below with badgeChirho: 'Readers Edition'
	// Filename convention: interlinear-readers-<ref>-chirho.pdf
	// These will be generated with: --type readers flag in generate-interlinear-bible-pdf-chirho.ts

	const downloadsChirho: PdfDownloadChirho[] = [
		{
			nameChirho: 'KJV Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with English word-by-word translation and King James Version text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-eng-kjv-chirho.pdf',
			sizeChirho: '136 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'KJV Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with English natural-reading translation and King James Version text. Glosses read naturally in English.',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-eng-kjv-chirho.pdf',
			sizeChirho: '138 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'WEB Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with English word-by-word translation and World English Bible text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-eng-web-chirho.pdf',
			sizeChirho: '136 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Spanish RV1909 Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Spanish word-by-word translation and Reina-Valera 1909 text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-spa-rv1909-chirho.pdf',
			sizeChirho: '134 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Portuguese Almeida Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Portuguese word-by-word translation and Almeida 1911 text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-por-almeida1911-chirho.pdf',
			sizeChirho: '136 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Hindi ERV Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Hindi word-by-word translation and Hindi Easy-to-Read Version text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-hin-hinerv-chirho.pdf',
			sizeChirho: '139 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Hindi FBI Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Hindi word-by-word translation and Free Bible India text. Larger fonts for easier reading.',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-hin-large-hinfbi-chirho.pdf',
			sizeChirho: '141 MB',
			versesChirho: '31,102',
			badgeChirho: 'Large Font'
		},
		{
			nameChirho: 'Hindi ERV Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Hindi natural-reading translation and Hindi Easy-to-Read Version text. Glosses read naturally in Hindi.',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-hinerv-chirho.pdf',
			sizeChirho: '140 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Hindi FBI Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Hindi natural-reading translation and Free Bible India text. Glosses read naturally in Hindi.',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-hinfbi-chirho.pdf',
			sizeChirho: '139 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Bengali 2006EB Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Bengali word-by-word translation and Bengali 2006 Easy Bible text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-ben-ben2006eb-chirho.pdf',
			sizeChirho: '140 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Bengali 2006EB Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Bengali natural-reading translation and Bengali 2006 Easy Bible text. Glosses read naturally in Bengali.',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-ben-ben2006eb-chirho.pdf',
			sizeChirho: '140 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Urdu Geo Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Urdu word-by-word translation and Urdu Geo reference text. Larger fonts for easier reading.',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-urd-urdugeo-chirho.pdf',
			sizeChirho: '164 MB',
			versesChirho: '31,102',
			badgeChirho: 'Large Font'
		},
		{
			nameChirho: 'Indonesian TB Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Indonesian word-by-word translation and Terjemahan Baru reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-ind-indtb-chirho.pdf',
			sizeChirho: '138 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Javanese SABDA Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Javanese word-by-word translation and SABDA reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-jav-javsabda-chirho.pdf',
			sizeChirho: '139 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Russian Synodal Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Russian word-by-word translation and Synodal reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-rus-synodal-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Turkish HADI Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Turkish word-by-word translation and HADI (Easy-to-Read) reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-tur-turhadi-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Swahili ULB Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Swahili word-by-word translation and Unlocked Literal Bible reference text (CC BY-SA 4.0)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-swa-swhulb-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Arabic SVD Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Arabic word-by-word translation and Smith Van Dyke reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-arb-arasvd-chirho.pdf',
			sizeChirho: '174 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Korean KorRV Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Korean word-by-word translation and Korean Revised Version reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-kor-korrv-chirho.pdf',
			sizeChirho: '135 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'German Elberfelder Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with German word-by-word translation and Elberfelder 1905 reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-deu-gerelb1905-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'French Darby Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with French word-by-word translation and J.N. Darby reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-fra-frejnd-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Italian Riveduta Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Italian word-by-word translation and Riveduta 1927 reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-ita-itarive-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Modern Hebrew Interlinear Bible',
			descriptionChirho: 'Biblical Hebrew & Greek text with Modern Hebrew word-by-word glosses — archaic forms modernized as a study aid',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-heb-hebmodern-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Burmese Judson Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Burmese word-by-word translation and Judson (1835) reference text',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-mya-burjudson-chirho.pdf',
			sizeChirho: '163 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Tamil IRV Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Tamil word-by-word translation and Indian Revised Version reference text (CC BY-SA 4.0)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-tam-tamirv-chirho.pdf',
			sizeChirho: '139 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Chinese CUV Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Simplified Chinese word-by-word translation and Chinese Union Version reference text (简体中文逐字对照圣经)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-zho-chiuns-chirho.pdf',
			sizeChirho: '135 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Amharic Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Amharic word-by-word translation and Amharic Selassie Bible reference text (የአማርኛ ቃል–በ–ቃል መጽሐፍ ቅዱስ)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-amh-amhselassie-chirho.pdf?v=20260219c',
			sizeChirho: '137 MB',
			versesChirho: '31,102',
			badgeChirho: 'Complete Bible'
		},
		{
			nameChirho: 'Vietnamese 1934 Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Vietnamese natural-reading translation and Vietnamese 1934 (Cadman) reference text (Kinh Thánh đối chiếu liên dòng Việt Nam)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-vie-vie1934-chirho.pdf',
			sizeChirho: '138 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Nepali ERV Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Nepali natural-reading translation and Nepali ERV reference text (नेपाली अन्तरपंक्तिय बाइबल)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-nep-nep-erv-chirho.pdf',
			sizeChirho: '140 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Ukrainian Ogienko Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Ukrainian natural-reading translation and Ogienko (1962) reference text (Українська міжрядкова Біблія)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-ukr-ukrogienko-chirho.pdf',
			sizeChirho: '138 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Japanese Kougo-yaku Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Japanese natural-reading translation and Kougo-yaku (口語訳 1955) reference text (日本語逐語対照聖書)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-jpn-japkougo-chirho.pdf',
			sizeChirho: '136 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Serbian DK Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Serbian natural-reading translation and Daničić-Karadžić (1868) reference text (Српска међуредна Библија)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-srp-srpdk-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Gujarati IRV Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Gujarati natural-reading translation and Indian Revised Version (2019) reference text (ગુજરાતી અંતરરેખિય બાઇબલ)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-guj-gujirv-chirho.pdf',
			sizeChirho: '140 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Thai Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Thai natural-reading translation and Thai KJV reference text (ภาษาไทย พระคัมภีร์ระหว่างบรรทัด)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-tha-chirho.pdf',
			sizeChirho: '153 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		},
		{
			nameChirho: 'Telugu Interlinear Bible (Natural Reading)',
			descriptionChirho: 'Hebrew & Greek text with Telugu natural-reading translation and Telugu IRV (2019) reference text (తెలుగు అంతర్రేఖ బైబిల్)',
			pathChirho: 'https://media-global-tools.bible.systems/bibles-chirho/interlinear-readers-tel-telirv-chirho.pdf',
			sizeChirho: '140 MB',
			versesChirho: '31,102',
			badgeChirho: 'Readers Edition'
		}
	];
</script>

<svelte:head>
	<title>{$tChirho('common.downloadsChirho.titleChirho')} | {$tChirho('common.appNameChirho')}</title>
	<meta name="description" content={$tChirho('common.downloadsChirho.metaDescriptionChirho')} />
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<header class="text-center mb-12">
			<h1 class="text-3xl font-bold text-slate-800">{$tChirho('common.downloadsChirho.interlinearDownloadsChirho')}</h1>
			<p class="mt-2 text-slate-600">
				{$tChirho('common.downloadsChirho.freePdfDownloadsChirho')}
			</p>
		</header>

		<div class="grid gap-6">
			{#each downloadsChirho as downloadChirho}
				<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h2 class="text-xl font-semibold text-slate-800">{downloadChirho.nameChirho}</h2>
								{#if downloadChirho.badgeChirho}
									<span class="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
										{downloadChirho.badgeChirho}
									</span>
								{/if}
							</div>
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
							{$tChirho('common.actionsChirho.downloadChirho')}
						</a>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
			<h3 class="font-semibold text-blue-800">{$tChirho('common.downloadsChirho.aboutDownloadsChirho')}</h3>
			<p class="mt-2 text-blue-700 text-sm">
				{$tChirho('common.downloadsChirho.aboutDescription1Chirho')}
			</p>
			<p class="mt-2 text-blue-700 text-sm">
				{$tChirho('common.downloadsChirho.aboutDescription2Chirho')}
			</p>
		</div>

		<footer class="mt-8 text-center text-sm text-slate-500">
			<a href="/" class="text-blue-600 hover:underline">← {$tChirho('common.navChirho.homeChirho')}</a>
		</footer>
	</div>
</div>
