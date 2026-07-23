import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeHeader from '../components/home/HomeHeader'
import SearchBar from '../components/home/SearchBar'
import CategoryGrid from '../components/home/CategoryGrid'
import PromoCards from '../components/home/PromoCards'
import CouponBanner from '../components/home/CouponBanner'
import RestaurantCard from '../components/home/RestaurantCard'
import BottomNav from '../components/common/BottomNav'
import AppImage from '../components/common/AppImage'
import restaurants from '../data/allRestaurants'
import config from '../data/config.json'
import { getFavoriteItem, getRelationshipStage, readRelationships } from '../utils/relationship'
import { inRestaurantCategory, isNightRestaurant, numberFrom, restaurantText, salesFrom } from '../utils/restaurantDiscovery'

const sortOptions = [
  ['smart', '综合排序'],
  ['rating', '评分最高'],
  ['speed', '配送最快'],
  ['distance', '距离最近'],
  ['sales', '销量最高'],
]

const categoryOptions = [
  ['all', '全部品类'],
  ['drink', '饮品咖啡'],
  ['fast', '汉堡炸鸡'],
  ['night', '夜宵火锅'],
  ['rice', '米饭面食'],
  ['fresh', '日料轻食'],
  ['breakfast', '粥品早餐'],
  ['home', '饺子小炒'],
  ['bakery', '烘焙甜点'],
  ['retail', '全部零售'],
  ['market', '超市便利'],
  ['fruits', '蔬菜水果'],
  ['medicine', '健康药箱'],
]

const TIME_SCENES = [
  { id: 'morning', label: '早餐', hours: [5, 11], title: '早上吃点热乎的', note: '粥点、面包和醒神饮品', categories: ['breakfast', 'bakery'], keywords: /粥|早餐|包点|面包|咖啡|茶/ },
  { id: 'noon', label: '午餐', hours: [11, 14], title: '午间认真吃顿饭', note: '下饭热菜与饱腹主食优先', categories: ['rice', 'noodles', 'dumplings', 'stirFry', 'malatang'], keywords: /饭|面|粉|饺|小炒|麻辣烫/ },
  { id: 'afternoon', label: '下午茶', hours: [14, 17], title: '给下午留一点甜', note: '现烤甜点、轻食和饮品', categories: ['bakery', 'lightMeal'], keywords: /甜|茶|咖啡|蛋糕|面包|轻食/ },
  { id: 'dinner', label: '晚餐', hours: [17, 21], title: '今晚好好吃饭', note: '热锅、家常菜和双人搭配', categories: ['rice', 'stirFry', 'malatang', 'hotpot', 'bbq'], keywords: /饭|小炒|锅|烧烤|套餐/ },
  { id: 'night', label: '夜宵', hours: [21, 29], title: '夜深了，来点有烟火气的', note: '营业到深夜的热锅、烤串与暖食', categories: ['bbq', 'hotpot', 'noodles'], keywords: /夜宵|深夜|烧烤|火锅|烤串|营业到|不打烊/ },
]

function currentSceneId(hour = new Date().getHours()) {
  const normalizedHour = hour < 5 ? hour + 24 : hour
  return TIME_SCENES.find((scene) => normalizedHour >= scene.hours[0] && normalizedHour < scene.hours[1])?.id || 'dinner'
}

export default function HomePage() {
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  const restaurantSectionRef = useRef(null)
  const [query, setQuery] = useState('')
  const [activeSceneId, setActiveSceneId] = useState(() => currentSceneId())
  const [sortBy, setSortBy] = useState('smart')
  const [showSort, setShowSort] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ freeDelivery: false, coupon: false, category: 'all', maxDeliveryTime: 0 })
  const [relationships] = useState(() => readRelationships())

  const familiarRestaurants = useMemo(() => Object.values(relationships)
    .filter((relationship) => relationship.completedOrders > 0)
    .sort((a, b) => b.lastMetAt - a.lastMetAt)
    .map((relationship) => ({ relationship, restaurant: restaurants.find((entry) => entry.id === relationship.restaurantId) }))
    .filter((entry) => entry.restaurant)
    .slice(0, 4), [relationships])

  const filteredRestaurants = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const result = restaurants.filter((restaurant) => {
      if (keyword && !restaurantText(restaurant).includes(keyword)) return false
      if (!keyword && restaurant.retailCategory === 'errand') return false
      if (keyword && restaurant.retailCategory === 'errand') return true
      if (filters.freeDelivery && numberFrom(restaurant.deliveryFee) > 0) return false
      if (filters.coupon && !(restaurant.couponAmount > 0 || restaurant.coupons?.length)) return false
      if (filters.maxDeliveryTime && restaurant.deliveryTime > filters.maxDeliveryTime) return false
      return inRestaurantCategory(restaurant, filters.category)
    })
    return [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'speed') return a.deliveryTime - b.deliveryTime
      if (sortBy === 'distance') return numberFrom(a.distance) - numberFrom(b.distance)
      if (sortBy === 'sales') return salesFrom(b.monthlySales) - salesFrom(a.monthlySales)
      return (b.rating * 20 + salesFrom(b.monthlySales) / 1000 - b.deliveryTime / 10) - (a.rating * 20 + salesFrom(a.monthlySales) / 1000 - a.deliveryTime / 10)
    })
  }, [filters, query, sortBy])

  const activeFilterCount = Number(filters.freeDelivery) + Number(filters.coupon) + Number(filters.category !== 'all') + Number(filters.maxDeliveryTime > 0)
  const currentSort = sortOptions.find(([key]) => key === sortBy)?.[1]
  const selectedCategoryLabel = categoryOptions.find(([key]) => key === filters.category)?.[1]
  const resultsTitle = query ? '搜索结果' : filters.category === 'night' ? '深夜夜宵' : filters.category !== 'all' ? selectedCategoryLabel : '附近商家'

  function focusResults() {
    restaurantSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function resetFilters() {
    setFilters({ freeDelivery: false, coupon: false, category: 'all', maxDeliveryTime: 0 })
  }

  function handleCategoryClick(category) {
    const categoryActions = {
      food: { category: 'food', query: '' },
      drinks: { category: 'drink', query: '' },
      market: { category: 'market', query: '' },
      fruits: { category: 'fruits', query: '' },
      medicine: { category: 'medicine', query: '' },
      tea: { category: 'drink', query: '茶' },
      group: { category: 'food', query: '' },
      night: { category: 'night', query: '' },
      subsidy: { category: 'all', query: '' },
      new: { category: 'all', query: '' },
    }
    const action = categoryActions[category.id] || { category: 'all', query: category.name }
    setFilters({
      freeDelivery: false,
      coupon: category.id === 'subsidy',
      category: action.category,
      maxDeliveryTime: 0,
    })
    setShowSort(false)
    setShowFilters(false)
    if (category.id === 'night') setActiveSceneId('night')
    setSortBy(category.id === 'new' ? 'rating' : 'smart')
    setQuery(action.query)
    window.setTimeout(focusResults, 0)
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <HomeHeader address={config.address} />
      <SearchBar inputRef={searchInputRef} value={query} onChange={setQuery} onSubmit={focusResults} onClear={() => setQuery('')} />

      <div className="bg-[var(--surface)]"><CategoryGrid categories={config.categories} onCategoryClick={handleCategoryClick} /></div>
      <TimeRecommendations
        activeSceneId={activeSceneId}
        onSceneChange={setActiveSceneId}
        onRestaurantClick={(restaurant) => navigate('/restaurant/' + restaurant.id)}
        onNightExplore={() => handleCategoryClick({ id: 'night', name: '夜宵' })}
      />
      {familiarRestaurants.length > 0 && <AlwaysOnRestaurants entries={familiarRestaurants} onRestaurantClick={(restaurant) => navigate('/restaurant/' + restaurant.id)} />}
      <div className="h-2 bg-[var(--background)]" />
      <div className="bg-white">
        <PromoCards promoCards={config.promoCards} restaurants={restaurants} onCardClick={(card) => { const restaurantId = card.items?.[0]?.restaurantId; if (restaurantId) navigate('/restaurant/' + restaurantId) }} />
      </div>
      <div className="h-2 bg-gray-100" />
      {config.coupons?.length > 0 && <><div className="bg-white"><CouponBanner coupons={config.coupons} /></div><div className="h-2 bg-gray-100" /></>}

      <div ref={restaurantSectionRef} className="scroll-mt-[90px]">
        <div className="sticky top-[91px] z-30 flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-2.5">
          <span className="text-[16px] font-black text-gray-900">{resultsTitle}</span>
          <span className="rounded-full bg-[var(--brand-coral-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--price-red)]">{filteredRestaurants.length}家</span>
          <div className="flex-1" />
          <button onClick={() => { setShowSort(true); setShowFilters(false) }} className={`flex items-center gap-1 text-[11px] ${sortBy !== 'smart' ? 'font-semibold text-[#222]' : 'text-gray-500'}`}>{currentSort} <span className="text-[8px]">▼</span></button>
          <button onClick={() => { setShowFilters(true); setShowSort(false) }} className={`text-[11px] ${activeFilterCount ? 'font-semibold text-[#222]' : 'text-gray-500'}`}>筛选{activeFilterCount ? ` · ${activeFilterCount}` : ''}</button>
        </div>

        {query && <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-2 text-[11px] text-gray-500"><span>正在搜索“<strong className="text-[#222]">{query}</strong>”</span><button onClick={() => setQuery('')} className="ml-auto font-medium text-[var(--brand-primary)]">清除</button></div>}

        <div className="bg-white">
          {filteredRestaurants.map((restaurant, index) => <RestaurantCard key={restaurant.id} restaurant={{ ...restaurant, minOrder: restaurant.minPrice, avgPrice: restaurant.avgPrice }} priority={index === 0} onClick={() => navigate('/restaurant/' + restaurant.id)} />)}
          {filteredRestaurants.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gray-100 text-2xl text-gray-400">⌕</div>
              <h3 className="mt-3 text-sm font-bold text-gray-700">没有找到合适的商家</h3>
              <p className="mt-1 text-[11px] text-gray-400">换个关键词，或放宽配送时间与品类筛选</p>
              <button onClick={() => { setQuery(''); resetFilters() }} className="mt-4 rounded-full bg-[var(--brand-primary)] px-5 py-2 text-xs font-semibold text-white">清空条件</button>
            </div>
          )}
        </div>
      </div>

      {(showSort || showFilters) && <button aria-label="关闭选择面板" onClick={() => { setShowSort(false); setShowFilters(false) }} className="fixed inset-0 z-[60] bg-black/35" />}
      {showSort && (
        <div className="fixed bottom-0 left-1/2 z-[70] w-full max-w-[480px] -translate-x-1/2 rounded-t-2xl bg-white pb-[max(12px,env(safe-area-inset-bottom))] shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3"><strong className="text-[15px]">排序方式</strong><button onClick={() => setShowSort(false)} className="text-xl text-gray-400">×</button></div>
          {sortOptions.map(([key, label]) => <button key={key} onClick={() => { setSortBy(key); setShowSort(false) }} className="flex w-full items-center justify-between border-b border-gray-50 px-4 py-3 text-left text-[13px]"><span>{label}</span>{sortBy === key && <span className="font-bold text-[var(--brand-primary)]">✓</span>}</button>)}
        </div>
      )}
      {showFilters && (
        <div className="fixed bottom-0 left-1/2 z-[70] flex max-h-[calc(100dvh-16px)] w-full max-w-[480px] -translate-x-1/2 flex-col rounded-t-2xl bg-white pb-[max(12px,env(safe-area-inset-bottom))] shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3"><strong className="text-[15px]">筛选商家</strong><button onClick={() => setShowFilters(false)} className="text-xl text-gray-400">×</button></div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <FilterSection title="配送与优惠"><FilterChip active={filters.freeDelivery} onClick={() => setFilters((value) => ({ ...value, freeDelivery: !value.freeDelivery }))}>免配送费</FilterChip><FilterChip active={filters.coupon} onClick={() => setFilters((value) => ({ ...value, coupon: !value.coupon }))}>有优惠券</FilterChip></FilterSection>
            <FilterSection title="商家品类">{categoryOptions.map(([key, label]) => <FilterChip key={key} active={filters.category === key} onClick={() => setFilters((value) => ({ ...value, category: key }))}>{label}</FilterChip>)}</FilterSection>
            <FilterSection title="配送时间">{[[0, '不限'], [20, '20分钟内'], [30, '30分钟内'], [45, '45分钟内']].map(([minutes, label]) => <FilterChip key={minutes} active={filters.maxDeliveryTime === minutes} onClick={() => setFilters((value) => ({ ...value, maxDeliveryTime: minutes }))}>{label}</FilterChip>)}</FilterSection>
          </div>
          <div className="flex flex-none gap-3 border-t border-gray-100 px-4 pt-3"><button onClick={resetFilters} className="h-10 flex-1 rounded-full border border-gray-200 text-[13px]">重置</button><button onClick={() => { setShowFilters(false); focusResults() }} className="h-10 flex-[2] rounded-full bg-[var(--brand-primary)] text-[13px] font-bold text-white shadow-sm">查看 {filteredRestaurants.length} 家商家</button></div>
        </div>
      )}

      <div className="pb-20" />
      <BottomNav />
    </div>
  )
}

function TimeRecommendations({ activeSceneId, onSceneChange, onRestaurantClick, onNightExplore }) {
  const scene = TIME_SCENES.find((item) => item.id === activeSceneId) || TIME_SCENES[3]
  const recommended = useMemo(() => restaurants
    .filter((restaurant) => !restaurant.retailCategory && (scene.id !== 'night' || isNightRestaurant(restaurant)))
    .map((restaurant) => {
      const text = restaurantText(restaurant)
      const categoryMatch = scene.categories.includes(restaurant.foodCategory)
      const keywordMatch = scene.keywords.test(text)
      return { restaurant, score: Number(categoryMatch) * 5 + Number(keywordMatch) * 3 + restaurant.rating - restaurant.deliveryTime / 100 }
    })
    .filter(({ score }) => score > 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ restaurant }) => restaurant), [scene])
  const isNight = scene.id === 'night'

  return (
    <section className="bg-[var(--surface)] px-3 pb-3">
      <div className={`overflow-hidden rounded-2xl border p-2.5 shadow-[var(--shadow-soft)] ${isNight ? 'border-white/10 bg-gradient-to-br from-[#26213F] via-[#3A315D] to-[#5C4787] text-white' : 'border-[var(--border-soft)] bg-gradient-to-br from-white via-[#FFF8F5] to-[#F2EEFF]'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5"><h2 className="text-[14px] font-black">{scene.title}</h2><span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${isNight ? 'bg-[#FF8D7D]/20 text-[#FFD7CF]' : 'bg-[var(--brand-coral-soft)] text-[var(--price-red)]'}`}>此刻推荐</span></div>
            <p className={`mt-0.5 text-[9px] ${isNight ? 'text-white/55' : 'text-[var(--text-muted)]'}`}>{scene.note}</p>
          </div>
          {isNight && <button type="button" onClick={onNightExplore} className="flex-none rounded-full bg-white/12 px-2 py-1 text-[9px] font-bold text-[#FFE0D8] ring-1 ring-white/15">全部夜宵 ›</button>}
        </div>

        <div className="mt-2 flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
          {TIME_SCENES.map((item) => (
            <button key={item.id} type="button" onClick={() => onSceneChange(item.id)} className={`flex-none rounded-full px-2.5 py-1 text-[9px] font-bold transition ${item.id === scene.id ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-coral)] text-white shadow-sm' : isNight ? 'bg-white/8 text-white/60 ring-1 ring-white/10' : 'bg-white/80 text-[var(--text-secondary)] ring-1 ring-[var(--border-soft)]'}`}>{item.label}</button>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {recommended.map((restaurant) => (
            <button key={restaurant.id} type="button" onClick={() => onRestaurantClick(restaurant)} className={`min-w-0 overflow-hidden rounded-xl text-left active:scale-[0.98] ${isNight ? 'bg-white/10 ring-1 ring-white/10' : 'bg-white ring-1 ring-[var(--border-soft)]'}`}>
              <AppImage src={restaurant.image} alt={restaurant.name} className="h-[58px] w-full object-cover" sizes="110px" width={110} height={58} />
              <div className="px-1.5 py-1.5">
                <strong className="block truncate text-[10px] leading-[13px]">{restaurant.name}</strong>
                <span className={`mt-0.5 block truncate text-[8px] ${isNight ? 'text-white/55' : 'text-[var(--text-muted)]'}`}>{restaurant.listProfile?.imageBadge || restaurant.tags?.[0]} · {restaurant.deliveryTime}分钟</span>
              </div>
            </button>
          ))}
        </div>

        {isNight && <div className="mt-2 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[8px] text-white/55"><span className="rounded bg-[#FF8D7D]/20 px-1 py-0.5 font-bold text-[#FFD7CF]">夜宵专题</span><span>只看深夜营业、热食与夜间配送商家</span></div>}
      </div>
    </section>
  )
}

function AlwaysOnRestaurants({ entries, onRestaurantClick }) {
  return (
    <section className="bg-[var(--surface)] px-3 pb-3">
      <div className="rounded-2xl bg-gradient-to-br from-[var(--brand-night)] to-[#46375f] p-3 text-white shadow-[var(--shadow-soft)]">
        <div className="flex items-end justify-between"><div><h2 className="text-[14px] font-black">常亮的小店</h2><p className="mt-0.5 text-[9px] text-white/45">去过的地方，还记得你的口味</p></div><span className="text-[9px] text-[#ffc9c0]">最近见过</span></div>
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {entries.map(({ relationship, restaurant }) => {
            const favorite = getFavoriteItem(relationship)
            const stage = getRelationshipStage(relationship.completedOrders)
            return <button key={restaurant.id} type="button" onClick={() => onRestaurantClick(restaurant)} className="w-[145px] flex-none overflow-hidden rounded-xl bg-white/10 text-left ring-1 ring-white/10 active:scale-[0.98]"><div className="flex items-center gap-2 p-2"><AppImage src={restaurant.image} alt={restaurant.name} className="h-10 w-10 flex-none rounded-lg object-cover" sizes="40px" width={40} height={40} /><div className="min-w-0"><strong className="block truncate text-[10px]">{restaurant.name}</strong><span className="mt-0.5 block truncate text-[8px] text-[#ffc9c0]">{stage.label} · {relationship.completedOrders} 次</span></div></div><p className="truncate border-t border-white/10 px-2 py-1.5 text-[8px] text-white/50">常点 {favorite?.name || '还在认识你的口味'}</p></button>
          })}
        </div>
      </div>
    </section>
  )
}

function FilterSection({ title, children }) {
  return <section className="mb-4"><h3 className="mb-2 text-[12px] font-bold text-[#333]">{title}</h3><div className="grid grid-cols-3 gap-2">{children}</div></section>
}

function FilterChip({ active, onClick, children }) {
  return <button onClick={onClick} className={`h-9 rounded-lg border text-[11px] ${active ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] font-semibold text-[var(--brand-primary-deep)]' : 'border-[var(--border-soft)] bg-[var(--background)] text-[var(--text-secondary)]'}`}>{children}</button>
}
