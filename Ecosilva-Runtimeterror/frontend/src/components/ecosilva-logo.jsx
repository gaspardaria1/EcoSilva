import { clsx } from 'clsx'

export function EcoSilvaLogo({ className, textClassName }) {
  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <EcoSilvaMark className="h-9 w-9" />
      <div>
        <p className={clsx('text-sm font-black tracking-wider text-gray-950 leading-none', textClassName)}>
          ECOSILVA
        </p>
        <p className={clsx('text-[9px] font-medium tracking-widest text-gray-500 leading-none mt-0.5', textClassName && 'opacity-70')}>
          FORESTRY MONITORING
        </p>
      </div>
    </div>
  )
}

export function EcoSilvaMark({ className }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tree canopy */}
      <path
        d="M40 6C28 6 18 14 18 26C18 32 21 37 26 40.5C24 41.5 22 43 22 45C22 47 24 48.5 26.5 48.5C24 49.5 22 51 22 53C22 55.5 25 57 28.5 57H37V72H43V57H51.5C55 57 58 55.5 58 53C58 51 56 49.5 53.5 48.5C56 48.5 58 47 58 45C58 43 56 41.5 54 40.5C59 37 62 32 62 26C62 14 52 6 40 6Z"
        fill="#166534"
        fillOpacity="0.15"
        stroke="#166534"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Center vein */}
      <line x1="40" y1="10" x2="40" y2="57" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
      {/* Branch left */}
      <path d="M40 28 Q32 24 26 26" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Branch right */}
      <path d="M40 28 Q48 24 54 26" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Branch left lower */}
      <path d="M40 38 Q31 35 25 37" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Branch right lower */}
      <path d="M40 38 Q49 35 55 37" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* GPS Pin */}
      <path
        d="M40 46C36.5 46 34 48.5 34 52C34 57 40 64 40 64C40 64 46 57 46 52C46 48.5 43.5 46 40 46Z"
        fill="#166534"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <circle cx="40" cy="52" r="2.5" fill="white" />

      {/* Romanian pattern dots on pin */}
      <circle cx="37" cy="49.5" r="0.8" fill="#d97706" />
      <circle cx="43" cy="49.5" r="0.8" fill="#d97706" />
      <circle cx="37" cy="54.5" r="0.8" fill="#1e40af" />
      <circle cx="43" cy="54.5" r="0.8" fill="#1e40af" />
    </svg>
  )
}

export function EcoSilvaMarkInvert({ className }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M40 6C28 6 18 14 18 26C18 32 21 37 26 40.5C24 41.5 22 43 22 45C22 47 24 48.5 26.5 48.5C24 49.5 22 51 22 53C22 55.5 25 57 28.5 57H37V72H43V57H51.5C55 57 58 55.5 58 53C58 51 56 49.5 53.5 48.5C56 48.5 58 47 58 45C58 43 56 41.5 54 40.5C59 37 62 32 62 26C62 14 52 6 40 6Z"
        fill="white"
        fillOpacity="0.15"
        stroke="white"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line x1="40" y1="10" x2="40" y2="57" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 28 Q32 24 26 26" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M40 28 Q48 24 54 26" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M40 38 Q31 35 25 37" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M40 38 Q49 35 55 37" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path
        d="M40 46C36.5 46 34 48.5 34 52C34 57 40 64 40 64C40 64 46 57 46 52C46 48.5 43.5 46 40 46Z"
        fill="white"
        stroke="#166534"
        strokeWidth="1.5"
      />
      <circle cx="40" cy="52" r="2.5" fill="#166534" />
      <circle cx="37" cy="49.5" r="0.8" fill="#fcd34d" />
      <circle cx="43" cy="49.5" r="0.8" fill="#fcd34d" />
      <circle cx="37" cy="54.5" r="0.8" fill="#93c5fd" />
      <circle cx="43" cy="54.5" r="0.8" fill="#93c5fd" />
    </svg>
  )
}
