import React from 'react';
import HomeHeader from '../components/home/HomeHeader';
import SearchBar from '../components/home/SearchBar';
import CategoryGrid from '../components/home/CategoryGrid';
import PromoCards from '../components/home/PromoCards';
import CouponBanner from '../components/home/CouponBanner';
import RestaurantCard from '../components/home/RestaurantCard';
import BottomNav from '../components/common/BottomNav';
import restaurants from '../data/restaurants.json';
import config from '../data/config.json';

export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <HomeHeader address={config.address} />

      {/* Search bar */}
      <SearchBar />

      {/* Category grid - white section */}
      <div className="bg-white">
        <CategoryGrid categories={config.categories} />
      </div>

      {/* Gray divider */}
      <div className="h-2 bg-gray-100" />

      {/* Promo cards - white section */}
      <div className="bg-white">
        <PromoCards promoCards={config.promoCards} />
      </div>

      {/* Gray divider */}
      <div className="h-2 bg-gray-100" />

      {/* Coupon banner - only if coupons exist */}
      {config.coupons && config.coupons.length > 0 && (
        <>
          <div className="bg-white">
            <CouponBanner coupons={config.coupons} />
          </div>
          {/* Gray divider */}
          <div className="h-2 bg-gray-100" />
        </>
      )}

      {/* Nearby restaurants section header */}
      <div className="bg-white px-4 py-2 flex items-center gap-2">
        <span className="text-gray-900 font-bold text-sm">附近商家</span>
        <span
          className="text-xs font-medium text-white px-1.5 py-0.5 rounded"
          style={{ backgroundColor: '#F5A623' }}
        >
          特价外卖
        </span>
        <div className="flex-1" />
        <button
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: '#FFF3E0', color: '#F5A623' }}
        >
          一键下单
        </button>
      </div>

      {/* Restaurant list */}
      <div className="bg-white">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={{
              ...restaurant,
              minOrder: restaurant.minPrice,
            }}
            onClick={() => console.log(restaurant.id)}
          />
        ))}
      </div>

      {/* Bottom padding to avoid content behind BottomNav */}
      <div className="pb-20" />

      {/* Fixed bottom nav */}
      <BottomNav />
    </div>
  );
}
