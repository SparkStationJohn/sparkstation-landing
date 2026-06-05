import re

bundle = open(
    r'D:\Extra Storage\MCP\JJ_Tools\04_DesignLab\SparkStation\website\PROD_REFERENCE\deploy-6a029a73d02fc666e5cfad53\assets\index-defbpb29.js',
    encoding='utf-8'
).read()

def show_context(label, search, chars=300):
    idx = 0
    count = 0
    print(f"\n=== CONTEXT FOR: '{search}' ===")
    while True:
        pos = bundle.find(search, idx)
        if pos == -1 or count >= 3:
            break
        start = max(0, pos - chars)
        end = min(len(bundle), pos + chars)
        snippet = bundle[start:end]
        print(f"  [Match {count+1} at pos {pos}]")
        print(f"  ...{snippet}...")
        print()
        idx = pos + 1
        count += 1

# Key prod features to investigate
show_context("A/B redirect", "destination_url_b", 400)
show_context("schedule", "schedule", 200)
show_context("geo routing", "geo_redirect", 200)

# Check for automate mode UI strings
print("\n=== AUTOMATE MODE CONTEXT ===")
for m in re.finditer(r'automate', bundle):
    pos = m.start()
    snippet = bundle[max(0,pos-200):pos+200]
    print(f"  pos={pos}: ...{snippet}...")
    print()

# Check single-quoted UI strings
print("\n=== SINGLE-QUOTED UI LABELS ===")
hits = set(re.findall(r"'([A-Z][A-Z0-9 /\.\-]{4,80})'", bundle))
keywords = ['VAULT','DEPLOY','STATION','MISSION','INTEL','FLEET','UPLINK',
            'TAP','SPARK','SYNC','LEAD','LINK','BILLING','PROFILE','QR',
            'ACCOUNT','COMMAND','ACTIVE','MANAGE','SECURE','LOCK',
            'PULSE','TRAFFIC','LIVE','FEED','MAP','TIER','DOMAIN','PORTAL',
            'AUTOMATE','SCHEDULE','GEO','SPLIT']
for h in sorted(hits):
    if any(kw in h for kw in keywords):
        print(h)
