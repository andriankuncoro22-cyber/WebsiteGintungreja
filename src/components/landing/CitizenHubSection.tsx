'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageSquareWarning,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  PhoneCall,
  FileText,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function CitizenHubSection() {

  return (
    <section className="relative mx-auto max-w-7xl px-3.5 py-10 sm:px-6 lg:px-8 sm:py-20 lg:py-28">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 mb-6 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-800">
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600" />
          Pusat Interaksi & Layanan Cepat
        </div>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900 font-display uppercase">
          Partisipasi & Bantuan Warga
        </h2>
        <p className="text-xs sm:text-lg text-stone-600 leading-relaxed">
          Pemerintah Desa Gintungreja siap melayani aspirasi dan kebutuhan administrasi Anda secara terbuka, responsif, dan bebas biaya pungutan.
        </p>
      </div>

      {/* Twin Portal Cards Grid (2 cards per row on mobile) */}
      <div className="grid grid-cols-2 gap-2 min-[380px]:gap-2.5 sm:gap-8 items-stretch">

        {/* CARD 1: Layanan Pengaduan & Aspirasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-tl-[2.25rem] rounded-br-[2.25rem] rounded-tr-xl rounded-bl-xl sm:rounded-tl-[3.5rem] sm:rounded-br-[3.5rem] sm:rounded-tr-2xl sm:rounded-bl-2xl bg-[#FFFDF9]/95 border-2 border-amber-900/20 ring-1 ring-amber-500/15 p-3.5 min-[380px]:p-4 sm:p-10 shadow-sm hover:shadow-2xl transition-all duration-300 group h-full"
        >
          {/* Traditional corner bracket accent vector */}
          <div className="absolute top-3 left-3 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-amber-700/25 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-amber-700/25 pointer-events-none" />

          {/* Subtle Ambient Background Blob */}
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-rose-500/5 blur-2xl pointer-events-none" />

          <div className="space-y-2 sm:space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 min-[380px]:h-9 min-[380px]:w-9 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 border-2 border-rose-200/60 shadow-xs group-hover:scale-105 transition-transform">
                <MessageSquareWarning className="h-4 w-4 sm:h-7 sm:w-7" />
              </div>
              <Badge className="bg-rose-50 text-rose-700 border-2 border-rose-200/60 px-2 py-0.5 sm:px-3 sm:py-1 text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest rounded-full shadow-none">
                Saluran Aspirasi
              </Badge>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xs min-[380px]:text-[13px] sm:text-2xl font-black text-stone-900 font-display leading-tight line-clamp-2">
                Pengaduan & Aspirasi
              </h3>
              <p className="text-[9.5px] min-[380px]:text-[10.5px] sm:text-sm text-stone-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
                Sampaikan gagasan atau kendala fasilitas umum desa melalui sistem pengaduan terpadu.
              </p>
            </div>

            {/* Guarantees */}
            <div className="space-y-1 sm:space-y-2.5 pt-0.5 sm:pt-2">
              <div className="flex items-center gap-1.5 sm:gap-2.5 text-[8.5px] min-[380px]:text-[9.5px] sm:text-xs font-bold text-stone-700">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-amber-700 shrink-0" />
                <span className="truncate">Kerahasiaan Terjamin</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2.5 text-[8.5px] min-[380px]:text-[9.5px] sm:text-xs font-bold text-stone-700">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-amber-700 shrink-0" />
                <span className="truncate">Respon Maks. 2x24 Jam</span>
              </div>
              <div className="hidden sm:flex items-center gap-2.5 text-xs font-bold text-stone-700">
                <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0" />
                <span>Tindak Lanjut Transparan & Terdata Rapi</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 sm:pt-8 relative z-10">
            <Link href="/pengaduan/" className="block">
              <Button className="w-full h-8 min-[380px]:h-9 sm:h-12 rounded-xl sm:rounded-2xl bg-[#1C1613] hover:bg-stone-800 text-white font-bold text-[9px] min-[380px]:text-[10px] sm:text-xs uppercase tracking-wider shadow-sm sm:shadow-lg transition-all duration-300">
                <MessageSquareWarning className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-rose-400" />
                Lapor Aduan
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* CARD 2: Layanan Surat Online & Kontak Darurat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-tr-[2.25rem] rounded-bl-[2.25rem] rounded-tl-xl rounded-br-xl sm:rounded-tr-[3.5rem] sm:rounded-bl-[3.5rem] sm:rounded-tl-2xl sm:rounded-br-2xl bg-gradient-to-br from-[#9E3E18] via-[#6E250A] to-[#1C1613] text-white p-3.5 min-[380px]:p-4 sm:p-10 shadow-sm hover:shadow-2xl transition-all duration-300 group h-full border-2 border-amber-500/35 ring-1 ring-amber-500/20"
        >
          {/* Traditional Gold Corner Vector Brackets */}
          <div className="absolute top-3 right-3 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-amber-400/40 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-amber-400/40 pointer-events-none" />

          {/* Subtle Glow */}
          <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

          <div className="space-y-2 sm:space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 min-[380px]:h-9 min-[380px]:w-9 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md text-amber-200 border-2 border-white/20 shadow-xs group-hover:scale-105 transition-transform">
                <FileText className="h-4 w-4 sm:h-7 sm:w-7" />
              </div>
              <Badge className="bg-white/10 text-amber-100 border-2 border-white/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest rounded-full shadow-none">
                Layanan Kilat
              </Badge>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xs min-[380px]:text-[13px] sm:text-2xl font-black font-display tracking-tight leading-tight line-clamp-2 text-amber-50">
                Anjungan Surat Warga
              </h3>
              <p className="text-[9.5px] min-[380px]:text-[10.5px] sm:text-sm text-amber-100/90 leading-relaxed line-clamp-2 sm:line-clamp-none">
                Permohonan surat pengantar & administrasi mandiri secara online tanpa perlu antre di balai desa.
              </p>
            </div>

            {/* Guarantees */}
            <div className="space-y-1 sm:space-y-2.5 pt-0.5 sm:pt-2">
              <div className="flex items-center gap-1.5 sm:gap-2.5 text-[8.5px] min-[380px]:text-[9.5px] sm:text-xs font-bold text-amber-100">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-amber-300 shrink-0" />
                <span className="truncate">Gratis Bebas Pungli (Rp 0)</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2.5 text-[8.5px] min-[380px]:text-[9.5px] sm:text-xs font-bold text-amber-100">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-amber-300 shrink-0" />
                <span className="truncate">Formulir Mandiri Cepat</span>
              </div>
              <div className="hidden sm:flex items-center gap-2.5 text-xs font-bold text-amber-100">
                <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
                <span>Notifikasi Status Surat Dikirim Langsung</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 sm:pt-8 flex flex-col sm:flex-row gap-1.5 sm:gap-3 relative z-10">
            <Link href="/layanan-surat/" className="flex-1">
              <Button className="w-full h-8 min-[380px]:h-9 sm:h-12 rounded-lg sm:rounded-2xl bg-[#E5A125] hover:bg-[#D8902A] text-stone-950 font-black text-[9px] min-[380px]:text-[10px] sm:text-xs uppercase tracking-wider shadow-xs sm:shadow-lg shadow-amber-500/20 transition-all duration-300">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Buat Surat
              </Button>
            </Link>

            <Link href="/nomor-penting/" className="hidden sm:block sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-8 min-[380px]:h-9 sm:h-12 rounded-lg sm:rounded-2xl border-white/30 text-stone-900 bg-white hover:bg-stone-100 font-bold text-[9px] min-[380px]:text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300"
              >
                <PhoneCall className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-amber-800" />
                Nomor Penting
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
