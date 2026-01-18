#!/bin/sh

# Always run from project root
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting backend..."
cd "$ROOT_DIR/backend" && go run ./main.go &
BACKEND_PID=$!

echo "Starting frontend..."
cd "$ROOT_DIR/frontend" && bun run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" INT TERM

wait
