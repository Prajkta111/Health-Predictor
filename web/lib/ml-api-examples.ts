/**
 * Example usage of the ML prediction API
 * This file demonstrates how to use the /api/predict endpoint
 */

// Example 1: Diabetes prediction
export async function predictDiabetes(patientData: {
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
}) {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'diabetes',
      data: patientData,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Example 2: Heart disease prediction
export async function predictHeartDisease(patientData: {
  age: number;
  sex: number; // 1 = male, 0 = female
  cp: number; // chest pain type (0-3)
  trestbps: number; // resting blood pressure
  chol: number; // cholesterol
  fbs: number; // fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
  restecg: number; // resting electrocardiographic results (0-2)
  thalach: number; // maximum heart rate achieved
  exang: number; // exercise induced angina (1 = yes, 0 = no)
  oldpeak: number; // ST depression induced by exercise
  slope: number; // slope of the peak exercise ST segment (0-2)
  ca: number; // number of major vessels colored by fluoroscopy (0-3)
  thal: number; // thalassemia (0-3)
}) {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'heart',
      data: patientData,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Example 3: Parkinson's disease prediction
export async function predictParkinsons(patientData: {
  mdvp_fo_hz: number;
  mdvp_fhi_hz: number;
  mdvp_flo_hz: number;
  mdvp_jitter_percent: number;
  mdvp_jitter_abs: number;
  mdvp_rap: number;
  mdvp_ppq: number;
  jitter_ddp: number;
  mdvp_shimmer: number;
  mdvp_shimmer_db: number;
  shimmer_apq3: number;
  shimmer_apq5: number;
  mdvp_apq: number;
  shimmer_dda: number;
  nhr: number;
  hnr: number;
  rpde: number;
  dfa: number;
  spread1: number;
  spread2: number;
  ppe: number;
  d2: number;
}) {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'parkinsons',
      data: patientData,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Example 4: General disease prediction based on symptoms
export async function predictDiseaseFromSymptoms(symptoms: string[]) {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'decision_tree',
      data: { symptoms },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Example 5: Get available models and their features
export async function getAvailableModels() {
  const response = await fetch('/api/predict', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Example usage in a React component:
/*
import { useState } from 'react';
import { predictDiabetes, predictHeartDisease, predictDiseaseFromSymptoms } from './ml-api-examples';

export default function HealthPredictor() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiabetesTest = async () => {
    setLoading(true);
    try {
      const result = await predictDiabetes({
        pregnancies: 1,
        glucose: 89,
        blood_pressure: 66,
        skin_thickness: 23,
        insulin: 94,
        bmi: 28.1,
        diabetes_pedigree_function: 0.167,
        age: 21
      });
      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHeartTest = async () => {
    setLoading(true);
    try {
      const result = await predictHeartDisease({
        age: 63,
        sex: 1,
        cp: 3,
        trestbps: 145,
        chol: 233,
        fbs: 1,
        restecg: 0,
        thalach: 150,
        exang: 0,
        oldpeak: 2.3,
        slope: 0,
        ca: 0,
        thal: 1
      });
      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomsTest = async () => {
    setLoading(true);
    try {
      const result = await predictDiseaseFromSymptoms([
        'fever', 'cough', 'shortness of breath', 'fatigue'
      ]);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Health Prediction API Demo</h1>
      
      <div className="space-y-4">
        <button 
          onClick={handleDiabetesTest}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Diabetes Prediction
        </button>
        
        <button 
          onClick={handleHeartTest}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Test Heart Disease Prediction
        </button>
        
        <button 
          onClick={handleSymptomsTest}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Symptom-based Prediction
        </button>
      </div>

      {loading && <p className="mt-4">Loading...</p>}
      
      {prediction && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Prediction Result:</h3>
          <pre className="mt-2 text-sm">
            {JSON.stringify(prediction, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
*/
