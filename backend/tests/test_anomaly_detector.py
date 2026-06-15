import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from detectors.anomaly_detector import detect


def test_known_bad_ip_triggers():
    result = detect(ip_address="185.220.101.45")
    assert result["score"] >= 30
    assert "RULE_KNOWN_BAD_IP" in result["triggered_rules"]
    assert result["detector"] == "anomaly"


def test_suspicious_country_triggers():
    result = detect(country="RU")
    assert result["score"] >= 20
    assert "RULE_SUSPICIOUS_COUNTRY" in result["triggered_rules"]


def test_impossible_travel_triggers():
    result = detect(
        country="RU",
        previous_country="KZ",
        ip_address="185.220.101.45",
    )
    assert "RULE_IMPOSSIBLE_TRAVEL" in result["triggered_rules"]


def test_new_device_triggers():
    result = detect(device_id="unknown-android-xyz")
    assert "RULE_NEW_DEVICE" in result["triggered_rules"]


def test_abnormal_login_time_triggers():
    result = detect(login_time="2024-06-15T03:14:00Z")
    assert "RULE_ABNORMAL_LOGIN_TIME" in result["triggered_rules"]


def test_normal_login_time_no_trigger():
    result = detect(login_time="2024-06-15T14:00:00Z")
    assert "RULE_ABNORMAL_LOGIN_TIME" not in result["triggered_rules"]


def test_full_demo_scenario_critical():
    result = detect(
        email="victim@example.kz",
        ip_address="185.220.101.45",
        country="RU",
        previous_country="KZ",
        device_id="unknown-android-xyz",
        login_time="2024-06-15T03:14:00Z",
    )
    assert result["score"] >= 60
    assert result["severity"] in ("High", "Critical")


def test_clean_login_low_score():
    result = detect(
        email="regular@example.kz",
        ip_address="212.60.10.5",
        country="KZ",
        previous_country="KZ",
        device_id="known-iphone-123",
        login_time="2024-06-15T10:00:00Z",
    )
    assert result["score"] < 40


def test_score_capped_at_100():
    result = detect(
        ip_address="185.220.101.45",
        country="RU",
        previous_country="KZ",
        device_id="unknown-device",
        login_time="2024-06-15T01:00:00Z",
    )
    assert result["score"] <= 100


def test_empty_inputs_no_crash():
    result = detect()
    assert result["score"] == 0
    assert result["detector"] == "anomaly"
