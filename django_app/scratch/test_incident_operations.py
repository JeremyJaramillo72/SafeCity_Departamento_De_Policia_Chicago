import requests
import json

base_url = "http://127.0.0.1:8000/api/data"

# 1. Create a new incident
incident_data = {
    "case_number": "TEST-99999",
    "date": "2026-05-25T14:00:00.000Z",
    "block": "100 N STATE ST",
    "iucr": "0460",
    "primary_type": "BATTERY",
    "description": "SIMPLE",
    "location_description": "STREET",
    "arrest": False,
    "domestic": True,
    "beat": "0111",
    "district": "001",
    "ward": "42",
    "community_area": "32",
    "fbi_code": "08B",
    "x_coordinate": 1176200.0,
    "y_coordinate": 1899900.0,
    "latitude": 41.882,
    "longitude": -87.628
}

print("1. Creating a new incident via POST...")
r_post = requests.post(f"{base_url}/incidents/create/", json=incident_data)
print(f"Status Code: {r_post.status_code}")
print(r_post.text)
assert r_post.status_code == 201, "Failed to create incident"

# 2. Get incident details
print("\n2. Fetching incident details via GET...")
r_get = requests.get(f"{base_url}/incidents/TEST-99999/")
print(f"Status Code: {r_get.status_code}")
data = r_get.json()
print(f"Case: {data.get('case_number')}")
print(f"Primary Type: {data.get('primary_type')}")
print(f"Block: {data.get('block')}")
print(f"Domestic: {data.get('domestic')}")
print(f"Arrest: {data.get('arrest')}")
print(f"Severity: {data.get('severity')}")
print(f"Status Label: {data.get('status_label')}")
assert data.get('case_number') == "TEST-99999", "Incorrect case number returned"
assert data.get('primary_type') == "BATTERY", "Incorrect primary type"

# 3. Update the incident via PUT
update_data = {
    "block": "200 S MICHIGAN AVE",
    "domestic": False,
    "arrest": True,
    "location_description": "APARTMENT"
}
print("\n3. Updating incident via PUT...")
r_put = requests.put(f"{base_url}/incidents/TEST-99999/", json=update_data)
print(f"Status Code: {r_put.status_code}")
print(r_put.text)
assert r_put.status_code == 200, "Failed to update incident"

# 4. Get incident details again to verify updates
print("\n4. Verifying updates via GET...")
r_get2 = requests.get(f"{base_url}/incidents/TEST-99999/")
print(f"Status Code: {r_get2.status_code}")
data2 = r_get2.json()
print(f"Block updated: {data2.get('block')}")
print(f"Domestic updated: {data2.get('domestic')}")
print(f"Arrest updated: {data2.get('arrest')}")
print(f"Location description updated: {data2.get('location_description')}")
print(f"Status Label updated: {data2.get('status_label')}")
assert data2.get('block') == "200 S MICHIGAN AVE", "Block not updated"
assert data2.get('domestic') is False, "Domestic not updated"
assert data2.get('arrest') is True, "Arrest not updated"
assert data2.get('location_description') == "APARTMENT", "Location description not updated"
assert "Arrest Made" in data2.get('status_label'), "Status label not updated after arrest became True"

# 5. Delete the incident
print("\n5. Deleting incident via DELETE...")
r_delete = requests.delete(f"{base_url}/incidents/TEST-99999/")
print(f"Status Code: {r_delete.status_code}")
print(r_delete.text)
assert r_delete.status_code == 200, "Failed to delete incident"

# 6. Verify it is deleted
print("\n6. Verifying incident deletion via GET...")
r_get3 = requests.get(f"{base_url}/incidents/TEST-99999/")
print(f"Status Code: {r_get3.status_code}")
print(r_get3.text)
assert r_get3.status_code == 404, "Incident was not deleted"

print("\nSUCCESS: All API tests passed perfectly!")
