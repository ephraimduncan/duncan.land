#!/bin/sh
set -eu

bun --version >/dev/null

if [ ! -d node_modules ]; then
  bun install --frozen-lockfile
fi
