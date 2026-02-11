# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# -- John 3:16

# Tamil (tam) Translation Spec

## Language Code
`tam` - Tamil (தமிழ் எழுத்து script)

## Model Source
`opus-4.5-chirho`

## General Rules

### Script
Tamil script (தமிழ் எழுத்து) - a Brahmic abugida with 12 vowels, 18 consonants, and 216 combinant letters.

### Morphology
Tamil is an agglutinative, SOV (Subject-Object-Verb) Dravidian language. For interlinear translation, we preserve Hebrew source word order.

### OT Hebrew Particles (hyphenated with n-dash)
| Hebrew | Particle | Tamil | Transliteration |
|--------|----------|-------|-----------------|
| ה | the | –அந்த | -anta |
| ב | in | –இல் | -il |
| ל | to/for | –க்கு | -kku |
| מ | from | –இருந்து | -iruntu |
| ו | and | –மற்றும் | -maṟṟum |
| כ | as/like | –போல | -pōla |
| את | (object marker) | –ஐ | -ai |
| על | upon/over | –மேல் | -mēl |
| אל | to/toward | –நோக்கி | -nōkki |
| עם | with | –உடன் | -uṭaṉ |
| בין | between | –இடையில் | -iṭaiyil |
| תחת | under | –கீழ் | -kīḻ |

### Divine Names
| Hebrew | Tamil | Transliteration | Notes |
|--------|-------|-----------------|-------|
| יהוה (YHWH) | கர்த்தர் | Karttar | LORD - traditional Tamil rendering |
| אלהים | தேவன் | Tēvaṉ | God - standard Tamil Christian term |
| אדני | ஆண்டவர் | Āṇṭavar | Lord/Master |
| אל שדי | சர்வவல்லமையுள்ள–தேவன் | Sarvavallmaiyuḷḷa-Tēvaṉ | God Almighty |
| יהוה אלהים | கர்த்தராகிய–தேவன் | Karttarākiya-Tēvaṉ | LORD God |

### Key Names (Hebrew to Tamil)
| Hebrew | Tamil | Transliteration |
|--------|-------|-----------------|
| אברהם | ஆபிரகாம் | Āpiraham |
| יצחק | ஈசாக்கு | Īsākku |
| יעקב | யாக்கோபு | Yākkōpu |
| עשו | ஏசா | Ēsā |
| משה | மோசே | Mōsē |
| דוד | தாவீது | Tāvītu |
| שרה | சாராள் | Sārāḷ |
| רבקה | ரெபேக்காள் | Repēkkāḷ |
| רחל | ராகேல் | Rākēl |
| לאה | லேயாள் | Lēyāḷ |
| יוסף | யோசேப்பு | Yōsēppu |
| נח | நோவா | Nōvā |
| אדם | ஆதாம் | Ātām |
| חוה | ஏவாள் | Ēvāḷ |
| קין | காயீன் | Kāyīṉ |
| הבל | ஆபேல் | Āpēl |
| שם | சேம் | Sēm |
| חם | காம் | Kām |
| יפת | யாப்பேத் | Yāppēt |
| לוט | லோத்து | Lōttu |
| ישמעאל | இஸ்மவேல் | Ismavēl |
| פרעה | பார்வோன் | Pārvōṉ |

### Place Names
| Hebrew | Tamil | Transliteration |
|--------|-------|-----------------|
| עדן | ஏதேன் | Ētēṉ |
| מצרים | எகிப்து | Ekiptu |
| כנען | கானான் | Kāṉāṉ |
| בבל | பாபேல் | Pāpēl |
| שנער | சினெயார் | Siṉeyār |
| חרן | ஆரான் | Ārāṉ |
| סדם | சோதோம் | Sōtōm |
| עמרה | கொமோரா | Komōrā |
| בית אל | பெத்தேல் | Pettēl |
| חברון | எப்ரோன் | Eprōṉ |

## Hebrew (Old Testament) Consistency Decisions

| Lemma | Hebrew | Tamil | Transliteration | Notes |
|-------|--------|-------|-----------------|-------|
| H430 | אֱלֹהִים | தேவன் | Tēvaṉ | God |
| H3068 | יהוה | கர்த்தர் | Karttar | LORD |
| H1254 | בָּרָא | சிருஷ்டித்தார் | Siruṣṭittār | create (ex nihilo) |
| H776 | אֶרֶץ | பூமி | Pūmi | earth/land |
| H8064 | שָׁמַיִם | வானங்கள் | Vāṉaṅkaḷ | heavens/sky |
| H120 | אָדָם | மனிதன் | Maṉitaṉ | man/Adam (context) |
| H216 | אוֹר | வெளிச்சம் | Veḷiccam | light |
| H2822 | חֹשֶׁךְ | இருள் | Iruḷ | darkness |
| H4325 | מַיִם | தண்ணீர் | Taṇṇīr | water/waters |
| H7307 | רוּחַ | ஆவி | Āvi | spirit/wind/breath |
| H3117 | יוֹם | நாள் | Nāḷ | day |
| H3915 | לַיְלָה | இரவு | Iravu | night |
| H802 | אִשָּׁה | மனைவி | Maṉaivi | woman/wife |
| H376 | אִישׁ | மனிதன் | Maṉitaṉ | man/husband |
| H5175 | נָחָשׁ | பாம்பு | Pāmpu | serpent |
| H6086 | עֵץ | மரம் | Maram | tree |
| H1588 | גַּן | தோட்டம் | Tōṭṭam | garden |
| H2416 | חַי | உயிருள்ள | Uyiruḷḷa | living/alive |
| H4191 | מוּת | மரிப்பாய் | Marippāy | to die |
| H2896 | טוֹב | நல்ல | Nalla | good |
| H7451 | רַע | தீய | Tīya | evil/bad |
| H3045 | יָדַע | அறிந்தான் | Aṟintāṉ | to know |
| H8085 | שָׁמַע | கேட்டான் | Kēṭṭāṉ | to hear |
| H7200 | רָאָה | கண்டார் | Kaṇṭār | to see |
| H559 | אָמַר | சொன்னார் | Soṉṉār | to say/said |
| H1696 | דָּבַר | பேசினார் | Pēsiṉār | to speak/spoke |
| H6213 | עָשָׂה | செய்தார் | Seytār | to make/made |
| H5414 | נָתַן | கொடுத்தார் | Koṭuttār | to give/gave |
| H3947 | לָקַח | எடுத்தார் | Eṭuttār | to take/took |
| H1980 | הָלַךְ | நடந்தான் | Naṭantāṉ | to walk/go |
| H935 | בּוֹא | வந்தான் | Vantāṉ | to come/came |
| H3318 | יָצָא | புறப்பட்டான் | Puṟappaṭṭāṉ | to go out |
| H7121 | קָרָא | அழைத்தார் | Aḻaittār | to call |
| H1288 | בָּרַךְ | ஆசீர்வதித்தார் | Āsīrvatittār | to bless |
| H779 | אָרַר | சபித்தார் | Sapittār | to curse |
| H6942 | קָדַשׁ | பரிசுத்தமாக்கினார் | Parisuttamākkinār | to sanctify |
| H7673 | שָׁבַת | ஓய்ந்தார் | Ōyntār | to rest/cease |
| H1285 | בְּרִית | உடன்படிக்கை | Uṭaṉpaṭikkai | covenant |
| H2233 | זֶרַע | சந்ததி | Santati | seed/offspring |
| H5315 | נֶפֶשׁ | ஆத்துமா | Āttumā | soul/life |
| H3820 | לֵב | இருதயம் | Irutayam | heart |
| H1818 | דָּם | இரத்தம் | Irattam | blood |
| H6440 | פָּנִים | முகம் | Mukam | face |
| H3027 | יָד | கை | Kai | hand |
| H5869 | עַיִן | கண் | Kaṇ | eye |
| H241 | אֹזֶן | காது | Kātu | ear |
| H7218 | רֹאשׁ | தலை | Talai | head |
| H7272 | רֶגֶל | கால் | Kāl | foot |
| H1121 | בֵּן | மகன் | Makaṉ | son |
| H1323 | בַּת | மகள் | Makaḷ | daughter |
| H1 | אָב | தகப்பன் | Takappan | father |
| H517 | אֵם | தாய் | Tāy | mother |
| H251 | אָח | சகோதரன் | Sakōtaraṉ | brother |
| H269 | אָחוֹת | சகோதரி | Sakōtari | sister |

## Translation Notes

### Tamil Phonology Notes
- Tamil has no aspirated consonants - use native Tamil equivalents
- Tamil has no voiced/voiceless distinction for stops initially
- Retroflex consonants (ட, ண, ள) are characteristic of Tamil
- Use the grantha letters (ஜ, ஷ, ஸ, ஹ) sparingly for loanwords

### Verb Conjugation in Glosses
- Past tense 3rd person honorific: -ஆர் (-ār) for God's actions
- Past tense 3rd person masculine: -ஆன் (-āṉ) for male humans
- Past tense 3rd person feminine: -ஆள் (-āḷ) for female humans
- Imperative: base form for commands
- Use infinitive/verbal noun for general references

### Number System
- Tamil has its own numeral system but Arabic numerals are standard
- Ordinals: முதல் (first), இரண்டாம் (second), மூன்றாம் (third), நான்காம் (fourth), ஐந்தாம் (fifth), ஆறாம் (sixth), ஏழாம் (seventh)
