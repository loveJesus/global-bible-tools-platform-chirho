# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Build stage
FROM rust:1.85-bookworm AS builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install cargo-leptos
RUN cargo install cargo-leptos

# Install wasm target
RUN rustup target add wasm32-unknown-unknown

# Install tailwindcss
RUN npm install -g tailwindcss @tailwindcss/typography

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./
COPY tailwind.config.js ./

# Create dummy source for dependency caching
RUN mkdir -p src && \
    echo 'fn main() {}' > src/main.rs && \
    echo 'pub fn dummy_chirho() {}' > src/lib.rs

# Build dependencies only
RUN cargo leptos build --release || true

# Remove dummy source
RUN rm -rf src

# Copy actual source
COPY . .

# Build the application
RUN cargo leptos build --release

# Runtime stage
FROM debian:bookworm-slim AS runtime

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/target/release/leptos-platform-chirho /app/
COPY --from=builder /app/target/site /app/site

# Set environment variables
ENV LEPTOS_OUTPUT_NAME=leptos-platform-chirho
ENV LEPTOS_SITE_ROOT=site
ENV LEPTOS_SITE_PKG_DIR=pkg
ENV LEPTOS_SITE_ADDR=0.0.0.0:3000

EXPOSE 3000

CMD ["/app/leptos-platform-chirho"]
