import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialInventory = [
  { id: 1, name: 'Biji Kopi Arabika', current: 500, unit: 'g', limit: 1000 },
  { id: 2, name: 'Susu UHT', current: 2000, unit: 'ml', limit: 5000 },
  { id: 3, name: 'Sirup Vanilla', current: 850, unit: 'ml', limit: 300 },
  { id: 4, name: 'Cup Plastik', current: 20, unit: 'pcs', limit: 50 },
  { id: 5, name: 'Gula Aren', current: 2500, unit: 'g', limit: 1000 },
];

const useInventoryStore = create(
  persist(
    (set) => ({
      inventory: initialInventory,

      // Tambah jumlah stok (akumulasi)
      addStock: (id, amount) => set((state) => ({
        inventory: state.inventory.map((item) => 
          item.id === id ? { ...item, current: item.current + amount } : item
        )
      })),

      // Sesuaikan stok secara mutlak (replace)
      updateStock: (id, newAmount) => set((state) => ({
        inventory: state.inventory.map((item) => 
          item.id === id ? { ...item, current: Math.max(0, newAmount) } : item
        )
      }))
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
