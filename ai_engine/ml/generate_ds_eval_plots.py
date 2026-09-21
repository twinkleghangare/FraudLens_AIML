"""
FraudLens Data Science Visualization & Evaluation Suite.
Generates publication-quality diagnostic charts:
1. Confusion Matrix Heatmap (Raw counts + Normalized %)
2. Receiver Operating Characteristic (ROC) Curve with AUC
3. Precision-Recall Curve with Average Precision (AP)
4. Decision Threshold Optimization Plot (F1 vs Precision vs Recall across tau in [0.05, 0.95])
5. Top 25 Discriminative Feature Importance Log-Odds Plot
Saves all figures into ai_engine/data/ds_eval_plots/
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    confusion_matrix, roc_curve, auc, precision_recall_curve,
    average_precision_score, f1_score, precision_score, recall_score
)
from sklearn.model_selection import train_test_split
import joblib

import sys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, os.path.dirname(BASE_DIR))

from ai_engine.preprocessing.text_cleaner import clean_text

OUTPUT_DIR = os.path.join(BASE_DIR, "data", "ds_eval_plots")

def generate_evaluation_artifacts():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("=" * 65)
    print("   GENERATING DATA SCIENCE EVALUATION PLOTS & METRICS")
    print("=" * 65)

    # 1. Load Data & Trained Model
    data_path = os.path.join(BASE_DIR, "data", "processed", "combined_fraud_dataset.csv")
    model_path = os.path.join(BASE_DIR, "models", "upi_scam_model.joblib")

    df = pd.read_csv(data_path)
    model = joblib.load(model_path)

    raw_texts = df['text'].astype(str).values
    y = df['target'].values
    cleaned_texts = np.array([clean_text(t) for t in raw_texts])

    X_train, X_test, y_train, y_test = train_test_split(
        cleaned_texts, y, test_size=0.20, random_state=42, stratify=y
    )

    # Predictions and Calibrated Probabilities
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else y_pred

    # -------------------------------------------------------------
    # Plot 1: Confusion Matrix Heatmap
    # -------------------------------------------------------------
    cm = confusion_matrix(y_test, y_pred)
    cm_norm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    labels = np.array([
        [f"{cm[0,0]}\n({cm_norm[0,0]:.1%})", f"{cm[0,1]}\n({cm_norm[0,1]:.1%})"],
        [f"{cm[1,0]}\n({cm_norm[1,0]:.1%})", f"{cm[1,1]}\n({cm_norm[1,1]:.1%})"]
    ])

    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=labels, fmt="", cmap="Blues", cbar=False,
                xticklabels=['Genuine (0)', 'Scam (1)'],
                yticklabels=['Genuine (0)', 'Scam (1)'])
    plt.title('FraudLens Confusion Matrix (Holdout n=1,046)', fontsize=12, fontweight='bold', pad=12)
    plt.xlabel('Predicted Class', fontweight='semibold')
    plt.ylabel('Ground Truth Class', fontweight='semibold')
    plt.tight_layout()
    p1 = os.path.join(OUTPUT_DIR, "confusion_matrix_heatmap.png")
    plt.savefig(p1, dpi=200)
    plt.close()
    print(f"[1] Saved Confusion Matrix Heatmap -> {p1}")

    # -------------------------------------------------------------
    # Plot 2: ROC Curve
    # -------------------------------------------------------------
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    roc_auc = auc(fpr, tpr)

    plt.figure(figsize=(6.5, 5))
    plt.plot(fpr, tpr, color='#0ea5e9', lw=2.5, label=f'ROC Curve (AUC = {roc_auc:.4f})')
    plt.plot([0, 1], [0, 1], color='#64748b', lw=1.5, linestyle='--', label='Random Baseline (AUC = 0.50)')
    plt.xlim([-0.02, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate (1 - Specificity)', fontweight='semibold')
    plt.ylabel('True Positive Rate (Sensitivity / Recall)', fontweight='semibold')
    plt.title('Receiver Operating Characteristic (ROC)', fontsize=12, fontweight='bold')
    plt.legend(loc="lower right", frameon=True)
    plt.grid(alpha=0.3)
    plt.tight_layout()
    p2 = os.path.join(OUTPUT_DIR, "roc_curve.png")
    plt.savefig(p2, dpi=200)
    plt.close()
    print(f"[2] Saved ROC Curve (AUC={roc_auc:.4f}) -> {p2}")

    # -------------------------------------------------------------
    # Plot 3: Precision-Recall Curve
    # -------------------------------------------------------------
    precision_vals, recall_vals, _ = precision_recall_curve(y_test, y_proba)
    ap_score = average_precision_score(y_test, y_proba)

    plt.figure(figsize=(6.5, 5))
    plt.plot(recall_vals, precision_vals, color='#8b5cf6', lw=2.5, label=f'PR Curve (AP = {ap_score:.4f})')
    plt.xlabel('Recall (Detection Rate)', fontweight='semibold')
    plt.ylabel('Precision (Positive Predictive Value)', fontweight='semibold')
    plt.title('Precision-Recall Curve (Imbalanced Text Fraud)', fontsize=12, fontweight='bold')
    plt.legend(loc="lower left", frameon=True)
    plt.grid(alpha=0.3)
    plt.tight_layout()
    p3 = os.path.join(OUTPUT_DIR, "precision_recall_curve.png")
    plt.savefig(p3, dpi=200)
    plt.close()
    print(f"[3] Saved Precision-Recall Curve (AP={ap_score:.4f}) -> {p3}")

    # -------------------------------------------------------------
    # Plot 4: Decision Threshold Optimization
    # -------------------------------------------------------------
    thresholds = np.linspace(0.05, 0.95, 30)
    f1_scores, precisions, recalls = [], [], []

    for t in thresholds:
        preds_t = (y_proba >= t).astype(int)
        f1_scores.append(f1_score(y_test, preds_t, zero_division=0))
        precisions.append(precision_score(y_test, preds_t, zero_division=0))
        recalls.append(recall_score(y_test, preds_t, zero_division=0))

    optimal_idx = np.argmax(f1_scores)
    optimal_tau = thresholds[optimal_idx]

    plt.figure(figsize=(7, 4.5))
    plt.plot(thresholds, f1_scores, label='F1-Score', color='#f43f5e', lw=2)
    plt.plot(thresholds, precisions, label='Precision', color='#0ea5e9', lw=1.8, linestyle='--')
    plt.plot(thresholds, recalls, label='Recall', color='#10b981', lw=1.8, linestyle=':')
    plt.axvline(optimal_tau, color='#f59e0b', linestyle='-.', label=f'Optimal Threshold tau={optimal_tau:.2f}')
    plt.xlabel('Decision Threshold (tau)', fontweight='semibold')
    plt.ylabel('Score Metric', fontweight='semibold')
    plt.title('Threshold Optimization for Cybercrime Detection', fontsize=12, fontweight='bold')
    plt.legend(loc="lower center", frameon=True)
    plt.grid(alpha=0.3)
    plt.tight_layout()
    p4 = os.path.join(OUTPUT_DIR, "threshold_optimization_curve.png")
    plt.savefig(p4, dpi=200)
    plt.close()
    print(f"[4] Saved Threshold Optimization Curve -> {p4}")

    # -------------------------------------------------------------
    # Plot 5: Top 25 Discriminative Feature Weights
    # -------------------------------------------------------------
    tfidf = model.named_steps['tfidf']
    feature_names = np.array(tfidf.get_feature_names_out())
    clf = model.named_steps['clf']

    if hasattr(clf, 'feature_log_prob_'):
        log_odds = clf.feature_log_prob_[1] - clf.feature_log_prob_[0]
    elif hasattr(clf, 'coef_'):
        log_odds = clf.coef_[0]
    else:
        log_odds = np.zeros(len(feature_names))

    top_idx = np.argsort(log_odds)[-20:]
    top_features = feature_names[top_idx]
    top_weights = log_odds[top_idx]

    plt.figure(figsize=(8, 6))
    colors = plt.cm.viridis(np.linspace(0.3, 0.9, len(top_features)))
    plt.barh(range(len(top_features)), top_weights, color=colors)
    plt.yticks(range(len(top_features)), top_features, fontsize=9, fontfamily='monospace')
    plt.xlabel('Log-Odds Ratio log(P(w|Threat)/P(w|Safe))', fontweight='semibold')
    plt.title('Top 20 Indicative NLP Features for Scam Classification', fontsize=12, fontweight='bold')
    plt.grid(axis='x', alpha=0.3)
    plt.tight_layout()
    p5 = os.path.join(OUTPUT_DIR, "feature_importance_top25.png")
    plt.savefig(p5, dpi=200)
    plt.close()
    print(f"[5] Saved Feature Importance Plot -> {p5}")

    print("\nAll 5 Data Science Evaluation Plots Generated Successfully!")

if __name__ == "__main__":
    generate_evaluation_artifacts()

