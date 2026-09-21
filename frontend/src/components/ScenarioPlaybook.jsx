import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldAlert, ShieldCheck, AlertTriangle, Play, ExternalLink, Radar, ChevronDown, ChevronUp } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from './Reveal';
import { soundFX } from '../utils/soundEffects';
import { apiFetch } from '../utils/api';

const SCAM_SHOWCASE_ITEMS = [
  {
    id: '#001',
    category: 'Fake KYC',
    type: 'message',
    title: 'SBI YONO Account Suspension SMS',
    description: 'Urgent SMS threatening SIM & bank account freeze unless PAN card is updated via spoofed link.',
    threatLevel: 'High Risk',
    score: 94,
    samplePayload: 'Dear customer your SBI bank account will be suspended today. Click link to update your PAN and Aadhaar card immediately http://sbi-pan-kyc.vip',
    tags: ['Fake KYC', 'Urgency', 'Bank Spoof']
  },
  {
    id: '#002',
    category: 'Utility Threats',
    type: 'message',
    title: 'Electricity Power Disconnection Threat (9:30 PM)',
    description: 'Threatens home power cut at 9:30 PM and provides personal 10-digit mobile number as electricity officer.',
    threatLevel: 'High Risk',
    score: 92,
    samplePayload: 'Dear consumer your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210.',
    tags: ['Electricity Scam', 'Panic Induction', 'Personal Number']
  },
  {
    id: '#003',
    category: 'Reverse QR',
    type: 'qr',
    title: 'The "Scan to Receive Cashback" QR Trap',
    description: 'Scammer promises ₹4,999 cashback, but sends a upi://pay debit request with hard-coded deduction amount.',
    threatLevel: 'High Risk',
    score: 98,
    samplePayload: 'upi://pay?pa=rewards-cashback-desk@okhdfcbank&pn=GPayCashbackDept&am=4999.00&cu=INR&tn=CashbackRewardCreditApproved',
    expectedAction: 'receive',
    tags: ['Reverse Debit', 'PIN Fraud', 'UPI Protocol']
  },
  {
    id: '#004',
    category: 'Phishing Links',
    type: 'url',
    title: 'Typosquatted SBI Netbanking (sbi-pan-kyc.vip)',
    description: 'Credential harvesting phishing domain with deceptive .vip top-level extension mimicry.',
    threatLevel: 'High Risk',
    score: 89,
    samplePayload: 'http://sbi-pan-kyc-verify.vip',
    tags: ['Typosquatting', '.vip TLD', 'Phishing']
  },
  {
    id: '#005',
    category: 'Reverse QR',
    type: 'qr',
    title: 'OLX Army Officer Advance Payment QR',
    description: 'Fraudulent buyer on classifieds marketplace sends QR saying "scan and approve to receive advance payment".',
    threatLevel: 'High Risk',
    score: 96,
    samplePayload: 'upi://pay?pa=olx-advance-agent@okaxis&pn=ArmyOfficerBuyer&am=12000.00&cu=INR&tn=ItemAdvancePayment',
    expectedAction: 'receive',
    tags: ['Marketplace Scam', 'Reverse Debit', 'Impersonation']
  },
  {
    id: '#006',
    category: 'Phishing Links',
    type: 'url',
    title: 'Trojan APK Delivery (jio-5g-upgrade.apk)',
    description: 'Direct download link targeting Android devices to install screen-sharing or SMS-stealing malware.',
    threatLevel: 'High Risk',
    score: 95,
    samplePayload: 'http://jio-5g-upgrade-secure.apk',
    tags: ['Android APK', 'Trojan', 'OTP Theft']
  },
  {
    id: '#007',
    category: 'Fake KYC',
    type: 'message',
    title: 'Work-From-Home YouTube Like WhatsApp Scam',
    description: 'Promises ₹5,000/day for liking videos, funneling victims to prepaid Telegram investment scams.',
    threatLevel: 'High Risk',
    score: 87,
    samplePayload: 'Part time work from home opportunity! Earn Rs 3,000 to 5,000 daily by liking YouTube videos and rating hotels. Contact HR on WhatsApp now wa.me/919988776655.',
    tags: ['Part-time Job', 'Prepaid Task', 'WhatsApp Bait']
  },
  {
    id: '#008',
    category: 'Safe Patterns',
    type: 'qr',
    title: 'Verified Swiggy Food Delivery QR',
    description: 'Legitimate merchant transaction with compliant Merchant Category Code (5812) and verified banking handle.',
    threatLevel: 'Safe',
    score: 12,
    samplePayload: 'upi://pay?pa=swiggy.food@icici&pn=Swiggy&mc=5812&am=380.00&cu=INR&tn=Order940192',
    expectedAction: 'pay',
    tags: ['Merchant Verified', 'MCC 5812', 'Safe Debit']
  },
  {
    id: '#009',
    category: 'Safe Patterns',
    type: 'message',
    title: 'Official Bank Transaction Alert',
    description: 'Standard debit alert SMS from bank with masked account number and clear UPI reference ID.',
    threatLevel: 'Safe',
    score: 8,
    samplePayload: 'Sent Rs 450.00 from HDFC Bank A/c XX4019 to Swiggy via UPI Ref No 429104928172. Available balance is Rs 24,190.00.',
    tags: ['Genuine Bank SMS', 'No Urgency', 'Legitimate']
  }
];

const CATEGORIES = ['All Scenarios', 'Live Cyber Alerts', 'Reverse QR', 'Fake KYC', 'Utility Threats', 'Phishing Links', 'Safe Patterns'];

export default function ScenarioPlaybook({ onRunScenario }) {
  const [activeCategory, setActiveCategory] = useState('All Scenarios');
  const [liveNews, setLiveNews] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  useEffect(() => {
    apiFetch('/api/scam-news/latest')
      .then(r => r.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setLiveNews(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const handleAnalyzePattern = async (newsItem) => {
    soundFX.playHover();
    setAnalyzingId(newsItem.id);
    try {
      const res = await apiFetch('/api/scam-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsItem.title,
          summary: newsItem.summary,
          category: newsItem.category
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedPattern(data.pattern);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingId(null);
    }
  };

  const isLiveMode = activeCategory === 'Live Cyber Alerts';

  const filteredItems = SCAM_SHOWCASE_ITEMS.filter((item) => {
    if (activeCategory === 'All Scenarios') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pulse">{isLiveMode ? 'Real-World Cyber Alerts' : 'Attack Playbook'}</span>
              <span className="text-xs font-mono text-cyan-400">
                {isLiveMode ? (liveNews.length + ' Official Reports') : (filteredItems.length + ' Curated Scenarios')}
              </span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white mt-1">
              {isLiveMode ? 'Publicly Reported Cybercrime Alerts & Incident Intelligence' : 'Real-World UPI Scam & Attack Patterns'}
            </h2>
            <p className="text-xs text-slate-400">
              {isLiveMode
                ? 'Authentic cyber threat advisories from CERT-In, national cyber cells, and verified press. Extract and test patterns directly.'
                : 'Live threat-vector library. Run any scenario through the detection engine.'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <Stagger className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none" gap={0.04}>
            {CATEGORIES.map((cat) => (
              <StaggerItem key={cat} y={12}>
                <button
                  onClick={() => {
                    soundFX.playHover();
                    setActiveCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                    activeCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Reveal>

      {/* Pattern Modal/Drawer if Extracted */}
      {selectedPattern && (
        <div className="p-4 rounded-xl glass-panel border border-cyan-500/40 bg-cyan-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold font-mono text-cyan-300 uppercase">
                Extracted Scam Pattern: {selectedPattern.category}
              </span>
            </div>
            <button
              onClick={() => setSelectedPattern(null)}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">IMPERSONATION</span>
              <span className="text-white font-semibold">{selectedPattern.impersonation}</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">SOCIAL ENGINEERING</span>
              <span className="text-white font-semibold">{selectedPattern.socialEngineering}</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">CREDENTIAL RISK</span>
              <span className="text-amber-300 font-semibold">{selectedPattern.credentialRisk}</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">PAYMENT RISK</span>
              <span className="text-rose-400 font-semibold">{selectedPattern.paymentRisk}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-md">
              Sample: "{selectedPattern.representativeMessage}"
            </span>
            <button
              onClick={() => {
                soundFX.playScan();
                onRunScenario({ type: 'message', samplePayload: selectedPattern.representativeMessage });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold shadow-md active:scale-95 transition-all shrink-0"
            >
              <Play className="h-3 w-3 fill-white" />
              <span>Test Similar Message in Analyzer</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of Cards: Live News or Curated Scenarios */}
      <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLiveMode ? (
          liveNews.map((news) => {
            const isCritical = news.severity === 'CRITICAL';
            return (
              <StaggerItem key={news.id}>
                <div className="group glass-card p-4 rounded-xl flex flex-col justify-between space-y-3 relative overflow-hidden h-full hover:scale-[1.02] hover:-translate-y-1 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {news.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isCritical
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {news.severity}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                      {news.summary}
                    </p>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span className="truncate max-w-[140px]">{news.source}</span>
                    <span>{news.published_at ? news.published_at.slice(0, 16) : 'Recent'}</span>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <a
                      href={news.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                    >
                      <span>Read Source</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      onClick={() => handleAnalyzePattern(news)}
                      disabled={analyzingId === news.id}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-medium border border-cyan-500/30 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {analyzingId === news.id ? (
                        <span>Analyzing...</span>
                      ) : (
                        <>
                          <Radar className="h-3 w-3" />
                          <span>Analyze Pattern</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </StaggerItem>
            );
          })
        ) : (
          filteredItems.map((item) => {
            const isHigh = item.threatLevel === 'High Risk';
            return (
              <StaggerItem key={item.id}>
                <div className="group glass-card p-4 rounded-xl flex flex-col justify-between space-y-3 relative overflow-hidden h-full hover:scale-[1.02] hover:-translate-y-1 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400">{item.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {item.threatLevel} ({item.score}/100)
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/[0.04] text-slate-400 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{item.type}</span>
                    <button
                      onClick={() => {
                        soundFX.playScan();
                        onRunScenario(item);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition-all active:scale-95"
                    >
                      <Play className="h-3 w-3 fill-cyan-400 text-cyan-400" />
                      <span>Run in 3D Threat Engine</span>
                    </button>
                  </div>
                </div>
              </StaggerItem>
            );
          })
        )}
      </Stagger>
    </div>
  );
}