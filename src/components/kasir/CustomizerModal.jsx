// ============================================================
// CUSTOMIZER MODAL - Kustomisasi Item Kopi (Ice/Hot, dll)
// ============================================================
import { useState } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';

const CUSTOMIZER_OPTIONS = {
  temperature: {
    label: 'Suhu',
    options: ['Hot', 'Iced'],
    default: 'Hot',
  },
  sugar: {
    label: 'Tingkat Gula',
    options: ['Normal', 'Less Sugar', 'No Sugar', 'Extra Sugar'],
    default: 'Normal',
  },
  milk: {
    label: 'Pilihan Susu',
    options: ['Susu Sapi', 'Oat Milk', 'Almond Milk', 'Tanpa Susu'],
    default: 'Susu Sapi',
  },
  size: {
    label: 'Ukuran',
    options: ['Regular (250ml)', 'Large (350ml)'],
    default: 'Regular (250ml)',
  },
};

export default function CustomizerModal({ item, onConfirm, onClose }) {
  const [selections, setSelections] = useState(() => {
    const defaults = {};
    Object.entries(CUSTOMIZER_OPTIONS).forEach(([key, config]) => {
      defaults[key] = config.default;
    });
    return defaults;
  });
  const [notes, setNotes] = useState('');

  const handleSelect = (optionKey, value) => {
    setSelections((prev) => ({ ...prev, [optionKey]: value }));
  };

  const handleConfirm = () => {
    onConfirm(item, { ...selections }, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gray-950 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">{item.name}</h2>
              <p className="text-gray-400 text-sm">Atur kustomisasi pesanan</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-5 max-h-[55vh] overflow-y-auto">
          {Object.entries(CUSTOMIZER_OPTIONS).map(([key, config]) => (
            <div key={key}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                {config.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {config.options.map((opt) => {
                  const isSelected = selections[key] === opt;
                  return (
                    <button
                      key={opt}
                      id={`custom-${key}-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => handleSelect(key, opt)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                        isSelected
                          ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-100'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Catatan Khusus */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Catatan Khusus (Opsional)
            </p>
            <textarea
              id="customizer-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: tidak pakai es batu, gula di sisi lain..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-100 transition-all"
          >
            Batal
          </button>
          <button
            id="customizer-confirm"
            onClick={handleConfirm}
            className="flex-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all"
          >
            Tambah ke Cart
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
