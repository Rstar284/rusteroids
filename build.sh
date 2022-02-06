#!/usr/bin/env bash

# Exit on error
set -e

cargo \
    "build" \
    --target "wasm32-unknown-unknown" \
    --release

wasm-bindgen \
    --target "bundler" \
    --no-typescript \
    --out-dir "build" \
    "target/wasm32-unknown-unknown/release/asteroids.wasm"

npx webpack \
    -c "webpack.config.js"
