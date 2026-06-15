import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from detectors.phishing_detector import detect


def test_kaspi_sms_blaster():
    result = detect(
        message="Kaspi Bank: Вы выиграли 50,000 тенге! Срочно перейдите по ссылке: http://kaspi-bonus.ru/claim",
        url="http://kaspi-bonus.ru/claim",
        sender="+77089999999",
        channel="sms",
    )
    assert result["score"] >= 80
    assert result["severity"] == "Critical"
    assert result["detector"] == "phishing"
    assert len(result["reasons"]) > 0
    assert len(result["triggered_rules"]) > 0


def test_clean_message_low_score():
    result = detect(
        message="Ваш баланс составляет 12,000 тенге.",
        url="",
        channel="sms",
    )
    assert result["score"] < 40
    assert result["detector"] == "phishing"


def test_urgency_keyword_triggers():
    result = detect(message="Срочно подтвердите ваш аккаунт!", channel="sms")
    assert "RULE_URGENCY_LANGUAGE" in result["triggered_rules"]


def test_bank_impersonation_triggers():
    result = detect(message="Halyk Bank: получите ваш подарок", channel="sms")
    assert "RULE_BANK_IMPERSONATION" in result["triggered_rules"]


def test_known_phishing_domain_triggers():
    result = detect(
        message="Перейдите на сайт",
        url="http://kaspi-bonus.kz/win",
        channel="sms",
    )
    assert "RULE_KNOWN_PHISHING_DOMAIN" in result["triggered_rules"]
    # domain rule (+25) + SMS-with-URL rule (+10) = 35 minimum
    assert result["score"] >= 35


def test_suspicious_tld_triggers():
    result = detect(
        message="Получите приз",
        url="http://halyk-promo.ru/claim",
        channel="sms",
    )
    assert "RULE_SUSPICIOUS_TLD" in result["triggered_rules"]


def test_sms_with_url_triggers():
    result = detect(
        message="Нажмите https://example.com/verify",
        channel="sms",
    )
    assert "RULE_SMS_CONTAINS_URL" in result["triggered_rules"]


def test_score_capped_at_100():
    result = detect(
        message="Kaspi Bank: Срочно! Вы выиграли бонус! Перейдите по ссылке немедленно! Заблокирован!",
        url="http://kaspi-bonus.ru/claim?id=123",
        channel="sms",
    )
    assert result["score"] <= 100


def test_confidence_between_0_and_1():
    result = detect(message="Test message", channel="sms")
    assert 0.0 <= result["confidence"] <= 1.0


def test_timestamp_present():
    result = detect(message="Test", channel="sms")
    assert "timestamp" in result
    assert result["timestamp"]
