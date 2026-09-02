import os
import joblib
import pandas as pd
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import io

# Global model pipelines
general_model_pipeline = None
ct_model_pipeline = None

MODEL1_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "medical_device_failure_prediction.pkl")
)
MODEL2_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "ct_scanner_failure_prediction.pkl")
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    global general_model_pipeline, ct_model_pipeline
    print(f"Loading Model 1 (General Equipment) from: {MODEL1_PATH}")
    if os.path.exists(MODEL1_PATH):
        general_model_pipeline = joblib.load(MODEL1_PATH)
        print("Model 1 pipeline loaded successfully.")
    else:
        print(f"Warning: Model 1 file not found at {MODEL1_PATH}")

    print(f"Loading Model 2 (CT Scanner) from: {MODEL2_PATH}")
    if os.path.exists(MODEL2_PATH):
        ct_model_pipeline = joblib.load(MODEL2_PATH)
        print("Model 2 CT pipeline loaded successfully.")
    else:
        print(f"Warning: Model 2 CT file not found at {MODEL2_PATH}")

    yield
    print("Shutting down FastAPI application.")

app = FastAPI(
    title="MedGuard AI Command Center API",
    description="FastAPI dual-model serving backend for Cognizant Medical Equipment Failure Prediction & CT Scanner Diagnostics",
    version="3.0.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allowed options for Model 1
ALLOWED_TYPES = [
    "Ventilator",
    "Infusion Pump",
    "Defibrillator",
    "Physiologic Monitoring System",
    "Radiographic System",
    "Sphygmomanometers"
]

ALLOWED_MANUFACTURERS = [
    "GE Healthcare",
    "Koninklijke Philips N.V.",
    "Siemens Healthineers",
    "Medtronic",
    "Drager Medical AG & Co KGaA",
    "B. Braun Melsungen AG",
    "Baxter Healthcare Corp",
    "Datex-Ohmeda Inc",
    "Physio-Control Inc",
    "Nihon Kohden Corp",
    "Omron Healthcare Co Ltd",
    "Welch Allyn Inc",
    "Canon Inc (Toshiba Medical)",
    "Blease Medical Equipment Ltd",
    "Med-Vantage Sdn Bhd"
]

class PredictRequest(BaseModel):
    TypeDescription: str = Field(..., description="Device Type Category")
    Manufacturer: str = Field(..., description="Device Manufacturer")
    Age: int = Field(..., ge=0, le=30, description="Device age in years (0-30)")
    AssetCondition: int = Field(..., description="0=Good, 1=Fair, 2=Poor")
    Operations: int = Field(..., description="1=Single shift, 2=Multi-shift / continuous use")

class PredictResponse(BaseModel):
    months_to_failure: float

class CTPredictRequest(BaseModel):
    ScannerId: Optional[str] = "CT-017"
    ScannerAge: float = Field(..., ge=0, le=30)
    OperatingHours: float = Field(..., ge=0)
    ScansPerformed: float = Field(..., ge=0)
    DaysSinceMaintenance: int = Field(..., ge=0)
    TubeWear: float = Field(..., ge=0, le=100)
    HeatLoad: float = Field(..., ge=0, le=100)
    TubeArcs: int = Field(..., ge=0)
    FilamentCurrent: float = Field(..., ge=0)
    FocalSpotDrift: float = Field(..., ge=0)
    GantryVibration: float = Field(..., ge=0)
    BearingTemperature: float = Field(..., ge=0)
    DetectorTemperature: float = Field(..., ge=0)
    DetectorDropouts: int = Field(..., ge=0)
    SNR: float = Field(..., ge=0)
    CoolantFlow: float = Field(..., ge=0)
    CoolantTemperature: float = Field(..., ge=0)
    ChillerCycles: int = Field(..., ge=0)
    Voltage: float = Field(..., ge=0)
    UPSHealth: float = Field(..., ge=0, le=100)
    WarningCodes: int = Field(..., ge=0)
    ErrorCodes: int = Field(..., ge=0)

class CTPredictResponse(BaseModel):
    scanner_id: str
    health_score: float
    risk_level: str
    rul_days: float
    primary_component_at_risk: str
    failure_probability: float

@app.get("/health")
def get_health():
    return {
        "status": "ok",
        "general_model_loaded": general_model_pipeline is not None,
        "ct_model_loaded": ct_model_pipeline is not None
    }

@app.get("/options")
def get_options():
    return {
        "type_description": ALLOWED_TYPES,
        "manufacturers": ALLOWED_MANUFACTURERS,
        "asset_conditions": [
            {"label": "Good", "value": 0},
            {"label": "Fair", "value": 1},
            {"label": "Poor", "value": 2}
        ],
        "operations": [
            {"label": "Single Shift", "value": 1},
            {"label": "Multi-shift / Continuous Use", "value": 2}
        ]
    }

@app.get("/ct-options")
def get_ct_options():
    return {
        "scanner_ids": ["CT-004", "CT-017", "CT-029", "CT-042", "CT-058"],
        "scenarios": {
            "healthy": {
                "ScannerAge": 2.5,
                "OperatingHours": 4200,
                "ScansPerformed": 14500,
                "DaysSinceMaintenance": 24,
                "TubeWear": 22.0,
                "HeatLoad": 35.0,
                "TubeArcs": 1,
                "FilamentCurrent": 4.3,
                "FocalSpotDrift": 0.12,
                "GantryVibration": 0.08,
                "BearingTemperature": 38.0,
                "DetectorTemperature": 24.5,
                "DetectorDropouts": 1,
                "SNR": 38.5,
                "CoolantFlow": 7.8,
                "CoolantTemperature": 28.0,
                "ChillerCycles": 45,
                "Voltage": 402.0,
                "UPSHealth": 98.0,
                "WarningCodes": 1,
                "ErrorCodes": 0
            },
            "degrading": {
                "ScannerAge": 6.8,
                "OperatingHours": 15400,
                "ScansPerformed": 48200,
                "DaysSinceMaintenance": 85,
                "TubeWear": 68.0,
                "HeatLoad": 72.0,
                "TubeArcs": 8,
                "FilamentCurrent": 5.1,
                "FocalSpotDrift": 0.58,
                "GantryVibration": 0.42,
                "BearingTemperature": 58.0,
                "DetectorTemperature": 32.0,
                "DetectorDropouts": 6,
                "SNR": 27.5,
                "CoolantFlow": 4.8,
                "CoolantTemperature": 41.0,
                "ChillerCycles": 115,
                "Voltage": 394.0,
                "UPSHealth": 82.0,
                "WarningCodes": 9,
                "ErrorCodes": 3
            },
            "critical": {
                "ScannerAge": 9.5,
                "OperatingHours": 24800,
                "ScansPerformed": 82000,
                "DaysSinceMaintenance": 160,
                "TubeWear": 89.0,
                "HeatLoad": 92.0,
                "TubeArcs": 24,
                "FilamentCurrent": 5.7,
                "FocalSpotDrift": 1.25,
                "GantryVibration": 1.15,
                "BearingTemperature": 78.5,
                "DetectorTemperature": 39.8,
                "DetectorDropouts": 14,
                "SNR": 18.2,
                "CoolantFlow": 2.1,
                "CoolantTemperature": 54.0,
                "ChillerCycles": 168,
                "Voltage": 372.0,
                "UPSHealth": 64.0,
                "WarningCodes": 22,
                "ErrorCodes": 11
            }
        }
    }

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    if general_model_pipeline is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="General equipment prediction model is not initialized."
        )

    try:
        input_data = pd.DataFrame([{
            'TypeDescription': request.TypeDescription,
            'Manufacturer': request.Manufacturer,
            'Age': request.Age,
            'AssetCondition': request.AssetCondition,
            'Operations': request.Operations
        }])
        prediction_val = float(general_model_pipeline.predict(input_data)[0])
        months = round(max(0.5, prediction_val), 1)
        return PredictResponse(months_to_failure=months)
    except Exception as e:
        print(f"Prediction Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate prediction from Model 1."
        )

def _eval_ct(input_dict: dict, scanner_id: str = "CT-017") -> CTPredictResponse:
    feature_cols = [
        'ScannerAge', 'OperatingHours', 'ScansPerformed', 'DaysSinceMaintenance',
        'TubeWear', 'HeatLoad', 'TubeArcs', 'FilamentCurrent', 'FocalSpotDrift',
        'GantryVibration', 'BearingTemperature', 'DetectorTemperature', 'DetectorDropouts',
        'SNR', 'CoolantFlow', 'CoolantTemperature', 'ChillerCycles', 'Voltage',
        'UPSHealth', 'WarningCodes', 'ErrorCodes'
    ]
    
    row = {col: input_dict.get(col, 0.0) for col in feature_cols}
    df = pd.DataFrame([row])

    if ct_model_pipeline is not None:
        health_score = float(ct_model_pipeline['health_model'].predict(df)[0])
        rul_days = float(ct_model_pipeline['rul_model'].predict(df)[0])
        comp = str(ct_model_pipeline['comp_model'].predict(df)[0])
    else:
        # Fallback local calculation matching trained physics formula
        tw = row['TubeWear']
        gv = row['GantryVibration']
        cf = row['CoolantFlow']
        ec = row['ErrorCodes']
        penalty = (tw * 0.35) + (gv * 20.0) + ((10.0 - cf) * 3.0) + (ec * 4.0)
        health_score = max(5.0, min(99.0, 100.0 - penalty))
        rul_days = round(health_score * 3.4, 0)
        comp = "X-Ray Tube Anode" if tw > 60 else "Coolant Loop Unit" if cf < 4.0 else "Gantry Bearing"

    health_score = round(max(0.0, min(100.0, health_score)), 1)
    rul_days = round(max(1.0, min(365.0, rul_days)), 0)
    failure_prob = round(max(0.01, min(0.99, 1.0 - (health_score / 100.0))), 2)

    if health_score >= 80.0:
        risk_level = "LOW"
    elif health_score >= 60.0:
        risk_level = "MEDIUM"
    elif health_score >= 40.0:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"

    return CTPredictResponse(
        scanner_id=scanner_id,
        health_score=health_score,
        risk_level=risk_level,
        rul_days=rul_days,
        primary_component_at_risk=comp,
        failure_probability=failure_prob
    )

@app.post("/predict-ct", response_model=CTPredictResponse)
def predict_ct(request: CTPredictRequest):
    try:
        data = request.model_dump()
        scanner_id = data.pop("ScannerId", "CT-017")
        return _eval_ct(data, scanner_id=scanner_id)
    except Exception as e:
        print(f"CT Prediction Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate CT scanner prediction."
        )

@app.post("/upload-ct-telemetry", response_model=CTPredictResponse)
async def upload_ct_telemetry(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV telemetry files are accepted."
        )
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        if df.empty:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CSV file is empty.")
        
        row_dict = df.iloc[0].to_dict()
        scanner_id = str(row_dict.get("ScannerId", file.filename.replace('.csv', '')))
        return _eval_ct(row_dict, scanner_id=scanner_id)
    except Exception as e:
        print(f"CSV Telemetry Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid telemetry CSV file: {str(e)}"
        )

