import re

bundle = open(
    r'D:\Extra Storage\MCP\JJ_Tools\04_DesignLab\SparkStation\website\PROD_REFERENCE\deploy-6a029a73d02fc666e5cfad53\assets\index-defbpb29.js',
    encoding='utf-8'
).read()

# ── 1. Full AssetCard region (surrounding destination_url_b useState block) ──
pos = bundle.find("destination_url_b||")
if pos != -1:
    # Walk back to find the function boundary ~3000 chars before
    snippet = bundle[max(0, pos-3000): pos+5000]
    print("=== ASSET CARD FULL REGION ===")
    print(snippet)

# ── 2. Subscription tier logic in Dashboard parent ──
pos2 = bundle.find("subscription_tier||`free`")
if pos2 != -1:
    snippet2 = bundle[max(0, pos2-200): pos2+1500]
    print("\n=== SUBSCRIPTION TIER BLOCK ===")
    print(snippet2)

# ── 3. Nav items / sidebar in prod Dashboard ──
# Look for sidebar nav label strings
for label in ["Stations", "Intelligence", "Link Vault", "Leads", "Account", "Identity", "Profile"]:
    idx = bundle.find(f"`{label}`")
    if idx != -1:
        print(f"\n=== NAV LABEL '{label}' at {idx} ===")
        print(bundle[max(0,idx-100):idx+200])

# ── 4. Look for QR generation in AssetCard ──
pos3 = bundle.find("qrcode", 274000)
if pos3 == -1:
    pos3 = bundle.find("QrCode")
if pos3 != -1:
    snippet3 = bundle[max(0,pos3-500):pos3+1500]
    print("\n=== QR CODE REGION ===")
    print(snippet3[:2000])
