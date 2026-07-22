export const ACTIVE_ORDER_KEY = 'fakeaway.activeOrder'

function hashText(value) {
  return String(value).split('').reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 2166136261)
}

export function createEstimatedDelivery(restaurant, createdAt = Date.now()) {
  const baseline = Number(restaurant?.deliveryTime) || 28
  const seed = hashText(`${restaurant?.id || restaurant?.name || 'fakeaway'}-${Math.floor(createdAt / 60000)}`)
  const offsets = [-4, -3, -1, 1, 2, 4, 6]
  let estimatedMinutes = Math.round(Math.max(18, Math.min(48, baseline + offsets[seed % offsets.length])))

  if (estimatedMinutes % 5 === 0) {
    estimatedMinutes += estimatedMinutes >= 47 ? -2 : 2
  }

  return {
    estimatedMinutes,
    estimatedArrivalAt: createdAt + estimatedMinutes * 60 * 1000,
  }
}

export function getEstimatedArrivalAt(order) {
  if (!order) return 0
  const persistedTarget = Number(order.estimatedArrivalAt)
  if (persistedTarget > 0) return persistedTarget
  return Number(order.createdAt || 0) + Math.max(18, Number(order.estimatedMinutes) || 28) * 60 * 1000
}

export function readActiveOrder() {
  try {
    return JSON.parse(sessionStorage.getItem(ACTIVE_ORDER_KEY))
  } catch {
    return null
  }
}

export function writeActiveOrder(order) {
  sessionStorage.setItem(ACTIVE_ORDER_KEY, JSON.stringify(order))
  return order
}

export function formatClock(timestamp) {
  if (!timestamp) return '--:--'
  return new Date(timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function formatRemaining(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes >= 60) return `${Math.floor(minutes / 60)}小时${minutes % 60}分`
  return minutes > 0 ? `${minutes}分${String(seconds).padStart(2, '0')}秒` : `${seconds}秒`
}

export function getFocusedSeconds(task, now = Date.now()) {
  if (!task) return 0
  const runningSeconds = task.isRunning && task.timerStartedAt
    ? Math.max(0, Math.floor((now - task.timerStartedAt) / 1000))
    : 0
  return Math.max(0, Number(task.focusSeconds) || 0) + runningSeconds
}
