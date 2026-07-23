import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from '../../contexts/CartContext'

const CART_STORAGE_KEY = 'fakeaway.carts'

function readStoredCarts() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}')
    return stored?.version === 1 && stored.carts && typeof stored.carts === 'object'
      ? stored.carts
      : {}
  } catch {
    return {}
  }
}

function restaurantSnapshot(restaurant) {
  return {
    id: restaurant.id,
    name: restaurant.name,
    image: restaurant.image,
    deliveryTime: restaurant.deliveryTime,
    deliveryFee: restaurant.deliveryFee ?? 0,
    minPrice: restaurant.minPrice ?? restaurant.minOrder ?? 0,
    couponAmount: restaurant.couponAmount ?? 0,
    description: restaurant.description,
    waitingProfile: restaurant.waitingProfile,
    listProfile: restaurant.listProfile,
  }
}

function hasItems(items) {
  return Object.values(items || {}).some((entry) => Number(entry?.quantity) > 0)
}

export default function CartProvider({ children }) {
  const [carts, setCarts] = useState(readStoredCarts)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, carts }))
    } catch {
      // The in-memory cart remains usable when browser storage is unavailable.
    }
  }, [carts])

  const updateRestaurantCart = useCallback((restaurant, update) => {
    if (!restaurant?.id) return
    setCarts((current) => {
      const currentItems = current[restaurant.id]?.items || {}
      const nextItems = typeof update === 'function' ? update(currentItems) : update

      if (!hasItems(nextItems)) {
        if (!current[restaurant.id]) return current
        const next = { ...current }
        delete next[restaurant.id]
        return next
      }

      return {
        ...current,
        [restaurant.id]: {
          restaurant: restaurantSnapshot(restaurant),
          items: nextItems,
          updatedAt: Date.now(),
        },
      }
    })
  }, [])

  const clearRestaurantCart = useCallback((restaurantId) => {
    setCarts((current) => {
      if (!current[restaurantId]) return current
      const next = { ...current }
      delete next[restaurantId]
      return next
    })
  }, [])

  const clearAllCarts = useCallback(() => setCarts({}), [])

  const summary = useMemo(() => {
    const records = Object.values(carts)
    return {
      restaurantCount: records.length,
      totalCount: records.reduce((sum, record) => sum + Object.values(record.items || {})
        .reduce((itemSum, entry) => itemSum + (Number(entry.quantity) || 0), 0), 0),
    }
  }, [carts])

  const value = useMemo(() => ({
    carts,
    ...summary,
    updateRestaurantCart,
    clearRestaurantCart,
    clearAllCarts,
  }), [carts, clearAllCarts, clearRestaurantCart, summary, updateRestaurantCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
