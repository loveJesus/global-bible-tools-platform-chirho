# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# -- John 3:16

# Vietnamese (vie) Translation Spec

## Language Code
`vie` - Vietnamese (Tieng Viet)

## Model Source
`opus-4.5-chirho`

## General Rules

### OT Hebrew Particles (hyphenated with n-dash)
| Hebrew | Prefix | Vietnamese | Example |
|--------|--------|------------|---------|
| ה (ha-) | the | -cai | -cai troi (the-heaven) |
| ב (be-) | in | -trong | -trong ban dau (in-beginning) |
| ל (le-) | to | -cho | -cho nguoi (to-person) |
| מ (min-) | from | -tu | -tu dat (from-land) |
| ו (ve-) | and | -va | -va dat (and-earth) |
| כ (ke-) | as/like | -nhu | -nhu nuoc (as/like-water) |
| את (et) | [obj] | [obj] | Direct object marker |
| על (al) | upon | tren | upon/over |
| אל (el) | to/toward | den | to/toward |
| עם (im) | with | voi | with |

### Divine Names
| Hebrew | Vietnamese | Notes |
|--------|------------|-------|
| יהוה (YHWH) | Duc Gie-ho-va | Standard Vietnamese rendering |
| אלהים (Elohim) | Duc Chua Troi | God (general) |
| אדני (Adonai) | Chua | Lord |
| אל שדי (El Shaddai) | Duc Chua Troi Toan Nang | God Almighty |
| אל עליון (El Elyon) | Duc Chua Troi Chi Cao | God Most High |

### Key Personal Names (Genesis)
| Hebrew | Vietnamese | Notes |
|--------|------------|-------|
| אדם (Adam) | A-dam | First man |
| חוה (Chavvah) | E-va | Eve |
| קין (Qayin) | Ca-in | Cain |
| הבל (Hevel) | A-ben | Abel |
| נח (Noach) | No-e | Noah |
| שם (Shem) | Sem | Shem |
| חם (Cham) | Cham | Ham |
| יפת (Yepheth) | Gia-phet | Japheth |
| אברם/אברהם | Ap-ram/Ap-ra-ham | Abram/Abraham |
| שרי/שרה | Sa-rai/Sa-ra | Sarai/Sarah |
| לוט (Lot) | Lot | Lot |
| ישמעאל (Yishma'el) | It-ma-en | Ishmael |
| יצחק (Yitschaq) | Y-sac | Isaac |
| רבקה (Rivqah) | Re-be-ca | Rebekah |
| עשו (Esav) | E-sau | Esau |
| יעקב (Ya'aqov) | Gia-cop | Jacob |
| לאה (Le'ah) | Le-a | Leah |
| רחל (Rachel) | Ra-chen | Rachel |
| יוסף (Yosef) | Gio-sep | Joseph |
| בנימין (Binyamin) | Ben-gia-min | Benjamin |
| ראובן (Re'uven) | Ru-ben | Reuben |
| שמעון (Shim'on) | Si-me-on | Simeon |
| לוי (Levi) | Le-vi | Levi |
| יהודה (Yehudah) | Giu-da | Judah |
| דן (Dan) | Dan | Dan |
| נפתלי (Naphtali) | Nep-ta-li | Naphtali |
| גד (Gad) | Gat | Gad |
| אשר (Asher) | A-se | Asher |
| זבולן (Zevulun) | Sa-bu-lon | Zebulun |
| יששכר (Yissakhar) | Y-sa-ca | Issachar |
| דינה (Dinah) | Di-na | Dinah |
| פרעה (Par'oh) | Pha-ra-on | Pharaoh |
| פוטיפר (Potiphar) | Pho-ti-pha | Potiphar |

### Place Names
| Hebrew | Vietnamese |
|--------|------------|
| ארץ (Erets) | dat |
| שמים (Shamayim) | troi |
| עדן (Eden) | E-den |
| בבל (Bavel) | Ba-ben |
| מצרים (Mitsrayim) | Ai-cap |
| כנען (Kena'an) | Ca-na-an |
| סדם (Sedom) | So-dom |
| עמרה (Amorah) | Go-mo-ro |
| חרן (Charan) | Cha-ran |
| בית אל (Beit El) | Be-ten |
| חברון (Chevron) | Hep-ron |
| באר שבע (Be'er Sheva) | Be-e-se-ba |
| שכם (Shekhem) | Si-chem |

## Translation Philosophy
1. **Word-for-word interlinear** - each Hebrew word gets one Vietnamese translation
2. **Lemma consistency** - same root word gets same translation throughout
3. **Particles hyphenated** with n-dash (e.g., -trong ban dau = in-beginning)
4. **Source word order preserved** for interlinear alignment
5. **Vietnamese diacritics used properly** throughout

## Vietnamese-Specific Patterns

### Construct Chains (Semikhut)
Hebrew construct chains: word order preserved with "cua" (of):
- בֶּן־אַבְרָהָם → con cua Ap-ra-ham (son of Abraham)

### Verbal Forms
| Hebrew Form | Vietnamese Pattern | Example |
|-------------|-------------------|---------|
| Qal Perfect | past tense | sang tao (created) |
| Qal Imperfect | future/habitual | se sang tao (will create) |
| Wayyiqtol | narrative past | -va sang tao (and-created) |
| Imperative | command | hay sang tao (create!) |
| Infinitive Construct | verbal noun | de sang tao (to create) |
| Participle | -ing form | dang sang tao (creating) |

### Number Words
| Hebrew | Vietnamese |
|--------|------------|
| אחד (echad) | mot |
| שנים (shenayim) | hai |
| שלשה (sheloshah) | ba |
| ארבעה (arba'ah) | bon |
| חמשה (chamishah) | nam |
| ששה (shishah) | sau |
| שבעה (shiv'ah) | bay |

## Consistency Decisions

| Lemma | Decision | Notes |
|-------|----------|-------|
| H430 אלהים | Duc Chua Troi | God |
| H3068 יהוה | Duc Gie-ho-va | LORD |
| H136 אדני | Chua | Lord |
| H1254 ברא | sang tao | Create |
| H776 ארץ | dat | Earth/land |
| H8064 שמים | troi | Heaven/sky |
| H120 אדם | nguoi/A-dam | Man/Adam (by context) |
| H802 אשה | nguoi dan ba | Woman/wife |
| H376 איש | nguoi dan ong | Man/husband |
| H1121 בן | con trai | Son |
| H1323 בת | con gai | Daughter |
| H1 אב | cha | Father |
| H517 אם | me | Mother |
| H251 אח | anh em | Brother |
| H269 אחות | chi em | Sister |
| H5315 נפש | linh hon | Soul/life |
| H7307 רוח | than/gio | Spirit/wind |
| H3117 יום | ngay | Day |
| H3915 לילה | dem | Night |
| H4325 מים | nuoc | Water |
| H784 אש | lua | Fire |
| H216 אור | anh sang | Light |
| H2822 חשך | bong toi | Darkness |
| H2896 טוב | tot | Good |
| H7451 רע | xau | Evil/bad |
| H1285 ברית | giao uoc | Covenant |
| H2580 חן | on | Grace/favor |
| H571 אמת | su that | Truth |
| H6666 צדקה | su cong binh | Righteousness |
| H2403 חטאת | toi loi | Sin |
| H1293 ברכה | phuc lanh | Blessing |
| H7045 קללה | su rua sa | Curse |
| H4191 מות | chet | Die/death |
| H2421 חיה | song | Live/life |
| H559 אמר | noi | Say |
| H1696 דבר | phan | Speak |
| H8085 שמע | nghe | Hear |
| H7200 ראה | thay | See |
| H3045 ידע | biet | Know |
| H5414 נתן | cho | Give |
| H3947 לקח | lay | Take |
| H935 בוא | den | Come |
| H3318 יצא | di ra | Go out |
| H7971 שלח | sai | Send |
| H6213 עשה | lam | Do/make |
| H1129 בנה | xay | Build |
| H3427 ישב | ngoi | Sit/dwell |
| H6965 קום | dung day | Rise/stand |
| H1980 הלך | di | Walk/go |
| H7725 שוב | tro lai | Return |
