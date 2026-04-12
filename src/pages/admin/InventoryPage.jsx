import { useState } from 'react';
import { PackagePlus, ArrowDownToLine, ArrowUpFromLine, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';

const mockInventory = [
  { id: 1, name: 'Biji Kopi Arabika', current: 500, unit: 'g', limit: 1000 },
  { id: 2, name: 'Susu UHT', current: 2000, unit: 'ml', limit: 5000 },
  { id: 3, name: 'Sirup Vanilla', current: 850, unit: 'ml', limit: 300 },
  { id: 4, name: 'Cup Plastik', current: 20, unit: 'pcs', limit: 50 },
  { id: 5, name: 'Gula Aren', current: 2500, unit: 'g', limit: 1000 },
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredInventory = mockInventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Inventori Bahan Baku</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau, tambah, dan sesuaikan stok bahan mentah.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-black px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowDownToLine size={18} />
            Penyesuaian
          </button>
          <button className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
            <PackagePlus size={18} />
            Stock In
          </button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center w-full max-w-md bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-gray-400 transition-colors">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari bahan baku..." 
            className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Inventory Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-sm">
                <th className="px-6 py-4 font-bold">Bahan Baku</th>
                <th className="px-6 py-4 font-bold">Stok Saat Ini</th>
                <th className="px-6 py-4 font-bold">Batas Minimum</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => {
                const isCritical = item.current <= item.limit;
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{item.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-lg font-black ${isCritical ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.current}
                        </span>
                        <span className="text-sm font-semibold text-gray-500">{item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-500">
                      {item.limit} {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                          <AlertTriangle size={14} /> Kritis
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 size={14} /> Aman
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-500 hover:text-white bg-gray-50 hover:bg-black rounded-lg transition-colors border border-gray-200 hover:border-black" title="Tambah Stok">
                          <ArrowUpFromLine size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-white bg-gray-50 hover:bg-black rounded-lg transition-colors border border-gray-200 hover:border-black" title="Kurangi/Sesuaikan Stok">
                          <ArrowDownToLine size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Bahan baku tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
