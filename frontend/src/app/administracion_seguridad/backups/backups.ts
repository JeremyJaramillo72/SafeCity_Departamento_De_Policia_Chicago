import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar';
import { AuthService } from '../services/auth.service';

interface BackupRecord {
  id: string;
  filename: string;
  fecha: string;
  tamano: string;
  tipo: 'incremental' | 'completo';
  estado: string;
  en_local: boolean;
  en_nube: boolean;
}

@Component({
  selector: 'app-admin-backups',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './backups.html',
})
export class AdminBackupsComponent implements OnInit {
  showProfileDropdown = false;
  backups: BackupRecord[] = [];
  isBackingUp: boolean = false;
  backupProgress: number = 0;
  backupType: 'incremental' | 'completo' = 'completo';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadBackups();
  }

  sortField = '';
  sortAscending = true;

  sortBackups(field: string) {
    if (this.sortField === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortField = field;
      this.sortAscending = true;
    }
    this.applySort();
  }

  applySort() {
    if (!this.sortField) return;
    const field = this.sortField;
    const direction = this.sortAscending ? 1 : -1;
    this.backups.sort((a, b) => {
      let valA: any = a[field as keyof BackupRecord];
      let valB: any = b[field as keyof BackupRecord];

      if (field === 'fecha') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  loadBackups() {
    this.authService.getBackups().subscribe({
      next: (data) => {
        this.backups = data;
        this.applySort();
      },
      error: (err) => {
        console.error('Error al cargar la lista de respaldos:', err);
      }
    });
  }

  triggerBackup() {
    this.isBackingUp = true;
    this.backupProgress = 10;

    const progressInterval = setInterval(() => {
      if (this.backupProgress < 90) {
        this.backupProgress += 10;
      }
    }, 400);

    this.authService.createBackup(this.backupType).subscribe({
      next: (result) => {
        clearInterval(progressInterval);
        this.backupProgress = 100;
        
        setTimeout(() => {
          this.isBackingUp = false;
          this.backupProgress = 0;
          this.loadBackups();
          
          if (confirm('¡Respaldo creado con éxito tanto localmente como en la nube de Supabase! ¿Desea descargar el archivo .zip a su equipo ahora?')) {
            this.downloadBackupFile(result.backup_id || result.id);
          }
        }, 500);
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.isBackingUp = false;
        this.backupProgress = 0;
        alert('Error al crear el respaldo: ' + (err.error?.error || err.message));
      }
    });
  }

  restoreBackup(backup: BackupRecord) {
    const confirmation = confirm(`¿Está completamente seguro de que desea restaurar el respaldo ${backup.id}?\n\nEsta acción:\n1. Sobrescribirá la base de datos relacional central SQLite.\n2. Vaciará (TRUNCATE) y recargará todos los registros históricos en ClickHouse desde sus volcados JSON correspondientes.\n\nEsta operación de ciberseguridad es destructiva para los datos actuales y no se puede deshacer.`);
    
    if (confirmation) {
      alert('Iniciando proceso de restauración segura. Por favor espere la notificación de finalización...');
      this.authService.restoreBackup(backup.id).subscribe({
        next: (res) => {
          alert('¡Proceso de restauración de bases de datos completado exitosamente! El estado de SQLite y ClickHouse ha sido restablecido.');
          this.loadBackups();
        },
        error: (err) => {
          alert('Error al restaurar la base de datos: ' + (err.error?.error || err.message));
        }
      });
    }
  }

  downloadBackup(backup: BackupRecord) {
    this.downloadBackupFile(backup.id);
  }

  downloadBackupFile(backupId: string) {
    this.authService.downloadBackup(backupId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${backupId}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert('Error al descargar el archivo de respaldo de base de datos.');
        console.error(err);
      }
    });
  }
}
