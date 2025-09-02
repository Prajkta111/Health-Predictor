# 🤖 Automated Disease Discovery System

This directory contains an automated system for discovering new diseases and updating the disease-symptom dataset monthly.

## 📁 Files Overview

### Core Scripts
- **`discover_diseases.py`** - Discovers 10-20 new diseases monthly from medical databases
- **`update.py`** - Updates the symptom dataset with new and existing diseases  
- **`disease.csv`** - Master list of all diseases (auto-updated)

### Automation
- **`.github/workflows/monthly-disease-update.yml`** - GitHub Actions workflow
- **`requirements.txt`** - Python dependencies

## 🔄 How It Works

### Monthly Automation Process:
1. **Discovery Phase**: `discover_diseases.py` searches medical databases for new diseases
2. **Validation Phase**: Removes duplicates and validates disease names
3. **Update Phase**: `update.py` fetches symptoms from Wikidata for all diseases
4. **Integration Phase**: Updates the main dataset with new symptom mappings

### Disease Sources:
- Wikidata medical ontologies
- Infectious disease databases
- Rare disease registries
- Cancer classification systems
- Mental health condition catalogs

## 🚀 Usage

### Manual Execution:
```bash
# Run full pipeline (discovery + update)
python update.py --full-pipeline

# Update dataset only (no new discovery)
python update.py --update-only

# Discover new diseases only
python discover_diseases.py
```

### GitHub Actions:
- **Automatic**: Runs on the 1st of every month at 2:00 AM UTC
- **Manual**: Use "Actions" tab → "Monthly Disease Discovery" → "Run workflow"

## 📊 Output Files

### Generated Files:
- `Datasets/self data/output/common pivoted 2.csv` - Updated disease-symptom matrix
- `ML/scraping/discovery_summary.json` - Discovery process summary
- `Datasets/self data/output/update_summary.json` - Update process summary

### Data Format:
```csv
Disease,symptom1,symptom2,symptom3,...
diabetes,0,1,1,...
hypertension,1,0,1,...
...
```

## ⚙️ Configuration

### Automation Settings:
- **Target new diseases per month**: 10-20
- **Batch size for API calls**: 20 diseases
- **API timeout**: 30 seconds
- **Rate limiting**: 1 second between requests

### Customization:
Edit `discover_diseases.py` to:
- Change target disease count
- Add new medical categories
- Modify discovery criteria
- Adjust filtering rules

## 🔧 Setup Instructions

### 1. Repository Setup:
```bash
# Ensure the workflow file is in the right location
.github/workflows/monthly-disease-update.yml
```

### 2. Dependencies:
```bash
pip install -r ML/scraping/requirements.txt
```

### 3. GitHub Actions Permissions:
- Go to Repository Settings → Actions → General
- Enable "Read and write permissions" for GITHUB_TOKEN
- Enable "Allow GitHub Actions to create and approve pull requests"

### 4. Testing:
```bash
# Test discovery
python ML/scraping/discover_diseases.py

# Test full pipeline
python ML/scraping/update.py --full-pipeline
```

## 📈 Monitoring

### Success Indicators:
- ✅ New diseases added to `disease.csv`
- ✅ Symptom mappings updated
- ✅ Pull request created automatically
- ✅ Summary files generated

### Logs Location:
- GitHub Actions: Repository → Actions tab
- Local: Console output with timestamps

## 🛠️ Troubleshooting

### Common Issues:

**No new diseases found:**
- Normal behavior if database is comprehensive
- Check discovery criteria in `discover_diseases.py`

**API timeouts:**
- Wikidata may be slow; script includes retry logic
- Check internet connection and API availability

**GitHub Actions fails:**
- Verify repository permissions
- Check Python dependencies
- Review workflow logs

### Manual Recovery:
```bash
# Reset if needed
git checkout main
git pull origin main

# Run manually
python ML/scraping/update.py --full-pipeline
```

## 📅 Schedule

- **Automated runs**: 1st of every month, 2:00 AM UTC
- **Backup window**: Can be triggered manually anytime
- **Processing time**: Typically 10-30 minutes depending on dataset size

## 🔍 Quality Assurance

### Automated Checks:
- Duplicate disease detection
- Disease name validation
- Symptom mapping verification
- Data format consistency

### Manual Review:
- Review generated pull requests before merging
- Verify new diseases are medically accurate
- Check symptom assignments make sense

---

*This system ensures the disease-symptom dataset stays current with evolving medical knowledge automatically.*
