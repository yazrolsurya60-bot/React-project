// ============================================================
// APP - Root component dengan React Router + Route Guard
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import KasirPage from './pages/KasirPage';

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

        {/* ── Halaman terproteksi ── */}
        <Route path="/kasir"      element={<PrivateRoute element={<KasirPage />} />} />

        {/* ── Placeholder Riwayat ── */}
        <Route
          path="/riwayat"
          element={
            <PrivateRoute
              element={
                <div className="flex h-screen items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-4xl mb-3">📋</p>
                    <h1 className="text-xl font-black text-gray-800">Riwayat Transaksi</h1>
                    <p className="text-gray-400 text-sm mt-1">Halaman ini sedang dikembangkan</p>
                  </div>
                </div>
              }
            />
          }
        />

        {/* ── Placeholder Pengaturan ── */}
        <Route
          path="/pengaturan"
          element={
            <PrivateRoute
              element={
                <div className="flex h-screen items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-4xl mb-3">⚙️</p>
                    <h1 className="text-xl font-black text-gray-800">Pengaturan</h1>
                    <p className="text-gray-400 text-sm mt-1">Halaman ini sedang dikembangkan</p>
                  </div>
                </div>
              }
            />
          }
        />

        {/* ── 404 fallback ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;