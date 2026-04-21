import { Award, BookOpen, Building2, User, Mail, GraduationCap } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profil Pengembang</h1>
        <p className="text-gray-500 text-sm mt-1">Informasi pembuat sistem Point of Sale Oak Coffee.</p>
      </div>

      {/* ── Profile Card (Match Admin Theme) ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        
        {/* Background Design */}
        <div className="h-48 bg-black relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/30 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-40 h-40 bg-red-700/20 rounded-full blur-2xl" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2000&auto=format&fit=crop')] opacity-20 mix-blend-overlay bg-cover bg-center"></div>
        </div>

        {/* Profile Info Section */}
        <div className="px-8 pb-8">
          
          {/* Avatar / Photo Placeholder */}
          <div className="relative -mt-20 mb-6 flex justify-between items-end">
            <div className="w-40 h-40 bg-white p-2 rounded-3xl shadow-xl shadow-gray-200/50 rotate-3 transition-transform hover:rotate-0 duration-300">
              <div className="w-full h-full bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <img 
                  src="/foto_pertama.jpeg" 
                  alt="Profile Yazrol" 
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=Yazrol+Surya&size=200&background=random'; }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-950/80 to-transparent z-0 pointer-events-none"></div>
                <div className="absolute bottom-3 left-0 right-0 text-center z-10">
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Developer
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions (Mock) */}
            <div className="flex gap-3 mb-2">
              <button className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                <Mail size={16} /> Hubungi
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Main Info */}
            <div className="md:col-span-2 space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                Yazrol Surya
              </h2>
              <p className="text-xl text-red-600 font-bold tracking-wide">Mahasiswa</p>
              
              <div className="pt-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Detail Informasi</h3>
                
                <div className="space-y-4">
                  
                  {/* NIM */}
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:shadow-red-100 transition-all">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">NIM</p>
                      <p className="text-gray-900 font-bold text-lg">3202402003</p>
                    </div>
                  </div>

                  {/* Jurusan */}
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:shadow-red-100 transition-all">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jurusan</p>
                      <p className="text-gray-900 font-bold text-lg">Manajemen Informatika</p>
                    </div>
                  </div>

                  {/* Universitas */}
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:shadow-red-100 transition-all">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Universitas/Kampus</p>
                      <p className="text-gray-900 font-bold text-lg">Politeknik Negeri Sambas</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Sidebar / Additional Info */}
            <div className="space-y-6">
              <div className="bg-black rounded-3xl p-6 text-white shadow-xl shadow-black/10 relative overflow-hidden h-full">
                {/* Decoration inside card */}
                <div className="absolute -bottom-10 -right-10 text-gray-800 opacity-30">
                  <GraduationCap size={150} />
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2 relative z-10">Tentang Aplikasi</h3>
                <div className="w-10 h-1 bg-red-500 rounded-full mb-6 relative z-10" />
                
                <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                  Aplikasi Point of Sale (POS) Oak Coffee System dirancang khusus untuk mempermudah manajemen kafe dengan antarmuka yang modern, cepat, dan responsif. 
                  <br/><br/>
                  Dibuat dan dikembangkan sebagai bagian dari project / tugas akhir untuk memenuhi persyaratan akademis.
                </p>

                <div className="mt-8 pt-6 border-t border-gray-800 relative z-10">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Versi Sistem</p>
                  <p className="text-white font-bold">v1.0.0 (Beta)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
