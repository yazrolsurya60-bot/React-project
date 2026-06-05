// ============================================================
// USER STORE - Mengelola data akun staf kasir (Local & API)
// ============================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiRequest, USE_DATABASE } from '../services/apiService';

const initialUsers = [
  { id: 1, name: 'Admin Utama', username: 'admin', password: 'admin123', role: 'Administrator' },
  { id: 2, name: 'Budi Santoso', username: 'budi', password: 'budi123', role: 'Kasir Shift Pagi' },
  { id: 3, name: 'Kasir Demo', username: 'kasir', password: 'kasirdemo', role: 'Kasir' },
  { id: 4, name: 'Koki Dapur', username: 'koki', password: 'koki123', role: 'Dapur' },
  { id: 5, name: 'Andi Wijaya', username: 'andi', password: 'andi123', role: 'Kasir Shift Pagi' },
  { id: 6, name: 'Siti Rahma', username: 'siti', password: 'siti123', role: 'Kasir Shift Siang' },
  { id: 7, name: 'Rian Hidayat', username: 'rian', password: 'rian123', role: 'Kasir Shift Malam' },
  { id: 8, name: 'Dewi Lestari', username: 'dewi', password: 'dewi123', role: 'Kasir' },
  { id: 9, name: 'Eko Prasetyo', username: 'eko', password: 'eko123', role: 'Dapur' },
  { id: 10, name: 'Fitriani', username: 'fitri', password: 'fitri123', role: 'Dapur' },
];

const useUserStore = create(
  persist(
    (set, get) => ({
      users: initialUsers,
      loading: false,
      error: null,

      fetchUsers: async () => {
        if (!USE_DATABASE) return;
        set({ loading: true });
        try {
          const res = await apiRequest('users.php');
          if (res && res.success) {
            set({ users: res.data, loading: false });
          }
        } catch (e) {
          set({ error: e.message, loading: false });
        }
      },

      addUser: async (newUser) => {
        if (USE_DATABASE) {
          try {
            await apiRequest('users.php', 'POST', newUser);
            await get().fetchUsers();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => {
            const id = Date.now();
            return { users: [...state.users, { ...newUser, id }] };
          });
        }
      },

      editUser: async (id, updatedUser) => {
        if (USE_DATABASE) {
          try {
            await apiRequest('users.php', 'PUT', { ...updatedUser, id });
            await get().fetchUsers();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => ({
            users: state.users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)),
          }));
        }
      },

      deleteUser: async (id) => {
        if (USE_DATABASE) {
          try {
            await apiRequest(`users.php?id=${id}`, 'DELETE');
            await get().fetchUsers();
          } catch (e) {
            alert(e.message);
          }
        } else {
          set((state) => ({
            users: state.users.filter((u) => u.id !== id),
          }));
        }
      },
    }),
    {
      name: 'users-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Sinkronisasi tab untuk mode offline
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'users-storage') {
      useUserStore.persist.rehydrate();
    }
  });
}

export default useUserStore;
