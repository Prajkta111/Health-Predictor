# 🚀 GitHub Actions Setup Guide

## 📋 Complete Setup Checklist

### ✅ 1. Repository Permissions
Go to your repository settings and configure:

**Settings → Actions → General:**
- ✅ **Workflow permissions**: "Read and write permissions"
- ✅ **Allow GitHub Actions to create and approve pull requests**: ✅ Enabled

### ✅ 2. Branch Protection (Optional but Recommended)
**Settings → Branches:**
- Add rule for `main` branch
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging

### ✅ 3. File Structure Verification
Ensure these files exist in your repository:
```
.github/workflows/monthly-disease-update.yml
ML/scraping/discover_diseases.py
ML/scraping/update.py
ML/scraping/disease.csv
ML/scraping/requirements.txt
ML/scraping/README.md
```

### ✅ 4. Test the Automation

#### Manual Test:
1. Go to **Actions** tab in your repository
2. Click **"Monthly Disease Discovery and Dataset Update"**
3. Click **"Run workflow"** 
4. Select options:
   - Force discovery: `true` (for testing)
5. Click **"Run workflow"**

#### Expected Results:
- ✅ Workflow completes successfully
- ✅ New diseases are discovered
- ✅ Pull request is created automatically
- ✅ Summary is posted in Actions logs

### ✅ 5. Monthly Schedule
The automation will run automatically:
- 📅 **When**: 1st day of every month
- 🕐 **Time**: 2:00 AM UTC
- 🔄 **Action**: Discover new diseases + update dataset

### ✅ 6. Monitoring Setup

#### Email Notifications:
**Settings → Notifications:**
- ✅ Enable notifications for workflow runs
- ✅ Get alerts when automation fails

#### Watch for:
- 📧 Monthly pull request notifications
- ⚠️ Failed workflow alerts
- 📊 Summary reports in Actions tab

---

## 🎯 Quick Commands for Testing

### Test Discovery Only:
```bash
cd ML/scraping
python discover_diseases.py
```

### Test Full Pipeline:
```bash
cd ML/scraping
python update.py --full-pipeline
```

### Test Update Only:
```bash
cd ML/scraping  
python update.py --update-only
```

---

## 🔧 Troubleshooting

### Common Issues:

**❌ "Permission denied" error:**
- Check repository permissions (Step 1)
- Ensure GITHUB_TOKEN has write access

**❌ "No new diseases found":**
- This is normal - means database is comprehensive
- Force discovery with manual trigger to test

**❌ "Workflow not running:**
- Check `.github/workflows/` directory exists
- Verify YAML syntax is correct
- Check Actions are enabled in repository

**❌ "Python dependencies error":**
- Check `requirements.txt` exists
- Verify package names are correct

---

## 📈 Success Metrics

### What Success Looks Like:
1. ✅ **Monthly automation runs** without manual intervention
2. ✅ **10-20 new diseases** discovered per month
3. ✅ **Pull requests created** automatically
4. ✅ **Dataset grows** consistently over time
5. ✅ **Zero maintenance** required for normal operation

### Monitoring Dashboard:
- **Actions tab**: View all workflow runs
- **Pull requests**: Review monthly updates
- **Insights**: Track automation performance

---

## 🎉 You're All Set!

Your automated disease discovery system is now:
- 🤖 **Fully automated** - runs monthly without intervention
- 📊 **Self-monitoring** - creates reports and summaries
- 🔄 **Self-updating** - keeps dataset current with medical knowledge
- 📋 **Audit-ready** - tracks all changes via pull requests

The system will discover new diseases every month and keep your medical dataset up-to-date automatically!
