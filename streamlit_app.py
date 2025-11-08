import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

st.set_page_config(page_title="Finance Demos", page_icon="📊", layout="wide")

st.title("Finance Transformation — Python Demos")

tabs = st.tabs(["📈 Financial Reporting Automation", "📉 Budget Forecast (toy)", "🧩 Process Transformation"])

with tabs[0]:
    st.subheader("Financial Reporting Automation")
    st.write("""Upload a CSV with columns like `date, dept, gl_account, amount`.
    We'll tidy it, compute KPIs, and show a simple variance chart.""")

    upl = st.file_uploader("Upload CSV", type=["csv"], key="upl1")
    if upl is None:
        st.info("No file uploaded yet — using sample_financials.csv")
        df = pd.read_csv("sample_financials.csv")
    else:
        df = pd.read_csv(upl)

    # Basic clean
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    monthly = df.groupby(pd.Grouper(key='date', freq='MS'))['amount'].sum().reset_index()

    # KPIs
    latest = monthly.iloc[-1]['amount']
    prev = monthly.iloc[-2]['amount'] if len(monthly) > 1 else np.nan
    mom = ((latest - prev) / prev * 100) if pd.notna(prev) and prev != 0 else np.nan

    col1, col2, col3 = st.columns(3)
    col1.metric("Latest Month", f"${latest:,.0f}")
    col2.metric("Prev Month", f"${prev:,.0f}" if pd.notna(prev) else "—")
    col3.metric("MoM Change", f"{mom:+.1f}%" if pd.notna(mom) else "—")

    # Chart (matplotlib, single plot, no style/colors set)
    fig = plt.figure()
    plt.plot(monthly['date'], monthly['amount'])
    plt.title("Monthly Amount")
    plt.xlabel("Date"); plt.ylabel("Amount")
    st.pyplot(fig)

    st.dataframe(df.head(20))

with tabs[1]:
    st.subheader("Budget Forecast (rolling MA)")
    st.write("""We use a simple rolling average as a transparent baseline forecast.
    Adjust the window and a seasonality factor to demonstrate assumptions.""")
    window = st.slider("Rolling window (months)", 2, 12, 6)
    seasonality = st.slider("Seasonality factor", 0.8, 1.2, 1.0, step=0.05)

    df = pd.read_csv("sample_financials.csv")
    df['date'] = pd.to_datetime(df['date'])
    monthly = df.groupby(pd.Grouper(key='date', freq='MS'))['amount'].sum().reset_index()
    monthly['forecast'] = monthly['amount'].rolling(window).mean() * seasonality

    fig2 = plt.figure()
    plt.plot(monthly['date'], monthly['amount'], label="Actual")
    plt.plot(monthly['date'], monthly['forecast'], label="Forecast")
    plt.title("Rolling Average Forecast")
    plt.xlabel("Date"); plt.ylabel("Amount")
    plt.legend()
    st.pyplot(fig2)

    st.dataframe(monthly.tail(12))

with tabs[2]:
    st.subheader("Process Transformation — Cycle Time")
    st.write("""Enter stage durations to visualize total lead time and the bottleneck. 
    Use this in conversations about Q2C improvements, approvals, and automation.""")

    stages = ["Intake", "Validation", "Approval", "Execution", "Close"]
    vals = [st.number_input(f"{s} (days)", min_value=0.0, value=v) 
            for s, v in zip(stages, [2.0, 3.0, 5.0, 4.0, 2.0])]
    total = sum(vals)
    bottleneck_idx = int(np.argmax(vals))

    c1, c2 = st.columns(2)
    c1.metric("Total Lead Time (days)", f"{total:.1f}")
    c2.metric("Bottleneck Stage", stages[bottleneck_idx])

    # Bar chart
    fig3 = plt.figure()
    plt.bar(stages, vals)
    plt.title("Stage Durations")
    plt.xlabel("Stage"); plt.ylabel("Days")
    st.pyplot(fig3)

    st.write("""**How to use this in interviews:** discuss how you'd reduce the bottleneck with
    automation (rules, templates), parallelization, or clearer SLAs—and tie it to measurable KPIs.""")
