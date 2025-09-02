"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Heart, Activity, Brain, Stethoscope, Loader2, X, Plus, ExternalLink, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ModernNavbar } from "@/components/modern-navbar"
import Link from "next/link"
import { useParams } from "next/navigation"

const predictionConfig: Record<string, ConfigType> = {
  "heart-disease": {
    title: "Heart Disease Prediction",
    description: "Assess your cardiovascular risk based on clinical indicators",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    inputType: "clinical" as const,
    parameters: [
      { name: "age", label: "Age", type: "number" as const, min: 18, max: 120, placeholder: "Enter your age" },
      { name: "sex", label: "Sex", type: "select" as const, options: [{ value: "1", label: "Male" }, { value: "0", label: "Female" }] },
      { name: "cp", label: "Chest Pain Type", type: "select" as const, options: [
        { value: "0", label: "Typical Angina" },
        { value: "1", label: "Atypical Angina" },
        { value: "2", label: "Non-Anginal Pain" },
        { value: "3", label: "Asymptomatic" }
      ]},
      { name: "trestbps", label: "Resting Blood Pressure (mm Hg)", type: "number" as const, min: 80, max: 200, placeholder: "e.g., 120" },
      { name: "chol", label: "Serum Cholesterol (mg/dl)", type: "number" as const, min: 100, max: 600, placeholder: "e.g., 200" },
      { name: "fbs", label: "Fasting Blood Sugar > 120 mg/dl", type: "select" as const, options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }] },
      { name: "restecg", label: "Resting ECG Results", type: "select" as const, options: [
        { value: "0", label: "Normal" },
        { value: "1", label: "ST-T Wave Abnormality" },
        { value: "2", label: "Left Ventricular Hypertrophy" }
      ]},
      { name: "thalach", label: "Maximum Heart Rate Achieved", type: "number" as const, min: 60, max: 220, placeholder: "e.g., 150" },
      { name: "exang", label: "Exercise Induced Angina", type: "select" as const, options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }] },
      { name: "oldpeak", label: "ST Depression (Exercise vs Rest)", type: "number" as const, min: 0, max: 10, step: 0.1, placeholder: "e.g., 1.5" },
      { name: "slope", label: "Slope of Peak Exercise ST Segment", type: "select" as const, options: [
        { value: "0", label: "Upsloping" },
        { value: "1", label: "Flat" },
        { value: "2", label: "Downsloping" }
      ]},
      { name: "ca", label: "Number of Major Vessels Colored by Fluoroscopy", type: "select" as const, options: [
        { value: "0", label: "0" }, { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }
      ]},
      { name: "thal", label: "Thalassemia", type: "select" as const, options: [
        { value: "1", label: "Normal" },
        { value: "2", label: "Fixed Defect" },
        { value: "3", label: "Reversible Defect" }
      ]}
    ]
  },
  diabetes: {
    title: "Diabetes Risk Assessment",
    description: "Evaluate your diabetes risk using clinical measurements",
    icon: Activity,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    inputType: "clinical" as const,
    parameters: [
      { name: "pregnancies", label: "Number of Pregnancies", type: "number" as const, min: 0, max: 20, placeholder: "Enter number (0 if male)" },
      { name: "glucose", label: "Plasma Glucose Concentration (mg/dl)", type: "number" as const, min: 50, max: 300, placeholder: "e.g., 120" },
      { name: "bloodPressure", label: "Diastolic Blood Pressure (mm Hg)", type: "number" as const, min: 40, max: 140, placeholder: "e.g., 80" },
      { name: "skinThickness", label: "Triceps Skin Fold Thickness (mm)", type: "number" as const, min: 0, max: 100, placeholder: "e.g., 20" },
      { name: "insulin", label: "2-Hour Serum Insulin (mu U/ml)", type: "number" as const, min: 0, max: 900, placeholder: "e.g., 80" },
      { name: "bmi", label: "Body Mass Index (weight in kg/(height in m)^2)", type: "number" as const, min: 10, max: 70, step: 0.1, placeholder: "e.g., 25.5" },
      { name: "diabetesPedigreeFunction", label: "Diabetes Pedigree Function", type: "number" as const, min: 0, max: 3, step: 0.001, placeholder: "e.g., 0.627" },
      { name: "age", label: "Age", type: "number" as const, min: 18, max: 120, placeholder: "Enter your age" }
    ]
  },
  parkinsons: {
    title: "Parkinson's Disease Assessment",
    description: "Voice and motor analysis for Parkinson's detection",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    inputType: "clinical" as const,
    parameters: [
      { name: "fo", label: "Average Vocal Fundamental Frequency (Hz)", type: "number" as const, min: 50, max: 300, step: 0.001, placeholder: "e.g., 119.992" },
      { name: "fhi", label: "Maximum Vocal Fundamental Frequency (Hz)", type: "number" as const, min: 80, max: 400, step: 0.001, placeholder: "e.g., 157.302" },
      { name: "flo", label: "Minimum Vocal Fundamental Frequency (Hz)", type: "number" as const, min: 40, max: 200, step: 0.001, placeholder: "e.g., 74.997" },
      { name: "jitter_percent", label: "Jitter (%)", type: "number" as const, min: 0, max: 1, step: 0.00001, placeholder: "e.g., 0.00784" },
      { name: "jitter_abs", label: "Jitter (Abs)", type: "number" as const, min: 0, max: 0.001, step: 0.000001, placeholder: "e.g., 0.00007" },
      { name: "rap", label: "RAP - Relative Average Perturbation", type: "number" as const, min: 0, max: 0.1, step: 0.0001, placeholder: "e.g., 0.0037" },
      { name: "ppq", label: "PPQ - Five-point Period Perturbation Quotient", type: "number" as const, min: 0, max: 0.1, step: 0.00001, placeholder: "e.g., 0.00554" },
      { name: "shimmer", label: "Shimmer", type: "number" as const, min: 0, max: 1, step: 0.00001, placeholder: "e.g., 0.04374" },
      { name: "shimmer_db", label: "Shimmer (dB)", type: "number" as const, min: 0, max: 5, step: 0.001, placeholder: "e.g., 0.426" },
      { name: "apq3", label: "APQ3 - Three-point Amplitude Perturbation Quotient", type: "number" as const, min: 0, max: 0.5, step: 0.00001, placeholder: "e.g., 0.02182" },
      { name: "apq5", label: "APQ5 - Five-point Amplitude Perturbation Quotient", type: "number" as const, min: 0, max: 0.5, step: 0.0001, placeholder: "e.g., 0.0313" },
      { name: "nhr", label: "NHR - Noise-to-Harmonics Ratio", type: "number" as const, min: 0, max: 1, step: 0.00001, placeholder: "e.g., 0.02211" },
      { name: "hnr", label: "HNR - Harmonics-to-Noise Ratio", type: "number" as const, min: 0, max: 50, step: 0.001, placeholder: "e.g., 21.033" },
      { name: "rpde", label: "RPDE - Recurrence Period Density Entropy", type: "number" as const, min: 0, max: 1, step: 0.000001, placeholder: "e.g., 0.414783" },
      { name: "dfa", label: "DFA - Signal Fractal Scaling Exponent", type: "number" as const, min: 0, max: 1, step: 0.000001, placeholder: "e.g., 0.815285" },
      { name: "ppe", label: "PPE - Pitch Period Entropy", type: "number" as const, min: 0, max: 1, step: 0.000001, placeholder: "e.g., 0.284654" }
    ]
  },
  "common-diseases": {
    title: "General Health Screening",
    description: "Symptom-based assessment for various medical conditions",
    icon: Stethoscope,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    inputType: "symptoms" as const,
    symptoms: [
      "fever", "cough", "fatigue", "headache", "nausea", "joint pain", "muscle aches", 
      "sore throat", "runny nose", "difficulty breathing", "chest pain", "dizziness",
      "shortness of breath", "chills", "sweating", "weakness", "loss of appetite",
      "abdominal pain", "vomiting", "diarrhea", "constipation", "back pain",
      "skin rash", "swelling", "numbness", "tingling", "blurred vision"
    ],
    quickSelections: [
      { label: "Symptom Duration", options: ["1-2 days", "3-7 days", "1-2 weeks", "Over 2 weeks"] },
      { label: "Severity", options: ["Mild", "Moderate", "Severe"] },
      { label: "Recent Travel", options: ["None", "Domestic", "International"] },
      { label: "Contact with Sick", options: ["No", "Yes"] }
    ]
  }
}

interface ParameterConfig {
  name: string
  label: string
  type: 'number' | 'select'
  min?: number
  max?: number
  step?: number
  placeholder?: string
  options?: { value: string; label: string }[]
}

interface QuickSelection {
  label: string
  options: string[]
}

interface ConfigType {
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  inputType: 'clinical' | 'symptoms'
  parameters?: ParameterConfig[]
  symptoms?: string[]
  quickSelections?: QuickSelection[]
}

interface PredictionResult {
  primaryDisease: string
  confidence: number
  alternativeOptions: Array<{ disease: string; confidence: number }>
}

export default function PredictionPage() {
  const params = useParams()
  const category = params.category as string
  const config = predictionConfig[category as keyof typeof predictionConfig]

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [clinicalData, setClinicalData] = useState<Record<string, string>>({})
  const [quickSelections, setQuickSelections] = useState<Record<string, string>>({})
  const [customSymptom, setCustomSymptom] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)

  if (!config) {
    return <div>Category not found</div>
  }

  const IconComponent = config.icon

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))
  }

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()])
      setCustomSymptom("")
    }
  }

  const handleQuickSelection = (label: string, value: string) => {
    setQuickSelections(prev => ({ ...prev, [label]: value }))
  }

  const handleClinicalDataChange = (name: string, value: string) => {
    setClinicalData(prev => ({ ...prev, [name]: value }))
  }

  const validateClinicalData = () => {
    if (config.inputType !== 'clinical' || !config.parameters) return true
    
    const requiredFields = config.parameters.filter((param: ParameterConfig) => param.name !== 'pregnancies')
    for (const param of requiredFields) {
      if (!clinicalData[param.name] || clinicalData[param.name].trim() === '') {
        return false
      }
    }
    return true
  }

  const handlePredict = async () => {
    if (config.inputType === 'symptoms' && selectedSymptoms.length === 0) return
    if (config.inputType === 'clinical' && !validateClinicalData()) return
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock prediction results based on disease type
    let diseases: string[]
    let primaryDisease: string
    
    switch (category) {
      case 'heart-disease':
        diseases = ["No Heart Disease", "Heart Disease"]
        primaryDisease = diseases[Math.floor(Math.random() * diseases.length)]
        break
      case 'diabetes':
        diseases = ["No Diabetes", "Type 2 Diabetes", "Pre-diabetes"]
        primaryDisease = diseases[Math.floor(Math.random() * diseases.length)]
        break
      case 'parkinsons':
        diseases = ["No Parkinson's Disease", "Parkinson's Disease"]
        primaryDisease = diseases[Math.floor(Math.random() * diseases.length)]
        break
      default:
        diseases = ["Common Cold", "Flu", "Allergies", "Migraine", "Anxiety", "Gastritis"]
        primaryDisease = diseases[Math.floor(Math.random() * diseases.length)]
    }
    
    const primaryConfidence = Math.floor(Math.random() * 30) + 70 // 70-100%
    
    const alternativeOptions = diseases
      .filter(d => d !== primaryDisease)
      .slice(0, 3)
      .map(disease => ({
        disease,
        confidence: Math.floor(Math.random() * 40) + 20 // 20-60%
      }))
      .sort((a, b) => b.confidence - a.confidence)

    setResult({
      primaryDisease,
      confidence: primaryConfidence,
      alternativeOptions
    })
    
    setIsLoading(false)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-100"
    if (confidence >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const isReadyToPredict = () => {
    if (config.inputType === 'symptoms') {
      return selectedSymptoms.length > 0
    } else {
      return validateClinicalData()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/predict"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Predictions
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl ${config.bgColor} flex items-center justify-center`}>
              <IconComponent className={`h-8 w-8 ${config.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{config.title}</h1>
              <p className="text-muted-foreground">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Vertical Stacked Layout */}
        <div className="space-y-8">
          
          {/* Clinical Parameters Form (for heart, diabetes, parkinsons) */}
          {config.inputType === 'clinical' && config.parameters && (
            <Card>
              <CardHeader>
                <CardTitle>Clinical Information</CardTitle>
                <CardDescription>
                  Please provide the following medical measurements and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {config.parameters.map((param) => (
                    <div key={param.name} className="space-y-2">
                      <Label htmlFor={param.name}>{param.label}</Label>
                      {param.type === 'number' ? (
                        <Input
                          id={param.name}
                          type="number"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          placeholder={param.placeholder}
                          value={clinicalData[param.name] || ''}
                          onChange={(e) => handleClinicalDataChange(param.name, e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <Select
                          value={clinicalData[param.name] || ''}
                          onValueChange={(value) => handleClinicalDataChange(param.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${param.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {param.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Symptom-based Input (for common diseases) */}
          {config.inputType === 'symptoms' && (
            <>
              {/* Custom Symptom Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add Custom Symptom</span>
                  </CardTitle>
                  <CardDescription>
                    Type any symptom you're experiencing that's not listed below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter your symptom..."
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                      className="flex-1"
                    />
                    <Button onClick={addCustomSymptom} disabled={!customSymptom.trim()}>
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Symptom Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Common Symptoms</CardTitle>
                  <CardDescription>
                    Select from common symptoms related to {config.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {config.symptoms?.map((symptom) => (
                      <Button
                        key={symptom}
                        variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                        size="sm"
                        onClick={() => selectedSymptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom)}
                        className="justify-start text-left h-auto py-3 px-4"
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Selection Dropdowns */}
              {config.quickSelections && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                    <CardDescription>
                      Provide additional context to improve prediction accuracy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {config.quickSelections.map((selection) => (
                        <div key={selection.label} className="space-y-2">
                          <Label>{selection.label}</Label>
                          <Select
                            value={quickSelections[selection.label] || ""}
                            onValueChange={(value) => handleQuickSelection(selection.label, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${selection.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {selection.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Your Selected Symptoms */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Selected Symptoms ({selectedSymptoms.length})</CardTitle>
                  <CardDescription>
                    Review your symptoms before getting prediction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSymptoms.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <Badge
                          key={symptom}
                          variant="secondary"
                          className="px-3 py-1 flex items-center space-x-2"
                        >
                          <span>{symptom}</span>
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeSymptom(symptom)}
                          />
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No symptoms selected yet. Please select symptoms from above to continue.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Predict Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handlePredict}
                disabled={!isReadyToPredict() || isLoading}
                className="w-full py-6 text-lg font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing {config.inputType === 'clinical' ? 'Clinical Data' : 'Symptoms'}...
                  </>
                ) : config.inputType === 'clinical' ? (
                  'Get Prediction'
                ) : (
                  `Get Prediction (${selectedSymptoms.length} symptoms)`
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 5. Prediction Results */}
          {result && (
            <>
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="text-2xl">Prediction Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Disease */}
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-primary">{result.primaryDisease}</h3>
                      <Badge className={`text-lg px-4 py-2 ${getConfidenceColor(result.confidence)}`}>
                        {result.confidence}% Confidence
                      </Badge>
                    </div>
                    
                    {/* Know Your Disease Button */}
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4"
                    >
                      <a
                        href="https://health-predictor-wiki.vercel.app/disease-portal/disease-portal.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <ExternalLink className="h-5 w-5" />
                        <span>Know Your Disease</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Diseases */}
              {result.alternativeOptions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Alternative Possibilities</CardTitle>
                    <CardDescription>
                      Other conditions that match your symptoms with lower confidence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.alternativeOptions.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                        >
                          <span className="font-medium">{option.disease}</span>
                          <Badge variant="outline" className={getConfidenceColor(option.confidence)}>
                            {option.confidence}% Confidence
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Fixed Footer Warning */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 py-3 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>
              ⚠️ This tool is for informational purposes only. Do not rely solely on predictions. Always consult a licensed doctor.
            </span>
          </p>
        </div>
      </div>

      {/* Bottom padding to account for fixed footer */}
      <div className="h-16"></div>
    </div>
  )
}
