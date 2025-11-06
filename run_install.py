import subprocess
import os

os.chdir(r'C:\Users\d3m0n\OneDrive\Documents\VS Code\BrightFeed')
result = subprocess.run(['npm', 'install'], capture_output=True, text=True)
print("STDOUT:")
print(result.stdout[-2000:] if len(result.stdout) > 2000 else result.stdout)
print("\nSTDERR:")
print(result.stderr[-1000:] if len(result.stderr) > 1000 else result.stderr)
print("\nReturn code:", result.returncode)
