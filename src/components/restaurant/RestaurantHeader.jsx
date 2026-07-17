export default function RestaurantHeader({ restaurantName, onBack, showName }) {
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

      <div className="flex items-center gap-2">
        <button
          className="flex items-center justify-center w-8 h-8 text-gray-700"
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button
          className="flex items-center justify-center w-8 h-8 text-gray-700"
          aria-label="Favorite"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
