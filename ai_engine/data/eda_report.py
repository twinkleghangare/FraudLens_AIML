"""
FraudLens Exploratory Data Analysis (EDA) Pipeline.
Generates genuine statistical summaries and visualization charts
using Pandas, NumPy, Matplotlib, and Seaborn from the real unified dataset.
"""

import os
import json
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg') # Headless rendering
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(BASE_DIR, "data", "processed", "combined_fraud_dataset.csv")
PLOTS_DIR = os.path.join(BASE_DIR, "data", "eda_plots")
SUMMARY_FILE = os.path.join(BASE_DIR, "data", "eda_summary.json")

def run_eda():
    os.makedirs(PLOTS_DIR, exist_ok=True)
    print("=" * 60)
    print("   FRAUDLENS EXPLORATORY DATA ANALYSIS (EDA) PIPELINE")
    print("=" * 60)

    df = pd.read_csv(DATA_FILE)
    print(f"\n[EDA] Loaded {len(df)} records.")

    # 1. Statistical Aggregations
    scam_df = df[df['target'] == 1]
    safe_df = df[df['target'] == 0]

    stats_summary = {
        "dataset_total": len(df),
        "total_scam": len(scam_df),
        "total_safe": len(safe_df),
        "scam_percentage": round((len(scam_df) / len(df)) * 100, 2),
        "char_length": {
            "scam_mean": round(float(scam_df['char_length'].mean()), 2),
            "scam_median": float(scam_df['char_length'].median()),
            "safe_mean": round(float(safe_df['char_length'].mean()), 2),
            "safe_median": float(safe_df['char_length'].median()),
        },
        "word_count": {
            "scam_mean": round(float(scam_df['word_count'].mean()), 2),
            "safe_mean": round(float(safe_df['word_count'].mean()), 2),
        },
        "digit_count": {
            "scam_mean": round(float(scam_df['digit_count'].mean()), 2),
            "safe_mean": round(float(safe_df['digit_count'].mean()), 2),
        },
        "url_rate": {
            "scam_url_percentage": round(float(scam_df['has_url'].mean() * 100), 2),
            "safe_url_percentage": round(float(safe_df['has_url'].mean() * 100), 2),
        },
        "phone_rate": {
            "scam_phone_percentage": round(float(scam_df['has_phone'].mean() * 100), 2),
            "safe_phone_percentage": round(float(safe_df['has_phone'].mean() * 100), 2),
        }
    }

    print("\n--- Summary Statistics ---")
    print(f"Total Samples: {stats_summary['dataset_total']} (Safe: {stats_summary['total_safe']}, Scam: {stats_summary['total_scam']})")
    print(f"Scam Avg Char Length: {stats_summary['char_length']['scam_mean']} vs Safe: {stats_summary['char_length']['safe_mean']}")
    print(f"Scam URL Attachment Rate: {stats_summary['url_rate']['scam_url_percentage']}% vs Safe: {stats_summary['url_rate']['safe_url_percentage']}%")

    # 2. Extract Top Scam Keywords
    words = []
    stop = {'the', 'to', 'you', 'your', 'and', 'for', 'is', 'in', 'of', 'on', 'a', 'our', 'have', 'from', 'with'}
    for t in scam_df['text']:
        tokens = re.findall(r'\b[a-zA-Z]{3,}\b', t.lower())
        words.extend([w for w in tokens if w not in stop])
    top_words = Counter(words).most_common(15)
    stats_summary["top_scam_keywords"] = top_words

    # 3. Plot 1: Class Distribution
    plt.figure(figsize=(6, 4))
    colors = ['#10b981', '#f43f5e']
    sns.countplot(x='label', data=df, palette=colors, order=['safe', 'scam'])
    plt.title('FraudLens Dataset Class Distribution', fontsize=12, fontweight='bold')
    plt.xlabel('Message Label')
    plt.ylabel('Count')
    plt.grid(axis='y', alpha=0.3)
    p1 = os.path.join(PLOTS_DIR, "class_distribution.png")
    plt.tight_layout()
    plt.savefig(p1, dpi=150)
    plt.close()

    # 4. Plot 2: Message Length Distribution
    plt.figure(figsize=(8, 4))
    sns.kdeplot(scam_df['char_length'], color='#f43f5e', label='Scam/Threat', fill=True, alpha=0.4)
    sns.kdeplot(safe_df['char_length'], color='#10b981', label='Safe/Genuine', fill=True, alpha=0.4)
    plt.title('Character Length Density: Scam vs Safe Messages', fontsize=12, fontweight='bold')
    plt.xlabel('Character Length')
    plt.ylabel('Density')
    plt.xlim(0, 350)
    plt.legend()
    plt.grid(alpha=0.3)
    p2 = os.path.join(PLOTS_DIR, "message_length_distribution.png")
    plt.tight_layout()
    plt.savefig(p2, dpi=150)
    plt.close()

    # 5. Plot 3: Top Scam Keywords Bar Chart
    plt.figure(figsize=(9, 4.5))
    kws = [item[0] for item in top_words]
    counts = [item[1] for item in top_words]
    sns.barplot(x=counts, y=kws, palette='flare')
    plt.title('Top 15 Indicative Scam Tokens in Dataset', fontsize=12, fontweight='bold')
    plt.xlabel('Frequency')
    plt.ylabel('Keyword')
    plt.grid(axis='x', alpha=0.3)
    p3 = os.path.join(PLOTS_DIR, "top_scam_keywords.png")
    plt.tight_layout()
    plt.savefig(p3, dpi=150)
    plt.close()

    # 6. Save Summary JSON
    with open(SUMMARY_FILE, "w", encoding="utf-8") as f:
        json.dump(stats_summary, f, indent=2)
    print(f"\n[EDA] Plots saved to: {PLOTS_DIR}")
    print(f"[EDA] Summary JSON saved to: {SUMMARY_FILE}")

if __name__ == "__main__":
    run_eda()
