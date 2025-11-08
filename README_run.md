# Python Demos — Quick Start

These demos are intentionally simple and transparent so you can talk through them in interviews.

## 1) Create a virtual environment
```bash
python -m venv .venv
# Windows
. .venv/Scripts/activate
# macOS/Linux
source .venv/bin/activate
```

## 2) Install requirements
```bash
pip install -r requirements.txt
```

## 3) Run the demo app
```bash
streamlit run streamlit_app.py
```
Then open the URL Streamlit prints (usually http://localhost:8501).

## Demos Included
- **Financial Reporting Automation** — Upload a CSV of transactions; it computes a tidy table, KPIs, and a simple variance view.
- **Budget Forecast (toy model)** — Rolling 12‑month forecast using moving averages; adjustable seasonality factor to explain assumptions.
- **Process Transformation** — Enter cycle times across stages; calculates total lead time and highlights bottlenecks.

> These are designed as conversation starters. Extend them with real artifacts (Databricks notebook links, PBIX files, etc.).
