import { describeRelationshipOutcome, getFavoriteItem, getRelationshipStage } from '../../utils/relationship'

function RelationshipMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 19V8.5L12 4l7 4.5V19" />
      <path d="M8 19v-5h8v5M9 10h6" />
      <path d="M4 19h16" />
    </svg>
  )
}

export default function RelationshipCard({ relationship, onOrderAgain, canOrderAgain }) {
  const stage = getRelationshipStage(relationship.completedOrders)
  const favorite = getFavoriteItem(relationship)
  const hasHistory = relationship.completedOrders > 0

  return (
    <section className="mx-2 mb-1 overflow-hidden rounded-xl bg-gradient-to-r from-[var(--brand-night)] via-[#39345b] to-[#554379] p-[1px] shadow-[var(--shadow-soft)]">
      <div className="rounded-[11px] bg-gradient-to-br from-[#2d2948] to-[#40365f] px-3 py-2.5 text-white">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-white/10 text-[#ffd4cc]"><RelationshipMark /></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2"><strong className="text-[12px]">{stage.label}</strong>{hasHistory && <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] text-white/60">来过 {relationship.completedOrders} 次</span>}</div>
            <p className="mt-0.5 truncate text-[9px] text-white/55">{stage.greeting}</p>
          </div>
          {canOrderAgain && <button type="button" onClick={onOrderAgain} className="flex-none rounded-full bg-gradient-to-r from-[var(--brand-coral)] to-[#ff8878] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm active:scale-[0.98]">还是老样子</button>}
        </div>
        {hasHistory && <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2 text-[9px] text-white/65"><span className="min-w-0 flex-1 truncate">常点：{favorite?.name || '还在慢慢认识你的口味'}</span><span className="h-3 w-px bg-white/15" /><span className="flex-none">{describeRelationshipOutcome(relationship)}</span></div>}
      </div>
    </section>
  )
}
