import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

PROXMOX_URL = "https://192.168.0.147:8006/api2/json/nodes/shopkeep/lxc/117/config"
AUTH_TOKEN = "PVEAPIToken=root@pam!mcp-server=93028109-49dc-4add-8338-5da5edc0464b"

headers = {"Authorization": AUTH_TOKEN}
response = requests.get(PROXMOX_URL, headers=headers, verify=False)
print(response.json())
