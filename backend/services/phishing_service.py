from detectors import phishing_detector


def run_detection(message: str = "", url: str = "", sender: str = "", channel: str = "sms") -> dict:
    return phishing_detector.detect(message=message, url=url, sender=sender, channel=channel)
