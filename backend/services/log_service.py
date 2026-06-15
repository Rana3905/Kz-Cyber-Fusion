from detectors import log_detector


def run_detection(
    user_id: str = "",
    failed_logins: int = 0,
    time_window_seconds: int = 0,
    privilege_escalation_attempts: int = 0,
    unusual_commands: list = None,
    source_ip: str = "",
) -> dict:
    return log_detector.detect(
        user_id=user_id,
        failed_logins=failed_logins,
        time_window_seconds=time_window_seconds,
        privilege_escalation_attempts=privilege_escalation_attempts,
        unusual_commands=unusual_commands or [],
        source_ip=source_ip,
    )
