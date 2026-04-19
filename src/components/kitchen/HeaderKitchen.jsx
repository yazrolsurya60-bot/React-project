// ============================================================
// HEADER KITCHEN
// ============================================================
import React, { useState, useEffect } from 'react';
import { ChefHat, Clock } from 'lucide-react';

export default function HeaderKitchen() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white">
          <ChefHat size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 leading-tight">Dapur</h1>
          <p className="text-gray-500 text-sm font-medium">Terminal Koki - POS System</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-gray-700 font-bold">
        <Clock size={18} />
        <span>
          {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </header>
  );
}
