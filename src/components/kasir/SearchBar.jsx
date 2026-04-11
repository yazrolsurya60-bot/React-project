// ============================================================
// SEARCH BAR - Pencarian menu real-time
// ============================================================
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative group">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200 pointer-events-none"
      />
      <input
        id="search-menu"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari menu favorit kamu..."
        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400
          transition-all duration-200 shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center
            rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-500 transition-all duration-150"
          title="Hapus pencarian"
        >
          <X size={11} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
