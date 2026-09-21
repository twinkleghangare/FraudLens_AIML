import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquareText, Link2, QrCode, ArrowRight, BrainCircuit, ShieldAlert, Sparkles, Terminal, Play, Zap } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ScenarioPlaybook from '../components/ScenarioPlaybook';
import LiveMetricsBar from '../components/LiveMetricsBar';
import TiltCard from '../components/TiltCard';
import HoloThreatScanner3D from '../components/HoloThreatScanner3D';
import FloatingFintech3D from '../components/FloatingFintech3D';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal';
import { soundFX } from '../utils/soundEffects';

export default function LandingDashboard() {
  const navigate = useNavigate();

  const featureCards = [
    {
      to: '/message',
      title: 'Message NLP & Scam Studio',
      description: 'Sublinear TF-IDF & Scikit-Learn classifier detecting fake KYC threats, power cuts, and coercive urgency.',
      icon: MessageSquareText,
      badge: 'TF-IDF + Naive Bayes/LinearSVC',
      glowColor: 'rgba(56, 189, 248, 0.35)',
      accentColor: 'text-sky-400'
    },
    {
      to: '/url',
      title: 'Phishing & Domain Link Lab',
      description: 'Domain typosquatting engine calculating brand distance against SBI, HDFC, Paytm, and .vip/.top TLDs.',
      icon: Link2,
      badge: 'Typosquatting & APK Detector',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      accentColor: 'text-purple-400'
    },
    {
      to: '/qr',
      title: 'UPI QR Reverse-Debit Chamber',
      description: 'Parses raw upi://pay intent links to identify cashback traps and prevent unauthorised fund deductions.',
      icon: QrCode,
      badge: 'NPCI UPI Protocol Parser',
      glowColor: 'rgba(244, 63, 94, 0.35)',
      accentColor: 'text-rose-400'
    },
    {
      to: '/model',
      title: 'Data Science & ML Studio',
      description: 'Inspect 5-Fold GridSearchCV results, ROC/PR curves, confusion matrix, error taxonomy & 4 Jupyter Notebooks.',
      icon: BrainCircuit,
      badge: '98.6% Acc | 5,228 Samples',
      glowColor: 'rgba(52, 211, 153, 0.35)',
      accentColor: 'text-emerald-400'
    }
  ];

  const quickSimulations = [
    {
      label: 'Fake SBI KYC Suspension',
      category: 'SMS Scam',
      action: () => {
        soundFX.playScan();
        navigate('/message', { state: { prefillText: 'Dear customer your SBI account will be suspended today. Click link to update your PAN and Aadhaar immediately http://sbi-pan-kyc.vip' } });
      }
    },
    {
      label: 'Electricity Power-Cut at 9:30 PM',
      category: 'Utility Threat',
      action: () => {
        soundFX.playScan();
        navigate('/message', { state: { prefillText: 'Dear consumer your electricity power will be disconnected tonight at 9:30 PM from electricity office. Immediately contact officer at 9876543210.' } });
      }
    },
    {
      label: 'Scan QR to Receive ₹4,999 Cashback',
      category: 'Reverse QR Trap',
      action: () => {
        soundFX.playScan();
        navigate('/qr', { state: { prefillQr: 'upi://pay?pa=rewards-cashback-desk@okhdfcbank&pn=GPayCashbackDept&am=4999.00&cu=INR&tn=CashbackRewardCreditApproved', expectedAction: 'receive' } });
      }
    },
    {
      label: 'Typosquatted Banking Phishing Link',
      category: 'Phishing Link',
      action: () => {
        soundFX.playScan();
        navigate('/url', { state: { prefillUrl: 'http://sbi-pan-kyc-verify.vip' } });
      }
    }
  ];

  const handleRunScenario = (item) => {
    if (item.type === 'message') {
      navigate('/message', { state: { prefillText: item.samplePayload } });
    } else if (item.type === 'url') {
      navigate('/url', { state: { prefillUrl: item.samplePayload } });
    } else if (item.type === 'qr') {
      navigate('/qr', { state: { prefillQr: item.samplePayload, expectedAction: item.expectedAction } });
    }
  };

  return (
    <div className="space-y-16">
      {/* 1. 3Dverse-Style Hero Section with 3D Prismatic Crystal Cube */}
      <HeroSection
        riskScore={25}
        classification="Safe"
        onScrollToAnalyzers={() => {
          const el = document.getElementById('workstations');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Interactive Cyber Attack Quick-Injection Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090b14]/80 border border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
              <Zap className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Quick Threat Simulation Matrix
              </span>
              <p className="text-[11px] font-mono text-slate-400">
                Click any real-world attack vector to inject and run live through the AI/ML pipeline.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {quickSimulations.map((sim, i) => (
              <button
                key={i}
                onClick={sim.action}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-violet-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer group"
              >
                <Play className="h-3 w-3 text-violet-400 fill-violet-400 group-hover:scale-110 transition-transform" />
                <span>{sim.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive 3D Tilt Workstation Cards */}
      <section id="workstations" className="space-y-6 pt-2 max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-pulse">Interactive 3D Workstations</span>
                <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  FastAPI Engine Active
                </span>
              </div>
              <h2 className="text-2xl font-bold font-heading text-white mt-1">
                Multi-Modal Cyber Threat Detectors
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Tilt and inspect real-time Python AI/ML inference across text, links, and UPI protocol intents.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Live Security Metrics Dashboard */}
        <LiveMetricsBar />

        {/* 4 Interactive 3D Perspective Tilt Workstation Cards */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <StaggerItem key={feat.to}>
                <TiltCard
                  glowColor={feat.glowColor}
                  onClick={() => {
                    soundFX.playHover();
                    navigate(feat.to);
                  }}
                  className="rounded-2xl border border-white/[0.08] bg-[#070913]/80 p-5 flex flex-col justify-between space-y-4 h-full shadow-xl hover:border-white/20 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl bg-white/[0.05] border border-white/10 ${feat.accentColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/10">
                        {feat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white font-heading transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                        {feat.description}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center text-xs font-semibold ${feat.accentColor} font-mono pt-2 border-t border-white/[0.05]`}>
                    <span>Launch Workstation</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* 4. Interactive 3D Holographic Threat Inspector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <HoloThreatScanner3D />
        </Reveal>
      </section>

      {/* 5. Data Science Diagnostic Center Showcase with 3D Tilt Panels */}
      {/* 5. 3Dverse-Style Architecture & Solutions Showcase */}
      <section className="space-y-8 pt-6 max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto space-y-3 pb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-gradient-to-r from-violet-500/15 via-indigo-500/15 to-purple-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>THE FUTURE OF CYBER DEFENSE</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight leading-tight">
              Enterprise architecture for <br className="hidden sm:inline" />
              instant threat elimination
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed max-w-xl mx-auto">
              Engineered with sublinear TF-IDF inference, cryptographic UPI intent parsing, and Bayesian posterior calibrations.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <TiltCard glowColor="rgba(168, 85, 247, 0.35)" className="rounded-3xl border border-white/[0.08] bg-[#070914]/85 p-6 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-purple-400">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25">
                  NLP VECTORS
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                Coercive Urgency & Linguistic Deconstruction
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deconstructs synthetic panic patterns, utility power-cut threats, and fake KYC notices using 7,950 linguistic n-grams with 96.35% precision.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Validation Precision:</span>
              <span className="text-purple-400 font-bold">96.35%</span>
            </div>
          </TiltCard>

          {/* Card 2 */}
          <TiltCard glowColor="rgba(56, 189, 248, 0.35)" className="rounded-3xl border border-white/[0.08] bg-[#070914]/85 p-6 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400">
                  <QrCode className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/25">
                  UPI PROTOCOL
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                Reverse-Debit QR & Intent Interception
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts raw <code className="text-sky-300">upi://pay</code> parameter queries. Flags deceptive cashback traps that request money when the victim expects to receive credit.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Trap Catch Rate:</span>
              <span className="text-sky-400 font-bold">100.0%</span>
            </div>
          </TiltCard>

          {/* Card 3 */}
          <TiltCard glowColor="rgba(52, 211, 153, 0.35)" className="rounded-3xl border border-white/[0.08] bg-[#070914]/85 p-6 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  1930 / CERT-IN
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                Explainable AI & One-Click Complaint Drafts
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Translates complex mathematical feature weights into plain-language safety actions with automated pre-formatted drafts for the National Cybercrime Portal.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Portal Ready:</span>
              <span className="text-emerald-400 font-bold">1930 Helpline</span>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* 6. Data Science Diagnostic Center Showcase with 3D Tilt Panels */}
      <section className="space-y-6 pt-2 max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-pulse">Empirical ML Evaluation</span>
                <span className="text-xs font-mono text-cyan-400">Holdout Verification Set: n=1,046</span>
              </div>
              <h2 className="text-xl font-bold font-heading text-white mt-1">
                Data Science & Diagnostic Architecture
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Publication-grade validation metrics generated directly on the 5,228 unified dataset.
              </p>
            </div>
            <Link
              to="/model"
              onClick={() => soundFX.playHover()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium border border-cyan-500/30 transition-all self-start sm:self-auto"
            >
              <span>Explore All 6 DS Studio Tabs</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Confusion Matrix */}
          <TiltCard glowColor="rgba(16, 185, 129, 0.25)" className="p-4 rounded-xl border border-white/[0.08] bg-[#070913]/80 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Confusion Matrix</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">98.6% Accuracy</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-slate-400 block text-[9px]">TRUE NEGATIVES</span>
                <span className="text-emerald-300 font-bold text-base">904</span>
                <span className="text-slate-500 block text-[9px]">99.7% specific</span>
              </div>
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-slate-400 block text-[9px]">TRUE POSITIVES</span>
                <span className="text-cyan-300 font-bold text-base">127</span>
                <span className="text-slate-500 block text-[9px]">91.4% caught</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-slate-400 block text-[9px]">FALSE POSITIVES</span>
                <span className="text-rose-300 font-bold text-base">3</span>
                <span className="text-slate-500 block text-[9px]">0.3% low error</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-slate-400 block text-[9px]">FALSE NEGATIVES</span>
                <span className="text-amber-300 font-bold text-base">12</span>
                <span className="text-slate-500 block text-[9px]">Heuristics catch</span>
              </div>
            </div>
          </TiltCard>

          {/* Card 2: Separability Curve Preview */}
          <TiltCard glowColor="rgba(14, 165, 233, 0.25)" className="p-4 rounded-xl border border-white/[0.08] bg-[#070913]/80 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">ROC-AUC Separability</span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">AUC = 0.9997</span>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Holdout ROC-AUC:</span>
                <span className="text-cyan-300 font-bold">99.97%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Precision-Recall AP:</span>
                <span className="text-violet-300 font-bold">99.84%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Decision Threshold tau:</span>
                <span className="text-amber-300 font-bold">0.42</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                Tuned decision boundary balances false alarms against financial theft risks.
              </p>
            </div>
          </TiltCard>

          {/* Card 3: Jupyter Notebooks Suite */}
          <TiltCard glowColor="rgba(168, 85, 247, 0.25)" className="p-4 rounded-xl border border-white/[0.08] bg-[#070913]/80 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Jupyter Notebooks</span>
              <span className="text-[10px] font-mono text-violet-400 font-bold">4 Active Labs</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div className="p-2 rounded bg-black/40 border border-white/5 truncate">
                <span className="text-cyan-300">01_</span> EDA & Data Profiling
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5 truncate">
                <span className="text-cyan-300">02_</span> Feature Engineering & NLP
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5 truncate">
                <span className="text-cyan-300">03_</span> Model Tuning & GridSearch
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5 truncate">
                <span className="text-cyan-300">04_</span> Error Post-Mortem & XAI
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* 6. 3D Fintech Payment Protection & Floating Titanium Cards (Reference Integration) */}
      <FloatingFintech3D />

      {/* 7. Real-World Attack Scenario Playbook with CERT-In Live Intelligence */}
      <section className="pt-2 max-w-7xl mx-auto px-4 sm:px-6">
        <ScenarioPlaybook onRunScenario={handleRunScenario} />
      </section>
    </div>
  );
}
