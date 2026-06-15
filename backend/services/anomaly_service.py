from detectors import anomaly_detector


def run_detection(
    email: str = "",
    ip_address: str = "",
    country: str = "",
    previous_country: str = "",
    device_id: str = "",
    login_time: str = "",
    previous_ip: str = "",
) -> dict:
    return anomaly_detector.detect(
        email=email,
        ip_address=ip_address,
        country=country,
        previous_country=previous_country,
        device_id=device_id,
        login_time=login_time,
        previous_ip=previous_ip,
    )
