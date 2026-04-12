import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Coffee, Package, FileText, Settings, LogOut, Bell, Search, Menu } from 'lucide-react';
import oakLogo from '../../assets/Oak_Coffe.png';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('pos_user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Menu', path: '/admin/menu', icon: Coffee },
    { name: 'Inventori', path: '/admin/inventory', icon: Package },
    { name: 'Laporan', path: '/admin/reports', icon: FileText },
    { name: 'Pengaturan', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row font-sans">
      
      {/* ── Mobile Header ── */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black text-white">
        <div className="flex items-center gap-2">
          <img src={oakLogo} alt="Oak Coffee" className="h-8 w-8 object-contain" />
          <span className="font-bold text-lg tracking-wider">OAK ADMIN</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-800 rounded-md">
          <Menu size={20} />
        </button>
      </div>

      {/* ── Sidebar (30% Black Theme) ── */}
      <aside className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-black text-white flex-shrink-0 flex flex-col h-full absolute md:relative z-20`}>
        <div className="p-6 flex items-center justify-center border-b border-gray-800 hidden md:flex">
          <img src={oakLogo} alt="Oak Coffee" className="h-16 w-16 object-contain drop-shadow-md" />
        </div>
        
        <div className="p-4 flex-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 ml-3">Menu Utama</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-red-600 text-white font-semibold' // 10% Red for active state
                        : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-300 hover:bg-gray-900 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area (60% White) ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        
        {/* ── Top Header ── */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-end px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-black transition-colors">
              <Bell size={20} />
              {/* Notification Badge (Red) */}
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">Admin System</p>
                <p className="text-xs text-gray-500">Superadmin</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Dynamic Page Content ── */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
