// ============================================================
// ORDER SUMMARY - Subtotal, Pajak, Diskon, Total
// ============================================================
import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { formatRupiah } from '../../data/menuData';
import useCartStore from '../../store/useCartStore';

export default function OrderSummary({ subtotal, discount, total }) {
  const { applyVoucher, removeVoucher, voucherCode } = useCartStore();
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');

  const handleApplyVoucher = () => {
    if (!voucherInput.trim()) return;
    const result = applyVoucher(voucherInput.trim());
    if (result.success) {
      setVoucherError('');
      setVoucherInput('');
    } else {
      setVoucherError('Kode voucher tidak valid');
    }
  };

  const handleRemoveVoucher = () => {
    removeVoucher();
    setVoucherError('');
    setVoucherInput('');
  };

  const rows = [
    { label: 'Subtotal', value: subtotal },
  ];

  return (
    <div className="space-y-3">
      {/* Rincian Biaya */}
      <div className="space-y-1.5">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm text-gray-500">
            <span>{label}</span>
            <span className="font-medium text-gray-700">{formatRupiah(value)}</span>
          </div>
        ))}

        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Diskon Voucher</span>
            <span className="font-bold">-{formatRupiah(discount)}</span>
          </div>
        )}
      </div>

      {/* Voucher Input */}
      {voucherCode ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <Tag size={13} className="text-emerald-600" />
            <span className="text-emerald-700 font-bold text-sm">{voucherCode}</span>
            <span className="text-emerald-600 text-xs">(-{formatRupiah(discount)})</span>
          </div>
          <button
            onClick={handleRemoveVoucher}
            className="text-emerald-400 hover:text-red-500 transition-colors"
            title="Hapus voucher"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex gap-2">
            <input
              id="voucher-input"
              type="text"
              value={voucherInput}
              onChange={(e) => { setVoucherInput(e.target.value); setVoucherError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher()}
              placeholder="Kode voucher..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
            />
            <button
              id="voucher-apply"
              onClick={handleApplyVoucher}
              className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shrink-0"
            >
              Pakai
            </button>
          </div>
          {voucherError && (
            <p className="text-red-500 text-[11px] font-medium pl-1">{voucherError}</p>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-black text-base">Total</span>
          <span className="text-red-600 font-black text-xl tabular-nums">{formatRupiah(total)}</span>
        </div>
      </div>
    </div>
  );
}
