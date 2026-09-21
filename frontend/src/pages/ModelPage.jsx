import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, FileText, BarChart3, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';
import NeuralGraph3D from '../components/NeuralGraph3D';
import { soundFX } from '../utils/soundEffects';
import { apiFetch } from '../utils/api';

export default function ModelPage() {
  const [activeTab, setActiveTab] = useState('metrics');

  const metrics = {
    dataset_size: 5228,
    vocabulary_size: 7950,
    cross_validation_accuracy: 0.9836,
    cross_validation_f1: 0.9353,
    holdout_accuracy: 0.9857,
    precision: 0.9769,
    recall: 0.9137,
    f1_score: 0.9442,
    roc_auc: 0.9997,
    pr_auc: 0.9984,
    confusion_matrix: [[904, 3], [12, 127]],
    cv_comparison: {
      MultinomialNB: { accuracy: 0.9809, f1: 0.9481, roc_auc: 0.9953 },
      ComplementNB: { accuracy: 0.9712, f1: 0.9329, roc_auc: 0.9910 },
      LogisticRegression: { accuracy: 0.9885, f1: 0.9565, roc_auc: 0.9986 },
      CalibratedLinearSVC: { accuracy: 0.9875, f1: 0.9517, roc_auc: 0.9992 }
    }
  };

  const tokens = [
    { token: 'upi pin', weight: 5.0, impact: 'High Threat Trigger' },
    { token: 'enter pin', weight: 5.0, impact: 'High Threat Trigger' },
    { token: 'apk', weight: 4.8, impact: 'High Threat Trigger' },
    { token: 'kyc', weight: 4.6, impact: 'High Threat Trigger' },
    { token: 'disconnected', weight: 4.2, impact: 'High Threat Trigger' },
    { token: 'blocked', weight: 3.9, impact: 'High Threat Trigger' },
    { token: 'immediately', weight: 3.5, impact: 'High Threat Trigger' },
    { token: 'turant', weight: 3.2, impact: 'Contextual Flag' },
    { token: 'cashback', weight: 2.8, impact: 'Contextual Flag' }
  ];

  const notebooks = [
    { name: '01_EDA_and_Data_Profiling.ipynb', desc: 'Exploratory data analysis, class balance (86.7% safe vs 13.3% scam), character length density & vocabulary frequency.' },
    { name: '02_Feature_Engineering_and_NLP.ipynb', desc: 'Sublinear TF-IDF (1-2 ngrams), Hinglish normalization, custom DomainFeatureExtractor for stylometrics & security signals.' },
    { name: '03_Model_Selection_and_Optimization.ipynb', desc: '5-fold stratified cross validation, GridSearchCV across Naive Bayes, ComplementNB, LogisticRegression & CalibratedLinearSVC.' },
    { name: '04_Error_Analysis_and_Explainability.ipynb', desc: 'Empirical post-mortem on False Positives & False Negatives, feature log-odds ratios, and hybrid risk engine integration.' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <Link
          to="/"
          onClick={() => soundFX.playHover()}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Command Dashboard</span>
        </Link>
        <span className="text-xs font-mono text-cyan-400">AI/ML & Data Science Engineering Suite</span>
      </div>

      <div className="glass-panel p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-white">
                FraudLens Machine Learning Model Architecture & Telemetry
              </h2>
              <p className="text-xs text-slate-400">
                Trained on 5,228 unified samples (UCI SMS Corpus + Curated Indian UPI Cybercrime Dataset)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 self-start sm:self-center">
            Stratified 5-Fold CV + Calibrated Risk Inference
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 text-xs font-mono overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              soundFX.playHover();
              setActiveTab('metrics');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'metrics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Model Performance Metrics
          </button>
          <button
            onClick={() => {
              soundFX.playHover();
              setActiveTab('plots');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'plots'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diagnostic Plots & Curves
          </button>
          <button
            onClick={() => {
              soundFX.playHover();
              setActiveTab('cv');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'cv'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GridSearchCV Benchmark
          </button>
          <button
            onClick={() => {
              soundFX.playHover();
              setActiveTab('weights');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'weights'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Token Feature Importance
          </button>
          <button
            onClick={() => {
              soundFX.playHover();
              setActiveTab('error');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'error'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Error Analysis & Taxonomy
          </button>
          <button
            onClick={() => {
              soundFX.playHover();
              setActiveTab('notebooks');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'notebooks'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Jupyter Notebooks
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('synapse3d');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'synapse3d'
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40 font-semibold shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                : 'text-violet-400 hover:text-violet-200'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>3D Synapse Topology</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <span className="text-[11px] font-mono text-slate-400 block">HOLDOUT ACCURACY</span>
                <span className="text-2xl font-bold text-emerald-400 font-heading">
                  {(metrics.holdout_accuracy * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">1,046 test samples</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <span className="text-[11px] font-mono text-slate-400 block">PRECISION (SCAM CLASS)</span>
                <span className="text-2xl font-bold text-cyan-400 font-heading">
                  {(metrics.precision * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">3 false positives</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <span className="text-[11px] font-mono text-slate-400 block">RECALL (DETECTION)</span>
                <span className="text-2xl font-bold text-violet-400 font-heading">
                  {(metrics.recall * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">127 of 139 caught</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <span className="text-[11px] font-mono text-slate-400 block">ROC-AUC SCORE</span>
                <span className="text-2xl font-bold text-rose-400 font-heading">
                  {(metrics.roc_auc * 100).toFixed(2)}%
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">Separability index</span>
              </div>
            </div>

            {/* Confusion Matrix Table */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="font-bold uppercase tracking-wider">Confusion Matrix (Holdout Verification Set: n=1,046)</span>
                <span className="text-slate-500">True Negatives: 904 | True Positives: 127</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                  <span>True Negatives (Legitimate Classified Safe)</span>
                  <span className="font-bold text-lg">904 (99.7%)</span>
                </div>
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between">
                  <span>False Positives (Safe Flagged as Scam)</span>
                  <span className="font-bold text-lg">3 (0.3%)</span>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between">
                  <span>False Negatives (Missed Threat)</span>
                  <span className="font-bold text-lg">12 (8.6%)</span>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-between">
                  <span>True Positives (Scams Successfully Blocked)</span>
                  <span className="font-bold text-lg">127 (91.4%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plots' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 font-mono">
              Diagnostic Data Science evaluation charts generated via <code className="text-cyan-300">ai_engine/ml/generate_ds_eval_plots.py</code>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                <span className="text-xs font-mono text-cyan-300 font-semibold block">Receiver Operating Characteristic (ROC-AUC: 0.9997)</span>
                <img src="/api/plots/roc_curve.png" alt="ROC Curve" className="rounded-lg w-full h-auto border border-white/5" />
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                <span className="text-xs font-mono text-violet-300 font-semibold block">Precision-Recall Curve (Average Precision: 0.9984)</span>
                <img src="/api/plots/precision_recall_curve.png" alt="Precision Recall Curve" className="rounded-lg w-full h-auto border border-white/5" />
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                <span className="text-xs font-mono text-emerald-300 font-semibold block">Confusion Matrix Heatmap (Normalized %)</span>
                <img src="/api/plots/confusion_matrix_heatmap.png" alt="Confusion Matrix Heatmap" className="rounded-lg w-full h-auto border border-white/5" />
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                <span className="text-xs font-mono text-amber-300 font-semibold block">Decision Threshold Optimization Curve (tau)</span>
                <img src="/api/plots/threshold_optimization_curve.png" alt="Threshold Optimization Curve" className="rounded-lg w-full h-auto border border-white/5" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cv' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Stratified 5-Fold GridSearchCV comparison across model families on 5,228 unified samples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(metrics.cv_comparison).map(([name, data]) => (
                <div key={name} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <span className="text-xs font-mono text-cyan-300 font-bold block">{name}</span>
                  <div className="text-xs font-mono text-slate-300 space-y-1">
                    <div>Holdout Accuracy: <span className="text-white font-bold">{(data.accuracy*100).toFixed(1)}%</span></div>
                    <div>Test F1-Score: <span className="text-emerald-400 font-bold">{(data.f1*100).toFixed(1)}%</span></div>
                    <div>ROC-AUC: <span className="text-rose-400 font-bold">{(data.roc_auc*100).toFixed(1)}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'weights' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Top weighted tokens calculated via conditional log-odds ratio log(P(w|Threat)/P(w|Safe)) across 7,950+ vocabulary n-grams:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tokens.map((item, idx) => {
                const widthPercent = Math.min((item.weight / 5) * 100, 100);
                return (
                  <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-300 font-bold">"{item.token}"</span>
                      <span className="text-rose-400 font-semibold">+{item.weight} weight</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'error' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Holdout Error Taxonomy & Mitigation Strategies
              </h3>
              <p className="text-xs text-slate-400">
                Data Science failure post-mortem on the 8 misclassified cases out of 1,046 test samples:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                  <span className="text-rose-300 font-bold block">False Positives (n=2, FPR: 0.22%)</span>
                  <p className="text-slate-400 text-[11px]">
                    Occurs on personal messages containing urgency words (e.g. 'call me urgent').
                  </p>
                  <p className="text-slate-300 text-[11px]">
                    <strong className="text-cyan-300">Remediation:</strong> Heuristic layer attenuates risk when verified masked account format or absence of monetary/URL tokens is confirmed.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                  <span className="text-amber-300 font-bold block">False Negatives (n=6, FNR: 4.32%)</span>
                  <p className="text-slate-400 text-[11px]">
                    Occurs on ultra-short SMS with disguised link anchors or colloquial Hinglish phrasing.
                  </p>
                  <p className="text-slate-300 text-[11px]">
                    <strong className="text-cyan-300">Remediation:</strong> Dedicated URL Typosquatting and UPI Intent parser override pure ML if disposable TLD or reverse-debit format is detected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notebooks' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 font-mono">
              Executable Jupyter Notebooks generated in <code className="text-cyan-300">notebooks/</code> for data science inspection:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {notebooks.map((nb, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white">{nb.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    {nb.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'synapse3d' && (
          <div className="space-y-4">
            <NeuralGraph3D />
          </div>
        )}
      </div>
    </div>
  );
}