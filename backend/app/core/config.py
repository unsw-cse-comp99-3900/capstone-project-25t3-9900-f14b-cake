import os

port = int(os.getenv("PORT", "8000"))  # Default to 8000
url = f"http://localhost:{port}/"