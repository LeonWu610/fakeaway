function normalizeSales(value) {
  return String(value || '').replace(/^月售/, '')
}

export default function MenuItem({ item, quantity, onAdd, onRemove, onChooseSpecs }) {
  const {
    name, description, price, imageUrl, monthlySales, isHot, isRecommended,
  } = item
  const originalPrice = item.originalPrice || null
  const saving = originalPrice > price ? originalPrice - price : 0
  const recommendation = isRecommended ? '回购推荐' : isHot ? '网友推荐' : null
  const recommendationText = isRecommended ? '“常客都在点”' : isHot ? '92%网友推荐' : null
  const hasSpecs = item.specGroups?.length > 0
  const schedule = item.availabilitySchedule

  return (
    <div className="flex min-h-[116px] border-b border-gray-100 bg-white py-3">
      <div className="relative h-[94px] w-[94px] flex-none overflow-hidden rounded-lg bg-gray-100">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        {(isHot || isRecommended) && <span className={`absolute left-1 top-1 rounded-sm px-1 py-0.5 text-[9px] font-semibold text-white ${isHot ? 'bg-[#ff4d32]' : 'bg-[#4e9b65]'}`}>{isHot ? '热销' : '店长推荐'}</span>}
      </div>

      <div className="flex min-w-0 flex-1 flex-col pl-2.5">
        <h4 className="line-clamp-2 text-[14px] font-semibold leading-[19px] text-[#222]">{name}</h4>
        {description && <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-gray-500">{description}</p>}
        <p className="mt-1 text-[10px] font-normal text-gray-400">月售 {normalizeSales(monthlySales)} · 好评 {item.rating || 95}%</p>
        <p className="mt-0.5 truncate text-[9px] text-[#8a7b65]">{schedule?.label} {schedule?.start}-{schedule?.end} · 约{item.estimatedPrepMinutes}分钟制作</p>

        {recommendation && (
          <div className="mt-1 flex min-w-0 items-center gap-1">
            <span className={`flex-none rounded-sm px-1 py-0.5 text-[9px] font-medium ${isRecommended ? 'bg-[#eef8f1] text-[#397c4d]' : 'bg-[#fff2e8] text-[#d96722]'}`}>{recommendation}</span>
            <span className="truncate text-[9px] text-[#e26b2e]">{recommendationText}</span>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between pt-1">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] font-semibold text-[var(--price-red)]">¥</span>
              <strong className="-ml-1 text-[19px] leading-5 text-[var(--price-red)]">{price}</strong>
              {originalPrice > price && <del className="text-[10px] text-gray-400">¥{originalPrice}</del>}
            </div>
            {saving > 0 ? <p className="mt-0.5 text-[9px] text-[#f0442f]"><span className="rounded-sm bg-[#fff0ed] px-1 py-0.5">已含券</span><span className="ml-1">立省¥{saving}</span></p> : <p className="mt-0.5 text-[9px] text-gray-400">约 ¥{price}/份</p>}
          </div>

          {hasSpecs ? (
            <div className="mb-0.5 flex items-center gap-1.5">
              {quantity > 0 && <span className="text-[10px] text-gray-500">已选{quantity}</span>}
              <button onClick={() => onChooseSpecs(item)} className="h-7 rounded-full bg-[var(--brand-yellow)] px-2.5 text-[11px] font-semibold text-[#222] shadow-sm" aria-label={`选择${name}规格`}>选规格</button>
            </div>
          ) : quantity > 0 ? (
            <div className="mb-0.5 flex items-center gap-2">
              <button onClick={() => onRemove(item)} className="grid h-6 w-6 place-items-center rounded-full border border-red-500 text-base font-bold leading-none text-red-500" aria-label="减少数量">−</button>
              <span className="min-w-[14px] text-center text-sm font-medium">{quantity}</span>
              <button onClick={() => onAdd(item)} className="grid h-6 w-6 place-items-center rounded-full bg-red-500 text-base font-bold leading-none text-white" aria-label="增加数量">+</button>
            </div>
          ) : (
            <button onClick={() => onAdd(item)} className="mb-0.5 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-base font-bold leading-none text-white shadow-sm" aria-label="添加">+</button>
          )}
        </div>
      </div>
    </div>
  )
}
