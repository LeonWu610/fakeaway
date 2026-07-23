import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

const tabs = [
  { key: 'home', label: '首页', path: '/', icon: <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></> },
  { key: 'discover', label: '发现', path: '/discover', icon: <><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></> },
  { key: 'cart', label: '购物车', path: '/cart', icon: <><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></> },
  { key: 'order', label: '订单', path: '/orders', icon: <><path d="M7 3h10l2 3v15H5V6z"/><path d="M5 7h14M9 11h6M9 15h6"/></> },
  { key: 'profile', label: '我的', path: '/profile', icon: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></> },
]

export default function BottomNav({ activeTab = 'home' }) {
  const navigate = useNavigate()
  const { totalCount } = useCart()

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex h-[58px] w-full max-w-[480px] -translate-x-1/2 items-stretch border-t border-[var(--border-soft)] bg-[color:var(--surface)]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(45,36,75,.07)] backdrop-blur">
      {tabs.map((tab) => {
        const active = tab.key === activeTab
        return (
          <button key={tab.key} onClick={() => navigate(tab.path)} className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] ${active ? 'font-bold text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}>
            <span className={`relative grid h-7 w-8 place-items-center rounded-full ${active ? 'bg-[var(--brand-primary-soft)] ring-1 ring-[#DED5FF]' : ''}`}>
              <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{tab.icon}</svg>
              {tab.key === 'cart' && totalCount > 0 && <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--brand-coral)] px-1 text-[8px] font-black leading-none text-white">{totalCount > 99 ? '99+' : totalCount}</span>}
            </span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
