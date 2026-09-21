"""
Runner script for FraudLens Python FastAPI Backend.
Listens on http://localhost:5005
"""

import uvicorn
import os
import sys

# Ensure root path is accessible
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5005))
    print(f"==================================================")
    print(f" Starting FraudLens Python AI/ML & Threat Intel Backend")
    print(f" URL: http://localhost:{port}")
    print(f" Endpoints: /api/health, /api/analyze/message, /api/analyze/url,")
    print(f"            /api/analyze/qr, /api/scam-news, /api/threat-ticker")
    print(f"==================================================")
    uvicorn.run("ai_engine.app:app", host="0.0.0.0", port=port, reload=False)

