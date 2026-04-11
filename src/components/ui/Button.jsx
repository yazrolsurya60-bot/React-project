// ============================================================
// BUTTON - Komponen tombol reusable
// ============================================================

const VARIANTS = {
  primary:   'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 disabled:shadow-none',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  outline:   'border border-gray-200 hover:border-red-300 hover:text-red-600 bg-white text-gray-600',
  ghost:     'hover:bg-gray-100 text-gray-600',
  danger:    'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
  dark:      'bg-gray-900 hover:bg-gray-800 text-white',
};

const SIZES = {
  sm:  'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md:  'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg:  'px-6 py-3.5 text-sm rounded-xl gap-2',
  xl:  'px-8 py-4 text-base rounded-2xl gap-2.5',
  icon: 'p-2.5 rounded-xl',
};

/**
 * Button Component
 * @param {string} variant  - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark'
 * @param {string} size     - 'sm' | 'md' | 'lg' | 'xl' | 'icon'
 * @param {boolean} loading - Tampilkan spinner loading
 * @param {boolean} fullWidth - Lebar penuh
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANTS[variant] ?? VARIANTS.primary}
        ${SIZES[size] ?? SIZES.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Memproses...
        </>
      ) : (
        children
      )}
    </button>
  );
}
