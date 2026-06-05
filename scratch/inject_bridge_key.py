import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Target LXC 117 (Back Office)
PROXMOX_URL = "https://192.168.0.147:8006/api2/json/nodes/shopkeep/lxc/117/config"
AUTH_TOKEN = "PVEAPIToken=root@pam!mcp-server=93028109-49dc-4add-8338-5da5edc0464b"
PUBKEY_PATH = r"C:\Users\thisi\.ssh\id_mcp_proxmox.pub"

try:
    with open(PUBKEY_PATH, 'r') as f:
        pubkey = f.read().strip()
    
    headers = {"Authorization": AUTH_TOKEN}
    data = {"sshkeys": pubkey}
    
    print(f"Injecting MCP Bridge key into LXC 117...")
    response = requests.put(PROXMOX_URL, headers=headers, data=data, verify=False)
    
    if response.status_code == 200:
        print("SUCCESS: SSH Bridge established via Proxmox API.")
    else:
        print(f"FAILED: Status {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Bridge Error: {e}")
