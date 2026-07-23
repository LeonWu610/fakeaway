import { useFeatureNotice } from '../../contexts/FeatureNoticeContext'

export default function RestaurantHeader({ restaurantName, onBack, showName, onCart, cartCount = 0 }) {
  const { showFeatureNotice } = useFeatureNotice()

  return (
    <header className="fixed top-0 left-0 right-0 h-11 bg-white z-50 flex items-center px-3 border-b border-gray-200">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-8 h-8 -ml-1 text-gray-700"
        aria-label="Go back"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="flex-1 min-w-0 px-2 text-center">
        <span
          className={`text-sm font-medium truncate block transition-opacity duration-200 ${
            showName ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {restaurantName}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onCart}
          className="relative flex h-8 w-8 items-center justify-center text-gray-700"
          aria-label={`打开购物车，当前共${cartCount}件商品`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M5 8h14l-1 13H6L5 8Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          {cartCount > 0 && <span className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--brand-coral)] px-1 text-[8px] font-black leading-none text-white">{cartCount > 99 ? '99+' : cartCount}</span>}
        </button>
        <button
          onClick={() => showFeatureNotice({ title: '店内搜索正在备货', message: `很快就能在「${restaurantName}」里直奔想吃的那一口。` })}
          className="flex items-center justify-center w-8 h-8 text-gray-700"
          aria-label="搜索店内商品"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button
          onClick={() => showFeatureNotice({ title: '收藏夹正在钉招牌', message: `「${restaurantName}」会先替你亮着灯，收藏功能很快就来。` })}
          className="flex items-center justify-center w-8 h-8 text-gray-700"
          aria-label="收藏商家"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
