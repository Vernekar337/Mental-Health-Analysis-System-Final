import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("response.csv")

# Average scores
avg = df[['EaseOfUse','Accuracy','Insights','Overall']].mean()

plt.figure()
avg.plot(kind='bar')
plt.title("Average User Satisfaction Scores")
plt.ylabel("Score (1-5)")
plt.savefig("user_satisfaction.png")

# Distribution
plt.figure()
sns.histplot(df['Overall'], bins=5)
plt.title("Overall Satisfaction Distribution")
plt.savefig("satisfaction_distribution.png")

# Pie chart
plt.figure()
df['Overall'].value_counts().plot.pie(autopct='%1.1f%%')
plt.title("User Satisfaction Breakdown")
plt.savefig("satisfaction_pie.png")