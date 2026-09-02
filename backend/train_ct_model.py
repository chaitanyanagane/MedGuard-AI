import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import joblib
import os

np.random.seed(42)

n_samples = 3000

# Generating synthetic CT scanner telemetry data based on real physical correlations
scanner_age = np.random.uniform(0.5, 12.0, n_samples)
operating_hours = scanner_age * np.random.uniform(1800, 2500, n_samples)
scans_performed = operating_hours * np.random.uniform(2.5, 4.0, n_samples)
days_since_maint = np.random.randint(1, 180, n_samples)

tube_wear = np.clip((operating_hours / 25000.0) * 100 + np.random.normal(0, 8, n_samples), 5, 98)
heat_load = np.clip(tube_wear * 0.7 + np.random.uniform(10, 30, n_samples), 10, 99)
tube_arcs = np.clip((tube_wear / 10.0) ** 1.3 + np.random.poisson(2, n_samples), 0, 45).astype(int)
filament_current = np.clip(4.2 + (tube_wear / 100.0) * 1.2 + np.random.normal(0, 0.15, n_samples), 3.0, 5.8)
focal_spot_drift = np.clip((tube_wear / 100.0) * 0.9 + np.random.normal(0.1, 0.05, n_samples), 0.02, 1.45)

gantry_vibration = np.clip(0.05 + (operating_hours / 30000.0) * 0.8 + np.random.normal(0, 0.08, n_samples), 0.01, 1.85)
bearing_temp = np.clip(35.0 + gantry_vibration * 22.0 + np.random.normal(0, 3.0, n_samples), 22.0, 85.0)

detector_temp = np.clip(22.0 + (heat_load / 100.0) * 12.0 + np.random.normal(0, 1.5, n_samples), 18.0, 42.0)
detector_dropouts = np.clip((detector_temp > 35.0) * np.random.randint(1, 10, n_samples) + np.random.poisson(1, n_samples), 0, 18).astype(int)
snr = np.clip(40.0 - (detector_temp / 40.0) * 12.0 - (tube_wear / 100.0) * 8.0 + np.random.normal(0, 1.5, n_samples), 16.0, 44.0)

coolant_flow = np.clip(8.5 - (heat_load / 100.0) * 3.2 - (days_since_maint / 180.0) * 1.5 + np.random.normal(0, 0.4, n_samples), 1.2, 9.8)
coolant_temp = np.clip(25.0 + (heat_load / 100.0) * 25.0 - (coolant_flow / 10.0) * 10.0 + np.random.normal(0, 2.0, n_samples), 18.0, 58.0)
chiller_cycles = np.clip((coolant_temp / 50.0) * 120 + np.random.poisson(15, n_samples), 12, 185).astype(int)

voltage = np.clip(400.0 + np.random.normal(0, 8.0, n_samples), 365.0, 435.0)
ups_health = np.clip(99.0 - (scanner_age * 3.5) + np.random.normal(0, 3.0, n_samples), 52.0, 100.0)

warning_codes = np.clip((tube_arcs * 0.6 + (gantry_vibration > 0.5) * 4 + np.random.poisson(2, n_samples)).astype(int), 0, 28)
error_codes = np.clip(((tube_wear > 75) * 3 + (coolant_temp > 45) * 4 + (bearing_temp > 65) * 3 + np.random.poisson(1, n_samples)).astype(int), 0, 14)

# Formulate Target Health Score (0 to 100)
penalty = (
    (tube_wear * 0.30) +
    (heat_load * 0.15) +
    (tube_arcs * 0.8) +
    (gantry_vibration * 18.0) +
    (bearing_temp * 0.25) +
    (detector_dropouts * 1.5) +
    ((50.0 - coolant_flow * 5.0) * 0.2) +
    (error_codes * 3.0) +
    (warning_codes * 1.0)
)

health_score = np.clip(100.0 - penalty + np.random.normal(0, 2.0, n_samples), 5.0, 99.0).round(1)

# Derived RUL (days)
rul_days = np.clip(health_score * 3.4 + np.random.normal(0, 5, n_samples), 3.0, 365.0).round(0)

# Failure probability
failure_prob = np.clip(1.0 - (health_score / 100.0) + np.random.normal(0, 0.02, n_samples), 0.02, 0.98).round(2)

# Determine primary component at risk
components = ['X-Ray Tube Anode', 'Gantry Bearing', 'Coolant Loop Unit', 'Detector Array', 'High Voltage Power Supply']
component_at_risk = []
for i in range(n_samples):
    scores = [
        tube_wear[i] * 1.2 + tube_arcs[i] * 3,
        gantry_vibration[i] * 40 + bearing_temp[i] * 0.5,
        (10.0 - coolant_flow[i]) * 10 + coolant_temp[i],
        detector_dropouts[i] * 12 + (45.0 - snr[i]),
        error_codes[i] * 15 + (100.0 - ups_health[i]) * 0.5
    ]
    max_idx = int(np.argmax(scores))
    component_at_risk.append(components[max_idx])

df = pd.DataFrame({
    'ScannerAge': scanner_age.round(1),
    'OperatingHours': operating_hours.round(0),
    'ScansPerformed': scans_performed.round(0),
    'DaysSinceMaintenance': days_since_maint,
    'TubeWear': tube_wear.round(1),
    'HeatLoad': heat_load.round(1),
    'TubeArcs': tube_arcs,
    'FilamentCurrent': filament_current.round(2),
    'FocalSpotDrift': focal_spot_drift.round(2),
    'GantryVibration': gantry_vibration.round(2),
    'BearingTemperature': bearing_temp.round(1),
    'DetectorTemperature': detector_temp.round(1),
    'DetectorDropouts': detector_dropouts,
    'SNR': snr.round(1),
    'CoolantFlow': coolant_flow.round(1),
    'CoolantTemperature': coolant_temp.round(1),
    'ChillerCycles': chiller_cycles,
    'Voltage': voltage.round(1),
    'UPSHealth': ups_health.round(1),
    'WarningCodes': warning_codes,
    'ErrorCodes': error_codes,
    'HealthScore': health_score,
    'RULDays': rul_days,
    'FailureProbability': failure_prob,
    'ComponentAtRisk': component_at_risk
})

csv_path = os.path.join(os.path.dirname(__file__), '..', 'ct_scanner_telemetry_dataset.csv')
df.to_csv(csv_path, index=False)
print(f"Saved dataset to {csv_path}")

feature_cols = [
    'ScannerAge', 'OperatingHours', 'ScansPerformed', 'DaysSinceMaintenance',
    'TubeWear', 'HeatLoad', 'TubeArcs', 'FilamentCurrent', 'FocalSpotDrift',
    'GantryVibration', 'BearingTemperature', 'DetectorTemperature', 'DetectorDropouts',
    'SNR', 'CoolantFlow', 'CoolantTemperature', 'ChillerCycles', 'Voltage',
    'UPSHealth', 'WarningCodes', 'ErrorCodes'
]

X = df[feature_cols]

# Train Models
health_model = Pipeline([
    ('scaler', StandardScaler()),
    ('regressor', GradientBoostingRegressor(n_estimators=100, max_depth=5, random_state=42))
])
health_model.fit(X, df['HealthScore'])

rul_model = Pipeline([
    ('scaler', StandardScaler()),
    ('regressor', GradientBoostingRegressor(n_estimators=100, max_depth=5, random_state=42))
])
rul_model.fit(X, df['RULDays'])

comp_model = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42))
])
comp_model.fit(X, df['ComponentAtRisk'])

ct_pipeline = {
    'feature_cols': feature_cols,
    'health_model': health_model,
    'rul_model': rul_model,
    'comp_model': comp_model
}

model_path = os.path.join(os.path.dirname(__file__), '..', 'ct_scanner_failure_prediction.pkl')
joblib.dump(ct_pipeline, model_path)
print(f"Saved CT model pipeline to {model_path}")
