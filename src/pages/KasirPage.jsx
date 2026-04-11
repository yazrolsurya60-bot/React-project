// ============================================================
// KASIR PAGE - Halaman utama kasir (layout + logika)
// ============================================================
import { useState, useMemo } from 'react';
import Header from '../components/kasir/Header';
import SearchBar from '../components/kasir/SearchBar';
import CategoryFilter from '../components/kasir/CategoryFilter';
import ProductGrid from '../components/kasir/ProductGrid';
import CartPanel from '../components/kasir/CartPanel';
import CustomizerModal from '../components/kasir/CustomizerModal';
import { menuData, CATEGORIES } from '../data/menuData';
import useCartStore from '../store/useCartStore';

export default function KasirPage() {
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const [customizerItem, setCustomizerItem] = useState(null);

  const { addItem } = useCartStore();

  // ── Filter & Search ────────────────────────────────────────
  const filteredMenu = useMemo(() => {
    let result = menuData;

    if (activeCategory !== 'semua') {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [searchQuery, activeCategory]);

  // ── Hitung jumlah item per kategori ───────────────────────
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach(({ id }) => {
      counts[id] =
        id === 'semua'
          ? menuData.length
          : menuData.filter((item) => item.category === id).length;
    });
    return counts;
  }, []);

  // ── Handler: tambah ke cart ────────────────────────────────
  const handleAddToCart = (item) => {
    if (item.hasCustomizer) {
      setCustomizerItem(item);        // Buka modal kustomisasi
    } else {
      addItem(item);                  // Langsung tambah ke cart
    }
  };

  const handleCustomizerConfirm = (item, customization, notes) => {
    addItem(item, customization, notes);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* ── App Header ── */}
      <Header />

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Katalog Menu (area kiri-tengah) ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Toolbar: Search + Filter */}
          <div className="px-6 pt-5 pb-4 bg-gray-50 space-y-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-900 font-black text-lg leading-tight">Menu Hari Ini</h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  {filteredMenu.length} menu tersedia
                </p>
              </div>
            </div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
              counts={categoryCounts}
            />
          </div>

          {/* Product Grid (scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <ProductGrid items={filteredMenu} onAddToCart={handleAddToCart} />
          </div>
        </main>

        {/* ── Cart Panel (sisi kanan) ── */}
        <CartPanel />
      </div>

      {/* ── Customizer Modal ── */}
      {customizerItem && (
        <CustomizerModal
          item={customizerItem}
          onConfirm={handleCustomizerConfirm}
          onClose={() => setCustomizerItem(null)}
        />
      )}
    </div>
  );
}
