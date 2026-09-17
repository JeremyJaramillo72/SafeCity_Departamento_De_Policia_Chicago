from clickhouse_driver import Client
client = Client(host='localhost', port=9000, user='default', password='password12345')
res = client.execute("SELECT case_number, patrol_assigned FROM chicago_crimes WHERE case_number IN ('HH185938', 'HH190301', 'HH131760')")
print(res)
