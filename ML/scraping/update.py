import pandas as pd
import requests
import logging
import time
from pathlib import Path
import sys
import json
from typing import Set
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', stream=sys.stdout)

SCRIPT_DIR = Path(__file__).resolve().parent
BASE_DIR = SCRIPT_DIR.parent.parent
DATA_DIR = BASE_DIR / "Datasets"
INPUT_DATASET_PATH = DATA_DIR / "common Pivoted.csv"
DISEASE_LIST_PATH = BASE_DIR / "ML" / "scraping" / "disease.csv"
OUTPUT_DIR = DATA_DIR / "self data" / "output"
PROGRESS_FILE = OUTPUT_DIR / "resume_progress.json"

ENDPOINTS = [
    "https://query.wikidata.org/sparql",
    "https://wikidata.org/sparql"
]

USER_AGENT = "DiseaseSymptomDatasetBot/1.0 (+https://github.com/Sahilbhatane/Health-Predictor)"



def clean_symptom_name(symptom: str) -> str:
    if not symptom:
        return ""
    
    symptom = ' '.join(symptom.split())
    symptom_lower = symptom.lower()
    
    symptom_mapping = {
        'high fever': 'fever', 'elevated temperature': 'fever', 'high temperature': 'fever',
        'difficulty breathing': 'dyspnea', 'shortness of breath': 'dyspnea', 'breathing difficulty': 'dyspnea',
        'stomach pain': 'abdominal pain', 'belly pain': 'abdominal pain',
        'muscle pain': 'myalgia', 'joint pain': 'arthralgia',
        'feeling tired': 'fatigue', 'tiredness': 'fatigue', 'sleepiness': 'drowsiness',
        'loss of appetite': 'anorexia', 'lack of appetite': 'anorexia',
        'throwing up': 'vomiting', 'feeling sick': 'nausea', 'feeling dizzy': 'dizziness',
        'head pain': 'headache', 'difficulty swallowing': 'dysphagia', 'trouble swallowing': 'dysphagia',
        'skin rash': 'rash', 'skin irritation': 'rash',
        'runny nose': 'nasal discharge present', 'stuffy nose': 'nasal congestion', 'blocked nose': 'nasal congestion',
        'sore throat': 'throat sore', 'painful throat': 'throat sore',
        'chest pain': 'pain chest', 'back pain': 'pain back', 'neck pain': 'pain neck',
        'foot pain': 'pain foot', 'abdominal pain': 'pain abdominal',
        'weight loss': 'decreased body weight', 'losing weight': 'decreased body weight',
        'difficulty urinating': 'difficulty passing urine', 'trouble urinating': 'difficulty passing urine',
        'painful urination': 'dysuria', 'burning urination': 'dysuria',
        'excessive urination': 'polyuria', 'frequent urination': 'polyuria',
        'excessive thirst': 'polydypsia', 'increased thirst': 'polydypsia',
        'night sweats': 'night sweat', 'sweating at night': 'night sweat',
        'excessive sweating': 'hyperhidrosis disorder', 'increased sweating': 'sweating increased',
        'rapid heartbeat': 'tachycardia', 'fast heartbeat': 'tachycardia',
        'slow heartbeat': 'bradycardia', 'irregular heartbeat': 'arrhythmia',
        'heart palpitations': 'palpitation', 'feeling faint': 'syncope',
        'fainting': 'syncope', 'passing out': 'syncope',
        'loss of consciousness': 'unconscious state', 'confusion': 'confusion of consciousness',
        'memory problems': 'memory disorder', 'forgetfulness': 'memory disorder',
        'difficulty concentrating': 'unable to concentrate', 'trouble concentrating': 'unable to concentrate',
        'mood changes': 'mood depressed', 'feeling sad': 'mood depressed', 'feeling down': 'mood depressed',
        'anxiety': 'anxiety state', 'feeling anxious': 'anxiety state',
        'nervousness': 'nervousness', 'feeling nervous': 'nervousness',
        'trembling': 'tremor', 'shaking': 'tremor',
        'muscle weakness': 'muscle weakness', 'weak muscles': 'muscle weakness',
        'muscle cramps': 'muscle cramp', 'muscle spasms': 'spasm',
        'stiffness': 'stiffness', 'stiff joints': 'stiffness',
        'swelling': 'swelling', 'inflammation': 'inflammation', 'redness': 'redness',
        'itching': 'itch', 'itchy skin': 'itch', 'dry skin': 'xerostomia',
        'bruising': 'ecchymosis', 'easy bruising': 'ecchymosis', 'bleeding': 'bleeding',
        'nosebleeds': 'nosebleed', 'vision problems': 'vision blurred', 'blurred vision': 'vision blurred',
        'hearing problems': 'hearing loss', 'hearing loss': 'hearing loss',
        'ringing in ears': 'tinnitus', 'ear ringing': 'tinnitus',
        'diarrhea': 'diarrhea', 'loose stools': 'diarrhea',
        'constipation': 'constipation', 'difficulty passing stool': 'constipation',
        'bloating': 'abdominal bloating', 'abdominal bloating': 'abdominal bloating',
        'gas': 'flatulence', 'flatulence': 'flatulence',
        'heartburn': 'heartburn', 'acid reflux': 'heartburn', 'indigestion': 'heartburn',
        'yellowing of skin': 'jaundice', 'yellow skin': 'jaundice',
        'pale skin': 'pallor', 'paleness': 'pallor',
        'flushed skin': 'flushing', 'red face': 'flushing'
    }
    
    return symptom_mapping.get(symptom_lower, symptom)

def fetch_symptoms_individual(disease_name: str, retries: int = 2) -> Set[str]:
    if not disease_name or not str(disease_name).strip():
        return set()
    
    escaped_disease = disease_name.replace('"', '\\"')
    
    query = f"""
    SELECT DISTINCT ?symptomLabel WHERE {{
      {{
        ?disease rdfs:label "{escaped_disease}"@en .
        ?disease wdt:P780 ?symptom .
      }} UNION {{
        ?disease ?label "{escaped_disease}"@en .
        ?disease wdt:P780 ?symptom .
      }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    
    headers = {"User-Agent": USER_AGENT, "Accept": "application/sparql-results+json"}
    params = {"query": query, "format": "json"}
    
    for endpoint in ENDPOINTS:
        for attempt in range(retries):
            try:
                response = requests.get(endpoint, headers=headers, params=params, timeout=30)
                response.raise_for_status()
                data = response.json()
                
                symptoms = set()
                if "results" in data and "bindings" in data["results"]:
                    for item in data["results"]["bindings"]:
                        symptom = item.get("symptomLabel", {}).get("value")
                        if symptom:
                            clean_symptom = clean_symptom_name(symptom.strip())
                            if clean_symptom:
                                symptoms.add(clean_symptom)
                
                if symptoms:
                    logging.info(f"Found {len(symptoms)} symptoms for {disease_name}")
                return symptoms
                    
            except requests.exceptions.RequestException as e:
                logging.warning(f"Request failed for {disease_name} on attempt {attempt + 1}/{retries}: {e}")
                if attempt < retries - 1:
                    time.sleep(2)
    
    return set()

def fetch_symptoms_in_bulk(disease_names: list, retries: int = 3) -> dict:
    if not disease_names:
        return {}

    clean_diseases = [str(name).strip() for name in set(disease_names) 
                     if str(name).strip() and not str(name).isdigit()]
    
    if not clean_diseases:
        return {}

    logging.info(f"Fetching symptoms for {len(clean_diseases)} diseases individually due to API limitations")
    
    results = {}
    for i, disease in enumerate(clean_diseases):
        logging.info(f"Processing disease {i+1}/{len(clean_diseases)}: {disease}")
        symptoms = fetch_symptoms_individual(disease, retries)
        if symptoms:
            results[disease] = sorted(list(symptoms))
        time.sleep(1)
    
    logging.info(f"Individual queries complete, found symptoms for {len(results)} diseases")
    return results


def fetch_symptoms_with_batching(disease_names: list, batch_size: int = 20) -> dict:
    all_results = {}
    diseases = list(disease_names)

    start_batch = 0
    if PROGRESS_FILE.exists():
        try:
            with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
                progress = json.load(f)
            start_batch = progress.get("last_completed_batch", 0) + 1
            logging.info(f"Resuming from batch {start_batch}...")
        except Exception:
            logging.warning("Progress file corrupted. Starting from batch 0.")

    total_batches = (len(diseases) + batch_size - 1) // batch_size

    for i in range(start_batch, total_batches):
        batch = diseases[i*batch_size:(i+1)*batch_size]
        logging.info(f"Fetching batch {i+1}/{total_batches} ({len(batch)} diseases)...")
        batch_results = fetch_symptoms_in_bulk(batch)
        all_results.update(batch_results)

        with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
            json.dump({"last_completed_batch": i}, f)

        time.sleep(2)

    if PROGRESS_FILE.exists():
        PROGRESS_FILE.unlink()

    return all_results

def merge_csvs(csv_path_1, csv_path_2, output_path):
    try:
        df1 = pd.read_csv(csv_path_1)
        df2 = pd.read_csv(csv_path_2)
    except FileNotFoundError as e:
        logging.error(f"File not found: {e}")
        return

    df1 = df1.rename(columns={df1.columns[0]: "Disease"})
    df2 = df2.rename(columns={df2.columns[0]: "Disease"})

    all_symptoms = sorted(list((set(df1.columns) | set(df2.columns)) - {"Disease"}))

    df1 = df1.set_index("Disease").reindex(columns=all_symptoms, fill_value=0)
    df2 = df2.set_index("Disease").reindex(columns=all_symptoms, fill_value=0)

    merged = pd.concat([df1, df2]).groupby(level=0).max().reset_index()
    merged = merged[["Disease"] + all_symptoms]
    merged.to_csv(output_path, index=False)
    logging.info(f"Merged CSV saved to {output_path}")

def update_dataset():
    OUTPUT_DIR.mkdir(exist_ok=True)

    try:
        df = pd.read_csv(INPUT_DATASET_PATH)
        df = df.rename(columns={df.columns[0]: "Disease"})
        existing_diseases = set(df["Disease"].astype(str).unique())
        logging.info(f"Loaded dataset with {len(df)} records and {len(existing_diseases)} unique diseases.")
    except FileNotFoundError:
        logging.warning(f"Input file not found at '{INPUT_DATASET_PATH}'. Starting empty.")
        df = pd.DataFrame(columns=["Disease"])
        existing_diseases = set()
    except Exception as e:
        logging.error(f"Failed to load dataset: {e}. Starting empty.")
        df = pd.DataFrame(columns=["Disease"])
        existing_diseases = set()

    try:
        new_diseases_df = pd.read_csv(DISEASE_LIST_PATH)
        all_diseases_from_list = set(new_diseases_df.iloc[:, 0].dropna().astype(str).unique())
        diseases_to_query = all_diseases_from_list - existing_diseases
        logging.info(f"Found {len(diseases_to_query)} new diseases to add from disease list.")
        logging.info(f"Total diseases in list: {len(all_diseases_from_list)}")
    except FileNotFoundError:
        logging.warning(f"'{DISEASE_LIST_PATH}' not found. Using existing diseases only.")
        all_diseases_from_list = existing_diseases
        diseases_to_query = set()
    except Exception as e:
        logging.error(f"Failed to read disease list: {e}")
        all_diseases_from_list = existing_diseases
        diseases_to_query = set()

    all_diseases_to_fetch = [str(d) for d in all_diseases_from_list
                            if str(d).strip() and not str(d).isdigit()]
    
    if not all_diseases_to_fetch:
        logging.error("No diseases to process. Exiting.")
        return

    logging.info(f"Processing {len(all_diseases_to_fetch)} total diseases")
    
    symptom_data = fetch_symptoms_with_batching(all_diseases_to_fetch, batch_size=20)
    if not symptom_data:
        logging.warning("No symptom data retrieved from Wikidata. Creating empty symptom columns.")
        symptom_data = {disease: [] for disease in all_diseases_to_fetch}

    all_symptoms = set(df.columns) - {"Disease"}
    for symptoms in symptom_data.values():
        all_symptoms.update(symptoms)

    if not all_symptoms:
        logging.warning("No symptoms found. Using basic symptom set.")
        all_symptoms = {"fever", "headache", "fatigue", "cough", "nausea", "pain", "weakness"}

    symptom_columns = sorted(list(all_symptoms))

    records = []
    processed_diseases = set()

    for disease in all_diseases_to_fetch:
        if disease in processed_diseases:
            continue
        record = {"Disease": disease}
        new_symptoms = symptom_data.get(disease, [])
        for col in symptom_columns:
            record[col] = 1 if col in new_symptoms else 0
        records.append(record)
        processed_diseases.add(disease)

    if not records:
        logging.error("No records generated. Check Wikidata response.")
        return

    updated_df = pd.DataFrame(records)
    updated_df = updated_df[["Disease"] + symptom_columns]
    updated_df = updated_df.sort_values(by="Disease").reset_index(drop=True)

    output_path = OUTPUT_DIR / "common pivoted 2.csv"
    updated_df.to_csv(output_path, index=False)
    
    # Create summary for GitHub Actions
    summary = {
        "timestamp": datetime.now().isoformat(),
        "total_diseases": len(updated_df),
        "total_symptoms": len(symptom_columns),
        "new_diseases_added": len(diseases_to_query),
        "diseases_with_symptoms": len([d for d in symptom_data if symptom_data[d]])
    }
    
    summary_path = OUTPUT_DIR / "update_summary.json"
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)
    
    logging.info(f"Dataset update complete. Final shape: {updated_df.shape}, Unique diseases: {len(updated_df)}")
    logging.info(f"Summary saved to: {summary_path}")

def run_full_pipeline():
    """Run the complete pipeline: discover diseases, then update dataset"""
    logging.info("=" * 60)
    logging.info("STARTING AUTOMATED DISEASE DISCOVERY AND UPDATE PIPELINE")
    logging.info("=" * 60)
    
    # Step 1: Discover new diseases
    discover_script = Path(__file__).parent / "discover_diseases.py"
    if discover_script.exists():
        logging.info("Step 1: Running disease discovery...")
        import subprocess
        import sys
        
        try:
            result = subprocess.run([sys.executable, str(discover_script)], 
                                  capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                logging.info("Disease discovery completed successfully")
                if result.stdout:
                    logging.info("Discovery output:")
                    for line in result.stdout.split('\n'):
                        if line.strip():
                            logging.info(f"  {line}")
            else:
                logging.warning("Disease discovery had issues but continuing...")
                if result.stderr:
                    logging.warning(f"Discovery errors: {result.stderr}")
                    
        except subprocess.TimeoutExpired:
            logging.warning("Disease discovery timed out, continuing with existing diseases...")
        except Exception as e:
            logging.warning(f"Could not run disease discovery: {e}, continuing with existing diseases...")
    else:
        logging.warning("Disease discovery script not found, skipping discovery step")
    
    # Step 2: Update dataset with all diseases
    logging.info("Step 2: Updating disease-symptom dataset...")
    update_dataset()
    
    logging.info("=" * 60)
    logging.info("PIPELINE COMPLETED")
    logging.info("=" * 60)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Disease-Symptom Dataset Management')
    parser.add_argument('--full-pipeline', action='store_true', 
                       help='Run full pipeline: discover diseases + update dataset')
    parser.add_argument('--update-only', action='store_true', 
                       help='Only update dataset with existing diseases')
    
    args = parser.parse_args()
    
    if args.full_pipeline:
        run_full_pipeline()
    elif args.update_only:
        output_csv_path = OUTPUT_DIR / "common pivoted 2.csv"
        merged_csv_path = OUTPUT_DIR / "merged_common_pivoted.csv"
        
        if output_csv_path.exists():
            merge_csvs(INPUT_DATASET_PATH, output_csv_path, merged_csv_path)
            INPUT_DATASET_PATH = merged_csv_path
        
        update_dataset()
    else:
        # Default behavior for backward compatibility
        output_csv_path = OUTPUT_DIR / "common pivoted 2.csv"
        merged_csv_path = OUTPUT_DIR / "merged_common_pivoted.csv"
        
        if output_csv_path.exists():
            merge_csvs(INPUT_DATASET_PATH, output_csv_path, merged_csv_path)
            INPUT_DATASET_PATH = merged_csv_path
        
        update_dataset()
