#!/usr/bin/env bash
# =============================================================================
# bump-cache.sh - Bump a ?v=N cache-busting query everywhere an asset is
# referenced (FR-152).
# =============================================================================
#
# ES modules and stylesheets are cache-busted with a `?v=N` query, and every
# importer carries its own copy of N. This updates all of them at once so the
# version cannot drift between index.html and the import statements.
#
# Usage:
#   scripts/bump-cache.sh <asset-basename> <new-version>
#   scripts/bump-cache.sh state.js 26
set -euo pipefail

ASSET="${1:?Usage: bump-cache.sh <asset-basename> <new-version>}"
VERSION="${2:?Usage: bump-cache.sh <asset-basename> <new-version>}"

if ! [[ "$VERSION" =~ ^[0-9]+$ ]]; then
    echo "ERROR: version must be an integer, got '$VERSION'" >&2
    exit 1
fi

mapfile -t FILES < <(grep -rlE "${ASSET}\?v=[0-9]+" \
    --include='*.js' --include='*.html' . 2>/dev/null || true)

if [ "${#FILES[@]}" -eq 0 ]; then
    echo "No references to ${ASSET}?v=N found." >&2
    exit 1
fi

for f in "${FILES[@]}"; do
    sed -i -E "s|(${ASSET}\?v=)[0-9]+|\1${VERSION}|g" "$f"
    echo "updated $f"
done
