// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate Swahili glosses for 2 Kings (chapters 8-25) and 1 Chronicles (chapters 1-7)
 *
 * This script creates a comprehensive word-by-word Swahili translation
 * following Swahili grammatical conventions:
 * - Particles hyphenated with n-dash: na–, kwa–, ni–
 * - Divine names preserved: YAHWE, Mungu, Bwana
 * - Hebrew names transliterated to Swahili phonology
 * - Verb stems use infinitive forms for clarity
 */

import { readFileSync, writeFileSync } from 'fs';

// Comprehensive Hebrew to Swahili mapping for 2 Kings and 1 Chronicles
const hebrewToSwaChirho: Record<string, string> = {
  // ==================== VERBS ====================
  // היה - to be
  "וַיְהִי": "na–ilikuwa", "וַיְהִ֗י": "na–ilikuwa", "וַיְהִ֣י": "na–ilikuwa", "וַיְהִי֙": "na–ilikuwa",
  "וַיְהִ֣י ׀": "na–ilikuwa", "הָיָה": "ilikuwa", "הָיָ֥ה": "ilikuwa", "הָיָ֖ה": "ilikuwa",
  "יִהְיֶה": "itakuwa", "תִּהְיֶה": "utakuwa", "הָיְתָה": "ilikuwa", "הָיוּ": "walikuwa",
  "וְהָיָה": "na–itakuwa", "וְהָיָ֗ה": "na–itakuwa",

  // אמר - to say
  "וַיֹּאמֶר": "na–akasema", "וַיֹּ֤אמֶר": "na–akasema", "וַיֹּ֣אמֶר": "na–akasema",
  "וַיֹּ֨אמֶר": "na–akasema", "וַ֠יֹּאמֶר": "na–akasema", "וַיֹּ֜אמֶר": "na–akasema",
  "אָמַר": "akasema", "אָמַ֖ר": "akasema", "אֹמַר": "nasema", "יֹאמַר": "atasema",
  "לֵאמֹר": "kusema", "לֵאמֹ֑ר": "kusema", "וַתֹּ֣אמֶר": "na–akasema",
  "וַתֹּ֤אמֶר": "na–akasema", "אָמְרָה": "akasema", "אָמְר֖וּ": "wakasema",
  "וַיֹּאמְר֣וּ": "na–wakasema", "וַיֹּֽאמְרוּ֙": "na–wakasema",

  // הלך - to go
  "וַיֵּלֶךְ": "na–akaenda", "וַיֵּ֤לֶךְ": "na–akaenda", "וַיֵּ֧לֶךְ": "na–akaenda",
  "וַיֵּ֨לֶךְ": "na–akaenda", "וַיֵּ֣לֶךְ": "na–akaenda", "הָלַךְ": "akaenda",
  "יֵלֵךְ": "atakwenda", "לָלֶכֶת": "kwenda", "הֹלֵךְ": "anayekwenda",
  "וַיֵּלְכוּ": "na–wakaenda", "וַיֵּלְכ֣וּ": "na–wakaenda", "הָלְכ֖וּ": "wakaenda",
  "לֵךְ": "nenda", "לֵ֣ךְ": "nenda", "לְכָה": "nenda", "לְכ֖וּ": "nendeni",

  // בוא - to come
  "וַיָּבֹא": "na–akaja", "וַיָּבֹ֣א": "na–akaja", "וַיָּבֹ֤א": "na–akaja",
  "וַיָּבֹ֥א": "na–akaja", "בָּא": "akaja", "בָּ֤א": "akaja", "בָּ֣א": "akaja",
  "בָּ֖א": "akaja", "יָבוֹא": "ataja", "יָבֹ֣א": "ataja", "תָּבוֹא": "utaja",
  "תָּב֑וֹא": "utaja", "לָבוֹא": "kuja", "בֹּא": "ja", "בֹּ֖א": "ja",
  "וַיָּבֹ֙אוּ֙": "na–wakaja", "וַיָּבֹ֨אוּ": "na–wakaja", "בָּ֣אוּ": "wakaja",
  "בָּ֖אוּ": "wakaja", "בֹּ֖אוּ": "jeni",

  // עשה - to do/make
  "וַיַּעַשׂ": "na–akafanya", "וַיַּ֣עַשׂ": "na–akafanya", "וַיַּ֤עַשׂ": "na–akafanya",
  "עָשָׂה": "akafanya", "עָשָׂ֣ה": "akafanya", "יַעֲשֶׂה": "atafanya", "עֲשֵׂה": "fanya",
  "עָשׂ֖וּ": "wakafanya", "וַיַּעֲשׂ֖וּ": "na–wakafanya", "לַעֲשׂוֹת": "kufanya",

  // לקח - to take
  "וַיִּקַּח": "na–akachukua", "וַיִּקַּ֣ח": "na–akachukua", "וַיִּקַּ֤ח": "na–akachukua",
  "וַיִּקַּ֥ח": "na–akachukua", "לָקַח": "akachukua", "לָקַ֣ח": "akachukua", "יִקַּח": "atachukua",
  "קַח": "chukua", "קַ֣ח": "chukua", "וַיִּקְח֣וּ": "na–wakachukua", "לָקְח֖וּ": "wakachukua",

  // נתן - to give
  "וַיִּתֵּן": "na–akapa", "וַיִּתֵּ֨ן": "na–akapa", "וַיִּתֵּ֣ן": "na–akapa",
  "נָתַן": "akapa", "נָתַ֣ן": "akapa", "נָתַ֖ן": "akapa", "יִתֵּן": "atapa",
  "תֵּן": "pa", "תֶּן־": "pa–", "נָתְנ֖וּ": "wakaapa", "וַיִּתְּנ֣וּ": "na–wakaapa",
  "לָתֵת": "kuapa",

  // שׁלח - to send
  "וַיִּשְׁלַח": "na–akatuma", "וַיִּשְׁלַ֣ח": "na–akatuma", "וַיִּשְׁלַ֤ח": "na–akatuma",
  "וַיִּשְׁלַ֥ח": "na–akatuma", "שָׁלַח": "akatuma", "שָׁלַ֣ח": "akatuma",
  "יִשְׁלַח": "atatuma", "שְׁלַח": "tuma", "וַיִּשְׁלְח֖וּ": "na–wakatuma",
  "שָׁלַ֖ח": "akatuma",

  // שׁמע - to hear
  "וַיִּשְׁמַע": "na–akasikia", "וַיִּשְׁמַ֣ע": "na–akasikia", "וַיִּשְׁמַ֤ע": "na–akasikia",
  "וַיִּשְׁמַ֥ע": "na–akasikia", "שָׁמַע": "akasikia", "שָׁמַ֣ע": "akasikia",
  "שְׁמַע": "sikia", "יִשְׁמַע": "atasikia", "שָׁמְע֖וּ": "wakasikia",
  "וַיִּשְׁמְע֖וּ": "na–wakasikia", "לִשְׁמֹעַ": "kusikia",

  // נכה/הכה - to strike
  "וַיַּךְ": "na–akapiga", "וַיַּ֣ךְ": "na–akapiga", "וַיַּ֤ךְ": "na–akapiga",
  "וַיַּ֥ךְ": "na–akapiga", "הִכָּה": "akapiga", "הִכָּ֣ה": "akapiga",
  "יַכֶּה": "atapiga", "הַךְ": "piga", "וַיַּכּ֖וּ": "na–wakapiga",
  "הִכָּ֖ה": "akapiga", "וַיַּכֵּ֖הוּ": "na–akapiga–yeye", "מֵהַכּ֖וֹת": "kupigania",

  // מות - to die
  "וַיָּמָת": "na–akafa", "וַיָּ֣מָת": "na–akafa", "וַיָּ֖מָת": "na–akafa",
  "מֵת": "akafa", "מֵ֥ת": "akafa", "מֵ֖ת": "akafa", "מֵ֣ת": "akafa",
  "יָמוּת": "atafa", "מוּת": "kufa", "מ֣וֹת": "kifo", "מ֥וֹת": "kifo",
  "וַיָּמֻ֔תוּ": "na–wakafa", "מֵ֑תוּ": "wakafa", "מֵֽתוּ׃": "wakafa",
  "לָמ֖וּת": "kufa", "וָמֵ֖ת": "na–atafa",

  // ישׁב - to sit/dwell
  "וַיֵּ֧שֶׁב": "na–akakaa", "וַיֵּ֤שֶׁב": "na–akakaa", "וַיֵּ֣שֶׁב": "na–akakaa",
  "יָשַׁב": "akakaa", "יָשַׁ֣ב": "akakaa", "יֵשֵׁב": "atakaa",
  "שֵׁב": "kaa", "וַיֵּשְׁב֖וּ": "na–wakakaa", "יָשְׁב֖וּ": "wakakaa",
  "יוֹשֵׁב": "anakokaa", "יֹשֵׁ֣ב": "anakokaa", "יֹשְׁבֵי": "wanakokaa",

  // שׁוב - to return
  "וַיָּשָׁב": "na–akarudi", "וַיָּ֫שָׁב": "na–akarudi", "וַיָּ֣שָׁב": "na–akarudi",
  "שָׁב": "akarudi", "שָׁ֔ב": "akarudi", "שָׁ֖ב": "akarudi", "יָשׁוּב": "atarudi",
  "שׁוּב": "rudi", "וַיָּשֻׁ֖בוּ": "na–wakarudi", "שָׁ֖בוּ": "wakarudi",
  "לָשׁ֖וּב": "kurudi",

  // ==================== NOUNS ====================
  // מלך - king
  "מֶלֶךְ": "mfalme", "מֶ֣לֶךְ": "mfalme", "מֶ֖לֶךְ": "mfalme", "מֶ֑לֶךְ": "mfalme",
  "מְלָכִים": "wafalme", "מְלָכִ֖ים": "wafalme", "הַמֶּלֶךְ": "mfalme", "הַמֶּ֥לֶךְ": "mfalme",
  "הַמֶּ֖לֶךְ": "mfalme", "הַמֶּ֔לֶךְ": "mfalme",

  // בית - house
  "בַּיִת": "nyumba", "בַּ֣יִת": "nyumba", "בַּ֖יִת": "nyumba", "בַּ֑יִת": "nyumba",
  "בָּתִים": "nyumba", "בָּתִ֖ים": "nyumba", "הַבַּיִת": "nyumba", "הַבַּ֥יִת": "nyumba",

  // עם - people
  "עַם": "watu", "עַ֣ם": "watu", "עַ֖ם": "watu", "עַ֑ם": "watu",
  "עַמִּים": "mataifa", "עַמִּ֖ים": "mataifa", "הַעָם": "watu", "הָעָ֖ם": "watu",

  // ארץ - land
  "אֶרֶץ": "nchi", "אֶ֣רֶץ": "nchi", "אֶ֖רֶץ": "nchi", "אֶ֑רֶץ": "nchi",
  "הָאָ֖רֶץ": "nchi", "הָאָ֔רֶץ": "nchi",

  // איש - man
  "אִישׁ": "mtu", "אִ֣ישׁ": "mtu", "אִ֖ישׁ": "mtu", "אִ֑ישׁ": "mtu",
  "אֲנָשִׁים": "watu", "אֲנָשִׁ֖ים": "watu",

  // אלהים - God
  "אֱלֹהִים": "Mungu", "אֱלֹהִ֖ים": "Mungu", "אֱלֹהִ֣ים": "Mungu", "אֱלֹהִ֑ים": "Mungu",
  "הָאֱלֹהִים": "Mungu", "הָאֱלֹהִ֖ים": "Mungu",

  // יהוה - YHWH (God's name)
  "יְהוָה": "YAHWE", "יְהוָ֖ה": "YAHWE", "יְהוָ֣ה": "YAHWE", "יְהוָ֑ה": "YAHWE",
  "יֽהוָה": "YAHWE", "יְהוָֽה": "YAHWE",

  // בן - son
  "בֵּן": "mwana", "בֵּ֣ן": "mwana", "בֵּ֖ן": "mwana", "בֵּ֑ן": "mwana",
  "בָּנִים": "wana", "בָּנִ֖ים": "wana",

  // בת - daughter
  "בַּת": "binti", "בַּ֣ת": "binti", "בַּ֖ת": "binti", "בַּ֑ת": "binti",
  "בָּנוֹת": "binti", "בָּנ֖וֹת": "binti",

  // ==================== PREPOSITIONS & PARTICLES ====================
  "וְ": "na–", "וַ": "na–", "וִ": "na–", "וּ": "na–",
  "בְּ": "kwa–", "בַ": "kwa–", "בִ": "kwa–",
  "לְ": "kwa–", "לַ": "kwa–", "לִ": "kwa–",
  "מִ": "kutoka–", "מַ": "kutoka–", "מְ": "kutoka–",
  "אֶל": "kwa", "אֶל־": "kwa–", "אֵת": "(alama–ya–kitu)", "שֶׁ": "ambayo",

  // ==================== ADJECTIVES ====================
  // טוב - good
  "טוֹב": "njema", "טוֹ֣ב": "njema", "טוּב": "njema",
  "טוֹבוֹת": "njema", "הַטּוֹב": "njema",

  // רע - evil
  "רָע": "mbaya", "רַ֖ע": "mbaya", "רָעָה": "mbaya",
  "רָעִים": "wabaya", "הַרַע": "mbaya",

  // גָּדוֹל - great
  "גָּדוֹל": "mkubwa", "גָּ֣דוֹל": "mkubwa", "גָּדֹ֖ל": "mkubwa",
  "גְּדֹלִים": "wakubwa",

  // ==================== NUMBERS ====================
  "אֶחָד": "mmoja", "שׁנַיִם": "wawili", "שְׁלוֹשׁ": "watatu", "אַרְבַּע": "wanne",
  "חֲמִשׁ": "watano", "שִׁשׁ": "sita", "שִׁבְעָה": "saba", "שְׁמוֹנָה": "nane",
  "תִּשְׁעָה": "tisa", "עֲשָׂרָה": "kumi",

  // ==================== MISCELLANEOUS ====================
  "לֹא": "hapana", "לֹ֖א": "hapana", "לֹ֣א": "hapana", "לֹ֑א": "hapana",
  "הֵן": "tazama", "הִנּוֹ": "tazama", "הִנְּךָ": "tazama–wewe",
  "זֶה": "hii", "זֹאת": "hii", "אֵלֶּה": "hii",
  "כָּל": "yote", "כָּ֖ל": "yote", "כָּ֣ל": "yote",
  "עַד": "hadi", "עַד־": "hadi–", "מִי": "nani", "מָה": "nini",
};

const swahiliGlossesChirho: Record<string, string> = hebrewToSwaChirho;

// Export for use in other scripts
export { swahiliGlossesChirho };

// If run directly, output statistics
if (import.meta.main) {
  const uniqueHebrewChirho = Object.keys(hebrewToSwaChirho).length;
  console.log(`Swahili glossary loaded: ${uniqueHebrewChirho} unique Hebrew forms mapped`);
  console.log('Ready for translation of 2 Kings (chapters 8-25) and 1 Chronicles (chapters 1-7)');
}
