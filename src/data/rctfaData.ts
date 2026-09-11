export interface SectionRCTFA {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  content: string[];
  subsections?: {
    subtitle: string;
    items: string[];
  }[];
}

export const RCTFA_METADATA = {
  documentTitle: "DOKUMEN SPESIFIKASI PROMPT REKAYASA (RCTFA)",
  appName: "JURNAL LK",
  appFullName: "JURNAL LK - Sistem Rekonsiliasi & Penyusunan Laporan Keuangan",
  subtitle: "Spesifikasi Prompt Rekayasa Aplikasi Rekonsiliasi dan Penyusunan Laporan Keuangan Terpadu di Google AI Studio",
  version: "2.1.0-ENTERPRISE",
  targetPlatform: "Google AI Studio",
  targetPeriod: "Dikosongkan (Fleksibel & Dapat Diinput Pengguna)",
  authorRole: "Web App Builder & Financial Accounting Systems Expert",
  language: "Bahasa Indonesia Baku (Pedoman Umum Ejaan Bahasa Indonesia)",
  dateCreated: "2026-09-11",
};

export const RCTFA_SECTIONS: SectionRCTFA[] = [
  {
    id: "role",
    letter: "R",
    title: "ROLE (PERAN SISTEM & ASISTEN)",
    subtitle: "Karakter, Keahlian Teknis, dan Spesialisasi Domain",
    content: [
      "Anda adalah seorang Senior Full-Stack Web Application Architect sekaligus Spesialis Sistem Akuntansi Keuangan Sektor Publik dan Korporasi berstandar Standar Akuntansi Pemerintahan (SAP) dan Standar Akuntansi Keuangan (SAK).",
      "Anda memiliki keahlian mendalam dalam membangun antarmuka web modern menggunakan React 19, TypeScript, dan Tailwind CSS yang berfokus pada keakuratan kalkulasi finansial, integritas persamaan dasar akuntansi, serta ketelitian deteksi selisih (variance reconciliation).",
      "Dalam perancangan ini, Anda bertindak sebagai pembangun aplikasi cerdas yang menyajikan solusi presisi tinggi tanpa kesalahan logika angka, mematuhi prinsip kehati-hatian akuntansi, dan menyajikan laporan yang siap diaudit (audit-ready)."
    ]
  },
  {
    id: "context",
    letter: "C",
    title: "CONTEXT (LATAR BELAKANG & KONTEKS MASALAH)",
    subtitle: "Kondisi Riil, Permasalahan Pengguna, dan Objek Laporan",
    content: [
      "Nama Aplikasi: JURNAL LK (Sistem Rekonsiliasi & Penyusunan Laporan Keuangan Otomatis).",
      "Periode Pelaporan: Dikosongkan secara baku (Dapat diisi atau dipilih secara fleksibel oleh pengguna, misal Semester I, Semester II, Tahunan, Triwulan, atau dibiarkan kosong).",
      "Kondisi Pengguna: Pengguna sering menghadapi beban kerja tinggi, kerumitan pencocokan angka antar-dokumen, dan risiko kesalahan manusia (human error) saat menyusun laporan keuangan serta melakukan pengecekan selisih nilai akun antar-buku pembantu dan laporan utama.",
      "Dokumen Masukan (Input Sources): Pengguna akan mengunggah dua berkas utama ke dalam aplikasi:",
      "1. Berkas 'Laporan Keuangan': Merupakan dokumen kompilasi pelaporan resmi yang memuat struktur baku laporan entitas.",
      "2. Berkas 'Lampiran Neraca': Merupakan dokumen rincian saldo buku besar / daftar rincian akun pembantu neraca yang menjadi sumber data primer (ground truth) untuk dianalisis oleh sistem.",
      "Kebutuhan Inti Analisis: Data dari 'Lampiran Neraca' harus diekstraksi dan dianalisis silang terhadap 4 (empat) komponen laporan keuangan utama, yaitu:",
      "  a. Laporan Realisasi Anggaran (LRA) - mencakup Pendapatan, Belanja, dan Pembiayaan;",
      "  b. Neraca - mencakup Aset Lancar, Aset Tetap, Aset Lainnya, Kewajiban Jangka Pendek/Panjang, dan Ekuitas;",
      "  c. Laporan Operasional (LO) - mencakup Pendapatan-LO, Beban Operasional, serta Pos Luar Biasa;",
      "  d. Laporan Perubahan Ekuitas (LPE) - mencakup Ekuitas Awal, Surplus/Defisit LO, Dampak Kumulatif, dan Ekuitas Akhir.",
      "Tujuan Akhir: Mengidentifikasi seluruh selisih saldo akun secara otomatis, kemudian memindahkan nilai hasil analisis dan rekonsiliasi tersebut ke dalam bagian 'Ringkasan Laporan Keuangan' yang terpadu dan siap dipublikasikan."
    ]
  },
  {
    id: "task",
    letter: "T",
    title: "TASK (TUGAS & SPESIFIKASI PENGEMBANGAN FITUR)",
    subtitle: "Rangkaian Tugas Eksekusi Pembangunan Aplikasi",
    content: [
      "Rancang dan bangun aplikasi web satu layar (single-screen dashboard) yang modular, berkecepatan tinggi, dan berdesain profesional dengan ruang lingkup tugas spesifik berikut:",
      "1. Modul Pengunggahan Berkas Ganda (Dual Upload Interface):",
      "   - Sediakan dua zona pengunggahan terpisah dengan mekanisme 'Drag-and-Drop' dan pemilih berkas manual untuk: (a) 'Laporan Keuangan' dan (b) 'Lampiran Neraca'.",
      "   - Mendukung format berkas lembar kerja (.xlsx, .xls, .csv) serta dokumen .pdf.",
      "   - Menyediakan tombol 'Gunakan Data Sampel Semester I 2026' agar pengguna dapat langsung menguji alur kerja aplikasi secara instan.",
      "2. Mesin Analisis & Ekstraksi 'Lampiran Neraca':",
      "   - Lakukan pemilahan otomatis terhadap data akun di dalam 'Lampiran Neraca' ke dalam 4 pos laporan: LRA, Neraca, LO, dan LPE.",
      "   - Ekstraksi kode akun, nama akun, saldo debit/kredit, saldo semester sebelumnya, dan mutasi berjalan semester I 2026.",
      "3. Mesin Rekonsiliasi & Deteksi Selisih Akun (Variance Engine):",
      "   - Bandingkan nilai setiap akun pada 'Lampiran Neraca' dengan nilai yang tertera pada 'Laporan Keuangan'.",
      "   - Hitung selisih mutlak: Selisih = Nilai Lampiran Neraca - Nilai Laporan Keuangan.",
      "   - Berikan penandaan visual instan: Hijau (Sesuai / Balance: Selisih = 0) dan Merah Terang (Terdapat Selisih: Nilai != 0).",
      "   - Sajikan persentase varians serta rekomendasi penjelasan selisih (misal: jurnal belum dibukukan, salah klasifikasi pos beban, atau selisih pencatatan kas di bendahara).",
      "4. Modul Pemindahan Otomatis ke 'Ringkasan Laporan Keuangan':",
      "   - Setelah analisis selesai, pindahkan secara otomatis (tanpa entri manual ulang) seluruh data valid ke dalam seksi 'Ringkasan Laporan Keuangan'.",
      "   - Bagian Ringkasan harus memuat sub-tabel terstruktur untuk: (a) Ringkasan LRA, (b) Ringkasan Neraca, (c) Ringkasan LO, dan (d) Ringkasan LPE.",
      "5. Validasi Persamaan Keterkaitan Laporan (Financial Articulation Integrity):",
      "   - Pastikan integrasi matematis: Surplus/Defisit Bersih LO terhubung ke penambahan/pengurangan Ekuitas di LPE.",
      "   - Pastikan Ekuitas Akhir pada LPE tepat sama dengan Total Ekuitas pada Neraca.",
      "   - Pastikan Sisa Lebih Pembiayaan Anggaran (SiLPA) pada LRA terkonfirmasi dengan saldo Kas dan Setara Kas di Neraca.",
      "6. Fitur Ekspor & Pelaporan:",
      "   - Fasilitasi pengunduhan lembar kerja hasil rekonsiliasi dan Ringkasan Laporan Keuangan ke format PDF siap cetak serta berkas Excel/CSV."
    ]
  },
  {
    id: "format",
    letter: "F",
    title: "FORMAT (ARSITEKTUR ANTARMUKA, STRUKTUR DATA & LUARAN)",
    subtitle: "Format Visual, Komponen Antarmuka, dan Struktur Penyajian",
    content: [
      "1. Struktur Tampilan Antarmuka (Layout Hierarchy):",
      "   - Header Resmi: Menampilkan logo/lambang lembaga, judul laporan 'Laporan Keuangan Semester I Tahun Anggaran 2026', serta metadata waktu rekonsiliasi.",
      "   - Status Bar Keseimbangan: Indikator cepat total akun yang dianalisis, jumlah akun yang sesuai (balance), dan jumlah akun yang memerlukan tindak lanjut.",
      "   - Tab Navigasi Terpadu:",
      "     * Tab 1: Ringkasan Laporan Keuangan (Konsolidasi LRA, Neraca, LO, LPE).",
      "     * Tab 2: Analisis Selisih LRA (Pendapatan vs Belanja vs Pembiayaan).",
      "     * Tab 3: Analisis Selisih Neraca (Aset, Kewajiban, Ekuitas).",
      "     * Tab 4: Analisis Selisih LO (Pendapatan-LO vs Beban Operasional).",
      "     * Tab 5: Analisis Selisih LPE (Pergerakan Ekuitas Semester I).",
      "     * Tab 6: Lembar Kerja Rekonsiliasi Lengkap & Audit Trail.",
      "2. Format Format Angka & Tata Nama Akuntansi:",
      "   - Format Moneter: Penulisan mata uang Rupiah standar Indonesia: 'Rp xx.xxx.xxx.xxx,00' dengan pemisah ribuan titik (.) dan pemisah desimal koma (,).",
      "   - Angka negatif ditampilkan dalam kurung akuntansi: (Rp 15.000.000,00).",
      "3. Format Kode Program:",
      "   - Ditulis murni dalam TypeScript + React fungsional, memanfaatkan ikon dari Lucide-React, dan styling Tailwind CSS yang bersih, kontras tinggi, dan elegan.",
      "   - Bebas dari dependensi eksternal yang tidak dideklarasikan."
    ]
  },
  {
    id: "acceptance",
    letter: "A",
    title: "AUDIENCE & ACCEPTANCE CRITERIA (AUDIENS & KRITERIA PENERIMAAN)",
    subtitle: "Sasaran Pengguna, Batasan Teknis, dan Tolok Ukur Keberhasilan",
    content: [
      "Target Audiens:",
      "- Petugas Penyusun Laporan Keuangan dan Akuntan Satuan Kerja / Entitas Bisnis.",
      "- Pejabat Penatausahaan Keuangan (PPK) dan Kepala Bagian Keuangan.",
      "- Auditor Internal (Inspektorat / SPI) dan Auditor Eksternal (BPK / KAP).",
      "Kriteria Penerimaan (Acceptance Criteria):",
      "1. Presisi Angka 100%: Tidak ada toleransi pembulatan yang menimbulkan selisih fiktif.",
      "2. Ekstraksi Dokumen Tuntas: Seluruh akun dari 'Lampiran Neraca' berhasil dipetakan ke dalam 4 pos laporan (LRA, Neraca, LO, LPE).",
      "3. Deteksi Selisih Nyata: Setiap ketidaksesuaian antara 'Laporan Keuangan' dan 'Lampiran Neraca' langsung disorot dengan rincian nominal dan persentase.",
      "4. Ringkasan Otomatis: Komponen 'Ringkasan Laporan Keuangan' otomatis terisi seketika analisis berkas diselesaikan pengguna.",
      "5. Validitas Hubungan Finansial: Persamaan keterkaitan antar-laporan (LO -> LPE -> Neraca) diverifikasi secara otomatis dengan indikator validasi visual.",
      "6. Bahasa & Tata Kata Baku: Seluruh antarmuka, keterangan, dan pesan kesalahan menggunakan Bahasa Indonesia baku yang formal dan sesuai tata kelola pemerintahan/korporasi yang baik (Good Governance)."
    ]
  }
];

export const RAW_RCTFA_PROMPT_TEXT = `### PANDUAN PROMPT UTAMA (RCTFA) UNTUK GOOGLE AI STUDIO ###

[ROLE]
Bertindaklah sebagai Senior Web App Architect & Tenaga Ahli Sistem Akuntansi Keuangan Pemerintahan/Korporasi. Bangunlah sebuah aplikasi web berkinerja tinggi bernama "FINARECON PRO" (Sistem Rekonsiliasi & Penyusunan Laporan Keuangan Otomatis) berbasis React 19, TypeScript, dan Tailwind CSS dengan standar akuntansi formal (SAP/SAK) serta keahlian dalam rekonsiliasi data dan deteksi selisih angka.

[CONTEXT]
Aplikasi: FINARECON PRO
Periode Pelaporan: Dikosongkan secara baku (field periode dibiarkan kosong / fleksibel agar pengguna bebas menginput periode apa pun, seperti Semester I 2026, Semester II, Tahunan, Triwulan, atau mengosongkannya).
Pengguna sering mengalami kesulitan dan risiko salah hitung saat membandingkan data dan mencari selisih pada akun tertentu antar-dokumen.

Pengguna akan mengunggah dua berkas utama:
1. Berkas "Laporan Keuangan" (dokumen kompilasi laporan pokok entitas).
2. Berkas "Lampiran Neraca" (dokumen rincian saldo buku besar pembantu neraca sebagai basis data analisis utama).

Data dari "Lampiran Neraca" harus dianalisis secara mendalam mencakup 4 (empat) komponen laporan utama:
1. Laporan Realisasi Anggaran (LRA)
2. Neraca
3. Laporan Operasional (LO)
4. Laporan Perubahan Ekuitas (LPE)

Setelah dianalisis, seluruh nilai tersebut harus dipindahkan secara otomatis ke dalam bagian "Ringkasan Laporan Keuangan" yang mengonsolidasikan LRA, Neraca, LO, dan LPE secara presisi dan terhubung secara matematis.

[TASK]
Bangun aplikasi web "FINARECON PRO" dengan antarmuka dashboard modern yang sangat menarik, elegan, dan siap produksi dengan kapabilitas:
1. Header & Identitas Aplikasi: Menampilkan nama aplikasi "FINARECON PRO" secara jelas di bagian atas dashboard, disertai widget pemilih/pengisi periode yang secara default kosong (blank), dengan opsi pengguna dapat mengetik periode secara kustom.
2. Zona Pengunggahan Ganda (Dual Upload Area) interaktif untuk berkas "Laporan Keuangan" dan "Lampiran Neraca" (format Excel/CSV/PDF) yang mendukung drag-and-drop, indikator progres, serta tombol "Muat Data Sampel".
3. Mesin Analisis Otomatis yang mengekstraksi data pada "Lampiran Neraca" dan memilahnya ke dalam 4 komponen laporan: LRA, Neraca, LO, dan LPE.
4. Mesin Rekonsiliasi & Deteksi Selisih Akun (Variance Detector) yang membandingkan setiap nilai akun antara Lampiran Neraca dan Laporan Keuangan, menghitung selisih nominal dan persentase, serta memberikan tanda visual hijau (seimbang/sesuai) atau merah (terdapat selisih).
5. Pemindahan Otomatis ke "Ringkasan Laporan Keuangan" yang menyajikan tabel ringkasan terstruktur dari keempat laporan secara elegan tanpa memerlukan entri data ulang.
6. Pengecekan Keterkaitan Antar-Laporan (Financial Cross-Check):
   - Surplus/Defisit LO mengalir ke penambahan/pengurangan ekuitas di LPE.
   - Nilai Ekuitas Akhir pada LPE sama dengan Total Ekuitas pada Neraca.
   - Sisa Lebih Pembiayaan Anggaran (SiLPA) pada LRA selaras dengan Saldo Kas di Neraca.
7. Fitur Ekspor Ringkasan dan Laporan Rekonsiliasi ke format cetak PDF resmi dan berkas spreadsheet.

[FORMAT]
- Antarmuka: Dashboard eksekutif modern dengan palet warna Slate/Dark Navy mewah, aksen Emerald Green (balance) dan Crimson Red (selisih), tab navigasi interaktif: "Ringkasan Laporan Keuangan", "Semua Akun Rekonsiliasi", "LRA", "Neraca", "LO", "LPE", dan "Audit Trail".
- Nama & Branding: Menampilkan nama "FINARECON PRO" dengan tipografi tajam, lencana status sistem, dan field periode dinamis yang default-nya kosong.
- Penulisan Angka: Format mata uang Rupiah Indonesia (Rp #.###.###.###,00) dengan angka minus dalam tanda kurung akuntansi.
- Bahasa: Menggunakan Bahasa Indonesia formal dan baku di setiap label, judul tabel, dan keterangan analisis.

[AUDIENCE & ACCEPTANCE CRITERIA]
- Audiens: Penyusun Laporan Keuangan, Pejabat Penatausahaan Keuangan, dan Tim Auditor.
- Kriteria Keberhasilan:
  1. Nama aplikasi "FINARECON PRO" tampil jelas dan menonjol pada dashboard.
  2. Kolom periode secara baku dalam keadaan kosong (blank/customizable).
  3. Desain antarmuka tampak estetis, modern, kontras tinggi, dan berstandar enterprise.
  4. Pengguna dapat mengunggah berkas atau menggunakan data sampel.
  5. Seluruh selisih nilai akun teridentifikasi dengan jelas dan akurat.
  6. Bagian Ringkasan Laporan Keuangan terisi otomatis untuk 4 laporan: LRA, Neraca, LO, dan LPE.
  7. Seluruh rumus keterkaitan laporan (LO -> LPE -> Neraca) terbukti seimbang (balance).`;
