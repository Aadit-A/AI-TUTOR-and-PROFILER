import json
import os
import joblib

# ---------------------------------------------------
# LOAD MODEL FILES
# ---------------------------------------------------

BASE_DIR = os.path.dirname(__file__)

MODEL_DIR = os.path.join(
    os.path.dirname(BASE_DIR),
    "ml"
)

model = joblib.load(
    os.path.join(MODEL_DIR, "model.pkl")
)

vectorizer = joblib.load(
    os.path.join(MODEL_DIR, "vectorizer.pkl")
)

mlb = joblib.load(
    os.path.join(MODEL_DIR, "labels.pkl")
)

# ---------------------------------------------------
# VERCEL HANDLER
# ---------------------------------------------------

def handler(request):

    try:

        body = request.get_json()

        text = body.get("query", "")

        text_lower = text.lower()

      

        # ---------------------------------------------------
        # VECTORIZE
        # ---------------------------------------------------

        X_test = vectorizer.transform([text])

        probabilities = model.predict_proba(X_test)[0]

        threshold = 0.35

        predicted_tags = []

        for i, prob in enumerate(probabilities):

            if prob >= threshold:
                predicted_tags.append(
                    mlb.classes_[i]
                )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "tags": predicted_tags
            })
        }

    except Exception as e:

        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            })
        }