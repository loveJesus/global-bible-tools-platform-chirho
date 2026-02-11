# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# -- John 3:16

# Persian/Farsi (fas) Translation Spec

## Language Code
`fas` - Persian (Farsi / فارسی)

## Model Source
`opus-4.5-chirho`

## Script
Persian uses Arabic script (right-to-left) with additional letters: پ چ ژ گ

## General Rules

### OT Hebrew Particles (hyphenated with n-dash)
| Hebrew | Meaning | Persian | Example |
|--------|---------|---------|---------|
| ה (ha-) | the | آن– | آن–آسمان (the-heaven) |
| ב (be-) | in | در– | در–آغاز (in-beginning) |
| ל (le-) | to | به– | به–او (to-him) |
| מ (min-) | from | از– | از–آب (from-water) |
| ו (ve-) | and | و– | و–زمین (and-earth) |
| כ (ke-) | as/like | مانند– | مانند–آتش (as-fire) |
| ש (she-) | that/which | که– | که– (that-) |
| את (et) | [obj marker] | را | Marks definite direct object |

### NT Greek Particles (hyphenated with n-dash)
| Greek | Meaning | Persian |
|-------|---------|---------|
| τοῦ/τῆς | of the | از–آن |
| τῷ/τῇ | to the | به–آن |
| ἐν | in | در– |
| εἰς | into/to | به– |
| ἐκ/ἐξ | from/out of | از– |
| καί | and | و– |
| ὁ/ἡ/τό | the | آن– |
| μετά | with/after | با– |
| διά | through | از–طریقِ |
| πρός | toward | به–سوی |
| ἐπί | upon | بر– |
| ὑπό | by/under | زیرِ– |
| ἀπό | from | از– |
| περί | about | درباره– |
| κατά | according to | مطابقِ– |
| σύν | with | با– |
| παρά | beside | نزدِ– |

### Postpositive Conjunctions (Greek)
| Greek | Lemma | Persian | Notes |
|-------|-------|---------|-------|
| γάρ | G1063 | زیرا | Because/for |
| δέ | G1161 | و/اما | و for continuation, اما for contrast |
| μέν | G3303 | البته | Indeed/certainly |
| τε | G5037 | نیز | Also |
| οὖν | G3767 | پس | Therefore/so |

### Divine Names
| Source | Persian | Transliteration |
|--------|---------|-----------------|
| יהוה (YHWH) | خداوند | Khodavand |
| אלהים (Elohim) | خدا | Khoda |
| θεός (Theos) | خدا | Khoda |
| κύριος (Kyrios) | خداوند | Khodavand |
| אדני (Adonai) | خداوند | Khodavand |
| שדי (Shaddai) | قادرِمطلق | Qader-e Motlaq |
| עליון (Elyon) | متعال | Mota'al |
| πατήρ (Pater) | پدر | Pedar |
| υἱός (Huios) | پسر | Pesar |
| πνεῦμα ἅγιον | روحِ‌القُدُس | Ruh-ol-Qodos |

### OT Names (Hebrew to Persian)
| Hebrew | Persian | Transliteration |
|--------|---------|-----------------|
| אברהם | ابراهیم | Ebrahim |
| יצחק | اسحاق | Es'haq |
| יעקב | یعقوب | Ya'qub |
| ישראל | اسرائیل | Esra'il |
| משה | موسی | Musa |
| דוד | داوود | Davud |
| שרה | ساره | Sareh |
| רבקה | ربکا | Rebka |
| רחל | راحیل | Rahil |
| לאה | لیا | Lia |
| יוסף | یوسف | Yusef |
| אדם | آدم | Adam |
| חוה | حوا | Havva |
| נח | نوح | Nuh |
| שם | سام | Sam |
| חם | حام | Ham |
| יפת | یافث | Yafes |
| שלמה | سلیمان | Soleyman |
| אהרן | هارون | Harun |

### NT Names (Greek to Persian)
| Greek | Persian | Transliteration |
|-------|---------|-----------------|
| Ἰησοῦς | عیسی | Isa |
| Χριστός | مسیح | Masih |
| Πέτρος | پطرس | Petros |
| Παῦλος | پولس | Polus |
| Ἰούδας | یهودا | Yahuda |
| Ἰάκωβος | یعقوب | Ya'qub |
| Μωϋσῆς | موسی | Musa |
| Ἀδάμ | آدم | Adam |
| Ἑνώχ | خنوخ | Khanukh |
| Μιχαήλ | میکائیل | Mika'il |
| Σόδομα | سدوم | Sodom |
| Γόμορρα | غموره | Ghamoreh |
| Αἴγυπτος | مصر | Mesr |
| Κάϊν | قائن | Qa'en |
| Βαλαάμ | بلعام | Bal'am |
| Κόρε | قورح | Qurah |

### Place Names
| Source | Persian | Transliteration |
|--------|---------|-----------------|
| ארץ | سرزمین | Sarzamin |
| מצרים | مصر | Mesr |
| כנען | کنعان | Kan'an |
| בבל | بابل | Babel |
| ירושלים | اورشلیم | Urshlaim |
| ציון | صهیون | Sahyun |
| עדן | عدن | Adan |

## Translation Philosophy

### Word Order
Persian is SOV (Subject-Object-Verb), but for interlinear purposes we preserve the source word order. Each Hebrew/Greek word gets exactly one Persian gloss.

### Object Marker
Persian uses "را" (ra) as a definite direct object marker. This is added after the noun when translating את (et).

### Ezafe Construction
Persian uses the ezafe (-e/-ye) to connect nouns with modifiers. In interlinear, represent with kasreh or explicitly:
- "پسرِ خدا" (son of God)

### Verbal System
Persian verbs are conjugated. For interlinear, use simple forms:
- Past: کرد (did), گفت (said), آمد (came)
- Present: می‌کند (does), می‌گوید (says)
- Imperative: بکن (do!), بگو (say!)
- Infinitive: کردن (to do), گفتن (to say)

## Consistency Decisions

### Core Theological Vocabulary
| Lemma | Persian | Transliteration | Notes |
|-------|---------|-----------------|-------|
| H1254 ברא | آفرید | afarid | Created (past) |
| H776 ארץ | زمین | zamin | Earth/land |
| H8064 שמים | آسمان | aseman | Heaven/sky |
| H7307 רוח | روح | ruh | Spirit/wind |
| H4325 מים | آب | ab | Water |
| H216 אור | نور | nur | Light |
| H2822 חשך | تاریکی | tariki | Darkness |
| H3117 יום | روز | ruz | Day |
| H3915 לילה | شب | shab | Night |
| H1242 בקר | صبح | sobh | Morning |
| H6153 ערב | عصر | asr | Evening |
| H1285 ברית | عهد | ahd | Covenant |
| H2617 חסד | رحمت | rahmat | Mercy/lovingkindness |
| H530 אמונה | ایمان | iman | Faith/faithfulness |
| H6666 צדקה | عدالت | edalat | Righteousness |
| H8451 תורה | شریعت | shariat | Law/Torah |
| H5315 נפש | جان | jan | Soul/life |
| H3820 לב | دل | del | Heart |
| H1697 דבר | سخن | sokhan | Word/matter |
| H2398 חטא | گناه | gonah | Sin |
| H3467 ישע | نجات | nejat | Salvation |
| H4941 משפט | داوری | davari | Judgment |
| H8085 שמע | شنید | shanid | Heard/listened |
| H559 אמר | گفت | goft | Said |
| H7200 ראה | دید | did | Saw |
| H3045 ידע | دانست | danest | Knew |
| H5414 נתן | داد | dad | Gave |
| H3947 לקח | گرفت | gereft | Took |
| H7121 קרא | خواند | khand | Called |
| H1980 הלך | رفت | raft | Went |
| H935 בוא | آمد | amad | Came |
| H3427 ישב | نشست | neshast | Sat/dwelt |
| H6213 עשה | ساخت | sakht | Made |
| H1961 היה | بود | bud | Was |

### NT Core Vocabulary
| Lemma | Persian | Transliteration |
|-------|---------|-----------------|
| G26 ἀγάπη | محبت | mohabbat |
| G4102 πίστις | ایمان | iman |
| G1680 ἐλπίς | امید | omid |
| G5485 χάρις | فیض | feyz |
| G1515 εἰρήνη | صلح/سلام | solh/salam |
| G266 ἁμαρτία | گناه | gonah |
| G225 ἀλήθεια | حقیقت | haqiqat |
| G2222 ζωή | حیات | hayat |
| G2288 θάνατος | مرگ | marg |
| G2919 κρίνω | داوری‌کرد | davari kard |
| G4982 σῴζω | نجات‌داد | nejat dad |
| G25 ἀγαπάω | محبت‌کرد | mohabbat kard |
| G4100 πιστεύω | ایمان‌آورد | iman avard |
| G1097 γινώσκω | شناخت | shenakht |
| G3056 λόγος | کلام | kalam |
| G4151 πνεῦμα | روح | ruh |
| G32 ἄγγελος | فرشته | fereshteh |
| G1228 διάβολος | ابلیس | eblis |
| G2889 κόσμος | جهان | jahan |
| G1411 δύναμις | قدرت | qodrat |
| G1391 δόξα | جلال | jalal |

## Persian-Specific Patterns

### Genitive Chains
Use ezafe (kasreh) to connect:
- τοῦ Κυρίου ἡμῶν Ἰησοῦ Χριστοῦ → "از–خداوندِ ما عیسی مسیح"

### Verbal Participles
- λέγων → گویان (saying)
- ποιούμενος → کنان (doing)

### Negation
- לא / οὐ → نه (no/not)
- אל / μή → نه (don't) - prohibition

### Numbers
| Hebrew | Persian |
|--------|---------|
| אחד | یک |
| שנים | دو |
| שלשה | سه |
| ארבעה | چهار |
| חמשה | پنج |
| ששה | شش |
| שבעה | هفت |
| שמנה | هشت |
| תשעה | نه |
| עשרה | ده |
