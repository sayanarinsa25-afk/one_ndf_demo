from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_dashboard():
    return {
        "stats": {
            "total_leads": 13,
            "applications": 8,
            "approval_rate": 25,
            "avg_risk_score": 64,
        },
        "trend": [
            {"week": "W1", "leads": 4, "applications": 2},
            {"week": "W2", "leads": 7, "applications": 3},
            {"week": "W3", "leads": 9, "applications": 5},
            {"week": "W4", "leads": 11, "applications": 6},
            {"week": "Now", "leads": 13, "applications": 8},
        ],
        "risk_distribution": {"low": 6, "medium": 3, "high": 4},
        "pipeline_value": "₹5.5Cr",
        "approved": 2,
        "rejected": 2,
        "recent_leads": [
            {"name": "YOGANA", "amount": "₹5,000", "type": "construction", "score": 70, "status": "Lead"},
            {"name": "Priya Patel", "amount": "₹32,00,000", "type": "home purchase", "score": 75, "status": "Under Review"},
            {"name": "Amit Singh Chauhan", "amount": "₹75,00,000", "type": "construction", "score": 68, "status": "Lead"},
            {"name": "Sneha Reddy", "amount": "₹28,00,000", "type": "renovation", "score": 71, "status": "Approved"},
        ],
        "pipeline_summary": {
            "Lead": 4,
            "Docs Pending": 5,
            "Under Review": 2,
            "Approved": 2,
            "Rejected": 2,
        },
        "ai_prediction": {
            "approval_probability": 0.78,
            "risk": "Moderate",
            "recommendation": "Approve with Conditions",
        },
    }
