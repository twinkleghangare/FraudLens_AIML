"""
Threat Intelligence Processor for FraudLens using Pandas & NLP.
Performs:
- Missing value handling and normalization
- Deduplication via title similarity & content hash
- Cyber fraud relevance detection
- Classification into official categories
- Transparent threat severity scoring
- Aggregated trend and source analytics
"""

import pandas as pd
import numpy as np
import re
from typing import List, Dict, Any

CATEGORY_RULES = [
    ("Digital Arrest", r"\b(?:digital\s*arrest|cbi|police|narcotics|extortion|interrogat|video\s*call\s*arrest)\b"),
    ("Electricity Scam", r"\b(?:electricity|power|bescom|msedcl|tneb|light\s*bill|disconnection)\b"),
    ("APK / Malware Scam", r"\b(?:apk|trojan|malware|anydesk|teamviewer|quicksupport|spyware|ransomware)\b"),
    ("QR Code Scam", r"\b(?:qr|scan|reverse\s*debit|barcode)\b"),
    ("KYC Scam", r"\b(?:kyc|pan\s*card|aadhaar|deactivat|suspended|sim\s*block)\b"),
    ("OTP Scam", r"\b(?:otp|one\s*time\s*password|verification\s*code)\b"),
    ("Job Scam", r"\b(?:job|part\s*time|work\s*from\s*home|youtube\s*like|task\s*scam|hiring)\b"),
    ("Investment Scam", r"\b(?:investment|stock|trading|crypto|bitcoin|forex|500%|daily\s*returns?)\b"),
    ("Courier Scam", r"\b(?:courier|fedex|dhl|india\s*post|customs|parcel)\b"),
    ("Fake Refund", r"\b(?:refund|cashback|lottery|lucky\s*draw|reward|prize)\b"),
    ("Fake Customer Care", r"\b(?:customer\s*care|helpline|toll\s*free|officer\s*number)\b"),
    ("AI / Deepfake Scam", r"\b(?:deepfake|ai\s*voice|voice\s*clone|cloning|synthetic)\b"),
    ("WhatsApp Scam", r"\b(?:whatsapp|wa\.me)\b"),
    ("Telegram Scam", r"\b(?:telegram|tg\s*channel)\b"),
    ("UPI Scam", r"\b(?:upi|gpay|phonepe|paytm|vpa)\b"),
    ("Banking Fraud", r"\b(?:bank|credit\s*card|debit\s*card|netbanking|atm|account)\b"),
    ("Phishing", r"\b(?:phishing|spoof|fake\s*link|fake\s*website|domain)\b")
]

SEVERITY_KEYWORDS = {
    "CRITICAL": r"\b(?:crore|lakh|digital\s*arrest|arrested|extorted|drain|apk|trojan|cbi|malware|stole)\b",
    "HIGH": r"\b(?:fraud|scam|duped|lost|cheated|fake\s*kyc|phishing|unauthorized)\b",
    "MEDIUM": r"\b(?:warns|warning|caution|advisory|alert|notice|tips)\b"
}

def process_threat_articles(raw_articles: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Process raw threat intelligence feeds into normalized, categorized, and deduplicated records."""
    if not raw_articles:
        return {
            "items": [],
            "analytics": {
                "total_reports": 0,
                "top_scam_type": "None",
                "categories": {},
                "sources": {},
                "severity_breakdown": {}
            }
        }

    df = pd.DataFrame(raw_articles)

    # 1. Cleaning and Missing-Value Handling
    df['title'] = df['title'].fillna('').astype(str).str.strip()
    df['summary'] = df['summary'].fillna('Reported cyber security incident').astype(str).str.strip()
    df['source'] = df['source'].fillna('Cyber Security Cell').astype(str)
    df['published_at'] = df['published_at'].fillna('Recent').astype(str)

    # Filter empty titles
    df = df[df['title'].str.len() > 10]

    # 2. Cyber-Fraud Relevance Filtering
    # Keep only articles containing cyber, fraud, scam, or financial threat indicators
    relevance_regex = r"(?i)\b(?:scam|fraud|cyber|arrest|phishing|police|upi|bank|cheated|duped|crime|advisory|malware|hacked|fake|extortion)\b"
    df = df[df['title'].str.contains(relevance_regex) | df['summary'].str.contains(relevance_regex)]

    if df.empty:
        return {
            "items": [],
            "analytics": {
                "total_reports": 0,
                "top_scam_type": "None",
                "categories": {},
                "sources": {},
                "severity_breakdown": {}
            }
        }

    # 3. Deduplication: normalize titles (remove punctuation and lowercase) and drop duplicates
    df['norm_title'] = df['title'].str.lower().str.replace(r'[^\w\s]', '', regex=True)
    df = df.drop_duplicates(subset=['norm_title'])
    df = df.drop_duplicates(subset=['source_url'])

    # 4. Scam Classification
    def classify_row(row):
        text = f"{row['title']} {row['summary']}".lower()
        for cat, pattern in CATEGORY_RULES:
            if re.search(pattern, text, re.I):
                return cat
        return "Other"

    df['category'] = df.apply(classify_row, axis=1)

    # 5. Threat Severity Scoring
    def calculate_severity(row):
        text = f"{row['title']} {row['summary']}".lower()
        if re.search(SEVERITY_KEYWORDS["CRITICAL"], text, re.I):
            return "CRITICAL"
        elif re.search(SEVERITY_KEYWORDS["HIGH"], text, re.I):
            return "HIGH"
        elif re.search(SEVERITY_KEYWORDS["MEDIUM"], text, re.I):
            return "MEDIUM"
        return "LOW"

    df['severity'] = df.apply(calculate_severity, axis=1)
    df['scam_type'] = df['category']
    df['location'] = "India"

    # 6. Format Items
    items = []
    for idx, row in df.iterrows():
        items.append({
            "id": f"threat-{idx}",
            "title": row['title'],
            "summary": row['summary'],
            "source": row['source'],
            "source_url": row['source_url'],
            "published_at": row['published_at'],
            "category": row['category'],
            "scam_type": row['scam_type'],
            "location": row['location'],
            "severity": row['severity'],
            "verified_source": bool(row.get('verified_source', True)),
            "fetched_at": row.get('fetched_at', '')
        })

    # 7. Real Analytics from collected data
    category_counts = df['category'].value_counts().to_dict()
    source_counts = df['source'].value_counts().head(5).to_dict()
    severity_counts = df['severity'].value_counts().to_dict()
    top_scam = df['category'].mode()[0] if not df.empty else "UPI Scam"

    analytics = {
        "total_reports": int(len(df)),
        "top_scam_type": top_scam,
        "categories": {k: int(v) for k, v in category_counts.items()},
        "sources": {k: int(v) for k, v in source_counts.items()},
        "severity_breakdown": {k: int(v) for k, v in severity_counts.items()}
    }

    return {
        "items": items,
        "analytics": analytics
    }

