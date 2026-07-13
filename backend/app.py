import joblib
import pandas as pd

model = joblib.load("model.pkl")
encoder = joblib.load("label_encoder.pkl")
from fastapi import FastAPI

app = FastAPI(title="IDBI AI Loan Risk API")
from pydantic import BaseModel

class LoanInput(BaseModel):
    income: float
    loan_amount: float
    employment_status: str


@app.post("/predict")
def predict(data: LoanInput):
    try:
        employment = encoder.transform([data.employment_status])[0]

        sample = pd.DataFrame([{
            "income": float(data.income),
            "loan_amount": float(data.loan_amount),
            "employment_status": employment
        }])

        prediction = int(model.predict(sample)[0])
        probability = float(model.predict_proba(sample)[0][1])

        return {
            "probability": round(probability, 2),
            "risk": "HIGH" if prediction else "LOW",
            "months": 7
        }

    except Exception as e:
        import traceback
        return {
            "error": str(e),
            "trace": traceback.format_exc()
        }
@app.get("/dashboard")
def dashboard():

    return {
        "total_loans": 2000,
        "high_risk": 312,
        "medium_risk": 650,
        "low_risk": 1038
    } 
class ChatRequest(BaseModel):
    question: str


@app.post("/chat")
def chat(req: ChatRequest):

    return {
        "answer": "This applicant has a high probability of default because of low income and high loan amount."
    }
@app.get("/explain")
def explain():

    return {
        "top_features": [
            "Income",
            "Loan Amount",
            "Employment Status"
        ],
        "reason": "High loan amount compared to income."
    } 
@app.get("/alerts")
def alerts():

    return {
        "alerts": [
            "Applicant exceeds risk threshold.",
            "Recommend manual verification."
        ]
    }    