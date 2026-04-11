// ============================================================
// PRODUCT CARD - Kartu Menu di Grid Katalog
// ============================================================
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { formatRupiah } from '../../data/menuData';

export default function ProductCard({ item, onAddToCart }) {
  const handleClick = () => {
    if (!item.isAvailable) return;
    onAddToCart(item);
  };

  return (
    <div
      id={`product-card-${item.id}`}
      onClick={handleClick}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 select-none ${
        item.isAvailable
          ? 'border-gray-100 cursor-pointer hover:border-red-200 hover:shadow-xl hover:shadow-red-50 hover:-translate-y-0.5'
          : 'border-gray-100 cursor-not-allowed opacity-60'
      }`}
    >
      {/* ── Gambar Produk ── */}
      <div className="relative h-36 overflow-hidden bg-gray-50">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            item.isAvailable ? 'group-hover:scale-110' : 'grayscale'
          }`}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback jika gambar gagal load */}
        <div
          className="hidden w-full h-full items-center justify-center text-4xl bg-linear-to-br from-gray-50 to-gray-100"
          style={{ display: 'none' }}
        >
          ☕
        </div>

        {/* Badge: Stok Kosong */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <AlertCircle size={13} className="text-red-600" />
              <span className="text-red-700 text-xs font-bold">Stok Habis</span>
            </div>
          </div>
        )}

        {/* Badge: Kategori */}
        <div className="absolute top-2 left-2">
          <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize">
            {item.category.replace('-', ' ')}
          </span>
        </div>

        {/* Overlay + Cart Icon saat hover */}
        {item.isAvailable && (
          <div className="absolute inset-0 bg-linear-to-t from-red-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
            <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
              <ShoppingCart size={15} />
              Tambah ke Cart
            </div>
          </div>
        )}
      </div>

      {/* ── Info Produk ── */}
      <div className="p-3">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 mb-0.5">
          {item.name}
        </h3>
        <p className="text-gray-400 text-xs leading-tight line-clamp-2 mb-2">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Harga */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-red-600 font-extrabold text-base">
            {formatRupiah(item.price)}
          </span>
          {item.hasCustomizer && (
            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">
              Bisa Custom
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
