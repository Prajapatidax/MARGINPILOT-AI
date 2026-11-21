from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from app.db.session import get_db
from app.api.deps import get_tenant_context, require_roles
from app.core.tenant import TenantContext
from app.models.membership import OrganizationRole
from app.models.copilot import AIConversation, AIMessage
from app.schemas.copilot import (
    ChatMessageRequest,
    AIMessageResponse,
    ConversationResponse,
    ConversationSummary
)
from app.services.copilot_service import execute_grounded_copilot_turn

router = APIRouter()

@router.get("/conversations", response_model=List[ConversationSummary])
def list_conversations(
    db: Session = Depends(get_db),
    tenant: TenantContext = Depends(get_tenant_context)
):
    """Retrieve all advisory sessions for current user in the active organization."""
    conversations = db.execute(
        select(AIConversation)
        .where(
            AIConversation.organization_id == tenant.organization_id,
            AIConversation.user_id == tenant.user_id
        )
        .order_by(desc(AIConversation.updated_at))
    ).scalars().all()

    result = []
    for conv in conversations:
        msg_count = len(conv.messages) if conv.messages else 0
        result.append(ConversationSummary(
            id=conv.id,
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            message_count=msg_count
        ))
    return result

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation_history(
    conversation_id: str,
    db: Session = Depends(get_db),
    tenant: TenantContext = Depends(get_tenant_context)
):
    """Retrieve full message history, inline charts, and grounding sources for a conversation."""
    conversation = db.execute(
        select(AIConversation)
        .where(
            AIConversation.id == conversation_id,
            AIConversation.organization_id == tenant.organization_id
        )
    ).scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation session not found")

    messages = db.execute(
        select(AIMessage)
        .where(AIMessage.conversation_id == conversation.id)
        .order_by(AIMessage.created_at)
    ).scalars().all()

    return ConversationResponse(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        messages=[
            AIMessageResponse(
                id=m.id,
                conversation_id=m.conversation_id,
                role=m.role,
                content=m.content,
                tool_calls=m.tool_calls,
                chart_data=m.chart_data,
                grounding_sources=m.grounding_sources,
                created_at=m.created_at
            )
            for m in messages
        ]
    )

@router.post("/chat", response_model=AIMessageResponse)
def send_chat_message(
    request: ChatMessageRequest,
    db: Session = Depends(get_db),
    tenant: TenantContext = Depends(get_tenant_context)
):
    """
    Submits a natural language query to the AI Copilot.
    Executes real database tools with tenant isolation and returns verified answers with inline charts.
    """
    if not request.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be blank")

    conv, assistant_msg = execute_grounded_copilot_turn(
        db=db,
        org_id=tenant.organization_id,
        user_id=tenant.user_id,
        user_prompt=request.message,
        conversation_id=request.conversation_id
    )

    return AIMessageResponse(
        id=assistant_msg.id,
        conversation_id=assistant_msg.conversation_id,
        role=assistant_msg.role,
        content=assistant_msg.content,
        tool_calls=assistant_msg.tool_calls,
        chart_data=assistant_msg.chart_data,
        grounding_sources=assistant_msg.grounding_sources,
        created_at=assistant_msg.created_at
    )

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    tenant: TenantContext = Depends(get_tenant_context)
):
    """Deletes an advisory session."""
    conversation = db.execute(
        select(AIConversation)
        .where(
            AIConversation.id == conversation_id,
            AIConversation.organization_id == tenant.organization_id
        )
    ).scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    db.delete(conversation)
    db.commit()
    return {"status": "SUCCESS", "message": "Conversation session deleted"}
