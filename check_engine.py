from clickhouse_driver import Client
client = Client(host='zr1epdm77d.us-east1.gcp.clickhouse.cloud', port=9440, user='default', password='rAqWXslz3JI.x', secure=True)
result = client.execute("SELECT engine, create_table_query FROM system.tables WHERE name = 'dataset_crudo'")
print('Engine:', result[0][0] if result else 'NOT FOUND')
if result:
    print('DDL snippet:', result[0][1][:400])
