---
name: font-merging-chirho
description: Create merged fonts that combine non-Latin scripts with Latin glyphs to eliminate tofu (missing glyph boxes) in PDFs. Use when adding support for new scripts or fixing font rendering issues.
disable-model-invocation: true
---

# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Font Merging for International Scripts

Create merged fonts that combine non-Latin script fonts with Latin glyphs from NotoSans to eliminate tofu (□□□) in interlinear Bible PDFs.

## Problem

PDFKit doesn't support font fallback chains. When rendering text like "সীমোন–পিতর" (Bengali with en-dash), the Bengali font shows □ for the en-dash because it lacks Latin glyphs.

## Solution

Merge Latin character subsets from NotoSans into script-specific fonts.

## Which Fonts Need Merging

| Script | Original Font | Merged Font | Status |
|--------|---------------|-------------|--------|
| Arabic/Urdu | NotoNaskhArabic | NotoNaskhMergedChirho.ttf | ✅ Complete |
| Bengali | NotoSansBengali | NotoSansBengaliMergedChirho.ttf | ✅ Complete |
| Devanagari | NotoSansDevanagari | NotoSansDevanagariMergedChirho.ttf | ✅ Complete |
| Thai | NotoSansThai | NotoSansThaiMergedChirho.ttf | ✅ Complete |
| Myanmar | NotoSansMyanmar | NotoSansMyanmarMergedChirho.ttf | ✅ Complete |
| Gujarati | NotoSansGujarati | NotoSansGujaratiMergedChirho.ttf | ✅ Complete |
| Tamil | NotoSansTamil | NotoSansTamilMergedChirho.ttf | ✅ Complete |
| Gurmukhi | NotoSansGurmukhi | NotoSansGurmukhiMergedChirho.ttf | ✅ Complete |
| Telugu | NotoSansTelugu | — | ❌ Font incompatible |
| Ethiopic | NotoSansEthiopic | — | ❌ Font incompatible |

## Fonts That Already Have Latin Glyphs (No Merge Needed)

| Script | Font | Notes |
|--------|------|-------|
| Chinese | NotoSansCJKsc | CJK fonts include Latin |
| Japanese | NotoSansCJKjp | CJK fonts include Latin |
| Korean | NotoSansCJKkr | CJK fonts include Latin |
| Hebrew | EzraSIL | SIL fonts include Latin |

## Python Merge Script

Create a Python script to merge fonts using fonttools:

```python
#!/usr/bin/env python3
"""
Font merger - combines non-Latin font with Latin glyphs from NotoSans
Requires: pip install fonttools
"""

from fontTools import merge
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options
import os
import sys

# Latin characters to include in merged font
LATIN_CHARS = (
    # Basic punctuation
    '?;()[]{}"\''
    '<>@#$%^&*_+=~`|\\/-,.:'
    # En-dash, em-dash (critical for interlinear)
    '–—'
    # Curly quotes
    '""'''
    # Ellipsis, guillemets
    '…«»‹›'
    # Numbers
    '0123456789'
    # Latin letters
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
)

def create_latin_subset(noto_sans_path: str, output_path: str):
    """Create a Latin-only subset of NotoSans"""
    font = TTFont(noto_sans_path)
    subsetter = Subsetter(Options())
    subsetter.populate(text=LATIN_CHARS)
    subsetter.subset(font)
    font.save(output_path)
    print(f"Created Latin subset: {output_path}")

def merge_fonts(base_font_path: str, latin_subset_path: str, output_path: str):
    """Merge base font with Latin subset"""
    merger = merge.Merger()
    merged = merger.merge([base_font_path, latin_subset_path])
    merged.save(output_path)
    print(f"Created merged font: {output_path}")

def main():
    if len(sys.argv) < 4:
        print("Usage: python merge_font.py <base_font.ttf> <output_name> <noto_sans_path>")
        print("Example: python merge_font.py NotoSansBengali.ttf NotoSansBengaliMergedChirho.ttf NotoSans-Regular.ttf")
        sys.exit(1)

    base_font = sys.argv[1]
    output_name = sys.argv[2]
    noto_sans = sys.argv[3]

    # Create Latin subset in temp directory
    latin_subset = "/tmp/NotoSans-Latin-Subset.ttf"
    create_latin_subset(noto_sans, latin_subset)

    # Merge fonts
    merge_fonts(base_font, latin_subset, output_name)

    # Cleanup
    os.remove(latin_subset)
    print("Done!")

if __name__ == "__main__":
    main()
```

## Step-by-Step Instructions

### 1. Set Up Python Environment

```bash
# Create virtual environment
python3 -m venv /tmp/fontenv
source /tmp/fontenv/bin/activate

# Install fonttools
pip install fonttools
```

### 2. Prepare Fonts

Download fonts from Google Fonts or use local copies:
```bash
# Font location in project
ls sveltekit2-platform-chirho/static/fonts-chirho/
```

### 3. Run Merge Script

```bash
cd sveltekit2-platform-chirho/static/fonts-chirho

# Example: Merge Bengali font
python3 /tmp/merge_font.py \
  NotoSansBengali-Regular.ttf \
  NotoSansBengaliMergedChirho.ttf \
  NotoSans-Regular.ttf
```

### 4. Verify Result

```bash
# Check file size (merged should be larger)
ls -la NotoSansBengaliMergedChirho.ttf

# Test in Python
python3 -c "
from fontTools.ttLib import TTFont
f = TTFont('NotoSansBengaliMergedChirho.ttf')
cmap = f.getBestCmap()
print('Has en-dash:', 0x2013 in cmap)  # Should be True
print('Has comma:', ord(',') in cmap)  # Should be True
"
```

### 5. Update pdf-utils-chirho.ts

Add the new font to `sveltekit2-platform-chirho/src/lib/server/pdf-utils-chirho.ts`:

1. Add path constant:
```typescript
const FONT_NEWSCRIPT_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansNewscriptMergedChirho.ttf');
```

2. Add buffer variable:
```typescript
let newscriptMergedFontChirho: Buffer | null = null;
```

3. Load the font:
```typescript
newscriptMergedFontChirho = loadFontSafelyChirho(FONT_NEWSCRIPT_MERGED_PATH_CHIRHO, 'Noto Sans Newscript Merged');
```

4. Add to getFontForTextChirho():
```typescript
if (isNewscriptTextChirho(textChirho)) {
    return newscriptMergedFontChirho ? 'NotoSansNewscriptMergedChirho' : getMainFontChirho();
}
```

5. Register in createPdfDocumentChirho():
```typescript
if (newscriptMergedFontChirho) docChirho.registerFont('NotoSansNewscriptMergedChirho', newscriptMergedFontChirho);
```

## Troubleshooting

### Font Merge Fails

Some fonts have incompatible internal structures:

```
Error: KeyError: 'glyf'
```

**Cause:** Font uses CFF outlines instead of TrueType (glyf). Telugu and Ethiopic have this issue.

**Solution:** These fonts must remain unmerged. Add special handling in sanitization to convert punctuation to native equivalents.

### Missing Glyphs After Merge

Check if the glyph was in the subset:

```python
from fontTools.ttLib import TTFont
f = TTFont('merged_font.ttf')
cmap = f.getBestCmap()
print(f"0x2013 (en-dash): {0x2013 in cmap}")
print(f"0x002C (comma): {0x002C in cmap}")
```

### Font Too Large

The Latin subset is typically 30-50KB. If merged font is much larger than base + 50KB, something went wrong.

## Output Locations

| File | Location |
|------|----------|
| Merged fonts | `sveltekit2-platform-chirho/static/fonts-chirho/` |
| Font config | `sveltekit2-platform-chirho/src/lib/server/pdf-utils-chirho.ts` |
| Generated PDFs | `output-chirho/` or `static/bibles-chirho/` |

## Naming Convention

- Merged fonts: `Noto{Family}{Script}MergedChirho.ttf`
- Examples:
  - `NotoNaskhMergedChirho.ttf` (Arabic calligraphic)
  - `NotoSansBengaliMergedChirho.ttf`
  - `NotoSansDevanagariMergedChirho.ttf`

## Arabic/Urdu Special Handling

For Arabic and Urdu, we also convert punctuation to native equivalents in `sanitizeForNonLatinFontChirho()`:

| Latin | Arabic | Unicode |
|-------|--------|---------|
| `,` | `،` | U+060C |
| `;` | `؛` | U+061B |
| `?` | `؟` | U+061F |
| `.` | `۔` | U+06D4 |
| `0-9` | `۰-۹` | U+06F0-U+06F9 |

This is because Arabic readers prefer native punctuation. Other scripts (Bengali, Thai, etc.) use the merged Latin glyphs directly.

## Existing Merged Fonts

| Font | Size | Script |
|------|------|--------|
| NotoNaskhMergedChirho.ttf | 255 KB | Arabic/Urdu |
| NotoSansBengaliMergedChirho.ttf | 159 KB | Bengali |
| NotoSansDevanagariMergedChirho.ttf | 252 KB | Hindi/Marathi |
| NotoSansThaiMergedChirho.ttf | 59 KB | Thai |
| NotoSansMyanmarMergedChirho.ttf | 208 KB | Myanmar/Burmese |
| NotoSansGujaratiMergedChirho.ttf | 210 KB | Gujarati |
| NotoSansTamilMergedChirho.ttf | 93 KB | Tamil |
| NotoSansGurmukhiMergedChirho.ttf | 74 KB | Punjabi |
