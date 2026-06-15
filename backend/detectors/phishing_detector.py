import json
import re
from datetime import datetime, timezone
from pathlib import Path
from config import get_severity

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> dict:
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def detect(message: str = "", url: str = "", sender: str = "", channel: str = "sms") -> dict:
    keywords_ru = _load_json("phishing_keywords_ru.json")
    keywords_kz = _load_json("phishing_keywords_kz.json")
    phishing_urls = _load_json("known_phishing_urls.json")

    score = 0
    reasons = []
    triggered_rules = []
    text = (message + " " + url).lower()

    # Rule: urgency language RU
    for kw in keywords_ru["urgency"]:
        if kw.lower() in text:
            score += 15
            reasons.append(f"Message contains urgency language: '{kw}'")
            triggered_rules.append("RULE_URGENCY_LANGUAGE")
            break

    # Rule: urgency language KZ
    for kw in keywords_kz["urgency"]:
        if kw.lower() in text:
            score += 15
            reasons.append(f"Message contains urgency language (KZ): '{kw}'")
            if "RULE_URGENCY_LANGUAGE" not in triggered_rules:
                triggered_rules.append("RULE_URGENCY_LANGUAGE")
            break

    # Rule: fake bonus
    for kw in keywords_ru["fake_bonus"]:
        if kw.lower() in text:
            score += 20
            reasons.append(f"Fake bank bonus offer detected: '{kw}'")
            triggered_rules.append("RULE_FAKE_BONUS_OFFER")
            break

    for kw in keywords_kz["fake_bonus"]:
        if kw.lower() in text:
            score += 20
            reasons.append(f"Fake bonus offer detected (KZ): '{kw}'")
            if "RULE_FAKE_BONUS_OFFER" not in triggered_rules:
                triggered_rules.append("RULE_FAKE_BONUS_OFFER")
            break

    # Rule: bank impersonation
    for brand in keywords_ru["bank_impersonation"]:
        if brand.lower() in text:
            score += 20
            reasons.append(f"Bank brand impersonation detected: '{brand}'")
            triggered_rules.append("RULE_BANK_IMPERSONATION")
            break

    # Rule: suspicious URL domain
    if url:
        for domain in phishing_urls["domains"]:
            if domain.lower() in url.lower():
                score += 25
                reasons.append(f"Known phishing URL domain detected: {domain}")
                triggered_rules.append("RULE_KNOWN_PHISHING_DOMAIN")
                break

        for pattern in phishing_urls["url_patterns"]:
            if pattern in url.lower():
                score += 10
                reasons.append(f"Suspicious URL pattern detected: '{pattern}'")
                triggered_rules.append("RULE_SUSPICIOUS_URL")
                break

        for tld in phishing_urls["suspicious_tlds"]:
            if url.lower().endswith(tld) or f"{tld}/" in url.lower():
                score += 10
                reasons.append(f"Suspicious TLD detected: {tld} (expected .kz)")
                triggered_rules.append("RULE_SUSPICIOUS_TLD")
                break

    # Rule: contains a URL in an SMS (common phishing vector)
    if channel == "sms" and re.search(r"https?://", message or ""):
        score += 10
        reasons.append("SMS message contains a URL — common phishing vector")
        triggered_rules.append("RULE_SMS_CONTAINS_URL")

    # Rule: action words RU
    for kw in keywords_ru["action_words"]:
        if kw.lower() in text:
            score += 5
            reasons.append(f"Action word detected: '{kw}'")
            triggered_rules.append("RULE_ACTION_WORD")
            break

    # Rule: threat words RU
    for kw in keywords_ru.get("threat_words", []):
        if kw.lower() in text:
            score += 10
            reasons.append(f"Threat language detected: '{kw}'")
            triggered_rules.append("RULE_THREAT_LANGUAGE")
            break

    score = min(score, 100)
    confidence = round(min(0.60 + score / 250, 0.99), 2)

    return {
        "score": score,
        "confidence": confidence,
        "severity": get_severity(score),
        "reasons": reasons if reasons else ["No phishing indicators detected"],
        "triggered_rules": list(set(triggered_rules)),
        "detector": "phishing",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
