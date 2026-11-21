from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy import String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), default="Business Advisory Session", nullable=False)

    messages: Mapped[List["AIMessage"]] = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan", order_by="AIMessage.created_at")

class AIMessage(Base):
    __tablename__ = "ai_messages"

    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(16), nullable=False)  # "user", "assistant", "system"
    content: Mapped[str] = mapped_column(Text, nullable=False)

    tool_calls: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)
    chart_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    grounding_sources: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)

    conversation: Mapped["AIConversation"] = relationship("AIConversation", back_populates="messages")
