import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppImage from '../components/common/AppImage'
import BottomNav from '../components/common/BottomNav'
import { useCart } from '../contexts/CartContext'

function BagIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  )
}

function cartSubtotal(items) {
  return Object.values(items).reduce((sum, entry) => (
    sum + (entry.unitPrice ?? entry.item.price) * entry.quantity
  ), 0)
}

export default function CartPage() {
  const navigate = useNavigate()
  const {
    carts,
    totalCount,
    restaurantCount,
    updateRestaurantCart,
    clearRestaurantCart,
    clearAllCarts,
  } = useCart()
  const records = useMemo(() => Object.values(carts).sort((a, b) => b.updatedAt - a.updatedAt), [carts])

  function changeQuantity(record, key, delta) {
    updateRestaurantCart(record.restaurant, (current) => {
      const entry = current[key]
      if (!entry) return current
      const nextQuantity = entry.quantity + delta
      const next = { ...current }
      if (nextQuantity <= 0) delete next[key]
      else next[key] = { ...entry, quantity: nextQuantity }
      return next
    })
  }

  function checkout(record) {
    navigate('/checkout', {
      state: {
        cartItems: record.items,
        restaurant: record.restaurant,
        couponAmount: record.restaurant.couponAmount || 0,
      },
    })
  }

  return (
    <main className="min-h-screen bg-[var(--background)] pb-24 text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 flex items-end justify-between bg-white px-4 pb-3 pt-[max(14px,env(safe-area-inset-top))] shadow-sm">
        <div>
          <h1 className="text-[20px] font-black">购物车</h1>
          <p className="mt-0.5 text-[10px] text-gray-400">
            {totalCount > 0 ? `${totalCount} 件心动，来自 ${restaurantCount} 家小店` : '挑中的那一口，会先在这里等你'}
          </p>
        </div>
        {totalCount > 0 && <button onClick={clearAllCarts} className="rounded-full border border-gray-200 px-3 py-1.5 text-[10px] text-gray-500">全部清空</button>}
      </header>

      {records.length === 0 ? (
        <section className="px-5 pt-20 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-[32px] bg-gradient-to-br from-[var(--brand-primary-soft)] to-[var(--brand-coral-soft)] text-[var(--brand-primary)]">
            <BagIcon className="h-12 w-12" />
          </div>
          <h2 className="mt-5 text-lg font-black">购物车还在等第一件心动</h2>
          <p className="mx-auto mt-2 max-w-[260px] text-xs leading-5 text-gray-400">进店挑几样吧。离开店铺后也不会丢，回来还能接着选。</p>
          <button onClick={() => navigate('/')} className="mt-6 rounded-full bg-[var(--brand-primary)] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[rgba(85,54,219,.2)]">去逛逛</button>
        </section>
      ) : (
        <section className="space-y-3 px-3 pt-3">
          <div className="rounded-2xl bg-[var(--brand-night)] px-4 py-3 text-[11px] leading-5 text-white/65">
            不同店铺会分别结算、分别出发。购物车只保存在本机，不会产生真实购买。
          </div>
          {records.map((record) => {
            const { restaurant, items } = record
            const entries = Object.values(items)
            const subtotal = cartSubtotal(items)
            const discount = restaurant.couponAmount || 0
            const total = Math.max(0, subtotal - discount + (restaurant.deliveryFee || 0))
            return (
              <article key={restaurant.id} className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-2 border-b border-gray-100 p-3">
                  <button onClick={() => navigate(`/restaurant/${restaurant.id}`)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <AppImage src={restaurant.image} alt={restaurant.name} className="h-11 w-11 rounded-xl object-cover" sizes="44px" width={44} height={44} />
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-[14px] font-black">{restaurant.name}</h2>
                      <p className="mt-0.5 text-[9px] text-gray-400">回店里继续挑选 ›</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => clearRestaurantCart(restaurant.id)}
                    className="rounded-full bg-gray-100 px-2.5 py-1.5 text-[9px] text-gray-500"
                  >
                    清空本店
                  </button>
                </div>

                <div className="divide-y divide-gray-50 px-3">
                  {entries.map((entry) => (
                    <div key={entry.key || entry.item.id} className="flex items-center gap-3 py-3">
                      <AppImage src={entry.item.imageUrl || entry.item.image} alt={entry.item.name} className="h-14 w-14 flex-none rounded-xl bg-gray-100 object-cover" sizes="56px" width={56} height={56} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[12px] font-bold">{entry.item.name}</h3>
                        {entry.specSummary && <p className="mt-0.5 truncate text-[9px] text-gray-400">{entry.specSummary}</p>}
                        <strong className="mt-1 block text-[13px] text-[var(--price-red)]">¥{(entry.unitPrice ?? entry.item.price).toFixed(2)}</strong>
                      </div>
                      <div className="flex flex-none items-center gap-2">
                        <button onClick={() => changeQuantity(record, entry.key, -1)} className="grid h-7 w-7 place-items-center rounded-full border border-[var(--brand-primary)] text-base font-bold text-[var(--brand-primary)]" aria-label={`减少${entry.item.name}`}>−</button>
                        <span className="min-w-4 text-center text-xs font-bold">{entry.quantity}</span>
                        <button onClick={() => changeQuantity(record, entry.key, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-primary)] text-base font-bold text-white" aria-label={`增加${entry.item.name}`}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-gray-400">已含模拟优惠 ¥{discount.toFixed(2)}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">合计 <strong className="ml-1 text-lg text-[var(--price-red)]">¥{total.toFixed(2)}</strong></p>
                  </div>
                  <button onClick={() => checkout(record)} className="rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-coral)] px-5 py-2.5 text-[12px] font-black text-white shadow-md">去结算</button>
                </div>
              </article>
            )
          })}
        </section>
      )}

      <BottomNav activeTab="cart" />
    </main>
  )
}
