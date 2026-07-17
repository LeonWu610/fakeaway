import { useEffect, useMemo, useState } from 'react'

function initialSelections(groups) {
  return Object.fromEntries(groups.map((group) => {
    if (group.multiple) return [group.id, []]
    const option = group.options.find((entry) => entry.default) || group.options[0]
    return [group.id, option?.id || '']
  }))
}

export default function SpecModal({ item, onClose, onConfirm }) {
  const groups = useMemo(() => item?.specGroups || [], [item])
  const [selections, setSelections] = useState(() => initialSelections(groups))
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const selectedOptions = useMemo(() => groups.flatMap((group) => {
    const selected = selections[group.id]
    return group.multiple
      ? group.options.filter((option) => selected.includes(option.id))
      : group.options.filter((option) => option.id === selected)
  }), [groups, selections])

  const unitPrice = item.price + selectedOptions.reduce((sum, option) => sum + (option.priceDelta || 0), 0)
  const selectedSummary = selectedOptions.map((option) => option.name).join('、')

  function selectOption(group, option) {
    setSelections((current) => {
      if (!group.multiple) return { ...current, [group.id]: option.id }
      const selected = current[group.id]
      if (selected.includes(option.id)) {
        return { ...current, [group.id]: selected.filter((id) => id !== option.id) }
      }
      if (selected.length >= (group.max || Infinity)) return current
      return { ...current, [group.id]: [...selected, option.id] }
    })
  }

  function confirm() {
    const specs = groups.map((group) => ({
      groupId: group.id,
      groupName: group.name,
      options: group.options
        .filter((option) => group.multiple ? selections[group.id].includes(option.id) : selections[group.id] === option.id)
        .map(({ id, name, priceDelta = 0 }) => ({ id, name, priceDelta })),
    })).filter((group) => group.options.length > 0)
    onConfirm({ item, specs, specSummary: selectedSummary, unitPrice, quantity })
  }

  if (!item) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center">
      <button aria-label="关闭规格选择" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <section className="relative z-10 flex max-h-[82vh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-gray-100 px-4 py-3">
          <img src={item.imageUrl} alt={item.name} className="h-[68px] w-[68px] flex-none rounded-lg object-cover" />
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 className="truncate text-[17px] font-bold text-[#222]">{item.name}</h2>
            <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-gray-400">{item.description}</p>
            <p className="mt-1 text-[10px] text-gray-500">已选：<span className="text-[#333]">{selectedSummary || '请选择规格'}</span></p>
          </div>
          <button onClick={onClose} aria-label="关闭" className="grid h-7 w-7 flex-none place-items-center rounded-full bg-gray-100 text-lg leading-none text-gray-500">×</button>
        </div>

        <div className="overflow-y-auto px-4 pb-3">
          <div className="mt-3 rounded-lg bg-[#f8f7f4] px-3 py-2 text-[9px] leading-4 text-gray-500">
            <p><strong className="text-gray-700">主要配料：</strong>{item.ingredients?.join('、') || '以门店当日供应为准'}</p>
            <p><strong className="text-gray-700">过敏原提示：</strong>{item.allergens?.join('、') || '暂无常见过敏原信息'}</p>
            <p><strong className="text-gray-700">供应时段：</strong>{item.availabilitySchedule?.label} {item.availabilitySchedule?.start}-{item.availabilitySchedule?.end} · 预计制作{item.estimatedPrepMinutes}分钟</p>
          </div>
          {groups.map((group) => (
            <div key={group.id} className="border-b border-gray-100 py-3 last:border-0">
              <div className="mb-2 flex items-center gap-1.5">
                <h3 className="text-[13px] font-bold text-[#333]">{group.name}</h3>
                {group.required && <span className="rounded-sm bg-[#fff0ed] px-1 py-0.5 text-[8px] text-[#f0442f]">必选</span>}
                {group.multiple && <span className="text-[9px] text-gray-400">最多选{group.max}项</span>}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {group.options.map((option) => {
                  const selected = group.multiple ? selections[group.id].includes(option.id) : selections[group.id] === option.id
                  return (
                    <button key={option.id} onClick={() => selectOption(group, option)} className={`relative min-h-10 rounded-md border px-2 py-1.5 text-[11px] ${selected ? 'border-[#ffcb19] bg-[#fff9df] font-semibold text-[#222]' : 'border-gray-200 bg-[#fafafa] text-gray-600'}`}>
                      {option.name}
                      {option.priceDelta > 0 && <span className="ml-0.5 text-[9px] text-gray-400">+¥{option.priceDelta}</span>}
                      {selected && <span className="absolute right-0 top-0 rounded-bl bg-[#ffcb19] px-1 text-[8px]">✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-gray-100 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline text-[var(--price-red)]"><span className="text-xs font-bold">¥</span><strong className="text-2xl leading-6">{unitPrice * quantity}</strong></div>
            <p className="mt-0.5 truncate text-[9px] text-gray-400">单价¥{unitPrice} · {selectedSummary}</p>
          </div>
          <div className="flex h-8 items-center rounded-full bg-gray-100">
            <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-8 w-8 text-lg text-gray-500">−</button>
            <span className="min-w-6 text-center text-sm font-semibold">{quantity}</span>
            <button onClick={() => setQuantity((value) => Math.min(99, value + 1))} className="h-8 w-8 text-lg text-gray-700">+</button>
          </div>
          <button onClick={confirm} className="h-10 flex-none rounded-full bg-[var(--brand-yellow)] px-5 text-[14px] font-bold text-[#222] active:opacity-80">加入购物车</button>
        </div>
      </section>
    </div>
  )
}
