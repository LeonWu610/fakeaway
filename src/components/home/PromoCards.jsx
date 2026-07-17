const WARM_BG = "#fff8f0";
const COOL_BG = "#f0f6ff";

function getMenuImage(restaurants, restaurantId) {
  if (!restaurants || !restaurantId) return null;
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) return null;
  const guessCategory = restaurant.menus?.find(
    (m) => m.categoryName === "猜你喜欢"
  );
  const sourceItems = guessCategory?.items ?? restaurant.menus?.[0]?.items;
  if (!sourceItems || sourceItems.length === 0) return null;
  const hotItem = sourceItems.find((item) => item.isHot) ?? sourceItems[0];
  return hotItem.image ?? null;
}

function GradientPlaceholder({ index }) {
  const gradients = [
    "linear-gradient(135deg, #f6a623 0%, #f05a28 100%)",
    "linear-gradient(135deg, #f9d423 0%, #f83600 100%)",
    "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  ];
  return (
    <div
      className="w-14 h-14 rounded-lg flex-shrink-0"
      style={{ background: gradients[index % gradients.length] }}
    />
  );
}

export default function PromoCards({ promoCards = [], restaurants = [], onCardClick }) {
  return (
    <div className="flex gap-2 px-3 py-2">
      {promoCards.map((card, cardIdx) => {
        const isLeft = cardIdx === 0;
        const bgColor = card.color ?? (isLeft ? WARM_BG : COOL_BG);
        const items = (card.items || []).slice(0, 2);

        return (
          <div
            key={card.id}
            className="flex-1 rounded-xl p-2.5 cursor-pointer active:scale-[0.99] transition overflow-hidden relative shadow-sm"
            style={{ backgroundColor: bgColor }}
            onClick={() => onCardClick && onCardClick(card)}
          >
            {/* Badge pill — top-right */}
            {card.badge && (
              <span className="absolute top-3 right-3 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 rounded-full leading-tight">
                {card.badge}
              </span>
            )}

            {/* Header */}
            <div className="mb-2 pr-10">
              <p className="text-sm font-bold text-gray-900 leading-tight truncate">
                {card.title}
              </p>
              {card.subtitle && (
                <p className="text-xs text-orange-500 leading-tight mt-0.5 truncate">
                  {card.subtitle}
                </p>
              )}
            </div>

            {/* Food items */}
            <div className="flex flex-col">
              {items.map((item, idx) => {
                const imgSrc = getMenuImage(restaurants, item.restaurantId);
                return (
                  <div key={idx}>
                    <div className="flex items-center gap-2 py-1.5">
                      <span className={`grid h-4 w-4 flex-none place-items-center rounded-sm text-[9px] font-black text-white ${idx === 0 ? 'bg-[#ff4d33]' : 'bg-[#ff9c44]'}`}>
                        {item.rank || idx + 1}
                      </span>
                      {/* Image */}
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={item.name}
                          className="w-11 h-11 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <GradientPlaceholder index={cardIdx * 2 + idx} />
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate leading-tight">
                          {item.name}
                        </p>
                        {item.desc && (
                          <p className="text-xs text-gray-500 truncate leading-tight mt-0.5">
                            {item.desc}
                          </p>
                        )}
                        <p className="text-sm font-bold text-[var(--price-red)] mt-0.5 leading-tight">
                          ¥{item.price}
                        </p>
                      </div>
                    </div>

                    {/* Separator — only between items, not after the last one */}
                    {idx < items.length - 1 && (
                      <div className="border-b border-gray-200" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
