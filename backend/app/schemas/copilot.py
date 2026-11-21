from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

class ChatMessageRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class AIMessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    tool_calls: Optional[List[Dict[str, Any]]] = None
    chart_data: Optional[Dict[str, Any]] = None
    grounding_sources: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    messages: List[AIMessageResponse]

    model_config = ConfigDict(from_attributes=True)

class ConversationSummary(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int

    model_config = ConfigDict(from_attributes=True)
