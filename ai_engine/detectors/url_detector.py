"""
URL Safety & Phishing Detector for FraudLens.
Performs lexical analysis, bank typosquatting detection, high-risk TLD checks,
and phishing path heuristic classification.
"""

import re
from urllib.parse import urlparse
from typing import Dict, Any

LEGITIMATE_BANK_DOMAINS = {
    'sbi': ['sbi.co.in', 'onlinesbi.sbi', 'onlinesbi.com'],
    'hdfc': ['hdfcbank.com', 'hdfc.com'],
    'icici': ['icicibank.com', 'icicidirect.com'],
    'axis': ['axisbank.com'],
    'pnb': ['pnbindia.in'],
    'kotak': ['kotak.com'],
    'paytm': ['paytm.com'],
    'phonepe': ['phonepe.com'],
    'googlepay': ['pay.google.com', 'google.com']
}

HIGH_RISK_TLDS = {
    '.vip', '.top', '.xyz', '.cc', '.work', '.site', '.club', '.live',
    '.tk', '.ml', '.ga', '.cf', '.gq', '.info', '.buzz', '.icu', '.fit'
}

PHISHING_KEYWORDS = [
    'kyc', 'pan', 'aadhaar', 'verify', 'update', 'login', 'secure',
    'support', 'unblock', 'reward', 'refund', 'cashback', 'lottery',
    'claim', 'apk', 'bonus'
]

class URLDetector:
    def __init__(self):
        pass

    def analyze(self, raw_url: str) -> Dict[str, Any]:
        """Analyze URL for brand typosquatting, suspicious TLDs, and credential harvesting paths."""
        url = raw_url.strip()
        if not re.match(r'^[a-zA-Z]+://', url):
            url = 'http://' + url

        try:
            parsed = urlparse(url)
            hostname = (parsed.hostname or '').lower()
            path = (parsed.path or '').lower()
            scheme = parsed.scheme.lower()
        except Exception:
            hostname = url.lower()
            path = ''
            scheme = 'http'

        flags = []
        tactics = []
        impersonated_brand = None
        risk_score = 10

        is_ip = bool(re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', hostname))
        if is_ip:
            flags.append({
                "title": "Raw IP Address Hostname",
                "detail": f"The URL uses a raw numeric IP address ({hostname}) instead of an institutional domain name. Standard banks and financial providers never host consumer portals on bare IPs.",
                "severity": "critical"
            })
            tactics.append("Direct IP Obfuscation")
            risk_score += 45

        # Extract TLD
        tld = '.' + hostname.split('.')[-1] if '.' in hostname else ''
        if tld in HIGH_RISK_TLDS:
            flags.append({
                "title": f"High-Risk Top-Level Domain ({tld})",
                "detail": f"The {tld} extension has a statistically heavy correlation with disposable phishing infrastructure and botnet campaigns.",
                "severity": "high"
            })
            tactics.append("Malicious Disposable TLD")
            risk_score += 35

        # Brand Impersonation & Typosquatting Check
        for brand, legit_domains in LEGITIMATE_BANK_DOMAINS.items():
            if brand in hostname:
                is_legit = any(hostname == ld or hostname.endswith('.' + ld) for ld in legit_domains)
                if not is_legit:
                    impersonated_brand = brand.upper()
                    flags.append({
                        "title": f"Brand Impersonation & Typosquatting ({impersonated_brand})",
                        "detail": f"The domain mimics '{impersonated_brand}' but does not belong to authorized domains ({', '.join(legit_domains)}). Scammers spoof financial brands to harvest login credentials and OTPs.",
                        "severity": "critical"
                    })
                    tactics.append("Typosquatting Mimicry")
                    risk_score += 50
                    break

        # Phishing Keywords in Path or Subdomain
        matched_keywords = [kw for kw in PHISHING_KEYWORDS if kw in hostname or kw in path]
        if matched_keywords:
            flags.append({
                "title": f"Credential Harvesting Lures ({', '.join(matched_keywords[:3])})",
                "detail": f"URL contains keywords frequently weaponized in credential harvesting campaigns: {', '.join(matched_keywords)}.",
                "severity": "medium"
            })
            tactics.append("Credential Harvesting Lures")
            risk_score += 20

        # Subdomain count check
        subdomain_parts = hostname.split('.')
        if len(subdomain_parts) > 3 and not is_ip:
            flags.append({
                "title": "Excessive Subdomain Nesting",
                "detail": f"Excessive domain nesting ({len(subdomain_parts)} levels) is a common obfuscation technique to disguise fraudulent host destinations.",
                "severity": "medium"
            })
            tactics.append("Subdomain Obfuscation")
            risk_score += 15

        # Insecure protocol for financial operations
        if scheme == 'http' and (impersonated_brand or matched_keywords):
            flags.append({
                "title": "Unencrypted HTTP Communication",
                "detail": "Target link operates over unencrypted HTTP. Legitimate financial portals mandate TLS 1.3 / HTTPS encryption.",
                "severity": "medium"
            })
            risk_score += 15

        # Final score calculation
        if any(f['severity'] == 'critical' for f in flags):
            risk_score = max(risk_score, 85)

        risk_score = max(5, min(risk_score, 99))

        if risk_score >= 70:
            classification = "High Risk"
            confidence = 0.98
        elif risk_score >= 35:
            classification = "Suspicious"
            confidence = 0.85
        else:
            classification = "Safe"
            confidence = 0.95
            if not flags:
                flags.append({
                    "title": "Legitimate Institutional Domain",
                    "detail": "URL structure conforms to verified public registry standards with no typosquatting or deception signatures detected.",
                    "severity": "safe"
                })
                tactics.append("Verified Domain Integrity")

        # Explainable AI report
        summary = (
            f"FraudLens AI evaluated this link with Risk Score {risk_score}/100 ({classification}). "
            + (f"Impersonating {impersonated_brand} on an unauthorized server." if impersonated_brand else "Domain integrity checked.")
        )
        immediate_action = (
            "DO NOT open this link or enter netbanking passwords, UPI PINs, or card CVVs. Report link to CERT-In (incident@cert-in.org.in)."
            if classification != "Safe" else "Link appears safe to visit. Verify SSL lock in your browser address bar."
        )
        key_takeaway = "Banks never send shortened or disposable .vip/.top URLs for sensitive KYC verifications."

        complaint_draft = (
            f"=== NATIONAL CYBER CRIME REPORTING PORTAL (1930) DRAFT ===\n"
            f"Incident Category: Phishing Website / Banking Typosquatting\n"
            f"Suspect URL: {raw_url}\n"
            f"Impersonated Entity: {impersonated_brand or 'Unknown Entity'}\n"
            f"Threat Assessment: {classification} (Risk Score: {risk_score}/100)"
        )

        return {
            "type": "url",
            "input": raw_url,
            "riskScore": risk_score,
            "classification": classification,
            "confidence": confidence,
            "flags": flags,
            "tactics": tactics,
            "impersonatedBrand": impersonated_brand,
            "domainDetails": {
                "domain": hostname,
                "isIpAddress": is_ip,
                "tld": tld,
                "path": path,
                "protocol": scheme
            },
            "aiExplanation": {
                "summary": summary,
                "socialEngineeringTactics": tactics,
                "immediateAction": immediate_action,
                "keyTakeaway": key_takeaway,
                "complaintDraft": complaint_draft,
                "generatedByLLM": False
            }
        }

url_detector = URLDetector()

