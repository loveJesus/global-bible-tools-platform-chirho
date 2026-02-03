#!/bin/bash

# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Swahili Translation Database Import Script
# Imports all generated Swahili SQL files into SvelteKit database

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TRANSLATIONS_DIR="$PROJECT_ROOT/translations-chirho"
SVELTEKIT_DIR="$PROJECT_ROOT/sveltekit2-platform-chirho"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Swahili Translation Database Import Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

# Check if SvelteKit database is running
echo -e "\n${YELLOW}Checking if SvelteKit database is running...${NC}"
if ! docker compose -f "$SVELTEKIT_DIR/compose.yaml" ps db-chirho 2>/dev/null | grep -q "Up"; then
  echo -e "${YELLOW}Starting SvelteKit database...${NC}"
  cd "$SVELTEKIT_DIR"
  docker compose up -d db-chirho
  echo -e "${GREEN}Database started${NC}"
  sleep 3
else
  echo -e "${GREEN}Database is already running${NC}"
fi

# Count total SQL files to import
TOTAL_FILES=$(find "$TRANSLATIONS_DIR"/*-swa-chirho -name "*-chirho.sql" 2>/dev/null | wc -l)
echo -e "\n${YELLOW}Found ${TOTAL_FILES} Swahili SQL files to import${NC}"

if [ "$TOTAL_FILES" -eq 0 ]; then
  echo -e "${RED}ERROR: No SQL files found in $TRANSLATIONS_DIR${NC}"
  exit 1
fi

# Import SQL files
echo -e "\n${YELLOW}Starting database import...${NC}"
CONTAINER_NAME=$(docker compose -f "$SVELTEKIT_DIR/compose.yaml" ps -q db-chirho)

if [ -z "$CONTAINER_NAME" ]; then
  echo -e "${RED}ERROR: Could not find db-chirho container${NC}"
  exit 1
fi

IMPORTED=0
FAILED=0

for sql_file in "$TRANSLATIONS_DIR"/*-swa-chirho/*-chirho.sql; do
  if [ ! -f "$sql_file" ]; then
    continue
  fi

  FILENAME=$(basename "$sql_file")

  if docker exec "$CONTAINER_NAME" psql -U postgres -q < "$sql_file" 2>/dev/null; then
    ((IMPORTED++))
    if [ $((IMPORTED % 500)) -eq 0 ]; then
      echo -e "${GREEN}✓ Imported $IMPORTED files...${NC}"
    fi
  else
    ((FAILED++))
    echo -e "${RED}✗ Failed to import $FILENAME${NC}"
  fi
done

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Import Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "Files imported: ${GREEN}$IMPORTED${NC} / $TOTAL_FILES"

if [ "$FAILED" -gt 0 ]; then
  echo -e "Files failed: ${RED}$FAILED${NC}"
fi

# Verify import
echo -e "\n${YELLOW}Verifying import...${NC}"
GLOSS_COUNT=$(docker exec "$CONTAINER_NAME" psql -U postgres -t -c \
  "SELECT COUNT(*) FROM gloss WHERE state = 'UNAPPROVED' AND phrase_id IN (SELECT id FROM phrase WHERE language_id = (SELECT id FROM language WHERE code = 'swa'))")

echo -e "Total Swahili glosses imported: ${GREEN}$GLOSS_COUNT${NC}"

# Summary by book
echo -e "\n${YELLOW}Glosses by book:${NC}"
docker exec "$CONTAINER_NAME" psql -U postgres -t -c \
  "SELECT b.name, COUNT(g.id) as gloss_count
   FROM gloss g
   JOIN phrase p ON g.phrase_id = p.id
   JOIN phrase_word pw ON p.id = pw.phrase_id
   JOIN word w ON pw.word_id = w.id
   JOIN verse v ON w.verse_id = v.id
   JOIN book b ON v.book_id = b.id
   WHERE p.language_id = (SELECT id FROM language WHERE code = 'swa')
   AND g.state = 'UNAPPROVED'
   GROUP BY b.name
   ORDER BY gloss_count DESC
   LIMIT 20;" 2>/dev/null || echo "Could not fetch book summary"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Database import successful!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "\nNext steps:"
echo -e "1. Review translations with a professional Swahili translator"
echo -e "2. Mark approved glosses: UPDATE gloss SET state = 'APPROVED' ..."
echo -e "3. Build SWORD module: bun run export-sword-chirho -- swa LJMTIntSwaChirho"
echo -e "4. Test in UI: http://localhost:5173/translate-chirho/swa/matthew-1:1"
echo -e "\n${GREEN}For more info, see: SWAHILI-TRANSLATION-COMPLETION.md${NC}"
