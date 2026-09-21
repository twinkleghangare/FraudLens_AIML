# FraudLens

## AI-Powered UPI Scam Detection & Risk Analysis System

FraudLens is an **AI/ML and Data Science-based cybersecurity system** that detects and analyzes digital-payment fraud across **messages, URLs, and UPI QR codes**.

It combines **NLP, supervised machine learning, security heuristics, explainable AI, URL analysis, UPI intent analysis, and threat intelligence** to generate a scam prediction, risk score, evidence-based explanation, and safety guidance.

---

## Key Features

* **Message NLP:** Scam/Genuine classification for SMS and WhatsApp-style messages.
* **Risk Analysis:** 0–100 risk score mapped to LOW, MEDIUM, HIGH, or CRITICAL.
* **Explainable AI:** Identifies the specific evidence and social-engineering patterns contributing to the risk.
* **URL Scanner:** Detects suspicious domains, typosquatting, risky TLDs, and phishing indicators.
* **QR Analysis:** Parses UPI payment payloads and identifies potential reverse-debit patterns.
* **Threat Intelligence:** Collects and categorizes cyber-fraud advisories and reports.
* **Data Science Studio:** Provides model metrics, diagnostic analysis, feature information, and evaluation results.
* **Audit History:** Stores previous analysis results and risk assessments.
* **1930 Complaint Draft:** Generates a structured cyber-fraud incident description for reporting.

---

## Supported Threat Patterns

FraudLens focuses on common Indian digital-payment scams, including:

* Fake KYC / account-blocking scams
* Electricity disconnection scams
* Digital arrest / authority impersonation
* Cashback and lottery scams
* Job fraud
* Phishing URLs
* Banking-brand typosquatting
* UPI QR reverse-debit scams
* UPI PIN solicitation
* Malicious APK delivery
* Artificial urgency and financial manipulation

---

## System Workflow

```text
Message / URL / QR
        ↓
Preprocessing
        ↓
NLP / Structural Feature Extraction
        ↓
ML Classification + Security Heuristics
        ↓
Scam / Genuine Prediction
        ↓
Risk Engine (0–100)
        ↓
Explainable AI
        ↓
Safety Guidance
        ↓
1930 Complaint Draft
```

---

## Machine Learning Pipeline

### Text Processing

* Text normalization
* Tokenization
* URL masking
* Stopword processing
* English/Hinglish normalization

### Feature Extraction

* TF-IDF
* Unigrams and bigrams
* Lexical indicators
* Message-length signals
* URL presence
* Scam-related keywords
* Payment and credential indicators

### Models Evaluated

| Model                   | Mean CV Accuracy | Mean CV F1 |
| ----------------------- | ---------------: | ---------: |
| Multinomial Naive Bayes |           98.09% |     92.57% |
| Logistic Regression     |           97.38% |     89.19% |
| LinearSVC               |           98.36% |     93.53% |

The implemented classification pipeline uses **Scikit-Learn** with a serialized model using **Joblib**.

---

## Dataset

FraudLens uses a combined dataset consisting of:

### UCI SMS Spam Collection

* 5,572 public SMS samples

### Curated Indian UPI Cybercrime Corpus

Includes:

* KYC scams
* Electricity scams
* Cashback/lottery scams
* Digital arrest
* Job fraud
* Banking messages
* UPI-related fraud
* English and Hinglish samples

### Processed Dataset

| Class         |   Samples |
| ------------- | --------: |
| Genuine       |     4,531 |
| Scam / Threat |       697 |
| **Total**     | **5,228** |

---

## Dataset Analysis

| Metric                   | Genuine |  Scam |
| ------------------------ | ------: | ----: |
| Dataset Distribution     |   86.7% | 13.3% |
| Average Character Length |    71.3 | 137.6 |
| URL Attachment Rate      |    0.4% | 16.8% |

Frequently observed scam-related terms include:

`claim`, `prize`, `call`, `guaranteed`, `KYC`, `blocked`, `immediately`, `update`

---

## Holdout Evaluation

Evaluation was performed on a **1,046-sample holdout set**.

| Metric         |     Result |
| -------------- | ---------: |
| Accuracy       | **98.57%** |
| Scam Precision | **97.69%** |
| Scam Recall    | **91.37%** |
| F1-Score       | **0.9442** |

### Confusion Matrix

|                 | Predicted Safe | Predicted Scam |
| --------------- | -------------: | -------------: |
| **Actual Safe** |            904 |              3 |
| **Actual Scam** |             12 |            127 |

These results describe performance on the current project dataset and are **not a guarantee of production-world detection performance**.

---

# Risk Engine

FraudLens combines machine-learning output with deterministic security indicators.

```text
Final Risk Score =
(ML Probability × 0.45)
+
(Heuristic Risk × 0.55)
```

### Risk Levels

|  Score | Level    |
| -----: | -------- |
|   0–25 | LOW      |
|  26–50 | MEDIUM   |
|  51–75 | HIGH     |
| 76–100 | CRITICAL |

### Critical Escalation Indicators

Certain indicators can automatically increase the severity:

* UPI PIN request
* Reverse-debit instruction
* Digital arrest / police impersonation
* Electricity disconnection deadline
* Trojan APK delivery

Verified banking sequences containing transaction details can reduce the resulting risk score.

---

# Explainable AI

FraudLens provides evidence instead of returning only a classification label.

Example:

```text
"Power will be disconnected tonight"
        ↓
Essential-Service Threat
        ↓
Artificial Urgency
```

```text
"Enter your UPI PIN to receive money"
        ↓
Reverse-Debit Risk
```

The explanation layer identifies:

* Contextual evidence
* Threat category
* Psychological/social-engineering vector
* Risk contribution
* Recommended safety action

---

# URL Analysis

The URL Scanner evaluates structural phishing indicators including:

* Brand typosquatting
* Suspicious TLDs
* HTTP/HTTPS usage
* Subdomain structure
* Brand-token similarity
* Financial-brand impersonation

The detector provides **risk indicators**, not a guarantee that a domain is malicious or legitimate.

---

# UPI QR Analysis

The QR module parses UPI payment intent information and evaluates potential payment manipulation.

Example UPI structure:

```text
upi://pay?
pa=<payee>
pn=<name>
am=<amount>
cu=INR
```

The system specifically checks for patterns associated with **reverse-debit fraud**, where users may be manipulated into authorizing a payment while believing they are receiving money.

---

# Threat Intelligence

FraudLens processes cyber-fraud information from configured sources such as:

* CERT-In
* I4C
* PIB Fact Check
* Verified cyber-fraud feeds

### Processing

```text
Feed
 ↓
Fetch
 ↓
Normalize
 ↓
Deduplicate
 ↓
Filter
 ↓
Categorize
 ↓
Threat Feed
```

Threat categories include:

`UPI Scam`, `KYC Scam`, `Digital Arrest`, `Electricity Scam`, `Job Scam`, `QR Scam`, `APK Malware`, and `Phishing`.

The system uses **in-memory and disk caching with a 6-hour TTL**.

---

# Application Modules

```text
Command Core
Message NLP
URL Scanner
QR Chamber
Data Science Studio
Audit History
```

### Command Core

Central dashboard for system status, threat information, and analysis modules.

### Message NLP

Analyzes message content using the NLP/ML pipeline.

### URL Scanner

Analyzes suspicious URLs and domains.

### QR Chamber

Analyzes UPI QR/payment intent data.

### Data Science Studio

Displays model evaluation, diagnostic information, and ML analysis.

### Audit History

Maintains previous analysis records and risk results.

---

# Technology Stack

| Layer               | Technologies                    |
| ------------------- | ------------------------------- |
| Programming         | Python 3.10+, JavaScript        |
| ML                  | Scikit-Learn                    |
| NLP                 | TF-IDF, Tokenization, Stopwords |
| Data Science        | Pandas, NumPy                   |
| Visualization       | Matplotlib, Seaborn             |
| Model Storage       | Joblib                          |
| Backend             | FastAPI, Uvicorn, Pydantic      |
| Threat Intelligence | Feedparser, Requests            |
| Frontend            | React 18, Vite                  |
| UI                  | Tailwind CSS                    |
| Animation           | Framer Motion                   |
| 3D Visualization    | Three.js                        |
| Icons               | Lucide React                    |

---

# Project Structure

```text
Fraud_lens/
│
├── ai_engine/
│   ├── app.py
│   ├── run.py
│   ├── requirements.txt
│   │
│   ├── data/
│   │   ├── corpus.json
│   │   ├── metrics.json
│   │   ├── eda_report.py
│   │   ├── eda_plots/
│   │   └── processed/
│   │       └── combined_fraud_dataset.csv
│   │
│   ├── models/
│   │   └── upi_scam_model.joblib
│   │
│   ├── preprocessing/
│   │   └── text_cleaner.py
│   │
│   ├── features/
│   │   └── extractor.py
│   │
│   ├── ml/
│   │   ├── train.py
│   │   └── classifier.py
│   │
│   ├── risk/
│   │   └── engine.py
│   │
│   ├── explainability/
│   │   └── xai.py
│   │
│   ├── detectors/
│   │   ├── url_detector.py
│   │   └── qr_detector.py
│   │
│   ├── intelligence/
│   │   ├── fetcher.py
│   │   ├── processor.py
│   │   └── cache.py
│   │
│   ├── storage/
│   │   └── history.py
│   │
│   └── tests/
│       └── test_api.py
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── utils/
    │
    └── package.json
```

---

# Installation

## Backend

```bash
cd ai_engine
pip install -r requirements.txt
python run.py
```

Backend:

```text
http://localhost:5005
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Testing

```bash
cd ai_engine
pytest
```

---

# Data Science Lifecycle

```text
Data Collection
      ↓
Data Cleaning
      ↓
Dataset Integration
      ↓
EDA
      ↓
Feature Engineering
      ↓
Model Training
      ↓
Cross-Validation
      ↓
Model Evaluation
      ↓
Risk Calibration
      ↓
Inference
```

---

# Limitations

* Current training data is primarily English/Hinglish and selected Indian scam patterns.
* New scam narratives may cause model drift.
* Newly registered phishing domains may bypass structural detection.
* QR analysis depends on successfully extracted UPI payload information.
* Current evaluation metrics are dataset-specific.
* Production deployment requires additional external validation and continuous retraining.

---

# Future Scope

* Hindi, Marathi, Tamil, Telugu, Bengali, and other regional-language models
* Screenshot/OCR-based scam detection
* Voice-call scam analysis
* Real-time domain reputation services
* Transformer-based NLP
* Active learning
* Model-drift monitoring
* Browser/mobile integration
* Continuous threat-intelligence-driven retraining

---

# Disclaimer

FraudLens is an **educational and research-oriented cybersecurity project**. Its predictions and risk scores are automated assessments and should not be treated as definitive proof of fraud.

For suspected financial cyber fraud in India, users should use official cybercrime reporting channels, including **1930** and the National Cyber Crime Reporting Portal.

---

## Project Summary

**FraudLens combines NLP, Machine Learning, Data Science, cybersecurity heuristics, explainable AI, URL analysis, UPI QR analysis, and threat intelligence into a unified digital-fraud analysis platform.**
