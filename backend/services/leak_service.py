from detectors import leak_detector


def run_detection(email: str = "", phone: str = "", username: str = "") -> dict:
    return leak_detector.detect(email=email, phone=phone, username=username)
