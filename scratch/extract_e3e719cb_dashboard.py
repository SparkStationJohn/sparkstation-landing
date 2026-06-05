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
                    output = data.get('output', '')
                    if 'File Path:' in output and 'Dashboard.jsx' in output:
                        views.append((step_index, output))
            except:
                continue
    
    return views

log_path = r"C:\Users\thisi\.gemini\antigravity\brain\e3e719cb-d386-499f-9c6b-b6279f7aca06\.system_generated\logs\overview.txt"
views = extract_dashboard_view(log_path)

if views:
    print(f"Found {len(views)} views")
    # Sort views by step index descending to get the latest one
    views.sort(key=lambda x: x[0], reverse=True)
    
    for step, output in views:
        # Extract the code block
        # The output format is:
        # File Path: ...
        # Total Lines: ...
        # Showing lines ...
        # 1: ...
        # 2: ...
        
        lines = output.split('\n')
        code_lines = []
        start_collecting = False
        
        # Identify the start of the code block (usually starts with "1: " or similar)
        # But wait, view_file might start at line 1 or any other line.
        # Let's look for lines that look like "NNN: <original_line>"
        
        import re
        line_pattern = re.compile(r'^(\d+): (.*)$')
        
        for l in lines:
            match = line_pattern.match(l)
            if match:
                code_lines.append(match.group(2))
        
        if code_lines:
            filename = f"e3e719cb_dashboard_step_{step}.jsx"
            with open(filename, "w", encoding='utf-8') as f:
                f.write('\n'.join(code_lines))
            print(f"Saved {filename}")
            # We only need the latest one that is monolithic
            # How to know if it's monolithic?
            # Monolithic usually means it has handleSyncFleet and many lines.
            if len(code_lines) > 500:
                print(f"This looks like a full file ( {len(code_lines)} lines)")
                break 
else:
    print("Could not find view_file for Dashboard.jsx in e3e719cb")
