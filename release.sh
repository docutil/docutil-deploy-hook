#!/bin/sh

set -ex

echo "export const VERSION = '1.0.0-$(git describe --always)';" > src/version.js
npm run build
