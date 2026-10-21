'use client'

import { clsx } from 'clsx'
import { useState } from 'react'
import { zones } from '@/lib/mock-data'

const statusConfig = {
  ok:      { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', label: 'OK' },
  warning: { dot: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200',   label: 'Atenție' },
  alert:   { dot: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200',     label: 'Alertă' },
}

// Polygon paths that look like real irregular forest zones (Gurghiu area, Mureș)
// Coordinates are in SVG viewBox 0 0 200 160
const zonePolygons = [
  {
    id: 'UP-I',
    // Large central-north zone — Gurghiu valley
    d: 'M 20 18 L 48 12 L 72 16 L 78 30 L 74 48 L 58 52 L 42 54 L 24 48 L 16 36 Z',
    labelX: 46, labelY: 33,
  },
  {
    id: 'UP-II',
    // Northeast — Hodac hillside
    d: 'M 78 12 L 102 8 L 118 14 L 122 28 L 114 38 L 96 42 L 80 38 L 76 26 Z',
    labelX: 99, labelY: 25,
  },
  {
    id: 'UP-III',
    // East — Ibănești plateau
    d: 'M 114 16 L 136 10 L 156 18 L 162 32 L 154 46 L 136 50 L 118 46 L 112 32 Z',
    labelX: 137, labelY: 29,
  },
  {
    id: 'UP-IV',
    // South-central — Solovăstru, largest zone, most alerts
    d: 'M 22 58 L 58 54 L 80 58 L 84 72 L 86 88 L 70 96 L 46 98 L 26 90 L 14 76 L 16 62 Z',
    labelX: 50, labelY: 76,
  },
  {
    id: 'UP-V',
    // South-east — Glăjărie, narrow zone
    d: 'M 86 56 L 112 52 L 128 58 L 132 72 L 126 86 L 108 92 L 88 88 L 82 74 Z',
    labelX: 107, labelY: 72,
  },
  {
    id: 'UP-VI',
    // Far east — Jabenița, elongated
    d: 'M 134 20 L 162 14 L 182 22 L 188 42 L 184 64 L 172 78 L 154 80 L 136 70 L 128 52 L 130 34 Z',
    labelX: 158, labelY: 47,
  },
]

// Alert dot positions (illegal cuts)
const alertDots = [
  { zone: 'UP-IV', cx: 66, cy: 62 },
  { zone: 'UP-IV', cx: 38, cy: 80 },
  { zone: 'UP-I',  cx: 54, cy: 24 },
  { zone: 'UP-I',  cx: 30, cy: 38 },
  { zone: 'UP-II', cx: 94, cy: 28 },
  { zone: 'UP-V',  cx: 110, cy: 68 },
]

// River/road lines for realism
const riverPath = 'M 10 50 Q 40 44 70 52 Q 100 60 130 56 Q 160 50 190 58'
const roadPath  = 'M 0 95 Q 50 90 100 94 Q 150 98 200 92'

export function SilvicMap({ onZoneSelect, selectedZone }) {
  const [hovered, setHovered] = useState(null)

  const zoneData = (id) => zones.find((z) => z.id === id)

  const fills       = { ok: '#059669', warning: '#d97706', alert: '#dc2626' }
  const fillsDark   = { ok: '#065f46', warning: '#78350f', alert: '#7f1d1d' }
  const fillsHover  = { ok: '#10b981', warning: '#f59e0b', alert: '#ef4444' }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#0a1f12] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          OS Gurghiu — Mureș
        </p>
        <p className="text-xs text-emerald-600">sursă: Global Forest Watch</p>
      </div>

      {/* SVG Map */}
      <div className="relative w-full" style={{ paddingBottom: '65%' }}>
        <svg
          viewBox="0 0 200 160"
          className="absolute inset-0 h-full w-full"
        >
          {/* Terrain background */}
          <defs>
            <radialGradient id="terrainGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#052e16" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#021007" stopOpacity="1" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="200" height="160" fill="url(#terrainGrad)" />

          {/* Topographic rings (elevation simulation) */}
          <ellipse cx="100" cy="75" rx="92" ry="68" fill="none" stroke="#0d3320" strokeWidth="0.5" />
          <ellipse cx="100" cy="75" rx="75" ry="54" fill="none" stroke="#0d3320" strokeWidth="0.4" />
          <ellipse cx="100" cy="75" rx="56" ry="38" fill="none" stroke="#0d3320" strokeWidth="0.3" />

          {/* River (Mureș tributary) */}
          <path d={riverPath} fill="none" stroke="#1e4d6b" strokeWidth="1.2" strokeDasharray="none" opacity="0.7" />
          <path d={riverPath} fill="none" stroke="#2563a8" strokeWidth="0.5" opacity="0.4" />

          {/* Road */}
          <path d={roadPath} fill="none" stroke="#374151" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.5" />

          {/* Zone polygons */}
          {zonePolygons.map(({ id, d, labelX, labelY }) => {
            const zone = zoneData(id)
            if (!zone) return null
            const isSelected = selectedZone === id
            const isHovered  = hovered === id
            const fill = isSelected || isHovered ? fillsHover[zone.status] : isSelected ? fills[zone.status] : fillsDark[zone.status]

            return (
              <g key={id}>
                {/* Zone shadow */}
                <path d={d} fill="#000" opacity="0.3" transform="translate(1,1)" />

                {/* Zone fill */}
                <path
                  d={d}
                  fill={fill}
                  fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.65}
                  stroke={fills[zone.status]}
                  strokeWidth={isSelected ? 1.2 : 0.5}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onZoneSelect(id)}
                />

                {/* Tree texture dots inside zone */}
                {!isHovered && !isSelected && [0, 1, 2].map((i) => (
                  <circle
                    key={i}
                    cx={labelX - 8 + i * 8}
                    cy={labelY + 4}
                    r="0.8"
                    fill={fills[zone.status]}
                    opacity="0.4"
                    style={{ pointerEvents: 'none' }}
                  />
                ))}

                {/* Label */}
                <text
                  x={labelX} y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="4.5"
                  fontWeight="700"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {id}
                </text>
                <text
                  x={labelX} y={labelY + 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="2.8"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {zone.area} ha
                </text>
              </g>
            )
          })}

          {/* Alert dots (illegal cut positions) */}
          {alertDots.map((dot, i) => {
            const zone = zoneData(dot.zone)
            if (!zone || zone.illegalCuts === 0) return null
            return (
              <g key={i} style={{ pointerEvents: 'none' }}>
                <circle cx={dot.cx} cy={dot.cy} r="2.5" fill="#ef4444" opacity="0.9" />
                <circle cx={dot.cx} cy={dot.cy} r="4" fill="none" stroke="#ef4444" strokeWidth="0.6" opacity="0.5" />
                <circle cx={dot.cx} cy={dot.cy} r="1" fill="white" />
              </g>
            )
          })}

          {/* North indicator */}
          <g transform="translate(186, 14)">
            <circle cx="0" cy="0" r="5" fill="#0d3320" stroke="#1a5c2a" strokeWidth="0.5" />
            <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="#6ee7b7" fontSize="4" fontWeight="bold">N</text>
          </g>

          {/* Scale bar */}
          <g transform="translate(8, 150)">
            <line x1="0" y1="0" x2="20" y2="0" stroke="#4ade80" strokeWidth="0.8" />
            <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#4ade80" strokeWidth="0.8" />
            <line x1="20" y1="-1.5" x2="20" y2="1.5" stroke="#4ade80" strokeWidth="0.8" />
            <text x="10" y="-3" textAnchor="middle" fill="#4ade80" fontSize="2.5">5 km</text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${cfg.dot}`} />
            <span className="text-xs text-emerald-300">{cfg.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-red-500 ring-1 ring-red-400/50" />
          <span className="text-xs text-emerald-400">Tăiere ilegală detectată</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="inline-block h-px w-4 bg-blue-500 opacity-60" />
          <span className="text-xs text-emerald-600">Râu</span>
        </div>
      </div>

      {/* Hover tooltip */}
      {hovered && (() => {
        const z = zoneData(hovered)
        const cfg = statusConfig[z.status]
        return (
          <div className="mt-3 rounded-lg border border-emerald-800 bg-emerald-900/80 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{z.name}</p>
              <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${cfg.bg} ${cfg.text}`}>
                {cfg.label}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
              <div>
                <span className="block font-semibold text-white">{z.totalTrees.toLocaleString()}</span>
                <span className="text-emerald-400">Arbori</span>
              </div>
              <div>
                <span className={`block font-semibold ${z.illegalCuts > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{z.illegalCuts}</span>
                <span className="text-emerald-400">Ilegale</span>
              </div>
              <div>
                <span className="block font-semibold text-white">{z.area} ha</span>
                <span className="text-emerald-400">Suprafață</span>
              </div>
              <div>
                <span className="block font-semibold text-white">{z.dominant}</span>
                <span className="text-emerald-400">Specie</span>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

export function ZoneDetail({ zoneId, onClose }) {
  const zone = zones.find((z) => z.id === zoneId)
  if (!zone) return null
  const cfg = statusConfig[zone.status]

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400">{zoneId}</p>
          <h3 className="mt-0.5 text-base font-semibold text-gray-950">{zone.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1', cfg.bg, cfg.text, cfg.border)}>
            <span className={clsx('size-1.5 rounded-full', cfg.dot)} />
            {cfg.label}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
        </div>
      </div>

      {/* Mini bar: illegal vs authorized */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Tăieri ilegale vs autorizate</span>
          <span>{zone.illegalCuts + zone.authorizedCuts} total</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="bg-red-500"
            style={{ width: `${(zone.illegalCuts / (zone.illegalCuts + zone.authorizedCuts)) * 100}%` }}
          />
          <div className="flex-1 bg-emerald-400" />
        </div>
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-red-500">{zone.illegalCuts} ilegale</span>
          <span className="text-emerald-600">{zone.authorizedCuts} autorizate</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { label: 'Total arbori', value: zone.totalTrees.toLocaleString(), color: 'text-gray-950' },
          { label: 'Suprafață',    value: `${zone.area} ha`,               color: 'text-gray-950' },
          { label: 'Specie dom.',  value: zone.dominant,                    color: 'text-gray-950' },
          { label: 'Parcele',      value: zone.parcels,                     color: 'text-gray-950' },
        ].map((item) => (
          <div key={item.label} className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className={clsx('mt-0.5 text-sm font-semibold', item.color)}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
        <p className="text-xs text-gray-500">Inspector</p>
        <p className="text-xs font-medium text-gray-900">{zone.inspector}</p>
      </div>

    </div>
  )
}
