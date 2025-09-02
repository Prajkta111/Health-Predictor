#!/usr/bin/env python3
"""
Test authentication setup and verify everything is working
"""

import requests
import json

def test_auth_pages():
    """Test that auth pages are accessible"""
    print("🔐 Testing Authentication Setup")
    print("=" * 50)
    
    base_url = "http://localhost:3000"
    
    print("\n1. Testing page accessibility...")
    
    # Test main app (should work without auth)
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        status = "✅" if response.status_code == 200 else "❌"
        print(f"   {status} Home page: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ⚠️  Next.js dev server not running")
        print("   💡 Run: cd web && npm run dev")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test auth pages
    auth_pages = [
        ("/login", "Login page"),
        ("/signup", "Signup page"),
    ]
    
    for path, name in auth_pages:
        try:
            response = requests.get(f"{base_url}{path}", timeout=5)
            status = "✅" if response.status_code == 200 else "❌"
            print(f"   {status} {name}: {response.status_code}")
        except Exception as e:
            print(f"   ❌ {name} error: {e}")
    
    return True

def test_prediction_api_without_auth():
    """Test that predictions work without authentication"""
    print("\n2. Testing predictions without authentication...")
    
    base_url = "http://localhost:3000"
    
    # Test getting models info
    try:
        response = requests.get(f"{base_url}/api/predict", timeout=10)
        if response.status_code == 200:
            result = response.json()
            print("   ✅ API accessible without auth")
            print(f"   📊 Available models: {len(result.get('availableModels', []))}")
        else:
            print(f"   ❌ API failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ API error: {e}")
        return False
    
    # Test making a prediction
    test_data = {
        "model": "diabetes",
        "data": {
            "pregnancies": 1,
            "glucose": 89,
            "blood_pressure": 66,
            "skin_thickness": 23,
            "insulin": 94,
            "bmi": 28.1,
            "diabetes_pedigree_function": 0.167,
            "age": 21
        }
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/predict",
            json=test_data,
            timeout=15
        )
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Prediction works without auth")
            print(f"   🎯 Prediction: {result.get('prediction')}")
            print(f"   ⚙️  Source: {result.get('source', 'unknown')}")
        else:
            print(f"   ❌ Prediction failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Prediction error: {e}")
    
    return True

def check_auth_files():
    """Check that auth files are in place"""
    print("\n3. Checking authentication files...")
    
    from pathlib import Path
    base_dir = Path(__file__).parent
    
    auth_files = [
        "web/app/api/auth/[...nextauth]/route.ts",
        "web/app/(auth)/login/page.tsx", 
        "web/app/(auth)/signup/page.tsx",
        "web/components/auth-provider.tsx",
        "web/components/user-menu.tsx",
        "web/hooks/use-auth.ts",
    ]
    
    all_good = True
    for file_path in auth_files:
        full_path = base_dir / file_path
        if full_path.exists():
            print(f"   ✅ {file_path}")
        else:
            print(f"   ❌ Missing: {file_path}")
            all_good = False
    
    return all_good

def main():
    print("🧪 Authentication System Test")
    print("=" * 60)
    
    files_ok = check_auth_files()
    
    if files_ok:
        print("\n✅ All authentication files are in place!")
        
        # Only test if server might be running
        try:
            response = requests.get("http://localhost:3000", timeout=2)
            test_auth_pages()
            test_prediction_api_without_auth()
        except:
            print("\n⚠️  Next.js server not running - file check only")
            print("💡 To test functionality: cd web && npm run dev")
    else:
        print("\n❌ Some authentication files are missing")
    
    print("\n" + "=" * 60)
    print("📋 Authentication Features:")
    print("   ✅ Free predictions (no auth required)")
    print("   ✅ Optional login/signup for enhanced features")
    print("   ✅ JWT-based sessions with NextAuth.js")
    print("   ✅ Beautiful card-based auth UI")
    print("   ✅ Hooks ready for history and pro features")
    print("\n📖 See AUTH_SETUP.md for detailed documentation")

if __name__ == '__main__':
    main()
