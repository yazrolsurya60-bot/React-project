// ============================================================
// HISTORY STORE - Zustand global state untuk riwayat pesanan
// ============================================================
import { create } from 'zustand';

const useHistoryStore = create((set) => ({
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
}));

export default useHistoryStore;
