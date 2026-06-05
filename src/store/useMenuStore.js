import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { menuData as initialMenuData } from '../data/menuData';
import { apiRequest, USE_DATABASE } from '../services/apiService';

// Initial offline recipes mapping menu_id -> array of {inventory_id, quantity_needed}
const initialRecipes = {
  1: [{ inventory_id: 1, quantity_needed: 15 }], // Espresso -> 15g Kopi
  2: [{ inventory_id: 1, quantity_needed: 15 }, { inventory_id: 4, quantity_needed: 1 }], // Americano -> 15g Kopi, 1 Cup
  3: [{ inventory_id: 1, quantity_needed: 15 }, { inventory_id: 2, quantity_needed: 150 }, { inventory_id: 4, quantity_needed: 1 }], // Cappuccino -> 15g Kopi, 150ml Susu, 1 Cup
  4: [{ inventory_id: 1, quantity_needed: 15 }, { inventory_id: 2, quantity_needed: 150 }, { inventory_id: 3, quantity_needed: 20 }, { inventory_id: 4, quantity_needed: 1 }], // Caramel Latte
  5: [{ inventory_id: 1, quantity_needed: 20 }, { inventory_id: 4, quantity_needed: 1 }], // Cold Brew -> 20g Kopi, 1 Cup
  6: [{ inventory_id: 2, quantity_needed: 150 }, { inventory_id: 4, quantity_needed: 1 }], // Matcha Latte -> 150ml Susu, 1 Cup
  7: [{ inventory_id: 2, quantity_needed: 200 }, { inventory_id: 4, quantity_needed: 1 }], // Cokelat Panas -> 200ml Susu, 1 Cup
  8: [{ inventory_id: 2, quantity_needed: 50 }, { inventory_id: 4, quantity_needed: 1 }], // Thai Tea -> 50ml Susu, 1 Cup
  9: [{ inventory_id: 4, quantity_needed: 1 }], // Lemon Squash -> 1 Cup
  10: [{ inventory_id: 2, quantity_needed: 100 }, { inventory_id: 4, quantity_needed: 1 }], // Strawberry Smoothie -> 100ml Susu, 1 Cup
  12: [{ inventory_id: 2, quantity_needed: 100 }], // Pasta Carbonara -> 100ml Susu
  15: [{ inventory_id: 5, quantity_needed: 30 }], // Banana Fritters -> 30g Gula Aren
  16: [{ inventory_id: 1, quantity_needed: 5 }, { inventory_id: 2, quantity_needed: 50 }], // Tiramisu -> 5g Kopi, 50ml Susu
  20: [{ inventory_id: 1, quantity_needed: 15 }], // Affogato -> 15g Kopi
};

const useMenuStore = create(
  persist(
    (set, get) => ({
      menus: initialMenuData,
      recipes: initialRecipes, // Resep lokal (offline)
      loading: false,
      error: null,

      fetchMenus: async () => {
        if (!USE_DATABASE) return;
        set({ loading: true });
        try {
          const res = await apiRequest('menus.php');
          if (res && res.success) {
            set({ menus: res.data, loading: false });
          }
        } catch (e) {
          set({ error: e.message, loading: false });
        }
      },

      addMenu: async (newMenu) => {
        if (USE_DATABASE) {
          try {
            await apiRequest('menus.php', 'POST', newMenu);
            await get().fetchMenus();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => {
            const id = newMenu.id || (state.menus.length > 0 ? Math.max(...state.menus.map(m => m.id)) + 1 : 1);
            return { menus: [...state.menus, { ...newMenu, id }] };
          });
        }
      },

      editMenu: async (id, updatedData) => {
        if (USE_DATABASE) {
          try {
            await apiRequest('menus.php', 'PUT', { ...updatedData, id });
            await get().fetchMenus();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => ({
            menus: state.menus.map((menu) => 
              menu.id === id ? { ...menu, ...updatedData } : menu
            )
          }));
        }
      },

      deleteMenu: async (id) => {
        if (USE_DATABASE) {
          try {
            await apiRequest(`menus.php?id=${id}`, 'DELETE');
            await get().fetchMenus();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => ({
            menus: state.menus.filter((menu) => menu.id !== id)
          }));
        }
      },

      // ── Recipe Actions ──
      getRecipesForMenu: async (menuId) => {
        if (USE_DATABASE) {
          try {
            const res = await apiRequest(`menus.php?action=get_recipes&menu_id=${menuId}`);
            if (res && res.success) {
              return res.data; // array of {id, inventory_id, quantity_needed, inventory_name, unit}
            }
          } catch (e) {
            console.error("Failed to get recipes from API", e);
          }
          return [];
        } else {
          // Map local recipe format to mimic API format
          const localRecipe = get().recipes[menuId] || [];
          return localRecipe.map((r, index) => ({
            id: index,
            inventory_id: r.inventory_id,
            quantity_needed: r.quantity_needed,
            inventory_name: '', // Will be resolved by looking up useInventoryStore
            unit: ''
          }));
        }
      },

      saveRecipe: async (menuId, ingredients) => {
        // ingredients: array of {inventory_id, quantity_needed}
        if (USE_DATABASE) {
          try {
            await apiRequest('menus.php?action=save_recipe', 'POST', {
              menu_id: menuId,
              ingredients
            });
            await get().fetchMenus();
          } catch (error) {
            alert("Gagal menyimpan resep: " + error.message);
          }
        } else {
          set((state) => ({
            recipes: {
              ...state.recipes,
              [menuId]: ingredients.map(ing => ({
                inventory_id: intval_or_float(ing.inventory_id),
                quantity_needed: intval_or_float(ing.quantity_needed)
              }))
            }
          }));
          alert("Resep lokal berhasil disimpan!");
        }
      }
    }),
    {
      name: 'menu-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper for local float parser
function intval_or_float(val) {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

// Sinkronisasi antar tab
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'menu-storage') {
      useMenuStore.persist.rehydrate();
    }
  });
}

export default useMenuStore;
