from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_pipeline():
    return {
        "stages": {
            "Lead Intake": 4,
            "Documents": 2,
            "ML Review": 2,
            "Approved": 2,
            "Rejected": 2,
            "Disbursed": 0,
        },
        "applications": [
            {
                "name": "Priya Patel",
                "credit": 742,
                "pan": "BXKPP4521A",
                "salary": "₹95,000",
                "foir": "16%",
                "risk": 72,
                "decision": None,
                "status": "Under Review",
            },
            {
                "name": "Sneha Reddy",
                "credit": 780,
                "pan": "CVLSR8634K",
                "salary": "₹78,000",
                "foir": "10%",
                "risk": 85,
                "decision": "Approve",
                "status": "Approved",
            },
            {
                "name": "Vikram Desai",
                "credit": 810,
                "pan": "AHJPD6677M",
                "salary": "₹3,20,000",
                "foir": "14%",
                "risk": 91,
                "decision": "Approve",
                "status": "Approved",
            },
            {
                "name": "Anjali Mehta",
                "credit": 580,
                "pan": "DMMPM3345L",
                "salary": "₹45,000",
                "foir": "49%",
                "risk": 28,
                "decision": "Reject",
                "status": "Rejected",
            },
            {
                "name": "Ravi Kumar Sharma",
                "credit": 720,
                "pan": "AEXPS7823N",
                "salary": "₹1,25,000",
                "foir": "14%",
                "risk": 74,
                "decision": None,
                "status": "Docs Pending",
            },
            {
                "name": "Rajesh Iyer",
                "credit": 695,
                "pan": "BKKRT9912H",
                "salary": "₹1,55,000",
                "foir": "16%",
                "risk": 62,
                "decision": None,
                "status": "Docs Pending",
            },
            {
                "name": "Deepika Nair",
                "credit": 755,
                "pan": "CANDN5567P",
                "salary": "₹1,85,000",
                "foir": "6%",
                "risk": 81,
                "decision": None,
                "status": "Under Review",
            },
        ],
    }
