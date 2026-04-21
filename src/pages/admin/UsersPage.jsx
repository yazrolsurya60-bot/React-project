import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Shield, User } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Budi Santoso', username: 'budi', password: 'password123', role: 'Kasir Shift Pagi' },
    { id: 2, name: 'Kasir Demo', username: 'kasir', password: 'kasirdemo', role: 'Kasir' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State form
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    username: '',
    password: '',
    role: 'Kasir',
  });

  // Filtered
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      id: null,
      name: '',
      username: '',
      password: '',
      role: 'Kasir',
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setFormData({ ...item }); 
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus akun kasir ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.username) {
      alert("Nama dan Username wajib diisi");
      return;
    }

    if (formData.id) {
      // Edit
      setUsers(users.map(u => u.id === formData.id ? { ...formData, id: u.id } : u));
    } else {
      // Add
      if (!formData.password) {
        alert("Password wajib diisi untuk akun baru");
        return;
      }
      setUsers([...users, { ...formData, id: Date.now() }]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manajemen User (Kasir)</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data staf kasir dan akses sistem.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
        >
          <Plus size={18} />
          Tambah Kasir
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center w-full max-w-md bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-gray-400 transition-colors">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama, username, atau role..." 
            className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-gray-400 focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Users Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-sm">
                <th className="px-6 py-4 font-bold">Nama Staf</th>
                <th className="px-6 py-4 font-bold">Username</th>
                <th className="px-6 py-4 font-bold">Password</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 font-medium">@{item.username}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 font-mono text-sm tracking-wide">{item.password || '••••••••'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold tracking-wide flex items-center gap-1.5 w-max">
                      <Shield size={14} className="text-gray-500" /> 
                      {item.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEdit(item)} className="p-2 text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Tidak ada kasir yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-black text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <User size={20} className="text-red-500" />
                {formData.id ? 'Edit Data Kasir' : 'Tambah Kasir Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
                    placeholder="Masukkan nama kasir" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Username (Login)</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
                    placeholder="Mis: kasir1" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-24 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
                      placeholder="Masukkan password" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 hover:text-black uppercase tracking-widest bg-gray-200/50 hover:bg-gray-200 px-2 py-1 rounded-md transition-colors"
                    >
                      {showPassword ? "Sembunyikan" : "Tampilkan"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role / Jabatan</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors appearance-none"
                  >
                    <option value="Kasir">Kasir</option>
                    <option value="Kasir Shift Pagi">Kasir Shift Pagi</option>
                    <option value="Kasir Shift Malam">Kasir Shift Malam</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 font-bold text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button onClick={handleSaveUser} className="px-6 py-2.5 font-bold text-sm text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
                Simpan
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
