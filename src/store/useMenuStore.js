import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { menuData as initialMenuData } from '../data/menuData';

const useMenuStore = create(
  persist(
    (set) => ({
      menus: initialMenuData,

      // Menambah menu baru
      addMenu: (newMenu) => set((state) => {
        // Generate simple ID if none exists
        const id = newMenu.id || Math.max(...state.menus.map(m => m.id)) + 1;
        return { menus: [...state.menus, { ...newMenu, id }] };
      }),

      // Mengubah data menu yang ada
      editMenu: (id, updatedData) => set((state) => ({
        menus: state.menus.map((menu) => 
          menu.id === id ? { ...menu, ...updatedData } : menu
        )
      })),

      // Menghapus menu
      deleteMenu: (id) => set((state) => ({
        menus: state.menus.filter((menu) => menu.id !== id)
      })),
    }),
    {
      name: 'menu-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Sinkronisasi antar tab
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'menu-storage') {
      useMenuStore.persist.rehydrate();
    }
  });
}

export default useMenuStore;
