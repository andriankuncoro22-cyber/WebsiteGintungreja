'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { ArrowRight, Megaphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Announcement } from '@/lib/types';
import { formatDisplayDate } from './landing-utils';

export function AnnouncementSection() {
  const firestore = useFirestore();
  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'announcements'), orderBy('publishDate', 'desc'), limit(3));
  }, [firestore]);

  const { data: announcements, isLoading, error } = useCollection<Announcement>(announcementsQuery);

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
        className="max-w-2xl"
      >
        <p className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-800">Pengumuman</p>
        <h2 className="mt-1 sm:mt-3 text-xl sm:text-4xl font-black tracking-tight text-stone-900 font-display">
          Informasi penting yang perlu diketahui masyarakat.
        </h2>
      </motion.div>

      <div className="mt-5 sm:mt-12 grid grid-cols-2 lg:grid-cols-3 gap-2 min-[380px]:gap-2.5 sm:gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl sm:rounded-[1.5rem] border border-stone-200/80 bg-[#FFFDF9] p-3 sm:p-6 shadow-xs sm:shadow-sm">
              <Skeleton className="h-4 w-16 sm:w-24" />
              <Skeleton className="mt-2.5 sm:mt-4 h-5 sm:h-7 w-3/4" />
              <Skeleton className="mt-2 sm:mt-3 h-3.5 sm:h-4 w-full" />
            </div>
          ))
        ) : error ? (
          <div className="col-span-2 lg:col-span-3 rounded-xl sm:rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 sm:p-6 text-xs sm:text-sm text-amber-800 shadow-xs sm:shadow-sm">
            Pengumuman sedang tidak dapat dimuat saat ini.
          </div>
        ) : !announcements || announcements.length === 0 ? (
          <div className="col-span-2 lg:col-span-3 rounded-xl sm:rounded-[1.5rem] border border-stone-200 bg-stone-50 p-6 sm:p-8 text-center text-xs sm:text-sm text-stone-600 shadow-xs sm:shadow-sm">
            Belum ada pengumuman publik yang dibagikan.
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <motion.article
              key={announcement.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative overflow-hidden flex flex-col justify-between rounded-2xl sm:rounded-[2.25rem] border-2 border-amber-900/15 ring-1 ring-amber-500/15 bg-[#FFFDF9]/95 backdrop-blur-sm p-3 min-[380px]:p-4 sm:p-7 shadow-sm hover:shadow-2xl transition-all duration-300 h-full"
            >
              {/* Top Terracotta Ribbon Tab */}
              <div className="absolute top-0 left-6 sm:left-8 w-12 sm:w-16 h-1.5 bg-[#C45528] rounded-b-md shadow-xs pointer-events-none" />

              {/* Traditional corner bracket accent vector */}
              <div className="absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-amber-700/25 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-amber-700/25 pointer-events-none" />

              {/* Glowing Corner Accent */}
              <div className="absolute -right-12 -top-12 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-amber-500/5 blur-xl transition-all duration-500 group-hover:bg-amber-500/15 group-hover:scale-125 pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-2 sm:gap-3 w-full pt-1 sm:pt-0">
                <div className="flex items-center justify-between gap-1.5 sm:gap-3">
                  <div className="flex h-7 w-7 min-[380px]:h-8 min-[380px]:w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-50 text-amber-800 border-2 border-amber-900/10 shadow-xs transition-colors group-hover:bg-[#C45528] group-hover:border-[#C45528] group-hover:text-white">
                    <Megaphone className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-[8px] min-[380px]:text-[9px] sm:text-xs text-stone-500">
                    <span className="rounded-full bg-amber-100/70 border border-amber-300/60 px-1.5 py-0.5 sm:px-3 sm:py-1 font-bold text-amber-900">Penting</span>
                    <span className="truncate">{formatDisplayDate(announcement.publishDate)}</span>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2 mt-1">
                  <h3 className="text-xs min-[380px]:text-[13px] sm:text-lg font-bold text-stone-900 transition-colors group-hover:text-amber-800 leading-snug line-clamp-2 font-display">
                    {announcement.title}
                  </h3>
                  <p className="text-[9.5px] min-[380px]:text-[10.5px] sm:text-sm leading-relaxed text-stone-600 line-clamp-2 sm:line-clamp-3">
                    {announcement.content}
                  </p>
                </div>

                {/* Feature highlights for desktop only */}
                <div className="hidden sm:flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-xs font-medium text-stone-600 border-t-2 border-amber-900/10">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                    <span>Resmi Gintungreja</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-2.5 sm:mt-4 pt-2 border-t-2 border-amber-900/10">
                <Link
                  href={`/pengumuman/detail?id=${announcement.id}`}
                  className="inline-flex items-center gap-1 sm:gap-2 text-[9.5px] min-[380px]:text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-900 transition-colors"
                >
                  Lihat detail
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}
