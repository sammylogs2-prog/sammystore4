#!/usr/bin/env bash
# Runs in the background alongside the app.
# Pushes to GitHub every 60 minutes automatically.

INTERVAL_SECONDS=3600  # 1 hour

echo "🔄 GitHub auto-sync started — will push every $((INTERVAL_SECONDS / 60)) minutes."

while true; do
  sleep "$INTERVAL_SECONDS"

  if [ -z "$GITHUB_PAT" ]; then
    echo "[auto-sync] ⚠️  GITHUB_PAT not set — skipping push."
    continue
  fi

  echo "[auto-sync] ⏰ Scheduled push at $(date '+%Y-%m-%d %H:%M') …"
  bash scripts/push-to-github.sh && echo "[auto-sync] ✅ Done." || echo "[auto-sync] ❌ Push failed — will retry next cycle."
done
