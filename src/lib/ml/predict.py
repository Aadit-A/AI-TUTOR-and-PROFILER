import sys
import json
import joblib

# ---------------------------------------------------
# LOAD FILES
# ---------------------------------------------------

model = joblib.load("src/lib/ml/model.pkl")

vectorizer = joblib.load("src/lib/ml/vectorizer.pkl")

mlb = joblib.load("src/lib/ml/labels.pkl")

# ---------------------------------------------------
# GET USER INPUT
# ---------------------------------------------------

text = sys.argv[1]

text_lower = text.lower()

# ---------------------------------------------------
# TF-IDF VECTOR
# ---------------------------------------------------

X_test = vectorizer.transform([text])

# ---------------------------------------------------
# PREDICT PROBABILITIES
# ---------------------------------------------------

probabilities = model.predict_proba(X_test)[0]

threshold = 0.35

predicted_tags = []

for i, prob in enumerate(probabilities):

    if prob >= threshold:
        predicted_tags.append(mlb.classes_[i])

# ---------------------------------------------------
# RETURN JSON
# ---------------------------------------------------

print(json.dumps(predicted_tags))