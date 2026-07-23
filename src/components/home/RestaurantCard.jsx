import AppImage from '../common/AppImage'

const identityStyles = {
  '原创连锁': 'bg-[#eff8e9] text-[#4b9636]',
  '原叶茶饮': 'bg-[#edf7f3] text-[#28735b]',
  '极速餐厅': 'bg-[#eee9ff] text-[#6044ce]',
  '街坊老店': 'bg-[#fff0e7] text-[#b85d28]',
  '深夜限定': 'bg-[#f1ecf7] text-[#6e4d91]',
  '夜宵热店': 'bg-[#f8e9eb] text-[#923b47]',
}

export default function RestaurantCard({ restaurant, onClick, priority = false }) {
  const {
    name, image, rating, monthlySales, distance, deliveryTime, couponAmount,
    minOrder, deliveryFee, promotionText, listProfile = {}, isNew,
  } = restaurant
  const serviceTags = listProfile.serviceTags || []

  return (
    <article onClick={onClick} className="flex cursor-pointer gap-2 border-b border-gray-100 bg-white px-2 py-2 active:bg-gray-50">
      <div className="relative h-[100px] w-[100px] flex-none overflow-hidden rounded-md bg-gray-100">
        <AppImage src={image} alt={name} className="h-full w-full object-cover" sizes="100px" width={100} height={100} priority={priority} />
        <span className={`absolute left-0 top-0 max-w-[108px] truncate rounded-br px-1.5 py-0.5 text-[9px] font-bold text-white ${isNew ? 'bg-[#ff4d32]' : listProfile.identity === '深夜限定' ? 'bg-[#5f416f]' : listProfile.identity === '极速餐厅' ? 'bg-[#6D4AFF]' : 'bg-black/65'}`}>
          {isNew ? '今日新店' : listProfile.imageBadge || '品质商家'}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1">
          {listProfile.identity && <span className={`flex-none rounded-sm px-1 py-0.5 text-[9px] font-semibold ${identityStyles[listProfile.identity] || 'bg-gray-100 text-gray-600'}`}>{listProfile.identity}</span>}
          <h3 className="min-w-0 flex-1 truncate text-[16px] font-extrabold leading-[21px] text-[#222]">{name}</h3>
        </div>

        <div className="flex min-w-0 items-center gap-2 text-[10px] leading-[16px] text-gray-500">
          <span>月售{monthlySales}</span>
          <span>{serviceTags[0] || '商家配送'} · {serviceTags[1] || '支持自取'}</span>
        </div>

        <div className="flex items-center text-[10px] leading-[16px] text-gray-500">
          <span>起送¥{minOrder}</span><span className="ml-2">配送¥{deliveryFee}</span>
          <span className="ml-auto">{distance} · {deliveryTime}分钟</span>
        </div>

        <div className="mt-px flex min-w-0 items-center gap-1 text-[10px] leading-[17px]">
          <strong className="flex-none text-[14px] text-[var(--brand-coral)]">{rating}分</strong>
          {listProfile.scoreBadge && <span className="min-w-0 truncate rounded-sm bg-[var(--brand-primary-soft)] px-1 py-0.5 font-medium text-[var(--brand-primary-deep)]">{listProfile.scoreBadge}</span>}
          <span className="flex-none rounded-sm bg-[#fff0ed] px-1 py-0.5 text-[#cc5345]">近期口碑好</span>
        </div>

        <div className="mt-px flex min-w-0 items-center gap-1 overflow-hidden text-[10px] leading-[17px]">
          <span className="flex-none rounded-sm bg-[#fff0ed] px-1 font-semibold text-[#f0442f]">{listProfile.benefitLabel || '店铺券'}</span>
          <span className="flex-none text-[#f0442f]">{promotionText}</span>
          <span className="min-w-0 truncate rounded-sm bg-[#fff5f3] px-1 text-[#e36a55]">收藏领{Math.min(couponAmount, 3)}元券</span>
        </div>
      </div>
    </article>
  )
}
