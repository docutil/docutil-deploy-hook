#!/bin/sh

set -ex

echo "export const VERSION = '2.0.0-$(git describe --always)';" > src/version.js
bun run build
git checkout src/version.js
