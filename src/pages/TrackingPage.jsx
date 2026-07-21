import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import config from '../data/config.json'
import AppImage from '../components/common/AppImage'

const DEFAULT_STAGES = [
  { key: 'accepted', label: '商家已接单', detail: '今晚想吃什么都可以，反正不用真的去取。' },
  { key: 'cooking', label: '正在认真备餐', detail: '后厨已经忙起来了，你只需要安心等一会儿。' },
  { key: 'picked', label: '想象骑手已取餐', detail: '热气和香味都被好好装进了袋子里。' },
  { key: 'nearby', label: '正在靠近你', detail: '这一单不用下楼，也不用担心电话没听见。' },
]

const STAGE_DURATION = 6500

function readStoredOrder() {
  try {
    return JSON.parse(sessionStorage.getItem('fakeaway.activeOrder'))
  } catch {
    return null
  }
}

export default function TrackingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order || readStoredOrder()
  const [elapsed, setElapsed] = useState(() => Math.max(0, Date.now() - (order?.createdAt || Date.now())))

  useEffect(() => {
    if (!order) return undefined
    const timer = window.setInterval(() => {
      const nextElapsed = Date.now() - order.createdAt
      setElapsed(nextElapsed)
      if (nextElapsed >= DEFAULT_STAGES.length * STAGE_DURATION) {
        window.clearInterval(timer)
        navigate('/delivered', { replace: true, state: { order } })
      }
    }, 500)
    return () => window.clearInterval(timer)
  }, [navigate, order])

  const stages = useMemo(() => {
    const customDetails = order?.restaurant?.waitingProfile?.stages
    if (!Array.isArray(customDetails) || customDetails.length !== DEFAULT_STAGES.length) return DEFAULT_STAGES
    return DEFAULT_STAGES.map((stage, index) => ({ ...stage, detail: customDetails[index] }))
  }, [order])
  const stageIndex = Math.min(Math.floor(elapsed / STAGE_DURATION), stages.length - 1)
  const progress = Math.min(100, (elapsed / (stages.length * STAGE_DURATION)) * 100)
  const secondsLeft = Math.max(0, Math.ceil((stages.length * STAGE_DURATION - elapsed) / 1000))
  const riderName = useMemo(() => {
    if (!order) return ''
    const index = Number(String(order.id).replace(/\D/g, '').slice(-2) || 0) % config.riderNames.length
    return config.riderNames[index]
  }, [order])

  const ScooterIcon = ({ className = 'h-10 w-10' }) => <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 16h10l2-6h-5l-2-3H7" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /><path d="M14 7h3l2 3" /></svg>

  if (!order) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-8 text-center">
        <div className="mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"><ScooterIcon /></div>
        <h1 className="text-xl font-bold text-gray-900">还没有正在等待的订单</h1>
        <p className="text-sm text-gray-500 mt-2">去挑一家今晚看起来最顺眼的店吧。</p>
        <button onClick={() => navigate('/')} className="mt-6 rounded-full bg-[var(--brand-primary)] px-7 py-3 text-sm font-semibold text-white">
          去逛逛
        </button>
      </main>
    )
  }

  const stage = stages[stageIndex]

  return (
    <main className="min-h-screen bg-[var(--background)] pb-8 text-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-deep)] to-[var(--brand-night)] px-5 pb-10 pt-5 text-white">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative flex items-center justify-between">
          <button onClick={() => navigate('/')} aria-label="返回首页" className="h-9 w-9 rounded-full bg-black/10 text-xl">×</button>
          <span className="rounded-full bg-black/10 px-3 py-1 text-xs">模拟订单 · {order.id}</span>
        </div>
        <div className="relative mt-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 shadow-inner"><ScooterIcon /></div>
          <p className="mt-5 text-sm text-white/80">预计还有</p>
          <div className="mt-1 text-4xl font-black tracking-tight">{secondsLeft}<span className="ml-1 text-base font-semibold">秒</span></div>
          <h1 className="mt-4 text-xl font-bold">{stage.label}</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/85">{stage.detail}</p>
        </div>
      </section>

      <section className="relative -mt-5 mx-3 rounded-3xl bg-white p-5 shadow-[0_10px_35px_rgba(32,38,46,0.08)]">
        <div className="flex items-center justify-between gap-3 text-sm">
          <AppImage src={order.items[0]?.item.imageUrl || order.items[0]?.item.image} alt={order.items[0]?.item.name || ''} className="h-12 w-12 flex-none rounded-xl object-cover" sizes="48px" width={48} height={48} />
          <div className="min-w-0 flex-1">
            <div className="font-bold">{order.restaurant.name}</div>
            <div className="mt-1 text-xs text-gray-400">{order.items.length} 种想吃的 · 模拟实付 ¥{order.total.toFixed(2)}</div>
          </div>
          <div className="rounded-2xl bg-[var(--brand-primary-soft)] px-3 py-2 text-right">
            <div className="text-xs text-gray-400">今晚骑手</div>
            <div className="text-sm font-bold text-[var(--brand-primary-deep)]">{riderName}</div>
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-coral)] to-[var(--brand-primary)] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-6 space-y-0">
          {stages.map((item, index) => {
            const reached = index <= stageIndex
            return (
              <div key={item.key} className="flex gap-3">
                <div className="flex w-5 flex-col items-center">
                  <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${reached ? 'bg-[var(--brand-primary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {reached ? '✓' : index + 1}
                  </div>
                  {index < stages.length - 1 && <div className={`h-10 w-0.5 ${index < stageIndex ? 'bg-[var(--brand-primary-soft)]' : 'bg-gray-100'}`} />}
                </div>
                <div className={`pb-5 text-sm ${reached ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{item.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-3xl bg-[var(--brand-primary-soft)] p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/70 text-[var(--brand-primary)]"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 15a4 4 0 0 1-4 4H9l-5 3v-7a4 4 0 0 1-1-2.6V8a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v7Z" /></svg></div>
          <div>
            <h2 className="text-sm font-bold">本次等待许可</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">这几十秒里什么都不用做。可以盯着进度条，也可以只是放空一下。</p>
          </div>
        </div>
      </section>

      <button onClick={() => navigate('/delivered', { state: { order } })} className="mx-auto mt-5 block text-xs text-gray-400 underline underline-offset-4">
        立即送达（体验预览）
      </button>
    </main>
  )
}
