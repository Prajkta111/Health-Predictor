import pandas as pd
import numpy as np
import pickle
import os
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

class DiseasePredictionModel:
    def __init__(self):
        self.dt_model = None
        self.nb_model = None
        self.rf_model = None
        self.gb_model = None
        self.svm_model = None
        self.lr_model = None
        self.ensemble_model = None
        self.scaler = None
        self.feature_cols = None
        self.diseases = None
        self.best_model = None
        self.best_accuracy = 0
        
    def load_data(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        data_path = os.path.join(base_dir, '..', 'Datasets', 'common Pivoted.csv')
        df_pivoted = pd.read_csv(data_path)
        
        if 'Unnamed: 0' in df_pivoted.columns:
            df_pivoted = df_pivoted.drop('Unnamed: 0', axis=1)
        
        self.feature_cols = [col for col in df_pivoted.columns if col != 'Source']
        x = df_pivoted[self.feature_cols]
        y = df_pivoted['Source']
        
        return x, y
    
    def train_models(self):
        x, y = self.load_data()
        
        # Scale features for models that benefit from it
        self.scaler = StandardScaler()
        x_scaled = self.scaler.fit_transform(x)
        
        models = {}
        
        # Decision Tree with optimized parameters
        self.dt_model = DecisionTreeClassifier(
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )
        self.dt_model.fit(x, y)
        dt_accuracy = self.dt_model.score(x, y)
        models['Decision Tree'] = (self.dt_model, dt_accuracy, x)
        
        # Multinomial Naive Bayes
        self.nb_model = MultinomialNB(alpha=0.1)
        self.nb_model.fit(x, y)
        nb_accuracy = self.nb_model.score(x, y)
        models['Naive Bayes'] = (self.nb_model, nb_accuracy, x)
        
        # Random Forest
        self.rf_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=15,
            min_samples_split=5,
            random_state=42
        )
        self.rf_model.fit(x, y)
        rf_accuracy = self.rf_model.score(x, y)
        models['Random Forest'] = (self.rf_model, rf_accuracy, x)
        
        # Gradient Boosting
        self.gb_model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        self.gb_model.fit(x, y)
        gb_accuracy = self.gb_model.score(x, y)
        models['Gradient Boosting'] = (self.gb_model, gb_accuracy, x)
        
        # SVM
        self.svm_model = SVC(
            kernel='rbf',
            C=1.0,
            probability=True,
            random_state=42
        )
        self.svm_model.fit(x_scaled, y)
        svm_accuracy = self.svm_model.score(x_scaled, y)
        models['SVM'] = (self.svm_model, svm_accuracy, x_scaled)
        
        # Logistic Regression
        self.lr_model = LogisticRegression(
            max_iter=1000,
            random_state=42
        )
        self.lr_model.fit(x_scaled, y)
        lr_accuracy = self.lr_model.score(x_scaled, y)
        models['Logistic Regression'] = (self.lr_model, lr_accuracy, x_scaled)
        
        # Ensemble Model (Voting Classifier)
        self.ensemble_model = VotingClassifier(
            estimators=[
                ('rf', self.rf_model),
                ('gb', self.gb_model),
                ('dt', self.dt_model)
            ],
            voting='soft'
        )
        self.ensemble_model.fit(x, y)
        ensemble_accuracy = self.ensemble_model.score(x, y)
        models['Ensemble'] = (self.ensemble_model, ensemble_accuracy, x)
        
        self.diseases = self.dt_model.classes_
        
        # Find best model
        for name, (model, accuracy, _) in models.items():
            print(f"{name} Accuracy: {accuracy:.4f}")
            if accuracy > self.best_accuracy:
                self.best_accuracy = accuracy
                self.best_model = model
        
        print(f"\nBest Model Accuracy: {self.best_accuracy:.4f}")
        
        return self
    
    def predict_disease(self, symptoms, model_type='best', top_n=3):
        if self.dt_model is None:
            raise ValueError("Models not trained. Call train_models() first.")
        
        input_vector = [0] * len(self.feature_cols)
        found_symptoms = []
        
        for symptom in symptoms:
            if symptom in self.feature_cols:
                input_vector[self.feature_cols.index(symptom)] = 1
                found_symptoms.append(symptom)
        
        input_vector = np.array([input_vector])
        input_df = pd.DataFrame(input_vector, columns=self.feature_cols)
        
        # Select model based on type
        if model_type == 'best':
            model = self.best_model
            # Check if model needs scaled input
            if model in [self.svm_model, self.lr_model]:
                input_data = self.scaler.transform(input_vector)
            else:
                input_data = input_df
        elif model_type == 'ensemble':
            model = self.ensemble_model
            input_data = input_df
        elif model_type == 'random_forest':
            model = self.rf_model
            input_data = input_df
        elif model_type == 'gradient_boosting':
            model = self.gb_model
            input_data = input_df
        elif model_type == 'svm':
            model = self.svm_model
            input_data = self.scaler.transform(input_vector)
        elif model_type == 'logistic_regression':
            model = self.lr_model
            input_data = self.scaler.transform(input_vector)
        elif model_type == 'decision_tree':
            model = self.dt_model
            input_data = input_df
        else:  # naive_bayes
            model = self.nb_model
            input_data = input_df
        
        predicted_disease = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]
        
        top_indices = np.argsort(probabilities)[::-1][:top_n]
        predictions = []
        
        for i, idx in enumerate(top_indices):
            predictions.append({
                'disease': self.diseases[idx],
                'probability': probabilities[idx],
                'rank': i + 1
            })
        
        return {
            'found_symptoms': found_symptoms,
            'predictions': predictions,
            'primary_prediction': predicted_disease,
            'model_used': model_type
        }
    
    def save_model(self, filename='disease_prediction_model.pkl'):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        pkl_dir = os.path.join(base_dir, '..', 'Datasets', 'pkl')
        os.makedirs(pkl_dir, exist_ok=True)
        filepath = os.path.join(pkl_dir, filename)
        
        model_data = {
            'dt_model': self.dt_model,
            'nb_model': self.nb_model,
            'rf_model': self.rf_model,
            'gb_model': self.gb_model,
            'svm_model': self.svm_model,
            'lr_model': self.lr_model,
            'ensemble_model': self.ensemble_model,
            'best_model': self.best_model,
            'scaler': self.scaler,
            'feature_cols': self.feature_cols,
            'diseases': self.diseases,
            'best_accuracy': self.best_accuracy
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filename='disease_prediction_model.pkl'):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        pkl_dir = os.path.join(base_dir, '..', 'Datasets', 'pkl')
        filepath = os.path.join(pkl_dir, filename)
        
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        self.dt_model = model_data['dt_model']
        self.nb_model = model_data['nb_model']
        self.rf_model = model_data['rf_model']
        self.gb_model = model_data['gb_model']
        self.svm_model = model_data['svm_model']
        self.lr_model = model_data['lr_model']
        self.ensemble_model = model_data['ensemble_model']
        self.best_model = model_data['best_model']
        self.scaler = model_data['scaler']
        self.feature_cols = model_data['feature_cols']
        self.diseases = model_data['diseases']
        self.best_accuracy = model_data['best_accuracy']
        
        return self


def main(retrain_only: bool = False):
    """Train (and optionally quick test) then persist the common disease model.

    Args:
        retrain_only: if True, skip test predictions (useful for automation).
    """
    model = DiseasePredictionModel().train_models()
    if not retrain_only:
        test_symptoms = ['shortness of breath', 'cough', 'palpitation', 'chill', 'asthenia']
        best_result = model.predict_disease(test_symptoms, model_type='best')
        print(f"Symptoms included: {best_result['found_symptoms']}")
        print(f"Best Model ({best_result['model_used']}) prediction: {best_result['primary_prediction']}")
        ensemble_result = model.predict_disease(test_symptoms, model_type='ensemble')
        print(f"Ensemble prediction: {ensemble_result['primary_prediction']}")
    model.save_model()
    return 0

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Rebuild common disease prediction model")
    parser.add_argument('--retrain-only', action='store_true', help='Skip sample prediction output')
    args = parser.parse_args()
    raise SystemExit(main(retrain_only=args.retrain_only))
