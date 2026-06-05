import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import useMenuStore from '../../store/useMenuStore';
import useInventoryStore from '../../store/useInventoryStore';
import { USE_DATABASE } from '../../services/apiService';

export default function MenuManagementPage() {
  const { menus, recipes, addMenu, editMenu, deleteMenu, fetchMenus, getRecipesForMenu, saveRecipe } = useMenuStore();
  const { inventory, fetchInventory } = useInventoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('umum'); // umum vs resep
  const [recipeItems, setRecipeItems] = useState([]);  // List of { inventory_id, quantity_needed }
  
  // State form
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: 'kopi',
    price: 0,
    description: '',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80',
  });

  // Fetch menus and inventory on load
  useEffect(() => {
    fetchMenus();
    fetchInventory();
  }, [fetchMenus, fetchInventory]);

  // Load recipe when editing menu and switching to 'resep' tab
  useEffect(() => {
    if (isModalOpen && formData.id && activeTab === 'resep') {
      getRecipesForMenu(formData.id).then((res) => {
        setRecipeItems(res.map(r => ({
          inventory_id: parseInt(r.inventory_id),
          quantity_needed: parseFloat(r.quantity_needed)
        })));
      });
    }
  }, [activeTab, isModalOpen, formData.id, getRecipesForMenu]);

  // Filtered
  const filteredMenus = menus.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      id: null,
      name: '',
      category: 'kopi',
      price: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80',
    });
    setRecipeItems([]);
    setActiveTab('umum');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setFormData(item);
    setRecipeItems([]);
    setActiveTab('umum');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus menu ini? (Akan terhapus juga di kasir)')) {
      deleteMenu(id);
    }
  };

  const handleSaveMenu = async () => {
    if (!formData.name || !formData.price) {
      alert("Nama dan Harga wajib diisi");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      isAvailable: formData.isAvailable !== undefined ? formData.isAvailable : true,
      hasCustomizer: formData.hasCustomizer !== undefined ? formData.hasCustomizer : false,
      tags: formData.tags || ['new'],
    };

    if (formData.id) {
      await editMenu(formData.id, payload);
      await saveRecipe(formData.id, recipeItems);
    } else {
      // Offline fallback: determine next ID
      const nextId = menus.length > 0 ? Math.max(...menus.map(m => m.id)) + 1 : 1;
      await addMenu(payload);

      // Resolve the ID for saving recipe
      const targetId = USE_DATABASE 
        ? (menus.find(m => m.name === formData.name)?.id || nextId) 
        : nextId;
      await saveRecipe(targetId, recipeItems);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manajemen Menu</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola harga, foto, dan resep bahan baku.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
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
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                      recipes[item.id] && recipes[item.id].length > 0
                        ? 'text-green-700 bg-green-50 border-green-200' 
                        : 'text-gray-500 bg-gray-50 border-gray-200'
                    }`}>
                      {recipes[item.id] && recipes[item.id].length > 0
                        ? `${recipes[item.id].length} Bahan Baku`
                        : 'Bebas Stok'
                      }
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

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-black text-white">
              <h3 className="font-bold text-lg">{formData.id ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
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
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" 
                        placeholder="Mis: Kopi Susu Gula Aren" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      >
                        <option value="kopi">Kopi</option>
                        <option value="non-kopi">Non-Kopi</option>
                        <option value="makanan">Makanan</option>
                        <option value="snack">Snack</option>
                        <option value="dessert">Dessert</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Harga Jual (Rp)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" 
                      placeholder="25000" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi</label>
                    <textarea 
                      rows={3} 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" 
                      placeholder="Deskripsi singkat..."
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-800 font-semibold leading-relaxed">
                      Hubungkan menu ini dengan bahan baku di bawah. Stok bahan baku akan otomatis terpotong saat menu ini dibeli di kasir.
                    </p>
                  </div>

                  {recipeItems.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
                      <p className="text-sm text-gray-400 font-medium">Belum ada bahan baku terikat untuk menu ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recipeItems.map((item, index) => {
                        const selectedInventoryItem = inventory.find(i => i.id === item.inventory_id);
                        return (
                          <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bahan Mentah</label>
                              <select 
                                value={item.inventory_id || ''} 
                                onChange={(e) => {
                                  const newRecipe = [...recipeItems];
                                  newRecipe[index].inventory_id = parseInt(e.target.value);
                                  setRecipeItems(newRecipe);
                                }}
                                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black"
                              >
                                <option value="">Pilih Bahan Baku...</option>
                                {inventory.map(inv => (
                                  <option key={inv.id} value={inv.id}>{inv.name}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="w-32">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Takaran / Porsi</label>
                              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1">
                                <input 
                                  type="number" 
                                  step="any"
                                  value={item.quantity_needed || ''}
                                  onChange={(e) => {
                                    const newRecipe = [...recipeItems];
                                    newRecipe[index].quantity_needed = parseFloat(e.target.value) || 0;
                                    setRecipeItems(newRecipe);
                                  }}
                                  placeholder="0"
                                  className="w-full bg-transparent border-none outline-none text-sm text-gray-800"
                                />
                                <span className="text-xs text-gray-400 font-bold shrink-0">
                                  {selectedInventoryItem ? selectedInventoryItem.unit : ''}
                                </span>
                              </div>
                            </div>

                            <button 
                              type="button" 
                              onClick={() => {
                                setRecipeItems(recipeItems.filter((_, i) => i !== index));
                              }}
                              className="self-end p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors border border-red-100"
                              title="Hapus bahan baku"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button 
                    type="button"
                    onClick={() => {
                      const firstId = inventory.length > 0 ? inventory[0].id : '';
                      setRecipeItems([...recipeItems, { inventory_id: firstId, quantity_needed: 0 }]);
                    }}
                    className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-black font-bold text-sm hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    + Hubungkan Bahan Baku
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
              <button onClick={handleSaveMenu} className="px-6 py-2 font-bold text-sm text-white bg-black rounded-xl hover:bg-gray-900 transition-colors shadow-md">
                Simpan
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
