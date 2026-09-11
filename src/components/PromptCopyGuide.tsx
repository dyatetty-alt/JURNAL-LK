import React, { useState } from "react";
import {
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  FileCheck,
  Terminal,
  Layers,
  Cpu
} from "lucide-react";
import { RAW_RCTFA_PROMPT_TEXT, RCTFA_METADATA } from "../data/rctfaData";

export const PromptCopyGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_RCTFA_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Prompting Engineering Standar RCTFA
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Salin Prompt RCTFA untuk Google AI Studio
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Gunakan teks prompt terstruktur berikut untuk menginstruksikan Google AI Studio dalam mengembangkan aplikasi rekonsiliasi laporan keuangan FINARECON PRO.
        </p>
      </div>

      {/* Main Copy Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Template Siap Pakai
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              Prompt Lengkap RCTFA (Bahasa Indonesia Baku)
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/20"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Berhasil Disalin ke Clipboard!" : "Salin Seluruh Prompt"}</span>
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="relative">
          <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto max-h-96 whitespace-pre-wrap select-all">
            {RAW_RCTFA_PROMPT_TEXT}
          </pre>
        </div>

        {/* Breakdown of RCTFA components */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs font-bold text-indigo-400">R - ROLE</div>
            <div className="text-[11px] text-slate-400 mt-1">Web Architect & Ahli Akuntansi</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs font-bold text-indigo-400">C - CONTEXT</div>
            <div className="text-[11px] text-slate-400 mt-1">Semester I 2026 & Dua Dokumen</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs font-bold text-indigo-400">T - TASK</div>
            <div className="text-[11px] text-slate-400 mt-1">Analisis 4 Pos & Ringkasan Laporan</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs font-bold text-indigo-400">F - FORMAT</div>
            <div className="text-[11px] text-slate-400 mt-1">Dashboard Modern & Format Rupiah</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs font-bold text-indigo-400">A - AUDIENCE</div>
            <div className="text-[11px] text-slate-400 mt-1">Auditor & Kriteria Presisi 100%</div>
          </div>
        </div>
      </div>

      {/* Step by Step Implementation in Google AI Studio */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Panduan Langkah Pengembangan di Google AI Studio
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <strong className="text-white">Buka Google AI Studio:</strong> Masuk ke platform Google AI Studio (ai.studio/build atau antarmuka Prompt Studio).
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <strong className="text-white">Tempelkan Prompt RCTFA:</strong> Tempelkan teks prompt di atas ke kotak percakapan agen pengembang (chat prompt).
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <strong className="text-white">Eksekusi Pembuatan:</strong> Biarkan AI Studio mengompilasi kode React, antarmuka pengunggahan ganda, mesin deteksi selisih, dan seksi Ringkasan Laporan Keuangan secara otomatis.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </div>
            <div>
              <strong className="text-white">Uji Coba Berkas Anda:</strong> Unggah berkas Excel "Laporan Keuangan" dan "Lampiran Neraca" Semester I 2026 Anda, lalu amati hasil kompilasi otomatis pada bagian Ringkasan Laporan Keuangan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
