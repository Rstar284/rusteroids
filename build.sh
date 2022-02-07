#!/usr/bin/env bash

# Exit on error
set -e

cargo \
    "build" \
    --target "wasm32-unknown-unknown" \
    --release

wasm-bindgen \
    --target "web" \
    --no-typescript \
    --out-dir "src/wasm" \
    "target/wasm32-unknown-unknown/release/asteroids.wasm"
