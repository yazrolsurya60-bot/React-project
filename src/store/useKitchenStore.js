// ============================================================
// KITCHEN STORE - Zustand global state untuk Antrean Dapur
// ============================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiRequest, USE_DATABASE } from '../services/apiService';

const useKitchenStore = create(
  persist(
    (set, get) => ({
      kitchenItems: [],
      loading: false,
      error: null,

      fetchKitchenItems: async () => {
        if (!USE_DATABASE) return;
        set({ loading: true });
        try {
          const res = await apiRequest('kitchen.php');
          if (res && res.success) {
            set({ kitchenItems: res.data, loading: false });
          }
        } catch (e) {
          set({ error: e.message, loading: false });
        }
      },

      /**
       * Menerima item baru dari Kasir (difilter hanya makanan/snack/dessert/kopi/dll)
       * Catatan: Di database mode, checkout memicu penyimpanan otomatis ke database,
       * sehingga koki hanya perlu me-refresh/melakukan polling fetchKitchenItems.
       */
      addItemsToKitchen: async (items, orderId, customerName) => {
        if (USE_DATABASE) {
          // Tidak perlu melakukan apa-apa karena data kitchen sudah dibuat 
          // otomatis oleh transaksi orders.php di backend.
          await get().fetchKitchenItems();
        } else {
          set((state) => {
            const newKitchenItems = items.map((item) => ({
              ...item,                  // membawa informasi cartItem
              kitchenItemId: `KITCHEN-${orderId}-${item.cartId}-${Date.now()}`,
              orderReference: orderId,
              customerName: customerName || 'Tanpa Nama',
              status: 'todo',           // 'todo', 'progress', 'done'
              startTime: Date.now(),    // untuk SLA stopwatch
              isWarning: false,         // merah jika SLA > 15 menit
            }));

            return {
              kitchenItems: [...state.kitchenItems, ...newKitchenItems],
            };
          });
        }
      },

      /**
       * Mengubah status item dapur
       */
      updateItemStatus: async (kitchenItemId, newStatus) => {
        if (USE_DATABASE) {
          try {
            await apiRequest('kitchen.php?action=update_status', 'POST', {
              kitchenItemId,
              status: newStatus
            });
            await get().fetchKitchenItems();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => ({
            kitchenItems: state.kitchenItems.map((kItem) =>
              kItem.kitchenItemId === kitchenItemId
                ? { ...kItem, status: newStatus, startTime: newStatus === 'progress' ? Date.now() : kItem.startTime }
                : kItem
            ),
          }));
        }
      },

      /**
       * Membatalkan item secara paksa jika stok habis.
       */
      cancelItem: async (kitchenItemId) => {
        if (USE_DATABASE) {
          try {
            await apiRequest('kitchen.php?action=cancel_item', 'POST', {
              kitchenItemId
            });
            await get().fetchKitchenItems();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => ({
            kitchenItems: state.kitchenItems.filter((i) => i.kitchenItemId !== kitchenItemId),
          }));
        }
      },

      /**
       * Kosongkan dapur (misal tutup shift)
       */
      clearKitchen: () => set({ kitchenItems: [] }),
    }),
    {
      name: 'kitchen-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Sinkronisasi antar tab untuk mode offline
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'kitchen-storage') {
      useKitchenStore.persist.rehydrate();
    }
  });
}

export default useKitchenStore;
