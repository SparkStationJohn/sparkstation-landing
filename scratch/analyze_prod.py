import re

bundle = open(
    r'D:\Extra Storage\MCP\JJ_Tools\04_DesignLab\SparkStation\website\PROD_REFERENCE\deploy-6a029a73d02fc666e5cfad53\assets\index-defbpb29.js',
    encoding='utf-8'
).read()

# Extract quoted uppercase strings (UI labels)
hits = set(re.findall(r'"([A-Z][A-Z0-9 /\.\-]{4,80})"', bundle))
keywords = ['VAULT','DEPLOY','STATION','MISSION','INTEL','FLEET','UPLINK',
            'TAP','SPARK','SYNC','LEAD','LINK','BILLING','PROFILE','QR',
            'ACCOUNT','VIEW','COMMAND','ACTIVE','MANAGE','SECURE','LOCK',
            'PULSE','TRAFFIC','LIVE','FEED','MAP','TIER','DOMAIN','PORTAL']

print("=== UI STRINGS IN PROD BUNDLE ===")
for h in sorted(hits):
    if any(kw in h for kw in keywords):
        print(h)

# Also check for specific feature strings that may be in prod but not dev
print("\n=== CHECKING FOR SPECIFIC FEATURE STRINGS ===")
check_strings = [
    "Profile",
    "profile_id",
    "SparkProfile",
    "Get QR",
    "Download",
    "View Notes",
    "handleDelete",
    "deleteAsset",
    "delete_asset",
    "onLogout",
    "resolver",
    "custom_domain",
    "domain_verified",
    "stripe",
    "webhook",
    "automate",
    "b_url",
    "destination_url_b",
    "A/B",
    "split",
    "ab_test",
    "schedule",
    "geo",
]
for s in check_strings:
    count = bundle.count(s)
    if count > 0:
        print(f"  '{s}': {count} occurrences")
