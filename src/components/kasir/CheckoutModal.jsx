// ============================================================
// CHECKOUT MODAL - Struk Digital & Konfirmasi Pembayaran
// ============================================================
import { useState } from 'react';
import { X, Printer, CheckCircle, CreditCard, Banknote } from 'lucide-react';
import { formatRupiah } from '../../data/menuData';

export default function CheckoutModal({ items, subtotal, discount, total, onConfirm, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashInput, setCashInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber] = useState(() => `#${String(Math.floor(Math.random() * 9000) + 1000)}`);

  const cashAmount = parseInt(cashInput.replace(/\D/g, ''), 10) || 0;
  const change = cashAmount - total;

  const handleCashInput = (val) => {
    const numeric = val.replace(/\D/g, '');
    setCashInput(numeric ? parseInt(numeric, 10).toLocaleString('id-ID') : '');
  };

  const handleConfirm = () => {
    if (paymentMethod === 'cash' && cashAmount < total) return;
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 2200);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle size={44} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Pembayaran Berhasil!</h2>
          <p className="text-gray-500 text-sm">Pesanan {orderNumber} sedang diproses ke dapur</p>
          <div className="w-full h-px bg-gray-100 my-1" />
          <p className="text-gray-400 text-xs">Menutup otomatis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-950 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Konfirmasi Pembayaran</h2>
            <p className="text-gray-400 text-xs mt-0.5">Pesanan {orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Ringkasan Item */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ringkasan Pesanan</p>
            <div className="space-y-2 bg-gray-50 rounded-2xl p-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">
                    {item.name}
                    {item.customization?.temperature && (
                      <span className="text-gray-400 font-normal"> · {item.customization.temperature}</span>
                    )}
                    <span className="text-gray-400 font-normal"> ×{item.quantity}</span>
                  </span>
                  <span className="text-gray-900 font-semibold">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rincian Biaya */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatRupiah(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Diskon Voucher</span>
                <span className="font-medium">-{formatRupiah(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-gray-950 border-t border-gray-100 pt-2 mt-2">
              <span>Total</span>
              <span className="text-red-600 text-lg">{formatRupiah(total)}</span>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Metode Pembayaran</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cash', label: 'Tunai', icon: Banknote },
                { id: 'digital', label: 'Digital', icon: CreditCard },
              ].map(({ id, label, icon }) => {
                const PaymentIcon = icon;
                return (
                  <button
                    key={id}
                    id={`payment-${id}`}
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all duration-200 ${
                      paymentMethod === id
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <PaymentIcon size={22} />
                    <span className="text-sm font-semibold">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Uang Tunai */}
          {paymentMethod === 'cash' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                  Uang Diterima
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">Rp</span>
                  <input
                    id="cash-input"
                    type="text"
                    value={cashInput}
                    onChange={(e) => handleCashInput(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              {/* Shortcut nominal */}
              <div className="grid grid-cols-3 gap-2">
                {[50000, 100000, 150000].map((nom) => (
                  <button
                    key={nom}
                    onClick={() => setCashInput(nom.toLocaleString('id-ID'))}
                    className="py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-red-300 hover:text-red-600 transition-all"
                  >
                    {formatRupiah(nom)}
                  </button>
                ))}
              </div>
              {cashAmount >= total && (
                <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <span className="text-emerald-700 text-sm font-medium">Kembalian</span>
                  <span className="text-emerald-700 font-black text-base">{formatRupiah(change)}</span>
                </div>
              )}
              {cashInput && cashAmount < total && (
                <p className="text-red-500 text-xs font-medium text-center">
                  Uang kurang {formatRupiah(total - cashAmount)}
                </p>
              )}
            </div>
          )}

          {paymentMethod === 'digital' && (
            <div className="bg-gray-50 rounded-2xl p-5 text-center border border-dashed border-gray-300">
              <p className="text-3xl mb-2">📱</p>
              <p className="text-gray-600 font-semibold text-sm">Arahkan ke QR Code / QRIS</p>
              <p className="text-gray-400 text-xs mt-1">DANA · OVO · GoPay · ShopeePay · BRI</p>
            </div>
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
            id="checkout-confirm"
            onClick={handleConfirm}
            disabled={paymentMethod === 'cash' && cashAmount < total}
            className="flex-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all"
          >
            <Printer size={16} />
            Proses & Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
}
