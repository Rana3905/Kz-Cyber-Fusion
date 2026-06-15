from pydantic import BaseModel


class AssistantRequest(BaseModel):
    incident_id: str
    question: str


class AssistantResponse(BaseModel):
    answer: str
    confidence: float
