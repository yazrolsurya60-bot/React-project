// ============================================================
// KITCHEN STORE - Zustand global state untuk Antrean Dapur
// ============================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useKitchenStore = create(
  persist(
    (set) => ({
      // Array item pesanan yang masuk ke dapur
      // Model item: { id (custom unik), orderId, cartId, productInfo, notes, customization, status, startTime, timerWarning }
      kitchenItems: [],

      // ── Actions ────────────────────────────────────────────────

      /**
       * Menerima item baru dari Kasir (difilter hanya makanan/snack/dessert)
       */
      addItemsToKitchen: (items, orderId) => {
        set((state) => {
          const newKitchenItems = items.map((item) => ({
            ...item,                  // membawa informasi cartItem
            kitchenItemId: `KITCHEN-${orderId}-${item.cartId}-${Date.now()}`,
            orderReference: orderId,
            status: 'todo',           // 'todo', 'progress', 'done'
            startTime: Date.now(),    // untuk SLA stopwatch
            isWarning: false,         // merah jika SLA > 15 menit
          }));

          // Masukkan ke depan atau belakang? Ke belakang antrean (FIFO)
          return {
            kitchenItems: [...state.kitchenItems, ...newKitchenItems],
          };
        });
      },

      /**
       * Mengubah status item dapur
       */
      updateItemStatus: (kitchenItemId, newStatus) => {
        set((state) => ({
          kitchenItems: state.kitchenItems.map((kItem) =>
            kItem.kitchenItemId === kitchenItemId
              ? { ...kItem, status: newStatus }
              : kItem
          ),
        }));
      },

      /**
       * Membatalkan item secara paksa jika stok habis, dan bisa dihubungkan untuk trigger Out of Stock.
       */
      cancelItem: (kitchenItemId) => {
        set((state) => ({
          kitchenItems: state.kitchenItems.filter((i) => i.kitchenItemId !== kitchenItemId),
        }));
      },

      /**
       * Kosongkan dapur (misal tutup shift)
       */
      clearKitchen: () => set({ kitchenItems: [] }),
    }),
    {
      name: 'kitchen-storage', // nama key di localStorage
      storage: createJSONStorage(() => localStorage), // (optional) by default uses localStorage
    }
  )
);

export default useKitchenStore;
