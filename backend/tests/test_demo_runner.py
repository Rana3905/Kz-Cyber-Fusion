import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from demo.demo_runner import run_demo


def test_demo_runs_without_error():
    result = run_demo()
    assert result is not None
    assert "steps" in result
    assert "incident" in result
    assert "evidence" in result


def test_demo_produces_7_steps():
    result = run_demo()
    assert len(result["steps"]) == 7


def test_demo_step_detectors_present():
    result = run_demo()
    detectors_seen = [s["detector"] for s in result["steps"]]
    for expected in ["phishing", "leak", "anomaly", "deepfake", "network", "logs", "fusion"]:
        assert expected in detectors_seen


def test_demo_phishing_score_is_95():
    result = run_demo()
    phishing_step = next(s for s in result["steps"] if s["detector"] == "phishing")
    assert phishing_step["result"]["score"] == 95


def test_demo_leak_score_is_88():
    result = run_demo()
    leak_step = next(s for s in result["steps"] if s["detector"] == "leak")
    assert leak_step["result"]["score"] == 88


def test_demo_anomaly_score_is_91():
    result = run_demo()
    anomaly_step = next(s for s in result["steps"] if s["detector"] == "anomaly")
    assert anomaly_step["result"]["score"] == 91


def test_demo_deepfake_score_is_87():
    result = run_demo()
    deepfake_step = next(s for s in result["steps"] if s["detector"] == "deepfake")
    assert deepfake_step["result"]["score"] == 87


def test_demo_network_score_is_80():
    result = run_demo()
    network_step = next(s for s in result["steps"] if s["detector"] == "network")
    assert network_step["result"]["score"] == 80


def test_demo_log_score_is_82():
    result = run_demo()
    logs_step = next(s for s in result["steps"] if s["detector"] == "logs")
    assert logs_step["result"]["score"] == 82


def test_demo_final_incident_critical_97():
    result = run_demo()
    incident = result["incident"]
    assert incident["risk_score"] == 97
    assert incident["severity"] == "Critical"
    assert incident["confidence"] == 0.95


def test_demo_incident_id_is_kcf_001():
    result = run_demo()
    assert result["incident"]["id"] == "KCF-001"


def test_demo_evidence_package_present():
    result = run_demo()
    evidence = result["evidence"]
    assert "id" in evidence
    assert evidence["incident_id"] == "KCF-001"
    assert "summary" in evidence
    assert "timeline" in evidence
    assert "recommended_actions" in evidence


def test_demo_scenario_name_correct():
    result = run_demo()
    assert "SMS Blaster" in result["scenario"] or "Kazakhstan" in result["scenario"]


def test_demo_completed_at_present():
    result = run_demo()
    assert "completed_at" in result
    assert result["completed_at"]
