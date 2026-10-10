#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="photosweet-buildenv:latest"
WORKSPACE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

docker build \
    --build-arg USERNAME="$(id -un)" \
    --build-arg USER_UID="$(id -u)" \
    --build-arg USER_GID="$(id -g)" \
    -t "$IMAGE_NAME" \
    -f "$WORKSPACE/buildenv.Dockerfile" \
    "$WORKSPACE"

docker run \
  --rm \
  -it \
  --init \
  -v "$WORKSPACE:$WORKSPACE" \
  -w "$WORKSPACE" \
  "$IMAGE_NAME"