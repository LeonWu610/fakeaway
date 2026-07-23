import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import config from '../data/config.json'
import AppImage from '../components/common/AppImage'
import { DeliveryArrivalOverlay } from '../components/experience/ExperienceOverlays'
import { ACTIVE_ORDER_KEY, getFocusedSeconds, readActiveOrder } from '../utils/orderTime'
import { describeRelationshipOutcome, getFavoriteItem, saveMemory, settleRelationship } from '../utils/relationship'

const DELIVERY_ARRIVAL_SEEN_KEY = 'fakeaway.deliveryArrivalSeen'
const MEMORY_SPARKS = [
  { x: -54, y: -50, symbol: '♥', color: '#ff806f', delay: 0 },
  { x: -28, y: -68, symbol: '✦', color: '#ffd064', delay: 0.05 },
  { x: 0, y: -76, symbol: '♥', color: '#6d4aff', delay: 0.1 },
  { x: 30, y: -66, symbol: '✦', color: '#ff806f', delay: 0.14 },
  { x: 56, y: -48, symbol: '♥', color: '#ffd064', delay: 0.18 },
]

function hasSeenArrival(orderId) {
  if (!orderId) return true
  try {
    return sessionStorage.getItem(`${DELIVERY_ARRIVAL_SEEN_KEY}.${orderId}`) === '1'
      || sessionStorage.getItem(DELIVERY_ARRIVAL_SEEN_KEY) === String(orderId)
  } catch {
    return false
  }
}

function DeliveryIcon({ name, className }) {
  const icons = {
    bag: <><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    chef: <><path d="M7 11a4 4 0 0 1 1-7 4 4 0 0 1 8 0 4 4 0 0 1 1 7v3H7v-3Z" /><path d="M8 14v7h8v-7M10 18h4" /></>,
    spark: <><path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z" /></>,
  }
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}

function formatFocus(seconds) {
  if (seconds < 60) return `${seconds} 秒`
  return `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`
}

export default function DeliveredPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order || readActiveOrder()
  const [saved, setSaved] = useState(false)
  const [showSaveCelebration, setShowSaveCelebration] = useState(false)
  const [relationshipResult, setRelationshipResult] = useState(null)
  const [showArrival, setShowArrival] = useState(() => Boolean(order) && !hasSeenArrival(order.id))
  const settledOrderRef = useRef(null)

  const completionText = useMemo(() => {
    if (!order) return config.completionTexts[0]
    const index = Number(String(order.id).replace(/\D/g, '').slice(-2) || 0) % config.completionTexts.length
    return config.completionTexts[index]
  }, [order])
  const featuredItem = order?.items?.reduce((best, entry) => !best || entry.item.price * entry.quantity > best.item.price * best.quantity ? entry : best, null)
  const task = order?.waitingTask
  const focusSeconds = task ? getFocusedSeconds(task, task.completedAt || Date.now()) : 0
  const taskCompleted = Boolean(task?.completedAt)
  const outcome = taskCompleted
    ? { eyebrow: '等待已兑换', title: task.name || '一件小事', detail: `你把路上的这段时间，换成了 ${formatFocus(focusSeconds)} 的认真投入。完成不必宏大，这一步已经属于你。` }
    : task
      ? { eyebrow: '等待也被好好使用', title: focusSeconds > 0 ? `${formatFocus(focusSeconds)} 的尝试` : '给自己留了一点余地', detail: '没有打卡也没有关系。开始过、停下来过，或只是期待了一会儿，都不是空白。' }
      : { eyebrow: '等待已结算', title: '一段不用赶路的期待', detail: '你没有欠这段时间一项成果。放空、休息和等一份喜欢，也都有自己的价值。' }

  useEffect(() => {
    if (!showArrival) return undefined
    try {
      sessionStorage.setItem(`${DELIVERY_ARRIVAL_SEEN_KEY}.${order.id}`, '1')
    } catch {
      // Replaying is preferable to blocking the delivered page when storage is unavailable.
    }
    const timer = window.setTimeout(() => setShowArrival(false), 3800)
    return () => window.clearTimeout(timer)
  }, [order?.id, showArrival])

  useEffect(() => {
    if (!showSaveCelebration) return undefined
    const timer = window.setTimeout(() => setShowSaveCelebration(false), 1500)
    return () => window.clearTimeout(timer)
  }, [showSaveCelebration])

  useEffect(() => {
    if (!order || settledOrderRef.current === order.id) return
    settledOrderRef.current = order.id
    const result = settleRelationship(order, focusSeconds)
    if (result) {
      setRelationshipResult(result)
      const items = (order.items || []).map((entry) => ({ id: entry.item?.id, name: entry.item?.name, quantity: entry.quantity }))
      saveMemory({
        orderId: order.id,
        restaurantId: order.restaurant.id,
        restaurantName: order.restaurant.name,
        itemName: featuredItem?.item.name,
        items,
        createdAt: order.createdAt,
        deliveredAt: Date.now(),
        relationshipStage: result.currentStage.label,
        waitingTask: task ? { name: task.name, focusSeconds, completedAt: task.completedAt || null } : null,
      })
    }
    try {
      const existing = JSON.parse(localStorage.getItem('fakeaway.memories') || '[]')
      setSaved(existing.some((item) => item.orderId === order.id && item.saved))
    } catch {
      // Storage being unavailable should not block the celebration.
    }
  }, [featuredItem?.item.name, focusSeconds, order, task])

  if (!order) return <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-8 text-center"><div className="grid h-20 w-20 place-items-center rounded-3xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"><DeliveryIcon name="bag" className="h-11 w-11" /></div><h1 className="mt-4 text-xl font-bold">这份想象中的外卖已经收好</h1><button onClick={() => navigate('/', { replace: true })} className="mt-6 rounded-full bg-[var(--brand-primary)] px-7 py-3 text-sm font-semibold text-white">再逛一会儿</button></main>

  function toggleSaved() {
    const nextSaved = !saved
    setSaved(nextSaved)
    setShowSaveCelebration(nextSaved)
    try {
      const memories = JSON.parse(localStorage.getItem('fakeaway.memories') || '[]')
      localStorage.setItem('fakeaway.memories', JSON.stringify(memories.map((memory) => memory.orderId === order.id ? { ...memory, saved: nextSaved } : memory)))
    } catch {
      // Keep the local interaction available even if storage is blocked.
    }
  }

  function leave(destination) {
    sessionStorage.removeItem(ACTIVE_ORDER_KEY)
    navigate(destination, {
      replace: true,
      state: destination.startsWith('/restaurant/') ? { fromDelivered: true } : undefined,
    })
  }

  return (
    <main className="delivered-page min-h-screen overflow-hidden bg-[var(--background)] pb-10 text-gray-900">
      <AnimatePresence>
        {showArrival && <DeliveryArrivalOverlay restaurantName={order.restaurant.name} onDismiss={() => setShowArrival(false)} />}
      </AnimatePresence>
      <section className="delivery-celebration relative isolate overflow-hidden bg-[var(--brand-night)] px-5 pb-14 pt-6 text-center text-white">
        <div className="celebration-glow" /><div className="celebration-rays" aria-hidden="true" />
        {[...Array(12)].map((_, index) => <i key={index} className={`confetti confetti-${index + 1}`} aria-hidden="true" />)}
        <DeliveryIcon name="spark" className="spark spark-a" /><DeliveryIcon name="spark" className="spark spark-b" />
        <button onClick={() => leave('/')} aria-label="关闭" className="absolute left-5 top-5 z-20 h-9 w-9 rounded-full bg-white/10 text-xl">×</button>
        <div className="delivery-arrival relative z-10 mx-auto mt-10"><p className="text-xs font-semibold tracking-[0.32em] text-white/55">想象中的餐袋落地</p><h1 className="delivery-word mt-3 bg-gradient-to-b from-white to-[#dacfff] bg-clip-text text-transparent">送达</h1><div className="mx-auto mt-1 h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-coral)] to-transparent" /><p className="mx-auto mt-5 max-w-xs text-xl font-black leading-snug">{completionText}</p><p className="mt-3 text-sm leading-6 text-white/60">这一单没有真实配送，也没有真实消费。<br />但刚才的期待与时间，都是真的。</p></div>
      </section>

      <section className="delivery-card relative z-10 -mt-7 mx-4 rounded-[28px] bg-white p-5 shadow-[0_18px_55px_rgba(36,33,61,0.16)]">
        <div className="flex items-center gap-3 border-b border-dashed border-gray-200 pb-4"><AppImage src={order.restaurant.image} alt={order.restaurant.name} className="h-12 w-12 rounded-2xl object-cover" sizes="48px" width={48} height={48} /><div className="min-w-0 flex-1"><h2 className="truncate text-base font-bold">{order.restaurant.name}</h2><p className="mt-1 text-xs text-gray-400">想象订单 {order.id}</p></div><span className="rounded-full bg-[var(--brand-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-primary-deep)]">圆满送达</span></div>
        <div className="py-6 text-center"><p className="text-xs font-semibold tracking-[0.2em] text-gray-400">今晚的想象清单</p><div className="mt-2 flex items-baseline justify-center gap-2"><span className="text-sm text-gray-400 line-through">¥{order.total.toFixed(2)}</span><strong className="text-5xl font-black text-[var(--brand-primary)]">¥0</strong></div><p className="mt-2 text-xs text-gray-400">想象有价，现实扣款为零</p></div>
        <div className="rounded-3xl bg-gradient-to-br from-[var(--brand-primary-soft)] to-[var(--brand-coral-soft)] p-5"><p className="text-xs font-bold text-[var(--brand-coral)]">{outcome.eyebrow}</p><h3 className="mt-2 text-2xl font-black leading-tight">{outcome.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{outcome.detail}</p>{taskCompleted && <div className="mt-4 flex gap-2"><span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[var(--brand-primary-deep)]">完成打卡</span><span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[var(--brand-primary-deep)]">专注 {formatFocus(focusSeconds)}</span></div>}</div>
      </section>

      {relationshipResult && <RelationshipGrowth result={relationshipResult} />}

      {featuredItem && <section className="delivery-card mx-4 mt-4 overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]"><div className="relative h-36 overflow-hidden"><AppImage src={featuredItem.item.imageUrl || featuredItem.item.image} alt={featuredItem.item.name} className="h-full w-full object-cover" sizes="448px" /><div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-night)]/80 to-transparent" /><div className="absolute bottom-4 left-4 right-4 text-white"><p className="text-[10px] font-semibold tracking-[0.2em] text-white/65">今晚的记忆卡</p><h3 className="mt-1 text-xl font-black">「{featuredItem.item.name}」</h3></div></div><p className="p-4 text-sm leading-6 text-[var(--text-secondary)]">这道菜没有被真的吃掉，却陪你等过一段完整的时间。愿今晚剩下的部分，也对你温柔一点。</p></section>}

      <section className="delivery-card mx-4 mt-4 rounded-[28px] bg-[var(--brand-night)] p-5 text-white"><div className="flex items-start gap-3"><div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-white/10"><DeliveryIcon name="chef" className="h-7 w-7" /></div><div><p className="text-xs text-white/45">店主留言</p><p className="mt-1 text-sm leading-6">“今晚辛苦了。做完了一点事很好，什么都没做也很好。下次想回来逛逛，我们还在这里亮着灯。”</p></div></div></section>

      <div className="mx-4 mt-6 grid grid-cols-2 gap-3">
        <div className="relative">
          <AnimatePresence>
            {showSaveCelebration && (
              <>
                <motion.div
                  role="status"
                  className="pointer-events-none absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--brand-night)] px-3 py-2 text-[10px] font-bold text-white shadow-xl"
                  initial={{ y: 8, scale: 0.75, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: -8, scale: 0.9, opacity: 0 }}
                >
                  ♥ 已收进今晚的记忆
                </motion.div>
                <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
                  {MEMORY_SPARKS.map((spark, index) => (
                    <motion.span
                      key={`${spark.symbol}-${index}`}
                      className="absolute left-1/2 top-1/2 text-lg font-black"
                      style={{ color: spark.color }}
                      initial={{ x: 0, y: 0, scale: 0.35, opacity: 0 }}
                      animate={{ x: spark.x, y: spark.y, scale: [0.35, 1.2, 0.8], opacity: [0, 1, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, delay: spark.delay, ease: 'easeOut' }}
                    >
                      {spark.symbol}
                    </motion.span>
                  ))}
                </div>
              </>
            )}
          </AnimatePresence>
          <motion.button
            onClick={toggleSaved}
            animate={showSaveCelebration ? { scale: [1, 0.94, 1.08, 1], rotate: [0, -2, 2, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className={`h-full w-full rounded-2xl border py-3.5 text-sm font-bold ${saved ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary-deep)]' : 'border-orange-200 bg-white text-[var(--brand-coral)]'}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={saved ? 'saved' : 'unsaved'} className="block" initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -5, opacity: 0 }}>
                {saved ? '♥ 已收藏这份记忆' : '收藏这份记忆'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
        <button onClick={() => leave(`/restaurant/${order.restaurant.id}`)} className="rounded-2xl bg-[var(--brand-primary)] py-3.5 text-sm font-bold text-white shadow-lg shadow-[rgba(85,54,219,0.2)]">回店里再看看</button>
      </div>
      <button onClick={() => leave('/')} className="mx-auto mt-5 block text-sm text-gray-400">先回首页</button>
    </main>
  )
}

function RelationshipGrowth({ result }) {
  const favorite = getFavoriteItem(result.relationship)
  return (
    <section className="delivery-card mx-4 mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-[var(--brand-night)] via-[#39345b] to-[#5b477f] p-5 text-white shadow-[var(--shadow-float)]">
      <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold tracking-[0.16em] text-[#ffc8bf]">这家店又记住了你一点</p><h3 className="mt-2 text-xl font-black">{result.currentStage.label}</h3></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/75">第 {result.relationship.completedOrders} 次</span></div>
      <p className="mt-2 text-sm leading-6 text-white/65">{result.stageChanged ? `从“${result.previousStage.label}”走到了“${result.currentStage.label}”。不必赶进度，只是这盏灯更熟悉你了。` : result.grew ? '没有签到，也没有连续天数。只是这一回相遇，被安静地放进了记忆。' : '这一单已经被记住，刷新页面不会让关系重复增长。'}</p>
      <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-white/10 p-3"><p className="text-[9px] text-white/40">渐渐熟悉的口味</p><p className="mt-1 truncate text-[12px] font-bold">{favorite?.name || '还在慢慢认识'}</p></div><div className="rounded-2xl bg-white/10 p-3"><p className="text-[9px] text-white/40">累计等待成果</p><p className="mt-1 truncate text-[12px] font-bold">{describeRelationshipOutcome(result.relationship)}</p></div></div>
    </section>
  )
}
