#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

python3 scripts/build_security_snapshot.py >/dev/null

python3 - <<'PY'
import json
from pathlib import Path

path = Path("src/data/generatedSnapshot.json")
data = json.loads(path.read_text(encoding="utf-8"))

expected = {
    "Normalized events": "24 events",
    "Blocked or contained": "14 actions",
    "Human escalations": "5 escalations",
    "Tuned detections": "6 rules",
}

summary = {item["label"]: item["value"] for item in data["summary"]}
for key, value in expected.items():
    assert summary.get(key) == value, f"{key}: expected {value}, got {summary.get(key)}"

assert data["meta"]["generatedAt"] == "2026-03-29 20:06 UTC"
assert data["meta"]["sourceFiles"] == 3
assert data["meta"]["shiftWindow"] == "09:12 - 20:06 UTC"
assert len(data["handoff"]) == 3, f"expected 3 handoff items, got {len(data['handoff'])}"
assert any(item["label"] == "JP login edge" for item in data["handoff"])
assert any(item["label"] == "Cloud console route" for item in data["handoff"])

print("Security snapshot verified.")
PY
