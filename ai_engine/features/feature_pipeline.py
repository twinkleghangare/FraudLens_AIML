"""
FraudLens Advanced Data Science Feature Pipeline.
Constructs a hybrid feature space combining:
1. Lexical Subspace: Sublinear TF-IDF with word n-grams (1-2)
2. Stylometric Subspace: Character entropy, uppercase ratio, digit density, exclamation frequency
3. Domain Cybersecurity Signals: VPA density, URL risk indicators, urgency triggers, reverse-debit phrases
"""

import re
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler

class DomainFeatureExtractor(BaseEstimator, TransformerMixin):
    """Custom Scikit-Learn Transformer extracting dense stylometric & domain security features."""

    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def _extract_single(self, text: str) -> list:
        s = str(text)
        length = max(len(s), 1)
        words = s.split()
        word_count = max(len(words), 1)

        # 1. Stylometric features
        caps_ratio = sum(1 for c in s if c.isupper()) / length
        digit_density = sum(1 for c in s if c.isdigit()) / length
        exclamation_count = s.count('!')
        question_count = s.count('?')

        # 2. Domain Security Signals
        lower = s.lower()
        has_url = 1.0 if re.search(r'https?://|www\.|\.(?:vip|top|xyz|cc|site|live|apk)', lower) else 0.0
        has_phone = 1.0 if re.search(r'(?:\+91[\-\s]?)?[6-9]\d{9}', s) else 0.0
        has_vpa = 1.0 if re.search(r'[\w\.\-]+@(okaxis|okhdfcbank|okicici|oksbi|paytm|ybl|apl|upi)', lower) else 0.0

        # Urgency intensity score
        urgency_terms = ['immediately', 'today', 'tonight', '9:30', 'within', 'blocked', 'suspended', 'turant', 'jaldi', 'urgent', 'line cut']
        urgency_score = sum(1.0 for term in urgency_terms if term in lower)

        # Reverse-debit trap indicators
        reverse_debit_terms = ['scan qr', 'enter pin', 'upi pin', 'receive money', 'claim cashback', 'lucky draw', 'cash prize']
        reverse_debit_score = sum(1.0 for term in reverse_debit_terms if term in lower)

        # Credential solicitation indicators
        credential_terms = ['kyc', 'pan card', 'aadhaar', 'otp', 'mpin', 'password', 'netbanking']
        credential_score = sum(1.0 for term in credential_terms if term in lower)

        return [
            float(length),
            float(word_count),
            float(caps_ratio),
            float(digit_density),
            float(exclamation_count),
            float(question_count),
            float(has_url),
            float(has_phone),
            float(has_vpa),
            float(urgency_score),
            float(reverse_debit_score),
            float(credential_score)
        ]

    def transform(self, X):
        features = [self._extract_single(text) for text in X]
        return np.array(features, dtype=np.float64)

def build_feature_pipeline() -> FeatureUnion:
    """Builds a composite Scikit-Learn FeatureUnion combining NLP and dense features."""
    composite_pipeline = FeatureUnion([
        ("tfidf_lexical", TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=2,
            sublinear_tf=True,
            strip_accents='unicode'
        )),
        ("dense_domain", Pipeline([
            ("extractor", DomainFeatureExtractor()),
            ("scaler", StandardScaler(with_mean=False)) # preserve sparsity compatibility
        ]))
    ])
    return composite_pipeline

