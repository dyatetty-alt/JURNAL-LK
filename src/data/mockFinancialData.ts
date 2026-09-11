export interface FinancialAccount {
  code: string;
  name: string;
  category: "LRA" | "NERACA" | "LO" | "LPE";
  subCategory: string;
  reportValue: number; // Nilai di Laporan Keuangan
  attachmentValue: number; // Nilai di Lampiran Neraca
  notes?: string;
}

export interface StatementSummary {
  title: string;
  code: string;
  totalReport: number;
  totalAttachment: number;
  difference: number;
  itemsCount: number;
  discrepanciesCount: number;
  status: "BALANCE" | "VARIANCE";
}

export const INITIAL_ACCOUNTS: FinancialAccount[] = [
  // 1. LAPORAN REALISASI ANGGARAN (LRA)
  {
    code: "4.1.01",
    name: "Pendapatan Asli Daerah / Usaha",
    category: "LRA",
    subCategory: "Pendapatan",
    reportValue: 4850000000,
    attachmentValue: 4850000000,
    notes: "Sesuai dengan STS dan rekening koran bendahara penerimaan."
  },
  {
    code: "4.2.01",
    name: "Pendapatan Transfer / Alokasi Pusat",
    category: "LRA",
    subCategory: "Pendapatan",
    reportValue: 12500000000,
    attachmentValue: 12500000000,
    notes: "Telah dikonfirmasi dengan nota transfer Kas Negara."
  },
  {
    code: "5.1.01",
    name: "Belanja Pegawai (Gaji & Tunjangan)",
    category: "LRA",
    subCategory: "Belanja Operasi",
    reportValue: 6200000000,
    attachmentValue: 6200000000,
    notes: "Realisasi sesuai dengan alokasi DPA."
  },
  {
    code: "5.1.02",
    name: "Belanja Barang dan Jasa",
    category: "LRA",
    subCategory: "Belanja Operasi",
    reportValue: 3450000000,
    attachmentValue: 3475000000, // Selisih 25.000.000
    notes: "Terdapat selisih Rp 25.000.000 (SP2D LS belum terinput di Laporan Keuangan)."
  },
  {
    code: "5.2.01",
    name: "Belanja Modal Peralatan & Mesin",
    category: "LRA",
    subCategory: "Belanja Modal",
    reportValue: 1850000000,
    attachmentValue: 1850000000,
    notes: "Pengadaan server dan unit infrastruktur komputer."
  },

  // 2. NERACA
  {
    code: "1.1.01",
    name: "Kas dan Setara Kas di Bendahara Pengeluaran",
    category: "NERACA",
    subCategory: "Aset Lancar",
    reportValue: 185000000,
    attachmentValue: 185000000,
    notes: "Saldo kas fisik sesuai dengan Berita Acara Pemeriksaan Kas (BAP Kas)."
  },
  {
    code: "1.1.02",
    name: "Kas di Kas Daerah / Bank Operasional",
    category: "NERACA",
    subCategory: "Aset Lancar",
    reportValue: 5840000000,
    attachmentValue: 5840000000,
    notes: "Hasil rekonsiliasi bank klir tanpa outstanding check."
  },
  {
    code: "1.1.05",
    name: "Persediaan Perlengkapan Kantor & Medis",
    category: "NERACA",
    subCategory: "Aset Lancar",
    reportValue: 420000000,
    attachmentValue: 450000000, // Selisih 30.000.000
    notes: "Terdapat selisih Rp 30.000.000 hasil opname fisik yang belum dijurnal penyesuaian."
  },
  {
    code: "1.3.01",
    name: "Aset Tetap - Tanah dan Bangunan",
    category: "NERACA",
    subCategory: "Aset Tetap",
    reportValue: 45200000000,
    attachmentValue: 45200000000,
    notes: "Tercatat di KIB A dan KIB C."
  },
  {
    code: "1.3.02",
    name: "Aset Tetap - Peralatan dan Mesin",
    category: "NERACA",
    subCategory: "Aset Tetap",
    reportValue: 14850000000,
    attachmentValue: 14850000000,
    notes: "Kapitalisasi belanja modal aset tetap."
  },
  {
    code: "1.3.07",
    name: "Akumulasi Penyusutan Aset Tetap",
    category: "NERACA",
    subCategory: "Aset Tetap",
    reportValue: -5600000000,
    attachmentValue: -5600000000,
    notes: "Beban akumulasi penyusutan metode garis lurus."
  },
  {
    code: "2.1.01",
    name: "Kewajiban Jangka Pendek - Utang Belanja / PFK",
    category: "NERACA",
    subCategory: "Kewajiban",
    reportValue: 285000000,
    attachmentValue: 285000000,
    notes: "Potongan pajak dan iuran wajib belum disetor ke Kas Negara."
  },
  {
    code: "3.1.01",
    name: "Ekuitas Dana Lancar & Investasi",
    category: "NERACA",
    subCategory: "Ekuitas",
    reportValue: 60610000000,
    attachmentValue: 60640000000, // Selisih penyesuaian 30.000.000
    notes: "Kesesuaian dengan nilai ekuitas akhir Laporan Perubahan Ekuitas."
  },

  // 3. LAPORAN OPERASIONAL (LO)
  {
    code: "7.1.01",
    name: "Pendapatan Operasional - Layanan & Retribusi",
    category: "LO",
    subCategory: "Pendapatan-LO",
    reportValue: 5120000000,
    attachmentValue: 5120000000,
    notes: "Berbasis akrual termasuk piutang retribusi yang diakui."
  },
  {
    code: "8.1.01",
    name: "Beban Pegawai (Akrual)",
    category: "LO",
    subCategory: "Beban Operasional",
    reportValue: 6250000000,
    attachmentValue: 6250000000,
    notes: "Termasuk utang belanja pegawai yang telah diakui."
  },
  {
    code: "8.1.02",
    name: "Beban Persediaan & Bahan Pakai Habis",
    category: "LO",
    subCategory: "Beban Operasional",
    reportValue: 1220000000,
    attachmentValue: 1240000000, // Selisih 20.000.000
    notes: "Terdapat selisih Rp 20.000.000 beban persediaan yang belum terintegrasi dari buku persediaan."
  },
  {
    code: "8.1.05",
    name: "Beban Penyusutan & Amortisasi",
    category: "LO",
    subCategory: "Beban Operasional",
    reportValue: 840000000,
    attachmentValue: 840000000,
    notes: "Penyusutan aset periode pelaporan."
  },

  // 4. LAPORAN PERUBAHAN EKUITAS (LPE)
  {
    code: "3.2.01",
    name: "Ekuitas Awal",
    category: "LPE",
    subCategory: "Saldo Awal",
    reportValue: 63800000000,
    attachmentValue: 63800000000,
    notes: "Sesuai dengan Laporan Keuangan Audited periode sebelumnya."
  },
  {
    code: "3.2.02",
    name: "Surplus / (Defisit) Operasional LO",
    category: "LPE",
    subCategory: "Perubahan Periode Berjalan",
    reportValue: -3190000000,
    attachmentValue: -3210000000, // Selisih 20.000.000 dari LO
    notes: "Diambil langsung dari selisih Pendapatan-LO dan Beban-LO."
  },
  {
    code: "3.2.03",
    name: "Dampak Kumulatif Perubahan Kebijakan / Kesalahan Mendasar",
    category: "LPE",
    subCategory: "Penyesuaian",
    reportValue: 0,
    attachmentValue: 50000000, // Selisih 50.000.000 penyesuaian aset tetap lama
    notes: "Koreksi nilai buku aset tetap hasil sensus/inventarisasi barang."
  },
  {
    code: "3.2.04",
    name: "Ekuitas Akhir",
    category: "LPE",
    subCategory: "Saldo Akhir",
    reportValue: 60610000000,
    attachmentValue: 60640000000,
    notes: "Harus sama persis dengan total Ekuitas pada Neraca."
  }
];

export function formatRupiah(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);

  if (isNegative) {
    return `(${formatted})`;
  }
  return formatted;
}
