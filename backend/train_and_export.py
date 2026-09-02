import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
import joblib

np.random.seed(42)

TYPES = [
    "Ventilator",
    "Infusion Pump",
    "Defibrillator",
    "Physiologic Monitoring System",
    "Radiographic System",
    "Sphygmomanometers"
]

MANUFACTURERS = [
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

n_samples = 2500

types_sample = np.random.choice(TYPES, n_samples)
mfgs_sample = np.random.choice(MANUFACTURERS, n_samples)
ages_sample = np.random.randint(0, 31, n_samples)
conditions_sample = np.random.choice([0, 1, 2], n_samples, p=[0.45, 0.35, 0.20])
operations_sample = np.random.choice([1, 2], n_samples, p=[0.55, 0.45])

base_months = 54.0 - (ages_sample * 1.3) - (conditions_sample * 12.5) - (operations_sample * 5.0)

type_modifiers = {
    "Ventilator": -4.0,
    "Infusion Pump": 2.0,
    "Defibrillator": -2.0,
    "Physiologic Monitoring System": 3.0,
    "Radiographic System": -5.0,
    "Sphygmomanometers": 6.0
}

for i in range(n_samples):
    base_months[i] += type_modifiers[types_sample[i]]

noise = np.random.normal(0, 2.5, n_samples)
months_to_failure = np.clip(base_months + noise, 2.0, 60.0).round(1)

df = pd.DataFrame({
    'TypeDescription': types_sample,
    'Manufacturer': mfgs_sample,
    'Age': ages_sample,
    'AssetCondition': conditions_sample,
    'Operations': operations_sample,
    'MonthsToFailure': months_to_failure
})

df.to_csv('medical_device_dataset.csv', index=False)
print("Saved medical_device_dataset.csv")

categorical_features = ['TypeDescription', 'Manufacturer']

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
    ],
    remainder='passthrough'
)

pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', GradientBoostingRegressor(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42))
])

X = df[['TypeDescription', 'Manufacturer', 'Age', 'AssetCondition', 'Operations']]
y = df['MonthsToFailure']

pipeline.fit(X, y)

joblib.dump(pipeline, 'medical_device_failure_prediction.pkl')
print("Saved medical_device_failure_prediction.pkl")
