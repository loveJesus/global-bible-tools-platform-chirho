# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Burmese (mya) Translation Spec

## Language Code
`mya` - Burmese (မြန်မာ)

## Reference Version
`BurJudson` - Burmese Judson Bible 1835 (id=25)

## Model Source
`opus-4.5-chirho`

## General Rules

### Postpositive Conjunctions
| Greek | Lemma | Burmese | Notes |
|-------|-------|---------|-------|
| γάρ | G1063 | အဘယ်ကြောင့်ဆိုသော် | "because/for" - place before clause |
| δέ | G1161 | –သော်လည်း | "but/and" - hyphenate as particle |
| οὖν | G3767 | –ထို့ကြောင့် | "therefore" |
| μέν | G3303 | –မူကား | "indeed/on the one hand" |

### Particles (hyphenated with n-dash)
- τοῦ → –၏ (of-)
- τῷ → –ကို (to-)
- ἐν → –၌ (in-)
- εἰς → –သို့ (into-)
- ἐκ → –မှ (from-)
- καί → –နှင့် (and-)
- ὁ/ἡ/τό → –ထို (the-)

### OT Hebrew Particles
- ה (the) → –ထို (the-)
- ב (in) → –၌ (in-)
- ל (to) → –သို့ (to-)
- מ (from) → –မှ (from-)
- ו (and) → –နှင့် (and-)
- כ (as/like) → –ကဲ့သို့ (as/like-)

### Names - Transliteration
| Greek/Hebrew | Burmese |
|--------------|---------|
| Ἰησοῦς | ယေရှု |
| Χριστός | ခရစ်တော် |
| Πέτρος | ပေတရု |
| Παῦλος | ပေါလု |
| Μωϋσῆς | မောရှေ |
| Ἀβραάμ | အာဗြဟံ |
| Δαυίδ | ဒါဝိဒ် |
| Ἰάκωβος | ယာကုပ် |
| Ἰωάννης | ယောဟန် |

### Divine Names
| Hebrew/Greek | Burmese |
|--------------|---------|
| יהוה (YHWH) | ထာဝရဘုရား |
| אלהים | ဘုရားသခင် |
| θεός | ဘုရားသခင် |
| κύριος | သခင် |

## Translator Notes
- Burmese is an SOV (Subject-Object-Verb) language
- Burmese uses postpositions, not prepositions
- Particles should be hyphenated with n-dash when they are affixed forms
- Myanmar script uses no spaces between words - use standard word segmentation
- Use Padauk-compatible Unicode for Myanmar script
- Possessive marker ၏ should be hyphenated when used as a particle

## Consistency Decisions
| Lemma | Decision | Notes |
|-------|----------|-------|
| G2424 (Ἰησοῦς) | ယေရှု | Jesus |
| G5547 (Χριστός) | ခရစ်တော် | Christ |
| G2316 (θεός) | ဘုရားသခင် | God |
| G2962 (κύριος) | သခင် | Lord |
| H3068 (יהוה) | ထာဝရဘုရား | YHWH/LORD |
| H430 (אלהים) | ဘုရားသခင် | God |
