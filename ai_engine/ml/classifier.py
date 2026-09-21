"""
ML Inference Engine for FraudLens.
Loads the trained Scikit-Learn TF-IDF + MultinomialNB pipeline,
computes inference probabilities, confidence scores, and token contributions.
"""

import os
import json
import joblib
import numpy as np
from ai_engine.preprocessing.text_cleaner import clean_text

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class MLClassifier:
    def __init__(self):
        self.model_path = os.path.join(BASE_DIR, "models", "upi_scam_model.joblib")
        self.metrics_path = os.path.join(BASE_DIR, "data", "metrics.json")
        self.pipeline = None
        self.metrics = {}
        self.load_model()
        self.load_metrics()

    def load_model(self):
        if os.path.exists(self.model_path):
            self.pipeline = joblib.load(self.model_path)
        else:
            self.pipeline = None

    def load_metrics(self):
        if os.path.exists(self.metrics_path):
            with open(self.metrics_path, "r", encoding="utf-8") as f:
                self.metrics = json.load(f)

    def predict(self, raw_text: str) -> dict:
        """Run ML prediction on input message."""
        if not self.pipeline:
            # Fallback if model not trained yet
            return {
                "is_scam": False,
                "confidence": 0.5,
                "score": 50,
                "probabilities": {"scam": 0.5, "safe": 0.5},
                "contributingTokens": [],
                "metrics": self.metrics
            }

        cleaned = clean_text(raw_text)
        probs = self.pipeline.predict_proba([cleaned])[0]
        # Class 0: Safe, Class 1: Scam/Threat
        safe_prob = float(probs[0])
        scam_prob = float(probs[1])

        # Find contributing tokens in input text
        tfidf = self.pipeline.named_steps['tfidf']
        feature_names = tfidf.get_feature_names_out()
        vocab = tfidf.vocabulary_
        clf = self.pipeline.named_steps['clf']

        input_tokens = cleaned.split()
        contributing = []

        # Check 1-grams and 2-grams
        grams = input_tokens + [f"{input_tokens[i]} {input_tokens[i+1]}" for i in range(len(input_tokens)-1)]
        
        for g in set(grams):
            if g in vocab:
                idx = vocab[g]
                # Log prob difference indicates scam orientation
                weight = float(clf.feature_log_prob_[1][idx] - clf.feature_log_prob_[0][idx])
                if weight > 0:
                    contributing.append({
                        "token": g,
                        "weight": round(min(max(weight, 1.0), 5.0), 2),
                        "impact": "High Threat Trigger" if weight > 2.0 else "Contextual Flag"
                    })

        contributing.sort(key=lambda x: x["weight"], reverse=True)

        is_scam = bool(scam_prob >= 0.5)
        raw_score = int(round(scam_prob * 100))

        return {
            "is_scam": is_scam,
            "confidence": round(float(max(scam_prob, safe_prob)), 3),
            "score": raw_score,
            "probabilities": {
                "scam": round(scam_prob, 3),
                "safe": round(safe_prob, 3)
            },
            "contributingTokens": contributing[:8],
            "metrics": self.metrics
        }

# Global instance for app
ml_classifier = MLClassifier()

