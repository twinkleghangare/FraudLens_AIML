# FraudLens — AI-Powered UPI Scam Detection & Risk Analysis System

> **One-Line Objective for PPT:**  
> *“To develop an AI-powered UPI scam detection and risk analysis system that uses NLP, Machine Learning, and Data Science to identify digital fraud threats, explain their risk factors, and provide actionable safety guidance.”*

---

## 📌 Project Overview

**FraudLens** is an end-to-end cybersecurity intelligence and scam-detection platform engineered to protect digital payment users from coercive financial fraud, fake KYC threats, electricity power-cut scares, digital arrest extortion, typosquatted phishing links, and reverse-debit UPI QR traps.

### Core Workflow:
```text
Message / URL / QR
       ↓
Text Preprocessing (English & Hinglish)
       ↓
NLP & Feature Engineering (TF-IDF + Structural Signals)
       ↓
Machine Learning Classification (Scikit-Learn)
       ↓
Scam / Genuine Prediction
       ↓
Transparent Risk Engine (LOW, MEDIUM, HIGH, CRITICAL: 0–100)
       ↓
Explainable AI (XAI Cognitive Evidence Breakdown)
       ↓
Actionable Safety Guidance & 1930 Cybercrime Complaint Drafter
```

---

## 🎯 6 Core Focus Areas

1. **Scam Detection**: Automatically classifies user messages, SMS, and WhatsApp alerts as **Scam** or **Genuine** using a trained Scikit-Learn NLP pipeline.
2. **Risk Analysis**: Calculates a transparent, multi-factor risk score from **0 to 100** mapped to **LOW (0–25)**, **MEDIUM (26–50)**, **HIGH (51–75)**, and **CRITICAL (76–100)**.
3. **Explainable AI (XAI)**: Demystifies predictions by highlighting exact contextual evidence (e.g. artificial urgency, account threat, unverified VPA, reverse-debit trap) rather than a black-box answer.
4. **URL & QR Analysis**: Detects bank typosquatting, high-risk disposable TLDs (`.vip`, `.top`), unencrypted protocols, and parses NPCI UPI deep links to expose reverse-debit frauds ("Scan to receive cashback" schemes).
5. **Real-World Threat Intelligence**: Continuously aggregates, cleans, deduplicates, and categorizes real-world cyber fraud advisories and news from CERT-In, national cyber cells, and verified press via Pandas pipelines.
6. **Data Science**: Full lifecycle implementation — dataset curation, exploratory data analysis (EDA) with visual charts, feature engineering, cross-validation, and holdout evaluation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **AI / Machine Learning** | Scikit-Learn, Multinomial Naive Bayes, Logistic Regression, LinearSVC, Joblib |
| **Data Science & EDA** | Pandas, NumPy, Matplotlib, Seaborn |
| **Natural Language Processing** | TF-IDF (1–2 N-Grams), Tokenization, Stopwords, Hinglish normalization |
| **Backend & API** | Python 3.10+, FastAPI, Uvicorn, Pydantic |
| **Threat Intelligence** | Feedparser (RSS), Requests, Pandas Deduplication & Text Processing |
| **Frontend & Visualization** | React 18, Vite, Tailwind CSS, Framer Motion, Three.js (3D Threat Shield Matrix), Lucide Icons |

---

## 📊 Data Science & Machine Learning Pipeline

### 1. Dataset Source
- **Public Domain Corpus**: UCI SMS Spam Collection (5,572 authentic messages, CC BY 4.0 license).
- **Domain-Specific Cybercrime Corpus**: Curated Indian UPI Scam Corpus containing authentic fake KYC deactivation alerts, electricity disconnection notices, lottery/cashback baits, part-time job frauds, digital arrest extortion, and genuine banking debits/credits (English and Hinglish).
- **Total Unified Dataset**: **5,228 clean records** (4,531 genuine, 697 verified threat/scam samples).

### 2. Exploratory Data Analysis (EDA)
EDA scripts (`ai_engine/data/eda_report.py`) compute genuine statistical distributions and generate charts stored in `ai_engine/data/eda_plots/`:
- **Class Distribution**: 86.7% Genuine vs 13.3% Scam.
- **Message Character Length**: Scam messages average **137.6 characters** vs Genuine **71.3 characters**.
- **URL Attachment Rate**: 16.8% of scam messages contain disposable links vs 0.4% of safe messages.
- **Top Scam Tokens**: `claim`, `prize`, `call`, `guaranteed`, `kyc`, `blocked`, `immediately`, `update`.

### 3. Model Benchmark & Selection (5-Fold Stratified Cross-Validation)
| Model Candidate | Mean CV Accuracy | Mean CV F1-Score | Status |
|---|---|---|---|
| **Multinomial Naive Bayes (alpha=0.1)** | **98.09%** | **92.57%** | **Selected (Calibrated Probability)** |
| **Logistic Regression (C=2.0)** | 97.38% | 89.19% | Evaluated |
| **Linear Support Vector Classifier** | 98.36% | 93.53% | Evaluated |

### 4. Independent Holdout Evaluation (Test Set: n=1,046 samples)
- **Holdout Accuracy**: **98.57% (99%)**
- **Precision (Scam Class)**: **97.69%** (Only 3 false positives out of 907 safe messages)
- **Recall (Detection Rate)**: **91.37%** (127 of 139 scams caught)
- **F1-Score**: **0.9442 (94.4%)**
- **Real Confusion Matrix**:
  - True Negatives (Safe correctly passed): **904**
  - False Positives (Safe misflagged): **3**
  - False Negatives (Scams missed): **12**
  - True Positives (Scams blocked): **127**

---

## ⚖️ Transparent Risk Engine Methodology

The final risk score combines statistical ML confidence with deterministic heuristic threat triggers:
```text
Final Risk Score = (ML Probability × 0.45) + (Heuristic Stack × 0.55)
```
- **Direct PIN Solicitation / Reverse-Debit Trap**: Automatically elevates score to **CRITICAL (≥ 88)**.
- **Digital Arrest Extortion / Police Impersonation**: Automatically elevates score to **CRITICAL (≥ 90)**.
- **Utility / Electricity Disconnection Deadline**: Automatically elevates score to **HIGH / CRITICAL (≥ 85)**.
- **Trojan APK Delivery**: Automatically elevates score to **CRITICAL (≥ 92)**.
- **Verified Banking Sequence (Debited + UTR/Ref + Masked A/C)**: Attenuates score down to **Safe (≤ 15)**.

### Risk Levels:
- **0–25: LOW (Safe to Proceed)**
- **26–50: MEDIUM (Suspicious Anomalies Detected)**
- **51–75: HIGH (High Risk Financial Threat)**
- **76–100: CRITICAL (Severe Fraud / Reverse-Debit Trap)**

---

## 💡 Explainable AI (XAI) & 1930 Portal Integration

Each scan yields an evidence-backed cognitive breakdown:
1. **Contextual Evidence**: Maps text fragments to threat categories (e.g. *"tonight at 9:30 PM"* → Artificial Urgency, *"enter UPI PIN"* → Reverse-Debit Trap).
2. **Psychological Vectors**: Identifies exploitation tactics (Panic Induction, Fear of Essential Service Loss, Authority Impersonation).
3. **Actionable Rule**: Concrete guidance (e.g., *"Entering UPI PIN always sends money, it never receives money"*).
4. **1-Click 1930 Complaint Draft**: Pre-formats an incident brief ready to paste into the National Cyber Crime Reporting Portal (`cybercrime.gov.in` / helpline `1930`).

---

## 🌐 Real-World Scam Threat Intelligence Engine

FraudLens features a dedicated threat intelligence pipeline:
- **Sources**: Official government advisories (CERT-In, I4C, PIB Fact Check) and real cyber fraud report feeds.
- **Pandas Processing**: Deduplicates articles based on normalized title hashes and filters non-cyber noise.
- **NLP Categorization**: Automatically categorizes incidents into *UPI Scam, Digital Arrest, KYC Scam, Electricity Scam, Job Scam, QR Scam, APK Malware, etc.*
- **Caching**: Local in-memory and disk cache prevents redundant external fetches.
- **ThreatTicker Integration**: Supplies real-time reported scam incidents into the live top ticker with zero visual alteration.
- **Scam Pattern Analyzer**: Converts news incidents into structured attack patterns (*Impersonation, Social Engineering, Credential Risk, Payment Risk*) and allows testing a similar message in the 3D Message Analyzer.

---

## 🚀 Running the Project Locally

### 1. Python AI/ML Backend
```bash
# In project root
python ai_engine/run.py
# Server starts on http://localhost:5005
```

### 2. React Frontend
```bash
cd frontend
npm install
npm run dev
# Accessible at http://localhost:5173
```

---

## 📁 Clean Directory Architecture

```text
Fraud_lens/
├── ai_engine/                         # Python AI/ML & Threat Intelligence Core
│   ├── app.py                         # FastAPI backend (All REST endpoints)
│   ├── run.py                         # Uvicorn runner (Port 5005)
│   ├── requirements.txt               # Python dependencies
│   ├── data/
│   │   ├── corpus.json                # Curated Indian UPI Cybercrime corpus
│   │   ├── metrics.json               # Real evaluated model metrics
│   │   ├── eda_report.py              # Automated EDA script
│   │   ├── eda_plots/                 # Generated EDA charts
│   │   └── processed/
│   │       └── combined_fraud_dataset.csv # 5,228 unified samples
│   ├── models/
│   │   └── upi_scam_model.joblib      # Serialized Scikit-Learn pipeline
│   ├── preprocessing/
│   │   └── text_cleaner.py            # Tokenizer, Hinglish normalizer, URL masker
│   ├── features/
│   │   └── extractor.py               # Lexical, structural & security feature extractor
│   ├── ml/
│   │   ├── train.py                   # 5-Fold Stratified CV & Model Selection
│   │   └── classifier.py              # Probabilistic inference & token weights
│   ├── risk/
│   │   └── engine.py                  # Transparent risk engine (0–100)
│   ├── explainability/
│   │   └── xai.py                     # Explainable AI & 1930 complaint drafter
│   ├── detectors/
│   │   ├── url_detector.py            # Typosquatting & TLD phishing detector
│   │   └── qr_detector.py             # UPI intent parser & reverse-debit detector
│   ├── intelligence/
│   │   ├── fetcher.py                 # Live RSS cybercrime advisory fetcher
│   │   ├── processor.py               # Pandas deduplication & categorization
│   │   └── cache.py                   # 6-hour caching & ThreatTicker feed
│   ├── storage/
│   │   └── history.py                 # Audit trail & telemetry counter
│   └── tests/
│       └── test_api.py                # Automated 6-suite verification test
│
└── frontend/                          # React + Vite + Tailwind + Three.js UI
    ├── src/
    │   ├── components/                # ThreatTicker, ThreeThreatShield, MessageAnalyzer, etc.
    │   ├── pages/                     # LandingDashboard, MessagePage, URLPage, QRPage, ModelPage
    │   └── utils/                     # apiFetch helper
    └── package.json
```

---

## ⚠️ System Limitations & Future Scope

- **Dataset Scope**: The UCI dataset provides general SMS patterns, enriched with our curated Indian UPI corpus. Continuous expansion with regional vernacular scripts (Hindi, Marathi, Tamil) will further enhance colloquial detection.
- **Zero-Day Phishing**: Lookalike domains created minutes prior to attack may bypass static blacklists; the engine relies on structural heuristics (untrusted TLDs, multiple subdomains, brand token distance) to mitigate this.
- **Model Drift**: Scam scripts mutate (e.g. shift from electricity threats to digital arrest). Scheduled periodic retraining via `ai_engine/ml/train.py` keeps weights calibrated against newly emerging threat vectors.
