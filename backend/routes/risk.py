from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import math

router = APIRouter()


# ================= REQUEST MODEL =================
class RiskRequest(BaseModel):
    income: float = Field(..., gt=0)
    loan_amount: float = Field(..., gt=0)
    age: int = Field(..., ge=18, le=75)
    credit_score: int = Field(..., ge=300, le=900)
    existing_emis: float = Field(..., ge=0)


# ================= CORE AI SCORING ENGINE =================
def calculate_risk_score(data: RiskRequest) -> float:
    income_to_loan_ratio = data.income / data.loan_amount
    emi_ratio = data.existing_emis / data.income

    credit_component = (data.credit_score - 300) / 600
    income_component = min(income_to_loan_ratio / 5, 1)
    emi_component = 1 - min(emi_ratio, 1)

    age_factor = math.exp(-((data.age - 40) ** 2) / 200)

    score = (
        0.35 * credit_component +
        0.25 * income_component +
        0.20 * emi_component +
        0.20 * age_factor
    )

    return round(max(0, min(score * 100, 100)), 2)


def classify_risk(score: float) -> str:
    if score >= 70:
        return "Low"
    elif score >= 40:
        return "Medium"
    return "High"


def approval_probability(score: float) -> float:
    prob = 1 / (1 + math.exp(-(score - 60) / 10))
    return round(prob * 100, 2)


# ================= ROOT ENDPOINT FOR UI =================
@router.get("/")
def risk_root():
    """
    MUST match React Risk.tsx structure
    """

    applicants = [
        {
            "name": "Rahul Sharma",
            "pan": "ABCDE1234F",
            "credit": 720,
            "foir": "32%",
            "risk": 78,
            "category": "Low",
            "decision": "Approve",
        },
        {
            "name": "Priya Verma",
            "pan": "PQRSV5678K",
            "credit": 640,
            "foir": "48%",
            "risk": 55,
            "category": "Medium",
            "decision": "Conditional",
        },
        {
            "name": "Amit Das",
            "pan": "LMNOP4321Z",
            "credit": 580,
            "foir": "62%",
            "risk": 35,
            "category": "High",
            "decision": "Reject",
        },
    ]

    return {
        "average_risk": 64,
        "distribution": {
            "low": 1,
            "medium": 1,
            "high": 1,
        },
        "applicants": applicants,
    }


# ================= ANALYZE API =================
@router.post("/analyze")
def analyze_risk(payload: RiskRequest):
    try:
        score = calculate_risk_score(payload)
        category = classify_risk(score)
        probability = approval_probability(score)

        if probability >= 75:
            decision = "Approve"
        elif probability >= 50:
            decision = "Conditional"
        else:
            decision = "Reject"

        return {
            "risk_score": score,
            "category": category,
            "approval_probability": probability,
            "decision": decision,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ================= DEMO =================
@router.get("/demo")
def demo_risk():
    sample = RiskRequest(
        income=85000,
        loan_amount=2500000,
        age=35,
        credit_score=720,
        existing_emis=12000,
    )
    return analyze_risk(sample)
