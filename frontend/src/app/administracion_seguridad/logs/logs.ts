import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../../sidebar/sidebar';
import { AuthService } from '../services/auth.service';

interface AuditLog {
  id: number;
  usuario: string;
  evento: string;
  detalles: string;
  detalles_tecnicos?: string;
  ip: string;
  fecha: string;
  estado: 'exito' | 'error';
  severidad: 'info' | 'warning' | 'critical';
  tabla?: string;
  operacion?: string;
}

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './logs.html',
})
export class AdminLogsComponent implements OnInit {
  showProfileDropdown = false;
  logs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  searchQuery: string = '';
  severityFilter: string = '';
  categoryFilter: string = ''; // New filter for audit log types
  isInspectorOpen: boolean = false;
  selectedLog: AuditLog | null = null;
  copied: boolean = false;

  constructor(public authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.http.get<AuditLog[]>('http://localhost:8000/api/auth/logs/').subscribe({
      next: (data) => {
        this.logs = data;
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load logs:', err)
    });
  }

  sortField = '';
  sortAscending = true;

  sortLogs(field: string) {
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
    this.filteredLogs.sort((a, b) => {
      let valA: any = a[field as keyof AuditLog];
      let valB: any = b[field as keyof AuditLog];

      if (field === 'fecha') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'id') {
        valA = Number(valA || 0);
        valB = Number(valB || 0);
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  applyFilters() {
    this.filteredLogs = this.logs.filter(l => {
      const matchesSearch = `${l.usuario} ${l.evento} ${l.detalles} ${l.ip}`.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesSeverity = !this.severityFilter || ['ALL', 'TODOS', 'TODAS'].includes(this.severityFilter.toUpperCase()) || l.severidad === this.severityFilter;
      
      let matchesCategory = true;
      if (this.categoryFilter && !['ALL', 'TODAS', 'TODOS', ''].includes(this.categoryFilter.toUpperCase())) {
        const cat = this.categoryFilter;
        const tbl = l.tabla || '';
        if (cat === 'seguridad') {
          matchesCategory = ['usuario_sistema', 'rol_oficial'].includes(tbl) || l.evento.toLowerCase().includes('login') || l.evento.toLowerCase().includes('logout');
        } else if (cat === 'operativa') {
          matchesCategory = ['chicago_crimes', 'incidente_delito', 'codigo_penal'].includes(tbl);
        } else if (cat === 'investigacion') {
          matchesCategory = ['investigacion_especial', 'banda_criminal', 'sospechoso', 'evidencia', 'testigo', 'victima', 'seguimiento_incidente'].includes(tbl);
        } else if (cat === 'logistica') {
          matchesCategory = ['vehiculo_patrulla', 'oficial_policia', 'turno_patrullaje'].includes(tbl);
        }
      }
      
      return matchesSearch && matchesSeverity && matchesCategory;
    });
    this.applySort();
  }

  clearLogs() {
    this.logs = [];
    this.applyFilters();
  }

  exportToPdf() {
    const url = `http://localhost:8000/api/auth/logs/export/?category=${this.categoryFilter}&severity=${this.severityFilter}&q=${encodeURIComponent(this.searchQuery)}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `Audit_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(fileUrl);
      },
      error: (err) => console.error('Failed to export PDF:', err)
    });
  }

  openInspector(log: AuditLog) {
    this.selectedLog = log;
    this.isInspectorOpen = true;
    this.copied = false;
  }

  closeInspector() {
    this.isInspectorOpen = false;
    this.selectedLog = null;
  }

  copySql(sql: string) {
    if (!sql) return;
    navigator.clipboard.writeText(sql).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
}



