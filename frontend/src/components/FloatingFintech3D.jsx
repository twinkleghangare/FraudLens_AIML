import React from 'react';
import { motion } from 'framer-motion';
import { Shield, QrCode, CreditCard, Activity, ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';
import TiltCard from './TiltCard';
import { soundFX } from '../utils/soundEffects';

export default function FloatingFintech3D() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 overflow-hidden select-none">
      
      {/* Background Fluid Ribbon Wave (Matching 3D UI Reference) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] pointer-events-none opacity-30 blur-3xl z-0">
        <div className="w-full h-full bg-gradient-to-r from-pink-500 via-purple-600 via-indigo-500 to-cyan-400 rounded-full rotate-12" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3 pb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Shield className="h-3 w-3 text-cyan-400" />
          <span>3D FINTECH INTELLIGENCE</span>
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
          Next-Gen 3D Payment Protection Matrix
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed max-w-xl mx-auto">
          Multi-vector defense safeguarding UPI intents, digital credit cards, and instant fund transfers in real time.
        </p>
      </div>

      {/* Main 3D Floating Fintech Showcase Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        
        {/* Left Column: Stacked Floating 3D Credit Cards & Holographic Orb */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[380px]">
          
          {/* Swirling 3D Iridescent Holographic Orb (Matching Reference) */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-6 -left-4 sm:left-4 w-24 h-24 rounded-full shadow-[0_0_40px_rgba(236,72,153,0.5)] z-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #00f5d4 0%, #7209b7 45%, #f72585 80%, #ffbe0b 100%)',
              filter: 'drop-shadow(0 0 25px rgba(247,37,133,0.6))',
            }}
          />

          {/* Card 1: Primary Floating Frosted Titanium Card (Matching Reference 1:1) */}
          <div className="w-full max-w-[380px] relative z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <TiltCard glowColor="rgba(244, 114, 182, 0.4)">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-black border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    CREDIT / UPI SHIELD
                  </span>
                  {/* Metallic Contact Chip */}
                  <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 flex flex-col justify-between shadow-md">
                    <div className="h-0.5 w-full bg-amber-800/40" />
                    <div className="h-0.5 w-full bg-amber-800/40" />
                  </div>
                </div>

                {/* Embossed Card Number */}
                <div className="pt-3">
                  <span className="text-lg sm:text-xl font-mono tracking-[0.2em] text-white font-bold drop-shadow">
                    1234 5678 9012 2859
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[9px] text-slate-500 block">VALID THRU</span>
                    <span className="font-semibold text-white">08/28</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold tracking-wider text-cyan-400">NPCI • UPI</span>
                  </div>
                </div>

              </div>
            </TiltCard>
          </div>

          {/* Card 2: Secondary Orange/Coral Glowing Card stacked beneath */}
          <div className="w-full max-w-[340px] absolute -bottom-6 right-4 sm:right-12 z-0 transform rotate-6 opacity-85 hover:opacity-100 transition-all duration-500">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-orange-600/80 via-rose-700/80 to-purple-900/90 border border-orange-400/30 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-orange-200">
                <span>SECURED VIRTUAL VAULT</span>
                <Shield className="h-4 w-4 text-orange-300" />
              </div>
              <span className="text-base font-mono tracking-widest text-white font-bold block">
                9876 •••• •••• 4210
              </span>
              <div className="flex items-center justify-between text-[10px] font-mono text-orange-200">
                <span>AUTONOMOUS ESCROW</span>
                <span className="text-emerald-300 font-bold">100% PROTECTED</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Isometric 3D Dashboard Mockup (Matching 3D UI Reference) */}
        <div className="lg:col-span-6">
          <TiltCard glowColor="rgba(56, 189, 248, 0.35)">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#090b16]/90 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-6">
              
              {/* Dashboard Top Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    Live Security Telemetry Dashboard
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Real-time transaction flow & threat classification
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Dual Spline Wave Graph (Cyan & Magenta Lines) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>TRANSACTION VELOCITY</span>
                  <span className="text-cyan-400 font-bold">3,540.21 TxF/sec</span>
                </div>

                {/* SVG Spline Graph */}
                <div className="w-full h-24 relative overflow-hidden rounded-xl bg-black/50 border border-white/5 p-2">
                  <svg className="w-full h-full" viewBox="0 0 300 80" fill="none">
                    {/* Cyan Spline */}
                    <path
                      d="M0 60 Q 50 10, 100 45 T 200 30 T 300 15"
                      stroke="#00f5d4"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    {/* Magenta Spline */}
                    <path
                      d="M0 45 Q 60 70, 120 30 T 220 50 T 300 25"
                      stroke="#f72585"
                      strokeWidth="2.5"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              {/* Circular Progress Donut Rings (Cyan & Magenta) */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Donut 1: Legitimate Verified */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#00f5d4" strokeWidth="3" strokeDasharray="88" strokeDashoffset="12" strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[10px] font-mono font-bold text-white">88%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">LEGITIMATE</span>
                    <span className="text-xs font-bold font-mono text-cyan-300">4,531 Clean</span>
                  </div>
                </div>

                {/* Donut 2: Traps Disarmed */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#f72585" strokeWidth="3" strokeDasharray="88" strokeDashoffset="4" strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[10px] font-mono font-bold text-white">96%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">TRAPS DISARMED</span>
                    <span className="text-xs font-bold font-mono text-rose-300">697 Caught</span>
                  </div>
                </div>

              </div>

              {/* Bottom Telemetry Bar */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/10">
                <span>MODEL INFERENCE LATENCY:</span>
                <span className="text-emerald-400 font-bold">1.4ms (IN-MEMORY)</span>
              </div>

            </div>
          </TiltCard>
        </div>

      </div>
    </section>
  );
}

