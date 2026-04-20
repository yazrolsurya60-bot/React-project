// ============================================================
// ORDER CARD (KITCHEN)
// ============================================================
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, XOctagon } from 'lucide-react';
import useKitchenStore from '../../store/useKitchenStore';
import useMenuStore from '../../store/useMenuStore';

// SLA: 15 menit (dalam milidetik)
const SLA_LIMIT_MS = 15 * 60 * 1000;

export default function OrderCard({ item }) {
  const { updateItemStatus, cancelItem } = useKitchenStore();
  const { editMenu } = useMenuStore();
  
  const [elapsed, setElapsed] = useState(() => Date.now() - item.startTime);

  // Stopwatch effect
  useEffect(() => {
    if (item.status === 'done') return; // Stop timer if done
    const interval = setInterval(() => {
      setElapsed(Date.now() - item.startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [item.startTime, item.status]);

  const isOverdue = elapsed >= SLA_LIMIT_MS && item.status !== 'done';

  // Format mm:ss
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (item.status === 'todo') updateItemStatus(item.kitchenItemId, 'progress');
    else if (item.status === 'progress') updateItemStatus(item.kitchenItemId, 'done');
  };

  const handlePrev = () => {
    if (item.status === 'done') updateItemStatus(item.kitchenItemId, 'progress');
    else if (item.status === 'progress') updateItemStatus(item.kitchenItemId, 'todo');
  };

  const handleOutOfStock = () => {
    if (window.confirm(`Tandai ${item.name} sebagai STOK HABIS dan hapus dari antrean?`)) {
      // Hilangkan dari menu kasir
      editMenu(item.id, { isAvailable: false });
      // Hapus dari antrean
      cancelItem(item.kitchenItemId);
      alert('Sistem kasir telah diupdate: Menu Sold Out.');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-white p-5 rounded-2xl shadow-sm border-2 transition-colors duration-500
        ${isOverdue ? 'border-red-500 bg-red-50' : 'border-transparent hover:border-gray-300'}`}
    >
      {/* ── Header Kartu: Qty & Waktu ── */}
      <div className="flex justify-between items-start mb-3">
        <div className="bg-gray-900 text-white font-black text-xl px-4 py-1.5 rounded-lg shadow-md">
          {item.quantity}x
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 font-bold rounded-lg text-sm
          ${isOverdue ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
          {isOverdue ? <AlertTriangle size={16} /> : <Clock size={16} />}
          <span>{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* ── Info Item ── */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{item.name}</h3>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Order {item.orderReference ? item.orderReference.slice(-6) : ''} &bull; {item.customerName || 'Tanpa Nama'}
        </p>
        
        {/* Kustomisasi */}
        {item.customization && (
          <div className="text-sm text-gray-600 mb-2 font-medium">
            {Object.entries(item.customization).map(([k, v]) => (
              <span key={k} className="inline-block bg-gray-100 px-2 py-0.5 rounded mr-1">
                {v}
              </span>
            ))}
          </div>
        )}

        {/* Notes (Warna background kuning jika ada isinya) */}
        {item.notes && (
          <div className="bg-yellow-200 border-l-4 border-yellow-500 text-yellow-900 p-3 rounded-r-lg font-bold text-sm">
            "{item.notes}"
          </div>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        
        {/* Tombol Mundur */}
        {item.status !== 'todo' && (
          <button 
            onClick={handlePrev}
            className="flex-1 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors touch-auto"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Tombol Maju / Konfirmasi */}
        {item.status !== 'done' ? (
          <button 
            onClick={handleNext}
            className={`flex-3 h-12 flex items-center justify-center text-white rounded-xl font-bold transition-colors touch-auto 
              ${item.status === 'todo' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'}`}
          >
            {item.status === 'todo' ? 'Mulai Masak' : 'Selesai Dimasak'}
            <ArrowRight size={20} className="ml-2" />
          </button>
        ) : (
          <div className="flex-3 h-12 flex items-center justify-center bg-gray-900 text-white rounded-xl font-black gap-2">
            <CheckCircle2 size={24} />
            Siap Diantar
          </div>
        )}

        {/* Tombol Stok Habis */}
        <button 
          onClick={handleOutOfStock}
          title="Stok Habis"
          className="w-12 h-12 shrink-0 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors touch-auto"
        >
          <XOctagon size={20} />
        </button>
      </div>

    </motion.div>
  );
}
