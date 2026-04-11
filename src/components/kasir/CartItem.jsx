// ============================================================
// CART ITEM - Satu baris item di dalam panel cart
// ============================================================
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatRupiah } from '../../data/menuData';
import useCartStore from '../../store/useCartStore';

export default function CartItem({ item }) {
  const { incrementItem, decrementItem, removeItem } = useCartStore();

  // Label kustomisasi singkat
  const customLabel = item.customization
    ? Object.values(item.customization)
        .filter(Boolean)
        .slice(0, 2)
        .join(' · ')
    : null;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 group">
      {/* Nama & Detail */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 font-semibold text-sm leading-snug line-clamp-1">
          {item.name}
        </p>
        {customLabel && (
          <p className="text-gray-400 text-[11px] mt-0.5 leading-tight line-clamp-1">
            {customLabel}
          </p>
        )}
        {item.notes && (
          <p className="text-amber-600 text-[11px] mt-0.5 leading-tight line-clamp-1 italic">
            📝 {item.notes}
          </p>
        )}
        <p className="text-red-600 font-bold text-sm mt-1">
          {formatRupiah(item.price * item.quantity)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          id={`cart-decrement-${item.cartId}`}
          onClick={() => decrementItem(item.cartId)}
          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-gray-500 transition-all duration-150"
        >
          <Minus size={13} strokeWidth={2.5} />
        </button>

        <span className="w-6 text-center font-bold text-sm text-gray-800 tabular-nums">
          {item.quantity}
        </span>

        <button
          id={`cart-increment-${item.cartId}`}
          onClick={() => incrementItem(item.cartId)}
          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center text-gray-500 transition-all duration-150"
        >
          <Plus size={13} strokeWidth={2.5} />
        </button>

        {/* Hapus (muncul saat hover baris) */}
        <button
          id={`cart-remove-${item.cartId}`}
          onClick={() => removeItem(item.cartId)}
          className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all duration-150"
          title="Hapus item"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
