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
    <main className="min-h-screen bg-[#f5f5f5] pb-20 text-[#222]">
      <section className="bg-gradient-to-br from-[#ffd84a] via-[#ffcf35] to-[#ffb928] px-4 pb-6 pt-[max(18px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-full border-2 border-white/80 bg-white text-2xl shadow-sm">🙂</div><div className="min-w-0 flex-1"><h1 className="text-[20px] font-black">{greeting}</h1><p className="mt-0.5 text-[11px] text-black/55">模拟食客 · 不用付款，也可以认真期待</p></div><button className="grid h-8 w-8 place-items-center rounded-full bg-black/5" aria-label="设置">⚙</button></div>
        <div className="mt-5 grid grid-cols-3 rounded-xl bg-white/80 py-3 backdrop-blur">
          <Stat value={memories.length} label="记忆订单" />
          <Stat value={uniqueRestaurants} label="去过的店" />
          <Stat value={coupons} label="领取的券" />
        </div>
      </section>

      {activeOrder && <button onClick={() => navigate('/orders')} className="mx-3 mt-3 flex w-[calc(100%_-_1.5rem)] items-center gap-3 rounded-xl bg-[#342a28] p-3 text-left text-white shadow-sm"><div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl">🛵</div><div className="min-w-0 flex-1"><p className="text-[9px] text-white/50">正在等待</p><p className="mt-0.5 truncate text-[13px] font-bold">{activeOrder.restaurant.name} · 想象骑手正在路上</p></div><span className="text-sm text-white/60">›</span></button>}

      <section className="mx-3 mt-3 overflow-hidden rounded-xl bg-white">
        <MenuRow icon="🧾" title="我的订单" detail={`${memories.length + Number(Boolean(activeOrder))} 个记录`} onClick={() => navigate('/orders')} />
        <MenuRow icon="💛" title="记忆收藏" detail={`${memories.length} 张卡片`} onClick={() => navigate('/orders')} />
        <MenuRow icon="🎟" title="我的优惠券" detail={`${coupons} 张模拟券`} />
        <MenuRow icon="📍" title="收货地址" detail="想象中的门口" />
      </section>

      <section className="mx-3 mt-3 rounded-xl bg-white p-4">
        <div className="flex items-center justify-between"><h2 className="text-[14px] font-bold">本周情绪小结</h2><span className="text-[9px] text-gray-400">仅保存在本机</span></div>
        <div className="mt-3 grid grid-cols-2 gap-2"><MoodCard title="期待值" value={`+${memories.length + Number(Boolean(activeOrder))}`} detail="挑选和等待都算数" color="bg-[#fff7dc] text-[#9a6a00]" /><MoodCard title="松弛感" value={`+${memories.length}`} detail="没有账单，也没关系" color="bg-[#eef8f1] text-[#397c4d]" /></div>
      </section>

      <section className="mx-3 mt-3 rounded-xl bg-white px-4 py-3 text-[10px] leading-5 text-gray-400"><strong className="text-[11px] text-gray-600">关于这次体验</strong><p className="mt-1">这里的商家、价格、订单和配送均为原创模拟内容，不会产生真实支付或真实餐食。</p></section>
      <BottomNav activeTab="profile" />
    </main>
  )
}

function Stat({ value, label }) {
  return <div className="border-r border-black/5 text-center last:border-0"><strong className="text-[19px]">{value}</strong><p className="mt-0.5 text-[9px] text-gray-500">{label}</p></div>
}

function MenuRow({ icon, title, detail, onClick }) {
  return <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-0"><span className="grid h-8 w-8 place-items-center rounded-lg bg-gray-50 text-base">{icon}</span><span className="flex-1 text-[13px] font-semibold">{title}</span><span className="text-[10px] text-gray-400">{detail}</span><span className="text-gray-300">›</span></button>
}

function MoodCard({ title, value, detail, color }) {
  return <div className={`rounded-lg p-3 ${color}`}><p className="text-[10px] font-semibold">{title}</p><strong className="mt-1 block text-[22px] leading-6">{value}</strong><p className="mt-1 text-[9px] opacity-70">{detail}</p></div>
}
