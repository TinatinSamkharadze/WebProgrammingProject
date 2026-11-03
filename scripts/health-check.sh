#!/usr/bin/env bash
set -u

URL="${1:-${HEALTH_CHECK_URL:-}}"
LOG_FILE="${2:-logs/health-check.log}"
RETRIES="${RETRIES:-5}"
DELAY_SECONDS="${DELAY_SECONDS:-5}"
EXPECTED_TEXT="Sweet Bakery"

if [ -z "$URL" ]; then
    echo "Usage: $0 <url> [log-file]" >&2
    exit 2
fi

mkdir -p "$(dirname "$LOG_FILE")"

log() {
    local line
    line="[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] $1"
    echo "$line"
    echo "$line" >> "$LOG_FILE"
}

for attempt in $(seq 1 "$RETRIES"); do
    body_file="$(mktemp)"
    result="$(curl -s -L -o "$body_file" -w '%{http_code} %{time_total}' --max-time 15 "$URL")"
    status="${result%% *}"
    time_total="${result##* }"

    if [ "$status" = "200" ] && grep -q "$EXPECTED_TEXT" "$body_file"; then
        rm -f "$body_file"
        log "STATUS=UP   HTTP=$status TIME=${time_total}s URL=$URL"
        exit 0
    fi

    rm -f "$body_file"
    log "STATUS=DOWN HTTP=$status TIME=${time_total}s URL=$URL (attempt $attempt/$RETRIES)"
    [ "$attempt" -lt "$RETRIES" ] && sleep "$DELAY_SECONDS"
done

log "HEALTH CHECK FAILED after $RETRIES attempts: $URL"
exit 1
