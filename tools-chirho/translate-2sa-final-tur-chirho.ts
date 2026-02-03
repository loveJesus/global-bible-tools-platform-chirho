// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Final Turkish Translation for 2 Samuel
 *
 * Handles all Hebrew morphological patterns for comprehensive translation.
 */

import { readFileSync, writeFileSync } from 'fs';

// Strip all cantillation marks and vowels for root matching
function stripMarksChirho(textChirho: string): string {
  return textChirho
    .replace(/[\u0591-\u05AF]/g, '') // Cantillation
    .replace(/[\u05BD\u05BF\u05C0\u05C3-\u05C7]/g, '') // Other marks
    .replace(/[\u05B0-\u05BB\u05BC]/g, '') // Vowels
    .replace(/׃$/g, '') // Sof pasuq
    .replace(/־$/g, '') // Maqaf at end
    .replace(/^\s+|\s+$/g, '') // Trim
    .replace(/\s*׀\s*$/g, ''); // Paseq
}

// Get consonants only
function getConsonantsChirho(textChirho: string): string {
  return textChirho.replace(/[^\u05D0-\u05EA\u05F3\u05F4־]/g, '');
}

// Complete Hebrew to Turkish mapping - now with extensive coverage
const hebrewToTurkishChirho: Record<string, string> = {
  // === SECTION MARKERS ===
  "ס": "", "פ": "",

  // === COMMON VERBS WITH ALL FORMS ===
  // היה - to be
  "ויהי": "ve–oldu", "יהי": "oldu", "היה": "oldu", "תהיה": "olacaksın",
  "יהיה": "olacak", "והיה": "ve–oldu", "היתה": "oldu", "היו": "oldular",
  "הייתי": "oldum", "היית": "oldun", "הייתה": "oldu", "הייתם": "oldunuz",
  "תהי": "ol", "נהיה": "olacağız", "אהיה": "olacağım",

  // אמר - to say
  "ויאמר": "ve–dedi", "אמר": "dedi", "יאמר": "diyecek", "לאמר": "diyerek",
  "ותאמר": "ve–dedi", "אמרה": "dedi", "אמרו": "dediler", "ויאמרו": "ve–dediler",
  "ואמר": "ve–dedi", "ואמרה": "ve–dedi", "אמרת": "dedin", "אמרתי": "dedim",
  "תאמר": "diyeceksin", "נאמר": "denildi", "יאמרו": "diyecekler",
  "אמרי": "de", "אמרן": "dediler",

  // הלך - to go/walk
  "וילך": "ve–gitti", "הלך": "gitti", "ילך": "gidecek", "ללכת": "gitmek–için",
  "הולך": "giden", "וילכו": "ve–gittiler", "הלכו": "gittiler", "לך": "git",
  "לכה": "git", "לכו": "gidin", "הלכת": "gittin", "הלכתי": "gittim",
  "תלך": "gideceksin", "ילכו": "gidecekler", "הולכים": "gidenler",
  "נלך": "gideceğiz", "אלך": "gideceğim", "הליכה": "gidiş",

  // בוא - to come
  "ויבא": "ve–geldi", "בא": "geldi", "יבוא": "gelecek", "תבוא": "geleceksin",
  "לבוא": "gelmek–için", "בוא": "gel", "ויבאו": "ve–geldiler", "באו": "geldiler",
  "הבאים": "gelenler", "באתי": "geldim", "באת": "geldin", "באה": "geldi",
  "יבאו": "gelecekler", "נבוא": "geleceğiz", "אבוא": "geleceğim",
  "הביאו": "getirdiler", "הביא": "getirdi", "מביא": "getiren",
  "הבא": "getir", "ויבאהו": "ve–getirdi–onu", "ובאו": "ve–geldiler",
  "מבוא": "giriş", "מבואך": "gelişin", "בבאו": "geldiğinde",
  "ויביאו": "ve–getirdiler", "ויביאהו": "ve–getirdi–onu",
  "תביא": "getireceksin", "להביא": "getirmek–için",

  // עשה - to do/make
  "ויעש": "ve–yaptı", "עשה": "yaptı", "יעשה": "yapacak", "עשו": "yaptılar",
  "ויעשו": "ve–yaptılar", "לעשות": "yapmak–için", "עשית": "yaptın",
  "עשיתי": "yaptım", "תעשה": "yapacaksın", "יעשו": "yapacaklar",
  "נעשה": "yapacağız", "אעשה": "yapacağım", "עושה": "yapan",
  "עשתה": "yaptı", "מעשה": "iş", "מעשיו": "işleri",

  // לקח - to take
  "ויקח": "ve–aldı", "לקח": "aldı", "יקח": "alacak", "קח": "al",
  "ויקחו": "ve–aldılar", "לקחו": "aldılar", "לקחת": "aldın",
  "לקחתי": "aldım", "תקח": "alacaksın", "יקחו": "alacaklar",
  "לקחה": "aldı", "קחו": "alın", "קחה": "al",

  // נתן - to give
  "ויתן": "ve–verdi", "נתן": "verdi", "יתן": "verecek", "תן": "ver",
  "נתנו": "verdiler", "ויתנו": "ve–verdiler", "לתת": "vermek–için",
  "נתת": "verdin", "נתתי": "verdim", "תתן": "vereceksin",
  "יתנו": "verecekler", "נתנה": "verdi", "תנו": "verin",
  "ונתן": "ve–verdi", "ונתתי": "ve–verdim",

  // שלח - to send
  "וישלח": "ve–gönderdi", "שלח": "gönderdi", "ישלח": "gönderecek",
  "וישלחו": "ve–gönderdiler", "שלחו": "gönderdiler", "שלחת": "gönderdin",
  "שלחתי": "gönderdim", "תשלח": "göndereceksin", "ישלחו": "gönderecekler",
  "שלחה": "gönderdi", "ושלח": "ve–gönderdi", "משלח": "gönderen",
  "שלחם": "gönderdi–onları", "שלחני": "beni–gönderdi",

  // שמע - to hear
  "וישמע": "ve–duydu", "שמע": "duydu", "ישמע": "duyacak",
  "שמעו": "duydular", "וישמעו": "ve–duydular", "לשמע": "duymak–için",
  "שמעת": "duydun", "שמעתי": "duydum", "תשמע": "duyacaksın",
  "ישמעו": "duyacaklar", "שמעה": "duydu", "שומע": "duyan",
  "ושמע": "ve–duydu", "לשמוע": "duymak–için", "שמעתם": "duydunuz",
  "בשמעו": "duyduğunda", "כשמעו": "duyunca", "משמע": "duyuldu",

  // הכה/נכה - to strike
  "ויך": "ve–vurdu", "הכה": "vurdu", "יכה": "vuracak", "הך": "vur",
  "ויכו": "ve–vurdular", "מהכות": "vurmaktan", "הכית": "vurdun",
  "הכיתי": "vurdum", "יכו": "vuracaklar", "הכם": "vurdu–onları",
  "ויכהו": "ve–vurdu–onu", "ויכם": "ve–vurdu–onları",
  "מכה": "vuran", "להכות": "vurmak–için", "הכהו": "vurdu–onu",

  // מות - to die
  "וימת": "ve–öldü", "מת": "öldü", "ימות": "ölecek", "מות": "ölüm",
  "וימתו": "ve–öldüler", "מתו": "öldüler", "למות": "ölmek–için",
  "מתה": "öldü", "תמות": "öleceksin", "ימותו": "ölecekler",
  "נמות": "öleceğiz", "אמות": "öleceğim", "המת": "öldür",
  "ויומת": "ve–öldürüldü", "ומת": "ve–öldü", "ומתו": "ve–öldüler",
  "יומת": "öldürülecek", "המית": "öldürdü", "להמית": "öldürmek–için",

  // ישב - to sit/dwell
  "וישב": "ve–oturdu", "ישב": "oturdu", "שב": "otur",
  "וישבו": "ve–oturdular", "ישבו": "oturdular", "יושב": "oturan",
  "יושבי": "oturanları", "ישבת": "oturdun", "ישבתי": "oturdum",
  "תשב": "oturacaksın", "ישבו": "oturacaklar", "ישבה": "oturdu",
  "יושבים": "oturanlar", "שבו": "oturun", "לשבת": "oturmak–için",
  "משבתו": "oturduğu–yerden", "הושיב": "oturttu",

  // שוב - to return
  "וישב": "ve–döndü", "שב": "döndü", "ישוב": "dönecek", "שוב": "dön",
  "וישבו": "ve–döndüler", "שבו": "döndüler", "לשוב": "dönmek–için",
  "שבת": "döndün", "שבתי": "döndüm", "תשוב": "döneceksin",
  "ישובו": "dönecekler", "שבה": "döndü", "ושב": "ve–döndü",
  "השב": "geri–getir", "השיב": "geri–getirdi", "ויישב": "ve–geri–getirdi",
  "להשיב": "geri–getirmek–için",

  // נפל - to fall
  "ויפל": "ve–düştü", "נפל": "düştü", "יפל": "düşecek",
  "ויפלו": "ve–düştüler", "נפלו": "düştüler", "נפלת": "düştün",
  "נפלתי": "düştüm", "תפל": "düşeceksin", "יפלו": "düşecekler",
  "נפלה": "düştü", "ונפל": "ve–düştü", "נפלים": "düşenler",
  "הפילו": "düşürdüler", "הפיל": "düşürdü", "להפיל": "düşürmek–için",

  // קרא - to call
  "ויקרא": "ve–çağırdı", "קרא": "çağırdı", "יקרא": "çağıracak",
  "ויקראו": "ve–çağırdılar", "קראו": "çağırdılar", "קראת": "çağırdın",
  "קראתי": "çağırdım", "תקרא": "çağıracaksın", "יקראו": "çağıracaklar",
  "קראה": "çağırdı", "קרא": "oku", "לקרא": "çağırmak–için",
  "נקרא": "çağrıldı", "הקורא": "okuyan", "ותקרא": "ve–çağırdı",

  // ענה - to answer
  "ויען": "ve–cevapladı", "ענה": "cevapladı", "יענה": "cevap–verecek",
  "ויענו": "ve–cevapladılar", "ענו": "cevapladılar", "ענית": "cevapladın",
  "עניתי": "cevapladım", "תענה": "cevap–vereceksin",
  "יענו": "cevap–verecekler", "ותען": "ve–cevapladı",

  // דבר - to speak
  "וידבר": "ve–konuştu", "דבר": "konuştu", "ידבר": "konuşacak",
  "דברו": "konuştular", "לדבר": "konuşmak–için", "דברת": "konuştun",
  "דברתי": "konuştum", "תדבר": "konuşacaksın", "ידברו": "konuşacaklar",
  "דברה": "konuştu", "מדבר": "konuşan", "הדבר": "konuş",
  "ודבר": "ve–konuştu",

  // קום - to rise
  "ויקם": "ve–kalktı", "קם": "kalktı", "יקום": "kalkacak", "קום": "kalk",
  "ויקמו": "ve–kalktılar", "קמו": "kalktılar", "קמת": "kalktın",
  "קמתי": "kalktım", "תקום": "kalkacaksın", "יקומו": "kalkacaklar",
  "קמה": "kalktı", "וקם": "ve–kalktı", "קומו": "kalkın",
  "הקם": "kaldır", "הקים": "kaldırdı", "להקים": "kaldırmak–için",

  // ירד - to go down
  "וירד": "ve–indi", "ירד": "indi", "ירד": "inecek", "רד": "in",
  "וירדו": "ve–indiler", "ירדו": "indiler", "ירדת": "indin",
  "ירדתי": "indim", "תרד": "ineceksin", "ירדו": "inecekler",
  "ירדה": "indi", "רדו": "inin", "הורד": "indir",
  "הוריד": "indirdi", "להוריד": "indirmek–için",

  // עלה - to go up
  "ויעל": "ve–çıktı", "עלה": "çıktı", "יעלה": "çıkacak", "עלה": "çık",
  "ויעלו": "ve–çıktılar", "עלו": "çıktılar", "עלית": "çıktın",
  "עליתי": "çıktım", "תעלה": "çıkacaksın", "יעלו": "çıkacaklar",
  "עלתה": "çıktı", "ועלה": "ve–çıktı", "העל": "çıkar",
  "העלה": "çıkardı", "להעלות": "çıkarmak–için",

  // ראה - to see
  "וירא": "ve–gördü", "ראה": "gördü", "יראה": "görecek", "ראה": "gör",
  "ויראו": "ve–gördüler", "ראו": "gördüler", "ראית": "gördün",
  "ראיתי": "gördüm", "תראה": "göreceksin", "יראו": "görecekler",
  "ראתה": "gördü", "וראה": "ve–gördü", "הראה": "gösterdi",
  "ויראני": "ve–bana–gösterdi", "ויראם": "ve–onlara–gösterdi",
  "להראות": "göstermek–için", "נראה": "görünecek",

  // ידע - to know
  "וידע": "ve–bildi", "ידע": "bildi", "ידעת": "bildin",
  "ידע": "bilecek", "דע": "bil", "וידעו": "ve–bildiler",
  "ידעו": "bildiler", "לדעת": "bilmek–için", "ידעתי": "bildim",
  "תדע": "bileceksin", "ידעו": "bilecekler", "ידעה": "bildi",
  "יודע": "bilen", "יודעים": "bilenler", "הודע": "bildir",
  "ויודע": "ve–bildirdi",

  // שאל - to ask
  "וישאל": "ve–sordu", "שאל": "sordu", "ישאל": "soracak", "שאל": "sor",
  "וישאלו": "ve–sordular", "שאלו": "sordular", "שאלת": "sordun",
  "שאלתי": "sordum", "תשאל": "soracaksın", "ישאלו": "soracaklar",
  "שאלה": "sordu", "לשאול": "sormak–için", "ושאל": "ve–sordu",

  // צוה - to command
  "ויצו": "ve–emretti", "צוה": "emretti", "יצוה": "emredecek", "צו": "emret",
  "ויצוו": "ve–emrettiler", "צוו": "emrettiler", "צוית": "emrettin",
  "צויתי": "emrettim", "תצוה": "emredeceksin", "יצוו": "emredecekler",
  "צותה": "emretti", "לצוות": "emretmek–için",

  // בנה - to build
  "ויבן": "ve–inşa–etti", "בנה": "inşa–etti", "יבנה": "inşa–edecek",
  "ויבנו": "ve–inşa–ettiler", "בנו": "inşa–ettiler", "בנית": "inşa–ettin",
  "בניתי": "inşa–ettim", "תבנה": "inşa–edeceksin",
  "יבנו": "inşa–edecekler", "בנתה": "inşa–etti", "לבנות": "inşa–etmek–için",

  // כתב - to write
  "ויכתב": "ve–yazdı", "כתב": "yazdı", "יכתב": "yazacak",
  "כתבו": "yazdılar", "כתבת": "yazdın", "כתבתי": "yazdım",
  "תכתב": "yazacaksın", "יכתבו": "yazacaklar", "כתבה": "yazdı",
  "לכתב": "yazmak–için",

  // ברך - to bless
  "ויברך": "ve–kutsadı", "ברך": "kutsadı", "יברך": "kutsayacak",
  "ברכו": "kutsadılar", "ברכת": "kutsadın", "ברכתי": "kutsadım",
  "תברך": "kutsayacaksın", "יברכו": "kutsayacaklar", "ברכה": "kutsadı",
  "ברוך": "kutsanmış", "לברך": "kutsama–için",

  // קבר - to bury
  "ויקבר": "ve–gömdü", "קבר": "gömdü", "יקבר": "gömecek",
  "ויקברו": "ve–gömdüler", "קברו": "gömdüler", "קברת": "gömdün",
  "קברתי": "gömdüm", "תקבר": "gömeceksin", "יקברו": "gömecekler",
  "קברה": "gömdü", "ויקברהו": "ve–gömdüler–onu",

  // בכה - to weep
  "ויבכו": "ve–ağladılar", "ויבכה": "ve–ağladı", "ויבך": "ve–ağladı",
  "בכה": "ağladı", "יבכה": "ağlayacak", "בכו": "ağladılar",
  "בכית": "ağladın", "בכיתי": "ağladım", "תבכה": "ağlayacaksın",
  "בכי": "ağlama",

  // אהב - to love
  "ויאהב": "ve–sevdi", "אהב": "sevdi", "יאהב": "sevecek",
  "אהבו": "sevdiler", "אהבת": "sevdin", "אהבתי": "sevdim",
  "תאהב": "seveceksin", "יאהבו": "sevecekler", "אהבה": "sevgi",
  "אהבתו": "sevgisi", "אהבתך": "sevgin",

  // שנא - to hate
  "וישנא": "ve–nefret–etti", "שנא": "nefret–etti", "ישנא": "nefret–edecek",
  "שנאו": "nefret–ettiler", "שנאת": "nefret–ettin", "שנאתי": "nefret–ettim",
  "שנאה": "nefret",

  // ירא - to fear
  "ויירא": "ve–korktu", "ירא": "korktu", "יירא": "korkacak", "ירא": "kork",
  "יראו": "korktular", "יראת": "korktun", "יראתי": "korktum",
  "תירא": "korkacaksın", "ייראו": "korkacaklar", "יראה": "korku",

  // מלך - to reign
  "וימלך": "ve–krallık–yaptı", "מלך": "krallık–yaptı", "ימלך": "kral–olacak",
  "מלכו": "krallık–yaptılar", "מלכת": "krallık–yaptın",
  "מלכתי": "krallık–yaptım", "תמלך": "kral–olacaksın",
  "ימלכו": "kral–olacaklar", "מלכה": "krallık–yaptı",
  "המליך": "kral–yaptı", "להמליך": "kral–yapmak–için",

  // שבע - to swear
  "וישבע": "ve–yemin–etti", "נשבע": "yemin–etti", "ישבע": "yemin–edecek",
  "השבע": "yemin–et", "שבעו": "yemin–ettiler", "שבעת": "yemin–ettin",
  "שבעתי": "yemin–ettim", "תשבע": "yemin–edeceksin",
  "שבועה": "yemin",

  // יצא - to go out
  "ויצא": "ve–çıktı", "יצא": "çıktı", "יצא": "çıkacak", "צא": "çık",
  "ויצאו": "ve–çıktılar", "יצאו": "çıktılar", "יצאת": "çıktın",
  "יצאתי": "çıktım", "תצא": "çıkacaksın", "יצאו": "çıkacaklar",
  "יצאה": "çıktı", "צאו": "çıkın", "הוציא": "çıkardı",
  "להוציא": "çıkarmak–için", "ויוציאהו": "ve–çıkardı–onu",
  "המוציא": "çıkaran",

  // עבר - to pass
  "ויעבר": "ve–geçti", "עבר": "geçti", "יעבר": "geçecek", "עבר": "geç",
  "ויעברו": "ve–geçtiler", "עברו": "geçtiler", "עברת": "geçtin",
  "עברתי": "geçtim", "תעבר": "geçeceksin", "יעברו": "geçecekler",
  "עברה": "geçti", "העביר": "geçirdi", "להעביר": "geçirmek–için",
  "העבירו": "geçirdiler",

  // נשא - to lift/carry
  "וישא": "ve–kaldırdı", "נשא": "kaldırdı", "ישא": "kaldıracak",
  "שא": "kaldır", "וישאו": "ve–kaldırdılar", "נשאו": "kaldırdılar",
  "נשאת": "kaldırdın", "נשאתי": "kaldırdım", "תשא": "kaldıracaksın",
  "ישאו": "kaldıracaklar", "נשאה": "kaldırdı",
  "שאו": "kaldırın", "נושא": "taşıyan",

  // נגד - to tell
  "ויגד": "ve–bildirdi", "הגיד": "bildirdi", "יגד": "bildirecek",
  "הגד": "bildir", "ויגידו": "ve–bildirdiler", "הגידו": "bildirdiler",
  "הגדת": "bildirdin", "הגדתי": "bildirdim", "תגד": "bildireceksin",
  "יגידו": "bildirecekler", "המגיד": "bildiren",
  "להגיד": "bildirmek–için",

  // שכב - to lie down
  "וישכב": "ve–yattı", "שכב": "yattı", "ישכב": "yatacak", "שכב": "yat",
  "וישכבו": "ve–yattılar", "שכבו": "yattılar", "שכבת": "yattın",
  "שכבתי": "yattım", "תשכב": "yatacaksın", "ישכבו": "yatacaklar",
  "שכבה": "yattı", "שוכב": "yatan",

  // נוס - to flee
  "וינס": "ve–kaçtı", "נס": "kaçtı", "ינוס": "kaçacak", "נוס": "kaç",
  "וינסו": "ve–kaçtılar", "נסו": "kaçtılar", "נסת": "kaçtın",
  "נסתי": "kaçtım", "תנוס": "kaçacaksın", "ינוסו": "kaçacaklar",
  "נסה": "kaçtı",

  // ברח - to flee
  "ויברח": "ve–kaçtı", "ברח": "kaçtı", "יברח": "kaçacak", "ברח": "kaç",
  "ויברחו": "ve–kaçtılar", "ברחו": "kaçtılar", "ברחת": "kaçtın",
  "ברחתי": "kaçtım", "תברח": "kaçacaksın", "יברחו": "kaçacaklar",

  // חזק - to be strong/seize
  "ויחזק": "ve–tuttu", "החזיק": "tuttu", "חזק": "güçlendi",
  "יחזיק": "tutacak", "חזק": "güçlen", "החזקו": "tuttular",
  "החזקת": "tuttun", "החזקתי": "tuttum", "תחזק": "tutacaksın",
  "יחזקו": "tutacaklar",

  // עמד - to stand
  "ויעמד": "ve–durdu", "עמד": "durdu", "יעמד": "duracak", "עמד": "dur",
  "ויעמדו": "ve–durdular", "עמדו": "durdular", "עמדת": "durdun",
  "עמדתי": "durdum", "תעמד": "duracaksın", "יעמדו": "duracaklar",
  "עומד": "duran", "עומדים": "duranlar", "העמיד": "durdurdu",

  // רדף - to pursue
  "וירדף": "ve–kovaladı", "רדף": "kovaladı", "ירדף": "kovalayacak",
  "רדף": "kovala", "וירדפו": "ve–kovaladılar", "רדפו": "kovaladılar",
  "רדפת": "kovaladın", "רדפתי": "kovaladım", "תרדף": "kovalayacaksın",
  "ירדפו": "kovalayacaklar",

  // שים - to put/set
  "וישם": "ve–koydu", "שם": "koydu", "ישים": "koyacak", "שים": "koy",
  "וישימו": "ve–koydular", "שמו": "koydular", "שמת": "koydun",
  "שמתי": "koydum", "תשים": "koyacaksın", "ישימו": "koyacaklar",
  "שמה": "koydu", "שימו": "koyun", "ושם": "ve–koydu",

  // סבב - to surround/turn
  "ויסב": "ve–döndü", "סבב": "döndü", "יסב": "dönecek", "סב": "dön",
  "ויסבו": "ve–döndüler", "סבבו": "döndüler", "סבבת": "döndün",
  "סבבתי": "döndüm", "תסב": "döneceksin", "יסבו": "dönecekler",
  "סובב": "dönen",

  // מצא - to find
  "וימצא": "ve–buldu", "מצא": "buldu", "ימצא": "bulacak", "מצא": "bul",
  "וימצאו": "ve–buldular", "מצאו": "buldular", "מצאת": "buldun",
  "מצאתי": "buldum", "תמצא": "bulacaksın", "ימצאו": "bulacaklar",
  "מצאה": "buldu",

  // אכל - to eat
  "ויאכל": "ve–yedi", "אכל": "yedi", "יאכל": "yiyecek", "אכל": "ye",
  "ויאכלו": "ve–yediler", "אכלו": "yediler", "אכלת": "yedin",
  "אכלתי": "yedim", "תאכל": "yiyeceksin", "יאכלו": "yiyecekler",
  "אכלה": "yedi", "אוכל": "yiyen",

  // שתה - to drink
  "וישת": "ve–içti", "שתה": "içti", "ישתה": "içecek", "שתה": "iç",
  "וישתו": "ve–içtiler", "שתו": "içtiler", "שתית": "içtin",
  "שתיתי": "içtim", "תשתה": "içeceksin", "ישתו": "içecekler",
  "שותה": "içen",

  // קרע - to tear
  "ויקרע": "ve–yırttı", "קרע": "yırttı", "יקרע": "yırtacak", "קרע": "yırt",
  "קרעו": "yırttılar", "קרעת": "yırttın", "קרעתי": "yırttım",
  "קרועים": "yırtık", "קרועי": "yırtık",

  // הרג - to kill
  "ויהרג": "ve–öldürdü", "הרג": "öldürdü", "יהרג": "öldürecek",
  "הרג": "öldür", "ויהרגו": "ve–öldürdüler", "הרגו": "öldürdüler",
  "הרגת": "öldürdün", "הרגתי": "öldürdüm", "תהרג": "öldüreceksin",
  "יהרגו": "öldürecekler", "ויהרגהו": "ve–öldürdü–onu",
  "להרג": "öldürmek–için",

  // פנה - to turn
  "ויפן": "ve–döndü", "פנה": "döndü", "יפנה": "dönecek", "פנה": "dön",
  "ויפנו": "ve–döndüler", "פנו": "döndüler", "פנית": "döndün",
  "פניתי": "döndüm", "תפנה": "döneceksin", "יפנו": "dönecekler",
  "פונה": "dönen",

  // זכר - to remember
  "ויזכר": "ve–hatırladı", "זכר": "hatırladı", "יזכר": "hatırlayacak",
  "זכר": "hatırla", "זכרו": "hatırladılar", "זכרת": "hatırladın",
  "זכרתי": "hatırladım", "תזכר": "hatırlayacaksın",
  "יזכרו": "hatırlayacaklar",

  // נמלט - to escape
  "וימלט": "ve–kurtuldu", "נמלט": "kurtuldu",
  "נמלטתי": "kurtuldum", "ימלט": "kurtulacak", "הימלט": "kurtul",
  "וימלטו": "ve–kurtuldular", "נמלטו": "kurtuldular",

  // נשען - to lean
  "נשען": "yaslanmış",

  // נקר - to gouge/chance upon
  "נקרא": "rastgele", "נקריתי": "rastladım",

  // שחה - to bow down
  "וישתחו": "ve–eğildi", "וישתחוו": "ve–eğildiler", "השתחוה": "secde–etti",
  "ישתחוה": "secde–edecek", "וישתחו": "ve–secde–etti",

  // === PARTICLES & PREPOSITIONS ===
  "את־": "–", "את": "–", "אותו": "onu", "אותי": "beni", "אותה": "onu",
  "אותם": "onları", "אותנו": "bizi", "אותך": "seni",
  "אל־": "–e", "אל": "–e", "אליו": "ona", "אלי": "bana", "אליה": "ona",
  "אליהם": "onlara", "אלינו": "bize", "אליך": "sana",
  "מן־": "–den", "מן": "–den", "ממנו": "ondan", "ממני": "benden",
  "ממנה": "ondan", "מהם": "onlardan", "ממך": "senden",
  "על־": "üzerinde–", "על": "üzerinde", "עליו": "üzerinde",
  "עליה": "üzerinde", "עלי": "üzerimde", "עליהם": "üzerlerinde",
  "עלינו": "üzerimizde", "עליך": "üzerinde",
  "ב": "–de", "בו": "onda", "בה": "onda", "בי": "bende",
  "בהם": "onlarda", "בנו": "bizde", "בך": "sende",
  "ל": "–e", "לו": "ona", "לה": "ona", "לי": "bana",
  "להם": "onlara", "לנו": "bize", "לך": "sana",
  "כ": "gibi–", "כמו": "gibi", "כמוך": "senin–gibi",
  "כמהו": "onun–gibi", "כמוני": "benim–gibi",
  "ו": "ve–", "אשר": "ki", "אשר־": "ki–",
  "כי": "çünkü", "כי־": "çünkü–", "אם": "eğer", "אם־": "eğer–",
  "לא": "değil", "לא־": "değil–", "אל": "yok", "אל־": "yok–",
  "גם": "da", "גם־": "da–", "וגם": "ve–da", "וגם־": "ve–da–",
  "עד": "kadar", "עד־": "kadar–", "עוד": "hâlâ",
  "פן": "yoksa", "אך": "ancak", "רק": "sadece",
  "ה": "mı", "מדוע": "neden", "למה": "neden",
  "איך": "nasıl", "אי": "nerede", "איה": "nerede",
  "מה": "ne", "מה־": "ne–", "מי": "kim", "מי־": "kim–",
  "זה": "bu", "זאת": "bu", "הוא": "o", "היא": "o",
  "הם": "onlar", "המה": "onlar", "הנה": "onlar",
  "אני": "ben", "אנכי": "ben", "אתה": "sen", "את": "sen",
  "אנחנו": "biz", "אתם": "siz",
  "נא": "lütfen", "עתה": "şimdi", "ועתה": "ve–şimdi",
  "הנה": "işte", "והנה": "ve–işte", "הן": "işte",
  "כן": "böyle", "כה": "böyle", "וכה": "ve–böyle",
  "שם": "orada", "פה": "burada", "מזה": "buradan",
  "אחרי": "sonra", "אחר": "sonra", "אחריו": "arkasından",
  "לפני": "önünde", "לפניו": "önünde", "תחת": "altında",
  "תחתיו": "altında", "בין": "arasında", "בתוך": "ortasında",
  "מעם": "yanından", "עם": "ile", "עם־": "ile–",
  "עמו": "onunla", "עמי": "benimle", "עמך": "seninle",
  "עמהם": "onlarla", "עמנו": "bizimle",
  "למען": "için", "בעבור": "için",
  "או": "veya", "או־": "veya–",
  "כל": "tüm", "כל־": "tüm–",
  "כלם": "hepsi", "כלה": "hepsi", "כלנו": "hepimiz",
  "עוד": "hâlâ", "יותר": "daha",

  // === NOUNS ===
  // People/Roles
  "מלך": "kral", "המלך": "kral", "מלכו": "kralı", "מלכי": "kralı",
  "מלכם": "kralları", "מלכות": "krallık", "ממלכה": "krallık",
  "ממלכתו": "krallığı",
  "איש": "adam", "האיש": "adam", "אישו": "adamı",
  "אנשים": "adamlar", "האנשים": "adamlar", "אנשי": "adamları",
  "אשה": "kadın", "האשה": "kadın", "אשתו": "karısı",
  "נשים": "kadınlar", "הנשים": "kadınlar", "נשיו": "karıları",
  "בן": "oğul", "בן־": "oğlu–", "בנו": "oğlu", "בני": "oğlum",
  "הבן": "oğul", "בנים": "oğullar", "הבנים": "oğullar",
  "בניו": "oğulları", "בני": "oğulları", "בני־": "oğulları–",
  "בנינו": "oğullarımız",
  "בת": "kız", "בת־": "kızı–", "בתו": "kızı", "בתי": "kızım",
  "בנות": "kızlar", "הבנות": "kızlar", "בנותיו": "kızları",
  "אב": "baba", "האב": "baba", "אבי": "babam", "אביו": "babası",
  "אבות": "babalar", "אבתיו": "babaları", "אביך": "baban",
  "אם": "anne", "האם": "anne", "אמו": "annesi", "אמי": "annem",
  "אח": "kardeş", "האח": "kardeş", "אחיו": "kardeşi", "אחי": "kardeşim",
  "אחים": "kardeşler", "אחיך": "kardeşlerin",
  "אחות": "kız–kardeş", "אחותו": "kız–kardeşi",
  "עבד": "kul", "העבד": "kul", "עבדו": "kulu", "עבדי": "kullarım",
  "עבדך": "kulun", "עבדיו": "kulları", "עבדים": "kullar",
  "העבדים": "kullar", "עבדיך": "kulların",
  "שפחה": "cariye", "השפחה": "cariye", "אמתך": "cariyen",
  "אדון": "efendi", "האדון": "efendi", "אדני": "efendim",
  "אדניו": "efendisi", "אדניך": "efendin",
  "נער": "genç", "הנער": "genç", "נערו": "genci",
  "נערים": "gençler", "הנערים": "gençler", "נעריו": "gençleri",
  "נערה": "genç–kız", "הנערה": "genç–kız",
  "זקן": "yaşlı", "הזקן": "yaşlı", "זקנים": "yaşlılar",
  "הזקנים": "yaşlılar", "זקני": "yaşlıları",
  "כהן": "kâhin", "הכהן": "kâhin", "כהנים": "kâhinler",
  "הכהנים": "kâhinler",
  "נביא": "peygamber", "הנביא": "peygamber",
  "נביאים": "peygamberler", "הנביאים": "peygamberler",
  "שר": "başkan", "השר": "başkan", "שרים": "başkanlar",
  "השרים": "başkanlar", "שרי": "başkanları",
  "צבא": "ordu", "הצבא": "ordu", "צבאו": "ordusu",
  "צבאות": "ordular",
  "חיל": "güç", "החיל": "güç", "חילו": "gücü",
  "גבור": "yiğit", "הגבור": "yiğit", "גבורים": "yiğitler",
  "הגבורים": "yiğitler", "גבורי": "yiğitleri",
  "איב": "düşman", "האיב": "düşman", "איביו": "düşmanları",
  "איביך": "düşmanların", "איבי": "düşmanları",
  "עם": "halk", "העם": "halk", "עמו": "halkı", "עמי": "halkım",
  "עמים": "halklar", "העמים": "halklar", "עמך": "halkın",
  "גוי": "millet", "הגוי": "millet", "גוים": "milletler",
  "הגוים": "milletler",
  "משפחה": "aile", "המשפחה": "aile", "משפחות": "aileler",
  "משפחתו": "ailesi",
  "בית": "ev", "בית־": "evi–", "הבית": "ev", "ביתו": "evi",
  "ביתי": "evim", "בתים": "evler", "הבתים": "evler",
  "ביתך": "evin",
  "רע": "arkadaş", "רעהו": "arkadaşı", "רעי": "arkadaşım",
  "רעך": "arkadaşın",

  // Body parts
  "ראש": "baş", "הראש": "baş", "ראשו": "başı", "ראשי": "başım",
  "ראשים": "başlar", "ראשי": "başları", "ראשך": "başın",
  "פנים": "yüz", "פני": "yüzü", "פניו": "yüzü",
  "פניהם": "yüzleri", "פניך": "yüzün",
  "עין": "göz", "העין": "göz", "עיניו": "gözleri",
  "עיני": "gözlerim", "עיניך": "gözlerin", "בעיני": "gözümde",
  "בעיניו": "gözünde", "בעיניך": "gözünde",
  "אזן": "kulak", "האזן": "kulak", "אזני": "kulakları",
  "אזניך": "kulakların", "באזני": "kulaklarımda",
  "פה": "ağız", "הפה": "ağız", "פי": "ağzı", "פיו": "ağzı",
  "פיך": "ağzın",
  "לשון": "dil", "הלשון": "dil",
  "יד": "el", "היד": "el", "ידו": "eli", "ידי": "ellerim",
  "ידיו": "elleri", "ידך": "elin", "ידיך": "ellerin",
  "ביד": "elinde", "בידו": "elinde", "בידי": "elimde",
  "ימין": "sağ–el", "ימינו": "sağ–eli", "ימיני": "sağ–elim",
  "שמאול": "sol–el", "שמאלו": "sol–eli",
  "רגל": "ayak", "הרגל": "ayak", "רגליו": "ayakları",
  "רגלי": "ayakları", "רגליך": "ayakların",
  "לב": "kalp", "הלב": "kalp", "לבו": "kalbi", "לבי": "kalbim",
  "לבבו": "kalbi", "לבך": "kalbin",
  "נפש": "can", "הנפש": "can", "נפשו": "canı", "נפשי": "canım",
  "נפשך": "canın", "בנפשי": "canımla",
  "בשר": "et", "הבשר": "et",
  "דם": "kan", "הדם": "kan", "דמו": "kanı", "דמי": "kanım",
  "דמך": "kanın",
  "עצם": "kemik", "עצמות": "kemikler", "עצמותיו": "kemikleri",
  "עצמי": "kemiklerim",

  // Weapons/Items
  "חרב": "kılıç", "החרב": "kılıç", "חרבו": "kılıcı", "חרבי": "kılıcım",
  "חרבות": "kılıçlar",
  "חנית": "mızrak", "החנית": "mızrak", "חניתו": "mızrağı",
  "קשת": "yay", "הקשת": "yay", "קשתו": "yayı",
  "מגן": "kalkan", "המגן": "kalkan",
  "כלי": "silahları", "כלי־": "silahları–", "כליו": "silahları",
  "בגד": "elbise", "הבגד": "elbise", "בגדיו": "elbiseleri",
  "בגדים": "elbiseler", "ובגדיו": "ve–elbiseleri",
  "שמלה": "elbise", "שמלתיו": "elbiseleri",
  "לחם": "ekmek", "הלחם": "ekmek", "והלחם": "ve–ekmek",
  "מים": "su", "המים": "su",
  "יין": "şarap", "היין": "şarap",

  // Nature/Places
  "ארץ": "toprak", "הארץ": "toprak", "ארצה": "toprağa",
  "ארצו": "toprağı", "ארצם": "toprakları",
  "שמים": "gökler", "השמים": "gökler",
  "ים": "deniz", "הים": "deniz",
  "נהר": "nehir", "הנהר": "nehir", "נהרות": "nehirler",
  "נחל": "dere", "הנחל": "dere",
  "מים": "su", "המים": "su",
  "אש": "ateş", "האש": "ateş",
  "ענן": "bulut", "הענן": "bulut",
  "אבן": "taş", "האבן": "taş", "אבנים": "taşlar",
  "הר": "dağ", "ההר": "dağ", "הרים": "dağlar",
  "ההרים": "dağlar", "בהר": "dağda",
  "גבעה": "tepe", "הגבעה": "tepe", "גבעות": "tepeler",
  "עמק": "vadi", "העמק": "vadi",
  "מדבר": "çöl", "המדבר": "çöl",
  "שדה": "tarla", "השדה": "tarla", "שדות": "tarlalar",
  "עיר": "şehir", "העיר": "şehir", "ערים": "şehirler",
  "הערים": "şehirler", "עירו": "şehri",
  "שער": "kapı", "השער": "kapı", "שערים": "kapılar",
  "חומה": "duvar", "החומה": "duvar",
  "דרך": "yol", "הדרך": "yol", "דרך־": "yolu–",
  "דרכו": "yolu", "דרכי": "yolum", "דרכך": "yolun",
  "עץ": "ağaç", "העץ": "ağaç", "עצי": "ağaçları",
  "אדמה": "toprak", "האדמה": "toprak", "ואדמה": "ve–toprak",
  "מחנה": "ordugâh", "המחנה": "ordugâh", "ממחנה": "ordugâhtan",

  // Time
  "יום": "gün", "היום": "bugün", "ביום": "günde",
  "יומו": "günü", "יומי": "günüm",
  "ימים": "günler", "הימים": "günler", "ימיו": "günleri",
  "לילה": "gece", "הלילה": "gece", "לילות": "geceler",
  "בקר": "sabah", "הבקר": "sabah",
  "ערב": "akşam", "הערב": "akşam",
  "חדש": "ay", "החדש": "ay", "חדשים": "aylar",
  "שנה": "yıl", "השנה": "yıl", "שנים": "yıllar",
  "השנים": "yıllar", "שנותיו": "yılları",
  "עת": "zaman", "העת": "zaman",
  "עולם": "sonsuzluk", "לעולם": "sonsuza–dek",
  "תמיד": "sürekli",
  "פעם": "kez", "הפעם": "kez",
  "ראשון": "birinci", "שני": "ikinci", "שלישי": "üçüncü",
  "השלישי": "üçüncü", "רביעי": "dördüncü", "חמישי": "beşinci",

  // Abstract
  "דבר": "söz", "הדבר": "söz", "דבר־": "sözü–",
  "דברו": "sözü", "דברי": "sözlerim", "דבריו": "sözleri",
  "דברים": "sözler", "הדברים": "sözler", "דבריך": "sözlerin",
  "שם": "isim", "השם": "isim", "שמו": "ismi", "שמי": "ismim",
  "שמך": "ismin",
  "קול": "ses", "הקול": "ses", "קולו": "sesi", "קולי": "sesim",
  "קולך": "sesin",
  "אמת": "gerçek", "האמת": "gerçek",
  "חסד": "iyilik", "החסד": "iyilik", "חסדו": "iyiliği",
  "חסדך": "iyiliğin",
  "צדקה": "doğruluk", "הצדקה": "doğruluk",
  "משפט": "hüküm", "המשפט": "hüküm", "משפטו": "hükmü",
  "משפטיו": "hükümleri",
  "תורה": "yasa", "התורה": "yasa",
  "חקה": "kural", "החקה": "kural",
  "מצוה": "buyruk", "המצוה": "buyruk",
  "ברית": "ahit", "הברית": "ahit", "בריתו": "ahdi",
  "בריתי": "ahdim", "בריתך": "ahdin",
  "שלום": "barış", "השלום": "barış", "שלומו": "barışı",
  "שלומך": "barışın",
  "מלחמה": "savaş", "המלחמה": "savaş", "מלחמות": "savaşlar",
  "מלחמתו": "savaşı",
  "חטאת": "günah", "החטאת": "günah", "חטא": "günah",
  "חטאתו": "günahı", "חטאתי": "günahım",
  "עון": "suç", "העון": "suç", "עונו": "suçu",
  "עוני": "suçum",
  "רעה": "kötülük", "הרעה": "kötülük",
  "טוב": "iyilik", "הטוב": "iyi", "טובו": "iyiliği",
  "רע": "kötü", "הרע": "kötü",
  "כח": "güç", "הכח": "güç", "כחו": "gücü", "כחי": "gücüm",
  "עז": "kudret", "העז": "kudret",
  "כבוד": "şeref", "הכבוד": "şeref", "כבודו": "şerefi",
  "מות": "ölüm", "המות": "ölüm",
  "חיים": "hayat", "החיים": "hayat", "חיי": "hayatım",
  "חייו": "hayatı",
  "רחמים": "merhamet", "רחמיו": "merhameti",
  "נקם": "intikam", "נקמה": "intikam",

  // === DIVINE NAMES ===
  "יהוה": "YHVH", "ליהוה": "YHVH'ye", "ביהוה": "YHVH'de",
  "אלהים": "Elohim", "האלהים": "Elohim", "אלהי": "Elohim'i",
  "אלהיו": "Elohim'i", "אלהיך": "Elohim'in", "אלהינו": "Elohim'imiz",
  "אל": "El", "האל": "El",
  "אדני": "Adonay",
  "שדי": "Şadday",
  "צבאות": "Tsevaot",

  // === NUMBERS ===
  "אחד": "bir", "אחת": "bir", "ראשון": "birinci",
  "שנים": "iki", "שתים": "iki", "שני": "iki", "שנית": "ikinci",
  "שלוש": "üç", "שלשה": "üç", "השלישי": "üçüncü", "שלשת": "üçü",
  "ארבע": "dört", "ארבעה": "dört", "רביעי": "dördüncü",
  "חמש": "beş", "חמשה": "beş", "חמישי": "beşinci",
  "שש": "altı", "ששה": "altı",
  "שבע": "yedi", "שבעה": "yedi",
  "שמנה": "sekiz", "שמונה": "sekiz",
  "תשע": "dokuz", "תשעה": "dokuz",
  "עשר": "on", "עשרה": "on",
  "עשרים": "yirmi",
  "שלשים": "otuz",
  "ארבעים": "kırk",
  "חמשים": "elli",
  "ששים": "altmış",
  "שבעים": "yetmiş",
  "שמונים": "seksen",
  "תשעים": "doksan",
  "מאה": "yüz", "מאות": "yüzler",
  "אלף": "bin", "אלפים": "binler",

  // === ADJECTIVES ===
  "גדול": "büyük", "הגדול": "büyük", "גדולה": "büyük",
  "קטן": "küçük", "הקטן": "küçük", "קטנה": "küçük",
  "טוב": "iyi", "הטוב": "iyi", "טובה": "iyi",
  "רע": "kötü", "הרע": "kötü", "רעה": "kötü",
  "חדש": "yeni", "החדש": "yeni",
  "ישן": "eski",
  "חזק": "güçlü", "החזק": "güçlü",
  "יפה": "güzel",
  "חכם": "bilge", "חכמים": "bilgeler",
  "רשע": "kötü", "רשעים": "kötüler",
  "צדיק": "doğru", "צדיקים": "doğrular",
  "קדוש": "kutsal", "קדושים": "kutsallar",
  "טהור": "temiz",
  "טמא": "kirli",
  "חי": "diri", "חיים": "diriler",
  "מת": "ölü", "מתים": "ölüler",
  "ישר": "doğru", "הישר": "doğru",
  "נאמן": "sadık",

  // === PROPER NAMES ===
  // People in 2 Samuel
  "שאול": "Şaul", "לשאול": "Şaul'a", "משאול": "Şaul'dan",
  "דוד": "Davut", "ודוד": "ve–Davut", "לדוד": "Davut'a",
  "מדוד": "Davut'tan",
  "יונתן": "Yonatan", "יהונתן": "Yehonatan",
  "ויהונתן": "ve–Yehonatan",
  "ישראל": "İsrail", "לישראל": "İsrail'e", "בישראל": "İsrail'de",
  "מישראל": "İsrail'den",
  "יהודה": "Yehuda", "ליהודה": "Yehuda'ya", "ביהודה": "Yehuda'da",
  "אבנר": "Avner", "לאבנר": "Avner'e",
  "יואב": "Yoav", "ליואב": "Yoav'a",
  "אבשלום": "Avşalom", "לאבשלום": "Avşalom'a", "ואבשלום": "ve–Avşalom",
  "אמנון": "Amnon", "לאמנון": "Amnon'a",
  "תמר": "Tamar",
  "בת־שבע": "Bat-Şeva",
  "אוריה": "Uriya", "לאוריה": "Uriya'ya",
  "נתן": "Natan", "לנתן": "Natan'a",
  "צדוק": "Tsadok", "לצדוק": "Tsadok'a",
  "אביתר": "Evyatar", "לאביתר": "Evyatar'a",
  "מפיבשת": "Mefiboşet", "למפיבשת": "Mefiboşet'e",
  "ציבא": "Tsiva", "לציבא": "Tsiva'ya",
  "שמעי": "Şimi", "לשמעי": "Şimi'ye",
  "אחיתפל": "Ahitofel", "לאחיתפל": "Ahitofel'e",
  "חושי": "Huşay", "לחושי": "Huşay'a",
  "צרויה": "Tseruya", "לצרויה": "Tseruya'ya",
  "אבישי": "Avişay", "לאבישי": "Avişay'a",
  "עשהאל": "Asahel", "עשאל": "Asahel",
  "איש בשת": "İş-Boşet", "איש־בשת": "İş-Boşet",
  "לאיש־בשת": "İş-Boşet'e",
  "ארונה": "Aravna", "אורנה": "Aravna", "הארונה": "Aravna",
  "הארוונה": "Aravna",
  "אביגיל": "Avigayil", "לאביגיל": "Avigayil'e",
  "חנון": "Hanun", "לחנון": "Hanun'a",
  "נחש": "Nahaş",
  "שמע": "Şima",
  "ריצפה": "Ritspa",
  "גד": "Gad",

  // Places
  "ירושלים": "Yeruşalayim", "ירושלם": "Yeruşalayim",
  "לירושלים": "Yeruşalayim'e", "בירושלים": "Yeruşalayim'de",
  "מירושלים": "Yeruşalayim'den",
  "חברון": "Hevron", "לחברון": "Hevron'a", "בחברון": "Hevron'da",
  "מחברון": "Hevron'dan",
  "ציקלג": "Tsiklag", "בציקלג": "Tsiklag'da",
  "גלבע": "Gilboa", "הגלבע": "Gilboa", "בהר": "dağda",
  "גבעון": "Givon", "בגבעון": "Givon'da",
  "מחנים": "Mahanayim", "למחנים": "Mahanayim'e",
  "במחנים": "Mahanayim'de",
  "בעל חצור": "Baal-Hatsor",
  "גשור": "Geşur", "לגשור": "Geşur'a",
  "ירדן": "Yarden", "הירדן": "Yarden", "ליירדן": "Yarden'e",

  // Nations
  "פלשתים": "Filistliler", "הפלשתים": "Filistliler",
  "פלשתי": "Filistli",
  "העמלק": "Amalek", "עמלק": "Amalek", "עמלקי": "Amalekli",
  "מואב": "Moav", "למואב": "Moav'a",
  "אדום": "Edom", "לאדום": "Edom'a",
  "ארם": "Aram", "לארם": "Aram'a",
  "עמון": "Ammon", "לעמון": "Ammon'a",
  "בני עמון": "Ammonoğulları", "בני־עמון": "Ammonoğulları",
  "גת": "Gat", "לגת": "Gat'a",
  "הכרתי": "Keretliler", "הפלתי": "Peletliler",

  // More forms
  "מאד": "çok",
  "הלום": "buraya",
  "לכן": "bu–yüzden",
  "עלכן": "bu–yüzden",
  "אפס": "fakat",
  "אולם": "fakat",
  "אבל": "fakat",
  "הלא": "değil–mi",
  "טרם": "henüz",
  "בטרם": "önce",
  "אחרי": "sonra",
  "אחרי כן": "ondan–sonra",
  "עכשו": "şimdi",
};

// Translate a single word
function translateWordChirho(hebrewChirho: string): string {
  // Handle special markers
  if (hebrewChirho === 'ס' || hebrewChirho === 'פ') {
    return '';
  }

  // Clean the word
  const cleanedChirho = stripMarksChirho(hebrewChirho);
  const consonantsChirho = getConsonantsChirho(cleanedChirho);

  // Try exact match with cleaned text
  if (hebrewToTurkishChirho[cleanedChirho]) {
    return hebrewToTurkishChirho[cleanedChirho];
  }

  // Try consonants only
  if (hebrewToTurkishChirho[consonantsChirho]) {
    return hebrewToTurkishChirho[consonantsChirho];
  }

  // Handle bracketed text like [כי] or (ל֥וֹ)
  const bracketMatchChirho = hebrewChirho.match(/[\[\(](.+?)[\]\)]/);
  if (bracketMatchChirho) {
    const innerChirho = bracketMatchChirho[1];
    const innerCleanedChirho = stripMarksChirho(innerChirho);
    const innerConsonantsChirho = getConsonantsChirho(innerCleanedChirho);
    if (hebrewToTurkishChirho[innerCleanedChirho]) {
      return `(${hebrewToTurkishChirho[innerCleanedChirho]})`;
    }
    if (hebrewToTurkishChirho[innerConsonantsChirho]) {
      return `(${hebrewToTurkishChirho[innerConsonantsChirho]})`;
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
    glossesChirho[wordIdChirho] = translationChirho;
  }

  // Write glosses to file
  writeFileSync('/tmp/2sa-tur-glosses-final-chirho.json', JSON.stringify(glossesChirho, null, 2));

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
  if (uniqueUnknownChirho.length > 0) {
    console.log('\nSample unknown words:');
    uniqueUnknownChirho.slice(0, 20).forEach(u => console.log(`  ${u}`));
  }

  console.log(`\nOutput written to: /tmp/2sa-tur-glosses-final-chirho.json`);
}

mainChirho().catch(console.error);
