import { useFeatureNotice } from '../../contexts/FeatureNoticeContext'

export default function CouponBanner({ coupons = [] }) {
  const { showFeatureNotice } = useFeatureNotice()
  if (!coupons.length) return null

  return (
    <section className="bg-[var(--surface)] px-3 py-1.5" aria-label="今晚好券">
      <div className="mb-1 flex items-center justify-between px-0.5">
        <div className="flex items-baseline gap-2"><p className="text-[13px] font-black text-[var(--text-primary)]">今晚好券</p><p className="text-[8px] text-[var(--text-muted)]">给这一餐一点偏爱</p></div>
        <TicketSparkIcon />
      </div>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-0.5">
        {coupons.map((coupon, index) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            index={index}
            onClick={() => showFeatureNotice({ title: '今晚好券还在折角', message: `¥${coupon.amount} 的偏爱已经记下了，等券包开放后再正式收好。` })}
          />
        ))}
      </div>
    </section>
  )
}

function TicketSparkIcon() {
  return (
    <svg viewBox="0 0 70 28" className="h-5 w-[50px]" aria-hidden="true">
      <defs><linearGradient id="ticket-title-gradient" x1="5" y1="2" x2="62" y2="27"><stop stopColor="#8D70FF"/><stop offset="1" stopColor="#FF7664"/></linearGradient></defs>
      <path d="M13 5h44a4 4 0 0 0 4 4v10a4 4 0 0 0-4 4H13a4 4 0 0 0-4-4V9a4 4 0 0 0 4-4Z" fill="url(#ticket-title-gradient)"/>
      <path d="M22 10h25M22 15h18" stroke="white" strokeOpacity=".72" strokeWidth="2" strokeLinecap="round"/>
      <path d="m64 2 1.1 2.6L68 6l-2.9 1.3L64 10l-1.2-2.7L60 6l2.8-1.4Z" fill="#FFB5A8"/>
    </svg>
  )
}

function CouponCard({ coupon, index, onClick }) {
  const gradient = index % 2 === 0
    ? 'linear-gradient(115deg, #6845FF 0%, #956BFF 43%, #FF4F87 100%)'
    : 'linear-gradient(115deg, #24213D 0%, #5945A7 48%, #FF6957 112%)'
  return (
    <button onClick={onClick} className="coupon-ticket relative flex h-[58px] w-[210px] flex-none overflow-hidden rounded-[13px] text-left text-white active:scale-[0.98]" style={{ background: gradient }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,.32),transparent_38%)]" />
      <div className="pointer-events-none absolute -right-2 -top-4 h-12 w-12 rounded-full border-[10px] border-white/10" />
      <div className="relative flex w-[66px] flex-none items-center justify-center">
        <div className="flex items-start leading-none"><span className="mt-1.5 text-[10px] font-bold">¥</span><strong className="text-[28px] font-black tracking-[-2px]">{coupon.amount}</strong></div>
      </div>
      <div className="relative my-2 border-l border-dashed border-white/40" />
      <div className="relative flex min-w-0 flex-1 flex-col justify-center px-2.5 pr-3">
        <span className="mb-0.5 flex items-center gap-1 text-[8px] font-bold tracking-[.12em] text-[#FFE0D8]"><SparkIcon /> NIGHT TREAT</span>
        <p className="truncate text-[10px] font-semibold leading-tight text-white">{coupon.desc}</p>
        <span className="mt-1 w-fit rounded-full bg-white/18 px-1.5 py-px text-[7px] text-white/90 ring-1 ring-white/20">领取即用</span>
      </div>
    </button>
  )
}

function SparkIcon() {
  return <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><path d="m6 0 1.2 4L11 6 7.2 7.4 6 12 4.7 7.4 1 6l3.7-2Z" fill="currentColor"/></svg>
}
