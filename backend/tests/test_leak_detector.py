import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from detectors.leak_detector import detect


def test_known_email_detected():
    result = detect(email="victim@example.kz")
    assert result["score"] >= 40
    assert "RULE_EMAIL_IN_BREACH" in result["triggered_rules"]
    assert result["detector"] == "leak"


def test_known_phone_detected():
    result = detect(phone="+77001234567")
    assert result["score"] >= 30
    assert "RULE_PHONE_IN_BREACH" in result["triggered_rules"]


def test_known_username_detected():
    result = detect(username="aibek_kz")
    assert result["score"] >= 25
    assert "RULE_USERNAME_IN_BREACH" in result["triggered_rules"]


def test_multiple_matches_boost():
    result = detect(email="victim@example.kz", phone="+77001234567")
    assert "RULE_MULTIPLE_BREACH_SOURCES" in result["triggered_rules"]
    assert result["score"] >= 80


def test_unknown_email_no_match():
    result = detect(email="totally.unknown@nowhere.com")
    assert result["score"] == 0
    assert result["severity"] == "Low"


def test_unknown_phone_no_match():
    result = detect(phone="+79999999999")
    assert result["score"] == 0


def test_score_capped_at_100():
    result = detect(
        email="victim@example.kz",
        phone="+77001234567",
        username="aibek_kz",
    )
    assert result["score"] <= 100


def test_confidence_range():
    result = detect(email="victim@example.kz")
    assert 0.0 <= result["confidence"] <= 1.0


def test_empty_inputs_no_crash():
    result = detect()
    assert result["score"] == 0
    assert result["detector"] == "leak"


def test_case_insensitive_email():
    result = detect(email="VICTIM@EXAMPLE.KZ")
    assert result["score"] >= 40
