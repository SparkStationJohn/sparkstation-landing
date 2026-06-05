import json
import os

def extract_all_tool_responses(log_path):
    responses = []
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('type') == 'TOOL_RESPONSE':
                    output = data.get('output', '')
                    if 'Dashboard.jsx' in output:
                        responses.append((data.get('step_index', -1), output))
            except:
                continue
    return responses

log_path = r"C:\Users\thisi\.gemini\antigravity\brain\fc64c65b-37d5-4476-824f-9f772735742d\.system_generated\logs\overview.txt"
res = extract_all_tool_responses(log_path)

print(f"Found {len(res)} responses")
for step, output in res:
    filename = f"fc64c65b_response_step_{step}.txt"
    with open(filename, "w", encoding='utf-8') as f:
        f.write(output)
    print(f"Saved {filename}")
