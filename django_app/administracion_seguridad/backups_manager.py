import os
import zipfile
import shutil
import json
import datetime
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from clickhouse_driver import Client

BACKUP_DIR = os.path.join(settings.BASE_DIR, 'backups_data')

class BackupEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        if isinstance(obj, uuid.UUID):
            return str(obj)
        return super().default(obj)

def get_clickhouse_client():
    return Client(
        host=os.environ.get('CLICKHOUSE_HOST', 'localhost'),
        port=9000,
        user='default',
        password='password12345'
    )

class BackupManager:
    @staticmethod
    def get_backup_list():
        os.makedirs(BACKUP_DIR, exist_ok=True)
        backups = []
        
        # 1. Get local backups
        local_files = [f for f in os.listdir(BACKUP_DIR) if f.endswith('.zip')]
        
        # 2. Try to get cloud backups (optional check to see what exists in Supabase)
        # To avoid slow API calls, we can check if local files also exist in the cloud
        for filename in local_files:
            filepath = os.path.join(BACKUP_DIR, filename)
            stat = os.stat(filepath)
            created_time = datetime.datetime.fromtimestamp(stat.st_mtime)
            size_mb = round(stat.st_size / (1024 * 1024), 2)
            if size_mb < 0.01:
                size_str = f"{round(stat.st_size / 1024, 2)} KB"
            else:
                size_str = f"{size_mb} MB"
                
            # Check cloud status (Supabase)
            cloud_exists = False
            try:
                cloud_exists = default_storage.exists(f"backups/{filename}")
            except Exception as e:
                print(f"Error checking cloud status for {filename}: {e}")
                
            backups.append({
                'id': filename.replace('.zip', ''),
                'filename': filename,
                'fecha': created_time.strftime('%Y-%m-%d %H:%M:%S'),
                'tamano': size_str,
                'tipo': 'completo' if 'completo' in filename else 'incremental',
                'estado': 'exito',
                'en_local': True,
                'en_nube': cloud_exists
            })
            
        # Sort by creation date descending
        backups.sort(key=lambda x: x['fecha'], reverse=True)
        return backups

    @staticmethod
    def create_backup(backup_type='completo'):
        os.makedirs(BACKUP_DIR, exist_ok=True)
        timestamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
        backup_id = f"SC-BACKUP-{timestamp}-{backup_type}"
        zip_filename = f"{backup_id}.zip"
        zip_filepath = os.path.join(BACKUP_DIR, zip_filename)
        
        try:
            client = get_clickhouse_client()
            
            # Create the zip file
            with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
                # 1. Backup SQLite database
                sqlite_path = os.path.join(settings.BASE_DIR, 'db.sqlite3')
                if os.path.exists(sqlite_path):
                    zipf.write(sqlite_path, 'db.sqlite3')
                    
                # 2. Backup ClickHouse tables
                tables = client.execute("SHOW TABLES")
                for table_row in tables:
                    table_name = table_row[0]
                    # Skip system, temporary, log, and massive raw dataset tables
                    if table_name.startswith('.inner'):
                        continue
                    if table_name.endswith('_log'):
                        continue
                    if table_name in ['chicago_crimes', 'dataset_crudo']:
                        continue
                        
                    # Get columns
                    columns_info = client.execute(
                        f"SELECT name FROM system.columns WHERE table = %(table)s AND database = 'default'",
                        {'table': table_name}
                    )
                    columns = [col[0] for col in columns_info]
                    
                    # Fetch all rows
                    rows = client.execute(f"SELECT * FROM {table_name}")
                    
                    # Convert to list of dicts
                    table_data = []
                    for row in rows:
                        row_dict = dict(zip(columns, row))
                        table_data.append(row_dict)
                        
                    # Write to zip as JSON
                    json_data = json.dumps(table_data, cls=BackupEncoder, indent=2)
                    zipf.writestr(f"clickhouse/{table_name}.json", json_data)
                    
            # 3. Upload to Supabase Storage
            with open(zip_filepath, 'rb') as f:
                zip_data = f.read()
                default_storage.save(f"backups/{zip_filename}", ContentFile(zip_data))
                
            print(f"Backup {backup_id} created and uploaded to Supabase successfully.")
            return {
                'success': True,
                'backup_id': backup_id,
                'filename': zip_filename,
                'en_nube': True
            }
            
        except Exception as e:
            # Clean up if failed
            if os.path.exists(zip_filepath):
                os.remove(zip_filepath)
            print(f"Error creating backup: {e}")
            raise e

    @staticmethod
    def restore_backup(backup_id):
        zip_filename = f"{backup_id}.zip"
        zip_filepath = os.path.join(BACKUP_DIR, zip_filename)
        
        # If not found locally, try to download from Supabase Cloud
        if not os.path.exists(zip_filepath):
            try:
                print(f"Backup {backup_id} not found locally. Attempting download from Supabase...")
                if default_storage.exists(f"backups/{zip_filename}"):
                    cloud_file = default_storage.open(f"backups/{zip_filename}", 'rb')
                    os.makedirs(BACKUP_DIR, exist_ok=True)
                    with open(zip_filepath, 'wb') as f:
                        f.write(cloud_file.read())
                    print(f"Downloaded {zip_filename} from Supabase.")
                else:
                    raise FileNotFoundError(f"Backup {backup_id} not found in local or cloud storage.")
            except Exception as e:
                print(f"Error downloading backup from cloud: {e}")
                raise e
                
        # Perform restore
        temp_extract_dir = os.path.join(BACKUP_DIR, f"temp_restore_{backup_id}")
        os.makedirs(temp_extract_dir, exist_ok=True)
        
        try:
            # Extract zip
            with zipfile.ZipFile(zip_filepath, 'r') as zipf:
                zipf.extractall(temp_extract_dir)
                
            # 1. Restore SQLite database
            extracted_sqlite = os.path.join(temp_extract_dir, 'db.sqlite3')
            if os.path.exists(extracted_sqlite):
                sqlite_dest = os.path.join(settings.BASE_DIR, 'db.sqlite3')
                # Overwrite SQLite safely
                shutil.copy2(extracted_sqlite, sqlite_dest)
                print("SQLite database restored successfully.")
                
            # 2. Restore ClickHouse tables
            client = get_clickhouse_client()
            clickhouse_backup_dir = os.path.join(temp_extract_dir, 'clickhouse')
            
            if os.path.exists(clickhouse_backup_dir):
                json_files = [f for f in os.listdir(clickhouse_backup_dir) if f.endswith('.json')]
                for json_file in json_files:
                    table_name = json_file.replace('.json', '')
                    filepath = os.path.join(clickhouse_backup_dir, json_file)
                    
                    with open(filepath, 'r', encoding='utf-8') as f:
                        rows_data = json.load(f)
                        
                    # Clear existing table
                    client.execute(f"TRUNCATE TABLE {table_name}")
                    
                    if rows_data:
                        # Get columns
                        columns = list(rows_data[0].keys())
                        columns_str = ", ".join(columns)
                        
                        # Prepare tuples for insertion, parsing dates/datetimes back
                        tuples_to_insert = []
                        for row in rows_data:
                            row_tuple = []
                            for col in columns:
                                val = row[col]
                                # Attempt to parse date/datetime ISO strings back
                                if isinstance(val, str):
                                    # Matches YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS
                                    if len(val) == 10 and val[4] == '-' and val[7] == '-':
                                        try:
                                            val = datetime.date.fromisoformat(val)
                                        except:
                                            pass
                                    elif len(val) >= 19 and val[4] == '-' and val[7] == '-' and ('T' in val or ' ' in val):
                                        try:
                                            # handle both T and space separators
                                            iso_val = val.replace(' ', 'T')
                                            val = datetime.datetime.fromisoformat(iso_val)
                                        except:
                                            pass
                                row_tuple.append(val)
                            tuples_to_insert.append(tuple(row_tuple))
                            
                        # Batch insert
                        client.execute(
                            f"INSERT INTO {table_name} ({columns_str}) VALUES",
                            tuples_to_insert
                        )
                    print(f"ClickHouse table '{table_name}' restored successfully with {len(rows_data)} rows.")
                    
            return True
            
        except Exception as e:
            print(f"Error during restore process: {e}")
            raise e
        finally:
            # Clean up temporary directory
            if os.path.exists(temp_extract_dir):
                shutil.rmtree(temp_extract_dir)
