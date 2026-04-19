// ============================================================
// KANBAN BOARD
// ============================================================
import React from 'react';
import OrderCard from './OrderCard';
import useKitchenStore from '../../store/useKitchenStore';

export default function KanbanBoard() {
  const { kitchenItems } = useKitchenStore();

  const todoItems = kitchenItems.filter(i => i.status === 'todo');
  const progressItems = kitchenItems.filter(i => i.status === 'progress');
  const doneItems = kitchenItems.filter(i => i.status === 'done');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-w-[900px] pb-10">
      {/* ── Kolom 1: Menunggu ── */}
      <Column title="Menunggu (To-Do)" count={todoItems.length} color="border-t-gray-300">
        {todoItems.map((item) => (
          <OrderCard key={item.kitchenItemId} item={item} />
        ))}
      </Column>

      {/* ── Kolom 2: Dimasak ── */}
      <Column title="Dimasak (In Progress)" count={progressItems.length} color="border-t-red-600">
        {progressItems.map((item) => (
          <OrderCard key={item.kitchenItemId} item={item} />
        ))}
      </Column>

      {/* ── Kolom 3: Selesai ── */}
      <Column title="Selesai (Done)" count={doneItems.length} color="border-t-gray-900">
        {doneItems.map((item) => (
          <OrderCard key={item.kitchenItemId} item={item} />
        ))}
      </Column>
    </div>
  );
}

function Column({ title, count, color, children }) {
  return (
    <div className={`flex flex-col bg-gray-200/50 rounded-2xl border-t-8 ${color} shadow-sm overflow-hidden`}>
      <div className="px-5 py-4 bg-white/60 border-b border-gray-200/50 flex justify-between items-center shrink-0">
        <h2 className="font-bold text-gray-800">{title}</h2>
        <span className="bg-white text-gray-600 px-3 py-1 rounded-full text-sm font-black shadow-sm">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}
