'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemoFirebase, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  Users,
  Compass,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function SambutanSection() {
  const firestore = useFirestore();
  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profileData } = useDoc<{
    kadesPhotoUrl?: string;
    description?: string;
    imageUrl?: string;
  }>(profileRef);

  const kadesPhoto = profileData?.kadesPhotoUrl || "https://picsum.photos/seed/kades/600/800";
  const balaiDesaPhoto = profileData?.imageUrl || "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200";

  return (
    <section className="relative mx-auto max-w-7xl px-3.5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container Card — Architectural Joglo Double-Frame Card with Corner Vectors */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[3rem] bg-[#FFFDF9] border-2 border-amber-900/15 shadow-2xl shadow-stone-900/5 ring-1 ring-amber-500/20 p-4 sm:p-10 lg:p-14">

        {/* Decorative Traditional Corner Bracket Vectors */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600/40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600/40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600/40 rounded-br-lg pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 pb-4 sm:pb-8 border-b border-amber-900/10">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#C45528] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] text-amber-900">
              Pemerintah Kabupaten Cilacap • Kecamatan Gandrungmangu
            </span>
          </div>
          <Badge className="bg-amber-100/70 text-amber-900 border border-amber-300/80 px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full shadow-none">
            <ShieldCheck className="h-3 w-3 mr-1 inline text-amber-700" />
            Portal Resmi Desa Gintungreja
          </Badge>
        </div>

        {/* Content Grid: Kades Photo + Official Welcome & Village Identity */}
        <div className="grid gap-6 sm:gap-10 pt-6 sm:pt-10 lg:grid-cols-12 lg:items-stretch">

          {/* Kolom Kiri: Foto Kades — Arched Joglo Portal Shape */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col h-full"
          >
            <div className="relative w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[700px] overflow-hidden rounded-t-[3.5rem] sm:rounded-t-[4.5rem] rounded-b-2xl sm:rounded-b-[2rem] bg-gradient-to-b from-stone-100 via-amber-50 to-stone-950 shadow-xl sm:shadow-2xl border-2 sm:border-4 border-amber-900/20 group flex flex-col justify-between">
              {/* Foto Kades - Full Body Object Top */}
              <Image
                src={kadesPhoto}
                alt="Foto Kepala Desa Gintungreja"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Top Badge: Balai Desa Glass Pill */}
              <div className="relative z-10 m-3 sm:m-5 self-start flex items-center gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-stone-950/75 backdrop-blur-md border border-amber-500/30 text-white shadow-lg">
                <div className="relative h-6 w-6 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-white/40">
                  <Image
                    src={balaiDesaPhoto}
                    alt="Kantor Desa Gintungreja"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[8px] sm:text-[9px] font-bold text-amber-400 uppercase tracking-wider leading-none">Balai Desa</p>
                  <p className="text-[10px] sm:text-[11px] font-black leading-tight text-white">Gintungreja</p>
                </div>
              </div>

              {/* Bottom Subtle Gradient & Name Tag */}
              <div className="relative z-10 w-full pt-12 pb-4 px-4 sm:pt-20 sm:pb-6 sm:px-6 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent text-white text-center">
                <div className="inline-flex items-center gap-1 px-3 py-1 mb-1.5 sm:mb-2 rounded-full bg-gradient-to-r from-[#C45528] to-[#D8902A] text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white shadow-md">
                  <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  Kepala Desa
                </div>
                <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-display drop-shadow-md text-amber-50">
                  SUYANTO
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-amber-200/90 mt-0.5 tracking-wide">
                  Pemerintah Desa Gintungreja
                </p>
              </div>
            </div>
          </motion.div>

          {/* Kolom Kanan: Narasi Sambutan & Fakta Integritas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6"
          >
            <div className="space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-xs font-black text-amber-800 uppercase tracking-[0.18em] sm:tracking-[0.2em] flex items-center gap-1.5 sm:gap-2">
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
                Sambutan & Visi Kepemimpinan
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 leading-tight uppercase font-display tracking-tight">
                Melayani dengan <span className="text-[#C45528]">Tulus</span>, Membangun dengan <span className="text-[#D8902A]">Transparansi</span>.
              </h2>
            </div>

            {/* Blockquote Sambutan — Architectural Notched Card */}
            <div className="relative rounded-2xl bg-amber-50/70 p-4 sm:p-6 border-l-4 border-[#C45528] border border-amber-200/60 shadow-xs">
              <Quote className="absolute top-3 right-3 sm:top-4 sm:right-4 h-6 w-6 sm:h-8 sm:w-8 text-amber-700/15 pointer-events-none" />
              <p className="text-xs sm:text-base text-stone-800 leading-relaxed font-medium italic">
                "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi digital Desa Gintungreja.
                Website ini kami hadirkan sebagai wujud nyata komitmen keterbukaan informasi publik, efisiensi pelayanan administrasi kependudukan, serta wadah akselerasi potensi perekonomian seluruh masyarakat."
              </p>
            </div>

            <p className="text-xs sm:text-base text-stone-600 leading-relaxed">
              Desa Gintungreja terus bergerak maju menyongsong era transformasi digital. Warga kini dapat mengakses layanan pengurusan surat, transparansi pajak PBB-P2, hingga pengaduan aspirasi tanpa hambatan birokrasi, kapan saja dan dari mana saja.
            </p>

            {/* Village Key Demographics — Sculpted Pedestal Capsules */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#FAF6EF] border-2 border-amber-900/10 text-center shadow-xs transition-all hover:border-amber-600/30 hover:-translate-y-0.5">
                <div className="flex items-center justify-center text-amber-700 mb-0.5 sm:mb-1">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-amber-950 font-mono">4</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-amber-900 uppercase tracking-wider">Wilayah Dusun</p>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#FAF6EF] border-2 border-amber-900/10 text-center shadow-xs transition-all hover:border-amber-600/30 hover:-translate-y-0.5">
                <div className="flex items-center justify-center text-[#C45528] mb-0.5 sm:mb-1">
                  <Compass className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-stone-900 font-mono">5</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-amber-900 uppercase tracking-wider">Rukun Warga (RW)</p>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#FAF6EF] border-2 border-amber-900/10 text-center shadow-xs transition-all hover:border-amber-600/30 hover:-translate-y-0.5">
                <div className="flex items-center justify-center text-stone-700 mb-0.5 sm:mb-1">
                  <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-stone-900 font-mono">43</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-stone-700 uppercase tracking-wider">Rukun Tetangga (RT)</p>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#FAF6EF] border-2 border-amber-900/10 text-center shadow-xs transition-all hover:border-amber-600/30 hover:-translate-y-0.5">
                <div className="flex items-center justify-center text-amber-800 mb-0.5 sm:mb-1">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-stone-900 font-mono">7.007</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-amber-900 uppercase tracking-wider">Total Penduduk</p>
              </div>
            </div>

            {/* Core Values Tag List & Action CTA */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {["Transparansi Penuh", "Bebas Pungli (Rp 0)", "Digital & Cepat"].map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 sm:gap-1.5 px-3 py-1 bg-amber-100/70 border border-amber-200/80 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-900"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-700" />
                    {tag}
                  </div>
                ))}
              </div>

              <Link href="/profil-desa" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-11 sm:h-12 rounded-xl sm:rounded-full bg-gradient-to-r from-[#C45528] via-[#D8902A] to-[#A8431B] hover:from-[#A8431B] hover:to-[#8F3512] px-6 sm:px-8 font-black text-[11px] sm:text-xs uppercase tracking-wider text-white shadow-lg shadow-amber-900/25 transition-all duration-300 hover:scale-[1.02]">
                  Jelajahi Profil & Sejarah Desa
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-2" />
                </Button>
              </Link>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
