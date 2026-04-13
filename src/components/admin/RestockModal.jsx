import { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';

export default function RestockModal({ item, onConfirm, onClose }) {
  const [amountInput, setAmountInput] = useState('50');

  const handleInput = (val) => {
    const numeric = val.replace(/\D/g, '');
    setAmountInput(numeric);
  };

  const handleConfirm = () => {
    const amount = parseInt(amountInput, 10);
    if (!isNaN(amount) && amount > 0) {
      onConfirm(item.id, amount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gray-950 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Tambah Stok</h2>
            <p className="text-gray-400 text-xs mt-0.5">{item.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">Stok Saat Ini</p>
               <h3 className="text-xl font-black text-gray-900">{item.current} <span className="text-sm font-semibold text-gray-500">{item.unit}</span></h3>
             </div>
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
               <PackagePlus size={24} />
             </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              Jumlah Tambahan Stok
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={amountInput}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <span className="absolute right-4 text-gray-400 font-semibold text-sm">{item.unit}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 pt-1">
             {[10, 20, 50, 100].map((nom) => (
                <button
                  key={nom}
                  onClick={() => setAmountInput(nom.toString())}
                  className="py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  +{nom}
                </button>
             ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-100 transition-all"
          >
            Kembali
          </button>
          <button
            onClick={handleConfirm}
            disabled={!amountInput || parseInt(amountInput, 10) === 0}
            className="flex-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all"
          >
            <PackagePlus size={16} />
            Restock
          </button>
        </div>
      </div>
    </div>
  );
}
