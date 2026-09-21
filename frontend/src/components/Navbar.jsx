import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, BrainCircuit } from 'lucide-react';
import ThreatTicker from './ThreatTicker';
import AudioHUD from './AudioHUD';
import { soundFX } from '../utils/soundEffects';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { to: '/', label: 'Command Core' },
    { to: '/message', label: 'Message NLP' },
    { to: '/url', label: 'URL Scanner' },
    { to: '/qr', label: 'QR Chamber' },
    { to: '/model', label: 'Data Science Studio' },
    { to: '/history', label: 'Audit History' }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070913]/95 backdrop-blur-xl transition-all">
      {/* Live Threat Intelligence Ticker */}
      <ThreatTicker />

      {/* Main Header Bar shown on subpages for seamless navigation */}
      {!isHome && (
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo and Brand */}
          <Link
            to="/"
            onClick={() => soundFX.playHover()}
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-rose-500/20 border border-white/15 shadow-lg shadow-cyan-500/10"
            >
              <Shield className="h-5 w-5 text-cyan-400" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight font-heading text-white">
                  Fraud<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-300 to-sky-300">Lens</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  AI / ML
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-mono">UPI Scam Detection & Risk Intelligence</p>
            </div>
          </Link>

          {/* Center Multi-Page Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => soundFX.playHover()}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-white/[0.12] border border-white/[0.15] shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right ML Status Telemetry Pill */}
          <div className="flex items-center gap-2">
            <AudioHUD />
            <Link
              to="/model"
              onClick={() => soundFX.playHover()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40 transition-all text-xs font-mono group"
            >
              <BrainCircuit className="h-3.5 w-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline font-semibold">Model Acc: 98.6%</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
