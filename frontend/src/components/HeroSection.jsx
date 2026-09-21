import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, BrainCircuit, Play, Sparkles, Globe } from 'lucide-react';
import CyberOrbCore from './CyberOrbCore';
import PrismaticThreatCube from './PrismaticThreatCube';
import AudioHUD from './AudioHUD';
import { soundFX } from '../utils/soundEffects';

export default function HeroSection({ riskScore = 15, classification = 'Safe', onScrollToAnalyzers }) {
  const [heroModel, setHeroModel] = useState('orb'); // 'orb' (VRDOT) | 'cube' (3Dverse)

  return (
    <section className="relative min-h-[92vh] w-full bg-[#030306] text-white flex flex-col justify-between overflow-hidden pt-2 pb-12 px-6 sm:px-12 lg:px-20">
      
      {/* 1. Dramatic Central Vertical Spotlight & Cosmic Nebula Beam (Exact Match to VRDOT & 3Dverse) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] sm:w-[850px] h-[800px] pointer-events-none z-0">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(129,140,248,0.32)_0%,_rgba(168,85,247,0.18)_35%,_rgba(0,245,212,0.06)_55%,_transparent_75%)] blur-2xl opacity-90" />
      </div>

      {/* 2. Top Header Navigation (VRDOT Reference Style) */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between py-6">
        {/* Brand Logo (Left) */}
        <Link
          to="/"
          onClick={() => soundFX.playHover()}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 p-0.5 shadow-[0_0_15px_rgba(0,245,212,0.4)]">
            <div className="w-full h-full bg-[#070913] rounded-[10px] flex items-center justify-center">
              <Shield className="h-4 w-4 text-cyan-300" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-white">
            Fraud<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-300 to-fuchsia-400">Lens</span>
          </span>
        </Link>

        {/* Minimalist Center Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Product</Link>
          <Link to="/message" className="hover:text-white transition-colors">Solutions</Link>
          <Link to="/url" className="hover:text-white transition-colors">URL Scanner</Link>
          <Link to="/qr" className="hover:text-white transition-colors">QR Chamber</Link>
          <Link to="/model" className="hover:text-white transition-colors">DS Studio</Link>
        </div>

        {/* Radiant Cyan-to-Purple Gradient Pill Button & Audio HUD (Right - VRDOT Style) */}
        <div className="flex items-center gap-3">
          <AudioHUD />
          <button
            onClick={() => {
              soundFX.playClick();
              if (onScrollToAnalyzers) onScrollToAnalyzers();
            }}
            className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] via-[#6366f1] to-[#38bdf8] text-white font-semibold text-xs tracking-wide shadow-[0_0_30px_rgba(168,85,247,0.55)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Get Started</span>
          </button>
        </div>
      </nav>

      {/* 3. Hero Main Content — Asymmetric Split Grid (VRDOT Reference Match) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center my-auto py-8 lg:py-16">
        
        {/* Left Column: Bold Futuristic Headline, Subtitle, Dual CTAs & Floating Inspection Card */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-[4.25rem] font-bold font-heading tracking-tight text-white leading-[1.08]"
          >
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-300 to-fuchsia-400">New Reality</span> <br />
            of AI Fraud Defense
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed max-w-md"
          >
            Equipping digital banks, UPI consumers, and enterprises with real-time multi-vector scam detection, deep intent parsing, and explainable AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex items-center gap-6 pt-2"
          >
            {/* Primary Get Started Pill */}
            <button
              onClick={() => {
                soundFX.playClick();
                if (onScrollToAnalyzers) onScrollToAnalyzers();
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] via-[#6366f1] to-[#38bdf8] text-white font-semibold text-xs tracking-wide shadow-[0_0_30px_rgba(168,85,247,0.55)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Get Started
            </button>

            {/* Subtle Text Link: Learn More */}
            <Link
              to="/model"
              onClick={() => soundFX.playHover()}
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 group"
            >
              <span>Learn More</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform opacity-70" />
            </Link>
          </motion.div>

          {/* VRDOT-style Floating Live Inspection Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 p-3.5 sm:p-4 rounded-2xl bg-[#090b16]/85 border border-white/10 backdrop-blur-xl max-w-md flex items-center gap-3.5 shadow-2xl"
          >
            <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]">
              <Play className="h-5 w-5 fill-white ml-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  REAL-TIME ML INFERENCE
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono truncate">
                Holdout F1: 95.65% • Latency: 1.4ms
              </p>
              <span className="text-[10px] font-mono text-cyan-300 block">
                5,228 Unified Incident Corpus Samples
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: 3D Visual with Switcher (VRDOT Cyber Orb / 3Dverse Crystal Cube) */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          
          {/* Switcher Pill */}
          <div className="mb-2 flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md z-20">
            <button
              onClick={() => {
                soundFX.playClick();
                setHeroModel('orb');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                heroModel === 'orb'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,245,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>VRDOT Quantum Orb</span>
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setHeroModel('cube');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                heroModel === 'cube'
                  ? 'bg-gradient-to-r from-fuchsia-500/30 to-violet-500/30 text-fuchsia-300 border border-fuchsia-400/40 shadow-[0_0_15px_rgba(217,70,239,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="h-3 w-3" />
              <span>3Dverse Crystal Cube</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="w-full relative"
          >
            {heroModel === 'orb' ? (
              <CyberOrbCore riskScore={riskScore} classification={classification} />
            ) : (
              <PrismaticThreatCube riskScore={riskScore} classification={classification} />
            )}
          </motion.div>
        </div>

      </div>

      {/* 4. Bottom Trust & Partner Ecosystem Logos (Exact Match to Reference Footer Row) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto border-t border-white/[0.07] pt-8 mt-4">
        <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-10 opacity-70 hover:opacity-100 transition-opacity">
          <div className="text-sm sm:text-base font-extrabold tracking-widest text-slate-300 uppercase font-mono">
            NPCI • UPI
          </div>
          <div className="text-sm sm:text-base font-serif italic text-slate-300 font-semibold tracking-wider">
            Reserve Bank of India
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-300 uppercase tracking-widest font-heading">
            CERT-In
          </div>
          <div className="text-sm sm:text-base font-semibold text-slate-300 tracking-wider font-mono">
            I4C • 1930
          </div>
          <div className="text-sm sm:text-base font-black text-slate-300 tracking-widest uppercase">
            DIGITAL INDIA
          </div>
        </div>
      </div>

    </section>
  );
}
