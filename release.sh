#!/bin/sh

set -ex

echo "export const VERSION = '1.0.0-$(git describe --always)';" > src/version.js
bun run build
git checkout src/version.js
