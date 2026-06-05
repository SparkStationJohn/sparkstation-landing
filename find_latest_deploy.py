import json
import sys

def get_latest_source_zip(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Sort by created_at descending
    data.sort(key=lambda x: x['created_at'], reverse=True)
    
    for deploy in data:
        if deploy.get('has_source_zip'):
            return deploy
    return None

if __name__ == "__main__":
    deploy = get_latest_source_zip('deploys.json')
    if deploy:
        print(json.dumps(deploy, indent=2))
    else:
        print("No deploy with source zip found.")
