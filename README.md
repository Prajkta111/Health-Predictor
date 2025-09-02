# Health Predictor ML Integration

A simple integration of ML models with Next.js frontend using ONNX runtime with Python fallback, plus optional authentication for enhanced features.

## 🚀 Quick Start

### Option 1: ONNX Runtime (Recommended)

The API tries to use ONNX models directly in Next.js first:

```bash
cd web
npm install
npm run dev
```

### Option 2: Python Fallback Service

If ONNX fails, the system automatically falls back to a Python microservice:

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the Python service (runs on port 5001)
python ml_service.py

# In another terminal, start Next.js
cd web
npm run dev
```

## 🔐 Authentication (Optional)

- **Predictions work freely** without authentication
- **Sign in/up** available for saving history and pro features
- **Beautiful UI** with isolated auth pages
- **NextAuth.js** with JWT sessions

Visit `/login` or `/signup` to create an account, or continue as a guest.

## 📊 Available Models

1. **Diabetes** (`diabetes`) - 8 features
2. **Heart Disease** (`heart`) - 13 features  
3. **Parkinson's** (`parkinsons`) - 22 features
4. **General Disease** (`decision_tree`) - 404+ symptoms

## 🔧 API Usage

### Endpoint: `POST /api/predict`

```typescript
// Example: Diabetes prediction
const response = await fetch('/api/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'diabetes',
    data: {
      pregnancies: 1,
      glucose: 89,
      blood_pressure: 66,
      skin_thickness: 23,
      insulin: 94,
      bmi: 28.1,
      diabetes_pedigree_function: 0.167,
      age: 21
    }
  })
});

const result = await response.json();
// Returns: { model, prediction, probabilities, confidence, timestamp, source }
```

### Endpoint: `GET /api/predict`

Get available models and their features:

```typescript
const models = await fetch('/api/predict').then(r => r.json());
console.log(models.availableModels);
```

## 🏥 Model Details

### Diabetes Model
Features: `pregnancies`, `glucose`, `blood_pressure`, `skin_thickness`, `insulin`, `bmi`, `diabetes_pedigree_function`, `age`

### Heart Disease Model  
Features: `age`, `sex`, `cp`, `trestbps`, `chol`, `fbs`, `restecg`, `thalach`, `exang`, `oldpeak`, `slope`, `ca`, `thal`

### Parkinson's Model
Features: `mdvp_fo_hz`, `mdvp_fhi_hz`, `mdvp_flo_hz`, `mdvp_jitter_percent`, etc. (22 total)

### General Disease Model
Input: `{ symptoms: ["fever", "cough", "headache"] }`
Available symptoms: 400+ medical symptoms

## 🔄 Fallback Mechanism

1. **Primary**: ONNX runtime in Next.js (faster, no external dependencies)
2. **Fallback**: Python microservice (more reliable, full scikit-learn support)

The API automatically switches to Python service if ONNX fails.

## 📁 File Structure

```
web/
├── app/api/predict/route.ts    # Main API endpoint
├── models/                     # ONNX model files
│   ├── diabetes.onnx
│   ├── heart.onnx
│   ├── parkinsons.onnx
│   ├── decision_tree.onnx
│   └── models_manifest.json
└── lib/ml-api-examples.ts      # Usage examples

ml_service.py                   # Python fallback service
requirements.txt                # Python dependencies
```

## 🧪 Testing

Check if models are working:

```bash
# Test ONNX API
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"model":"diabetes","data":{"pregnancies":1,"glucose":89,"blood_pressure":66,"skin_thickness":23,"insulin":94,"bmi":28.1,"diabetes_pedigree_function":0.167,"age":21}}'

# Test Python service directly  
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"model":"diabetes","data":{"pregnancies":1,"glucose":89,"blood_pressure":66,"skin_thickness":23,"insulin":94,"bmi":28.1,"diabetes_pedigree_function":0.167,"age":21}}'
```

## 🔧 Environment Variables

Optional configuration:

```bash
# .env.local
PYTHON_SERVICE_URL=http://localhost:5001  # Python service URL
```

## ➕ Adding New Models

1. Train and save your model as `.pkl` or `.sav` in `Datasets/`
2. Add model path to `ML/export_onnx.py` 
3. Export to ONNX: `python ML/export_onnx.py --model your_model --out web/models/your_model.onnx`
4. Add feature mapping to API route
5. Update Python service with model path

The system is designed to be easily extensible for new disease prediction models.

## 🐛 Troubleshooting

- **ONNX fails**: Check browser console, fallback to Python service should be automatic
- **Python service fails**: Ensure `pip install -r requirements.txt` and correct model paths
- **Model not found**: Check `web/models/models_manifest.json` and model files exist
- **Feature mismatch**: Verify input data matches expected feature names/count
