import { create } from 'zustand';
import { menuData as initialMenuData } from '../data/menuData';

const useMenuStore = create((set) => ({
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
}));

export default useMenuStore;
