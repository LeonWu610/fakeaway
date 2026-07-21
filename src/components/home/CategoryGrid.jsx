const CATEGORY_ART = {
  food: { colors: ['#FF8A72', '#FF5E62'], art: <><path d="M8 11.5h16c0 6.4-3.2 10-8 10s-8-3.6-8-10Z" fill="#FFF8F2"/><path d="M11 8c0-2 1.5-2.4 1.5-4M16 8c0-2 1.5-2.4 1.5-4M21 8c0-2 1.5-2.4 1.5-4"/><path d="M6 11.5h20M11 17c2.8 1.8 7.2 1.8 10 0"/></> },
  drinks: { colors: ['#B28AFF', '#7655E8'], art: <><path d="m11 7 2 17h9l2-17Z" fill="#FFF8F2"/><path d="M10 7h15M15 11c1.5-1 3-.8 4 .1s2.4 1 4-.1"/><path d="m18 7 5-4"/><circle cx="17" cy="16" r="2" fill="#FF8A72" stroke="none"/></> },
  market: { colors: ['#7B6CBA', '#343052'], art: <><path d="M7 12h19l-2 12H9Z" fill="#FFF8F2"/><path d="m11 12 3-6M22 12l-3-6M8 16h17"/><path d="M13 19h8"/></> },
  fruits: { colors: ['#72CFA2', '#3E9E78'], art: <><path d="M16 10c-5-3-9 .2-9 5.5C7 21 11.2 25 16 25s9-4 9-9.5C25 10.2 21 7 16 10Z" fill="#FFF8F2"/><path d="M16 10c0-3 2-5 5-6M17 6c3-2.5 6-1.5 7 0-2 2-5 2-7 0Z" fill="#BDEBD2"/><path d="M11 16c1 1 2 1.4 3.5 1.4"/></> },
  medicine: { colors: ['#7EA7FF', '#5B62DC'], art: <><rect x="7" y="8" width="18" height="17" rx="5" fill="#FFF8F2"/><path d="M12 8V5h8v3M16 12v9M11.5 16.5h9"/><circle cx="23.5" cy="7" r="3" fill="#FF8A72" stroke="none"/></> },
  tea: { colors: ['#FFB980', '#E97862'], art: <><path d="M7 10h16v8c0 4-3 7-7 7h-2c-4 0-7-3-7-7Z" fill="#FFF8F2"/><path d="M23 13h1.5a3.5 3.5 0 0 1 0 7H22M11 7c-1-1.5.5-2.5 0-4M16 7c-1-1.5.5-2.5 0-4"/><path d="M11 16c3-2 6-2 9 0"/></> },
  group: { colors: ['#9A76FF', '#6546D8'], art: <><circle cx="12" cy="12" r="5" fill="#FFF8F2"/><circle cx="21" cy="11" r="4" fill="#FFE2D9"/><path d="M4 25c.8-5 3.5-7.5 8-7.5s7.2 2.5 8 7.5" fill="#FFF8F2"/><path d="M18 18c4-.7 7 1.6 8 5M10 12h4M21 9v4"/></> },
  night: { colors: ['#4E477F', '#24213D'], art: <><path d="M22 22.5A10 10 0 0 1 12.5 6a9 9 0 1 0 9.5 16.5Z" fill="#FFF2C4"/><path d="m22 6 .7 1.8 1.8.7-1.8.7L22 11l-.7-1.8-1.8-.7 1.8-.7Z" fill="#FF8A72" stroke="none"/><path d="M8 22h12M10 18h8"/><circle cx="9" cy="8" r="1.2" fill="#FFF8F2" stroke="none"/></> },
  subsidy: { colors: ['#FF7F73', '#E64A55'], art: <><path d="M6 10.5 10 6h12l4 4.5V24H6Z" fill="#FFF8F2"/><path d="M6 11h20M12 15h8M12 19h8"/><circle cx="10" cy="7" r="2" fill="#FFE6DD"/><path d="m21 5 1-2 1 2 2 1-2 1-1 2-1-2-2-1Z" fill="#FFF2C4" stroke="none"/></> },
  new: { colors: ['#C083FF', '#7553D9'], art: <><path d="M7 12h18v13H7Z" fill="#FFF8F2"/><path d="M5 8h22v5H5ZM16 8v17"/><path d="M16 8c-4 0-6-1-6-3 0-1.5 1-2.5 2.5-2.5C15 2.5 16 8 16 8Zm0 0c4 0 6-1 6-3 0-1.5-1-2.5-2.5-2.5C17 2.5 16 8 16 8Z" fill="#FFE2D9"/></> },
}

function CategoryIcon({ category }) {
  const config = CATEGORY_ART[category.id] || CATEGORY_ART.food
  const gradientId = `category-gradient-${category.id}`
  return (
    <span className="category-icon" style={{ '--icon-shadow': `${config.colors[1]}38` }}>
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <defs><linearGradient id={gradientId} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse"><stop stopColor={config.colors[0]}/><stop offset="1" stopColor={config.colors[1]}/></linearGradient></defs>
        <rect x="1" y="1" width="30" height="30" rx="10" fill={`url(#${gradientId})`}/>
        <path d="M5 5c4-3 14-4 20 0" stroke="white" strokeOpacity=".22" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <g fill="none" stroke="#3A3155" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">{config.art}</g>
      </svg>
    </span>
  )
}

export default function CategoryGrid({ categories, onCategoryClick }) {
  return (
    <section className="bg-[var(--surface)] px-4 pb-4 pt-3" aria-label="常用分类">
      <div className="grid grid-cols-5 gap-x-1 gap-y-4">
        {categories.map((category) => (
          <button key={category.id} onClick={() => onCategoryClick?.(category)} className="group flex min-w-0 flex-col items-center active:scale-95" type="button">
            <CategoryIcon category={category} />
            <span className="mt-1.5 max-w-full truncate text-center text-[11px] font-medium leading-tight text-[var(--text-secondary)] group-active:text-[var(--brand-primary)]">{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
