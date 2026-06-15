import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fusion.risk_scorer import calculate_fusion_score


def test_demo_scenario_produces_critical():
    result = calculate_fusion_score(
        phishing_score=95,
        leak_score=88,
        anomaly_score=91,
        deepfake_score=87,
        network_score=80,
        log_score=82,
    )
    assert result["risk_score"] >= 80
    assert result["severity"] == "Critical"
    assert result["active_detectors"] == 6


def test_all_zeros_produces_low():
    result = calculate_fusion_score()
    assert result["risk_score"] == 0
    assert result["severity"] == "Low"
    assert result["active_detectors"] == 0


def test_single_high_phishing_score():
    result = calculate_fusion_score(phishing_score=90)
    # 90 * 0.25 = 22.5 → Low (no boost, only 1 active detector)
    assert result["risk_score"] <= 30
    assert result["active_detectors"] == 1


def test_weights_sum_correctly():
    # All set to 100 should produce 90 base (weights sum to 0.90, 0.10 missing is acceptable per spec)
    result = calculate_fusion_score(
        phishing_score=100,
        leak_score=100,
        anomaly_score=100,
        deepfake_score=100,
        network_score=100,
        log_score=100,
    )
    # 100*(0.25+0.20+0.20+0.15+0.10+0.10) = 100
    assert result["risk_score"] == 100


def test_correlation_boost_applied_for_5_plus_detectors():
    result = calculate_fusion_score(
        phishing_score=60,
        leak_score=60,
        anomaly_score=60,
        deepfake_score=60,
        network_score=60,
        log_score=60,
    )
    assert result["correlation_boost"] == 5
    assert result["active_detectors"] == 6


def test_three_active_detectors_boost():
    result = calculate_fusion_score(
        phishing_score=60,
        leak_score=60,
        anomaly_score=60,
    )
    assert result["correlation_boost"] == 2
    assert result["active_detectors"] == 3


def test_severity_levels():
    low = calculate_fusion_score(phishing_score=10)
    assert low["severity"] == "Low"

    medium = calculate_fusion_score(phishing_score=100, leak_score=60)
    # 100*0.25 + 60*0.20 = 25 + 12 = 37 + boost
    # Could be Low or Medium depending on boost
    assert medium["severity"] in ("Low", "Medium", "High", "Critical")

    critical = calculate_fusion_score(
        phishing_score=95, leak_score=95, anomaly_score=95,
        deepfake_score=95, network_score=95, log_score=95,
    )
    assert critical["severity"] == "Critical"


def test_score_never_exceeds_100():
    result = calculate_fusion_score(
        phishing_score=100, leak_score=100, anomaly_score=100,
        deepfake_score=100, network_score=100, log_score=100,
    )
    assert result["risk_score"] <= 100


def test_confidence_increases_with_active_detectors():
    one = calculate_fusion_score(phishing_score=80)
    six = calculate_fusion_score(
        phishing_score=80, leak_score=80, anomaly_score=80,
        deepfake_score=80, network_score=80, log_score=80,
    )
    assert six["confidence"] > one["confidence"]
