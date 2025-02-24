import os
import pandas as pd

# Define directory path
folder = "IWWRMP/Data/Suggestion"

# Find all CSV files starting with 'suggestion_'
csv_files = [f for f in os.listdir(folder) if f.startswith("suggestion_") and f.endswith(".csv")]

if not csv_files:
    print("No new files to merge.")
    exit()

# Load the existing suggestion.csv (if it exists), or create an empty DataFrame
suggestion_csv_path = os.path.join(folder, "suggestion.csv")

if os.path.exists(suggestion_csv_path):
    existing_df = pd.read_csv(suggestion_csv_path)
else:
    existing_df = pd.DataFrame()  # If no existing file, start with an empty DataFrame

# Read and merge the new CSV files
df_list = [pd.read_csv(os.path.join(folder, file)) for file in csv_files]
merged_df = pd.concat([existing_df] + df_list, ignore_index=True)

# Remove duplicates if needed
merged_df.drop_duplicates(inplace=True)

# Save the merged CSV back to suggestion.csv
merged_df.to_csv(suggestion_csv_path, index=False)

# Delete individual CSV files after merging
for file in csv_files:
    os.remove(os.path.join(folder, file))

print(f"Merged {len(csv_files)} files into {suggestion_csv_path} and removed individual files.")
