import { useState } from 'react';
import { Calendar, Download, FileText, Search, Eye } from 'lucide-react';

const mockTransactions = [];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter(trx => 
    trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trx.cashier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Laporan Penjualan</h1>
          <p className="text-gray-500 text-sm mt-1">Riwayat transaksi dan ekspor data performa.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-black px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
            <FileText size={18} />
            Ekspor CSV
          </button>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
            <Download size={18} />
            Unduh PDF
          </button>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        
        {/* Search */}
        <div className="flex items-center w-full md:flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-gray-400 transition-colors">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari ID transaksi atau Kasir..." 
            className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Fillters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <input type="date" className="bg-transparent border-none outline-none text-sm text-gray-700" />
          </div>
          <span className="text-gray-400 text-sm font-medium">sd</span>
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <input type="date" className="bg-transparent border-none outline-none text-sm text-gray-700" />
          </div>
        </div>
      </div>

      {/* ── Transactions Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-sm">
                <th className="px-6 py-4 font-bold">ID Transaksi</th>
                <th className="px-6 py-4 font-bold">Waktu</th>
                <th className="px-6 py-4 font-bold">Kasir</th>
                <th className="px-6 py-4 font-bold">Total Item</th>
                <th className="px-6 py-4 font-bold">Total Harga</th>
                <th className="px-6 py-4 font-bold text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{trx.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {trx.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {trx.cashier}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {trx.items} Item
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    Rp {trx.total.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-black text-gray-600 hover:text-white rounded-lg text-xs font-bold transition-colors border border-gray-200 hover:border-black">
                      <Eye size={14} /> Lihat
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Tidak ada transaksi yang ditemukan pada rentang tanggal ini.
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
