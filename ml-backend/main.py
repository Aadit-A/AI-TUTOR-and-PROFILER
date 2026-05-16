from fastapi import FastAPI
from pydantic import BaseModel

import joblib
import os

# ---------------------------------------------------
# FASTAPI APP
# ---------------------------------------------------

app = FastAPI()

# ---------------------------------------------------
# LOAD MODEL FILES
# ---------------------------------------------------

BASE_DIR = os.path.dirname(__file__)

MODEL_DIR = os.path.join(BASE_DIR, "ml")

model = joblib.load(
    os.path.join(MODEL_DIR, "model.pkl")
)

vectorizer = joblib.load(
    os.path.join(MODEL_DIR, "vectorizer.pkl")
)

mlb = joblib.load(
    os.path.join(MODEL_DIR, "labels.pkl")
)

print("ML model loaded successfully")

# ---------------------------------------------------
# REQUEST BODY
# ---------------------------------------------------

class QueryRequest(BaseModel):

    query: str

# ---------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------

@app.get("/")

def home():

    return {
        "message": "ML Backend Running"
    }

# ---------------------------------------------------
# PREDICT ROUTE
# ---------------------------------------------------

@app.post("/predict")

def predict_tags(data: QueryRequest):

    text = data.query

    text_lower = text.lower()

   

    # ---------------------------------------------------
    # VECTORIZE
    # ---------------------------------------------------

    X_test = vectorizer.transform([text])

    # ---------------------------------------------------
    # PREDICT
    # ---------------------------------------------------

    probabilities = model.predict_proba(X_test)[0]

    threshold = 0.25

    predicted_tags = []

    for i, prob in enumerate(probabilities):

        if prob >= threshold:

            predicted_tags.append(
                mlb.classes_[i]
            )

    return {
        "tags": predicted_tags
    }