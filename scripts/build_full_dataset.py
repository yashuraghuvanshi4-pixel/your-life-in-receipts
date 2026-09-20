import csv, json, os, re
from datetime import datetime

print("Building complete multidimensional Life Receipts dataset...")

transactions_file = "/Users/yashuraghuvanshi/.gemini/antigravity/scratch/your-life-in-receipts/data/transactions_clean.csv"

txns = []
with open(transactions_file, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        raw_date = row.get("Date", "").strip()
        mode = row.get("Mode", "").strip()
        cat = row.get("Category", "").strip()
        subcat = row.get("Subcategory", "").strip()
        note = row.get("Note", "").strip()
        amount_str = row.get("Amount", "0").strip()
        try:
            amount = float(amount_str)
        except:
            amount = 0.0
        t_type = row.get("Income/Expense", "Expense").strip()
        curr = row.get("Currency", "INR").strip()

        # Parse date and time
        parts = raw_date.split(" ")
        d_str = parts[0]
        time_str = parts[1] if len(parts) > 1 else "12:00:00"

        # parse d_str e.g. 20/09/2018 or 12/9/2018 or 1/1/2015
        d_parts = d_str.split("/") if "/" in d_str else d_str.split("-")
        day = int(d_parts[0])
        month = int(d_parts[1])
        year = int(d_parts[2])
        if year < 100:
            year += 2000
        iso_date = f"{year:04d}-{month:02d}-{day:02d}"

        # Assign Life Era
        if year == 2015 or (year == 2016 and month <= 6):
            era = "Era 1: The Frugal Apprentice (2015–Mid 2016)"
            era_id = "era_1"
        elif (year == 2016 and month > 6) or (year == 2017 and month <= 5):
            era = "Era 2: The Transition & Family Anchor (Mid 2016–Mid 2017)"
            era_id = "era_2"
        elif (year == 2017 and month > 5) or (year == 2018 and month <= 3):
            era = "Era 3: The Mumbai Crucible & Marathon (Mid 2017–Early 2018)"
            era_id = "era_3"
        else:
            era = "Era 4: Freedom, Dividends & Devotion (2018)"
            era_id = "era_4"

        txns.append({
            "id": f"txn_{i+1:04d}",
            "type": "purchase",
            "dimension": "Purchases",
            "date": iso_date,
            "rawDate": raw_date,
            "time": time_str,
            "timestamp": f"{iso_date}T{time_str}",
            "mode": mode,
            "category": cat,
            "subcategory": subcat,
            "note": note,
            "amount": amount,
            "transactionType": t_type,
            "currency": curr,
            "era": era,
            "eraId": era_id,
            "year": year
        })

print(f"Parsed {len(txns)} transactions!")
