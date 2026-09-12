# Multi-stage build for Rust Axum Backend
FROM rust:1.80-slim-bullseye AS builder

WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy manifest and dependencies
COPY Cargo.toml ./

# Build dependencies cache dummy
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release || true
RUN rm -rf src

# Copy real sources
COPY src ./src
COPY migrations ./migrations

# Build the release executable
RUN cargo build --release --bin ulpin-3d-backend

# Runtime image
FROM debian:bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates libssl1.1 curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/target/release/ulpin-3d-backend /app/ulpin-3d-backend
COPY --from=builder /usr/src/app/migrations /app/migrations

ENV HOST=0.0.0.0
ENV PORT=8080
ENV RUST_LOG=ulpin_3d_backend=info,tower_http=info

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["/app/ulpin-3d-backend"]
