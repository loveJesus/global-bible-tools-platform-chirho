// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Complete Turkish Translation for 2 Samuel
 *
 * This creates a comprehensive word-by-word Turkish translation
 * by mapping Hebrew roots and handling morphological variations.
 */

import { readFileSync, writeFileSync } from 'fs';

// Strip all cantillation marks
function stripMarksChirho(textChirho: string): string {
  // Remove cantillation marks (te'amim) U+0591-U+05AF
  // Remove meteg U+05BD, rafe U+05BF, paseq U+05C0, sof pasuq U+05C3
  // Remove shin/sin dots U+05C1-U+05C2, puncta extraordinaria U+05C4-U+05C5
  // Remove nun hafukha U+05C6, qamats qatan U+05C7
  return textChirho
    .replace(/[\u0591-\u05AF]/g, '')
    .replace(/[\u05BD\u05BF\u05C0\u05C3-\u05C7]/g, '')
    .replace(/׃$/g, '') // Remove sof pasuq at end
    .replace(/־$/g, '') // Remove maqaf at end
    .replace(/^\s+|\s+$/g, '') // Trim
    .replace(/\s*׀\s*$/g, ''); // Remove paseq variant
}

// Extract base consonants only (remove all vowels and marks)
function getConsonantsChirho(textChirho: string): string {
  // Keep only Hebrew consonants (U+05D0-U+05EA) and maqaf
  return textChirho.replace(/[^\u05D0-\u05EA\u05F3\u05F4־]/g, '');
}

// Comprehensive Hebrew to Turkish mapping by consonantal roots
const rootsToTurkishChirho: Record<string, string> = {
  // === VERBS (by consonantal root) ===
  // היה - to be
  "ויהי": "ve–oldu",
  "יהי": "oldu",
  "היה": "oldu",
  "תהיה": "olacaksın",
  "יהיה": "olacak",
  "והיה": "ve–oldu",
  "היתה": "oldu",
  "היו": "oldular",

  // אמר - to say
  "ויאמר": "ve–dedi",
  "אמר": "dedi",
  "יאמר": "diyecek",
  "לאמר": "diyerek",
  "ותאמר": "ve–dedi",
  "אמרה": "dedi",
  "אמרו": "dediler",
  "ויאמרו": "ve–dediler",
  "ואמר": "ve–dedi",
  "ואמרה": "ve–dedi",

  // הלך - to go
  "וילך": "ve–gitti",
  "הלך": "gitti",
  "ילך": "gidecek",
  "ללכת": "gitmek–için",
  "הולך": "giden",
  "וילכו": "ve–gittiler",
  "הלכו": "gittiler",
  "לך": "git",
  "לכה": "git",
  "לכו": "gidin",

  // בוא - to come
  "ויבא": "ve–geldi",
  "בא": "geldi",
  "יבוא": "gelecek",
  "תבוא": "geleceksin",
  "לבוא": "gelmek–için",
  "בוא": "gel",
  "ויבאו": "ve–geldiler",
  "באו": "geldiler",
  "הבאים": "gelenler",

  // עשה - to do/make
  "ויעש": "ve–yaptı",
  "עשה": "yaptı",
  "יעשה": "yapacak",
  "עשה": "yap",
  "עשו": "yaptılar",
  "ויעשו": "ve–yaptılar",
  "לעשות": "yapmak–için",

  // לקח - to take
  "ויקח": "ve–aldı",
  "לקח": "aldı",
  "יקח": "alacak",
  "קח": "al",
  "ויקחו": "ve–aldılar",
  "לקחו": "aldılar",

  // נתן - to give
  "ויתן": "ve–verdi",
  "נתן": "verdi",
  "יתן": "verecek",
  "תן": "ver",
  "נתנו": "verdiler",
  "ויתנו": "ve–verdiler",
  "לתת": "vermek–için",

  // שלח - to send
  "וישלח": "ve–gönderdi",
  "שלח": "gönderdi",
  "ישלח": "gönderecek",
  "שלח": "gönder",
  "וישלחו": "ve–gönderdiler",

  // שמע - to hear
  "וישמע": "ve–duydu",
  "שמע": "duydu",
  "ישמע": "duyacak",
  "שמע": "duy",
  "שמעו": "duydular",
  "וישמעו": "ve–duydular",
  "לשמע": "duymak–için",

  // הכה/נכה - to strike
  "ויך": "ve–vurdu",
  "הכה": "vurdu",
  "יכה": "vuracak",
  "הך": "vur",
  "ויכו": "ve–vurdular",
  "מהכות": "vurmaktan",

  // מות - to die
  "וימת": "ve–öldü",
  "מת": "öldü",
  "ימות": "ölecek",
  "מות": "ölüm",
  "וימתו": "ve–öldüler",
  "מתו": "öldüler",
  "למות": "ölmek–için",

  // ישב - to sit/dwell
  "וישב": "ve–oturdu",
  "ישב": "oturdu",
  "ישב": "oturacak",
  "שב": "otur",
  "וישבו": "ve–oturdular",
  "ישבו": "oturdular",
  "יושב": "oturan",
  "יושבי": "oturanları",

  // שוב - to return
  "וישב": "ve–döndü",
  "שב": "döndü",
  "ישוב": "dönecek",
  "שוב": "dön",
  "וישבו": "ve–döndüler",
  "שבו": "döndüler",
  "לשוב": "dönmek–için",

  // נפל - to fall
  "ויפל": "ve–düştü",
  "נפל": "düştü",
  "יפל": "düşecek",
  "ויפלו": "ve–düştüler",
  "נפלו": "düştüler",

  // קרא - to call
  "ויקרא": "ve–çağırdı",
  "קרא": "çağırdı",
  "יקרא": "çağıracak",
  "קרא": "çağır",
  "ויקראו": "ve–çağırdılar",

  // ענה - to answer
  "ויען": "ve–cevapladı",
  "ענה": "cevapladı",
  "יענה": "cevap–verecek",
  "ענה": "cevapla",
  "ויענו": "ve–cevapladılar",

  // דבר - to speak
  "וידבר": "ve–konuştu",
  "דבר": "konuştu",
  "ידבר": "konuşacak",
  "דבר": "konuş",
  "דברו": "konuştular",
  "לדבר": "konuşmak–için",

  // קום - to rise
  "ויקם": "ve–kalktı",
  "קם": "kalktı",
  "יקום": "kalkacak",
  "קום": "kalk",
  "ויקמו": "ve–kalktılar",
  "קמו": "kalktılar",

  // ירד - to go down
  "וירד": "ve–indi",
  "ירד": "indi",
  "ירד": "inecek",
  "רד": "in",
  "וירדו": "ve–indiler",
  "ירדו": "indiler",

  // עלה - to go up
  "ויעל": "ve–çıktı",
  "עלה": "çıktı",
  "יעלה": "çıkacak",
  "עלה": "çık",
  "ויעלו": "ve–çıktılar",
  "עלו": "çıktılar",

  // ראה - to see
  "וירא": "ve–gördü",
  "ראה": "gördü",
  "יראה": "görecek",
  "ראה": "gör",
  "ויראו": "ve–gördüler",
  "ראו": "gördüler",

  // ידע - to know
  "וידע": "ve–bildi",
  "ידע": "bildi",
  "ידעת": "bildin",
  "ידע": "bilecek",
  "דע": "bil",
  "וידעו": "ve–bildiler",
  "ידעו": "bildiler",
  "לדעת": "bilmek–için",

  // שאל - to ask
  "וישאל": "ve–sordu",
  "שאל": "sordu",
  "ישאל": "soracak",
  "שאל": "sor",
  "וישאלו": "ve–sordular",

  // צוה - to command
  "ויצו": "ve–emretti",
  "צוה": "emretti",
  "יצוה": "emredecek",
  "צו": "emret",
  "ויצוו": "ve–emrettiler",

  // בנה - to build
  "ויבן": "ve–inşa–etti",
  "בנה": "inşa–etti",
  "יבנה": "inşa–edecek",
  "בנה": "inşa–et",
  "ויבנו": "ve–inşa–ettiler",

  // כתב - to write
  "ויכתב": "ve–yazdı",
  "כתב": "yazdı",
  "יכתב": "yazacak",
  "כתב": "yaz",

  // ברך - to bless
  "ויברך": "ve–kutsadı",
  "ברך": "kutsadı",
  "יברך": "kutsayacak",
  "ברך": "kutsa",
  "ברוך": "kutsanmış",

  // קבר - to bury
  "ויקבר": "ve–gömdü",
  "קבר": "gömdü",
  "יקבר": "gömecek",
  "קבר": "göm",
  "ויקברו": "ve–gömdüler",

  // בכה - to weep
  "ויבכו": "ve–ağladılar",
  "ויבכה": "ve–ağladı",
  "ויבך": "ve–ağladı",
  "בכה": "ağladı",
  "יבכה": "ağlayacak",

  // אהב - to love
  "ויאהב": "ve–sevdi",
  "אהב": "sevdi",
  "יאהב": "sevecek",
  "אהבה": "sevgi",

  // שנא - to hate
  "וישנא": "ve–nefret–etti",
  "שנא": "nefret–etti",
  "ישנא": "nefret–edecek",
  "שנאה": "nefret",

  // ירא - to fear
  "ויירא": "ve–korktu",
  "ירא": "korktu",
  "יירא": "korkacak",
  "ירא": "kork",
  "יראה": "korku",

  // מלך - to reign
  "וימלך": "ve–krallık–yaptı",
  "מלך": "krallık–yaptı",
  "ימלך": "kral–olacak",
  "מלך": "kral–ol",

  // שבע - to swear
  "וישבע": "ve–yemin–etti",
  "נשבע": "yemin–etti",
  "ישבע": "yemin–edecek",
  "השבע": "yemin–et",
  "שבועה": "yemin",

  // יצא - to go out
  "ויצא": "ve–çıktı",
  "יצא": "çıktı",
  "יצא": "çıkacak",
  "צא": "çık",
  "ויצאו": "ve–çıktılar",
  "יצאו": "çıktılar",

  // עבר - to pass
  "ויעבר": "ve–geçti",
  "עבר": "geçti",
  "יעבר": "geçecek",
  "עבר": "geç",
  "ויעברו": "ve–geçtiler",
  "עברו": "geçtiler",

  // נשא - to lift/carry
  "וישא": "ve–kaldırdı",
  "נשא": "kaldırdı",
  "ישא": "kaldıracak",
  "שא": "kaldır",
  "וישאו": "ve–kaldırdılar",

  // נגד - to tell
  "ויגד": "ve–bildirdi",
  "הגיד": "bildirdi",
  "יגד": "bildirecek",
  "הגד": "bildir",
  "ויגידו": "ve–bildirdiler",
  "המגיד": "bildiren",

  // שכב - to lie down
  "וישכב": "ve–yattı",
  "שכב": "yattı",
  "ישכב": "yatacak",
  "שכב": "yat",
  "וישכבו": "ve–yattılar",

  // נוס - to flee
  "וינס": "ve–kaçtı",
  "נס": "kaçtı",
  "ינוס": "kaçacak",
  "נוס": "kaç",
  "וינסו": "ve–kaçtılar",
  "נסו": "kaçtılar",

  // ברח - to flee
  "ויברח": "ve–kaçtı",
  "ברח": "kaçtı",
  "יברח": "kaçacak",
  "ברח": "kaç",

  // חזק - to be strong/seize
  "ויחזק": "ve–tuttu",
  "החזיק": "tuttu",
  "חזק": "güçlendi",
  "יחזיק": "tutacak",
  "חזק": "güçlen",

  // עמד - to stand
  "ויעמד": "ve–durdu",
  "עמד": "durdu",
  "יעמד": "duracak",
  "עמד": "dur",
  "עומד": "duran",
  "עומדים": "duranlar",

  // רדף - to pursue
  "וירדף": "ve–kovaladı",
  "רדף": "kovaladı",
  "ירדף": "kovalayacak",
  "רדף": "kovala",
  "וירדפו": "ve–kovaladılar",

  // שים - to put/set
  "וישם": "ve–koydu",
  "שם": "koydu",
  "ישים": "koyacak",
  "שים": "koy",
  "וישימו": "ve–koydular",

  // סבב - to surround
  "ויסב": "ve–döndü",
  "סבב": "döndü",
  "יסב": "dönecek",
  "סב": "dön",
  "ויסבו": "ve–döndüler",

  // מצא - to find
  "וימצא": "ve–buldu",
  "מצא": "buldu",
  "ימצא": "bulacak",
  "מצא": "bul",
  "וימצאו": "ve–buldular",

  // אכל - to eat
  "ויאכל": "ve–yedi",
  "אכל": "yedi",
  "יאכל": "yiyecek",
  "אכל": "ye",
  "ויאכלו": "ve–yediler",

  // שתה - to drink
  "וישת": "ve–içti",
  "שתה": "içti",
  "ישתה": "içecek",
  "שתה": "iç",
  "וישתו": "ve–içtiler",

  // קרע - to tear
  "ויקרע": "ve–yırttı",
  "קרע": "yırttı",
  "יקרע": "yırtacak",
  "קרע": "yırt",
  "קרועים": "yırtık",

  // הרג - to kill
  "ויהרגהו": "ve–öldürdü–onu",
  "הרג": "öldürdü",
  "יהרג": "öldürecek",
  "הרג": "öldür",
  "ויהרגו": "ve–öldürdüler",

  // פנה - to turn
  "ויפן": "ve–döndü",
  "פנה": "döndü",
  "יפנה": "dönecek",
  "פנה": "dön",

  // זכר - to remember
  "ויזכר": "ve–hatırladı",
  "זכר": "hatırladı",
  "יזכר": "hatırlayacak",
  "זכר": "hatırla",

  // נמלט - to escape
  "וימלט": "ve–kurtuldu",
  "נמלט": "kurtuldu",
  "נמלטתי": "kurtuldum",
  "ימלט": "kurtulacak",

  // נשען - to lean
  "נשען": "yaslanmış",

  // נקר - to gouge
  "נקרא": "rastgele",
  "נקריתי": "rastladım",

  // שחה - to bow down
  "וישתחו": "ve–eğildi",
  "וישתחוו": "ve–eğildiler",
  "השתחוה": "secde–etti",

  // === PARTICLES & PREPOSITIONS ===
  "את־": "–",
  "את": "–",
  "אל־": "–e",
  "אל": "–e",
  "אליו": "ona",
  "אלי": "bana",
  "אליה": "ona",
  "אליהם": "onlara",
  "אלינו": "bize",
  "אליך": "sana",
  "מן־": "–den",
  "מן": "–den",
  "ממנו": "ondan",
  "ממני": "benden",
  "ממנה": "ondan",
  "מהם": "onlardan",
  "על־": "üzerinde–",
  "על": "üzerinde",
  "עליו": "üzerinde",
  "עליה": "üzerinde",
  "עלי": "üzerimde",
  "עליהם": "üzerlerinde",
  "עלינו": "üzerimizde",
  "עליך": "üzerinde",
  "ב": "–de",
  "בו": "onda",
  "בה": "onda",
  "בי": "bende",
  "בהם": "onlarda",
  "בנו": "bizde",
  "ל": "–e",
  "לו": "ona",
  "לה": "ona",
  "לי": "bana",
  "להם": "onlara",
  "לנו": "bize",
  "לך": "sana",
  "כ": "gibi–",
  "כמו": "gibi",
  "ו": "ve–",
  "אשר": "ki",
  "אשר־": "ki–",
  "כי": "çünkü",
  "כי־": "çünkü–",
  "אם": "eğer",
  "אם־": "eğer–",
  "לא": "değil",
  "לא־": "değil–",
  "אל": "yok",
  "אל־": "yok–",
  "גם": "da",
  "גם־": "da–",
  "וגם": "ve–da",
  "עד": "kadar",
  "עד־": "kadar–",
  "עוד": "hâlâ",
  "פן": "yoksa",
  "אך": "ancak",
  "רק": "sadece",
  "ה": "mı",
  "מדוע": "neden",
  "למה": "neden",
  "איך": "nasıl",
  "אי": "nerede",
  "איה": "nerede",
  "מה": "ne",
  "מה־": "ne–",
  "מי": "kim",
  "מי־": "kim–",
  "זה": "bu",
  "זאת": "bu",
  "הוא": "o",
  "היא": "o",
  "הם": "onlar",
  "המה": "onlar",
  "אני": "ben",
  "אנכי": "ben",
  "אתה": "sen",
  "את": "sen",
  "אנחנו": "biz",
  "אתם": "siz",
  "נא": "lütfen",
  "עתה": "şimdi",
  "ועתה": "ve–şimdi",
  "הנה": "işte",
  "והנה": "ve–işte",
  "הן": "işte",
  "כן": "böyle",
  "כה": "böyle",
  "שם": "orada",
  "פה": "burada",
  "מזה": "buradan",
  "אחרי": "sonra",
  "אחר": "sonra",
  "לפני": "önünde",
  "תחת": "altında",
  "בין": "arasında",
  "בתוך": "ortasında",
  "מעם": "yanından",
  "עם": "ile",
  "עם־": "ile–",
  "עמו": "onunla",
  "עמי": "benimle",
  "עמך": "seninle",
  "עמהם": "onlarla",
  "עמנו": "bizimle",
  "למען": "için",
  "בעבור": "için",
  "אחרי": "arkasından",
  "אחריו": "arkasından",

  // === NOUNS ===
  // People/Roles
  "מלך": "kral",
  "המלך": "kral",
  "מלכות": "krallık",
  "איש": "adam",
  "האיש": "adam",
  "אנשים": "adamlar",
  "האנשים": "adamlar",
  "אשה": "kadın",
  "האשה": "kadın",
  "נשים": "kadınlar",
  "הנשים": "kadınlar",
  "בן": "oğul",
  "בן־": "oğlu–",
  "בנו": "oğlu",
  "הבן": "oğul",
  "בנים": "oğullar",
  "הבנים": "oğullar",
  "בני": "oğulları",
  "בני־": "oğulları–",
  "בת": "kız",
  "בת־": "kızı–",
  "בתו": "kızı",
  "בנות": "kızlar",
  "הבנות": "kızlar",
  "אב": "baba",
  "האב": "baba",
  "אבי": "babası",
  "אביו": "babası",
  "אבות": "babalar",
  "אבתיו": "babaları",
  "אם": "anne",
  "האם": "anne",
  "אמו": "annesi",
  "אח": "kardeş",
  "האח": "kardeş",
  "אחיו": "kardeşi",
  "אחי": "kardeşi",
  "אחי": "kardeşim",
  "אחיך": "kardeşlerin",
  "אחים": "kardeşler",
  "אחות": "kız–kardeş",
  "אחותו": "kız–kardeşi",
  "עבד": "kul",
  "העבד": "kul",
  "עבדך": "kulun",
  "עבדי": "kullarım",
  "עבדיו": "kulları",
  "עבדים": "kullar",
  "העבדים": "kullar",
  "שפחה": "cariye",
  "השפחה": "cariye",
  "אדון": "efendi",
  "אדני": "efendim",
  "אדניו": "efendisi",
  "נער": "genç",
  "הנער": "genç",
  "נערים": "gençler",
  "הנערים": "gençler",
  "נערה": "genç–kız",
  "הנערה": "genç–kız",
  "בחור": "delikanlı",
  "הבחור": "delikanlı",
  "זקן": "yaşlı",
  "הזקן": "yaşlı",
  "זקנים": "yaşlılar",
  "הזקנים": "yaşlılar",
  "כהן": "kâhin",
  "הכהן": "kâhin",
  "כהנים": "kâhinler",
  "הכהנים": "kâhinler",
  "נביא": "peygamber",
  "הנביא": "peygamber",
  "נביאים": "peygamberler",
  "הנביאים": "peygamberler",
  "שופט": "hâkim",
  "השופט": "hâkim",
  "שפטים": "hâkimler",
  "שר": "başkan",
  "השר": "başkan",
  "שרים": "başkanlar",
  "השרים": "başkanlar",
  "צבא": "ordu",
  "הצבא": "ordu",
  "חיל": "güç",
  "החיל": "güç",
  "גבור": "yiğit",
  "הגבור": "yiğit",
  "גבורים": "yiğitler",
  "הגבורים": "yiğitler",
  "איב": "düşman",
  "האיב": "düşman",
  "איביו": "düşmanları",
  "איבי": "düşmanları",
  "עם": "halk",
  "העם": "halk",
  "עמים": "halklar",
  "העמים": "halklar",
  "גוי": "millet",
  "הגוי": "millet",
  "גוים": "milletler",
  "הגוים": "milletler",
  "משפחה": "aile",
  "המשפחה": "aile",
  "משפחות": "aileler",
  "בית": "ev",
  "בית־": "evi–",
  "הבית": "ev",
  "ביתו": "evi",
  "בתים": "evler",
  "הבתים": "evler",
  "רע": "arkadaş",
  "רעהו": "arkadaşı",

  // Body parts
  "ראש": "baş",
  "הראש": "baş",
  "ראשו": "başı",
  "ראשים": "başlar",
  "ראשי": "başları",
  "פנים": "yüz",
  "פני": "yüzü",
  "פניו": "yüzü",
  "פניהם": "yüzleri",
  "עין": "göz",
  "העין": "göz",
  "עיניו": "gözleri",
  "עיני": "gözleri",
  "אזן": "kulak",
  "האזן": "kulak",
  "אזני": "kulakları",
  "פה": "ağız",
  "הפה": "ağız",
  "פי": "ağzı",
  "פיו": "ağzı",
  "לשון": "dil",
  "הלשון": "dil",
  "שן": "diş",
  "יד": "el",
  "היד": "el",
  "ידו": "eli",
  "ידי": "ellerim",
  "ידיו": "elleri",
  "ידי": "elleri",
  "ימין": "sağ–el",
  "ימינו": "sağ–eli",
  "שמאול": "sol–el",
  "שמאלו": "sol–eli",
  "רגל": "ayak",
  "הרגל": "ayak",
  "רגליו": "ayakları",
  "רגלי": "ayakları",
  "לב": "kalp",
  "הלב": "kalp",
  "לבו": "kalbi",
  "לבבו": "kalbi",
  "נפש": "can",
  "הנפש": "can",
  "נפשו": "canı",
  "נפשי": "canım",
  "נפשך": "canın",
  "בשר": "et",
  "הבשר": "et",
  "דם": "kan",
  "הדם": "kan",
  "עצם": "kemik",
  "עצמות": "kemikler",
  "עצמותיהם": "kemikleri",

  // Weapons/Items
  "חרב": "kılıç",
  "החרב": "kılıç",
  "חרבו": "kılıcı",
  "חנית": "mızrak",
  "החנית": "mızrak",
  "חניתו": "mızrağı",
  "קשת": "yay",
  "הקשת": "yay",
  "קשתו": "yayı",
  "מגן": "kalkan",
  "המגן": "kalkan",
  "כלי": "silahları",
  "כלי־": "silahları–",
  "בגד": "elbise",
  "הבגד": "elbise",
  "בגדים": "elbiseler",
  "ובגדיו": "ve–elbiseleri",
  "כתנת": "gömlek",
  "הכתנת": "gömlek",
  "מעיל": "cüppe",
  "המעיל": "cüppe",
  "אפוד": "efod",
  "האפוד": "efod",
  "כתר": "taç",
  "הכתר": "taç",

  // Nature/Places
  "ארץ": "toprak",
  "הארץ": "toprak",
  "ארצה": "toprağa",
  "שמים": "gökler",
  "השמים": "gökler",
  "ים": "deniz",
  "הים": "deniz",
  "נהר": "nehir",
  "הנהר": "nehir",
  "נחל": "dere",
  "הנחל": "dere",
  "מים": "su",
  "המים": "su",
  "אש": "ateş",
  "האש": "ateş",
  "ענן": "bulut",
  "הענן": "bulut",
  "אבן": "taş",
  "האבן": "taş",
  "אבנים": "taşlar",
  "האבנים": "taşlar",
  "הר": "dağ",
  "ההר": "dağ",
  "הרים": "dağlar",
  "ההרים": "dağlar",
  "גבעה": "tepe",
  "הגבעה": "tepe",
  "גבעות": "tepeler",
  "עמק": "vadi",
  "העמק": "vadi",
  "מדבר": "çöl",
  "המדבר": "çöl",
  "שדה": "tarla",
  "השדה": "tarla",
  "עיר": "şehir",
  "העיר": "şehir",
  "ערים": "şehirler",
  "הערים": "şehirler",
  "שער": "kapı",
  "השער": "kapı",
  "חומה": "duvar",
  "החומה": "duvar",
  "דרך": "yol",
  "הדרך": "yol",
  "דרך־": "yolu–",
  "עץ": "ağaç",
  "העץ": "ağaç",
  "עצי": "ağaçları",
  "גן": "bahçe",
  "הגן": "bahçe",
  "כרם": "bağ",
  "הכרם": "bağ",
  "אדמה": "toprak",
  "האדמה": "toprak",
  "ואדמה": "ve–toprak",
  "מחנה": "ordugâh",
  "המחנה": "ordugâh",
  "ממחנה": "ordugâhtan",

  // Time
  "יום": "gün",
  "היום": "bugün",
  "ביום": "günde",
  "ימים": "günler",
  "הימים": "günler",
  "לילה": "gece",
  "הלילה": "gece",
  "לילות": "geceler",
  "בקר": "sabah",
  "הבקר": "sabah",
  "ערב": "akşam",
  "הערב": "akşam",
  "צהרים": "öğle",
  "חדש": "ay",
  "החדש": "ay",
  "חדשים": "aylar",
  "שנה": "yıl",
  "השנה": "yıl",
  "שנים": "yıllar",
  "השנים": "yıllar",
  "עת": "zaman",
  "העת": "zaman",
  "עולם": "sonsuzluk",
  "לעולם": "sonsuza–dek",
  "תמיד": "sürekli",
  "פעם": "kez",
  "הפעם": "kez",
  "פעמים": "kez",

  // Abstract
  "דבר": "söz",
  "הדבר": "söz",
  "דבר־": "sözü–",
  "דברים": "sözler",
  "הדברים": "sözler",
  "שם": "isim",
  "השם": "isim",
  "שמו": "ismi",
  "קול": "ses",
  "הקול": "ses",
  "קולו": "sesi",
  "אמת": "gerçek",
  "האמת": "gerçek",
  "חסד": "iyilik",
  "החסד": "iyilik",
  "צדקה": "doğruluk",
  "הצדקה": "doğruluk",
  "משפט": "hüküm",
  "המשפט": "hüküm",
  "תורה": "yasa",
  "התורה": "yasa",
  "חקה": "kural",
  "החקה": "kural",
  "מצוה": "buyruk",
  "המצוה": "buyruk",
  "ברית": "ahit",
  "הברית": "ahit",
  "עדות": "tanıklık",
  "שלום": "barış",
  "השלום": "barış",
  "מלחמה": "savaş",
  "המלחמה": "savaş",
  "מלחמות": "savaşlar",
  "חטאת": "günah",
  "החטאת": "günah",
  "חטא": "günah",
  "עון": "suç",
  "העון": "suç",
  "רעה": "kötülük",
  "הרעה": "kötülük",
  "טוב": "iyilik",
  "הטוב": "iyi",
  "רע": "kötü",
  "הרע": "kötü",
  "חכמה": "bilgelik",
  "החכמה": "bilgelik",
  "דעת": "bilgi",
  "הדעת": "bilgi",
  "כח": "güç",
  "הכח": "güç",
  "כחו": "gücü",
  "עז": "kudret",
  "העז": "kudret",
  "גבורה": "yiğitlik",
  "כבוד": "şeref",
  "הכבוד": "şeref",
  "תפארת": "güzellik",
  "מות": "ölüm",
  "המות": "ölüm",
  "חיים": "hayat",
  "החיים": "hayat",

  // === DIVINE NAMES ===
  "יהוה": "YHVH",
  "ליהוה": "YHVH'ye",
  "ביהוה": "YHVH'de",
  "אלהים": "Elohim",
  "האלהים": "Elohim",
  "אל": "El",
  "האל": "El",
  "אדני": "Adonay",
  "שדי": "Şadday",
  "צבאות": "Tsevaot",

  // === NUMBERS ===
  "אחד": "bir",
  "אחת": "bir",
  "שנים": "iki",
  "שתים": "iki",
  "שני": "iki",
  "שלוש": "üç",
  "שלשה": "üç",
  "השלישי": "üçüncü",
  "ארבע": "dört",
  "ארבעה": "dört",
  "חמש": "beş",
  "חמשה": "beş",
  "שש": "altı",
  "ששה": "altı",
  "שבע": "yedi",
  "שבעה": "yedi",
  "שמנה": "sekiz",
  "שמונה": "sekiz",
  "תשע": "dokuz",
  "תשעה": "dokuz",
  "עשר": "on",
  "עשרה": "on",
  "עשרים": "yirmi",
  "שלשים": "otuz",
  "ארבעים": "kırk",
  "חמשים": "elli",
  "ששים": "altmış",
  "שבעים": "yetmiş",
  "שמונים": "seksen",
  "תשעים": "doksan",
  "מאה": "yüz",
  "מאות": "yüzler",
  "אלף": "bin",
  "אלפים": "binler",
  "רבוא": "on–bin",
  "כל": "tüm",
  "כל־": "tüm–",
  "רב": "çok",
  "הרבה": "çok",
  "מעט": "az",

  // === ADJECTIVES ===
  "גדול": "büyük",
  "הגדול": "büyük",
  "גדולה": "büyük",
  "קטן": "küçük",
  "הקטן": "küçük",
  "קטנה": "küçük",
  "טוב": "iyi",
  "הטוב": "iyi",
  "טובה": "iyi",
  "רע": "kötü",
  "הרע": "kötü",
  "רעה": "kötü",
  "חדש": "yeni",
  "החדש": "yeni",
  "ישן": "eski",
  "חזק": "güçlü",
  "החזק": "güçlü",
  "רך": "yumuşak",
  "קשה": "sert",
  "יפה": "güzel",
  "חכם": "bilge",
  "חכמים": "bilgeler",
  "רשע": "kötü",
  "רשעים": "kötüler",
  "צדיק": "doğru",
  "צדיקים": "doğrular",
  "קדוש": "kutsal",
  "קדושים": "kutsallar",
  "טהור": "temiz",
  "טמא": "kirli",
  "חי": "diri",
  "חיים": "diriler",
  "מת": "ölü",
  "מתים": "ölüler",
  "שלם": "tam",
  "ריק": "boş",
  "מלא": "dolu",

  // === PROPER NAMES ===
  // People
  "שאול": "Şaul",
  "דוד": "Davut",
  "ודוד": "ve–Davut",
  "לדוד": "Davut'a",
  "יונתן": "Yonatan",
  "יהונתן": "Yehonatan",
  "ויהונתן": "ve–Yehonatan",
  "ישראל": "İsrail",
  "יהודה": "Yehuda",
  "אבנר": "Avner",
  "יואב": "Yoav",
  "אבשלום": "Avşalom",
  "אמנון": "Amnon",
  "תמר": "Tamar",
  "בת־שבע": "Bat-Şeva",
  "אוריה": "Uriya",
  "נתן": "Natan",
  "צדוק": "Tsadok",
  "אביתר": "Evyatar",
  "מפיבשת": "Mefiboşet",
  "ציבא": "Tsiva",
  "שמעי": "Şimi",
  "אחיתפל": "Ahitofel",
  "חושי": "Huşay",
  "צרויה": "Tseruya",
  "אבישי": "Avişay",
  "עשהאל": "Asahel",
  "עשאל": "Asahel",
  "איש בשת": "İş-Boşet",
  "איש־בשת": "İş-Boşet",
  "רחבעם": "Rehavam",

  // Places
  "ירושלים": "Yeruşalayim",
  "ירושלם": "Yeruşalayim",
  "חברון": "Hevron",
  "ציקלג": "Tsiklag",
  "בציקלג": "Tsiklag'da",
  "גלבע": "Gilboa",
  "הגלבע": "Gilboa",
  "בהר": "dağda",

  // Nations
  "פלשתים": "Filistliler",
  "העמלק": "Amalek",
  "עמלק": "Amalek",
  "עמלקי": "Amalekli",
  "מואב": "Moav",
  "אדום": "Edom",
  "ארם": "Aram",
  "עמון": "Ammon",
  "בני עמון": "Ammonoğulları",
  "בני־עמון": "Ammonoğulları",
  "גת": "Gat",

  // Additional particles
  "ס": "",  // Setuma (paragraph break)
  "פ": "",  // Petukha (paragraph break)
};

// Translate a single word
function translateWordChirho(hebrewChirho: string): string {
  // Handle special markers
  if (hebrewChirho === 'ס' || hebrewChirho === 'פ') {
    return ''; // Paragraph markers
  }

  // Clean the word
  const cleanedChirho = stripMarksChirho(hebrewChirho);
  const consonantsChirho = getConsonantsChirho(cleanedChirho);

  // Try exact match with cleaned text
  if (rootsToTurkishChirho[cleanedChirho]) {
    return rootsToTurkishChirho[cleanedChirho];
  }

  // Try consonants only
  if (rootsToTurkishChirho[consonantsChirho]) {
    return rootsToTurkishChirho[consonantsChirho];
  }

  // Handle bracketed text like [כי] or (ל֥וֹ)
  const bracketMatchChirho = hebrewChirho.match(/[\[\(](.+?)[\]\)]/);
  if (bracketMatchChirho) {
    const innerChirho = bracketMatchChirho[1];
    const innerCleanedChirho = stripMarksChirho(innerChirho);
    const innerConsonantsChirho = getConsonantsChirho(innerCleanedChirho);
    if (rootsToTurkishChirho[innerCleanedChirho]) {
      return `(${rootsToTurkishChirho[innerCleanedChirho]})`;
    }
    if (rootsToTurkishChirho[innerConsonantsChirho]) {
      return `(${rootsToTurkishChirho[innerConsonantsChirho]})`;
    }
  }

  // Handle compound words with space
  if (hebrewChirho.includes(' ')) {
    const partsChirho = hebrewChirho.split(' ');
    const translatedChirho = partsChirho.map(p => translateWordChirho(p)).join(' ');
    if (!translatedChirho.includes('[')) {
      return translatedChirho;
    }
  }

  // Return placeholder for unknown words
  return `[${hebrewChirho}]`;
}

// Main execution
async function mainChirho() {
  console.log("Loading Hebrew words for 2 Samuel...");

  // Read the Hebrew words file
  const wordsDataChirho = JSON.parse(readFileSync('/tmp/2sa-words-raw-chirho.json', 'utf-8')) as Record<string, string>;

  console.log(`Total words: ${Object.keys(wordsDataChirho).length}`);

  // Create glosses object
  const glossesChirho: Record<string, string> = {};

  for (const [wordIdChirho, hebrewChirho] of Object.entries(wordsDataChirho)) {
    const translationChirho = translateWordChirho(hebrewChirho);
    // Only include non-empty translations
    if (translationChirho) {
      glossesChirho[wordIdChirho] = translationChirho;
    } else {
      glossesChirho[wordIdChirho] = ''; // Paragraph marker
    }
  }

  // Write glosses to file
  writeFileSync('/tmp/2sa-tur-glosses-complete-chirho.json', JSON.stringify(glossesChirho, null, 2));

  // Count results
  const unknownChirho = Object.values(glossesChirho).filter(g => g.startsWith('['));
  const emptyChirho = Object.values(glossesChirho).filter(g => g === '');
  const knownChirho = Object.keys(glossesChirho).length - unknownChirho.length - emptyChirho.length;

  console.log(`\nTranslation Results:`);
  console.log(`- Known translations: ${knownChirho}`);
  console.log(`- Paragraph markers: ${emptyChirho.length}`);
  console.log(`- Unknown words: ${unknownChirho.length}`);

  // Get unique unknown words
  const uniqueUnknownChirho = [...new Set(unknownChirho)].sort();
  console.log(`\nUnique unknown patterns: ${uniqueUnknownChirho.length}`);

  // Show sample unknown words
  console.log('\nSample unknown words:');
  uniqueUnknownChirho.slice(0, 30).forEach(u => console.log(`  ${u}`));

  console.log(`\nOutput written to: /tmp/2sa-tur-glosses-complete-chirho.json`);
}

mainChirho().catch(console.error);
