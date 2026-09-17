import os
import sys
import django

# Set up Django environment
sys.path.append(r'c:\Users\ASUS\Documents\safecity_project\django_app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity.settings')
django.setup()

from clickhouse_driver import Client
from utils.clickhouse_client import get_clickhouse_client

client = get_clickhouse_client()

cases = ['HH185938', 'HH190301', 'HH473908']
query = "ALTER TABLE chicago_crimes UPDATE patrol_assigned = 'CPD-101010' WHERE case_number IN %(cases)s"
client.execute(query, {'cases': cases})

cases2 = ['HH131760', 'HH175199']
query2 = "ALTER TABLE chicago_crimes UPDATE patrol_assigned = 'CPD-004 (Sedan)' WHERE case_number IN %(cases2)s"
client.execute(query2, {'cases2': cases2})

print("Patrols assigned successfully.")
