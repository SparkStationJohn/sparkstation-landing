import re

bundle = open(
    r'D:\Extra Storage\MCP\JJ_Tools\04_DesignLab\SparkStation\website\PROD_REFERENCE\deploy-6a029a73d02fc666e5cfad53\assets\index-defbpb29.js',
    encoding='utf-8'
).read()

# ── Full sidebar/nav block ──
pos = bundle.find("sidebar-devices")
if pos != -1:
    print("=== FULL NAV BLOCK (from sidebar-devices) ===")
    print(bundle[max(0, pos-200): pos+2000])

# ── Look for 'links' view label in prod nav ──
print("\n=== 'links' view occurrences ===")
for m in re.finditer(r"[`'\"]links[`'\"]", bundle):
    snippet = bundle[max(0, m.start()-150): m.end()+150]
    print(f"  pos={m.start()}: {snippet}\n")

# ── Look for 'intel' view occurrences ──
print("\n=== 'intel' view occurrences ===")
for m in re.finditer(r"[`'\"]intel[`'\"]", bundle):
    snippet = bundle[max(0, m.start()-150): m.end()+150]
    print(f"  pos={m.start()}: {snippet}\n")

# ── Look for 'analytics' view ──
print("\n=== 'analytics' view context ===")
pos2 = bundle.find("analytics")
if pos2 != -1:
    print(bundle[max(0, pos2-300): pos2+600])

# ── Look for 'notifications' view ──
print("\n=== 'notifications' view context ===")
pos3 = bundle.find("sidebar-notifications") 
if pos3 == -1:
    pos3 = bundle.find("`notifications`")
if pos3 != -1:
    print(bundle[max(0, pos3-200): pos3+600])

# ── Look for 'orders' view ──
print("\n=== 'orders' view context ===")
pos4 = bundle.find("`orders`")
if pos4 != -1:
    print(bundle[max(0, pos4-200): pos4+600])

# ── App routing - what routes exist in prod? ──
print("\n=== ROUTE STRUCTURE ===")
for m in re.finditer(r'path:[`"\']([^`"\']{1,60})[`"\']', bundle):
    val = m.group(1)
    if val.startswith('/') or val in ['/', '*']:
        print(f"  path: {val}")
