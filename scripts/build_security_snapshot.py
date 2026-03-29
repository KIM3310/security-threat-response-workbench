#!/usr/bin/env python3

from __future__ import annotations

import json
from collections import Counter
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = ROOT / "samples" / "logs"
OUTPUT_PATH = ROOT / "src" / "data" / "generatedSnapshot.json"

CONTAINED_ACTIONS = {"block", "challenge", "mitigate", "drop", "isolate"}
ESCALATED_ACTIONS = {"escalate", "open-incident"}


def load_events() -> list[dict[str, object]]:
    events: list[dict[str, object]] = []
    for path in sorted(LOG_DIR.glob("*.jsonl")):
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.strip():
                events.append(json.loads(line))
    return events


def build_snapshot(events: list[dict[str, object]]) -> dict[str, object]:
    contained = sum(1 for event in events if event["action"] in CONTAINED_ACTIONS)
    escalated = sum(1 for event in events if event["action"] in ESCALATED_ACTIONS)
    tuned_rules = sorted({event["rule_id"] for event in events if event.get("tuned")})

    detector_counter = Counter(str(event["detector"]) for event in events)
    signature_counter = Counter(str(event["signature"]) for event in events)
    handoff_items = [
      event for event in events if event.get("handoff_label") and event.get("handoff_value")
    ]
    timestamps = sorted(datetime.fromisoformat(str(event["timestamp"]).replace("Z", "+00:00")) for event in events)

    lanes = []
    for detector, count in detector_counter.most_common():
        detail = {
            "waf": "Credential stuffing, SQLi, path traversal, and virtual-patch hits concentrated on exposed service edges.",
            "ids": "East-west validation reduced noisy internal detections down to the few signals worth escalation.",
            "ddos": "Mitigation, challenge, and blackhole watch decisions stayed tied to service continuity rather than raw traffic alone.",
        }[detector]
        lanes.append(
            {
                "label": f"{detector.upper()} lane" if detector != "ddos" else "DDoS lane",
                "value": f"{count} events",
                "detail": detail,
            }
        )

    pattern_details = {
      "credential-stuffing burst": "Repeated login abuse across multiple ASNs suggests coordinated bot reuse rather than one noisy source.",
      "L7 GET flood": "Attack pressure was heavy enough to justify mitigation but still needed real-user success tracking.",
      "suspicious child process": "Internal host behavior required analyst validation before any broad isolation decision.",
      "east-west beacon": "One chain stayed important only after suppression removed obvious noise.",
    }
    patterns = []
    for signature, count in signature_counter.most_common(4):
        patterns.append(
            {
                "label": signature[0].upper() + signature[1:],
                "value": f"{count} hits",
                "detail": pattern_details.get(signature, "Important signal retained for analyst validation and follow-through."),
            }
        )

    seen_handoff_labels: set[str] = set()
    handoff = []
    for item in handoff_items:
        label = str(item["handoff_label"])
        if label in seen_handoff_labels:
            continue
        seen_handoff_labels.add(label)
        handoff.append(
            {
                "label": label,
                "value": str(item["handoff_value"]),
                "detail": str(item["handoff_detail"]),
            }
        )

    return {
        "meta": {
            "generatedAt": timestamps[-1].strftime("%Y-%m-%d %H:%M UTC"),
            "sourceFiles": len(list(LOG_DIR.glob("*.jsonl"))),
            "shiftWindow": f"{timestamps[0].strftime('%H:%M')} - {timestamps[-1].strftime('%H:%M UTC')}",
        },
        "summary": [
            {
                "label": "Normalized events",
                "value": f"{len(events)} events",
                "detail": "WAF, IDS, and DDoS JSONL samples were normalized into one shift-ready watchboard.",
            },
            {
                "label": "Blocked or contained",
                "value": f"{contained} actions",
                "detail": "Block, challenge, mitigate, and isolate outcomes are separated from pure escalation noise.",
            },
            {
                "label": "Human escalations",
                "value": f"{escalated} escalations",
                "detail": "Only the events that survived validation moved into analyst or owner escalation.",
            },
            {
                "label": "Tuned detections",
                "value": f"{len(tuned_rules)} rules",
                "detail": "The sample shift demonstrates how pattern tuning becomes part of normal response work.",
            },
        ],
        "lanes": lanes,
        "patterns": patterns,
        "handoff": handoff,
    }


def main() -> None:
    events = load_events()
    snapshot = build_snapshot(events)
    OUTPUT_PATH.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH.relative_to(ROOT)} from {len(events)} events.")


if __name__ == "__main__":
    main()
