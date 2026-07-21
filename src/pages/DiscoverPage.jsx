import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import AppImage from '../components/common/AppImage'
import restaurants from '../data/allRestaurants'

const moods = [
  { key: 'tired', title: '今天有点累', subtitle: '选一家不催你的店', gradient: 'from-[var(--brand-night-soft)] to-[var(--brand-night)]', icon: 'moon', restaurantId: 'r5' },
  { key: 'reward', title: '想奖励自己', subtitle: '把仪式感加满', gradient: 'from-[var(--brand-coral)] to-[var(--brand-primary-deep)]', icon: 'gift', restaurantId: 'r1' },
  { key: 'warm', title: '想要热乎乎', subtitle: '让等待也暖一点', gradient: 'from-[var(--brand-coral)] to-[var(--brand-night)]', icon: 'steam', restaurantId: 'r6' },
  { key: 'quick', title: '只想快一点', subtitle: '短短等一会儿就好', gradient: 'from-[var(--brand-primary)] to-[var(--brand-night)]', icon: 'bolt', restaurantId: 'r3' },
]

function DiscoverIcon({ name, className = 'h-6 w-6' }) {
  const icons = {
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6" /></>,
    bag: <><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    moon: <path d="M19 15.5A8 8 0 0 1 8.5 5a8 8 0 1 0 10.5 10.5Z" />,
    gift: <><path d="M4 10h16v11H4V10Zm-1-4h18v4H3V6Zm9 0v15" /><path d="M12 6C9 6 7 5 7 3.5S9.5 2 12 6Zm0 0c3 0 5-1 5-2.5S14.5 2 12 6Z" /></>,
    steam: <><path d="M5 16h14a7 7 0 0 1-14 0Z" /><path d="M8 12c-2-2 2-3 0-6m4 6c-2-2 2-3 0-6m4 6c-2-2 2-3 0-6" /></>,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
  }
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}

export default function DiscoverPage() {
  const navigate = useNavigate()
  const memories = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fakeaway.memories') || '[]') } catch { return [] }
  }, [])
  const hour = new Date().getHours()
  const sceneTitle = hour >= 22 ? '深夜不急着睡' : hour >= 18 ? '今晚想等点什么' : '给今天加一点期待'
  const featured = [restaurants[4], restaurants[0], restaurants[5]]

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20 text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 flex items-end justify-between bg-[var(--background)]/95 px-4 pb-3 pt-[max(14px,env(safe-area-inset-top))] backdrop-blur">
        <div><p className="text-[10px] font-semibold text-[#9b7042]">FAKEAWAY · 今日发现</p><h1 className="mt-0.5 text-[21px] font-black">{sceneTitle}</h1></div>
        <button onClick={() => navigate('/profile')} className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface)] text-[var(--brand-primary)] shadow-sm" aria-label="进入我的"><DiscoverIcon name="user" className="h-5 w-5" /></button>
      </header>

      <section className="px-3">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--brand-night)] px-5 py-5 text-white shadow-[0_12px_30px_rgba(40,30,28,0.16)]">
          <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-[var(--brand-coral)]/20" /><div className="absolute bottom-3 right-12 text-white/80"><DiscoverIcon name="bag" className="h-14 w-14" /></div>
          <p className="text-[10px] text-white/50">今日等待提案</p><h2 className="mt-2 max-w-[230px] text-[22px] font-black leading-7">不用真的吃掉，<br />也可以认真挑一顿。</h2>
          <p className="mt-3 max-w-[240px] text-[11px] leading-5 text-white/60">从选店、加料到等骑手，给自己留一段轻轻悬着的时间。</p>
          <button onClick={() => navigate('/restaurant/r1')} className="mt-4 rounded-full bg-[var(--brand-primary)] px-4 py-2 text-[11px] font-bold text-white">开始今晚的第一单</button>
        </div>
      </section>

      <section className="mt-5 px-3">
        <div className="mb-2 flex items-end justify-between"><div><h2 className="text-[15px] font-black">按现在的心情选</h2><p className="mt-0.5 text-[9px] text-gray-400">不用想吃什么，先想此刻需要什么</p></div></div>
        <div className="grid grid-cols-2 gap-2">{moods.map((mood) => <button key={mood.key} onClick={() => navigate(`/restaurant/${mood.restaurantId}`)} className={`relative min-h-[100px] overflow-hidden rounded-xl bg-gradient-to-br ${mood.gradient} p-3 text-left text-white shadow-sm`}><span className="absolute bottom-2 right-2 opacity-80"><DiscoverIcon name={mood.icon} className="h-10 w-10" /></span><h3 className="relative text-[14px] font-bold">{mood.title}</h3><p className="relative mt-1 text-[9px] text-white/65">{mood.subtitle}</p><span className="relative mt-4 inline-block text-[9px] font-semibold">去看看 ›</span></button>)}</div>
      </section>

      <section className="mt-5">
        <div className="mb-2 flex items-end justify-between px-3"><div><h2 className="text-[15px] font-black">今晚值得等</h2><p className="mt-0.5 text-[9px] text-gray-400">不同店，有不同的等待语气</p></div><button onClick={() => navigate('/')} className="text-[10px] text-gray-400">全部商家 ›</button></div>
        <div className="flex snap-x gap-2 overflow-x-auto px-3 pb-1 scrollbar-hide">{featured.map((restaurant) => <button key={restaurant.id} onClick={() => navigate(`/restaurant/${restaurant.id}`)} className="w-[235px] flex-none snap-start overflow-hidden rounded-xl bg-white text-left shadow-sm"><div className="relative h-[112px]"><AppImage src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" sizes="235px" width={235} height={112} /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><span className="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-[#333]">{restaurant.listProfile?.identity}</span></div><div className="p-3"><div className="flex items-center"><h3 className="min-w-0 flex-1 truncate text-[14px] font-bold">{restaurant.name}</h3><span className="text-[10px] font-bold text-[#f05a35]">{restaurant.rating}分</span></div><p className="mt-1 line-clamp-1 text-[9px] text-gray-400">{restaurant.waitingProfile?.stages?.[0] || restaurant.description}</p><div className="mt-2 flex items-center text-[9px] text-gray-500"><span>{restaurant.deliveryTime}分钟</span><span className="ml-2">{restaurant.distance}</span><span className="ml-auto text-[#a87916]">进入店铺 ›</span></div></div></button>)}</div>
      </section>

      <section className="mx-3 mt-5 rounded-xl bg-white p-4">
        <div className="flex items-center justify-between"><div><h2 className="text-[14px] font-black">你的等待收藏</h2><p className="mt-0.5 text-[9px] text-gray-400">每次送达，都会留下一个小小证据</p></div><strong className="text-[24px] text-[#e5a81a]">{memories.length}</strong></div>
        {memories.length > 0 ? <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">{memories.slice(0, 5).map((memory) => <button key={memory.orderId} onClick={() => navigate(`/restaurant/${memory.restaurantId}`)} className="w-[130px] flex-none rounded-lg bg-[var(--brand-primary-soft)] p-2.5 text-left"><p className="truncate text-[11px] font-bold">{memory.itemName}</p><p className="mt-1 truncate text-[9px] text-[var(--text-secondary)]">来自 {memory.restaurantName}</p></button>)}</div> : <button onClick={() => navigate('/')} className="mt-3 w-full rounded-lg bg-[var(--brand-primary-soft)] py-3 text-[10px] text-[var(--brand-primary-deep)]">完成第一单后，记忆会出现在这里 ›</button>}
      </section>
      <BottomNav activeTab="discover" />
    </main>
  )
}
