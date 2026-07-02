const PromoCards = ({ promoCards = [], onCardClick }) => {
  return (
    <div className="flex gap-2 px-3 py-2">
      {promoCards.map((card) => (
        <div
          key={card.id}
          className="flex-1 rounded-2xl p-3 cursor-pointer active:opacity-80 transition-opacity overflow-hidden"
          style={{ backgroundColor: card.color || "#fff9ec" }}
          onClick={() => onCardClick && onCardClick(card)}
        >
          {/* Header */}
          <div className="mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-gray-900 leading-tight">
                {card.title}
              </span>
            </div>
            <span className="text-xs text-gray-500">{card.subtitle}</span>
          </div>

          {/* Badge */}
          {card.badge && (
            <div className="inline-block mb-2">
              <span className="text-xs font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 rounded-full">
                {card.badge}
              </span>
            </div>
          )}

          {/* Food Items */}
          <div className="flex flex-col gap-2">
            {(card.items || []).slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Image placeholder */}
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0"
                  style={{
                    background:
                      idx === 0
                        ? "linear-gradient(135deg, #f6a623 0%, #f05a28 100%)"
                        : "linear-gradient(135deg, #f9d423 0%, #f83600 100%)",
                  }}
                />
                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate leading-tight">
                    {item.name}
                  </p>
                  {item.desc && (
                    <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                      {item.desc}
                    </p>
                  )}
                  <p className="text-xs font-bold text-orange-500 mt-0.5">
                    ¥{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromoCards;
