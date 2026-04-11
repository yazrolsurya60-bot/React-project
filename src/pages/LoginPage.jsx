// ============================================================
// LOGIN PAGE - Halaman autentikasi kasir CaféPOS
// ============================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Coffee,
} from 'lucide-react';

// ── Kredensial dummy (ganti dengan API nanti) ──────────────
const VALID_CREDENTIALS = [
  { username: 'admin',        password: 'admin123',  name: 'Admin Utama',   role: 'Administrator' },
  { username: 'budi',         password: 'budi123',   name: 'Budi Santoso',  role: 'Kasir Shift Pagi' },
  { username: 'kasir',        password: 'kasir123',  name: 'Kasir Demo',    role: 'Kasir' },
];

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm]           = useState({ username: '', password: '' });
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [focused, setFocused]     = useState('');

  // ── Handler input ──────────────────────────────────────────
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault();

    // Validasi kosong
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username dan password tidak boleh kosong.');
      return;
    }

    setLoading(true);

    // Simulasi delay autentikasi
    setTimeout(() => {
      const user = VALID_CREDENTIALS.find(
        (u) => u.username === form.username && u.password === form.password
      );

      if (user) {
        // Simpan sesi sederhana ke sessionStorage
        sessionStorage.setItem('pos_user', JSON.stringify(user));
        navigate('/kasir');
      } else {
        setError('Username atau password salah. Silakan coba lagi.');
        setLoading(false);
      }
    }, 900);
  };

  // ── Kelas input dinamis ────────────────────────────────────
  const inputWrapper = (field) =>
    `flex items-center gap-3 border-2 rounded-xl px-4 py-3.5 transition-all duration-200 bg-white ${
      focused === field
        ? 'border-red-500 shadow-sm shadow-red-100'
        : error
        ? 'border-red-200'
        : 'border-gray-200 hover:border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-white flex">

      {/* ════════════════════════════════════════════════════════
          KIRI — Branding Panel (30% hitam)
      ════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex w-[42%] bg-gray-950 flex-col justify-between p-12 relative overflow-hidden">

        {/* Dekorasi lingkaran blur */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/50">
            <span className="text-white font-black text-xl leading-none">C</span>
          </div>
          <div>
            <h1 className="text-white font-black text-xl tracking-wide">CaféPOS</h1>
            <p className="text-gray-500 text-[11px] font-medium">Point of Sale System</p>
          </div>
        </div>

        {/* Tagline tengah */}
        <div className="relative z-10 space-y-6">
          <div className="w-14 h-1 bg-red-600 rounded-full" />
          <h2 className="text-white font-black text-4xl leading-tight tracking-tight">
            Kelola Kafe<br />
            <span className="text-red-500">Lebih Cepat,</span><br />
            Lebih Cerdas.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Sistem kasir modern untuk kafe Anda. Kelola pesanan, pantau stok, dan tingkatkan pelayanan dalam satu platform.
          </p>

          {/* Stats mini */}
          <div className="flex gap-6 pt-2">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '0.3s',  label: 'Resp. Time' },
              { value: '100+',  label: 'Transaksi/hari' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-white font-black text-lg leading-tight">{value}</p>
                <p className="text-gray-500 text-[11px] font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer panel */}
        <div className="relative z-10 flex items-center gap-2">
          <Coffee size={13} className="text-gray-600" />
          <p className="text-gray-600 text-xs">© 2026 CaféPOS · All rights reserved</p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          KANAN — Form Login (60% putih)
      ════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-white relative">

        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #111 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Card login */}
        <div className="w-full max-w-md relative z-10">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center">
              <img src="/src/assets/Oak_Coffe.png" alt="Gambar" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-gray-900 font-black text-xl">Oak Coffe System</h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-gray-900 font-black text-3xl leading-tight tracking-tight">
              Selamat Datang 👋
            </h2>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Masuk ke sistem kasir dengan username dan password yang diberikan oleh administrator.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} noValidate className="space-y-4">

            {/* ── Username ── */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-username"
                className="text-gray-700 text-sm font-semibold block"
              >
                Username
              </label>
              <div className={inputWrapper('username')}>
                <User
                  size={17}
                  className={`shrink-0 transition-colors duration-200 ${
                    focused === 'username' ? 'text-red-500' : 'text-gray-400'
                  }`}
                />
                <input
                  id="login-username"
                  type="text"
                  value={form.username}
                  onChange={handleChange('username')}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                  placeholder="Masukkan username..."
                  autoComplete="username"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* ── Password ── */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-gray-700 text-sm font-semibold block"
              >
                Password
              </label>
              <div className={inputWrapper('password')}>
                <Lock
                  size={17}
                  className={`shrink-0 transition-colors duration-200 ${
                    focused === 'password' ? 'text-red-500' : 'text-gray-400'
                  }`}
                />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="Masukkan password..."
                  autoComplete="current-password"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                  tabIndex={-1}
                  title={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* ── Error Message ── */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-in slide-in-from-top-2 duration-200">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium leading-snug">{error}</p>
              </div>
            )}

            {/* ── Tombol Login (10% merah) ── */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700
                active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-black text-sm py-4 rounded-xl
                shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-200
                transition-all duration-200"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memeriksa...
                </>
              ) : (
                <>
                  Masuk ke Sistem
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>



        </div>
      </div>
    </div>
  );
}
