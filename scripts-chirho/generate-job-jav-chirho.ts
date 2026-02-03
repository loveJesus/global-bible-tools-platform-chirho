#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate Job chapters 18-42 Javanese (Krama) translation SQL files
 */

import { spawnSync } from "child_process";
import { mkdirSync, writeFileSync, existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

const OUTPUT_DIR_CHIRHO = "/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho/translations-chirho/job-jav-chirho";
const LANG_CODE_CHIRHO = "jav";
const SOURCE_CHIRHO = "opus-4.5-chirho";

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR_CHIRHO)) {
  mkdirSync(OUTPUT_DIR_CHIRHO, { recursive: true });
}

/**
 * Get words from database for a chapter using spawnSync (safe)
 */
function getChapterWordsChirho(chapterChirho: number): Array<{ id: string; text: string }> {
  // Job = book 18, format: BBCCCVVVWW where BB=18 (2 digits), CCC=chapter (3 digits)
  const chapterPaddedChirho = String(chapterChirho).padStart(3, "0");
  const queryChirho = `SELECT id, text FROM word WHERE id LIKE '18${chapterPaddedChirho}%' ORDER BY id`;

  const resultChirho = spawnSync("docker", [
    "exec",
    "nextjs-platform-chirho-db-1",
    "psql",
    "-U", "postgres",
    "-t",
    "-c", queryChirho
  ], { encoding: "utf-8" });

  if (resultChirho.status !== 0) {
    console.error(`Error getting words for chapter ${chapterChirho}:`, resultChirho.stderr);
    return [];
  }

  const wordsChirho: Array<{ id: string; text: string }> = [];
  for (const lineChirho of resultChirho.stdout.split("\n")) {
    const trimmedChirho = lineChirho.trim();
    if (!trimmedChirho) continue;
    const [idChirho, ...textPartsChirho] = trimmedChirho.split("|");
    if (idChirho && textPartsChirho.length > 0) {
      wordsChirho.push({
        id: idChirho.trim(),
        text: textPartsChirho.join("|").trim(),
      });
    }
  }
  return wordsChirho;
}

/**
 * Generate SQL for a single word
 */
function generateWordSqlChirho(wordIdChirho: string, glossChirho: string, hebrewChirho: string): string {
  const escapedGlossChirho = glossChirho.replace(/'/g, "''");
  return `-- ${wordIdChirho}: ${hebrewChirho} → "${glossChirho}" [${SOURCE_CHIRHO}]
WITH np AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = '${LANG_CODE_CHIRHO}'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '${wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${LANG_CODE_CHIRHO}') AND p.deleted_at IS NULL
  )
  RETURNING id
)
INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '${wordIdChirho}' FROM np ON CONFLICT DO NOTHING;
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, '${escapedGlossChirho}', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '${wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${LANG_CODE_CHIRHO}') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at, source = EXCLUDED.source;
`;
}

/**
 * Generate SQL file for a verse
 */
function generateVerseSqlChirho(
  chapterChirho: number,
  verseChirho: number,
  glossesChirho: Array<{ wordId: string; gloss: string; hebrew: string }>
): string {
  const glossSummaryChirho = glossesChirho.map(g => g.gloss).join(" ");
  let sqlChirho = `-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- JOB c${chapterChirho}-v${verseChirho} - JAV
-- ${glossSummaryChirho}

BEGIN;
`;

  for (const gChirho of glossesChirho) {
    sqlChirho += generateWordSqlChirho(gChirho.wordId, gChirho.gloss, gChirho.hebrew);
  }

  sqlChirho += "COMMIT;\n";
  return sqlChirho;
}

// Javanese Krama translations for chapters 18-20
const CHAPTER_GLOSSES_CHIRHO: Record<number, Record<string, string>> = {
  18: {
    "1801800101": "lan–mangsuli", "1801800102": "Bildad", "1801800103": "tiyang–Suah", "1801800104": "lan–ngendika",
    "1801800201": "ngantos–", "1801800202": "kapan", "1801800203": "panjenengan–damel", "1801800204": "pungkasan",
    "1801800205": "dhumateng–tembung-tembung", "1801800206": "panjenengan–mangertosi", "1801800207": "lan–sasampunipun", "1801800208": "kita–badhe–ngendika",
    "1801800301": "kénging–menapa", "1801800302": "kita–dipunétang", "1801800303": "kados–kéwan", "1801800304": "kita–dados–reged", "1801800305": "ing–paningal–panjenengan",
    "1801800401": "ingkang–nyuwék", "1801800402": "nyawanipun", "1801800403": "ing–bebendu–nipun", "1801800404": "menapa–amargi–panjenengan",
    "1801800405": "badhe–dipuntilar", "1801800406": "bumi", "1801800407": "lan–dipunpindhah–", "1801800408": "séla", "1801800409": "saking–papanipun",
    "1801800501": "ugi", "1801800502": "pepadhang", "1801800503": "tiyang–duraka", "1801800504": "badhe–pejah",
    "1801800505": "lan–mboten–", "1801800506": "badhe–sumunar", "1801800507": "urubing", "1801800508": "latuipun",
    "1801800601": "pepadhang", "1801800602": "dados–peteng", "1801800603": "ing–tarubipun", "1801800604": "lan–dilahipun", "1801800605": "ing–nginggil", "1801800606": "badhe–pejah",
    "1801800701": "dipundamel–ciyut", "1801800702": "jangkah-jangkah", "1801800703": "kakiyatanipun", "1801800704": "lan–dipununcalaken", "1801800705": "rancangan–ipun",
    "1801800801": "amargi–", "1801800802": "dipununcalaken", "1801800803": "ing–jaring", "1801800804": "kaliyan–sampeyanipun",
    "1801800805": "lan–ing–nginggil–", "1801800806": "kisi-kisi", "1801800807": "piyambakipun–mlampah",
    "1801800901": "nyepeng", "1801800902": "ing–tungkakipun", "1801800903": "jebakan", "1801800904": "dipuncepeng", "1801800905": "ing–nginggil", "1801800906": "tali–jebakan",
    "1801801001": "kasingidaken", "1801801002": "ing–siti", "1801801003": "tali–ipun", "1801801004": "lan–jiret–ipun", "1801801005": "ing–nginggil", "1801801006": "margi",
    "1801801101": "sakubeng", "1801801102": "dipunajrih-ajrihi", "1801801103": "mawon–ajrih", "1801801104": "lan–dipunsebar", "1801801105": "dhumateng–sampeyan–ipun",
    "1801801201": "dados–", "1801801202": "keluwen", "1801801203": "kakiyatanipun", "1801801204": "lan–bilai", "1801801205": "cumawis", "1801801206": "dhumateng–sisihipun",
    "1801801301": "nedha", "1801801302": "pérangan–", "1801801303": "kulitipun", "1801801304": "nedha", "1801801305": "pérangan-péranganipun", "1801801306": "pambarep", "1801801307": "pejah",
    "1801801401": "dipunpedhot", "1801801402": "saking–tarubipun", "1801801403": "kapitadosan–ipun", "1801801404": "lan–dipunlampahaken", "1801801405": "dhumateng–raja", "1801801406": "mawon–ajrih",
    "1801801501": "manggèn", "1801801502": "ing–tarubipun", "1801801503": "tanpa–", "1801801504": "piyambakipun", "1801801505": "dipunsebar", "1801801506": "ing–nginggil–", "1801801507": "papan–dedalemipun", "1801801508": "wlirang",
    "1801801601": "saking–ngandhap", "1801801602": "oyod-oyodipun", "1801801603": "dados–garing", "1801801604": "lan–saking–nginggil", "1801801605": "dipuntigas", "1801801606": "panénipun",
    "1801801701": "pangéling-éling–ipun–", "1801801702": "sirna", "1801801703": "saking–", "1801801704": "bumi", "1801801705": "lan–mboten–", "1801801706": "nami", "1801801707": "kanggé–piyambakipun", "1801801708": "ing–nginggil–", "1801801709": "praupan–", "1801801710": "jawi",
    "1801801801": "dipunsurung", "1801801802": "saking–pepadhang", "1801801803": "dhumateng–", "1801801804": "pepeteng", "1801801805": "lan–saking–jagad", "1801801806": "dipuntundhung",
    "1801801901": "mboten", "1801801902": "putra", "1801801903": "kanggé–piyambakipun", "1801801904": "lan–mboten–", "1801801905": "wayah", "1801801906": "ing–bangsa–nipun", "1801801907": "lan–mboten–wonten", "1801801908": "tiyang–gesang", "1801801909": "ing–papan–dedalemipun",
    "1801802001": "ing–nginggil–", "1801802002": "dintenipun", "1801802003": "nggumunaken", "1801802004": "tiyang–wingking", "1801802005": "lan–tiyang–ngajeng", "1801802006": "dipuncepeng", "1801802007": "giris",
    "1801802101": "namung–", "1801802102": "punika", "1801802103": "papan–dedalem", "1801802104": "tiyang–duraka", "1801802105": "lan–punika", "1801802106": "papan", "1801802107": "mboten–", "1801802108": "ngertos–", "1801802109": "Gusti Allah", "1801802110": "s"
  },
  19: {
    "1801900101": "lan–mangsuli", "1801900102": "Ayub", "1801900103": "lan–ngendika",
    "1801900201": "ngantos–", "1801900202": "kapan", "1801900203": "panjenengan–nyusahaken", "1801900204": "nyawa–kawula", "1801900205": "lan–ngremuk–kawula", "1801900206": "kaliyan–tembung-tembung",
    "1801900301": "punika", "1801900302": "sedasa", "1801900303": "kaping", "1801900304": "panjenengan–wirangaken–kawula", "1801900305": "mboten–", "1801900306": "panjenengan–isin", "1801900307": "panjenengan–tumindak–kasar–", "1801900308": "dhumateng–kawula",
    "1801900401": "lan–saèstu–", "1801900402": "yektos", "1801900403": "kawula–lepat", "1801900404": "kaliyan–kawula", "1801900405": "manggèn", "1801900406": "kalepatan–kawula",
    "1801900501": "menawi–", "1801900502": "yektos", "1801900503": "ing–nginggil–kawula", "1801900504": "panjenengan–ngagungaken", "1801900505": "lan–nedahaken", "1801900506": "ing–nginggil–kawula", "1801900507": "wirang–kawula",
    "1801900601": "mangertosa–", "1801900602": "lajeng", "1801900603": "bilih–", "1801900604": "Gusti Allah", "1801900605": "nganiaya–kawula", "1801900606": "lan–jaring–Ipun", "1801900607": "ing–nginggil–kawula", "1801900608": "ngubengi",
    "1801900701": "sapunika", "1801900702": "kawula–celuk", "1801900703": "panganiaya", "1801900704": "lan–mboten", "1801900705": "kawula–dipunwangsuli", "1801900706": "kawula–sesambat", "1801900707": "lan–mboten–wonten", "1801900708": "pangadilan",
    "1801900801": "margi–kawula", "1801900802": "dipunpager", "1801900803": "lan–mboten", "1801900804": "kawula–langkung", "1801900805": "lan–ing–nginggil", "1801900806": "margi-margi–kawula", "1801900807": "pepeteng", "1801900808": "dipunselehaken",
    "1801900901": "kamulyan–kawula", "1801900902": "saking–kawula", "1801900903": "dipuncopot", "1801900904": "lan–dipunpendhet", "1801900905": "makutha", "1801900906": "mustaka–kawula",
    "1801901001": "dipunbubrah–kawula", "1801901002": "sakubeng", "1801901003": "lan–kawula–kesah", "1801901004": "lan–dipunpindhah", "1801901005": "kados–wit", "1801901006": "pangajeng-ajeng–kawula",
    "1801901101": "lan–murub", "1801901102": "ing–nginggil–kawula", "1801901103": "bebendu–Ipun", "1801901104": "lan–dipunétang–kawula", "1801901105": "kanggé–Panjenenganipun", "1801901106": "kados–mengsah–Ipun",
    "1801901201": "sesarengan", "1801901202": "rawuh", "1801901203": "wadya–bala–Ipun", "1801901204": "lan–numpuk", "1801901205": "ing–nginggil–kawula", "1801901206": "margi–nipun", "1801901207": "lan–masang–kémah", "1801901208": "sakubeng", "1801901209": "tarub–kawula",
    "1801901301": "sedhèrèk–kawula", "1801901302": "saking–kawula", "1801901303": "dipuntebihaken", "1801901304": "lan–ingkang–tepang–kaliyan–kawula", "1801901305": "namung–", "1801901306": "dados–tiyang–manca", "1801901307": "saking–kawula",
    "1801901401": "mandheg", "1801901402": "sanak-sedhèrèk–kawula", "1801901403": "lan–ingkang–tepang–kaliyan–kawula", "1801901404": "kesupen–kawula",
    "1801901501": "tiyang–énggal", "1801901502": "griya–kawula", "1801901503": "lan–abdi–èstri–kawula", "1801901504": "kados–tiyang–manca", "1801901505": "panjenengan–nganggep–kawula", "1801901506": "tiyang–manca", "1801901507": "kawula–dados", "1801901508": "ing–paningal–ipun",
    "1801901601": "dhumateng–abdi–kawula", "1801901602": "kawula–celuk", "1801901603": "lan–mboten", "1801901604": "piyambakipun–mangsuli", "1801901605": "kaliyan–", "1801901606": "tutuk–kawula", "1801901607": "kawula–nyuwun–", "1801901608": "dhumateng–piyambakipun",
    "1801901701": "napas–kawula", "1801901702": "anèh", "1801901703": "dhumateng–garwa–kawula", "1801901704": "lan–kawula–nyuwun", "1801901705": "dhumateng–putra", "1801901706": "rahim–kawula",
    "1801901801": "ugi–", "1801901802": "laré-laré", "1801901803": "nampik", "1801901804": "kawula", "1801901805": "kawula–tangi", "1801901806": "lan–piyambakipun–ngendika–", "1801901807": "bab–kawula",
    "1801901901": "dipunjijiki", "1801901902": "sedaya–", "1801901903": "tiyang–", "1801901904": "sadhèrèk–kawula", "1801901905": "lan–punika–", "1801901906": "ingkang–kawula–tresnani", "1801901907": "malik–", "1801901908": "kaliyan–kawula",
    "1801902001": "ing–kulit–kawula", "1801902002": "lan–ing–daging–kawula", "1801902003": "nèmpèl", "1801902004": "balung–kawula", "1801902005": "lan–kawula–luwar", "1801902006": "kaliyan–kulit", "1801902007": "untu–kawula",
    "1801902101": "welas–kawula", "1801902102": "welas–kawula", "1801902103": "panjenengan", "1801902104": "mitra–kawula", "1801902105": "amargi", "1801902106": "asta–", "1801902107": "Gusti Allah", "1801902108": "ndemèk", "1801902109": "kawula",
    "1801902201": "kénging–menapa", "1801902202": "panjenengan–nguber–kawula", "1801902203": "kados–", "1801902204": "Gusti Allah", "1801902205": "lan–saking–daging–kawula", "1801902206": "mboten", "1801902207": "panjenengan–wareg",
    "1801902301": "sinten–", "1801902302": "maringi", "1801902303": "lajeng", "1801902304": "lan–dipuntulis", "1801902305": "tembung-tembung–kawula", "1801902306": "sinten–", "1801902307": "maringi", "1801902308": "ing–kitab", "1801902309": "lan–dipunukir",
    "1801902401": "kaliyan–pen–", "1801902402": "wesi", "1801902403": "lan–timah", "1801902404": "kanggé–salaminipun", "1801902405": "ing–séla", "1801902406": "dipunpahat",
    "1801902501": "lan–kawula", "1801902502": "ngertos", "1801902503": "Juru–tebus–kawula", "1801902504": "gesang", "1801902505": "lan–ingkang–pungkasan", "1801902506": "ing–nginggil–", "1801902507": "lebu", "1801902508": "badhe–jumeneng",
    "1801902601": "lan–sasampunipun", "1801902602": "kulit–kawula", "1801902603": "dipunrusak–", "1801902604": "punika", "1801902605": "lan–saking–daging–kawula", "1801902606": "kawula–badhe–ningali", "1801902607": "Gusti Allah",
    "1801902701": "ingkang", "1801902702": "kawula", "1801902703": "kawula–badhe–ningali–", "1801902704": "kanggé–kawula", "1801902705": "lan–mripat–kawula", "1801902706": "ningali", "1801902707": "lan–mboten–", "1801902708": "tiyang–manca", "1801902709": "sirna", "1801902710": "ginjel–kawula", "1801902711": "ing–pangkon–kawula",
    "1801902801": "amargi", "1801902802": "panjenengan–ngendika", "1801902803": "menapa–", "1801902804": "kita–nguber–", "1801902805": "piyambakipun", "1801902806": "lan–oyod", "1801902807": "prakawis", "1801902808": "kapanggih–", "1801902809": "ing–kawula",
    "1801902901": "ajriha", "1801902902": "kanggé–panjenengan", "1801902903": "saking–praupan–", "1801902904": "pedhang", "1801902905": "amargi–", "1801902906": "bebendu", "1801902907": "dosa", "1801902908": "pedhang", "1801902909": "supados", "1801902910": "panjenengan–mangertosi", "1801902911": "[kiyamat]", "1801902912": "(pangadilan)", "1801902913": "s"
  },
  20: {
    "1802000101": "lan–mangsuli", "1802000102": "Tsofar", "1802000103": "tiyang–Naama", "1802000104": "lan–ngendika",
    "1802000201": "pramila", "1802000202": "pikiran–kawula", "1802000203": "mangsuli–kawula", "1802000204": "lan–amargi", "1802000205": "kesusu–kawula", "1802000206": "ing–kawula",
    "1802000301": "pangandikan", "1802000302": "wirang–kawula", "1802000303": "kawula–mireng", "1802000304": "lan–roh", "1802000305": "saking–pangertosan–kawula", "1802000306": "mangsuli–kawula",
    "1802000401": "menapa–punika", "1802000402": "panjenengan–ngertos", "1802000403": "saking–", "1802000404": "kina", "1802000405": "saking–", "1802000406": "nalika–dipunselehaken", "1802000407": "manungsa", "1802000408": "ing–nginggil–", "1802000409": "bumi",
    "1802000501": "bilih", "1802000502": "sorak-sorak", "1802000503": "tiyang–duraka", "1802000504": "saking–celak", "1802000505": "lan–kabingahan", "1802000506": "tiyang–munafik", "1802000507": "ngantos–", "1802000508": "sedhela",
    "1802000601": "menawi–", "1802000602": "minggah", "1802000603": "dhumateng–langit", "1802000604": "kaluhuranipun", "1802000605": "lan–mustaka–nipun", "1802000606": "dhumateng–méga", "1802000607": "tekan",
    "1802000701": "kados–tinja–nipun", "1802000702": "kanggé–salaminipun", "1802000703": "piyambakipun–sirna", "1802000704": "ingkang–ningali–piyambakipun", "1802000705": "ngendika", "1802000706": "wonten–pundi–piyambakipun",
    "1802000801": "kados–impèn", "1802000802": "mabur", "1802000803": "lan–mboten", "1802000804": "dipunpanggihaken", "1802000805": "lan–dipuntundhung", "1802000806": "kados–wahyu", "1802000807": "dalu",
    "1802000901": "mripat", "1802000902": "ningali", "1802000903": "lan–mboten", "1802000904": "malih", "1802000905": "lan–mboten–", "1802000906": "malih", "1802000907": "ningali–piyambakipun", "1802000908": "papanipun",
    "1802001001": "putra-putranipun", "1802001002": "nyuwun–sih", "1802001003": "tiyang–mlarat", "1802001004": "lan–asta–nipun", "1802001005": "mbalèkaken", "1802001006": "kakiyatanipun",
    "1802001101": "balung-balungipun", "1802001102": "kebak", "1802001103": "[aném–nipun]", "1802001104": "(aném–ipun)", "1802001105": "lan–sesarengan–piyambakipun", "1802001106": "ing–nginggil–", "1802001107": "lebu", "1802001108": "sarèn",
    "1802001201": "menawi–", "1802001202": "manis", "1802001203": "ing–tutukipun", "1802001204": "piawon", "1802001205": "piyambakipun–nyimpen", "1802001206": "ing–sangandhap", "1802001207": "ilat–ipun",
    "1802001301": "piyambakipun–ngeman", "1802001302": "ing–nginggilipun", "1802001303": "lan–mboten", "1802001304": "piyambakipun–nilar", "1802001305": "lan–piyambakipun–nyimpen", "1802001306": "ing–tengah", "1802001307": "cethak–ipun",
    "1802001401": "tedha–nipun", "1802001402": "ing–padharanipun", "1802001403": "dados–owah", "1802001404": "wisa", "1802001405": "ula", "1802001406": "ing–nglebet–ipun",
    "1802001501": "bandha", "1802001502": "dipunulu", "1802001503": "lan–dipunmutahaken", "1802001504": "saking–padharanipun", "1802001505": "dipuntundhung", "1802001506": "Gusti Allah",
    "1802001601": "sirah–", "1802001602": "ula", "1802001603": "piyambakipun–nyesep", "1802001604": "dipunpejahi", "1802001605": "ilat", "1802001606": "ula–weling",
    "1802001701": "mboten–", "1802001702": "piyambakipun–ningali", "1802001703": "ing–ilèn-ilèn", "1802001704": "lèpèn-lèpèn", "1802001705": "kali-kali", "1802001706": "madu", "1802001707": "lan–krim",
    "1802001801": "mbalèkaken", "1802001802": "ingkang–lelabetan", "1802001803": "lan–mboten", "1802001804": "dipunulu", "1802001805": "miturut–bandha", "1802001806": "ijol-ijolan–ipun", "1802001807": "lan–mboten", "1802001808": "piyambakipun–bingah",
    "1802001901": "amargi–", "1802001902": "piyambakipun–ngremuk", "1802001903": "nilar", "1802001904": "tiyang–mlarat", "1802001905": "griya", "1802001906": "piyambakipun–ngrampas", "1802001907": "lan–mboten", "1802001908": "piyambakipun–mbangun",
    "1802002001": "amargi", "1802002002": "mboten–", "1802002003": "piyambakipun–ngertos", "1802002004": "tentrem", "1802002005": "ing–padharanipun", "1802002006": "ing–pepénginanipun", "1802002007": "mboten", "1802002008": "piyambakipun–nylametaken",
    "1802002101": "mboten–wonten–", "1802002102": "tiyang–gesang", "1802002103": "kanggé–dipunnedha", "1802002104": "pramila–", "1802002105": "punika", "1802002106": "mboten–", "1802002107": "langgeng", "1802002108": "kasaenanipun",
    "1802002201": "ing–kawaregan", "1802002202": "kecoranipun", "1802002203": "sesak", "1802002204": "kanggé–piyambakipun", "1802002205": "sedaya–", "1802002206": "asta", "1802002207": "ingkang–kangelan", "1802002208": "rawuh–piyambakipun",
    "1802002301": "dados–", "1802002302": "kanggé–ngisi", "1802002303": "padharanipun", "1802002304": "dipunkintunaken–", "1802002305": "ing–piyambakipun", "1802002306": "bebendunipun", "1802002307": "bebendu–Ipun", "1802002308": "lan–dipunudhunaken", "1802002309": "ing–nginggil–ipun", "1802002310": "ing–tetedhan–ipun",
    "1802002401": "piyambakipun–mlayu", "1802002402": "saking–gegaman", "1802002403": "wesi", "1802002404": "nembus–piyambakipun", "1802002405": "panah", "1802002406": "perunggu",
    "1802002501": "dipuncabut", "1802002502": "lan–medal", "1802002503": "saking–badanipun", "1802002504": "lan–kilat", "1802002505": "saking–empedu–ipun", "1802002506": "mlampah", "1802002507": "ing–nginggil–piyambakipun", "1802002508": "mawon–ajrih",
    "1802002601": "sedaya–", "1802002602": "pepeteng", "1802002603": "kasingidaken", "1802002604": "kanggé–rajakayanipun", "1802002605": "nedha–piyambakipun", "1802002606": "latu", "1802002607": "mboten–", "1802002608": "dipuntiup", "1802002609": "awon", "1802002610": "tiyang–gesang", "1802002611": "ing–tarubipun",
    "1802002701": "nedahaken", "1802002702": "langit", "1802002703": "dosa–ipun", "1802002704": "lan–bumi", "1802002705": "jumeneng–nglawan", "1802002706": "piyambakipun",
    "1802002801": "dipunbeta", "1802002802": "asil", "1802002803": "griya–nipun", "1802002804": "dipunili", "1802002805": "ing–dinten", "1802002806": "bebendu–Ipun",
    "1802002901": "punika", "1802002902": "panduman–", "1802002903": "manungsa", "1802002904": "duraka", "1802002905": "saking–Gusti Allah", "1802002906": "lan–warisan", "1802002907": "pangandikan–Ipun", "1802002908": "saking–Gusti Allah", "1802002909": "p"
  },
  21: {
    "1802100101": "lan–mangsuli", "1802100102": "Ayub", "1802100103": "lan–ngendika",
    "1802100201": "mirengna", "1802100202": "kanthi–premati", "1802100203": "tembung–kawula", "1802100204": "lan–dados–", "1802100205": "punika", "1802100206": "panglipur–panjenengan",
    "1802100301": "ngentosana–kawula", "1802100302": "lan–kawula", "1802100303": "kawula–badhe–ngendika", "1802100304": "lan–sasampunipun", "1802100305": "ngendika–kawula", "1802100306": "panjenengan–moyoki",
    "1802100401": "menapa–kawula", "1802100402": "dhumateng–manungsa", "1802100403": "sesambat–kawula", "1802100404": "lan–menawi–", "1802100405": "kénging–menapa", "1802100406": "mboten–", "1802100407": "dados–ciyut", "1802100408": "roh–kawula",
    "1802100501": "nolèha–", "1802100502": "dhumateng–kawula", "1802100503": "lan–nggumuna", "1802100504": "lan–selehna", "1802100505": "asta", "1802100506": "ing–nginggil–", "1802100507": "tutuk",
    "1802100601": "lan–menawi–", "1802100602": "kawula–émut", "1802100603": "lan–kawula–kaget", "1802100604": "lan–nyepeng", "1802100605": "daging–kawula", "1802100606": "geter",
    "1802100701": "kénging–menapa", "1802100702": "tiyang–duraka", "1802100703": "gesang", "1802100704": "dados–sepuh", "1802100705": "ugi–", "1802100706": "dados–kuwat", "1802100707": "kakiyatan",
    "1802100801": "wiji–nipun", "1802100802": "cumawis", "1802100803": "ing–ngajeng–ipun", "1802100804": "sesarengan–piyambakipun", "1802100805": "lan–turun–ipun", "1802100806": "ing–paningal–ipun",
    "1802100901": "griya–nipun", "1802100902": "tentrem", "1802100903": "saking–ajrih", "1802100904": "lan–mboten", "1802100905": "teken", "1802100906": "Gusti Allah", "1802100907": "ing–nginggil–ipun",
    "1802101001": "lembu–jaler–ipun", "1802101002": "ngandhut", "1802101003": "lan–mboten", "1802101004": "gagal", "1802101005": "lair", "1802101006": "lembu–èstri–nipun", "1802101007": "lan–mboten", "1802101008": "kluron",
    "1802101101": "piyambakipun–ngirim", "1802101102": "kados–menda", "1802101103": "laré–alit–ipun", "1802101104": "lan–putra–putranipun", "1802101105": "jogèd",
    "1802101201": "piyambakipun–ngangkat", "1802101202": "rebab", "1802101203": "lan–kecapi", "1802101204": "lan–piyambakipun–bingah", "1802101205": "dhumateng–swanten", "1802101206": "suling",
    "1802101301": "[piyambakipun–nglampahi]", "1802101302": "(piyambakipun–ngentèkaken)", "1802101303": "ing–kasaénan", "1802101304": "dinten–ipun", "1802101305": "lan–ing–sedhela", "1802101306": "alam–kubur", "1802101307": "piyambakipun–tumurun",
    "1802101401": "lan–piyambakipun–ngendika", "1802101402": "dhumateng–Gusti Allah", "1802101403": "késaha", "1802101404": "saking–kita", "1802101405": "lan–pangertosan", "1802101406": "margi–margi–Panjenengan", "1802101407": "mboten", "1802101408": "kita–kepéngin",
    "1802101501": "menapa–", "1802101502": "Kang Mahakuwasa", "1802101503": "bilih–", "1802101504": "kita–ngabdi–Panjenenganipun", "1802101505": "lan–menapa–", "1802101506": "kita–nampi–bathi", "1802101507": "bilih", "1802101508": "kita–nyuwun–", "1802101509": "Panjenenganipun",
    "1802101601": "sapunika", "1802101602": "mboten", "1802101603": "ing–asta–nipun", "1802101604": "kasaénan–ipun", "1802101605": "rancangan", "1802101606": "tiyang–duraka", "1802101607": "tebih", "1802101608": "saking–kawula",
    "1802101701": "pinten–", "1802101702": "dilah–", "1802101703": "tiyang–duraka", "1802101704": "dipunpejahaken", "1802101705": "lan–rawuh", "1802101706": "ing–nginggil–ipun", "1802101707": "bilai–ipun", "1802101708": "kasangsaran", "1802101709": "dipundum", "1802101710": "ing–bebendu–Ipun",
    "1802101801": "dados", "1802101802": "kados–dami", "1802101803": "ing–ngajeng–", "1802101804": "angin", "1802101805": "lan–kados–sekam", "1802101806": "dipuncolong", "1802101807": "angin–prahara",
    "1802101901": "Gusti Allah", "1802101902": "nyimpen–", "1802101903": "kanggé–putra–putranipun", "1802101904": "kakiyatanipun", "1802101905": "dipunwales", "1802101906": "dhumateng–piyambakipun", "1802101907": "lan–piyambakipun–ngertos",
    "1802102001": "ningali", "1802102002": "[mripat–ipun]", "1802102003": "(mripat–ipun)", "1802102004": "karisakan–ipun", "1802102005": "lan–saking–bebendu", "1802102006": "Kang Mahakuwasa", "1802102007": "piyambakipun–ngunjuk",
    "1802102101": "amargi", "1802102102": "menapa–", "1802102103": "kepénginan–ipun", "1802102104": "ing–griya–nipun", "1802102105": "sasampunipun", "1802102106": "lan–cacah", "1802102107": "wulan–wulanipun", "1802102108": "dipunpedhot",
    "1802102201": "dhumateng–Gusti Allah", "1802102202": "ngajari–", "1802102203": "kawruh", "1802102204": "lan–Panjenenganipun", "1802102205": "ingkang–luhur", "1802102206": "ngadili",
    "1802102301": "punika", "1802102302": "pejah", "1802102303": "ing–kawaregan", "1802102304": "kasampurnan–ipun", "1802102305": "sedayanipun", "1802102306": "tentrem", "1802102307": "lan–ayem",
    "1802102401": "ember–ipun", "1802102402": "kebak", "1802102403": "susu", "1802102404": "lan–sungsum", "1802102405": "balung–balungipun", "1802102406": "teles",
    "1802102501": "lan–punika", "1802102502": "pejah", "1802102503": "ing–nyawa", "1802102504": "pait", "1802102505": "lan–mboten–", "1802102506": "nedha", "1802102507": "ing–kasaénan",
    "1802102601": "sesarengan", "1802102602": "ing–nginggil–", "1802102603": "lebu", "1802102604": "piyambakipun–sarèn", "1802102605": "lan–cacing", "1802102606": "nutup", "1802102607": "ing–nginggil–ipun",
    "1802102701": "sapunika", "1802102702": "kawula–ngertos", "1802102703": "pikiran–panjenengan", "1802102704": "lan–rancangan", "1802102705": "ing–nginggil–kawula", "1802102706": "panjenengan–nganiaya",
    "1802102801": "amargi", "1802102802": "panjenengan–ngendika", "1802102803": "wonten–pundi", "1802102804": "griya–", "1802102805": "pangeran", "1802102806": "lan–wonten–pundi", "1802102807": "tarub", "1802102808": "papan–dedalem", "1802102809": "tiyang–duraka",
    "1802102901": "menapa–mboten", "1802102902": "panjenengan–taken", "1802102903": "tiyang–langkung", "1802102904": "margi", "1802102905": "lan–tandha–tandhanipun", "1802102906": "mboten", "1802102907": "panjenengan–ngakeni",
    "1802103001": "bilih", "1802103002": "kanggé–dinten", "1802103003": "bilai", "1802103004": "dipunsimpen", "1802103005": "awon", "1802103006": "kanggé–dinten", "1802103007": "bebendu", "1802103008": "piyambakipun–dipunbeta",
    "1802103101": "sinten–", "1802103102": "nedahaken", "1802103103": "ing–nginggil–", "1802103104": "praupanipun", "1802103105": "margininpun", "1802103106": "lan–piyambakipun–", "1802103107": "nindakaken", "1802103108": "sinten", "1802103109": "males–", "1802103110": "piyambakipun",
    "1802103201": "lan–piyambakipun", "1802103202": "dhumateng–kubur", "1802103203": "dipunbeta", "1802103204": "lan–ing–nginggil–", "1802103205": "tumpukan", "1802103206": "piyambakipun–jagi",
    "1802103301": "manis–", "1802103302": "kanggé–piyambakipun", "1802103303": "gumpal–gumpal", "1802103304": "lembah", "1802103305": "lan–sasampunipun", "1802103306": "sedaya–", "1802103307": "manungsa", "1802103308": "nututi", "1802103309": "lan–ing–ngajeng–ipun", "1802103310": "mboten–wonten", "1802103311": "cacah",
    "1802103401": "lan–kados–pundi", "1802103402": "panjenengan–nglipur–kawula", "1802103403": "tanpa–guna", "1802103404": "lan–wangsulan–panjenengan", "1802103405": "sisih–", "1802103406": "pelanggaran", "1802103407": "s"
  },
  22: {
    "1802200101": "lan–mangsuli", "1802200102": "Elifas", "1802200103": "tiyang–Téman", "1802200104": "lan–ngendika",
    "1802200201": "dhumateng–Gusti Allah", "1802200202": "mbiyantu–", "1802200203": "tiyang", "1802200204": "bilih–", "1802200205": "mbiyantu", "1802200206": "ing–nginggil–piyambakipun", "1802200207": "tiyang–wicaksana",
    "1802200301": "menapa–pepénginan", "1802200302": "kanggé–Kang Mahakuwasa", "1802200303": "bilih", "1802200304": "panjenengan–leres", "1802200305": "lan–menawi–", "1802200306": "bathi", "1802200307": "bilih–", "1802200308": "panjenengan–sampurna", "1802200309": "margi–margi–panjenengan",
    "1802200401": "menapa–saking–ajrih–panjenengan", "1802200402": "Panjenenganipun–ngukum–panjenengan", "1802200403": "Panjenenganipun–rawuh", "1802200404": "kaliyan–panjenengan", "1802200405": "ing–pangadilan",
    "1802200501": "menapa–mboten", "1802200502": "piawon–panjenengan", "1802200503": "ageng", "1802200504": "lan–mboten–wonten–", "1802200505": "pungkasan", "1802200506": "dhumateng–dosa–panjenengan",
    "1802200601": "amargi–", "1802200602": "panjenengan–nampi–gadé", "1802200603": "sedhèrèk–panjenengan", "1802200604": "tanpa–alesan", "1802200605": "lan–sandhangan", "1802200606": "tiyang–wuda", "1802200607": "panjenengan–copot",
    "1802200701": "mboten–", "1802200702": "toya", "1802200703": "tiyang–sayah", "1802200704": "panjenengan–paring–ngunjuk", "1802200705": "lan–saking–tiyang–keluwen", "1802200706": "panjenengan–nahan–", "1802200707": "roti",
    "1802200801": "lan–tiyang", "1802200802": "kuwat", "1802200803": "kanggé–piyambakipun", "1802200804": "bumi", "1802200805": "lan–tiyang–kinurmatan", "1802200806": "praupan", "1802200807": "manggèn", "1802200808": "ing–piyambakipun",
    "1802200901": "randha", "1802200902": "panjenengan–kirim", "1802200903": "kosong", "1802200904": "lan–lengen", "1802200905": "bocah–yatim", "1802200906": "dipunremuk",
    "1802201001": "pramila–", "1802201002": "punika", "1802201003": "sakubeng–panjenengan", "1802201004": "jebakan", "1802201005": "lan–ngagetaken–panjenengan", "1802201006": "ajrih", "1802201007": "dadakan",
    "1802201101": "utawi–", "1802201102": "pepeteng", "1802201103": "mboten–", "1802201104": "panjenengan–ningali", "1802201105": "lan–tumuruning–", "1802201106": "toya", "1802201107": "nutup–panjenengan",
    "1802201201": "menapa–mboten–", "1802201202": "Gusti Allah", "1802201203": "inggil", "1802201204": "langit", "1802201205": "lan–ningalia", "1802201206": "pucuk", "1802201207": "lintang-lintang", "1802201208": "bilih–", "1802201209": "luhur",
    "1802201301": "lan–panjenengan–ngendika", "1802201302": "menapa–", "1802201303": "ngertos", "1802201304": "Gusti Allah", "1802201305": "menapa–liwat", "1802201306": "pepeteng", "1802201307": "Panjenenganipun–ngadili",
    "1802201401": "méga", "1802201402": "panutup–", "1802201403": "kanggé–Panjenenganipun", "1802201404": "lan–mboten", "1802201405": "Panjenenganipun–ningali", "1802201406": "lan–bunderan", "1802201407": "langit", "1802201408": "Panjenenganipun–mlampah",
    "1802201501": "menapa–margi", "1802201502": "kina", "1802201503": "panjenengan–jagi", "1802201504": "ingkang", "1802201505": "dipunlampahi", "1802201506": "tiyang–", "1802201507": "duraka",
    "1802201601": "ingkang–", "1802201602": "dipunkerut", "1802201603": "lan–mboten–", "1802201604": "wekdal", "1802201605": "lèpèn", "1802201606": "dipunsuntak", "1802201607": "dhasaripun",
    "1802201701": "ingkang–ngendika", "1802201702": "dhumateng–Gusti Allah", "1802201703": "késaha", "1802201704": "saking–kita", "1802201705": "lan–menapa–", "1802201706": "nindakaken", "1802201707": "Kang Mahakuwasa", "1802201708": "dhumateng–piyambakipun",
    "1802201801": "lan–Panjenenganipun", "1802201802": "ngisi", "1802201803": "griya–nipun", "1802201804": "kasaénan", "1802201805": "lan–rancangan", "1802201806": "tiyang–duraka", "1802201807": "tebih", "1802201808": "saking–kawula",
    "1802201901": "ningali", "1802201902": "tiyang–leres", "1802201903": "lan–bingah", "1802201904": "lan–tiyang–resik", "1802201905": "moyoki–", "1802201906": "piyambakipun",
    "1802202001": "menawi–", "1802202002": "mboten", "1802202003": "dipunsirnakaken", "1802202004": "mengsah–kita", "1802202005": "lan–sisih–ipun", "1802202006": "nedha", "1802202007": "latu",
    "1802202101": "tepanga–", "1802202102": "mugi", "1802202103": "kaliyan–Panjenenganipun", "1802202104": "lan–tentrem", "1802202105": "ing–piyambakipun", "1802202106": "rawuh–panjenengan", "1802202107": "kasaénan",
    "1802202201": "tampiya–", "1802202202": "mugi", "1802202203": "saking–tutuk–Ipun", "1802202204": "piwulang", "1802202205": "lan–selehna", "1802202206": "pangandikan–Ipun", "1802202207": "ing–manah–panjenengan",
    "1802202301": "menawi–", "1802202302": "panjenengan–wangsul", "1802202303": "dhumateng–", "1802202304": "Kang Mahakuwasa", "1802202305": "panjenengan–dipunbangun", "1802202306": "panjenengan–tebihaken", "1802202307": "duraka", "1802202308": "saking–tarub–panjenengan",
    "1802202401": "lan–selehna–", "1802202402": "ing–nginggil–", "1802202403": "lebu", "1802202404": "emas", "1802202405": "lan–ing–séla", "1802202406": "kali-kali", "1802202407": "Ofir",
    "1802202501": "lan–dados", "1802202502": "Kang Mahakuwasa", "1802202503": "emas–panjenengan", "1802202504": "lan–selaka", "1802202505": "luhur", "1802202506": "kanggé–panjenengan",
    "1802202601": "amargi–", "1802202602": "lajeng", "1802202603": "ing–nginggil–", "1802202604": "Kang Mahakuwasa", "1802202605": "panjenengan–seneng", "1802202606": "lan–panjenengan–ngangkat", "1802202607": "dhumateng–", "1802202608": "Gusti Allah", "1802202609": "praupan–panjenengan",
    "1802202701": "panjenengan–ndedonga", "1802202702": "dhumateng–Panjenenganipun", "1802202703": "lan–Panjenenganipun–mireng–panjenengan", "1802202704": "lan–kaul–panjenengan", "1802202705": "panjenengan–bayar",
    "1802202801": "lan–panjenengan–mutusaken–", "1802202802": "tembung", "1802202803": "lan–dados–tetep", "1802202804": "kanggé–panjenengan", "1802202805": "lan–ing–nginggil–", "1802202806": "margi–margi–panjenengan", "1802202807": "sumunar", "1802202808": "pepadhang",
    "1802202901": "amargi–", "1802202902": "piyambakipun–ngandhapaken", "1802202903": "lan–panjenengan–ngendika", "1802202904": "kamenangan", "1802202905": "lan–ingkang–andhap", "1802202906": "mripat", "1802202907": "Panjenenganipun–nylametaken",
    "1802203001": "Panjenenganipun–ngluwari", "1802203002": "tiyang–mboten–", "1802203003": "resik", "1802203004": "lan–dipunluwari", "1802203005": "ing–karesikan", "1802203006": "asta–panjenengan", "1802203007": "p"
  },
  23: {
    "1802300101": "lan–mangsuli", "1802300102": "Ayub", "1802300103": "lan–ngendika",
    "1802300201": "ugi–", "1802300202": "dinten–punika", "1802300203": "pemberontak", "1802300204": "sesambat–kawula", "1802300205": "asta–kawula", "1802300206": "awrat", "1802300207": "ing–nginggil–", "1802300208": "keluh–kawula",
    "1802300301": "sinten–", "1802300302": "maringi", "1802300303": "kawula–ngertos", "1802300304": "lan–kawula–manggihaken–Panjenenganipun", "1802300305": "kawula–rawuh", "1802300306": "dumugi–", "1802300307": "dhampar–Ipun",
    "1802300401": "kawula–nyusun", "1802300402": "ing–ngajeng–Ipun", "1802300403": "pangadilan", "1802300404": "lan–tutuk–kawula", "1802300405": "kawula–isi", "1802300406": "alesan",
    "1802300501": "kawula–badhe–ngertos", "1802300502": "tembung-tembung", "1802300503": "Panjenenganipun–mangsuli–kawula", "1802300504": "lan–kawula–badhe–mangertosi", "1802300505": "menapa–", "1802300506": "Panjenenganipun–ngendika", "1802300507": "dhumateng–kawula",
    "1802300601": "menapa–ing–ageng–", "1802300602": "kakiyatan", "1802300603": "Panjenenganipun–perang", "1802300604": "kaliyan–kawula", "1802300605": "mboten", "1802300606": "namung–", "1802300607": "Panjenenganipun", "1802300608": "maringi", "1802300609": "ing–kawula",
    "1802300701": "wonten–mriku", "1802300702": "tiyang–leres", "1802300703": "mbantah", "1802300704": "kaliyan–Panjenenganipun", "1802300705": "lan–kawula–luwar", "1802300706": "kanggé–salaminipun", "1802300707": "saking–hakim–kawula",
    "1802300801": "sapunika", "1802300802": "wétan", "1802300803": "kawula–kesah", "1802300804": "lan–mboten–wonten–Panjenenganipun", "1802300805": "lan–kilèn", "1802300806": "lan–mboten–", "1802300807": "kawula–mangertosi", "1802300808": "Panjenenganipun",
    "1802300901": "kiwa", "1802300902": "ing–padamelan–Ipun", "1802300903": "lan–mboten–", "1802300904": "kawula–nyepeng", "1802300905": "Panjenenganipun–malik", "1802300906": "tengen", "1802300907": "lan–mboten", "1802300908": "kawula–ningali",
    "1802301001": "amargi–", "1802301002": "Panjenenganipun–ngertos", "1802301003": "margi", "1802301004": "kaliyan–kawula", "1802301005": "Panjenenganipun–nguji–kawula", "1802301006": "kados–emas", "1802301007": "kawula–medal",
    "1802301101": "ing–jangkah–Ipun", "1802301102": "nyepeng", "1802301103": "suku–kawula", "1802301104": "margi–Ipun", "1802301105": "kawula–jagi", "1802301106": "lan–mboten–", "1802301107": "kawula–mlèncèng",
    "1802301201": "dhawuh", "1802301202": "lathi–Ipun", "1802301203": "lan–mboten", "1802301204": "kawula–ninggal", "1802301205": "saking–prenatan–kawula", "1802301206": "kawula–simpen", "1802301207": "pangandikan–", "1802301208": "tutuk–Ipun",
    "1802301301": "lan–Panjenenganipun", "1802301302": "ing–satunggal", "1802301303": "lan–sinten", "1802301304": "mbalèkaken–Panjenenganipun", "1802301305": "lan–nyawa–Ipun", "1802301306": "kepéngin", "1802301307": "lan–Panjenenganipun–nindakaken",
    "1802301401": "amargi", "1802301402": "Panjenenganipun–nyampurnakaken", "1802301403": "prenatan–kawula", "1802301404": "lan–kados–punika", "1802301405": "kathah", "1802301406": "kaliyan–Panjenenganipun",
    "1802301501": "pramila–", "1802301502": "punika", "1802301503": "saking–praupan–Ipun", "1802301504": "kawula–ajrih", "1802301505": "kawula–mangertosi", "1802301506": "lan–kawula–wedi", "1802301507": "saking–Panjenenganipun",
    "1802301601": "lan–Gusti Allah", "1802301602": "nglunakaken", "1802301603": "manah–kawula", "1802301604": "lan–Kang Mahakuwasa", "1802301605": "ngagetaken–kawula",
    "1802301701": "amargi–", "1802301702": "mboten", "1802301703": "kawula–dipunsirnakaken", "1802301704": "saking–praupan–", "1802301705": "pepeteng", "1802301706": "lan–saking–praupan–kawula", "1802301707": "nutup–", "1802301708": "peteng"
  },
  24: {
    "1802400101": "kénging–menapa", "1802400102": "saking–Kang Mahakuwasa", "1802400103": "mboten–", "1802400104": "dipunsimpen", "1802400105": "wekdal-wekdal", "1802400106": "[lan–ingkang–tepang]", "1802400107": "(lan–ingkang–tepang)", "1802400108": "mboten–", "1802400109": "ningali", "1802400110": "dinten–dintenipun",
    "1802400201": "wates-wates", "1802400202": "piyambakipun–mindhah", "1802400203": "pepanthan", "1802400204": "piyambakipun–ngrampas", "1802400205": "lan–piyambakipun–ngengon",
    "1802400301": "kuldi", "1802400302": "bocah–yatim", "1802400303": "piyambakipun–nuntun", "1802400304": "piyambakipun–nyepeng–gadé", "1802400305": "lembu", "1802400306": "randha",
    "1802400401": "piyambakipun–nyurung", "1802400402": "tiyang–mlarat", "1802400403": "saking–margi", "1802400404": "sesarengan", "1802400405": "ndhelik", "1802400406": "tiyang–sangsara–", "1802400407": "bumi",
    "1802400501": "sapunika", "1802400502": "kuldi–liar", "1802400503": "ing–ara-ara–samun", "1802400504": "piyambakipun–medal", "1802400505": "ing–padamelan–ipun", "1802400506": "madosi", "1802400507": "kanggé–mangsan", "1802400508": "padang–samun", "1802400509": "kanggé–piyambakipun", "1802400510": "roti", "1802400511": "kanggé–laré-laré",
    "1802400601": "ing–pategalan", "1802400602": "pakan–ipun", "1802400603": "[piyambakipun–manèn]", "1802400604": "(piyambakipun–manèn)", "1802400605": "lan–kebon–anggur", "1802400606": "tiyang–duraka", "1802400607": "piyambakipun–ngudhaki",
    "1802400701": "wuda", "1802400702": "piyambakipun–sarèn", "1802400703": "tanpa", "1802400704": "sandhangan", "1802400705": "lan–mboten–wonten", "1802400706": "kemul", "1802400707": "ing–asrep",
    "1802400801": "saking–udan", "1802400802": "redi", "1802400803": "piyambakipun–teles", "1802400804": "lan–tanpa", "1802400805": "papan–perlindungan", "1802400806": "piyambakipun–ngerangkul–", "1802400807": "séla",
    "1802400901": "piyambakipun–ngrampas", "1802400902": "saking–susu", "1802400903": "bocah–yatim", "1802400904": "lan–ing–nginggil–", "1802400905": "tiyang–mlarat", "1802400906": "piyambakipun–nyepeng–gadé",
    "1802401001": "wuda", "1802401002": "piyambakipun–mlampah", "1802401003": "tanpa", "1802401004": "sandhangan", "1802401005": "lan–keluwen", "1802401006": "piyambakipun–mbeta", "1802401007": "gandum",
    "1802401101": "ing–antawis–", "1802401102": "baris–baris–ipun", "1802401103": "piyambakipun–meres–lenga", "1802401104": "pameresan–anggur", "1802401105": "piyambakipun–ngidhak", "1802401106": "lan–piyambakipun–ngelak",
    "1802401201": "saking–kutha", "1802401202": "tiyang–pejah", "1802401203": "sesambat", "1802401204": "lan–nyawa–", "1802401205": "tiyang–tatu", "1802401206": "celuk–tulung", "1802401207": "lan–Gusti Allah", "1802401208": "mboten–", "1802401209": "nganggep", "1802401210": "bodho",
    "1802401301": "piyambakipun", "1802401302": "dados", "1802401303": "ing–pemberontak–", "1802401304": "pepadhang", "1802401305": "mboten–", "1802401306": "piyambakipun–tepang", "1802401307": "margi–margi–Ipun", "1802401308": "lan–mboten", "1802401309": "piyambakipun–manggèn", "1802401310": "ing–margi–margi–Ipun",
    "1802401401": "dhumateng–pepadhang", "1802401402": "tangi", "1802401403": "tukang–mejahi", "1802401404": "piyambakipun–mejahi–", "1802401405": "tiyang–mlarat", "1802401406": "lan–tiyang–mlarat", "1802401407": "lan–ing–dalu", "1802401408": "dados", "1802401409": "kados–maling",
    "1802401501": "lan–mripat", "1802401502": "tukang–laku–jina", "1802401503": "njagi", "1802401504": "senja", "1802401505": "ngendika", "1802401506": "mboten–", "1802401507": "ningali–kawula", "1802401508": "mripat", "1802401509": "lan–panutup", "1802401510": "praupan", "1802401511": "piyambakipun–selehaken",
    "1802401601": "njebol", "1802401602": "ing–pepeteng", "1802401603": "griya-griya", "1802401604": "ing–rina", "1802401605": "piyambakipun–nutup–", "1802401606": "kanggé–piyambakipun", "1802401607": "mboten–", "1802401608": "piyambakipun–tepang", "1802401609": "pepadhang",
    "1802401701": "amargi", "1802401702": "sesarengan", "1802401703": "énjing", "1802401704": "kanggé–piyambakipun", "1802401705": "wewayangan–pejah", "1802401706": "amargi–", "1802401707": "piyambakipun–tepang", "1802401708": "mawon–ajrih", "1802401709": "wewayangan–pejah",
    "1802401801": "énthèng–", "1802401802": "piyambakipun", "1802401803": "ing–nginggil–", "1802401804": "praupan–", "1802401805": "toya", "1802401806": "dipunsumpahi", "1802401807": "panduman–ipun", "1802401808": "ing–bumi", "1802401809": "mboten–", "1802401810": "piyambakipun–malik", "1802401811": "margi", "1802401812": "kebon–anggur",
    "1802401901": "kering", "1802401902": "ugi–", "1802401903": "panas", "1802401904": "piyambakipun–ngrampas", "1802401905": "toya–", "1802401906": "salju", "1802401907": "alam–kubur", "1802401908": "dosa",
    "1802402001": "piyambakipun–kesupen", "1802402002": "rahim", "1802402003": "manis–kanggé–piyambakipun", "1802402004": "cacing", "1802402005": "malih", "1802402006": "mboten–", "1802402007": "dipunéling", "1802402008": "lan–dipunpugut", "1802402009": "kados–wit", "1802402010": "duraka",
    "1802402101": "ngengon", "1802402102": "tiyang–gabug", "1802402103": "mboten", "1802402104": "lair", "1802402105": "lan–randha", "1802402106": "mboten", "1802402107": "piyambakipun–nindakaken–saé",
    "1802402201": "lan–narik", "1802402202": "tiyang–kuwat", "1802402203": "kaliyan–kakiyatan–Ipun", "1802402204": "piyambakipun–tangi", "1802402205": "lan–mboten–", "1802402206": "piyambakipun–pitados", "1802402207": "ing–pagesangan",
    "1802402301": "Panjenenganipun–maringi–", "1802402302": "piyambakipun", "1802402303": "kanggé–aman", "1802402304": "lan–piyambakipun–sandharan", "1802402305": "lan–mripat–Ipun", "1802402306": "ing–nginggil–", "1802402307": "margi–margi–ipun",
    "1802402401": "piyambakipun–dipunangkat", "1802402402": "sedhela", "1802402403": "lan–mboten–wonten–piyambakipun", "1802402404": "lan–piyambakipun–dipunandhapaken", "1802402405": "kados–sedaya", "1802402406": "piyambakipun–dipunkempalaken", "1802402407": "lan–kados–pucuk", "1802402408": "gandum", "1802402409": "piyambakipun–dipunpedhot",
    "1802402501": "lan–menawi–", "1802402502": "mboten", "1802402503": "lajeng", "1802402504": "sinten", "1802402505": "mbuktèkaken–kawula–goroh", "1802402506": "lan–nggadhahi", "1802402507": "dhumateng–tanpa–guna", "1802402508": "tembung–kawula", "1802402509": "s"
  },
  25: {
    "1802500101": "lan–mangsuli", "1802500102": "Bildad", "1802500103": "tiyang–Suah", "1802500104": "lan–ngendika",
    "1802500201": "pamaréntahan", "1802500202": "lan–ajrih", "1802500203": "kaliyan–Panjenenganipun", "1802500204": "ingkang–damel", "1802500205": "tentrem", "1802500206": "ing–papan–luhur–Ipun",
    "1802500301": "menapa–wonten", "1802500302": "cacah", "1802500303": "dhumateng–wadya–bala–Ipun", "1802500304": "lan–ing–nginggil–", "1802500305": "sinten", "1802500306": "mboten–", "1802500307": "tangi", "1802500308": "pepadhang–Ipun",
    "1802500401": "lan–kados–pundi–", "1802500402": "dados–leres", "1802500403": "manungsa", "1802500404": "kaliyan–", "1802500405": "Gusti Allah", "1802500406": "lan–kados–pundi–", "1802500407": "dados–resik", "1802500408": "tiyang–lair", "1802500409": "èstri",
    "1802500501": "sapunika", "1802500502": "ngantos–", "1802500503": "rembulan", "1802500504": "lan–mboten", "1802500505": "sumunar", "1802500506": "lan–lintang-lintang", "1802500507": "mboten–", "1802500508": "resik", "1802500509": "ing–paningal–Ipun",
    "1802500601": "langkung–langkung", "1802500602": "bilih–", "1802500603": "manungsa", "1802500604": "cacing", "1802500605": "lan–putra–", "1802500606": "manungsa", "1802500607": "uler", "1802500608": "p"
  },
  26: {
    "1802600101": "lan–mangsuli", "1802600102": "Ayub", "1802600103": "lan–ngendika",
    "1802600201": "kados–pundi–", "1802600202": "panjenengan–mbiyantu", "1802600203": "ingkang–mboten–wonten–", "1802600204": "kakiyatan", "1802600205": "panjenengan–nylametaken", "1802600206": "lengen", "1802600207": "mboten–", "1802600208": "kuwat",
    "1802600301": "kados–pundi–", "1802600302": "panjenengan–maringi–nasehat", "1802600303": "ingkang–mboten–wonten", "1802600304": "kawicaksanan", "1802600305": "lan–kawruh–saèstu", "1802600306": "kathah", "1802600307": "panjenengan–nyatakaken",
    "1802600401": "dhumateng–", "1802600402": "sinten", "1802600403": "panjenengan–ngandika", "1802600404": "tembung-tembung", "1802600405": "lan–napas–", "1802600406": "sinten", "1802600407": "medal", "1802600408": "saking–panjenengan",
    "1802600501": "roh–pejah", "1802600502": "geter", "1802600503": "saking–ngandhap", "1802600504": "toya", "1802600505": "lan–ingkang–manggèn–ing–piyambakipun",
    "1802600601": "wuda", "1802600602": "alam–kubur", "1802600603": "ing–ngajeng–Ipun", "1802600604": "lan–mboten–wonten", "1802600605": "kemul", "1802600606": "kanggé–karisakan",
    "1802600701": "nggantung", "1802600702": "lor", "1802600703": "ing–nginggil–", "1802600704": "kothong", "1802600705": "nggantung", "1802600706": "bumi", "1802600707": "ing–nginggil–", "1802600708": "tanpa–", "1802600709": "menapa",
    "1802600801": "ngiket–", "1802600802": "toya", "1802600803": "ing–méga–Ipun", "1802600804": "lan–mboten–", "1802600805": "dipunbedhah", "1802600806": "méga", "1802600807": "ing–ngandhap–ipun",
    "1802600901": "nutupi", "1802600902": "praupan–", "1802600903": "dhampar–Ipun", "1802600904": "nggèlèraken", "1802600905": "ing–nginggil–piyambakipun", "1802600906": "méga–Ipun",
    "1802601001": "wates–", "1802601002": "dipunaris", "1802601003": "ing–nginggil–", "1802601004": "praupan–", "1802601005": "toya", "1802601006": "ngantos–", "1802601007": "pungkasan", "1802601008": "pepadhang", "1802601009": "kaliyan–", "1802601010": "pepeteng",
    "1802601101": "pilar-pilar", "1802601102": "langit", "1802601103": "geter", "1802601104": "lan–nggumunaken", "1802601105": "saking–penthung–Ipun",
    "1802601201": "kaliyan–kakiyatan–Ipun", "1802601202": "nggalih", "1802601203": "saganten", "1802601204": "[lan–kaliyan–pangertosan–Ipun]", "1802601205": "(lan–kaliyan–pangertosan–Ipun)", "1802601206": "ngremuk", "1802601207": "Rahab",
    "1802601301": "kaliyan–napas–Ipun", "1802601302": "langit", "1802601303": "padhang", "1802601304": "nyekel", "1802601305": "asta–Ipun", "1802601306": "ula", "1802601307": "mlayu",
    "1802601401": "sapunika–", "1802601402": "punika", "1802601403": "pungkasan", "1802601404": "[margi–margi–Ipun]", "1802601405": "(margi–margi–Ipun)", "1802601406": "lan–menapa–", "1802601407": "bisikan", "1802601408": "prakawis", "1802601409": "dipunmireng–", "1802601410": "ing–piyambakipun", "1802601411": "lan–gludhug", "1802601412": "[kakiyatan–Ipun]", "1802601413": "(kakiyatan–Ipun)", "1802601414": "sinten", "1802601415": "mangertosi", "1802601416": "s"
  },
  27: {
    "1802700101": "lan–nambahi", "1802700102": "Ayub", "1802700103": "ngangkat", "1802700104": "pasemon–ipun", "1802700105": "lan–ngendika",
    "1802700201": "gesang–", "1802700202": "Gusti Allah", "1802700203": "ingkang–ngilangi", "1802700204": "pangadilan–kawula", "1802700205": "lan–Kang Mahakuwasa", "1802700206": "ingkang–ndamel–pait", "1802700207": "nyawa–kawula",
    "1802700301": "amargi–", "1802700302": "sedaya–", "1802700303": "taksih", "1802700304": "napas–kawula", "1802700305": "ing–kawula", "1802700306": "lan–roh", "1802700307": "Gusti Allah", "1802700308": "ing–irung–kawula",
    "1802700401": "menawi–", "1802700402": "ngendika", "1802700403": "lathi–kawula", "1802700404": "duraka", "1802700405": "lan–ilat–kawula", "1802700406": "menawi–", "1802700407": "ngucap", "1802700408": "goroh",
    "1802700501": "mboten–babar–pisan", "1802700502": "kanggé–kawula", "1802700503": "menawi–", "1802700504": "kawula–mbeneraken", "1802700505": "panjenengan", "1802700506": "ngantos–", "1802700507": "kawula–pejah", "1802700508": "mboten–", "1802700509": "kawula–nyopot", "1802700510": "katemenan–kawula", "1802700511": "saking–kawula",
    "1802700601": "ing–kabeneran–kawula", "1802700602": "kawula–nyepeng", "1802700603": "lan–mboten", "1802700604": "kawula–nilar", "1802700605": "mboten–", "1802700606": "nyela", "1802700607": "manah–kawula", "1802700608": "saking–dinten–kawula",
    "1802700701": "dados–", "1802700702": "kados–tiyang–duraka", "1802700703": "mengsah–kawula", "1802700704": "lan–ingkang–nglawan–kawula", "1802700705": "kados–tiyang–mboten–leres",
    "1802700801": "amargi", "1802700802": "menapa–", "1802700803": "pangajeng-ajeng", "1802700804": "tiyang–munafik", "1802700805": "amargi", "1802700806": "piyambakipun–nampi–bathi", "1802700807": "amargi", "1802700808": "nyabut", "1802700809": "Gusti Allah", "1802700810": "nyawanipun",
    "1802700901": "menapa–sesambat–ipun", "1802700902": "dipunmireng", "1802700903": "Gusti Allah", "1802700904": "amargi–", "1802700905": "rawuh", "1802700906": "ing–nginggil–ipun", "1802700907": "kasangsaran",
    "1802701001": "menapa–ing–nginggil–", "1802701002": "Kang Mahakuwasa", "1802701003": "piyambakipun–seneng", "1802701004": "piyambakipun–nyebut", "1802701005": "Gusti Allah", "1802701006": "ing–sedaya–", "1802701007": "wekdal",
    "1802701101": "kawula–mulang", "1802701102": "panjenengan", "1802701103": "kaliyan–asta–", "1802701104": "Gusti Allah", "1802701105": "ingkang", "1802701106": "kaliyan–", "1802701107": "Kang Mahakuwasa", "1802701108": "mboten", "1802701109": "kawula–ndhelikaken",
    "1802701201": "sapunika–", "1802701202": "panjenengan", "1802701203": "sedaya", "1802701204": "panjenengan–ningali", "1802701205": "lan–kénging–menapa–", "1802701206": "punika", "1802701207": "tanpa–guna", "1802701208": "panjenengan–mboten–guna",
    "1802701301": "punika", "1802701302": "panduman–", "1802701303": "manungsa", "1802701304": "duraka", "1802701305": "kaliyan–", "1802701306": "Gusti Allah"
  },
  28: {
    "1802800101": "amargi", "1802800102": "wonten", "1802800103": "kanggé–selaka", "1802800104": "sumber", "1802800105": "lan–papan", "1802800106": "kanggé–emas", "1802800107": "piyambakipun–nyaring",
    "1802800201": "wesi", "1802800202": "saking–lebu", "1802800203": "dipunpendhet", "1802800204": "lan–séla", "1802800205": "dipuncor", "1802800206": "tembaga",
    "1802800301": "pungkasan", "1802800302": "dipunselehaken", "1802800303": "kanggé–pepeteng", "1802800304": "lan–dhumateng–sedaya–", "1802800305": "pungkasan", "1802800306": "piyambakipun", "1802800307": "madosi", "1802800308": "séla", "1802800309": "peteng", "1802800310": "lan–wewayangan–pejah",
    "1802800401": "nyedhaki", "1802800402": "kali", "1802800403": "saking–kaliyan–", "1802800404": "tiyang–manca", "1802800405": "ingkang–dipunlalèkaken", "1802800406": "saking–", "1802800407": "suku", "1802800408": "dipunandhapaken", "1802800409": "saking–manungsa", "1802800410": "goyah",
    "1802800501": "bumi", "1802800502": "saking–piyambakipun", "1802800503": "medal–", "1802800504": "roti", "1802800505": "lan–ing–ngandhap–ipun", "1802800506": "dados–owah", "1802800507": "kados–", "1802800508": "latu",
    "1802800601": "papan–", "1802800602": "safir", "1802800603": "séla–nipun", "1802800604": "lan–lebu–", "1802800605": "emas", "1802800606": "kanggé–piyambakipun",
    "1802800701": "margi", "1802800702": "mboten–", "1802800703": "ngertos", "1802800704": "manuk–buwak", "1802800705": "lan–mboten", "1802800706": "ningali", "1802800707": "mripat", "1802800708": "elang",
    "1802800801": "mboten–", "1802800802": "dipunlampahi", "1802800803": "putra–", "1802800804": "singa", "1802800805": "mboten–", "1802800806": "langkung", "1802800807": "ing–nginggil–ipun", "1802800808": "singa",
    "1802800901": "ing–séla–keras", "1802800902": "ngirim", "1802800903": "asta–nipun", "1802800904": "njebol", "1802800905": "saking–oyod", "1802800906": "redi",
    "1802801001": "ing–séla", "1802801002": "kali-kali", "1802801003": "dipunbedhah", "1802801004": "lan–sedaya–", "1802801005": "barang–aji", "1802801006": "ningali", "1802801007": "mripat–ipun",
    "1802801101": "saking–ilèn", "1802801102": "kali-kali", "1802801103": "dipuniket", "1802801104": "lan–ingkang–kasingidaken", "1802801105": "dipunwetokaken", "1802801106": "pepadhang", "1802801107": "p",
    "1802801201": "lan–kawicaksanan", "1802801202": "saking–pundi", "1802801203": "dipunpanggihaken", "1802801204": "lan–pundi", "1802801205": "punika", "1802801206": "papan", "1802801207": "pangertosan",
    "1802801301": "mboten–", "1802801302": "ngertos", "1802801303": "manungsa", "1802801304": "reganipun", "1802801305": "lan–mboten", "1802801306": "dipunpanggihaken", "1802801307": "ing–bumi", "1802801308": "tiyang–gesang",
    "1802801401": "samodra", "1802801402": "ngendika"
  },
  29: {
    "1802900101": "lan–nambahi", "1802900102": "Ayub", "1802900103": "ngangkat", "1802900104": "pasemon–ipun", "1802900105": "lan–ngendika",
    "1802900201": "sinten–", "1802900202": "maringi–kawula", "1802900203": "kados–wulan–wulan–", "1802900204": "kina", "1802900205": "kados–dinten–", "1802900206": "Gusti Allah", "1802900207": "njagi–kawula",
    "1802900301": "nalika–sumunar", "1802900302": "dilahipun", "1802900303": "ing–nginggil–", "1802900304": "mustaka–kawula", "1802900305": "dhumateng–pepadhang–Ipun", "1802900306": "kawula–mlampah", "1802900307": "pepeteng",
    "1802900401": "kados–nalika", "1802900402": "kawula–wonten", "1802900403": "ing–dinten–", "1802900404": "nom–kawula", "1802900405": "ing–wados", "1802900406": "Gusti Allah", "1802900407": "ing–nginggil–", "1802900408": "tarub–kawula",
    "1802900501": "nalika–taksih", "1802900502": "Kang Mahakuwasa", "1802900503": "kaliyan–kawula", "1802900504": "sakubeng–kawula", "1802900505": "nem-neman–kawula",
    "1802900601": "nalika–dipunwijiki", "1802900602": "jangkah–kawula", "1802900603": "kaliyan–krim", "1802900604": "lan–séla", "1802900605": "ngetokaken", "1802900606": "kaliyan–kawula", "1802900607": "ilèn–", "1802900608": "lenga",
    "1802900701": "nalika–kawula–medal", "1802900702": "gapura", "1802900703": "ing–nginggil–", "1802900704": "kutha", "1802900705": "ing–alun-alun", "1802900706": "kawula–nyiapaken", "1802900707": "palenggahan–kawula",
    "1802900801": "ningali–kawula", "1802900802": "nom-noman", "1802900803": "lan–ndhelik", "1802900804": "lan–tiyang–sepuh", "1802900805": "tangi", "1802900806": "jumeneng",
    "1802900901": "para–pangéran", "1802900902": "mandheg", "1802900903": "ing–tembung-tembung", "1802900904": "lan–epèk-epèk", "1802900905": "piyambakipun–selehaken", "1802900906": "dhumateng–tutuk–ipun",
    "1802901001": "swanten–", "1802901002": "para–pemimpin", "1802901003": "ndhelik", "1802901004": "lan–ilat–ipun", "1802901005": "dhumateng–cethak–ipun", "1802901006": "nèmpèl",
    "1802901101": "amargi", "1802901102": "kuping", "1802901103": "mireng", "1802901104": "lan–mberkahi–kawula", "1802901105": "lan–mripat", "1802901106": "ningali", "1802901107": "lan–nyeksèni–kawula",
    "1802901201": "amargi–", "1802901202": "kawula–ngluwari", "1802901203": "tiyang–mlarat", "1802901204": "ingkang–sesambat", "1802901205": "lan–bocah–yatim", "1802901206": "lan–mboten–wonten–", "1802901207": "pambiyantu", "1802901208": "kanggé–piyambakipun",
    "1802901301": "berkah", "1802901302": "tiyang–ingkang–sirna", "1802901303": "ing–nginggil–kawula", "1802901304": "rawuh", "1802901305": "lan–manah", "1802901306": "randha", "1802901307": "kawula–damel–surak",
    "1802901401": "kabeneran", "1802901402": "kawula–nganggo", "1802901403": "lan–nganggo–kawula", "1802901404": "kados–jubah", "1802901405": "lan–serban", "1802901406": "pangadilan–kawula",
    "1802901501": "mripat", "1802901502": "kawula–dados", "1802901503": "kanggé–tiyang–wuta", "1802901504": "lan–suku", "1802901505": "kanggé–tiyang–pincang", "1802901506": "kawula",
    "1802901601": "bapa"
  },
  30: {
    "1803000101": "lan–sapunika", "1803000102": "ngguyu", "1803000103": "ing–nginggil–kawula", "1803000104": "tiyang–nem", "1803000105": "saking–kawula", "1803000106": "kanggé–dinten",
    "1803000107": "ingkang–", "1803000108": "kawula–nampik", "1803000109": "bapa–nipun", "1803000110": "kanggé–selehaken", "1803000111": "kaliyan–", "1803000112": "segawon–", "1803000113": "menda–kawula",
    "1803000201": "ugi–", "1803000202": "kakiyatan", "1803000203": "asta–nipun", "1803000204": "kénging–menapa", "1803000205": "kanggé–kawula", "1803000206": "ing–nginggil–ipun", "1803000207": "sirna", "1803000208": "umur–dawa",
    "1803000301": "ing–kekurangan", "1803000302": "lan–keluwen", "1803000303": "mboten–wonten–piyambakipun", "1803000304": "ingkang–nggeret", "1803000305": "garing", "1803000306": "wingi–dalu", "1803000307": "karisakan", "1803000308": "lan–karusakan",
    "1803000401": "ingkang–ngethik", "1803000402": "mallow", "1803000403": "ing–nginggil–", "1803000404": "grumbulan", "1803000405": "lan–oyod", "1803000406": "rétém", "1803000407": "tedha–nipun",
    "1803000501": "saking–", "1803000502": "tengah", "1803000503": "piyambakipun–dipuntundhung", "1803000504": "piyambakipun–mbengok", "1803000505": "ing–nginggil–ipun", "1803000506": "kados–maling",
    "1803000601": "ing–lembah", "1803000602": "kali-kali", "1803000603": "kanggé–manggèn", "1803000604": "bolongan–", "1803000605": "lebu", "1803000606": "lan–séla",
    "1803000701": "ing–antawis–", "1803000702": "grumbulan", "1803000703": "piyambakipun–ngocèh", "1803000704": "ing–sangandhap", "1803000705": "tanduran–eri", "1803000706": "piyambakipun–dikumpulaken",
    "1803000801": "putra–", "1803000802": "tiyang–bodho", "1803000803": "ugi–", "1803000804": "putra–", "1803000805": "tanpa–", "1803000806": "nami", "1803000807": "piyambakipun–dipunkebur", "1803000808": "saking–", "1803000809": "bumi",
    "1803000901": "lan–sapunika", "1803000902": "tembang–ipun", "1803000903": "kawula–dados", "1803000904": "lan–kawula–dados", "1803000905": "kanggé–piyambakipun", "1803000906": "kanggé–tembung",
    "1803001001": "piyambakipun–jijik–kawula", "1803001002": "piyambakipun–tebih", "1803001003": "saking–kawula", "1803001004": "lan–saking–praupan–kawula", "1803001005": "mboten–", "1803001006": "piyambakipun–nahan", "1803001007": "idu",
    "1803001101": "amargi–", "1803001102": "[tali–ipun]", "1803001103": "(tali–kawula)", "1803001104": "piyambakipun–mbikak", "1803001105": "lan–nganiaya–kawula", "1803001106": "lan–kendali", "1803001107": "saking–praupan–kawula", "1803001108": "piyambakipun–ngluwari",
    "1803001201": "ing–nginggil–", "1803001202": "tengen", "1803001203": "tiyang–nom", "1803001204": "tangi", "1803001205": "suku–kawula", "1803001206": "piyambakipun–ngluwari", "1803001207": "lan–piyambakipun–numpuk", "1803001208": "ing–nginggil–kawula", "1803001209": "margi–", "1803001210": "karisakan–ipun",
    "1803001301": "piyambakipun–ngremuk", "1803001302": "margi–kawula", "1803001303": "kanggé–karisakan–kawula", "1803001304": "piyambakipun–mbiyantu", "1803001305": "mboten–wonten", "1803001306": "pambiyantu"
  },
  31: {
    "1803100101": "prajanjian–", "1803100102": "kawula–damel", "1803100103": "kanggé–mripat–kawula", "1803100104": "lan–kados–pundi", "1803100105": "kawula–mirsani", "1803100106": "ing–nginggil–", "1803100107": "prawan",
    "1803100201": "lan–menapa", "1803100202": "panduman", "1803100203": "Gusti Allah", "1803100204": "saking–nginggil", "1803100205": "lan–warisan", "1803100206": "Kang Mahakuwasa", "1803100207": "saking–inggil",
    "1803100301": "menapa–mboten–", "1803100302": "bilai", "1803100303": "kanggé–tiyang–duraka", "1803100304": "lan–kasangsaran", "1803100305": "kanggé–ingkang–nindakaken–", "1803100306": "piawon",
    "1803100401": "menapa–mboten–", "1803100402": "Panjenenganipun", "1803100403": "ningali", "1803100404": "margi–kawula", "1803100405": "lan–sedaya–", "1803100406": "jangkah–kawula", "1803100407": "Panjenenganipun–ngétang",
    "1803100501": "menawi–", "1803100502": "kawula–mlampah", "1803100503": "kaliyan–", "1803100504": "tanpa–guna", "1803100505": "lan–kesusu", "1803100506": "ing–nginggil–", "1803100507": "tipu–daya", "1803100508": "suku–kawula",
    "1803100601": "Panjenenganipun–nimbang–kawula", "1803100602": "ing–timbangan–", "1803100603": "adil", "1803100604": "lan–ngertos", "1803100605": "Gusti Allah", "1803100606": "katemenan–kawula",
    "1803100701": "menawi", "1803100702": "mlèncèng", "1803100703": "jangkah–kawula", "1803100704": "saking–", "1803100705": "margi", "1803100706": "lan–sasampunipun", "1803100707": "mripat–kawula", "1803100708": "mlampah", "1803100709": "manah–kawula", "1803100710": "lan–ing–epèk-epèk–kawula", "1803100711": "nèmpèl", "1803100712": "cacad", "1803100713": "p",
    "1803100801": "kawula–nyebar", "1803100802": "lan–sanès", "1803100803": "nedha", "1803100804": "lan–turun–kawula", "1803100805": "dipuncabut",
    "1803100901": "menawi–", "1803100902": "kagodha", "1803100903": "manah–kawula", "1803100904": "ing–nginggil–", "1803100905": "èstri", "1803100906": "lan–ing–nginggil–", "1803100907": "lawang", "1803100908": "tanggi–kawula", "1803100909": "kawula–ngintip",
    "1803101001": "giling", "1803101002": "kanggé–sanès", "1803101003": "garwa–kawula", "1803101004": "lan–ing–nginggil–ipun", "1803101005": "mbungkuk", "1803101006": "sanès",
    "1803101101": "amargi–", "1803101102": "[punika]", "1803101103": "(punika)", "1803101104": "piawon", "1803101105": "[lan–punika]", "1803101106": "(lan–punika)", "1803101107": "dosa", "1803101108": "hakim",
    "1803101201": "amargi", "1803101202": "latu", "1803101203": "punika", "1803101204": "ngantos–", "1803101205": "karisakan", "1803101206": "nedha", "1803101207": "lan–ing–sedaya–", "1803101208": "asil–kawula", "1803101209": "nyabut–oyod",
    "1803101301": "menawi–", "1803101302": "kawula–nampik", "1803101303": "pangadilan–", "1803101304": "abdi–jaler–kawula", "1803101305": "lan–abdi–èstri–kawula", "1803101306": "ing–prakawis–ipun", "1803101307": "kaliyan–kawula",
    "1803101401": "lan–menapa", "1803101402": "kawula–tindakaken"
  },
  32: {
    "1803200101": "lan–mandheg", "1803200102": "tigang–", "1803200103": "tiyang", "1803200104": "punika", "1803200105": "saking–mangsuli", "1803200106": "dhumateng–", "1803200107": "Ayub", "1803200108": "amargi", "1803200109": "piyambakipun", "1803200110": "leres", "1803200111": "ing–paningal–ipun", "1803200112": "p",
    "1803200201": "lan–murub", "1803200202": "bebendu", "1803200203": "Elihu", "1803200204": "putra–", "1803200205": "Barakhél", "1803200206": "tiyang–Buzi", "1803200207": "saking–kulawarga–", "1803200208": "Ram", "1803200209": "ing–Ayub", "1803200210": "murub", "1803200211": "bebendu–ipun", "1803200212": "ing–nginggil–", "1803200213": "mbeneraken–ipun", "1803200214": "nyawa–ipun", "1803200215": "tinimbang–Gusti Allah",
    "1803200301": "lan–ing–tigang–", "1803200302": "mitra–nipun", "1803200303": "murub", "1803200304": "bebendu–ipun", "1803200305": "ing–nginggil", "1803200306": "ingkang", "1803200307": "mboten–", "1803200308": "piyambakipun–manggihaken", "1803200309": "wangsulan", "1803200310": "lan–piyambakipun–ndakwa", "1803200311": "dhumateng–", "1803200312": "Ayub",
    "1803200401": "lan–Elihu", "1803200402": "ngentosi", "1803200403": "dhumateng–", "1803200404": "Ayub", "1803200405": "ing–tembung-tembung", "1803200406": "amargi", "1803200407": "tiyang–sepuh–", "1803200408": "piyambakipun", "1803200409": "saking–piyambakipun", "1803200410": "kanggé–dinten",
    "1803200501": "lan–ningali", "1803200502": "Elihu", "1803200503": "bilih", "1803200504": "mboten–wonten", "1803200505": "wangsulan", "1803200506": "ing–tutuk–", "1803200507": "tigang–", "1803200508": "tiyang", "1803200509": "lan–murub", "1803200510": "bebendu–ipun", "1803200511": "p",
    "1803200601": "lan–mangsuli", "1803200602": "Elihu", "1803200603": "putra–", "1803200604": "Barakhél", "1803200605": "tiyang–Buzi", "1803200606": "lan–ngendika", "1803200607": "aném", "1803200608": "kawula", "1803200609": "kanggé–dinten", "1803200610": "lan–panjenengan", "1803200611": "tiyang–sepuh", "1803200612": "ing–nginggil–", "1803200613": "punika", "1803200614": "kawula–ajrih", "1803200615": "lan–kawula–wedi", "1803200616": "saking–nedahaken", "1803200617": "kawruh–kawula", "1803200618": "dhumateng–panjenengan",
    "1803200701": "kawula–ngendika", "1803200702": "dinten", "1803200703": "badhe–ngendika", "1803200704": "lan–kathah", "1803200705": "taun", "1803200706": "maringi–ngertos", "1803200707": "kawicaksanan",
    "1803200801": "nanging", "1803200802": "roh–", "1803200803": "punika", "1803200804": "ing–manungsa", "1803200805": "lan–napas", "1803200806": "Kang Mahakuwasa", "1803200807": "maringi–pangertosan",
    "1803200901": "mboten–", "1803200902": "kathah", "1803200903": "wicaksana", "1803200904": "lan–tiyang–sepuh", "1803200905": "mangertosi", "1803200906": "pangadilan",
    "1803201001": "pramila", "1803201002": "kawula–ngendika"
  },
  33: {
    "1803300101": "lan–nanging", "1803300102": "mirengna–", "1803300103": "mugi", "1803300104": "Ayub", "1803300105": "tembung–kawula", "1803300106": "lan–sedaya–", "1803300107": "tembung–kawula", "1803300108": "midhangetna",
    "1803300201": "sapunika–", "1803300202": "mugi", "1803300203": "kawula–mbikak", "1803300204": "tutuk–kawula", "1803300205": "ngendika", "1803300206": "ilat–kawula", "1803300207": "ing–cethak–kawula",
    "1803300301": "jejeg–", "1803300302": "manah–kawula", "1803300303": "tembung–kawula", "1803300304": "lan–kawruh", "1803300305": "lathi–kawula", "1803300306": "murni", "1803300307": "ngendika",
    "1803300401": "roh–", "1803300402": "Gusti Allah", "1803300403": "ndamel–kawula", "1803300404": "lan–napas", "1803300405": "Kang Mahakuwasa", "1803300406": "nguripaken–kawula",
    "1803300501": "menawi–", "1803300502": "panjenengan–saged", "1803300503": "mangsuli–kawula", "1803300504": "susunna", "1803300505": "ing–ngajeng–kawula", "1803300506": "jumeneng",
    "1803300601": "sapunika–", "1803300602": "kawula", "1803300603": "kados–panjenengan", "1803300604": "kanggé–Gusti Allah", "1803300605": "saking–lempung", "1803300606": "kawula–dipundamel", "1803300607": "ugi–", "1803300608": "kawula",
    "1803300701": "sapunika", "1803300702": "ajrih–kawula", "1803300703": "mboten", "1803300704": "ngagetaken–panjenengan", "1803300705": "lan–beban–kawula", "1803300706": "ing–nginggil–panjenengan", "1803300707": "mboten–", "1803300708": "awrat",
    "1803300801": "namung", "1803300802": "panjenengan–ngendika", "1803300803": "ing–kuping–kawula", "1803300804": "lan–swanten", "1803300805": "tembung-tembung", "1803300806": "kawula–mireng",
    "1803300901": "resik", "1803300902": "kawula", "1803300903": "tanpa", "1803300904": "pelanggaran", "1803300905": "suci", "1803300906": "kawula", "1803300907": "lan–mboten–wonten", "1803300908": "dosa", "1803300909": "kanggé–kawula",
    "1803301001": "sapunika", "1803301002": "alesan", "1803301003": "ing–nginggil–kawula", "1803301004": "Panjenenganipun–manggihaken", "1803301005": "Panjenenganipun–nganggep–kawula", "1803301006": "kanggé–mengsah", "1803301007": "kanggé–Panjenenganipun",
    "1803301101": "Panjenenganipun–selehaken", "1803301102": "ing–blok", "1803301103": "suku–kawula", "1803301104": "Panjenenganipun–njagi", "1803301105": "sedaya–", "1803301106": "margi–kawula",
    "1803301201": "sapunika–", "1803301202": "punika", "1803301203": "mboten–", "1803301204": "panjenengan–leres", "1803301205": "kawula–mangsuli–panjenengan", "1803301206": "amargi–", "1803301207": "langkung–ageng", "1803301208": "Gusti Allah", "1803301209": "saking–manungsa",
    "1803301301": "kénging–menapa", "1803301302": "dhumateng–Panjenenganipun", "1803301303": "panjenengan–padu", "1803301304": "amargi", "1803301305": "sedaya–", "1803301306": "tembung–Ipun", "1803301307": "mboten–", "1803301308": "Panjenenganipun–mangsuli",
    "1803301401": "amargi–", "1803301402": "ing–satunggal", "1803301403": "ngendika–", "1803301404": "Gusti Allah", "1803301405": "lan–ing–kalih"
  },
  34: {
    "1803400101": "lan–mangsuli", "1803400102": "Elihu", "1803400103": "lan–ngendika",
    "1803400201": "mirengna", "1803400202": "tiyang–wicaksana", "1803400203": "tembung–kawula", "1803400204": "lan–ingkang–ngertos", "1803400205": "midhangetna", "1803400206": "dhumateng–kawula",
    "1803400301": "amargi–", "1803400302": "kuping", "1803400303": "tembung-tembung", "1803400304": "nguji", "1803400305": "lan–cethak", "1803400306": "ngrasakaken", "1803400307": "kanggé–nedha",
    "1803400401": "pangadilan", "1803400402": "dipunpilih–", "1803400403": "kanggé–kita", "1803400404": "kita–ngertos", "1803400405": "ing–antawis–kita", "1803400406": "menapa–", "1803400407": "saé",
    "1803400501": "amargi–", "1803400502": "ngendika", "1803400503": "Ayub", "1803400504": "kawula–leres", "1803400505": "lan–Gusti Allah", "1803400506": "ngilangi", "1803400507": "pangadilan–kawula",
    "1803400601": "ing–nginggil–", "1803400602": "pangadilan–kawula", "1803400603": "kawula–goroh", "1803400604": "awrat", "1803400605": "panah–kawula", "1803400606": "tanpa–", "1803400607": "pelanggaran",
    "1803400701": "sinten–", "1803400702": "tiyang", "1803400703": "kados–Ayub", "1803400704": "ngunjuk–", "1803400705": "moyokan", "1803400706": "kados–toya",
    "1803400801": "lan–mlampah", "1803400802": "kanggé–sesrawungan", "1803400803": "kaliyan–", "1803400804": "ingkang–nindakaken–", "1803400805": "piawon", "1803400806": "lan–kanggé–mlampah", "1803400807": "kaliyan–", "1803400808": "tiyang–", "1803400809": "duraka",
    "1803400901": "amargi–", "1803400902": "piyambakipun–ngendika", "1803400903": "mboten", "1803400904": "bathi–", "1803400905": "tiyang", "1803400906": "ing–seneng–ipun", "1803400907": "kaliyan–", "1803400908": "Gusti Allah",
    "1803401001": "pramila", "1803401002": "tiyang–", "1803401003": "manah", "1803401004": "mirengna", "1803401005": "dhumateng–kawula", "1803401006": "mboten–babar–pisan", "1803401007": "kanggé–Gusti Allah", "1803401008": "saking–piawon", "1803401009": "lan–Kang Mahakuwasa", "1803401010": "saking–duraka",
    "1803401101": "amargi", "1803401102": "padamelan–", "1803401103": "manungsa", "1803401104": "Panjenenganipun–males–", "1803401105": "piyambakipun", "1803401106": "lan–miturut–margi–", "1803401107": "tiyang", "1803401108": "Panjenenganipun–manggihaken",
    "1803401201": "saèstu–", "1803401202": "yektos", "1803401203": "Gusti Allah", "1803401204": "mboten–", "1803401205": "nindakaken–piawon", "1803401206": "lan–Kang Mahakuwasa", "1803401207": "mboten–", "1803401208": "mbengkokaken", "1803401209": "pangadilan",
    "1803401301": "sinten–", "1803401302": "maringi–dhawuh", "1803401303": "ing–nginggil–Panjenenganipun", "1803401304": "bumi", "1803401305": "lan–sinten", "1803401306": "selehaken", "1803401307": "jagad", "1803401308": "sedayanipun",
    "1803401401": "menawi–", "1803401402": "Panjenenganipun–selehaken", "1803401403": "dhumateng–Panjenenganipun", "1803401404": "manah–Ipun", "1803401405": "roh–Ipun"
  },
  35: {
    "1803500101": "lan–mangsuli", "1803500102": "Elihu", "1803500103": "lan–ngendika",
    "1803500201": "menapa–punika", "1803500202": "panjenengan–nganggep", "1803500203": "kanggé–pangadilan", "1803500204": "panjenengan–ngendika", "1803500205": "kabeneran–kawula", "1803500206": "saking–Gusti Allah",
    "1803500301": "amargi–", "1803500302": "panjenengan–ngendika", "1803500303": "menapa–", "1803500304": "bathi–", "1803500305": "kanggé–panjenengan", "1803500306": "menapa–", "1803500307": "kawula–nampi–bathi", "1803500308": "saking–dosa–kawula",
    "1803500401": "kawula", "1803500402": "kawula–mangsuli–panjenengan", "1803500403": "tembung-tembung", "1803500404": "lan–dhumateng–", "1803500405": "mitra–panjenengan", "1803500406": "kaliyan–panjenengan",
    "1803500501": "ningalia", "1803500502": "langit", "1803500503": "lan–ningalia", "1803500504": "lan–mirsanana", "1803500505": "méga", "1803500506": "inggil", "1803500507": "saking–panjenengan",
    "1803500601": "menawi–", "1803500602": "panjenengan–dosa", "1803500603": "menapa–", "1803500604": "panjenengan–nindakaken–", "1803500605": "ing–Panjenenganipun", "1803500606": "lan–kathah", "1803500607": "pelanggaran–panjenengan", "1803500608": "menapa–", "1803500609": "panjenengan–nindakaken–", "1803500610": "dhumateng–Panjenenganipun",
    "1803500701": "menawi–", "1803500702": "panjenengan–leres", "1803500703": "menapa–", "1803500704": "panjenengan–maringi–", "1803500705": "dhumateng–Panjenenganipun", "1803500706": "utawi", "1803500707": "menapa–", "1803500708": "saking–asta–panjenengan", "1803500709": "Panjenenganipun–nampi",
    "1803500801": "kanggé–tiyang–", "1803500802": "kados–panjenengan", "1803500803": "piawon–panjenengan", "1803500804": "lan–kanggé–putra–", "1803500805": "manungsa", "1803500806": "kabeneran–panjenengan",
    "1803500901": "saking–kathah", "1803500902": "ingkang–dipunaniaya", "1803500903": "piyambakipun–sesambat", "1803500904": "piyambakipun–nangis", "1803500905": "saking–lengen", "1803500906": "tiyang–kuwat",
    "1803501001": "lan–mboten–", "1803501002": "piyambakipun–ngendika", "1803501003": "wonten–pundi", "1803501004": "Gusti Allah", "1803501005": "ingkang–ndamel–kawula", "1803501006": "ingkang–maringi", "1803501007": "kidung", "1803501008": "ing–dalu",
    "1803501101": "ingkang–mulang–kita", "1803501102": "saking–kéwan", "1803501103": "bumi", "1803501104": "lan–saking–manuk", "1803501105": "langit", "1803501106": "ndamel–kita–wicaksana",
    "1803501201": "wonten–mriku", "1803501202": "piyambakipun–sesambat", "1803501203": "lan–mboten", "1803501204": "Panjenenganipun–mangsuli", "1803501205": "saking–praupan–", "1803501206": "kumalungkung", "1803501207": "tiyang–awon",
    "1803501301": "namung–", "1803501302": "tanpa–guna", "1803501303": "mboten–", "1803501304": "mireng", "1803501305": "Gusti Allah", "1803501306": "lan–Kang Mahakuwasa", "1803501307": "mboten", "1803501308": "ningali",
    "1803501401": "malah", "1803501402": "amargi–", "1803501403": "panjenengan–ngendika", "1803501404": "mboten", "1803501405": "panjenengan–ningali–Panjenenganipun", "1803501406": "pangadilan", "1803501407": "ing–ngajeng–Ipun", "1803501408": "lan–panjenengan–ngentosi", "1803501409": "kanggé–Panjenenganipun",
    "1803501501": "lan–sapunika"
  },
  36: {
    "1803600101": "lan–nambahi", "1803600102": "Elihu", "1803600103": "lan–ngendika",
    "1803600201": "entosna–", "1803600202": "dhumateng–kawula", "1803600203": "sedhela", "1803600204": "lan–kawula–nedahaken–panjenengan", "1803600205": "amargi", "1803600206": "taksih", "1803600207": "kanggé–Gusti Allah", "1803600208": "tembung-tembung",
    "1803600301": "kawula–ngangkat", "1803600302": "kawruh–kawula", "1803600303": "saking–tebih", "1803600304": "lan–kanggé–ingkang–ndamel–kawula", "1803600305": "kawula–maringi–", "1803600306": "kabeneran",
    "1803600401": "amargi–", "1803600402": "yektos", "1803600403": "mboten–", "1803600404": "goroh", "1803600405": "tembung–kawula", "1803600406": "sampurna", "1803600407": "kawruh", "1803600408": "kaliyan–panjenengan",
    "1803600501": "sapunika–", "1803600502": "Gusti Allah", "1803600503": "ageng", "1803600504": "lan–mboten", "1803600505": "Panjenenganipun–nampik", "1803600506": "ageng", "1803600507": "kakiyatan", "1803600508": "manah",
    "1803600601": "mboten–", "1803600602": "Panjenenganipun–nguripaken", "1803600603": "tiyang–duraka", "1803600604": "lan–pangadilan–", "1803600605": "tiyang–sangsara", "1803600606": "Panjenenganipun–maringi",
    "1803600701": "mboten–", "1803600702": "Panjenenganipun–narik", "1803600703": "saking–tiyang–leres", "1803600704": "mripat–Ipun", "1803600705": "lan–kaliyan–", "1803600706": "para–raja", "1803600707": "ing–dhampar", "1803600708": "lan–Panjenenganipun–ndunungaken", "1803600709": "kanggé–salaminipun", "1803600710": "lan–piyambakipun–dados–luhur",
    "1803600801": "lan–menawi–", "1803600802": "dipunbelenggu", "1803600803": "ing–ranté", "1803600804": "piyambakipun–dipuncepeng", "1803600805": "ing–tali–", "1803600806": "kasangsaran",
    "1803600901": "lan–Panjenenganipun–maringi–ngertos", "1803600902": "dhumateng–piyambakipun", "1803600903": "padamelan–ipun", "1803600904": "lan–pelanggaran–ipun", "1803600905": "bilih", "1803600906": "piyambakipun–dados–ageng",
    "1803601001": "lan–Panjenenganipun–mbikak", "1803601002": "kuping–ipun", "1803601003": "kanggé–piwulang", "1803601004": "lan–Panjenenganipun–ngendika", "1803601005": "bilih–", "1803601006": "piyambakipun–mratobat", "1803601007": "saking–piawon",
    "1803601101": "menawi–", "1803601102": "piyambakipun–mireng", "1803601103": "lan–piyambakipun–ngabdi", "1803601104": "piyambakipun–ngentèkaken", "1803601105": "dinten–ipun", "1803601106": "ing–kasaénan", "1803601107": "lan–taun–ipun", "1803601108": "ing–kasenengan",
    "1803601201": "lan–menawi–", "1803601202": "mboten", "1803601203": "piyambakipun–mireng", "1803601204": "ing–pedhang", "1803601205": "piyambakipun–langkung", "1803601206": "lan–piyambakipun–pejah", "1803601207": "tanpa–", "1803601208": "kawruh",
    "1803601301": "lan–tiyang–munafik–", "1803601302": "manah", "1803601303": "piyambakipun–selehaken", "1803601304": "bebendu", "1803601305": "mboten", "1803601306": "piyambakipun–sesambat", "1803601307": "amargi", "1803601308": "Panjenenganipun–ngiket",
    "1803601401": "pejah", "1803601402": "ing–aném", "1803601403": "nyawa–ipun", "1803601404": "lan–pagesangan–ipun", "1803601405": "ing–pelacur–kuil",
    "1803601501": "Panjenenganipun–ngluwari", "1803601502": "tiyang–sangsara", "1803601503": "ing–kasangsaran–ipun"
  },
  37: {
    "1803700101": "ugi–", "1803700102": "kanggé–punika", "1803700103": "geter", "1803700104": "manah–kawula", "1803700105": "lan–mlumpat", "1803700106": "saking–papan–ipun",
    "1803700201": "mirengna", "1803700202": "kanthi–premati", "1803700203": "ing–gumuruh", "1803700204": "swanten–Ipun", "1803700205": "lan–gumrenggeng", "1803700206": "saking–tutuk–Ipun", "1803700207": "medal",
    "1803700301": "ing–sangandhap–", "1803700302": "sedaya–", "1803700303": "langit", "1803700304": "Panjenenganipun–ngluwari", "1803700305": "lan–pepadhang–Ipun", "1803700306": "ing–nginggil–", "1803700307": "pucuk–", "1803700308": "bumi",
    "1803700401": "sasampunipun", "1803700402": "nggereng–", "1803700403": "swanten", "1803700404": "Panjenenganipun–nggludug", "1803700405": "kaliyan–swanten", "1803700406": "kaluhuran–Ipun", "1803700407": "lan–mboten", "1803700408": "Panjenenganipun–nahan", "1803700409": "amargi–", "1803700410": "dipunmireng", "1803700411": "swanten–Ipun",
    "1803700501": "nggludug", "1803700502": "Gusti Allah", "1803700503": "kaliyan–swanten–Ipun", "1803700504": "kaelokan", "1803700505": "nindakaken", "1803700506": "prakawis–ageng", "1803700507": "lan–mboten", "1803700508": "kita–mangertosi",
    "1803700601": "amargi", "1803700602": "dhumateng–salju", "1803700603": "Panjenenganipun–ngendika", "1803700604": "dadosa", "1803700605": "bumi", "1803700606": "lan–udan", "1803700607": "udan", "1803700608": "lan–udan", "1803700609": "udan–deres", "1803700610": "kakiyatan–Ipun",
    "1803700701": "ing–asta–", "1803700702": "saben–", "1803700703": "manungsa", "1803700704": "Panjenenganipun–nyegel", "1803700705": "kanggé–ngertos", "1803700706": "sedaya–", "1803700707": "tiyang–", "1803700708": "padamelan–Ipun",
    "1803700801": "lan–mlebet", "1803700802": "kéwan", "1803700803": "ing–", "1803700804": "papan–ndhelik", "1803700805": "lan–ing–guwa–ipun", "1803700806": "piyambakipun–manggèn",
    "1803700901": "saking–", "1803700902": "kamar", "1803700903": "rawuh", "1803700904": "angin–prahara", "1803700905": "lan–saking–lor", "1803700906": "asrep",
    "1803701001": "saking–napas–", "1803701002": "Gusti Allah", "1803701003": "dipunwetokaken–", "1803701004": "és", "1803701005": "lan–jembar", "1803701006": "toya", "1803701007": "ing–beku",
    "1803701101": "ugi–", "1803701102": "kaliyan–teles", "1803701103": "Panjenenganipun–mbebani", "1803701104": "méga", "1803701105": "Panjenenganipun–nyebar", "1803701106": "méga", "1803701107": "pepadhang–Ipun",
    "1803701201": "lan–punika", "1803701202": "muter–", "1803701203": "mubeng", "1803701204": "[kaliyan–pitedah–Ipun]", "1803701205": "(kaliyan–pitedah–Ipun)", "1803701206": "kanggé–padamelan–ipun", "1803701207": "sedaya", "1803701208": "ingkang", "1803701209": "Panjenenganipun–dhawuhi", "1803701210": "ing–nginggil–", "1803701211": "praupan–", "1803701212": "jagad", "1803701213": "bumi",
    "1803701301": "menawi–", "1803701302": "kanggé–teken", "1803701303": "menawi–"
  },
  38: {
    "1803800101": "lan–mangsuli–", "1803800102": "Yéhuwah", "1803800103": "dhumateng–", "1803800104": "Ayub", "1803800105": "[saking]", "1803800106": "[angin–prahara]", "1803800107": "(saking)", "1803800108": "(angin–prahara)", "1803800109": "lan–ngendika",
    "1803800201": "sinten", "1803800202": "punika", "1803800203": "ingkang–ndamel–peteng", "1803800204": "rancangan", "1803800205": "kaliyan–tembung-tembung", "1803800206": "tanpa–", "1803800207": "kawruh",
    "1803800301": "sabukna–", "1803800302": "mugi", "1803800303": "kados–tiyang", "1803800304": "bangkèkan–panjenengan", "1803800305": "lan–kawula–taken–panjenengan", "1803800306": "lan–panjenengan–maringi–ngertos–kawula",
    "1803800401": "wonten–pundi", "1803800402": "panjenengan–wonten", "1803800403": "nalika–kawula–ndhasari–", "1803800404": "bumi", "1803800405": "ngendikakna", "1803800406": "menawi–", "1803800407": "panjenengan–ngertos", "1803800408": "pangertosan",
    "1803800501": "sinten–", "1803800502": "selehaken", "1803800503": "ukuran–ipun", "1803800504": "amargi", "1803800505": "panjenengan–ngertos", "1803800506": "utawi", "1803800507": "sinten–", "1803800508": "mentangaken", "1803800509": "ing–nginggil–ipun", "1803800510": "tali",
    "1803800601": "ing–nginggil–", "1803800602": "menapa", "1803800603": "dhasar–ipun", "1803800604": "dipunselehaken", "1803800605": "utawi", "1803800606": "sinten–", "1803800607": "uncalaken", "1803800608": "séla", "1803800609": "pucuk–ipun",
    "1803800701": "nalika–nyanyi–", "1803800702": "sesarengan", "1803800703": "lintang–", "1803800704": "énjing", "1803800705": "lan–surak-surak", "1803800706": "sedaya–", "1803800707": "putra–", "1803800708": "Gusti Allah",
    "1803800801": "lan–nutup", "1803800802": "kaliyan–lawang", "1803800803": "saganten", "1803800804": "nalika–muncrat", "1803800805": "saking–rahim", "1803800806": "piyambakipun–medal",
    "1803800901": "nalika–kawula–selehaken", "1803800902": "méga", "1803800903": "sandhangan–ipun", "1803800904": "lan–pepeteng", "1803800905": "popok–ipun",
    "1803801001": "lan–kawula–netepaken", "1803801002": "ing–nginggil–ipun", "1803801003": "wates–kawula", "1803801004": "lan–kawula–selehaken", "1803801005": "palang", "1803801006": "lan–lawang",
    "1803801101": "lan–kawula–ngendika", "1803801102": "ngantos–", "1803801103": "mriki", "1803801104": "panjenengan–rawuh", "1803801105": "lan–mboten", "1803801106": "panjenengan–nambahi", "1803801107": "lan–mriki–", "1803801108": "dipunselehaken", "1803801109": "ing–kumalungkung", "1803801110": "ombak–panjenengan",
    "1803801201": "menapa–saking–dinten–panjenengan", "1803801202": "panjenengan–dhawuhi", "1803801203": "énjing", "1803801204": "[panjenengan–maringi–ngertos]", "1803801205": "[fajar]", "1803801206": "(panjenengan–maringi–ngertos)", "1803801207": "(fajar)", "1803801208": "papan–ipun",
    "1803801301": "kanggé–nyepeng", "1803801302": "ing–pucuk–", "1803801303": "bumi", "1803801304": "lan–dipunkebur", "1803801305": "tiyang–duraka", "1803801306": "saking–piyambakipun",
    "1803801401": "dados–owah", "1803801402": "kados–lempung"
  },
  39: {
    "1803900101": "menapa–panjenengan–ngertos", "1803900102": "wekdal", "1803900103": "lair", "1803900104": "wedhus–gunung–", "1803900105": "séla", "1803900106": "nglairaké", "1803900107": "menjangan–èstri", "1803900108": "panjenengan–njagi",
    "1803900201": "panjenengan–ngétang", "1803900202": "wulan-wulan", "1803900203": "piyambakipun–jangkep", "1803900204": "lan–panjenengan–ngertos", "1803900205": "wekdal", "1803900206": "lair–ipun",
    "1803900301": "piyambakipun–mbungkuk", "1803900302": "anak–ipun", "1803900303": "piyambakipun–nglairaken", "1803900304": "laranipun", "1803900305": "piyambakipun–ngirim",
    "1803900401": "kuwat", "1803900402": "anak–ipun", "1803900403": "mundhak", "1803900404": "ing–ara-ara", "1803900405": "piyambakipun–medal", "1803900406": "lan–mboten–", "1803900407": "mbalèk", "1803900408": "dhumateng–piyambakipun",
    "1803900501": "sinten–", "1803900502": "ngluwari", "1803900503": "kuldi–liar", "1803900504": "mardika", "1803900505": "lan–tali", "1803900506": "kuldi–liar", "1803900507": "sinten", "1803900508": "mbikak",
    "1803900601": "ingkang–", "1803900602": "kawula–selehaken", "1803900603": "ara-ara–samun", "1803900604": "griya–ipun", "1803900605": "lan–papan–dedalem–ipun", "1803900606": "asin",
    "1803900701": "piyambakipun–ngguyu", "1803900702": "dhumateng–ramé", "1803900703": "kutha", "1803900704": "bengok-bengok", "1803900705": "ingkang–nyurung", "1803900706": "mboten", "1803900707": "piyambakipun–mireng",
    "1803900801": "madosi", "1803900802": "redi", "1803900803": "panggonan–ipun", "1803900804": "lan–sasampunipun", "1803900805": "sedaya–", "1803900806": "ijo", "1803900807": "piyambakipun–madosi",
    "1803900901": "menapa–kersa", "1803900902": "banteng", "1803900903": "ngladosi–panjenengan", "1803900904": "menawi–", "1803900905": "piyambakipun–nginep", "1803900906": "ing–nginggil–", "1803900907": "palungan–panjenengan",
    "1803901001": "menapa–panjenengan–ngiket–", "1803901002": "banteng", "1803901003": "ing–galur", "1803901004": "tali–ipun", "1803901005": "menawi–", "1803901006": "piyambakipun–nggaru", "1803901007": "lembah", "1803901008": "sasampunipun–panjenengan",
    "1803901101": "menapa–panjenengan–pitados–", "1803901102": "ing–piyambakipun", "1803901103": "amargi–", "1803901104": "ageng", "1803901105": "kakiyatan–ipun", "1803901106": "lan–panjenengan–nilar", "1803901107": "dhumateng–piyambakipun", "1803901108": "padamelan–panjenengan",
    "1803901201": "menapa–panjenengan–pitados", "1803901202": "ing–piyambakipun", "1803901203": "bilih–", "1803901204": "[mbalèkaken]", "1803901205": "(mbalèkaken)", "1803901206": "wiji–panjenengan", "1803901207": "lan–papan–panggiling–panjenengan", "1803901208": "ngempalaken",
    "1803901301": "swiwi–", "1803901302": "manuk–unta", "1803901303": "ngebahaken–kanthi–bingah", "1803901304": "menapa–", "1803901305": "swiwi", "1803901306": "bangau", "1803901307": "lan–wulu",
    "1803901401": "amargi–", "1803901402": "piyambakipun–nilar", "1803901403": "dhumateng–bumi", "1803901404": "endhog–ipun", "1803901405": "lan–ing–nginggil–", "1803901406": "lebu", "1803901407": "piyambakipun–ngangeti"
  },
  40: {
    "1804000101": "lan–mangsuli", "1804000102": "Yéhuwah", "1804000103": "dhumateng–", "1804000104": "Ayub", "1804000105": "lan–ngendika",
    "1804000201": "menapa–ingkang–padu", "1804000202": "kaliyan–", "1804000203": "Kang Mahakuwasa", "1804000204": "badhe–ngajari", "1804000205": "ingkang–nyela", "1804000206": "Gusti Allah", "1804000207": "mangsuli–Panjenenganipun", "1804000208": "p",
    "1804000301": "lan–mangsuli", "1804000302": "Ayub", "1804000303": "dhumateng–", "1804000304": "Yéhuwah", "1804000305": "lan–ngendika",
    "1804000401": "sapunika", "1804000402": "kawula–alit", "1804000403": "menapa", "1804000404": "kawula–mangsuli–Panjenengan", "1804000405": "asta–kawula", "1804000406": "kawula–selehaken", "1804000407": "dhumateng–", "1804000408": "tutuk–kawula",
    "1804000501": "sapisan", "1804000502": "kawula–ngendika", "1804000503": "lan–mboten", "1804000504": "kawula–mangsuli", "1804000505": "lan–kaping–kalih", "1804000506": "lan–mboten", "1804000507": "kawula–nambahi", "1804000508": "p",
    "1804000601": "lan–mangsuli–", "1804000602": "Yéhuwah", "1804000603": "dhumateng–", "1804000604": "Ayub", "1804000605": "[saking]", "1804000606": "[angin–prahara]", "1804000607": "(saking)", "1804000608": "(angin–prahara)", "1804000609": "lan–ngendika",
    "1804000701": "sabukna–", "1804000702": "mugi", "1804000703": "kados–tiyang", "1804000704": "bangkèkan–panjenengan", "1804000705": "kawula–taken–panjenengan", "1804000706": "lan–panjenengan–maringi–ngertos–kawula",
    "1804000801": "menapa–ugi", "1804000802": "panjenengan–mbatalaken", "1804000803": "pangadilan–kawula", "1804000804": "panjenengan–ndakwa–kawula", "1804000805": "supados", "1804000806": "panjenengan–dados–leres",
    "1804000901": "lan–menawi–", "1804000902": "lengen", "1804000903": "kados–Gusti Allah", "1804000904": "kanggé–panjenengan", "1804000905": "lan–kaliyan–swanten", "1804000906": "kados–Panjenenganipun", "1804000907": "panjenengan–nggludug",
    "1804001001": "agemi–", "1804001002": "mugi", "1804001003": "kamulyan", "1804001004": "lan–kaluhuranan", "1804001005": "lan–kamulyan", "1804001006": "lan–kaéndahan", "1804001007": "panjenengan–nganggo",
    "1804001101": "nyebar–", "1804001102": "luber", "1804001003": "bebendu–panjenengan", "1804001104": "lan–ningalia", "1804001105": "sedaya–", "1804001106": "tiyang–kumalungkung", "1804001107": "lan–ngandhapaken",
    "1804001201": "ningalia", "1804001202": "sedaya–", "1804001203": "tiyang–kumalungkung", "1804001204": "nundukaken", "1804001205": "lan–ngidhak", "1804001206": "tiyang–duraka", "1804001207": "ing–papan–ipun",
    "1804001301": "simpen", "1804001302": "ing–lebu", "1804001303": "sesarengan", "1804001304": "praupan–ipun", "1804001305": "blenggu", "1804001306": "ing–papan–singidan",
    "1804001401": "lan–ugi–", "1804001402": "kawula", "1804001403": "ngalem–panjenengan", "1804001404": "amargi–", "1804001405": "nylametaken", "1804001406": "kanggé–panjenengan", "1804001407": "asta–tengen–panjenengan",
    "1804001501": "sapunika–", "1804001502": "mugi", "1804001503": "behemot", "1804001504": "ingkang–"
  },
  41: {
    "1804100101": "panjenengan–narik", "1804100102": "lewiatan", "1804100103": "kaliyan–pancing", "1804100104": "lan–kaliyan–tali", "1804100105": "panjenengan–ngandhapaken", "1804100106": "ilat–ipun",
    "1804100201": "menapa–panjenengan–selehaken", "1804100202": "tali", "1804100203": "ing–irung–ipun", "1804100204": "lan–kaliyan–pancing", "1804100205": "panjenengan–nembus", "1804100206": "pipipipun",
    "1804100301": "menapa–piyambakipun–kathah", "1804100302": "dhumateng–panjenengan", "1804100303": "panyuwunan", "1804100304": "menawi–", "1804100305": "piyambakipun–ngendika", "1804100306": "dhumateng–panjenengan", "1804100307": "alus",
    "1804100401": "menapa–piyambakipun–damel", "1804100402": "prajanjian", "1804100403": "kaliyan–panjenengan", "1804100404": "panjenengan–njupuk–piyambakipun", "1804100405": "kanggé–abdi", "1804100406": "salaminipun",
    "1804100501": "menapa–panjenengan–dolanan–", "1804100502": "kaliyan–piyambakipun", "1804100503": "kados–manuk", "1804100504": "lan–panjenengan–ngiket–piyambakipun", "1804100505": "kanggé–kenya–panjenengan",
    "1804100601": "piyambakipun–neges", "1804100602": "ing–nginggil–ipun", "1804100603": "mitra", "1804100604": "piyambakipun–mbagi", "1804100605": "ing–antawis–", "1804100606": "sudagar",
    "1804100701": "menapa–panjenengan–ngisi", "1804100702": "kaliyan–tombak", "1804100703": "kulit–ipun", "1804100704": "lan–kaliyan–tumbak–iwak", "1804100705": "iwak", "1804100706": "mustaka–ipun",
    "1804100801": "selehaken–", "1804100802": "ing–nginggil–ipun", "1804100803": "epèk-epèk–panjenengan", "1804100804": "émut–", "1804100805": "perang", "1804100806": "mboten–", "1804100807": "nambahi",
    "1804100901": "sapunika–", "1804100902": "pangajeng-ajeng–ipun", "1804100903": "dipunkhianati", "1804100904": "menapa–ugi", "1804100905": "dhumateng–", "1804100906": "ningali–piyambakipun", "1804100907": "piyambakipun–dipununcalaken",
    "1804101001": "mboten–", "1804101002": "galak", "1804101003": "bilih", "1804101004": "piyambakipun–dipuntangi", "1804101005": "lan–sinten", "1804101006": "punika", "1804101007": "ing–ngajeng–kawula", "1804101008": "saged–jumeneng",
    "1804101101": "sinten", "1804101102": "ingkang–rumiyin–maringi–kawula", "1804101103": "lan–kawula–males", "1804101104": "ing–sangandhap–", "1804101105": "sedaya–", "1804101106": "langit", "1804101107": "kanggé–kawula–", "1804101108": "punika",
    "1804101201": "[mboten–]", "1804101202": "(kanggé–piyambakipun–)", "1804101203": "kawula–meneng", "1804101204": "badan–ipun", "1804101205": "lan–tembung–", "1804101206": "kakiyatan", "1804101207": "lan–éndah", "1804101208": "susunan–ipun",
    "1804101301": "sinten–", "1804101302": "mbikak", "1804101303": "praupan–", "1804101304": "busana–ipun", "1804101305": "ing–rangkep", "1804101306": "kendali–ipun", "1804101307": "sinten", "1804101308": "mlebet",
    "1804101401": "lawang–", "1804101402": "praupan–ipun", "1804101403": "sinten", "1804101404": "mbikak", "1804101405": "sakubeng", "1804101406": "untu–ipun", "1804101407": "mawon–ajrih",
    "1804101501": "kumalungkung", "1804101502": "baris–", "1804101503": "tamèng", "1804101504": "dipuntutup", "1804101505": "segel"
  },
  42: {
    "1804200101": "lan–mangsuli", "1804200102": "Ayub", "1804200103": "dhumateng–", "1804200104": "Yéhuwah", "1804200105": "lan–ngendika",
    "1804200201": "[kawula–ngertos]", "1804200202": "(kawula–ngertos)", "1804200203": "bilih–", "1804200204": "sedaya", "1804200205": "Panjenengan–saged", "1804200206": "lan–mboten–", "1804200207": "dipunalang-alangi", "1804200208": "saking–Panjenengan", "1804200209": "rancangan",
    "1804200301": "sinten", "1804200302": "punika", "1804200303": "ingkang–ndhelikaken", "1804200304": "rancangan", "1804200305": "tanpa", "1804200306": "kawruh", "1804200307": "pramila", "1804200308": "kawula–nyariosaken", "1804200309": "lan–mboten", "1804200310": "kawula–mangertosi", "1804200311": "kaelokan", "1804200312": "saking–kawula", "1804200313": "lan–mboten", "1804200314": "kawula–ngertos",
    "1804200401": "mirengna–", "1804200402": "mugi", "1804200403": "lan–kawula", "1804200404": "kawula–badhe–ngendika", "1804200405": "kawula–taken–Panjenengan", "1804200406": "lan–Panjenengan–maringi–ngertos–kawula",
    "1804200501": "saking–mireng–", "1804200502": "kuping", "1804200503": "kawula–mireng–Panjenengan", "1804200504": "lan–sapunika", "1804200505": "mripat–kawula", "1804200506": "ningali–Panjenengan",
    "1804200601": "ing–nginggil–", "1804200602": "punika", "1804200603": "kawula–nampik", "1804200604": "lan–kawula–kaduwung", "1804200605": "ing–nginggil–", "1804200606": "lebu", "1804200607": "lan–awu", "1804200608": "p",
    "1804200701": "lan–dados", "1804200702": "sasampunipun", "1804200703": "ngendika", "1804200704": "Yéhuwah", "1804200705": "dhumateng–", "1804200706": "tembung–tembung", "1804200707": "punika", "1804200708": "dhumateng–", "1804200709": "Ayub",
    "1804200710": "lan–ngendika", "1804200711": "Yéhuwah", "1804200712": "dhumateng–", "1804200713": "Elifas", "1804200714": "tiyang–Téman", "1804200715": "murub", "1804200716": "bebendu–kawula", "1804200717": "ing–panjenengan", "1804200718": "lan–ing–kalih–", "1804200719": "mitra–panjenengan", "1804200720": "amargi", "1804200721": "mboten", "1804200722": "panjenengan–ngendika", "1804200723": "dhumateng–kawula", "1804200724": "leres", "1804200725": "kados–abdi–kawula", "1804200726": "Ayub",
    "1804200801": "lan–sapunika", "1804200802": "pendhet–", "1804200803": "kanggé–panjenengan", "1804200804": "pitu–", "1804200805": "lembu–jaler", "1804200806": "lan–pitu–", "1804200807": "menda–jaler", "1804200808": "lan–kesaha", "1804200809": "dhumateng–", "1804200810": "abdi–kawula", "1804200811": "Ayub", "1804200812": "lan–saosna", "1804200813": "kurban–obong", "1804200814": "kanggé–panjenengan", "1804200815": "lan–Ayub", "1804200816": "abdi–kawula", "1804200817": "badhe–ndedonga", "1804200818": "kanggé–panjenengan", "1804200819": "amargi", "1804200820": "menawi–", "1804200821": "praupan–ipun", "1804200822": "kawula–nampi", "1804200823": "supados–mboten", "1804200824": "nindakaken", "1804200825": "kaliyan–panjenengan", "1804200826": "kawirangkung"
  }
};

/**
 * Process a single chapter
 */
function processChapterChirho(chapterChirho: number): void {
  console.log(`Processing Job chapter ${chapterChirho}...`);

  const wordsChirho = getChapterWordsChirho(chapterChirho);
  const glossesChirho = CHAPTER_GLOSSES_CHIRHO[chapterChirho];

  if (!glossesChirho) {
    console.log(`  No glosses defined for chapter ${chapterChirho}, skipping.`);
    return;
  }

  // Group words by verse
  const verseWordsChirho: Map<number, Array<{ wordId: string; hebrew: string }>> = new Map();
  for (const wChirho of wordsChirho) {
    // Word ID format: BBCCCVVVWW where BB=book(2), CCC=chapter(3), VVV=verse(3), WW=word(2)
    // For ID 1801800101: BB=18, CCC=018, VVV=001, WW=01
    const verseNumChirho = parseInt(wChirho.id.substring(5, 8));
    if (!verseWordsChirho.has(verseNumChirho)) {
      verseWordsChirho.set(verseNumChirho, []);
    }
    verseWordsChirho.get(verseNumChirho)!.push({ wordId: wChirho.id, hebrew: wChirho.text });
  }

  // Generate SQL files for each verse
  const chapterPaddedChirho = String(chapterChirho).padStart(3, "0");

  for (const [verseNumChirho, verseWordsListChirho] of verseWordsChirho.entries()) {
    const verseGlossesChirho: Array<{ wordId: string; gloss: string; hebrew: string }> = [];

    for (const wChirho of verseWordsListChirho) {
      const glossChirho = glossesChirho[wChirho.wordId];
      if (glossChirho) {
        verseGlossesChirho.push({ wordId: wChirho.wordId, gloss: glossChirho, hebrew: wChirho.hebrew });
      } else {
        // Use placeholder for missing glosses
        verseGlossesChirho.push({ wordId: wChirho.wordId, gloss: `[${wChirho.hebrew}]`, hebrew: wChirho.hebrew });
      }
    }

    if (verseGlossesChirho.length > 0) {
      const verseSqlChirho = generateVerseSqlChirho(chapterChirho, verseNumChirho, verseGlossesChirho);
      const verseFileChirho = join(OUTPUT_DIR_CHIRHO, `c${chapterPaddedChirho}-v${String(verseNumChirho).padStart(3, "0")}-chirho.sql`);
      writeFileSync(verseFileChirho, verseSqlChirho);
    }
  }

  console.log(`  Generated ${verseWordsChirho.size} verse files for chapter ${chapterChirho}`);
}

// Process all defined chapters
const definedChaptersChirho = Object.keys(CHAPTER_GLOSSES_CHIRHO).map(Number).sort((a, b) => a - b);
console.log(`Processing chapters: ${definedChaptersChirho.join(', ')}`);
for (const chapChirho of definedChaptersChirho) {
  processChapterChirho(chapChirho);
}

// Update all-verses-chirho.sql
const allVersesSqlPathChirho = join(OUTPUT_DIR_CHIRHO, "all-verses-chirho.sql");
console.log(`\nUpdating ${allVersesSqlPathChirho}...`);

const allFilesChirho = readdirSync(OUTPUT_DIR_CHIRHO)
  .filter(f => f.startsWith("c") && f.endsWith("-chirho.sql") && f !== "all-verses-chirho.sql")
  .sort();

let combinedSqlChirho = `-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- JOB - JAV (Combined)
-- Generated: ${new Date().toISOString()}

`;

for (const fileChirho of allFilesChirho) {
  const contentChirho = readFileSync(join(OUTPUT_DIR_CHIRHO, fileChirho), "utf-8");
  // Skip the header when appending
  const contentWithoutHeaderChirho = contentChirho.split("\n").slice(6).join("\n");
  combinedSqlChirho += `\n-- === ${fileChirho} ===\n${contentWithoutHeaderChirho}\n`;
}

writeFileSync(allVersesSqlPathChirho, combinedSqlChirho);
console.log(`Updated all-verses-chirho.sql with ${allFilesChirho.length} verse files.`);
