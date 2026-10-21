'use client'

import { SilvicMap, ZoneDetail } from '@/components/silvic-map'
import { recentAlerts, stats } from '@/lib/mock-data'
import { useState } from 'react'

const statCards = [
  { label: 'Arbori monitorizați', value: stats.totalTrees.toLocaleString(), sub: 'cu chip activ', color: 'text-gray-950' },
  { label: 'Tăieri ilegale', value: stats.illegalCutsTotal, sub: 'total detectate', color: 'text-red-600' },
  { label: 'Zone cu alertă', value: stats.alertZones, sub: 'necesită intervenție', color: 'text-amber-600' },
]

const alertTypeColors = {
  'Tăiere ilegală': 'bg-red-50 text-red-700 ring-red-200',
  'Tăiere neautorizată': 'bg-amber-50 text-amber-700 ring-amber-200',
}

export default function Dashboard() {
  const [selectedZone, setSelectedZone] = useState(null)

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitorizare păduri în timp real — OS Gurghiu 
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`mt-1.5 text-3xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Map + Zone detail */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SilvicMap
            selectedZone={selectedZone}
            onZoneSelect={(id) => setSelectedZone(id === selectedZone ? null : id)}
          />
        </div>

        <div>
          {selectedZone ? (
            <ZoneDetail zoneId={selectedZone} onClose={() => setSelectedZone(null)} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
              <p className="text-sm font-medium text-gray-500">Selectează o zonă</p>
              <p className="mt-1 text-xs text-gray-400">Click pe hartă pentru detalii</p>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-6">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-950">Alerte recente</h2>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
              {recentAlerts.length} active
            </span>
          </div>
          <div className="mt-4 space-y-2.5">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${alertTypeColors[alert.type] || 'bg-gray-50 text-gray-600 ring-gray-200'}`}>
                      {alert.type}
                    </span>
                    <span className="text-xs text-gray-400">{alert.zone} · {alert.parcel}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {alert.trees} arbori ({alert.species}) · {alert.coords}
                  </p>
                </div>
                <p className="shrink-0 text-right text-xs text-gray-400">{alert.detected.split(' ')[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
