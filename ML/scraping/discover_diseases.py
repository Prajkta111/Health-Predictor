import pandas as pd
import requests
import logging
import time
from pathlib import Path
import sys
import json
from datetime import datetime
import random
from typing import Set, List
import warnings
warnings.filterwarnings('ignore')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', stream=sys.stdout)

SCRIPT_DIR = Path(__file__).resolve().parent
BASE_DIR = SCRIPT_DIR.parent.parent
DISEASE_CSV_PATH = SCRIPT_DIR / "disease.csv"

USER_AGENT = "DiseaseDiscoveryBot/1.0 (+https://github.com/Sahilbhatane/Health-Predictor)"
ENDPOINTS = ["https://query.wikidata.org/sparql"]

def get_existing_diseases() -> Set[str]:
    """Load existing diseases from disease.csv"""
    try:
        if DISEASE_CSV_PATH.exists():
            df = pd.read_csv(DISEASE_CSV_PATH)
            existing = set(df.iloc[:, 0].dropna().astype(str).str.strip())
            logging.info(f"Loaded {len(existing)} existing diseases")
            return existing
        else:
            logging.info("No existing disease file found, starting fresh")
            return set()
    except Exception as e:
        logging.error(f"Error loading existing diseases: {e}")
        return set()

def discover_diseases_by_category(category_id: str, category_name: str, limit: int = 50) -> List[str]:
    """Discover diseases from a specific medical category"""
    
    query = f"""
    SELECT DISTINCT ?diseaseLabel WHERE {{
      ?disease wdt:P31/wdt:P279* wd:{category_id} .
      ?disease rdfs:label ?diseaseLabel .
      FILTER(LANG(?diseaseLabel) = "en")
      FILTER(!CONTAINS(LCASE(?diseaseLabel), "syndrome"))
      FILTER(!CONTAINS(LCASE(?diseaseLabel), "disorder"))
      FILTER(STRLEN(?diseaseLabel) > 3)
      FILTER(STRLEN(?diseaseLabel) < 50)
    }}
    LIMIT {limit}
    """
    
    headers = {"User-Agent": USER_AGENT, "Accept": "application/sparql-results+json"}
    params = {"query": query, "format": "json"}
    
    diseases = []
    
    for endpoint in ENDPOINTS:
        try:
            response = requests.get(endpoint, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if "results" in data and "bindings" in data["results"]:
                for item in data["results"]["bindings"]:
                    disease_name = item.get("diseaseLabel", {}).get("value", "").strip()
                    if disease_name and len(disease_name) > 3:
                        diseases.append(disease_name)
            
            logging.info(f"Found {len(diseases)} diseases in category: {category_name}")
            break
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Request failed for category {category_name}: {e}")
            continue
    
    return diseases

def discover_infectious_diseases(limit: int = 30) -> List[str]:
    """Discover infectious diseases"""
    
    query = f"""
    SELECT DISTINCT ?diseaseLabel WHERE {{
      {{
        ?disease wdt:P31/wdt:P279* wd:Q18123741 .
      }} UNION {{
        ?disease wdt:P31/wdt:P279* wd:Q18965518 .
      }} UNION {{
        ?disease wdt:P31/wdt:P279* wd:Q2057971 .
      }}
      ?disease rdfs:label ?diseaseLabel .
      FILTER(LANG(?diseaseLabel) = "en")
      FILTER(STRLEN(?diseaseLabel) > 3)
      FILTER(STRLEN(?diseaseLabel) < 40)
    }}
    LIMIT {limit}
    """
    
    headers = {"User-Agent": USER_AGENT, "Accept": "application/sparql-results+json"}
    params = {"query": query, "format": "json"}
    
    diseases = []
    
    for endpoint in ENDPOINTS:
        try:
            response = requests.get(endpoint, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if "results" in data and "bindings" in data["results"]:
                for item in data["results"]["bindings"]:
                    disease_name = item.get("diseaseLabel", {}).get("value", "").strip()
                    if disease_name:
                        diseases.append(disease_name)
            
            logging.info(f"Found {len(diseases)} infectious diseases")
            break
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Request failed for infectious diseases: {e}")
            continue
    
    return diseases

def discover_rare_diseases(limit: int = 20) -> List[str]:
    """Discover rare diseases"""
    
    query = f"""
    SELECT DISTINCT ?diseaseLabel WHERE {{
      ?disease wdt:P31/wdt:P279* wd:Q18965518 .
      ?disease wdt:P1193 ?prevalence .
      ?disease rdfs:label ?diseaseLabel .
      FILTER(LANG(?diseaseLabel) = "en")
      FILTER(STRLEN(?diseaseLabel) > 4)
      FILTER(STRLEN(?diseaseLabel) < 45)
    }}
    LIMIT {limit}
    """
    
    headers = {"User-Agent": USER_AGENT, "Accept": "application/sparql-results+json"}
    params = {"query": query, "format": "json"}
    
    diseases = []
    
    for endpoint in ENDPOINTS:
        try:
            response = requests.get(endpoint, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if "results" in data and "bindings" in data["results"]:
                for item in data["results"]["bindings"]:
                    disease_name = item.get("diseaseLabel", {}).get("value", "").strip()
                    if disease_name:
                        diseases.append(disease_name)
            
            logging.info(f"Found {len(diseases)} rare diseases")
            break
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Request failed for rare diseases: {e}")
            continue
    
    return diseases

def clean_disease_name(disease: str) -> str:
    """Clean and standardize disease names"""
    if not disease:
        return ""
    
    disease = disease.strip()
    
    # Remove common prefixes/suffixes that might cause duplicates
    prefixes_to_remove = ["acute ", "chronic ", "primary ", "secondary "]
    suffixes_to_remove = [" disease", " syndrome", " disorder", " condition"]
    
    disease_lower = disease.lower()
    
    # Don't clean if it would make the name too short
    original_disease = disease
    
    for prefix in prefixes_to_remove:
        if disease_lower.startswith(prefix):
            potential = disease[len(prefix):]
            if len(potential) > 4:  # Keep reasonable length
                disease = potential
                break
    
    for suffix in suffixes_to_remove:
        if disease_lower.endswith(suffix):
            potential = disease[:-len(suffix)]
            if len(potential) > 4:  # Keep reasonable length
                disease = potential
                break
    
    return disease.strip()

def discover_new_diseases(target_count: int = 15) -> List[str]:
    """Main function to discover new diseases"""
    existing_diseases = get_existing_diseases()
    existing_diseases_lower = {d.lower() for d in existing_diseases}
    
    new_diseases = []
    
    # Disease categories to explore
    categories = [
        ("Q12136", "Disease"),
        ("Q929833", "Cancer"),
        ("Q18965518", "Rare Disease"),
        ("Q18123741", "Infectious Disease"),
        ("Q5154", "Skin Disease"),
        ("Q3839081", "Mental Disorder")
    ]
    
    # Try different discovery methods
    all_discovered = []
    
    # Method 1: By categories
    for category_id, category_name in categories:
        try:
            diseases = discover_diseases_by_category(category_id, category_name, 20)
            all_discovered.extend(diseases)
            time.sleep(1)  # Be respectful to API
        except Exception as e:
            logging.error(f"Error discovering {category_name}: {e}")
    
    # Method 2: Infectious diseases
    try:
        infectious = discover_infectious_diseases(15)
        all_discovered.extend(infectious)
        time.sleep(1)
    except Exception as e:
        logging.error(f"Error discovering infectious diseases: {e}")
    
    # Method 3: Rare diseases
    try:
        rare = discover_rare_diseases(10)
        all_discovered.extend(rare)
    except Exception as e:
        logging.error(f"Error discovering rare diseases: {e}")
    
    # Clean and filter discoveries
    for disease in all_discovered:
        if len(new_diseases) >= target_count:
            break
            
        cleaned = clean_disease_name(disease)
        if (cleaned and 
            len(cleaned) > 3 and 
            cleaned.lower() not in existing_diseases_lower and
            cleaned not in new_diseases):
            new_diseases.append(cleaned)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_diseases = []
    for disease in new_diseases:
        if disease.lower() not in seen:
            seen.add(disease.lower())
            unique_diseases.append(disease)
    
    return unique_diseases[:target_count]

def update_disease_csv(new_diseases: List[str]) -> bool:
    """Update the disease.csv file with new diseases"""
    try:
        # Load existing data or create new
        if DISEASE_CSV_PATH.exists():
            df = pd.read_csv(DISEASE_CSV_PATH)
            existing_diseases = list(df.iloc[:, 0].dropna().astype(str))
        else:
            df = pd.DataFrame(columns=["Disease"])
            existing_diseases = []
        
        # Add new diseases
        all_diseases = existing_diseases + new_diseases
        
        # Remove duplicates while preserving order
        seen = set()
        unique_diseases = []
        for disease in all_diseases:
            disease_lower = disease.lower().strip()
            if disease_lower not in seen and disease.strip():
                seen.add(disease_lower)
                unique_diseases.append(disease.strip())
        
        # Create new dataframe
        updated_df = pd.DataFrame({"Disease": unique_diseases})
        
        # Save to CSV
        updated_df.to_csv(DISEASE_CSV_PATH, index=False)
        
        logging.info(f"Updated disease.csv with {len(new_diseases)} new diseases")
        logging.info(f"Total diseases in database: {len(unique_diseases)}")
        
        return True
        
    except Exception as e:
        logging.error(f"Error updating disease.csv: {e}")
        return False

def main():
    """Main function to discover and add new diseases"""
    logging.info("Starting disease discovery process...")
    
    # Discover new diseases
    new_diseases = discover_new_diseases(target_count=15)
    
    if new_diseases:
        logging.info(f"Discovered {len(new_diseases)} new diseases:")
        for i, disease in enumerate(new_diseases, 1):
            logging.info(f"  {i}. {disease}")
        
        # Update the CSV file
        success = update_disease_csv(new_diseases)
        
        if success:
            logging.info("Disease discovery completed successfully!")
            
            # Create a summary for GitHub Actions
            summary = {
                "timestamp": datetime.now().isoformat(),
                "new_diseases_count": len(new_diseases),
                "new_diseases": new_diseases
            }
            
            summary_path = SCRIPT_DIR / "discovery_summary.json"
            with open(summary_path, "w") as f:
                json.dump(summary, f, indent=2)
            
            return True
        else:
            logging.error("Failed to update disease.csv")
            return False
    else:
        logging.warning("No new diseases discovered")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
