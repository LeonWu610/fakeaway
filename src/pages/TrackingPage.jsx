import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import config from '../data/config.json'
import AppImage from '../components/common/AppImage'
import { formatClock, formatRemaining, getEstimatedArrivalAt, getFocusedSeconds, readActiveOrder, writeActiveOrder } from '../utils/orderTime'

const DEFAULT_STAGES = [
  { key: 'accepted', label: '商家已接单', detail: '订单已经稳稳接住，接下来交给想象中的后厨。' },
  { key: 'cooking', label: '正在认真备餐', detail: '后厨慢慢忙起来了，你可以把这段时间留给自己。' },
  { key: 'picked', label: '想象骑手已取餐', detail: '餐袋已经出发，热气和香味都被好好收着。' },
  { key: 'nearby', label: '正在靠近你', detail: '快到想象中的门口了，不用下楼，也不用留意电话。' },
]

const STAGE_THRESHOLDS = [0, 0.22, 0.62, 0.84]
const TASK_OPTIONS = [
  { key: 'focus', label: '专注推进', hint: '把最小的一步往前推一点' },
  { key: 'tidy', label: '收拾一小块', hint: '只整理目光所及的一小处' },
  { key: 'read', label: '读几页', hint: '读到哪里都算数' },
  { key: 'free', label: '自由任务', hint: '给此刻真正想做的事' },
]

function ScooterIcon({ className = 'h-10 w-10' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 16h10l2-6h-5l-2-3H7" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /><path d="M14 7h3l2 3" /></svg>
}

export default function TrackingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialOrder = location.state?.order || readActiveOrder()
  const [order, setOrder] = useState(initialOrder)
  const [now, setNow] = useState(Date.now())
  const [taskName, setTaskName] = useState(initialOrder?.waitingTask?.name || '')

  const arrivalAt = getEstimatedArrivalAt(order)
  const totalDuration = Math.max(1, arrivalAt - (order?.createdAt || arrivalAt))
  const remaining = Math.max(0, arrivalAt - now)
  const progress = Math.min(1, Math.max(0, (now - (order?.createdAt || now)) / totalDuration))

  useEffect(() => {
    if (!order) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [order])

  useEffect(() => {
    if (order && now >= arrivalAt) navigate('/delivered', { replace: true, state: { order: readActiveOrder() || order } })
  }, [arrivalAt, navigate, now, order])

  const stages = useMemo(() => {
    const customDetails = order?.restaurant?.waitingProfile?.stages
    if (!Array.isArray(customDetails) || customDetails.length !== DEFAULT_STAGES.length) return DEFAULT_STAGES
    return DEFAULT_STAGES.map((stage, index) => ({ ...stage, detail: customDetails[index] }))
  }, [order])
  const stageIndex = STAGE_THRESHOLDS.reduce((current, threshold, index) => progress >= threshold ? index : current, 0)
  const riderName = useMemo(() => {
    if (!order) return ''
    const index = Number(String(order.id).replace(/\D/g, '').slice(-2) || 0) % config.riderNames.length
    return config.riderNames[index]
  }, [order])
  const focusSeconds = getFocusedSeconds(order?.waitingTask, now)

  function updateTask(patch) {
    const current = order.waitingTask || { type: 'focus', name: '', focusSeconds: 0, isRunning: false, timerStartedAt: null, completedAt: null }
    const updatedOrder = { ...order, waitingTask: { ...current, ...patch, updatedAt: Date.now() } }
    writeActiveOrder(updatedOrder)
    setOrder(updatedOrder)
  }

  function chooseTask(type) {
    const option = TASK_OPTIONS.find((item) => item.key === type)
    const name = taskName || option.label
    setTaskName(name)
    updateTask({ type, name, completedAt: null })
  }

  function saveTaskName() {
    if (taskName.trim()) updateTask({ name: taskName.trim() })
  }

  function toggleTimer() {
    const task = order.waitingTask
    if (!task) {
      chooseTask('focus')
      return
    }
    if (task.completedAt) return
    if (task.isRunning) {
      updateTask({ focusSeconds: getFocusedSeconds(task), isRunning: false, timerStartedAt: null })
    } else {
      updateTask({ name: taskName.trim() || task.name, isRunning: true, timerStartedAt: Date.now() })
    }
  }

  function completeTask() {
    const task = order.waitingTask
    if (!task || task.completedAt) return
    updateTask({ name: taskName.trim() || task.name, focusSeconds: getFocusedSeconds(task), isRunning: false, timerStartedAt: null, completedAt: Date.now() })
  }

  if (!order) {
    return <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-8 text-center"><div className="mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"><ScooterIcon /></div><h1 className="text-xl font-bold">还没有正在等待的订单</h1><p className="mt-2 text-sm text-gray-500">去挑一家今晚看起来最顺眼的店吧。</p><button onClick={() => navigate('/')} className="mt-6 rounded-full bg-[var(--brand-primary)] px-7 py-3 text-sm font-semibold text-white">去逛逛</button></main>
  }

  const stage = stages[stageIndex]
  const timerLabel = `${String(Math.floor(focusSeconds / 60)).padStart(2, '0')}:${String(focusSeconds % 60).padStart(2, '0')}`

  return (
    <main className="min-h-screen bg-[var(--background)] pb-8 text-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-deep)] to-[var(--brand-night)] px-5 pb-9 pt-5 text-white">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative flex items-center justify-between"><button onClick={() => navigate('/')} aria-label="返回首页" className="h-9 w-9 rounded-full bg-black/10 text-xl">×</button><span className="rounded-full bg-black/10 px-3 py-1 text-xs">模拟订单 · {order.id}</span></div>
        <div className="relative mt-7 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-inner"><ScooterIcon /></div><p className="mt-4 text-sm text-white/75">预计 {formatClock(arrivalAt)} 到达 · 还有</p><div className="mt-1 text-4xl font-black tracking-tight">{formatRemaining(remaining)}</div><h1 className="mt-3 text-xl font-bold">{stage.label}</h1><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/80">{stage.detail}</p></div>
      </section>

      <section className="relative -mt-4 mx-3 rounded-3xl bg-white p-5 shadow-[0_10px_35px_rgba(32,38,46,0.08)]">
        <div className="flex items-center gap-3"><AppImage src={order.items[0]?.item.imageUrl || order.items[0]?.item.image} alt={order.items[0]?.item.name || ''} className="h-12 w-12 flex-none rounded-xl object-cover" sizes="48px" width={48} height={48} /><div className="min-w-0 flex-1"><div className="font-bold">{order.restaurant.name}</div><div className="mt-1 text-xs text-gray-400">{order.items.length} 种想吃的 · 模拟实付 ¥{order.total.toFixed(2)}</div></div><div className="rounded-2xl bg-[var(--brand-primary-soft)] px-3 py-2 text-right"><div className="text-xs text-gray-400">想象骑手</div><div className="text-sm font-bold text-[var(--brand-primary-deep)]">{riderName}</div></div></div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-coral)] to-[var(--brand-primary)] transition-all duration-500" style={{ width: `${progress * 100}%` }} /></div>
        <div className="mt-5 grid grid-cols-4 gap-1">{stages.map((item, index) => <div key={item.key} className={`text-center text-[10px] leading-4 ${index <= stageIndex ? 'font-semibold text-[var(--brand-primary-deep)]' : 'text-gray-400'}`}><div className={`mx-auto mb-1 h-2 w-2 rounded-full ${index <= stageIndex ? 'bg-[var(--brand-primary)]' : 'bg-gray-200'}`} />{item.label}</div>)}</div>
      </section>

      <section className="mx-3 mt-3 overflow-hidden rounded-3xl bg-[var(--brand-night)] p-5 text-white shadow-[var(--shadow-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">等待也可以归你</p><h2 className="mt-2 text-xl font-black">趁餐还在路上，做点正事</h2><p className="mt-1 text-sm leading-6 text-white/60">挑一件够轻的小事。做多少都算，没完成也不会扣分。</p>
        <div className="mt-4 grid grid-cols-2 gap-2">{TASK_OPTIONS.map((option) => { const selected = order.waitingTask?.type === option.key; return <button key={option.key} onClick={() => chooseTask(option.key)} className={`rounded-2xl border p-3 text-left transition ${selected ? 'border-[var(--brand-coral)] bg-white/15' : 'border-white/10 bg-white/5'}`}><span className="block text-sm font-bold">{option.label}</span><span className="mt-1 block text-[10px] leading-4 text-white/45">{option.hint}</span></button> })}</div>
        {order.waitingTask && <div className="mt-4 rounded-2xl bg-white/10 p-4"><label htmlFor="waiting-task" className="text-xs text-white/55">这次具体想做什么</label><input id="waiting-task" value={taskName} maxLength={40} disabled={Boolean(order.waitingTask.completedAt)} onChange={(event) => setTaskName(event.target.value)} onBlur={saveTaskName} placeholder="写下一句就够了" className="mt-2 w-full rounded-xl border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--brand-coral)] disabled:opacity-60" /><div className="mt-4 flex items-center justify-between"><div><p className="font-mono text-3xl font-black tabular-nums">{timerLabel}</p><p className="mt-1 text-[10px] text-white/40">专注计时与配送倒计时互不打扰</p></div>{order.waitingTask.completedAt ? <span className="rounded-full bg-[var(--success)]/20 px-3 py-2 text-xs font-bold text-[#8fe0bd]">本次已打卡</span> : <button onClick={toggleTimer} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[var(--brand-night)]">{order.waitingTask.isRunning ? '暂停一下' : focusSeconds > 0 ? '继续计时' : '开始计时'}</button>}</div>{!order.waitingTask.completedAt && <button onClick={completeTask} className="mt-4 w-full rounded-xl border border-white/15 py-2.5 text-sm font-semibold text-white/80">完成打卡</button>}</div>}
      </section>

      <button onClick={() => navigate('/delivered', { state: { order: readActiveOrder() || order } })} className="mx-auto mt-5 block text-xs text-gray-400 underline underline-offset-4">立即送达（体验预览）</button>
    </main>
  )
}
