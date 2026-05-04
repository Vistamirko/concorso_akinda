import csv
import json

csv_file = '/Users/mirko/Projects/Penny-concorsi-main/public/data/result.csv'
json_file = '/Users/mirko/Projects/Penny-concorsi-main/public/data/igcomment.json'

data = []
with open(csv_file, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        entry = {
            "Username": row["username"],
            "Date": row["commentDate"],
            "CommentText": row["comment"],
            "ProfileURL": row["profileUrl"]
        }
        data.append(entry)

json_file_scratch = '/Users/mirko/Projects/Penny-concorsi-main/scratch/igcomment.json'
with open(json_file_scratch, mode='w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Successfully saved to {json_file_scratch}")
