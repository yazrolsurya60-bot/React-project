import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { menuData } from '../../data/menuData';

export default function MenuManagementPage() {
  const [menus, setMenus] = useState(menuData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('umum'); // umum vs resep

  // Filtered
  const filteredMenus = menus.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manajemen Menu</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola harga, foto, dan resep bahan baku.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
        >
          <Plus size={18} />
          Tambah Menu
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center w-full max-w-md bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-gray-400 transition-colors">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari menu..." 
            className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Menu Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-sm">
                <th className="px-6 py-4 font-bold">Produk</th>
                <th className="px-6 py-4 font-bold">Kategori</th>
                <th className="px-6 py-4 font-bold">Harga Jual</th>
                <th className="px-6 py-4 font-bold">Resep Terikat</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMenus.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                      <span className="font-bold text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Rp {item.price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
                      Ya (3 Bahan)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredMenus.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Tidak ada menu yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal (Mock) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-black text-white">
              <h3 className="font-bold text-lg">Tambah Menu Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-100 shrink-0">
              <button 
                onClick={() => setActiveTab('umum')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'umum' ? 'border-red-600 text-red-600 bg-red-50/20' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                Informasi Umum
              </button>
              <button 
                onClick={() => setActiveTab('resep')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'resep' ? 'border-red-600 text-red-600 bg-red-50/20' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                Manajemen Resep & Stok
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'umum' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nama Menu</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="Mis: Kopi Susu Gula Aren" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black">
                        <option>Kopi</option>
                        <option>Non-Kopi</option>
                        <option>Makanan</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Harga Jual (Rp)</label>
                    <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="25000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi</label>
                    <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" placeholder="Deskripsi singkat..."></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-3">
                    <p className="text-xs text-blue-800">Tambahkan bahan baku yang akan dikurangi setiap kali menu ini terjual.</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Resep Item 1 */}
                    <div className="flex items-center gap-3">
                      <select className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm">
                        <option>Biji Kopi Arabika</option>
                        <option>Susu UHT</option>
                        <option>Gula Aren</option>
                      </select>
                      <input type="number" placeholder="Qty" className="w-20 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm" value="15" readOnly />
                      <span className="text-sm font-semibold text-gray-500 w-10">gr</span>
                      <button className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                    {/* Resep Item 2 */}
                    <div className="flex items-center gap-3">
                      <select className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm">
                        <option>Susu UHT</option>
                        <option>Gula Aren</option>
                      </select>
                      <input type="number" placeholder="Qty" className="w-20 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm" value="100" readOnly />
                      <span className="text-sm font-semibold text-gray-500 w-10">ml</span>
                      <button className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold text-sm mt-2 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                    + Tambah Bahan Baku
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-bold text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button className="px-6 py-2 font-bold text-sm text-white bg-black rounded-xl hover:bg-gray-900 transition-colors shadow-md">
                Simpan Menu
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
