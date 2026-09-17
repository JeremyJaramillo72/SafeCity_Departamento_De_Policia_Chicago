import urllib.request
import json
req = urllib.request.Request('http://localhost:8000/api/operativa/emergency-calls/')
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        for d in data:
            lat = d.get('latitud')
            lng = d.get('longitud')
            if lat and lng and 41.84 < lat < 41.86 and -87.63 < lng < -87.61:
                print(f"Found call at Cermak/Wabash! ID: {d.get('id_llamada')}, Veh: {d.get('id_vehiculo')}, Status: {d.get('estado')}")
except Exception as e:
    print(e)
