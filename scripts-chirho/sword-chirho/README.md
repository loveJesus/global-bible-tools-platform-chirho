# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# -- John 3:16

# SWORD Module Generator

This directory contains tools for generating SWORD Bible modules from our SQL-based translations.

## What is SWORD?

SWORD is the engine behind CrossWire Bible Society software like Xiphos, BibleTime, and AndBible.
SWORD modules are binary Bible/commentary packages that can be used with these applications.

## Usage

Generate a SWORD module for a specific language:

```bash
# Hindi (default)
bun run generate-sword-chirho hin

# Spanish
bun run generate-sword-chirho spa

# Bengali
bun run generate-sword-chirho ben

# Portuguese
bun run generate-sword-chirho por

# Russian
bun run generate-sword-chirho rus
```

Or run the script directly:

```bash
bun run scripts-chirho/sword-chirho/generate-sword-module-chirho.ts hin
```

## Output

The script generates:

1. **OSIS XML** (`osis/<module>.xml`) - The intermediate OSIS format
2. **SWORD Module Data** (`modules/texts/ztext/<module>/`) - Binary module files
3. **Configuration** (`mods.d/<module>.conf`) - Module metadata
4. **README** - Installation instructions
5. **ZIP Archive** - Ready-to-distribute package

Output location: `output-chirho/sword-chirho/<module>/`

## Supported Languages

| Code | Language | Module Name |
|------|----------|-------------|
| hin | Hindi | HinGBT |
| spa | Spanish | SpaGBT |
| ben | Bengali | BenGBT |
| por | Portuguese | PorGBT |
| rus | Russian | RusGBT |

## Installation

### For Xiphos (Linux/Windows/macOS)

1. Extract the ZIP file
2. Copy `mods.d/<module>.conf` to your SWORD mods.d directory:
   - Linux: `~/.sword/mods.d/`
   - macOS: `~/Library/Application Support/Sword/mods.d/`
   - Windows: `%APPDATA%\Sword\mods.d\`
3. Copy `modules/texts/ztext/<module>/` to:
   - Linux: `~/.sword/modules/texts/ztext/`
   - macOS: `~/Library/Application Support/Sword/modules/texts/ztext/`
   - Windows: `%APPDATA%\Sword\modules\texts\ztext\`
4. Restart the application

### For AndBible (Android)

Import the ZIP file via AndBible's module manager.

## Technical Details

### OSIS XML Structure

The generator creates valid OSIS 2.1.1 XML with:
- Proper book/chapter/verse hierarchy
- Correct OSIS IDs (Gen.1.1, Matt.5.3, etc.)
- KJV versification scheme
- UTF-8 encoding

### Module Format

The script uses `osis2mod` (from SWORD utilities) to convert OSIS to binary format:
- Compression: ZIP (`-z z`)
- Block size: Book (`-b 4`)
- Versification: KJV (`-v KJV`)

### Requirements

- Bun runtime
- `osis2mod` (install via Homebrew: `brew install sword`)

## License

All generated modules are licensed under CC BY-SA 4.0.
