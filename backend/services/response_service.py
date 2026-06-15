import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from models.response_action import ResponseAction


ACTION_DESCRIPTIONS = {
    "block_ip": "Block suspicious IP address at firewall level",
    "freeze_account": "Freeze user account to prevent further access",
    "force_password_reset": "Force immediate password reset for compromised account",
    "flag_transaction": "Flag all recent transactions for manual fraud review",
    "notify_analyst": "Send priority alert to on-duty AFM fraud analyst",
    "create_ticket": "Create investigation ticket with full evidence package",
    "escalate": "Escalate incident to AFM Financial Intelligence Unit",
}


def trigger_action(db: Session, incident_id: str, action_type: str, target: str = "") -> dict:
    action_id = f"ACT-{str(uuid.uuid4())[:8].upper()}"
    description = ACTION_DESCRIPTIONS.get(action_type, f"Execute action: {action_type}")

    if target:
        description = f"{description} — Target: {target}"

    result_payload = _simulate_action(action_type, target)

    db_action = ResponseAction(
        id=action_id,
        incident_id=incident_id,
        action_type=action_type,
        description=description,
        executed=True,
        result=result_payload,
        created_at=datetime.now(timezone.utc),
    )
    db.add(db_action)
    db.commit()
    db.refresh(db_action)

    return {
        "id": db_action.id,
        "incident_id": db_action.incident_id,
        "action_type": db_action.action_type,
        "description": db_action.description,
        "executed": db_action.executed,
        "result": db_action.result,
        "created_at": db_action.created_at.isoformat(),
    }


def get_actions_for_incident(db: Session, incident_id: str) -> list[dict]:
    actions = (
        db.query(ResponseAction)
        .filter(ResponseAction.incident_id == incident_id)
        .order_by(ResponseAction.created_at.desc())
        .all()
    )
    return [
        {
            "id": a.id,
            "incident_id": a.incident_id,
            "action_type": a.action_type,
            "description": a.description,
            "executed": a.executed,
            "result": a.result,
            "created_at": a.created_at.isoformat(),
        }
        for a in actions
    ]


def _simulate_action(action_type: str, target: str) -> dict:
    simulations = {
        "block_ip": {
            "status": "success",
            "message": f"IP {target or 'unknown'} added to firewall blocklist",
            "firewall_rule_id": f"FW-{str(uuid.uuid4())[:6].upper()}",
        },
        "freeze_account": {
            "status": "success",
            "message": f"Account {target or 'unknown'} frozen — all sessions terminated",
            "freeze_reference": f"FRZ-{str(uuid.uuid4())[:6].upper()}",
        },
        "force_password_reset": {
            "status": "success",
            "message": f"Password reset email sent to {target or 'account'}",
            "reset_token_expires": "24 hours",
        },
        "flag_transaction": {
            "status": "success",
            "message": "Transactions flagged for manual review",
            "flagged_count": 3,
        },
        "notify_analyst": {
            "status": "success",
            "message": "Priority alert sent to AFM fraud analyst on duty",
            "notification_channel": "SMS + Email",
        },
        "create_ticket": {
            "status": "success",
            "message": "Investigation ticket created",
            "ticket_id": f"TKT-{str(uuid.uuid4())[:8].upper()}",
        },
        "escalate": {
            "status": "success",
            "message": "Incident escalated to AFM Financial Intelligence Unit",
            "escalation_ref": f"ESC-{str(uuid.uuid4())[:8].upper()}",
        },
    }
    return simulations.get(action_type, {"status": "success", "message": "Action executed"})
