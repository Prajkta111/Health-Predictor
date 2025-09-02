from __future__ import annotations
import argparse
import os
import pickle
from pathlib import Path
from typing import Any

from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
from datetime import datetime, timezone
import json

# Map logical names to actual pickle/sav paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = BASE_DIR / 'Datasets'
SAV_DIR = DATASETS_DIR / 'sav files'
PKL_DIR = DATASETS_DIR / 'pkl'

MODEL_PATHS = {
    'heart': SAV_DIR / 'heart_disease_model.sav',
    'diabetes': SAV_DIR / 'diabetes_model.sav',
    'parkinsons': SAV_DIR / 'parkinsons_model.sav',
    'decision_tree': SAV_DIR / 'decision_tree_model.sav',
    'common': PKL_DIR / 'disease_prediction_model.pkl',
}


def load_pickle(path: Path) -> Any:
    if not path.is_file():
        raise FileNotFoundError(f"Model file not found: {path}")
    with open(path, 'rb') as f:
        return pickle.load(f)


def export_model(model_key: str, out_path: Path):
    model_path = MODEL_PATHS.get(model_key)
    if not model_path:
        raise ValueError(f"Unknown model key '{model_key}'. Choices: {sorted(MODEL_PATHS)}")
    model = load_pickle(model_path)
    if not hasattr(model, 'n_features_in_'):
        raise ValueError('Model object missing n_features_in_ attribute (needed for ONNX conversion)')
    n_features = getattr(model, 'n_features_in_')
    print(f"[export] Converting '{model_key}' model with {n_features} features -> ONNX")
    initial_type = [('input', FloatTensorType([None, n_features]))]
    onnx_model = convert_sklearn(model, initial_types=initial_type)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, 'wb') as f:
        f.write(onnx_model.SerializeToString())
    print(f"[export] Wrote ONNX model to {out_path}")


def export_multiple(model_keys: list[str], out_dir: Path, write_manifest: bool):
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_models = []
    for key in model_keys:
        target = out_dir / f"{key}.onnx"
        try:
            model_path = MODEL_PATHS.get(key)
            model = load_pickle(model_path) if model_path else None
            n_features = getattr(model, 'n_features_in_', None) if model else None
            export_model(key, target)
            manifest_models.append({
                'key': key,
                'file': target.name,
                'n_features': int(n_features) if isinstance(n_features, (int, float)) else None
            })
        except Exception as e:
            print(f"[export][WARN] Failed to export {key}: {e}")
    if write_manifest:
        manifest = {
            'generated_at': datetime.now(timezone.utc).isoformat(),
            'models': manifest_models
        }
        with open(out_dir / 'models_manifest.json', 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        print(f"[export] Wrote manifest with {len(manifest_models)} models -> {out_dir / 'models_manifest.json'}")


def main():
    parser = argparse.ArgumentParser(description='Export sklearn models to ONNX (single or multiple)')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--model', help='Single model key')
    group.add_argument('--models', nargs='+', help='List of model keys')
    group.add_argument('--all', action='store_true', help='Export all known model keys')
    parser.add_argument('--out', help='Single model ONNX output path (when using --model)')
    parser.add_argument('--out-dir', default='web/models', help='Output directory for multi/all export')
    parser.add_argument('--manifest', action='store_true', help='Write models_manifest.json (multi/all modes)')
    args = parser.parse_args()

    if args.model:
        out_path = Path(args.out or 'web/models/disease_model.onnx')
        export_model(args.model, out_path)
        return

    if args.models:
        export_multiple(args.models, Path(args.out_dir), args.manifest)
        return

    if args.all:
        export_multiple(sorted(MODEL_PATHS.keys()), Path(args.out_dir), args.manifest)
        return


if __name__ == '__main__':
    main()
