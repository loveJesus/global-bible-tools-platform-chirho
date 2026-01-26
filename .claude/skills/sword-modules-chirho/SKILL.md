---
name: sword-modules-chirho
description: Generate SWORD/CrossWire Bible modules from translated gloss data. Use when creating Bible modules for Xiphos, BibleTime, AndBible, or other SWORD applications.
disable-model-invocation: true
---

# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# SWORD Module Generation

Generate SWORD/CrossWire Bible modules from our translated gloss data for use in Bible study applications.

## Translation Philosophy

Our modules are **READER'S VERSION WORD-FOR-WORD GLOSSES**:

1. **Word-for-word correspondence**: Each Greek/Hebrew word receives a gloss in the target language
2. **Original language word order**: Glosses follow Hebrew/Greek word order, NOT natural target language order
3. **Study aid, not replacement**: Designed to help readers engage with original biblical languages
4. **Not natural sentences**: The output intentionally preserves original structure

### Example (John 3:16 in Spanish)

| Greek | Gloss |
|-------|-------|
| Οὕτως | Así |
| γὰρ | pues |
| ἠγάπησεν | amó |
| ὁ θεὸς | el Dios |
| τὸν κόσμον | el mundo |

This preserves Greek word order, not natural Spanish ("Porque Dios amó tanto al mundo...").

## Required Disclaimers

**ALL modules MUST include these disclaimers:**

- "MACHINE TRANSLATED - PROVISIONAL - NOT AUTHORITATIVE"
- In both English AND the target language
- In the Description, About, and DistributionNotes fields
- Version should be "0.1-PROVISIONAL"

## Module Types

### Interlinear Modules (e.g., GBTIntSpa, GBTIntHin)

Display Greek/Hebrew text with embedded:
- **Glosses**: Target language translations in the `gloss` attribute
- **Strong's Numbers**: H (Hebrew) and G (Greek) references
- **Morphology**: Grammar codes

```xml
<w gloss="amó" lemma="strong:G0025" morph="robinson:V-AIA-3S">ἠγάπησεν</w>
```

### Bible Modules (e.g., GBTSPA, HinGBT)

Plain text word-for-word translations following original word order.

## SWORD Repository

- **URL**: https://sword-modules-chirho.bible.systems
- **GitHub**: https://github.com/loveJesus/sword-modules-chirho

### Repository Structure

```
sword-repo-chirho/
├── mods.d.tar.gz      # All .conf files tarred (for InstallMgr)
├── mods.d/            # Individual module configs
├── raw/               # Module zip files
├── CNAME              # Custom domain
├── index.html         # Repository landing page
└── README.md          # Documentation
```

## Conf File Template

```ini
[ModuleName]
DataPath=./modules/texts/ztext/modulename/
ModDrv=zText
SourceType=OSIS
Encoding=UTF-8
CompressType=ZIP
BlockType=BOOK
Versification=KJV

Description=Language Name (MACHINE TRANSLATED - PROVISIONAL)
Version=0.1-PROVISIONAL
DistributionNotes=MACHINE TRANSLATED - NOT AUTHORITATIVE

# For interlinear modules:
Feature=StrongsNumbers
GlobalOptionFilter=OSISStrongs
GlobalOptionFilter=OSISMorph
GlobalOptionFilter=OSISLemma
GlobalOptionFilter=OSISGlosses
```

## Generation Workflow

1. Export translations from PostgreSQL via `generate-sword-module-chirho.ts`
2. Generate OSIS XML with word-level markup
3. Run `osis2mod` to create SWORD module
4. Package as .zip
5. Create/update .conf file
6. Add to `sword-repo-chirho/raw/` and `sword-repo-chirho/mods.d/`
7. Regenerate `mods.d.tar.gz`
8. Commit and push to GitHub

## Note on Module Names

SWORD module names (like GBTIntSpa, HinGBT) are **external identifiers** that must follow CrossWire/SWORD conventions. These are not suffixed with `-chirho` because they must work with external SWORD applications (Xiphos, BibleTime, AndBible). The Chirho suffix applies to identifiers we create and control, not external protocol/format identifiers.

## Quality Notes

- These are AI-assisted translations for feedback and study
- Not reviewed by human translators
- Users should verify against established translations
- Feedback welcome at https://global-tools.bible.systems/feedback-chirho
