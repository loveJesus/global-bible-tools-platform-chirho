// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate Indonesian translations for Hebrews 7-10
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const outputDirChirho = '/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho/translations-chirho/hebrews-ind-chirho';

// Indonesian translation glosses for Hebrews 7-10
// Following conventions: Allah (God), Tuhan (Lord), Yesus (Jesus), Kristus (Christ)
// Key terms: iman (faith), imam besar (high priest), perjanjian (covenant), korban (sacrifice)

interface WordGlossChirho {
  wordIdChirho: string;
  greekChirho: string;
  lemmaChirho: string;
  glossChirho: string;
}

// Hebrews Chapter 7 translations
const chapter7GlossesChirho: WordGlossChirho[] = [
  // Verse 1
  { wordIdChirho: "5800700101", greekChirho: "Οὗτος", lemmaChirho: "G3778", glossChirho: "Ini" },
  { wordIdChirho: "5800700102", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800700103", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700104", greekChirho: "Μελχισέδεκ,", lemmaChirho: "G3198", glossChirho: "Melkisedek" },
  { wordIdChirho: "5800700105", greekChirho: "βασιλεὺς", lemmaChirho: "G0935", glossChirho: "raja" },
  { wordIdChirho: "5800700106", greekChirho: "Σαλήμ,", lemmaChirho: "G4532", glossChirho: "Salem" },
  { wordIdChirho: "5800700107", greekChirho: "ἱερεὺς", lemmaChirho: "G2409", glossChirho: "imam" },
  { wordIdChirho: "5800700108", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5800700109", greekChirho: "Θεοῦ", lemmaChirho: "G2316", glossChirho: "Allah" },
  { wordIdChirho: "5800700110", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700111", greekChirho: "Ὑψίστου,", lemmaChirho: "G5310", glossChirho: "Mahatinggi" },
  { wordIdChirho: "5800700112", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700113", greekChirho: "συναντήσας", lemmaChirho: "G4876", glossChirho: "yang–telah–bertemu" },
  { wordIdChirho: "5800700114", greekChirho: "Ἀβραὰμ", lemmaChirho: "G0011", glossChirho: "Abraham" },
  { wordIdChirho: "5800700115", greekChirho: "ὑποστρέφοντι", lemmaChirho: "G5290", glossChirho: "yang–kembali" },
  { wordIdChirho: "5800700116", greekChirho: "ἀπὸ", lemmaChirho: "G0575", glossChirho: "dari–" },
  { wordIdChirho: "5800700117", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700118", greekChirho: "κοπῆς", lemmaChirho: "G2871", glossChirho: "pembunuhan" },
  { wordIdChirho: "5800700119", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5800700120", greekChirho: "βασιλέων,", lemmaChirho: "G0935", glossChirho: "raja–raja" },
  { wordIdChirho: "5800700121", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800700122", greekChirho: "εὐλογήσας", lemmaChirho: "G2127", glossChirho: "yang–telah–memberkati" },
  { wordIdChirho: "5800700123", greekChirho: "αὐτόν;", lemmaChirho: "G0846", glossChirho: "dia" },
  // Verse 2
  { wordIdChirho: "5800700201", greekChirho: "ᾧ", lemmaChirho: "G3739", glossChirho: "kepadanya" },
  { wordIdChirho: "5800700202", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800700203", greekChirho: "δεκάτην", lemmaChirho: "G1181", glossChirho: "persepuluhan" },
  { wordIdChirho: "5800700204", greekChirho: "ἀπὸ", lemmaChirho: "G0575", glossChirho: "dari–" },
  { wordIdChirho: "5800700205", greekChirho: "πάντων", lemmaChirho: "G3956", glossChirho: "segala–sesuatu" },
  { wordIdChirho: "5800700206", greekChirho: "ἐμέρισεν", lemmaChirho: "G3307", glossChirho: "telah–membagikan" },
  { wordIdChirho: "5800700207", greekChirho: "Ἀβραάμ.", lemmaChirho: "G0011", glossChirho: "Abraham" },
  { wordIdChirho: "5800700208", greekChirho: "πρῶτον", lemmaChirho: "G4412", glossChirho: "pertama–tama" },
  { wordIdChirho: "5800700209", greekChirho: "μὲν", lemmaChirho: "G3303", glossChirho: "memang" },
  { wordIdChirho: "5800700210", greekChirho: "ἑρμηνευόμενος,", lemmaChirho: "G2059", glossChirho: "yang–diterjemahkan" },
  { wordIdChirho: "5800700211", greekChirho: "βασιλεὺς", lemmaChirho: "G0935", glossChirho: "raja" },
  { wordIdChirho: "5800700212", greekChirho: "δικαιοσύνης,", lemmaChirho: "G1343", glossChirho: "kebenaran" },
  { wordIdChirho: "5800700213", greekChirho: "ἔπειτα", lemmaChirho: "G1899", glossChirho: "kemudian" },
  { wordIdChirho: "5800700214", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "dan" },
  { wordIdChirho: "5800700215", greekChirho: "καὶ,", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800700216", greekChirho: "βασιλεὺς", lemmaChirho: "G0935", glossChirho: "raja" },
  { wordIdChirho: "5800700217", greekChirho: "Σαλήμ,", lemmaChirho: "G4532", glossChirho: "Salem" },
  { wordIdChirho: "5800700218", greekChirho: "ὅ", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800700219", greekChirho: "ἐστιν", lemmaChirho: "G1510", glossChirho: "adalah" },
  { wordIdChirho: "5800700220", greekChirho: "βασιλεὺς", lemmaChirho: "G0935", glossChirho: "raja" },
  { wordIdChirho: "5800700221", greekChirho: "εἰρήνης;", lemmaChirho: "G1515", glossChirho: "damai–sejahtera" },
  // Verse 3
  { wordIdChirho: "5800700301", greekChirho: "ἀπάτωρ,", lemmaChirho: "G0540", glossChirho: "tanpa–ayah" },
  { wordIdChirho: "5800700302", greekChirho: "ἀμήτωρ,", lemmaChirho: "G0282", glossChirho: "tanpa–ibu" },
  { wordIdChirho: "5800700303", greekChirho: "ἀγενεαλόγητος;", lemmaChirho: "G0035", glossChirho: "tanpa–silsilah" },
  { wordIdChirho: "5800700304", greekChirho: "μήτε", lemmaChirho: "G3383", glossChirho: "tidak" },
  { wordIdChirho: "5800700305", greekChirho: "ἀρχὴν", lemmaChirho: "G0746", glossChirho: "permulaan" },
  { wordIdChirho: "5800700306", greekChirho: "ἡμερῶν,", lemmaChirho: "G2250", glossChirho: "hari–hari" },
  { wordIdChirho: "5800700307", greekChirho: "μήτε", lemmaChirho: "G3383", glossChirho: "tidak–pula" },
  { wordIdChirho: "5800700308", greekChirho: "ζωῆς", lemmaChirho: "G2222", glossChirho: "kehidupan" },
  { wordIdChirho: "5800700309", greekChirho: "τέλος", lemmaChirho: "G5056", glossChirho: "akhir" },
  { wordIdChirho: "5800700310", greekChirho: "ἔχων;", lemmaChirho: "G2192", glossChirho: "mempunyai" },
  { wordIdChirho: "5800700311", greekChirho: "ἀφωμοιωμένος", lemmaChirho: "G0871", glossChirho: "yang–diserupakan" },
  { wordIdChirho: "5800700312", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "tetapi" },
  { wordIdChirho: "5800700313", greekChirho: "τῷ", lemmaChirho: "G3588", glossChirho: "dengan–sang–" },
  { wordIdChirho: "5800700314", greekChirho: "Υἱῷ", lemmaChirho: "G5207", glossChirho: "Anak" },
  { wordIdChirho: "5800700315", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5800700316", greekChirho: "Θεοῦ,", lemmaChirho: "G2316", glossChirho: "Allah" },
  { wordIdChirho: "5800700317", greekChirho: "μένει", lemmaChirho: "G3306", glossChirho: "tinggal" },
  { wordIdChirho: "5800700318", greekChirho: "ἱερεὺς", lemmaChirho: "G2409", glossChirho: "imam" },
  { wordIdChirho: "5800700319", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800700320", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700321", greekChirho: "διηνεκές.", lemmaChirho: "G1336", glossChirho: "selama–lamanya" },
  // Verse 4
  { wordIdChirho: "5800700401", greekChirho: "Θεωρεῖτε", lemmaChirho: "G2334", glossChirho: "Lihatlah" },
  { wordIdChirho: "5800700402", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "dan" },
  { wordIdChirho: "5800700403", greekChirho: "πηλίκος", lemmaChirho: "G4080", glossChirho: "betapa–besarnya" },
  { wordIdChirho: "5800700404", greekChirho: "οὗτος,", lemmaChirho: "G3778", glossChirho: "orang–ini" },
  { wordIdChirho: "5800700405", greekChirho: "ᾧ", lemmaChirho: "G3739", glossChirho: "kepadanya" },
  { wordIdChirho: "5800700406", greekChirho: "[καὶ]", lemmaChirho: "G2532", glossChirho: "bahkan" },
  { wordIdChirho: "5800700407", greekChirho: "δεκάτην", lemmaChirho: "G1181", glossChirho: "persepuluhan" },
  { wordIdChirho: "5800700408", greekChirho: "Ἀβραὰμ", lemmaChirho: "G0011", glossChirho: "Abraham" },
  { wordIdChirho: "5800700409", greekChirho: "ἔδωκεν,", lemmaChirho: "G1325", glossChirho: "telah–memberikan" },
  { wordIdChirho: "5800700410", greekChirho: "ἐκ", lemmaChirho: "G1537", glossChirho: "dari–" },
  { wordIdChirho: "5800700411", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700412", greekChirho: "ἀκροθινίων,", lemmaChirho: "G0205", glossChirho: "rampasan–terbaik" },
  { wordIdChirho: "5800700413", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700414", greekChirho: "πατριάρχης.", lemmaChirho: "G3966", glossChirho: "bapa–leluhur" },
  // Verse 5
  { wordIdChirho: "5800700501", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "Dan" },
  { wordIdChirho: "5800700502", greekChirho: "οἱ", lemmaChirho: "G3588", glossChirho: "para–" },
  { wordIdChirho: "5800700503", greekChirho: "μὲν,", lemmaChirho: "G3303", glossChirho: "memang" },
  { wordIdChirho: "5800700504", greekChirho: "ἐκ", lemmaChirho: "G1537", glossChirho: "dari–" },
  { wordIdChirho: "5800700505", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "para–" },
  { wordIdChirho: "5800700506", greekChirho: "υἱῶν", lemmaChirho: "G5207", glossChirho: "anak–anak" },
  { wordIdChirho: "5800700507", greekChirho: "Λευὶ,", lemmaChirho: "G3017", glossChirho: "Lewi" },
  { wordIdChirho: "5800700508", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700509", greekChirho: "ἱερατείαν", lemmaChirho: "G2405", glossChirho: "keimaman" },
  { wordIdChirho: "5800700510", greekChirho: "λαμβάνοντες,", lemmaChirho: "G2983", glossChirho: "yang–menerima" },
  { wordIdChirho: "5800700511", greekChirho: "ἐντολὴν", lemmaChirho: "G1785", glossChirho: "perintah" },
  { wordIdChirho: "5800700512", greekChirho: "ἔχουσιν", lemmaChirho: "G2192", glossChirho: "mempunyai" },
  { wordIdChirho: "5800700513", greekChirho: "ἀποδεκατοῦν", lemmaChirho: "G0586", glossChirho: "untuk–memungut–persepuluhan–dari" },
  { wordIdChirho: "5800700514", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700515", greekChirho: "λαὸν,", lemmaChirho: "G2992", glossChirho: "umat" },
  { wordIdChirho: "5800700516", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800700517", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700518", greekChirho: "νόμον,", lemmaChirho: "G3551", glossChirho: "hukum–Taurat" },
  { wordIdChirho: "5800700519", greekChirho: "τοῦτ'", lemmaChirho: "G3778", glossChirho: "yaitu" },
  { wordIdChirho: "5800700520", greekChirho: "ἔστιν,", lemmaChirho: "G1510", glossChirho: "adalah" },
  { wordIdChirho: "5800700521", greekChirho: "τοὺς", lemmaChirho: "G3588", glossChirho: "para–" },
  { wordIdChirho: "5800700522", greekChirho: "ἀδελφοὺς", lemmaChirho: "G0080", glossChirho: "saudara" },
  { wordIdChirho: "5800700523", greekChirho: "αὐτῶν,", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800700524", greekChirho: "καίπερ", lemmaChirho: "G2539", glossChirho: "meskipun" },
  { wordIdChirho: "5800700525", greekChirho: "ἐξεληλυθότας", lemmaChirho: "G1831", glossChirho: "yang–telah–keluar" },
  { wordIdChirho: "5800700526", greekChirho: "ἐκ", lemmaChirho: "G1537", glossChirho: "dari–" },
  { wordIdChirho: "5800700527", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700528", greekChirho: "ὀσφύος", lemmaChirho: "G3751", glossChirho: "pinggang" },
  { wordIdChirho: "5800700529", greekChirho: "Ἀβραάμ.", lemmaChirho: "G0011", glossChirho: "Abraham" },
  // Verse 6
  { wordIdChirho: "5800700601", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700602", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "Tetapi" },
  { wordIdChirho: "5800700603", greekChirho: "μὴ", lemmaChirho: "G3361", glossChirho: "tidak" },
  { wordIdChirho: "5800700604", greekChirho: "γενεαλογούμενος", lemmaChirho: "G1075", glossChirho: "yang–mempunyai–silsilah" },
  { wordIdChirho: "5800700605", greekChirho: "ἐξ", lemmaChirho: "G1537", glossChirho: "dari–" },
  { wordIdChirho: "5800700606", greekChirho: "αὐτῶν,", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800700607", greekChirho: "δεδεκάτωκεν", lemmaChirho: "G1183", glossChirho: "telah–memungut–persepuluhan–dari" },
  { wordIdChirho: "5800700608", greekChirho: "Ἀβραάμ;", lemmaChirho: "G0011", glossChirho: "Abraham" },
  { wordIdChirho: "5800700609", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800700610", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700611", greekChirho: "ἔχοντα", lemmaChirho: "G2192", glossChirho: "yang–mempunyai" },
  { wordIdChirho: "5800700612", greekChirho: "τὰς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700613", greekChirho: "ἐπαγγελίας,", lemmaChirho: "G1860", glossChirho: "janji–janji" },
  { wordIdChirho: "5800700614", greekChirho: "εὐλόγηκεν.", lemmaChirho: "G2127", glossChirho: "telah–memberkati" },
  // Verse 7
  { wordIdChirho: "5800700701", greekChirho: "χωρὶς", lemmaChirho: "G5565", glossChirho: "Tanpa" },
  { wordIdChirho: "5800700702", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "dan" },
  { wordIdChirho: "5800700703", greekChirho: "πάσης", lemmaChirho: "G3956", glossChirho: "segala" },
  { wordIdChirho: "5800700704", greekChirho: "ἀντιλογίας,", lemmaChirho: "G0485", glossChirho: "pertentangan" },
  { wordIdChirho: "5800700705", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700706", greekChirho: "ἔλαττον", lemmaChirho: "G1640", glossChirho: "yang–lebih–rendah" },
  { wordIdChirho: "5800700707", greekChirho: "ὑπὸ", lemmaChirho: "G5259", glossChirho: "oleh–" },
  { wordIdChirho: "5800700708", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700709", greekChirho: "κρείττονος", lemmaChirho: "G2909", glossChirho: "yang–lebih–tinggi" },
  { wordIdChirho: "5800700710", greekChirho: "εὐλογεῖται.", lemmaChirho: "G2127", glossChirho: "diberkati" },
  // Verse 8
  { wordIdChirho: "5800700801", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "Dan" },
  { wordIdChirho: "5800700802", greekChirho: "ὧδε", lemmaChirho: "G5602", glossChirho: "di–sini" },
  { wordIdChirho: "5800700803", greekChirho: "μὲν,", lemmaChirho: "G3303", glossChirho: "memang" },
  { wordIdChirho: "5800700804", greekChirho: "δεκάτας,", lemmaChirho: "G1181", glossChirho: "persepuluhan" },
  { wordIdChirho: "5800700805", greekChirho: "ἀποθνῄσκοντες", lemmaChirho: "G0599", glossChirho: "yang–fana" },
  { wordIdChirho: "5800700806", greekChirho: "ἄνθρωποι,", lemmaChirho: "G0444", glossChirho: "manusia" },
  { wordIdChirho: "5800700807", greekChirho: "λαμβάνουσιν;", lemmaChirho: "G2983", glossChirho: "menerima" },
  { wordIdChirho: "5800700808", greekChirho: "ἐκεῖ", lemmaChirho: "G1563", glossChirho: "di–sana" },
  { wordIdChirho: "5800700809", greekChirho: "δὲ,", lemmaChirho: "G1161", glossChirho: "tetapi" },
  { wordIdChirho: "5800700810", greekChirho: "μαρτυρούμενος", lemmaChirho: "G3140", glossChirho: "yang–disaksikan" },
  { wordIdChirho: "5800700811", greekChirho: "ὅτι", lemmaChirho: "G3754", glossChirho: "bahwa" },
  { wordIdChirho: "5800700812", greekChirho: "ζῇ;", lemmaChirho: "G2198", glossChirho: "ia–hidup" },
  // Verse 9
  { wordIdChirho: "5800700901", greekChirho: "καὶ,", lemmaChirho: "G2532", glossChirho: "Dan" },
  { wordIdChirho: "5800700902", greekChirho: "ὡς", lemmaChirho: "G5613", glossChirho: "seperti" },
  { wordIdChirho: "5800700903", greekChirho: "ἔπος", lemmaChirho: "G2031", glossChirho: "kata" },
  { wordIdChirho: "5800700904", greekChirho: "εἰπεῖν:", lemmaChirho: "G3004", glossChirho: "untuk–dikatakan" },
  { wordIdChirho: "5800700905", greekChirho: "δι'", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5800700906", greekChirho: "Ἀβραὰμ", lemmaChirho: "G0011", glossChirho: "Abraham" },
  { wordIdChirho: "5800700907", greekChirho: "καὶ,", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800700908", greekChirho: "Λευὶ,", lemmaChirho: "G3017", glossChirho: "Lewi" },
  { wordIdChirho: "5800700909", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800700910", greekChirho: "δεκάτας", lemmaChirho: "G1181", glossChirho: "persepuluhan" },
  { wordIdChirho: "5800700911", greekChirho: "λαμβάνων,", lemmaChirho: "G2983", glossChirho: "yang–menerima" },
  { wordIdChirho: "5800700912", greekChirho: "δεδεκάτωται.", lemmaChirho: "G1183", glossChirho: "telah–dipungut–persepuluhannya" },
  // Verse 10
  { wordIdChirho: "5800701001", greekChirho: "ἔτι", lemmaChirho: "G2089", glossChirho: "Masih" },
  { wordIdChirho: "5800701002", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800701003", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "di–dalam–" },
  { wordIdChirho: "5800701004", greekChirho: "τῇ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701005", greekChirho: "ὀσφύϊ", lemmaChirho: "G3751", glossChirho: "pinggang" },
  { wordIdChirho: "5800701006", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5800701007", greekChirho: "πατρὸς", lemmaChirho: "G3962", glossChirho: "bapa" },
  { wordIdChirho: "5800701008", greekChirho: "ἦν,", lemmaChirho: "G1510", glossChirho: "ia–ada" },
  { wordIdChirho: "5800701009", greekChirho: "ὅτε", lemmaChirho: "G3753", glossChirho: "ketika" },
  { wordIdChirho: "5800701010", greekChirho: "συνήντησεν", lemmaChirho: "G4876", glossChirho: "bertemu" },
  { wordIdChirho: "5800701011", greekChirho: "αὐτῷ", lemmaChirho: "G0846", glossChirho: "dengannya" },
  { wordIdChirho: "5800701012", greekChirho: "Μελχισέδεκ.", lemmaChirho: "G3198", glossChirho: "Melkisedek" },
  // Verse 11
  { wordIdChirho: "5800701101", greekChirho: "Εἰ", lemmaChirho: "G1487", glossChirho: "Jika" },
  { wordIdChirho: "5800701102", greekChirho: "μὲν", lemmaChirho: "G3303", glossChirho: "memang" },
  { wordIdChirho: "5800701103", greekChirho: "οὖν,", lemmaChirho: "G3767", glossChirho: "maka" },
  { wordIdChirho: "5800701104", greekChirho: "τελείωσις", lemmaChirho: "G5050", glossChirho: "kesempurnaan" },
  { wordIdChirho: "5800701105", greekChirho: "διὰ", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5800701106", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701107", greekChirho: "Λευιτικῆς", lemmaChirho: "G3020", glossChirho: "Lewi" },
  { wordIdChirho: "5800701108", greekChirho: "ἱερωσύνης", lemmaChirho: "G2420", glossChirho: "keimaman" },
  { wordIdChirho: "5800701109", greekChirho: "ἦν,", lemmaChirho: "G1510", glossChirho: "ada" },
  { wordIdChirho: "5800701110", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701111", greekChirho: "λαὸς", lemmaChirho: "G2992", glossChirho: "umat" },
  { wordIdChirho: "5800701112", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800701113", greekChirho: "ἐπ'", lemmaChirho: "G1909", glossChirho: "atas–" },
  { wordIdChirho: "5800701114", greekChirho: "αὐτῆς", lemmaChirho: "G0846", glossChirho: "dasarnya" },
  { wordIdChirho: "5800701115", greekChirho: "νενομοθέτηται,", lemmaChirho: "G3549", glossChirho: "telah–menerima–hukum–Taurat" },
  { wordIdChirho: "5800701116", greekChirho: "τίς", lemmaChirho: "G5101", glossChirho: "apakah" },
  { wordIdChirho: "5800701117", greekChirho: "ἔτι", lemmaChirho: "G2089", glossChirho: "masih" },
  { wordIdChirho: "5800701118", greekChirho: "χρεία,", lemmaChirho: "G5532", glossChirho: "kebutuhan" },
  { wordIdChirho: "5800701119", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800701120", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701121", greekChirho: "τάξιν", lemmaChirho: "G5010", glossChirho: "peraturan" },
  { wordIdChirho: "5800701122", greekChirho: "Μελχισέδεκ,", lemmaChirho: "G3198", glossChirho: "Melkisedek" },
  { wordIdChirho: "5800701123", greekChirho: "ἕτερον", lemmaChirho: "G2087", glossChirho: "lain" },
  { wordIdChirho: "5800701124", greekChirho: "ἀνίστασθαι", lemmaChirho: "G0450", glossChirho: "untuk–bangkit" },
  { wordIdChirho: "5800701125", greekChirho: "ἱερέα,", lemmaChirho: "G2409", glossChirho: "imam" },
  { wordIdChirho: "5800701126", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800701127", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800701128", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800701129", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701130", greekChirho: "τάξιν", lemmaChirho: "G5010", glossChirho: "peraturan" },
  { wordIdChirho: "5800701131", greekChirho: "Ἀαρὼν", lemmaChirho: "G0002", glossChirho: "Harun" },
  { wordIdChirho: "5800701132", greekChirho: "λέγεσθαι?", lemmaChirho: "G3004", glossChirho: "disebut" },
  // Verse 12
  { wordIdChirho: "5800701201", greekChirho: "μετατιθεμένης", lemmaChirho: "G3346", glossChirho: "Apabila–berubah" },
  { wordIdChirho: "5800701202", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800701203", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701204", greekChirho: "ἱερωσύνης,", lemmaChirho: "G2420", glossChirho: "keimaman" },
  { wordIdChirho: "5800701205", greekChirho: "ἐξ", lemmaChirho: "G1537", glossChirho: "dengan–" },
  { wordIdChirho: "5800701206", greekChirho: "ἀνάγκης", lemmaChirho: "G0318", glossChirho: "keharusan" },
  { wordIdChirho: "5800701207", greekChirho: "καὶ,", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800701208", greekChirho: "νόμου", lemmaChirho: "G3551", glossChirho: "hukum–Taurat" },
  { wordIdChirho: "5800701209", greekChirho: "μετάθεσις", lemmaChirho: "G3331", glossChirho: "perubahan" },
  { wordIdChirho: "5800701210", greekChirho: "γίνεται.", lemmaChirho: "G1096", glossChirho: "terjadi" },
  // Verse 13
  { wordIdChirho: "5800701301", greekChirho: "ἐφ'", lemmaChirho: "G1909", glossChirho: "Tentang–" },
  { wordIdChirho: "5800701302", greekChirho: "ὃν", lemmaChirho: "G3739", glossChirho: "siapa" },
  { wordIdChirho: "5800701303", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800701304", greekChirho: "λέγεται", lemmaChirho: "G3004", glossChirho: "dikatakan" },
  { wordIdChirho: "5800701305", greekChirho: "ταῦτα,", lemmaChirho: "G3778", glossChirho: "hal–hal–ini" },
  { wordIdChirho: "5800701306", greekChirho: "φυλῆς", lemmaChirho: "G5443", glossChirho: "suku" },
  { wordIdChirho: "5800701307", greekChirho: "ἑτέρας", lemmaChirho: "G2087", glossChirho: "lain" },
  { wordIdChirho: "5800701308", greekChirho: "μετέσχηκεν,", lemmaChirho: "G3348", glossChirho: "telah–menjadi–bagian" },
  { wordIdChirho: "5800701309", greekChirho: "ἀφ'", lemmaChirho: "G0575", glossChirho: "dari–" },
  { wordIdChirho: "5800701310", greekChirho: "ἧς", lemmaChirho: "G3739", glossChirho: "mana" },
  { wordIdChirho: "5800701311", greekChirho: "οὐδεὶς", lemmaChirho: "G3762", glossChirho: "tidak–seorangpun" },
  { wordIdChirho: "5800701312", greekChirho: "προσέσχηκεν", lemmaChirho: "G4337", glossChirho: "telah–melayani" },
  { wordIdChirho: "5800701313", greekChirho: "τῷ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701314", greekChirho: "θυσιαστηρίῳ.", lemmaChirho: "G2379", glossChirho: "mezbah" },
  // Verse 14
  { wordIdChirho: "5800701401", greekChirho: "πρόδηλον", lemmaChirho: "G4271", glossChirho: "Jelas" },
  { wordIdChirho: "5800701402", greekChirho: "γὰρ,", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800701403", greekChirho: "ὅτι", lemmaChirho: "G3754", glossChirho: "bahwa" },
  { wordIdChirho: "5800701404", greekChirho: "ἐξ", lemmaChirho: "G1537", glossChirho: "dari–" },
  { wordIdChirho: "5800701405", greekChirho: "Ἰούδα", lemmaChirho: "G2448", glossChirho: "Yehuda" },
  { wordIdChirho: "5800701406", greekChirho: "ἀνατέταλκεν", lemmaChirho: "G0393", glossChirho: "telah–terbit" },
  { wordIdChirho: "5800701407", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701408", greekChirho: "Κύριος", lemmaChirho: "G2962", glossChirho: "Tuhan" },
  { wordIdChirho: "5800701409", greekChirho: "ἡμῶν,", lemmaChirho: "G1473", glossChirho: "kita" },
  { wordIdChirho: "5800701410", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "tentang–" },
  { wordIdChirho: "5800701411", greekChirho: "ἣν", lemmaChirho: "G3739", glossChirho: "yang–mana" },
  { wordIdChirho: "5800701412", greekChirho: "φυλὴν,", lemmaChirho: "G5443", glossChirho: "suku" },
  { wordIdChirho: "5800701413", greekChirho: "περὶ", lemmaChirho: "G4012", glossChirho: "tentang–" },
  { wordIdChirho: "5800701414", greekChirho: "ἱερέων,", lemmaChirho: "G2409", glossChirho: "para–imam" },
  { wordIdChirho: "5800701415", greekChirho: "οὐδὲν", lemmaChirho: "G3762", glossChirho: "tidak–ada–sesuatu" },
  { wordIdChirho: "5800701416", greekChirho: "Μωϋσῆς", lemmaChirho: "G3475", glossChirho: "Musa" },
  { wordIdChirho: "5800701417", greekChirho: "ἐλάλησεν.", lemmaChirho: "G2980", glossChirho: "berbicara" },
  // Verse 15
  { wordIdChirho: "5800701501", greekChirho: "Καὶ", lemmaChirho: "G2532", glossChirho: "Dan" },
  { wordIdChirho: "5800701502", greekChirho: "περισσότερον", lemmaChirho: "G4053", glossChirho: "lebih–jelas" },
  { wordIdChirho: "5800701503", greekChirho: "ἔτι", lemmaChirho: "G2089", glossChirho: "lagi" },
  { wordIdChirho: "5800701504", greekChirho: "κατάδηλόν", lemmaChirho: "G2612", glossChirho: "nyata" },
  { wordIdChirho: "5800701505", greekChirho: "ἐστιν,", lemmaChirho: "G1510", glossChirho: "adalah" },
  { wordIdChirho: "5800701506", greekChirho: "εἰ", lemmaChirho: "G1487", glossChirho: "jika" },
  { wordIdChirho: "5800701507", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800701508", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701509", greekChirho: "ὁμοιότητα", lemmaChirho: "G3665", glossChirho: "keserupaan" },
  { wordIdChirho: "5800701510", greekChirho: "Μελχισέδεκ,", lemmaChirho: "G3198", glossChirho: "Melkisedek" },
  { wordIdChirho: "5800701511", greekChirho: "ἀνίσταται", lemmaChirho: "G0450", glossChirho: "bangkit" },
  { wordIdChirho: "5800701512", greekChirho: "ἱερεὺς", lemmaChirho: "G2409", glossChirho: "imam" },
  { wordIdChirho: "5800701513", greekChirho: "ἕτερος,", lemmaChirho: "G2087", glossChirho: "lain" },
  // Verse 16
  { wordIdChirho: "5800701601", greekChirho: "ὃς", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800701602", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800701603", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800701604", greekChirho: "νόμον", lemmaChirho: "G3551", glossChirho: "hukum" },
  { wordIdChirho: "5800701605", greekChirho: "ἐντολῆς", lemmaChirho: "G1785", glossChirho: "perintah" },
  { wordIdChirho: "5800701606", greekChirho: "σαρκίνης,", lemmaChirho: "G4560", glossChirho: "daging" },
  { wordIdChirho: "5800701607", greekChirho: "γέγονεν,", lemmaChirho: "G1096", glossChirho: "telah–menjadi" },
  { wordIdChirho: "5800701608", greekChirho: "ἀλλὰ", lemmaChirho: "G0235", glossChirho: "tetapi" },
  { wordIdChirho: "5800701609", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800701610", greekChirho: "δύναμιν", lemmaChirho: "G1411", glossChirho: "kuasa" },
  { wordIdChirho: "5800701611", greekChirho: "ζωῆς", lemmaChirho: "G2222", glossChirho: "kehidupan" },
  { wordIdChirho: "5800701612", greekChirho: "ἀκαταλύτου.", lemmaChirho: "G0179", glossChirho: "yang–tidak–dapat–dibinasakan" },
  // Verse 17
  { wordIdChirho: "5800701701", greekChirho: "μαρτυρεῖται", lemmaChirho: "G3140", glossChirho: "Disaksikan" },
  { wordIdChirho: "5800701702", greekChirho: "γὰρ,", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800701703", greekChirho: "ὅτι", lemmaChirho: "G3754", glossChirho: "bahwa" },
  { wordIdChirho: "5800701704", greekChirho: "Σὺ", lemmaChirho: "G4771", glossChirho: "Engkau" },
  { wordIdChirho: "5800701705", greekChirho: "ἱερεὺς", lemmaChirho: "G2409", glossChirho: "imam" },
  { wordIdChirho: "5800701706", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800701707", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701708", greekChirho: "αἰῶνα,", lemmaChirho: "G0165", glossChirho: "kekekalan" },
  { wordIdChirho: "5800701709", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800701710", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701711", greekChirho: "τάξιν", lemmaChirho: "G5010", glossChirho: "peraturan" },
  { wordIdChirho: "5800701712", greekChirho: "Μελχισέδεκ.", lemmaChirho: "G3198", glossChirho: "Melkisedek" },
  // Verse 18
  { wordIdChirho: "5800701801", greekChirho: "ἀθέτησις", lemmaChirho: "G0115", glossChirho: "Pembatalan" },
  { wordIdChirho: "5800701802", greekChirho: "μὲν", lemmaChirho: "G3303", glossChirho: "memang" },
  { wordIdChirho: "5800701803", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800701804", greekChirho: "γίνεται", lemmaChirho: "G1096", glossChirho: "terjadi" },
  { wordIdChirho: "5800701805", greekChirho: "προαγούσης", lemmaChirho: "G4254", glossChirho: "yang–terdahulu" },
  { wordIdChirho: "5800701806", greekChirho: "ἐντολῆς,", lemmaChirho: "G1785", glossChirho: "perintah" },
  { wordIdChirho: "5800701807", greekChirho: "διὰ", lemmaChirho: "G1223", glossChirho: "karena–" },
  { wordIdChirho: "5800701808", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701809", greekChirho: "αὐτῆς", lemmaChirho: "G0846", glossChirho: "nya" },
  { wordIdChirho: "5800701810", greekChirho: "ἀσθενὲς,", lemmaChirho: "G0772", glossChirho: "kelemahan" },
  { wordIdChirho: "5800701811", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800701812", greekChirho: "ἀνωφελές -- ", lemmaChirho: "G0512", glossChirho: "ketidakbergunaan" },
  // Verse 19
  { wordIdChirho: "5800701901", greekChirho: "οὐδὲν", lemmaChirho: "G3762", glossChirho: "tidak–ada–sesuatu" },
  { wordIdChirho: "5800701902", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800701903", greekChirho: "ἐτελείωσεν", lemmaChirho: "G5048", glossChirho: "disempurnakan" },
  { wordIdChirho: "5800701904", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800701905", greekChirho: "νόμος", lemmaChirho: "G3551", glossChirho: "hukum–Taurat" },
  { wordIdChirho: "5800701906", greekChirho: "ἐπεισαγωγὴ", lemmaChirho: "G1898", glossChirho: "pengenalan" },
  { wordIdChirho: "5800701907", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "tetapi" },
  { wordIdChirho: "5800701908", greekChirho: "κρείττονος", lemmaChirho: "G2909", glossChirho: "yang–lebih–baik" },
  { wordIdChirho: "5800701909", greekChirho: "ἐλπίδος,", lemmaChirho: "G1680", glossChirho: "pengharapan" },
  { wordIdChirho: "5800701910", greekChirho: "δι'", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5800701911", greekChirho: "ἧς", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800701912", greekChirho: "ἐγγίζομεν", lemmaChirho: "G1448", glossChirho: "kita–mendekat" },
  { wordIdChirho: "5800701913", greekChirho: "τῷ", lemmaChirho: "G3588", glossChirho: "kepada–sang–" },
  { wordIdChirho: "5800701914", greekChirho: "Θεῷ.", lemmaChirho: "G2316", glossChirho: "Allah" },
  // Verse 20
  { wordIdChirho: "5800702001", greekChirho: "Καὶ", lemmaChirho: "G2532", glossChirho: "Dan" },
  { wordIdChirho: "5800702002", greekChirho: "καθ'", lemmaChirho: "G2596", glossChirho: "sesuai–dengan–" },
  { wordIdChirho: "5800702003", greekChirho: "ὅσον", lemmaChirho: "G3745", glossChirho: "seberapa" },
  { wordIdChirho: "5800702004", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800702005", greekChirho: "χωρὶς", lemmaChirho: "G5565", glossChirho: "tanpa" },
  { wordIdChirho: "5800702006", greekChirho: "ὁρκωμοσίας,", lemmaChirho: "G3728", glossChirho: "sumpah" },
  { wordIdChirho: "5800702007", greekChirho: "οἱ", lemmaChirho: "G3588", glossChirho: "para–" },
  { wordIdChirho: "5800702008", greekChirho: "μὲν", lemmaChirho: "G3303", glossChirho: "memang" },
  { wordIdChirho: "5800702009", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800702010", greekChirho: "χωρὶς", lemmaChirho: "G5565", glossChirho: "tanpa" },
  { wordIdChirho: "5800702011", greekChirho: "ὁρκωμοσίας,", lemmaChirho: "G3728", glossChirho: "sumpah" },
  { wordIdChirho: "5800702012", greekChirho: "εἰσὶν", lemmaChirho: "G1510", glossChirho: "adalah" },
  { wordIdChirho: "5800702013", greekChirho: "ἱερεῖς", lemmaChirho: "G2409", glossChirho: "para–imam" },
  { wordIdChirho: "5800702014", greekChirho: "γεγονότες,", lemmaChirho: "G1096", glossChirho: "yang–telah–menjadi" },
  // Verse 21
  { wordIdChirho: "5800702101", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702102", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "Tetapi" },
  { wordIdChirho: "5800702103", greekChirho: "μετὰ", lemmaChirho: "G3326", glossChirho: "dengan–" },
  { wordIdChirho: "5800702104", greekChirho: "ὁρκωμοσίας,", lemmaChirho: "G3728", glossChirho: "sumpah" },
  { wordIdChirho: "5800702105", greekChirho: "διὰ", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5800702106", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702107", greekChirho: "λέγοντος,", lemmaChirho: "G3004", glossChirho: "yang–berkata" },
  { wordIdChirho: "5800702108", greekChirho: "πρὸς", lemmaChirho: "G4314", glossChirho: "kepada–" },
  { wordIdChirho: "5800702109", greekChirho: "αὐτόν", lemmaChirho: "G0846", glossChirho: "Dia" },
  { wordIdChirho: "5800702110", greekChirho: "Ὤμοσεν", lemmaChirho: "G3660", glossChirho: "Telah–bersumpah" },
  { wordIdChirho: "5800702111", greekChirho: "Κύριος,", lemmaChirho: "G2962", glossChirho: "Tuhan" },
  { wordIdChirho: "5800702112", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800702113", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800702114", greekChirho: "μεταμεληθήσεται,", lemmaChirho: "G3338", glossChirho: "akan–menyesal" },
  { wordIdChirho: "5800702115", greekChirho: "Σὺ", lemmaChirho: "G4771", glossChirho: "Engkau" },
  { wordIdChirho: "5800702116", greekChirho: "ἱερεὺς", lemmaChirho: "G2409", glossChirho: "imam" },
  { wordIdChirho: "5800702117", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800702118", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702119", greekChirho: "αἰῶνα.", lemmaChirho: "G0165", glossChirho: "kekekalan" },
  // Verse 22
  { wordIdChirho: "5800702201", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "Sesuai–dengan–" },
  { wordIdChirho: "5800702202", greekChirho: "τοσοῦτο", lemmaChirho: "G5118", glossChirho: "seberapa" },
  { wordIdChirho: "5800702203", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800702204", greekChirho: "κρείττονος", lemmaChirho: "G2909", glossChirho: "yang–lebih–baik" },
  { wordIdChirho: "5800702205", greekChirho: "διαθήκης,", lemmaChirho: "G1242", glossChirho: "perjanjian" },
  { wordIdChirho: "5800702206", greekChirho: "γέγονεν", lemmaChirho: "G1096", glossChirho: "telah–menjadi" },
  { wordIdChirho: "5800702207", greekChirho: "ἔγγυος", lemmaChirho: "G1450", glossChirho: "penjamin" },
  { wordIdChirho: "5800702208", greekChirho: "Ἰησοῦς.", lemmaChirho: "G2424", glossChirho: "Yesus" },
  // Verse 23
  { wordIdChirho: "5800702301", greekChirho: "Καὶ", lemmaChirho: "G2532", glossChirho: "Dan" },
  { wordIdChirho: "5800702302", greekChirho: "οἱ", lemmaChirho: "G3588", glossChirho: "para–" },
  { wordIdChirho: "5800702303", greekChirho: "μὲν", lemmaChirho: "G3303", glossChirho: "memang" },
  { wordIdChirho: "5800702304", greekChirho: "πλείονές", lemmaChirho: "G4119", glossChirho: "lebih–banyak" },
  { wordIdChirho: "5800702305", greekChirho: "εἰσιν", lemmaChirho: "G1510", glossChirho: "adalah" },
  { wordIdChirho: "5800702306", greekChirho: "γεγονότες", lemmaChirho: "G1096", glossChirho: "yang–telah–menjadi" },
  { wordIdChirho: "5800702307", greekChirho: "ἱερεῖς,", lemmaChirho: "G2409", glossChirho: "para–imam" },
  { wordIdChirho: "5800702308", greekChirho: "διὰ", lemmaChirho: "G1223", glossChirho: "karena–" },
  { wordIdChirho: "5800702309", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702310", greekChirho: "θανάτῳ", lemmaChirho: "G2288", glossChirho: "kematian" },
  { wordIdChirho: "5800702311", greekChirho: "κωλύεσθαι", lemmaChirho: "G2967", glossChirho: "dihalangi" },
  { wordIdChirho: "5800702312", greekChirho: "παραμένειν;", lemmaChirho: "G3887", glossChirho: "untuk–tetap" },
  // Verse 24
  { wordIdChirho: "5800702401", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702402", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "Tetapi" },
  { wordIdChirho: "5800702403", greekChirho: "διὰ", lemmaChirho: "G1223", glossChirho: "karena–" },
  { wordIdChirho: "5800702404", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702405", greekChirho: "μένειν", lemmaChirho: "G3306", glossChirho: "tetap" },
  { wordIdChirho: "5800702406", greekChirho: "αὐτὸν", lemmaChirho: "G0846", glossChirho: "Dia" },
  { wordIdChirho: "5800702407", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800702408", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702409", greekChirho: "αἰῶνα,", lemmaChirho: "G0165", glossChirho: "kekekalan" },
  { wordIdChirho: "5800702410", greekChirho: "ἀπαράβατον", lemmaChirho: "G0531", glossChirho: "yang–tidak–dapat–berubah" },
  { wordIdChirho: "5800702411", greekChirho: "ἔχει", lemmaChirho: "G2192", glossChirho: "mempunyai" },
  { wordIdChirho: "5800702412", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702413", greekChirho: "ἱερωσύνην,", lemmaChirho: "G2420", glossChirho: "keimaman" },
  // Verse 25
  { wordIdChirho: "5800702501", greekChirho: "ὅθεν", lemmaChirho: "G3606", glossChirho: "Sebab–itu" },
  { wordIdChirho: "5800702502", greekChirho: "καὶ,", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800702503", greekChirho: "σῴζειν", lemmaChirho: "G4982", glossChirho: "untuk–menyelamatkan" },
  { wordIdChirho: "5800702504", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800702505", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702506", greekChirho: "παντελὲς", lemmaChirho: "G3838", glossChirho: "sepenuhnya" },
  { wordIdChirho: "5800702507", greekChirho: "δύναται,", lemmaChirho: "G1410", glossChirho: "Dia–dapat" },
  { wordIdChirho: "5800702508", greekChirho: "τοὺς", lemmaChirho: "G3588", glossChirho: "mereka–" },
  { wordIdChirho: "5800702509", greekChirho: "προσερχομένους,", lemmaChirho: "G4334", glossChirho: "yang–datang" },
  { wordIdChirho: "5800702510", greekChirho: "δι'", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5800702511", greekChirho: "αὐτοῦ", lemmaChirho: "G0846", glossChirho: "Dia" },
  { wordIdChirho: "5800702512", greekChirho: "τῷ", lemmaChirho: "G3588", glossChirho: "kepada–sang–" },
  { wordIdChirho: "5800702513", greekChirho: "Θεῷ,", lemmaChirho: "G2316", glossChirho: "Allah" },
  { wordIdChirho: "5800702514", greekChirho: "πάντοτε", lemmaChirho: "G3842", glossChirho: "selalu" },
  { wordIdChirho: "5800702515", greekChirho: "ζῶν", lemmaChirho: "G2198", glossChirho: "yang–hidup" },
  { wordIdChirho: "5800702516", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800702517", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702518", greekChirho: "ἐντυγχάνειν", lemmaChirho: "G1793", glossChirho: "berdoa–syafaat" },
  { wordIdChirho: "5800702519", greekChirho: "ὑπὲρ", lemmaChirho: "G5228", glossChirho: "bagi–" },
  { wordIdChirho: "5800702520", greekChirho: "αὐτῶν.", lemmaChirho: "G0846", glossChirho: "mereka" },
  // Verse 26
  { wordIdChirho: "5800702601", greekChirho: "Τοιοῦτος", lemmaChirho: "G5108", glossChirho: "Demikianlah" },
  { wordIdChirho: "5800702602", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800702603", greekChirho: "ἡμῖν", lemmaChirho: "G1473", glossChirho: "bagi–kita" },
  { wordIdChirho: "5800702604", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800702605", greekChirho: "ἔπρεπεν", lemmaChirho: "G4241", glossChirho: "patut" },
  { wordIdChirho: "5800702606", greekChirho: "ἀρχιερεύς,", lemmaChirho: "G0749", glossChirho: "imam–besar" },
  { wordIdChirho: "5800702607", greekChirho: "ὅσιος,", lemmaChirho: "G3741", glossChirho: "yang–kudus" },
  { wordIdChirho: "5800702608", greekChirho: "ἄκακος,", lemmaChirho: "G0172", glossChirho: "tidak–bercela" },
  { wordIdChirho: "5800702609", greekChirho: "ἀμίαντος,", lemmaChirho: "G0283", glossChirho: "tanpa–noda" },
  { wordIdChirho: "5800702610", greekChirho: "κεχωρισμένος", lemmaChirho: "G5563", glossChirho: "yang–terpisah" },
  { wordIdChirho: "5800702611", greekChirho: "ἀπὸ", lemmaChirho: "G0575", glossChirho: "dari–" },
  { wordIdChirho: "5800702612", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "para–" },
  { wordIdChirho: "5800702613", greekChirho: "ἁμαρτωλῶν,", lemmaChirho: "G0268", glossChirho: "orang–berdosa" },
  { wordIdChirho: "5800702614", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800702615", greekChirho: "ὑψηλότερος", lemmaChirho: "G5308", glossChirho: "lebih–tinggi" },
  { wordIdChirho: "5800702616", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "dari–" },
  { wordIdChirho: "5800702617", greekChirho: "οὐρανῶν", lemmaChirho: "G3772", glossChirho: "langit–langit" },
  { wordIdChirho: "5800702618", greekChirho: "γενόμενος;", lemmaChirho: "G1096", glossChirho: "yang–telah–menjadi" },
  // Verse 27
  { wordIdChirho: "5800702701", greekChirho: "ὃς", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800702702", greekChirho: "οὐκ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800702703", greekChirho: "ἔχει", lemmaChirho: "G2192", glossChirho: "mempunyai" },
  { wordIdChirho: "5800702704", greekChirho: "καθ'", lemmaChirho: "G2596", glossChirho: "setiap–" },
  { wordIdChirho: "5800702705", greekChirho: "ἡμέραν", lemmaChirho: "G2250", glossChirho: "hari" },
  { wordIdChirho: "5800702706", greekChirho: "ἀνάγκην,", lemmaChirho: "G0318", glossChirho: "keharusan" },
  { wordIdChirho: "5800702707", greekChirho: "ὥσπερ", lemmaChirho: "G5618", glossChirho: "seperti" },
  { wordIdChirho: "5800702708", greekChirho: "οἱ", lemmaChirho: "G3588", glossChirho: "para–" },
  { wordIdChirho: "5800702709", greekChirho: "ἀρχιερεῖς,", lemmaChirho: "G0749", glossChirho: "imam–besar" },
  { wordIdChirho: "5800702710", greekChirho: "πρότερον", lemmaChirho: "G4386", glossChirho: "dahulu" },
  { wordIdChirho: "5800702711", greekChirho: "ὑπὲρ", lemmaChirho: "G5228", glossChirho: "untuk–" },
  { wordIdChirho: "5800702712", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702713", greekChirho: "ἰδίων", lemmaChirho: "G2398", glossChirho: "sendiri" },
  { wordIdChirho: "5800702714", greekChirho: "ἁμαρτιῶν,", lemmaChirho: "G0266", glossChirho: "dosa–dosa" },
  { wordIdChirho: "5800702715", greekChirho: "θυσίας", lemmaChirho: "G2378", glossChirho: "korban" },
  { wordIdChirho: "5800702716", greekChirho: "ἀναφέρειν,", lemmaChirho: "G0399", glossChirho: "mempersembahkan" },
  { wordIdChirho: "5800702717", greekChirho: "ἔπειτα", lemmaChirho: "G1899", glossChirho: "kemudian" },
  { wordIdChirho: "5800702718", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "dari–" },
  { wordIdChirho: "5800702719", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702720", greekChirho: "λαοῦ;", lemmaChirho: "G2992", glossChirho: "umat" },
  { wordIdChirho: "5800702721", greekChirho: "τοῦτο", lemmaChirho: "G3778", glossChirho: "ini" },
  { wordIdChirho: "5800702722", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800702723", greekChirho: "ἐποίησεν", lemmaChirho: "G4160", glossChirho: "Dia–telah–lakukan" },
  { wordIdChirho: "5800702724", greekChirho: "ἐφάπαξ,", lemmaChirho: "G2178", glossChirho: "sekali–untuk–selamanya" },
  { wordIdChirho: "5800702725", greekChirho: "ἑαυτὸν", lemmaChirho: "G1438", glossChirho: "diri–Nya–sendiri" },
  { wordIdChirho: "5800702726", greekChirho: "ἀνενέγκας.", lemmaChirho: "G0399", glossChirho: "dengan–mempersembahkan" },
  // Verse 28
  { wordIdChirho: "5800702801", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702802", greekChirho: "νόμος", lemmaChirho: "G3551", glossChirho: "Hukum–Taurat" },
  { wordIdChirho: "5800702803", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800702804", greekChirho: "ἀνθρώπους", lemmaChirho: "G0444", glossChirho: "manusia" },
  { wordIdChirho: "5800702805", greekChirho: "καθίστησιν", lemmaChirho: "G2525", glossChirho: "mengangkat" },
  { wordIdChirho: "5800702806", greekChirho: "ἀρχιερεῖς,", lemmaChirho: "G0749", glossChirho: "para–imam–besar" },
  { wordIdChirho: "5800702807", greekChirho: "ἔχοντας", lemmaChirho: "G2192", glossChirho: "yang–mempunyai" },
  { wordIdChirho: "5800702808", greekChirho: "ἀσθένειαν;", lemmaChirho: "G0769", glossChirho: "kelemahan" },
  { wordIdChirho: "5800702809", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702810", greekChirho: "λόγος", lemmaChirho: "G3056", glossChirho: "perkataan" },
  { wordIdChirho: "5800702811", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "tetapi" },
  { wordIdChirho: "5800702812", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702813", greekChirho: "ὁρκωμοσίας,", lemmaChirho: "G3728", glossChirho: "sumpah" },
  { wordIdChirho: "5800702814", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "yang–" },
  { wordIdChirho: "5800702815", greekChirho: "μετὰ", lemmaChirho: "G3326", glossChirho: "sesudah–" },
  { wordIdChirho: "5800702816", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702817", greekChirho: "νόμον,", lemmaChirho: "G3551", glossChirho: "hukum–Taurat" },
  { wordIdChirho: "5800702818", greekChirho: "Υἱόν", lemmaChirho: "G5207", glossChirho: "Anak" },
  { wordIdChirho: "5800702819", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800702820", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800702821", greekChirho: "αἰῶνα,", lemmaChirho: "G0165", glossChirho: "kekekalan" },
  { wordIdChirho: "5800702822", greekChirho: "τετελειωμένον.", lemmaChirho: "G5048", glossChirho: "yang–telah–disempurnakan" },
];

function generateSqlBlockChirho(wordChirho: WordGlossChirho): string {
  return `-- ${wordChirho.wordIdChirho}: ${wordChirho.greekChirho} (${wordChirho.lemmaChirho}) → "${wordChirho.glossChirho}" [opus-4.5-chirho]
WITH np AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'ind'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '${wordChirho.wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = 'ind') AND p.deleted_at IS NULL
  )
  RETURNING id
)
INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '${wordChirho.wordIdChirho}' FROM np ON CONFLICT DO NOTHING;
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, '${wordChirho.glossChirho}', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '${wordChirho.wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = 'ind') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at, source = EXCLUDED.source;`;
}

function generateVerseFileChirho(chapterChirho: number, verseChirho: number, wordsChirho: WordGlossChirho[]): string {
  const glossLineChirho = wordsChirho.map(w => w.glossChirho).join(' ');

  let contentChirho = `-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- HEBREWS c${chapterChirho}-v${verseChirho} - IND
-- ${glossLineChirho}

BEGIN;
`;

  for (const wordChirho of wordsChirho) {
    contentChirho += generateSqlBlockChirho(wordChirho) + '\n';
  }

  contentChirho += 'COMMIT;\n';
  return contentChirho;
}

// Group words by verse
function groupByVerseChirho(glossesChirho: WordGlossChirho[]): Map<number, WordGlossChirho[]> {
  const versesChirho = new Map<number, WordGlossChirho[]>();

  for (const wordChirho of glossesChirho) {
    // Extract verse number from word ID (format: BBCCCVVVWW where VVV is verse)
    const verseNumChirho = parseInt(wordChirho.wordIdChirho.substring(5, 8));

    if (!versesChirho.has(verseNumChirho)) {
      versesChirho.set(verseNumChirho, []);
    }
    versesChirho.get(verseNumChirho)!.push(wordChirho);
  }

  return versesChirho;
}

// Generate files for chapter 7
const chapter7VersesChirho = groupByVerseChirho(chapter7GlossesChirho);
let allChapter7SqlChirho = '';

for (const [verseNumChirho, wordsChirho] of chapter7VersesChirho) {
  const fileContentChirho = generateVerseFileChirho(7, verseNumChirho, wordsChirho);
  const fileNameChirho = `c007-v${String(verseNumChirho).padStart(3, '0')}-chirho.sql`;
  writeFileSync(join(outputDirChirho, fileNameChirho), fileContentChirho);
  allChapter7SqlChirho += fileContentChirho + '\n';
  console.log(`Generated ${fileNameChirho}`);
}

console.log('Chapter 7 complete!');
