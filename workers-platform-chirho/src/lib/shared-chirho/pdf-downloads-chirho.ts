// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

// Interlinear PDF catalog. The downloads page lists every entry; each language's reader page
// (/read-chirho/<code>) lists the entries for its languageCodeChirho. The files are in R2
// (bucket global-bible-tools-media-chirho), served from PDF_MEDIA_BASE_URL_CHIRHO.
// Workflow: spec-chirho/workflows-chirho/publish-to-worker-chirho.md (add an entry after the R2 upload).
//
// Readers Edition PDFs use badgeChirho: 'Readers Edition'.
// Filename convention: interlinear-readers-<ref>-chirho.pdf
// These are generated with the --type readers flag in generate-interlinear-bible-pdf-chirho.ts

export const PDF_MEDIA_BASE_URL_CHIRHO = 'https://media-global-tools.bible.systems/bibles-chirho';

export interface PdfDownloadChirho {
	languageCodeChirho: string;
	nameChirho: string;
	descriptionChirho: string;
	pathChirho: string;
	sizeChirho: string;
	versesChirho: string;
	badgeChirho?: string;
}

export const PDF_DOWNLOADS_CHIRHO: readonly PdfDownloadChirho[] = [
	{
		languageCodeChirho: 'eng',
		nameChirho: 'KJV Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with English word-by-word translation and King James Version text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-eng-kjv-chirho.pdf`,
		sizeChirho: '136 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'eng',
		nameChirho: 'KJV Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with English natural-reading translation and King James Version text. Glosses read naturally in English.',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-eng-kjv-chirho.pdf`,
		sizeChirho: '138 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'eng',
		nameChirho: 'WEB Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with English word-by-word translation and World English Bible text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-eng-web-chirho.pdf`,
		sizeChirho: '136 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'spa',
		nameChirho: 'Spanish RV1909 Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Spanish word-by-word translation and Reina-Valera 1909 text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-spa-rv1909-chirho.pdf`,
		sizeChirho: '134 MB',
		versesChirho: '31,102'
	},
	{
		languageCodeChirho: 'por',
		nameChirho: 'Portuguese Almeida Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Portuguese word-by-word translation and Almeida 1911 text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-por-almeida1911-chirho.pdf`,
		sizeChirho: '136 MB',
		versesChirho: '31,102'
	},
	{
		languageCodeChirho: 'hin',
		nameChirho: 'Hindi ERV Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Hindi word-by-word translation and Hindi Easy-to-Read Version text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-hin-hinerv-chirho.pdf`,
		sizeChirho: '139 MB',
		versesChirho: '31,102'
	},
	{
		languageCodeChirho: 'hin',
		nameChirho: 'Hindi FBI Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Hindi word-by-word translation and Free Bible India text. Larger fonts for easier reading.',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-hin-large-hinfbi-chirho.pdf`,
		sizeChirho: '141 MB',
		versesChirho: '31,102',
		badgeChirho: 'Large Font'
	},
	{
		languageCodeChirho: 'hin',
		nameChirho: 'Hindi ERV Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Hindi natural-reading translation and Hindi Easy-to-Read Version text. Glosses read naturally in Hindi.',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-hinerv-chirho.pdf`,
		sizeChirho: '140 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'hin',
		nameChirho: 'Hindi FBI Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Hindi natural-reading translation and Free Bible India text. Glosses read naturally in Hindi.',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-hinfbi-chirho.pdf`,
		sizeChirho: '139 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'ben',
		nameChirho: 'Bengali 2006EB Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Bengali word-by-word translation and Bengali 2006 Easy Bible text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-ben-ben2006eb-chirho.pdf`,
		sizeChirho: '140 MB',
		versesChirho: '31,102'
	},
	{
		languageCodeChirho: 'ben',
		nameChirho: 'Bengali 2006EB Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Bengali natural-reading translation and Bengali 2006 Easy Bible text. Glosses read naturally in Bengali.',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-ben-ben2006eb-chirho.pdf`,
		sizeChirho: '140 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'urd',
		nameChirho: 'Urdu Geo Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Urdu word-by-word translation and Urdu Geo reference text. Larger fonts for easier reading.',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-urd-urdugeo-chirho.pdf`,
		sizeChirho: '164 MB',
		versesChirho: '31,102',
		badgeChirho: 'Large Font'
	},
	{
		languageCodeChirho: 'ind',
		nameChirho: 'Indonesian TB Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Indonesian word-by-word translation and Terjemahan Baru reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-ind-indtb-chirho.pdf`,
		sizeChirho: '138 MB',
		versesChirho: '31,102'
	},
	{
		languageCodeChirho: 'jav',
		nameChirho: 'Javanese SABDA Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Javanese word-by-word translation and SABDA reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-jav-javsabda-chirho.pdf`,
		sizeChirho: '139 MB',
		versesChirho: '31,102'
	},
	{
		languageCodeChirho: 'rus',
		nameChirho: 'Russian Synodal Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Russian word-by-word translation and Synodal reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-rus-synodal-chirho.pdf`,
		sizeChirho: '137 MB',
		versesChirho: '31,102'
	},
	{
		languageCodeChirho: 'tur',
		nameChirho: 'Turkish HADI Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Turkish word-by-word translation and HADI (Easy-to-Read) reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-tur-turhadi-chirho.pdf`,
		sizeChirho: '137 MB',
		versesChirho: '31,102'
	},
	{
		languageCodeChirho: 'swa',
		nameChirho: 'Swahili ULB Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Swahili word-by-word translation and Unlocked Literal Bible reference text (CC BY-SA 4.0)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-swa-swhulb-chirho.pdf`,
		sizeChirho: '137 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'arb',
		nameChirho: 'Arabic SVD Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Arabic word-by-word translation and Smith Van Dyke reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-arb-arasvd-chirho.pdf`,
		sizeChirho: '174 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'kor',
		nameChirho: 'Korean KorRV Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Korean word-by-word translation and Korean Revised Version reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-kor-korrv-chirho.pdf`,
		sizeChirho: '135 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'deu',
		nameChirho: 'German Elberfelder Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with German word-by-word translation and Elberfelder 1905 reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-deu-gerelb1905-chirho.pdf`,
		sizeChirho: '137 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'fra',
		nameChirho: 'French Darby Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with French word-by-word translation and J.N. Darby reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-fra-frejnd-chirho.pdf`,
		sizeChirho: '137 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'ita',
		nameChirho: 'Italian Riveduta Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Italian word-by-word translation and Riveduta 1927 reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-ita-itarive-chirho.pdf`,
		sizeChirho: '137 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'heb',
		nameChirho: 'Modern Hebrew Interlinear Bible',
		descriptionChirho: 'Biblical Hebrew & Greek text with Modern Hebrew word-by-word glosses — archaic forms modernized as a study aid',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-heb-hebmodern-chirho.pdf`,
		sizeChirho: '137 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'mya',
		nameChirho: 'Burmese Judson Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Burmese word-by-word translation and Judson (1835) reference text',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-mya-burjudson-chirho.pdf`,
		sizeChirho: '163 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'tam',
		nameChirho: 'Tamil IRV Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Tamil word-by-word translation and Indian Revised Version reference text (CC BY-SA 4.0)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-tam-tamirv-chirho.pdf`,
		sizeChirho: '139 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'zho',
		nameChirho: 'Chinese CUV Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Simplified Chinese word-by-word translation and Chinese Union Version reference text (简体中文逐字对照圣经)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-zho-chiuns-chirho.pdf`,
		sizeChirho: '135 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'amh',
		nameChirho: 'Amharic Interlinear Bible',
		descriptionChirho: 'Hebrew & Greek text with Amharic word-by-word translation and Amharic Selassie Bible reference text (የአማርኛ ቃል–በ–ቃል መጽሐፍ ቅዱስ)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-amh-amhselassie-chirho.pdf?v=20260219c`,
		sizeChirho: '137 MB',
		versesChirho: '31,102',
		badgeChirho: 'Complete Bible'
	},
	{
		languageCodeChirho: 'vie',
		nameChirho: 'Vietnamese 1934 Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Vietnamese natural-reading translation and Vietnamese 1934 (Cadman) reference text (Kinh Thánh đối chiếu liên dòng Việt Nam)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-vie-vie1934-chirho.pdf`,
		sizeChirho: '138 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'nep',
		nameChirho: 'Nepali ERV Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Nepali natural-reading translation and Nepali ERV reference text (नेपाली अन्तरपंक्तिय बाइबल)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-nep-nep-erv-chirho.pdf`,
		sizeChirho: '140 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'ukr',
		nameChirho: 'Ukrainian Ogienko Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Ukrainian natural-reading translation and Ogienko (1962) reference text (Українська міжрядкова Біблія)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-ukr-ukrogienko-chirho.pdf`,
		sizeChirho: '138 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'jpn',
		nameChirho: 'Japanese Kougo-yaku Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Japanese natural-reading translation and Kougo-yaku (口語訳 1955) reference text (日本語逐語対照聖書)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-jpn-japkougo-chirho.pdf`,
		sizeChirho: '136 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'srp',
		nameChirho: 'Serbian DK Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Serbian natural-reading translation and Daničić-Karadžić (1868) reference text (Српска међуредна Библија)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-srp-srpdk-chirho.pdf`,
		sizeChirho: '137 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'guj',
		nameChirho: 'Gujarati IRV Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Gujarati natural-reading translation and Indian Revised Version (2019) reference text (ગુજરાતી અંતરરેખિય બાઇબલ)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-guj-gujirv-chirho.pdf`,
		sizeChirho: '140 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'tha',
		nameChirho: 'Thai Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Thai natural-reading translation and Thai KJV reference text (ภาษาไทย พระคัมภีร์ระหว่างบรรทัด)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-tha-chirho.pdf`,
		sizeChirho: '153 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	},
	{
		languageCodeChirho: 'tel',
		nameChirho: 'Telugu Interlinear Bible (Natural Reading)',
		descriptionChirho: 'Hebrew & Greek text with Telugu natural-reading translation and Telugu IRV (2019) reference text (తెలుగు అంతర్రేఖ బైబిల్)',
		pathChirho: `${PDF_MEDIA_BASE_URL_CHIRHO}/interlinear-readers-tel-telirv-chirho.pdf`,
		sizeChirho: '140 MB',
		versesChirho: '31,102',
		badgeChirho: 'Readers Edition'
	}
];

export function pdfDownloadsForLanguageChirho(languageCodeChirho: string): PdfDownloadChirho[] {
	return PDF_DOWNLOADS_CHIRHO.filter((pdfChirho) => pdfChirho.languageCodeChirho === languageCodeChirho);
}

/** Button label on a language page: "KJV Interlinear Bible (Natural Reading)" -> "KJV". */
export function pdfShortLabelChirho(pdfChirho: PdfDownloadChirho): string {
	return pdfChirho.nameChirho.replace(/ Interlinear Bible.*$/, '');
}
