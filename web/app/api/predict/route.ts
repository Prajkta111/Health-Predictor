import { NextRequest, NextResponse } from 'next/server';
import * as ort from 'onnxruntime-web';
import path from 'path';
import fs from 'fs';

// Model configurations
interface ModelConfig {
  key: string;
  file: string;
  n_features: number;
  featureNames?: string[];
}

// Load models manifest
let modelsManifest: { models: ModelConfig[] } | null = null;

function getModelsManifest() {
  if (!modelsManifest) {
    const manifestPath = path.join(process.cwd(), 'models', 'models_manifest.json');
    const manifestData = fs.readFileSync(manifestPath, 'utf-8');
    modelsManifest = JSON.parse(manifestData);
  }
  return modelsManifest;
}

// Cache for loaded ONNX sessions
const modelSessions: Map<string, ort.InferenceSession> = new Map();

async function loadModel(modelKey: string): Promise<ort.InferenceSession> {
  if (modelSessions.has(modelKey)) {
    return modelSessions.get(modelKey)!;
  }

  const manifest = getModelsManifest();
  const modelConfig = manifest?.models.find(m => m.key === modelKey);
  
  if (!modelConfig) {
    throw new Error(`Model ${modelKey} not found in manifest`);
  }

  const modelPath = path.join(process.cwd(), 'models', modelConfig.file);
  const modelBuffer = fs.readFileSync(modelPath);
  
  const session = await ort.InferenceSession.create(modelBuffer);
  modelSessions.set(modelKey, session);
  
  return session;
}

// Feature names for different models (based on your datasets)
const FEATURE_MAPPINGS: Record<string, string[]> = {
  diabetes: [
    'pregnancies', 'glucose', 'blood_pressure', 'skin_thickness',
    'insulin', 'bmi', 'diabetes_pedigree_function', 'age'
  ],
  heart: [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
  ],
  parkinsons: [
    'mdvp_fo_hz', 'mdvp_fhi_hz', 'mdvp_flo_hz', 'mdvp_jitter_percent',
    'mdvp_jitter_abs', 'mdvp_rap', 'mdvp_ppq', 'jitter_ddp',
    'mdvp_shimmer', 'mdvp_shimmer_db', 'shimmer_apq3', 'shimmer_apq5',
    'mdvp_apq', 'shimmer_dda', 'nhr', 'hnr', 'rpde', 'dfa',
    'spread1', 'spread2', 'ppe', 'd2'
  ]
};

// Common disease symptoms (from your common.py file)
const COMMON_SYMPTOMS = [
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
];

// Prepare input for specific model types
function prepareModelInput(modelKey: string, inputData: any, modelConfig: ModelConfig): Float32Array {
  const inputArray = new Float32Array(modelConfig.n_features);
  
  if (modelKey === 'decision_tree') {
    // For decision tree (common disease prediction), use symptoms
    const symptoms = inputData.symptoms || [];
    
    // Create binary vector for symptoms
    for (let i = 0; i < COMMON_SYMPTOMS.length && i < modelConfig.n_features; i++) {
      inputArray[i] = symptoms.includes(COMMON_SYMPTOMS[i]) ? 1 : 0;
    }
  } else {
    // For specific disease models (diabetes, heart, parkinsons)
    const featureNames = FEATURE_MAPPINGS[modelKey] || [];
    
    for (let i = 0; i < featureNames.length && i < modelConfig.n_features; i++) {
      const featureName = featureNames[i];
      inputArray[i] = inputData[featureName] || 0;
    }
  }
  
  return inputArray;
}

// Fallback to Python service
async function fallbackToPythonService(model: string, data: any) {
  const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
  
  try {
    const response = await fetch(`${pythonServiceUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, data }),
    });

    if (!response.ok) {
      throw new Error(`Python service error: ${response.status}`);
    }

    const result = await response.json();
    return {
      ...result,
      source: 'python_service'
    };
  } catch (error) {
    throw new Error(`Python service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, data } = body;

    if (!model || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: model and data' },
        { status: 400 }
      );
    }

    // Try ONNX first
    try {
      // Load the model
      const session = await loadModel(model);
      const manifest = getModelsManifest();
      const modelConfig = manifest?.models.find(m => m.key === model);

      if (!modelConfig) {
        return NextResponse.json(
          { error: `Model ${model} not found` },
          { status: 404 }
        );
      }

      // Prepare input tensor
      const inputArray = prepareModelInput(model, data, modelConfig);
      const inputTensor = new ort.Tensor('float32', inputArray, [1, modelConfig.n_features]);

      // Run inference
      const results = await session.run({ input: inputTensor });
      const outputTensor = results[Object.keys(results)[0]];
      
      // Get predictions and probabilities (if available)
      let prediction, probabilities;
      
      if (outputTensor.data.length === 1) {
        // Single output (classification)
        prediction = outputTensor.data[0];
      } else {
        // Multiple outputs (probabilities)
        probabilities = Array.from(outputTensor.data as Float32Array);
        prediction = probabilities.indexOf(Math.max(...probabilities));
      }

      const response = {
        model,
        prediction,
        probabilities,
        confidence: probabilities ? Math.max(...probabilities) : null,
        timestamp: new Date().toISOString(),
        source: 'onnx'
      };

      return NextResponse.json(response);

    } catch (onnxError) {
      console.warn('ONNX prediction failed, trying Python fallback:', onnxError);
      
      // Fallback to Python service
      try {
        const result = await fallbackToPythonService(model, data);
        return NextResponse.json(result);
      } catch (fallbackError) {
        console.error('Both ONNX and Python service failed:', fallbackError);
        return NextResponse.json(
          { 
            error: 'All prediction services failed', 
            details: {
              onnx: onnxError instanceof Error ? onnxError.message : 'Unknown ONNX error',
              python: fallbackError instanceof Error ? fallbackError.message : 'Unknown Python error'
            }
          },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const manifest = getModelsManifest();
    
    const availableModels = manifest?.models.map(model => ({
      key: model.key,
      n_features: model.n_features,
      featureNames: FEATURE_MAPPINGS[model.key] || null,
      symptoms: model.key === 'decision_tree' ? COMMON_SYMPTOMS : null
    }));

    return NextResponse.json({
      availableModels,
      endpoints: {
        predict: 'POST /api/predict',
        models: 'GET /api/predict'
      }
    });

  } catch (error) {
    console.error('Error getting models info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
