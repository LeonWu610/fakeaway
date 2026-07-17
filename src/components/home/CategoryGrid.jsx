const CATEGORY_CONFIG = {
  food: {
    bg: '#FF6B35',
    svg: (
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15a6 6 0 01-6 6H3M21 6H16M16 6a5 5 0 010 10" />
    ),
  },
  drinks: {
    bg: '#FF9FC5',
    svg: (
      <>
        <path d="M9 2h6l1 9H8L9 2zM8 11c0 4 4 8 4 8s4-4 4-8" />
        <circle cx="12" cy="5" r="1" />
      </>
    ),
  },
  market: {
    bg: '#00B578',
    svg: (
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
    ),
  },
  fruits: {
    bg: '#52C41A',
    svg: (
      <>
        <circle cx="12" cy="14" r="6" />
        <path d="M12 8c0-3 3-5 5-4" />
      </>
    ),
  },
  medicine: {
    bg: '#1890FF',
    svg: (
      <>
        <path d="M12 2v20M2 12h20" />
        <rect x="5" y="5" width="14" height="14" rx="2" />
      </>
    ),
  },
  tea: {
    bg: '#FAAD14',
    svg: (
      <path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4zM6 2v4M10 2v4M14 2v4" />
    ),
  },
  group: {
    bg: '#722ED1',
    svg: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
  },
  errand: {
    bg: '#F5222D',
    svg: (
      <>
        <circle cx="12" cy="5" r="3" />
        <path d="M8 21v-5l-2-4h12l-2 4v5M12 21v-5" />
      </>
    ),
  },
  subsidy: {
    bg: '#EB2F96',
    svg: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 6l4 7 4-7M6 11h12M6 15h12M12 15v5" />
      </>
    ),
  },
  new: {
    bg: '#13C2C2',
    svg: (
      <path d="M20 12v10H4V12M22 7H2v5h20zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7" />
    ),
  },
};

export default function CategoryGrid({ categories, onCategoryClick }) {
  return (
    <div className="bg-white px-4 py-3">
      <div className="grid grid-cols-5 gap-y-3">
        {categories.map((category) => {
          const config = CATEGORY_CONFIG[category.id] || { bg: '#999', svg: null };
          return (
            <button
              key={category.id}
              onClick={() => onCategoryClick?.(category)}
              className="flex flex-col items-center active:opacity-70"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-1"
                style={{ backgroundColor: config.bg, borderRadius: '12px' }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {config.svg}
                </svg>
              </div>
              <span
                className="text-center leading-tight"
                style={{ fontSize: '11px', color: '#666' }}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
