def calculate_risk(income: float, loan: float):
    if income <= 0:
        return {"risk_score": 0, "risk_level": "Invalid"}

    ratio = loan / income

    if ratio < 2:
        score = 80
        level = "Low"
    elif ratio < 4:
        score = 55
        level = "Medium"
    else:
        score = 25
        level = "High"

    return {"risk_score": score, "risk_level": level}
