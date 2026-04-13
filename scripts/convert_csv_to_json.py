import csv
import json
from datetime import datetime

csv_path = '/Users/mirko/Projects/Penny-concorsi-main/public/data/eurobet_wave1.csv'
json_path = '/Users/mirko/Projects/Penny-concorsi-main/public/data/eurobet-wave1.json'

def convert_date(date_str):
    try:
        # Handling format like 2026-04-13T05:31:40.047Z
        dt = datetime.strptime(date_str.split('.')[0].replace('Z', ''), '%Y-%m-%dT%H:%M:%S')
        return dt.strftime('%d/%m/%Y, %H:%M:%S')
    except:
        return date_str

with open(csv_path, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    json_data = []
    for row in reader:
        json_data.append({
            "UserId": row.get("ownerId", ""),
            "Username": row.get("username", ""),
            "CommentId": row.get("commentId", ""),
            "CommentText": row.get("comment", ""),
            "ProfileURL": row.get("profileUrl", ""),
            "ProfilePicURL": row.get("profilePictureUrl", ""),
            "Date": convert_date(row.get("commentDate", ""))
        })

with open(json_path, mode='w', encoding='utf-8') as f:
    json.dump(json_data, f, indent=2)

print(f"Converted {len(json_data)} records to {json_path}")
