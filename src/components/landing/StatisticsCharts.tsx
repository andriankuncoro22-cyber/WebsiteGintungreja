'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Home, MapPin, Layers, Sparkles, Activity, PieChart as PieIcon, BarChart2 } from 'lucide-react';

const COLORS = ['#C25E34', '#D8902A', '#8B5A2B', '#C97D5D', '#E5A125'];

interface StatisticsChartsProps {
  statsDoc?: any;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataObj = payload[0].payload;
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-[#1C1613]/95 p-4 shadow-xl backdrop-blur-md text-white text-xs space-y-1 z-50">
        <p className="font-bold uppercase tracking-wider text-amber-200/80">{label || dataObj?.name || payload[0].name}</p>
        <p className="text-lg font-black font-mono text-amber-400">
          {Number(payload[0].value).toLocaleString('id-ID')} <span className="text-xs font-normal text-stone-300">jiwa</span>
        </p>
        {dataObj?.pct && (
          <p className="text-[11px] font-semibold text-amber-300/90">
            Proporsi: {dataObj.pct}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function StatisticsCharts({ statsDoc, isLoading }: StatisticsChartsProps) {
  const [chartView, setChartView] = useState<'dusun' | 'umur'>('dusun');

  const firestore = useFirestore();
  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profile } = useDoc<Record<string, any>>(profileRef);

  const population = statsDoc?.total || 7007;
  const areaKm = profile?.areaKm || profile?.area || profile?.luas || '6,10';
  const totalKK = statsDoc?.totalKK || 2250;
  const male = statsDoc?.maleCount ?? 3596;
  const female = statsDoc?.femaleCount ?? 3411;

  const genderData = useMemo(() => {
    const other = statsDoc?.otherCount ?? 0;
    return [
      { name: `Laki-laki (${male.toLocaleString('id-ID')} / 51,3%)`, value: male, pct: '51.3%' },
      { name: `Perempuan (${female.toLocaleString('id-ID')} / 48,7%)`, value: female, pct: '48.7%' },
      ...(other > 0 ? [{ name: 'Lainnya', value: other, pct: '0%' }] : []),
    ];
  }, [statsDoc, male, female]);

  const dusunDistribution = useMemo(() => {
    if (statsDoc?.dusunBreakdown && Array.isArray(statsDoc.dusunBreakdown) && statsDoc.dusunBreakdown.length > 0) {
      return statsDoc.dusunBreakdown;
    }
    return [
      { name: 'Dsn. Gintungreja', count: 2120, pct: '30.3%' },
      { name: 'Dsn. Sidakaya', count: 1840, pct: '26.3%' },
      { name: 'Dsn. Kedungwringin', count: 1620, pct: '23.1%' },
      { name: 'Dsn. Cihaur', count: 1427, pct: '20.4%' },
    ];
  }, [statsDoc]);

  const ageDistribution = useMemo(() => {
    return [
      { name: '0–4 Th', count: 565, pct: '5.8%' },
      { name: '5–9 Th', count: 679, pct: '7.0%' },
      { name: '10–14 Th', count: 686, pct: '7.0%' },
      { name: '15–19 Th', count: 670, pct: '6.9%' },
      { name: '20–24 Th', count: 697, pct: '7.2%' },
      { name: '25–29 Th', count: 752, pct: '7.7%' },
      { name: '30–34 Th', count: 747, pct: '7.7%' },
      { name: '35–39 Th', count: 672, pct: '6.9%' },
      { name: '40–44 Th', count: 641, pct: '6.6%' },
      { name: '45–49 Th', count: 630, pct: '6.5%' },
      { name: '50–54 Th', count: 615, pct: '6.3%' },
      { name: '55–59 Th', count: 580, pct: '6.0%' },
      { name: '60+ Th', count: 1412, pct: '14.5%' },
    ];
  }, []);

  if (isLoading) {
    return (
      <div className="mt-5 sm:mt-8 grid grid-cols-2 lg:grid-cols-3 gap-2 min-[380px]:gap-2.5 sm:gap-6">
        <Skeleton className="col-span-2 lg:col-span-1 h-[260px] sm:h-[340px] rounded-xl sm:rounded-[2rem]" />
        <Skeleton className="col-span-1 h-[240px] sm:h-[340px] rounded-xl sm:rounded-[2rem]" />
        <Skeleton className="col-span-1 h-[240px] sm:h-[340px] rounded-xl sm:rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="mt-5 sm:mt-8 grid grid-cols-2 lg:grid-cols-3 gap-2 min-[380px]:gap-2.5 sm:gap-6">
      {/* CARD 1: KILAS DATA WILAYAH & DEMOGRAFI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45 }}
        whileHover={{ y: -6, scale: 1.01 }}
        className="col-span-2 lg:col-span-1 relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border-2 border-amber-900/15 ring-1 ring-amber-500/15 bg-[#FFFDF9]/95 backdrop-blur-md p-3.5 sm:p-7 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
      >
        {/* Traditional corner bracket accent vector */}
        <div className="absolute top-2 right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-t-2 border-r-2 border-amber-700/25 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-b-2 border-l-2 border-amber-700/25 pointer-events-none" />

        <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-5">
            <div className="p-2 sm:p-3 bg-amber-50 text-amber-800 rounded-xl sm:rounded-2xl border-2 border-amber-900/10 shadow-xs">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">Demografi Resmi</p>
              <h4 className="text-sm sm:text-base font-bold text-stone-900">Kilas Data Wilayah & Penduduk</h4>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 pt-1">
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-stone-50/90 border border-stone-200/40">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
                <span className="text-[11px] sm:text-xs font-semibold text-stone-600">Total Penduduk</span>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-black text-stone-900 font-mono">{population.toLocaleString('id-ID')}</span>
                <span className="text-[9px] sm:text-[10px] text-stone-500 font-medium ml-1">Jiwa</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-50/70 border border-blue-100/50">
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-blue-700">Laki-laki</p>
                <p className="text-xs sm:text-sm font-black text-blue-900 font-mono mt-0.5">{male.toLocaleString('id-ID')} <span className="text-[8px] sm:text-[9px] font-semibold text-blue-600">(51%)</span></p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-rose-50/70 border border-rose-100/50">
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-rose-700">Perempuan</p>
                <p className="text-xs sm:text-sm font-black text-rose-900 font-mono mt-0.5">{female.toLocaleString('id-ID')} <span className="text-[8px] sm:text-[9px] font-semibold text-rose-600">(49%)</span></p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-stone-50/90 border border-stone-200/40">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
                <span className="text-[11px] sm:text-xs font-semibold text-stone-600">Kepala Keluarga (KK)</span>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-black text-stone-900 font-mono">{totalKK.toLocaleString('id-ID')}</span>
                <span className="text-[9px] sm:text-[10px] text-stone-500 font-medium ml-1">KK</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-stone-50/90 border border-stone-200/40">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
                <span className="text-[11px] sm:text-xs font-semibold text-stone-600">Luas & Kepadatan</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] sm:text-xs font-black text-stone-900 font-mono">{areaKm} km² · 986 jiwa/km²</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-50/60 border border-amber-200/50">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
                <span className="text-[11px] sm:text-xs font-semibold text-stone-700">Sex Ratio (Rasio Gender)</span>
              </div>
              <span className="text-[11px] sm:text-xs font-black text-amber-900 font-mono">104,10</span>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 flex items-center justify-between text-xs text-stone-500 font-medium border-t border-stone-200/60">
          <span className="flex items-center gap-1.5 text-amber-800 font-semibold text-[10px] sm:text-[11px]">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Data Resmi Desa Gintungreja
          </span>
          <span className="text-[8px] sm:text-[9px] uppercase font-bold text-stone-400">Kec. Gandrungmangu</span>
        </div>
      </motion.div>

      {/* CARD 2: KOMPOSISI JENIS KELAMIN (Satu baris kiri di mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        whileHover={{ y: -6, scale: 1.01 }}
        className="col-span-1 relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border-2 border-amber-900/15 ring-1 ring-amber-500/15 bg-[#FFFDF9]/95 backdrop-blur-md p-3 min-[380px]:p-3.5 sm:p-7 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
      >
        {/* Traditional corner bracket accent vector */}
        <div className="absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-amber-700/20 pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="p-1.5 sm:p-3 bg-amber-50 text-amber-800 rounded-xl sm:rounded-2xl border-2 border-amber-900/10 shadow-xs">
                <PieIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[7.5px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-[0.25em] text-amber-800">Persentase</p>
                <h4 className="text-[10.5px] sm:text-base font-bold text-stone-900 leading-tight">Jenis Kelamin</h4>
              </div>
            </div>
            <span className="hidden sm:inline-block rounded-full bg-amber-50 border-2 border-amber-900/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold text-amber-800">
              7.007 Jiwa
            </span>
          </div>

          <div className="w-full h-[140px] sm:h-[210px] my-1 sm:my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="75%"
                  innerRadius="44%"
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={26} wrapperStyle={{ fontSize: 8.5, fontWeight: 600, bottom: 0 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-1 pt-1.5 sm:mt-2 sm:pt-3 grid grid-cols-2 gap-1 sm:gap-2 border-t border-stone-200/60 text-center">
          <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-stone-50">
            <p className="text-[7px] sm:text-[10px] font-bold text-stone-500 uppercase">Laki-Laki</p>
            <p className="text-[8.5px] sm:text-xs font-black text-amber-800 font-mono">4.971 (51%)</p>
          </div>
          <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-stone-50">
            <p className="text-[7px] sm:text-[10px] font-bold text-stone-500 uppercase">Perempuan</p>
            <p className="text-[8.5px] sm:text-xs font-black text-amber-700 font-mono">4.775 (49%)</p>
          </div>
        </div>
      </motion.div>

      {/* CARD 3: SEBARAN PENDUDUK PER DUSUN & USIA (Satu baris kanan di mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, delay: 0.16 }}
        whileHover={{ y: -6, scale: 1.01 }}
        className="col-span-1 relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border-2 border-amber-900/15 ring-1 ring-amber-500/15 bg-[#FFFDF9]/95 backdrop-blur-md p-3 min-[380px]:p-3.5 sm:p-7 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
      >
        {/* Traditional corner bracket accent vector */}
        <div className="absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-amber-700/20 pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-1 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="p-1.5 sm:p-3 bg-amber-50 text-amber-800 rounded-xl sm:rounded-2xl border-2 border-amber-900/10 shadow-xs">
                <BarChart2 className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[7.5px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-[0.25em] text-amber-800">Distribusi</p>
                <h4 className="text-[10.5px] sm:text-base font-bold text-stone-900 leading-tight">
                  {chartView === 'dusun' ? 'Sebaran Dusun' : 'Kelompok Usia'}
                </h4>
              </div>
            </div>

            {/* View Switch Buttons */}
            <div className="flex items-center bg-stone-100 p-0.5 sm:p-1 rounded-md sm:rounded-xl">
              <button
                type="button"
                onClick={() => setChartView('dusun')}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold rounded-sm sm:rounded-lg transition-all ${chartView === 'dusun'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                Dusun
              </button>
              <button
                type="button"
                onClick={() => setChartView('umur')}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold rounded-sm sm:rounded-lg transition-all ${chartView === 'umur'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                Usia
              </button>
            </div>
          </div>

          <div className="w-full h-[140px] sm:h-[210px] my-1 sm:my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartView === 'dusun' ? dusunDistribution : ageDistribution}
                margin={{ top: 8, right: 4, left: -26, bottom: chartView === 'dusun' ? 10 : 0 }}
              >
                <defs>
                  <linearGradient id="barGradientDusun" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C25E34" stopOpacity={1} />
                    <stop offset="100%" stopColor="#D8902A" stopOpacity={0.75} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5ebd9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 7.5, fill: '#78716c' }}
                  tickFormatter={(val: string) => val.replace('Dsn. ', '')}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={chartView === 'dusun' ? -20 : -35}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 7.5, fill: '#78716c' }} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#barGradientDusun)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-1 pt-1.5 sm:mt-2 sm:pt-3 flex items-center justify-between text-[7.5px] sm:text-xs text-stone-500 font-medium border-t border-stone-200/60">
          <span className="font-bold text-stone-500 uppercase truncate">
            {chartView === 'dusun' ? '4 Dusun' : '13 Kategori'}
          </span>
          <span className="font-black text-amber-800 shrink-0 ml-1">
            7.007 Jiwa
          </span>
        </div>
      </motion.div>
    </div>
  );
}
