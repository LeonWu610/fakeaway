import AppImage from '../common/AppImage'

const CARD_THEMES = [
  {
    background: 'linear-gradient(145deg, #FFF0E6 0%, #FFE5F3 52%, #E9E2FF 100%)',
    glow: 'bg-[#FF5D68]/20',
    accent: 'text-[#F04E4E]',
  },
  {
    background: 'linear-gradient(145deg, #E9E4FF 0%, #E0F0FF 50%, #FFE5F1 100%)',
    glow: 'bg-[#6D4AFF]/20',
    accent: 'text-[#6546E8]',
  },
];

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
    "linear-gradient(135deg, #ff9b88 0%, #ff6b57 100%)",
    "linear-gradient(135deg, #9d83ff 0%, #6d4aff 100%)",
    "linear-gradient(135deg, #4b466d 0%, #24213d 100%)",
    "linear-gradient(135deg, #f1d6ff 0%, #ffcfca 100%)",
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
    <div className="flex gap-2 px-3 py-1.5">
      {promoCards.map((card, cardIdx) => {
        const theme = CARD_THEMES[cardIdx % CARD_THEMES.length];
        const items = (card.items || []).slice(0, 2);

        return (
          <div
            key={card.id}
            className="relative min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[15px] border border-white/80 px-2 pb-1.5 pt-2.5 shadow-[0_7px_18px_rgba(72,53,132,.11)] transition active:scale-[0.99]"
            style={{ background: theme.background }}
            onClick={() => onCardClick && onCardClick(card)}
          >
            <span className={`pointer-events-none absolute -right-5 -top-6 h-16 w-16 rounded-full blur-xl ${theme.glow}`} />
            <span className="pointer-events-none absolute bottom-1 right-2 h-1.5 w-1.5 rounded-full bg-white/80 shadow-[10px_-8px_0_rgba(255,107,87,.45),-9px_-3px_0_rgba(109,74,255,.35)]" />
            {/* Badge pill — top-right */}
            {card.badge && (
              <span className="absolute right-2 top-1.5 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-coral)] px-1.5 py-0.5 text-[9px] font-bold leading-[13px] text-white shadow-sm">
                {card.badge}
              </span>
            )}

            {/* Header */}
            <div className="relative mb-0.5 min-h-[31px] pr-[52px]">
              <p className="truncate text-[13px] font-black leading-[16px] text-[var(--text-primary)]">
                {card.title}
              </p>
              {card.subtitle && (
                <p className={`mt-px truncate text-[9px] font-semibold leading-[12px] ${theme.accent}`}>
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
                    <div className="flex h-[42px] items-center gap-1.5">
                      <span className={`grid h-3.5 w-3.5 flex-none place-items-center rounded-[4px] text-[8px] font-black text-white ${idx === 0 ? 'bg-[var(--brand-coral)]' : 'bg-[var(--brand-primary)]'}`}>
                        {item.rank || idx + 1}
                      </span>
                      {/* Image */}
                      {imgSrc ? (
                        <AppImage
                          src={imgSrc}
                          alt={item.name}
                          className="h-8 w-8 flex-shrink-0 rounded-[7px] object-cover ring-1 ring-white/80"
                          sizes="32px"
                          width={32}
                          height={32}
                          priority
                        />
                      ) : (
                        <GradientPlaceholder index={cardIdx * 2 + idx} />
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[11px] font-bold leading-[14px] text-[var(--text-primary)]">
                          {item.name}
                        </p>
                        {item.desc && (
                          <p className="mt-0.5 truncate text-[8px] leading-[10px] text-[var(--text-muted)]">
                            {item.desc}
                          </p>
                        )}
                        <p className="mt-0.5 text-[11px] font-black leading-[14px] text-[var(--price-red)]">
                          ¥{item.price}
                        </p>
                      </div>
                    </div>

                    {/* Separator — only between items, not after the last one */}
                    {idx < items.length - 1 && (
                      <div className="my-0.5 border-b border-white/70" />
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
