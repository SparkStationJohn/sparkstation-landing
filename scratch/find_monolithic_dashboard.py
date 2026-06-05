import os
import json

def find_monolithic_dashboard(brain_dir):
    for root, dirs, files in os.walk(brain_dir):
        if 'overview.txt' in files:
            log_path = os.path.join(root, 'overview.txt')
            # Check if this is the current session
            if '1467690d' in log_path:
                continue
            
            try:
                with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if 'export default function Dashboard' in content and 'useDashboardData' not in content:
                        print(f"Found match in {log_path}")
                        # Find the step where it was written or viewed
                        # This is a large file, so let's be smart
                        f.seek(0)
                        for line in f:
                            if 'export default function Dashboard' in line:
                                print(f"  Line: {line[:200]}...")
            except Exception as e:
                print(f"Error reading {log_path}: {e}")

brain_dir = r"C:\Users\thisi\.gemini\antigravity\brain"
find_monolithic_dashboard(brain_dir)
