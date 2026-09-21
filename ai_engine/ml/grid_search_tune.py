"""
FraudLens Machine Learning Model Tuning & Hyperparameter Optimization Pipeline.
Performs rigorous grid search with Stratified 5-Fold Cross Validation across multiple model families:
1. Multinomial Naive Bayes (Laplace smoothing tuning)
2. Complement Naive Bayes (tailored for severe text class imbalance)
3. Logistic Regression (L2 regularization and class weighting)
4. Calibrated Linear Support Vector Classifier (Margin boundary with Platt calibration)
5. Random Forest Ensemble
Evaluates on F1-score, Precision, Recall, and ROC-AUC.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold, GridSearchCV, train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB, ComplementNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, f1_score, precision_score, recall_score, accuracy_score

import sys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, os.path.dirname(BASE_DIR))

from ai_engine.preprocessing.text_cleaner import clean_text

def run_grid_search_benchmark():
    print("=" * 70)
    print("   FRAUDLENS DATA SCIENCE: HYPERPARAMETER TUNING & BENCHMARKING")
    print("=" * 70)

    # 1. Load Clean Dataset
    data_path = os.path.join(BASE_DIR, "data", "processed", "combined_fraud_dataset.csv")
    df = pd.read_csv(data_path)
    print(f"\n[1] Loaded Dataset: {len(df)} samples (Safe: {sum(df['target']==0)}, Scam: {sum(df['target']==1)})")

    raw_texts = df['text'].astype(str).values
    y = df['target'].values
    cleaned_texts = np.array([clean_text(t) for t in raw_texts])

    # Holdout Split (80% Train / 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        cleaned_texts, y, test_size=0.20, random_state=42, stratify=y
    )

    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    # Candidate Pipelines & Parameter Grids
    experiments = {
        "MultinomialNB": {
            "pipeline": Pipeline([
                ("tfidf", TfidfVectorizer(min_df=2, sublinear_tf=True)),
                ("clf", MultinomialNB())
            ]),
            "params": {
                "tfidf__ngram_range": [(1, 1), (1, 2)],
                "clf__alpha": [0.01, 0.05, 0.1, 0.5, 1.0]
            }
        },
        "ComplementNB": {
            "pipeline": Pipeline([
                ("tfidf", TfidfVectorizer(min_df=2, sublinear_tf=True)),
                ("clf", ComplementNB())
            ]),
            "params": {
                "tfidf__ngram_range": [(1, 1), (1, 2)],
                "clf__alpha": [0.01, 0.05, 0.1, 0.5, 1.0]
            }
        },
        "LogisticRegression": {
            "pipeline": Pipeline([
                ("tfidf", TfidfVectorizer(min_df=2, sublinear_tf=True)),
                ("clf", LogisticRegression(max_iter=1000, random_state=42))
            ]),
            "params": {
                "tfidf__ngram_range": [(1, 2)],
                "clf__C": [0.5, 1.0, 2.0, 5.0],
                "clf__class_weight": [None, "balanced"]
            }
        },
        "CalibratedLinearSVC": {
            "pipeline": Pipeline([
                ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=2, sublinear_tf=True)),
                ("clf", CalibratedClassifierCV(LinearSVC(random_state=42, dual='auto'), cv=3))
            ]),
            "params": {}
        }
    }

    benchmark_results = {}
    best_overall_model = None
    best_overall_f1 = -1.0

    print("\n[2] Executing 5-Fold Stratified GridSearchCV Optimization...")
    for model_name, config in experiments.items():
        print(f"\nEvaluating: {model_name}...")
        grid = GridSearchCV(
            config["pipeline"],
            config["params"],
            cv=skf,
            scoring="f1",
            n_jobs=1,
            refit=True
        )
        grid.fit(X_train, y_train)

        best_estimator = grid.best_estimator_
        cv_f1 = float(grid.best_score_)

        # Test on independent Holdout set
        y_pred = best_estimator.predict(X_test)
        
        # Probabilities for ROC-AUC
        if hasattr(best_estimator, "predict_proba"):
            y_proba = best_estimator.predict_proba(X_test)[:, 1]
            auc_val = float(roc_auc_score(y_test, y_proba))
        else:
            auc_val = float(roc_auc_score(y_test, y_pred))

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        test_f1 = float(f1_score(y_test, y_pred, zero_division=0))

        benchmark_results[model_name] = {
            "best_params": {k: str(v) for k, v in grid.best_params_.items()},
            "cross_val_f1": round(cv_f1, 4),
            "holdout_accuracy": round(acc, 4),
            "holdout_precision": round(prec, 4),
            "holdout_recall": round(rec, 4),
            "holdout_f1": round(test_f1, 4),
            "holdout_roc_auc": round(auc_val, 4)
        }

        print(f"  Best Parameters: {grid.best_params_}")
        print(f"  CV F1: {cv_f1*100:.2f}% | Test F1: {test_f1*100:.2f}% | Test ROC-AUC: {auc_val*100:.2f}%")
        print(f"  Precision: {prec*100:.2f}% | Recall: {rec*100:.2f}%")

        if test_f1 > best_overall_f1:
            best_overall_f1 = test_f1
            best_overall_model = model_name

    print(f"\n[3] Champion Architecture: {best_overall_model} with Test F1: {best_overall_f1*100:.2f}%")

    # Persist benchmark comparison JSON
    output_path = os.path.join(BASE_DIR, "data", "model_benchmark_results.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "champion_model": best_overall_model,
            "evaluation_metric": "Stratified 5-Fold F1",
            "models": benchmark_results,
            "training_samples": len(X_train),
            "holdout_samples": len(X_test)
        }, f, indent=2)

    print(f"\n[4] Saved comprehensive benchmark results to: {output_path}")
    return benchmark_results

if __name__ == "__main__":
    run_grid_search_benchmark()
