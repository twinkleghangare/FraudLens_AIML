"""
Threat Intelligence News & Advisory Fetcher for FraudLens.
Pulls real-world reported cyber fraud incidents, CERT-In advisories,
and official Indian cyber cell alerts using public RSS feeds.
"""

import feedparser
import re
import hashlib
from datetime import datetime
from typing import List, Dict, Any

FEEDS = [
    {
        "source": "Google News (India Cyber Crime & UPI Scams)",
        "url": "https://news.google.com/rss/search?q=cyber+crime+india+OR+upi+scam+OR+banking+fraud&hl=en-IN&gl=IN&ceid=IN:en",
        "verified": True
    },
    {
        "source": "Google News (Digital Arrest & Police Extortion)",
        "url": "https://news.google.com/rss/search?q=digital+arrest+scam+india+OR+fake+police+cbi&hl=en-IN&gl=IN&ceid=IN:en",
        "verified": True
    },
    {
        "source": "Google News (CERT-In Advisories & Malware)",
        "url": "https://news.google.com/rss/search?q=cert-in+advisory+OR+malware+alert+india&hl=en-IN&gl=IN&ceid=IN:en",
        "verified": True
    }
]

def clean_html(raw_html: str) -> str:
    """Strip HTML tags from summary text."""
    clean = re.sub(r'<.*?>', '', raw_html)
    clean = re.sub(r'&[a-zA-Z0-9#]+;', ' ', clean)
    return " ".join(clean.split())

def fetch_threat_feeds() -> List[Dict[str, Any]]:
    """Fetch real articles from configured RSS feeds without inventing any facts."""
    articles = []
    
    for feed_info in FEEDS:
        try:
            parsed = feedparser.parse(feed_info["url"])
            for entry in parsed.entries[:15]:
                title = entry.get("title", "").strip()
                link = entry.get("link", "").strip()
                summary_raw = entry.get("summary", "") or entry.get("description", "")
                summary = clean_html(summary_raw)
                published = entry.get("published", "") or entry.get("updated", "")
                
                # Source extraction
                source_title = feed_info["source"]
                if " - " in title:
                    parts = title.rsplit(" - ", 1)
                    title = parts[0].strip()
                    source_title = parts[1].strip()

                if not title or not link:
                    continue

                # Compute content hash for deduplication
                content_hash = hashlib.sha256(f"{title}|{link}".encode('utf-8')).hexdigest()

                articles.append({
                    "title": title,
                    "summary": summary[:250] if summary else f"Reported incident: {title}",
                    "source": source_title,
                    "source_url": link,
                    "published_at": published,
                    "verified_source": feed_info["verified"],
                    "content_hash": content_hash,
                    "fetched_at": datetime.utcnow().isoformat()
                })
        except Exception as err:
            print(f"[Fetcher] Error fetching feed {feed_info['source']}: {err}")

    return articles

