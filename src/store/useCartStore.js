// ============================================================
// CART STORE - Zustand global state untuk keranjang belanja
// ============================================================
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────
  items: [],          // Array item di cart
  discount: 0,        // Diskon dalam rupiah
  voucherCode: '',    // Kode voucher yang diaplikasikan
  customerName: '',   // Nama pelanggan

  // ── Computed (via getter) ──────────────────────────────────
  get subtotal() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  get tax() {
    return Math.round(get().subtotal * 0.1);
  },
  get total() {
    return get().subtotal + get().tax - get().discount;
  },
  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // ── Actions ────────────────────────────────────────────────

  setCustomerName: (name) => set({ customerName: name }),

  /**
   * Tambah item ke cart.
   * Jika item+kustomisasi sudah ada → increment quantity.
   * Jika belum ada → tambah sebagai baris baru.
   */
  addItem: (product, customization = null, notes = '') => {
    set((state) => {
      // Key unik berdasarkan id + kustomisasi (JSON)
      const customKey = customization ? JSON.stringify(customization) : 'default';

      const existing = state.items.find(
        (i) => i.id === product.id && i.customKey === customKey
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id && i.customKey === customKey
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...product,
            quantity: 1,
            customization,
            customKey,
            notes,
            cartId: `${product.id}-${Date.now()}`, // ID unik per baris cart
          },
        ],
      };
    });
  },

  /** Naikkan quantity satu item */
  incrementItem: (cartId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }));
  },

  /** Turunkan quantity. Jika sudah 1 → hapus */
  decrementItem: (cartId) => {
    set((state) => ({
      items: state.items
        .map((i) => (i.cartId === cartId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    }));
  },

  /** Hapus satu item dari cart */
  removeItem: (cartId) => {
    set((state) => ({
      items: state.items.filter((i) => i.cartId !== cartId),
    }));
  },

  /** Kosongkan seluruh cart */
  clearCart: () => {
    set({ items: [], discount: 0, voucherCode: '', customerName: '' });
  },

  /** Terapkan voucher / diskon */
  applyVoucher: (code) => {
    const vouchers = {
      CAFEPOS10: 10000,
      HEMAT20: 20000,
      GRATIS5: 5000,
    };
    const disc = vouchers[code.toUpperCase()];
    if (disc) {
      set({ discount: disc, voucherCode: code.toUpperCase() });
      return { success: true, discount: disc };
    }
    return { success: false };
  },

  /** Hapus voucher */
  removeVoucher: () => {
    set({ discount: 0, voucherCode: '' });
  },
}));

export default useCartStore;
