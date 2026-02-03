// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate Turkish glosses for 2 Samuel
 *
 * This script creates a comprehensive word-by-word Turkish translation
 * following Turkish grammatical conventions:
 * - Particles hyphenated with n-dash: ve–, ile–, için–
 * - Divine names preserved: YHVH, Elohim, Adonay
 * - Hebrew names transliterated to Turkish phonology
 */

import { readFileSync, writeFileSync } from 'fs';

// Comprehensive Hebrew to Turkish mapping
const hebrewToTurkishChirho: Record<string, string> = {
  // ==================== VERBS ====================
  // היה - to be
  "וַיְהִי": "ve–oldu", "וַיְהִ֗י": "ve–oldu", "וַיְהִ֣י": "ve–oldu", "וַיְהִי֙": "ve–oldu",
  "וַיְהִ֣י ׀": "ve–oldu", "הָיָה": "oldu", "הָיָ֥ה": "oldu", "הָיָ֖ה": "oldu",
  "יִהְיֶה": "olacak", "תִּהְיֶה": "olacaksın", "הָיְתָה": "oldu", "הָיוּ": "oldular",
  "וְהָיָה": "ve–oldu", "וְהָיָ֗ה": "ve–oldu",

  // אמר - to say
  "וַיֹּאמֶר": "ve–dedi", "וַיֹּ֤אמֶר": "ve–dedi", "וַיֹּ֣אמֶר": "ve–dedi",
  "וַיֹּ֨אמֶר": "ve–dedi", "וַ֠יֹּאמֶר": "ve–dedi", "וַיֹּ֜אמֶר": "ve–dedi",
  "אָמַר": "dedi", "אָמַ֖ר": "dedi", "אֹמַר": "diyorum", "יֹאמַר": "diyecek",
  "לֵאמֹר": "diyerek", "לֵאמֹ֑ר": "diyerek", "וַתֹּ֣אמֶר": "ve–dedi",
  "וַתֹּ֤אמֶר": "ve–dedi", "אָמְרָה": "dedi", "אָמְר֖וּ": "dediler",
  "וַיֹּאמְר֣וּ": "ve–dediler", "וַיֹּֽאמְרוּ֙": "ve–dediler",

  // הלך - to go
  "וַיֵּלֶךְ": "ve–gitti", "וַיֵּ֤לֶךְ": "ve–gitti", "וַיֵּ֧לֶךְ": "ve–gitti",
  "וַיֵּ֨לֶךְ": "ve–gitti", "וַיֵּ֣לֶךְ": "ve–gitti", "הָלַךְ": "gitti",
  "יֵלֵךְ": "gidecek", "לָלֶכֶת": "gitmek–için", "הֹלֵךְ": "giden",
  "וַיֵּלְכוּ": "ve–gittiler", "וַיֵּלְכ֣וּ": "ve–gittiler", "הָלְכ֖וּ": "gittiler",
  "לֵךְ": "git", "לֵ֣ךְ": "git", "לְכָה": "git", "לְכ֖וּ": "gidin",

  // בוא - to come
  "וַיָּבֹא": "ve–geldi", "וַיָּבֹ֣א": "ve–geldi", "וַיָּבֹ֤א": "ve–geldi",
  "וַיָּבֹ֥א": "ve–geldi", "בָּא": "geldi", "בָּ֤א": "geldi", "בָּ֣א": "geldi",
  "בָּ֖א": "geldi", "יָבוֹא": "gelecek", "יָבֹ֣א": "gelecek", "תָּבוֹא": "geleceksin",
  "תָּב֑וֹא": "geleceksin", "לָבוֹא": "gelmek–için", "בֹּא": "gel", "בֹּ֖א": "gel",
  "וַיָּבֹ֙אוּ֙": "ve–geldiler", "וַיָּבֹ֨אוּ": "ve–geldiler", "בָּ֣אוּ": "geldiler",
  "בָּ֖אוּ": "geldiler", "בֹּ֖אוּ": "gelin",

  // עשה - to do/make
  "וַיַּעַשׂ": "ve–yaptı", "וַיַּ֣עַשׂ": "ve–yaptı", "וַיַּ֤עַשׂ": "ve–yaptı",
  "עָשָׂה": "yaptı", "עָשָׂ֣ה": "yaptı", "יַעֲשֶׂה": "yapacak", "עֲשֵׂה": "yap",
  "עָשׂ֖וּ": "yaptılar", "וַיַּעֲשׂ֖וּ": "ve–yaptılar", "לַעֲשׂוֹת": "yapmak–için",

  // לקח - to take
  "וַיִּקַּח": "ve–aldı", "וַיִּקַּ֣ח": "ve–aldı", "וַיִּקַּ֤ח": "ve–aldı",
  "וַיִּקַּ֥ח": "ve–aldı", "לָקַח": "aldı", "לָקַ֣ח": "aldı", "יִקַּח": "alacak",
  "קַח": "al", "קַ֣ח": "al", "וַיִּקְח֣וּ": "ve–aldılar", "לָקְח֖וּ": "aldılar",

  // נתן - to give
  "וַיִּתֵּן": "ve–verdi", "וַיִּתֵּ֨ן": "ve–verdi", "וַיִּתֵּ֣ן": "ve–verdi",
  "נָתַן": "verdi", "נָתַ֣ן": "verdi", "נָתַ֖ן": "verdi", "יִתֵּן": "verecek",
  "תֵּן": "ver", "תֶּן־": "ver–", "נָתְנ֖וּ": "verdiler", "וַיִּתְּנ֣וּ": "ve–verdiler",
  "לָתֵת": "vermek–için",

  // שׁלח - to send
  "וַיִּשְׁלַח": "ve–gönderdi", "וַיִּשְׁלַ֣ח": "ve–gönderdi", "וַיִּשְׁלַ֤ח": "ve–gönderdi",
  "וַיִּשְׁלַ֥ח": "ve–gönderdi", "שָׁלַח": "gönderdi", "שָׁלַ֣ח": "gönderdi",
  "יִשְׁלַח": "gönderecek", "שְׁלַח": "gönder", "וַיִּשְׁלְח֖וּ": "ve–gönderdiler",
  "שָׁלַ֖ח": "gönderdi",

  // שׁמע - to hear
  "וַיִּשְׁמַע": "ve–duydu", "וַיִּשְׁמַ֣ע": "ve–duydu", "וַיִּשְׁמַ֤ע": "ve–duydu",
  "וַיִּשְׁמַ֥ע": "ve–duydu", "שָׁמַע": "duydu", "שָׁמַ֣ע": "duydu",
  "שְׁמַע": "duy", "יִשְׁמַע": "duyacak", "שָׁמְע֖וּ": "duydular",
  "וַיִּשְׁמְע֖וּ": "ve–duydular", "לִשְׁמֹעַ": "duymak–için",

  // נכה/הכה - to strike
  "וַיַּךְ": "ve–vurdu", "וַיַּ֣ךְ": "ve–vurdu", "וַיַּ֤ךְ": "ve–vurdu",
  "וַיַּ֥ךְ": "ve–vurdu", "הִכָּה": "vurdu", "הִכָּ֣ה": "vurdu",
  "יַכֶּה": "vuracak", "הַךְ": "vur", "וַיַּכּ֖וּ": "ve–vurdular",
  "הִכָּ֖ה": "vurdu", "וַיַּכֵּ֖הוּ": "ve–vurdu–onu", "מֵהַכּ֖וֹת": "vurmaktan",

  // מות - to die
  "וַיָּמָת": "ve–öldü", "וַיָּ֣מָת": "ve–öldü", "וַיָּ֖מָת": "ve–öldü",
  "מֵת": "öldü", "מֵ֥ת": "öldü", "מֵ֖ת": "öldü", "מֵ֣ת": "öldü",
  "יָמוּת": "ölecek", "מוּת": "ölüm", "מ֣וֹת": "ölümü", "מ֥וֹת": "ölümü",
  "וַיָּמֻ֔תוּ": "ve–öldüler", "מֵ֑תוּ": "öldüler", "מֵֽתוּ׃": "öldüler",
  "לָמ֖וּת": "ölmek–için", "וָמֵ֖ת": "ve–ölecek",

  // ישׁב - to sit/dwell
  "וַיֵּ֧שֶׁב": "ve–oturdu", "וַיֵּ֤שֶׁב": "ve–oturdu", "וַיֵּ֣שֶׁב": "ve–oturdu",
  "יָשַׁב": "oturdu", "יָשַׁ֣ב": "oturdu", "יֵשֵׁב": "oturacak",
  "שֵׁב": "otur", "וַיֵּשְׁב֖וּ": "ve–oturdular", "יָשְׁב֖וּ": "oturdular",
  "יוֹשֵׁב": "oturan", "יֹשֵׁ֣ב": "oturan", "יֹשְׁבֵי": "oturanları",

  // שׁוב - to return
  "וַיָּשָׁב": "ve–döndü", "וַיָּ֫שָׁב": "ve–döndü", "וַיָּ֣שָׁב": "ve–döndü",
  "שָׁב": "döndü", "שָׁ֔ב": "döndü", "שָׁ֖ב": "döndü", "יָשׁוּב": "dönecek",
  "שׁוּב": "dön", "וַיָּשֻׁ֖בוּ": "ve–döndüler", "שָׁ֖בוּ": "döndüler",
  "לָשׁ֖וּב": "dönmek–için",

  // נפל - to fall
  "וַיִּפֹּל": "ve–düştü", "וַיִּפֹּ֥ל": "ve–düştü", "וַיִּפֹּ֣ל": "ve–düştü",
  "נָפַל": "düştü", "נָפַ֤ל": "düştü", "נָפַ֣ל": "düştü", "יִפֹּל": "düşecek",
  "וַיִּפְּל֖וּ": "ve–düştüler", "נָפְל֖וּ": "düştüler",

  // קרא - to call
  "וַיִּקְרָא": "ve–çağırdı", "וַיִּקְרָ֣א": "ve–çağırdı", "וַיִּקְרָ֤א": "ve–çağırdı",
  "קָרָא": "çağırdı", "קָרָ֣א": "çağırdı", "יִקְרָא": "çağıracak",
  "קְרָא": "çağır", "וַיִּקְרְא֖וּ": "ve–çağırdılar",

  // ענה - to answer
  "וַיַּעַן": "ve–cevapladı", "וַיַּ֣עַן": "ve–cevapladı", "וַיַּ֤עַן": "ve–cevapladı",
  "עָנָה": "cevapladı", "עָנָ֣ה": "cevapladı", "יַעֲנֶה": "cevap–verecek",
  "עֲנֵה": "cevapla", "וַיַּעֲנ֖וּ": "ve–cevapladılar",

  // דבר - to speak
  "וַיְדַבֵּר": "ve–konuştu", "וַיְדַבֵּ֣ר": "ve–konuştu", "וַיְדַבֵּ֤ר": "ve–konuştu",
  "דִּבֶּר": "konuştu", "דִּבֶּ֣ר": "konuştu", "יְדַבֵּר": "konuşacak",
  "דַּבֵּר": "konuş", "דִּבְּר֖וּ": "konuştular", "לְדַבֵּר": "konuşmak–için",

  // קום - to rise
  "וַיָּקָם": "ve–kalktı", "וַיָּ֣קָם": "ve–kalktı", "וַיָּ֤קָם": "ve–kalktı",
  "קָם": "kalktı", "קָ֣ם": "kalktı", "יָקוּם": "kalkacak", "קוּם": "kalk",
  "קוּ֖ם": "kalk", "וַיָּקֻ֖מוּ": "ve–kalktılar", "קָ֖מוּ": "kalktılar",

  // ירד - to go down
  "וַיֵּרֶד": "ve–indi", "וַיֵּ֣רֶד": "ve–indi", "וַיֵּ֤רֶד": "ve–indi",
  "יָרַד": "indi", "יָרַ֣ד": "indi", "יֵרֵד": "inecek", "רֵד": "in",
  "וַיֵּרְד֖וּ": "ve–indiler", "יָרְד֖וּ": "indiler",

  // עלה - to go up
  "וַיַּעַל": "ve–çıktı", "וַיַּ֣עַל": "ve–çıktı", "וַיַּ֤עַל": "ve–çıktı",
  "עָלָה": "çıktı", "עָלָ֣ה": "çıktı", "יַעֲלֶה": "çıkacak", "עֲלֵה": "çık",
  "עֲלֵ֖ה": "çık", "וַיַּעֲל֖וּ": "ve–çıktılar", "עָל֖וּ": "çıktılar",

  // ראה - to see
  "וַיַּרְא": "ve–gördü", "וַיַּ֣רְא": "ve–gördü", "וַיַּ֤רְא": "ve–gördü",
  "וַיַּרְא֙": "ve–gördü", "רָאָה": "gördü", "רָאָ֣ה": "gördü",
  "יִרְאֶה": "görecek", "רְאֵה": "gör", "רְאֵ֖ה": "gör",
  "וַיִּרְא֖וּ": "ve–gördüler", "רָא֖וּ": "gördüler",

  // ידע - to know
  "וַיֵּדַע": "ve–bildi", "יָדַע": "bildi", "יָדַ֣ע": "bildi",
  "יָדַ֔עְתָּ": "bildin", "יֵדַע": "bilecek", "דַּע": "bil",
  "וַיֵּדְע֖וּ": "ve–bildiler", "יָדְע֖וּ": "bildiler", "לָדַ֖עַת": "bilmek–için",

  // שׁאל - to ask
  "וַיִּשְׁאַל": "ve–sordu", "וַיִּשְׁאַ֣ל": "ve–sordu", "וַיִּשְׁאַ֤ל": "ve–sordu",
  "שָׁאַל": "sordu", "שָׁאַ֣ל": "sordu", "יִשְׁאַל": "soracak", "שְׁאַל": "sor",
  "וַיִּשְׁאֲל֖וּ": "ve–sordular",

  // צוה - to command
  "וַיְצַו": "ve–emretti", "וַיְצַ֣ו": "ve–emretti", "וַיְצַ֤ו": "ve–emretti",
  "צִוָּה": "emretti", "צִוָּ֣ה": "emretti", "יְצַוֶּה": "emredecek", "צַו": "emret",
  "וַיְצַוּ֖וּ": "ve–emrettiler",

  // בנה - to build
  "וַיִּבֶן": "ve–inşa–etti", "בָּנָה": "inşa–etti", "בָּנָ֣ה": "inşa–etti",
  "יִבְנֶה": "inşa–edecek", "בְּנֵה": "inşa–et", "וַיִּבְנ֖וּ": "ve–inşa–ettiler",

  // כתב - to write
  "וַיִּכְתֹּב": "ve–yazdı", "כָּתַב": "yazdı", "כָּתַ֣ב": "yazdı",
  "יִכְתֹּב": "yazacak", "כְּתֹב": "yaz",

  // ברך - to bless
  "וַיְבָרֶךְ": "ve–kutsadı", "בֵּרַךְ": "kutsadı", "בֵּרַ֣ךְ": "kutsadı",
  "יְבָרֵךְ": "kutsayacak", "בָּרֵךְ": "kutsa", "בָּר֣וּךְ": "kutsanmış",

  // קבר - to bury
  "וַיְקַבֵּר": "ve–gömdü", "וַיִּקְבְּר֣וּ": "ve–gömdüler",
  "קָבַר": "gömdü", "קָבַ֣ר": "gömdü", "יִקְבֹּר": "gömecek",
  "קְבֹר": "göm", "וַיִּקְבְּרֻ֖הוּ": "ve–gömdüler–onu",

  // בכה - to weep
  "וַיִּבְכּוּ": "ve–ağladılar", "וַיִּבְכֶּה": "ve–ağladı", "וַיֵּ֣בְךְּ": "ve–ağladı",
  "בָּכָה": "ağladı", "בָּכָ֣ה": "ağladı", "יִבְכֶּה": "ağlayacak",

  // אהב - to love
  "וַיֶּאֱהַב": "ve–sevdi", "אָהַב": "sevdi", "אָהַ֣ב": "sevdi",
  "אֹהֵב": "seven", "יֶאֱהַב": "sevecek", "אֱהַב": "sev",
  "אַהֲבָה": "sevgi", "אַהֲבָ֣ה": "sevgi",

  // שׂנא - to hate
  "וַיִּשְׂנָא": "ve–nefret–etti", "שָׂנֵא": "nefret–etti", "שָׂנֵ֣א": "nefret–etti",
  "יִשְׂנָא": "nefret–edecek", "שִׂנְאָה": "nefret",

  // ירא - to fear
  "וַיִּירָא": "ve–korktu", "יָרֵא": "korktu", "יָרֵ֣א": "korktu",
  "יִירָא": "korkacak", "יְרֵא": "kork", "יִרְאָה": "korku",

  // מלך - to reign
  "וַיִּמְלֹךְ": "ve–krallık–yaptı", "מָלַךְ": "krallık–yaptı", "מָלַ֣ךְ": "krallık–yaptı",
  "יִמְלֹךְ": "kral–olacak", "מְלֹךְ": "kral–ol",

  // שׁבע - to swear
  "וַיִּשָּׁבַע": "ve–yemin–etti", "וַיִּשְׁבַּע": "ve–yemin–etti",
  "נִשְׁבַּע": "yemin–etti", "נִשְׁבַּ֣ע": "yemin–etti",
  "יִשָּׁבַע": "yemin–edecek", "הִשָּׁבַע": "yemin–et",
  "שְׁבֻעָה": "yemin", "שְׁבוּעָ֖ה": "yemin",

  // יצא - to go out
  "וַיֵּצֵא": "ve–çıktı", "וַיֵּצֵ֣א": "ve–çıktı", "וַיֵּצֵ֤א": "ve–çıktı",
  "יָצָא": "çıktı", "יָצָ֣א": "çıktı", "יֵצֵא": "çıkacak", "צֵא": "çık",
  "צֵ֖א": "çık", "וַיֵּצְא֖וּ": "ve–çıktılar", "יָצְא֖וּ": "çıktılar",

  // עבר - to pass
  "וַיַּעֲבֹר": "ve–geçti", "וַיַּעֲבֹ֣ר": "ve–geçti",
  "עָבַר": "geçti", "עָבַ֣ר": "geçti", "יַעֲבֹר": "geçecek", "עֲבֹר": "geç",
  "וַיַּעַבְר֖וּ": "ve–geçtiler", "עָבְר֖וּ": "geçtiler",

  // נשׂא - to lift/carry
  "וַיִּשָּׂא": "ve–kaldırdı", "וַיִּשָּׂ֣א": "ve–kaldırdı",
  "נָשָׂא": "kaldırdı", "נָשָׂ֣א": "kaldırdı", "יִשָּׂא": "kaldıracak",
  "שָׂא": "kaldır", "וַיִּשְׂא֖וּ": "ve–kaldırdılar",

  // נגד - to tell
  "וַיַּגֵּד": "ve–bildirdi", "וַיַּגֵּ֣ד": "ve–bildirdi", "וַיַּגֶּד־": "ve–bildirdi",
  "הִגִּיד": "bildirdi", "הִגִּ֣יד": "bildirdi", "יַגֵּד": "bildirecek",
  "הַגֵּד": "bildir", "הַגֶּד־": "bildir–", "וַיַּגִּ֖ידוּ": "ve–bildirdiler",
  "הַמַּגִּיד": "bildiren", "הַמַּגִּ֣יד": "bildiren",

  // שׁכב - to lie down
  "וַיִּשְׁכַּב": "ve–yattı", "וַיִּשְׁכַּ֣ב": "ve–yattı",
  "שָׁכַב": "yattı", "שָׁכַ֣ב": "yattı", "יִשְׁכַּב": "yatacak",
  "שְׁכַב": "yat", "וַיִּשְׁכְּב֖וּ": "ve–yattılar",

  // נוס - to flee
  "וַיָּנָס": "ve–kaçtı", "וַיָּ֣נָס": "ve–kaçtı",
  "נָס": "kaçtı", "נָ֨ס": "kaçtı", "נָ֣ס": "kaçtı", "יָנוּס": "kaçacak",
  "נוּס": "kaç", "וַיָּנֻ֖סוּ": "ve–kaçtılar", "נָ֖סוּ": "kaçtılar",

  // ברח - to flee
  "וַיִּבְרַח": "ve–kaçtı", "בָּרַח": "kaçtı", "בָּרַ֣ח": "kaçtı",
  "יִבְרַח": "kaçacak", "בְּרַח": "kaç",

  // חזק - to be strong/seize
  "וַיַּחֲזֵק": "ve–tuttu", "וַיֶּחֱזַק": "ve–güçlendi",
  "הֶחֱזִיק": "tuttu", "הֶחֱזִ֣יק": "tuttu", "חָזַק": "güçlendi",
  "יַחֲזִיק": "tutacak", "חֲזַק": "güçlen",

  // עמד - to stand
  "וַיַּעֲמֹד": "ve–durdu", "וַיַּעֲמֹ֣ד": "ve–durdu",
  "עָמַד": "durdu", "עָמַ֣ד": "durdu", "יַעֲמֹד": "duracak",
  "עֲמֹד": "dur", "עֹמֵד": "duran", "עֹמְדִ֖ים": "duranlar",

  // רדף - to pursue
  "וַיִּרְדֹּף": "ve–kovaladı", "וַיִּרְדֹּ֣ף": "ve–kovaladı",
  "רָדַף": "kovaladı", "רָדַ֣ף": "kovaladı", "יִרְדֹּף": "kovalayacak",
  "רְדֹף": "kovala", "וַיִּרְדְּפ֖וּ": "ve–kovaladılar",

  // שׂים - to put/set
  "וַיָּשֶׂם": "ve–koydu", "וַיָּ֣שֶׂם": "ve–koydu",
  "שָׂם": "koydu", "שָׂ֣ם": "koydu", "יָשִׂים": "koyacak",
  "שִׂים": "koy", "וַיָּשִׂ֖ימוּ": "ve–koydular",

  // סבב - to surround
  "וַיָּסֹב": "ve–döndü", "וַיָּ֣סֹב": "ve–döndü",
  "סָבַב": "döndü", "סָבַ֣ב": "döndü", "יָסֹב": "dönecek",
  "סֹב": "dön", "וַיָּסֹ֖בּוּ": "ve–döndüler",

  // מצא - to find
  "וַיִּמְצָא": "ve–buldu", "וַיִּמְצָ֣א": "ve–buldu",
  "מָצָא": "buldu", "מָצָ֣א": "buldu", "יִמְצָא": "bulacak",
  "מְצָא": "bul", "וַיִּמְצְא֖וּ": "ve–buldular",

  // אכל - to eat
  "וַיֹּאכַל": "ve–yedi", "וַיֹּ֣אכַל": "ve–yedi",
  "אָכַל": "yedi", "אָכַ֣ל": "yedi", "יֹאכַל": "yiyecek",
  "אֱכֹל": "ye", "וַיֹּאכְל֖וּ": "ve–yediler",

  // שׁתה - to drink
  "וַיֵּשְׁתְּ": "ve–içti", "וַיֵּ֣שְׁתְּ": "ve–içti",
  "שָׁתָה": "içti", "שָׁתָ֣ה": "içti", "יִשְׁתֶּה": "içecek",
  "שְׁתֵה": "iç", "וַיִּשְׁתּ֖וּ": "ve–içtiler",

  // קרע - to tear
  "וַיִּקְרַע": "ve–yırttı", "קָרַע": "yırttı", "קָרַ֣ע": "yırttı",
  "יִקְרַע": "yırtacak", "קְרַע": "yırt",
  "קְרֻעִים": "yırtık", "קְרֻעִ֔ים": "yırtık",

  // תפשׂ - to seize
  "וַיִּתְפֹּשׂ": "ve–tuttu", "תָּפַשׂ": "tuttu", "תָּפַ֣שׂ": "tuttu",
  "יִתְפֹּשׂ": "tutacak", "תְּפֹשׂ": "tut",

  // נמלט - to escape
  "וַיִּמָּלֵט": "ve–kurtuldu", "נִמְלַט": "kurtuldu",
  "נִמְלָֽטְתִּי׃": "kurtuldum", "יִמָּלֵט": "kurtulacak",

  // נקר - to gouge
  "נִקְרֹא": "rastgele", "נִקְרֵ֙יתִי֙": "rastladım",

  // שׁען - to lean
  "נִשְׁעָן": "yaslanmış", "נִשְׁעָ֣ן": "yaslanmış",

  // הרג - to kill
  "וַיַּהַרְגֵ֖הוּ": "ve–öldürdü–onu", "הָרַג": "öldürdü", "הָרַ֣ג": "öldürdü",
  "יַהֲרֹג": "öldürecek", "הֲרֹג": "öldür", "וַיַּהַרְג֖וּ": "ve–öldürdüler",

  // פנה - to turn
  "וַיִּפֶן": "ve–döndü", "פָּנָה": "döndü", "פָּנָ֣ה": "döndü",
  "יִפְנֶה": "dönecek", "פְּנֵה": "dön",

  // זכר - to remember
  "וַיִּזְכֹּר": "ve–hatırladı", "זָכַר": "hatırladı", "זָכַ֣ר": "hatırladı",
  "יִזְכֹּר": "hatırlayacak", "זְכֹר": "hatırla",

  // קנא - to be jealous
  "וַיְקַנֵּא": "ve–kıskandı", "קִנֵּא": "kıskandı",
  "יְקַנֵּא": "kıskanacak", "קַנֵּא": "kıskan",

  // ==================== PARTICLES & PREPOSITIONS ====================
  "אֶת־": "–", "אֶת": "–", "אֵ֤ת": "–", "אֵ֣ת": "–", "אֵת֙": "–",
  "אֵ֥ת": "–", "אֵ֖ת": "–", "אֵ֨ת": "–",
  "אֶל־": "–e", "אֶל": "–e", "אֶ֖ל": "–e", "אֶ֣ל": "–e", "אֶ֤ל": "–e",
  "אֵלָ֔יו": "ona", "אֵלָ֖יו": "ona", "אֵלָ֥יו": "ona",
  "אֵלַי֙": "bana", "אֵלֶ֖יהָ": "ona",
  "מִן־": "–den", "מִן": "–den", "מִ֣ן": "–den", "מִ֤ן": "–den",
  "מִמֶּ֖נּוּ": "ondan", "מִמֶּ֛נִּי": "benden",
  "עַל־": "üzerinde–", "עַל": "üzerinde", "עַ֣ל": "üzerinde", "עַ֖ל": "üzerinde",
  "עָלָ֖יו": "üzerinde", "עָלֶ֖יהָ": "üzerinde", "עָלַ֖י": "üzerimde",
  "בְּ": "–de", "בּ": "–de", "בְּ֖": "–de", "בְּ֣": "–de",
  "בּוֹ": "onda", "בָּ֖הּ": "onda", "בִּ֣י": "bende",
  "לְ": "–e", "לּ": "–e", "לְ֖": "–e", "לְ֣": "–e",
  "ל֑וֹ": "ona", "לָ֖הּ": "ona", "לִ֑י": "bana", "לִ֖י": "bana",
  "לוֹ": "ona", "לוֹ֙": "ona", "לָ֥הּ": "ona",
  "כְּ": "gibi–", "כּ": "gibi–", "כְּ֖": "gibi–", "כְּ֣": "gibi–",
  "וְ": "ve–", "וּ": "ve–",
  "אֲשֶׁר": "ki", "אֲשֶׁר־": "ki–", "אֲשֶׁ֣ר": "ki", "אֲשֶׁ֤ר": "ki",
  "כִּי": "çünkü", "כִּי־": "çünkü–", "כִּ֣י": "çünkü", "כִּ֤י": "çünkü",
  "כִּֽי־": "çünkü–", "כִּ֥י": "çünkü", "כִּ֛י": "çünkü",
  "אִם": "eğer", "אִם־": "eğer–", "אִ֣ם": "eğer",
  "לֹא": "değil", "לֹ֣א": "değil", "לֹ֥א": "değil", "לֹ֖א": "değil",
  "לֹא־": "değil–", "לֹ֤א": "değil", "לֹ֨א": "değil",
  "אַל": "yok", "אַל־": "yok–", "אַ֣ל": "yok", "אַ֥ל": "yok",
  "גַּם": "da", "גַּם־": "da–", "גַּ֣ם": "da", "גַּ֖ם": "da",
  "וְגַם": "ve–da", "וְגַם־": "ve–da–", "וְגַ֗ם": "ve–da", "וְגַ֛ם": "ve–da",
  "עַד": "kadar", "עַד־": "kadar–", "עַ֥ד": "kadar", "עַד֙": "kadar",
  "עֹד": "hâlâ", "עֹ֖ד": "hâlâ", "עוֹד": "hâlâ", "עוֹד֙": "hâlâ",
  "פֶּן": "yoksa", "פֶּן־": "yoksa–",
  "אַךְ": "ancak", "אַ֣ךְ": "ancak", "אַ֖ךְ": "ancak",
  "רַק": "sadece", "רַ֣ק": "sadece", "רַ֖ק": "sadece",
  "הֲ": "mı", "הֲ֭": "mı", "הַ": "mı",
  "מַדּוּעַ": "neden", "מַדּ֗וּעַ": "neden", "מַדּ֙וּעַ֙": "neden",
  "לָמָּה": "neden", "לָמָ֗ה": "neden", "לָ֣מָּה": "neden",
  "אֵיךְ": "nasıl", "אֵ֣יךְ": "nasıl", "אֵ֖יךְ": "nasıl",
  "אֵ֥י": "nerede", "אַיֵּה": "nerede",
  "מָה": "ne", "מָ֣ה": "ne", "מָ֥ה": "ne", "מֶה": "ne", "מֶה־": "ne–",
  "מִי": "kim", "מִ֣י": "kim", "מִ֥י": "kim", "מִי־": "kim–",
  "זֶה": "bu", "זֶ֖ה": "bu", "זֶ֣ה": "bu", "זֶ֑ה": "bu",
  "זֹאת": "bu", "זֹ֣את": "bu", "זֹ֖את": "bu",
  "הוּא": "o", "ה֣וּא": "o", "ה֖וּא": "o",
  "הִיא": "o", "הִ֖יא": "o", "הִ֣יא": "o",
  "הֵם": "onlar", "הֵ֗ם": "onlar", "הֵ֣מָּה": "onlar",
  "אֲנִי": "ben", "אֲנִ֗י": "ben", "אֲנִ֣י": "ben",
  "אָנֹכִי": "ben", "אָנֹכִ֖י": "ben", "אָנֹכִ֣י": "ben",
  "אַתָּה": "sen", "אַתָּ֣ה": "sen", "אַתָּ֖ה": "sen",
  "אַתְּ": "sen",
  "אֲנַחְנוּ": "biz", "אֲנַ֗חְנוּ": "biz",
  "אַתֶּם": "siz", "אַתֶּ֖ם": "siz",
  "נָא": "lütfen", "נָ֣א": "lütfen", "נָ֖א": "lütfen",
  "עַתָּה": "şimdi", "עַתָּ֗ה": "şimdi", "עַתָּ֣ה": "şimdi", "וְעַתָּה֙": "ve–şimdi",
  "הִנֵּה": "işte", "הִנֵּ֣ה": "işte", "הִנֵּ֥ה": "işte",
  "וְהִנֵּה": "ve–işte", "וְהִנֵּה֩": "ve–işte", "וְהִנֵּ֥ה": "ve–işte",
  "הֵן": "işte", "הֵ֣ן": "işte",
  "כֵּן": "böyle", "כֵּ֖ן": "böyle", "כֵּ֣ן": "böyle",
  "כֹּה": "böyle", "כֹּ֥ה": "böyle", "כֹּֽה־": "böyle–",
  "שָׁם": "orada", "שָׁ֖ם": "orada", "שָׁ֣ם": "orada",
  "פֹּה": "burada", "פֹּ֖ה": "burada",
  "מִזֶּה": "buradan", "מִזֶּ֖ה": "buradan",
  "אַחֲרֵי": "sonra", "אַֽחֲרֵי֙": "sonra", "אַחֲרֵ֣י": "sonra",
  "אַחַר": "sonra", "אַחַ֣ר": "sonra", "אַחַר֙": "sonra",
  "לִפְנֵי": "önünde", "לִפְנֵ֣י": "önünde", "לִפְנֵ֖י": "önünde",
  "תַּחַת": "altında", "תַּ֣חַת": "altında", "תַּ֖חַת": "altında",
  "בֵּין": "arasında", "בֵּ֖ין": "arasında", "בֵּ֣ין": "arasında",
  "בְּתוֹךְ": "ortasında", "בְּת֣וֹךְ": "ortasında",
  "מֵעִם": "yanından", "מֵעִ֣ם": "yanından",
  "עִם": "ile", "עִם־": "ile–", "עִ֣ם": "ile", "עִמּ֖וֹ": "onunla",
  "לְמַעַן": "için", "לְמַ֤עַן": "için",
  "בַּעֲבוּר": "için", "בַּעֲב֣וּר": "için",

  // ==================== NOUNS - People/Roles ====================
  "מֶלֶךְ": "kral", "מֶ֣לֶךְ": "kral", "מֶ֖לֶךְ": "kral",
  "הַמֶּלֶךְ": "kral", "הַמֶּ֗לֶךְ": "kral", "הַמֶּ֣לֶךְ": "kral",
  "הַמֶּ֖לֶךְ": "kral", "הַמֶּ֛לֶךְ": "kral", "הַמֶּ֥לֶךְ": "kral",
  "מַלְכּוּת": "krallık", "מַלְכ֖וּת": "krallık",
  "אִישׁ": "adam", "אִ֨ישׁ": "adam", "אִ֣ישׁ": "adam", "אִ֖ישׁ": "adam",
  "הָאִ֖ישׁ": "adam", "הָאִ֣ישׁ": "adam",
  "אֲנָשִׁים": "adamlar", "אֲנָשִׁ֖ים": "adamlar", "הָאֲנָשִׁ֖ים": "adamlar",
  "אִשָּׁה": "kadın", "אִשָּׁ֣ה": "kadın", "הָאִשָּׁ֣ה": "kadın",
  "נָשִׁים": "kadınlar", "הַנָּשִׁ֖ים": "kadınlar",
  "בֵּן": "oğul", "בֵּ֣ן": "oğul", "בֶּן־": "oğlu–", "בְּנ֖וֹ": "oğlu",
  "בְּנֽוֹ׃": "oğlu", "הַבֵּ֖ן": "oğul",
  "בָּנִים": "oğullar", "בָּנִ֖ים": "oğullar", "הַבָּנִ֖ים": "oğullar",
  "בְּנֵי": "oğulları", "בְּנֵ֣י": "oğulları", "בְּנֵי־": "oğulları–",
  "בַּת": "kız", "בַּת־": "kızı–", "בִּתּ֖וֹ": "kızı",
  "בָּנוֹת": "kızlar", "הַבָּנ֖וֹת": "kızlar",
  "אָב": "baba", "אָ֣ב": "baba", "הָאָ֖ב": "baba",
  "אֲבִי": "babası", "אָבִ֣יו": "babası", "אָבִ֖יו": "babası",
  "אָבוֹת": "babalar", "אֲבֹתָ֖יו": "babaları",
  "אֵם": "anne", "אֵ֣ם": "anne", "אִמּ֖וֹ": "annesi",
  "אָח": "kardeş", "אָ֣ח": "kardeş", "אָחִ֖יו": "kardeşi",
  "אֲחִ֣י": "kardeşi", "אָחִ֣י": "kardeşim",
  "אֲחֵי": "kardeşleri", "אַחֶ֖יךָ": "kardeşlerin",
  "אָחוֹת": "kız–kardeş", "אֲח֖וֹתוֹ": "kız–kardeşi",
  "עֶבֶד": "kul", "עֶ֣בֶד": "kul", "הָעֶ֖בֶד": "kul",
  "עַבְדְּךָ": "kulun", "עַבְדֶּ֖ךָ": "kulun",
  "עֲבָדִים": "kullar", "עֲבָדָ֖יו": "kulları", "הָעֲבָדִ֖ים": "kullar",
  "שִׁפְחָה": "cariye", "הַשִּׁפְחָ֖ה": "cariye",
  "אָדוֹן": "efendi", "אֲדֹנִ֣י": "efendim", "אֲדֹנָ֗יו": "efendisi",
  "נַעַר": "genç", "נַ֣עַר": "genç", "הַנַּ֖עַר": "genç",
  "נְעָרִים": "gençler", "הַנְּעָרִ֖ים": "gençler",
  "נַעֲרָה": "genç–kız", "הַנַּעֲרָ֖ה": "genç–kız",
  "בָּחוּר": "delikanlı", "הַבָּח֖וּר": "delikanlı",
  "זָקֵן": "yaşlı", "הַזָּקֵ֖ן": "yaşlı",
  "זְקֵנִים": "yaşlılar", "הַזְּקֵנִ֖ים": "yaşlılar",
  "כֹּהֵן": "kâhin", "הַכֹּהֵ֖ן": "kâhin",
  "כֹּהֲנִים": "kâhinler", "הַכֹּהֲנִ֖ים": "kâhinler",
  "נָבִיא": "peygamber", "הַנָּבִ֖יא": "peygamber",
  "נְבִיאִים": "peygamberler", "הַנְּבִיאִ֖ים": "peygamberler",
  "שׁוֹפֵט": "hâkim", "הַשּׁוֹפֵ֖ט": "hâkim",
  "שֹׁפְטִים": "hâkimler",
  "שַׂר": "başkan", "שַׂ֣ר": "başkan", "הַשַּׂ֖ר": "başkan",
  "שָׂרִים": "başkanlar", "הַשָּׂרִ֖ים": "başkanlar",
  "צָבָא": "ordu", "הַצָּבָ֖א": "ordu", "צְבָ֖א": "ordu",
  "חַיִל": "güç", "חַ֣יִל": "güç", "הַחַ֖יִל": "güç",
  "גִּבּוֹר": "yiğit", "גִּבּ֣וֹר": "yiğit", "הַגִּבּ֖וֹר": "yiğit",
  "גִּבּוֹרִים": "yiğitler", "הַגִּבּוֹרִ֖ים": "yiğitler",
  "אֹיֵב": "düşman", "הָאֹיֵ֖ב": "düşman",
  "אֹיְבָ֖יו": "düşmanları", "אֹיְבֵ֖י": "düşmanları",
  "עַם": "halk", "עָ֣ם": "halk", "הָעָם": "halk",
  "הָעָ֜ם": "halk", "הָעָם֙": "halk", "הָעָ֖ם": "halk",
  "עַמִּים": "halklar", "הָעַמִּ֖ים": "halklar",
  "גּוֹי": "millet", "הַגּ֖וֹי": "millet",
  "גּוֹיִם": "milletler", "הַגּוֹיִ֖ם": "milletler",
  "מִשְׁפָּחָה": "aile", "הַמִּשְׁפָּחָ֖ה": "aile",
  "מִשְׁפָּחוֹת": "aileler",
  "בַּיִת": "ev", "בֵּ֣ית": "evi", "בֵּית": "evi", "בֵּית־": "evi–",
  "הַבַּ֖יִת": "ev", "בֵּיתוֹ": "evi",
  "בָּתִּים": "evler", "הַבָּתִּ֖ים": "evler",
  "רֵעַ": "arkadaş", "רֵעֵ֖הוּ": "arkadaşı",

  // ==================== NOUNS - Body parts ====================
  "רֹאשׁ": "baş", "רֹ֣אשׁ": "baş", "הָרֹ֖אשׁ": "baş",
  "רֹאשׁ֑וֹ": "başı", "רֹאשֽׁוֹ׃": "başı",
  "רָאשִׁים": "başlar", "רָאשֵׁ֖י": "başları",
  "פָּנִים": "yüz", "פְּנֵ֖י": "yüzü",
  "פָּנָ֖יו": "yüzü", "פְּנֵיהֶ֖ם": "yüzleri",
  "עַיִן": "göz", "עֵינָ֖יו": "gözleri", "עֵינֵי": "gözleri",
  "אֹזֶן": "kulak", "אָזְנֵ֖י": "kulakları",
  "פֶּה": "ağız", "פִּ֣י": "ağzı", "פִּיו": "ağzı",
  "לָשׁוֹן": "dil", "הַלָּשׁ֖וֹן": "dil",
  "שֵׁן": "diş",
  "יָד": "el", "יָ֣ד": "el", "יָד֣וֹ": "eli", "יָדוֹ": "eli",
  "יָדָ֖יו": "elleri", "יְדֵ֖י": "elleri",
  "יְמִין": "sağ–el", "יְמִינ֖וֹ": "sağ–eli",
  "שְׂמֹאול": "sol–el", "שְׂמֹאל֖וֹ": "sol–eli",
  "רֶגֶל": "ayak", "רַגְלָ֖יו": "ayakları", "רַגְלֵ֖י": "ayakları",
  "לֵב": "kalp", "לֵ֣ב": "kalp", "לֵ֖ב": "kalp",
  "לִבּוֹ": "kalbi", "לִבּ֖וֹ": "kalbi", "לְבָב֖וֹ": "kalbi",
  "נֶפֶשׁ": "can", "נֶ֣פֶשׁ": "can",
  "נַפְשׁוֹ": "canı", "נַפְשִׁ֖י": "canım", "נַפְשְׁךָ֖": "canın",
  "בָּשָׂר": "et", "הַבָּשָׂ֖ר": "et",
  "דָּם": "kan", "דָּ֣ם": "kan", "הַדָּ֖ם": "kan",
  "עֶצֶם": "kemik", "עֲצָמ֖וֹת": "kemikler", "עַצְמוֹתֵ֖יהֶם": "kemikleri",

  // ==================== NOUNS - Weapons/Items ====================
  "חֶרֶב": "kılıç", "חֶ֣רֶב": "kılıç", "הַחֶ֖רֶב": "kılıç",
  "חַרְבּ֖וֹ": "kılıcı", "חַ֣רְבּוֹ": "kılıcı",
  "חֲנִית": "mızrak", "הַחֲנִ֖ית": "mızrak",
  "חֲנִית֑וֹ": "mızrağı", "חֲנִיתֽוֹ׃": "mızrağı",
  "קֶשֶׁת": "yay", "הַקֶּ֖שֶׁת": "yay", "קַשְׁתּ֖וֹ": "yayı",
  "מָגֵן": "kalkan", "הַמָּגֵ֖ן": "kalkan",
  "כְּלֵי": "silahları", "כְּלֵי־": "silahları–", "כְּלִ֖י": "eşyası",
  "בֶּגֶד": "elbise", "הַבֶּ֖גֶד": "elbise",
  "בְּגָדִים": "elbiseler", "וּבְגָדָיו": "ve–elbiseleri",
  "וּבְגָדָ֣יו": "ve–elbiseleri",
  "כֻּתֹּנֶת": "gömlek", "הַכֻּתֹּ֖נֶת": "gömlek",
  "מְעִיל": "cüppe", "הַמְּעִ֖יל": "cüppe",
  "אֵפוֹד": "efod", "הָאֵפ֖וֹד": "efod",
  "כֶּתֶר": "taç", "הַכֶּ֖תֶר": "taç",

  // ==================== NOUNS - Nature/Places ====================
  "אֶרֶץ": "toprak", "אֶ֣רֶץ": "toprak", "אֶ֖רֶץ": "toprak",
  "הָאָ֖רֶץ": "toprak", "הָאָ֑רֶץ": "toprak",
  "אַרְצָה": "toprağa", "אַ֖רְצָה": "toprağa",
  "שָׁמַיִם": "gökler", "הַשָּׁמַ֖יִם": "gökler", "הַשָּׁמָ֑יִם": "gökler",
  "יָם": "deniz", "הַיָּ֖ם": "deniz",
  "נָהָר": "nehir", "הַנָּהָ֖ר": "nehir",
  "נַחַל": "dere", "הַנַּ֖חַל": "dere",
  "מַיִם": "su", "הַמַּ֖יִם": "su", "הַמָּ֑יִם": "su",
  "אֵשׁ": "ateş", "הָאֵ֖שׁ": "ateş",
  "עָנָן": "bulut", "הֶעָנָ֖ן": "bulut",
  "אֶבֶן": "taş", "הָאֶ֖בֶן": "taş",
  "אֲבָנִים": "taşlar", "הָאֲבָנִ֖ים": "taşlar",
  "הַר": "dağ", "הָהָ֖ר": "dağ", "הַ֣ר": "dağ",
  "הָרִים": "dağlar", "הֶהָרִ֖ים": "dağlar",
  "גִּבְעָה": "tepe", "הַגִּבְעָ֖ה": "tepe",
  "גִּבְעוֹת": "tepeler",
  "עֵמֶק": "vadi", "הָעֵ֖מֶק": "vadi",
  "מִדְבָּר": "çöl", "הַמִּדְבָּ֖ר": "çöl",
  "שָׂדֶה": "tarla", "הַשָּׂדֶ֖ה": "tarla",
  "עִיר": "şehir", "הָעִ֖יר": "şehir", "הָעִ֑יר": "şehir",
  "עָרִים": "şehirler", "הֶעָרִ֖ים": "şehirler",
  "שַׁעַר": "kapı", "הַשַּׁ֖עַר": "kapı",
  "חוֹמָה": "duvar", "הַחוֹמָ֖ה": "duvar",
  "דֶּרֶךְ": "yol", "הַדֶּ֣רֶךְ": "yol", "דֶּרֶךְ־": "yolu–",
  "עֵץ": "ağaç", "הָעֵ֖ץ": "ağaç",
  "עֲצֵי": "ağaçları",
  "גַּן": "bahçe", "הַגַּ֖ן": "bahçe",
  "כֶּרֶם": "bağ", "הַכֶּ֖רֶם": "bağ",
  "אֲדָמָה": "toprak", "הָאֲדָמָ֖ה": "toprak",
  "וַאֲדָמָה": "ve–toprak", "וַאֲדָמָ֖ה": "ve–toprak",
  "מַחֲנֶה": "ordugâh", "הַמַּחֲנֶה": "ordugâh",
  "הַֽמַּחֲנֶה֙": "ordugâh", "מִמַּחֲנֶה": "ordugâhtan",
  "מִמַּחֲנֵ֥ה": "ordugâhtan",

  // ==================== NOUNS - Time ====================
  "יוֹם": "gün", "י֣וֹם": "gün", "י֥וֹם": "gün",
  "הַיּוֹם": "bugün", "הַיּ֣וֹם": "bugün", "הַיּ֖וֹם": "bugün",
  "בַּיּוֹם": "günde", "בַּיּ֣וֹם": "günde",
  "יָמִים": "günler", "יָמִ֥ים": "günler", "הַיָּמִ֖ים": "günler",
  "לַיְלָה": "gece", "הַלַּ֖יְלָה": "gece", "לָ֑יְלָה": "gece",
  "לֵילוֹת": "geceler",
  "בֹּקֶר": "sabah", "הַבֹּ֖קֶר": "sabah",
  "עֶרֶב": "akşam", "הָעֶ֖רֶב": "akşam",
  "צָהֳרַיִם": "öğle",
  "חֹדֶשׁ": "ay", "הַחֹ֖דֶשׁ": "ay",
  "חֳדָשִׁים": "aylar",
  "שָׁנָה": "yıl", "הַשָּׁנָ֖ה": "yıl", "שָׁנָ֣ה": "yıl",
  "שָׁנִים": "yıllar", "הַשָּׁנִ֖ים": "yıllar",
  "עֵת": "zaman", "הָעֵ֖ת": "zaman", "עֵ֣ת": "zaman",
  "עוֹלָם": "sonsuzluk", "לְעוֹלָ֖ם": "sonsuza–dek",
  "תָּמִיד": "sürekli",
  "פַּעַם": "kez", "הַפַּ֖עַם": "kez",
  "פְּעָמִים": "kez",

  // ==================== NOUNS - Abstract ====================
  "דָּבָר": "söz", "דָּבָ֖ר": "söz", "הַדָּבָר": "söz",
  "הַדָּבָ֖ר": "söz", "דָּבָ֣ר": "söz",
  "דְּבָרִים": "sözler", "הַדְּבָרִ֖ים": "sözler",
  "דְּבַר": "sözü", "דְּבַר־": "sözü–",
  "שֵׁם": "isim", "שֵׁ֣ם": "isim", "הַשֵּׁ֖ם": "isim",
  "שְׁמוֹ": "ismi", "שְׁמ֖וֹ": "ismi",
  "קוֹל": "ses", "ק֣וֹל": "ses", "הַקּ֖וֹל": "ses",
  "קוֹלוֹ": "sesi", "קוֹל֖וֹ": "sesi",
  "אֱמֶת": "gerçek", "הָאֱמֶ֖ת": "gerçek",
  "חֶסֶד": "iyilik", "חֶ֣סֶד": "iyilik", "הַחֶ֖סֶד": "iyilik",
  "צְדָקָה": "doğruluk", "הַצְּדָקָ֖ה": "doğruluk",
  "מִשְׁפָּט": "hüküm", "מִשְׁפָּ֖ט": "hüküm", "הַמִּשְׁפָּ֖ט": "hüküm",
  "תּוֹרָה": "yasa", "הַתּוֹרָ֖ה": "yasa",
  "חֻקָּה": "kural", "הַחֻקָּ֖ה": "kural",
  "מִצְוָה": "buyruk", "הַמִּצְוָ֖ה": "buyruk",
  "בְּרִית": "ahit", "הַבְּרִ֖ית": "ahit",
  "עֵדוּת": "tanıklık",
  "שָׁלוֹם": "barış", "שָׁל֣וֹם": "barış", "הַשָּׁל֖וֹם": "barış",
  "מִלְחָמָה": "savaş", "הַמִּלְחָמָה": "savaş",
  "הַמִּלְחָמָ֗ה": "savaş", "מִלְחָמָ֖ה": "savaş",
  "חַטָּאת": "günah", "הַחַטָּ֖את": "günah",
  "חֵטְא": "günah",
  "עָוֹן": "suç", "הֶעָוֹ֖ן": "suç",
  "רָעָה": "kötülük", "הָרָעָ֖ה": "kötülük",
  "טוֹב": "iyilik", "הַטּוֹב": "iyi",
  "רַע": "kötü", "הָרָ֖ע": "kötü",
  "חָכְמָה": "bilgelik", "הַחָכְמָ֖ה": "bilgelik",
  "דַּעַת": "bilgi", "הַדַּ֖עַת": "bilgi",
  "כֹּחַ": "güç", "כֹּ֣חַ": "güç", "הַכֹּ֖חַ": "güç",
  "כֹּחוֹ": "gücü",
  "עֹז": "kudret", "הָעֹ֖ז": "kudret",
  "גְּבוּרָה": "yiğitlik",
  "כָּבוֹד": "şeref", "הַכָּב֖וֹד": "şeref",
  "תִּפְאֶרֶת": "güzellik",
  "מָוֶת": "ölüm", "הַמָּ֖וֶת": "ölüm",
  "חַיִּים": "hayat", "הַחַיִּ֖ים": "hayat",

  // ==================== DIVINE NAMES ====================
  "יְהוָה": "YHVH", "יְהוָ֖ה": "YHVH", "יְהוָ֣ה": "YHVH",
  "יְהוָ֔ה": "YHVH", "יְהוָ֑ה": "YHVH", "יְהוָ֗ה": "YHVH",
  "יְהוָ֛ה": "YHVH", "יְהֹוָ֖ה": "YHVH", "יְהֹוָ֣ה": "YHVH",
  "לַיהוָ֖ה": "YHVH'ye", "לַיהוָ֑ה": "YHVH'ye",
  "אֱלֹהִים": "Elohim", "אֱלֹהִ֖ים": "Elohim", "אֱלֹהִ֣ים": "Elohim",
  "הָאֱלֹהִ֖ים": "Elohim", "הָאֱלֹהִ֣ים": "Elohim",
  "אֵל": "El", "אֵ֣ל": "El", "הָאֵ֖ל": "El",
  "אֲדֹנָי": "Adonay", "אֲדֹנָ֖י": "Adonay",
  "שַׁדַּי": "Şadday",
  "צְבָאוֹת": "Tsevaot", "צְבָא֖וֹת": "Tsevaot",

  // ==================== NUMBERS ====================
  "אֶחָד": "bir", "אֶחָ֣ד": "bir", "אֶחָ֖ד": "bir",
  "אַחַת": "bir", "אַחַ֖ת": "bir",
  "שְׁנַיִם": "iki", "שְׁנָֽיִם׃": "iki", "שְׁנָ֖יִם": "iki",
  "שְׁתַּיִם": "iki",
  "שְׁנֵי": "iki", "שְׁנֵ֣י": "iki",
  "שָׁלוֹשׁ": "üç", "שָׁל֣וֹשׁ": "üç",
  "שְׁלֹשָׁה": "üç", "שְׁלֹשָׁ֖ה": "üç",
  "הַשְּׁלִישִׁי": "üçüncü", "הַשְּׁלִישִׁ֗י": "üçüncü",
  "אַרְבַּע": "dört", "אַרְבַּ֣ע": "dört",
  "אַרְבָּעָה": "dört", "אַרְבָּעָ֖ה": "dört",
  "חָמֵשׁ": "beş", "חֲמֵ֣שׁ": "beş",
  "חֲמִשָּׁה": "beş", "חֲמִשָּׁ֖ה": "beş",
  "שֵׁשׁ": "altı", "שֵׁ֣שׁ": "altı",
  "שִׁשָּׁה": "altı", "שִׁשָּׁ֖ה": "altı",
  "שֶׁבַע": "yedi", "שֶׁ֣בַע": "yedi",
  "שִׁבְעָה": "yedi", "שִׁבְעָ֖ה": "yedi",
  "שְׁמֹנֶה": "sekiz", "שְׁמֹנֶ֣ה": "sekiz",
  "שְׁמוֹנָה": "sekiz",
  "תֵּשַׁע": "dokuz", "תֵּ֣שַׁע": "dokuz",
  "תִּשְׁעָה": "dokuz",
  "עֶשֶׂר": "on", "עֶ֣שֶׂר": "on",
  "עֲשָׂרָה": "on", "עֲשָׂרָ֖ה": "on",
  "עֶשְׂרִים": "yirmi",
  "שְׁלֹשִׁים": "otuz",
  "אַרְבָּעִים": "kırk",
  "חֲמִשִּׁים": "elli",
  "שִׁשִּׁים": "altmış",
  "שִׁבְעִים": "yetmiş",
  "שְׁמוֹנִים": "seksen",
  "תִּשְׁעִים": "doksan",
  "מֵאָה": "yüz", "מֵאָ֣ה": "yüz",
  "מֵא֖וֹת": "yüzler",
  "אֶלֶף": "bin", "אֶ֣לֶף": "bin",
  "אֲלָפִים": "binler",
  "רִבּוֹא": "on–bin",
  "כֹּל": "tüm", "כָּל": "tüm", "כָּל־": "tüm–",
  "כֹּ֣ל": "tüm", "כָּ֣ל": "tüm",
  "רַב": "çok", "רַ֣ב": "çok",
  "הַרְבֵּה": "çok", "הַרְבֵּ֞ה": "çok",
  "מְעַט": "az",

  // ==================== ADJECTIVES ====================
  "גָּדוֹל": "büyük", "גָּד֣וֹל": "büyük", "הַגָּד֖וֹל": "büyük",
  "גְּדוֹלָה": "büyük",
  "קָטֹן": "küçük", "קָטָ֖ן": "küçük", "הַקָּטָ֖ן": "küçük",
  "קְטַנָּה": "küçük",
  "טוֹב": "iyi", "ט֣וֹב": "iyi", "הַטּ֖וֹב": "iyi",
  "טוֹבָה": "iyi", "טֹבָ֖ה": "iyi",
  "רַע": "kötü", "הָרָ֖ע": "kötü",
  "רָעָה": "kötü",
  "חָדָשׁ": "yeni", "הֶחָדָ֖שׁ": "yeni",
  "יָשָׁן": "eski",
  "חָזָק": "güçlü", "חָזָ֖ק": "güçlü",
  "רַךְ": "yumuşak",
  "קָשֶׁה": "sert",
  "יָפֶה": "güzel", "יָפָ֖ה": "güzel",
  "חָכָם": "bilge", "חֲכָמִ֖ים": "bilgeler",
  "רָשָׁע": "kötü", "רְשָׁעִ֖ים": "kötüler",
  "צַדִּיק": "doğru", "צַדִּיקִ֖ים": "doğrular",
  "קָדוֹשׁ": "kutsal", "קְדוֹשִׁ֖ים": "kutsallar",
  "טָהוֹר": "temiz",
  "טָמֵא": "kirli",
  "חַי": "diri", "חַ֣י": "diri",
  "מֵת": "ölü",
  "שָׁלֵם": "tam",
  "רֵיק": "boş",
  "מָלֵא": "dolu",

  // ==================== PROPER NAMES ====================
  // People
  "שָׁאוּל": "Şaul", "שָׁא֔וּל": "Şaul", "שָׁא֖וּל": "Şaul",
  "שָׁא֛וּל": "Şaul", "שָׁא֣וּל": "Şaul", "שָׁאֽוּל׃": "Şaul",
  "דָּוִד": "Davut", "דָּוִ֔ד": "Davut", "דָּוִ֖ד": "Davut",
  "דָּוִ֛ד": "Davut", "דָּוִ֣ד": "Davut", "דָּוִ֗ד": "Davut",
  "דָוִ֑ד": "Davut", "דָּוִֽד׃": "Davut",
  "וְדָוִד": "ve–Davut", "וְדָוִ֣ד": "ve–Davut", "וְדָוִ֤ד": "ve–Davut",
  "לְדָוִ֖ד": "Davut'a", "לְדָוִ֣ד": "Davut'a",
  "יוֹנָתָן": "Yonatan", "יוֹנָתָ֣ן": "Yonatan", "יוֹנָתָ֖ן": "Yonatan",
  "יְהוֹנָתָן": "Yehonatan", "יְהוֹנָתָ֣ן": "Yehonatan",
  "וִיהוֹנָתָן": "ve–Yehonatan", "וִיהוֹנָתָ֥ן": "ve–Yehonatan",
  "יִשְׂרָאֵל": "İsrail", "יִשְׂרָאֵ֖ל": "İsrail", "יִשְׂרָאֵ֑ל": "İsrail",
  "יִשְׂרָאֵ֔ל": "İsrail", "יִשְׂרָאֵ֣ל": "İsrail",
  "יְהוּדָה": "Yehuda", "יְהוּדָ֖ה": "Yehuda", "יְהוּדָ֣ה": "Yehuda",
  "יְהוּדָ֑ה": "Yehuda",
  "אַבְנֵר": "Avner", "אַבְנֵ֣ר": "Avner", "אַבְנֵ֖ר": "Avner",
  "יוֹאָב": "Yoav", "יוֹאָ֣ב": "Yoav", "יוֹאָ֖ב": "Yoav", "יוֹאָ֑ב": "Yoav",
  "אַבְשָׁלוֹם": "Avşalom", "אַבְשָׁל֖וֹם": "Avşalom", "אַבְשָׁל֣וֹם": "Avşalom",
  "אַמְנוֹן": "Amnon", "אַמְנ֣וֹן": "Amnon", "אַמְנ֖וֹן": "Amnon",
  "תָּמָר": "Tamar", "תָּמָ֖ר": "Tamar",
  "בַּת־שֶׁבַע": "Bat-Şeva", "בַּת־שֶׁ֖בַע": "Bat-Şeva",
  "אוּרִיָּה": "Uriya", "אוּרִיָּ֖ה": "Uriya", "אוּרִיָּ֣ה": "Uriya",
  "נָתָן": "Natan", "נָתָ֣ן": "Natan", "נָתָ֖ן": "Natan",
  "צָדוֹק": "Tsadok", "צָד֖וֹק": "Tsadok", "צָד֣וֹק": "Tsadok",
  "אֶבְיָתָר": "Evyatar", "אֶבְיָתָ֖ר": "Evyatar",
  "מְפִיבֹשֶׁת": "Mefiboşet", "מְפִיבֹ֖שֶׁת": "Mefiboşet",
  "מְפִיבֹ֣שֶׁת": "Mefiboşet",
  "צִיבָא": "Tsiva", "צִיבָ֖א": "Tsiva",
  "שִׁמְעִי": "Şimi", "שִׁמְעִ֖י": "Şimi", "שִׁמְעִ֣י": "Şimi",
  "אֲחִיתֹפֶל": "Ahitofel", "אֲחִית֖וֹפֶל": "Ahitofel",
  "אֲחִיתֹ֖פֶל": "Ahitofel",
  "חוּשַׁי": "Huşay", "חוּשַׁ֖י": "Huşay", "חוּשַׁ֣י": "Huşay",
  "צְרוּיָה": "Tseruya", "צְרוּיָ֖ה": "Tseruya", "צְרֻיָ֖ה": "Tseruya",
  "אֲבִישַׁי": "Avişay", "אֲבִישַׁ֖י": "Avişay", "אֲבִישַׁ֣י": "Avişay",
  "עֲשָׂהאֵל": "Asahel", "עֲשָׂהאֵ֖ל": "Asahel", "עֲשָׂאֵ֣ל": "Asahel",
  "אִישׁ בֹּשֶׁת": "İş-Boşet", "אִ֥ישׁ בֹּ֖שֶׁת": "İş-Boşet",
  "אִישׁ־בֹּ֣שֶׁת": "İş-Boşet",
  "רְחַבְעָם": "Rehavam",

  // Places
  "יְרוּשָׁלַיִם": "Yeruşalayim", "יְרוּשָׁלַ֖יִם": "Yeruşalayim",
  "יְרוּשָׁלִַ֖ם": "Yeruşalayim", "יְרוּשָׁלִָ֑ם": "Yeruşalayim",
  "חֶבְרוֹן": "Hevron", "חֶבְר֖וֹן": "Hevron", "חֶבְר֣וֹן": "Hevron",
  "צִקְלַג": "Tsiklag", "צִקְלָ֖ג": "Tsiklag",
  "בְּצִקְלָג": "Tsiklag'da", "בְּצִקְלָ֖ג": "Tsiklag'da",
  "גִּלְבֹּעַ": "Gilboa", "גִּלְבֹּ֖עַ": "Gilboa",
  "הַגִּלְבֹּעַ": "Gilboa", "הַגִּלְבֹּ֔עַ": "Gilboa",
  "בְּהַר": "dağda", "בְּהַ֣ר": "dağda",

  // Nations
  "פְּלִשְׁתִּים": "Filistliler", "פְּלִשְׁתִּ֖ים": "Filistliler",
  "פְּלִשְׁתִּ֣ים": "Filistliler",
  "הָעֲמָלֵק": "Amalek", "הָעֲמָלֵ֑ק": "Amalek", "עֲמָלֵ֖ק": "Amalek",
  "מוֹאָב": "Moav", "מוֹאָ֖ב": "Moav",
  "אֱדוֹם": "Edom", "אֱד֖וֹם": "Edom",
  "אֲרָם": "Aram", "אֲרָ֖ם": "Aram", "אֲרָ֣ם": "Aram",
  "עַמּוֹן": "Ammon", "עַמּ֖וֹן": "Ammon",
  "בְּנֵי עַמּוֹן": "Ammonoğulları", "בְּנֵי־עַמּ֖וֹן": "Ammonoğulları",
  "גַּת": "Gat", "גַּ֖ת": "Gat",
};

// Strip cantillation marks helper
function stripCantillationChirho(textChirho: string): string {
  return textChirho.replace(/[\u0591-\u05AF\u05BD\u05BF\u05C0\u05C3\u05C4\u05C5\u05C6\u05C7]/g, '');
}

// Translate a single Hebrew word
function translateWordChirho(hebrewChirho: string): string {
  // First check exact match
  if (hebrewToTurkishChirho[hebrewChirho]) {
    return hebrewToTurkishChirho[hebrewChirho];
  }

  // Strip cantillation marks and try again
  const strippedChirho = stripCantillationChirho(hebrewChirho);
  if (hebrewToTurkishChirho[strippedChirho]) {
    return hebrewToTurkishChirho[strippedChirho];
  }

  // Handle words with sof pasuq (׃) at the end
  if (hebrewChirho.endsWith('׃')) {
    const withoutSofChirho = hebrewChirho.slice(0, -1);
    if (hebrewToTurkishChirho[withoutSofChirho]) {
      return hebrewToTurkishChirho[withoutSofChirho];
    }
    const strippedWithoutSofChirho = stripCantillationChirho(withoutSofChirho);
    if (hebrewToTurkishChirho[strippedWithoutSofChirho]) {
      return hebrewToTurkishChirho[strippedWithoutSofChirho];
    }
  }

  // Return placeholder for unknown words
  return `[${hebrewChirho}]`;
}

// Main execution
async function mainChirho() {
  // Read the Hebrew words file
  const wordsDataChirho = JSON.parse(readFileSync('/tmp/2sa-words-chirho.json', 'utf-8')) as Record<string, string>;

  // Create glosses object
  const glossesChirho: Record<string, string> = {};

  for (const [wordIdChirho, hebrewChirho] of Object.entries(wordsDataChirho)) {
    glossesChirho[wordIdChirho] = translateWordChirho(hebrewChirho);
  }

  // Write glosses to file
  writeFileSync('/tmp/2sa-tur-glosses-chirho.json', JSON.stringify(glossesChirho, null, 2));

  // Count unknown words
  const unknownChirho = Object.values(glossesChirho).filter(g => g.startsWith('['));
  console.log(`Total words: ${Object.keys(glossesChirho).length}`);
  console.log(`Known translations: ${Object.keys(glossesChirho).length - unknownChirho.length}`);
  console.log(`Unknown words: ${unknownChirho.length}`);

  // Get unique unknown words
  const uniqueUnknownChirho = [...new Set(unknownChirho)];
  console.log(`Unique unknown: ${uniqueUnknownChirho.length}`);
  console.log('Sample unknown:', uniqueUnknownChirho.slice(0, 20));
}

mainChirho().catch(console.error);
