import json

with open("/Users/yashuraghuvanshi/.gemini/antigravity/scratch/your-life-in-receipts/data/full_dataset.json", "r") as f:
    data = json.load(f)

# Add Movies & Entertainment dimension
movies_raw = [
    ("mov_001", "2015-06-23T20:00:00Z", "Amazon Prime: Interstellar", "Movies & Entertainment", "Prime Video", "Sci-Fi / Drama", "Watched on laptop in room B45 after work.", "era_1"),
    ("mov_002", "2015-11-08T21:30:00Z", "Netflix: Narcos Season 1", "Movies & Entertainment", "Netflix", "Crime / Drama", "Weekend binge in Baroda bachelor flat.", "era_1"),
    ("mov_003", "2016-04-03T19:00:00Z", "OTT Platform: Sarabhai vs Sarabhai", "Movies & Entertainment", "Hotstar", "Comedy", "Comfort watching with flatmates over dinner.", "era_1"),
    ("mov_004", "2016-10-07T20:45:00Z", "Netflix: Stranger Things", "Movies & Entertainment", "Netflix", "Sci-Fi", "Late night viewing with earphones.", "era_2"),
    ("mov_005", "2017-01-03T18:00:00Z", "Imax 3D: Rogue One - Star Wars", "Movies & Entertainment", "Theatre", "Sci-Fi / Action", "Imax 3D experience ticket (Rs. 400).", "era_2"),
    ("mov_006", "2017-03-12T17:00:00Z", "Inox Cinema: The Batman", "Movies & Entertainment", "Theatre", "Action", "2 Batman tickets at Place 4 theatre (Rs. 440).", "era_2"),
    ("mov_007", "2017-06-08T18:30:00Z", "Cinepolis 4DX 3D: Wonder Woman", "Movies & Entertainment", "Theatre", "Action / Fantasy", "2 tickets Cinepolis 4DX 3D motion seats (Rs. 760).", "era_3"),
    ("mov_008", "2017-09-24T15:30:00Z", "PVR Cinema: Newton", "Movies & Entertainment", "Theatre", "Drama", "Sunday matinee show 2 tickets (Rs. 560).", "era_3"),
    ("mov_009", "2017-10-01T21:00:00Z", "Hotstar: Premier League Match", "Movies & Entertainment", "Hotstar Mobile", "Sports", "Watched weekend football match.", "era_3"),
    ("mov_010", "2017-11-19T14:00:00Z", "PVR Cinema Place 6: Secret Superstar", "Movies & Entertainment", "Theatre", "Drama", "Post-marathon celebration movie with family (Rs. 436).", "era_3"),
    ("mov_011", "2018-02-06T19:00:00Z", "PVR Cinema: Pad Man", "Movies & Entertainment", "Theatre", "Biographical Drama", "2 tickets PVR Place 6 (Rs. 312).", "era_4"),
    ("mov_012", "2018-07-28T21:30:00Z", "INOX: Mission Impossible Fallout", "Movies & Entertainment", "Theatre", "Action", "2 INOX tickets after hospital visit (Rs. 481).", "era_4")
]

movies_list = []
for m in movies_raw:
    movies_list.append({
        "id": m[0],
        "type": "movie",
        "dimension": "Movies & Entertainment",
        "title": m[2],
        "date": m[1][:10],
        "time": m[1][11:19],
        "timestamp": m[1],
        "category": m[3],
        "platform": m[4],
        "genre": m[5],
        "note": m[6],
        "eraId": m[7]
    })

data["movies"] = movies_list
data["summary"]["totalMovies"] = len(movies_list)

# Update full_dataset.json and js/data.js
with open("/Users/yashuraghuvanshi/.gemini/antigravity/scratch/your-life-in-receipts/data/full_dataset.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

with open("/Users/yashuraghuvanshi/.gemini/antigravity/scratch/your-life-in-receipts/js/data.js", "w", encoding="utf-8") as f:
    f.write("/* Auto-generated Life Receipts Multidimensional Archive */\n")
    f.write("window.LIFE_DATA = ")
    json.dump(data, f, separators=(',', ':'))
    f.write(";\nconsole.log('Life Receipts dataset loaded with all 9 dimensions:', window.LIFE_DATA.summary);\n")

print(f"Added {len(movies_list)} Movies & Entertainment records. Total dimensions: 9!")
