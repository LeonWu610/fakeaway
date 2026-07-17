import { useState } from 'react'

export default function RestaurantInfo({ restaurant }) {
  const [toastVisible, setToastVisible] = useState(false)
  const [fulfillment, setFulfillment] = useState('delivery')
  const [claimedCoupons, setClaimedCoupons] = useState(() => new Set(couponsFromStorage()))
  const {
    name, image, rating, monthlySales, deliveryTime, description, operationCard,
    businessHours, avgPrice, minPrice, deliveryFee, distance, listProfile = {},
    promotionRules = [], coupons = [],
  } = restaurant

  function claimCoupon(coupon) {
    setToastVisible(true)
    window.setTimeout(() => setToastVisible(false), 1600)
    sessionStorage.setItem(`fakeaway.coupon.${coupon.id}`, 'claimed')
    setClaimedCoupons((current) => new Set([...current, coupon.id]))
  }

  return (
    <section className="bg-[#f5f5f5] pb-1">
      {toastVisible && <div className="fixed left-1/2 top-16 z-[70] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-4 py-2 text-xs text-white">已领取，结算时自动抵扣</div>}

      <div className="bg-white px-3 pb-2 pt-2">
        <div className="flex items-center gap-2">
          <img src={image} alt={name} className="h-14 w-14 flex-none rounded-lg border border-gray-100 object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="flex-none rounded-sm bg-[#eff8e9] px-1.5 py-0.5 text-[10px] font-semibold text-[#4c9a36]">{listProfile.identity || '原创商家'}</span>
              <h1 className="min-w-0 flex-1 truncate text-[19px] font-extrabold leading-6 text-[#222]">{name}</h1>
              <span className="flex-none text-[10px] text-green-600">营业中 ›</span>
            </div>
            <div className="mt-1 grid grid-cols-4 divide-x divide-gray-100">
              <Metric value={rating} label="评分" strong />
              <Metric value={monthlySales} label="月售" />
              <Metric value={`${deliveryTime}分钟`} label="配送" />
              <Metric value={listProfile.scoreBadge || `${avgPrice}元`} label="网友推荐" />
            </div>
          </div>
        </div>
        <p className="mt-1.5 truncate text-[10px] leading-4 text-gray-400">起送¥{minPrice} · 配送¥{deliveryFee} · {distance} · 营业{businessHours?.open}-{businessHours?.close} · {description}</p>
      </div>

      <div className="mt-1 bg-white px-2 pb-1.5 pt-1.5">
        <div className="flex h-9 overflow-hidden rounded-full border border-[#f3cf37] bg-[#fffdf1] p-[2px]">
          <button onClick={() => setFulfillment('delivery')} className={`relative flex-1 rounded-full text-[13px] ${fulfillment === 'delivery' ? 'bg-[var(--brand-yellow)] font-bold text-[#222]' : 'text-gray-700'}`}>外送 <span className="text-[9px] font-normal">约{deliveryTime}分钟</span></button>
          <button onClick={() => setFulfillment('pickup')} className={`relative flex-1 rounded-full text-[13px] ${fulfillment === 'pickup' ? 'bg-[var(--brand-yellow)] font-bold text-[#222]' : 'text-gray-700'}`}>自取 <span className="text-[9px] font-normal">约18分钟可取</span></button>
        </div>

        {promotionRules.length > 0 && (
          <div className="mt-1.5 flex h-8 items-center rounded-md bg-[#fff7f4] px-2">
            <span className="mr-2 flex-none rounded-sm bg-[#ff5a42] px-1 py-0.5 text-[9px] font-semibold text-white">全店立减</span>
            <p className="min-w-0 flex-1 truncate text-[11px] font-medium text-[#f0442f]">{promotionRules.join('　')}</p>
            <span className="ml-2 flex-none text-[10px] text-gray-400">更多 ›</span>
          </div>
        )}

        <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {coupons.map((coupon) => (
            <button key={coupon.id} onClick={() => claimCoupon(coupon)} className="relative h-[58px] w-[126px] flex-none rounded-md border border-[#ffd0c7] bg-[#fff7f5] px-2 py-1 text-left active:opacity-70">
              <div className="flex items-baseline text-[#f0442f]"><span className="text-[10px] font-bold">¥</span><strong className="text-[20px] leading-5">{coupon.amount}</strong><span className="ml-1 text-[8px]">{coupon.threshold ? `满${coupon.threshold}可用` : '无门槛'}</span></div>
              <p className="mt-0.5 truncate text-[9px] font-semibold text-[#9a493c]">{coupon.type} · {coupon.detail}</p>
              <span className={`absolute right-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${claimedCoupons.has(coupon.id) ? 'bg-[#f1d4cf] text-[#a05f54]' : 'bg-[#ff5a3d] text-white'}`}>{claimedCoupons.has(coupon.id) ? '已领' : '领取'}</span>
            </button>
          ))}
        </div>

        {operationCard && (
          <div className="mt-1.5 flex h-10 items-center gap-2 rounded-md bg-[#fff9e9] px-2">
            <span className="flex-none rounded-sm bg-[#ffe2a5] px-1.5 py-0.5 text-[9px] font-semibold text-[#966014]">{operationCard.eyebrow}</span>
            <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-bold text-[#333]">{operationCard.title}</p><p className="truncate text-[8px] text-gray-400">{operationCard.description}</p></div>
            <span className="flex-none text-[10px] font-semibold text-[#a76a16]">{operationCard.action} ›</span>
          </div>
        )}
      </div>
    </section>
  )
}

function couponsFromStorage() {
  return Object.keys(sessionStorage)
    .filter((key) => key.startsWith('fakeaway.coupon.'))
    .map((key) => key.replace('fakeaway.coupon.', ''))
}

function Metric({ value, label, strong = false }) {
  return (
    <div className="min-w-0 px-1 text-center">
      <div className={`${strong ? 'text-[15px] font-bold text-[#ff5a2f]' : 'text-[12px] font-semibold text-[#333]'} truncate`}>{value}</div>
      <div className="text-[8px] font-normal text-gray-400">{label}</div>
    </div>
  )
}
