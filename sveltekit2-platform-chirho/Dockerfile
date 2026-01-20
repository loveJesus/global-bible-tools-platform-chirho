# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# ============================================================================
# Base stage
# ============================================================================
FROM oven/bun:1.1 AS base
WORKDIR /app

# ============================================================================
# Development stage
# ============================================================================
FROM base AS dev
# Install dependencies only (for caching)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install

# Copy source
COPY . .

EXPOSE 5173
CMD ["bun", "run", "dev-chirho", "--host"]

# ============================================================================
# Build stage
# ============================================================================
FROM base AS build
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install

COPY . .
RUN bun run build-chirho

# ============================================================================
# Production stage
# ============================================================================
FROM base AS production
ENV NODE_ENV=production

# Copy built app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["bun", "./build/index.js"]
