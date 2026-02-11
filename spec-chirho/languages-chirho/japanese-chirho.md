# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Japanese (jpn) Translation Spec

## Language Code
`jpn` - Japanese (日本語)

## Model Source
`opus-4.5-chirho`

## General Rules

### Script
Standard Japanese writing: kanji + hiragana + katakana
- Kanji for content words (verbs, nouns, adjectives)
- Hiragana for grammatical particles, inflections
- Katakana for foreign proper names

### OT Hebrew Particles (hyphenated with n-dash)
| Hebrew | Prefix | Japanese | Notes |
|--------|--------|----------|-------|
| ה (ha-) | the | –その | Definite article |
| ב (be-) | in | –に | Locative/instrumental |
| ל (le-) | to | –へ | Directional/dative |
| מ (min-) | from | –から | Ablative |
| ו (ve-) | and | –と | Conjunctive |
| כ (ke-) | as/like | –のように | Comparative |

### Divine Names
| Hebrew | Japanese | Notes |
|--------|----------|-------|
| יהוה (YHWH) | 主(ヤハウェ) | LORD (Yahweh) |
| אלהים (Elohim) | 神 | God |
| אדני (Adonai) | 主 | Lord |
| אל (El) | 神 | God (singular) |
| אל שדי (El Shaddai) | 全能の神 | God Almighty |

### Key Names (Hebrew → Japanese Katakana)
| Hebrew | Japanese | English |
|--------|----------|---------|
| אדם | アダム | Adam |
| חוה | エバ | Eve |
| נח | ノア | Noah |
| אברם/אברהם | アブラム/アブラハム | Abram/Abraham |
| שרי/שרה | サライ/サラ | Sarai/Sarah |
| יצחק | イサク | Isaac |
| יעקב/ישראל | ヤコブ/イスラエル | Jacob/Israel |
| עשו | エサウ | Esau |
| יוסף | ヨセフ | Joseph |
| ראובן | ルベン | Reuben |
| שמעון | シメオン | Simeon |
| לוי | レビ | Levi |
| יהודה | ユダ | Judah |
| דן | ダン | Dan |
| נפתלי | ナフタリ | Naphtali |
| גד | ガド | Gad |
| אשר | アシェル | Asher |
| יששכר | イッサカル | Issachar |
| זבולן | ゼブルン | Zebulun |
| בנימין | ベニヤミン | Benjamin |
| משה | モーセ | Moses |
| לוט | ロト | Lot |
| ישמעאל | イシュマエル | Ishmael |
| הגר | ハガル | Hagar |
| רבקה | リベカ | Rebekah |
| לבן | ラバン | Laban |
| רחל | ラケル | Rachel |
| לאה | レア | Leah |
| פרעה | ファラオ | Pharaoh |
| מלכי־צדק | メルキゼデク | Melchizedek |

### Place Names
| Hebrew | Japanese | English |
|--------|----------|---------|
| ארץ | 地 | land/earth |
| שמים | 天 | heavens/sky |
| עדן | エデン | Eden |
| כנען | カナン | Canaan |
| מצרים | エジプト | Egypt |
| בבל | バベル | Babel |
| חרן | ハラン | Haran |
| סדם | ソドム | Sodom |
| עמרה | ゴモラ | Gomorrah |
| בית־אל | ベテル | Bethel |
| חברון | ヘブロン | Hebron |
| באר שבע | ベエルシェバ | Beersheba |
| גלעד | ギレアデ | Gilead |

## Translation Rules
1. Each Hebrew word → one Japanese translation
2. Same lemma → same translation (consistency)
3. Particles hyphenated with n-dash (–)
4. Preserve source word order for interlinear alignment
5. Use standard Japanese (kanji + hiragana/katakana)
6. Proper names in katakana
7. Verbs in dictionary/plain form unless context requires otherwise

## Consistency Decisions

| Lemma | Decision | Notes |
|-------|----------|-------|
| H430 אלהים | 神 | God |
| H3068 יהוה | 主(ヤハウェ) | LORD |
| H1254 ברא | 創造した | Created |
| H559 אמר | 言った | Said |
| H7200 ראה | 見た | Saw |
| H6213 עשה | 造った | Made |
| H5414 נתן | 与えた | Gave |
| H3947 לקח | 取った | Took |
| H1980 הלך | 行った | Went |
| H935 בוא | 来た | Came |
| H3427 ישב | 住んだ | Dwelt |
| H8085 שמע | 聞いた | Heard |
| H3045 ידע | 知った | Knew |
| H7121 קרא | 呼んだ | Called |
| H4191 מות | 死んだ | Died |
| H2421 חיה | 生きた | Lived |
| H3205 ילד | 産んだ | Bore/begat |
| H1288 ברך | 祝福した | Blessed |
| H3372 ירא | 恐れた | Feared |
| H157 אהב | 愛した | Loved |
| H5650 עבד | しもべ | Servant |
| H1121 בן | 息子 | Son |
| H1323 בת | 娘 | Daughter |
| H802 אשה | 女/妻 | Woman/wife |
| H376 איש | 男/人 | Man/person |
| H5315 נפש | 魂 | Soul |
| H3820 לב | 心 | Heart |
| H1285 ברית | 契約 | Covenant |
| H2233 זרע | 子孫 | Seed/offspring |
| H776 ארץ | 地 | Land/earth |
| H8064 שמים | 天 | Heavens |
| H3117 יום | 日 | Day |
| H3915 לילה | 夜 | Night |
| H4325 מים | 水 | Water |
| H784 אש | 火 | Fire |
| H6086 עץ | 木 | Tree |
| H2896 טוב | 良い | Good |
| H7451 רע | 悪い | Evil/bad |
| H6944 קדש | 聖なる | Holy |
