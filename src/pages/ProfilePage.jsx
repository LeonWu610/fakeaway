import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'

function readJson(storage, key, fallback) {
  try { return JSON.parse(storage.getItem(key)) || fallback } catch { return fallback }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const memories = readJson(localStorage, 'fakeaway.memories', [])
  const activeOrder = readJson(sessionStorage, 'fakeaway.activeOrder', null)
  const coupons = Object.keys(sessionStorage).filter((key) => key.startsWith('fakeaway.coupon.')).length
  const uniqueRestaurants = useMemo(() => new Set(memories.map((memory) => memory.restaurantId)).size, [memories])
  const greeting = new Date().getHours() >= 18 ? '今晚也辛苦了' : '今天也慢慢来'

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20 text-[var(--text-primary)]">
      <section className="bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-deep)] to-[var(--brand-night)] px-4 pb-6 pt-[max(18px,env(safe-area-inset-top))] text-white">
        <div className="flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-full border-2 border-white/70 bg-white/15 shadow-sm"><ProfileIcon name="user" className="h-8 w-8" /></div><div className="min-w-0 flex-1"><h1 className="text-[20px] font-black">{greeting}</h1><p className="mt-0.5 text-[11px] text-white/65">模拟食客 · 不用付款，也可以认真期待</p></div><button className="grid h-8 w-8 place-items-center rounded-full bg-white/10" aria-label="设置"><ProfileIcon name="settings" className="h-4 w-4" /></button></div>
        <div className="mt-5 grid grid-cols-3 rounded-xl bg-white/90 py-3 text-[var(--text-primary)] backdrop-blur">
          <Stat value={memories.length} label="记忆订单" />
          <Stat value={uniqueRestaurants} label="去过的店" />
          <Stat value={coupons} label="领取的券" />
        </div>
      </section>

      {activeOrder && <button onClick={() => navigate('/orders')} className="mx-3 mt-3 flex w-[calc(100%_-_1.5rem)] items-center gap-3 rounded-xl bg-[var(--brand-night)] p-3 text-left text-white shadow-sm"><div className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><ProfileIcon name="scooter" className="h-6 w-6" /></div><div className="min-w-0 flex-1"><p className="text-[9px] text-white/50">正在等待</p><p className="mt-0.5 truncate text-[13px] font-bold">{activeOrder.restaurant.name} · 想象骑手正在路上</p></div><span className="text-sm text-white/60">›</span></button>}

      <section className="mx-3 mt-3 overflow-hidden rounded-xl bg-[var(--surface)]">
        <MenuRow icon="receipt" title="我的订单" detail={`${memories.length + Number(Boolean(activeOrder))} 个记录`} onClick={() => navigate('/orders')} />
        <MenuRow icon="heart" title="记忆收藏" detail={`${memories.length} 张卡片`} onClick={() => navigate('/orders')} />
        <MenuRow icon="ticket" title="我的优惠券" detail={`${coupons} 张模拟券`} />
        <MenuRow icon="location" title="收货地址" detail="想象中的门口" />
      </section>

      <section className="mx-3 mt-3 rounded-xl bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between"><h2 className="text-[14px] font-bold">本周情绪小结</h2><span className="text-[9px] text-gray-400">仅保存在本机</span></div>
        <div className="mt-3 grid grid-cols-2 gap-2"><MoodCard title="期待值" value={`+${memories.length + Number(Boolean(activeOrder))}`} detail="挑选和等待都算数" color="bg-[var(--brand-coral-soft)] text-[var(--brand-coral)]" /><MoodCard title="松弛感" value={`+${memories.length}`} detail="没有账单，也没关系" color="bg-[#eef8f1] text-[#397c4d]" /></div>
      </section>

      <section className="mx-3 mt-3 rounded-xl bg-[var(--surface)] px-4 py-3 text-[10px] leading-5 text-[var(--text-muted)]"><strong className="text-[11px] text-gray-600">关于这次体验</strong><p className="mt-1">这里的商家、价格、订单和配送均为原创模拟内容，不会产生真实支付或真实餐食。</p></section>
      <BottomNav activeTab="profile" />
    </main>
  )
}

function Stat({ value, label }) {
  return <div className="border-r border-black/5 text-center last:border-0"><strong className="text-[19px]">{value}</strong><p className="mt-0.5 text-[9px] text-gray-500">{label}</p></div>
}

function MenuRow({ icon, title, detail, onClick }) {
  return <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-[var(--border-soft)] px-4 py-3 text-left last:border-0"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"><ProfileIcon name={icon} className="h-[18px] w-[18px]" /></span><span className="flex-1 text-[13px] font-semibold">{title}</span><span className="text-[10px] text-gray-400">{detail}</span><span className="text-gray-300">›</span></button>
}

function ProfileIcon({ name, className = 'h-5 w-5' }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A8 8 0 0 0 15 6l-.3-2.5h-4L10.4 6A8 8 0 0 0 8 7.1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1A8 8 0 0 0 10 18l.3 2.5h4L15 18a8 8 0 0 0 1.5-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" /></>,
    scooter: <><path d="M5 16h10l2-6h-5l-2-3H7" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /><path d="M14 7h3l2 3" /></>,
    receipt: <path d="M7 3h10v18l-2-1.5-3 1.5-3-1.5L7 21V3Zm3 5h4m-4 4h4m-4 4h3" />,
    heart: <path d="M20.5 8.7c0 5-8.5 10.3-8.5 10.3S3.5 13.7 3.5 8.7A4.7 4.7 0 0 1 12 5.9a4.7 4.7 0 0 1 8.5 2.8Z" />,
    ticket: <path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Zm8 2v8" />,
    location: <><path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
  }
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function MoodCard({ title, value, detail, color }) {
  return <div className={`rounded-lg p-3 ${color}`}><p className="text-[10px] font-semibold">{title}</p><strong className="mt-1 block text-[22px] leading-6">{value}</strong><p className="mt-1 text-[9px] opacity-70">{detail}</p></div>
}
