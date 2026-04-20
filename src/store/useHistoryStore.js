// ============================================================
// HISTORY STORE - Zustand global state untuk riwayat pesanan
// ============================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useHistoryStore = create(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) => {
        set((state) => ({
          orders: [
            {
              ...order,
              date: new Date().toISOString(),
              id: order.id || `ORD-${Date.now()}`,
            },
            ...state.orders,
          ],
        }));
      },

      clearHistory: () => set({ orders: [] }),
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Sinkronisasi antar tab
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'history-storage') {
      useHistoryStore.persist.rehydrate();
    }
  });
}

export default useHistoryStore;
