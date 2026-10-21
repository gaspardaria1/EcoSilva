import { BentoCard } from '@/components/bento-card'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient } from '@/components/gradient'
import { Link } from '@/components/link'
import { LinkedAvatars } from '@/components/linked-avatars'
import { LogoCloud } from '@/components/logo-cloud'
import { LogoTimeline } from '@/components/logo-timeline'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

export const metadata = {
  description:
    'EcoSilva — platformă AI pentru monitorizarea pădurilor, detectarea tăierilor ilegale și rapoarte automate pentru ingineri silvici.',
}

// ── Grafic chip GPS ──────────────────────────────────────────────────────────
function ChipGraphic() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="relative">
        {/* Chip central */}
        <div className="relative z-10 rounded-2xl border-2 border-emerald-200 bg-white p-4 shadow-lg">
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-sm ${
                  [0, 2, 4, 6, 8].includes(i)
                    ? 'bg-emerald-600'
                    : 'bg-emerald-200'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 space-y-1">
            <div className="h-1 w-full rounded bg-emerald-100" />
            <div className="h-1 w-3/4 rounded bg-emerald-200" />
          </div>
        </div>
        {/* Data cards floating */}
        <div className="absolute -top-6 -right-20 rounded-lg bg-emerald-950 px-3 py-2 text-xs text-emerald-300 shadow-lg">
          <p className="font-mono font-bold text-white">CHIP-2024-004821</p>
          <p>46.8923° N · 24.9871° E</p>
          <p>Molid · 48 ani · 380m alt.</p>
        </div>
        <div className="absolute -bottom-4 -left-16 rounded-lg bg-emerald-800 px-3 py-2 text-xs text-emerald-200 shadow-lg">
          <p className="text-white font-medium">Status: Standing ✓</p>
          <p>Plantat: 12 apr 1977</p>
        </div>
      </div>
    </div>
  )
}

// ── Grafic hartă satelit / GFW ───────────────────────────────────────────────
function SatelliteGraphic() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 400 240" className="h-full w-full">
        <defs>
          <radialGradient id="satGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="60%" stopColor="#052e16" />
            <stop offset="100%" stopColor="#021007" />
          </radialGradient>
        </defs>
        <rect width="400" height="240" fill="url(#satGrad)" />
        {/* Forest patches */}
        {[
          [30, 20, 80, 60], [120, 10, 90, 55], [220, 25, 70, 50],
          [10, 90, 100, 65], [130, 80, 85, 70], [230, 75, 95, 80],
          [320, 20, 70, 90], [350, 110, 45, 60],
        ].map(([x, y, w, h], i) => (
          <rect
            key={i} x={x} y={y} width={w} height={h} rx="4"
            fill="#166534" fillOpacity={0.6 + Math.random() * 0.3}
          />
        ))}
        {/* Deforestation patch (alert zone) */}
        <rect x="155" y="95" width="65" height="45" rx="3" fill="#92400e" fillOpacity="0.7" />
        <rect x="160" y="100" width="55" height="35" rx="2" fill="#b45309" fillOpacity="0.5" />
        <text x="187" y="122" textAnchor="middle" fill="#fcd34d" fontSize="8" fontWeight="bold">!</text>

        {/* Grid overlay */}
        {[50, 100, 150, 200, 250, 300, 350].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="240" stroke="#ffffff" strokeWidth="0.3" opacity="0.1" />
        ))}
        {[40, 80, 120, 160, 200].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#ffffff" strokeWidth="0.3" opacity="0.1" />
        ))}

        {/* Coordinate labels */}
        <text x="8" y="12" fill="#4ade80" fontSize="7" opacity="0.8">46.89° N</text>
        <text x="8" y="235" fill="#4ade80" fontSize="7" opacity="0.8">46.85° N</text>
        <text x="330" y="12" fill="#4ade80" fontSize="7" opacity="0.8">24.99° E</text>
      </svg>
      {/* GFW badge */}
      <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-green-400">
        Global Forest Watch
      </div>
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded bg-red-900/80 px-2 py-1 text-xs text-red-300">
        <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
        Defrișare detectată
      </div>
    </div>
  )
}

// ── Grafic raport generat ────────────────────────────────────────────────────
function ReportGraphic() {
  const bars = [18, 34, 12, 41, 28, 58, 22]
  const months = ['Oct', 'Nov', 'Dec', 'Ian', 'Feb', 'Mar', 'Apr']
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 pt-8 pb-4">
      <p className="mb-4 text-xs font-semibold text-gray-400 self-start">
        Tăieri ilegale — UP-IV (oct 2024 – apr 2025)
      </p>
      <div className="flex w-full items-end gap-2" style={{ height: 80 }}>
        {bars.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full rounded-t transition-all ${i === 5 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ height: `${(v / 60) * 80}px` }}
            />
            <span className="text-[9px] text-gray-500">{months[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 w-full rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
        ⚠ Vârf martie 2025: +108% față de medie
      </div>
    </div>
  )
}

// ── Grafic prompt coaching ───────────────────────────────────────────────────
function CoachingGraphic() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-6 py-8">
      {/* L0 prompt */}
      <div className="rounded-xl bg-gray-100 px-4 py-2.5">
        <p className="text-xs text-gray-400 mb-1">Inginer — ziua 1</p>
        <p className="text-sm text-gray-700 font-medium">"vreau copaci taiati"</p>
        <div className="mt-1 flex gap-1">
          {[1,0,0,0,0].map((v,i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${v ? 'bg-emerald-400' : 'bg-gray-200'}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1">1/5</span>
        </div>
      </div>
      {/* L1 prompt */}
      <div className="rounded-xl bg-emerald-50 px-4 py-2.5 ring-1 ring-emerald-200">
        <p className="text-xs text-emerald-600 mb-1">Același inginer — luna 3</p>
        <p className="text-sm text-emerald-900 font-medium">"Raport tăieri ilegale UP-IV parcela 23, oct–dec 2024, format tabel"</p>
        <div className="mt-1 flex gap-1">
          {[1,1,1,1,1].map((v,i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-emerald-500" />
          ))}
          <span className="text-xs text-emerald-600 ml-1">5/5 ⭐</span>
        </div>
      </div>
    </div>
  )
}

// ── Grafic inventar arbori ───────────────────────────────────────────────────
function InventoryGraphic() {
  const species = [
    { name: 'Molid', pct: 42, color: '#065f46' },
    { name: 'Brad',  pct: 28, color: '#047857' },
    { name: 'Fag',   pct: 18, color: '#059669' },
    { name: 'Pin',   pct: 8,  color: '#10b981' },
    { name: 'Alte',  pct: 4,  color: '#34d399' },
  ]
  let cumulative = 0
  const r = 28, cx = 50, cy = 50

  return (
    <div className="flex h-full items-center justify-center gap-6 px-4 py-6">
      <svg viewBox="0 0 100 100" className="h-32 w-32 shrink-0">
        {species.map((s, i) => {
          const start = (cumulative / 100) * 2 * Math.PI - Math.PI / 2
          cumulative += s.pct
          const end = (cumulative / 100) * 2 * Math.PI - Math.PI / 2
          const x1 = cx + r * Math.cos(start)
          const y1 = cy + r * Math.sin(start)
          const x2 = cx + r * Math.cos(end)
          const y2 = cy + r * Math.sin(end)
          const large = s.pct > 50 ? 1 : 0
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={s.color}
              stroke="white"
              strokeWidth="1"
            />
          )
        })}
        <circle cx={cx} cy={cy} r="16" fill="white" />
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#065f46">61.8k</text>
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="4.5" fill="#6b7280">arbori</text>
      </svg>
      <div className="space-y-1.5">
        {species.map((s) => (
          <div key={s.name} className="flex items-center gap-2 text-xs">
            <span className="size-2 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-gray-700 w-10">{s.name}</span>
            <span className="font-semibold text-gray-950">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <Navbar
          
        />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <h1 className="font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
            Tăierile ilegale se văd. Acum și tu le vezi.
          </h1>
          <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
            Platformă AI pentru ingineri silvici — cipuri GPS în arbori,
            detectare automată a tăierilor ilegale și rapoarte generate prin
            interacțiune simplă cu Silviq, asistentul AI pentru ingineri silvici.
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <Button href="/login">Accesează platforma</Button>
            <Button variant="secondary" href="/pricing">
              Vezi planurile
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

function BentoSection() {
  return (
    <Container>
      <Subheading>Cum funcționează</Subheading>
      <Heading as="h3" className="mt-2 max-w-3xl">
        De la cip în arbore la raport oficial — automat.
      </Heading>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        <BentoCard
          eyebrow="Cipuri GPS"
          title="Fiecare arbore are un ID unic"
          description="Cipurile instalate la plantare transmit locația geo-spațială, vârsta, data plantării și semnalează automat momentul tăierii — legal sau ilegal."
          graphic={<ChipGraphic />}
          fade={['bottom']}
          className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl"
        />
        <BentoCard
          eyebrow="Global Forest Watch"
          title="Date satelitare integrate"
          description="Platforma corelează datele din cipuri cu imaginile satelitare GFW pentru a confirma și contextualiza orice tăiere detectată în timp real."
          graphic={<SatelliteGraphic />}
          fade={['bottom']}
          className="lg:col-span-3 lg:rounded-tr-4xl"
        />
        <BentoCard
          eyebrow="Rapoarte AI"
          title="Date reale, vizualizate instant"
          description="Ceri un raport pe zonă și perioadă — primești grafice, tabele și documentul gata de semnat. Fără SQL, fără Excel, fără ore pierdute."
          graphic={<ReportGraphic />}
          className="lg:col-span-2 lg:rounded-bl-4xl"
        />
        <BentoCard
          eyebrow="Inventar arbori"
          title="Distribuția speciilor pe OS"
          description="61.840 de arbori monitorizați în timp real — distribuție pe specii, zone, parcele și stare. Actualizat automat din chipuri."
          graphic={<InventoryGraphic />}
          className="lg:col-span-2"
        />
        <BentoCard
          eyebrow="Silviq"
          title="Utilizare si invatare in timp real"
          description="Silviq îți explică fiecare răspuns, îți sugerează cum să întrebi mai bine și urmărește progresul tău. Fiecare inginer evoluează în ritmul propriu."
          graphic={<CoachingGraphic />}
          className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl"
        />
      </div>
    </Container>
  )
}

// ── Grafic progres AI adoption ───────────────────────────────────────────────
function ProgressGraphic() {
  const engineers = [
    { name: 'Ing. Moldovan', months: ['L0', 'L0', 'L0', 'L1', 'L1', 'L1+'], score: 4.2 },
    { name: 'Ing. Sabău', months: ['L0', 'L0', 'L1', 'L1', 'L1+', 'L1+'], score: 4.7 },
    { name: 'Ing. Chira', months: ['L0', 'L0', 'L0', 'L0', 'L1', 'L1'], score: 3.1 },
  ]
  const levelColor = { 'L0': '#374151', 'L1': '#065f46', 'L1+': '#10b981' }
  return (
    <div className="flex h-80 flex-col justify-center gap-6 px-8 py-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">Progres ingineri · Apr 2025</p>
        <span className="rounded-full bg-emerald-900/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">LIVE</span>
      </div>
      {engineers.map((eng) => (
        <div key={eng.name} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-300">{eng.name}</span>
            <span className="text-xs font-bold text-emerald-400">{eng.score}/5</span>
          </div>
          <div className="flex gap-1">
            {eng.months.map((lvl, i) => (
              <div
                key={i}
                className="flex h-5 flex-1 items-center justify-center rounded text-[9px] font-bold text-white"
                style={{ backgroundColor: levelColor[lvl] }}
              >
                {lvl}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 border-t border-neutral-700 pt-3">
        {Object.entries(levelColor).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-neutral-400">{label === 'L0' ? 'Fără AI' : label === 'L1' ? 'AI asistat' : 'AI avansat'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Grafic document generat ───────────────────────────────────────────────────
function DocumentGraphic() {
  return (
    <div className="flex h-80 items-center justify-center px-8 py-6">
      <div className="relative w-full max-w-sm">
        {/* shadow stack */}
        <div className="absolute inset-x-4 top-3 h-full rounded-xl border border-neutral-700 bg-neutral-800 opacity-50" />
        <div className="absolute inset-x-2 top-1.5 h-full rounded-xl border border-neutral-700 bg-neutral-800 opacity-70" />
        {/* main doc */}
        <div className="relative rounded-xl border border-neutral-600 bg-neutral-800 p-5 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-400">Romsilva · OS Gurghiu</p>
              <p className="mt-1 text-sm font-bold text-white">Situație lunară tăieri</p>
              <p className="text-[10px] text-neutral-400">Aprilie 2025 · UP-IV Hodac</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-emerald-400">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { label: 'Arbori inventariați', val: '1.240', ok: true },
              { label: 'Tăieri autorizate', val: '87 mc', ok: true },
              { label: 'Tăieri neautorizate', val: '3 cazuri', ok: false },
              { label: 'Sesizări transmise', val: '3 / 3', ok: true },
            ].map(({ label, val, ok }) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-neutral-700/50 px-3 py-1.5">
                <span className="text-[11px] text-neutral-300">{label}</span>
                <span className={`text-[11px] font-semibold ${ok ? 'text-emerald-400' : 'text-red-400'}`}>{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-emerald-400">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <p className="text-[10px] text-emerald-300">Generat automat · gata de semnat</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DarkBentoSection() {
  return (
    <div className="mx-2 mt-2 rounded-4xl bg-gray-900 py-32">
      <Container>
        <Subheading dark>De ce e diferit</Subheading>
        <Heading as="h3" dark className="mt-2 max-w-3xl">
          Nu e un tool generic AI. E construit pentru ingineri silvici.
        </Heading>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <BentoCard
            dark
            eyebrow="Silviq — adoptare măsurabilă"
            title="Progresul fiecărui inginer, vizibil"
            description="Silviq urmărește calitatea prompturilor în timp — de la cereri vagi la rapoarte complexe cu filtre multiple. Adoptarea AI nu e un concept, e o metrică."
            graphic={<ProgressGraphic />}
            fade={['top']}
            className="max-lg:rounded-t-4xl lg:col-span-4 lg:rounded-tl-4xl"
          />
          <BentoCard
            dark
            eyebrow="Acces instituțional"
            title="Securizat pentru ocoluri silvice"
            description="Login cu cont instituțional, roluri pe zone și parcele, jurnal de audit complet. Datele rămân în infrastructura ocolului."
            graphic={<LogoTimeline />}
            className="z-10 overflow-visible! lg:col-span-2 lg:rounded-tr-4xl"
          />
          <BentoCard
            dark
            eyebrow="Memorie colectivă"
            title="Cunoștința nu pleacă cu omul"
            description="Rapoartele, alertele și inventarele anterioare devin contextul pentru interacțiunile viitoare. Fiecare inginer nou pornește cu istoria ocolului deja încărcată."
            graphic={<LinkedAvatars />}
            className="lg:col-span-2 lg:rounded-bl-4xl"
          />
          <BentoCard
            dark
            eyebrow="Rapoarte automate"
            title="Zero ore pierdute pe documente"
            description="Situații lunare, rapoarte de inspecție și sesizări către autorități generate automat — în formatul solicitat de Romsilva sau ICAS, gata de depus."
            graphic={<DocumentGraphic />}
            fade={['top']}
            className="max-lg:rounded-b-4xl lg:col-span-4 lg:rounded-br-4xl"
          />
        </div>
      </Container>
    </div>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <Container className="mt-10">
        </Container>
        <div className="bg-linear-to-b from-white from-50% to-gray-100 py-32">
          <BentoSection />
        </div>
        <DarkBentoSection />
      </main>
      <Footer />
    </div>
  )
}
