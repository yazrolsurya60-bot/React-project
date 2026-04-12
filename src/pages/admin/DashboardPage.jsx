import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, PackageX, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

const mockChartData = [
  { name: 'Sen', total: 1200000 },
  { name: 'Sel', total: 2100000 },
  { name: 'Rab', total: 1800000 },
  { name: 'Kam', total: 2400000 },
  { name: 'Jum', total: 3200000 },
  { name: 'Sab', total: 4500000 },
  { name: 'Min', total: 5100000 },
];

const mockLowStock = [
  { id: 1, name: 'Biji Kopi Arabika', current: '500g', min: '1000g' },
  { id: 2, name: 'Susu UHT', current: '2L', min: '5L' },
  { id: 3, name: 'Cup Plastik', current: '20pcs', min: '50pcs' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      
      {/* ── Page Title ── */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Ringkasan Hari Ini</h1>
        <p className="text-gray-500 text-sm mt-1">Pantau performa dan peringatan stok kafe Anda.</p>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Pendapatan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Pendapatan</p>
            <h3 className="text-3xl font-black text-gray-900">Rp 5.100.000</h3>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm font-semibold">
              <ArrowUpRight size={16} />
              <span>+12.5% dari kemarin</span>
            </div>
          </div>
          <div className="p-3 bg-black text-white rounded-xl">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Card 2: Transaksi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Transaksi</p>
            <h3 className="text-3xl font-black text-gray-900">142</h3>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm font-semibold">
              <ArrowUpRight size={16} />
              <span>+5% dari kemarin</span>
            </div>
          </div>
          <div className="p-3 bg-black text-white rounded-xl">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Card 3: Item Terlaris */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Menu Terlaris</p>
            <h3 className="text-xl font-black text-gray-900 break-words leading-tight mt-1">Kopi Susu Gula Aren</h3>
            <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm font-medium">
              <span>85 cup terjual</span>
            </div>
          </div>
          <div className="p-3 bg-red-600 text-white rounded-xl">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Revenue Chart (Span 2 cols) ── */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-gray-900">Grafik Pendapatan (7 Hari Terakhir)</h2>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(val) => `Rp${val / 1000000}M`}
                />
                <Tooltip 
                  cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#000000" 
                  strokeWidth={4} 
                  dot={{ fill: '#000000', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, fill: '#dc2626', stroke: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Low Stock Alert Panel ── */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <PackageX size={20} />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Peringatan Stok Tipis</h2>
          </div>
          
          <div className="space-y-4 flex-1">
            {mockLowStock.map((item) => (
              <div key={item.id} className="p-4 border border-red-50 bg-red-50/50 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Sisa: <span className="text-red-600 font-bold">{item.current}</span> / Min: {item.min}</p>
                </div>
                <button className="text-xs font-bold bg-white text-red-600 px-3 py-1.5 rounded flex-shrink-0 shadow-sm border border-red-100 hover:bg-red-50 transition-colors">
                  Restock
                </button>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl text-sm transition-colors">
            Lihat Semua Inventori
          </button>
        </div>
      </div>
      
    </div>
  );
}
