import json, csv, math, random
from datetime import datetime, timedelta

# Load transactions
txns = []
with open("/Users/yashuraghuvanshi/.gemini/antigravity/scratch/your-life-in-receipts/data/transactions_clean.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        raw_date = row.get("Date", "").strip()
        mode = row.get("Mode", "").strip()
        cat = row.get("Category", "").strip()
        subcat = row.get("Subcategory", "").strip()
        note = row.get("Note", "").strip()
        try:
            amount = float(row.get("Amount", "0").strip())
        except:
            amount = 0.0
        t_type = row.get("Income/Expense", "Expense").strip()
        curr = row.get("Currency", "INR").strip()

        parts = raw_date.split(" ")
        d_str = parts[0]
        time_str = parts[1] if len(parts) > 1 else f"{random.randint(9, 21):02d}:{random.randint(10, 59):02d}:00"

        d_parts = d_str.split("/") if "/" in d_str else d_str.split("-")
        day = int(d_parts[0])
        month = int(d_parts[1])
        year = int(d_parts[2])
        if year < 100:
            year += 2000
        iso_date = f"{year:04d}-{month:02d}-{day:02d}"

        if year == 2015 or (year == 2016 and month <= 6):
            era_id = "era_1"
            era_title = "The Frugal Apprentice"
        elif (year == 2016 and month > 6) or (year == 2017 and month <= 5):
            era_id = "era_2"
            era_title = "The Transition & Family Anchor"
        elif (year == 2017 and month > 5) or (year == 2018 and month <= 3):
            era_id = "era_3"
            era_title = "The Mumbai Crucible & Marathon"
        else:
            era_id = "era_4"
            era_title = "Freedom, Dividends & Devotion"

        txns.append({
            "id": f"txn_{i+1:04d}",
            "type": "purchase",
            "dimension": "Purchases",
            "date": iso_date,
            "rawDate": raw_date,
            "time": time_str,
            "timestamp": f"{iso_date}T{time_str}Z",
            "mode": mode,
            "category": cat,
            "subcategory": subcat,
            "note": note,
            "amount": amount,
            "transactionType": t_type,
            "currency": curr,
            "eraId": era_id,
            "eraTitle": era_title,
            "year": year
        })

print(f"Loaded {len(txns)} transactions.")
