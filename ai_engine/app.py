"""
FraudLens FastAPI Backend Application.
AI-Powered UPI Scam Detection, Risk Analysis & Real-World Threat Intelligence.
"""

import os
import sys
import re
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ai_engine.ml.classifier import ml_classifier
from ai_engine.risk.engine import risk_engine
from ai_engine.explainability.xai import xai_engine
from ai_engine.detectors.url_detector import url_detector
from ai_engine.detectors.qr_detector import qr_detector
from ai_engine.intelligence.cache import threat_cache
from ai_engine.storage.history import history_storage

app = FastAPI(
    title="FraudLens API",
    description="AI-Powered UPI Scam Detection & Real-World Threat Intelligence System",
    version="2.1.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class MessageRequest(BaseModel):
    text: str = Field(..., max_length=5000, description="SMS, WhatsApp, or UPI message text")

class UrlRequest(BaseModel):
    url: str = Field(..., max_length=2048, description="URL or link to evaluate")

class QrRequest(BaseModel):
    qrContent: str = Field(..., max_length=2048, description="UPI intent or QR code text")
    userContext: Optional[Dict[str, Any]] = Field(default_factory=dict, description="User expected context")

class PatternRequest(BaseModel):
    title: str = Field(..., description="Reported scam headline")
    summary: Optional[str] = Field(default="", description="Incident summary")
    category: Optional[str] = Field(default="UPI Scam", description="Scam category")

# 1. Health Check
@app.get("/api/health")
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "system": "FraudLens UPI Scam Detection & Risk Analysis System",
        "engine": "Python Scikit-Learn (TF-IDF + Naive Bayes/LinearSVC) + Explainable AI + Threat Intelligence",
        "version": "2.1.0",
        "model_loaded": ml_classifier.pipeline is not None,
        "dataset_size": ml_classifier.metrics.get("dataset_size", 5228),
        "holdout_accuracy": ml_classifier.metrics.get("holdout_accuracy", 0.9857),
        "f1_score": ml_classifier.metrics.get("f1_score", 0.9442)
    }

# 2. Message Analysis (Primary AI/ML Pipeline)
@app.post("/api/analyze/message")
@app.post("/predict")
@app.post("/api/analyze")
@app.post("/api/predict")
def analyze_message(payload: MessageRequest):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Step A: ML Classifier Prediction
    ml_result = ml_classifier.predict(text)

    # Step B: Rule-based Heuristic NLP
    heuristics = risk_engine.evaluate_heuristics(text)

    # Step C: Weighted Fusion of ML + Heuristics
    final_score, classification, level = risk_engine.compute_risk(
        ml_score=ml_result["score"],
        ml_confidence=ml_result["confidence"],
        heuristics=heuristics
    )

    # Step D: Explainable AI
    primary_category = heuristics.get("category", "SMS / Chat")
    ai_explanation = xai_engine.explain(
        text=text,
        risk_score=final_score,
        classification=classification,
        flags=heuristics["flags"],
        tactics=heuristics["tactics"],
        category=primary_category
    )

    # Step E: Save to History
    history_entry = history_storage.add_record({
        "type": "message",
        "title": heuristics["flags"][0]["title"] if heuristics["flags"] else ("Legitimate Message" if classification == "Safe" else "Suspicious Message"),
        "preview": text[:80] + ("..." if len(text) > 80 else ""),
        "riskScore": final_score,
        "classification": classification,
        "category": primary_category
    })

    # High-level Signals and Explanations
    signals = [f"{f['title']}: {f['detail']}" for f in heuristics["flags"]]
    explanation_points = [
        ai_explanation["summary"],
        f"Psychological Deception Vectors: {', '.join(ai_explanation['socialEngineeringTactics'])}",
        f"Key Rule: {ai_explanation['keyTakeaway']}"
    ]

    prediction_label = "SCAM" if final_score >= 50 else ("SUSPICIOUS" if final_score >= 26 else "GENUINE")

    return {
        # Standardized AIML/DS Fields (Requested by Specification)
        "prediction": prediction_label,
        "confidence": ml_result["confidence"],
        "risk_score": final_score,
        "risk_level": level,
        "category": primary_category,
        "signals": signals,
        "explanation": explanation_points,
        "recommended_action": ai_explanation["immediateAction"],

        # Backwards-Compatible Fields for Existing React UI
        "type": "message",
        "input": text,
        "riskScore": final_score,
        "classification": classification,
        "threatLevel": level,
        "flags": heuristics["flags"],
        "tactics": heuristics["tactics"],
        "mlBreakdown": {
            "probabilities": ml_result["probabilities"],
            "contributingTokens": ml_result["contributingTokens"],
            "metrics": ml_result["metrics"]
        },
        "aiExplanation": ai_explanation,
        "recordId": history_entry["id"]
    }

# 3. Analyze URL
@app.post("/api/analyze/url")
@app.post("/analyze-url")
@app.post("/api/analyze-url")
def analyze_url(payload: UrlRequest):
    url = payload.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL cannot be empty")

    result = url_detector.analyze(url)

    history_entry = history_storage.add_record({
        "type": "url",
        "title": result["flags"][0]["title"] if result["flags"] else "Verified URL",
        "preview": url,
        "riskScore": result["riskScore"],
        "classification": result["classification"],
        "category": "Phishing / Link"
    })

    result["recordId"] = history_entry["id"]
    # Add standardized fields
    result["prediction"] = "SCAM" if result["riskScore"] >= 50 else ("SUSPICIOUS" if result["riskScore"] >= 26 else "GENUINE")
    result["risk_score"] = result["riskScore"]
    result["risk_level"] = "CRITICAL" if result["riskScore"] >= 76 else ("HIGH" if result["riskScore"] >= 51 else ("MEDIUM" if result["riskScore"] >= 26 else "LOW"))
    result["signals"] = [f"{f['title']}: {f['detail']}" for f in result["flags"]]
    result["explanation"] = [result["aiExplanation"]["summary"]]
    result["recommended_action"] = result["aiExplanation"]["immediateAction"]

    return result

# 4. Analyze QR
@app.post("/api/analyze/qr")
@app.post("/analyze-qr")
@app.post("/api/analyze-qr")
def analyze_qr(payload: QrRequest):
    qr_content = payload.qrContent.strip()
    if not qr_content:
        raise HTTPException(status_code=400, detail="QR content cannot be empty")

    result = qr_detector.analyze(qr_content, payload.userContext)

    history_entry = history_storage.add_record({
        "type": "qr",
        "title": result["flags"][0]["title"] if result["flags"] else "Verified UPI QR",
        "preview": qr_content[:80] + ("..." if len(qr_content) > 80 else ""),
        "riskScore": result["riskScore"],
        "classification": result["classification"],
        "category": "UPI Payment" if result["parsedData"].get("isDebitIntent") else "QR Code"
    })

    result["recordId"] = history_entry["id"]
    result["prediction"] = "SCAM" if result["riskScore"] >= 50 else ("SUSPICIOUS" if result["riskScore"] >= 26 else "GENUINE")
    result["risk_score"] = result["riskScore"]
    result["risk_level"] = "CRITICAL" if result["riskScore"] >= 76 else ("HIGH" if result["riskScore"] >= 51 else ("MEDIUM" if result["riskScore"] >= 26 else "LOW"))
    result["signals"] = [f"{f['title']}: {f['detail']}" for f in result["flags"]]
    result["explanation"] = [result["aiExplanation"]["summary"]]
    result["recommended_action"] = result["aiExplanation"]["immediateAction"]

    return result

# 5. Extract Structured Scam Pattern from Real Incident
@app.post("/api/scam-pattern")
def extract_scam_pattern(payload: PatternRequest):
    title = payload.title
    summary = payload.summary or ""
    cat = payload.category
    combined = f"{title} {summary}".lower()

    # Rule-based pattern resolution from news incident text
    impersonation = "Unknown Attacker"
    if any(k in combined for k in ["police", "cbi", "customs", "trai", "arrest"]):
        impersonation = "Law Enforcement / Police / CBI Officer"
    elif any(k in combined for k in ["sbi", "hdfc", "icici", "bank", "manager"]):
        impersonation = "Bank Customer Care Representative"
    elif any(k in combined for k in ["bescom", "msedcl", "electricity", "power"]):
        impersonation = "Electricity Board Sub-Division Officer"
    elif any(k in combined for k in ["amazon", "flipkart", "youtube", "task", "hr"]):
        impersonation = "HR Recruiter / E-Commerce Merchant"
    elif any(k in combined for k in ["fedex", "dhl", "india post", "courier"]):
        impersonation = "Postal / Courier Delivery Agent"

    social_engineering = "Financial Coercion"
    if "kyc" in combined:
        social_engineering = "Urgent KYC Deactivation Threat"
    elif "arrest" in combined or "video call" in combined:
        social_engineering = "Digital Arrest & Skype Interrogation Threat"
    elif "electricity" in combined or "cut" in combined:
        social_engineering = "Imminent Essential Utility Disconnection Panic"
    elif "job" in combined or "task" in combined or "daily" in combined:
        social_engineering = "Prepaid Video Liking Task / High Return Bait"
    elif "qr" in combined or "refund" in combined or "cashback" in combined:
        social_engineering = "Scan QR to Receive Cashback Social Trap"

    credential_risk = "High" if any(k in combined for k in ["otp", "pin", "password", "pan", "aadhaar"]) else "Moderate"
    payment_risk = "Critical" if any(k in combined for k in ["lakh", "crore", "upi", "transfer", "bail", "deposit"]) else "High"

    # Generate realistic representative test message that can be verified in Message Analyzer
    if "kyc" in combined:
        test_msg = "Dear customer your bank account will be suspended today. Complete KYC immediately at http://verify-pan-update.vip to avoid blocking."
    elif "electricity" in combined:
        test_msg = "Dear consumer your electricity power will be disconnected tonight at 9:30 PM from electricity office. Immediately call officer 9876543210."
    elif "arrest" in combined:
        test_msg = "CBI New Delhi: Arrest warrant issued against your Aadhaar for illegal narcotics parcel. Join Skype video interrogation immediately or police will raid."
    elif "job" in combined:
        test_msg = "Earn Rs 3,000 to 5,000 daily from home by liking YouTube videos and rating hotels. Contact HR on WhatsApp wa.me/919988776655."
    elif "qr" in combined or "refund" in combined:
        test_msg = "Congratulations! You won Rs 4,999 cashback voucher from PhonePe. Scan QR code and enter UPI PIN to receive money instantly."
    else:
        test_msg = f"Alert: Urgent action required regarding your {cat}. Contact helpline 9876543210 immediately to resolve status."

    return {
        "status": "success",
        "pattern": {
            "title": title,
            "category": cat,
            "impersonation": impersonation,
            "socialEngineering": social_engineering,
            "credentialRisk": credential_risk,
            "paymentRisk": payment_risk,
            "representativeMessage": test_msg
        }
    }

# 6. History & Stats
@app.get("/api/history")
def get_history(limit: int = Query(20, ge=1, le=100)):
    return history_storage.get_all(limit=limit)

@app.get("/api/stats")
@app.get("/api/analytics")
def get_stats():
    return history_storage.get_stats()

# 7. Real-World Scam Threat Intelligence
@app.get("/api/scam-news")
def get_scam_news(refresh: bool = False):
    data = threat_cache.get_data(force_refresh=refresh)
    return {
        "status": "success",
        "count": len(data.get("items", [])),
        "updated_at": data.get("updated_at"),
        "items": data.get("items", [])
    }

@app.get("/api/scam-news/latest")
def get_scam_news_latest():
    data = threat_cache.get_data()
    items = data.get("items", [])[:12]
    return {
        "status": "success",
        "count": len(items),
        "items": items
    }

@app.get("/api/scam-news/trending")
def get_scam_news_trending():
    data = threat_cache.get_data()
    items = [it for it in data.get("items", []) if it.get("severity") in ["CRITICAL", "HIGH"]][:10]
    return {
        "status": "success",
        "count": len(items),
        "items": items
    }

@app.get("/api/scam-news/category/{category}")
def get_scam_news_by_category(category: str):
    data = threat_cache.get_data()
    cat_lower = category.lower()
    filtered = [it for it in data.get("items", []) if cat_lower in it.get("category", "").lower()]
    return {
        "status": "success",
        "category": category,
        "count": len(filtered),
        "items": filtered
    }

@app.get("/api/threat-intelligence/analytics")
def get_threat_intelligence_analytics():
    data = threat_cache.get_data()
    return {
        "status": "success",
        "analytics": data.get("analytics", {})
    }

# 8. Threat Ticker Dedicated Feed
@app.get("/api/threat-ticker")
def get_threat_ticker():
    items = threat_cache.get_ticker_items()
    return {
        "status": "success",
        "count": len(items),
        "items": items
    }

# 9. Data Science & ML Engineering Artifacts Endpoints
@app.get("/api/ml/benchmark")
def get_ml_benchmark():
    path = os.path.join(BASE_DIR, "data", "model_benchmark_results.json")
    if os.path.exists(path):
        import json
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"status": "pending", "message": "Run grid_search_tune.py to generate empirical benchmark."}

@app.get("/api/ml/error-analysis")
def get_error_analysis():
    path = os.path.join(BASE_DIR, "data", "error_analysis_report.json")
    if os.path.exists(path):
        import json
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"status": "pending", "message": "Run error_analysis.py to generate failure taxonomy."}

@app.get("/api/ml/eda-summary")
def get_eda_summary():
    path = os.path.join(BASE_DIR, "data", "eda_summary.json")
    if os.path.exists(path):
        import json
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"status": "pending", "message": "Run eda_report.py to generate EDA summary."}

# Mount static plots directory for ML diagnostics
plots_dir = os.path.join(BASE_DIR, "data", "ds_eval_plots")
if os.path.exists(plots_dir):
    from fastapi.staticfiles import StaticFiles
    app.mount("/api/plots", StaticFiles(directory=plots_dir), name="plots")

