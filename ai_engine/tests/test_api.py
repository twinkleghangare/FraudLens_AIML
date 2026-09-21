"""
Automated Test Suite for FraudLens Python AI/ML Engine & Threat Intelligence.
Verifies all FastAPI endpoints, ML inference, Risk Engine, XAI, URL/QR detection, and Threat Intelligence.
"""

from fastapi.testclient import TestClient
from ai_engine.app import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["model_loaded"] is True
    print("[PASS] Health Check Passed")

def test_message_scam():
    sample = {
        "text": "Dear consumer your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210."
    }
    res = client.post("/api/analyze/message", json=sample)
    assert res.status_code == 200
    data = res.json()
    assert data["classification"] in ["High Risk", "Suspicious"]
    assert data["riskScore"] >= 70
    assert len(data["flags"]) > 0
    assert "mlBreakdown" in data
    assert "aiExplanation" in data
    assert "complaintDraft" in data["aiExplanation"]
    print(f"[PASS] Scam Message Detection Passed: Risk Score = {data['riskScore']}, Classification = {data['classification']}")

def test_message_safe():
    sample = {
        "text": "Sent Rs 450.00 from HDFC Bank A/c XX4019 to Swiggy via UPI Ref No 429104928172. Available balance is Rs 24,190.00."
    }
    res = client.post("/api/analyze/message", json=sample)
    assert res.status_code == 200
    data = res.json()
    assert data["classification"] == "Safe"
    assert data["riskScore"] <= 25
    print(f"[PASS] Safe Transaction Detection Passed: Risk Score = {data['riskScore']}, Classification = {data['classification']}")

def test_url_phishing():
    sample = {"url": "http://sbi-pan-kyc-verify.vip"}
    res = client.post("/api/analyze/url", json=sample)
    assert res.status_code == 200
    data = res.json()
    assert data["classification"] == "High Risk"
    assert data["impersonatedBrand"] == "SBI"
    print(f"[PASS] Phishing URL Detection Passed: Risk Score = {data['riskScore']}, Brand = {data['impersonatedBrand']}")

def test_qr_reverse_debit():
    sample = {
        "qrContent": "upi://pay?pa=cashback-officer@okaxis&pn=RefundDesk&am=4999&cu=INR",
        "userContext": {"expectedAction": "receive"}
    }
    res = client.post("/api/analyze/qr", json=sample)
    assert res.status_code == 200
    data = res.json()
    assert data["classification"] == "High Risk"
    assert data["riskScore"] >= 85
    assert data["parsedData"]["isDebitIntent"] is True
    print(f"[PASS] Reverse-Debit QR Trap Passed: Risk Score = {data['riskScore']}")

def test_scam_news_and_ticker():
    res_news = client.get("/api/scam-news")
    assert res_news.status_code == 200
    data_news = res_news.json()
    assert data_news["status"] == "success"
    assert len(data_news["items"]) > 0

    res_ticker = client.get("/api/threat-ticker")
    assert res_ticker.status_code == 200
    data_ticker = res_ticker.json()
    assert data_ticker["status"] == "success"
    assert len(data_ticker["items"]) > 0
    first = data_ticker["items"][0]
    assert "type" in first and "title" in first and "detail" in first and "severity" in first
    print(f"[PASS] Threat Intelligence & Ticker Passed: {len(data_news['items'])} real articles loaded")

def test_stats_and_history():
    res = client.get("/api/stats")
    assert res.status_code == 200
    stats = res.json()
    assert "totalScanned" in stats
    assert "threatsBlocked" in stats
    print(f"[PASS] Stats Telemetry Passed: Total Scanned = {stats['totalScanned']}, Threats Blocked = {stats['threatsBlocked']}")

if __name__ == "__main__":
    print("Running FraudLens AI Engine API & ML Verification Tests...")
    test_health()
    test_message_scam()
    test_message_safe()
    test_url_phishing()
    test_qr_reverse_debit()
    test_scam_news_and_ticker()
    test_stats_and_history()
    print("\nALL 6 VERIFICATION SUITES PASSED PERFECTLY!")
