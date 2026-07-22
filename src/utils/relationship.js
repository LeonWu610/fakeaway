export const RELATIONSHIPS_KEY = 'fakeaway.relationships'
export const MEMORIES_KEY = 'fakeaway.memories'

const EMPTY_RELATIONSHIPS = Object.freeze({})

function safeRead(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null')
    return value && typeof value === 'object' ? value : fallback
  } catch {
    return fallback
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function positiveNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : 0
}

function timestamp(value, fallback = Date.now()) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

function normalizeFavoriteItems(items) {
  if (!items || typeof items !== 'object') return {}
  return Object.fromEntries(Object.entries(items).map(([key, item]) => [key, {
    id: item?.id || key,
    name: item?.name || key,
    quantity: positiveNumber(item?.quantity),
  }]).filter(([, item]) => item.quantity > 0))
}

function normalizeRelationship(relationship, restaurantId) {
  const completedOrders = positiveNumber(relationship?.completedOrders ?? relationship?.visits)
  return {
    restaurantId,
    restaurantName: relationship?.restaurantName || '',
    visits: Math.max(positiveNumber(relationship?.visits), completedOrders),
    completedOrders,
    favoriteItems: normalizeFavoriteItems(relationship?.favoriteItems),
    totalFocusSeconds: positiveNumber(relationship?.totalFocusSeconds),
    completedTasks: positiveNumber(relationship?.completedTasks),
    firstMetAt: timestamp(relationship?.firstMetAt, 0),
    lastMetAt: timestamp(relationship?.lastMetAt, 0),
    lastOrderId: relationship?.lastOrderId || null,
    settledOrderIds: Array.isArray(relationship?.settledOrderIds) ? [...new Set(relationship.settledOrderIds.filter(Boolean))] : [],
  }
}

function memoryItems(memory) {
  if (Array.isArray(memory?.items) && memory.items.length) {
    return memory.items.map((item) => ({
      id: item.id || item.itemId || item.name,
      name: item.name || item.itemName || '想象中的美味',
      quantity: positiveNumber(item.quantity) || 1,
    }))
  }
  return memory?.itemName ? [{ id: memory.itemId || memory.itemName, name: memory.itemName, quantity: 1 }] : []
}

function addItems(favoriteItems, items) {
  const next = { ...favoriteItems }
  items.forEach((item) => {
    const key = String(item.id || item.name)
    if (!key) return
    const current = next[key]
    next[key] = {
      id: item.id || current?.id || key,
      name: item.name || current?.name || key,
      quantity: positiveNumber(current?.quantity) + (positiveNumber(item.quantity) || 1),
    }
  })
  return next
}

function applyMemory(relationship, memory) {
  const orderId = memory?.orderId
  if (!orderId || relationship.settledOrderIds.includes(orderId)) return relationship
  const metAt = timestamp(memory.deliveredAt || memory.createdAt)
  const focusSeconds = positiveNumber(memory.waitingTask?.focusSeconds)
  return {
    ...relationship,
    restaurantName: relationship.restaurantName || memory.restaurantName || '',
    visits: relationship.visits + 1,
    completedOrders: relationship.completedOrders + 1,
    favoriteItems: addItems(relationship.favoriteItems, memoryItems(memory)),
    totalFocusSeconds: relationship.totalFocusSeconds + focusSeconds,
    completedTasks: relationship.completedTasks + Number(Boolean(memory.waitingTask?.completedAt)),
    firstMetAt: relationship.firstMetAt || metAt,
    lastMetAt: Math.max(relationship.lastMetAt, metAt),
    lastOrderId: relationship.lastMetAt > metAt ? relationship.lastOrderId : orderId,
    settledOrderIds: [...relationship.settledOrderIds, orderId],
  }
}

export function readMemories() {
  const memories = safeRead(MEMORIES_KEY, [])
  return Array.isArray(memories) ? memories : []
}

export function readRelationships({ includeMemories = true } = {}) {
  const stored = safeRead(RELATIONSHIPS_KEY, EMPTY_RELATIONSHIPS)
  const relationships = Object.fromEntries(Object.entries(stored).map(([restaurantId, relationship]) => [restaurantId, normalizeRelationship(relationship, restaurantId)]))
  if (!includeMemories) return relationships

  return readMemories().reduce((result, memory) => {
    if (!memory?.restaurantId) return result
    const current = result[memory.restaurantId] || normalizeRelationship(null, memory.restaurantId)
    result[memory.restaurantId] = applyMemory(current, memory)
    return result
  }, relationships)
}

export function getRelationship(restaurantId) {
  return readRelationships()[restaurantId] || normalizeRelationship(null, restaurantId)
}

export function settleRelationship(order, focusSeconds = 0) {
  if (!order?.id || !order?.restaurant?.id) return null
  const relationships = readRelationships()
  const restaurantId = order.restaurant.id
  const current = relationships[restaurantId] || normalizeRelationship(null, restaurantId)
  const previousStage = getRelationshipStage(current.completedOrders)

  if (current.settledOrderIds.includes(order.id)) {
    return { relationship: current, previousStage, currentStage: previousStage, grew: false, stageChanged: false }
  }

  const deliveredAt = Date.now()
  const items = (order.items || []).map((entry) => ({
    id: entry.item?.id || entry.item?.name,
    name: entry.item?.name || '想象中的美味',
    quantity: positiveNumber(entry.quantity) || 1,
  }))
  const relationship = {
    ...current,
    restaurantName: order.restaurant.name || current.restaurantName,
    visits: current.visits + 1,
    completedOrders: current.completedOrders + 1,
    favoriteItems: addItems(current.favoriteItems, items),
    totalFocusSeconds: current.totalFocusSeconds + positiveNumber(focusSeconds),
    completedTasks: current.completedTasks + Number(Boolean(order.waitingTask?.completedAt)),
    firstMetAt: current.firstMetAt || deliveredAt,
    lastMetAt: Math.max(current.lastMetAt, deliveredAt),
    lastOrderId: order.id,
    settledOrderIds: [...current.settledOrderIds, order.id],
  }
  relationships[restaurantId] = relationship
  safeWrite(RELATIONSHIPS_KEY, relationships)
  const currentStage = getRelationshipStage(relationship.completedOrders)
  return { relationship, previousStage, currentStage, grew: true, stageChanged: currentStage.level !== previousStage.level }
}

export function saveMemory(memory) {
  if (!memory?.orderId) return false
  const memories = readMemories()
  const index = memories.findIndex((item) => item.orderId === memory.orderId)
  const nextMemory = index >= 0 ? { ...memories[index], ...memory } : memory
  const next = index >= 0
    ? memories.map((item, itemIndex) => itemIndex === index ? nextMemory : item)
    : [nextMemory, ...memories]
  return safeWrite(MEMORIES_KEY, next.slice(0, 30))
}

export function getRelationshipStage(completedOrders = 0) {
  const count = positiveNumber(completedOrders)
  if (count >= 6) return { level: 3, label: '深夜老朋友', greeting: '灯还亮着，给你留着熟悉的位置。' }
  if (count >= 3) return { level: 2, label: '店里熟客', greeting: '又见面了，今晚也按自己的节奏来。' }
  if (count >= 1) return { level: 1, label: '见过几次', greeting: count === 1 ? '记得你来过一次，慢慢挑就好。' : '这已经是熟悉的脚步声了。' }
  return { level: 0, label: '第一次见面', greeting: '第一次见面，不着急，随便看看。' }
}

export function getFavoriteItem(relationship) {
  return Object.values(relationship?.favoriteItems || {}).sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name, 'zh-CN'))[0] || null
}

export function formatFocusDuration(seconds = 0) {
  const value = positiveNumber(seconds)
  if (value < 60) return value > 0 ? `${Math.floor(value)} 秒专注` : '还没有累计专注'
  const minutes = Math.floor(value / 60)
  if (minutes < 60) return `${minutes} 分钟专注`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} 小时 ${rest} 分钟专注` : `${hours} 小时专注`
}

export function describeRelationshipOutcome(relationship) {
  const focus = formatFocusDuration(relationship?.totalFocusSeconds)
  const tasks = positiveNumber(relationship?.completedTasks)
  return tasks > 0 ? `${focus} · 做完 ${tasks} 件小事` : focus
}
