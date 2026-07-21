import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import AppImage from '../components/common/AppImage'
import restaurants from '../data/allRestaurants'

function readJson(storage, key, fallback) {
  try { return JSON.parse(storage.getItem(key)) || fallback } catch { return fallback }
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const activeOrder = readJson(sessionStorage, 'fakeaway.activeOrder', null)
  const memories = readJson(localStorage, 'fakeaway.memories', [])
  const activeIsDelivered = activeOrder && Date.now() - activeOrder.createdAt >= 26000
  const history = useMemo(() => memories.filter((memory) => memory.orderId !== activeOrder?.id), [activeOrder?.id, memories])

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20 text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 bg-white px-4 pb-3 pt-[max(14px,env(safe-area-inset-top))] shadow-sm">
        <h1 className="text-[20px] font-black">我的订单</h1>
        <p className="mt-0.5 text-[10px] text-gray-400">每一单都是一次认真期待过的模拟体验</p>
      </header>

      <section className="px-3 pt-3">
        <div className="mb-2 flex items-center justify-between"><h2 className="text-[14px] font-bold">进行中</h2>{activeOrder && <span className="text-[9px] text-gray-400">1 个模拟订单</span>}</div>
        {activeOrder ? (
          <article className="overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3 border-b border-gray-100 p-3">
              <AppImage src={activeOrder.items[0]?.item.imageUrl || activeOrder.items[0]?.item.image || activeOrder.restaurant.image} alt={activeOrder.items[0]?.item.name || activeOrder.restaurant.name} className="h-12 w-12 rounded-lg object-cover" sizes="48px" width={48} height={48} />
              <div className="min-w-0 flex-1"><h3 className="truncate text-[15px] font-bold">{activeOrder.restaurant.name}</h3><p className="mt-1 text-[10px] text-gray-400">{activeOrder.id} · {activeOrder.items.reduce((sum, entry) => sum + entry.quantity, 0)} 件商品</p></div>
              <span className="rounded-full bg-[#fff7dc] px-2 py-1 text-[10px] font-semibold text-[#9a6c00]">{activeIsDelivered ? '已送达' : '配送中'}</span>
            </div>
            <div className="flex items-center px-3 py-2.5"><p className="min-w-0 flex-1 truncate text-[11px] text-gray-500">{activeOrder.items.map((entry) => `${entry.item.name} ×${entry.quantity}`).join('、')}</p><strong className="ml-3 text-[13px]">¥{activeOrder.total.toFixed(2)}</strong></div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-3 py-2.5"><button onClick={() => navigate(`/restaurant/${activeOrder.restaurant.id}`)} className="rounded-full border border-gray-200 px-3 py-1.5 text-[11px]">再来一单</button><button onClick={() => navigate(activeIsDelivered ? '/delivered' : '/tracking')} className="rounded-full bg-[var(--brand-primary)] px-4 py-1.5 text-[11px] font-bold text-white">{activeIsDelivered ? '查看收获' : '查看进度'}</button></div>
          </article>
        ) : <EmptyCard title="暂时没有等待中的订单" detail="去选一家顺眼的店，享受一次不用花钱的等待" action={() => navigate('/')} />}
      </section>

      <section className="px-3 pt-5">
        <div className="mb-2 flex items-center justify-between"><h2 className="text-[14px] font-bold">历史订单</h2><span className="text-[9px] text-gray-400">已留下 {memories.length} 份记忆</span></div>
        {history.length > 0 ? <div className="overflow-hidden rounded-xl bg-white">{history.map((memory) => {
          const restaurant = restaurants.find((entry) => entry.id === memory.restaurantId)
          return <article key={memory.orderId} className="flex gap-3 border-b border-gray-100 p-3 last:border-0"><AppImage src={restaurant?.image} alt={memory.restaurantName} className="h-12 w-12 flex-none rounded-lg object-cover" sizes="48px" width={48} height={48} /><div className="min-w-0 flex-1"><div className="flex items-center"><h3 className="min-w-0 flex-1 truncate text-[14px] font-bold">{memory.restaurantName}</h3><span className="text-[9px] text-gray-400">圆满送达</span></div><p className="mt-1 truncate text-[10px] text-gray-500">记忆菜品：{memory.itemName || '想象中的美味'}</p><p className="mt-1 text-[9px] text-gray-400">{new Date(memory.createdAt).toLocaleDateString('zh-CN')} · {memory.orderId}</p><button onClick={() => navigate(`/restaurant/${memory.restaurantId}`)} className="mt-2 rounded-full border border-[#f2d56f] px-3 py-1 text-[10px] text-[#806000]">再次进店</button></div></article>
        })}</div> : <EmptyCard title="还没有历史订单" detail="完成一次模拟配送后，记忆会保存在这里" action={() => navigate('/')} />}
      </section>
      <BottomNav activeTab="order" />
    </main>
  )
}

function BagIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>
}

function EmptyCard({ title, detail, action }) {
  return <div className="rounded-xl bg-[var(--surface)] px-5 py-8 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"><BagIcon /></div><h3 className="mt-2 text-[13px] font-bold">{title}</h3><p className="mt-1 text-[10px] text-gray-400">{detail}</p><button onClick={action} className="mt-3 rounded-full bg-[var(--brand-primary)] px-4 py-1.5 text-[11px] font-semibold text-white">去逛逛</button></div>
}
