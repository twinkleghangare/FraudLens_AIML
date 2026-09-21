import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ShieldAlert, CheckCircle2, AlertTriangle, Terminal, Cpu, Zap, Activity } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import TiltCard from './TiltCard';

export default function HoloThreatScanner3D({ onRunAnalysis }) {
  const [selectedThreat, setSelectedThreat] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  const threatSamples = [
    {
      title: 'UPI Reverse-Debit QR Exploit',
      type: 'QR / UPI Protocol',
      payload: 'upi://pay?pa=refund-agent@hdfc&pn=FastRefund&am=9999&cu=INR&tn=AutoRefundApproval',
      riskScore: 92,
      level: 'CRITICAL',
      color: 'rose',
      tokens: ['upi://pay', 'am=9999', 'FastRefund', 'tn=AutoRefundApproval', 'REVERSE_DEBIT_TRAP'],
      explanation: 'Sender requested funds disguised as a credit refund. Entering UPI PIN will debit ₹9,999 immediately.',
    },
    {
      title: 'Urgent Electricity Disconnection',
      type: 'SMS Threat',
      payload: 'Dear customer electricity bill unpaid. Power cut at 9:30 PM. Call power officer 9876543210 urgently.',
      riskScore: 86,
      level: 'HIGH RISK',
      color: 'rose',
      tokens: ['electricity', 'unpaid', 'power cut', '9:30 PM', 'urgently', 'personal_mobile'],
      explanation: 'Coercive psychological urgency tactic simulating an immediate utility blackout without official discom billing ref.',
    },
    {
      title: 'Bank KYC Typosquatting Phishing',
      type: 'Domain / URL',
      payload: 'http://sbi-pan-kyc-verify.vip/portal/auth',
      riskScore: 94,
      level: 'CRITICAL',
      color: 'rose',
      tokens: ['.vip TLD', 'typosquat: SBI', 'credential_harvest', 'http_unencrypted'],
      explanation: 'High-risk .vip TLD impersonating State Bank of India with unencrypted HTTP transport harvesting PAN/Aadhaar.',
    },
    {
      title: 'Official Bank OTP Verification',
      type: 'Genuine Transaction',
      payload: 'Your SBI OTP is 492019 for txn of INR 350.00 at Swiggy. Do not share OTP with anyone.',
      riskScore: 8,
      level: 'SAFE',
      color: 'emerald',
      tokens: ['SBI Official', 'INR 350.00', 'Swiggy Merchant', 'Standard Disclaimer'],
      explanation: 'Legitimate merchant transaction with explicit merchant identification and safety warning.',
    },
  ];

  const current = threatSamples[selectedThreat];

  const triggerScan = (idx) => {
    setSelectedThreat(idx);
    setIsScanning(true);
    setScanProgress(0);
    soundFX.playScan();

    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        soundFX.playResult(threatSamples[idx].level === 'SAFE' ? 'Safe' : 'High Risk');
      }
    }, 90);
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#090a14]/90 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      {/* Background Hologram Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header with 3D Cyber Telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Scan className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                3D Holographic Threat Inspector
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Real-time multi-vector payload dissection & neural token decomposition
            </p>
          </div>
        </div>

        {/* Threat preset buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
          {threatSamples.map((sample, idx) => (
            <button
              key={sample.title}
              onClick={() => triggerScan(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                selectedThreat === idx
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sample.title.split(' ')[0]} {sample.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Holographic Scan Display */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
        
        {/* Left Column: 3D Payload Dissection Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl bg-black/70 border border-white/10 p-4 sm:p-5 overflow-hidden group">
            
            {/* Animated Laser Scanning Line */}
            {isScanning && (
              <motion.div
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] pointer-events-none z-20"
              />
            )}

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-white/[0.06]">
              <span className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span>INTERCEPTED PAYLOAD</span>
              </span>
              <span className="text-slate-500">VECTOR: {current.type}</span>
            </div>

            <p className="font-mono text-xs sm:text-sm text-cyan-100 bg-slate-950/60 p-3.5 rounded-xl border border-white/5 my-3 break-all leading-relaxed">
              {current.payload}
            </p>

            {/* Tokenized Linguistic & Protocol Atoms */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono text-slate-400 block">
                EXTRACTED THREAT ATOMS (TF-IDF / REGEX / HEURISTIC):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {current.tokens.map((token, i) => (
                  <motion.span
                    key={token}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                      current.level === 'SAFE'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {token}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Explainable AI Diagnosis */}
            <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 font-sans leading-relaxed">
              <span className="font-mono text-cyan-400 font-bold block mb-1">XAI ANALYSIS:</span>
              {current.explanation}
            </div>
          </div>
        </div>

        {/* Right Column: 3D Telemetry Radar & Score Meter */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <TiltCard glowColor={current.level === 'SAFE' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.4)'}>
            <div className="p-6 rounded-2xl bg-[#0b0d1b] border border-white/10 text-center w-full min-w-[240px] space-y-4">
              
              {/* Circular Gauge / Radar Ring */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    className={current.level === 'SAFE' ? 'stroke-emerald-400' : 'stroke-rose-500'}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * (isScanning ? scanProgress : current.riskScore)) / 100}
                    strokeLinecap="round"
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black font-mono tracking-tighter text-white">
                    {isScanning ? scanProgress : current.riskScore}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    THREAT INDEX
                  </span>
                </div>
              </div>

              {/* Classification Status Tag */}
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    current.level === 'SAFE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse'
                  }`}
                >
                  {current.level === 'SAFE' ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldAlert className="h-3.5 w-3.5" />
                  )}
                  {current.level}
                </span>
              </div>

              {/* Quick Action Trigger */}
              <button
                onClick={() => triggerScan(selectedThreat)}
                disabled={isScanning}
                className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-xs font-mono text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>{isScanning ? 'RE-SCANNING...' : 'TRIGGER LIVE RESCAN'}</span>
              </button>

            </div>
          </TiltCard>
        </div>

      </div>
    </div>
  );
}

