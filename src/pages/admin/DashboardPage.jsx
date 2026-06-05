import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, PackageX, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import useInventoryStore from '../../store/useInventoryStore';
import useHistoryStore from '../../store/useHistoryStore';
import RestockModal from '../../components/admin/RestockModal';
import { apiRequest, USE_DATABASE } from '../../services/apiService';

export default function DashboardPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const { inventory, addStock, fetchInventory } = useInventoryStore();
  const { orders, fetchOrders } = useHistoryStore();
  const [apiStats, setApiStats] = useState(null);

  useEffect(() => {
    fetchInventory();
    if (USE_DATABASE) {
      apiRequest('orders.php?action=get_stats')
        .then(res => {
          if (res && res.success) {
            setApiStats(res.stats);
          }
        })
        .catch(err => {
          console.error("Gagal memuat statistik database:", err);
        });
    } else {
      fetchOrders();
    }
  }, [fetchInventory, fetchOrders]);

  const lowStock = inventory.filter(item => item.current <= item.limit);

  // ── Hitung Statistik Lokal (Offline Fallback) ──
  const localStats = useMemo(() => {
    if (USE_DATABASE && apiStats) return null;

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalTransactions = orders.length;

    // Hitung menu terlaris
    const productCounts = {};
    orders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
        });
      }
    });

    let bestMenu = 'Belum ada';
    let bestQty = 0;
    Object.entries(productCounts).forEach(([name, qty]) => {
      if (qty > bestQty) {
        bestMenu = name;
        bestQty = qty;
      }
    });

    // Hitung chart data 7 hari terakhir
    const daysShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysShort[d.getDay()];
      const dateStr = d.toDateString();

      const dailyTotal = orders
        .filter(o => new Date(o.date).toDateString() === dateStr)
        .reduce((sum, o) => sum + o.total, 0);

      chartData.push({
        name: dayName,
        total: dailyTotal
      });
    }

    return {
      total_revenue: totalRevenue,
      total_transactions: totalTransactions,
      bestseller: {
        name: bestMenu,
        sold: bestQty
      },
      chart_data: chartData
    };
  }, [orders, apiStats]);

  const activeStats = USE_DATABASE && apiStats ? apiStats : (localStats || {
    total_revenue: 0,
    total_transactions: 0,
    bestseller: { name: 'Belum ada', sold: 0 },
    chart_data: []
  });

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
            <h3 className="text-3xl font-black text-gray-900">
              Rp {activeStats.total_revenue.toLocaleString('id-ID')}
            </h3>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm font-semibold">
              <ArrowUpRight size={16} />
              <span>Dihitung dinamis</span>
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
            <h3 className="text-3xl font-black text-gray-900">
              {activeStats.total_transactions}
            </h3>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm font-semibold">
              <ArrowUpRight size={16} />
              <span>Semua pesanan</span>
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
            <h3 className="text-xl font-black text-gray-900 break-word leading-tight mt-1">
              {activeStats.bestseller.name}
            </h3>
            <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm font-medium">
              <span>{activeStats.bestseller.sold} item terjual</span>
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
              <LineChart data={activeStats.chart_data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                  tickFormatter={(val) => `Rp ${val.toLocaleString('id-ID')}`}
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
            {lowStock.length > 0 ? lowStock.map((item) => (
              <div key={item.id} className="p-4 border border-red-50 bg-red-50/50 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Sisa: <span className="text-red-600 font-bold">{item.current}{item.unit}</span> / Min: {item.limit}{item.unit}</p>
                </div>
                  <button 
                    onClick={() => setSelectedItem(item)}
                    className="text-xs font-bold bg-white text-red-600 px-3 py-1.5 rounded shrink-0 shadow-sm border border-red-100 hover:bg-red-50 transition-colors"
                  >
                    Restock
                  </button>
              </div>
            )) : (
              <div className="text-sm text-gray-500 text-center py-4">Semua stok bahan baku aman.</div>
            )}
          </div>

          <Link to="/admin/inventory" className="w-full mt-4 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl text-sm transition-colors text-center block">
            Lihat Semua Inventori
          </Link>
        </div>
      </div>
      
      {/* ── Restock Modal ── */}
      {selectedItem && (
        <RestockModal
          item={selectedItem}
          onConfirm={(id, amount) => addStock(id, amount)}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
