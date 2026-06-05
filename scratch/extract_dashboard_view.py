import json
import os

def extract_dashboard_view(log_path):
    views = []
    
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                step_index = data.get('step_index', -1)
                
                # Check for tool results
                if data.get('type') == 'TOOL_RESPONSE':
                    # TOOL_RESPONSE usually has the output of the tool
                    output = data.get('output', '')
                    if 'File Path:' in output and 'Dashboard.jsx' in output:
                        # This looks like a view_file output
                        views.append((step_index, output))
            except:
                continue
    
    return views

log_path = r"C:\Users\thisi\.gemini\antigravity\brain\fc64c65b-37d5-4476-824f-9f772735742d\.system_generated\logs\overview.txt"
views = extract_dashboard_view(log_path)

if views:
    print(f"Found {len(views)} views")
    for step, output in views:
        # Extract the code block
        if 'Showing lines' in output:
            lines = output.split('\n')
            code_lines = []
            start_collecting = False
            for l in lines:
                if l.startswith('1: '):
                    start_collecting = True
                if start_collecting:
                    # Remove the line number prefix "123: "
                    parts = l.split(': ', 1)
                    if len(parts) == 2:
                        code_lines.append(parts[1])
            
            if code_lines:
                filename = f"viewed_dashboard_step_{step}.jsx"
                with open(filename, "w", encoding='utf-8') as f:
                    f.write('\n'.join(code_lines))
                print(f"Saved {filename}")
else:
    print("Could not find view_file for Dashboard.jsx")
