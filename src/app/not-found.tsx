'use client'

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan | Wedding Invitation',
  description: 'Halaman yang Anda cari tidak ditemukan',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FBF8F3] via-[#F7E7CE]/40 to-[#DCAE96]/30 flex items-center justify-center px-4">
      {/* ====== GLOBAL STYLES ====== */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 0.9; }
        }

        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }

        @keyframes draw-line {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }

        .petal {
          position: absolute;
          top: -20px;
          border-radius: 50% 0 50% 50%;
          background: linear-gradient(135deg, #DCAE96, #C9A96E);
          animation: fall linear infinite;
          pointer-events: none;
        }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            #B8935A 0%,
            #F7E7CE 25%,
            #B8935A 50%,
            #F7E7CE 75%,
            #B8935A 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* ====== FALLING PETALS (DECORATION) ====== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: `${(i * 8.5) % 100}%`,
              width: `${8 + (i % 4) * 3}px`,
              height: `${10 + (i % 4) * 3}px`,
              animationDuration: `${10 + (i % 5) * 3}s`,
              animationDelay: `${i * 0.8}s`,
              opacity: 0.3 + (i % 3) * 0.15,
            }}
          />
        ))}
      </div>

      {/* ====== DECORATIVE CORNERS ====== */}
      <div className="absolute top-8 left-8 opacity-30 hidden md:block">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M2 78 C2 40, 40 2, 78 2" stroke="#C9A96E" strokeWidth="1" />
          <path d="M10 78 C10 45, 45 10, 78 10" stroke="#C9A96E" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="2" fill="#C9A96E" />
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 opacity-30 rotate-180 hidden md:block">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M2 78 C2 40, 40 2, 78 2" stroke="#C9A96E" strokeWidth="1" />
          <path d="M10 78 C10 45, 45 10, 78 10" stroke="#C9A96E" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="2" fill="#C9A96E" />
        </svg>
      </div>

      {/* ====== GLOWING ORBS ====== */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#DCAE96]/10 rounded-full blur-3xl" />

      {/* ====== MAIN CONTENT ====== */}
      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Ornament top */}
        <div className="animate-fade-in-up delay-100 flex justify-center mb-8">
          <svg width="200" height="60" viewBox="0 0 200 60" fill="none">
            <path
              d="M10 30 Q100 0, 190 30"
              stroke="#C9A96E"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M30 32 Q100 10, 170 32"
              stroke="#C9A96E"
              strokeWidth="0.5"
              fill="none"
              opacity="0.6"
            />
            {/* Center heart */}
            <path
              d="M100 25 C100 22, 96 20, 94 22 C92 20, 88 22, 88 25 C88 30, 100 38, 100 38 C100 38, 112 30, 112 25 C112 22, 108 20, 106 22 C104 20, 100 22, 100 25 Z"
              fill="#C9A96E"
              opacity="0.9"
            />
            {/* Side dots */}
            <circle cx="50" cy="32" r="1.5" fill="#C9A96E" />
            <circle cx="150" cy="32" r="1.5" fill="#C9A96E" />
          </svg>
        </div>

        {/* 404 Number with ring decoration */}
        <div className="animate-fade-in-up delay-200 relative mb-6">
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-48 h-48 border border-[#C9A96E]/20 rounded-full"
              style={{ animation: 'pulse-ring 4s ease-in-out infinite' }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-64 h-64 border border-[#C9A96E]/10 rounded-full"
              style={{ animation: 'pulse-ring 4s ease-in-out infinite 1s' }}
            />
          </div>

          {/* Rotating decorative circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              className="opacity-30"
              style={{ animation: 'spin-slow 30s linear infinite' }}
            >
              <circle cx="90" cy="90" r="85" stroke="#C9A96E" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
            </svg>
          </div>

          {/* Main 404 */}
          <h1
            className="relative font-serif text-[100px] md:text-[140px] font-bold leading-none tracking-tight shimmer-text"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            404
          </h1>
        </div>

        {/* Divider */}
        <div className="animate-fade-in-up delay-300 flex items-center justify-center gap-3 mb-6">
          <div
            className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A96E] origin-right"
            style={{ animation: 'draw-line 1s ease-out 0.5s forwards', transform: 'scaleX(0)' }}
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1 L10 6 L15 6 L11 9 L12.5 14 L8 11 L3.5 14 L5 9 L1 6 L6 6 Z"
              fill="#C9A96E"
            />
          </svg>
          <div
            className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A96E] origin-left"
            style={{ animation: 'draw-line 1s ease-out 0.5s forwards', transform: 'scaleX(0)' }}
          />
        </div>

        {/* Title */}
        <h2
          className="animate-fade-in-up delay-400 text-2xl md:text-3xl text-[#3D342B] mb-3 font-medium"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Halaman Tidak Ditemukan
        </h2>

        {/* Description */}
        <p
          className="animate-fade-in-up delay-500 text-[#6B5B5B]/70 text-sm md:text-base leading-relaxed mb-2"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Sepertinya halaman yang Anda cari telah dipindahkan,
          <br className="hidden md:block" />
          tidak tersedia, atau mungkin tidak pernah ada.
        </p>

        {/* Quote */}
        <p
          className="animate-fade-in-up delay-600 text-[#C9A96E] text-lg md:text-xl italic my-6"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          "Yang terbaik belum tentu ditemukan, tapi yang ditemukan belum tentu terbaik"
        </p>

        {/* Action Buttons */}
        <div className="animate-fade-in-up delay-700 flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#C9A96E] to-[#B8935A] text-white rounded-full font-medium text-sm tracking-wide shadow-lg shadow-[#C9A96E]/30 hover:shadow-xl hover:shadow-[#C9A96E]/40 hover:scale-105 transition-all duration-300 overflow-hidden"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative z-10">
              <path d="M8 1 L15 7 L13 7 L13 15 L9 15 L9 10 L7 10 L7 15 L3 15 L3 7 L1 7 Z" fill="currentColor" />
            </svg>
            <span className="relative z-10">Kembali ke Beranda</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#C9A96E]/40 text-[#6B5B5B] rounded-full font-medium text-sm tracking-wide hover:bg-[#C9A96E]/10 hover:border-[#C9A96E] transition-all duration-300"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 2 L4 8 L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Halaman Sebelumnya
          </button>
        </div>

        {/* Bottom ornament */}
        <div className="animate-fade-in-up delay-700 mt-12 flex justify-center opacity-40">
          <svg width="120" height="30" viewBox="0 0 120 30" fill="none">
            <path d="M10 15 Q60 5, 110 15" stroke="#C9A96E" strokeWidth="0.5" />
            <path d="M20 17 Q60 8, 100 17" stroke="#C9A96E" strokeWidth="0.5" opacity="0.5" />
            <circle cx="60" cy="15" r="2" fill="#C9A96E" />
          </svg>
        </div>
      </div>
    </div>
  )
}