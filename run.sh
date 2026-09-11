#!/usr/bin/env bash
cd "$(dirname "$0")"

# Open in browser directly
if command -v xdg-open > /dev/null; then
  xdg-open index.html
elif command -v google-chrome > /dev/null; then
  google-chrome index.html
else
  echo "Vui lòng mở file index.html bằng trình duyệt web của bạn."
fi
