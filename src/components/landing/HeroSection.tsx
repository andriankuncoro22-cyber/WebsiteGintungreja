'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useMemoFirebase, useDoc, useCollection, useFirestore } from '@/firebase';
import { doc, collection, query, limit } from 'firebase/firestore';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Home,
  Landmark,
  MapPin,
  Megaphone,
  MessageSquareWarning,
  Newspaper,
  Sun,
  Users,
  Wheat,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';

/* ────────────── Animated Counter ────────────── */

function AnimatedCounter({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const dur = 2000;
    const t0 = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(Math.round(e * target).toLocaleString('id-ID'));
      if (p < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {val}
      {suffix && (
        <span className="text-sm font-semibold text-stone-500 ml-0.5">{suffix}</span>
      )}
    </span>
  );
}

/* ════════════════════════════════════════════════
   Hero Section — Nusantara Warm Earth Theme
   ════════════════════════════════════════════════ */

export function HeroSection() {
  /* Firebase data */
  const firestore = useFirestore();
  const heroRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'heroImage', 'default');
  }, [firestore]);

  const { data: heroData } = useDoc<{ imageUrl?: string }>(heroRef);
  const heroImageUrl =
    heroData?.imageUrl ||
    'https://images.unsplash.com/photo-1602989106211-81de671c23a9?q=80&w=2000';

  /* Village statistics from Firestore / Gintungreja profile */
  const statsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'statistics');
  }, [firestore]);
  const { data: statsDoc } = useDoc<any>(statsRef);

  const potentialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'potensiDesa'), limit(100));
  }, [firestore]);
  const { data: potensiList } = useCollection(potentialsQuery);

  const statsItems = [
    {
      icon: Users,
      value: 7007,
      label: 'Penduduk',
    },
    {
      icon: Home,
      value: 4,
      label: 'Dusun',
    },
    {
      icon: MapPin,
      value: 6.1,
      label: 'Luas Wilayah',
      suffix: ' km²',
    },
    {
      icon: Wheat,
      value: (potensiList && potensiList.length >= 4) ? potensiList.length : 4,
      label: 'Potensi Desa',
    },
  ];

  /* Scroll-based parallax */
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-gradient-to-br from-amber-100/40 via-[#FAF6EF] to-orange-50/30 lg:h-screen lg:max-h-screen flex flex-col justify-center"
    >
      {/* ═══ Background Image — parallax + camera push-in with warm agrarian grading ═══ */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-[-4%] hero-camera-push">
          <Image
            src={heroImageUrl}
            alt="Pemandangan pedesaan Desa Gintungreja"
            fill
            priority
            sizes="100vw"
            className="object-cover sepia-[0.75] hue-rotate-[-35deg] saturate-[1.45] contrast-[1.1] brightness-[1.02]"
          />
        </div>
      </motion.div>

      {/* ═══ Gradient Overlays — warm terracotta & golden harvest glow, 100% eliminating green ═══ */}
      <div className="absolute inset-0 bg-[#C45528]/15 mix-blend-color pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EF] via-[#FAF6EF]/90 via-[54%] to-[#FAF6EF]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EF] via-transparent to-amber-950/20" />
      <div className="absolute inset-0 bg-amber-950/[0.04]" />

      {/* ═══ Decorative Clouds / Morning Mist ═══ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="hero-cloud-drift absolute top-[6%] left-[8%] w-72 h-16 bg-white/40 rounded-full blur-3xl" />
        <div className="hero-cloud-drift-reverse absolute top-[4%] right-[12%] w-96 h-12 bg-white/30 rounded-full blur-3xl" />
        <div className="hero-cloud-drift absolute top-[10%] left-[45%] w-56 h-10 bg-white/35 rounded-full blur-2xl" />
      </div>

      {/* ═══════════════════ Main Content ═══════════════════ */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full lg:h-full lg:flex lg:flex-col lg:justify-center">
        <div className="flex min-h-0 sm:min-h-[85vh] lg:min-h-0 flex-col justify-center pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-14 lg:pb-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.18fr_0.82fr] xl:gap-12">

            {/* ═══════════ LEFT COLUMN — Text & CTA ═══════════ */}
            <div className="max-w-xl lg:max-w-2xl">
              {/* 1. Sub-judul Atas / Pill Badge Modern */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mb-2.5 sm:mb-3.5 inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white/80 px-3 py-1 shadow-2xs backdrop-blur-md"
              >
                <span className="h-2 w-2 rounded-full bg-[#C45528] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-900">
                  Portal Resmi Pemerintah Desa Digital
                </span>
              </motion.div>

              {/* 2. Judul Utama: Desa Gintungreja — Bold, Modern, High Impact */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black tracking-tight leading-[0.98]"
              >
                <span className="block text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[4rem] text-stone-900 drop-shadow-2xs">
                  Desa
                </span>
                <span className="relative inline-flex items-center text-4xl sm:text-6xl lg:text-[3.6rem] xl:text-[4.6rem] bg-gradient-to-r from-[#C45528] via-[#D8902A] to-[#A8431B] bg-clip-text text-transparent drop-shadow-xs mt-0.5">
                  Gintungreja
                  <Wheat className="inline-block ml-2 sm:ml-3 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 text-amber-600 fill-amber-500/25 -rotate-12 transform filter drop-shadow-xs" />
                </span>
              </motion.h1>

              {/* 3. Sub-judul Bawah */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                className="mt-2 text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.14em] text-amber-950/80"
              >
                Kecamatan Gandrungmangu&ensp;•&ensp;Kabupaten Cilacap
              </motion.p>

              {/* 4. Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 max-w-xl text-[13.5px] sm:text-[15px] leading-relaxed text-stone-700 font-normal"
              >
                Melayani masyarakat dengan cepat, mudah, dan transparan melalui integrasi layanan digital, keterbukaan informasi, statistik riil, serta optimalisasi potensi desa.
              </motion.p>

              {/* 5. CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3"
              >
                <Link href="/layanan-surat/" aria-label="Ajukan layanan desa">
                  <Button className="hero-btn-sweep group h-10 sm:h-11 rounded-xl sm:rounded-full bg-gradient-to-r from-[#C45528] via-[#D8902A] to-[#A8431B] hover:from-[#A8431B] hover:to-[#8F3512] px-5 sm:px-6 text-xs sm:text-sm font-bold text-white shadow-[0_6px_20px_rgba(196,85,40,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(196,85,40,0.38)]">
                    Ajukan Layanan
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/profil-desa/" aria-label="Lihat profil desa">
                  <Button
                    variant="outline"
                    className="h-10 sm:h-11 rounded-xl sm:rounded-full border border-stone-300/80 bg-white/90 px-5 sm:px-6 text-xs sm:text-sm font-semibold text-stone-800 backdrop-blur-sm shadow-xs transition-all duration-300 hover:border-[#C45528] hover:bg-white hover:text-[#C45528] hover:shadow-md"
                  >
                    <Landmark className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" />
                    Profil Desa
                  </Button>
                </Link>
              </motion.div>

              {/* Mobile quick-links grid (hidden on lg+) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 grid grid-cols-2 gap-2 lg:hidden"
              >
                {[
                  { href: '/layanan-surat/', icon: FileText, label: 'Layanan Mandiri', color: 'bg-orange-100 text-orange-800' },
                  { href: '/statistik/', icon: BarChart3, label: 'Statistik Desa', color: 'bg-amber-100 text-amber-800' },
                  { href: '/BeritaDesa/', icon: Newspaper, label: 'Kabar Desa', color: 'bg-stone-100 text-stone-800' },
                  { href: '/pengaduan/', icon: MessageSquareWarning, label: 'Pengaduan Warga', color: 'bg-rose-100 text-rose-800' },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="flex items-center gap-2 rounded-xl px-2.5 py-2 border border-amber-900/10 bg-white/90 shadow-xs hover:shadow-sm transition-all">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <item.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-stone-700 leading-tight truncate">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </motion.div>

              {/* ── Statistics Sleek Bar (Clean, Airy & Balanced) ── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 sm:mt-5 xl:mt-6 rounded-2xl border border-stone-200/80 bg-white/80 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-sm shadow-amber-950/5 max-w-xl"
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/60">
                  {statsItems.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className={`flex items-center gap-2.5 ${idx > 0 ? 'pt-2 sm:pt-0 sm:pl-3' : ''}`}>
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200/70 shadow-2xs">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-extrabold tabular-nums leading-tight text-stone-900 font-mono">
                            <AnimatedCounter target={s.value} suffix={s.suffix} />
                          </p>
                          <p className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap">
                            {s.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* ═══════════ RIGHT COLUMN — 5 Quick Action Cards (Clean, Rapi & Elegan) ═══════════ */}
            <div className="relative hidden lg:flex w-full justify-end">
              <div className="w-full max-w-[330px] xl:max-w-[350px] flex flex-col gap-2">
                {[
                  {
                    href: '/layanan-surat/',
                    title: 'Ajukan Layanan Online',
                    desc: 'Pelayanan surat mandiri 24 jam',
                    icon: FileText,
                    iconBg: 'bg-gradient-to-br from-[#C45528] to-[#A8431B] text-white',
                  },
                  {
                    href: '/statistik/',
                    title: 'Statistik & Data Desa',
                    desc: '7.007 jiwa & demografi lengkap',
                    icon: BarChart3,
                    iconBg: 'bg-gradient-to-br from-amber-600 to-amber-700 text-white',
                  },
                  {
                    href: '/BeritaDesa/',
                    title: 'Kabar & Berita Desa',
                    desc: 'Informasi dan agenda desa terkini',
                    icon: Newspaper,
                    iconBg: 'bg-gradient-to-br from-[#2A1E17] to-[#16110E] text-amber-200',
                  },
                  {
                    href: '/pengaduan/',
                    title: 'Layanan Pengaduan',
                    desc: 'Kanal aspirasi & partisipasi warga',
                    icon: MessageSquareWarning,
                    iconBg: 'bg-gradient-to-br from-rose-600 to-rose-700 text-white',
                  },
                  {
                    href: '/pengumuman/',
                    title: 'Pengumuman Resmi',
                    desc: 'Maklumat & edaran pemerintah',
                    icon: Megaphone,
                    iconBg: 'bg-gradient-to-br from-amber-700 to-orange-700 text-white',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.3 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        className="group flex items-center justify-between rounded-2xl border border-stone-200/90 bg-white/85 hover:bg-white backdrop-blur-md px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#C45528]/40 hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${item.iconBg} shadow-xs group-hover:scale-105 transition-transform duration-200`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <span className="block text-[13px] font-bold text-stone-800 group-hover:text-[#C45528] transition-colors truncate leading-tight font-sans">
                              {item.title}
                            </span>
                            <span className="block text-[10.5px] text-stone-500 font-normal truncate mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100/80 text-stone-400 group-hover:bg-[#C45528] group-hover:text-white group-hover:translate-x-0.5 transition-all ml-2">
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Bottom Flowing Organic Multi-Tier Terrace Vector (INLINE SVG — Proportioned & Airy) ═══ */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-22 lg:h-24 xl:h-28 w-full pointer-events-none overflow-hidden z-10 select-none">
        <svg viewBox="0 0 1920 240" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="terraceSandRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EDE2D5" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#F5EFEB" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#EDE2D5" stopOpacity="0.90" />
            </linearGradient>
            <linearGradient id="terraceClayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D8902A" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#C45528" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#A8431B" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#8F3512" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="terraceTeakwoodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2A1E17" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#1C1613" stopOpacity="1" />
              <stop offset="100%" stopColor="#150F0C" stopOpacity="0.98" />
            </linearGradient>
          </defs>
          {/* Tier 1: Soft Sand Ribbon Wave */}
          <path d="M0,110 C320,70 620,150 960,125 C1300,100 1560,45 1920,65 L1920,240 L0,240 Z" fill="url(#terraceSandRibbon)" />
          {/* Tier 2: Warm Terracotta Clay Flow */}
          <path d="M0,200 C380,195 580,135 920,130 C1280,125 1540,70 1920,90 L1920,240 L0,240 Z" fill="url(#terraceClayGrad)" />
          {/* Tier 3: Deep Teakwood Architectural Foundation */}
          <path d="M260,240 C520,190 800,165 1100,172 C1420,180 1680,115 1920,125 L1920,240 Z" fill="url(#terraceTeakwoodGrad)" />
        </svg>
      </div>
    </section>
  );
}
