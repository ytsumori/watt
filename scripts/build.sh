#!/bin/bash

if [[ $VERCEL_GIT_COMMIT_REF == "main" ]]; then
  pnpm build
else
  pnpm preview-build
fi