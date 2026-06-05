import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiRequest, USE_DATABASE } from '../services/apiService';

const initialInventory = [
  { id: 1, name: 'Biji Kopi Arabika', current: 2000, unit: 'g', limit: 1000 },
  { id: 2, name: 'Susu UHT', current: 10000, unit: 'ml', limit: 5000 },
  { id: 3, name: 'Sirup Vanilla', current: 3000, unit: 'ml', limit: 300 },
  { id: 4, name: 'Cup Plastik', current: 500, unit: 'pcs', limit: 50 },
  { id: 5, name: 'Gula Aren', current: 5000, unit: 'g', limit: 1000 },
];

const useInventoryStore = create(
  persist(
    (set, get) => ({
      inventory: initialInventory,
      loading: false,
      error: null,

      fetchInventory: async () => {
        if (!USE_DATABASE) return;
        set({ loading: true });
        try {
          const res = await apiRequest('inventory.php');
          if (res && res.success) {
            set({ inventory: res.data, loading: false });
          }
        } catch (e) {
          set({ error: e.message, loading: false });
        }
      },

      // Tambah jumlah stok (akumulasi)
      addStock: async (id, amount) => {
        if (USE_DATABASE) {
          try {
            await apiRequest('inventory.php?action=adjust_stock', 'POST', {
              id,
              amount: parseFloat(amount),
              mode: 'restock'
            });
            await get().fetchInventory();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => ({
            inventory: state.inventory.map((item) => 
              item.id === id ? { ...item, current: item.current + amount } : item
            )
          }));
        }
      },

      // Sesuaikan stok secara mutlak (replace)
      updateStock: async (id, newAmount) => {
        if (USE_DATABASE) {
          try {
            await apiRequest('inventory.php?action=adjust_stock', 'POST', {
              id,
              amount: parseFloat(newAmount),
              mode: 'adjust'
            });
            await get().fetchInventory();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => ({
            inventory: state.inventory.map((item) => 
              item.id === id ? { ...item, current: Math.max(0, newAmount) } : item
            )
          }));
        }
      }
    }),
    {
      name: 'inventory-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Sinkronisasi antar tab
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'inventory-storage') {
      useInventoryStore.persist.rehydrate();
    }
  });
}

export default useInventoryStore;
