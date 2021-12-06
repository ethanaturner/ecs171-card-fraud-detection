# ECS 171 — Group 10: Credit Card Fraud Detection

## Jupyter Notebooks

- `data_management_v2.ipynb` contains data analysis, feature engineering, and feature selection. It turns raw data into `data-stage2.csv`, which is used by other notebooks.
- For the Random Forest model, see `random_forest.ipynb`.
- For the Neural Network model, see `hyperparameter_tuning_v2.ipynb` and `cross_val_v2.ipynb`.

## Web App

The web application containing a React front-end and Flask backend is in `web-app` folder.

### Prerequisites

- Node.js v16+ with npm v8+
- Python with `flask`, `keras`, `numpy`, `pandas` installed

### Start the Web App

- Run `flask run` inside `./web-app/flask-server` to start the backend
- Run `npm install` and `npm run dev` inside `./web-app` to start the front-end
