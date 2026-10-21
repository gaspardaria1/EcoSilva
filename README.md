# EcoSilva ForestGuard

AI-powered forestry monitoring: a real-time dashboard over GPS-chipped trees, rule-based illegal-logging detection, and **Silviq**, a natural-language assistant that answers questions about the forest from live data.

Built as a hackathon project by team **Runtimeterror**.

**Live demo:** [ecosilva-forestguard.web.app](https://ecosilva-forestguard.web.app)

---

## What it does

Every monitored tree carries a GPS chip that reports its position and status. EcoSilva turns that stream into something a forest ranger can actually act on:

- **Monitoring dashboard** — tree counts, detected illegal cuts and alert zones at a glance, with an interactive map of forest management units and per-zone drill-down.
- **Illegal-logging detection** — a rule-based engine flags suspicious patterns instead of raw events (see [Detection rules](#detection-rules)).
- **Silviq, the AI assistant** — ask questions in plain language ("how many trees were cut in Gurghiu this year?", "where is the suspicious activity?") and get answers, charts and maps generated from live database data.
- **Reports** — generate an illegal-logging report per zone and period through the API.
- **Authentication** — email/password accounts backed by Supabase Auth, with chat history persisted per user.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS, Framer Motion |
| Backend | FastAPI (Python 3.11+), Uvicorn |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini 2.5 Flash (`google-genai`); LangChain tool-calling agent (experimental) |
| Auth | Supabase Auth |
| CMS (marketing pages) | Sanity |
| Frontend hosting | Firebase Hosting (static export) |
| Backend hosting | Render |

## Architecture

```
Browser
  │
  ├─ Next.js app (static export on Firebase Hosting)
  │    ├─ /login            Supabase Auth
  │    ├─ /dashboard        map + stats + alerts
  │    └─ /chat             Silviq assistant
  │
  └─ FastAPI backend (Render)
       ├─ /trees, /zones    inventory + GeoJSON for the map
       ├─ /analytics        summary, trends, anomalies, reports
       ├─ /chat/message     Gemini 2.5 Flash over aggregated forest data
       └─ Supabase (PostgreSQL)
```

The chat endpoint aggregates trees, zones and anomalies from Supabase, pre-computes chart series (species mix, age distribution, legal vs. illegal cuts), and passes them to Gemini as grounded context — so answers cite real numbers rather than being invented. Aggregates are cached in memory for 5 minutes to keep responses fast and API usage low.

## Repository structure

```
Ecosilva-Runtimeterror/
├── frontend/              # Next.js app
│   └── src/
│       ├── app/           # routes: landing, login, dashboard, chat, blog
│       ├── components/    # map, chat panel, UI primitives
│       └── lib/           # Supabase client, mock data
└── BackEnd/               # FastAPI service
    ├── app/
    │   ├── api/routes/    # auth, trees, analytics, chat
    │   ├── ai/            # Gemini prompts, LangChain agent + tools
    │   ├── db/            # Supabase queries, models, SQL heuristics
    │   └── core/          # security, exception handlers
    └── seed/              # seed script: 5 zones, 1000 trees
```

## Getting started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- A [Supabase](https://supabase.com) project and a Gemini API key from [Google AI Studio](https://aistudio.google.com)

### 1. Clone

```bash
git clone https://github.com/gaspardaria1/EcoSilva.git
cd EcoSilva/Ecosilva-Runtimeterror
```

### 2. Backend

```bash
cd BackEnd
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `BackEnd/.env`:

```env
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
GEMINI_API_KEY=<gemini-api-key>
SECRET_KEY=<random string, min 32 chars>
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000"]
```

Run it:

```bash
uvicorn app.main:app --reload --port 8000
```

API at `http://localhost:8000`, interactive docs at `http://localhost:8000/docs`, connection check at `http://localhost:8000/supabase-health`.

Optionally populate the database with demo data (5 zones, 1000 trees, ~20% cut, a share of them premature):

```bash
python -m seed.seed_data
```

### 3. Frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run it:

```bash
npm run dev
```

App at `http://localhost:3000`.

### 4. Run both

```bash
# Terminal 1 — backend
cd BackEnd && source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend && npm run dev
```

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health`, `/supabase-health` | Service and database checks |
| GET | `/auth/me` | Current user profile |
| GET | `/trees` | Tree inventory, filterable by zone and status |
| GET | `/trees/geojson` | Tree positions as GeoJSON for the map |
| GET | `/zones` | Forest management units |
| GET | `/zones/{zone_id}/summary` | Per-zone aggregates |
| GET | `/analytics/summary` | Dashboard totals (trees, cuts, open anomalies) |
| GET | `/analytics/trends` | Cuts and anomalies over time |
| GET | `/analytics/anomalies` | Detected anomalies, filterable by zone and period |
| GET | `/analytics/reports/illegal-logging` | Illegal-logging report data |
| POST | `/analytics/generate-report` | Generate a narrative report for a zone and period |
| POST | `/chat/message` | Ask Silviq a question; returns an answer plus chart data |

## Detection rules

Anomalies are derived from the chip data with explicit, auditable heuristics — chosen over a black-box model so every alert can be explained to a ranger:

| Rule | Signal | Severity |
|---|---|---|
| `premature_cut` | Tree cut before the 5-year minimum harvest age | High |
| `cluster_cut` | 5+ trees cut within a 500 m radius in a 7-day window | High |
| `night_activity` | Cut events logged between 22:00 and 05:00 local time | Medium |
| `signal_loss` | An active chip stops reporting for more than 48 hours | Medium |
| `zone_mismatch` | Tree coordinates fall outside the registered zone boundary | Medium |

## AI assistant (Silviq)

Silviq runs on Gemini 2.5 Flash with the forest's aggregated state injected as grounded context, and returns both prose and structured chart data the frontend renders.

The repository also contains a LangChain tool-calling agent (`BackEnd/app/ai/agent.py`) with five custom tools — database queries, chart generation, map generation, anomaly detection and prompt coaching — plus a skill-level-aware system prompt. It is **experimental and not yet wired into the API routes**; the shipped chat path is the direct Gemini integration described above.

## Deployment

**Frontend — Firebase Hosting:**

```bash
cd frontend
npm run build          # static export into /out
firebase deploy --only hosting
```

**Backend — Render:** pushing to `main` triggers a redeploy from `BackEnd/render.yaml`. A `Dockerfile`, `Procfile` and `railway.json` are included for alternative hosts.

## Project status

A hackathon build, so some parts are intentionally scoped down:

- The dashboard and map currently render demo data from `frontend/src/lib/mock-data.js` (six management units in the Gurghiu area); the live `/analytics` and `/trees` endpoints exist and are wired for it, but the UI has not been switched over yet.
- The chat path is fully live against Supabase.
- The LangChain agent is in the repo but not yet enabled (see above).
- Part of the UI copy is in Romanian.

## Credits

Frontend built on the Radiant template from Tailwind Plus (see `frontend/LICENSE.md` — the template is covered by the Tailwind Plus license, not by this repository's terms).

Team: Runtimeterror.
