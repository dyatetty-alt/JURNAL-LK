import React, { useState, useMemo } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Scale,
  Activity,
  FileText,
  Filter,
  RefreshCw,
  Download,
  Search,
  PieChart,
  HelpCircle,
  Eye,
  Check,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  Printer,
  ChevronDown,
  ChevronUp,
  X,
  FileCheck,
  SlidersHorizontal,
  Sliders,
  CheckCheck,
  ArrowUpDown,
  BookOpen,
  FileDown
} from "lucide-react";
import {
  INITIAL_ACCOUNTS,
  FinancialAccount,
  formatRupiah
} from "../data/mockFinancialData";

export const FinancialAppPreview: React.FC = () => {
  const [accounts, setAccounts] = useState<FinancialAccount[]>(INITIAL_ACCOUNTS);
  const [selectedTab, setSelectedTab] = useState<"SUMMARY" | "ALL" | "LRA" | "NERACA" | "LO" | "LPE">("SUMMARY");
  const [filterDiscrepancyOnly, setFilterDiscrepancyOnly] = useState(false);
  const [searchAccount, setSearchAccount] = useState("");
  
  // Period state: Empty by default as requested ("kosongkan periode")
  const [reportingPeriod, setReportingPeriod] = useState<string>("");
  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [customPeriodInput, setCustomPeriodInput] = useState("");

  // Files simulation
  const [simulatedReportFile, setSimulatedReportFile] = useState<string>("Laporan_Keuangan.xlsx");
  const [simulatedAttachmentFile, setSimulatedAttachmentFile] = useState<string>("Lampiran_Neraca.xlsx");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Modal / Drawer state for Account Detail & Adjustment Recommendation
  const [selectedAccountForDetail, setSelectedAccountForDetail] = useState<FinancialAccount | null>(null);

  // Accordion state for summary breakdown preview
  const [expandedSummaryCard, setExpandedSummaryCard] = useState<"LRA" | "NERACA" | "LO" | "LPE" | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setUploadProgress(15);
    setAnalysisCompleted(false);
    
    setTimeout(() => setUploadProgress(45), 200);
    setTimeout(() => setUploadProgress(85), 450);
    setTimeout(() => {
      setAccounts(INITIAL_ACCOUNTS);
      setIsProcessing(false);
      setUploadProgress(null);
      setAnalysisCompleted(true);
      showNotification("Data Laporan Keuangan dan Lampiran Neraca berhasil dianalisis! Dokumen siap diunduh.");
    }, 700);
  };

  const handleManualFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "REPORT" | "ATTACHMENT") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (target === "REPORT") {
        setSimulatedReportFile(file.name);
      } else {
        setSimulatedAttachmentFile(file.name);
      }
      setIsProcessing(true);
      setAnalysisCompleted(false);
      setUploadProgress(30);
      setTimeout(() => setUploadProgress(80), 300);
      setTimeout(() => {
        setIsProcessing(false);
        setUploadProgress(null);
        setAnalysisCompleted(true);
        showNotification(`Berkas ${file.name} berhasil diunggah & dianalisis. Dokumen siap diunduh.`);
      }, 600);
    }
  };

  const handleResetData = () => {
    setAccounts(INITIAL_ACCOUNTS.map(a => ({ ...a, attachmentValue: a.reportValue, notes: "Rekonsiliasi selesai (Sesuai)." })));
    showNotification("Semua selisih akun telah direkonsiliasi seimbang (Balance).");
  };

  const handleSavePeriod = () => {
    setReportingPeriod(customPeriodInput.trim());
    setIsEditingPeriod(false);
    showNotification(
      customPeriodInput.trim()
        ? `Periode diperbarui: "${customPeriodInput.trim()}"`
        : "Periode dikosongkan."
    );
  };

  const handleClearPeriod = () => {
    setReportingPeriod("");
    setCustomPeriodInput("");
    setIsEditingPeriod(false);
    showNotification("Periode pelaporan telah dikosongkan.");
  };

  // Calculations
  const stats = useMemo(() => {
    const totalItems = accounts.length;
    let discrepancies = 0;
    let totalDifferenceNominal = 0;

    accounts.forEach(acc => {
      const diff = acc.attachmentValue - acc.reportValue;
      if (Math.abs(diff) > 0) {
        discrepancies++;
        totalDifferenceNominal += Math.abs(diff);
      }
    });

    const lraAccounts = accounts.filter(a => a.category === "LRA");
    const neracaAccounts = accounts.filter(a => a.category === "NERACA");
    const loAccounts = accounts.filter(a => a.category === "LO");
    const lpeAccounts = accounts.filter(a => a.category === "LPE");

    return {
      totalItems,
      discrepancies,
      totalDifferenceNominal,
      balancePercentage: Math.round(((totalItems - discrepancies) / totalItems) * 100),
      lraCount: lraAccounts.length,
      neracaCount: neracaAccounts.length,
      loCount: loAccounts.length,
      lpeCount: lpeAccounts.length
    };
  }, [accounts]);

  // Summaries per statement
  const summaryLRA = useMemo(() => {
    const pend = accounts.filter(a => a.category === "LRA" && a.subCategory.includes("Pendapatan"));
    const bel = accounts.filter(a => a.category === "LRA" && a.subCategory.includes("Belanja"));
    const totalPend = pend.reduce((sum, a) => sum + a.attachmentValue, 0);
    const totalBel = bel.reduce((sum, a) => sum + a.attachmentValue, 0);
    const surplusDefisitLRA = totalPend - totalBel;
    return { pend, bel, totalPend, totalBel, surplusDefisitLRA };
  }, [accounts]);

  const summaryNeraca = useMemo(() => {
    const aset = accounts.filter(a => a.category === "NERACA" && a.subCategory.includes("Aset"));
    const kewajiban = accounts.filter(a => a.category === "NERACA" && a.subCategory.includes("Kewajiban"));
    const ekuitas = accounts.filter(a => a.category === "NERACA" && a.subCategory.includes("Ekuitas"));

    const totalAset = aset.reduce((sum, a) => sum + a.attachmentValue, 0);
    const totalKewajiban = kewajiban.reduce((sum, a) => sum + a.attachmentValue, 0);
    const totalEkuitas = ekuitas.reduce((sum, a) => sum + a.attachmentValue, 0);
    const balanceCheck = totalAset - (totalKewajiban + totalEkuitas);
    return { aset, kewajiban, ekuitas, totalAset, totalKewajiban, totalEkuitas, balanceCheck };
  }, [accounts]);

  const summaryLO = useMemo(() => {
    const pendLO = accounts.filter(a => a.category === "LO" && a.subCategory.includes("Pendapatan"));
    const bebanLO = accounts.filter(a => a.category === "LO" && a.subCategory.includes("Beban"));
    const totalPendLO = pendLO.reduce((sum, a) => sum + a.attachmentValue, 0);
    const totalBebanLO = bebanLO.reduce((sum, a) => sum + a.attachmentValue, 0);
    const surplusDefisitLO = totalPendLO - totalBebanLO;
    return { pendLO, bebanLO, totalPendLO, totalBebanLO, surplusDefisitLO };
  }, [accounts]);

  const summaryLPE = useMemo(() => {
    const ekuitasAwal = accounts.find(a => a.code === "3.2.01")?.attachmentValue || 0;
    const surplusLO = accounts.find(a => a.code === "3.2.02")?.attachmentValue || 0;
    const dampakKumulatif = accounts.find(a => a.code === "3.2.03")?.attachmentValue || 0;
    const ekuitasAkhir = accounts.find(a => a.code === "3.2.04")?.attachmentValue || 0;
    return { ekuitasAwal, surplusLO, dampakKumulatif, ekuitasAkhir };
  }, [accounts]);

  // Filtered accounts list
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const matchCategory = selectedTab === "ALL" ? true : acc.category === selectedTab;
      const diff = Math.abs(acc.attachmentValue - acc.reportValue);
      const matchDiscrepancy = filterDiscrepancyOnly ? diff > 0 : true;
      const matchSearch =
        acc.name.toLowerCase().includes(searchAccount.toLowerCase()) ||
        acc.code.includes(searchAccount) ||
        acc.subCategory.toLowerCase().includes(searchAccount.toLowerCase());

      return matchCategory && matchDiscrepancy && matchSearch;
    });
  }, [accounts, selectedTab, filterDiscrepancyOnly, searchAccount]);

  const handlePrintSummary = () => {
    window.print();
  };

  // Generate & Download Comprehensive Microsoft Word / Google Docs (.doc) Document
  const handleDownloadDocs = () => {
    const formattedDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const diffAccounts = accounts.filter(
      (a) => Math.abs(a.attachmentValue - a.reportValue) > 0
    );

    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Laporan Hasil Analisis & Rekonsiliasi - JURNAL LK</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            color: #1e293b;
            line-height: 1.4;
            margin: 20pt;
          }
          h1 {
            font-size: 16pt;
            color: #0f172a;
            text-align: center;
            font-weight: bold;
            margin-bottom: 2pt;
          }
          .header-instansi {
            text-align: center;
            font-size: 11pt;
            font-weight: bold;
            color: #334155;
            letter-spacing: 1px;
            margin-bottom: 3pt;
          }
          .header-sub {
            text-align: center;
            font-size: 10pt;
            color: #64748b;
            margin-bottom: 14pt;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 8pt;
          }
          h2 {
            font-size: 12.5pt;
            color: #1e3a8a;
            border-bottom: 1.5pt solid #2563eb;
            padding-bottom: 3pt;
            margin-top: 14pt;
            margin-bottom: 6pt;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6pt;
            margin-bottom: 12pt;
            font-size: 9.5pt;
          }
          th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: bold;
            border: 1px solid #94a3b8;
            padding: 5pt 7pt;
            text-align: left;
          }
          td {
            border: 1px solid #cbd5e1;
            padding: 5pt 7pt;
            vertical-align: top;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .bg-light { background-color: #f8fafc; }
          .bg-highlight { background-color: #f0fdf4; }
          .badge-balance { color: #16a34a; font-weight: bold; }
          .badge-diff { color: #dc2626; font-weight: bold; }
          .meta-table { width: 100%; border: none; margin-bottom: 12pt; font-size: 10pt; }
          .meta-table td { border: none; padding: 2pt 4pt; }
          .box-callout {
            border: 1px solid #cbd5e1;
            background-color: #f8fafc;
            padding: 8pt 10pt;
            margin-bottom: 12pt;
            border-radius: 4pt;
          }
          .signature-table {
            width: 100%;
            border: none;
            margin-top: 25pt;
            page-break-inside: avoid;
          }
          .signature-table td {
            border: none;
            text-align: center;
            width: 50%;
            vertical-align: top;
            padding: 10pt;
          }
        </style>
      </head>
      <body>
        <div class="header-instansi">SISTEM REKONSILIASI DAN PELAPORAN KEUANGAN TERPADU</div>
        <h1>LAPORAN HASIL ANALISIS & REKONSILIASI LAPORAN KEUANGAN</h1>
        <div class="header-sub">Aplikasi: <strong>JURNAL LK</strong> &bull; Standar Akuntansi Pemerintahan & Standar Akuntansi Keuangan</div>

        <table class="meta-table">
          <tr>
            <td style="width: 25%;"><strong>Periode Pelaporan</strong></td>
            <td style="width: 2%;">:</td>
            <td style="width: 73%;">${reportingPeriod || "(Dikosongkan / Belum Ditetapkan)"}</td>
          </tr>
          <tr>
            <td><strong>Tanggal Cetak / Ekspor</strong></td>
            <td>:</td>
            <td>${formattedDate}</td>
          </tr>
          <tr>
            <td><strong>Berkas Laporan Keuangan</strong></td>
            <td>:</td>
            <td>${simulatedReportFile}</td>
          </tr>
          <tr>
            <td><strong>Berkas Lampiran Neraca</strong></td>
            <td>:</td>
            <td>${simulatedAttachmentFile}</td>
          </tr>
          <tr>
            <td><strong>Status Keseimbangan</strong></td>
            <td>:</td>
            <td><strong>${stats.balancePercentage}% Sesuai</strong> (${stats.totalItems - stats.discrepancies} dari ${stats.totalItems} akun telah klir / balance)</td>
          </tr>
        </table>

        <div class="box-callout">
          <strong>Ringkasan Eksekutif Rekonsiliasi:</strong>
          <table style="margin-top: 6pt; margin-bottom: 0;">
            <tr style="background-color: #f1f5f9;">
              <th class="text-center">Total Akun Dianalisis</th>
              <th class="text-center">Tingkat Kesesuaian (Balance)</th>
              <th class="text-center">Akun Berselisih</th>
              <th class="text-center">Total Nominal Varians</th>
            </tr>
            <tr>
              <td class="text-center font-bold">${stats.totalItems} Akun</td>
              <td class="text-center font-bold" style="color: #16a34a;">${stats.balancePercentage}%</td>
              <td class="text-center font-bold" style="color: ${stats.discrepancies > 0 ? '#dc2626' : '#16a34a'};">${stats.discrepancies} Akun</td>
              <td class="text-center font-bold" style="color: #d97706;">${formatRupiah(stats.totalDifferenceNominal)}</td>
            </tr>
          </table>
        </div>

        <h2>1. Ringkasan Laporan Realisasi Anggaran (LRA)</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 15%;">Kode Akun</th>
              <th style="width: 55%;">Uraian Akun Realisasi Anggaran</th>
              <th style="width: 30%; text-align: right;">Nilai Realisasi (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-light">
              <td colspan="3" class="font-bold">A. PENDAPATAN</td>
            </tr>
            ${summaryLRA.pend.map(a => `
              <tr>
                <td>${a.code}</td>
                <td>${a.name}</td>
                <td class="text-right">${formatRupiah(a.attachmentValue)}</td>
              </tr>
            `).join('')}
            <tr class="bg-light font-bold">
              <td colspan="2" class="text-right">Total Pendapatan:</td>
              <td class="text-right">${formatRupiah(summaryLRA.totalPend)}</td>
            </tr>
            <tr class="bg-light">
              <td colspan="3" class="font-bold">B. BELANJA</td>
            </tr>
            ${summaryLRA.bel.map(a => `
              <tr>
                <td>${a.code}</td>
                <td>${a.name}</td>
                <td class="text-right">${formatRupiah(a.attachmentValue)}</td>
              </tr>
            `).join('')}
            <tr class="bg-light font-bold">
              <td colspan="2" class="text-right">Total Belanja:</td>
              <td class="text-right">${formatRupiah(summaryLRA.totalBel)}</td>
            </tr>
            <tr class="bg-highlight font-bold" style="font-size: 10pt;">
              <td colspan="2" class="text-right">SURPLUS / (DEFISIT) LRA:</td>
              <td class="text-right">${formatRupiah(summaryLRA.surplusDefisitLRA)}</td>
            </tr>
          </tbody>
        </table>

        <h2>2. Ringkasan Neraca</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 15%;">Kode Akun</th>
              <th style="width: 55%;">Uraian Pos Neraca</th>
              <th style="width: 30%; text-align: right;">Nilai Buku (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-light"><td colspan="3" class="font-bold">A. ASET</td></tr>
            ${summaryNeraca.aset.map(a => `
              <tr>
                <td>${a.code}</td>
                <td>${a.name}</td>
                <td class="text-right">${formatRupiah(a.attachmentValue)}</td>
              </tr>
            `).join('')}
            <tr class="bg-light font-bold">
              <td colspan="2" class="text-right">TOTAL ASET:</td>
              <td class="text-right">${formatRupiah(summaryNeraca.totalAset)}</td>
            </tr>
            <tr class="bg-light"><td colspan="3" class="font-bold">B. KEWAJIBAN</td></tr>
            ${summaryNeraca.kewajiban.map(a => `
              <tr>
                <td>${a.code}</td>
                <td>${a.name}</td>
                <td class="text-right">${formatRupiah(a.attachmentValue)}</td>
              </tr>
            `).join('')}
            <tr class="bg-light font-bold">
              <td colspan="2" class="text-right">TOTAL KEWAJIBAN:</td>
              <td class="text-right">${formatRupiah(summaryNeraca.totalKewajiban)}</td>
            </tr>
            <tr class="bg-light"><td colspan="3" class="font-bold">C. EKUITAS</td></tr>
            ${summaryNeraca.ekuitas.map(a => `
              <tr>
                <td>${a.code}</td>
                <td>${a.name}</td>
                <td class="text-right">${formatRupiah(a.attachmentValue)}</td>
              </tr>
            `).join('')}
            <tr class="bg-light font-bold">
              <td colspan="2" class="text-right">TOTAL EKUITAS:</td>
              <td class="text-right">${formatRupiah(summaryNeraca.totalEkuitas)}</td>
            </tr>
            <tr class="bg-highlight font-bold" style="font-size: 10pt;">
              <td colspan="2" class="text-right">TOTAL KEWAJIBAN & EKUITAS:</td>
              <td class="text-right">${formatRupiah(summaryNeraca.totalKewajiban + summaryNeraca.totalEkuitas)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: center; font-style: italic; color: ${summaryNeraca.balanceCheck === 0 ? '#16a34a' : '#dc2626'}; font-weight: bold;">
                Status Persamaan Neraca: ${summaryNeraca.balanceCheck === 0 ? 'SEIMBANG (ASET = KEWAJIBAN + EKUITAS)' : `TIDAK SEIMBANG (Selisih: ${formatRupiah(summaryNeraca.balanceCheck)})`}
              </td>
            </tr>
          </tbody>
        </table>

        <h2>3. Ringkasan Laporan Operasional (LO)</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 15%;">Kode Akun</th>
              <th style="width: 55%;">Uraian Akun Operasional</th>
              <th style="width: 30%; text-align: right;">Nilai Operasional (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-light"><td colspan="3" class="font-bold">A. PENDAPATAN OPERASIONAL (LO)</td></tr>
            ${summaryLO.pendLO.map(a => `
              <tr>
                <td>${a.code}</td>
                <td>${a.name}</td>
                <td class="text-right">${formatRupiah(a.attachmentValue)}</td>
              </tr>
            `).join('')}
            <tr class="bg-light font-bold">
              <td colspan="2" class="text-right">Total Pendapatan-LO:</td>
              <td class="text-right">${formatRupiah(summaryLO.totalPendLO)}</td>
            </tr>
            <tr class="bg-light"><td colspan="3" class="font-bold">B. BEBAN OPERASIONAL (LO)</td></tr>
            ${summaryLO.bebanLO.map(a => `
              <tr>
                <td>${a.code}</td>
                <td>${a.name}</td>
                <td class="text-right">${formatRupiah(a.attachmentValue)}</td>
              </tr>
            `).join('')}
            <tr class="bg-light font-bold">
              <td colspan="2" class="text-right">Total Beban-LO:</td>
              <td class="text-right">${formatRupiah(summaryLO.totalBebanLO)}</td>
            </tr>
            <tr class="bg-highlight font-bold" style="font-size: 10pt;">
              <td colspan="2" class="text-right">SURPLUS / (DEFISIT) LO:</td>
              <td class="text-right">${formatRupiah(summaryLO.surplusDefisitLO)}</td>
            </tr>
          </tbody>
        </table>

        <h2>4. Ringkasan Laporan Perubahan Ekuitas (LPE)</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 15%;">Kode Akun</th>
              <th style="width: 55%;">Uraian Perubahan Ekuitas</th>
              <th style="width: 30%; text-align: right;">Jumlah (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3.2.01</td>
              <td>Ekuitas Awal</td>
              <td class="text-right">${formatRupiah(summaryLPE.ekuitasAwal)}</td>
            </tr>
            <tr>
              <td>3.2.02</td>
              <td>Surplus / (Defisit) Laporan Operasional (LO)</td>
              <td class="text-right">${formatRupiah(summaryLPE.surplusLO)}</td>
            </tr>
            <tr>
              <td>3.2.03</td>
              <td>Dampak Kumulatif Perubahan Kebijakan / Koreksi Kesalahan</td>
              <td class="text-right">${formatRupiah(summaryLPE.dampakKumulatif)}</td>
            </tr>
            <tr class="bg-highlight font-bold" style="font-size: 10pt;">
              <td>3.2.04</td>
              <td>EKUITAS AKHIR (Tercatat di Neraca)</td>
              <td class="text-right">${formatRupiah(summaryLPE.ekuitasAkhir)}</td>
            </tr>
          </tbody>
        </table>

        <h2>5. Rincian Selisih Akun & Usulan Jurnal Penyesuaian</h2>
        ${diffAccounts.length === 0 ? `
          <p style="color: #16a34a; font-weight: bold; background-color: #f0fdf4; padding: 10pt; border: 1px solid #bbf7d0;">
            Seluruh saldo akun Lampiran Neraca cocok 100% dengan Laporan Keuangan (Nihil Selisih). Tidak diperlukan ayat jurnal penyesuaian.
          </p>
        ` : `
          <table>
            <thead>
              <tr style="background-color: #fee2e2;">
                <th style="width: 10%;">Kode</th>
                <th style="width: 25%;">Nama Akun</th>
                <th style="width: 18%; text-align: right;">Nilai Laporan (Rp)</th>
                <th style="width: 18%; text-align: right;">Nilai Lampiran (Rp)</th>
                <th style="width: 14%; text-align: right;">Selisih (Rp)</th>
                <th style="width: 15%;">Catatan & Usulan Jurnal</th>
              </tr>
            </thead>
            <tbody>
              ${diffAccounts.map(a => {
                const diff = a.attachmentValue - a.reportValue;
                return `
                  <tr>
                    <td><strong>${a.code}</strong></td>
                    <td>${a.name} <br><small style="color: #64748b;">(${a.category} - ${a.subCategory})</small></td>
                    <td class="text-right">${formatRupiah(a.reportValue)}</td>
                    <td class="text-right">${formatRupiah(a.attachmentValue)}</td>
                    <td class="text-right badge-diff">${formatRupiah(diff)}</td>
                    <td>
                      <small><strong>Temuan:</strong> ${a.notes || 'Selisih saldo'}</small><br>
                      ${a.adjustmentJournal ? `
                        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 4pt; margin-top: 3pt; font-size: 8pt;">
                          (D) ${a.adjustmentJournal.debitAccount}: ${formatRupiah(a.adjustmentJournal.amount)}<br>
                          (K) ${a.adjustmentJournal.creditAccount}: ${formatRupiah(a.adjustmentJournal.amount)}
                        </div>
                      ` : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `}

        <table class="signature-table">
          <tr>
            <td>
              Mengetahui,<br>
              <strong>Pejabat Pembuat Komitmen / PPK-SKPD</strong>
              <br><br><br><br><br>
              _____________________________________<br>
              NIP / Identitas Pegawai
            </td>
            <td>
              Diverifikasi dan Disusun Oleh,<br>
              <strong>Tim Rekonsiliasi & Pelaporan Keuangan</strong>
              <br><br><br><br><br>
              _____________________________________<br>
              Sistem JURNAL LK
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + docHtml], {
      type: "application/msword;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const sanitizedPeriod = reportingPeriod
      ? reportingPeriod.replace(/[^a-zA-Z0-9]/g, "_")
      : "Draft";
    link.href = url;
    link.download = `JURNAL_LK_Laporan_Rekonsiliasi_${sanitizedPeriod}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification("Dokumen Laporan (.doc) berhasil diunduh!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-indigo-500/50 flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. HERO HEADER: NAMA APLIKASI & PERIOD CONFIGURATOR */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Brand & Name */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                ENTERPRISE RECONCILIATION SUITE
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sistem Siap Operasi
              </span>
            </div>

            {/* Prominent Application Name */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  JURNAL <span className="text-indigo-400 font-light">LK</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Sistem Analisis & Penyusunan Laporan Keuangan Terpadu
                </p>
              </div>
            </div>

            {/* Period Indicator & Editor */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400">Periode Pelaporan:</span>
                {reportingPeriod ? (
                  <strong className="text-emerald-400 font-bold">{reportingPeriod}</strong>
                ) : (
                  <span className="text-amber-400/90 font-medium italic">
                    (Kosong / Belum Ditentukan)
                  </span>
                )}
              </div>

              {!isEditingPeriod ? (
                <button
                  onClick={() => {
                    setCustomPeriodInput(reportingPeriod);
                    setIsEditingPeriod(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition text-[11px] flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3 text-indigo-400" />
                  {reportingPeriod ? "Ubah Periode" : "Atur / Kosongkan Periode"}
                </button>
              ) : null}

              {reportingPeriod ? (
                <button
                  onClick={handleClearPeriod}
                  className="px-2 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition text-[11px] flex items-center gap-1"
                  title="Kosongkan Periode"
                >
                  <X className="w-3 h-3" />
                  Kosongkan
                </button>
              ) : null}
            </div>

            {/* Inline Period Editor popover / bar */}
            {isEditingPeriod && (
              <div className="mt-2 p-3 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-2 max-w-lg shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    Pengaturan Periode Pelaporan
                  </span>
                  <button
                    onClick={() => setIsEditingPeriod(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPeriodInput}
                    onChange={(e) => setCustomPeriodInput(e.target.value)}
                    placeholder="Ketik periode (contoh: Semester I 2026 / Triwulan II) atau biarkan kosong"
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSavePeriod}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
                  >
                    Terapkan
                  </button>
                  <button
                    onClick={handleClearPeriod}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 transition"
                  >
                    Kosongkan
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 self-center">Preset Cepat:</span>
                  {[
                    "Semester I 2026",
                    "Semester II 2026",
                    "Tahunan 2026",
                    "Triwulan I 2026"
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomPeriodInput(preset)}
                      className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-indigo-900/40 text-[10px] text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Download Docs Button after analysis is completed */}
            {analysisCompleted && (
              <button
                onClick={handleDownloadDocs}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30"
                title="Unduh Dokumen Laporan Hasil Rekonsiliasi (.doc / Word / Google Docs)"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Docs</span>
              </button>
            )}

            <button
              onClick={handleSimulateUpload}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? "animate-spin" : ""}`} />
              Analisis Ulang Sampel
            </button>

            <button
              onClick={handleResetData}
              className="px-4 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              Rekonsiliasi Seimbang
            </button>

            <button
              onClick={handlePrintSummary}
              className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
              title="Cetak Laporan / Ringkasan"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Upload progress bar */}
        {uploadProgress !== null && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-[11px] text-indigo-300 font-medium">
              <span>Mengekstraksi & Memverifikasi Nilai Akun...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. DUAL FILE UPLOAD WORKFLOW ZONE */}
      <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              1. Modul Pengunggahan Berkas Masukan (Dual Upload Input)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unggah berkas resmi <strong>"Laporan Keuangan"</strong> dan dokumen <strong>"Lampiran Neraca"</strong> (Excel/CSV/PDF).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" /> 2 Berkas Terverifikasi
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Laporan Keuangan */}
          <div className="relative group p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition shadow-inner">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-105 transition shrink-0">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Dokumen Pelaporan Resmi
                  </span>
                  <label className="cursor-pointer text-[11px] font-medium text-indigo-400 hover:text-indigo-300 underline">
                    Ganti File
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls,.csv,.pdf"
                      onChange={(e) => handleManualFileUpload(e, "REPORT")}
                    />
                  </label>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">Laporan Keuangan</h3>
                <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> {simulatedReportFile}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Memuat tabel induk LRA, Neraca, LO, dan LPE yang akan diperbarui nilainya oleh sistem setelah rekonsiliasi.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Excel (.xlsx)</span>
                  <span>1.4 MB</span>
                  <span>• Status: Siap Disinkronkan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Lampiran Neraca (Data to be analyzed) */}
          <div className="relative group p-5 rounded-2xl bg-slate-950/70 border-2 border-indigo-500/40 hover:border-indigo-400 transition shadow-lg shadow-indigo-950/30">
            <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider">
              Sumber Analisis Utama
            </div>
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition shrink-0">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between pr-24">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    Buku Besar Pembantu
                  </span>
                  <label className="cursor-pointer text-[11px] font-medium text-indigo-400 hover:text-indigo-300 underline">
                    Ganti File
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls,.csv,.pdf"
                      onChange={(e) => handleManualFileUpload(e, "ATTACHMENT")}
                    />
                  </label>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">Lampiran Neraca (Rincian Akun)</h3>
                <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> {simulatedAttachmentFile}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Data yang diekstraksi dan dianalisis untuk mendeteksi selisih angka dan dipindahkan ke Ringkasan Laporan Keuangan.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Excel (.xlsx)</span>
                  <span>2.8 MB</span>
                  <span>• {stats.totalItems} Rekening Buku Besar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POST-ANALYSIS STATUS & DOWNLOAD DOCS BANNER */}
      {analysisCompleted && !isProcessing && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">Analisis Data Selesai & Terverifikasi</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Docs Siap Diunduh
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Data Lampiran Neraca telah dicocokkan ke 4 Laporan Keuangan ({stats.totalItems} akun). Hasil analisis dan ringkasan siap diekspor ke dokumen Word / Google Docs.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadDocs}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Docs</span>
          </button>
        </div>
      )}

      {/* 3. EXECUTIVE KPI METRICS & RECONCILIATION HEALTH BAR */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* KPI 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Akun Dianalisis</span>
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {stats.totalItems} <span className="text-xs font-normal text-slate-400">akun</span>
            </div>
            <div className="text-[11px] text-indigo-300 mt-1 font-medium">LRA, Neraca, LO, LPE</div>
          </div>

          {/* KPI 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Kesesuaian Nilai (Balance)</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {stats.balancePercentage}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.totalItems - stats.discrepancies} dari {stats.totalItems} akun klir
            </div>
          </div>

          {/* KPI 3 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Akun Terdapat Selisih</span>
              <AlertTriangle className={`w-3.5 h-3.5 ${stats.discrepancies > 0 ? "text-rose-400" : "text-emerald-400"}`} />
            </div>
            <div className={`text-xl sm:text-2xl font-black mt-1 ${stats.discrepancies > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {stats.discrepancies} <span className="text-xs font-normal text-slate-400">akun</span>
            </div>
            <div className="text-[11px] text-rose-400 mt-1 font-medium">
              {stats.discrepancies > 0 ? "Perlu Jurnal Penyesuaian" : "Nihil Selisih"}
            </div>
          </div>

          {/* KPI 4 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Nominal Selisih</span>
              <Scale className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-400 mt-1 truncate">
              {formatRupiah(stats.totalDifferenceNominal)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Varians Lampiran vs Laporan</div>
          </div>
        </div>

        {/* Visual Stacked Progress Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Status Rekonsiliasi Dokumen:</span>
            <span className="text-emerald-400 font-bold">{stats.balancePercentage}% Sesuai</span>
            {stats.discrepancies > 0 && (
              <span className="text-rose-400 font-semibold">• {100 - stats.balancePercentage}% Terdapat Selisih</span>
            )}
          </div>
          <div className="flex-1 max-w-md h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${stats.balancePercentage}%` }}
              title={`Sesuai: ${stats.balancePercentage}%`}
            />
            {stats.discrepancies > 0 && (
              <div
                className="bg-rose-500 h-full transition-all duration-500 animate-pulse"
                style={{ width: `${100 - stats.balancePercentage}%` }}
                title={`Selisih: ${100 - stats.balancePercentage}%`}
              />
            )}
          </div>
        </div>
      </div>

      {/* 4. MAIN NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
          <button
            onClick={() => setSelectedTab("SUMMARY")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              selectedTab === "SUMMARY"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Ringkasan Laporan Keuangan</span>
          </button>

          <button
            onClick={() => setSelectedTab("ALL")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedTab === "ALL"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Semua Akun Rekonsiliasi ({stats.totalItems})
          </button>

          <button
            onClick={() => setSelectedTab("LRA")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedTab === "LRA"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            LRA ({stats.lraCount})
          </button>

          <button
            onClick={() => setSelectedTab("NERACA")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedTab === "NERACA"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Neraca ({stats.neracaCount})
          </button>

          <button
            onClick={() => setSelectedTab("LO")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedTab === "LO"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            LO ({stats.loCount})
          </button>

          <button
            onClick={() => setSelectedTab("LPE")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedTab === "LPE"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            LPE ({stats.lpeCount})
          </button>
        </div>

        {/* Filter Discrepancies Checkbox */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <input
              type="checkbox"
              checked={filterDiscrepancyOnly}
              onChange={(e) => setFilterDiscrepancyOnly(e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
            />
            <span className={filterDiscrepancyOnly ? "text-rose-400 font-bold" : ""}>
              Hanya Akun Berselisih ({stats.discrepancies})
            </span>
          </label>
        </div>
      </div>

      {/* 5. VIEW TAB: "RINGKASAN LAPORAN KEUANGAN" (THE CORE USER DELIVERABLE) */}
      {selectedTab === "SUMMARY" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {/* Header of Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Konsolidasi Hasil Analisis Lampiran Neraca
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Ringkasan Laporan Keuangan {reportingPeriod ? `— ${reportingPeriod}` : ""}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Data telah dipindahkan dan disinkronisasikan secara otomatis dari rincian akun <strong>Lampiran Neraca</strong> ke dalam 4 format laporan keuangan utama.
                </p>
                {/* Notice regarding empty period */}
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Periode Pelaporan:</span>
                  {reportingPeriod ? (
                    <span className="text-white font-semibold">{reportingPeriod}</span>
                  ) : (
                    <span className="text-amber-400/90 italic font-mono">[ Dikosongkan / Belum Ditetapkan ]</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadDocs}
                  className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                  title="Unduh format Microsoft Word / Google Docs (.doc)"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Docs</span>
                </button>
                <span className="px-3 py-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4" /> Sinkronisasi 4 Laporan Klir
                </span>
              </div>
            </div>

            {/* The 4 Consolidated Financial Statement Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CARD 1: LRA */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">1. Ringkasan Realisasi Anggaran (LRA)</h3>
                      <p className="text-[11px] text-slate-400">
                        {reportingPeriod ? `Periode ${reportingPeriod}` : "Periode: (Belum Ditentukan)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTab("LRA")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    Rincian <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Realisasi Pendapatan:</span>
                    <span className="font-semibold text-white font-mono">{formatRupiah(summaryLRA.totalPend)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Realisasi Belanja & Transfer:</span>
                    <span className="font-semibold text-slate-200 font-mono">{formatRupiah(summaryLRA.totalBel)}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-slate-900/90 px-3.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-indigo-300">Surplus / (Defisit) LRA:</span>
                    <span className="font-bold text-emerald-400 font-mono">{formatRupiah(summaryLRA.surplusDefisitLRA)}</span>
                  </div>
                </div>

                {/* Collapsible item breakdown toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedSummaryCard(expandedSummaryCard === "LRA" ? null : "LRA")}
                  className="w-full text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-between pt-1 border-t border-slate-800/50"
                >
                  <span>{expandedSummaryCard === "LRA" ? "Sembunyikan Rincian Akun" : "Lihat Akun Pembentuk LRA"}</span>
                  {expandedSummaryCard === "LRA" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedSummaryCard === "LRA" && (
                  <div className="pt-2 space-y-1.5 text-[11px] bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    {accounts.filter(a => a.category === "LRA").map(acc => (
                      <div key={acc.code} className="flex justify-between py-0.5 border-b border-slate-800/40 last:border-0">
                        <span className="text-slate-400 truncate max-w-[200px]">{acc.name}</span>
                        <span className="font-mono text-slate-300">{formatRupiah(acc.attachmentValue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CARD 2: NERACA */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">2. Ringkasan Neraca</h3>
                      <p className="text-[11px] text-slate-400">
                        {reportingPeriod ? `Posisi per ${reportingPeriod}` : "Posisi Tanggal Neraca: (Belum Ditentukan)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTab("NERACA")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    Rincian <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Total Aset (Lancar + Tetap - Akumulasi):</span>
                    <span className="font-semibold text-white font-mono">{formatRupiah(summaryNeraca.totalAset)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Total Kewajiban:</span>
                    <span className="font-semibold text-slate-200 font-mono">{formatRupiah(summaryNeraca.totalKewajiban)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Total Ekuitas:</span>
                    <span className="font-semibold text-slate-200 font-mono">{formatRupiah(summaryNeraca.totalEkuitas)}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-slate-900/90 px-3.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-indigo-300">Keseimbangan Neraca (Aset - (K+E)):</span>
                    <span className={`font-bold font-mono ${summaryNeraca.balanceCheck === 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {summaryNeraca.balanceCheck === 0 ? "SEIMBANG (Rp 0)" : formatRupiah(summaryNeraca.balanceCheck)}
                    </span>
                  </div>
                </div>

                {/* Collapsible item breakdown toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedSummaryCard(expandedSummaryCard === "NERACA" ? null : "NERACA")}
                  className="w-full text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-between pt-1 border-t border-slate-800/50"
                >
                  <span>{expandedSummaryCard === "NERACA" ? "Sembunyikan Rincian Akun" : "Lihat Akun Pembentuk Neraca"}</span>
                  {expandedSummaryCard === "NERACA" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedSummaryCard === "NERACA" && (
                  <div className="pt-2 space-y-1.5 text-[11px] bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    {accounts.filter(a => a.category === "NERACA").map(acc => (
                      <div key={acc.code} className="flex justify-between py-0.5 border-b border-slate-800/40 last:border-0">
                        <span className="text-slate-400 truncate max-w-[200px]">{acc.name}</span>
                        <span className="font-mono text-slate-300">{formatRupiah(acc.attachmentValue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CARD 3: LO */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">3. Ringkasan Laporan Operasional (LO)</h3>
                      <p className="text-[11px] text-slate-400">
                        {reportingPeriod ? `Berbasis Akrual (${reportingPeriod})` : "Berbasis Akrual"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTab("LO")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    Rincian <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Pendapatan-LO:</span>
                    <span className="font-semibold text-white font-mono">{formatRupiah(summaryLO.totalPendLO)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Beban Operasional:</span>
                    <span className="font-semibold text-slate-200 font-mono">{formatRupiah(summaryLO.totalBebanLO)}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-slate-900/90 px-3.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-indigo-300">Surplus / (Defisit) Operasional LO:</span>
                    <span className="font-bold text-amber-400 font-mono">{formatRupiah(summaryLO.surplusDefisitLO)}</span>
                  </div>
                </div>

                {/* Collapsible item breakdown toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedSummaryCard(expandedSummaryCard === "LO" ? null : "LO")}
                  className="w-full text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-between pt-1 border-t border-slate-800/50"
                >
                  <span>{expandedSummaryCard === "LO" ? "Sembunyikan Rincian Akun" : "Lihat Akun Pembentuk LO"}</span>
                  {expandedSummaryCard === "LO" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedSummaryCard === "LO" && (
                  <div className="pt-2 space-y-1.5 text-[11px] bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    {accounts.filter(a => a.category === "LO").map(acc => (
                      <div key={acc.code} className="flex justify-between py-0.5 border-b border-slate-800/40 last:border-0">
                        <span className="text-slate-400 truncate max-w-[200px]">{acc.name}</span>
                        <span className="font-mono text-slate-300">{formatRupiah(acc.attachmentValue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CARD 4: LPE */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">4. Ringkasan Perubahan Ekuitas (LPE)</h3>
                      <p className="text-[11px] text-slate-400">
                        {reportingPeriod ? `Posisi per ${reportingPeriod}` : "Posisi Akhir Periode"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTab("LPE")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    Rincian <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Ekuitas Awal:</span>
                    <span className="font-semibold text-white font-mono">{formatRupiah(summaryLPE.ekuitasAwal)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Surplus / (Defisit) LO:</span>
                    <span className="font-semibold text-slate-200 font-mono">{formatRupiah(summaryLPE.surplusLO)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Dampak Kumulatif Koreksi:</span>
                    <span className="font-semibold text-slate-200 font-mono">{formatRupiah(summaryLPE.dampakKumulatif)}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-slate-900/90 px-3.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-indigo-300">Ekuitas Akhir:</span>
                    <span className="font-bold text-emerald-400 font-mono">{formatRupiah(summaryLPE.ekuitasAkhir)}</span>
                  </div>
                </div>

                {/* Collapsible item breakdown toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedSummaryCard(expandedSummaryCard === "LPE" ? null : "LPE")}
                  className="w-full text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-between pt-1 border-t border-slate-800/50"
                >
                  <span>{expandedSummaryCard === "LPE" ? "Sembunyikan Rincian Akun" : "Lihat Akun Pembentuk LPE"}</span>
                  {expandedSummaryCard === "LPE" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedSummaryCard === "LPE" && (
                  <div className="pt-2 space-y-1.5 text-[11px] bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    {accounts.filter(a => a.category === "LPE").map(acc => (
                      <div key={acc.code} className="flex justify-between py-0.5 border-b border-slate-800/40 last:border-0">
                        <span className="text-slate-400 truncate max-w-[200px]">{acc.name}</span>
                        <span className="font-mono text-slate-300">{formatRupiah(acc.attachmentValue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cross-Statement Mathematical Verification Box */}
            <div className="mt-8 p-6 rounded-3xl bg-indigo-950/40 border border-indigo-800/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Validasi Keterkaitan Antar-Laporan (Financial Statement Articulation)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-400 mb-1 font-medium">LO ➔ LPE:</div>
                  <div className="font-semibold text-white">Surplus/Defisit Operasional</div>
                  <div className="text-emerald-400 font-mono text-[11px] mt-1.5">
                    LO: {formatRupiah(summaryLO.surplusDefisitLO)} = LPE: {formatRupiah(summaryLPE.surplusLO)}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-400 mb-1 font-medium">LPE ➔ Neraca:</div>
                  <div className="font-semibold text-white">Ekuitas Akhir vs Ekuitas Neraca</div>
                  <div className="text-emerald-400 font-mono text-[11px] mt-1.5">
                    LPE: {formatRupiah(summaryLPE.ekuitasAkhir)} = Neraca: {formatRupiah(summaryNeraca.totalEkuitas)}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-400 mb-1 font-medium">LRA ➔ Neraca:</div>
                  <div className="font-semibold text-white">Konfirmasi Kas & SiLPA</div>
                  <div className="text-indigo-300 font-mono text-[11px] mt-1.5">
                    Tervalidasi Sesuai Rekonsiliasi Kas Daerah
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW TAB: DETAILED ACCOUNTS TABLE & VARIANCE ANALYSIS */}
      {selectedTab !== "SUMMARY" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Daftar Analisis Selisih Akun ({selectedTab === "ALL" ? "Semua Komponen Akun" : `Komponen ${selectedTab}`})
              </h3>
              <p className="text-xs text-slate-400">
                Membandingkan nilai di <strong>Laporan Keuangan</strong> terhadap rincian <strong>Lampiran Neraca</strong>.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchAccount}
                onChange={(e) => setSearchAccount(e.target.value)}
                placeholder="Cari kode atau nama akun..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Kode Akun</th>
                  <th className="py-3.5 px-4">Uraian Nama Akun</th>
                  <th className="py-3.5 px-4">Pos Laporan</th>
                  <th className="py-3.5 px-4 text-right">Nilai Laporan Keuangan</th>
                  <th className="py-3.5 px-4 text-right">Nilai Lampiran Neraca</th>
                  <th className="py-3.5 px-4 text-right">Selisih (Varians)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi / Jurnal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredAccounts.map((acc) => {
                  const diff = acc.attachmentValue - acc.reportValue;
                  const hasDiff = Math.abs(diff) > 0;

                  return (
                    <tr
                      key={acc.code}
                      className={`hover:bg-slate-800/40 transition ${
                        hasDiff ? "bg-rose-950/10" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-indigo-300 font-mono">{acc.code}</td>
                      <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                        <div>{acc.name}</div>
                        {acc.notes && (
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-sm" title={acc.notes}>
                            {acc.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-semibold">
                          {acc.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-300">
                        {formatRupiah(acc.reportValue)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        {formatRupiah(acc.attachmentValue)}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-bold ${
                          hasDiff ? "text-rose-400" : "text-slate-500"
                        }`}
                      >
                        {hasDiff ? formatRupiah(diff) : "Rp 0"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-sans">
                        {hasDiff ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <AlertTriangle className="w-3 h-3" /> Selisih
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Sesuai
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-sans">
                        <button
                          onClick={() => setSelectedAccountForDetail(acc)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-[11px] font-medium transition flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3 h-3" /> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. MODAL: JURNAL PENYESUAIAN & AUDIT DETAIL */}
      {selectedAccountForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Rekomendasi Auditor & Analisis Selisih
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  [{selectedAccountForDetail.code}] {selectedAccountForDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAccountForDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Nilai di Laporan:</span>
                <div className="text-sm font-mono font-bold text-white mt-0.5">
                  {formatRupiah(selectedAccountForDetail.reportValue)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Nilai Lampiran Neraca:</span>
                <div className="text-sm font-mono font-bold text-indigo-300 mt-0.5">
                  {formatRupiah(selectedAccountForDetail.attachmentValue)}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Selisih Bersih (Varians):</span>
                <span className="font-mono font-bold text-rose-400">
                  {formatRupiah(selectedAccountForDetail.attachmentValue - selectedAccountForDetail.reportValue)}
                </span>
              </div>
              <div className="text-slate-400 text-[11px] pt-1">
                <strong>Catatan Audit:</strong> {selectedAccountForDetail.notes || "Tidak ada catatan khusus."}
              </div>
            </div>

            {/* Proposed Journal Adjustment Entry */}
            {Math.abs(selectedAccountForDetail.attachmentValue - selectedAccountForDetail.reportValue) > 0 && (
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 space-y-2 text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" /> Usulan Jurnal Penyesuaian (Rekonsiliasi)
                </span>
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>(D) Akun Terkait / Beban / Penyesuaian</span>
                    <span>{formatRupiah(Math.abs(selectedAccountForDetail.attachmentValue - selectedAccountForDetail.reportValue))}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pl-4">
                    <span>(K) {selectedAccountForDetail.name}</span>
                    <span>{formatRupiah(Math.abs(selectedAccountForDetail.attachmentValue - selectedAccountForDetail.reportValue))}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  *Setelah jurnal diposting, nilai akun pada Laporan Keuangan akan sinkron 100% dengan Lampiran Neraca.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedAccountForDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const updatedAccounts = accounts.map(a =>
                    a.code === selectedAccountForDetail.code
                      ? { ...a, attachmentValue: a.reportValue, notes: "Telah disesuaikan oleh Auditor." }
                      : a
                  );
                  setAccounts(updatedAccounts);
                  setSelectedAccountForDetail(null);
                  showNotification(`Akun ${selectedAccountForDetail.code} berhasil diselaraskan.`);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                Sesuaikan Nilai (Tandai Klir)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
