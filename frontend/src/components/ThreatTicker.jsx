import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, TrendingUp, Radar } from 'lucide-react';
import { apiFetch } from '../utils/api';

const EMPTY_FEED = [
  {
    type: 'LIVE',
    title: 'Threat intelligence temporarily unavailable',
    detail: 'Real-world scam intelligence will appear when the feed is available.',
    severity: 'high',
    regions: 'India',
  },
];

const severityStyles = {
  critical: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  },
  high: {
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  },
  medium: {
    dot: 'bg-yellow-400',
    badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
  },
  low: {
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  },
};

export default function ThreatTicker() {
  const [index, setIndex] = useState(0);
  const [livePulse, setLivePulse] = useState(true);
  const [feed, setFeed] = useState(EMPTY_FEED);

  const [metrics, setMetrics] = useState({
    threatsBlocked: null,
    fraudTrend: null,
    modelAccuracy: null,
  });

  const [loading, setLoading] = useState(true);

  // Fetch real threat intelligence
  useEffect(() => {
    let mounted = true;

    const loadThreatIntelligence = async () => {
      try {
        setLoading(true);

        const response = await apiFetch('/api/threat-ticker');

        if (!response.ok) {
          throw new Error(`Threat API failed: ${response.status}`);
        }

        const data = await response.json();

        if (!mounted) return;

        if (Array.isArray(data.items) && data.items.length > 0) {
          setFeed(data.items);
        }

        if (data.metrics) {
          setMetrics({
            threatsBlocked: data.metrics.threatsBlocked ?? null,
            fraudTrend: data.metrics.fraudTrend ?? null,
            modelAccuracy: data.metrics.modelAccuracy ?? null,
          });
        }
      } catch (error) {
        console.error('Threat intelligence error:', error);

        if (mounted) {
          setFeed(EMPTY_FEED);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadThreatIntelligence();

    return () => {
      mounted = false;
    };
  }, []);

  // Rotate threat items
  useEffect(() => {
    if (feed.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % feed.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [feed]);

  // Live indicator pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePulse((pulse) => !pulse);
    }, 900);

    return () => clearInterval(timer);
  }, []);

  // Keep index valid when feed changes
  useEffect(() => {
    if (index >= feed.length) {
      setIndex(0);
    }
  }, [feed, index]);

  const item = feed[index] || feed[0];

  const style =
    severityStyles[item?.severity?.toLowerCase()] ||
    severityStyles.high;

  return (
    <div className="hidden sm:flex items-stretch gap-0.5 px-6 py-1.5 bg-gradient-to-r from-[#170b14] via-[#071016] to-[#07070a] border-b border-white/[0.04]">

      {/* LIVE INDICATOR */}
      <div className="flex items-center gap-2 pr-5 mr-5 border-r border-white/[0.06] shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={
              'absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75 ' +
              (livePulse ? 'animate-ping' : '')
            }
          />

          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
        </span>

        <span className="block text-[10px] font-mono font-bold tracking-widest text-white">
          LIVE
        </span>
      </div>

      {/* THREAT FEED */}
      <div className="flex items-center min-w-0 flex-1 overflow-hidden relative">

        <AnimatePresence mode="wait">
          <motion.div
            key={`${index}-${item?.title}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center gap-3 min-w-0"
          >

            {/* TYPE */}
            <span
              className={
                'shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ' +
                style.badge
              }
            >
              <Radar className="h-3 w-3" />

              <span className="text-[9px] font-mono font-bold tracking-wide">
                {item?.type || 'THREAT'}
              </span>
            </span>

            {/* TITLE */}
            <span className="text-[11px] font-semibold text-slate-100 whitespace-nowrap">
              {item?.title || 'Threat intelligence unavailable'}
            </span>

            {/* SEVERITY DOT */}
            <span
              className={
                'h-1 w-1 rounded-full ' +
                style.dot +
                ' shrink-0'
              }
            />

            {/* DETAIL */}
            <span className="text-[10px] font-mono text-slate-400 truncate">
              {item?.detail || item?.summary || 'No additional information'}
            </span>

          </motion.div>
        </AnimatePresence>

        {/* Existing visual gradients — DO NOT CHANGE */}
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#071016] to-transparent pointer-events-none" />

        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#07070a] to-transparent pointer-events-none" />

      </div>

      {/* REAL BACKEND METRICS */}
      <div className="hidden lg:flex items-center gap-4 pl-5 ml-5 border-l border-white/[0.06] shrink-0">

        {/* Threats blocked */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
          <ShieldAlert className="h-3 w-3 text-rose-400" />

          <span className="font-bold text-white">
            {metrics.threatsBlocked !== null
              ? metrics.threatsBlocked.toLocaleString()
              : '--'}
          </span>

          <span className="text-slate-500">
            threats blocked
          </span>
        </div>

        {/* Fraud trend */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
          <TrendingUp className="h-3 w-3 text-amber-400" />

          <span className="font-bold text-white">
            {metrics.fraudTrend !== null
              ? `${metrics.fraudTrend > 0 ? '+' : ''}${metrics.fraudTrend}%`
              : '--'}
          </span>

          <span className="text-slate-500">
            UPI fraud
          </span>
        </div>

        {/* Model accuracy */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
          <Zap className="h-3 w-3 text-cyan-400" />

          <span className="font-bold text-white">
            {metrics.modelAccuracy !== null
              ? `${metrics.modelAccuracy}%`
              : '--'}
          </span>

          <span className="text-slate-500">
            model accuracy
          </span>
        </div>

      </div>
    </div>
  );
}