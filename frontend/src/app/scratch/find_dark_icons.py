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
                # Find occurrences of text-primary inside container classes
                # Check for div with container class and nested span with text-primary
                matches = re.finditer(r'<div[^>]*class="[^"]*(?:bg-primary-container|bg-secondary-container|bg-tertiary-container)[^"]*"[^>]*>\s*<span[^>]*class="[^"]*text-primary[^"]*"[^>]*>', content)
                for m in matches:
                    start_pos = m.start()
                    # Find line number
                    line_no = content[:start_pos].count("\n") + 1
                    results.append(f"{file}:{line_no}: {m.group(0).strip()}")
            except Exception as e:
                pass

for r in results:
    print(r)
