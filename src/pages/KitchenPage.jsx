// ============================================================
// KITCHEN PAGE - Halaman Kanban Dapur (Optimasi Layar Sentuh)
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import HeaderKitchen from '../components/kitchen/HeaderKitchen';
import KanbanBoard from '../components/kitchen/KanbanBoard';
import useKitchenStore from '../store/useKitchenStore';

export default function KitchenPage() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { kitchenItems } = useKitchenStore();
  const prevTodoCount = useRef(0);

  // Audio effect untuk pesanan baru di 'todo'
  useEffect(() => {
    if (!audioEnabled) return;

    const todoCount = kitchenItems.filter(i => i.status === 'todo').length;
    
    // Jika jumlah todo bertambah (ada order baru)
    if (todoCount > prevTodoCount.current) {
      // Play sound
      try {
        const audio = new Audio('/beep.mp3'); // Asumsikan ada beep.mp3 di public
        audio.play().catch(e => console.error("Audio play blocked", e));
      } catch {
        // ignore
      }
    }
    prevTodoCount.current = todoCount;
  }, [kitchenItems, audioEnabled]);

  // Audio Gate UI
  if (!audioEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center max-w-md bg-gray-800 p-10 rounded-3xl shadow-2xl">
          <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
            👨‍🍳
          </div>
          <h1 className="text-2xl font-black mb-2">Buka Shift Dapur</h1>
          <p className="text-gray-400 mb-8 text-sm">
            Tolong izinkan akses audio agar notifikasi pesanan dapat berbuyi ketika ada antrean masuk.
          </p>
          <button
            onClick={() => setAudioEnabled(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-lg transition-transform active:scale-95 touch-none"
          >
            Mulai Shift & Aktifkan Suara
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
      <HeaderKitchen />
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 touch-pan-x">
        <KanbanBoard />
      </div>
    </div>
  );
}
