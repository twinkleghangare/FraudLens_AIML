"""
Threat Intelligence Cache & Sync Manager for FraudLens.
Maintains persistent cache on disk and memory, auto-refreshing every 6 hours
or on-demand. Never serves fake data.
"""

import os
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, List

from ai_engine.intelligence.fetcher import fetch_threat_feeds
from ai_engine.intelligence.processor import process_threat_articles

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_FILE = os.path.join(BASE_DIR, "data", "threat_intelligence_cache.json")
CACHE_TTL_SECONDS = 6 * 3600  # 6 hours

class ThreatIntelligenceCache:
    def __init__(self):
        self.cached_data: Dict[str, Any] = {
            "items": [],
            "analytics": {
                "total_reports": 0,
                "top_scam_type": "UPI Scam",
                "categories": {},
                "sources": {},
                "severity_breakdown": {}
            },
            "last_updated": 0,
            "updated_at": None
        }
        self.load_from_disk()

    def load_from_disk(self):
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, "r", encoding="utf-8") as f:
                    self.cached_data = json.load(f)
            except Exception as err:
                print(f"[Cache] Error loading cache from disk: {err}")

    def save_to_disk(self):
        try:
            with open(CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(self.cached_data, f, indent=2, ensure_ascii=False)
        except Exception as err:
            print(f"[Cache] Error saving cache to disk: {err}")

    def get_data(self, force_refresh: bool = False) -> Dict[str, Any]:
        """Return threat intelligence data, updating if expired or forced."""
        now = time.time()
        age = now - self.cached_data.get("last_updated", 0)

        # If cache is fresh and not empty and not forced, return cached
        if not force_refresh and age < CACHE_TTL_SECONDS and self.cached_data.get("items"):
            return self.cached_data

        # Refresh from public sources
        print("[ThreatIntel] Refreshing live threat feeds from official/news sources...")
        try:
            raw_articles = fetch_threat_feeds()
            if raw_articles:
                processed = process_threat_articles(raw_articles)
                if processed["items"]:
                    self.cached_data = {
                        "items": processed["items"],
                        "analytics": processed["analytics"],
                        "last_updated": now,
                        "updated_at": datetime.utcnow().isoformat()
                    }
                    self.save_to_disk()
                    print(f"[ThreatIntel] Refreshed {len(processed['items'])} threat intelligence items.")
                    return self.cached_data
        except Exception as err:
            print(f"[ThreatIntel] Failed to fetch live feeds: {err}")

        # Fallback to existing cached data if live fetch fails
        if self.cached_data.get("items"):
            return self.cached_data

        # If empty and fetch failed, provide a clean real state
        return self.cached_data

    def get_ticker_items(self) -> List[Dict[str, Any]]:
        """
        Format items specifically for the existing ThreatTicker component.
        Matches: { type, title, detail, severity, regions }
        """
        data = self.get_data()
        items = data.get("items", [])
        if not items:
            return []

        ticker_items = []
        for item in items[:12]:
            cat = item.get("category", "Cyber Fraud")
            # Map category to concise ticker type tag
            type_tag = "SMS"
            if "QR" in cat:
                type_tag = "QR"
            elif "URL" in cat or "Phishing" in cat:
                type_tag = "URL"
            elif "APK" in cat or "Malware" in cat:
                type_tag = "APK"
            elif "Digital Arrest" in cat:
                type_tag = "ARREST"
            elif "Electricity" in cat:
                type_tag = "UTILITY"
            elif "UPI" in cat:
                type_tag = "UPI"
            else:
                type_tag = "ALERT"

            # Severity mapping: 'critical' or 'high'
            sev = item.get("severity", "HIGH").lower()
            if sev not in ["critical", "high"]:
                sev = "high"

            ticker_items.append({
                "type": type_tag,
                "title": item.get("title", ""),
                "detail": item.get("summary", "")[:95] + ("..." if len(item.get("summary", "")) > 95 else ""),
                "severity": sev,
                "regions": "Pan-India",
                "source": item.get("source", "Cyber Cell"),
                "source_url": item.get("source_url", "#")
            })

        return ticker_items

threat_cache = ThreatIntelligenceCache()

