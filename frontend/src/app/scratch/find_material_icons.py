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
                # Find all occurrences of material-symbols-outlined
                matches = re.findall(r'class="[^"]*material-symbols-outlined[^"]*"', content)
                if matches:
                    results.append((path, len(matches)))
            except Exception as e:
                pass

for path, count in results:
    print(f"{path}: {count} occurrences")
