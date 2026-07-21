import { useState } from 'react'

export default function HomeHeader({ address = '望京 SOHO' }) {
  const [mode, setMode] = useState('delivery')

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-br from-[var(--brand-night)] via-[#342D58] to-[#493675] px-3 pb-2 pt-[max(8px,env(safe-area-inset-top))] text-white shadow-[0_8px_24px_rgba(36,33,61,.18)]">
      <div className="flex h-9 items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="flex max-w-[190px] items-center gap-1 text-left active:opacity-60" aria-label="切换收货地址">
            <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1116 0z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="truncate text-[17px] font-black text-white">{address}</span>
            <svg viewBox="0 0 24 24" className="h-3 w-3 flex-none" fill="currentColor"><path d="M7 9l5 6 5-6z" /></svg>
          </button>
          <div className="flex rounded-full bg-white/10 p-0.5 text-[10px] font-semibold ring-1 ring-white/10">
            {[
              ['delivery', '外送'],
              ['pickup', '自取'],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setMode(key)} className={`rounded-full px-2 py-1 transition ${mode === key ? 'bg-white text-[var(--brand-night)] shadow-sm' : 'text-white/60'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="grid h-8 w-8 place-items-center rounded-full active:bg-white/10" aria-label="消息">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" /></svg>
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full active:bg-white/10" aria-label="更多">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
          </button>
        </div>
      </div>
    </header>
  )
}
