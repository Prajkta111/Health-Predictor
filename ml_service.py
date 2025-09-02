#!/usr/bin/env python3
"""
Lightweight Python microservice for ML predictions
Fallback service when ONNX integration doesn't work in browser
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os
from pathlib import Path
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Base directory setup
BASE_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = BASE_DIR / 'Datasets'
SAV_DIR = DATASETS_DIR / 'sav files'
PKL_DIR = DATASETS_DIR / 'pkl'

# Model paths
MODEL_PATHS = {
    'heart': SAV_DIR / 'heart_disease_model.sav',
    'diabetes': SAV_DIR / 'diabetes_model.sav',
    'parkinsons': SAV_DIR / 'parkinsons_model.sav',
    'decision_tree': SAV_DIR / 'decision_tree_model.sav',
    'common': PKL_DIR / 'disease_prediction_model.pkl',
}

# Feature mappings
FEATURE_MAPPINGS = {
    'diabetes': [
        'pregnancies', 'glucose', 'blood_pressure', 'skin_thickness',
        'insulin', 'bmi', 'diabetes_pedigree_function', 'age'
    ],
    'heart': [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
        'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ],
    'parkinsons': [
        'mdvp_fo_hz', 'mdvp_fhi_hz', 'mdvp_flo_hz', 'mdvp_jitter_percent',
        'mdvp_jitter_abs', 'mdvp_rap', 'mdvp_ppq', 'jitter_ddp',
        'mdvp_shimmer', 'mdvp_shimmer_db', 'shimmer_apq3', 'shimmer_apq5',
        'mdvp_apq', 'shimmer_dda', 'nhr', 'hnr', 'rpde', 'dfa',
        'spread1', 'spread2', 'ppe', 'd2'
    ]
}

# Common symptoms for decision tree model
COMMON_SYMPTOMS = [
    'heberden\'s node', 'murphy\'s sign', 'stahli\'s line', 'abdomen acute',
    'abdominal bloating', 'abdominal tenderness', 'abnormal sensation',
    'abnormally hard consistency', 'abortion', 'abscess bacterial',
    'absences finding', 'achalasia', 'ache', 'adverse effect',
    'adverse reaction', 'agitation', 'air fluid level', 'alcohol binge episode',
    'alcoholic withdrawal symptoms', 'ambidexterity', 'angina pectoris',
    'anorexia', 'anosmia', 'aphagia', 'apyrexial', 'arthralgia', 'ascites',
    'asterixis', 'asthenia', 'asymptomatic', 'ataxia', 'atypia', 'aura',
    'awakening early', 'barking cough', 'bedridden', 'behavior hyperactive',
    'behavior showing increased motor activity', 'blackout', 'blanch',
    'bleeding of vagina', 'bowel sounds decreased', 'bradycardia',
    'bradykinesia', 'breakthrough pain', 'breath sounds decreased',
    'breath-holding spell', 'breech presentation', 'bruit', 'burning sensation',
    'cachexia', 'cardiomegaly', 'cardiovascular event', 'cardiovascular finding',
    'catatonia', 'catching breath', 'charleyhorse', 'chest discomfort',
    'chest tightness', 'chill', 'choke', 'cicatrisation', 'clammy skin',
    'claudication', 'clonus', 'clumsiness', 'colic abdominal',
    'consciousness clear', 'constipation', 'coordination abnormal', 'cough',
    'cushingoid facies', 'cyanosis', 'cystic lesion', 'debilitation',
    'decompensation', 'decreased body weight', 'decreased stool caliber',
    'decreased translucency', 'diarrhea', 'difficulty', 'difficulty passing urine',
    'disequilibrium', 'distended abdomen', 'distress respiratory',
    'disturbed family', 'dizziness', 'dizzy spells', 'drool', 'drowsiness',
    'dullness', 'dysarthria', 'dysdiadochokinesia', 'dysesthesia',
    'dyspareunia', 'dyspnea', 'dyspnea on exertion', 'dysuria', 'ecchymosis',
    'egophony', 'elation', 'emphysematous change', 'energy increased',
    'enuresis', 'erythema', 'estrogen use', 'excruciating pain', 'exhaustion',
    'extrapyramidal sign', 'extreme exhaustion', 'facial paresis', 'fall',
    'fatigability', 'fatigue', 'fear of falling', 'fecaluria', 'feces in rectum',
    'feeling hopeless', 'feeling strange', 'feeling suicidal', 'feels hot/feverish',
    'fever', 'flare', 'flatulence', 'floppy', 'flushing', 'focal seizures',
    'food intolerance', 'formication', 'frail', 'fremitus', 'frothy sputum',
    'gag', 'gasping for breath', 'general discomfort', 'general unsteadiness',
    'giddy mood', 'green sputum', 'groggy', 'guaiac positive', 'gurgle',
    'hacking cough', 'haemoptysis', 'haemorrhage', 'hallucinations auditory',
    'hallucinations visual', 'has religious belief', 'headache', 'heartburn',
    'heavy feeling', 'heavy legs', 'hematochezia', 'hematocrit decreased',
    'hematuria', 'heme positive', 'hemianopsia homonymous', 'hemiplegia',
    'hemodynamically stable', 'hepatomegaly', 'hepatosplenomegaly', 'hirsutism',
    'history of - blackout', 'hoard', 'hoarseness', 'homelessness',
    'homicidal thoughts', 'hot flush', 'hunger', 'hydropneumothorax',
    'hyperacusis', 'hypercapnia', 'hyperemesis', 'hyperhidrosis disorder',
    'hyperkalemia', 'hypersomnia', 'hypersomnolence', 'hypertonicity',
    'hyperventilation', 'hypesthesia', 'hypoalbuminemia', 'hypocalcemia result',
    'hypokalemia', 'hypokinesia', 'hypometabolism', 'hyponatremia',
    'hypoproteinemia', 'hypotension', 'hypothermia, natural', 'hypotonic',
    'hypoxemia', 'immobile', 'impaired cognition', 'inappropriate affect',
    'incoherent', 'indifferent mood', 'intermenstrual heavy bleeding',
    'intoxication', 'irritable mood', 'jugular venous distention',
    'labored breathing', 'lameness', 'large-for-dates fetus', 'lesion',
    'lethargy', 'lightheadedness', 'lip smacking', 'loose associations',
    'low back pain', 'lung nodule', 'macerated skin', 'macule', 'malaise',
    'mass in breast', 'mass of body structure', 'mediastinal shift',
    'mental status changes', 'metastatic lesion', 'milky', 'moan',
    'monoclonal', 'monocytosis', 'mood depressed', 'moody', 'motor retardation',
    'muscle hypotonia', 'muscle twitch', 'myalgia', 'mydriasis', 'myoclonus',
    'nasal discharge present', 'nasal flaring', 'nausea', 'nausea and vomiting',
    'neck stiffness', 'neologism', 'nervousness', 'night sweat', 'nightmare',
    'no known drug allergies', 'no status change', 'noisy respiration',
    'non-productive cough', 'nonsmoker', 'numbness', 'numbness of hand',
    'oliguria', 'orthopnea', 'orthostasis', 'out of breath', 'overweight',
    'pain', 'pain abdominal', 'pain back', 'pain chest', 'pain foot',
    'pain in lower limb', 'pain neck', 'painful swallowing', 'pallor',
    'palpitation', 'panic', 'pansystolic murmur', 'paralyse', 'paraparesis',
    'paresis', 'paresthesia', 'passed stones', 'patient non compliance',
    'pericardial friction rub', 'phonophobia', 'photophobia', 'photopsia',
    'pin-point pupils', 'pleuritic pain', 'pneumatouria', 'polydypsia',
    'polymyalgia', 'polyuria', 'poor dentition', 'poor feeding', 'posturing',
    'presence of q wave', 'pressure chest', 'primigravida', 'prodrome',
    'productive cough', 'projectile vomiting', 'prostate tender', 'prostatism',
    'proteinemia', 'pruritus', 'pulse absent', 'pustule', 'qt interval prolonged',
    'r wave feature', 'rale', 'rambling speech', 'rapid shallow breathing',
    'red blotches', 'redness', 'regurgitates after swallowing',
    'renal angle tenderness', 'rest pain', 'retch', 'retropulsion',
    'rhd positive', 'rhonchus', 'rigor - temperature-associated observation',
    'rolling of eyes', 'room spinning', 'satiety early', 'scar tissue',
    'sciatica', 'scratch marks', 'sedentary', 'seizure', 'sensory discomfort',
    'shooting pain', 'shortness of breath', 'side pain', 'sinus rhythm',
    'sleeplessness', 'sleepy', 'slowing of urinary stream', 'sneeze', 'sniffle',
    'snore', 'snuffle', 'soft tissue swelling', 'sore to touch', 'spasm',
    'speech slurred', 'splenomegaly', 'spontaneous rupture of membranes',
    'sputum purulent', 'st segment depression', 'st segment elevation',
    'stiffness', 'stinging sensation', 'stool color yellow', 'stridor',
    'stuffy nose', 'stupor', 'suicidal', 'superimposition', 'sweat',
    'sweating increased', 'swelling', 'symptom aggravating factors', 'syncope',
    'systolic ejection murmur', 'systolic murmur', 't wave inverted',
    'tachypnea', 'tenesmus', 'terrify', 'thicken', 'throat sore',
    'throbbing sensation quality', 'tinnitus', 'tired', 'titubation',
    'todd paralysis', 'tonic seizures', 'transaminitis', 'transsexual',
    'tremor', 'tremor resting', 'tumor cell invasion', 'unable to concentrate',
    'unconscious state', 'uncoordination', 'underweight', 'unhappy',
    'unresponsiveness', 'unsteady gait', 'unwell', 'urge incontinence',
    'urgency of micturition', 'urinary hesitation', 'urinoma',
    'verbal auditory hallucinations', 'verbally abusive behavior', 'vertigo',
    'vision blurred', 'vomiting', 'weepiness', 'weight gain', 'welt',
    'wheelchair bound', 'wheezing', 'withdraw', 'worry', 'yellow sputum'
]

# Cache for loaded models
loaded_models = {}

def load_model(model_key):
    """Load and cache a model"""
    if model_key in loaded_models:
        return loaded_models[model_key]
    
    model_path = MODEL_PATHS.get(model_key)
    if not model_path or not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")
    
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    
    loaded_models[model_key] = model
    logger.info(f"Loaded model: {model_key}")
    return model

def prepare_input(model_key, data):
    """Prepare input data for model prediction"""
    if model_key == 'common':
        # Handle common disease model from DiseasePredictionModel class
        model_data = loaded_models[model_key]
        feature_cols = model_data['feature_cols']
        symptoms = data.get('symptoms', [])
        
        input_vector = [0] * len(feature_cols)
        for symptom in symptoms:
            if symptom in feature_cols:
                input_vector[feature_cols.index(symptom)] = 1
        
        return np.array([input_vector])
    
    elif model_key in FEATURE_MAPPINGS:
        # Handle specific disease models
        feature_names = FEATURE_MAPPINGS[model_key]
        input_vector = []
        
        for feature_name in feature_names:
            value = data.get(feature_name, 0)
            input_vector.append(float(value))
        
        return np.array([input_vector])
    
    else:
        raise ValueError(f"Unknown model: {model_key}")

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        model_key = data.get('model')
        input_data = data.get('data', {})
        
        if not model_key:
            return jsonify({'error': 'Missing model parameter'}), 400
        
        # Load model
        model = load_model(model_key)
        
        # Prepare input
        input_array = prepare_input(model_key, input_data)
        
        # Make prediction
        if model_key == 'common':
            # Handle common disease model
            prediction = model['best_model'].predict(input_array)[0]
            
            # Get probabilities if available
            try:
                probabilities = model['best_model'].predict_proba(input_array)[0]
                confidence = float(np.max(probabilities))
            except:
                probabilities = None
                confidence = None
                
        else:
            # Handle specific disease models
            prediction = model.predict(input_array)[0]
            
            # Get probabilities if available
            try:
                probabilities = model.predict_proba(input_array)[0].tolist()
                confidence = float(np.max(probabilities))
            except:
                probabilities = None
                confidence = None
        
        response = {
            'model': model_key,
            'prediction': int(prediction) if isinstance(prediction, (int, np.integer)) else str(prediction),
            'probabilities': probabilities,
            'confidence': confidence,
            'timestamp': pd.Timestamp.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'details': str(e)
        }), 500

@app.route('/models', methods=['GET'])
def get_models():
    """Get available models and their information"""
    try:
        available_models = []
        
        for model_key, model_path in MODEL_PATHS.items():
            if model_path.exists():
                model_info = {
                    'key': model_key,
                    'available': True,
                    'features': FEATURE_MAPPINGS.get(model_key, COMMON_SYMPTOMS if model_key == 'common' else None)
                }
                available_models.append(model_info)
        
        return jsonify({
            'available_models': available_models,
            'endpoints': {
                'predict': 'POST /predict',
                'models': 'GET /models'
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting models: {str(e)}")
        return jsonify({'error': 'Failed to get models'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ML Prediction Service',
        'timestamp': pd.Timestamp.now().isoformat()
    })

if __name__ == '__main__':
    # Preload common models for faster response
    try:
        for model_key in ['common', 'diabetes', 'heart', 'parkinsons']:
            if MODEL_PATHS[model_key].exists():
                load_model(model_key)
                logger.info(f"Preloaded model: {model_key}")
    except Exception as e:
        logger.warning(f"Failed to preload some models: {e}")
    
    app.run(host='0.0.0.0', port=5001, debug=False)
