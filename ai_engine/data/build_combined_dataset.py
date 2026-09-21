"""
Dataset Integration Pipeline for FraudLens.
Merges:
1. Public UCI SMS Spam Collection (5,572 real records)
2. Indian UPI & Banking Cybercrime Corpus (authentic UPI, KYC, electricity, QR, and bank alerts)
Outputs a unified, cleaned dataset for Data Science exploration, EDA, and ML training.
"""

import os
import json
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
UCI_CSV = os.path.join(BASE_DIR, "data", "datasets", "sms_spam_collection.csv")
INDIAN_CORPUS_JSON = os.path.join(BASE_DIR, "data", "corpus.json")
OUTPUT_CSV = os.path.join(PROCESSED_DIR, "combined_fraud_dataset.csv")

def build_dataset():
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    records = []

    # 1. Load UCI Dataset
    if os.path.exists(UCI_CSV):
        uci_df = pd.read_csv(UCI_CSV, encoding="utf-8")
        for _, row in uci_df.iterrows():
            lbl = str(row['label']).strip().lower()
            text = str(row['text']).strip()
            if not text:
                continue
            # label 1 = scam/spam, 0 = safe/ham
            target = 1 if lbl == 'spam' else 0
            records.append({
                "text": text,
                "label": "scam" if target == 1 else "safe",
                "category": "SMS Spam" if target == 1 else "Standard SMS",
                "target": target,
                "source": "UCI SMS Spam Collection"
            })
        print(f"[DatasetBuilder] Loaded {len(uci_df)} samples from UCI SMS Collection.")

    # 2. Load Indian UPI Scam Corpus
    if os.path.exists(INDIAN_CORPUS_JSON):
        with open(INDIAN_CORPUS_JSON, "r", encoding="utf-8") as f:
            indian_data = json.load(f)
        for item in indian_data:
            text = item.get("text", "").strip()
            raw_label = item.get("label", "safe").lower()
            category = item.get("category", "General")
            target = 1 if raw_label in ["scam", "suspicious", "high_risk"] else 0
            records.append({
                "text": text,
                "label": "scam" if target == 1 else "safe",
                "category": category,
                "target": target,
                "source": "Indian UPI Cyber Crime Corpus"
            })
        print(f"[DatasetBuilder] Loaded {len(indian_data)} samples from Indian UPI Corpus.")

    df = pd.DataFrame(records)

    # 3. Data Cleaning
    df = df.dropna(subset=['text'])
    df['text'] = df['text'].astype(str).str.strip()
    df = df[df['text'].str.len() > 5]
    df = df.drop_duplicates(subset=['text'])

    # 4. Feature Metadata for EDA
    df['char_length'] = df['text'].str.len()
    df['word_count'] = df['text'].str.split().apply(len)
    df['digit_count'] = df['text'].apply(lambda s: sum(c.isdigit() for c in s))
    df['has_url'] = df['text'].str.contains(r'https?://|www\.|\.(?:vip|top|xyz|com|in|org)', regex=True).astype(int)
    df['has_phone'] = df['text'].str.contains(r'\b[6-9]\d{9}\b|\b0\d{10}\b', regex=True).astype(int)

    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")
    print(f"[DatasetBuilder] Saved unified dataset ({len(df)} samples) to: {OUTPUT_CSV}")
    print("\nClass Breakdown:")
    print(df['label'].value_counts().to_string())
    print("\nCategory Breakdown (Top 10):")
    print(df['category'].value_counts().head(10).to_string())
    return df

if __name__ == "__main__":
    build_dataset()
