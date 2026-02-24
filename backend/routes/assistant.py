from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import Dict
import json
import uuid
import os

from routes.risk import analyze_risk, RiskRequest

router = APIRouter()

CHAT_FILE = "chat_store.json"


# ---------- helpers ----------
def load_chats() -> Dict:
    if not os.path.exists(CHAT_FILE):
        return {}
    with open(CHAT_FILE, "r") as f:
        return json.load(f)


def save_chats(data: Dict):
    with open(CHAT_FILE, "w") as f:
        json.dump(data, f, indent=2)


# ---------- simple offline AI ----------
def detect_intent(text: str) -> str:
    t = text.lower()

    if "eligib" in t or "approve" in t:
        return "eligibility"
    if "risk" in t:
        return "risk"
    if "emi" in t:
        return "emi"
    if "document" in t or "doc" in t:
        return "documents"

    return "general"


def ask_ai(message: str) -> str:
    """
    Offline AI response generator (no OpenAI).
    """

    intent = detect_intent(message)

    if intent == "risk":
        return "Loan risk depends on credit score, EMI burden, income ratio, and age stability."

    if intent == "emi":
        return "Banks usually allow EMIs up to 40–50% of monthly income."

    if intent == "documents":
        return "Required documents: ID proof, address proof, income proof, bank statement, property papers."

    if intent == "eligibility":
        # demo calculation using default values
        result = analyze_risk(
            RiskRequest(
                income=90000,
                loan_amount=2500000,
                age=34,
                credit_score=720,
                existing_emis=12000,
            )
        )

        return (
            f"Approval probability is {result['approval_probability']}% "
            f"with {result['risk_level']} risk. "
            f"Recommendation: {result['recommendation']}."
        )

    return "I can help with loan eligibility, EMI limits, risk, and required documents."


# ---------- models ----------
class ChatRequest(BaseModel):
    message: str
    chat_id: str | None = None


# ---------- routes ----------
@router.get("/sessions")
def get_sessions():
    """Return list of chat sessions"""
    chats = load_chats()
    return [
        {"chat_id": cid, "title": msgs[0]["content"][:40] if msgs else "New Chat"}
        for cid, msgs in chats.items()
    ]


@router.get("/history/{chat_id}")
def get_history(chat_id: str):
    chats = load_chats()
    return chats.get(chat_id, [])


@router.post("/chat")
def chat(data: ChatRequest):
    chats = load_chats()

    # create new session if not provided
    chat_id = data.chat_id or str(uuid.uuid4())

    if chat_id not in chats:
        chats[chat_id] = []

    # store user message
    chats[chat_id].append({"role": "user", "content": data.message})

    # offline AI reply
    ai_reply = ask_ai(data.message)
    chats[chat_id].append({"role": "assistant", "content": ai_reply})

    save_chats(chats)

    return {"chat_id": chat_id, "reply": ai_reply}


@router.post("/upload/{chat_id}")
async def upload_file(chat_id: str, file: UploadFile = File(...)):
    chats = load_chats()

    if chat_id not in chats:
        chats[chat_id] = []

    chats[chat_id].append({
        "role": "system",
        "content": f"Document uploaded: {file.filename}"
    })

    save_chats(chats)

    return {"message": "Uploaded successfully"}
