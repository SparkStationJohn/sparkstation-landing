import sys
import os

pdf_path = r"d:\Extra Storage\MCP\JJ_Tools\04_DesignLab\SparkStation\Landing page\sparkstation-lander-context.pdf"
out_path = r"d:\Extra Storage\MCP\JJ_Tools\04_DesignLab\SparkStation\Landing page\scratch\pdf_content.txt"

print(f"Checking for libraries to read {pdf_path}")

try:
    import pypdf
    print("Using pypdf")
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for i, page in enumerate(reader.pages):
        text += f"\n--- PAGE {i+1} ---\n"
        text += page.extract_text() or ""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully extracted PDF text to scratch/pdf_content.txt")
    sys.exit(0)
except ImportError:
    pass

try:
    import PyPDF2
    print("Using PyPDF2")
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for i, page in enumerate(reader.pages):
        text += f"\n--- PAGE {i+1} ---\n"
        text += page.extract_text() or ""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully extracted PDF text to scratch/pdf_content.txt")
    sys.exit(0)
except ImportError:
    pass

try:
    import pdfplumber
    print("Using pdfplumber")
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for i, page in enumerate(pdf.pages):
            text += f"\n--- PAGE {i+1} ---\n"
            text += page.extract_text() or ""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully extracted PDF text to scratch/pdf_content.txt")
    sys.exit(0)
except ImportError:
    pass

# Try with fitz (PyMuPDF)
try:
    import fitz
    print("Using fitz (PyMuPDF)")
    doc = fitz.open(pdf_path)
    text = ""
    for i, page in enumerate(doc):
        text += f"\n--- PAGE {i+1} ---\n"
        text += page.get_text()
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully extracted PDF text to scratch/pdf_content.txt")
    sys.exit(0)
except ImportError:
    pass

print("No PDF reading library found in venv. Installing pypdf...")
import subprocess
subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
import pypdf
reader = pypdf.PdfReader(pdf_path)
text = ""
for i, page in enumerate(reader.pages):
    text += f"\n--- PAGE {i+1} ---\n"
    text += page.extract_text() or ""
with open(out_path, "w", encoding="utf-8") as f:
    f.write(text)
print("Successfully installed pypdf and extracted PDF text to scratch/pdf_content.txt")
