import sys
import os
import django

sys.path.append(r'c:\Users\ASUS\Documents\safecity_project\django_app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safecity_core.settings')
django.setup()

from utils.clickhouse_client import get_clickhouse_client
client = get_clickhouse_client()
res = client.execute("SELECT case_number, patrol_assigned FROM chicago_crimes WHERE case_number IN ('HH185938', 'HH190301', 'HH131760')")
print(res)
