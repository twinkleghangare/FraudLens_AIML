"""
Feature Extraction Module for FraudLens.
Extracts lexical, structural, and domain-specific fraud indicators.
"""

from typing import Dict, Any
from ai_engine.preprocessing.text_cleaner import clean_text, extract_patterns

class FeatureExtractor:
    def __init__(self):
        self.critical_phrases = [
            'upi pin', 'enter pin', 'scan qr to receive', 'electricity disconnected',
            'line cut', 'account suspended', 'kyc expired', 'apk', 'claim cashback',
            'part time job', 'youtube video like', 'digital arrest', 'illegal parcel',
            'narcotics', 'cbi officer', 'police video call', 'failed delivery'
        ]
        
    def extract_features(self, raw_text: str) -> Dict[str, Any]:
        """Extract multi-signal feature vector from text."""
        cleaned = clean_text(raw_text)
        patterns = extract_patterns(raw_text)
        lower_raw = raw_text.lower()
        
        matched_phrases = [p for p in self.critical_phrases if p in lower_raw]
        
        return {
            'cleaned_text': cleaned,
            'char_length': len(raw_text),
            'word_count': len(raw_text.split()),
            'has_url': patterns['has_url'],
            'has_phone': patterns['has_phone'],
            'has_upi': patterns['has_upi'],
            'has_pin_mention': patterns['has_pin_mention'],
            'has_kyc_mention': patterns['has_kyc_mention'],
            'has_urgency': patterns['has_urgency'],
            'has_apk': patterns['has_apk'],
            'matched_critical_phrases': matched_phrases,
            'extracted_urls': patterns['urls'],
            'extracted_phones': patterns['phones'],
            'extracted_upi_ids': patterns['upi_ids'],
            'extracted_amounts': patterns['amounts']
        }

