import os

path = r'backend/logic.py'
if not os.path.exists(path):
    # Try absolute path if relative fails
    path = r'c:/Pankaj/Projects/Antigravity/Insurance-Gemini/backend/logic.py'

print(f"Opening {path}")
with open(path, 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

# Line numbers are 0-indexed in the list, so line 154 is index 153
# And line 323 is index 322 (if lines didn't shift)

# Let's search for the icon lines to be sure
for i, line in enumerate(lines):
    if '"icon":' in line:
        if i == 153 or (150 < i < 160):
            print(f"Found icon at line {i+1}: {line.strip()}")
            lines[i] = '        "icon": "\U0001F680" if life_cover_amount > 10000000 else "\U0001F6E1\uFE0F",\n'
        elif i == 322 or (315 < i < 330):
            print(f"Found icon in prompt at line {i+1}: {line.strip()}")
            lines[i] = '  "icon": "\U0001F680" or "\U0001F6E1\uFE0F" or "\U0001F4BC"\n'

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Replacement successful.")
