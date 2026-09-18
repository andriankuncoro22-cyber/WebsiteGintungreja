'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemoFirebase, useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import { ArrowRight, Video, Newspaper, CheckCircle2, Sparkles, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { News } from '@/lib/types';
import { formatDisplayDate } from './landing-utils';

export function NewsSection() {
  const firestore = useFirestore();

  const newsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'news'), orderBy('updatedAt', 'desc'), limit(8));
  }, [firestore]);

  const { data: news, isLoading, error } = useCollection<News>(newsQuery);

  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profileData } = useDoc<{ youtubeVideoUrl?: string }>(profileRef);

  const getYoutubeEmbedUrl = (url: string | undefined) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    const videoId = match ? match[1] : url;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const youtubeEmbedUrl = getYoutubeEmbedUrl(profileData?.youtubeVideoUrl);

  const duplicatedNews = useMemo(() => {
    if (!news || news.length === 0) return [];
    let items = [...news];
    while (items.length < 8) {
      items = [...items, ...news];
    }
    return [...items, ...items];
  }, [news]);

  return (
    <section className="relative mx-auto max-w-7xl px-3.5 py-10 sm:px-6 lg:px-8 sm:py-20 lg:py-28 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-2xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-800">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-700" />
            Pusat Informasi & Kabar Terkini
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900 font-display">
            Kabar & Berita Desa
          </h2>
          <p className="text-xs sm:text-lg text-stone-600 leading-relaxed">
            Ikuti perkembangan pembangunan infrastruktur, kegiatan sosial kemasyarakatan, dan transparansi kebijakan Pemerintah Desa Gintungreja.
          </p>
        </div>
        <Link
          href="/BeritaDesa/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-900 transition-colors shrink-0 self-start sm:self-auto"
        >
          Lihat Semua Berita
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </motion.div>

      {/* News Stream / Cards */}
      {isLoading ? (
        <div className="mt-6 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl sm:rounded-[2rem] border border-stone-200/80 bg-[#FFFDF9] p-3.5 sm:p-4 shadow-xs sm:shadow-sm">
              <Skeleton className="h-36 sm:h-48 w-full rounded-xl sm:rounded-2xl" />
              <Skeleton className="mt-3 sm:mt-4 h-3.5 w-24" />
              <Skeleton className="mt-2.5 sm:mt-3 h-5 sm:h-6 w-full" />
              <Skeleton className="mt-2 h-3.5 w-3/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 sm:mt-12 rounded-2xl sm:rounded-[2rem] bg-amber-50 p-4 sm:p-6 text-xs sm:text-sm text-amber-800 border border-amber-200">
          Berita sedang tidak dapat dimuat saat ini. Silakan kunjungi halaman Berita Desa secara langsung.
        </div>
      ) : !news || news.length === 0 ? (
        <div className="mt-6 sm:mt-12 rounded-2xl sm:rounded-[2rem] bg-stone-50 p-6 sm:p-8 text-center text-xs sm:text-sm text-stone-600 border border-stone-200">
          Belum ada berita terbaru yang dipublikasikan.
        </div>
      ) : (
        <div className="mt-5 sm:mt-12 relative w-full overflow-hidden marquee-gradient-mask">
          <div className="animate-marquee-slow flex gap-3 min-[380px]:gap-4 sm:gap-6 py-2 sm:py-4">
            {duplicatedNews.map((item, idx) => (
              <motion.article
                key={`${item.id}-${idx}`}
                className="w-[220px] min-[380px]:w-[240px] sm:w-[390px] shrink-0 group overflow-hidden rounded-t-[2.25rem] rounded-b-xl sm:rounded-t-[3rem] sm:rounded-b-2xl border-2 border-amber-900/15 ring-1 ring-amber-500/10 bg-[#FFFDF9]/95 backdrop-blur-sm shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                whileHover={{ y: -6 }}
              >
                <div>
                  <div className="relative h-30 min-[380px]:h-36 sm:h-52 overflow-hidden rounded-t-[2.1rem] sm:rounded-t-[2.85rem] bg-stone-100">
                    <Image
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200'}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 240px, 390px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
                    
                    {/* Floating terracotta category tag */}
                    <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 rounded-full bg-[#C45528] text-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9.5px] font-black uppercase tracking-wider shadow-md">
                      Kabar Desa
                    </div>
                  </div>

                  <div className="p-3 min-[380px]:p-3.5 sm:p-6">
                    <div className="flex items-center gap-1 sm:gap-2 text-[8.5px] min-[380px]:text-[9px] sm:text-xs font-semibold text-stone-500">
                      <Newspaper className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-amber-700" />
                      <span className="truncate max-w-[80px] sm:max-w-[120px]">{item.author || 'Pemdes'}</span>
                      <span>•</span>
                      <span>{formatDisplayDate(item.updatedAt || item.createdAt || item.date)}</span>
                    </div>

                    <h3 className="mt-1.5 sm:mt-3 text-xs min-[380px]:text-[13.5px] sm:text-lg font-bold sm:font-black text-stone-900 line-clamp-2 h-8 min-[380px]:h-9 sm:h-14 leading-tight group-hover:text-amber-800 transition-colors font-display">
                      {item.title}
                    </h3>

                    <p className="mt-1 sm:mt-2 text-[9.5px] min-[380px]:text-[10.5px] sm:text-xs leading-snug sm:leading-relaxed text-stone-600 line-clamp-2">
                      {item.subtitle}
                    </p>

                    <ul className="mt-2 sm:mt-4 space-y-1 sm:space-y-1.5 pt-1.5 sm:pt-2 text-[9px] min-[380px]:text-[10px] sm:text-xs font-semibold text-stone-600 border-t-2 border-amber-900/10">
                      <li className="flex items-center gap-1 sm:gap-2">
                        <CheckCircle2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-amber-700 shrink-0" />
                        <span className="truncate">Kabar Resmi Pemdes</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="px-3 pb-3 min-[380px]:px-3.5 min-[380px]:pb-3.5 sm:px-6 sm:pb-6 pt-0">
                  <Link
                    href={`/BeritaDesa/detail?id=${item.id}`}
                    className="inline-flex items-center gap-1 sm:gap-2 text-[9.5px] min-[380px]:text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-900 transition-colors"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {/* Video Profil Sinematik Desa */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10 sm:mt-20 relative overflow-hidden rounded-[2.25rem] sm:rounded-[3.5rem] bg-gradient-to-br from-[#1C1613] via-[#2A1E17] to-[#120D0A] text-white p-5 sm:p-10 lg:p-12 shadow-2xl border-2 border-amber-500/30 ring-1 ring-amber-500/15"
      >
        {/* Traditional Gold Corner Vector Brackets */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/40 pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/40 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400/40 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/40 pointer-events-none" />

        {/* Ambient Warm Golden Orb */}
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between mb-4 sm:mb-8">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-300">
              <Video className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-300" />
              Dokumentasi Sinematik
            </div>
            <h3 className="text-xl sm:text-3xl font-black font-display tracking-tight text-amber-50">
              Video Profil Resmi Desa Gintungreja
            </h3>
            <p className="text-[11px] sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Menyaksikan keindahan alam, keramahan warga, potensi agraris, serta kemajuan fasilitas pelayanan desa secara audiovisual.
            </p>
          </div>
        </div>

        <div className="relative z-10 overflow-hidden rounded-xl sm:rounded-[2.25rem] aspect-video w-full bg-[#0D0A08] shadow-2xl border-2 border-amber-500/20">
          {youtubeEmbedUrl ? (
            <iframe
              src={youtubeEmbedUrl}
              title="Video Profil Desa Gintungreja"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full min-h-[220px] sm:min-h-[320px] items-center justify-center bg-[#120D0A] text-center text-stone-200">
              <div className="space-y-2 sm:space-y-3 px-4 sm:px-6">
                <div className="mx-auto flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-600/20 border border-amber-500/40 text-amber-400">
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
                </div>
                <p className="text-xs sm:text-base font-bold text-amber-100">Video profil desa dapat dikonfigurasi melalui Admin</p>
                <p className="text-[10px] sm:text-xs text-stone-400">
                  Tautan video YouTube dapat diperbarui kapan saja di menu Pengaturan Website.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
