#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$REPO_DIR/frontend-next"
BACKEND_DIR="$REPO_DIR/backend"
ADMIN_DIR="$REPO_DIR/admin-frontend"

echo "==> Pulling latest code..."
git -C "$REPO_DIR" pull origin main

# --- Публичный сайт (Next.js static export) ---
echo "==> Building public frontend (Next.js)..."
cd "$FRONTEND_DIR"
npm install
npm run build
echo "==> Public build → $FRONTEND_DIR/out"

# --- Бекенд ---
echo "==> Building backend..."
cd "$BACKEND_DIR"
npm install
npm run build
echo "==> Restarting backend (pm2: perfostand-api)..."
pm2 restart perfostand-api || pm2 start build/index.js --name perfostand-api

# --- Админка (статика) ---
echo "==> Building admin frontend..."
cd "$ADMIN_DIR"
npm install
npm run build
echo "==> Admin build → $ADMIN_DIR/dist"

echo "==> Reloading nginx..."
sudo systemctl reload nginx

echo "==> Done."
