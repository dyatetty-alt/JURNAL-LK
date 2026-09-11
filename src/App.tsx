import React from "react";
import {
  Building2,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { FinancialAppPreview } from "./components/FinancialAppPreview";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  JURNAL <span className="text-indigo-400 font-semibold">LK</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Sistem Akuntansi
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sistem Penyusunan & Rekonsiliasi Laporan Keuangan
              </p>
            </div>
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Sistem Siap Operasi</span>
              <span className="sm:hidden">Aktif</span>
            </span>
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              SAP / SAK
            </span>
          </div>
        </div>
      </header>

      {/* Main Financial Application View */}
      <main className="flex-1">
        <FinancialAppPreview />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>JURNAL LK • Sistem Penyusunan & Rekonsiliasi Laporan Keuangan Terpadu</span>
          </div>
          <div>
            Standar Akuntansi Pemerintahan & Standar Akuntansi Keuangan
          </div>
        </div>
      </footer>
    </div>
  );
}
