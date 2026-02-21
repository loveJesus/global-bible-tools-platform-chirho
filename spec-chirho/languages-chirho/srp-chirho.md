# Serbian (srp) Translation Spec

## Language Code
`srp` - Serbian (Српски / Srpski)

## Model Source
`opus-4.6-chirho`

## Reference Version
SrpDK (Sveto Pismo, Daničić-Karadžić 1868) - Public Domain

## General Rules

### Script Usage
- Latin script (latinica) for all glosses — matches eBible reference text
- En-dash (–) for multi-word glosses: i–reče, u–početku
- Serbian uses both Cyrillic and Latin; we use Latin for broader accessibility

### Postpositive Conjunctions
| Greek | Lemma | Serbian | Notes |
|-------|-------|---------|-------|
| γάρ | G1063 | jer | Causal "for" |
| δέ | G1161 | a / i | Adversative/continuative |
| οὖν | G3767 | dakle | Inferential "therefore" |
| μέν | G3303 | s–jedne–strane | "on the one hand" |

### Names - Transliteration (from Greek)
| Greek | Serbian |
|-------|---------|
| Ἰησοῦς | Isus |
| Χριστός | Hristos |
| Πέτρος | Petar |
| Παῦλος | Pavle |
| Ἰωάννης | Jovan |
| Μωϋσῆς | Mojsije |
| Ἀβραάμ | Avram |
| Δαυίδ | David |
| Ἰσραήλ | Izrailj |
| Ἰακώβ | Jakov |
| Ἰωσήφ | Josif |
| Μαρία | Marija |
| Σίμων | Simon |

### Names - Transliteration (from Hebrew)
| Hebrew | Serbian |
|--------|---------|
| יהוה | Gospod |
| אֱלֹהִים | Bog |
| אַבְרָהָם | Avram |
| יִצְחָק | Isak |
| יַעֲקֹב | Jakov |
| מֹשֶׁה | Mojsije |
| אַהֲרֹן | Aron |
| דָּוִד | David |
| שְׁלֹמֹה | Solomon |
| שָׁאוּל | Saul |
| שְׁמוּאֵל | Samuilo |

### Divine Names
| Greek/Hebrew | Serbian |
|--------------|---------|
| יהוה (YHWH) | Gospod |
| אֱלֹהִים (Elohim) | Bog |
| אֲדֹנָי (Adonai) | Gospod |
| κύριος (Kyrios) | Gospod |
| θεός (Theos) | Bog |
| πνεῦμα ἅγιον | Sveti–Duh |

## Translator Notes
- Serbian uses SVO word order, but interlinear preserves source order
- Case endings (nominative, genitive, dative, accusative, instrumental, locative, vocative) on nouns/adjectives
- Prepositions: u (in), na (on), sa (with), od (from), za (for), po (by)
- Attach prepositions/case context via en-dash when needed
- Keep glosses concise — prefer common Serbian vocabulary
- Latin script throughout (not Cyrillic)

## Consistency Decisions
| Lemma | Decision | Notes |
|-------|----------|-------|
| H1254 בָּרָא | stvori | "created" - bara |
| H430 אֱלֹהִים | Bog | "God" - Elohim |
| H8064 שָׁמַיִם | nebo | "heavens" |
| H776 אֶרֶץ | zemlja | "earth/land" |
| H7225 רֵאשִׁית | u–početku | "beginning" |
| G3056 λόγος | reč | "word" - Logos |
| G4102 πίστις | vera | "faith" |
| G26 ἀγάπη | ljubav | "love" |
| G5485 χάρις | blagodat | "grace" |
