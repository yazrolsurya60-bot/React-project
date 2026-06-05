// ============================================================
// HEADER COMPONENT - Info Kasir + Jam Real-time
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { Clock, User, LayoutGrid, History, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useKitchenStore from '../../store/useKitchenStore';
import { USE_DATABASE } from '../../services/apiService';

export default function Header() {
  const [now, setNow] = useState(new Date());
  const location  = useLocation();
  const navigate  = useNavigate();
  
  // Read logged in cashier info
  const sessionUser = sessionStorage.getItem('pos_user');
  const loggedUser = sessionUser ? JSON.parse(sessionUser) : { name: 'Kasir', role: 'Kasir' };

  const { kitchenItems, fetchKitchenItems } = useKitchenStore();
  const prevDoneCount = useRef(0);

  // Poll kitchen queue if database is active (for ready notifications)
  useEffect(() => {
    fetchKitchenItems();
    if (USE_DATABASE) {
      const timer = setInterval(() => {
        fetchKitchenItems();
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [fetchKitchenItems]);

  // Alert Cashier when kitchen items status changes to 'done'
  useEffect(() => {
    const doneItems = kitchenItems.filter(item => item.status === 'done');

    // Only notify if done items count increased since last check
    if (doneItems.length > prevDoneCount.current) {
      // If it's not the initial mount load
      if (prevDoneCount.current > 0) {
        const newestDone = doneItems[doneItems.length - 1];
        if (newestDone) {
          toast.success(`Pesanan ${newestDone.name} untuk ${newestDone.customerName || 'Tanpa Nama'} SIAP SAJI! ☕`, {
            duration: 6000,
            position: 'top-right',
            style: {
              background: '#000000',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '16px',
              fontWeight: '900',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }
          });
        }
      }
    }
    prevDoneCount.current = doneItems.length;
  }, [kitchenItems]);

  const handleLogout = () => {
    sessionStorage.removeItem('pos_user');
    navigate('/login', { replace: true });
  };

  // Update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date) =>
    date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const navItems = [
    { to: '/kasir', icon: LayoutGrid, label: 'Kasir' },
    { to: '/riwayat', icon: History, label: 'Riwayat' },
  ];

  return (
    <header className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-50">
      {/* ── Logo & Brand ── */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40 overflow-hidden">
          <img src="/src/assets/Oak_Coffe.png" alt="Gambar Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight tracking-wide">Oak Caffe System</h1>
        </div>
      </div>

      {/* ── Navigasi Tengah ── */}
      <nav className="flex items-center gap-1">
        {navItems.map(({ to, icon, label }) => {
          const Icon = icon;
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── Info Kasir + Waktu ── */}
      <div className="flex items-center gap-5">
        {/* Jam Real-time */}
        <div className="flex items-center gap-2 text-right">
          <Clock size={14} className="text-red-500 shrink-0" />
          <div>
            <p className="text-white font-bold text-sm leading-tight tabular-nums">{formatTime(now)}</p>
            <p className="text-gray-500 text-[10px] leading-tight">{formatDate(now)}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-700" />

        {/* Info Kasir */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center shadow">
            <User size={14} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{loggedUser.name}</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-emerald-400 text-[10px] font-medium">{loggedUser.role} • Aktif</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 group"
          title="Keluar"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
