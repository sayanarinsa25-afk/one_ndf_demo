from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Dict, Optional
import random
import string
import uuid
import asyncio

router = APIRouter()

# ============================================================
# Helper: Generate 6-character alphanumeric Customer ID
# ============================================================
def generate_customer_id() -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


# ============================================================
# In-memory demo database (rich dataset)
# ============================================================
DOCUMENTS: List[Dict] = [
    # Sneha
    {
        "id": str(uuid.uuid4()),
        "customer_id": "SN3H4A",
        "customer_name": "Sneha Reddy",
        "name": "sneha_reddy_aadhaar.pdf",
        "type": "Aadhaar Card",
        "status": "Completed",
        "fields": 4,
    },
    {
        "id": str(uuid.uuid4()),
        "customer_id": "SN3H4A",
        "customer_name": "Sneha Reddy",
        "name": "sneha_reddy_pan.pdf",
        "type": "PAN Card",
        "status": "Completed",
        "fields": 3,
    },

    # Vikram
    {
        "id": str(uuid.uuid4()),
        "customer_id": "VK9R2M",
        "customer_name": "Vikram Desai",
        "name": "vikram_itr_2024-25.pdf",
        "type": "ITR / Tax Return",
        "status": "Completed",
        "fields": 5,
    },
    {
        "id": str(uuid.uuid4()),
        "customer_id": "VK9R2M",
        "customer_name": "Vikram Desai",
        "name": "vikram_bank_6months.pdf",
        "type": "Bank Statement",
        "status": "Completed",
        "fields": 5,
    },

    # Priya
    {
        "id": str(uuid.uuid4()),
        "customer_id": "PR1Y4P",
        "customer_name": "Priya Patel",
        "name": "priya_salary_nov2025.pdf",
        "type": "Salary Slip",
        "status": "Completed",
        "fields": 4,
    },
    {
        "id": str(uuid.uuid4()),
        "customer_id": "PR1Y4P",
        "customer_name": "Priya Patel",
        "name": "priya_pan.jpg",
        "type": "PAN Card",
        "status": "Completed",
        "fields": 3,
    },

    # Ravi (Pending)
    {
        "id": str(uuid.uuid4()),
        "customer_id": "R4V1K2",
        "customer_name": "Ravi Kumar",
        "name": "ravi_aadhaar.pdf",
        "type": "Aadhaar Card",
        "status": "Pending",
        "fields": 0,
    },
    {
        "id": str(uuid.uuid4()),
        "customer_id": "R4V1K2",
        "customer_name": "Ravi Kumar",
        "name": "ravi_salary_dec2025.pdf",
        "type": "Salary Slip",
        "status": "Pending",
        "fields": 0,
    },

    # Rajesh (Pending)
    {
        "id": str(uuid.uuid4()),
        "customer_id": "RJ5SH9",
        "customer_name": "Rajesh Verma",
        "name": "rajesh_bank_statement.pdf",
        "type": "Bank Statement",
        "status": "Pending",
        "fields": 0,
    },

    # Extra demo users
    {
        "id": str(uuid.uuid4()),
        "customer_id": "AM1T07",
        "customer_name": "Amit Sharma",
        "name": "amit_salary_oct2025.pdf",
        "type": "Salary Slip",
        "status": "Completed",
        "fields": 4,
    },
    {
        "id": str(uuid.uuid4()),
        "customer_id": "NE8H45",
        "customer_name": "Neha Gupta",
        "name": "neha_aadhaar.pdf",
        "type": "Aadhaar Card",
        "status": "Pending",
        "fields": 0,
    },
]


# ============================================================
# Async OCR Simulation (background processing like real fintech)
# ============================================================
async def simulate_ocr(doc_id: str) -> None:
    """
    Simulates OCR processing delay and auto-completion.
    """
    await asyncio.sleep(random.randint(2, 4))  # fake processing delay

    for doc in DOCUMENTS:
        if doc["id"] == doc_id:
            doc["status"] = "Completed"
            doc["fields"] = random.randint(3, 8)
            break


# ============================================================
# GET /documents/
# Returns stats + full document list
# ============================================================
@router.get("/")
def get_documents() -> Dict:
    total = len(DOCUMENTS)
    completed = sum(1 for d in DOCUMENTS if d["status"] == "Completed")
    pending = sum(1 for d in DOCUMENTS if d["status"] == "Pending")
    failed = 2  # demo constant

    return {
        "stats": {
            "total": total,
            "completed": completed,
            "pending": pending,
            "failed": failed,
        },
        "documents": DOCUMENTS,
    }


# ============================================================
# POST /documents/upload
# Upload → Pending → Background OCR → Completed
# ============================================================
@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    customer_id: Optional[str] = Form(None),
    customer_name: Optional[str] = Form(None),
    type: Optional[str] = Form("Unknown"),
) -> Dict:
    """
    Upload document and trigger async OCR simulation.
    """

    # Generate defaults if missing
    if not customer_id:
        customer_id = generate_customer_id()

    if not customer_name:
        customer_name = "Unknown Customer"

    new_doc = {
        "id": str(uuid.uuid4()),
        "customer_id": customer_id,
        "customer_name": customer_name,
        "name": file.filename,
        "type": type,
        "status": "Pending",
        "fields": 0,
    }

    DOCUMENTS.append(new_doc)

    # Launch background OCR worker (non-blocking)
    asyncio.create_task(simulate_ocr(new_doc["id"]))

    return {
        "message": "Uploaded successfully. OCR processing started.",
        "document": new_doc,
    }
