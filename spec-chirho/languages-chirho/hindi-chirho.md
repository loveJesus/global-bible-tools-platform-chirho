# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Hindi (hin) Translation Spec

## Language Code
`hin` - Hindi (Devanagari script)

## Model Source
`opus-4.5-chirho`

## General Rules

### Postpositive Conjunctions
Greek postpositives (words that appear second in clause but translate first):

| Greek | Lemma | Hindi | Notes |
|-------|-------|-------|-------|
| γάρ | G1063 | तो (to) | Lighter than क्योंकि (kyonki), works mid-sentence |
| δέ | G1161 | और/परन्तु | और for continuation, परन्तु for contrast |
| μέν | G3303 | तो | Often paired with δέ |
| τε | G5037 | भी | Enclitic "and/also" |
| οὖν | G3767 | इसलिए | Therefore/so |

### Articles
| Greek | Hindi | Example |
|-------|-------|---------|
| ὁ, ἡ, τό | वह/उस | Definite - use with n-dash when prefixed |
| τοῖς, ταῖς | उन | Dative plural |

### Particles (hyphenated with n-dash)
- उस–को (to-him)
- उन–में (in-them)
- के–लिए (for)
- के–द्वारा (through)

### Names - Devanagari Transliteration
| Greek | Hindi |
|-------|-------|
| Ἰησοῦς | यीशु |
| Χριστός | मसीह |
| Ἰούδας | यहूदा |
| Ἰάκωβος | याकूब |
| Μωϋσῆς | मूसा |
| Ἀδάμ | आदम |
| Ἑνώχ | हनोक |
| Μιχαήλ | मीकाएल |
| Σόδομα | सदोम |
| Γόμορρα | अमोरा |
| Αἴγυπτος | मिस्र |
| Κάϊν | कैन |
| Βαλαάμ | बिलाम |
| Κόρε | कोरह |

### Divine Names
| Greek/Hebrew | Hindi |
|--------------|-------|
| Θεός | परमेश्वर |
| Κύριος | प्रभु |
| Πατήρ | पिता |
| יהוה | यहोवा |

## Translator Notes

### Jude Translation (2026-01-19)

**v4 - γάρ handling:**
Used तो (to) instead of क्योंकि because it's lighter and works mid-sentence:
"घुस–आए तो कुछ मनुष्य" (crept-in so some men)

**v5 - δέ contrast:**
Used परन्तु for contrastive δέ: "स्मरण–दिलाना परन्तु तुम–को चाहता–हूँ"

**v8 - μέν...δέ construction:**
v8 has μέν...δέ...δέ pattern:
- σάρκα μὲν μιαίνουσιν → "शरीर–को तो अशुद्ध–करते–हैं"
- κυριότητα δὲ ἀθετοῦσιν → "प्रभुता–को और तुच्छ–समझते–हैं"

**v11 - Exclamation:**
οὐαὶ αὐτοῖς! → "हाय उन–पर!" (Woe to-them!)

**v22-23 - Textual variants:**
Followed NA28 text structure for the μέν...δέ...δέ sequence.

## Consistency Decisions

| Lemma | Decision | Notes |
|-------|----------|-------|
| G1063 γάρ | तो | Always use lighter form |
| G1161 δέ | और/परन्तु | Context determines |
| G2962 κύριος | प्रभु | Lord (not master) |
| G2316 θεός | परमेश्वर | God |
| G4982 σῴζω | बचाना | Save |
| G2919 κρίνω | न्याय | Judge |
| G26 ἀγάπη | प्रेम | Love (noun) |
| G25 ἀγαπάω | प्रेम–करना | Love (verb) |
| G2222 ζωή | जीवन | Life |
| G166 αἰώνιος | अनन्त | Eternal |
| G2889 κόσμος | संसार | World |
| G5457 φῶς | ज्योति | Light |
| G4655 σκοτία | अन्धकार | Darkness |
| G266 ἁμαρτία | पाप | Sin |
| G264 ἁμαρτάνω | पाप–करना | Sin (verb) |
| G225 ἀλήθεια | सत्य | Truth |
| G3306 μένω | बना–रहना | Remain/abide |
| G1097 γινώσκω | जानना | Know |
| G4100 πιστεύω | विश्वास–करना | Believe |
| G5207 υἱός | पुत्र | Son |
| G5043 τέκνον | सन्तान | Child/children |
| G1785 ἐντολή | आज्ञा | Commandment |
| G5083 τηρέω | मानना | Keep/obey |
| G3140 μαρτυρέω | गवाही–देना | Testify/witness |
| G3141 μαρτυρία | गवाही | Testimony |
| G80 ἀδελφός | भाई | Brother |
| G3404 μισέω | बैर–रखना | Hate |
| G500 ἀντίχριστος | मसीह–विरोधी | Antichrist |
| G5574 ψεύδομαι | झूठ–बोलना | Lie (verb) |
| G5583 ψεύστης | झूठा | Liar |
| G3875 παράκλητος | सहायक | Helper/Advocate |
| G2434 ἱλασμός | प्रायश्चित | Propitiation |
| G2841 κοινωνία | संगति | Fellowship |
| G4102 πίστις | विश्वास | Faith |
| G3528 νικάω | जीतना | Overcome/conquer |
| G3529 νίκη | जय | Victory |
| G5399 φοβέω | भय–करना | Fear (verb) |
| G5401 φόβος | भय | Fear (noun) |
| G3954 παρρησία | साहस | Boldness/confidence |

### 1 John Translation (2026-01-19)

**Key Themes:**
1 John focuses on love (प्रेम), light vs darkness (ज्योति vs अन्धकार), and knowing God (परमेश्वर–को–जानना).

**v1:1-4 - Opening:**
The prologue echoes John's Gospel. "Word of life" (वचन of जीवन) - maintained literal word order.

**v2:1 - παράκλητος:**
Used सहायक (helper) rather than वकील (advocate/lawyer) - captures the comfort/help aspect.

**v2:2 - ἱλασμός:**
Used प्रायश्चित (propitiation/atonement) - standard Hindi theological term.

**v2:18-19 - ἀντίχριστος:**
Translated as मसीह–विरोधी (Christ-opposer) - clear compound word.

**v3:1 - τέκνα θεοῦ:**
"Children of God" = सन्तान परमेश्वर - using सन्तान for τέκνα throughout.

**v4:8,16 - ὁ θεὸς ἀγάπη ἐστίν:**
"God is love" = परमेश्वर प्रेम है - central theological statement.

**v4:18 - Perfect love casts out fear:**
τελεία ἀγάπη ἔξω βάλλει τὸν φόβον = सिद्ध प्रेम बाहर निकाल–देता–है उस भय

**v5:6-8 - Three witnesses:**
Spirit, water, blood = आत्मा, पानी, लहू - maintained standard terms.

## Hebrew (Old Testament) Consistency Decisions

| Lemma | Hebrew | Decision | Notes |
|-------|--------|----------|-------|
| H430 | אֱלֹהִים | एलोहीम | Divine name transliterated; plural of majesty |
| H3068 | יהוה | यहोवा | YHWH - traditional Hindi rendering |
| H1254 | בָּרָא | सृजा | bara - create (ex nihilo) |
| H776 | אֶרֶץ | पृथ्वी | erets - earth/land |
| H8064 | שָׁמַיִם | आकाश | shamayim - heavens/sky |
| H120 | אָדָם | आदम | adam - man/Adam |
| H216 | אוֹר | प्रकाश | or - light |
| H2822 | חֹשֶׁךְ | अन्धकार | choshek - darkness |
| H4325 | מַיִם | जल | mayim - water/waters |
| H7307 | רוּחַ | आत्मा | ruach - spirit/wind/breath |
| H3117 | יוֹם | दिन | yom - day |
| H3915 | לַיְלָה | रात | layla - night |
| H802 | אִשָּׁה | स्त्री | isha - woman/wife |
| H376 | אִישׁ | पुरुष | ish - man/husband |
| H5175 | נָחָשׁ | साँप | nachash - serpent |
| H6086 | עֵץ | वृक्ष | ets - tree |
| H1588 | גַּן | बाग़ | gan - garden |
| H2416 | חַי | जीवित | chay - living/alive |
| H4191 | מוּת | मरना | mut - to die |
| H2896 | טוֹב | अच्छा | tov - good |
| H7451 | רַע | बुरा | ra - evil/bad |
| H3045 | יָדַע | जानना | yada - to know |
| H8085 | שָׁמַע | सुनना | shama - to hear |
| H7200 | רָאָה | देखना | raah - to see |
| H559 | אָמַר | कहा | amar - to say/said |
| H1696 | דָּבַר | बोला | dabar - to speak/spoke |
| H6213 | עָשָׂה | बनाया | asah - to make/made |
| H5414 | נָתַן | दिया | natan - to give/gave |
| H3947 | לָקַח | लिया | laqach - to take/took |
| H1980 | הָלַךְ | चला | halak - to walk/go |
| H935 | בּוֹא | आया | bo - to come/came |
| H3318 | יָצָא | निकला | yatsa - to go out |
| H7121 | קָרָא | बुलाया | qara - to call |
| H1288 | בָּרַךְ | आशीष–दी | barak - to bless |
| H779 | אָרַר | शापित | arar - to curse |
| H6942 | קָדַשׁ | पवित्र–ठहराया | qadash - to sanctify |
| H7673 | שָׁבַת | विश्राम–किया | shabat - to rest/cease |

### Genesis Translation (2026-01-19)

**Chapter 1 - Creation:**
- "In–beginning" = आदि–में (bereshit)
- "created" = सृजा (bara - ex nihilo)
- "Elohim" = एलोहीम (divine name kept)
- "the–heavens" = उस–आकाश (with article)
- "the–earth" = उस–पृथ्वी (with article)
- "let–there–be light" = हो प्रकाश (yehi or)
- Day ordinals: एक, दूसरा, तीसरा, चौथा, पाँचवाँ, छठवाँ, सातवाँ

**Chapter 2 - Eden:**
- "YHWH Elohim" = यहोवा एलोहीम (first occurrence of divine name)
- "garden–in–Eden" = बाग़–अदन–में
- "tree of life" = वृक्ष उस–जीवन–का
- "tree of knowledge" = वृक्ष उस–ज्ञान–का
- "helper opposite–him" = सहायक उसके–सामने–की

**Chapter 3 - Fall:**
- "serpent" = साँप (nachash)
- "crafty" = चतुर (arum - wordplay with "naked")
- "eyes–opened" = आँखें खुलीं
- "cursed" = शापित (arur)
- "bruise head/heel" = कुचलेगा सिर/एड़ी (shuf - same verb both places)
