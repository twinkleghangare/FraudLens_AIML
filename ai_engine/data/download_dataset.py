"""
Download the UCI SMS Spam Collection dataset — a legitimate public-domain dataset.
Source: https://archive.ics.uci.edu/ml/datasets/SMS+Spam+Collection
Licence: Creative Commons Attribution 4.0 (CC BY 4.0)
~5,574 labelled messages (spam / ham).
"""

import os
import zipfile
import requests
import pandas as pd

RAW_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip"
DATASETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datasets")
OUTPUT_CSV = os.path.join(DATASETS_DIR, "sms_spam_collection.csv")


def download_dataset() -> pd.DataFrame:
    os.makedirs(DATASETS_DIR, exist_ok=True)

    if os.path.exists(OUTPUT_CSV):
        print(f"[Dataset] Already downloaded → {OUTPUT_CSV}")
        return pd.read_csv(OUTPUT_CSV, encoding="utf-8")

    print("[Dataset] Downloading SMS Spam Collection from UCI …")
    zip_path = os.path.join(DATASETS_DIR, "sms_spam.zip")

    r = requests.get(RAW_URL, timeout=30)
    r.raise_for_status()
    with open(zip_path, "wb") as f:
        f.write(r.content)

    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(DATASETS_DIR)

    # The archive contains 'SMSSpamCollection' (tab-separated, no header)
    raw_path = os.path.join(DATASETS_DIR, "SMSSpamCollection")
    df = pd.read_csv(raw_path, sep="\t", header=None, names=["label", "text"],
                     encoding="latin-1")
    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")
    os.remove(zip_path)
    print(f"[Dataset] Saved {len(df)} records → {OUTPUT_CSV}")
    return df


def load_dataset() -> pd.DataFrame:
    """Load the SMS Spam Collection; download if missing."""
    if not os.path.exists(OUTPUT_CSV):
        return download_dataset()
    return pd.read_csv(OUTPUT_CSV, encoding="utf-8")


if __name__ == "__main__":
    df = download_dataset()
    print(df["label"].value_counts().to_string())
    print(f"\nTotal messages: {len(df)}")
    print(df.head(5).to_string())
