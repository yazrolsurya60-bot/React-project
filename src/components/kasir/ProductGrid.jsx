// ============================================================
// PRODUCT GRID - Grid katalog menu dengan state empty/loading
// ============================================================
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

export default function ProductGrid({ items, onAddToCart }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <PackageSearch size={28} className="text-gray-400" />
        </div>
        <h3 className="text-gray-700 font-bold text-base mb-1">Menu Tidak Ditemukan</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Coba ubah kata kunci pencarian atau pilih kategori yang berbeda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
