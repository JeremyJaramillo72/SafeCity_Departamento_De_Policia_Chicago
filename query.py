import urllib.request
import json
req = urllib.request.Request('http://localhost:8000/api/logistica/patrol-shifts/')
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        for d in data:
            if d.get('fecha_turno') == '2026-07-09':
                print(f"{d.get('officer_name')} ({d.get('hora_inicio')}-{d.get('hora_fin')}): {d.get('ruta_coordenadas')}")
except Exception as e:
    print(e)
