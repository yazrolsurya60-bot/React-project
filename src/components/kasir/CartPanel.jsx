// ============================================================
// CART PANEL - Panel keranjang belanja (sisi kanan)
// ============================================================
import { useState } from 'react';
import { ShoppingCart, Trash2, ChevronRight } from 'lucide-react';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import CheckoutModal from './CheckoutModal';
import useCartStore from '../../store/useCartStore';
import useHistoryStore from '../../store/useHistoryStore';
import useKitchenStore from '../../store/useKitchenStore';

export default function CartPanel() {
  const { items, clearCart, discount, customerName, setCustomerName } = useCartStore();
  const { addOrder } = useHistoryStore();
  const { addItemsToKitchen } = useKitchenStore();
  const [showCheckout, setShowCheckout] = useState(false);

  // Computed
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total    = subtotal - discount;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const isEmpty = items.length === 0;

  const handleConfirmCheckout = () => {
    const orderId = `ORD-${Date.now()}`;
    const orderData = {
      id: orderId,
      customerName,
      items: [...items],
      subtotal,
      discount,
      total,
      totalQty
    };

    // Save order strictly to history
    addOrder(orderData);

    // Kirim item pesanan ke dapur (semua kategori, termasuk minuman)
    const activeCategories = ['makanan', 'snack', 'dessert', 'kopi', 'non-kopi'];
    const kitchenItems = items.filter(i => activeCategories.includes(i.category));
    if (kitchenItems.length > 0) {
      addItemsToKitchen(kitchenItems, orderId, customerName);
    }

    // Clear cart after checkout
    clearCart();
  };

  return (
    <>
      {/* ── Panel Wrapper ── */}
      <aside className="w-80 xl:w-96 bg-white border-l border-gray-100 flex flex-col h-full shrink-0">

        {/* ── Header Cart ── */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
              <ShoppingCart size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-gray-900 font-black text-sm leading-tight">Keranjang</h2>
              <p className="text-gray-400 text-[11px] leading-tight">
                {isEmpty ? 'Belum ada pesanan' : `${totalQty} item dipilih`}
              </p>
            </div>
          </div>

          {!isEmpty && (
            <button
              id="cart-clear"
              onClick={clearCart}
              className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all"
              title="Kosongkan cart"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* ── List Item ── */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-dashed border-gray-200">
                <ShoppingCart size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-semibold text-sm">Keranjang Kosong</p>
              <p className="text-gray-400 text-xs mt-1">Klik produk untuk menambah pesanan</p>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.cartId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* ── Order Summary + CTA ── */}
        {!isEmpty && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-4 shrink-0 bg-gray-50/60">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Pelanggan / Meja</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Budi / Meja 4"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              total={total}
            />

            <button
              id="checkout-button"
              onClick={() => setShowCheckout(true)}
              className="w-full flex items-center justify-between bg-red-600 hover:bg-red-700 active:scale-[0.98]
                text-white font-black text-sm px-5 py-4 rounded-2xl shadow-lg shadow-red-200
                transition-all duration-200"
            >
              <span>Proses Pembayaran</span>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {totalQty} item
                </span>
                <ChevronRight size={18} />
              </div>
            </button>
          </div>
        )}
      </aside>

      {/* ── Checkout Modal ── */}
      {showCheckout && (
        <CheckoutModal
          items={items}
          subtotal={subtotal}
          discount={discount}
          total={total}
          onConfirm={handleConfirmCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
}

