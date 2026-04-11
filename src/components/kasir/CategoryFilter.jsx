// ============================================================
// CATEGORY FILTER - Filter kategori menu (pill tabs)
// ============================================================
import { CATEGORIES } from '../../data/menuData';

export default function CategoryFilter({ activeCategory, onSelect, counts }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts?.[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            id={`category-${cat.id}`}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap
              transition-all duration-200 border select-none shrink-0
              ${
                isActive
                  ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-200'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600'
              }`}
          >
            <span className="text-base leading-none">{cat.emoji}</span>
            {cat.label}
            {cat.id !== 'semua' && count > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                  ${isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
