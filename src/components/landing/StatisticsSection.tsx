'use client';

import { motion } from 'framer-motion';
import { useMemoFirebase, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ArrowUpRight, Home, Users, FileText, BarChart3, BadgeCheck, MapPin, Sparkles } from 'lucide-react';
import { StatisticsCharts } from './StatisticsCharts';

export function StatisticsSection() {
  const firestore = useFirestore();

  const statsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'statistics');
  }, [firestore]);

  const { data: statsDoc, isLoading: statsLoading } = useDoc<any>(statsRef);

  const metricsList = [
    {
      label: 'Jumlah Penduduk',
      value: statsDoc?.total ? Number(statsDoc.total).toLocaleString('id-ID') : '7.007',
      subtext: '3.596 L · 3.411 P',
      unit: 'Jiwa (BPS 2024)',
      icon: Users,
      color: 'text-amber-800',
      bgColor: 'bg-amber-100/70',
      borderColor: 'border-amber-200',
      gradient: 'from-amber-500/15 to-amber-500/0'
    },
    {
      label: 'Kepala Keluarga',
      value: statsDoc?.totalKK ? Number(statsDoc.totalKK).toLocaleString('id-ID') : '2.250',
      subtext: 'Rata-rata 3,1 jiwa/KK',
      unit: 'Rumah Tangga (KK)',
      icon: Home,
      color: 'text-orange-700',
      bgColor: 'bg-orange-100/70',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-500/15 to-orange-500/0'
    },
    {
      label: 'Jumlah Dusun',
      value: '4',
      subtext: 'Gintungreja, Sidakaya, Kedungwringin, Cihaur',
      unit: 'Wilayah Dusun',
      icon: MapPin,
      color: 'text-amber-900',
      bgColor: 'bg-amber-100/80',
      borderColor: 'border-amber-200',
      gradient: 'from-amber-600/15 to-amber-600/0'
    },
    {
      label: 'Rukun Warga (RW)',
      value: '5',
      subtext: 'RW 01 s.d. RW 05',
      unit: 'Wilayah RW',
      icon: BarChart3,
      color: 'text-stone-800',
      bgColor: 'bg-stone-200/70',
      borderColor: 'border-stone-300',
      gradient: 'from-stone-500/15 to-stone-500/0'
    },
    {
      label: 'Rukun Tetangga (RT)',
      value: '43',
      subtext: 'Tersebar di 5 RW',
      unit: 'Wilayah RT',
      icon: BadgeCheck,
      color: 'text-orange-800',
      bgColor: 'bg-orange-100/80',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-600/15 to-orange-600/0'
    },
    {
      label: 'Kepadatan Penduduk',
      value: '1.149',
      subtext: 'Luas 6,10 km² (5,12% Kec.)',
      unit: 'Jiwa / km² (6,10 km²)',
      icon: FileText,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      gradient: 'from-amber-500/15 to-amber-500/0'
    },
  ];

  return (
    <section className="py-10 sm:py-24 relative">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-amber-800 flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
              Statistik Desa Gintungreja
            </p>
            <h2 className="mt-2 sm:mt-3 text-2xl font-black tracking-tight text-stone-900 sm:text-4xl font-display">
              Data terbaru mengenai kondisi Desa Gintungreja.
            </h2>
            <p className="mt-2 sm:mt-4 text-xs sm:text-lg leading-relaxed sm:leading-8 text-stone-600">
              Informasi terbuka mengenai demografi kependudukan, wilayah administratif, dan perkembangan Desa Gintungreja, Kecamatan Gandrungmangu.
            </p>
          </div>
          <a
            href="/statistik?tab=kependudukan"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-900 transition-colors group"
          >
            <span>Lihat statistik lengkap</span>
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* Live Metric Cards Grid */}
        <div className="mt-5 sm:mt-12 grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 min-[380px]:gap-3 sm:gap-4 md:gap-5">
          {metricsList.map((item, index) => {
            const Icon = item.icon;
            // Alternating asymmetric curvature for bespoke architectural rhythm
            const cornerStyle = index % 2 === 0
              ? 'rounded-tl-[1.5rem] rounded-br-[1.5rem] rounded-tr-md rounded-bl-md sm:rounded-tl-[2rem] sm:rounded-br-[2rem] sm:rounded-tr-lg sm:rounded-bl-lg'
              : 'rounded-tr-[1.5rem] rounded-bl-[1.5rem] rounded-tl-md rounded-br-md sm:rounded-tr-[2rem] sm:rounded-bl-[2rem] sm:rounded-tl-lg sm:rounded-br-lg';

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className={`group relative overflow-hidden ${cornerStyle} border-2 border-amber-900/15 ring-1 ring-amber-500/10 bg-[#FFFDF9]/95 backdrop-blur-sm p-2.5 min-[380px]:p-3 sm:p-5 shadow-sm hover:shadow-xl hover:border-amber-700/30 transition-all duration-300 flex flex-col justify-between`}
              >
                {/* Traditional corner bracket accent vector */}
                <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 border-t-2 border-r-2 border-amber-700/20 group-hover:border-amber-700/60 transition-colors pointer-events-none" />
                <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 border-b-2 border-l-2 border-amber-700/20 group-hover:border-amber-700/60 transition-colors pointer-events-none" />

                <div className={`absolute top-0 right-0 h-14 w-14 sm:h-20 sm:w-20 rounded-full bg-gradient-to-bl ${item.gradient} blur-lg pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                <div className="relative z-10">
                  <div className={`flex h-7 w-7 min-[380px]:h-8 min-[380px]:w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl ${item.bgColor} ${item.color} border border-amber-900/10 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="h-3.5 w-3.5 min-[380px]:h-4 min-[380px]:w-4 sm:h-5 sm:w-5" />
                  </div>
                  <p className="mt-2 sm:mt-4 text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-stone-500 leading-tight line-clamp-2 font-display">
                    {item.label}
                  </p>
                </div>

                <div className="relative z-10 mt-2 sm:mt-4 pt-1.5 sm:pt-2 border-t-2 border-amber-900/10">
                  <p className="text-sm min-[380px]:text-base sm:text-2xl font-black tracking-tight text-stone-900 font-mono font-display">
                    {item.value}
                  </p>
                  <p className="text-[7px] min-[380px]:text-[8px] sm:text-[10px] font-black text-amber-800 uppercase tracking-tight mt-0.5 line-clamp-1">
                    {item.unit}
                  </p>
                  {item.subtext && (
                    <p className="text-[6.5px] min-[380px]:text-[7.5px] sm:text-[9px] font-medium text-stone-500 mt-0.5 line-clamp-1">
                      {item.subtext}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Container */}
        <div className="mt-6 sm:mt-8">
          <StatisticsCharts statsDoc={statsDoc} isLoading={statsLoading} />
        </div>
      </div>
    </section>
  );
}
