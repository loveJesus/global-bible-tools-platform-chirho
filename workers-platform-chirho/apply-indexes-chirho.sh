#!/bin/bash
# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Apply performance indexes to all 29 per-language D1 databases

DATABASES=(
  "bible-lang-eng-chirho"
  "bible-lang-spa-chirho"
  "bible-lang-fra-chirho"
  "bible-lang-deu-chirho"
  "bible-lang-por-chirho"
  "bible-lang-hin-chirho"
  "bible-lang-ben-chirho"
  "bible-lang-urd-chirho"
  "bible-lang-ind-chirho"
  "bible-lang-jav-chirho"
  "bible-lang-rus-chirho"
  "bible-lang-tur-chirho"
  "bible-lang-swa-chirho"
  "bible-lang-arb-chirho"
  "bible-lang-kor-chirho"
  "bible-lang-ita-chirho"
  "bible-lang-heb-chirho"
  "bible-lang-mya-chirho"
  "bible-lang-tam-chirho"
  "bible-lang-zho-chirho"
  "bible-lang-amh-chirho"
  "bible-lang-vie-chirho"
  "bible-lang-nep-chirho"
  "bible-lang-ukr-chirho"
  "bible-lang-jpn-chirho"
  "bible-lang-srp-chirho"
  "bible-lang-guj-chirho"
  "bible-lang-tha-chirho"
  "bible-lang-tel-chirho"
)

TOTAL=${#DATABASES[@]}
SUCCESS=0
FAIL=0

for db in "${DATABASES[@]}"; do
  echo "[$((SUCCESS + FAIL + 1))/$TOTAL] Applying indexes to $db..."
  if bunx wrangler d1 execute "$db" --remote --file=add-indexes-chirho.sql 2>&1; then
    SUCCESS=$((SUCCESS + 1))
    echo "  ✓ $db done"
  else
    FAIL=$((FAIL + 1))
    echo "  ✗ $db FAILED"
  fi
  echo ""
done

echo "================================"
echo "Done: $SUCCESS succeeded, $FAIL failed out of $TOTAL"
