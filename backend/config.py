from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "KZ Cyber Fusion"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str = "sqlite:///./kz_cyber_fusion.db"

    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Detector fusion weights (must sum to 1.0)
    WEIGHT_PHISHING: float = 0.25
    WEIGHT_LEAK: float = 0.20
    WEIGHT_ANOMALY: float = 0.20
    WEIGHT_DEEPFAKE: float = 0.15
    WEIGHT_NETWORK: float = 0.10
    WEIGHT_LOGS: float = 0.10

    # Severity thresholds
    SEVERITY_LOW_MAX: int = 39
    SEVERITY_MEDIUM_MAX: int = 59
    SEVERITY_HIGH_MAX: int = 79
    # Critical: 80–100


settings = Settings()


def get_severity(score: int) -> str:
    if score <= settings.SEVERITY_LOW_MAX:
        return "Low"
    elif score <= settings.SEVERITY_MEDIUM_MAX:
        return "Medium"
    elif score <= settings.SEVERITY_HIGH_MAX:
        return "High"
    else:
        return "Critical"
