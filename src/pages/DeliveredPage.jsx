import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import config from '../data/config.json'

function readStoredOrder() {
  try {
    return JSON.parse(sessionStorage.getItem('fakeaway.activeOrder'))
  } catch {
    return null
  }
}

export default function DeliveredPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order || readStoredOrder()
  const [saved, setSaved] = useState(false)

  const completionText = useMemo(() => {
    if (!order) return config.completionTexts[0]
    const index = Number(String(order.id).replace(/\D/g, '').slice(-2) || 0) % config.completionTexts.length
    return config.completionTexts[index]
  }, [order])

  const featuredItem = order?.items?.reduce((best, entry) => {
    if (!best || entry.item.price * entry.quantity > best.item.price * best.quantity) return entry
    return best
  }, null)

  useEffect(() => {
    if (!order) return
    const memory = {
      orderId: order.id,
      restaurantId: order.restaurant.id,
      restaurantName: order.restaurant.name,
      itemName: featuredItem?.item.name,
      createdAt: order.createdAt,
    }
    const existing = JSON.parse(localStorage.getItem('fakeaway.memories') || '[]')
    if (!existing.some((item) => item.orderId === order.id)) {
      localStorage.setItem('fakeaway.memories', JSON.stringify([memory, ...existing].slice(0, 30)))
    }
  }, [featuredItem, order])

  if (!order) {
    return (
      <main className="min-h-screen bg-[#fffaf3] flex flex-col items-center justify-center px-8 text-center">
        <div className="text-5xl">🥡</div>
        <h1 className="mt-4 text-xl font-bold">这份想象中的外卖已经收好</h1>
        <button onClick={() => navigate('/')} className="mt-6 rounded-full bg-[#ff6b35] px-7 py-3 text-sm font-semibold text-white">再逛一会儿</button>
      </main>
    )
  }

  function orderAgain() {
    sessionStorage.removeItem('fakeaway.activeOrder')
    navigate(`/restaurant/${order.restaurant.id}`)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf3] pb-10 text-gray-900">
      <section className="relative px-5 pb-12 pt-6 text-center">
        <div className="absolute left-7 top-14 h-3 w-3 rotate-12 rounded-sm bg-amber-300" />
        <div className="absolute right-9 top-24 h-3 w-3 rounded-full bg-rose-300" />
        <div className="absolute right-16 top-8 text-xl text-orange-300">✦</div>
        <button onClick={() => navigate('/')} aria-label="关闭" className="absolute left-5 top-5 z-10 h-9 w-9 rounded-full bg-black/5 text-xl">×</button>
        <div className="mx-auto mt-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-300 text-6xl shadow-[0_16px_40px_rgba(244,145,69,0.25)]">🥡</div>
        <p className="mt-7 text-sm font-semibold text-orange-600">想象中的外卖已送达</p>
        <h1 className="mx-auto mt-3 max-w-sm text-3xl font-black leading-tight">{completionText}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">不用下楼，不用吃完，也没有一笔真的账单。<br />但刚才那份期待，可以算真的。</p>
      </section>

      <section className="mx-4 rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(98,72,45,0.08)]">
        <div className="flex items-center gap-3 border-b border-dashed border-gray-200 pb-4">
          <img src={order.restaurant.image} alt="" className="h-12 w-12 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold">{order.restaurant.name}</h2>
            <p className="mt-1 text-xs text-gray-400">模拟订单 {order.id}</p>
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">圆满送达</span>
        </div>

        {featuredItem && (
          <div className="mt-5 rounded-2xl bg-[#fff8eb] p-4">
            <div className="text-xs font-semibold text-amber-700">今晚的记忆卡片</div>
            <div className="mt-2 text-lg font-black">「{featuredItem.item.name}」</div>
            <p className="mt-1 text-sm leading-6 text-[#806a45]">这道菜没有被吃掉，但它确实陪你认真期待了一会儿。</p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-gray-500">本次情绪收获</span>
          <span className="font-bold text-orange-600">期待值 +1 · 松弛感 +1</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-500">模拟金额</span>
          <span className="font-bold">¥{order.total.toFixed(2)}</span>
        </div>
      </section>

      <section className="mx-4 mt-4 rounded-[28px] bg-[#342a28] p-5 text-white">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">🧑‍🍳</div>
          <div>
            <p className="text-xs text-white/50">店主留言</p>
            <p className="mt-1 text-sm leading-6">“今晚辛苦了。没关系，你不一定非要吃点什么，想回来逛逛的时候我们还在。”</p>
          </div>
        </div>
      </section>

      <div className="mx-4 mt-6 grid grid-cols-2 gap-3">
        <button onClick={() => setSaved(true)} className={`rounded-2xl border py-3.5 text-sm font-bold ${saved ? 'border-green-200 bg-green-50 text-green-700' : 'border-orange-200 bg-white text-orange-600'}`}>
          {saved ? '已收藏这份记忆' : '收藏这份记忆'}
        </button>
        <button onClick={orderAgain} className="rounded-2xl bg-[#ff6b35] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200">回店里再看看</button>
      </div>
      <button onClick={() => { sessionStorage.removeItem('fakeaway.activeOrder'); navigate('/') }} className="mx-auto mt-5 block text-sm text-gray-400">先回首页</button>
    </main>
  )
}
