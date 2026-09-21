"""
Text Preprocessing & Normalization Module for FraudLens.
Handles English and Hinglish cybersecurity and financial communication.
"""

import re
import string

# Core stopwords to remove, keeping critical sentiment and urgency modifiers
STOPWORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're",
    "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he',
    'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's",
    'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
    'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
    'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
    'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'own', 'same', 'so', 'than', 'too', 'very', 's',
    't', 'can', 'will', 'just', 'don', 'should', "should've", 'now'
}

# Hinglish mappings for normalization
HINGLISH_MAP = {
    'turant': 'immediately',
    'jaldi': 'urgently',
    'aaj': 'today',
    'raat': 'tonight',
    'bijli': 'electricity',
    'kat': 'cut',
    'karein': 'do',
    'karo': 'do',
    'paisa': 'money',
    'inam': 'reward',
    'khata': 'account',
    'band': 'blocked'
}

def extract_patterns(text: str) -> dict:
    """Extract structural patterns (URLs, phones, UPI IDs, amounts) from text."""
    urls = re.findall(r'https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:vip|top|xyz|cc|work|site|club|live|apk|tk|ml|info)[^\s]*', text)
    phones = re.findall(r'(?:\+91[\-\s]?)?[6-9]\d{9}', text)
    upi_ids = re.findall(r'[\w\.\-]+@(?:okaxis|okhdfcbank|okicici|oksbi|paytm|ybl|apl|upi|barodampay|postbank)', text, re.I)
    amounts = re.findall(r'(?:Rs\.?|INR|₹)\s*[\d,]+(?:\.\d{2})?', text, re.I)
    
    return {
        'urls': urls,
        'phones': phones,
        'upi_ids': upi_ids,
        'amounts': amounts,
        'has_url': len(urls) > 0,
        'has_phone': len(phones) > 0,
        'has_upi': len(upi_ids) > 0 or 'upi' in text.lower(),
        'has_pin_mention': bool(re.search(r'\b(?:upi\s*pin|enter\s*pin|mpin|atm\s*pin)\b', text, re.I)),
        'has_kyc_mention': bool(re.search(r'\b(?:kyc|pan\s*card|aadhaar|deactivat|suspend)\b', text, re.I)),
        'has_urgency': bool(re.search(r'\b(?:immediately|tonight|9:30|within\s*\d+\s*hours?|turant|jaldi|blocked\s*today)\b', text, re.I)),
        'has_apk': bool(re.search(r'\.apk\b|download\s*app|install\s*quicksupport|anydesk|teamviewer', text, re.I))
    }

def clean_text(text: str, remove_stopwords: bool = True) -> str:
    """Clean and normalize text for TF-IDF feature extraction."""
    if not text:
        return ""
    
    # 1. Lowercase
    t = text.lower()
    
    # 2. Map Hinglish keywords
    words = t.split()
    words = [HINGLISH_MAP.get(w, w) for w in words]
    t = " ".join(words)
    
    # 3. Normalize common phishing tokens
    t = re.sub(r'https?://\S+|www\.\S+', ' urltoken ', t)
    t = re.sub(r'(?:\+91[\-\s]?)?[6-9]\d{9}', ' phonetoken ', t)
    t = re.sub(r'(?:rs\.?|inr|₹)\s*[\d,]+', ' moneytoken ', t)
    
    # 4. Remove punctuation but keep alphanumeric and spaces
    t = t.translate(str.maketrans(string.punctuation, ' ' * len(string.punctuation)))
    
    # 5. Tokenize and filter stopwords
    tokens = t.split()
    if remove_stopwords:
        tokens = [w for w in tokens if w not in STOPWORDS and len(w) > 1]
    
    return " ".join(tokens)

