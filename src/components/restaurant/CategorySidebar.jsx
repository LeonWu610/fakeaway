export default function CategorySidebar({ categories, activeCategory, onSelectCategory }) {
  return (
    <div
      className="sticky top-[88px] h-[calc(100vh-148px)] w-[78px] flex-shrink-0 overflow-y-auto bg-[#f5f5f5]"
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat.categoryId;
        return (
          <button
            key={cat.categoryId}
            onClick={() => onSelectCategory(cat.categoryId)}
            className={[
              'w-full py-3 px-2 text-center text-xs block',
              isActive
                ? 'bg-white text-gray-900 font-medium'
                : 'text-gray-600',
            ].join(' ')}
            style={
              isActive
                ? { borderLeft: '3px solid var(--brand-yellow)' }
                : { borderLeft: '3px solid transparent' }
            }
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
