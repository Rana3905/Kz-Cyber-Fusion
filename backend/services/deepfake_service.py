from detectors import deepfake_detector


def run_detection(
    call_id: str = "",
    media_type: str = "voice",
    voice_inconsistency_score: float = 0.0,
    video_artifact_score: float = 0.0,
    claimed_identity: str = "",
    duration_seconds: int = 0,
) -> dict:
    return deepfake_detector.detect(
        call_id=call_id,
        media_type=media_type,
        voice_inconsistency_score=voice_inconsistency_score,
        video_artifact_score=video_artifact_score,
        claimed_identity=claimed_identity,
        duration_seconds=duration_seconds,
    )
