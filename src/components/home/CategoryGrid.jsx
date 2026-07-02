const CIRCLE_COLORS = [
  'bg-orange-400',
  'bg-pink-400',
  'bg-teal-400',
  'bg-green-500',
  'bg-cyan-400',
  'bg-orange-500',
  'bg-yellow-400',
  'bg-red-400',
  'bg-lime-400',
  'bg-orange-300',
];

export default function CategoryGrid({ categories }) {
  return (
    <div className="bg-white px-4 py-3">
      <div className="flex flex-wrap">
        {categories.map((category, index) => {
          const colorClass = CIRCLE_COLORS[index % CIRCLE_COLORS.length];
          return (
            <div
              key={category.id}
              className="flex flex-col items-center gap-1"
              style={{ width: '20%' }}
            >
              <div
                className={`${colorClass} w-10 h-10 rounded-full flex items-center justify-center text-xl`}
              >
                {category.icon}
              </div>
              <span className="text-gray-500 text-center leading-tight" style={{ fontSize: '12px' }}>
                {category.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
