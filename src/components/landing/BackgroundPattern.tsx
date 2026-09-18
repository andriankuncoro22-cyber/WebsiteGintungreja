'use client';

import React from 'react';

const BACKGROUND_SVG = `<svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover opacity-50 pointer-events-none"><defs><style>.topo-thick { stroke: #D4C4B5; stroke-linecap: round; }.topo-mid { stroke: #DECFC0; stroke-linecap: round; }.topo-light { stroke: #EDE4D8; stroke-linecap: round; }.topo-amber { stroke: #D8902A; stroke-linecap: round; stroke-dasharray: 4 10; }</style></defs><g opacity="0.75"><path class="topo-light" stroke-width="4.5" stroke-opacity="0.6" d="M-100,-80 C200,80 550,220 850,550 C1050,780 1200,1100 1250,1250" /><path class="topo-thick" stroke-width="3.2" stroke-opacity="0.45" d="M-80,-60 C210,95 530,240 820,560 C1010,780 1150,1080 1200,1230" /><path class="topo-mid" stroke-width="1.8" stroke-opacity="0.4" d="M-60,-40 C220,110 510,260 790,570 C970,780 1100,1060 1150,1210" /><path class="topo-amber" stroke-width="1.4" stroke-opacity="0.35" d="M-50,-30 C225,120 495,275 770,580 C950,780 1070,1050 1120,1200" /><path class="topo-light" stroke-width="4.0" stroke-opacity="0.6" d="M-120,100 C150,240 450,420 700,750 C880,980 980,1200 1000,1250" /><path class="topo-thick" stroke-width="3.0" stroke-opacity="0.45" d="M-100,120 C160,255 430,440 670,760 C840,980 940,1180 960,1230" /><path class="topo-mid" stroke-width="1.6" stroke-opacity="0.4" d="M-80,140 C170,270 410,460 640,770 C800,980 900,1160 920,1210" /><path class="topo-light" stroke-width="3.5" stroke-opacity="0.5" d="M-140,280 C100,400 350,600 550,920 C680,1120 740,1250 750,1280" /><path class="topo-thick" stroke-width="2.5" stroke-opacity="0.4" d="M-120,300 C110,415 330,620 520,930 C640,1120 700,1230 710,1260" /><path class="topo-mid" stroke-width="1.5" stroke-opacity="0.35" d="M-100,320 C120,430 310,640 490,940 C600,1120 660,1210 670,1240" /></g><g opacity="0.75"><path class="topo-light" stroke-width="4.5" stroke-opacity="0.6" d="M2100,-100 C1650,150 1250,380 950,750 C750,1000 620,1250 600,1300" /><path class="topo-thick" stroke-width="3.2" stroke-opacity="0.45" d="M2080,-80 C1640,165 1230,400 920,760 C730,1000 590,1230 570,1280" /><path class="topo-mid" stroke-width="1.8" stroke-opacity="0.4" d="M2060,-60 C1630,180 1210,420 890,770 C710,1000 560,1210 540,1260" /><path class="topo-amber" stroke-width="1.4" stroke-opacity="0.35" d="M2050,-50 C1625,190 1195,435 870,780 C695,1000 545,1200 525,1250" /><path class="topo-light" stroke-width="4.0" stroke-opacity="0.55" d="M2050,100 C1680,320 1350,560 1100,900 C920,1150 820,1280 800,1300" /><path class="topo-thick" stroke-width="2.8" stroke-opacity="0.45" d="M2030,120 C1670,335 1330,580 1070,910 C900,1150 790,1260 770,1280" /><path class="topo-mid" stroke-width="1.6" stroke-opacity="0.4" d="M2010,140 C1660,350 1310,600 1040,920 C880,1150 760,1240 740,1260" /></g><g opacity="0.65"><path class="topo-light" stroke-width="4.0" stroke-opacity="0.55" d="M2100,600 C1750,750 1450,920 1250,1150 C1120,1280 1050,1350 1000,1380" /><path class="topo-thick" stroke-width="2.8" stroke-opacity="0.4" d="M2080,620 C1740,765 1430,940 1220,1160 C1100,1280 1030,1330 980,1360" /><path class="topo-mid" stroke-width="1.6" stroke-opacity="0.35" d="M2060,640 C1730,780 1410,960 1190,1170 C1080,1280 1010,1310 960,1340" /><path class="topo-amber" stroke-width="1.2" stroke-opacity="0.3" d="M2050,650 C1725,790 1395,975 1170,1180 C1065,1280 995,1300 945,1330" /></g></svg>`;

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Warm Alabaster background base */}
      <div className="absolute inset-0 bg-[#FAF6EF] pointer-events-none" />

      {/* Atmospheric Agrarian Warm Light Orbs */}
      <div className="absolute -top-[15%] left-[10%] h-[650px] w-[650px] rounded-full bg-gradient-to-br from-[#D8902A]/8 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -right-[10%] h-[750px] w-[750px] rounded-full bg-gradient-to-bl from-[#C45528]/6 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[5%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#D8902A]/7 via-[#C45528]/4 to-transparent blur-[150px] pointer-events-none" />

      {/* Subtle Warm Micro Texture Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C45528 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Warm Landscape Terrace & Topo Contours */}
      <div
        className="w-full h-full pointer-events-none"
        dangerouslySetInnerHTML={{ __html: BACKGROUND_SVG }}
      />
    </div>
  );
}
