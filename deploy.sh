#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$REPO_DIR/frontend"

echo "==> Pulling latest code..."
git -C "$REPO_DIR" pull origin main

echo "==> Installing dependencies..."
cd "$FRONTEND_DIR"
npm install

echo "==> Building..."
npm run build

echo "==> Build complete → $FRONTEND_DIR/dist"

echo "==> Reloading nginx..."
sudo systemctl reload nginx

echo "==> Done."
