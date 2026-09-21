"""
Corpus generation script for FraudLens AI Engine.
Builds an authentic, balanced dataset of Indian Cyber Crime & UPI communication:
- High Risk (Scams: KYC, Electricity, Lottery, Job, QR reverse-debit, Digital arrest, APK)
- Suspicious (Unverified loans, speculative investment, aggressive urgency)
- Safe (Official bank transaction receipts, legitimate OTPs, UPI debits/credits)
"""

import json
import os

CORPUS = [
    # --- HIGH RISK: Fake KYC & Bank Suspension ---
    {"text": "Dear customer your SBI bank account will be suspended today. Click link to update your PAN and Aadhaar card immediately http://sbi-pan-kyc.vip", "label": "scam", "category": "KYC Scam"},
    {"text": "Your HDFC netbanking is blocked due to incomplete KYC. Visit http://hdfc-verifypan.top to avoid account deactivation within 24 hours.", "label": "scam", "category": "KYC Scam"},
    {"text": "ICICI Bank Alert: Your Debit Card has been deactivated. Complete biometric KYC immediately to unblock: http://icici-card-kyc.info", "label": "scam", "category": "KYC Scam"},
    {"text": "Dear user your Paytm KYC expired. Your wallet balance of Rs 14,200 will be frozen. Download quicksupport and call 9876543210 for verification.", "label": "scam", "category": "KYC Scam"},
    {"text": "Aadhaar Card update mandatory for bank link. Click http://uidai-aadhar-link.xyz to submit OTP and avoid penalty of Rs 10000.", "label": "scam", "category": "KYC Scam"},
    {"text": "Bank alert: Your PNB account KYC is pending. Please click http://pnb-kyc-update.live and enter internet banking password to verify.", "label": "scam", "category": "KYC Scam"},
    {"text": "Dear Axis customer your account documents are rejected. Update PAN card now at http://axis-document-verify.site or visiting branch.", "label": "scam", "category": "KYC Scam"},
    {"text": "Kotak 811 account suspended due to suspicious activity. Verify KYC by entering card details and MPIN at http://kotak-unfreeze.club", "label": "scam", "category": "KYC Scam"},
    {"text": "Attention: Bank of Baroda account access terminated. Restore access by updating mobile number at http://bob-mobile-update.vip", "label": "scam", "category": "KYC Scam"},

    # --- HIGH RISK: Electricity & Utility Disconnection Threats ---
    {"text": "Dear consumer your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210.", "label": "scam", "category": "Electricity Scam"},
    {"text": "Bijli bill update nahi hua hai. Aaj raat line cut ho jayegi. Turant call karein electricity power officer ko 9123456780 par nahi to connection cut.", "label": "scam", "category": "Electricity Scam"},
    {"text": "BESCOM Alert: Your power supply connection will be cut at 10:00 PM due to pending bill Rs 840. Call head engineer at 8765432109.", "label": "scam", "category": "Electricity Scam"},
    {"text": "MSEDCL Consumer Notice: Dear user your light bill is unpaid. Power supply will be disconnected immediately. Contact sub-division officer 9988776655.", "label": "scam", "category": "Electricity Scam"},
    {"text": "Tata Power: Bill payment not synced with server. Tonight electricity cut off. Send screenshot of payment to 9811223344.", "label": "scam", "category": "Electricity Scam"},
    {"text": "Dear gas consumer, your IGL PNG gas pipeline will be disconnected in 2 hours. Clear dues of Rs 450 by sending UPI to gasofficer@upi.", "label": "scam", "category": "Electricity Scam"},
    {"text": "DHBVN Power Alert: Bill update failure. Electricity cut at 8:00 PM today. Call officer 9412345678 to update bill status online.", "label": "scam", "category": "Electricity Scam"},
    {"text": "UPPCL Electricity bill pending warning. Line will be disconnected within 3 hours. Call helpline 8800112233 immediately.", "label": "scam", "category": "Electricity Scam"},

    # --- HIGH RISK: Reverse QR Code & UPI PIN Traps ---
    {"text": "Congratulations! You have won a cash prize of Rs 50,000 from KBC / PhonePe Lucky Draw. Scan the QR code and enter your UPI PIN to claim money instantly.", "label": "scam", "category": "QR Scam"},
    {"text": "Your Google Pay cashback of Rs 2,999 is waiting. Scan this QR code and approve request in GPay app to receive money into your bank account.", "label": "scam", "category": "QR Scam"},
    {"text": "OLX Buyer: I have sent you advance payment of Rs 15,000. Please scan this QR code and enter UPI PIN to receive money in your account.", "label": "scam", "category": "QR Scam"},
    {"text": "Refund approved for your cancelled order on Flipkart of Rs 3,499. Click upi://pay?pa=refunds-desk@okaxis&pn=FlipkartRefund&am=3499 and enter PIN to collect.", "label": "scam", "category": "Fake Refund"},
    {"text": "Scan QR to receive Rs 1,000 scratch card reward from Paytm. Remember to enter your 6 digit UPI PIN to credit balance.", "label": "scam", "category": "QR Scam"},
    {"text": "Sir I am calling from army cantt. I want to buy your sofa. Scanning this barcode and putting PIN will transfer Rs 20000 to your bank.", "label": "scam", "category": "QR Scam"},
    {"text": "PhonePe Reward: You got 4999 cashback voucher. Scan QR sent on WhatsApp and confirm with UPI PIN to claim directly.", "label": "scam", "category": "QR Scam"},
    {"text": "Collect request received: Rs 5,000 from CustomerCare. Enter UPI PIN to receive payment into your account immediately.", "label": "scam", "category": "UPI Scam"},

    # --- HIGH RISK: Part-Time Job & Telegram Task Scams ---
    {"text": "Part time work from home opportunity! Earn Rs 3,000 to 5,000 daily by liking YouTube videos and rating hotels. Contact HR on WhatsApp now wa.me/919988776655.", "label": "scam", "category": "Job Scam"},
    {"text": "Amazon Part-Time Hiring: Review products and earn 2000 to 8000 daily. No investment needed. Join our Telegram VIP channel @amazon_tasks_in.", "label": "scam", "category": "Job Scam"},
    {"text": "Ghar baithe kamayein 3000-5000 rozana. Sirf Google maps par review dena hai. WhatsApp karein 9822334455 for instant joining bonus Rs 500.", "label": "scam", "category": "Job Scam"},
    {"text": "Freelance movie review task available. Work 1 hour daily and earn Rs 2,500. Register at http://boxoffice-tasks.work", "label": "scam", "category": "Job Scam"},
    {"text": "Congratulations selected for data entry remote job. Daily payout Rs 4,000. Deposit refundable security deposit of Rs 999 to start.", "label": "scam", "category": "Job Scam"},
    {"text": "Prepaid task investment: Complete Level 3 task by depositing Rs 10,000 to get Rs 18,000 return in 15 minutes. Contact task manager.", "label": "scam", "category": "Job Scam"},

    # --- HIGH RISK: Digital Arrest & Law Enforcement Impersonation ---
    {"text": "TRAI Notice: Your mobile number is involved in 17 money laundering cases in Mumbai. Your SIM will be blocked in 2 hours. Press 9 for CBI officer.", "label": "scam", "category": "Digital Arrest"},
    {"text": "Delhi Police Cyber Cell: An illegal parcel with narcotics and fake passports under your Aadhaar has been intercepted at airport. Video call police officer immediately.", "label": "scam", "category": "Digital Arrest"},
    {"text": "Arrest warrant issued in your name by Supreme Court under PMLA act. To settle out of court transfer bail amount Rs 50,000 to RBI verified escrow account.", "label": "scam", "category": "Digital Arrest"},
    {"text": "CBI New Delhi: Your bank account is flagged for international terror financing. Join Skype interrogation right now or police team will raid your house.", "label": "scam", "category": "Digital Arrest"},
    {"text": "Customs Department Mumbai: Your Fedex parcel contains 5 expired passports and MDMA drugs. Transfer security clearance deposit to customsofficer@sbi.", "label": "scam", "category": "Digital Arrest"},

    # --- HIGH RISK: Malicious APK / Remote Access Droppers ---
    {"text": "Dear Customer, please verify your mobile number for Jio 5G upgrade or your SIM card will be deactivated within 12 hours. Download app from link: http://jio-5g-upgrade.apk", "label": "scam", "category": "APK Malware"},
    {"text": "SBI YONO app update required. Install SBI_Yono_Reward_v4.apk from http://yono-rewards-update.in to prevent internet banking lockout.", "label": "scam", "category": "APK Malware"},
    {"text": "Your income tax refund of Rs 15,490 approved. Download IT_Refund_Claim.apk to file instant bank claim.", "label": "scam", "category": "APK Malware"},
    {"text": "Install AnyDesk / TeamViewer QuickSupport app and share 9 digit code to verify your bank KYC failure.", "label": "scam", "category": "APK Malware"},
    {"text": "WhatsApp Gold Edition 2026 released with secret video call recording! Download free APK from http://wa-gold-pro.cc", "label": "scam", "category": "APK Malware"},

    # --- HIGH RISK: Courier & India Post Delivery Phishing ---
    {"text": "Your courier package DHL/IndiaPost has failed delivery due to incorrect address. Pay Rs 25 re-delivery fee at http://indiapost-redelivery.live to reschedule delivery.", "label": "scam", "category": "Phishing"},
    {"text": "India Post alert: Package IN8923741829 delivery stopped. Address missing street number. Update address and pay 32 Rs at http://indiapost-service-tracking.com", "label": "scam", "category": "Phishing"},
    {"text": "BlueDart delivery failed: Receiver unavailable. Click link http://bluedart-delivery-fee.top and pay Rs 10 reschedule charge to prevent parcel return.", "label": "scam", "category": "Phishing"},

    # --- HIGH RISK: Fake Customer Care & Refund Scams ---
    {"text": "Flight ticket refund pending. Contact airline customer care officer at 9876501234 to verify refund code and collect UPI transfer.", "label": "scam", "category": "Fake Customer Care"},
    {"text": "Swiggy order failed but money deducted? Call 9123009988 for instant refund. Our executive will guide you through Google Pay screen sharing.", "label": "scam", "category": "Fake Customer Care"},
    {"text": "IRCTC ticket booking refund Rs 1,820 failed. Dial toll free helpline 9832109876 to get UPI refund directly in PhonePe.", "label": "scam", "category": "Fake Customer Care"},

    # --- SUSPICIOUS: Unverified Loans, Crypto, Investment & High-Urgency Alerts ---
    {"text": "Special loan offer! Pre-approved personal loan of Rs 5 Lakhs approved at 0% interest with zero documentation. Apply now on WhatsApp.", "label": "suspicious", "category": "Investment Scam"},
    {"text": "Earn 500% profit in 24 hours with crypto bot trading. Guaranteed daily return with zero risk. WhatsApp our trading guru now.", "label": "suspicious", "category": "Investment Scam"},
    {"text": "Stock market jackpot tip: Buy penny stock ABC today, target 1000% gain in 3 days. Join Telegram VIP insider group.", "label": "suspicious", "category": "Investment Scam"},
    {"text": "Urgent: Limited time flash bonus! Deposit Rs 1,000 in color prediction game and get Rs 5,000 cash balance instantly.", "label": "suspicious", "category": "Investment Scam"},
    {"text": "Instant credit card approval without CIBIL score! Lifetime free card with 2 Lakh limit. Submit Aadhaar copy on telegram.", "label": "suspicious", "category": "Banking Fraud"},
    {"text": "Your matrimonial profile received 8 new interests today. Upgrade to VIP membership now at 50% discount to view phone numbers.", "label": "suspicious", "category": "Other"},
    {"text": "Attention: Unclaimed PF pension funds detected in your name. Verify details via agent on WhatsApp 9988112233.", "label": "suspicious", "category": "Banking Fraud"},
    {"text": "Dear user, we detected unauthorized login attempt on your account from unknown device in Mumbai. Click http://sec-check.me to review.", "label": "suspicious", "category": "Phishing"},

    # --- SAFE: Genuine Bank Transactions & Legitimate UPI Alerts ---
    {"text": "Sent Rs 450.00 from HDFC Bank A/c XX4019 to Swiggy via UPI Ref No 429104928172. Available balance is Rs 24,190.00.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Dear SBI Customer, Rs 12,500.00 credited to your A/c XX8921 on 20-Sep-26 by transfer from Infosys Ltd. Total Bal: Rs 84,320.00.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Rs 250.00 debited from ICICI Bank account XX3021 on 20-Sep-26 towards Chai Point UPI txn ref 492019283019. Available balance Rs 5,420.00.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Axis Bank: Your A/C 9182 is debited for INR 1,899.00 on 20-SEP-26 at AMAZON INDIA. Avail Bal: INR 19,230.50. Call 18004195959 if not done by you.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Dear Customer, OTP for login to SBI YONO is 492810. Do not share OTP with anyone including bank officials. SBI never asks for OTP or PIN.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "HDFC Bank Alert: 849201 is your NetBanking authentication OTP. Valid for 3 mins. Never share your OTP, PIN or CVV with anyone.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Kotak Mahindra Bank: Rs 5,000 deposited in A/c 4810 via UPI from Rahul Sharma. Ref: 429102918273.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Google Pay: You paid Rs 85 to Reliance Fresh UPI Ref 402910492810. View transaction in app.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "PhonePe: Paid Rs 320 to Apollo Pharmacy using UPI ID apollo@icici. UTR 429104920192.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Dear consumer, payment of Rs 1,420 towards BESCOM electricity bill received successfully. Receipt No: BESC-9482910. Thank you.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Tata Power receipt: Bill of Rs 2,150 paid via BBPS. Transaction reference 492019284910. Power status: Active.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Paytm Bank: Rs 150 added to your wallet via UPI. Updated wallet balance is Rs 1,240.00.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Airtel Thanks: Your recharge of Rs 299 is successful. 1.5GB/day data, unlimited calls valid for 28 days.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Jio: Rs 349 plan activated on your number 9876543210. 2GB/day + unlimited 5G data.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "IndiGo flight booking confirmation: PNR 6E-9481 confirmed for BLR to DEL on 25-Sep-26. Web check-in opens 48 hours prior.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "IRCTC Booking: PNR 2491049201 Confirmed in 12951 Mumbai Rajdhani Coach B3 Berth 42 (LB). Have a safe journey.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Swiggy order #948201 delivered by delivery partner Ramesh. Enjoy your meal!", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Zomato: Order confirmed at Empire Restaurant. Delivery partner assigned. Live tracking in app.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Uber receipt: Trip completed. Total Rs 340 debited via Uber Cash / UPI. Rating submitted.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Ola Cabs: Ride PIN is 4921 for your cab CRB-9482 with driver Suresh. Do not share OTP before driver arrives.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Flipkart Order Confirmed: Your item will be delivered by Thursday, 24 Sep. Track order in Flipkart app.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Amazon India: Package containing Boat Airdopes has been dispatched. Track via official Amazon app.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "Dear Customer, salary of INR 75,000.00 credited to A/C XX4921 on 31-Aug-26 via NEFT from TECH MAHINDRA LTD.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "ICICI Bank: Monthly e-statement for your account XX3021 has been sent to your registered email address.", "label": "safe", "category": "Genuine Transaction"},
    {"text": "SBI Alert: Interest amount of Rs 480.00 credited to your savings account XX8921 on 30-Jun-26.", "label": "safe", "category": "Genuine Transaction"}
]

def main():
    target_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(target_dir, "corpus.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(CORPUS, f, indent=2, ensure_ascii=False)
    print(f"Generated {len(CORPUS)} samples in {output_path}")

if __name__ == "__main__":
    main()

