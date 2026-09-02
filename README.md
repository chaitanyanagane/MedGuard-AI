# MedGuard AI — Medical Equipment Failure Prediction
> **Cognizant Healthcare Hackathon Project**
> Tagline: *Predict. Prevent. Protect.*

MedGuard AI is an enterprise-grade medical equipment failure prediction and predictive maintenance intelligence platform. It estimates the remaining months before a medical device is likely to fail (`MonthsToFailure`), empowering clinical engineering teams to prioritize preventive maintenance and eliminate unexpected downtime.

---

## 🎯 Problem Statement & Core Narrative

**Cognizant Hackathon Track**: Healthcare / Medical Equipment Reliability

Instead of waiting for a medical device to fail, **MedGuard AI** predicts remaining useful life (in months) from device characteristics and operational patterns:

```
DEVICE INFORMATION → ML PREDICTION → MONTHS TO FAILURE → DERIVED MAINTENANCE PRIORITY → RECOMMENDED ACTION
```

---

## 🤖 Trained ML Model Contract

The project uses a trained **scikit-learn Pipeline** saved in `medical_device_failure_prediction.pkl` consisting of a `ColumnTransformer` preprocessor and tuned `XGBRegressor` / `GradientBoostingRegressor`.

### Exact Model Inputs (5 Attributes)
1. **`TypeDescription`**: Categorical (`Ventilator`, `Infusion Pump`, `Defibrillator`, `Physiologic Monitoring System`, `Radiographic System`, `Sphygmomanometers`)
2. **`Manufacturer`**: Categorical (`GE Healthcare`, `Koninklijke Philips N.V.`, `Siemens Healthineers`, `Medtronic`, `Drager Medical AG & Co KGaA`, `B. Braun Melsungen AG`, `Baxter Healthcare Corp`, `Datex-Ohmeda Inc`, `Physio-Control Inc`, `Nihon Kohden Corp`, `Omron Healthcare Co Ltd`, `Welch Allyn Inc`, `Canon Inc (Toshiba Medical)`, `Blease Medical Equipment Ltd`, `Med-Vantage Sdn Bhd`)
3. **`Age`**: Integer (0–30 years)
4. **`AssetCondition`**: Ordinal Integer (`0` = Good, `1` = Fair, `2` = Poor)
5. **`Operations`**: Ordinal Integer (`1` = Single shift, `2` = Multi-shift / continuous use)

### Model Output & Derived Risk Thresholds
- **Primary Model Output**: `months_to_failure` (float, range ~2–60 months, median ~23 months).
- **Derived Maintenance Priority**:
  - `< 6 months`: **CRITICAL / URGENT** (Red) — *Prioritize immediate equipment inspection.*
  - `6–18 months`: **ATTENTION** (Amber) — *Schedule preventive inspection within predicted window.*
  - `> 18 months`: **ROUTINE** (Green) — *Continue routine monitoring.*

---

## 🏗️ Architecture & Project Structure

```
Cognizant Hackathon/
├── backend/
│   ├── main.py                     # FastAPI model-serving API
│   ├── requirements.txt            # FastAPI, uvicorn, pydantic, pandas, scikit-learn, joblib
│   └── train_and_export.py         # Model pipeline generator script
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Navigation header
│   │   ├── DashboardView.jsx       # Medical Equipment Intelligence Dashboard
│   │   ├── PredictView.jsx         # Failure Risk Predictor (2-col desktop layout)
│   │   ├── DevicesView.jsx         # Medical Devices Explorer
│   │   ├── HistoryView.jsx         # Prediction History (localStorage)
│   │   ├── AnalyticsView.jsx       # Failure Timeline & Regression Analytics
│   │   ├── ReportsView.jsx         # Compliance & Inspection Reports
│   │   ├── SettingsView.jsx        # API & Risk Threshold Configuration
│   │   └── DeviceDetailView.jsx    # Device detail modal & timeline
│   ├── lib/
│   │   └── api.ts                  # API facade connecting frontend to FastAPI backend
│   └── App.jsx                     # Root application container
├── medical_device_failure_prediction.pkl # Trained Scikit-Learn / XGBoost Pipeline
├── medical_device_dataset.csv      # Dataset CSV
└── README.md
```

---

## 🚀 How to Run locally

### Terminal 1: Backend (FastAPI Model Service)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- Backend API running at: `http://localhost:8000`
- API Docs (Swagger UI): `http://localhost:8000/docs`

### Terminal 2: Frontend (React 19 + Vite)
```bash
npm install
npm run dev
```
- Frontend running at: `http://localhost:5173` (or `http://localhost:3000`)

---

## 📡 API Endpoints

- `GET /health` — Check server & model status (`{"status": "ok", "model_loaded": true}`)
- `GET /options` — Retrieve valid dropdown options for inputs
- `POST /predict` — Submit device profile to receive `months_to_failure`

#### Sample Prediction Request:
```json
POST /predict
Content-Type: application/json

{
  "TypeDescription": "Ventilator",
  "Manufacturer": "GE Healthcare",
  "Age": 8,
  "AssetCondition": 1,
  "Operations": 2
}
```

#### Sample Prediction Response:
```json
{
  "months_to_failure": 15.2
}
```

---

## 🎬 2-Minute Demo Workflow for Hackathon Judges

1. **Dashboard**: Show *"Medical Equipment Intelligence"* overview, 4 KPI cards, and *"Predicted Failure Timeline"*.
2. **Predict**: Click **"Predict Failure Timeline"** in header.
3. **Submit Device Info**: Select `Ventilator`, `GE Healthcare`, `8 years`, `Fair`, `Multi-shift`.
4. **View Outcome**: Click **"Predict Failure Timeline"** button.
5. **Inspect Output**: Highlight `15.2 MONTHS` display, `ATTENTION` derived priority, visual timeline marker, recommended action, and model transparency diagram.
6. **History & Reports**: Show saved local prediction history and regulatory PDF export capability.
