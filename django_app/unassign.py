from clickhouse_driver import Client

def main():
    try:
        client = Client(host='clickhouse', port=9000, user='default', password='password12345')
        
        # Check if exists
        res = client.execute("SELECT count() FROM investigacion_especial WHERE case_number = 'C016589166'")
        if res[0][0] > 0:
            print("Row found. Deleting...")
            client.execute("ALTER TABLE investigacion_especial DELETE WHERE case_number = 'C016589166'")
            print("Case C016589166 successfully unassigned (deleted from investigacion_especial).")
        else:
            print("Case C016589166 is not currently assigned to any detective.")
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    main()
