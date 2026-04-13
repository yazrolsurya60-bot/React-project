import { useState, useEffect } from 'react';
import { X, PackagePlus, ArrowDownToLine } from 'lucide-react';

export default function InventoryActionModal({ 
  mode = 'restock', // 'restock' | 'adjust'
  inventory = [], 
  initialItem = null, 
  onConfirm, 
  onClose 
}) {
  const [selectedItemId, setSelectedItemId] = useState(initialItem ? initialItem.id : '');
  const [amountInput, setAmountInput] = useState(() => {
    // Jalankan sekali saat modal pertama kali muncul dengan initialItem (Tombol Aksi Cepat)
    if (initialItem) {
      return mode === 'restock' ? '50' : initialItem.current.toString();
    }
    return '';
  });

  const selectedItem = inventory.find(i => i.id === selectedItemId) || null;

  // Handler saat user memilih barang dari dropdown
  const handleItemSelect = (e) => {
    const newId = e.target.value;
    setSelectedItemId(newId);
    
    const item = inventory.find(i => i.id === newId);
    if (item) {
      setAmountInput(mode === 'restock' ? '50' : item.current.toString());
    }
  };

  const handleInput = (val) => {
    const numeric = val.replace(/\D/g, '');
    setAmountInput(numeric);
  };

  const handleConfirm = () => {
    const amount = parseInt(amountInput, 10);
    if (!isNaN(amount) && selectedItemId) {
      onConfirm(selectedItemId, amount);
      onClose();
    }
  };

  const isRestock = mode === 'restock';
  const ActionIcon = isRestock ? PackagePlus : ArrowDownToLine;
  const title = isRestock ? 'Tambah Stok (Stock In)' : 'Penyesuaian Stok';
  const ctaText = isRestock ? 'Restock' : 'Sesuaikan';
  
  // Tailwind exact classes
  const styles = {
    bgLight: isRestock ? 'bg-red-50/50' : 'bg-blue-50/50',
    borderLight: isRestock ? 'border-red-100' : 'border-blue-100',
    bgIcon: isRestock ? 'bg-red-100' : 'bg-blue-100',
    textIcon: isRestock ? 'text-red-600' : 'text-blue-600',
    ringColor: isRestock ? 'focus:ring-red-500' : 'focus:ring-blue-500',
    btnHoverBorder: isRestock ? 'hover:border-red-300' : 'hover:border-blue-300',
    btnHoverBg: isRestock ? 'hover:bg-red-50' : 'hover:bg-blue-50',
    btnHoverText: isRestock ? 'hover:text-red-600' : 'hover:text-blue-600',
    submitBg: isRestock ? 'bg-red-600' : 'bg-blue-600',
    submitHover: isRestock ? 'hover:bg-red-700' : 'hover:bg-blue-700',
    submitShadow: isRestock ? 'shadow-red-200' : 'shadow-blue-200'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gray-950 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">{title}</h2>
            {initialItem && <p className="text-gray-400 text-xs mt-0.5">{initialItem.name}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          
          {/* Select Item jika tidak ada initialItem */}
          {!initialItem && (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                Pilih Bahan Baku
              </label>
              <select
                value={selectedItemId}
                onChange={handleItemSelect}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>-- Pilih Bahan Baku --</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedItem && (
            <>
              <div className={`${styles.bgLight} border ${styles.borderLight} rounded-2xl p-4 flex items-center justify-between`}>
                 <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">Stok Sistem Saat Ini</p>
                   <h3 className="text-xl font-black text-gray-900">{selectedItem.current} <span className="text-sm font-semibold text-gray-500">{selectedItem.unit}</span></h3>
                 </div>
                 <div className={`w-12 h-12 ${styles.bgIcon} rounded-full flex items-center justify-center ${styles.textIcon}`}>
                   <ActionIcon size={24} />
                 </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                  {isRestock ? 'Jumlah Tambahan Stok' : 'Stok Aktual Saat Ini'}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={amountInput}
                    onChange={(e) => handleInput(e.target.value)}
                    placeholder="0"
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 ${styles.ringColor} focus:border-transparent`}
                  />
                  <span className="absolute right-4 text-gray-400 font-semibold text-sm">{selectedItem.unit}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 pt-1">
                 {isRestock ? (
                   [10, 20, 50, 100].map((nom) => (
                      <button
                        key={nom}
                        onClick={() => setAmountInput(nom.toString())}
                        className={`py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 ${styles.btnHoverBorder} ${styles.btnHoverBg} ${styles.btnHoverText} transition-all`}
                      >
                        +{nom}
                      </button>
                   ))
                 ) : (
                   [0, selectedItem.current, selectedItem.current - 10, selectedItem.current + 10].map((nom, i) => (
                      <button
                        key={i}
                        onClick={() => setAmountInput(Math.max(0, nom).toString())}
                        className={`py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 ${styles.btnHoverBorder} ${styles.btnHoverBg} ${styles.btnHoverText} transition-all`}
                      >
                        {i === 0 ? 'Habis (0)' : i === 1 ? 'Sama' : i === 2 ? '-10' : '+10'}
                      </button>
                   ))
                 )}
              </div>
            </>
          )}
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
            disabled={!selectedItem || !amountInput || (isRestock && parseInt(amountInput, 10) === 0)}
            className={`flex-2 py-3.5 rounded-xl ${styles.submitBg} ${styles.submitHover} disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg ${styles.submitShadow} transition-all`}
          >
            <ActionIcon size={16} />
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}
