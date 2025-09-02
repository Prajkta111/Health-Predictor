#!/usr/bin/env python3
"""
Simple file structure checker for Health Predictor ML Integration
"""

from pathlib import Path
import json

def check_integration_setup():
    """Check if all required files are in place"""
    print("🔬 Health Predictor ML Integration Setup Check")
    print("=" * 60)
    
    base_dir = Path(__file__).parent
    issues = []
    
    # 1. Check ONNX models
    print("\n📊 ONNX Models:")
    onnx_dir = base_dir / 'web' / 'models'
    if onnx_dir.exists():
        onnx_files = list(onnx_dir.glob('*.onnx'))
        manifest_file = onnx_dir / 'models_manifest.json'
        
        print(f"   ✅ Models directory: {onnx_dir}")
        print(f"   ✅ ONNX files: {len(onnx_files)}")
        for file in onnx_files:
            print(f"      - {file.name} ({file.stat().st_size // 1024} KB)")
        
        if manifest_file.exists():
            with open(manifest_file) as f:
                manifest = json.load(f)
            print(f"   ✅ Manifest: {len(manifest['models'])} models")
        else:
            issues.append("Missing models_manifest.json")
    else:
        issues.append("ONNX models directory not found")
    
    # 2. Check original ML models
    print("\n🧠 Original ML Models:")
    pkl_dir = base_dir / 'Datasets' / 'pkl'
    sav_dir = base_dir / 'Datasets' / 'sav files'
    
    pkl_files = list(pkl_dir.glob('*.pkl')) if pkl_dir.exists() else []
    sav_files = list(sav_dir.glob('*.sav')) if sav_dir.exists() else []
    
    print(f"   ✅ PKL files: {len(pkl_files)}")
    for file in pkl_files:
        print(f"      - {file.name}")
    
    print(f"   ✅ SAV files: {len(sav_files)}")
    for file in sav_files:
        print(f"      - {file.name}")
    
    # 3. Check API files
    print("\n🌐 API Integration:")
    api_route = base_dir / 'web' / 'app' / 'api' / 'predict' / 'route.ts'
    examples_file = base_dir / 'web' / 'lib' / 'ml-api-examples.ts'
    python_service = base_dir / 'ml_service.py'
    
    if api_route.exists():
        print(f"   ✅ Next.js API route: {api_route.name}")
    else:
        issues.append("Missing Next.js API route")
    
    if examples_file.exists():
        print(f"   ✅ API examples: {examples_file.name}")
    else:
        issues.append("Missing API examples")
    
    if python_service.exists():
        print(f"   ✅ Python fallback service: {python_service.name}")
    else:
        issues.append("Missing Python service")
    
    # 4. Check dependencies
    print("\n📦 Dependencies:")
    package_json = base_dir / 'web' / 'package.json'
    requirements_txt = base_dir / 'requirements.txt'
    
    if package_json.exists():
        with open(package_json) as f:
            pkg = json.load(f)
        has_onnx = 'onnxruntime-web' in pkg.get('dependencies', {})
        print(f"   ✅ package.json exists")
        print(f"   {'✅' if has_onnx else '❌'} onnxruntime-web: {'installed' if has_onnx else 'missing'}")
        if not has_onnx:
            issues.append("onnxruntime-web not in package.json")
    else:
        issues.append("Missing package.json")
    
    if requirements_txt.exists():
        print(f"   ✅ requirements.txt exists")
    else:
        issues.append("Missing requirements.txt")
    
    # 5. Summary
    print("\n" + "=" * 60)
    if issues:
        print("❌ Issues found:")
        for issue in issues:
            print(f"   - {issue}")
        print("\n💡 Run the setup commands in README.md to fix issues")
    else:
        print("✅ All files are in place!")
        print("\n🚀 Ready to use:")
        print("   1. cd web && npm run dev")
        print("   2. python ml_service.py (for fallback)")
        print("   3. Test API: POST /api/predict")
    
    print("\n📖 See README.md for detailed usage instructions")

if __name__ == '__main__':
    check_integration_setup()
