import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import RestaurantHeader from '../components/restaurant/RestaurantHeader';
import RestaurantInfo from '../components/restaurant/RestaurantInfo';
import MenuItem from '../components/restaurant/MenuItem';
import CategorySidebar from '../components/restaurant/CategorySidebar';
import CartBar from '../components/restaurant/CartBar';
import SpecModal from '../components/restaurant/SpecModal';

import restaurantsData from '../data/allRestaurants';
import { enrichProduct } from '../data/productProfiles';

// Normalize a restaurant's menus so that:
//   - each category has `name` (CategorySidebar reads cat.name)
//   - each item has `imageUrl` (MenuItem reads item.imageUrl)
function normalizeRestaurant(restaurant) {
  return {
    ...restaurant,
    menus: restaurant.menus.map((cat) => ({
      ...cat,
      name: cat.categoryName || cat.name || '',
      items: cat.items.map((item) => {
        const enriched = enrichProduct(item, restaurant, cat.categoryName || cat.name || '')
        return { ...enriched, imageUrl: enriched.imageUrl || enriched.image || '' }
      }),
    })),
  };
}

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const rawRestaurant = restaurantsData.find((r) => r.id === id);
  const restaurant = rawRestaurant ? normalizeRestaurant(rawRestaurant) : null;

  // --- State ---
  const [cartItems, setCartItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(
    restaurant ? restaurant.menus[0]?.categoryId : ''
  );
  const [activeTab, setActiveTab] = useState('点菜');
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [showHeaderName, setShowHeaderName] = useState(false);
  const [specItem, setSpecItem] = useState(null);

  // --- Derived cart values ---
  const totalCount = Object.values(cartItems).reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );
  const totalPrice = Object.values(cartItems).reduce(
    (sum, entry) => sum + entry.unitPrice * entry.quantity,
    0
  );
  const couponAmount = restaurant ? restaurant.couponAmount : 0;

  // --- Scroll: show header name after 200px ---
  useEffect(() => {
    function handleScroll() {
      setShowHeaderName(window.scrollY > 200);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- IntersectionObserver: sync activeCategory with visible section ---
  const menuContainerRef = useRef(null);
  const observerRef = useRef(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (!restaurant) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost entry that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const catId = visible[0].target.dataset.categoryId;
          if (catId) setActiveCategory(catId);
        }
      },
      {
        root: null,
        rootMargin: '-44px 0px -60% 0px',
        threshold: 0,
      }
    );

    restaurant.menus.forEach((cat) => {
      const el = document.getElementById('cat-' + cat.categoryId);
      if (el) observerRef.current.observe(el);
    });
  }, [restaurant]);

  useEffect(() => {
    // Wait one tick for DOM to render
    const timer = setTimeout(setupObserver, 100);
    return () => {
      clearTimeout(timer);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [setupObserver]);

  // --- Cart handlers ---
  function handleAdd(item) {
    addCartEntry({ item, specs: [], specSummary: '', unitPrice: item.price, quantity: 1 });
  }

  function addCartEntry(entry) {
    const specKey = entry.specs.flatMap((group) => group.options.map((option) => `${group.groupId}:${option.id}`)).join('|');
    const key = specKey ? `${entry.item.id}::${specKey}` : entry.item.id;
    setCartItems((prev) => ({
      ...prev,
      [key]: {
        ...entry,
        key,
        quantity: (prev[key]?.quantity || 0) + entry.quantity,
      },
    }));
    setSpecItem(null);
  }

  function handleRemove(key) {
    setCartItems((prev) => {
      const current = prev[key];
      if (!current) return prev;
      if (current.quantity <= 1) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: { ...current, quantity: current.quantity - 1 } };
    });
  }

  function handleIncrement(key) {
    setCartItems((prev) => ({
      ...prev,
      [key]: { ...prev[key], quantity: prev[key].quantity + 1 },
    }));
  }

  function itemQuantity(itemId) {
    return Object.values(cartItems).reduce((sum, entry) => sum + (entry.item.id === itemId ? entry.quantity : 0), 0);
  }

  function handleClearCart() {
    setCartItems({});
    setShowCartPanel(false);
  }

  function handleCategorySelect(categoryId) {
    setActiveCategory(categoryId);
    const el = document.getElementById('cat-' + categoryId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleCheckout() {
    navigate('/checkout', {
      state: { cartItems, restaurant, couponAmount },
    });
  }

  // --- Not found ---
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">餐厅不存在</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-orange-400 text-white rounded-full text-sm font-medium"
        >
          返回
        </button>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Fixed top header */}
      <RestaurantHeader
        restaurantName={restaurant.name}
        onBack={() => navigate(-1)}
        showName={showHeaderName}
      />

      {/* Main content: padded for fixed header (44px) and cart bar (60px) */}
      <div className="pt-[44px] pb-[60px]">
        {/* Restaurant info + cover images */}
        <RestaurantInfo restaurant={restaurant} />

        {/* Tab row: 点菜 | 评价 | 商家 */}
        <div className="sticky top-[44px] z-30 bg-white border-b border-gray-200 flex">
          {['点菜', '评价', '商家'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'relative flex-1 py-3 text-center text-sm',
                tab === activeTab ? 'font-black text-gray-900' : 'font-medium text-gray-500',
              ].join(' ')}
            >
              {tab}{tab === '评价' ? ` ${restaurant.rating}` : ''}
              {tab === activeTab && <span className="absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-[var(--brand-yellow)]" />}
            </button>
          ))}
        </div>

        {/* Menu / review / merchant content */}
        {activeTab === '点菜' ? (
          <div className="flex items-start">
            <CategorySidebar categories={restaurant.menus} activeCategory={activeCategory} onSelectCategory={handleCategorySelect} />
            <div ref={menuContainerRef} className="min-w-0 flex-1">
              {restaurant.menus.map((category) => (
                <div key={category.categoryId} id={'cat-' + category.categoryId} data-category-id={category.categoryId}>
                  <h3 className="sticky top-[88px] z-10 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500">{category.categoryName}</h3>
                  <div className="bg-white px-3">
                    {category.items.map((item) => <MenuItem key={item.id} item={item} quantity={itemQuantity(item.id)} onAdd={handleAdd} onRemove={() => handleRemove(item.id)} onChooseSpecs={setSpecItem} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === '评价' ? (
          <div className="min-h-[360px] bg-[#f6f6f6] p-3">
            <div className="rounded-xl bg-white p-4"><div className="flex items-end gap-2"><strong className="text-3xl text-[#ff5a2f]">{restaurant.rating}</strong><span className="pb-1 text-xs text-gray-400">商家评分</span></div><div className="mt-3 flex flex-wrap gap-2">{['味道很好', '包装仔细', '配送很快', '会再次光顾'].map((tag) => <span key={tag} className="rounded-full bg-[#fff6e8] px-3 py-1.5 text-xs text-[#8c6124]">{tag}</span>)}</div></div>
            <div className="mt-2 rounded-xl bg-white p-4 text-sm text-gray-600">“这一单是模拟的，但挑选时真的很快乐。”<p className="mt-2 text-xs text-gray-400">来自虚构街区角色的体验评价</p></div>
          </div>
        ) : (
          <div className="min-h-[360px] bg-[#f6f6f6] p-3"><div className="rounded-xl bg-white p-4"><h3 className="font-black">商家信息</h3><p className="mt-3 text-sm leading-6 text-gray-600">{restaurant.description}</p><div className="mt-4 border-t border-gray-100 pt-3 text-xs leading-7 text-gray-500"><p>营业时间：{restaurant.businessHours?.open}-{restaurant.businessHours?.close}</p><p>商家类型：原创虚构商家</p><p>价格与销量均为模拟内容，不构成真实交易</p></div></div></div>
        )}
      </div>

      {/* Fixed bottom cart bar */}
      <CartBar
        totalCount={totalCount}
        totalPrice={totalPrice}
        couponAmount={couponAmount}
        onToggleCart={() => setShowCartPanel((v) => !v)}
        onCheckout={handleCheckout}
      />

      {specItem && <SpecModal item={specItem} onClose={() => setSpecItem(null)} onConfirm={addCartEntry} />}

      {/* Cart panel slide-up */}
      {showCartPanel && totalCount > 0 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowCartPanel(false)}
          />

          {/* Panel */}
          <div className="fixed bottom-[60px] left-0 right-0 z-50 bg-white rounded-t-xl max-h-[60vh] flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-900">已选菜品</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearCart}
                  className="text-xs text-gray-400"
                >
                  清空
                </button>
                <button
                  onClick={() => setShowCartPanel(false)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400"
                  aria-label="关闭"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Cart item list */}
            <div className="overflow-y-auto flex-1 px-4">
              {Object.values(cartItems).map(({ key, item, quantity, specSummary, unitPrice }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-gray-50"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate text-sm text-gray-800">{item.name}</p>
                    {specSummary && <p className="mt-0.5 truncate text-[10px] text-gray-400">{specSummary}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleRemove(key)}
                      className="w-6 h-6 rounded-full border border-red-500 flex items-center justify-center text-red-500 text-base font-bold leading-none"
                      aria-label="减少"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-gray-900 min-w-[16px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(key)}
                      className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-base font-bold leading-none"
                      aria-label="增加"
                    >
                      +
                    </button>
                    <span className="text-sm font-bold text-orange-500 ml-2 min-w-[48px] text-right">
                      ¥{unitPrice * quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total row */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <span className="text-sm text-gray-600">合计</span>
              <span className="text-base font-bold text-orange-500">
                ¥{totalPrice}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
