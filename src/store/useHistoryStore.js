// ============================================================
// HISTORY STORE - Zustand global state untuk riwayat pesanan
// ============================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiRequest, USE_DATABASE } from '../services/apiService';

const useHistoryStore = create(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      error: null,

      fetchOrders: async () => {
        if (!USE_DATABASE) return;
        set({ loading: true });
        try {
          const res = await apiRequest('orders.php');
          if (res && res.success) {
            set({ orders: res.data, loading: false });
          }
        } catch (e) {
          set({ error: e.message, loading: false });
        }
      },

      addOrder: async (order) => {
        if (USE_DATABASE) {
          try {
            // Get currently logged in cashier name
            const sessionUser = sessionStorage.getItem('pos_user');
            const cashierName = sessionUser ? JSON.parse(sessionUser).name : 'Kasir';

            const payload = {
              ...order,
              cashierName
            };

            await apiRequest('orders.php', 'POST', payload);
            await get().fetchOrders();
          } catch (e) {
            alert("Gagal memproses checkout: " + e.message);
          }
        } else {
          set((state) => ({
            orders: [
              {
                ...order,
                status: 'Selesai', // Default local status
                date: new Date().toISOString(),
                id: order.id || `ORD-${Date.now()}`,
              },
              ...state.orders,
            ],
          }));
        }
      },

      clearHistory: () => set({ orders: [] }),
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Sinkronisasi antar tab untuk mode offline
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'history-storage') {
      useHistoryStore.persist.rehydrate();
    }
  });
}

export default useHistoryStore;
