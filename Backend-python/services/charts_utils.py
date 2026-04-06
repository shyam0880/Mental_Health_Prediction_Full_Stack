import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64

# Helper to convert matplotlib plots to base64 strings
def plot_to_base64(fig):
    buf = BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    plt.close(fig)
    return base64.b64encode(buf.read()).decode('utf-8')

# Plot countplot (categorical counts)
def generate_countplot(df, column):
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.countplot(x=column, data=df, palette='hls', ax=ax)
    return plot_to_base64(fig)

# Plot histogram with KDE (numeric distribution)
def generate_histogram(series):
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.histplot(series.dropna(), kde=True, ax=ax)
    return plot_to_base64(fig)

# Plot correlation heatmap (numeric columns)
def generate_heatmap(df):
    corr = df.select_dtypes(include=['number']).corr()
    fig, ax = plt.subplots(figsize=(14, 8))
    sns.heatmap(corr, annot=True, fmt='.2f', ax=ax)
    return plot_to_base64(fig)