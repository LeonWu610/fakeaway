import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeHeader from '../components/home/HomeHeader'
import SearchBar from '../components/home/SearchBar'
import CategoryGrid from '../components/home/CategoryGrid'
import PromoCards from '../components/home/PromoCards'
import CouponBanner from '../components/home/CouponBanner'
import RestaurantCard from '../components/home/RestaurantCard'
import BottomNav from '../components/common/BottomNav'
import restaurants from '../data/allRestaurants'
import config from '../data/config.json'

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
  ['retail', '超市零售'],
  ['errand', '跑腿服务'],
]

function numberFrom(value) {
  return Number.parseFloat(String(value).replace(/[^\d.]/g, '')) || 0
}

function salesFrom(value) {
  const text = String(value || '')
  const amount = numberFrom(text)
  return text.includes('万') ? amount * 10000 : amount
}

function restaurantText(restaurant) {
  const menuText = restaurant.menus.flatMap((category) => [category.categoryName, ...category.items.flatMap((item) => [item.name, item.description])]).join(' ')
  return `${restaurant.name} ${restaurant.description} ${restaurant.listProfile?.identity || ''} ${menuText}`.toLowerCase()
}

function inCategory(restaurant, category) {
  if (category === 'all') return true
  if (category === 'food') return Boolean(restaurant.foodCategory) || !restaurant.retailCategory
  const text = restaurantText(restaurant)
  if (category === 'drink') return /茶|咖啡|拿铁|果汁|奶盖|饮品/.test(text)
  if (category === 'fast') return /汉堡|鸡|薯|炸|牛堡/.test(text)
  if (category === 'rice') return ['rice', 'noodles', 'malatang'].includes(restaurant.foodCategory)
  if (category === 'fresh') return ['japanese', 'lightMeal'].includes(restaurant.foodCategory)
  if (category === 'breakfast') return restaurant.foodCategory === 'breakfast'
  if (category === 'home') return ['dumplings', 'stirFry'].includes(restaurant.foodCategory)
  if (category === 'bakery') return restaurant.foodCategory === 'bakery'
  if (category === 'retail') return ['market', 'fruits', 'medicine'].includes(restaurant.retailCategory)
  if (category === 'errand') return restaurant.retailCategory === 'errand'
  return /夜宵|火锅|拼盘|肥牛|锅/.test(text)
}

export default function HomePage() {
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  const restaurantSectionRef = useRef(null)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('smart')
  const [showSort, setShowSort] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ freeDelivery: false, coupon: false, category: 'all', maxDeliveryTime: 0 })

  const filteredRestaurants = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const result = restaurants.filter((restaurant) => {
      if (keyword && !restaurantText(restaurant).includes(keyword)) return false
      if (filters.freeDelivery && numberFrom(restaurant.deliveryFee) > 0) return false
      if (filters.coupon && !(restaurant.couponAmount > 0 || restaurant.coupons?.length)) return false
      if (filters.maxDeliveryTime && restaurant.deliveryTime > filters.maxDeliveryTime) return false
      return inCategory(restaurant, filters.category)
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
      market: { category: 'retail', query: '超市便利' },
      fruits: { category: 'retail', query: '蔬菜水果' },
      medicine: { category: 'retail', query: '看病买药' },
      tea: { category: 'drink', query: '茶' },
      group: { category: 'fast', query: '' },
      errand: { category: 'errand', query: '' },
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
    setSortBy(category.id === 'new' ? 'rating' : 'smart')
    setQuery(action.query)
    window.setTimeout(focusResults, 0)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <HomeHeader address={config.address} />
      <SearchBar inputRef={searchInputRef} value={query} onChange={setQuery} onSubmit={focusResults} onClear={() => setQuery('')} />

      <div className="bg-white"><CategoryGrid categories={config.categories} onCategoryClick={handleCategoryClick} /></div>
      <div className="h-2 bg-gray-100" />
      <div className="bg-white">
        <PromoCards promoCards={config.promoCards} restaurants={restaurants} onCardClick={(card) => { const restaurantId = card.items?.[0]?.restaurantId; if (restaurantId) navigate('/restaurant/' + restaurantId) }} />
      </div>
      <div className="h-2 bg-gray-100" />
      {config.coupons?.length > 0 && <><div className="bg-white"><CouponBanner coupons={config.coupons} /></div><div className="h-2 bg-gray-100" /></>}

      <div ref={restaurantSectionRef} className="scroll-mt-[90px]">
        <div className="sticky top-[91px] z-30 flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-2.5">
          <span className="text-[16px] font-black text-gray-900">{query ? '搜索结果' : '附近商家'}</span>
          <span className="rounded-sm bg-[#fff0ed] px-1.5 py-0.5 text-[10px] font-semibold text-[#f0442f]">{filteredRestaurants.length}家</span>
          <div className="flex-1" />
          <button onClick={() => { setShowSort(true); setShowFilters(false) }} className={`flex items-center gap-1 text-[11px] ${sortBy !== 'smart' ? 'font-semibold text-[#222]' : 'text-gray-500'}`}>{currentSort} <span className="text-[8px]">▼</span></button>
          <button onClick={() => { setShowFilters(true); setShowSort(false) }} className={`text-[11px] ${activeFilterCount ? 'font-semibold text-[#222]' : 'text-gray-500'}`}>筛选{activeFilterCount ? ` · ${activeFilterCount}` : ''}</button>
        </div>

        {query && <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-2 text-[11px] text-gray-500"><span>正在搜索“<strong className="text-[#222]">{query}</strong>”</span><button onClick={() => setQuery('')} className="ml-auto text-[#ad7612]">清除</button></div>}

        <div className="bg-white">
          {filteredRestaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={{ ...restaurant, minOrder: restaurant.minPrice, avgPrice: restaurant.avgPrice }} onClick={() => navigate('/restaurant/' + restaurant.id)} />)}
          {filteredRestaurants.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gray-100 text-2xl text-gray-400">⌕</div>
              <h3 className="mt-3 text-sm font-bold text-gray-700">没有找到合适的商家</h3>
              <p className="mt-1 text-[11px] text-gray-400">换个关键词，或放宽配送时间与品类筛选</p>
              <button onClick={() => { setQuery(''); resetFilters() }} className="mt-4 rounded-full bg-[var(--brand-yellow)] px-5 py-2 text-xs font-semibold">清空条件</button>
            </div>
          )}
        </div>
      </div>

      {(showSort || showFilters) && <button aria-label="关闭选择面板" onClick={() => { setShowSort(false); setShowFilters(false) }} className="fixed inset-0 z-40 bg-black/35" />}
      {showSort && (
        <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 rounded-t-2xl bg-white pb-[max(12px,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3"><strong className="text-[15px]">排序方式</strong><button onClick={() => setShowSort(false)} className="text-xl text-gray-400">×</button></div>
          {sortOptions.map(([key, label]) => <button key={key} onClick={() => { setSortBy(key); setShowSort(false) }} className="flex w-full items-center justify-between border-b border-gray-50 px-4 py-3 text-left text-[13px]"><span>{label}</span>{sortBy === key && <span className="font-bold text-[#e6a900]">✓</span>}</button>)}
        </div>
      )}
      {showFilters && (
        <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 rounded-t-2xl bg-white pb-[max(12px,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3"><strong className="text-[15px]">筛选商家</strong><button onClick={() => setShowFilters(false)} className="text-xl text-gray-400">×</button></div>
          <div className="max-h-[62vh] overflow-y-auto px-4 py-3">
            <FilterSection title="配送与优惠"><FilterChip active={filters.freeDelivery} onClick={() => setFilters((value) => ({ ...value, freeDelivery: !value.freeDelivery }))}>免配送费</FilterChip><FilterChip active={filters.coupon} onClick={() => setFilters((value) => ({ ...value, coupon: !value.coupon }))}>有优惠券</FilterChip></FilterSection>
            <FilterSection title="商家品类">{categoryOptions.map(([key, label]) => <FilterChip key={key} active={filters.category === key} onClick={() => setFilters((value) => ({ ...value, category: key }))}>{label}</FilterChip>)}</FilterSection>
            <FilterSection title="配送时间">{[[0, '不限'], [20, '20分钟内'], [30, '30分钟内'], [45, '45分钟内']].map(([minutes, label]) => <FilterChip key={minutes} active={filters.maxDeliveryTime === minutes} onClick={() => setFilters((value) => ({ ...value, maxDeliveryTime: minutes }))}>{label}</FilterChip>)}</FilterSection>
          </div>
          <div className="flex gap-3 border-t border-gray-100 px-4 pt-3"><button onClick={resetFilters} className="h-10 flex-1 rounded-full border border-gray-200 text-[13px]">重置</button><button onClick={() => { setShowFilters(false); focusResults() }} className="h-10 flex-[2] rounded-full bg-[var(--brand-yellow)] text-[13px] font-bold">查看 {filteredRestaurants.length} 家商家</button></div>
        </div>
      )}

      <div className="pb-20" />
      <BottomNav />
    </div>
  )
}

function FilterSection({ title, children }) {
  return <section className="mb-4"><h3 className="mb-2 text-[12px] font-bold text-[#333]">{title}</h3><div className="grid grid-cols-3 gap-2">{children}</div></section>
}

function FilterChip({ active, onClick, children }) {
  return <button onClick={onClick} className={`h-9 rounded-md border text-[11px] ${active ? 'border-[#efc21e] bg-[#fff9df] font-semibold text-[#222]' : 'border-gray-100 bg-[#f7f7f7] text-gray-600'}`}>{children}</button>
}
