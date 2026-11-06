import os
import zipfile

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_ZIP = os.path.abspath(os.path.join(WORKSPACE_DIR, "..", "bishal-raj-portfolio-stage5.zip"))
ROOT_PREFIX = "bishal-raj-portfolio"

EXCLUDE_DIRS = {
    "node_modules",
    "dist",
    ".git",
    "__pycache__",
    ".tmp-browser-9222",
    ".tmp-browser-9223",
    "playwright-report",
}

EXCLUDE_FILES = {
    ".DS_Store",
    "thumbs.db",
}

print(f"Creating delivery zip from: {WORKSPACE_DIR}")
print(f"Target zip path: {OUTPUT_ZIP}")

file_count = 0
total_uncompressed_bytes = 0

with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(WORKSPACE_DIR):
        # Filter directories in-place
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith(".tmp")]
        
        for file in files:
            if file in EXCLUDE_FILES or file.endswith(".tmp"):
                continue
            
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, WORKSPACE_DIR)
            arcname = os.path.join(ROOT_PREFIX, rel_path).replace("\\", "/")
            
            zipf.write(full_path, arcname)
            file_count += 1
            total_uncompressed_bytes += os.path.getsize(full_path)

zip_size = os.path.getsize(OUTPUT_ZIP)
print(f"Done! Packaged {file_count} files into {OUTPUT_ZIP}")
print(f"Uncompressed size: {total_uncompressed_bytes / (1024*1024):.2f} MB")
print(f"Compressed zip size: {zip_size / (1024*1024):.2f} MB")

