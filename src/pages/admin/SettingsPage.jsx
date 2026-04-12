import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center mt-20">
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        <Settings size={48} className="text-gray-400" />
      </div>
      <h1 className="text-2xl font-black text-gray-900">Pengaturan Sistem</h1>
      <p className="text-gray-500 max-w-md mt-2">
        Halaman pengaturan aplikasi (Profil Kafe, Pajak, Diskon, Metode Pembayaran, dll) akan tersedia di pembaruan berikutnya.
      </p>
    </div>
  );
}
