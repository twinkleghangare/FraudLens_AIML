"""
FraudLens Transparent Risk Engine.
Methodology:
Weighted Hybrid Fusion combining Machine Learning Confidence with Rule-Based Heuristic Telemetry:
- Baseline Risk derived from TF-IDF + Multinomial Naive Bayes Probability (45% weight)
- Domain Heuristic Threat Stack (55% weight)
- Critical Override Trigger:
  Direct Pin Solicitation, Digital Arrest Threat, or Trojan APK delivery immediately elevates
  severity to CRITICAL (Risk >= 85) to prevent catastrophic financial loss.
- Category Resolution maps to standard National Cyber Crime reporting categories.
"""

import re
from typing import Dict, Any, List, Tuple
from ai_engine.preprocessing.text_cleaner import extract_patterns

class RiskEngine:
    def __init__(self):
        pass

    def evaluate_heuristics(self, text: str) -> Dict[str, Any]:
        """Examine text for heuristic red flags, tactics, and scam categories."""
        lower = text.lower()
        patterns = extract_patterns(text)
        flags = []
        tactics = []
        category = "SMS / Chat"

        # 1. PIN / Reverse Debit Trap
        if patterns['has_pin_mention']:
            flags.append({
                "type": "UPI_PIN_HARVESTING",
                "severity": "critical",
                "title": "UPI PIN Solicitation / Reverse-Debit Trap",
                "detail": "Message demands entering UPI PIN or MPIN to 'receive' money or claim rewards. UPI PIN is NEVER required to receive money."
            })
            tactics.append("Reverse-Debit Social Engineering")
            category = "QR Scam" if "qr" in lower else "UPI Scam"

        # 2. Electricity / Utility Threat
        if re.search(r'\b(?:electricity|bijli|bescom|msedcl|tneb|uppcl|power\s*supply|light\s*bill)\b', lower) and \
           re.search(r'\b(?:disconnected|disconnect|cut|9:30|tonight|line\s*cut)\b', lower):
            flags.append({
                "type": "ELECTRICITY_DISCONNECTION_SCAM",
                "severity": "critical",
                "title": "Power Disconnection Scare",
                "detail": "Utility threat imposing imminent power-cut deadlines. Electricity boards never issue personal WhatsApp/SMS threatening immediate power cuts."
            })
            tactics.append("Fear of Essential Service Loss")
            tactics.append("Psychological Panic Induction")
            category = "Electricity Scam"

        # 3. Digital Arrest & Law Enforcement Impersonation
        if re.search(r'\b(?:digital\s*arrest|cbi|trai|police|narcotics|customs|illegal\s*parcel|money\s*laundering|arrest\s*warrant|skype)\b', lower):
            flags.append({
                "type": "DIGITAL_ARREST_EXTORTION",
                "severity": "critical",
                "title": "Digital Arrest & Police Extortion Vector",
                "detail": "Scammers impersonate CBI, TRAI, or Police claiming parcel interception or illegal activity. Law enforcement never arrests or interrogates via video calls or demands money."
            })
            tactics.append("Law Enforcement Impersonation")
            tactics.append("Coercive Legal Threat")
            category = "Digital Arrest"

        # 4. Malicious APK / Remote Screen Share
        if patterns['has_apk'] or re.search(r'\b(?:anydesk|teamviewer|quicksupport|rustdesk)\b', lower):
            flags.append({
                "type": "MALICIOUS_APP_PAYLOAD",
                "severity": "critical",
                "title": "Trojan APK / Remote Access Software Delivery",
                "detail": "Requests installation of unauthorized .apk files or remote-control tools (AnyDesk, QuickSupport) that allow attackers to view OTPs and take over devices."
            })
            tactics.append("Device Takeover")
            tactics.append("OTP Interception")
            category = "APK Malware"

        # 5. Fake KYC & Bank Suspension
        if patterns['has_kyc_mention'] and re.search(r'\b(?:block|suspend|deactivat|unblock|link\s*pan|aadhaar)\b', lower):
            flags.append({
                "type": "BANK_SUSPENSION_KYC_BAIT",
                "severity": "high",
                "title": "Account Suspension / KYC Coercion",
                "detail": "Urgent notification threatening account suspension or card blocking unless PAN/Aadhaar is verified immediately via external link."
            })
            tactics.append("Bank Brand Impersonation")
            tactics.append("Urgent KYC Coercion")
            category = "KYC Scam"

        # 6. Part-time Job & Task Scam
        if re.search(r'\b(?:part\s*time|work\s*from\s*home|like\s*youtube|rating\s*hotels|earn\s*rs\s*\d+|daily\s*income|prepaid\s*task)\b', lower):
            flags.append({
                "type": "PART_TIME_JOB_FRAUD",
                "severity": "high",
                "title": "Prepaid Task & Part-Time Job Lure",
                "detail": "High payout promises for rating videos/hotels designed to trap victims in Telegram/WhatsApp prepaid investment deposit cycles."
            })
            tactics.append("Financial Greed Exploitation")
            tactics.append("Prepaid Task Funnel")
            category = "Job Scam"

        # 7. Lottery, Cashback & Refund Baits
        if re.search(r'\b(?:lottery|kbc|cashback|cash\s*prize|won\s*rs|lucky\s*draw|reward|claim\s*money|refund)\b', lower) and not re.search(r'\b(?:debited|credited|swiggy|zomato|refund\s*received)\b', lower):
            flags.append({
                "type": "LOTTERY_CASHBACK_LURE",
                "severity": "high",
                "title": "Unsolicited Prize / Cashback Bait",
                "detail": "Phony cashback or lottery claim requiring user to interact or scan codes. Genuine cashback is credited directly without approvals."
            })
            tactics.append("Unearned Reward Bait")
            if category == "SMS / Chat":
                category = "Fake Refund" if "refund" in lower else "UPI Scam"

        # 8. Unofficial Phishing URL
        if patterns['has_url']:
            for url in patterns['urls']:
                if re.search(r'\.(?:vip|top|xyz|cc|work|site|club|live|tk|ml|info)\b', url, re.I):
                    flags.append({
                        "type": "SUSPICIOUS_TLD_PHISHING",
                        "severity": "high",
                        "title": "High-Risk Disposable Phishing Domain",
                        "detail": f"Domain contains high-risk extension ({url}) frequently registered for disposable credential-harvesting campaigns."
                    })
                    tactics.append("Domain Typosquatting")

        # 9. Personal Mobile Helpline Spoof
        if patterns['has_phone'] and any(kw in lower for kw in ['call', 'contact', 'officer', 'helpline']):
            flags.append({
                "type": "PERSONAL_MOBILE_SPOOF",
                "severity": "medium",
                "title": "Personal Mobile Routed as Official Helpline",
                "detail": "Message prompts victim to contact a standard 10-digit mobile number instead of an official 1800 toll-free verified institutional helpline."
            })
            tactics.append("Spoofed Direct Contact")

        # 10. Artificial Urgency
        if patterns['has_urgency']:
            flags.append({
                "type": "ARTIFICIAL_URGENCY",
                "severity": "medium",
                "title": "Artificial Urgency & Panic Induction",
                "detail": "Imposes tight deadlines engineered to override critical thinking and force hurried, unverified payments."
            })
            if "Psychological Panic Induction" not in tactics:
                tactics.append("Psychological Panic Induction")

        # 11. Safe Signature Check (Debited / Credited from authorized bank)
        is_genuine_tx = bool(re.search(r'\b(?:sent\s*rs|debited\s*for|credited\s*to\s*your|payment\s*of\s*rs|recharge\s*of\s*rs|bill\s*paid\s*via)\b', lower) and \
                             re.search(r'\b(?:ref\s*no|utr|avail\s*bal|balance\s*is|bbps|receipt\s*no)\b', lower))
        
        if is_genuine_tx and len(flags) == 0:
            flags.append({
                "type": "OFFICIAL_TRANSACTION_ALERT",
                "severity": "safe",
                "title": "Verified Bank / Merchant Transaction Notification",
                "detail": "Standard two-way debited/credited transactional confirmation containing authentic reference sequence and institutional balance telemetry."
            })
            tactics = ["Legitimate Informational Notice"]
            category = "Genuine Transaction"

        return {
            "flags": flags,
            "tactics": tactics,
            "category": category,
            "is_genuine_tx": is_genuine_tx
        }

    def compute_risk(self, ml_score: int, ml_confidence: float, heuristics: Dict[str, Any]) -> Tuple[int, str, str]:
        """
        Calculates final combined risk score (0-100), classification, and threat level.
        Returns: (riskScore, classification, level)
        """
        flags = heuristics['flags']
        
        # Calculate heuristic contribution
        heuristic_score = 10
        critical_count = sum(1 for f in flags if f['severity'] == 'critical')
        high_count = sum(1 for f in flags if f['severity'] == 'high')
        medium_count = sum(1 for f in flags if f['severity'] == 'medium')

        heuristic_score += critical_count * 35
        heuristic_score += high_count * 20
        heuristic_score += medium_count * 10

        if heuristics.get('is_genuine_tx', False):
            heuristic_score = max(5, heuristic_score - 40)

        # Blend ML + Heuristics
        final_score = int(round(ml_score * 0.45 + heuristic_score * 0.55))

        # Critical triggers override
        if critical_count >= 1 or high_count >= 2:
            final_score = max(final_score, 85)

        if heuristics.get('is_genuine_tx', False) and critical_count == 0 and high_count == 0:
            final_score = min(final_score, 18)

        final_score = max(5, min(final_score, 99))

        # Risk Classification (aligned with existing UI: Safe, Suspicious, High Risk)
        if final_score >= 70:
            classification = "High Risk"
            level = "CRITICAL" if final_score >= 85 else "HIGH"
        elif final_score >= 35:
            classification = "Suspicious"
            level = "MEDIUM"
        else:
            classification = "Safe"
            level = "LOW"

        return final_score, classification, level

risk_engine = RiskEngine()

