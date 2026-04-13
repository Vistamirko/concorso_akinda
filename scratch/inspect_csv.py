import csv
import json

with open('/Users/mirko/Projects/Penny-concorsi-main/public/data/eurobet_wave1.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    records = []
    for i, row in enumerate(reader):
        records.append(row)
        if i >= 4:
            break

print(json.dumps(records, indent=2))
