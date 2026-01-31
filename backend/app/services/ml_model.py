import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import os

class SuccessModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.is_trained = False

    def train(self, profiles_data):
        print("Training Success Prediction Model using Mock Data...")
        if not profiles_data:
            print("No profiles to train on.")
            return

        df_profiles = pd.DataFrame(profiles_data)
        
        # Rule: Success if donor is O type OR same blood type, AND no severe comorbidities
        def mock_outcome(row):
            if row['role'] != 'donor': return 0
            if row['blood_type'] in ['O-', 'O+']: return 1
            if row.get('comorbidities') == 'None': return 1
            return 0

        df_train = df_profiles.copy()
        df_train['success'] = df_train.apply(mock_outcome, axis=1)
        
        features = ['age', 'urgency_score'] 
        X = df_train[features].fillna(0)
        y = df_train['success']
        
        try:
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            self.model.fit(X_train, y_train)
            acc = accuracy_score(y_test, self.model.predict(X_test))
            self.is_trained = True
            print(f"Success Model Trained. Accuracy: {acc:.2f}")
        except Exception as e:
            print(f"Model training failed: {e}")

    def predict_probability(self, donor_age, recipient_urgency):
        if not self.is_trained:
            return 0.5
        try:
            pred_input = pd.DataFrame([{
                'age': donor_age,
                'urgency_score': recipient_urgency
            }])
            return self.model.predict_proba(pred_input)[0][1]
        except Exception as e:
            print(f"Prediction error: {e}")
            return 0.5

ml_service = SuccessModel()
