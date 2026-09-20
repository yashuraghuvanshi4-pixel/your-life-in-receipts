# Your Life, In Receipts — The Archaeology of Tiny Moments

> *"Your digital life is made up of hundreds of tiny moments. A song you played at 2 AM. A place you visited. A photo you took. Something you bought. A movie you watched. A message you saved. A search you made. A random note you wrote. Individually, these moments may not mean much. But when you put them together, they tell a story."*

---

## 🌟 Overview & Philosophy

**"Your Life, In Receipts"** is an interactive, frontend-only digital experience that transforms 1,380 days (Jan 2015 – Sep 2018) of digital life fragments into a deeply human, emotional, and analytical narrative.

Rather than presenting a flat, chronological timeline ("January → February → March"), this platform models **The Receipt as a doorway to memory**. A receipt isn't just thermal paper with an amount; it is the physical footprint of an emotional milestone, a sacrifice, a transition, or a breakthrough.

```
Raw Data → Insights → Connections → Story
```

---

## 🏛️ The 9 Digital Dimensions

The archive brings together 9 interconnected facets of life:

| Dimension | Icon | Description | Sample Record |
|---|:---:|---|---|
| **Purchases** | 💳 | Real transaction ledgers (modes, amounts, categories) | *₹4,300 eyewear glasses for Aai, ₹50,000 bike installment* |
| **Music** | 🎵 | Spotify listening logs conforming to exact stream schema | *Arijit Singh - "Ilahi" (on bike delivery day), Eminem - "Lose Yourself" (marathon)* |
| **Places** | 📍 | Location check-ins & transit coordinates | *Room B45 (Baroda), Powai Eye Institute, Marine Drive, Dadar Siddhivinayak* |
| **Photos** | 📷 | Polaroid visual memory artifacts with captions | *Aai smiling with new glasses, Red Bikedelux key handover, Finisher medal* |
| **Messages** | 💬 | WhatsApp, SMS & iMessage dialogues | *"Aai: I can see the clock on the wall without any blur!"* |
| **Searches** | 🔎 | Private late-night Google inquiries revealing inner psychology | *"difference between mono vs multifocal cataract lens", "running arch support"* |
| **Personal Notes** | 📝 | Apple Notes & diary entries capturing unsaid feelings | *"Jan 1, 2015: Sending 10k home to Aai first. That is non-negotiable."* |
| **Events** | 🚩 | High-impact life milestones | *The Independence Leap, The Mumbai Relocation, The Cataract Surgery* |
| **Entertainment** | 🎬 | BookMyShow, INOX, Netflix, Hotstar streaming logs | *Batman tickets, Cinepolis 4DX 3D, Netflix weekend binge* |

---

## 🧭 The 5 Core Experience Modes

### 1. 📖 Story Chapters (Curated Interactive Narratives)
Explore 8 deeply researched narrative journeys where receipts across multiple dimensions link together into an unforgettable arc:
1. **The Mother's Vision**: A 13-month medical journey from initial blurriness, hospital cabs, and surgery drops to the ₹4,300 glasses that gave Aai her eyesight back.
2. **Two Wheels to Freedom**: The purchase of a brand new motorcycle orchestrated in 3 cash installments (₹1,000 + ₹50,000 + ₹43,000) with zero debt.
3. **The 21.1km Crucible**: The transformation from desk fatigue to finishing the Mumbai Half Marathon in 2:06:40.
4. **The ₹10,000 Sacred Promise**: 44 unbroken months of sending money home to parents on the 1st of every month without fail.
5. **Room B45: The Frugal Apprenticeship**: Shared flats in Baroda, ₹333 maid splits, and ₹6 tapri chai.
6. **The 2 AM Up-skilling Loop**: EdTech course EMIs, midnight focus beats, SSD laptop rebuild, and the leap to ₹70,255 salary.
7. **The Mumbai Local Pilgrimage**: Central Railway fast trains, Dadar street food, and Marine Drive evening reflections.
8. **The Festival Homecoming**: Buying parents a 32-inch Metz TV for Diwali, firecrackers, and Sevagram Express 3AC journeys.

### 2. 🌌 Synapse Constellation (Interactive Graph Visualizer)
- An interactive HTML5 Canvas network graph mapping receipts across time.
- Dynamic edges connect receipts that occurred within a **48-hour temporal window**.
- Drag to pan, scroll to zoom, hover to illuminate local webs, and click to inspect any receipt dossier.

### 3. 🧾 Thermal Scrapbook (Receipt Explorer & Deep Search)
- Authentic thermal paper receipt rendering with serrated edges, barcodes, monospace typography, and vintage verification stamps.
- **3D Card Flip**: Click "Flip ↷" to turn over any receipt and reveal what else was happening in the user's life during that 48-hour window.
- Instant search by keyword (e.g. *"Aai"*, *"Chai"*, *"Marathon"*, *"B45"*, *"Infosys"*, *"Sevagram"*) and multi-dimensional filter pills.

### 4. 🔍 Narrative Detective (Combinator & Hypothesis Tester)
- **Pre-Discovered Patterns**:
  - *The "Chai & Code" Correlation*: +320% frequency of tapri tea and ambient lo-fi streams on late-night study sessions.
  - *The Sacred 1st Rule*: 100% regularity of ₹10,000 remittances home across 44 months.
  - *The Anxiety-to-Action Health Loop*: 48-hour predictive lag between late-night symptom searches and doctor consultations.
  - *The Soundscape of Central Railway*: Local train travel paired with non-shuffle album listening.
- **Interactive Workbench**: Select any 2 receipts from different dimensions to calculate their temporal distance and synthesize their emergent narrative connection.

### 5. 🎁 Annual Life Wrapped (Year-in-Review)
- Spotify Wrapped-style annual retrospective covering 2015, 2016, 2017, and 2018.
- Highlights top anthem, cups of tapri chai, biggest expense, and life milestones.

---

## 🚀 How to Run Locally

Because this is a zero-dependency frontend experience, you can open `index.html` directly in any modern browser, or serve it using Python:

```bash
# Navigate to the project directory
cd /Users/yashuraghuvanshi/.gemini/antigravity/scratch/your-life-in-receipts

# Start a local web server on port 3000
python3 -m http.server 3000
```

Then open **`http://localhost:3000`** in your browser!

---

## 🎨 Built With
- **Vanilla JavaScript (ES6+)** with reactive state architecture
- **HTML5 Canvas** for the Synapse Constellation graph
- **Web Audio API** for tactile thermal paper rustle and chime sounds
- **Tailwind CSS** for modern responsive utility design
- **Google Fonts**: Space Mono, Outfit, Instrument Serif
