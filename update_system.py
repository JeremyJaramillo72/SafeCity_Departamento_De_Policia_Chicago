from clickhouse_driver import Client
c = Client(host='localhost', port=9000, user='default', password='password12345')
c.execute("ALTER TABLE equipment_catalog UPDATE creado_por = 'SC-0045' WHERE creado_por = 'system' OR creado_por = 'SYSTEM'")
c.execute("ALTER TABLE maintenance_tickets UPDATE reportado_por = 'SC-0012' WHERE reportado_por = 'system' OR reportado_por = 'SYSTEM'")
print("Update applied")
