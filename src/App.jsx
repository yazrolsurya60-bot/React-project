// ============================================================
// APP - Root component dengan React Router + Route Guard
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import KasirPage from './pages/KasirPage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
import InventoryPage from './pages/admin/InventoryPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';

// ── Guard: Hanya bisa diakses jika sudah login ─────────────
function PrivateRoute({ element }) {
  const user = sessionStorage.getItem('pos_user');
  return user ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Redirect root ke login ── */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Halaman Login (publik) ── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Halaman Kasir (terproteksi) ── */}
        <Route path="/kasir" element={<PrivateRoute element={<KasirPage />} />} />

        {/* ── Admin Dashboard (terproteksi) dengan Layout ── */}
        <Route path="/admin" element={<PrivateRoute element={<AdminLayout />} />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="menu" element={<MenuManagementPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ── 404 fallback ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;