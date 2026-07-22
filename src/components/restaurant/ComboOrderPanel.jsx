import { useMemo, useState } from 'react'
import AppImage from '../common/AppImage'

const SIDE_PATTERN = /饮|茶|咖啡|汤|小食|薯|蛋挞|凉菜|甜|时蔬|沙拉|面包|豆浆|可乐|酸梅/
const SHARE_PATTERN = /双人|二人|分享|拼盘|组合|套餐|饱饱|全家|烤串局/

function uniqueItems(menus) {
  const seen = new Set()
  return menus.flatMap((category) => category.items).filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

function defaultUnitPrice(item) {
  const defaultDeltas = (item.specGroups || []).flatMap((group) => {
    if (group.multiple) return []
    const option = group.options.find((entry) => entry.default) || group.options[0]
    return option ? [option.priceDelta || 0] : []
  })
  return item.price + defaultDeltas.reduce((sum, delta) => sum + delta, 0)
}

function buildCombos(menus) {
  const items = uniqueItems(menus)
  if (items.length < 2) return []

  const ranked = [...items].sort((a, b) => Number(b.isRecommended) * 2 + Number(b.isHot) - Number(a.isRecommended) * 2 - Number(a.isHot))
  const mains = ranked.filter((item) => !SIDE_PATTERN.test(item.name))
  const sides = ranked.filter((item) => SIDE_PATTERN.test(item.name))
  const shareItem = ranked.find((item) => SHARE_PATTERN.test(item.name))
  const soloItems = [mains[0] || ranked[0], sides[0] || mains[1] || ranked[1]].filter(Boolean)
  const shareItems = shareItem
    ? [shareItem, sides.find((item) => item.id !== shareItem.id) || mains.find((item) => item.id !== shareItem.id)]
    : [mains[0], mains[1], sides[0] || mains[2]]

  const normalize = (list) => [...new Map(list.filter(Boolean).map((item) => [item.id, item])).values()]
  const combos = [
    { id: 'solo', title: '一个人刚刚好', note: '招牌主食配一份搭档', badge: '省心搭配', items: normalize(soloItems) },
    { id: 'share', title: '一起吃更丰富', note: '多选几样，口味不单调', badge: '分享组合', items: normalize(shareItems) },
  ]
  return combos.filter((combo) => combo.items.length >= 2)
}

export default function ComboOrderPanel({ menus, onAddCombo }) {
  const combos = useMemo(() => buildCombos(menus), [menus])
  const [activeId, setActiveId] = useState(combos[0]?.id || '')
  const [addedId, setAddedId] = useState('')
  const active = combos.find((combo) => combo.id === activeId) || combos[0]

  if (!active) return null
  const total = active.items.reduce((sum, item) => sum + defaultUnitPrice(item), 0)

  function addCombo() {
    onAddCombo(active.items)
    setAddedId(active.id)
    window.setTimeout(() => setAddedId(''), 1400)
  }

  return (
    <section className="border-b border-[var(--border-soft)] bg-[var(--surface)] px-3 py-3">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF5EF] via-white to-[#F0EBFF] p-3 shadow-[var(--shadow-soft)] ring-1 ring-white">
        <div className="flex items-start justify-between gap-2">
          <div><div className="flex items-center gap-1.5"><h2 className="text-[14px] font-black text-[var(--text-primary)]">不用纠结，一起点</h2><span className="rounded-full bg-[var(--brand-coral-soft)] px-1.5 py-0.5 text-[8px] font-bold text-[var(--price-red)]">组合点单</span></div><p className="mt-0.5 text-[9px] text-[var(--text-muted)]">从本店现有菜品搭配，可加入后单独增减</p></div>
        </div>

        <div className="mt-2 flex gap-1.5">
          {combos.map((combo) => <button key={combo.id} type="button" onClick={() => setActiveId(combo.id)} className={`flex-1 rounded-lg px-2 py-1.5 text-left ${combo.id === active.id ? 'bg-[var(--brand-primary)] text-white shadow-sm' : 'bg-white/80 text-[var(--text-secondary)] ring-1 ring-[var(--border-soft)]'}`}><strong className="block text-[10px]">{combo.title}</strong><span className={`mt-0.5 block truncate text-[8px] ${combo.id === active.id ? 'text-white/65' : 'text-[var(--text-muted)]'}`}>{combo.note}</span></button>)}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-hidden">
            {active.items.map((item, index) => (
              <div key={item.id} className="relative min-w-0 flex-1">
                <AppImage src={item.imageUrl} alt={item.name} className="h-[54px] w-full rounded-lg object-cover ring-1 ring-white" sizes="72px" width={72} height={54} />
                {index < active.items.length - 1 && <span className="absolute -right-2 top-[19px] z-10 grid h-4 w-4 place-items-center rounded-full bg-white text-[11px] font-black text-[var(--brand-primary)] shadow-sm">+</span>}
                <p className="mt-1 truncate text-[9px] font-semibold text-[var(--text-primary)]">{item.name}</p>
              </div>
            ))}
          </div>
          <div className="w-[82px] flex-none pl-1 text-right">
            <span className="inline-block rounded bg-white/80 px-1 py-0.5 text-[8px] font-bold text-[var(--brand-primary-deep)]">{active.badge}</span>
            <p className="mt-1 text-[9px] text-[var(--text-muted)]">共{active.items.length}样</p>
            <p className="text-[11px] font-black text-[var(--price-red)]">¥{total}</p>
            <button type="button" onClick={addCombo} className="mt-1 h-7 w-full rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-coral)] text-[10px] font-bold text-white shadow-sm active:opacity-80">{addedId === active.id ? '已加入' : '一键加入'}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
