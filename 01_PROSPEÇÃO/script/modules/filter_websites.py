import pandas as pd

INPUT = "leads_enriched.csv"

OUTPUT_WITH = "leads_with_websites.csv"
OUTPUT_NO = "leads_with_no_websites.csv"

df = pd.read_csv(INPUT)

# 🧠 garantir consistência (evita strings vazias)
has_website = df["website"].notna() & (df["website"].str.strip() != "")

df_with = df[has_website]
df_no = df[~has_website]

df_with.to_csv(OUTPUT_WITH, index=False)
df_no.to_csv(OUTPUT_NO, index=False)

print("================================")
print(f"✅ Com website: {len(df_with)}")
print(f"🚫 Sem website: {len(df_no)}")
print("💾 ficheiros gerados:")
print(f"   - {OUTPUT_WITH}")
print(f"   - {OUTPUT_NO}")
print("================================")