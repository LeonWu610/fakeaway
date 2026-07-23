import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppImage from '../components/common/AppImage'
import { OrderLaunchOverlay } from '../components/experience/ExperienceOverlays'
import { createEstimatedDelivery, writeActiveOrder } from '../utils/orderTime'
import { useCart } from '../contexts/CartContext'

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartItems = {}, restaurant = {}, couponAmount = 0 } = location.state || {}
  const [pendingOrder, setPendingOrder] = useState(null)
  const { clearRestaurantCart } = useCart()

  const items = Object.values(cartItems)
  const subtotal = items.reduce((sum, { item, unitPrice, quantity }) => sum + (unitPrice ?? item.price) * quantity, 0)
  const discount = couponAmount > 0 ? couponAmount : 0
  const deliveryFee = restaurant.deliveryFee ?? 0
  const total = Math.max(0, subtotal - discount + deliveryFee)

  useEffect(() => {
    if (!pendingOrder) return undefined
    const timer = window.setTimeout(() => {
      navigate('/tracking', { replace: true, state: { order: pendingOrder } })
    }, 1900)
    return () => window.clearTimeout(timer)
  }, [navigate, pendingOrder])

  function handlePlaceOrder() {
    if (pendingOrder) return
    const now = Date.now()
    const deliveryEstimate = createEstimatedDelivery(restaurant, now)
    const order = {
      id: `FA${String(now).slice(-8)}`,
      restaurant,
      items: items.map(({ item, quantity, specs = [], specSummary = '', unitPrice }) => ({ item, quantity, specs, specSummary, unitPrice: unitPrice ?? item.price })),
      subtotal,
      discount,
      deliveryFee,
      total,
      createdAt: now,
      ...deliveryEstimate,
      waitingTask: null,
    }

    writeActiveOrder(order)
    clearRestaurantCart(restaurant.id)
    setPendingOrder(order)
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#999', marginBottom: 20 }}>购物车是空的</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 24px',
            background: 'var(--brand-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          返回点餐
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto', background: 'var(--background)', minHeight: '100vh' }}>
      <AnimatePresence>
        {pendingOrder && <OrderLaunchOverlay restaurantName={restaurant.name || '今晚的小店'} />}
      </AnimatePresence>
      {/* Header */}
      <div style={{ background: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #eee' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1 }}
        >
          ←
        </button>
        <span style={{ fontWeight: 600, fontSize: 17 }}>确认订单</span>
      </div>

      {/* Simulation notice */}
      <div style={{ background: 'var(--brand-primary-soft)', color: 'var(--brand-primary-deep)', padding: '10px 16px', fontSize: 12, lineHeight: 1.55 }}>
        今晚只收期待，不收付款。这里不会产生真实餐食、扣款或配送。
      </div>

      {/* Restaurant */}
      <div style={{ background: '#fff', margin: '10px 0 0', padding: '14px 16px', borderBottom: '1px solid #eee' }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{restaurant.name || '餐厅'}</span>
        <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>预计 {restaurant.deliveryTime || 18} 分钟送达想象中的门口</div>
      </div>

      {/* Items */}
      <div style={{ background: '#fff', margin: '10px 0 0' }}>
        {items.map(({ key, item, quantity, specSummary, unitPrice }) => (
          <div
            key={key || item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <AppImage src={item.imageUrl || item.image} alt={item.name} className="h-12 w-12 flex-none rounded-lg object-cover" sizes="48px" width={48} height={48} />
            <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
              {specSummary ? (
                <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>{specSummary}</div>
              ) : (item.description || item.desc) && (
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{item.description || item.desc}</div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>x{quantity}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--price-red)' }}>
                ¥{((unitPrice ?? item.price) * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div style={{ background: '#fff', margin: '10px 0 0', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#555' }}>
          <span>商品合计</span>
          <span>¥{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--price-red)' }}>
            <span>优惠券</span>
            <span>-¥{discount.toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#555' }}>
          <span>配送费</span>
          <span>{deliveryFee === 0 ? '免费' : `¥${deliveryFee.toFixed(2)}`}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 10,
            borderTop: '1px solid #eee',
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          <span>实付</span>
          <span style={{ color: 'var(--price-red)' }}>¥{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Place order button */}
      <div style={{ padding: '20px 16px' }}>
        <button
          onClick={handlePlaceOrder}
          disabled={Boolean(pendingOrder)}
          style={{
            width: '100%',
            padding: '14px 0',
            background: 'var(--brand-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
            cursor: pendingOrder ? 'wait' : 'pointer',
            opacity: pendingOrder ? 0.75 : 1,
          }}
        >
          {pendingOrder ? '正在把期待送出…' : `让这一单出发 · ¥${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}
