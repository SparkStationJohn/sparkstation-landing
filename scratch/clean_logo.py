import re

input_path = r"d:\Extra Storage\MCP\JJ_Tools\04_DesignLab\SparkStation\assets\Gemini_Generated_Image_ryzm0kryzm0kryzm.svg"
output_path = r"d:\Extra Storage\MCP\JJ_Tools\04_DesignLab\SparkStation\website\src\assets\logo.svg"

with open(input_path, 'r') as f:
    content = f.read()

# Remove background path (specifically the one with #FEFEFE)
# This looks for the first path with fill="#FEFEFE"
content = re.sub(r'<path fill="#FEFEFE".*?/>', '', content, flags=re.DOTALL, count=1)

# Normalize colors
content = content.replace('#161F27', '#FFFFFF')
content = content.replace('#161F26', '#FFFFFF')
content = content.replace('#182129', '#FFFFFF')
content = content.replace('#172027', '#FFFFFF')
content = content.replace('#182128', '#FFFFFF')
content = content.replace('#19222A', '#FFFFFF')
content = content.replace('#F96D08', '#F97316') # Spark Orange

with open(output_path, 'w') as f:
    f.write(content)

print(f"Cleaned logo written to {output_path}")
