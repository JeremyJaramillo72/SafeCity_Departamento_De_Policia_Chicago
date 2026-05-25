import os
import re

src_dir = r"c:\Users\ASUS\Documents\safecity_project\frontend\src"

results = []
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                # Find occurrences of bg-primary-container or similar containers
                lines = content.splitlines()
                for i, line in enumerate(lines):
                    if "bg-primary-container" in line or "bg-tertiary-container" in line or "bg-secondary-container" in line:
                        results.append(f"{file}:{i+1}: {line.strip()}")
            except Exception as e:
                pass

for r in results:
    print(r)
