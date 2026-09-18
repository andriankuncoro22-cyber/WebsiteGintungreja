'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  GraduationCap,
  Activity,
  Heart,
  TrendingUp,
  Building2,
  Target,
  Award,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Download,
  FileDown,
  Home,
  UserCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Stethoscope,
  BookOpen,
  Sparkles,
  Layers,
  Coins,
  Store,
  Sprout,
  HeartPulse,
  Scale,
  HandHeart,
  Check,
  Info,
  AlertTriangle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const COLORS = ['#1e293b', '#eab308', '#059669', '#0d9488', '#8b5cf6', '#f43f5e'];

const tabs = [
  { id: 'kependudukan', label: 'Kependudukan', icon: Users, desc: 'Demografi & Sebaran Penduduk' },
  { id: 'pendidikan', label: 'Pendidikan', icon: GraduationCap, desc: 'Tingkat Pendidikan & Fasilitas Belajar' },
  { id: 'kesehatan', label: 'Kesehatan', icon: Activity, desc: 'Fasilitas Kesehatan & Stunting' },
  { id: 'sosial', label: 'Sosial', icon: HandHeart, desc: 'Bantuan Sosial & Kemasyarakatan' },
  { id: 'ekonomi', label: 'Ekonomi', icon: TrendingUp, desc: 'Sektor Usaha, Pertanian & BUMDes' },
  { id: 'pembangunan', label: 'Pembangunan Desa', icon: Building2, desc: 'Infrastruktur & Realisasi APBDes' },
  { id: 'sdgs', label: 'SDGs Desa', icon: Target, desc: '18 Gol Pembangunan Berkelanjutan' },
  { id: 'indeks', label: 'Indeks Desa', icon: Award, desc: 'Laporan Analisis Indeks Desa 2025 (Status: Maju)' },
];

export default function StatistikPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <StatistikContent />
    </Suspense>
  );
}

function StatistikContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState('kependudukan');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (queryTab && tabs.some(t => t.id === queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.replace(`/statistik?tab=${tabId}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans overflow-x-hidden w-full">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-xs sm:shadow-sm">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Logo />
          <Link href="/">
            <Button variant="ghost" className="font-bold gap-1.5 sm:gap-2 text-primary hover:bg-slate-100 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Beranda</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white py-6 sm:py-12 md:py-16 border-b border-slate-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-1.5 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 shrink-0" />
              Portal Data & Transparansi Publik
            </div>
            <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight font-display">
              Statistik Desa Gintungreja
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Pusat data terpadu dan indikator pembangunan Desa Gintungreja, Gandrungmangu, Cilacap.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 container mx-auto px-2.5 sm:px-4 py-4 sm:py-8 md:py-12 w-full min-w-0">
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-start w-full min-w-0">

          {/* SIDEBAR NAVIGATION (Desktop) / MOBILE MENU (Mobile) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 z-40 w-full min-w-0">
            {/* Desktop Navigation List */}
            <div className="hidden lg:flex bg-white rounded-[2.5rem] p-4 border shadow-sm flex-col gap-2">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Kategori Statistik</p>
              </div>
              {tabs.map((tab) => {
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 whitespace-nowrap w-full group text-left",
                      isCurrent
                        ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                    )}
                  >
                    <tab.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isCurrent ? "text-white" : "text-slate-400")} />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-black uppercase text-[10px] tracking-widest leading-tight">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Navigation (Grid 4 Kolom x 2 Baris Penuh 1 Layar Tanpa Geser) */}
            <div className="block lg:hidden w-full mb-4 space-y-2">
              <div className="bg-slate-200/70 p-1 rounded-xl border border-slate-300/60 grid grid-cols-4 gap-1 w-full">
                {tabs.map((tab) => {
                  const isCurrent = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={cn(
                        "py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all text-center",
                        isCurrent
                          ? "bg-primary text-white shadow-sm font-black"
                          : "bg-white/80 text-slate-600 hover:bg-white font-bold"
                      )}
                    >
                      <tab.icon className={cn("h-3.5 w-3.5 shrink-0", isCurrent ? "text-white" : "text-slate-500")} />
                      <span className="text-[7.5px] min-[380px]:text-[8px] uppercase tracking-tight leading-tight line-clamp-1 w-full">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Subtitle Info Banner */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/70 rounded-xl text-emerald-800 text-[9.5px] min-[380px]:text-[10px]">
                <activeTabObj.icon className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                <p className="truncate">
                  <span className="font-black uppercase text-emerald-950">{activeTabObj.label}</span>
                  <span className="text-emerald-700/80 ml-1.5 hidden min-[380px]:inline">— {activeTabObj.desc}</span>
                </p>
              </div>
            </div>

            {/* Quick Access Card (Desktop Only) */}
            <div className="hidden lg:block mt-8 p-8 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck className="w-24 h-24" /></div>
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Akses Cepat</p>
                <h4 className="text-xl font-display font-semibold italic">Butuh bantuan administrasi desa?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Layanan pengajuan surat dan dokumen kependudukan kini dapat diakses secara daring 24 jam.
                </p>
                <Link href="/layanan-surat/">
                  <Button className="bg-secondary text-white font-black uppercase text-[10px] tracking-widest w-full h-12 rounded-xl mt-2 hover:bg-yellow-600">
                    Buka Layanan Surat
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9 space-y-4 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-w-0">
            {activeTab === 'kependudukan' && <KependudukanTab />}
            {activeTab === 'pendidikan' && <PendidikanTab />}
            {activeTab === 'kesehatan' && <KesehatanTab />}
            {activeTab === 'sosial' && <SosialTab />}
            {activeTab === 'ekonomi' && <EkonomiTab />}
            {activeTab === 'pembangunan' && <PembangunanTab />}
            {activeTab === 'sdgs' && <SDGsTab />}
            {activeTab === 'indeks' && <IndeksTab />}
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#081325] text-slate-400 py-12 border-t border-slate-800/80 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <Logo />
          <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            © 2026 Pemerintah Desa Gintungreja • Kecamatan Gandrungmangu, Kabupaten Cilacap
          </p>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 1. TAB KEPENDUDUKAN
// ==========================================
function KependudukanTab() {
  const [filterDusun, setFilterDusun] = useState('Semua Wilayah');
  const firestore = useFirestore();
  const { toast } = useToast();

  const statsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'statistics');
  }, [firestore]);

  const { data: statsDoc, isLoading } = useDoc<any>(statsRef);

  const stats = useMemo(() => {
    const defaultData = {
      total: 7007,
      totalKK: 2250,
      male: 3596,
      female: 3411,
      density: 1149,
      malePercent: 51.3,
      femalePercent: 48.7,
      ageData: [
        { name: 'Anak (0-14 Th)', value: 1540 },
        { name: 'Produktif (15-64 Th)', value: 4680 },
        { name: 'Lansia (65+ Th)', value: 787 },
      ],
      jobData: [
        { name: 'Petani / Perkebunan', value: 3250 },
        { name: 'Buruh Tani / Harian', value: 1680 },
        { name: 'Pedagang / Wirausaha', value: 890 },
        { name: 'Karyawan Swasta', value: 1120 },
        { name: 'PNS / TNI / Polri', value: 145 },
        { name: 'Pelajar / Mahasiswa', value: 1420 },
        { name: 'Lainnya', value: 1241 },
      ],
      religionData: [
        { name: 'Islam', value: 9680 },
        { name: 'Kristen', value: 45 },
        { name: 'Katolik', value: 15 },
        { name: 'Lainnya', value: 6 },
      ],
      mutationData: [
        { month: 'Jan', lahir: 12, mati: 5, datang: 8, pindah: 4 },
        { month: 'Feb', lahir: 15, mati: 3, datang: 10, pindah: 6 },
        { month: 'Mar', lahir: 10, mati: 7, datang: 12, pindah: 2 },
        { month: 'Apr', lahir: 18, mati: 4, datang: 6, pindah: 8 },
        { month: 'Mei', lahir: 14, mati: 2, datang: 15, pindah: 5 },
        { month: 'Jun', lahir: 16, mati: 4, datang: 9, pindah: 3 },
      ]
    };

    if (!statsDoc) return defaultData;

    let target = statsDoc;
    if (filterDusun !== 'Semua Wilayah' && statsDoc.dusunData?.[filterDusun]) {
      target = statsDoc.dusunData[filterDusun];
    }

    return {
      total: target.total || defaultData.total,
      totalKK: target.totalKK || defaultData.totalKK,
      male: target.male || Math.round((target.total || defaultData.total) * 0.51),
      female: target.female || Math.round((target.total || defaultData.total) * 0.49),
      density: target.density || defaultData.density,
      malePercent: target.malePercent || 51,
      femalePercent: target.femalePercent || 49,
      ageData: target.ageData || defaultData.ageData,
      jobData: target.jobData || defaultData.jobData,
      religionData: target.religionData || defaultData.religionData,
      mutationData: statsDoc.mutationData || defaultData.mutationData,
    };
  }, [statsDoc, filterDusun]);

  const handleDownloadExcel = () => {
    const dataRows = [
      { Kategori: 'Total Penduduk', Nilai: stats.total, Satuan: 'Jiwa' },
      { Kategori: 'Kepala Keluarga (KK)', Nilai: stats.totalKK, Satuan: 'KK' },
      { Kategori: 'Laki-Laki', Nilai: stats.male, Satuan: 'Jiwa' },
      { Kategori: 'Perempuan', Nilai: stats.female, Satuan: 'Jiwa' },
      { Kategori: 'Kepadatan Penduduk', Nilai: stats.density, Satuan: 'Jiwa/km²' },
    ];
    const ws = XLSX.utils.json_to_sheet(dataRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kependudukan");
    XLSX.writeFile(wb, `Statistik_Kependudukan_Gintungreja_${filterDusun}.xlsx`);
    toast({ title: "Berhasil Unduh", description: "Data statistik telah disimpan dalam format Excel." });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Data Statistik Kependudukan Desa Gintungreja', 14, 20);
    doc.setFontSize(10);
    doc.text(`Wilayah: ${filterDusun} | Kecamatan Gandrungmangu, Kabupaten Cilacap`, 14, 28);

    autoTable(doc, {
      startY: 36,
      head: [['Indikator Kependudukan', 'Jumlah', 'Keterangan']],
      body: [
        ['Total Penduduk', `${stats.total.toLocaleString()} Jiwa`, 'Terdata dalam database desa'],
        ['Total Kepala Keluarga', `${stats.totalKK.toLocaleString()} KK`, 'Rumah tangga terdaftar'],
        ['Penduduk Laki-Laki', `${stats.male.toLocaleString()} Jiwa`, `${stats.malePercent}% dari total`],
        ['Penduduk Perempuan', `${stats.female.toLocaleString()} Jiwa`, `${stats.femalePercent}% dari total`],
        ['Kepadatan Penduduk', `${stats.density} Jiwa/km²`, 'Rasio wilayah 9.88 km²'],
      ],
    });

    doc.save(`Statistik_Kependudukan_${filterDusun}.pdf`);
    toast({ title: "Berhasil Cetak", description: "Dokumen PDF kependudukan sedang diunduh." });
  };

  return (
    <div className="space-y-4 sm:space-y-8 w-full min-w-0">
      {/* Header filter & exports */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-xs sm:shadow-sm">
        <div>
          <h2 className="text-base sm:text-xl font-black text-slate-800 tracking-tight">Statistik Kependudukan</h2>
          <p className="text-[10px] sm:text-xs text-slate-500">Agregasi data demografi, kelompok usia, dan profesi warga desa.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={filterDusun} onValueChange={setFilterDusun}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 sm:h-10 rounded-xl border-slate-200 text-xs font-bold">
              <SelectValue placeholder="Pilih Wilayah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Wilayah">Semua Wilayah</SelectItem>
              <SelectItem value="Dusun Gintungreja">Dusun Gintungreja</SelectItem>
              <SelectItem value="Dusun Sidakaya">Dusun Sidakaya</SelectItem>
              <SelectItem value="Dusun Kedungwringin">Dusun Kedungwringin</SelectItem>
              <SelectItem value="Dusun Cihaur">Dusun Cihaur</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button onClick={handleDownloadExcel} variant="outline" size="sm" className="flex-1 sm:flex-initial gap-1.5 rounded-xl text-xs font-bold text-slate-700 h-9 sm:h-10">
              <Download className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Excel</span>
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="flex-1 sm:flex-initial gap-1.5 rounded-xl text-xs font-bold text-slate-700 h-9 sm:h-10">
              <FileDown className="h-3.5 w-3.5 text-red-600 shrink-0" />
              <span>PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards (2 Kolom Compact di Mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <Card className="rounded-xl sm:rounded-3xl border-slate-100 shadow-xs sm:shadow-sm bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-2.5 min-[380px]:p-3 sm:p-6 space-y-0.5 sm:space-y-1">
          <p className="text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Total Penduduk</p>
          <h3 className="text-lg min-[380px]:text-xl sm:text-3xl font-black font-display">{stats.total.toLocaleString()}</h3>
          <p className="text-[8px] min-[380px]:text-[9px] sm:text-[11px] text-emerald-100/80 flex items-center gap-1 truncate">
            <Users className="h-3 w-3 shrink-0" /> Jiwa Terdaftar
          </p>
        </Card>

        <Card className="rounded-xl sm:rounded-3xl border-slate-100 shadow-xs sm:shadow-sm bg-white p-2.5 min-[380px]:p-3 sm:p-6 space-y-0.5 sm:space-y-1">
          <p className="text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kepala Keluarga</p>
          <h3 className="text-lg min-[380px]:text-xl sm:text-3xl font-black text-slate-800 font-display">{stats.totalKK.toLocaleString()}</h3>
          <p className="text-[8px] min-[380px]:text-[9px] sm:text-[11px] text-slate-500 flex items-center gap-1 truncate">
            <Home className="h-3 w-3 text-primary shrink-0" /> Rumah Tangga (KK)
          </p>
        </Card>

        <Card className="rounded-xl sm:rounded-3xl border-slate-100 shadow-xs sm:shadow-sm bg-white p-2.5 min-[380px]:p-3 sm:p-6 space-y-0.5 sm:space-y-1">
          <p className="text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Laki-Laki</p>
          <h3 className="text-lg min-[380px]:text-xl sm:text-3xl font-black text-blue-600 font-display">{stats.male.toLocaleString()}</h3>
          <p className="text-[8px] min-[380px]:text-[9px] sm:text-[11px] text-slate-500 flex items-center gap-1 truncate">
            <UserCheck className="h-3 w-3 text-blue-500 shrink-0" /> {stats.malePercent}% Komposisi
          </p>
        </Card>

        <Card className="rounded-xl sm:rounded-3xl border-slate-100 shadow-xs sm:shadow-sm bg-white p-2.5 min-[380px]:p-3 sm:p-6 space-y-0.5 sm:space-y-1">
          <p className="text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perempuan</p>
          <h3 className="text-lg min-[380px]:text-xl sm:text-3xl font-black text-pink-600 font-display">{stats.female.toLocaleString()}</h3>
          <p className="text-[8px] min-[380px]:text-[9px] sm:text-[11px] text-slate-500 flex items-center gap-1 truncate">
            <UserCheck className="h-3 w-3 text-pink-500 shrink-0" /> {stats.femalePercent}% Komposisi
          </p>
        </Card>
      </div>

      {/* 4 Dusun Breakdown Cards */}
      <div className="bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-xs sm:shadow-sm space-y-2.5 sm:space-y-4">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Distribusi Penduduk Berdasarkan 4 Dusun</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {[
            { dusun: 'Gintungreja', jiwa: 2120, kk: 680, rt: 12, rw: 2 },
            { dusun: 'Sidakaya', jiwa: 1840, kk: 590, rt: 11, rw: 1 },
            { dusun: 'Kedungwringin', jiwa: 1620, kk: 520, rt: 10, rw: 1 },
            { dusun: 'Cihaur', jiwa: 1427, kk: 460, rt: 10, rw: 1 },
          ].map((d, idx) => (
            <div key={idx} className="p-2.5 min-[380px]:p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
              <span className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-700">Dusun</span>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm mt-0.5 truncate">{d.dusun}</h4>
              <p className="text-sm sm:text-lg font-black text-slate-900 mt-1">{d.jiwa.toLocaleString()} <span className="text-[9px] sm:text-xs font-normal text-slate-500">Jiwa</span></p>
              <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex justify-between text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-500 font-semibold">
                <span>{d.kk} KK</span>
                <span>{d.rt} RT / {d.rw} RW</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row: Kelompok Umur & Pekerjaan */}
      <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
        <Card className="rounded-2xl sm:rounded-3xl border-slate-100 shadow-xs sm:shadow-sm p-3.5 sm:p-6 bg-white space-y-2 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Kelompok Usia Penduduk</h3>
          <div className="h-52 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ageData} layout="vertical" margin={{ left: 5, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={85} />
                <Tooltip formatter={(value: any) => [`${value} Jiwa`, 'Jumlah']} />
                <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl border-slate-100 shadow-xs sm:shadow-sm p-3.5 sm:p-6 bg-white space-y-2 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Mata Pencaharian Utama</h3>
          <div className="h-52 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.jobData} layout="vertical" margin={{ left: 5, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 8.5 }} width={95} />
                <Tooltip formatter={(value: any) => [`${value} Orang`, 'Jumlah']} />
                <Bar dataKey="value" fill="#0284c7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Mutasi Penduduk Bulanan */}
      <Card className="rounded-2xl sm:rounded-3xl border-slate-100 shadow-xs sm:shadow-sm p-3.5 sm:p-6 bg-white space-y-2 sm:space-y-4">
        <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-1">
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Dinamika Mutasi Penduduk</h3>
            <p className="text-[10px] sm:text-xs text-slate-500">Pencatatan kelahiran, kematian, kepindahan, dan kedatangan.</p>
          </div>
          <Badge className="bg-emerald-600 text-white font-bold text-[8.5px] sm:text-[10px] w-fit">Pembaruan Bulanan</Badge>
        </div>
        <div className="h-52 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.mutationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="lahir" stroke="#059669" name="Lahir" strokeWidth={2} />
              <Line type="monotone" dataKey="mati" stroke="#dc2626" name="Mati" strokeWidth={2} />
              <Line type="monotone" dataKey="datang" stroke="#0284c7" name="Masuk" strokeWidth={2} />
              <Line type="monotone" dataKey="pindah" stroke="#f59e0b" name="Keluar" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// 2. TAB PENDIDIKAN
// ==========================================
function PendidikanTab() {
  const eduStats = [
    { label: 'SD / Sederajat', percent: 38, count: 3703, color: '#059669' },
    { label: 'SMP / MTs', percent: 26, count: 2534, color: '#0284c7' },
    { label: 'SMA / SMK / MA', percent: 24, count: 2339, color: '#f59e0b' },
    { label: 'Diploma / Sarjana (S1-S3)', percent: 8, count: 780, color: '#8b5cf6' },
    { label: 'Belum / Tidak Sekolah', percent: 4, count: 390, color: '#94a3b8' },
  ];

  const sdList = [
    { name: 'SD Negeri Gintungreja 01', dusun: 'Dusun Gintungreja', siswa: 215, guru: 12, akreditasi: 'A' },
    { name: 'SD Negeri Gintungreja 02', dusun: 'Dusun Sidakaya', siswa: 195, guru: 11, akreditasi: 'A' },
    { name: 'SD Negeri Gintungreja 03', dusun: 'Dusun Kedungwringin', siswa: 178, guru: 10, akreditasi: 'B' },
    { name: 'Lembaga Pendidikan Diniyah & TPQ', dusun: 'Tersebar di 4 Dusun', siswa: 320, guru: 18, akreditasi: 'Terdaftar' },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="rounded-2xl sm:rounded-3xl p-2.5 min-[380px]:p-3 sm:p-6 bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-blue-200 uppercase tracking-wider">Melek Huruf</p>
          <h3 className="text-base min-[380px]:text-lg sm:text-3xl font-black mt-1 sm:mt-2 font-display">99.2%</h3>
          <p className="text-[8px] min-[380px]:text-[10px] sm:text-xs text-blue-100/80 mt-0.5 sm:mt-1 leading-tight line-clamp-2">Bebas buta aksara</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-2.5 min-[380px]:p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wajib Belajar</p>
          <h3 className="text-base min-[380px]:text-lg sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 font-display">96.4%</h3>
          <p className="text-[8px] min-[380px]:text-[10px] sm:text-xs text-emerald-600 font-semibold mt-0.5 sm:mt-1 leading-tight line-clamp-2">12 Tahun tuntas</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-2.5 min-[380px]:p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lembaga</p>
          <h3 className="text-base min-[380px]:text-lg sm:text-3xl font-black text-primary mt-1 sm:mt-2 font-display">24 Unit</h3>
          <p className="text-[8px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-tight line-clamp-2">Formal & agama</p>
        </Card>
      </div>

      {/* Tingkat Pendidikan Breakdown */}
      <Card className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3 sm:space-y-6">
        <div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Tingkat Pendidikan Terakhir Penduduk</h3>
          <p className="text-[10px] sm:text-xs text-slate-500">Komposisi jenjang kelulusan warga masyarakat Desa Gintungreja.</p>
        </div>

        <div className="space-y-2.5 sm:space-y-4">
          {eduStats.map((item, idx) => (
            <div key={idx} className="space-y-1 sm:space-y-1.5">
              <div className="flex justify-between text-[10px] sm:text-xs font-bold">
                <span className="text-slate-700">{item.label}</span>
                <span className="text-slate-900">{item.count.toLocaleString()} Jiwa ({item.percent}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 sm:h-3 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 7 SD Negeri Table */}
      <Card className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Daftar 7 Sekolah Dasar Negeri (SDN)</h3>
            <p className="text-[10px] sm:text-xs text-slate-500">Fasilitas pendidikan dasar negeri di Desa Gintungreja.</p>
          </div>
          <Badge className="bg-primary text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 shrink-0">7 Sekolah</Badge>
        </div>

        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left text-[10px] sm:text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[8px] sm:text-[10px]">
                <th className="py-2 px-2 sm:py-3 sm:px-4 font-bold">Sekolah</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 font-bold">Dusun</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 font-bold text-center">Siswa</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 font-bold text-center">Guru</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 font-bold text-center">Akreditasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sdList.map((sd, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
                    <span className="sm:hidden">{sd.name.replace('SD Negeri Gintungreja ', 'SDN ')}</span>
                    <span className="hidden sm:inline">{sd.name}</span>
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-slate-600">
                    <span className="sm:hidden">{sd.dusun.replace('Dusun ', '')}</span>
                    <span className="hidden sm:inline">{sd.dusun}</span>
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-center font-semibold">
                    <span className="sm:hidden">{sd.siswa}</span>
                    <span className="hidden sm:inline">{sd.siswa} Siswa</span>
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-center">
                    <span className="sm:hidden">{sd.guru}</span>
                    <span className="hidden sm:inline">{sd.guru} Guru</span>
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-center">
                    <span className={cn(
                      "px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black",
                      sd.akreditasi === 'A' ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                    )}>
                      <span className="sm:hidden">{sd.akreditasi}</span>
                      <span className="hidden sm:inline">Akreditasi {sd.akreditasi}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lembaga Pendidikan Non-Formal & Keagamaan */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="p-2.5 min-[380px]:p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">PAUD / TK</p>
          <h4 className="text-xs min-[380px]:text-sm sm:text-xl font-bold text-slate-800 mt-1">6 Unit</h4>
          <p className="text-[8px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2 line-clamp-2">Pendidikan pra-sekolah dusun.</p>
        </div>

        <div className="p-2.5 min-[380px]:p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keagamaan</p>
          <h4 className="text-xs min-[380px]:text-sm sm:text-xl font-bold text-slate-800 mt-1">9 TPQ</h4>
          <p className="text-[8px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2 line-clamp-2">Madrasah & Al-Qur'an anak.</p>
        </div>

        <div className="p-2.5 min-[380px]:p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pesantren</p>
          <h4 className="text-xs min-[380px]:text-sm sm:text-xl font-bold text-slate-800 mt-1">2 Ponpes</h4>
          <p className="text-[8px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2 line-clamp-2">Pusat kajian santri desa.</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. TAB KESEHATAN
// ==========================================
function KesehatanTab() {
  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Top Health Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-emerald-200 uppercase tracking-wider">BPJS / KIS</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black mt-1 sm:mt-2 font-display">94.8%</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-emerald-100/80 mt-0.5 sm:mt-1">Jaminan kesehatan</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stunting</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-emerald-600 mt-1 sm:mt-2 font-display">4.2%</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Status Hijau (Aman)</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posyandu</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 font-display">9 Pos</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Balita & Lansia</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobil Siaga</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-blue-600 mt-1 sm:mt-2 font-display">24 Jam</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Antar-jemput darurat</p>
        </Card>
      </div>

      {/* Fasilitas Layanan Kesehatan */}
      <Card className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3 sm:space-y-4">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Fasilitas & Tenaga Kesehatan di Desa</h3>
        <div className="grid md:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 sm:space-y-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">PKD / Poskesdes Gintungreja</h4>
            <p className="text-[10px] sm:text-xs text-slate-500">Pusat Kesehatan Desa melayani pemeriksaan dasar, imunisasi, dan rujukan Puskesmas.</p>
            <span className="inline-block text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">Bidan Desa Siaga</span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 sm:space-y-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Rumah Desa Sehat (RDS)</h4>
            <p className="text-[10px] sm:text-xs text-slate-500">Forum koordinasi konvergensi pencegahan stunting & pemenuhan gizi keluarga.</p>
            <span className="inline-block text-[9px] sm:text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">Program Konvergensi</span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 sm:space-y-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Posbindu PTM Lansia</h4>
            <p className="text-[10px] sm:text-xs text-slate-500">Pemeriksaan tensi, gula darah, dan kolesterol berkala bagi warga usia lanjut.</p>
            <span className="inline-block text-[9px] sm:text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">Skrining Rutin</span>
          </div>
        </div>
      </Card>

      {/* Program Penurunan Stunting */}
      <Card className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Tren Penurunan Stunting (2021 - 2025)</h3>
          <p className="text-[10px] sm:text-xs text-slate-500">Kerja keras kader Posyandu, Bidan Desa, dan Pemdes menekan stunting secara berkelanjutan.</p>
        </div>

        <div className="grid grid-cols-5 gap-1 min-[380px]:gap-1.5 sm:gap-3 pt-1 sm:pt-2">
          {[
            { year: '2021', rate: '14.8%', status: 'Waspada', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
            { year: '2022', rate: '11.2%', status: '-3.6%', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
            { year: '2023', rate: '8.4%', status: 'Aman', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
            { year: '2024', rate: '5.8%', status: 'Terkendali', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
            { year: '2025', rate: '4.2%', status: 'Hijau', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
          ].map((item, idx) => (
            <div key={idx} className={cn("p-1.5 min-[380px]:p-2 sm:p-4 rounded-xl sm:rounded-2xl border text-center", item.bg)}>
              <span className="text-[7px] min-[380px]:text-[8px] sm:text-[10px] font-bold uppercase tracking-wider opacity-80 block truncate">
                <span className="sm:hidden">{item.year}</span>
                <span className="hidden sm:inline">Tahun {item.year}</span>
              </span>
              <h4 className="text-xs min-[380px]:text-sm sm:text-2xl font-black mt-0.5 sm:mt-1 font-display">{item.rate}</h4>
              <p className="text-[7px] min-[380px]:text-[8px] sm:text-[10px] font-bold mt-0.5 sm:mt-1 truncate">{item.status}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// 4. TAB SOSIAL
// ==========================================
function SosialTab() {
  const bansosList = [
    { program: 'Program Keluarga Harapan (PKH)', kpm: '420 KPM', desc: 'Bantuan bersyarat bidang kesehatan & pendidikan', budget: 'Kemensos RI' },
    { program: 'Bantuan Pangan Non Tunai (BPNT)', kpm: '580 KPM', desc: 'Penyaluran sembako pangan bergizi', budget: 'Kemensos RI' },
    { program: 'Bantuan Langsung Tunai (BLT Dana Desa)', kpm: '65 KPM', desc: 'Keluarga miskin ekstrem dan lansia tunggal', budget: 'APBDes Gintungreja' },
    { program: 'Penerima Bantuan Iuran JKN (PBI-JK)', kpm: '3.210 Jiwa', desc: 'Iuran jaminan kesehatan BPJS gratis', budget: 'Pemerintah Pusat' },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="rounded-2xl sm:rounded-3xl p-2.5 min-[380px]:p-3 sm:p-6 bg-gradient-to-br from-purple-700 to-indigo-900 text-white shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-purple-200 uppercase tracking-wider">Penerima</p>
          <h3 className="text-base min-[380px]:text-lg sm:text-3xl font-black mt-1 sm:mt-2 font-display">1.065</h3>
          <p className="text-[8px] min-[380px]:text-[10px] sm:text-xs text-purple-100/80 mt-0.5 sm:mt-1 leading-tight line-clamp-2">KPM DTKS</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-2.5 min-[380px]:p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lembaga</p>
          <h3 className="text-base min-[380px]:text-lg sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 font-display">6 LKD</h3>
          <p className="text-[8px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-tight line-clamp-2">PKK, Karang Taruna</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-2.5 min-[380px]:p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Poskamling</p>
          <h3 className="text-base min-[380px]:text-lg sm:text-3xl font-black text-emerald-600 mt-1 sm:mt-2 font-display">100%</h3>
          <p className="text-[8px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-tight line-clamp-2">37 RT rutin</p>
        </Card>
      </div>

      {/* Tabel Bantuan Sosial */}
      <Card className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Penyaluran Program Jaring Pengaman Sosial</h3>
          <p className="text-[10px] sm:text-xs text-slate-500">Program bansos resmi terverifikasi DTKS Kemensos di Gintungreja.</p>
        </div>

        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left text-[10px] sm:text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[8px] sm:text-[10px]">
                <th className="py-2 px-2 sm:py-3 sm:px-4 font-bold">Nama Program</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 font-bold hidden sm:table-cell">Deskripsi Manfaat</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 font-bold text-center">Penerima</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 font-bold text-right">Sumber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bansosList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4">
                    <p className="font-bold text-slate-800 text-[10px] sm:text-xs">{item.program}</p>
                    <p className="text-[9px] text-slate-500 sm:hidden mt-0.5 line-clamp-1">{item.desc}</p>
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-slate-600 hidden sm:table-cell">{item.desc}</td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-center font-bold text-emerald-700 whitespace-nowrap">{item.kpm}</td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-right">
                    <span className="bg-slate-100 text-slate-700 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold whitespace-nowrap">{item.budget}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lembaga Sosial & Partisipasi Warga */}
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2 sm:space-y-3">
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
            <Users className="h-4 w-4 text-primary shrink-0" />
            Lembaga Kemasyarakatan Desa (LKD)
          </h4>
          <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
            Pemberdayaan masyarakat didukung oleh organisasi aktif seperti TP-PKK (12 Pokja aktif), Karang Taruna Tunas Harapan (kegiatan pemuda & olahraga), LPMD (perencanaan pembangunan), serta Satgas Linmas beranggotakan 35 personel siaga bencana & kamtibmas.
          </p>
        </div>

        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2 sm:space-y-3">
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
            <Heart className="h-4 w-4 text-red-500 shrink-0" />
            Kearifan Lokal & Gotong Royong
          </h4>
          <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
            Masyarakat Desa Gintungreja senantiasa memelihara tradisi gotong royong seperti Sedekah Bumi tahunan, Sadranan, kerja bakti lingkungan mingguan, dan tradisi Sambatan bedah rumah warga prasejahtera.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. TAB EKONOMI
// ==========================================
function EkonomiTab() {
  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Top Economic Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-amber-200 uppercase tracking-wider">Pertanian</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black mt-1 sm:mt-2 font-display">62%</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-amber-100/80 mt-0.5 sm:mt-1">Tulang punggung warga</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Padi Tahunan</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 font-display">1.450 Ton</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-emerald-600 font-semibold mt-0.5 sm:mt-1">480+ Ha sawah</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gula Semut</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 font-display">320 Ton</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Komoditas ekspor</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">UMKM</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-primary mt-1 sm:mt-2 font-display">140+</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Unit usaha mikro</p>
        </Card>
      </div>

      {/* Komoditas & Populasi Ternak */}
      <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
        <Card className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 sm:gap-2">
            <Sprout className="h-4 w-4 text-emerald-600 shrink-0" />
            Komoditas Pertanian & Perkebunan
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {[
              { name: 'Padi Sawah (IR-64 & Ciherang)', yield: '1.450 Ton / thn', area: '480 Ha' },
              { name: 'Kelapa & Nira Gula Jawa / Semut', yield: '320 Ton / thn', area: '180 Ha' },
              { name: 'Jagung Hibrida & Pipil', yield: '210 Ton / thn', area: '65 Ha' },
              { name: 'Singkong & Umbi-umbian', yield: '180 Ton / thn', area: '45 Ha' },
              { name: 'Hortikultura (Cabai, Sayur)', yield: '95 Ton / thn', area: '30 Ha' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] sm:text-xs">
                <div>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-[9px] text-slate-500">Estimasi: {item.area}</p>
                </div>
                <span className="font-black text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md shrink-0">{item.yield}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 sm:gap-2">
            <Coins className="h-4 w-4 text-amber-600 shrink-0" />
            Populasi Ternak & BUMDes Gintungreja
          </h3>
          <div className="space-y-2.5 sm:space-y-3">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border text-center">
                <p className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Sapi</p>
                <p className="text-base min-[380px]:text-lg sm:text-xl font-black text-slate-800 mt-0.5 sm:mt-1">240</p>
                <p className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-500">Ekor</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border text-center">
                <p className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Kambing</p>
                <p className="text-base min-[380px]:text-lg sm:text-xl font-black text-slate-800 mt-0.5 sm:mt-1">890</p>
                <p className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-500">Ekor</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border text-center">
                <p className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Unggas</p>
                <p className="text-base min-[380px]:text-lg sm:text-xl font-black text-slate-800 mt-0.5 sm:mt-1">12K+</p>
                <p className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-500">Ekor</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 sm:space-y-1.5">
              <h4 className="font-bold text-emerald-950 text-[10px] sm:text-xs uppercase tracking-wider">BUMDes Makmur Gintungreja</h4>
              <p className="text-[10px] sm:text-xs text-emerald-900 leading-relaxed">
                Mengelola unit simpan pinjam desa, penyaluran sarana pertanian (pupuk & benih), air bersih Pamsimas, dan kemitraan pemasaran produk gula semut UMKM.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// 6. TAB PEMBANGUNAN DESA
// ==========================================
function PembangunanTab() {
  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Overview APBDes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-gradient-to-br from-emerald-800 to-slate-900 text-white shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-emerald-200 uppercase tracking-wider">APBDes</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black mt-1 sm:mt-2 font-display">98.4%</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-emerald-100/80 mt-0.5 sm:mt-1">Serapan anggaran</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jalan Desa</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 font-display">42 Km</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-emerald-600 font-semibold mt-0.5 sm:mt-1">88% Kondisi Mantap</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drainase</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 font-display">28 Km</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Irigasi & saluran air</p>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white border-slate-100 shadow-sm">
          <p className="text-[8px] min-[380px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider">PJU</p>
          <h3 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-amber-600 mt-1 sm:mt-2 font-display">350 Titik</h3>
          <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Penerangan 5 dusun</p>
        </Card>
      </div>

      {/* Program Pembangunan Prioritas */}
      <Card className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3 sm:space-y-4">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Capaian Infrastruktur & Fasilitas Publik</h3>
        <div className="grid md:grid-cols-2 gap-2.5 sm:gap-4">
          {[
            {
              title: 'Peningkatan Jalan Usaha Tani & Poros Desa',
              desc: 'Rabat beton dan pengaspalan hotmix menghubungkan sentra pertanian antar-dusun menuju jalan kabupaten.',
              status: 'Selesai 100%',
              tag: 'Infrastruktur Jalan'
            },
            {
              title: 'Pembangunan Jaringan Air Bersih Pamsimas',
              desc: 'Instalasi pipa air bersih dan tandon utama melayani kebutuhan 1.200+ sambungan rumah tangga.',
              status: 'Aktif Beroperasi',
              tag: 'Sanitasi & Air'
            },
            {
              title: 'Rehabilitasi Rumah Tidak Layak Huni (RTLH)',
              desc: 'Bantuan stimulan bedah rumah swadaya untuk 45 unit rumah keluarga prasejahtera.',
              status: 'Tuntas 45 Unit',
              tag: 'Perumahan Warga'
            },
            {
              title: 'Gedung Serbaguna & Sarana Olahraga Desa',
              desc: 'Fasilitas pertemuan umum, lapangan bola voli, dan lapangan sepak bola Gintungreja.',
              status: 'Fasilitas Umum',
              tag: 'Sarana Olahraga'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                  {item.tag}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {item.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{item.title}</h4>
              <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// 7. TAB SDGS DESA (18 GOL PEMBANGUNAN)
// ==========================================
function SDGsTab() {
  const sdgsGoals = [
    { no: 1, title: 'Desa Tanpa Kemiskinan', score: 84.5, color: '#e5243b', status: 'Sangat Baik' },
    { no: 2, title: 'Desa Tanpa Kelaparan', score: 88.0, color: '#dda63a', status: 'Sangat Baik' },
    { no: 3, title: 'Desa Sehat dan Sejahtera', score: 91.2, color: '#4c9f38', status: 'Unggul' },
    { no: 4, title: 'Pendidikan Desa Berkualitas', score: 86.8, color: '#c5192d', status: 'Sangat Baik' },
    { no: 5, title: 'Keterlibatan Perempuan Desa', score: 78.5, color: '#ff3a21', status: 'Baik' },
    { no: 6, title: 'Desa Layak Air Bersih & Sanitasi', score: 92.0, color: '#26bde2', status: 'Unggul' },
    { no: 7, title: 'Desa Berenergi Bersih & Terbarukan', score: 74.0, color: '#fcc30b', status: 'Baik' },
    { no: 8, title: 'Pertumbuhan Ekonomi Desa Merata', score: 76.5, color: '#a21942', status: 'Baik' },
    { no: 9, title: 'Infrastruktur & Inovasi Desa', score: 85.0, color: '#fd6925', status: 'Sangat Baik' },
    { no: 10, title: 'Desa Tanpa Kesenjangan', score: 79.0, color: '#dd1367', status: 'Baik' },
    { no: 11, title: 'Kawasan Permukiman Aman & Nyaman', score: 88.4, color: '#fd9d24', status: 'Sangat Baik' },
    { no: 12, title: 'Konsumsi & Produksi Sadar Lingkungan', score: 70.2, color: '#bf8b2e', status: 'Baik' },
    { no: 13, title: 'Desa Tanggap Perubahan Iklim', score: 72.5, color: '#3f7e44', status: 'Baik' },
    { no: 14, title: 'Desa Peduli Lingkungan Laut/Perairan', score: 68.0, color: '#0a97d9', status: 'Cukup' },
    { no: 15, title: 'Desa Peduli Lingkungan Darat', score: 82.0, color: '#56c02b', status: 'Sangat Baik' },
    { no: 16, title: 'Desa Damai Berkeadilan', score: 94.0, color: '#00689d', status: 'Unggul' },
    { no: 17, title: 'Kemitraan untuk Pembangunan Desa', score: 80.5, color: '#19486a', status: 'Sangat Baik' },
    { no: 18, title: 'Kelembagaan Desa Dinamis & Budaya Adaptif', score: 85.2, color: '#00457c', status: 'Sangat Baik' },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Banner SDGs */}
      <div className="p-4 min-[380px]:p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-900 via-teal-900 to-emerald-900 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
          <Badge className="bg-white/20 text-white text-[8px] min-[380px]:text-[10px] font-black uppercase tracking-widest border-none">
            SDGs Desa
          </Badge>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black font-display tracking-tight">
            Skor SDGs: 72.84
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-200 leading-relaxed">
            Pencapaian 18 tujuan pembangunan berkelanjutan desa untuk mewujudkan Desa Gintungreja yang mandiri dan berdaya saing.
          </p>
        </div>
      </div>

      {/* 18 Goals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {sdgsGoals.map((g) => (
          <div
            key={g.no}
            className="p-2.5 min-[380px]:p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-2 sm:space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span
                className="h-5 w-5 min-[380px]:h-6 min-[380px]:w-6 sm:h-7 sm:w-7 rounded-md sm:rounded-lg text-white font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0"
                style={{ backgroundColor: g.color }}
              >
                {g.no}
              </span>
              <span className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[80px] sm:max-w-none text-center">
                {g.status}
              </span>
            </div>

            <h4 className="font-bold text-slate-800 text-[11px] min-[380px]:text-xs sm:text-sm leading-tight line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
              {g.title}
            </h4>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] sm:text-xs font-bold">
                <span className="text-slate-400 text-[8px] sm:text-[10px] uppercase tracking-wider">Capaian</span>
                <span className="text-slate-900">{g.score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 sm:h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${g.score}%`, backgroundColor: g.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. TAB INDEKS DESA (INDEKS DESA 2025)
// ==========================================
function IndeksTab() {
  const [activeSubTab, setActiveSubTab] = useState<'gintungreja' | 'karanggintung' | 'komparasi'>('gintungreja');

  // Data Profil Desa Gintungreja (Status: Maju)
  const gintungrejaStats = [
    { score: 'Skor 5 (Sangat Baik)', count: 74, percent: 58.3, desc: 'Layanan kesehatan lengkap, sanitasi terpadu, pusat ekonomi aktif, dan BUMDes.', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300', barColor: '#D97706' },
    { score: 'Skor 4 (Baik)', count: 6, percent: 4.7, desc: 'Ketersediaan fasilitas umum dan penunjang berada pada level memadai.', badgeColor: 'bg-orange-100 text-orange-900 border-orange-300', barColor: '#EA580C' },
    { score: 'Skor 3 (Sedang)', count: 18, percent: 14.2, desc: 'Aksesibilitas dan partisipasi warga pada tingkat menengah.', badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300', barColor: '#CA8A04' },
    { score: 'Skor 2 (Rendah)', count: 5, percent: 3.9, desc: 'Layanan atau sarana penunjang masih terbatas.', badgeColor: 'bg-stone-100 text-stone-900 border-stone-300', barColor: '#78716C' },
    { score: 'Skor 1 (Sangat Kurang)', count: 24, percent: 18.9, desc: 'Jalan tanah, penurunan PADes, ketiadaan HAKI, & mitigasi bencana nihil.', badgeColor: 'bg-rose-100 text-rose-900 border-rose-300', barColor: '#BE123C' },
  ];

  // Data Profil Desa Karanggintung (Status: Berkembang)
  const karanggintungStats = [
    { score: 'Skor 5 (Sangat Baik)', count: 65, percent: 51.1, desc: 'Partisipasi pendidikan dasar (100%), gotong royong aktif, & administrasi harian.', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300', barColor: '#D97706' },
    { score: 'Skor 4 (Baik)', count: 6, percent: 4.7, desc: 'Layanan dan sarana kelembagaan cukup memadai.', badgeColor: 'bg-orange-100 text-orange-900 border-orange-300', barColor: '#EA580C' },
    { score: 'Skor 3 (Sedang)', count: 14, percent: 11.0, desc: 'Aksesibilitas sosial dan ekonomi pada taraf rata-rata.', badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300', barColor: '#CA8A04' },
    { score: 'Skor 2 (Rendah)', count: 4, percent: 3.1, desc: 'Ketersediaan sarana pendukung sangat minim.', badgeColor: 'bg-stone-100 text-stone-900 border-stone-300', barColor: '#78716C' },
    { score: 'Skor 1 (Sangat Kurang)', count: 38, percent: 29.9, desc: 'Tanpa dokter, tanpa pasar/bank, sanitasi sampah & mitigasi bencana nihil.', badgeColor: 'bg-rose-100 text-rose-900 border-rose-300', barColor: '#BE123C' },
  ];

  // Komparasi Metrik Langsung
  const comparisonMetrics = [
    { label: 'Status Indeks Desa', gintungreja: 'MAJU', karanggintung: 'BERKEMBANG', highlight: true },
    { label: 'Total Skor Perolehan', gintungreja: '482 / 635 (75.9%)', karanggintung: '437 / 635 (68.8%)', highlight: true },
    { label: 'Rata-rata Skor (Skala 5)', gintungreja: '3.80', karanggintung: '3.44', highlight: true },
    { label: 'Indikator Sangat Baik (Skor 5)', gintungreja: '74 Indikator (58.3%)', karanggintung: '65 Indikator (51.1%)' },
    { label: 'Indikator Kritis (Skor 1)', gintungreja: '24 Indikator (18.9%)', karanggintung: '38 Indikator (29.9%)' },
    { label: 'Layanan Tenaga Kesehatan', gintungreja: 'Dokter, Bidan, Nakes Lengkap', karanggintung: 'Tidak ada Dokter' },
    { label: 'Transportasi Rujukan Faskes', gintungreja: 'Tersedia Transportasi', karanggintung: 'Tidak Tersedia' },
    { label: 'Sanitasi & Pengolahan Limbah', gintungreja: 'Optimal, Nihil Pencemaran', karanggintung: 'Belum Berjalan (Skor Terendah)' },
    { label: 'Pasar Desa & Layanan Bank/KUR', gintungreja: 'Tersedia & BUMDes Berbadan Hukum', karanggintung: 'Tidak Ada Pasar, Bank & KUD' },
    { label: 'Kondisi Jalan Poros Utama', gintungreja: 'Mayoritas Permukaan Tanah', karanggintung: 'Aspal/Beton Rusak Sedang' },
    { label: 'Pendidikan Menengah (SMA/SMK)', gintungreja: 'Sangat Sulit (Skor 1)', karanggintung: 'Sangat Sulit (Skor 1)' },
    { label: 'Basis Data Mitigasi Bencana', gintungreja: 'Belum Memiliki (Skor 1)', karanggintung: 'Belum Memiliki (Skor 1)' },
    { label: 'Tren Pendapatan Asli Desa (PADes)', gintungreja: 'Tercatat Menurun', karanggintung: 'Meningkat Stabil' },
  ];

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Top Header Banner Laporan Analisis */}
      <div className="rounded-2xl sm:rounded-3xl p-4 min-[380px]:p-6 sm:p-8 bg-gradient-to-br from-[#16110E] via-[#2A1E17] to-[#16110E] text-white shadow-xl relative overflow-hidden border border-amber-900/30">
        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[9px] sm:text-xs font-black uppercase tracking-widest">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Laporan Analisis Statistik Indeks Desa 2025
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-stone-300 text-[9px] sm:text-xs font-bold uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              Kecamatan Gandrungmangu, Kabupaten Cilacap
            </span>
          </div>

          <div className="grid md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 space-y-1.5">
              <h2 className="text-xl min-[380px]:text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight">
                Evaluasi Kinerja Indeks Desa 2025
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
                Berdasarkan pengukuran resmi <strong>Indeks Desa 2025</strong>, Desa Gintungreja telah menembus status <strong>DESA MAJU</strong> dengan skor <strong>482 / 635</strong> (rata-rata <strong>3.80</strong>). Disajikan komparasi mendalam dengan Desa Karanggintung (Status: Berkembang) beserta 3 agenda strategis lintas desa.
              </p>
            </div>

            {/* Quick Hero Badge */}
            <div className="md:col-span-4 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-amber-500/20 text-center space-y-2">
              <p className="text-[10px] uppercase font-black tracking-widest text-amber-300">Status Resmi Gintungreja</p>
              <div className="text-2xl sm:text-3xl font-black font-display text-white uppercase tracking-wider">
                Desa Maju
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-around text-center">
                <div>
                  <p className="text-[8.5px] uppercase font-bold text-stone-400">Total Skor</p>
                  <p className="text-base sm:text-lg font-black text-amber-300">482 <span className="text-xs font-normal text-stone-300">/ 635</span></p>
                </div>
                <div>
                  <p className="text-[8.5px] uppercase font-bold text-stone-400">Rata-rata</p>
                  <p className="text-base sm:text-lg font-black text-amber-300">3.80 <span className="text-xs font-normal text-stone-300">/ 5</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigasi Tiga Tampilan */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl border border-stone-200/80">
        <button
          onClick={() => setActiveSubTab('gintungreja')}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
            activeSubTab === 'gintungreja'
              ? "bg-[#C45528] text-white shadow-md"
              : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
          )}
        >
          <Award className="h-4 w-4 shrink-0" />
          <span>Desa Gintungreja (Maju)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('karanggintung')}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
            activeSubTab === 'karanggintung'
              ? "bg-stone-800 text-white shadow-md"
              : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
          )}
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span>Desa Karanggintung (Berkembang)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('komparasi')}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
            activeSubTab === 'komparasi'
              ? "bg-[#B45309] text-white shadow-md"
              : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
          )}
        >
          <Scale className="h-4 w-4 shrink-0" />
          <span>Komparasi & Rekomendasi Lintas Desa</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. VIEW: PROFIL DESA GINTUNGREJA (STATUS: MAJU)           */}
      {/* ======================================================== */}
      {activeSubTab === 'gintungreja' && (
        <div className="space-y-5 sm:space-y-8 animate-in fade-in duration-300">
          {/* KPI 5 Skor Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-amber-200/80 shadow-xs space-y-1">
              <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Skor 5 (Sangat Baik)</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-display">74 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-amber-700">58.3% Maksimal</p>
            </Card>

            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-orange-200/80 shadow-xs space-y-1">
              <p className="text-[9px] font-bold text-orange-700 uppercase tracking-wider">Skor 4 (Baik)</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-display">6 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-orange-700">4.7% Memadai</p>
            </Card>

            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-yellow-200/80 shadow-xs space-y-1">
              <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-wider">Skor 3 (Sedang)</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-display">18 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-yellow-700">14.2% Menengah</p>
            </Card>

            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-stone-200/80 shadow-xs space-y-1">
              <p className="text-[9px] font-bold text-stone-600 uppercase tracking-wider">Skor 2 (Rendah)</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-display">5 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-stone-600">3.9% Terbatas</p>
            </Card>

            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-rose-200/80 shadow-xs space-y-1 col-span-2 sm:col-span-1">
              <p className="text-[9px] font-bold text-rose-700 uppercase tracking-wider">Skor 1 (Sangat Kurang)</p>
              <h4 className="text-xl sm:text-2xl font-black text-rose-700 font-display">24 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-rose-700">18.9% Perlu Benahi</p>
            </Card>
          </div>

          {/* Visual Progress Bar Distribusi Skor */}
          <Card className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Distribusi Kinerja 127 Indikator — Gintungreja</h3>
                <p className="text-[10px] sm:text-xs text-slate-500">Total Skor: 482 / 635 • Rata-rata Skor: 3.80 • Status: Maju</p>
              </div>
              <Badge className="bg-amber-600 text-white font-bold text-[10px] px-2.5 py-0.5 self-start sm:self-auto">Status: Maju</Badge>
            </div>

            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              {gintungrejaStats.map((item, idx) => (
                <div
                  key={idx}
                  style={{ width: `${item.percent}%`, backgroundColor: item.barColor }}
                  title={`${item.score}: ${item.count} (${item.percent}%)`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[9px] sm:text-[11px] font-semibold text-slate-700">
              {gintungrejaStats.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.barColor }} />
                  <span className="truncate">{item.score.split(' ')[0]} {item.score.split(' ')[1]}: <strong>{item.count}</strong> ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Dua Kolom: Kekuatan Utama vs Area Prioritas Evaluasi */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Kekuatan Utama */}
            <Card className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border-amber-200/90 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2.5 border-b pb-3">
                <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">Kekuatan Utama Desa Gintungreja</h3>
                  <p className="text-[10px] sm:text-xs text-amber-800 font-bold">Pilar Keunggulan Menuju Status Maju</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Stethoscope className="h-4 w-4 text-amber-700" /> Fasilitas Kesehatan Komprehensif
                    </h4>
                    <Badge className="bg-amber-600 text-white text-[9px] font-bold">Skor 5</Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Layanan kesehatan sangat komprehensif; dokter, bidan, dan nakes lainnya telah tersedia di desa beserta sarana transportasi penunjang rujukan faskes.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sprout className="h-4 w-4 text-amber-700" /> Sanitasi Lingkungan & Limbah Optimal
                    </h4>
                    <Badge className="bg-amber-600 text-white text-[9px] font-bold">Skor 5</Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Tata lingkungan berjalan optimal dengan tangki septik (komunal/individu) yang berfungsi baik, sistem limbah terstruktur, dan nihil kasus pencemaran lingkungan.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Store className="h-4 w-4 text-amber-700" /> Pusat Ekonomi Desa & BUMDes
                    </h4>
                    <Badge className="bg-amber-600 text-white text-[9px] font-bold">Skor 5</Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Aktivitas ekonomi desa aktif didukung adanya pasar desa, deretan pertokoan, layanan perbankan, fasilitas akses kredit (KUR), serta BUMDes yang sudah berbadan hukum.
                  </p>
                </div>
              </div>
            </Card>

            {/* Area Prioritas Evaluasi */}
            <Card className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border-rose-200/90 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2.5 border-b pb-3">
                <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                  <AlertTriangle className="h-5 w-5 text-rose-700" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">Area Prioritas Evaluasi</h3>
                  <p className="text-[10px] sm:text-xs text-rose-700 font-bold">Fokus Intervensi Peningkatan Kualitas</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-rose-700" /> Kapasitas Ekonomi Lanjutan & HAKI
                    </h4>
                    <Badge className="bg-rose-600 text-white text-[9px] font-bold">Skor 1</Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Pendapatan Asli Desa (PADes) tercatat mengalami penurunan. Selain itu, merek dagang untuk produk unggulan desa (seperti gula semut/kelapa) belum terdaftar secara legal (HAKI).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-rose-700" /> Infrastruktur Fisik Jalan Poros
                    </h4>
                    <Badge className="bg-rose-600 text-white text-[9px] font-bold">Skor 1</Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Mayoritas permukaan jalan utama desa masih berupa tanah, yang dapat menghambat mobilitas dan distribusi logistik hasil panen warga saat musim penghujan tiba.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-rose-700" /> Basis Data Informasi Kebencanaan
                    </h4>
                    <Badge className="bg-rose-600 text-white text-[9px] font-bold">Skor 1</Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Pemerintah desa belum memiliki basis data mitigasi bencana terstruktur, seperti Indeks Risiko Bencana Desa dan Peta Rawan Bencana Terintegrasi.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. VIEW: PROFIL DESA KARANGGINTUNG (STATUS: BERKEMBANG)  */}
      {/* ======================================================== */}
      {activeSubTab === 'karanggintung' && (
        <div className="space-y-5 sm:space-y-8 animate-in fade-in duration-300">
          {/* Header Desa Pembanding */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Desa Pembanding di Wilayah Kecamatan Gandrungmangu</p>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">Profil Desa Karanggintung — Status: Berkembang</h3>
            </div>
            <Badge className="bg-stone-700 text-white text-xs px-3 py-1 self-start sm:self-auto">Total Skor: 437 / 635 (Rata-rata: 3.44)</Badge>
          </div>

          {/* KPI 5 Skor Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-amber-200/80 shadow-xs space-y-1">
              <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Skor 5 (Sangat Baik)</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-display">65 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-amber-700">51.1% Maksimal</p>
            </Card>

            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-orange-200/80 shadow-xs space-y-1">
              <p className="text-[9px] font-bold text-orange-700 uppercase tracking-wider">Skor 4 (Baik)</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-display">6 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-orange-700">4.7% Memadai</p>
            </Card>

            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-yellow-200/80 shadow-xs space-y-1">
              <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-wider">Skor 3 (Sedang)</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-display">14 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-yellow-700">11.0% Menengah</p>
            </Card>

            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-stone-200/80 shadow-xs space-y-1">
              <p className="text-[9px] font-bold text-stone-600 uppercase tracking-wider">Skor 2 (Rendah)</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-display">4 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-stone-600">3.1% Terbatas</p>
            </Card>

            <Card className="rounded-2xl p-3 sm:p-4 bg-white border-rose-200/80 shadow-xs space-y-1 col-span-2 sm:col-span-1">
              <p className="text-[9px] font-bold text-rose-700 uppercase tracking-wider">Skor 1 (Sangat Kurang)</p>
              <h4 className="text-xl sm:text-2xl font-black text-rose-700 font-display">38 <span className="text-xs font-normal text-slate-500">Indikator</span></h4>
              <p className="text-[10px] font-bold text-rose-700">29.9% Perlu Benahi</p>
            </Card>
          </div>

          {/* Visual Progress Bar Karanggintung */}
          <Card className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Distribusi Kinerja 127 Indikator — Karanggintung</h3>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              {karanggintungStats.map((item, idx) => (
                <div
                  key={idx}
                  style={{ width: `${item.percent}%`, backgroundColor: item.barColor }}
                  title={`${item.score}: ${item.count} (${item.percent}%)`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[9px] sm:text-[11px] font-semibold text-slate-700">
              {karanggintungStats.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.barColor }} />
                  <span className="truncate">{item.score.split(' ')[0]} {item.score.split(' ')[1]}: <strong>{item.count}</strong> ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Dua Kolom: Kekuatan Utama vs Area Prioritas Evaluasi Karanggintung */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Kekuatan Karanggintung */}
            <Card className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border-amber-200/90 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2.5 border-b pb-3">
                <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">Kekuatan Utama Karanggintung</h3>
                  <p className="text-[10px] sm:text-xs text-amber-800 font-bold">Pendidikan Dasar, Sosial, & PADes</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-amber-700" /> Partisipasi Pendidikan Dasar Penuh
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Partisipasi pendidikan dasar jenjang SD hingga SMP mencapai 100% dengan akses fasilitas yang sangat mudah dijangkau warga.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-amber-700" /> Ketahanan Sosial & Gotong Royong
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Keaktifan sosial masyarakat sangat tinggi yang diwujudkan melalui kegiatan gotong royong rutin dan ronda Satkamling aktif di setiap lingkungan.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-amber-700" /> Tata Kelola Harian & Stabilitas PADes
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Pelayanan administrasi pemerintah desa beroperasi aktif setiap hari kerja dan Pendapatan Asli Desa (PADes) tercatat meningkat secara stabil.
                  </p>
                </div>
              </div>
            </Card>

            {/* Area Prioritas Evaluasi Karanggintung */}
            <Card className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border-rose-200/90 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2.5 border-b pb-3">
                <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                  <AlertTriangle className="h-5 w-5 text-rose-700" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">Area Prioritas Evaluasi Karanggintung</h3>
                  <p className="text-[10px] sm:text-xs text-rose-700 font-bold">Kesehatan, Ekonomi & Lingkungan Kritis</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4 text-rose-700" /> Ketiadaan Layanan Dokter & Ambulans
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Tidak terdapat layanan dokter di desa, serta ketiadaan sarana transportasi penunjang fasilitas kesehatan untuk rujukan warga darurat.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Store className="h-4 w-4 text-rose-700" /> Nihil Pasar Desa, Bank & KUD
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Tidak tersedia fasilitas pasar desa, lembaga perbankan, dan KUD. Akses angkutan umum juga sangat minim beroperasi di wilayah desa.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Sprout className="h-4 w-4 text-rose-700" /> Pengelolaan Sampah & Mitigasi Nihil
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Sistem pengelolaan sampah, sarana mitigasi bencana, dan program pelestarian lingkungan sama sekali belum berjalan (mencatat skor terendah).
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VIEW: KOMPARASI & REKOMENDASI LINTAS DESA            */}
      {/* ======================================================== */}
      {activeSubTab === 'komparasi' && (
        <div className="space-y-5 sm:space-y-8 animate-in fade-in duration-300">
          {/* Tabel Matriks Komparasi Langsung */}
          <Card className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">Matriks Perbandingan Indeks Desa 2025</h3>
              <p className="text-[10px] sm:text-xs text-slate-500">Perbandingan head-to-head indikator kunci Desa Gintungreja vs Desa Karanggintung.</p>
            </div>

            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[9px] sm:text-[10px]">
                    <th className="py-2.5 px-3 font-bold">Indikator Evaluasi</th>
                    <th className="py-2.5 px-3 font-bold text-amber-900 bg-amber-50/60 rounded-t-lg">Desa Gintungreja</th>
                    <th className="py-2.5 px-3 font-bold text-stone-900 bg-stone-50/80 rounded-t-lg">Desa Karanggintung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  {comparisonMetrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-800 flex items-center gap-1.5">
                        {row.highlight && <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
                        <span>{row.label}</span>
                      </td>
                      <td className="py-2.5 px-3 bg-amber-50/30 font-semibold">
                        {row.label === 'Status Indeks Desa' ? (
                          <Badge className="bg-[#C45528] text-white text-[10px] font-black px-2.5 py-0.5">{row.gintungreja}</Badge>
                        ) : (
                          <span className={cn(row.highlight ? "font-black text-slate-900" : "text-slate-700")}>{row.gintungreja}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 bg-stone-50/50 font-semibold">
                        {row.label === 'Status Indeks Desa' ? (
                          <Badge className="bg-stone-700 text-white text-[10px] font-black px-2.5 py-0.5">{row.karanggintung}</Badge>
                        ) : (
                          <span className={cn(row.highlight ? "font-black text-slate-900" : "text-slate-700")}>{row.karanggintung}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Card Kesimpulan Analisis Komparatif */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-50/90 border border-amber-200/90 text-amber-950 space-y-2">
            <h4 className="font-black text-sm sm:text-base uppercase tracking-wider text-amber-900 font-display flex items-center gap-2">
              <Scale className="h-5 w-5 text-amber-800" />
              Sintesis Analisis Komparatif
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Analisis komparatif menunjukkan bahwa <strong>Desa Gintungreja</strong> memiliki keunggulan mutlak pada <strong>kelengkapan infrastruktur ekonomi dan fasilitas kesehatan komprehensif</strong>, sementara <strong>Desa Karanggintung</strong> unggul pada <strong>fondasi ketahanan sosial dan stabilitas administrasi pendapatan asli desa</strong>.
            </p>
          </div>

          {/* 3 Agenda Strategis Lintas Desa */}
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 text-amber-800 font-black text-[9px] uppercase tracking-widest">
                <Target className="h-3.5 w-3.5 text-amber-700" />
                Rekomendasi Pemangku Kebijakan
              </div>
              <h3 className="text-base sm:text-xl font-black uppercase text-slate-900 font-display">
                3 Agenda Strategis Pembangunan Lintas Desa
              </h3>
              <p className="text-xs text-slate-500">Rekomendasi kolaboratif untuk mempercepat penguatan status indeks desa tahun berikutnya.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
              {/* Agenda 1 */}
              <Card className="rounded-2xl p-4 sm:p-5 bg-white border-amber-200/90 shadow-xs space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                    1
                  </div>
                  <h4 className="font-black text-sm text-slate-900 font-display">Penguatan Akses Pendidikan Menengah</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Kedua desa sama-sama memiliki kendala akses yang <em>"Sangat Sulit"</em> menuju jenjang pendidikan menengah atas (SMA/SMK/Sederajat). Diperlukan pengadaan transportasi bus pelajar khusus atau pengajuan unit sekolah menengah baru yang strategis bagi kedua desa.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-700">Solusi: Transportasi Pelajar / Unit Sekolah Baru</span>
                </div>
              </Card>

              {/* Agenda 2 */}
              <Card className="rounded-2xl p-4 sm:p-5 bg-white border-amber-200/90 shadow-xs space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-black text-xs">
                    2
                  </div>
                  <h4 className="font-black text-sm text-slate-900 font-display">Pendampingan Ekonomi Sektoral</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Desa Gintungreja memerlukan pendampingan pengurusan HAKI/merek dagang produk unggulan dan rekayasa strategi untuk menaikkan kembali PADes. Sebaliknya, Desa Karanggintung memerlukan intervensi pembangunan pasar desa dan pembentukan lembaga keuangan lokal.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-wider text-orange-700">Solusi: HAKI Produk & Pasar Desa</span>
                </div>
              </Card>

              {/* Agenda 3 */}
              <Card className="rounded-2xl p-4 sm:p-5 bg-white border-amber-200/90 shadow-xs space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-black text-xs">
                    3
                  </div>
                  <h4 className="font-black text-sm text-slate-900 font-display">Kerja Sama Antar-Desa (KAD)</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Kedua desa mencatat skor sangat rendah pada indikator kerja sama eksternal. Mengingat jarak administratif yang dekat, kolaborasi pengelolaan sampah terpadu dan penyediaan trayek angkutan umum bersama menjadi tuas efektif pendorong skor indeks.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-wider text-stone-700">Solusi: Bank Sampah Bersama & Trayek Angkot</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
