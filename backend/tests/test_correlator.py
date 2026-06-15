import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fusion.correlator import correlate


def _make_result(detector: str, score: int) -> dict:
    from config import get_severity
    from datetime import datetime, timezone
    return {
        "score": score,
        "confidence": 0.9,
        "severity": get_severity(score),
        "reasons": [f"Demo reason for {detector}"],
        "triggered_rules": [f"RULE_{detector.upper()}_TEST"],
        "detector": detector,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


DEMO_ENTITY = {
    "email": "victim@example.kz",
    "phone": "+77001234567",
    "ip": "185.220.101.45",
    "device": "unknown-android",
}


def test_full_demo_scenario_matches_sms_blaster_pattern():
    detector_results = {
        "phishing": _make_result("phishing", 95),
        "leak": _make_result("leak", 88),
        "anomaly": _make_result("anomaly", 91),
        "deepfake": _make_result("deepfake", 87),
        "network": _make_result("network", 80),
        "logs": _make_result("logs", 82),
    }
    result = correlate(detector_results, DEMO_ENTITY)
    assert result["is_coordinated"] is True
    assert result["signal_count"] == 6
    assert result["pattern_count"] >= 1
    assert result["max_risk_boost"] > 0


def test_no_signals_no_pattern():
    detector_results = {
        "phishing": _make_result("phishing", 10),
        "leak": _make_result("leak", 5),
    }
    result = correlate(detector_results, DEMO_ENTITY)
    assert result["is_coordinated"] is False
    assert result["signal_count"] == 0


def test_partial_signals_account_takeover():
    detector_results = {
        "leak": _make_result("leak", 85),
        "anomaly": _make_result("anomaly", 90),
        "logs": _make_result("logs", 80),
    }
    result = correlate(detector_results, DEMO_ENTITY)
    assert result["is_coordinated"] is True
    pattern_names = [p["name"] for p in result["matched_patterns"]]
    assert any("Account Takeover" in name for name in pattern_names)


def test_ip_convergence_detected():
    detector_results = {
        "anomaly": {
            "score": 91,
            "confidence": 0.9,
            "severity": "Critical",
            "reasons": ["Login from 185.220.101.45 is a known Tor exit node"],
            "triggered_rules": ["RULE_KNOWN_BAD_IP"],
            "detector": "anomaly",
            "timestamp": "2024-06-15T03:14:00+00:00",
        },
        "network": {
            "score": 80,
            "confidence": 0.87,
            "severity": "Critical",
            "reasons": ["Outbound traffic to known bad IP: 185.220.101.45"],
            "triggered_rules": ["RULE_KNOWN_BAD_IP_DESTINATION"],
            "detector": "network",
            "timestamp": "2024-06-15T03:17:00+00:00",
        },
    }
    result = correlate(detector_results, DEMO_ENTITY)
    assert result["ip_convergence"] is True


def test_active_signals_list_correct():
    detector_results = {
        "phishing": _make_result("phishing", 95),
        "leak": _make_result("leak", 20),
        "anomaly": _make_result("anomaly", 55),
    }
    result = correlate(detector_results, DEMO_ENTITY)
    assert "phishing" in result["active_signals"]
    assert "anomaly" in result["active_signals"]
    assert "leak" not in result["active_signals"]
