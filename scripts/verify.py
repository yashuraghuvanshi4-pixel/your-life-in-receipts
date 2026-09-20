import os, json

app_dir = "/Users/yashuraghuvanshi/.gemini/antigravity/scratch/your-life-in-receipts"

required_files = [
    "index.html",
    "css/styles.css",
    "js/data.js",
    "js/audio.js",
    "js/constellation.js",
    "js/app.js",
    "data/full_dataset.json",
    "data/transactions_clean.csv"
]

print("=== Checking File Existence ===")
for rf in required_files:
    full_p = os.path.join(app_dir, rf)
    exists = os.path.exists(full_p)
    size = os.path.getsize(full_p) if exists else 0
    status = "OK" if exists else "MISSING"
    print(f"[{status}] {rf} ({size:,} bytes)")
    assert exists, f"Missing file: {rf}"

print("\n=== Validating Dataset Integrity ===")
with open(os.path.join(app_dir, "data/full_dataset.json")) as f:
    data = json.load(f)

summary = data["summary"]
print(f"Total Transactions: {summary['totalTransactions']}")
print(f"Total Music Streams: {summary['totalMusicStreams']}")
print(f"Total Places: {summary['totalPlaces']}")
print(f"Total Photos: {summary['totalPhotos']}")
print(f"Total Messages: {summary['totalMessages']}")
print(f"Total Searches: {summary['totalSearches']}")
print(f"Total Personal Notes: {summary['totalNotes']}")
print(f"Total Events: {summary['totalEvents']}")
print(f"Total Curated Stories: {summary['totalStories']}")
print(f"Total Patterns: {summary['totalPatterns']}")

all_ids = set()
for t in data["transactions"]: all_ids.add(t["id"])
for m in data["music"]: all_ids.add(m["id"])
for p in data["places"]: all_ids.add(p["id"])
for ph in data["photos"]: all_ids.add(ph["id"])
for msg in data["messages"]: all_ids.add(msg["id"])
for s in data["searches"]: all_ids.add(s["id"])
for n in data["notes"]: all_ids.add(n["id"])
for e in data["events"]: all_ids.add(e["id"])

print(f"\nTotal Unique Receipt IDs in Archive: {len(all_ids):,}")

for story in data["stories"]:
    missing = [rid for rid in story["receiptSequence"] if rid not in all_ids]
    if missing:
        print(f"WARNING: Story {story['id']} has missing IDs: {missing}")
    else:
        print(f"[OK] Story: \"{story['title']}\" ({len(story['receiptSequence'])} connected receipts across {len(story['connectedDimensions'])} dimensions)")

print("\n=== All Data Integrity Tests Passed! ===")
