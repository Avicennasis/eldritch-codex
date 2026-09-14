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

if ! [[ "$ASSET" =~ ^[A-Za-z0-9._-]+$ ]]; then
    echo "ERROR: asset must be a basename containing only letters, digits, '.', '_', or '-'" >&2
    exit 1
fi

if ! [[ "$VERSION" =~ ^[0-9]+$ ]]; then
    echo "ERROR: version must be an integer, got '$VERSION'" >&2
    exit 1
fi

# The asset is user input but the search is an ERE. Escape dots so a basename
# such as state.js cannot also match stateXjs; the validation above excludes
# every other ERE metacharacter.
ASSET_RE="${ASSET//./\\.}"
mapfile -t FILES < <(grep -rlE --include='*.js' --include='*.html' -- \
    "${ASSET_RE}\?v=[0-9]+" . 2>/dev/null || true)

if [ "${#FILES[@]}" -eq 0 ]; then
    echo "No references to ${ASSET}?v=N found." >&2
    exit 1
fi

for f in "${FILES[@]}"; do
    sed -i -E "s|(${ASSET_RE}\?v=)[0-9]+|\1${VERSION}|g" "$f"
    echo "updated $f"
done
