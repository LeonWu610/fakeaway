import React from 'react';

export default function RestaurantCard({ restaurant, onClick }) {
  const {
    name,
    image,
    tags = [],
    rating,
    monthlySales,
    distance,
    deliveryTime,
    couponAmount,
    minOrder,
    deliveryFee,
  } = restaurant;

  return (
    <div
      className="flex items-start bg-white px-4 py-3 border-b border-gray-100 active:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      {/* Left: restaurant image with badge */}
      <div className="relative flex-shrink-0 mr-3">
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <span className="absolute top-1 left-1 bg-orange-500 text-white text-xs font-medium px-1 py-0.5 rounded leading-none">
          进店有券
        </span>
      </div>

      {/* Right: content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Restaurant name */}
        <p className="text-gray-900 font-bold text-sm leading-tight truncate">
          {name}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-gray-400 text-xs bg-gray-100 rounded px-1.5 py-0.5 leading-none"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating row */}
        <div className="flex items-center gap-1.5">
          <span className="text-orange-500 text-xs font-medium">★ {rating}分</span>
          <span className="text-gray-400 text-xs">月售{monthlySales}+</span>
        </div>

        {/* Distance / time row */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 text-xs">{distance}</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-400 text-xs">约{deliveryTime}分钟</span>
        </div>

        {/* Savings / delivery info row */}
        <div className="flex items-center justify-between">
          {couponAmount > 0 ? (
            <span className="text-green-500 text-xs font-medium">
              已帮你省¥{couponAmount}
            </span>
          ) : (
            <span />
          )}
          <span className="text-gray-400 text-xs">
            起送¥{minOrder} 配送¥{deliveryFee}
          </span>
        </div>
      </div>
    </div>
  );
}
