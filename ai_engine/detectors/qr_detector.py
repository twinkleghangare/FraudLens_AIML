"""
UPI QR Code & Deep Link Intent Analyzer for FraudLens.
Parses standard NPCI UPI intent strings (upi://pay?...),
detects reverse-debit frauds ('scan to receive' traps), hardcoded amounts,
and suspicious payee names.
"""

import re
from urllib.parse import parse_qs, urlparse
from typing import Dict, Any

SUSPICIOUS_PAYEE_KEYWORDS = [
    'refund', 'cashback', 'reward', 'kbc', 'lottery', 'winner',
    'customer care', 'helpline', 'verification', 'officer', 'support'
]

class QRDetector:
    def __init__(self):
        pass

    def analyze(self, qr_content: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze raw QR text or UPI payment payload."""
        content = qr_content.strip()
        user_context = user_context or {}
        expected_action = user_context.get('expectedAction', '') # 'receive' or 'send'

        flags = []
        tactics = []
        parsed_data = {
            "isUPI": False,
            "pa": None,
            "pn": None,
            "am": None,
            "cu": "INR",
            "tn": None,
            "isDebitIntent": False
        }

        # Check if UPI Intent
        if content.lower().startswith('upi://pay'):
            parsed_data["isUPI"] = True
            try:
                # Parse query parameters
                query_str = content.split('?', 1)[1] if '?' in content else ''
                params = parse_qs(query_str)
                parsed_data["pa"] = params.get('pa', [None])[0]
                parsed_data["pn"] = params.get('pn', [None])[0]
                parsed_data["am"] = params.get('am', [None])[0]
                parsed_data["cu"] = params.get('cu', ['INR'])[0]
                parsed_data["tn"] = params.get('tn', [None])[0]
            except Exception:
                pass

        risk_score = 10

        # Scenario 1: Non-UPI or Random Payload
        if not parsed_data["isUPI"]:
            if re.match(r'https?://', content):
                flags.append({
                    "title": "Non-Payment External URL in QR",
                    "detail": f"QR code encodes a web URL ({content[:60]}...) rather than an authorized NPCI UPI payment intent. Scanning this may navigate to phishing sites.",
                    "severity": "medium"
                })
                tactics.append("QR Redirection Phishing")
                risk_score = 45
            else:
                flags.append({
                    "title": "Unrecognized QR Payload Format",
                    "detail": "The scanned QR does not conform to the NPCI UPI standard specifications.",
                    "severity": "medium"
                })
                risk_score = 35

        # Scenario 2: Reverse-Debit Fraud (User expects to RECEIVE money, but QR debits)
        pa = (parsed_data["pa"] or '').lower()
        pn = (parsed_data["pn"] or '').lower()
        tn = (parsed_data["tn"] or '').lower()
        am = parsed_data["am"]

        # Any UPI QR scanned by a camera will DEBIT the scanner's bank account when PIN is entered
        parsed_data["isDebitIntent"] = True

        if expected_action == 'receive':
            flags.append({
                "title": "Reverse-Debit 'Scan to Receive' Trap Detected",
                "detail": "You specified you expected to RECEIVE money. However, this QR code initiates a DEBIT transfer from your account. Scammers send debit QRs claiming 'scan to receive cashback/payment'.",
                "severity": "critical"
            })
            tactics.append("Reverse-Debit Social Engineering")
            risk_score = 98

        # Hardcoded deduction amount check
        if am:
            try:
                amt_val = float(am)
                if amt_val > 0:
                    flags.append({
                        "title": f"Pre-Configured Instant Deduction (INR {amt_val:,.2f})",
                        "detail": f"QR contains a pre-set amount (INR {amt_val:,.2f}). Scanning and approving this request will immediately deduct this sum from your bank account.",
                        "severity": "high" if expected_action != 'receive' else "critical"
                    })
                    risk_score += 30
            except ValueError:
                pass

        # Suspicious Payee Name or Transaction Note
        payee_str = f"{pn} {tn}"
        matched_suspicious = [kw for kw in SUSPICIOUS_PAYEE_KEYWORDS if kw in payee_str]
        if matched_suspicious:
            flags.append({
                "title": f"Deceptive Payee Entity Name ({', '.join(matched_suspicious)})",
                "detail": f"The payee name or transaction note contains deceptive keywords ({', '.join(matched_suspicious)}) designed to masquerade as an official cashback/refund desk.",
                "severity": "high"
            })
            tactics.append("Official Entity Mimicry")
            risk_score += 35

        # Personal VPA masquerading as business
        if pa and any(h in pa for h in ['@okaxis', '@okhdfcbank', '@okicici', '@oksbi', '@ybl']) and ('refund' in pn or 'cashback' in pn):
            flags.append({
                "title": "Personal VPA Impersonating Corporate Desk",
                "detail": f"The beneficiary VPA ({pa}) is a personal consumer account, but the display name ({parsed_data['pn']}) claims to be an official institutional refund desk.",
                "severity": "critical"
            })
            tactics.append("Beneficiary Account Spoofing")
            risk_score = max(risk_score, 92)

        # Final score bounding
        if any(f['severity'] == 'critical' for f in flags):
            risk_score = max(risk_score, 88)

        risk_score = max(5, min(risk_score, 99))

        if risk_score >= 70:
            classification = "High Risk"
            confidence = 0.98
        elif risk_score >= 35:
            classification = "Suspicious"
            confidence = 0.88
        else:
            classification = "Safe"
            confidence = 0.96
            if not flags:
                flags.append({
                    "title": "Standard Merchant / Peer UPI Intent",
                    "detail": "Payload contains valid NPCI UPI parameters. Ensure the payee identity matches your intended merchant before approving.",
                    "severity": "safe"
                })
                tactics.append("Valid NPCI Standard Payload")

        summary = (
            f"FraudLens AI analyzed this UPI QR payload with Risk Score {risk_score}/100 ({classification}). "
            + ("CRITICAL WARNING: This QR debits money from your account." if parsed_data['isDebitIntent'] and risk_score >= 70 else "Valid payment structure.")
        )
        immediate_action = (
            "DO NOT enter your UPI PIN. If someone asked you to scan this to receive money, CANCEL immediately. You are sending them money."
            if classification != "Safe" else "Verify payee details in your UPI app before entering your secure UPI PIN."
        )
        key_takeaway = "Entering your UPI PIN NEVER adds money to your account. Entering your PIN ALWAYS transfers money out."

        complaint_draft = (
            f"=== NATIONAL CYBER CRIME REPORTING PORTAL (1930) DRAFT ===\n"
            f"Incident Category: UPI Reverse-Debit QR Fraud\n"
            f"Payee VPA: {parsed_data.get('pa') or 'N/A'}\n"
            f"Payee Name: {parsed_data.get('pn') or 'N/A'}\n"
            f"Deduction Amount: {parsed_data.get('am') or 'Unspecified'} INR\n"
            f"Threat Assessment: {classification} (Risk Score: {risk_score}/100)"
        )

        return {
            "type": "qr",
            "input": qr_content,
            "riskScore": risk_score,
            "classification": classification,
            "confidence": confidence,
            "flags": flags,
            "tactics": tactics,
            "parsedData": parsed_data,
            "aiExplanation": {
                "summary": summary,
                "socialEngineeringTactics": tactics,
                "immediateAction": immediate_action,
                "keyTakeaway": key_takeaway,
                "complaintDraft": complaint_draft,
                "generatedByLLM": False
            }
        }

qr_detector = QRDetector()

