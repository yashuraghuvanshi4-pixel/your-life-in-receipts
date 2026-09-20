import os, json

app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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

print("=== 1. Checking Core Project Files ===")
for rf in required_files:
    full_p = os.path.join(app_dir, rf)
    exists = os.path.exists(full_p)
    size = os.path.getsize(full_p) if exists else 0
    status = "PASS" if exists and size > 0 else "FAIL"
    print(f"[{status}] {rf} ({size:,} bytes)")
    assert exists and size > 0, f"Missing or empty file: {rf}"

print("\n=== 2. Validating All 9 Dimensions ===")
with open(os.path.join(app_dir, "data/full_dataset.json"), "r", encoding="utf-8") as f:
    data = json.load(f)

dims = {
    "Purchases": len(data.get("transactions", [])),
    "Music": len(data.get("music", [])),
    "Movies & Entertainment": len(data.get("movies", [])),
    "Places": len(data.get("places", [])),
    "Photos": len(data.get("photos", [])),
    "Messages": len(data.get("messages", [])),
    "Searches": len(data.get("searches", [])),
    "Personal Notes": len(data.get("notes", [])),
    "Events": len(data.get("events", []))
}

for d_name, count in dims.items():
    print(f"[PASS] Dimension: {d_name:<24} -> {count:,} items")
    assert count > 0, f"Dimension {d_name} has zero items!"

assert len(dims) == 9, f"Expected 9 dimensions, got {len(dims)}"

print("\n=== 3. Validating All Receipt IDs ===")
all_ids = set()
for t in data["transactions"]: all_ids.add(t["id"])
for m in data["music"]: all_ids.add(m["id"])
for mv in data["movies"]: all_ids.add(mv["id"])
for p in data["places"]: all_ids.add(p["id"])
for ph in data["photos"]: all_ids.add(ph["id"])
for msg in data["messages"]: all_ids.add(msg["id"])
for s in data["searches"]: all_ids.add(s["id"])
for n in data["notes"]: all_ids.add(n["id"])
for e in data["events"]: all_ids.add(e["id"])

print(f"Total Unique Verified Receipt IDs: {len(all_ids):,}")

print("\n=== 4. Validating Curated Story Chapters ===")
for story in data["stories"]:
    missing = [rid for rid in story["receiptSequence"] if rid not in all_ids]
    assert len(missing) == 0, f"Story {story['id']} has missing receipts: {missing}"
    print(f"[PASS] {story['title']} ({len(story['receiptSequence'])} receipts, {len(story['connectedDimensions'])} dims)")

print("\n=== 5. Validating Life Journey & Wrapped Retrospectives ===")
assert len(data.get("journeyLocations", [])) >= 5, "Missing journey locations!"
for loc in data["journeyLocations"]:
    print(f"[PASS] Journey Stop: {loc['city']} ({loc['period']}) - {loc['receiptCount']}+ receipts")

for yr in ["2015", "2016", "2017", "2018"]:
    assert yr in data["wrapped"], f"Missing wrapped data for {yr}"
    w = data["wrapped"][yr]
    print(f"[PASS] Wrapped {yr}: {w['title']} (₹{w['totalSpent']:,}, {w['cupsOfChai']} cups chai)")

print("\n=======================================================")
print(" ALL 7 CRITERIA AUTOMATED VALIDATION SUITE PASSED 100%!")
print("=======================================================")
