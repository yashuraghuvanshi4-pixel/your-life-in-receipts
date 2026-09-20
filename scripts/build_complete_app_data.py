import json, csv, random

print("Generating rich digital life dataset...")

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
            "title": note if note else f"{cat} ({subcat or mode})",
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

# 1. MUSIC (Spotify schema)
# spotify_track_uri, ts, platform, ms_played, track_name, artist_name, album_name, reason_start, reason_end, shuffle, skipped
music_tracks_raw = [
    # Era 1: Baroda Frugal / Late night study / Hostel vibes
    ("spotify:track:1bDbXMyjaUIooNwFE9wn0N", "2015-01-01T23:45:10Z", "Android OS 5.0", 248000, "Kun Faya Kun", "A.R. Rahman, Javed Ali, Mohit Chauhan", "Rockstar", "clickrow", "trackdone", False, False, "era_1"),
    ("spotify:track:7dGJoSO4X16q765wS0LqE8", "2015-01-14T23:30:15Z", "Windows 10", 310000, "Fix You", "Coldplay", "X&Y", "clickrow", "trackdone", False, False, "era_1"),
    ("spotify:track:0vG696gE09E96zPjWbF2n1", "2015-02-08T01:45:00Z", "Android OS 5.0", 185000, "Weightless", "Marconi Union", "Ambient Transmissions", "playlist", "trackdone", False, False, "era_1"),
    ("spotify:track:4cOdK2wGLETKBW3PvgPWqT", "2015-03-02T22:15:30Z", "Android OS 5.0", 298000, "Dil Chahta Hai", "Shankar Mahadevan", "Dil Chahta Hai", "trackdone", "trackdone", True, False, "era_1"),
    ("spotify:track:6gBFPUFcJLqvgxACurDpKV", "2015-04-14T02:10:00Z", "Windows 10", 220000, "Intro", "The xx", "xx", "clickrow", "trackdone", False, False, "era_1"),
    ("spotify:track:5uCaxftua0slGbpLVQgT6f", "2015-05-17T18:30:00Z", "Android OS 5.0", 245000, "Maeri", "Euphoria", "Dhoom", "clickrow", "trackdone", False, False, "era_1"),
    ("spotify:track:3AJwUDP919kv29Q2phUb40", "2015-07-01T08:15:00Z", "Android OS 5.0", 270000, "Sayonee", "Junoon", "Azadi", "trackdone", "trackdone", True, False, "era_1"),
    ("spotify:track:1CsP4wX6uN6b00v41dJ7P2", "2015-10-07T21:40:00Z", "Android OS 5.0", 215000, "Clair de Lune", "Claude Debussy", "Suite Bergamasque", "clickrow", "trackdone", False, False, "era_1"),
    ("spotify:track:2fXw04G16w77L5O8K4gP8e", "2015-11-15T19:55:00Z", "Android OS 5.0", 335000, "Shubhaarambh", "Amit Trivedi, Shruti Pathak", "Kai Po Che", "clickrow", "trackdone", False, False, "era_1"),
    ("spotify:track:4HlFJVsn89799vvvdc6d86", "2015-12-20T09:12:00Z", "Android OS 5.0", 260000, "Iktara", "Kavita Seth, Amitabh Bhattacharya", "Wake Up Sid", "clickrow", "trackdone", False, False, "era_1"),
    
    # Era 2: The Transition & Family Anchor
    ("spotify:track:3e7nxP5MfqnEaN5gY0Gf5K", "2016-07-20T07:15:00Z", "Android OS 6.0", 290000, "Roobaroo", "A.R. Rahman, Naresh Iyer", "Rang De Basanti", "clickrow", "trackdone", False, False, "era_2"),
    ("spotify:track:6UelLqGlWMcVH1E5c4HbbN", "2016-09-13T10:05:00Z", "Android OS 6.0", 312000, "In Dino", "Pritam, Soham Chakraborty", "Life in a... Metro", "clickrow", "trackdone", False, False, "era_2"),
    ("spotify:track:1qEmF2LN85w9bvG4G290dF", "2016-10-31T07:40:00Z", "Android OS 6.0", 305000, "Luka Chuppi", "Lata Mangeshkar, A.R. Rahman", "Rang De Basanti", "clickrow", "trackdone", False, False, "era_2"),
    ("spotify:track:2b8OnhW8L30qE0x41e8cQ0", "2016-11-19T11:45:00Z", "Android OS 6.0", 280000, "Madhuban Mein Radhika", "Mohammed Rafi", "Kohinoor", "clickrow", "trackdone", False, False, "era_2"),
    ("spotify:track:59wn2a63y90wG7p73wW67A", "2016-11-28T18:15:00Z", "Android OS 6.0", 255000, "Aashiyan", "Shreya Ghoshal, Nikhil Paul George", "Barfi!", "clickrow", "trackdone", False, False, "era_2"),
    ("spotify:track:7Bpxv04YgN1p55bS3d99X2", "2016-12-29T07:45:00Z", "Android OS 6.0", 320000, "Maa", "Shankar Mahadevan", "Taare Zameen Par", "clickrow", "trackdone", False, False, "era_2"),
    ("spotify:track:4LRP0Ew9eG2pX4W9b7f5d0", "2017-01-03T02:20:00Z", "Windows 10", 204000, "Resonance", "HOME", "Odyssey", "clickrow", "trackdone", False, False, "era_2"),
    ("spotify:track:7oK9RyRh9wz8O8k3v55c7P", "2017-02-28T22:15:00Z", "Android OS 7.0", 340000, "Yeh Hai Bombay Meri Jaan", "Mohammed Rafi, Geeta Dutt", "C.I.D.", "clickrow", "trackdone", False, False, "era_2"),
    ("spotify:track:3g6g18W8eN9b7X298811K0", "2017-03-31T21:15:00Z", "Android OS 7.0", 295000, "Phir Se Ud Chala", "Mohit Chauhan", "Rockstar", "clickrow", "trackdone", False, False, "era_2"),
    ("spotify:track:1988V4b6wL20aE00p44c8N", "2017-05-02T06:15:00Z", "Android OS 7.0", 326000, "Zinda", "Siddharth Mahadevan", "Bhaag Milkha Bhaag", "clickrow", "trackdone", False, False, "era_2"),
    
    # Era 3: Mumbai Crucible & Marathon
    ("spotify:track:4pt5f013p7L7e4f9b00W11", "2017-06-08T19:30:00Z", "Android OS 7.0", 240000, "Midnight City", "M83", "Hurry Up, We're Dreaming", "clickrow", "trackdone", False, False, "era_3"),
    ("spotify:track:15JINEqrjQce4xne9rq8ee", "2017-07-30T15:45:00Z", "Windows 10", 315000, "Time", "Hans Zimmer", "Inception OST", "clickrow", "trackdone", False, False, "era_3"),
    ("spotify:track:7KXjTSCq5nL1LoYtL7XAwS", "2017-08-05T06:30:00Z", "Android OS 7.0", 280000, "Lose Yourself", "Eminem", "8 Mile", "clickrow", "trackdone", False, False, "era_3"),
    ("spotify:track:2d80p8Y8L40q9W9811C8N2", "2017-08-20T21:10:00Z", "Android OS 7.0", 272000, "Chaiyya Chaiyya", "Sukhwinder Singh, Sapna Awasthi", "Dil Se", "clickrow", "trackdone", False, False, "era_3"),
    ("spotify:track:6g99P2e0qN4W9e8c44d11B", "2017-09-24T16:05:00Z", "Android OS 7.0", 250000, "Khaabon Ke Parinday", "Mohit Chauhan, Alyssa Mendonsa", "Zindagi Na Milegi Dobara", "clickrow", "trackdone", False, False, "era_3"),
    ("spotify:track:1w88P12mE0qN5v4W8b3c1A", "2017-10-18T19:20:00Z", "Android OS 7.0", 310000, "Safarnama", "Lucky Ali", "Tamasha", "clickrow", "trackdone", False, False, "era_3"),
    ("spotify:track:5e88C0qN4W9e7c41d11B4P", "2017-11-18T05:30:00Z", "Android OS 7.0", 305000, "Eye of the Tiger", "Survivor", "Eye of the Tiger", "clickrow", "trackdone", False, False, "era_3"),
    ("spotify:track:7e11B4P5e88C0qN4W9e7c4", "2017-11-19T08:15:00Z", "Android OS 7.0", 345000, "Hall of Fame", "The Script, will.i.am", "#3", "clickrow", "trackdone", False, False, "era_3"),
    ("spotify:track:288V4b6wL20aE00p44c8N9", "2017-11-26T20:35:00Z", "Android OS 7.0", 312000, "Tujh Mein Rab Dikhta Hai", "Roop Kumar Rathod", "Rab Ne Bana Di Jodi", "clickrow", "trackdone", False, False, "era_3"),
    ("spotify:track:3a11C0qN4W9e7c41d11B4P", "2017-12-20T02:45:00Z", "Windows 10", 220000, "Cornfield Chase", "Hans Zimmer", "Interstellar OST", "clickrow", "trackdone", False, False, "era_3"),
    
    # Era 4: Freedom, Dividends & Devotion
    ("spotify:track:6e99B12mE0qN5v4W8b3c1A", "2018-01-03T18:30:00Z", "Android OS 8.0", 230000, "Ilahi", "Arijit Singh", "Yeh Jawaani Hai Deewani", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:4v99C0qN4W9e7c41d11B4P", "2018-01-18T22:05:00Z", "Android OS 8.0", 260000, "Aazaadiyan", "Amit Trivedi", "Udaan", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:1a11B4P5e88C0qN4W9e7c4", "2018-01-27T18:25:00Z", "Android OS 8.0", 242000, "Viva La Vida", "Coldplay", "Viva La Vida", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:5c88C0qN4W9e7c41d11B4P", "2018-03-23T20:15:00Z", "Android OS 8.0", 305000, "Stronger", "Kanye West", "Graduation", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:7w99B12mE0qN5v4W8b3c1A", "2018-05-15T20:30:00Z", "Android OS 8.0", 280000, "Matargashti", "Mohit Chauhan", "Tamasha", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:3e88C0qN4W9e7c41d11B4P", "2018-06-11T06:00:00Z", "Android OS 8.0", 258000, "Can't Hold Us", "Macklemore & Ryan Lewis", "The Heist", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:2w99B12mE0qN5v4W8b3c1A", "2018-07-08T09:15:00Z", "Android OS 8.0", 315000, "Experience", "Ludovico Einaudi", "In a Time Lapse", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:4e88C0qN4W9e7c41d11B4P", "2018-07-20T13:30:00Z", "Android OS 8.0", 290000, "Aanandache Jhaad", "Ajay-Atul", "Soundtrack", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:6w99B12mE0qN5v4W8b3c1A", "2018-08-15T10:15:00Z", "Android OS 8.0", 270000, "Yeh Jo Des Hai Tera", "A.R. Rahman", "Swades", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:1e88C0qN4W9e7c41d11B4P", "2018-08-31T09:35:00Z", "Android OS 8.0", 240000, "Badlapur - Jeena Jeena", "Atif Aslam", "Badlapur", "clickrow", "trackdone", False, False, "era_4"),
    ("spotify:track:8w99B12mE0qN5v4W8b3c1A", "2018-09-13T21:40:00Z", "Android OS 8.0", 310000, "Chaiyya Chaiyya", "Sukhwinder Singh", "Dil Se", "clickrow", "trackdone", False, False, "era_4")
]

music_list = []
for i, m in enumerate(music_tracks_raw):
    iso_date = m[1][:10]
    time_str = m[1][11:19]
    music_list.append({
        "id": f"mus_{i+1:03d}",
        "type": "music",
        "dimension": "Music",
        "title": f"{m[4]} — {m[5]}",
        "spotify_track_uri": m[0],
        "ts": m[1],
        "date": iso_date,
        "time": time_str,
        "timestamp": m[1],
        "platform": m[2],
        "ms_played": m[3],
        "durationSec": round(m[3]/1000),
        "track_name": m[4],
        "artist_name": m[5],
        "album_name": m[6],
        "reason_start": m[7],
        "reason_end": m[8],
        "shuffle": m[9],
        "skipped": m[10],
        "eraId": m[11]
    })

# 2. PLACES (Check-ins & transit stops)
places_raw = [
    ("plc_001", "2015-01-01T10:30:00Z", "Kalika Mata Mandir & Ropeway, Pavagadh", "Pilgrimage / Tourism", "Ropeway ride to top with family, New Year blessings.", "Vadodara / Panchmahal", "era_1"),
    ("plc_002", "2015-01-05T09:00:00Z", "Bachelor Flat B45, Old Padra Road", "Residence", "Moving into shared flat B45 with 2 flatmates. Split rent & cook.", "Vadodara (BRC)", "era_1"),
    ("plc_003", "2015-03-02T16:00:00Z", "Dental Care Clinic, Akota", "Health", "Emergency tooth checkup leading to root canal treatment.", "Vadodara", "era_1"),
    ("plc_004", "2015-05-17T17:30:00Z", "Baroda Railway Station (BRC) Platform 1", "Transit", "Taking shared cab and train on the Western Railway line.", "Vadodara", "era_1"),
    ("plc_005", "2016-06-27T17:00:00Z", "Chalisgaon Junction to Baroda Route", "Transit", "Returning from ancestral town visit on bus travels.", "Maharashtra / Gujarat", "era_1"),
    ("plc_006", "2016-11-19T12:00:00Z", "Pavagadh Ropeway & Sayaji Baug", "Leisure", "Ropeway tickets, temple puja coconuts, and Sayaji express toy train.", "Vadodara", "era_2"),
    ("plc_007", "2016-11-28T18:00:00Z", "Electronics Superstore, Alkapuri", "Purchases", "Purchasing Metz 32-inch LED TV to be dispatched to parents home.", "Vadodara", "era_2"),
    ("plc_008", "2017-02-28T13:00:00Z", "University of Mumbai, Kalina Campus", "Education", "Verification of documents and exam forms at the registrar.", "Santacruz East, Mumbai", "era_2"),
    ("plc_009", "2017-02-28T22:00:00Z", "Marine Drive Promenade", "Reflection", "Sunset walk with hot tea after University visit. Decision to move to Mumbai finalized.", "South Mumbai", "era_2"),
    ("plc_010", "2017-03-31T21:00:00Z", "Siddhivinayak Temple & Dadar West", "Pilgrimage", "Seeking blessings on job transition; authentic Maharashtrian meal (pav bhaji & piyush).", "Dadar, Mumbai", "era_2"),
    ("plc_011", "2017-05-03T15:00:00Z", "Current Residence CHS, Mulund / Thane", "Residence", "New flat lease signed, gas stove installed, inverter battery set up.", "Thane/Mumbai Suburbs", "era_2"),
    ("plc_012", "2017-07-28T11:30:00Z", "Dr. L.H. Hiranandani Hospital & Eye Clinic", "Health", "Consultation for Mom's progressive vision blurriness.", "Powai, Mumbai", "era_3"),
    ("plc_013", "2017-07-30T15:30:00Z", "Computer Repair Hub, Lamington Road / Thane", "Tech", "Upgrading old laptop with 128GB SSD + 500GB HDD + Windows installation.", "Mumbai", "era_3"),
    ("plc_014", "2017-10-18T19:15:00Z", "Sevagram Express 3AC (Place 2 to Place 3)", "Transit", "Diwali journey home to parents with sweets and gifts.", "Indian Railways", "era_3"),
    ("plc_015", "2017-11-19T06:00:00Z", "Azad Maidan to Marine Drive Finish Line", "Sports / Milestone", "Running the Mumbai Half Marathon (21.1 km). Finished in 2:06:40.", "Mumbai", "era_3"),
    ("plc_016", "2017-11-26T17:30:00Z", "Eye Institute, Place 6", "Health", "Follow-up eye checkup and prescription for protective spectacles.", "Place 6, Mumbai", "era_3"),
    ("plc_017", "2018-01-03T17:00:00Z", "Two Wheeler Bikedelux Showroom, LBS Marg", "Milestone", "Paying booking advance (Rs. 1,000) for brand new motorcycle.", "Mumbai", "era_4"),
    ("plc_018", "2018-01-27T18:15:00Z", "Two Wheeler Bikedelux Showroom Delivery Bay", "Milestone", "Handover of bike keys after clearing 3rd installment (Rs. 43,000).", "Mumbai", "era_4"),
    ("plc_019", "2018-06-27T21:30:00Z", "Nehru Planetarium & Worli Sea Face", "Culture", "Watching the cosmos show with family, evening drive.", "Worli, Mumbai", "era_4"),
    ("plc_020", "2018-07-20T12:00:00Z", "Eye Institute OT & Recovery Ward", "Health / Devotion", "Mom's cataract lens implant surgery successfully completed.", "Mumbai", "era_4"),
    ("plc_021", "2018-08-05T16:00:00Z", "Optics & Vision Care, Place 0", "Health", "Collecting custom anti-glare reading and distance glasses for Mom (Rs. 4,300).", "Thane, Mumbai", "era_4")
]

places_list = []
for p in places_raw:
    places_list.append({
        "id": p[0],
        "type": "place",
        "dimension": "Places",
        "title": p[2],
        "date": p[1][:10],
        "time": p[1][11:19],
        "timestamp": p[1],
        "category": p[3],
        "note": p[4],
        "location": p[5],
        "eraId": p[6]
    })

# 3. PHOTOS (Polaroid memories)
photos_raw = [
    ("pht_001", "2015-01-01T11:15:00Z", "Pavagadh Temple Stairs", "Family selfie at the temple summit under morning winter sun.", "assets/photos/temple_stairs.jpg", "era_1"),
    ("pht_002", "2015-02-15T08:45:00Z", "Morning Chai Tapri, Baroda", "Hot brass glass of cutting chai and bun maska before Sunday shift.", "assets/photos/chai_tapri.jpg", "era_1"),
    ("pht_003", "2015-10-07T21:00:00Z", "The Kindle Unboxing", "My first major gadget purchase with my own salary. Reading late into the night.", "assets/photos/kindle_desk.jpg", "era_1"),
    ("pht_004", "2016-11-28T20:30:00Z", "New TV in Parents' Living Room", "Aai watching the 9 PM Marathi news on the big screen. Her smile was priceless.", "assets/photos/tv_living_room.jpg", "era_2"),
    ("pht_005", "2017-02-28T22:15:00Z", "Marine Drive Sea Breeze", "Looking out at the Queen's Necklace lights, knowing my life is about to change.", "assets/photos/marine_drive.jpg", "era_2"),
    ("pht_006", "2017-05-03T18:00:00Z", "Keys to the Mumbai Flat", "Empty living room with shiny vitrified tiles and packed cartons. Day 1 in Mumbai.", "assets/photos/new_flat_keys.jpg", "era_2"),
    ("pht_007", "2017-07-30T17:00:00Z", "SSD Screwdriver on Desk", "Replaced the sluggish HDD with an SSD. The old laptop runs faster than new.", "assets/photos/laptop_ssd.jpg", "era_3"),
    ("pht_008", "2017-11-19T09:00:00Z", "Finisher Medal Around My Neck", "Sweat-soaked Puma shirt, bib #4128, holding the 21.1 km finisher medal at Marine Drive.", "assets/photos/marathon_medal.jpg", "era_3"),
    ("pht_009", "2018-01-27T19:00:00Z", "First Ride on the Bikedelux", "Red metallic paint reflecting streetlights outside the showroom. No EMI debt!", "assets/photos/new_bike.jpg", "era_4"),
    ("pht_010", "2018-07-20T14:00:00Z", "Aai Smiling with the Eye Patch", "Post-op room at Eye Institute. She gave a thumbs up to the camera.", "assets/photos/mom_recovery.jpg", "era_4"),
    ("pht_011", "2018-08-05T17:30:00Z", "Aai's New Glasses", "Aai wearing her new brown-framed glasses, reading the newspaper without squinting.", "assets/photos/mom_glasses.jpg", "era_4"),
    ("pht_012", "2018-08-31T10:00:00Z", "The Rs. 70,255 Salary Slip", "Milestone reached: crossing 70k base salary after 4 years of relentless upskilling.", "assets/photos/salary_milestone.jpg", "era_4")
]

photos_list = []
for p in photos_raw:
    photos_list.append({
        "id": p[0],
        "type": "photo",
        "dimension": "Photos",
        "title": p[2],
        "date": p[1][:10],
        "time": p[1][11:19],
        "timestamp": p[1],
        "caption": p[3],
        "imagePlaceholder": p[4],
        "eraId": p[5]
    })

# 4. MESSAGES (WhatsApp & SMS)
messages_raw = [
    ("msg_001", "2015-01-02T10:00:00Z", "Aai", "Incoming", "Beta, did you deposit the money? Don't starve yourself to send money here.", "era_1"),
    ("msg_002", "2015-01-02T10:02:15Z", "Aai", "Outgoing", "Already transferred Rs. 10,000 Aai. It is the first thing I do on 1st of every month. Eat well!", "era_1"),
    ("msg_003", "2015-02-23T09:20:00Z", "Rahul (Flatmate B45)", "Incoming", "Bro, settled the splitwise for electricity + water jar + cook. Check your app.", "era_1"),
    ("msg_004", "2015-03-03T18:30:00Z", "Dental Care Clinic", "Incoming", "Reminder: Root canal second sitting tomorrow at 5:30 PM. Please take painkillers.", "era_1"),
    ("msg_005", "2015-11-15T19:53:00Z", "Aai", "Incoming", "Diwali gift received beta! All your cousins were asking when you are coming home.", "era_1"),
    ("msg_006", "2016-11-28T19:00:00Z", "Aai", "Incoming", "Beta! The delivery boys just unloaded a giant television box! Is this from you??", "era_2"),
    ("msg_007", "2016-11-28T19:02:30Z", "Aai", "Outgoing", "Yes Aai! 32 inch Metz TV for you and Baba. Happy Diwali and New Year in advance!", "era_2"),
    ("msg_008", "2017-02-22T14:30:00Z", "Manager / HR", "Incoming", "Discussion scheduled regarding Mumbai office transfer request for April.", "era_2"),
    ("msg_009", "2017-03-31T18:00:00Z", "HDFC Bank Alerts", "Incoming", "Salary credited Rs. 56,102 for March 2017. Workplace greetings.", "era_2"),
    ("msg_010", "2017-05-03T19:30:00Z", "Flat Owner (Current Res)", "Incoming", "Security deposit received. Gas pipeline NOC handed over to security guard.", "era_2"),
    ("msg_011", "2017-07-28T14:00:00Z", "Aai", "Incoming", "Doctor in Powai said there is cataract in left eye. Should we do it now or wait?", "era_3"),
    ("msg_012", "2017-07-28T14:05:00Z", "Aai", "Outgoing", "Don't delay it Aai. We will get the best surgeon and imported lens. I have set aside funds.", "era_3"),
    ("msg_013", "2017-11-18T20:30:00Z", "Kunal (Running Group)", "Incoming", "Bibs collected! Pin it to your singlet tonight. Carb load and sleep early. 5 AM sharp at CST.", "era_3"),
    ("msg_014", "2017-11-19T09:15:00Z", "Aai", "Outgoing", "Aai I finished the half marathon! 21 kilometers without stopping! Got a medal too!", "era_3"),
    ("msg_015", "2017-11-19T09:20:00Z", "Aai", "Incoming", "God bless you my boy! Don't catch a cold. Drink hot water and take rest.", "era_3"),
    ("msg_016", "2018-01-03T18:00:00Z", "Two Wheeler Dealership", "Incoming", "Booking confirmed for Bikedelux Red. Receipt #BK-9021 issued.", "era_4"),
    ("msg_017", "2018-01-27T17:30:00Z", "Two Wheeler Dealership", "Incoming", "Final payment Rs. 43,000 received. RC book and insurance active. Please collect keys.", "era_4"),
    ("msg_018", "2018-07-20T13:45:00Z", "Eye Institute Helpline", "Incoming", "Discharge summary prepared for Mrs. Patwardhan. Follow-up drop schedule in portal.", "era_4"),
    ("msg_019", "2018-08-05T18:00:00Z", "Aai", "Incoming", "Beta these new spectacles are wonderful. I can read the small print in the prayer book easily.", "era_4"),
    ("msg_020", "2018-08-28T19:18:00Z", "Zerodha / Demat Alert", "Incoming", "Dividend of Rs. 18.00 from Reliance Industries credited to SB Account 1.", "era_4"),
    ("msg_021", "2018-08-31T09:28:00Z", "Workplace Payroll", "Incoming", "Salary credit of Rs. 70,255 processed for August 2018. Congratulations on promotion.", "era_4")
]

messages_list = []
for m in messages_raw:
    messages_list.append({
        "id": m[0],
        "type": "message",
        "dimension": "Messages",
        "title": f"Chat with {m[2]} ({m[3]})",
        "date": m[1][:10],
        "time": m[1][11:19],
        "timestamp": m[1],
        "sender": m[2],
        "direction": m[3],
        "body": m[4],
        "eraId": m[5]
    })

# 5. SEARCHES (Google search history)
searches_raw = [
    ("srch_001", "2015-01-06T23:15:00Z", "how to save 30% of salary when living on rent in gujarat", "Finance", "era_1"),
    ("srch_002", "2015-02-18T00:30:00Z", "why does tooth ache become worse at night time", "Health", "era_1"),
    ("srch_003", "2015-03-02T21:40:00Z", "root canal treatment single sitting vs multiple sittings pain level", "Health", "era_1"),
    ("srch_004", "2015-04-14T01:50:00Z", "pm relief fund online donation tax exemption 80G", "Finance", "era_1"),
    ("srch_005", "2015-10-05T22:15:00Z", "kindle paperwhite vs basic for reading in dark room", "Tech", "era_1"),
    ("srch_006", "2016-10-28T21:00:00Z", "best 32 inch led smart tv under 25000 in india reviews", "Shopping", "era_2"),
    ("srch_007", "2016-11-20T08:30:00Z", "pavagadh hill ropeway timing and crowd on weekends", "Travel", "era_2"),
    ("srch_008", "2016-12-28T23:45:00Z", "simple feature phone with big buttons for senior citizen parents", "Shopping", "era_2"),
    ("srch_009", "2017-01-02T02:15:00Z", "edtech course data engineering python curriculum review", "Career", "era_2"),
    ("srch_010", "2017-02-27T23:30:00Z", "central railway local train time table thane to dadar fast", "Transit", "era_2"),
    ("srch_011", "2017-03-31T19:00:00Z", "how to negotiate salary in internal team transfer to mumbai", "Career", "era_2"),
    ("srch_012", "2017-05-02T05:45:00Z", "puma troy running shoe arch support for flat feet review", "Fitness", "era_2"),
    ("srch_013", "2017-07-28T13:15:00Z", "cataract surgery types phacoemulsification vs laser cost difference mumbai", "Health", "era_3"),
    ("srch_014", "2017-07-29T22:30:00Z", "can you install ssd in old dell inspiron laptop without reinstalling windows", "Tech", "era_3"),
    ("srch_015", "2017-10-09T23:10:00Z", "mumbai half marathon registration dates and cut off time 21km", "Sports", "era_3"),
    ("srch_016", "2017-10-18T18:45:00Z", "sevagram express running status live spot your train", "Travel", "era_3"),
    ("srch_017", "2017-11-17T21:30:00Z", "what to eat the night before half marathon running tips", "Sports", "era_3"),
    ("srch_018", "2018-01-02T22:00:00Z", "motorcycle booking process documents needed aadhaar address proof update", "Automotive", "era_4"),
    ("srch_019", "2018-01-15T18:30:00Z", "two wheeler third party vs comprehensive insurance claim settlement ratio", "Finance", "era_4"),
    ("srch_020", "2018-03-23T19:20:00Z", "book finding next job practical tips for senior engineer resume", "Career", "era_4"),
    ("srch_021", "2018-07-12T21:15:00Z", "cataract recovery time can patient watch television after 3 days", "Health", "era_4"),
    ("srch_022", "2018-08-28T20:30:00Z", "how are share dividends taxed in bank account form 26AS", "Finance", "era_4")
]

searches_list = []
for s in searches_raw:
    searches_list.append({
        "id": s[0],
        "type": "search",
        "dimension": "Searches",
        "title": f'"{s[2]}"',
        "date": s[1][:10],
        "time": s[1][11:19],
        "timestamp": s[1],
        "query": s[2],
        "category": s[3],
        "eraId": s[4]
    })

# 6. PERSONAL NOTES (Diary & Apple Notes)
notes_raw = [
    ("not_001", "2015-01-01T23:55:00Z", "The First Month Promise", "Transferred 10,000 INR home to Aai today. It was tough on my 47k salary after rent and mess fees, but that 10k is sacred. She sacrificed her gold bangles for my engineering tuition. This remittance never stops.", "era_1"),
    ("not_002", "2015-03-03T23:15:00Z", "Pain & Perspective", "The dentist root canal hurt like hell today. Had to pay 3,000 in cash advance. Sitting alone in room B45 drinking lukewarm milk, missing home cooking intensely. But we build resilience in silence.", "era_1"),
    ("not_003", "2015-10-07T23:30:00Z", "Why I Bought the Kindle", "Rs. 8,029 on a Kindle might seem excessive for someone splitting 333 INR maid bills. But books are my gateway out of mediocricy. Reading 2 chapters every night before sleep.", "era_1"),
    ("not_004", "2016-11-28T21:45:00Z", "The 32-Inch Screen", "Aai called me crying softly. The delivery truck unloaded the TV. She said all the women from our chawl gathered in the evening to see it. That 20k was the best money I ever spent in my life.", "era_2"),
    ("not_005", "2017-02-28T23:00:00Z", "Marine Drive Reflection", "Wind was cold against my face. The Arabian sea was roaring in the dark. I have outgrown Baroda. Mumbai is loud, crowded, and unforgiving, but that is where the ceiling is broken. I am transferring.", "era_2"),
    ("not_006", "2017-07-30T19:30:00Z", "The Resurrected Laptop", "Instead of buying a new 60k laptop on EMI, I bought a 128GB SSD for 2,200 and 500GB HDD for 1,800. Installed it with a tiny screwdriver. Machine boots in 8 seconds. Frugality is an engineering mindset.", "era_3"),
    ("not_007", "2017-11-19T11:00:00Z", "21.1 Kilometers", "At kilometer 17 on the flyover, my calves were cramping so bad I wanted to collapse on the tarmac. But I told myself: if you can't run through 4 kilometers of leg pain, how will you carry your family through life? Crossed the finish in 2:06.", "era_3"),
    ("not_008", "2018-01-27T20:30:00Z", "Two Wheels, Zero Debt", "Booking: Rs 1,000. Second installment: Rs 50,000. Final installment: Rs 43,000. Total Rs 94,000 cleared in cash/debit. I drove it home through the evening traffic. Every vibration of the engine felt like earned freedom.", "era_4"),
    ("not_009", "2018-07-20T16:00:00Z", "Aai's Vision", "The surgeon told me her lens was calcified and clouding rapidly. Today the synthetic foldable lens went in without complications. When she looked up and read the small calendar letters on the clinic wall, my eyes welled up. Worth every single penny.", "era_4"),
    ("not_010", "2018-08-31T20:00:00Z", "The 70k Threshold & Beyond", "Salary: 70,255. Stock dividends from Reliance, Astral, Infosys rolling in passively. We started with 47k in a bachelor room in Baroda worried about 10 rupee auto fares. Today we stand on solid ground.", "era_4")
]

notes_list = []
for n in notes_raw:
    notes_list.append({
        "id": n[0],
        "type": "note",
        "dimension": "Personal Notes",
        "title": n[2],
        "date": n[1][:10],
        "time": n[1][11:19],
        "timestamp": n[1],
        "content": n[3],
        "eraId": n[4]
    })

# 7. EVENTS (Milestones)
events_raw = [
    ("evt_001", "2015-01-01T00:00:00Z", "The Independence Leap", "First professional employment posting in Baroda. Starting life in room B45.", "Milestone", "era_1"),
    ("evt_002", "2016-11-28T18:04:00Z", "The Home Living Room Upgrade", "Gifted Metz 32-inch LED TV to parents for Diwali homecoming.", "Family", "era_2"),
    ("evt_003", "2017-03-31T21:00:00Z", "The Mumbai Relocation Approval", "Offer letter and city transfer from Baroda to Mumbai Central corridor.", "Career", "era_2"),
    ("evt_004", "2017-05-03T12:00:00Z", "New Mumbai Home Settled", "Lease agreement and kitchen gas installation at Current Residence CHS.", "Home", "era_2"),
    ("evt_005", "2017-07-30T15:30:00Z", "The Laptop Resurrection", "Upgraded laptop with SSD and RAM, unlocking capability for data engineering course.", "Tech", "era_3"),
    ("evt_006", "2017-11-19T06:00:00Z", "Mumbai Half Marathon (21.1 km)", "Completed first official endurance race at 2:06:40.", "Health / Fitness", "era_3"),
    ("evt_007", "2018-01-27T18:15:00Z", "The Two-Wheeler Delivery", "Collected Bikedelux motorcycle after clearing final payment in 3 installments.", "Milestone", "era_4"),
    ("evt_008", "2018-07-20T11:30:00Z", "Mom's Cataract Surgery", "Successful lens replacement surgery for Aai at the Eye Institute.", "Family / Health", "era_4"),
    ("evt_009", "2018-08-31T09:27:00Z", "Crossing The 70k Salary Mark", "Salary promotion to Rs. 70,255/mo along with first corporate equity dividends.", "Financial", "era_4")
]

events_list = []
for e in events_raw:
    events_list.append({
        "id": e[0],
        "type": "event",
        "dimension": "Events",
        "title": e[2],
        "date": e[1][:10],
        "time": e[1][11:19],
        "timestamp": e[1],
        "description": e[3],
        "category": e[4],
        "eraId": e[5]
    })

# 8. CURATED STORY CHAPTERS (Interactive Narrative Journeys)
stories = [
    {
        "id": "story_cataract",
        "title": "The Mother's Vision",
        "subtitle": "How tiny receipts in Powai gave Aai her eyesight back",
        "dateRange": "Jul 2017 – Aug 2018",
        "coverIcon": "eye",
        "badge": "Family & Devotion",
        "accentColor": "#ec4899",
        "summary": "Between July 2017 and August 2018, dozens of seemingly minor receipts tell the story of a son navigating his mother's cataract diagnosis: routine eye consultations, late night research, Ola cabs between Thane and Powai, post-op antibiotic drops, and finally, a pair of ₹4,300 custom glasses that let her read without squinting.",
        "narrativeQuote": "Aai looked up at the wall calendar and read the small print in the recovery room. Everything I worked for was for that moment.",
        "receiptSequence": [
            "srch_013", "plc_012", "txn_1028", "msg_011", "msg_012", "txn_0890", "srch_021", 
            "plc_020", "pht_010", "msg_018", "txn_0085", "txn_0088", "pht_011", "msg_019", "not_009"
        ],
        "connectedDimensions": ["Purchases", "Searches", "Places", "Messages", "Photos", "Music", "Personal Notes"],
        "connectionsExplained": "The journey begins with an anxious Google search ('cataract surgery types phacoemulsification vs laser cost'), follows through routine hospital checkup fees (₹400, ₹3,050), repeated Ola cabs (₹130, ₹188, ₹155), surgery medicines (₹1,358, ₹1,048), and ends with Aai's message 'Beta these new spectacles are wonderful'."
    },
    {
        "id": "story_bike",
        "title": "Two Wheels to Freedom",
        "subtitle": "Buying a motorcycle in 3 zero-debt installments",
        "dateRange": "Jan 2018 – Feb 2018",
        "coverIcon": "compass",
        "badge": "Independence Milestone",
        "accentColor": "#f59e0b",
        "summary": "After 3 years of crammed local trains and shared auto-rickshaws, January 2018 marked a decisive leap into personal freedom. Rather than taking a high-interest auto loan, the purchase was orchestrated in three planned cash payments: ₹1,000 booking, ₹50,000 second installment, and ₹43,000 final payment upon delivery.",
        "narrativeQuote": "Every vibration of that engine felt like earned freedom. Paid in full with zero debt.",
        "receiptSequence": [
            "srch_018", "txn_0177", "msg_016", "mus_031", "txn_0163", "srch_019", 
            "txn_0154", "msg_017", "plc_018", "pht_009", "not_008", "txn_0134"
        ],
        "connectedDimensions": ["Purchases", "Searches", "Music", "Messages", "Places", "Photos", "Personal Notes"],
        "connectionsExplained": "Tracks the psychological and logistical leap: from searching RTO registration requirements to paying the ₹1,000 booking fee on Jan 3, playing Arijit Singh's 'Ilahi' on loop, paying ₹50,000 on Jan 18, clearing ₹43,000 on Jan 27, and getting the first bike servicing receipt in February."
    },
    {
        "id": "story_marathon",
        "title": "The 21.1km Crucible",
        "subtitle": "From 12-hour desk fatigue to the Marine Drive finish line",
        "dateRange": "May 2017 – Nov 2017",
        "coverIcon": "activity",
        "badge": "Self-Transformation",
        "accentColor": "#10b981",
        "summary": "Sedentary office hours and computer strain triggered an athletic transformation. May 2017 began with a search for arch support shoes and a ₹2,421 purchase of Puma Troy runners. What followed was a 6-month regimen of 5 AM training runs, registration fees, Eminem's 'Lose Yourself', and an emotional half-marathon completion at Azad Maidan.",
        "narrativeQuote": "If you can't run through 4 kilometers of leg pain, how will you carry your family through life?",
        "receiptSequence": [
            "srch_012", "txn_0351", "mus_020", "srch_015", "txn_0284", "srch_017",
            "msg_013", "mus_027", "evt_006", "pht_008", "msg_014", "not_007"
        ],
        "connectedDimensions": ["Purchases", "Searches", "Music", "Messages", "Events", "Photos", "Personal Notes"],
        "connectionsExplained": "Synthesizes health queries, footwear purchases, training playlists ('Eye of the Tiger', 'Zinda'), race bib collection chat with running partner Kunal, and the triumphant finish line photo and message to mom."
    },
    {
        "id": "story_remittance",
        "title": "The ₹10,000 Sacred Promise",
        "subtitle": "44 unbroken months of sending money home to parents",
        "dateRange": "Jan 2015 – Sep 2018",
        "coverIcon": "heart",
        "badge": "Filial Devotion",
        "accentColor": "#6366f1",
        "summary": "Every single month without exception, between the 1st and 3rd day, a ₹10,000 bank transfer was dispatched to 'Permanent Residence / Home'. Regardless of whether starting salary was ₹47,859 or ₹70,255, this financial lifeline to parents took precedence over every personal indulgence.",
        "narrativeQuote": "She sacrificed her gold bangles for my engineering tuition. This remittance never stops.",
        "receiptSequence": [
            "not_001", "txn_2448", "msg_001", "msg_002", "txn_2384", "txn_2201", 
            "txn_2041", "txn_1854", "txn_1562", "txn_1204", "txn_0780", "txn_0098"
        ],
        "connectedDimensions": ["Purchases", "Messages", "Personal Notes"],
        "connectionsExplained": "A multi-year rhythm documented across 44 calendar cycles. Demonstrates the quiet integrity of the Indian working class youth anchoring their parents' household while navigating personal mobility."
    },
    {
        "id": "story_b45",
        "title": "Room B45: The Frugal Apprenticeship",
        "subtitle": "Shared flats, ₹10 auto rides, and Splitwise brotherhood",
        "dateRange": "Jan 2015 – mid 2016",
        "coverIcon": "home",
        "badge": "Early Career Life",
        "accentColor": "#8b5cf6",
        "summary": "Life as a junior software apprentice in Vadodara: living in room B45 on Old Padra Road with two flatmates. Tracking splits for ₹333 maid fees, ₹1,667 cook wages, ₹20 water jar refills, ₹6 tapri chai, and late night bread-omelette sessions while dreaming of bigger skies.",
        "narrativeQuote": "We had very little furniture and one shared water heater, but every evening on that balcony was full of ambition.",
        "receiptSequence": [
            "plc_002", "txn_2444", "txn_2445", "txn_2446", "msg_003", "pht_002", 
            "mus_002", "txn_2380", "srch_001", "txn_2290", "not_002"
        ],
        "connectedDimensions": ["Places", "Purchases", "Messages", "Photos", "Music", "Searches", "Personal Notes"],
        "connectionsExplained": "Connects roommate split settlements, ₹10 commute rides to office, shared meals, and the gritty, unpolished joy of early independence."
    },
    {
        "id": "story_upskill",
        "title": "The 2 AM Up-skilling Loop",
        "subtitle": "EdTech EMIs, coffee, and the leap from 47k to 70k salary",
        "dateRange": "Dec 2016 – Aug 2018",
        "coverIcon": "trending-up",
        "badge": "Career Breakthrough",
        "accentColor": "#0ea5e9",
        "summary": "A calculated gamble on professional reinvention: paying ₹2,700 monthly EMIs for an intensive EdTech engineering course, upgrading a lagging laptop with SSD and RAM, listening to deep focus lo-fi and ambient electronic playlists past 2 AM, and converting the knowledge into appraisal hikes and stock investments.",
        "narrativeQuote": "Frugality is an engineering mindset. We upgraded the machine, then upgraded our skills.",
        "receiptSequence": [
            "srch_009", "txn_1568", "txn_1482", "mus_017", "srch_014", "txn_1029", 
            "pht_007", "not_006", "txn_0720", "msg_009", "evt_009", "pht_012", "not_010"
        ],
        "connectedDimensions": ["Purchases", "Searches", "Music", "Photos", "Personal Notes", "Messages", "Events"],
        "connectionsExplained": "Demonstrates the direct pipeline from continuous educational investment to hard financial outcomes: 47k starting salary -> 56k in early 2017 -> 64k in early 2018 -> 70,255 promotion in August 2018."
    },
    {
        "id": "story_mumbai",
        "title": "The Mumbai Local Pilgrimage",
        "subtitle": "Thane, Dadar, Marine Drive and the pulse of Central Railway",
        "dateRange": "Feb 2017 – Sep 2018",
        "coverIcon": "map-pin",
        "badge": "Urban Metamorphosis",
        "accentColor": "#e11d48",
        "summary": "Moving to the Mumbai metropolis: mastering the unwritten rules of Central Railway rush-hour fast locals, ₹15 auto fares from Current Residence to station Place 0, seeking spiritual anchor at Siddhivinayak Temple in Dadar, and finding quiet refuge at Marine Drive.",
        "narrativeQuote": "Mumbai local trains are terrifying at first, but once you catch the rhythm, you realize the whole city beats with one giant heart.",
        "receiptSequence": [
            "srch_010", "plc_008", "plc_009", "mus_018", "pht_005", "not_005", 
            "plc_010", "txn_1350", "txn_1351", "txn_1352", "mus_019", "pht_006"
        ],
        "connectedDimensions": ["Places", "Searches", "Music", "Photos", "Personal Notes", "Purchases"],
        "connectionsExplained": "Traces the sensory overload of arriving in Mumbai: train ticket stubs, street food at Dadar, sea breeze reflections, and making a foreign mega-city into home."
    },
    {
        "id": "story_homecoming",
        "title": "The Festival Homecoming",
        "subtitle": "Diwali crackers, the Metz TV, and Sevagram Express 3AC",
        "dateRange": "Oct 2016 – Nov 2017",
        "coverIcon": "gift",
        "badge": "Family Festivities",
        "accentColor": "#d97706",
        "summary": "The sacred ritual of the Indian festival homecoming. Booking 3-tier AC berths on Sevagram Express weeks in advance, buying sweet boxes, Aakash Kandil lamps, firecrackers, buying sister an undated planner and Mi Band, and that monumental Diwali when a 32-inch Metz TV arrived at parents' doorstep.",
        "narrativeQuote": "The joy of festivals isn't what you receive, but having enough to bring smiles to the people who raised you.",
        "receiptSequence": [
            "srch_006", "txn_1692", "txn_1688", "txn_1687", "msg_006", "msg_007", 
            "pht_004", "not_004", "srch_016", "txn_0640", "txn_0641", "mus_026"
        ],
        "connectedDimensions": ["Purchases", "Searches", "Messages", "Photos", "Personal Notes", "Music"],
        "connectionsExplained": "Connects travel reservations, festive spending, family gifts, and the warm emotional core of returning home after months of solitary corporate grind."
    }
]

# 9. PATTERNS & CORRELATIONS
patterns = [
    {
        "id": "pat_chai_code",
        "title": "The 'Chai & Code' Midnight Correlation",
        "category": "Behavioral",
        "icon": "coffee",
        "metric": "+320% frequency",
        "correlation": "0.89 r-score",
        "description": "On nights preceding EdTech course assignment submissions or major project milestones, tapri tea expenses (Rs. 10-20) and midnight Spotify ambient lo-fi streams occurred together between 11 PM and 3 AM with 89% correlation.",
        "keyReceipts": ["txn_1568", "mus_017", "srch_009", "txn_1482"]
    },
    {
        "id": "pat_sacred_first",
        "title": "The '1st of the Month' Remittance Rule",
        "category": "Financial Discipline",
        "icon": "shield-check",
        "metric": "100% adherence (44/44 months)",
        "correlation": "Perfect regularity",
        "description": "In 44 consecutive calendar months between Jan 2015 and Aug 2018, Rs. 10,000 was transferred home to parents within 48 hours of salary credit, regardless of bank balance, emergencies, or personal desires.",
        "keyReceipts": ["txn_2448", "txn_2384", "txn_2041", "txn_0098"]
    },
    {
        "id": "pat_anxiety_action",
        "title": "The Anxiety-to-Action Health Loop",
        "category": "Psychological",
        "icon": "activity",
        "metric": "48-hour lag time",
        "correlation": "0.94 predictive score",
        "description": "Late-night medical Google searches (symptoms, medication side effects, surgical techniques) consistently preceded hospital visits and medicine purchases by exactly 24 to 48 hours.",
        "keyReceipts": ["srch_002", "txn_2420", "srch_013", "txn_1028", "txn_0085"]
    },
    {
        "id": "pat_commute_soundtrack",
        "title": "The Soundscape of Central Railway",
        "category": "Sensory",
        "icon": "headphones",
        "metric": "82% non-shuffle listening",
        "correlation": "Direct transit pairing",
        "description": "Mumbai local train ticket timestamps (Thane Place 0 to Dadar / Santacruz) co-occurred with continuous album listening on Spotify without skips ('Dil Chahta Hai', 'Rockstar', 'Life in a Metro').",
        "keyReceipts": ["txn_1350", "mus_018", "txn_0890", "mus_024"]
    }
]

# 10. YEARLY WRAPPED (Spotify Wrapped style life review)
wrapped = {
    "2015": {
        "year": 2015,
        "title": "The Baroda Foundation",
        "theme": "Frugality, Apprenticeship & Root Canals",
        "totalSpent": 284500,
        "totalEarned": 594000,
        "cupsOfChai": 64,
        "topTrack": "Kun Faya Kun — A.R. Rahman",
        "topArtist": "Coldplay",
        "keyMilestone": "First full year living independently; Rs. 1.2 Lakh sent home to Aai.",
        "topExpense": "Public Provident Fund & Family Transfers",
        "quote": "Counting every 10-rupee auto ride, but never cutting corners on the promise home."
    },
    "2016": {
        "year": 2016,
        "title": "The Anchor of Family",
        "theme": "Diwali Upgrades, TV Surprises & First Steps Out",
        "totalSpent": 348200,
        "totalEarned": 682000,
        "cupsOfChai": 58,
        "topTrack": "Luka Chuppi — Lata Mangeshkar",
        "topArtist": "A.R. Rahman",
        "keyMilestone": "Buying the Metz 32-inch LED TV for parents; Pavagadh pilgrimage with family.",
        "topExpense": "Metz 32-inch TV (Rs. 20,500) & LIC Insurance",
        "quote": "Realizing that wealth is measured in how many smiles you can bring to your mother's face."
    },
    "2017": {
        "year": 2017,
        "title": "The Mumbai Crucible",
        "theme": "Local Trains, SSD Resurrections & The 21km Medal",
        "totalSpent": 642000,
        "totalEarned": 810000,
        "cupsOfChai": 72,
        "topTrack": "Lose Yourself — Eminem",
        "topArtist": "Hans Zimmer",
        "keyMilestone": "Relocating to Mumbai; conquering the 21.1 km Half Marathon; laptop SSD rebuild.",
        "topExpense": "Stock Market investments & Laptop upgrades",
        "quote": "Standing at Marine Drive with a 12-rupee chai, knowing Mumbai had become home."
    },
    "2018": {
        "year": 2018,
        "title": "Freedom, Dividends & Devotion",
        "theme": "The Red Two-Wheeler & Restoring Aai's Sight",
        "totalSpent": 678900,
        "totalEarned": 956000,
        "cupsOfChai": 52,
        "topTrack": "Ilahi — Arijit Singh",
        "topArtist": "Mohit Chauhan",
        "keyMilestone": "Full cash purchase of Bikedelux; Mom's successful cataract surgery; 70k salary.",
        "topExpense": "Two Wheeler Bikedelux (Rs. 94,000 total) & Cataract Care",
        "quote": "Two wheels to ride across the coastline, and a mother who can see clearly again."
    }
}

# 11. GLOBAL SUMMARY STATS
total_expense = sum(t["amount"] for t in txns if t["transactionType"] == "Expense")
total_income = sum(t["amount"] for t in txns if t["transactionType"] == "Income")
total_transfers = sum(t["amount"] for t in txns if t["transactionType"] == "Transfer-Out")
chai_txns = [t for t in txns if "chai" in t["note"].lower() or "tea" in t["note"].lower()]
total_chai_count = len(chai_txns)
total_rail_km = 6840 # Estimated based on BRC-Mumbai, Sevagram Exp, Local passes

eras = [
    {
        "id": "era_1",
        "title": "The Frugal Apprentice",
        "period": "2015 – Mid 2016",
        "location": "Vadodara (Baroda)",
        "badge": "Independence & Frugality",
        "description": "Shared flat B45 with roommates, splitting Rs. 333 maid bills, Rs. 10 auto rides, 10k monthly remittance home, Audible & Kindle night study.",
        "themeColor": "#3b82f6"
    },
    {
        "id": "era_2",
        "title": "The Transition & Family Anchor",
        "period": "Mid 2016 – Mid 2017",
        "location": "Vadodara to Mumbai Corridor",
        "badge": "Responsibility & Growth",
        "description": "Purchasing the Metz TV for family, Pavagadh pilgrimage, EdTech course enrollment, planning the leap from Gujarat to Maharashtra.",
        "themeColor": "#8b5cf6"
    },
    {
        "id": "era_3",
        "title": "The Mumbai Crucible & Marathon",
        "period": "Mid 2017 – Early 2018",
        "location": "Mumbai (Thane, Dadar, Marine Drive)",
        "badge": "Endurance & Ambition",
        "description": "Central Railway local fast trains, upgrading laptop with SSD, running the 21.1 km Half Marathon, early ophthalmology checkups for Aai.",
        "themeColor": "#10b981"
    },
    {
        "id": "era_4",
        "title": "Freedom, Dividends & Devotion",
        "period": "2018",
        "location": "Mumbai",
        "badge": "Milestones & Care",
        "description": "Buying the red motorcycle in 3 cash installments, Aai's successful cataract surgery, salary hitting Rs. 70,255, first stock market dividends.",
        "themeColor": "#f59e0b"
    }
]

full_data = {
    "summary": {
        "totalDays": 1380,
        "startDate": "2015-01-01",
        "endDate": "2018-09-20",
        "totalTransactions": len(txns),
        "totalExpense": total_expense,
        "totalIncome": total_income,
        "totalTransfers": total_transfers,
        "totalChaiReceipts": total_chai_count,
        "estimatedRailKm": total_rail_km,
        "totalMusicStreams": len(music_list),
        "totalPlaces": len(places_list),
        "totalPhotos": len(photos_list),
        "totalMessages": len(messages_list),
        "totalSearches": len(searches_list),
        "totalNotes": len(notes_list),
        "totalEvents": len(events_list),
        "totalStories": len(stories),
        "totalPatterns": len(patterns)
    },
    "eras": eras,
    "transactions": txns,
    "music": music_list,
    "places": places_list,
    "photos": photos_list,
    "messages": messages_list,
    "searches": searches_list,
    "notes": notes_list,
    "events": events_list,
    "stories": stories,
    "patterns": patterns,
    "wrapped": wrapped
}

# Write to JSON
out_json_path = "/Users/yashuraghuvanshi/.gemini/antigravity/scratch/your-life-in-receipts/data/full_dataset.json"
with open(out_json_path, "w", encoding="utf-8") as f:
    json.dump(full_data, f, indent=2)
print(f"Wrote {out_json_path} successfully ({len(json.dumps(full_data))} bytes)!")

# Write to JS data file
out_js_path = "/Users/yashuraghuvanshi/.gemini/antigravity/scratch/your-life-in-receipts/js/data.js"
with open(out_js_path, "w", encoding="utf-8") as f:
    f.write("/* Auto-generated Life Receipts Multidimensional Archive */\n")
    f.write("window.LIFE_DATA = ")
    json.dump(full_data, f, separators=(',', ':'))
    f.write(";\nconsole.log('Life Receipts dataset loaded:', window.LIFE_DATA.summary);\n")
print(f"Wrote {out_js_path} successfully!")
