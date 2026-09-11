import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  Download,
  Printer,
  Search,
  BookOpen,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { RCTFA_METADATA, RCTFA_SECTIONS, RAW_RCTFA_PROMPT_TEXT } from "../data/rctfaData";

interface DocumentViewerProps {
  onSwitchToPreview: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ onSwitchToPreview }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSizeClass, setFontSizeClass] = useState<"text-sm" | "text-base" | "text-lg">("text-base");
  const [activeToc, setActiveToc] = useState("role");

  const handleCopyAll = () => {
    navigator.clipboard.writeText(RAW_RCTFA_PROMPT_TEXT);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCopySection = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSectionId(id);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([RAW_RCTFA_PROMPT_TEXT], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Prompt_RCTFA_Laporan_Keuangan_Semester_I_2026.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredSections = searchQuery.trim() === ""
    ? RCTFA_SECTIONS
    : RCTFA_SECTIONS.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.content.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Top Document Action Bar (Google Docs style) */}
      <div className="sticky top-16 z-30 mb-6 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Standar RCTFA Baku
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            FINARECON PRO
          </span>
          <span className="hidden md:inline-flex text-xs text-slate-400">
            v{RCTFA_METADATA.version}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Font Size Toggle */}
          <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setFontSizeClass("text-sm")}
              className={`px-2 py-1 rounded ${fontSizeClass === "text-sm" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              title="Ukuran font kecil"
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeClass("text-base")}
              className={`px-2 py-1 rounded ${fontSizeClass === "text-base" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              title="Ukuran font normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeClass("text-lg")}
              className={`px-2 py-1 rounded ${fontSizeClass === "text-lg" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              title="Ukuran font besar"
            >
              A+
            </button>
          </div>

          {/* Download TXT */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Unduh berkas prompt teks (.txt)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh .TXT</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Cetak atau Simpan PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak / PDF</span>
          </button>

          {/* Copy Full Prompt */}
          <button
            onClick={handleCopyAll}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition ${
              copiedAll
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? "Tersalin ke Clipboard!" : "Salin Prompt Lengkap"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Quick Navigation (TOC) & Metadata Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sticky top-36">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Daftar Isi Dokumen
            </h3>
            <nav className="space-y-1 text-sm">
              {RCTFA_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveToc(sec.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                    activeToc === sec.id
                      ? "bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                      {sec.letter}
                    </span>
                    <span className="truncate">{sec.title.split("(")[0]}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </a>
              ))}
            </nav>

            <hr className="my-4 border-slate-800" />

            {/* Target App Specs */}
            <div className="space-y-3 text-xs text-slate-400">
              <div className="font-semibold text-slate-300">Spesifikasi Target:</div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Platform:</span>
                <span className="font-medium text-slate-200">Google AI Studio</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Periode:</span>
                <span className="font-medium text-amber-300">Dikosongkan / Fleksibel</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Dokumen Masukan:</span>
                <span className="font-medium text-slate-200 text-right">Laporan & Lampiran</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Komponen Analisis:</span>
                <span className="font-medium text-slate-200 text-right">LRA, Neraca, LO, LPE</span>
              </div>
            </div>

            {/* Try Interactive Sandbox Banner */}
            <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 text-xs">
              <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Coba Simulasi Langsung
              </div>
              <p className="text-slate-400 mb-3 leading-relaxed">
                Uji interaktif prototipe aplikasi rekonsiliasi FINARECON PRO yang dirancang oleh prompt ini.
              </p>
              <button
                onClick={onSwitchToPreview}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-1.5 transition"
              >
                <span>Buka Simulasi Web App</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: The Formal A4 Document View */}
        <div className="lg:col-span-3 space-y-6">
          {/* Formal Document Sheet */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Watermark/Accent background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Official Header */}
            <div className="border-b-2 border-slate-700/80 pb-6 mb-8 text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
                <FileText className="w-8 h-8" />
              </div>
              <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
                STANDAR DOKUMEN REKAYASA PROMPT SISTEM PELAPORAN KEUANGAN
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                {RCTFA_METADATA.documentTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
                {RCTFA_METADATA.subtitle}
              </p>
              <div className="pt-2 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span>Periode: <strong>Semester I 2026</strong></span>
                <span>•</span>
                <span>Standar Bahasa: <strong>Bahasa Indonesia Baku (PUEBI)</strong></span>
                <span>•</span>
                <span>Status: <strong className="text-emerald-400">Siap Dieksekusi</strong></span>
              </div>
            </div>

            {/* Document Abstract / Introduction */}
            <div className="mb-8 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-sm text-slate-300 leading-relaxed">
              <strong className="text-white font-semibold">Petunjuk Penggunaan: </strong>
              Dokumen ini disusun menggunakan kerangka kerja <strong>RCTFA (Role, Context, Task, Format, Audience & Acceptance Criteria)</strong> dengan tata bahasa Indonesia yang baku. Prompt ini dirancang secara khusus untuk disalin ke kolom instruksi <strong>Google AI Studio</strong> guna menghasilkan aplikasi web yang mampu menyusun laporan keuangan, menganalisis selisih nilai akun antara berkas <em>"Lampiran Neraca"</em> dan <em>"Laporan Keuangan"</em> pada periode <strong>Semester I 2026</strong>, serta memindahkan data tersebut ke seksi <strong>Ringkasan Laporan Keuangan</strong> (LRA, Neraca, LO, dan LPE).
            </div>

            {/* Search Input for document */}
            <div className="mb-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bagian, akun, atau kata kunci dalam dokumen..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/70 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* The 5 Core Sections (R - C - T - F - A) */}
            <div className={`space-y-8 ${fontSizeClass}`}>
              {filteredSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 p-5 sm:p-6 rounded-2xl bg-slate-950/40 border border-slate-800/90 relative group hover:border-slate-700/80 transition"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-600/20">
                        {section.letter}
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                          {section.title}
                        </h2>
                        <p className="text-xs text-slate-400 font-medium">{section.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopySection(section.content.join("\n"), section.id)}
                      className="opacity-80 group-hover:opacity-100 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
                      title={`Salin bagian ${section.letter}`}
                    >
                      {copiedSectionId === section.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden sm:inline">Salin Bagian</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-slate-300 leading-relaxed">
                    {section.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className={
                          paragraph.startsWith("  ")
                            ? "pl-4 text-slate-400 text-xs sm:text-sm"
                            : paragraph.startsWith("1.") || paragraph.startsWith("2.") || paragraph.startsWith("3.") || paragraph.startsWith("4.") || paragraph.startsWith("5.") || paragraph.startsWith("6.")
                            ? "font-medium text-slate-200"
                            : ""
                        }
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Raw Prompt Code Block (Ready to Copy) */}
            <div className="mt-10 pt-8 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-white">
                    Teks Prompt Utuh Siap Tempel (Single-Block Prompt)
                  </h3>
                </div>
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? "Berhasil Disalin!" : "Salin Prompt Utuh"}</span>
                </button>
              </div>

              <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-slate-300 max-h-96 leading-relaxed select-all">
                <pre>{RAW_RCTFA_PROMPT_TEXT}</pre>
              </div>
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Tips: Tempelkan teks di atas ke kolom prompt awal saat membuat proyek baru di Google AI Studio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
