"""
Explainable AI (XAI) Module for FraudLens.
Generates evidence-backed cognitive explanations, psychological deception vectors,
actionable safety instructions, and a 1930 Cybercrime complaint draft.
"""

from typing import Dict, Any, List

class ExplainableAIEngine:
    def __init__(self):
        pass

    def explain(self, text: str, risk_score: int, classification: str, flags: List[Dict[str, Any]], tactics: List[str], category: str) -> Dict[str, Any]:
        """Generate structured explainable AI breakdown."""
        is_high_risk = classification == "High Risk"
        is_suspicious = classification == "Suspicious"
        is_safe = classification == "Safe"

        # 1. Summary
        if is_high_risk:
            primary_flag = flags[0]['title'] if flags else "High Risk Financial Deception"
            summary = (
                f"FraudLens AI flagged this message with elevated threat telemetry (Risk Score: {risk_score}/100 - {classification}). "
                f"Primary indicator: {primary_flag}. The message employs coercive pressure engineered to induce immediate compliance."
            )
        elif is_suspicious:
            summary = (
                f"FraudLens AI detected suspicious anomalies (Risk Score: {risk_score}/100). "
                f"The communication contains unsolicited claims or unverified financial solicitations requiring manual verification."
            )
        else:
            summary = (
                f"FraudLens AI evaluated this message as legitimate (Risk Score: {risk_score}/100 - {classification}). "
                f"No malicious signatures, urgency coercion, credential harvesting, or reverse-debit fraud vectors were identified."
            )

        # 2. Psychological Vectors
        if not tactics:
            tactics = ["Legitimate Informational Context"] if is_safe else ["Contextual Anomaly"]

        # 3. Key Takeaways and Immediate Actions based on Category & Flags
        if "Electricity Scam" in category or any("ELECTRICITY" in f.get('type', '') for f in flags):
            immediate_action = "DO NOT call the number provided in the SMS. Check your electricity bill status exclusively on the official state electricity board portal or app."
            key_takeaway = "State electricity distribution companies NEVER send personal SMS threatening power disconnection on the same night."
        elif "QR Scam" in category or any("UPI_PIN" in f.get('type', '') for f in flags):
            immediate_action = "NEVER scan a QR code or enter your UPI PIN to receive money. UPI PIN is required solely to debit money from your account."
            key_takeaway = "Golden Rule of UPI: Entering UPI PIN always sends money, it never receives money."
        elif "KYC Scam" in category or any("KYC" in f.get('type', '') for f in flags):
            immediate_action = "DO NOT click any external link to update KYC or PAN. Visit your bank's branch or use your bank's official registered mobile app."
            key_takeaway = "RBI guidelines strictly prohibit banks from terminating accounts without formal registered postal or netbanking notices."
        elif "Digital Arrest" in category:
            immediate_action = "Hang up and disconnect immediately. Report the phone number or Skype ID to the National Cyber Crime Reporting Portal (1930)."
            key_takeaway = "There is no legal provision in Indian law for 'Digital Arrest'. Police and courts never interrogate or settle bails on video calls."
        elif "APK Malware" in category:
            immediate_action = "DO NOT install the downloaded APK. If already installed, disconnect WiFi/mobile data, uninstall the app, and reboot into safe mode."
            key_takeaway = "Never install apps from SMS links or untrusted third-party sites outside Google Play Store / Apple App Store."
        elif "Job Scam" in category:
            immediate_action = "DO NOT pay any registration or prepaid deposit fee. Block the recruiter on WhatsApp and Telegram immediately."
            key_takeaway = "Legitimate companies never ask job applicants for prepaid task deposits to unlock salary payments."
        elif is_safe:
            immediate_action = "Safe to proceed. Verify that transaction amounts match your personal purchase receipts."
            key_takeaway = "Official bank notifications include masked account numbers and balance telemetry without requesting sensitive PIN/OTP inputs."
        else:
            immediate_action = "Exercise caution. Do not forward this message or disclose banking credentials to unverified senders."
            key_takeaway = "Always verify unsolicited financial requests through verified official institutional channels."

        # 4. Draft National Cyber Crime Complaint (1930 / cybercrime.gov.in)
        suspect_info = []
        for f in flags:
            suspect_info.append(f"- {f['title']}: {f['detail']}")
        evidence_text = "\n".join(suspect_info) if suspect_info else "- High confidence algorithmic scam pattern detected"

        complaint_draft = (
            f"=== NATIONAL CYBER CRIME REPORTING PORTAL (1930) DRAFT ===\n"
            f"Incident Category: {category}\n"
            f"Threat Assessment: {classification} (Risk Score: {risk_score}/100)\n"
            f"Reported Evidence & Flags:\n{evidence_text}\n"
            f"Original Content Preview:\n\"{text[:200]}...\"\n"
            f"Recommended Investigation: Trace sender origin, telecom identifier, and freeze associated VPA/accounts."
        )

        return {
            "summary": summary,
            "socialEngineeringTactics": tactics,
            "immediateAction": immediate_action,
            "keyTakeaway": key_takeaway,
            "complaintDraft": complaint_draft,
            "generatedByLLM": False
        }

xai_engine = ExplainableAIEngine()

