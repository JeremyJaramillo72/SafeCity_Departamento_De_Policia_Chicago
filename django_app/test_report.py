import requests

try:
    r = requests.get('http://127.0.0.1:8000/api/investigacion/D656287/report/')
    print(f"Status: {r.status_code}")
    print(f"Content-Type: {r.headers.get('Content-Type')}")
    print(f"Content-Disposition: {r.headers.get('Content-Disposition')}")
    print(f"Size: {len(r.content)} bytes")
except Exception as e:
    print(f"Error: {e}")
