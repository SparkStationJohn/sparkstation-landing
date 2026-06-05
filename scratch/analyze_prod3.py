import re

bundle = open(
    r'D:\Extra Storage\MCP\JJ_Tools\04_DesignLab\SparkStation\website\PROD_REFERENCE\deploy-6a029a73d02fc666e5cfad53\assets\index-defbpb29.js',
    encoding='utf-8'
).read()

def show_context(label, search, chars=600, max_matches=2):
    idx = 0
    count = 0
    print(f"\n{'='*60}")
    print(f"CONTEXT FOR: '{search}'")
    print('='*60)
    while True:
        pos = bundle.find(search, idx)
        if pos == -1 or count >= max_matches:
            break
        start = max(0, pos - chars)
        end = min(len(bundle), pos + chars)
        snippet = bundle[start:end]
        print(f"\n[Match {count+1} at pos {pos}]")
        print(snippet)
        idx = pos + 1
        count += 1

# Get context around the AssetCard (where destination_url_b first appears with useState)
show_context("AssetCard state", "destination_url_b||", 800)

# Get context around subscription_tier
show_context("subscription_tier", "subscription_tier", 400)

# Get context around schedule config
show_context("schedule config", "start_hour", 600)

# Look for the automate mode UI (the tab options in AssetCard edit mode)
show_context("mode tabs", "static", 400, max_matches=3)

# Look for the 'Get QR' or QR button in prod
show_context("QR button", "Get QR", 400)
show_context("QR code gen", "qrcode", 300)

# Look for any delete asset functionality
show_context("delete asset", "deleteAsset", 300)
show_context("delete station", "delete_asset", 300)
