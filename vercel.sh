#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "gh-pages" ]] ; then
  # Don't build gh-pages branch
  echo "🛑 - Build cancelled for gh-pages branch"
  exit 0;
else
  # Proceed with the build for all other branches
  echo "✅ - Build proceeding for branch: $VERCEL_GIT_COMMIT_REF"
  exit 1;
fi