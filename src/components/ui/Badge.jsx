// ============================================================
// BADGE - Komponen badge reusable (stok kosong, kategori, dll)
// ============================================================

const VARIANTS = {
  danger:   'bg-red-100 text-red-700 border border-red-200',
  success:  'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning:  'bg-amber-100 text-amber-700 border border-amber-200',
  info:     'bg-blue-100 text-blue-700 border border-blue-200',
  neutral:  'bg-gray-100 text-gray-600 border border-gray-200',
  dark:     'bg-gray-900 text-white border border-gray-800',
};

const SIZES = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

/**
 * Badge Component
 * @param {string} variant - 'danger' | 'success' | 'warning' | 'info' | 'neutral' | 'dark'
 * @param {string} size    - 'sm' | 'md' | 'lg'
 * @param {string} className - Additional classes
 */
export default function Badge({ children, variant = 'neutral', size = 'sm', className = '', ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full leading-none
        ${VARIANTS[variant] ?? VARIANTS.neutral}
        ${SIZES[size] ?? SIZES.sm}
        ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
