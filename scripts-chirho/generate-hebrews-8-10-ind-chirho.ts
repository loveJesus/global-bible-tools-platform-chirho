// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate Indonesian translations for Hebrews 8-10
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const outputDirChirho = '/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho/translations-chirho/hebrews-ind-chirho';

interface WordGlossChirho {
  wordIdChirho: string;
  greekChirho: string;
  lemmaChirho: string;
  glossChirho: string;
}

// Hebrews Chapter 8 translations
const chapter8GlossesChirho: WordGlossChirho[] = [
  // Verse 1
  { wordIdChirho: "5800800101", greekChirho: "Κεφάλαιον", lemmaChirho: "G2774", glossChirho: "Pokok" },
  { wordIdChirho: "5800800102", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "dan" },
  { wordIdChirho: "5800800103", greekChirho: "ἐπὶ", lemmaChirho: "G1909", glossChirho: "atas–" },
  { wordIdChirho: "5800800104", greekChirho: "τοῖς", lemmaChirho: "G3588", glossChirho: "hal–hal–" },
  { wordIdChirho: "5800800105", greekChirho: "λεγομένοις,", lemmaChirho: "G3004", glossChirho: "yang–dikatakan" },
  { wordIdChirho: "5800800106", greekChirho: "τοιοῦτον", lemmaChirho: "G5108", glossChirho: "demikianlah" },
  { wordIdChirho: "5800800107", greekChirho: "ἔχομεν", lemmaChirho: "G2192", glossChirho: "kita–mempunyai" },
  { wordIdChirho: "5800800108", greekChirho: "ἀρχιερέα,", lemmaChirho: "G0749", glossChirho: "imam–besar" },
  { wordIdChirho: "5800800109", greekChirho: "ὃς", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800800110", greekChirho: "ἐκάθισεν", lemmaChirho: "G2523", glossChirho: "telah–duduk" },
  { wordIdChirho: "5800800111", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "di–" },
  { wordIdChirho: "5800800112", greekChirho: "δεξιᾷ", lemmaChirho: "G1188", glossChirho: "sebelah–kanan" },
  { wordIdChirho: "5800800113", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800114", greekChirho: "θρόνου", lemmaChirho: "G2362", glossChirho: "takhta" },
  { wordIdChirho: "5800800115", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800116", greekChirho: "Μεγαλωσύνης", lemmaChirho: "G3172", glossChirho: "Kemuliaan" },
  { wordIdChirho: "5800800117", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "di–" },
  { wordIdChirho: "5800800118", greekChirho: "τοῖς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800119", greekChirho: "οὐρανοῖς;", lemmaChirho: "G3772", glossChirho: "surga" },
  // Verse 2
  { wordIdChirho: "5800800201", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5800800202", greekChirho: "ἁγίων", lemmaChirho: "G0040", glossChirho: "tempat–kudus" },
  { wordIdChirho: "5800800203", greekChirho: "λειτουργὸς,", lemmaChirho: "G3011", glossChirho: "pelayan" },
  { wordIdChirho: "5800800204", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800800205", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800206", greekChirho: "σκηνῆς", lemmaChirho: "G4633", glossChirho: "kemah" },
  { wordIdChirho: "5800800207", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "yang–" },
  { wordIdChirho: "5800800208", greekChirho: "ἀληθινῆς,", lemmaChirho: "G0228", glossChirho: "sejati" },
  { wordIdChirho: "5800800209", greekChirho: "ἣν", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800800210", greekChirho: "ἔπηξεν", lemmaChirho: "G4078", glossChirho: "telah–mendirikan" },
  { wordIdChirho: "5800800211", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800212", greekChirho: "Κύριος,", lemmaChirho: "G2962", glossChirho: "Tuhan" },
  { wordIdChirho: "5800800213", greekChirho: "οὐκ", lemmaChirho: "G3756", glossChirho: "bukan" },
  { wordIdChirho: "5800800214", greekChirho: "ἄνθρωπος.", lemmaChirho: "G0444", glossChirho: "manusia" },
  // Verse 3
  { wordIdChirho: "5800800301", greekChirho: "Πᾶς", lemmaChirho: "G3956", glossChirho: "Setiap" },
  { wordIdChirho: "5800800302", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800800303", greekChirho: "ἀρχιερεὺς,", lemmaChirho: "G0749", glossChirho: "imam–besar" },
  { wordIdChirho: "5800800304", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800800305", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800306", greekChirho: "προσφέρειν", lemmaChirho: "G4374", glossChirho: "mempersembahkan" },
  { wordIdChirho: "5800800307", greekChirho: "δῶρά", lemmaChirho: "G1435", glossChirho: "persembahan" },
  { wordIdChirho: "5800800308", greekChirho: "τε,", lemmaChirho: "G5037", glossChirho: "dan" },
  { wordIdChirho: "5800800309", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800800310", greekChirho: "θυσίας,", lemmaChirho: "G2378", glossChirho: "korban" },
  { wordIdChirho: "5800800311", greekChirho: "καθίσταται;", lemmaChirho: "G2525", glossChirho: "diangkat" },
  { wordIdChirho: "5800800312", greekChirho: "ὅθεν", lemmaChirho: "G3606", glossChirho: "sebab–itu" },
  { wordIdChirho: "5800800313", greekChirho: "ἀναγκαῖον", lemmaChirho: "G0316", glossChirho: "perlu" },
  { wordIdChirho: "5800800314", greekChirho: "ἔχειν", lemmaChirho: "G2192", glossChirho: "mempunyai" },
  { wordIdChirho: "5800800315", greekChirho: "τι", lemmaChirho: "G5100", glossChirho: "sesuatu" },
  { wordIdChirho: "5800800316", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800800317", greekChirho: "τοῦτον", lemmaChirho: "G3778", glossChirho: "Dia–ini" },
  { wordIdChirho: "5800800318", greekChirho: "ὃ", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800800319", greekChirho: "προσενέγκῃ.", lemmaChirho: "G4374", glossChirho: "dipersembahkan" },
  // Verse 4
  { wordIdChirho: "5800800401", greekChirho: "εἰ", lemmaChirho: "G1487", glossChirho: "Jika" },
  { wordIdChirho: "5800800402", greekChirho: "μὲν", lemmaChirho: "G3303", glossChirho: "memang" },
  { wordIdChirho: "5800800403", greekChirho: "οὖν", lemmaChirho: "G3767", glossChirho: "maka" },
  { wordIdChirho: "5800800404", greekChirho: "ἦν", lemmaChirho: "G1510", glossChirho: "Dia–ada" },
  { wordIdChirho: "5800800405", greekChirho: "ἐπὶ", lemmaChirho: "G1909", glossChirho: "di–" },
  { wordIdChirho: "5800800406", greekChirho: "γῆς,", lemmaChirho: "G1093", glossChirho: "bumi" },
  { wordIdChirho: "5800800407", greekChirho: "οὐδ'", lemmaChirho: "G3761", glossChirho: "tidak" },
  { wordIdChirho: "5800800408", greekChirho: "ἂν", lemmaChirho: "G0302", glossChirho: "mungkin" },
  { wordIdChirho: "5800800409", greekChirho: "ἦν", lemmaChirho: "G1510", glossChirho: "Dia–menjadi" },
  { wordIdChirho: "5800800410", greekChirho: "ἱερεύς,", lemmaChirho: "G2409", glossChirho: "imam" },
  { wordIdChirho: "5800800411", greekChirho: "ὄντων", lemmaChirho: "G1510", glossChirho: "ada" },
  { wordIdChirho: "5800800412", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "mereka–" },
  { wordIdChirho: "5800800413", greekChirho: "προσφερόντων", lemmaChirho: "G4374", glossChirho: "yang–mempersembahkan" },
  { wordIdChirho: "5800800414", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800800415", greekChirho: "νόμον,", lemmaChirho: "G3551", glossChirho: "hukum–Taurat" },
  { wordIdChirho: "5800800416", greekChirho: "τὰ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800417", greekChirho: "δῶρα;", lemmaChirho: "G1435", glossChirho: "persembahan" },
  // Verse 5
  { wordIdChirho: "5800800501", greekChirho: "οἵτινες", lemmaChirho: "G3748", glossChirho: "mereka–yang" },
  { wordIdChirho: "5800800502", greekChirho: "ὑποδείγματι", lemmaChirho: "G5262", glossChirho: "dengan–contoh" },
  { wordIdChirho: "5800800503", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800800504", greekChirho: "σκιᾷ", lemmaChirho: "G4639", glossChirho: "bayangan" },
  { wordIdChirho: "5800800505", greekChirho: "λατρεύουσιν", lemmaChirho: "G3000", glossChirho: "beribadah" },
  { wordIdChirho: "5800800506", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "dari–" },
  { wordIdChirho: "5800800507", greekChirho: "ἐπουρανίων,", lemmaChirho: "G2032", glossChirho: "hal–hal–surgawi" },
  { wordIdChirho: "5800800508", greekChirho: "καθὼς", lemmaChirho: "G2531", glossChirho: "seperti" },
  { wordIdChirho: "5800800509", greekChirho: "κεχρημάτισται", lemmaChirho: "G5537", glossChirho: "telah–diperintahkan" },
  { wordIdChirho: "5800800510", greekChirho: "Μωϋσῆς,", lemmaChirho: "G3475", glossChirho: "Musa" },
  { wordIdChirho: "5800800511", greekChirho: "μέλλων", lemmaChirho: "G3195", glossChirho: "ketika–hendak" },
  { wordIdChirho: "5800800512", greekChirho: "ἐπιτελεῖν", lemmaChirho: "G2005", glossChirho: "menyelesaikan" },
  { wordIdChirho: "5800800513", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800514", greekChirho: "σκηνήν;", lemmaChirho: "G4633", glossChirho: "kemah" },
  { wordIdChirho: "5800800515", greekChirho: "Ὅρα,", lemmaChirho: "G3708", glossChirho: "Perhatikanlah" },
  { wordIdChirho: "5800800516", greekChirho: "γάρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800800517", greekChirho: "φησίν,", lemmaChirho: "G5346", glossChirho: "firman–Nya" },
  { wordIdChirho: "5800800518", greekChirho: "ποιήσεις", lemmaChirho: "G4160", glossChirho: "engkau–akan–membuat" },
  { wordIdChirho: "5800800519", greekChirho: "πάντα", lemmaChirho: "G3956", glossChirho: "segala–sesuatu" },
  { wordIdChirho: "5800800520", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800800521", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800522", greekChirho: "τύπον", lemmaChirho: "G5179", glossChirho: "pola" },
  { wordIdChirho: "5800800523", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "yang–" },
  { wordIdChirho: "5800800524", greekChirho: "δειχθέντα", lemmaChirho: "G1166", glossChirho: "ditunjukkan" },
  { wordIdChirho: "5800800525", greekChirho: "σοι", lemmaChirho: "G4771", glossChirho: "kepadamu" },
  { wordIdChirho: "5800800526", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "di–" },
  { wordIdChirho: "5800800527", greekChirho: "τῷ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800528", greekChirho: "ὄρει.", lemmaChirho: "G3735", glossChirho: "gunung" },
  // Verse 6
  { wordIdChirho: "5800800601", greekChirho: "νυνὶ", lemmaChirho: "G3570", glossChirho: "Sekarang" },
  { wordIdChirho: "5800800602", greekChirho: "δὲ,", lemmaChirho: "G1161", glossChirho: "tetapi" },
  { wordIdChirho: "5800800603", greekChirho: "διαφορωτέρας", lemmaChirho: "G1313", glossChirho: "yang–lebih–unggul" },
  { wordIdChirho: "5800800604", greekChirho: "τέτυχεν", lemmaChirho: "G5177", glossChirho: "telah–memperoleh" },
  { wordIdChirho: "5800800605", greekChirho: "λειτουργίας,", lemmaChirho: "G3009", glossChirho: "pelayanan" },
  { wordIdChirho: "5800800606", greekChirho: "ὅσῳ", lemmaChirho: "G3745", glossChirho: "sejauh" },
  { wordIdChirho: "5800800607", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800800608", greekChirho: "κρείττονός", lemmaChirho: "G2909", glossChirho: "yang–lebih–baik" },
  { wordIdChirho: "5800800609", greekChirho: "ἐστιν", lemmaChirho: "G1510", glossChirho: "Dia–adalah" },
  { wordIdChirho: "5800800610", greekChirho: "διαθήκης", lemmaChirho: "G1242", glossChirho: "perjanjian" },
  { wordIdChirho: "5800800611", greekChirho: "μεσίτης,", lemmaChirho: "G3316", glossChirho: "pengantara" },
  { wordIdChirho: "5800800612", greekChirho: "ἥτις", lemmaChirho: "G3748", glossChirho: "yang" },
  { wordIdChirho: "5800800613", greekChirho: "ἐπὶ", lemmaChirho: "G1909", glossChirho: "atas–" },
  { wordIdChirho: "5800800614", greekChirho: "κρείττοσιν", lemmaChirho: "G2909", glossChirho: "yang–lebih–baik" },
  { wordIdChirho: "5800800615", greekChirho: "ἐπαγγελίαις", lemmaChirho: "G1860", glossChirho: "janji–janji" },
  { wordIdChirho: "5800800616", greekChirho: "νενομοθέτηται.", lemmaChirho: "G3549", glossChirho: "telah–ditetapkan" },
  // Verse 7
  { wordIdChirho: "5800800701", greekChirho: "εἰ", lemmaChirho: "G1487", glossChirho: "Jika" },
  { wordIdChirho: "5800800702", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800800703", greekChirho: "ἡ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800704", greekChirho: "πρώτη", lemmaChirho: "G4413", glossChirho: "pertama" },
  { wordIdChirho: "5800800705", greekChirho: "ἐκείνη", lemmaChirho: "G1565", glossChirho: "itu" },
  { wordIdChirho: "5800800706", greekChirho: "ἦν", lemmaChirho: "G1510", glossChirho: "adalah" },
  { wordIdChirho: "5800800707", greekChirho: "ἄμεμπτος,", lemmaChirho: "G0273", glossChirho: "tanpa–cacat" },
  { wordIdChirho: "5800800708", greekChirho: "οὐκ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800800709", greekChirho: "ἂν", lemmaChirho: "G0302", glossChirho: "mungkin" },
  { wordIdChirho: "5800800710", greekChirho: "δευτέρας", lemmaChirho: "G1208", glossChirho: "kedua" },
  { wordIdChirho: "5800800711", greekChirho: "ἐζητεῖτο", lemmaChirho: "G2212", glossChirho: "dicari" },
  { wordIdChirho: "5800800712", greekChirho: "τόπος.", lemmaChirho: "G5117", glossChirho: "tempat" },
  // Verse 8
  { wordIdChirho: "5800800801", greekChirho: "μεμφόμενος", lemmaChirho: "G3201", glossChirho: "Menyalahkan" },
  { wordIdChirho: "5800800802", greekChirho: "γὰρ,", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800800803", greekChirho: "αὐτοὺς", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800800804", greekChirho: "λέγει,", lemmaChirho: "G3004", glossChirho: "Dia–berkata" },
  { wordIdChirho: "5800800805", greekChirho: "Ἰδοὺ,", lemmaChirho: "G3708", glossChirho: "Lihatlah" },
  { wordIdChirho: "5800800806", greekChirho: "ἡμέραι", lemmaChirho: "G2250", glossChirho: "hari–hari" },
  { wordIdChirho: "5800800807", greekChirho: "ἔρχονται,", lemmaChirho: "G2064", glossChirho: "akan–datang" },
  { wordIdChirho: "5800800808", greekChirho: "λέγει", lemmaChirho: "G3004", glossChirho: "berfirman" },
  { wordIdChirho: "5800800809", greekChirho: "Κύριος,", lemmaChirho: "G2962", glossChirho: "Tuhan" },
  { wordIdChirho: "5800800810", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800800811", greekChirho: "συντελέσω", lemmaChirho: "G4931", glossChirho: "Aku–akan–mengadakan" },
  { wordIdChirho: "5800800812", greekChirho: "ἐπὶ", lemmaChirho: "G1909", glossChirho: "dengan–" },
  { wordIdChirho: "5800800813", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800814", greekChirho: "οἶκον", lemmaChirho: "G3624", glossChirho: "kaum" },
  { wordIdChirho: "5800800815", greekChirho: "Ἰσραὴλ,", lemmaChirho: "G2474", glossChirho: "Israel" },
  { wordIdChirho: "5800800816", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800800817", greekChirho: "ἐπὶ", lemmaChirho: "G1909", glossChirho: "dengan–" },
  { wordIdChirho: "5800800818", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800819", greekChirho: "οἶκον", lemmaChirho: "G3624", glossChirho: "kaum" },
  { wordIdChirho: "5800800820", greekChirho: "Ἰούδα,", lemmaChirho: "G2448", glossChirho: "Yehuda" },
  { wordIdChirho: "5800800821", greekChirho: "διαθήκην", lemmaChirho: "G1242", glossChirho: "perjanjian" },
  { wordIdChirho: "5800800822", greekChirho: "καινήν;", lemmaChirho: "G2537", glossChirho: "baru" },
  // Verse 9
  { wordIdChirho: "5800800901", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800800902", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "seperti–" },
  { wordIdChirho: "5800800903", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800904", greekChirho: "διαθήκην", lemmaChirho: "G1242", glossChirho: "perjanjian" },
  { wordIdChirho: "5800800905", greekChirho: "ἣν", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800800906", greekChirho: "ἐποίησα", lemmaChirho: "G4160", glossChirho: "Aku–telah–buat" },
  { wordIdChirho: "5800800907", greekChirho: "τοῖς", lemmaChirho: "G3588", glossChirho: "dengan–para–" },
  { wordIdChirho: "5800800908", greekChirho: "πατράσιν", lemmaChirho: "G3962", glossChirho: "nenek–moyang" },
  { wordIdChirho: "5800800909", greekChirho: "αὐτῶν,", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800800910", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "pada–" },
  { wordIdChirho: "5800800911", greekChirho: "ἡμέρᾳ", lemmaChirho: "G2250", glossChirho: "hari" },
  { wordIdChirho: "5800800912", greekChirho: "ἐπιλαβομένου", lemmaChirho: "G1949", glossChirho: "Aku–memegang" },
  { wordIdChirho: "5800800913", greekChirho: "μου", lemmaChirho: "G1473", glossChirho: "–Ku" },
  { wordIdChirho: "5800800914", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800915", greekChirho: "χειρὸς", lemmaChirho: "G5495", glossChirho: "tangan" },
  { wordIdChirho: "5800800916", greekChirho: "αὐτῶν,", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800800917", greekChirho: "ἐξαγαγεῖν", lemmaChirho: "G1806", glossChirho: "untuk–membawa–keluar" },
  { wordIdChirho: "5800800918", greekChirho: "αὐτοὺς", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800800919", greekChirho: "ἐκ", lemmaChirho: "G1537", glossChirho: "dari–" },
  { wordIdChirho: "5800800920", greekChirho: "γῆς", lemmaChirho: "G1093", glossChirho: "tanah" },
  { wordIdChirho: "5800800921", greekChirho: "Αἰγύπτου;", lemmaChirho: "G0125", glossChirho: "Mesir" },
  { wordIdChirho: "5800800922", greekChirho: "ὅτι", lemmaChirho: "G3754", glossChirho: "karena" },
  { wordIdChirho: "5800800923", greekChirho: "αὐτοὶ", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800800924", greekChirho: "οὐκ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800800925", greekChirho: "ἐνέμειναν", lemmaChirho: "G1696", glossChirho: "bertahan" },
  { wordIdChirho: "5800800926", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "dalam–" },
  { wordIdChirho: "5800800927", greekChirho: "τῇ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800800928", greekChirho: "διαθήκῃ", lemmaChirho: "G1242", glossChirho: "perjanjian" },
  { wordIdChirho: "5800800929", greekChirho: "μου,", lemmaChirho: "G1473", glossChirho: "–Ku" },
  { wordIdChirho: "5800800930", greekChirho: "κἀγὼ", lemmaChirho: "G2504", glossChirho: "dan–Aku" },
  { wordIdChirho: "5800800931", greekChirho: "ἠμέλησα", lemmaChirho: "G0272", glossChirho: "telah–mengabaikan" },
  { wordIdChirho: "5800800932", greekChirho: "αὐτῶν,", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800800933", greekChirho: "λέγει", lemmaChirho: "G3004", glossChirho: "berfirman" },
  { wordIdChirho: "5800800934", greekChirho: "Κύριος.", lemmaChirho: "G2962", glossChirho: "Tuhan" },
  // Verse 10
  { wordIdChirho: "5800801001", greekChirho: "ὅτι", lemmaChirho: "G3754", glossChirho: "Karena" },
  { wordIdChirho: "5800801002", greekChirho: "αὕτη", lemmaChirho: "G3778", glossChirho: "inilah" },
  { wordIdChirho: "5800801003", greekChirho: "ἡ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801004", greekChirho: "διαθήκη", lemmaChirho: "G1242", glossChirho: "perjanjian" },
  { wordIdChirho: "5800801005", greekChirho: "ἣν", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800801006", greekChirho: "διαθήσομαι", lemmaChirho: "G1303", glossChirho: "Aku–akan–adakan" },
  { wordIdChirho: "5800801007", greekChirho: "τῷ", lemmaChirho: "G3588", glossChirho: "dengan–sang–" },
  { wordIdChirho: "5800801008", greekChirho: "οἴκῳ", lemmaChirho: "G3624", glossChirho: "kaum" },
  { wordIdChirho: "5800801009", greekChirho: "Ἰσραὴλ,", lemmaChirho: "G2474", glossChirho: "Israel" },
  { wordIdChirho: "5800801010", greekChirho: "μετὰ", lemmaChirho: "G3326", glossChirho: "sesudah–" },
  { wordIdChirho: "5800801011", greekChirho: "τὰς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801012", greekChirho: "ἡμέρας", lemmaChirho: "G2250", glossChirho: "hari–hari" },
  { wordIdChirho: "5800801013", greekChirho: "ἐκείνας,", lemmaChirho: "G1565", glossChirho: "itu" },
  { wordIdChirho: "5800801014", greekChirho: "λέγει", lemmaChirho: "G3004", glossChirho: "berfirman" },
  { wordIdChirho: "5800801015", greekChirho: "Κύριος,", lemmaChirho: "G2962", glossChirho: "Tuhan" },
  { wordIdChirho: "5800801016", greekChirho: "διδοὺς", lemmaChirho: "G1325", glossChirho: "dengan–menaruh" },
  { wordIdChirho: "5800801017", greekChirho: "νόμους", lemmaChirho: "G3551", glossChirho: "hukum–hukum" },
  { wordIdChirho: "5800801018", greekChirho: "μου", lemmaChirho: "G1473", glossChirho: "–Ku" },
  { wordIdChirho: "5800801019", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "ke–dalam–" },
  { wordIdChirho: "5800801020", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801021", greekChirho: "διάνοιαν", lemmaChirho: "G1271", glossChirho: "pikiran" },
  { wordIdChirho: "5800801022", greekChirho: "αὐτῶν,", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800801023", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800801024", greekChirho: "ἐπὶ", lemmaChirho: "G1909", glossChirho: "pada–" },
  { wordIdChirho: "5800801025", greekChirho: "καρδίας", lemmaChirho: "G2588", glossChirho: "hati" },
  { wordIdChirho: "5800801026", greekChirho: "αὐτῶν", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800801027", greekChirho: "ἐπιγράψω", lemmaChirho: "G1924", glossChirho: "Aku–akan–menuliskannya" },
  { wordIdChirho: "5800801028", greekChirho: "αὐτούς;", lemmaChirho: "G0846", glossChirho: "kepada–mereka" },
  { wordIdChirho: "5800801029", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800801030", greekChirho: "ἔσομαι", lemmaChirho: "G1510", glossChirho: "Aku–akan–menjadi" },
  { wordIdChirho: "5800801031", greekChirho: "αὐτοῖς", lemmaChirho: "G0846", glossChirho: "bagi–mereka" },
  { wordIdChirho: "5800801032", greekChirho: "εἰς,", lemmaChirho: "G1519", glossChirho: "sebagai–" },
  { wordIdChirho: "5800801033", greekChirho: "Θεόν,", lemmaChirho: "G2316", glossChirho: "Allah" },
  { wordIdChirho: "5800801034", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800801035", greekChirho: "αὐτοὶ", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800801036", greekChirho: "ἔσονταί", lemmaChirho: "G1510", glossChirho: "akan–menjadi" },
  { wordIdChirho: "5800801037", greekChirho: "μοι", lemmaChirho: "G1473", glossChirho: "bagi–Ku" },
  { wordIdChirho: "5800801038", greekChirho: "εἰς,", lemmaChirho: "G1519", glossChirho: "sebagai–" },
  { wordIdChirho: "5800801039", greekChirho: "λαόν.", lemmaChirho: "G2992", glossChirho: "umat" },
  // Verse 11
  { wordIdChirho: "5800801101", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "Dan" },
  { wordIdChirho: "5800801102", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800801103", greekChirho: "μὴ", lemmaChirho: "G3361", glossChirho: "akan" },
  { wordIdChirho: "5800801104", greekChirho: "διδάξωσιν", lemmaChirho: "G1321", glossChirho: "mereka–mengajar" },
  { wordIdChirho: "5800801105", greekChirho: "ἕκαστος", lemmaChirho: "G1538", glossChirho: "masing–masing" },
  { wordIdChirho: "5800801106", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801107", greekChirho: "πολίτην", lemmaChirho: "G4177", glossChirho: "sesama–warga" },
  { wordIdChirho: "5800801108", greekChirho: "αὐτοῦ,", lemmaChirho: "G0846", glossChirho: "nya" },
  { wordIdChirho: "5800801109", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800801110", greekChirho: "ἕκαστος", lemmaChirho: "G1538", glossChirho: "masing–masing" },
  { wordIdChirho: "5800801111", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801112", greekChirho: "ἀδελφὸν", lemmaChirho: "G0080", glossChirho: "saudara" },
  { wordIdChirho: "5800801113", greekChirho: "αὐτοῦ", lemmaChirho: "G0846", glossChirho: "nya" },
  { wordIdChirho: "5800801114", greekChirho: "λέγων,", lemmaChirho: "G3004", glossChirho: "berkata" },
  { wordIdChirho: "5800801115", greekChirho: "Γνῶθι", lemmaChirho: "G1097", glossChirho: "Kenallah" },
  { wordIdChirho: "5800801116", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801117", greekChirho: "Κύριον;", lemmaChirho: "G2962", glossChirho: "Tuhan" },
  { wordIdChirho: "5800801118", greekChirho: "ὅτι", lemmaChirho: "G3754", glossChirho: "karena" },
  { wordIdChirho: "5800801119", greekChirho: "πάντες", lemmaChirho: "G3956", glossChirho: "semua" },
  { wordIdChirho: "5800801120", greekChirho: "εἰδήσουσίν", lemmaChirho: "G1492", glossChirho: "akan–mengenal" },
  { wordIdChirho: "5800801121", greekChirho: "με,", lemmaChirho: "G1473", glossChirho: "Aku" },
  { wordIdChirho: "5800801122", greekChirho: "ἀπὸ", lemmaChirho: "G0575", glossChirho: "dari–" },
  { wordIdChirho: "5800801123", greekChirho: "μικροῦ", lemmaChirho: "G3398", glossChirho: "yang–kecil" },
  { wordIdChirho: "5800801124", greekChirho: "ἕως", lemmaChirho: "G2193", glossChirho: "sampai–" },
  { wordIdChirho: "5800801125", greekChirho: "μεγάλου", lemmaChirho: "G3173", glossChirho: "yang–besar" },
  { wordIdChirho: "5800801126", greekChirho: "αὐτῶν,", lemmaChirho: "G0846", glossChirho: "dari–mereka" },
  // Verse 12
  { wordIdChirho: "5800801201", greekChirho: "ὅτι", lemmaChirho: "G3754", glossChirho: "Karena" },
  { wordIdChirho: "5800801202", greekChirho: "ἵλεως", lemmaChirho: "G2436", glossChirho: "pengampun" },
  { wordIdChirho: "5800801203", greekChirho: "ἔσομαι", lemmaChirho: "G1510", glossChirho: "Aku–akan–menjadi" },
  { wordIdChirho: "5800801204", greekChirho: "ταῖς", lemmaChirho: "G3588", glossChirho: "terhadap–sang–" },
  { wordIdChirho: "5800801205", greekChirho: "ἀδικίαις", lemmaChirho: "G0093", glossChirho: "kejahatan" },
  { wordIdChirho: "5800801206", greekChirho: "αὐτῶν,", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800801207", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800801208", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801209", greekChirho: "ἁμαρτιῶν", lemmaChirho: "G0266", glossChirho: "dosa–dosa" },
  { wordIdChirho: "5800801210", greekChirho: "αὐτῶν", lemmaChirho: "G0846", glossChirho: "mereka" },
  { wordIdChirho: "5800801211", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800801212", greekChirho: "μὴ", lemmaChirho: "G3361", glossChirho: "akan" },
  { wordIdChirho: "5800801213", greekChirho: "μνησθῶ", lemmaChirho: "G3403", glossChirho: "Aku–ingat" },
  { wordIdChirho: "5800801214", greekChirho: "ἔτι.", lemmaChirho: "G2089", glossChirho: "lagi" },
  // Verse 13
  { wordIdChirho: "5800801301", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "Dengan–" },
  { wordIdChirho: "5800801302", greekChirho: "τῷ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801303", greekChirho: "λέγειν,", lemmaChirho: "G3004", glossChirho: "mengatakan" },
  { wordIdChirho: "5800801304", greekChirho: "Καινὴν,", lemmaChirho: "G2537", glossChirho: "Baru" },
  { wordIdChirho: "5800801305", greekChirho: "πεπαλαίωκεν", lemmaChirho: "G3822", glossChirho: "Dia–telah–menyatakan–usang" },
  { wordIdChirho: "5800801306", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801307", greekChirho: "πρώτην;", lemmaChirho: "G4413", glossChirho: "yang–pertama" },
  { wordIdChirho: "5800801308", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800801309", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "dan" },
  { wordIdChirho: "5800801310", greekChirho: "παλαιούμενον", lemmaChirho: "G3822", glossChirho: "yang–menjadi–usang" },
  { wordIdChirho: "5800801311", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800801312", greekChirho: "γηράσκον,", lemmaChirho: "G1095", glossChirho: "yang–menua" },
  { wordIdChirho: "5800801313", greekChirho: "ἐγγὺς", lemmaChirho: "G1451", glossChirho: "dekat" },
  { wordIdChirho: "5800801314", greekChirho: "ἀφανισμοῦ.", lemmaChirho: "G0854", glossChirho: "untuk–lenyap" },
];

// Hebrews Chapter 9 translations (partial - key verses)
const chapter9GlossesChirho: WordGlossChirho[] = [
  // Verse 1
  { wordIdChirho: "5800900101", greekChirho: "Εἶχε", lemmaChirho: "G2192", glossChirho: "Mempunyai" },
  { wordIdChirho: "5800900102", greekChirho: "μὲν", lemmaChirho: "G3303", glossChirho: "memang" },
  { wordIdChirho: "5800900103", greekChirho: "οὖν", lemmaChirho: "G3767", glossChirho: "maka" },
  { wordIdChirho: "5800900104", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800900105", greekChirho: "ἡ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800900106", greekChirho: "πρώτη,", lemmaChirho: "G4413", glossChirho: "yang–pertama" },
  { wordIdChirho: "5800900107", greekChirho: "δικαιώματα", lemmaChirho: "G1345", glossChirho: "peraturan–peraturan" },
  { wordIdChirho: "5800900108", greekChirho: "λατρείας,", lemmaChirho: "G2999", glossChirho: "ibadah" },
  { wordIdChirho: "5800900109", greekChirho: "τό", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800900110", greekChirho: "τε", lemmaChirho: "G5037", glossChirho: "dan" },
  { wordIdChirho: "5800900111", greekChirho: "ἅγιον,", lemmaChirho: "G0040", glossChirho: "tempat–kudus" },
  { wordIdChirho: "5800900112", greekChirho: "κοσμικόν.", lemmaChirho: "G2886", glossChirho: "duniawi" },
  // Verse 2
  { wordIdChirho: "5800900201", greekChirho: "σκηνὴ", lemmaChirho: "G4633", glossChirho: "Kemah" },
  { wordIdChirho: "5800900202", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5800900203", greekChirho: "κατεσκευάσθη,", lemmaChirho: "G2680", glossChirho: "telah–didirikan" },
  { wordIdChirho: "5800900204", greekChirho: "ἡ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800900205", greekChirho: "πρώτη,", lemmaChirho: "G4413", glossChirho: "yang–pertama" },
  { wordIdChirho: "5800900206", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "di–dalam–" },
  { wordIdChirho: "5800900207", greekChirho: "ᾗ", lemmaChirho: "G3739", glossChirho: "yang–mana" },
  { wordIdChirho: "5800900208", greekChirho: "ἥ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800900209", greekChirho: "τε", lemmaChirho: "G5037", glossChirho: "dan" },
  { wordIdChirho: "5800900210", greekChirho: "λυχνία,", lemmaChirho: "G3087", glossChirho: "kaki–dian" },
  { wordIdChirho: "5800900211", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800900212", greekChirho: "ἡ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800900213", greekChirho: "τράπεζα,", lemmaChirho: "G5132", glossChirho: "meja" },
  { wordIdChirho: "5800900214", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800900215", greekChirho: "ἡ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800900216", greekChirho: "πρόθεσις", lemmaChirho: "G4286", glossChirho: "persembahan" },
  { wordIdChirho: "5800900217", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5800900218", greekChirho: "ἄρτων,", lemmaChirho: "G0740", glossChirho: "roti" },
  { wordIdChirho: "5800900219", greekChirho: "ἥτις", lemmaChirho: "G3748", glossChirho: "yang" },
  { wordIdChirho: "5800900220", greekChirho: "λέγεται", lemmaChirho: "G3004", glossChirho: "disebut" },
  { wordIdChirho: "5800900221", greekChirho: "Ἅγια;", lemmaChirho: "G0040", glossChirho: "Tempat–Kudus" },
  // Continue with more verses...
  // Verse 11
  { wordIdChirho: "5800901101", greekChirho: "Χριστὸς", lemmaChirho: "G5547", glossChirho: "Kristus" },
  { wordIdChirho: "5800901102", greekChirho: "δὲ,", lemmaChirho: "G1161", glossChirho: "tetapi" },
  { wordIdChirho: "5800901103", greekChirho: "παραγενόμενος", lemmaChirho: "G3854", glossChirho: "yang–telah–datang" },
  { wordIdChirho: "5800901104", greekChirho: "ἀρχιερεὺς", lemmaChirho: "G0749", glossChirho: "imam–besar" },
  { wordIdChirho: "5800901105", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5800901106", greekChirho: "γενομένων", lemmaChirho: "G1096", glossChirho: "yang–telah–datang" },
  { wordIdChirho: "5800901107", greekChirho: "ἀγαθῶν,", lemmaChirho: "G0018", glossChirho: "hal–hal–baik" },
  { wordIdChirho: "5800901108", greekChirho: "διὰ", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5800901109", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800901110", greekChirho: "μείζονος", lemmaChirho: "G3173", glossChirho: "yang–lebih–besar" },
  { wordIdChirho: "5800901111", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800901112", greekChirho: "τελειοτέρας", lemmaChirho: "G5046", glossChirho: "yang–lebih–sempurna" },
  { wordIdChirho: "5800901113", greekChirho: "σκηνῆς,", lemmaChirho: "G4633", glossChirho: "kemah" },
  { wordIdChirho: "5800901114", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "bukan" },
  { wordIdChirho: "5800901115", greekChirho: "χειροποιήτου -- ", lemmaChirho: "G5499", glossChirho: "buatan–tangan" },
  { wordIdChirho: "5800901116", greekChirho: "τοῦτ'", lemmaChirho: "G3778", glossChirho: "yaitu" },
  { wordIdChirho: "5800901117", greekChirho: "ἔστιν,", lemmaChirho: "G1510", glossChirho: "adalah" },
  { wordIdChirho: "5800901118", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "bukan" },
  { wordIdChirho: "5800901119", greekChirho: "ταύτης", lemmaChirho: "G3778", glossChirho: "dari–ini" },
  { wordIdChirho: "5800901120", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800901121", greekChirho: "κτίσεως -- ", lemmaChirho: "G2937", glossChirho: "ciptaan" },
  // Verse 12
  { wordIdChirho: "5800901201", greekChirho: "οὐδὲ", lemmaChirho: "G3761", glossChirho: "bukan–juga" },
  { wordIdChirho: "5800901202", greekChirho: "δι'", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5800901203", greekChirho: "αἵματος", lemmaChirho: "G0129", glossChirho: "darah" },
  { wordIdChirho: "5800901204", greekChirho: "τράγων", lemmaChirho: "G5131", glossChirho: "kambing–kambing" },
  { wordIdChirho: "5800901205", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800901206", greekChirho: "μόσχων,", lemmaChirho: "G3448", glossChirho: "lembu–lembu" },
  { wordIdChirho: "5800901207", greekChirho: "διὰ", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5800901208", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "tetapi" },
  { wordIdChirho: "5800901209", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800901210", greekChirho: "ἰδίου", lemmaChirho: "G2398", glossChirho: "sendiri" },
  { wordIdChirho: "5800901211", greekChirho: "αἵματος,", lemmaChirho: "G0129", glossChirho: "darah" },
  { wordIdChirho: "5800901212", greekChirho: "εἰσῆλθεν", lemmaChirho: "G1525", glossChirho: "Dia–telah–masuk" },
  { wordIdChirho: "5800901213", greekChirho: "ἐφάπαξ", lemmaChirho: "G2178", glossChirho: "sekali–untuk–selamanya" },
  { wordIdChirho: "5800901214", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "ke–dalam–" },
  { wordIdChirho: "5800901215", greekChirho: "τὰ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800901216", greekChirho: "ἅγια,", lemmaChirho: "G0040", glossChirho: "tempat–kudus" },
  { wordIdChirho: "5800901217", greekChirho: "αἰωνίαν", lemmaChirho: "G0166", glossChirho: "kekal" },
  { wordIdChirho: "5800901218", greekChirho: "λύτρωσιν", lemmaChirho: "G3085", glossChirho: "penebusan" },
  { wordIdChirho: "5800901219", greekChirho: "εὑράμενος.", lemmaChirho: "G2147", glossChirho: "yang–telah–memperoleh" },
  // Verse 14
  { wordIdChirho: "5800901401", greekChirho: "πόσῳ", lemmaChirho: "G4214", glossChirho: "betapa–lebih" },
  { wordIdChirho: "5800901402", greekChirho: "μᾶλλον", lemmaChirho: "G3123", glossChirho: "lagi" },
  { wordIdChirho: "5800901403", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800901404", greekChirho: "αἷμα", lemmaChirho: "G0129", glossChirho: "darah" },
  { wordIdChirho: "5800901405", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800901406", greekChirho: "Χριστοῦ,", lemmaChirho: "G5547", glossChirho: "Kristus" },
  { wordIdChirho: "5800901407", greekChirho: "ὃς", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5800901408", greekChirho: "διὰ", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5800901409", greekChirho: "Πνεύματος", lemmaChirho: "G4151", glossChirho: "Roh" },
  { wordIdChirho: "5800901410", greekChirho: "αἰωνίου,", lemmaChirho: "G0166", glossChirho: "yang–kekal" },
  { wordIdChirho: "5800901411", greekChirho: "ἑαυτὸν", lemmaChirho: "G1438", glossChirho: "diri–Nya–sendiri" },
  { wordIdChirho: "5800901412", greekChirho: "προσήνεγκεν", lemmaChirho: "G4374", glossChirho: "telah–mempersembahkan" },
  { wordIdChirho: "5800901413", greekChirho: "ἄμωμον", lemmaChirho: "G0299", glossChirho: "tanpa–cacat" },
  { wordIdChirho: "5800901414", greekChirho: "τῷ", lemmaChirho: "G3588", glossChirho: "kepada–sang–" },
  { wordIdChirho: "5800901415", greekChirho: "Θεῷ,", lemmaChirho: "G2316", glossChirho: "Allah" },
  { wordIdChirho: "5800901416", greekChirho: "καθαριεῖ", lemmaChirho: "G2511", glossChirho: "akan–menyucikan" },
  { wordIdChirho: "5800901417", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800901418", greekChirho: "συνείδησιν", lemmaChirho: "G4893", glossChirho: "hati–nurani" },
  { wordIdChirho: "5800901419", greekChirho: "ἡμῶν", lemmaChirho: "G1473", glossChirho: "kita" },
  { wordIdChirho: "5800901420", greekChirho: "ἀπὸ", lemmaChirho: "G0575", glossChirho: "dari–" },
  { wordIdChirho: "5800901421", greekChirho: "νεκρῶν", lemmaChirho: "G3498", glossChirho: "yang–mati" },
  { wordIdChirho: "5800901422", greekChirho: "ἔργων,", lemmaChirho: "G2041", glossChirho: "perbuatan" },
  { wordIdChirho: "5800901423", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800901424", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800901425", greekChirho: "λατρεύειν", lemmaChirho: "G3000", glossChirho: "beribadah" },
  { wordIdChirho: "5800901426", greekChirho: "Θεῷ", lemmaChirho: "G2316", glossChirho: "kepada–Allah" },
  { wordIdChirho: "5800901427", greekChirho: "ζῶντι!", lemmaChirho: "G2198", glossChirho: "yang–hidup" },
  // Verse 22
  { wordIdChirho: "5800902201", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "Dan" },
  { wordIdChirho: "5800902202", greekChirho: "σχεδὸν", lemmaChirho: "G4975", glossChirho: "hampir" },
  { wordIdChirho: "5800902203", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "dengan–" },
  { wordIdChirho: "5800902204", greekChirho: "αἵματι", lemmaChirho: "G0129", glossChirho: "darah" },
  { wordIdChirho: "5800902205", greekChirho: "πάντα", lemmaChirho: "G3956", glossChirho: "segala–sesuatu" },
  { wordIdChirho: "5800902206", greekChirho: "καθαρίζεται,", lemmaChirho: "G2511", glossChirho: "disucikan" },
  { wordIdChirho: "5800902207", greekChirho: "κατὰ", lemmaChirho: "G2596", glossChirho: "menurut–" },
  { wordIdChirho: "5800902208", greekChirho: "τὸν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800902209", greekChirho: "νόμον,", lemmaChirho: "G3551", glossChirho: "hukum–Taurat" },
  { wordIdChirho: "5800902210", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5800902211", greekChirho: "χωρὶς", lemmaChirho: "G5565", glossChirho: "tanpa" },
  { wordIdChirho: "5800902212", greekChirho: "αἱματεκχυσίας,", lemmaChirho: "G0130", glossChirho: "penumpahan–darah" },
  { wordIdChirho: "5800902213", greekChirho: "οὐ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5800902214", greekChirho: "γίνεται", lemmaChirho: "G1096", glossChirho: "terjadi" },
  { wordIdChirho: "5800902215", greekChirho: "ἄφεσις.", lemmaChirho: "G0859", glossChirho: "pengampunan" },
  // Verse 27-28
  { wordIdChirho: "5800902701", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "Dan" },
  { wordIdChirho: "5800902702", greekChirho: "καθ'", lemmaChirho: "G2596", glossChirho: "sebagaimana" },
  { wordIdChirho: "5800902703", greekChirho: "ὅσον", lemmaChirho: "G3745", glossChirho: "sejauh" },
  { wordIdChirho: "5800902704", greekChirho: "ἀπόκειται", lemmaChirho: "G0606", glossChirho: "ditetapkan" },
  { wordIdChirho: "5800902705", greekChirho: "τοῖς", lemmaChirho: "G3588", glossChirho: "bagi–" },
  { wordIdChirho: "5800902706", greekChirho: "ἀνθρώποις", lemmaChirho: "G0444", glossChirho: "manusia" },
  { wordIdChirho: "5800902707", greekChirho: "ἅπαξ", lemmaChirho: "G0530", glossChirho: "sekali" },
  { wordIdChirho: "5800902708", greekChirho: "ἀποθανεῖν,", lemmaChirho: "G0599", glossChirho: "untuk–mati" },
  { wordIdChirho: "5800902709", greekChirho: "μετὰ", lemmaChirho: "G3326", glossChirho: "sesudah–" },
  { wordIdChirho: "5800902710", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "dan" },
  { wordIdChirho: "5800902711", greekChirho: "τοῦτο,", lemmaChirho: "G3778", glossChirho: "ini" },
  { wordIdChirho: "5800902712", greekChirho: "κρίσις;", lemmaChirho: "G2920", glossChirho: "penghakiman" },
  { wordIdChirho: "5800902801", greekChirho: "οὕτως", lemmaChirho: "G3779", glossChirho: "demikianlah" },
  { wordIdChirho: "5800902802", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "juga" },
  { wordIdChirho: "5800902803", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800902804", greekChirho: "Χριστός,", lemmaChirho: "G5547", glossChirho: "Kristus" },
  { wordIdChirho: "5800902805", greekChirho: "ἅπαξ", lemmaChirho: "G0530", glossChirho: "sekali" },
  { wordIdChirho: "5800902806", greekChirho: "προσενεχθεὶς", lemmaChirho: "G4374", glossChirho: "dipersembahkan" },
  { wordIdChirho: "5800902807", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800902808", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5800902809", greekChirho: "πολλῶν", lemmaChirho: "G4183", glossChirho: "banyak–orang" },
  { wordIdChirho: "5800902810", greekChirho: "ἀνενεγκεῖν", lemmaChirho: "G0399", glossChirho: "menanggung" },
  { wordIdChirho: "5800902811", greekChirho: "ἁμαρτίας,", lemmaChirho: "G0266", glossChirho: "dosa–dosa" },
  { wordIdChirho: "5800902812", greekChirho: "ἐκ", lemmaChirho: "G1537", glossChirho: "untuk–" },
  { wordIdChirho: "5800902813", greekChirho: "δευτέρου,", lemmaChirho: "G1208", glossChirho: "kedua–kali" },
  { wordIdChirho: "5800902814", greekChirho: "χωρὶς", lemmaChirho: "G5565", glossChirho: "tanpa" },
  { wordIdChirho: "5800902815", greekChirho: "ἁμαρτίας,", lemmaChirho: "G0266", glossChirho: "dosa" },
  { wordIdChirho: "5800902816", greekChirho: "ὀφθήσεται", lemmaChirho: "G3708", glossChirho: "akan–menampakkan–diri" },
  { wordIdChirho: "5800902817", greekChirho: "τοῖς", lemmaChirho: "G3588", glossChirho: "kepada–mereka–" },
  { wordIdChirho: "5800902818", greekChirho: "αὐτὸν", lemmaChirho: "G0846", glossChirho: "Dia" },
  { wordIdChirho: "5800902819", greekChirho: "ἀπεκδεχομένοις", lemmaChirho: "G0553", glossChirho: "yang–menantikan" },
  { wordIdChirho: "5800902820", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5800902821", greekChirho: "σωτηρίαν.", lemmaChirho: "G4991", glossChirho: "keselamatan" },
];

// Hebrews Chapter 10 translations (key verses)
const chapter10GlossesChirho: WordGlossChirho[] = [
  // Verse 1
  { wordIdChirho: "5801000101", greekChirho: "Σκιὰν", lemmaChirho: "G4639", glossChirho: "Bayangan" },
  { wordIdChirho: "5801000102", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5801000103", greekChirho: "ἔχων", lemmaChirho: "G2192", glossChirho: "yang–mempunyai" },
  { wordIdChirho: "5801000104", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801000105", greekChirho: "νόμος", lemmaChirho: "G3551", glossChirho: "hukum–Taurat" },
  { wordIdChirho: "5801000106", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5801000107", greekChirho: "μελλόντων", lemmaChirho: "G3195", glossChirho: "yang–akan–datang" },
  { wordIdChirho: "5801000108", greekChirho: "ἀγαθῶν,", lemmaChirho: "G0018", glossChirho: "hal–hal–baik" },
  { wordIdChirho: "5801000109", greekChirho: "οὐκ", lemmaChirho: "G3756", glossChirho: "bukan" },
  { wordIdChirho: "5801000110", greekChirho: "αὐτὴν", lemmaChirho: "G0846", glossChirho: "itu–sendiri" },
  { wordIdChirho: "5801000111", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801000112", greekChirho: "εἰκόνα", lemmaChirho: "G1504", glossChirho: "gambar" },
  { wordIdChirho: "5801000113", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5801000114", greekChirho: "πραγμάτων,", lemmaChirho: "G4229", glossChirho: "realitas" },
  { wordIdChirho: "5801000115", greekChirho: "κατ'", lemmaChirho: "G2596", glossChirho: "setiap–" },
  { wordIdChirho: "5801000116", greekChirho: "ἐνιαυτὸν", lemmaChirho: "G1763", glossChirho: "tahun" },
  { wordIdChirho: "5801000117", greekChirho: "ταῖς", lemmaChirho: "G3588", glossChirho: "dengan–sang–" },
  { wordIdChirho: "5801000118", greekChirho: "αὐταῖς", lemmaChirho: "G0846", glossChirho: "sama" },
  { wordIdChirho: "5801000119", greekChirho: "θυσίαις,", lemmaChirho: "G2378", glossChirho: "korban–korban" },
  { wordIdChirho: "5801000120", greekChirho: "ἃς", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5801000121", greekChirho: "προσφέρουσιν", lemmaChirho: "G4374", glossChirho: "mereka–persembahkan" },
  { wordIdChirho: "5801000122", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5801000123", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801000124", greekChirho: "διηνεκὲς,", lemmaChirho: "G1336", glossChirho: "selama–lamanya" },
  { wordIdChirho: "5801000125", greekChirho: "οὐδέποτε", lemmaChirho: "G3763", glossChirho: "tidak–pernah" },
  { wordIdChirho: "5801000126", greekChirho: "δύναται", lemmaChirho: "G1410", glossChirho: "dapat" },
  { wordIdChirho: "5801000127", greekChirho: "τοὺς", lemmaChirho: "G3588", glossChirho: "mereka–" },
  { wordIdChirho: "5801000128", greekChirho: "προσερχομένους", lemmaChirho: "G4334", glossChirho: "yang–mendekat" },
  { wordIdChirho: "5801000129", greekChirho: "τελειῶσαι.", lemmaChirho: "G5048", glossChirho: "menyempurnakan" },
  // Verse 10
  { wordIdChirho: "5801001001", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "Dalam–" },
  { wordIdChirho: "5801001002", greekChirho: "ᾧ", lemmaChirho: "G3739", glossChirho: "yang" },
  { wordIdChirho: "5801001003", greekChirho: "θελήματι,", lemmaChirho: "G2307", glossChirho: "kehendak" },
  { wordIdChirho: "5801001004", greekChirho: "ἡγιασμένοι", lemmaChirho: "G0037", glossChirho: "kita–telah–dikuduskan" },
  { wordIdChirho: "5801001005", greekChirho: "ἐσμὲν,", lemmaChirho: "G1510", glossChirho: "adalah" },
  { wordIdChirho: "5801001006", greekChirho: "διὰ", lemmaChirho: "G1223", glossChirho: "melalui–" },
  { wordIdChirho: "5801001007", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801001008", greekChirho: "προσφορᾶς", lemmaChirho: "G4376", glossChirho: "persembahan" },
  { wordIdChirho: "5801001009", greekChirho: "τοῦ", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5801001010", greekChirho: "σώματος", lemmaChirho: "G4983", glossChirho: "tubuh" },
  { wordIdChirho: "5801001011", greekChirho: "Ἰησοῦ", lemmaChirho: "G2424", glossChirho: "Yesus" },
  { wordIdChirho: "5801001012", greekChirho: "Χριστοῦ", lemmaChirho: "G5547", glossChirho: "Kristus" },
  { wordIdChirho: "5801001013", greekChirho: "ἐφάπαξ.", lemmaChirho: "G2178", glossChirho: "sekali–untuk–selamanya" },
  // Verse 19-22 (key exhortation)
  { wordIdChirho: "5801001901", greekChirho: "Ἔχοντες", lemmaChirho: "G2192", glossChirho: "Karena–mempunyai" },
  { wordIdChirho: "5801001902", greekChirho: "οὖν,", lemmaChirho: "G3767", glossChirho: "maka" },
  { wordIdChirho: "5801001903", greekChirho: "ἀδελφοί,", lemmaChirho: "G0080", glossChirho: "saudara–saudara" },
  { wordIdChirho: "5801001904", greekChirho: "παρρησίαν", lemmaChirho: "G3954", glossChirho: "keberanian" },
  { wordIdChirho: "5801001905", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5801001906", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801001907", greekChirho: "εἴσοδον", lemmaChirho: "G1529", glossChirho: "jalan–masuk" },
  { wordIdChirho: "5801001908", greekChirho: "τῶν", lemmaChirho: "G3588", glossChirho: "ke–sang–" },
  { wordIdChirho: "5801001909", greekChirho: "ἁγίων,", lemmaChirho: "G0040", glossChirho: "tempat–kudus" },
  { wordIdChirho: "5801001910", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "oleh–" },
  { wordIdChirho: "5801001911", greekChirho: "τῷ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801001912", greekChirho: "αἵματι", lemmaChirho: "G0129", glossChirho: "darah" },
  { wordIdChirho: "5801001913", greekChirho: "Ἰησοῦ,", lemmaChirho: "G2424", glossChirho: "Yesus" },
  // Verse 22
  { wordIdChirho: "5801002201", greekChirho: "προσερχώμεθα", lemmaChirho: "G4334", glossChirho: "marilah–kita–mendekat" },
  { wordIdChirho: "5801002202", greekChirho: "μετὰ", lemmaChirho: "G3326", glossChirho: "dengan–" },
  { wordIdChirho: "5801002203", greekChirho: "ἀληθινῆς", lemmaChirho: "G0228", glossChirho: "yang–tulus" },
  { wordIdChirho: "5801002204", greekChirho: "καρδίας,", lemmaChirho: "G2588", glossChirho: "hati" },
  { wordIdChirho: "5801002205", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "dalam–" },
  { wordIdChirho: "5801002206", greekChirho: "πληροφορίᾳ", lemmaChirho: "G4136", glossChirho: "kepastian–penuh" },
  { wordIdChirho: "5801002207", greekChirho: "πίστεως;", lemmaChirho: "G4102", glossChirho: "iman" },
  { wordIdChirho: "5801002208", greekChirho: "ῥεραντισμένοι", lemmaChirho: "G4472", glossChirho: "yang–diperciki" },
  { wordIdChirho: "5801002209", greekChirho: "τὰς", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801002210", greekChirho: "καρδίας,", lemmaChirho: "G2588", glossChirho: "hati" },
  { wordIdChirho: "5801002211", greekChirho: "ἀπὸ", lemmaChirho: "G0575", glossChirho: "dari–" },
  { wordIdChirho: "5801002212", greekChirho: "συνειδήσεως", lemmaChirho: "G4893", glossChirho: "hati–nurani" },
  { wordIdChirho: "5801002213", greekChirho: "πονηρᾶς;", lemmaChirho: "G4190", glossChirho: "yang–jahat" },
  { wordIdChirho: "5801002214", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5801002215", greekChirho: "λελουσμένοι", lemmaChirho: "G3068", glossChirho: "yang–dibasuh" },
  { wordIdChirho: "5801002216", greekChirho: "τὸ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801002217", greekChirho: "σῶμα,", lemmaChirho: "G4983", glossChirho: "tubuh" },
  { wordIdChirho: "5801002218", greekChirho: "ὕδατι", lemmaChirho: "G5204", glossChirho: "dengan–air" },
  { wordIdChirho: "5801002219", greekChirho: "καθαρῷ.", lemmaChirho: "G2513", glossChirho: "yang–suci" },
  // Verse 23
  { wordIdChirho: "5801002301", greekChirho: "κατέχωμεν", lemmaChirho: "G2722", glossChirho: "marilah–kita–berpegang–teguh" },
  { wordIdChirho: "5801002302", greekChirho: "τὴν", lemmaChirho: "G3588", glossChirho: "pada–sang–" },
  { wordIdChirho: "5801002303", greekChirho: "ὁμολογίαν", lemmaChirho: "G3671", glossChirho: "pengakuan" },
  { wordIdChirho: "5801002304", greekChirho: "τῆς", lemmaChirho: "G3588", glossChirho: "dari–sang–" },
  { wordIdChirho: "5801002305", greekChirho: "ἐλπίδος,", lemmaChirho: "G1680", glossChirho: "pengharapan" },
  { wordIdChirho: "5801002306", greekChirho: "ἀκλινῆ;", lemmaChirho: "G0186", glossChirho: "yang–tidak–goyah" },
  { wordIdChirho: "5801002307", greekChirho: "πιστὸς", lemmaChirho: "G4103", glossChirho: "setia" },
  { wordIdChirho: "5801002308", greekChirho: "γὰρ", lemmaChirho: "G1063", glossChirho: "karena" },
  { wordIdChirho: "5801002309", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801002310", greekChirho: "ἐπαγγειλάμενος;", lemmaChirho: "G1861", glossChirho: "yang–menjanjikan" },
  // Verse 38-39 (faith verse)
  { wordIdChirho: "5801003801", greekChirho: "ὁ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801003802", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "Tetapi" },
  { wordIdChirho: "5801003803", greekChirho: "δίκαιός", lemmaChirho: "G1342", glossChirho: "yang–benar" },
  { wordIdChirho: "5801003804", greekChirho: "μου,", lemmaChirho: "G1473", glossChirho: "–Ku" },
  { wordIdChirho: "5801003805", greekChirho: "ἐκ", lemmaChirho: "G1537", glossChirho: "oleh–" },
  { wordIdChirho: "5801003806", greekChirho: "πίστεως", lemmaChirho: "G4102", glossChirho: "iman" },
  { wordIdChirho: "5801003807", greekChirho: "ζήσεται;", lemmaChirho: "G2198", glossChirho: "akan–hidup" },
  { wordIdChirho: "5801003808", greekChirho: "καὶ", lemmaChirho: "G2532", glossChirho: "dan" },
  { wordIdChirho: "5801003809", greekChirho: "ἐὰν", lemmaChirho: "G1437", glossChirho: "jika" },
  { wordIdChirho: "5801003810", greekChirho: "ὑποστείληται,", lemmaChirho: "G5288", glossChirho: "ia–mundur" },
  { wordIdChirho: "5801003811", greekChirho: "οὐκ", lemmaChirho: "G3756", glossChirho: "tidak" },
  { wordIdChirho: "5801003812", greekChirho: "εὐδοκεῖ", lemmaChirho: "G2106", glossChirho: "berkenan" },
  { wordIdChirho: "5801003813", greekChirho: "ἡ", lemmaChirho: "G3588", glossChirho: "sang–" },
  { wordIdChirho: "5801003814", greekChirho: "ψυχή", lemmaChirho: "G5590", glossChirho: "jiwa" },
  { wordIdChirho: "5801003815", greekChirho: "μου", lemmaChirho: "G1473", glossChirho: "–Ku" },
  { wordIdChirho: "5801003816", greekChirho: "ἐν", lemmaChirho: "G1722", glossChirho: "terhadap–" },
  { wordIdChirho: "5801003817", greekChirho: "αὐτῷ.", lemmaChirho: "G0846", glossChirho: "dia" },
  // Verse 39
  { wordIdChirho: "5801003901", greekChirho: "ἡμεῖς", lemmaChirho: "G1473", glossChirho: "Kita" },
  { wordIdChirho: "5801003902", greekChirho: "δὲ", lemmaChirho: "G1161", glossChirho: "tetapi" },
  { wordIdChirho: "5801003903", greekChirho: "οὐκ", lemmaChirho: "G3756", glossChirho: "bukan" },
  { wordIdChirho: "5801003904", greekChirho: "ἐσμὲν", lemmaChirho: "G1510", glossChirho: "adalah" },
  { wordIdChirho: "5801003905", greekChirho: "ὑποστολῆς", lemmaChirho: "G5289", glossChirho: "kemunduran" },
  { wordIdChirho: "5801003906", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "menuju–" },
  { wordIdChirho: "5801003907", greekChirho: "ἀπώλειαν,", lemmaChirho: "G0684", glossChirho: "kebinasaan" },
  { wordIdChirho: "5801003908", greekChirho: "ἀλλὰ", lemmaChirho: "G0235", glossChirho: "tetapi" },
  { wordIdChirho: "5801003909", greekChirho: "πίστεως", lemmaChirho: "G4102", glossChirho: "iman" },
  { wordIdChirho: "5801003910", greekChirho: "εἰς", lemmaChirho: "G1519", glossChirho: "untuk–" },
  { wordIdChirho: "5801003911", greekChirho: "περιποίησιν", lemmaChirho: "G4047", glossChirho: "keselamatan" },
  { wordIdChirho: "5801003912", greekChirho: "ψυχῆς.", lemmaChirho: "G5590", glossChirho: "jiwa" },
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

function groupByVerseChirho(glossesChirho: WordGlossChirho[]): Map<number, WordGlossChirho[]> {
  const versesChirho = new Map<number, WordGlossChirho[]>();

  for (const wordChirho of glossesChirho) {
    const verseNumChirho = parseInt(wordChirho.wordIdChirho.substring(5, 8));

    if (!versesChirho.has(verseNumChirho)) {
      versesChirho.set(verseNumChirho, []);
    }
    versesChirho.get(verseNumChirho)!.push(wordChirho);
  }

  return versesChirho;
}

// Generate files for chapter 8
const chapter8VersesChirho = groupByVerseChirho(chapter8GlossesChirho);
for (const [verseNumChirho, wordsChirho] of chapter8VersesChirho) {
  const fileContentChirho = generateVerseFileChirho(8, verseNumChirho, wordsChirho);
  const fileNameChirho = `c008-v${String(verseNumChirho).padStart(3, '0')}-chirho.sql`;
  writeFileSync(join(outputDirChirho, fileNameChirho), fileContentChirho);
  console.log(`Generated ${fileNameChirho}`);
}
console.log('Chapter 8 complete!');

// Generate files for chapter 9
const chapter9VersesChirho = groupByVerseChirho(chapter9GlossesChirho);
for (const [verseNumChirho, wordsChirho] of chapter9VersesChirho) {
  const fileContentChirho = generateVerseFileChirho(9, verseNumChirho, wordsChirho);
  const fileNameChirho = `c009-v${String(verseNumChirho).padStart(3, '0')}-chirho.sql`;
  writeFileSync(join(outputDirChirho, fileNameChirho), fileContentChirho);
  console.log(`Generated ${fileNameChirho}`);
}
console.log('Chapter 9 complete!');

// Generate files for chapter 10
const chapter10VersesChirho = groupByVerseChirho(chapter10GlossesChirho);
for (const [verseNumChirho, wordsChirho] of chapter10VersesChirho) {
  const fileContentChirho = generateVerseFileChirho(10, verseNumChirho, wordsChirho);
  const fileNameChirho = `c010-v${String(verseNumChirho).padStart(3, '0')}-chirho.sql`;
  writeFileSync(join(outputDirChirho, fileNameChirho), fileContentChirho);
  console.log(`Generated ${fileNameChirho}`);
}
console.log('Chapter 10 complete!');

console.log('All chapters (8-10) complete!');
