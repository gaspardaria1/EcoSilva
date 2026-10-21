# EcoSilva ForestGuard

Platformă de monitorizare silvică cu AI — dashboard în timp real, detectare tăieri ilegale prin cipuri GPS și chat AI (Silviq) alimentat de Gemini 2.5 Flash și date reale din Supabase.

Live: [ecosilva-forestguard.web.app](https://ecosilva-forestguard.web.app)
Stack

| Layer | Tehnologie |
|---|---|
| Frontend | Next.js 15, React, Tailwind CSS |
| Backend | FastAPI (Python), Uvicorn |
| Bază de date | Supabase (PostgreSQL) |
| AI | Google Gemini 2.5 Flash |
| Auth | Supabase Auth |
| Deploy frontend | Firebase Hosting (static export) |
| Deploy backend | Render |


Structură proiect

```
ecosilva/
├── frontend/     # Next.js app
└── BackEnd/      # FastAPI server
```

 Prerequisite

- Node.js 18+ și npm
- Python 3.11+
- Conturi active: [Supabase](https://supabase.com), [Google AI Studio](https://aistudio.google.com) (pentru Gemini API key)


1. Clonează repo-ul

```bash
git clone https://github.com/<username>/ecosilva.git
cd ecosilva
```
 2. Backend (FastAPI)

 Instalare

```bash
cd BackEnd
python -m venv venv

# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```
Variabile de environment

Creează fișierul `BackEnd/.env`:

```env
# Supabase
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_ANON_KEY=<anon-key>

# Gemini
GEMINI_API_KEY=<gemini-api-key>

# App
SECRET_KEY=<string-random-min-32-caractere>
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000"]
```
 Pornire

```bash
uvicorn app.main:app --reload --port 8000
```

Backend disponibil la: `http://localhost:8000`
Documentație API: `http://localhost:8000/docs`

---

 3. Frontend (Next.js)

 Instalare

```bash
cd frontend
npm install
```

 Variabile de environment

Creează fișierul `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_API_URL=http://localhost:8000
```

 Pornire

```bash
npm run dev
```

Frontend disponibil la: `http://localhost:3000`

---

 4. Rulare simultană (recomandat)

Deschide două terminale:

```bash
# Terminal 1 — Backend
cd BackEnd && source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

 5. Build și deploy

 Frontend (Firebase Hosting)

```bash
cd frontend
npm run build       # generează folderul /out
firebase deploy --only hosting
```

 Backend (Render)

Push pe `main` — Render detectează automat `BackEnd/render.yaml` și redeploy-ează.

---

 Cont demo

| Câmp | Valoare |
|---|---|
| Email | demo.ecosilva@gmail.com |
| Parolă | EcoSilva2024! |
