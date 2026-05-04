import csv
import json

csv_file = '/Users/mirko/Projects/Penny-concorsi-main/public/data/export_20260504-143724.csv'
json_file = '/Users/mirko/Projects/Penny-concorsi-main/public/data/fbcomment.json'

data = []
with open(csv_file, mode='r', encoding='utf-8') as f:
    # Skip potential BOM if present
    content = f.read()
    if content.startswith('\ufeff'):
        content = content[1:]
    
    lines = content.splitlines()
    reader = csv.reader(lines)
    header = next(reader)
    
    # Mapping based on observation:
    # Name is at index 2
    # Date is at index 4
    # Comment is at index 7
    
    for row in reader:
        if len(row) < 8:
            continue
        entry = {
            "Name": row[2],
            "Data": row[4],
            "Comment": row[7]
        }
        data.append(entry)

print(json.dumps(data, indent=2, ensure_ascii=False))
