import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar';
import { EmergencyService, EmergencyCall } from '../services/emergency.service';

@Component({
  selector: 'app-emergency-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './emergency-history.html',
  styleUrls: ['./emergency-history.css']
})
export class EmergencyHistoryComponent implements OnInit {
  showProfileDropdown = false;
  isLoading = true;
  calls: EmergencyCall[] = [];
  showKpis = true;
  
  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  get totalCallsCount(): number {
    return this.calls.length;
  }

  get criticalCallsCount(): number {
    return this.calls.filter(c => c.nivel_prioridad && (c.nivel_prioridad.toUpperCase() === 'CRITICAL' || c.nivel_prioridad.toUpperCase() === 'HIGH' || c.nivel_prioridad.toUpperCase() === 'CRITICA' || c.nivel_prioridad.toUpperCase() === 'ALTA')).length;
  }

  get activeDispatchesCount(): number {
    return this.calls.filter(c => c.estado && (c.estado.toLowerCase() === 'despachado' || c.estado.toLowerCase() === 'en_sitio' || c.estado.toLowerCase() === 'dispatched' || c.estado.toLowerCase() === 'on site' || c.estado.toLowerCase() === 'on_site')).length;
  }

  get linkedCasesCount(): number {
    return this.calls.filter(c => !!c.case_number).length;
  }

  translateStatus(status: string): string {
    if (!status) return 'Desconocido';
    const s = status.toLowerCase();
    if (s === 'pendiente' || s === 'pending') return 'Pendiente';
    if (s === 'despachado' || s === 'dispatched') return 'Despachado';
    if (s === 'en_sitio' || s === 'on site' || s === 'on_site') return 'En Sitio';
    if (s === 'resuelto' || s === 'resolved') return 'Resuelto';
    if (s === 'falsa_alarma' || s === 'false alarm') return 'Falsa Alarma';
    return status;
  }

  // Filters
  filters = {
    start_date: '',
    end_date: '',
    priority: 'all',
    status: 'all',
    search: ''
  };

  constructor(public authService: AuthService, private emergencyService: EmergencyService) {}

  ngOnInit() {
    // Set default dates: last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.filters.end_date = this.formatDate(today);
    this.filters.start_date = this.formatDate(thirtyDaysAgo);
    
    this.loadHistory();
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  sortField = '';
  sortAscending = true;

  sortCalls(field: string) {
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
    this.calls.sort((a, b) => {
      let valA = a[field as keyof EmergencyCall];
      let valB = b[field as keyof EmergencyCall];

      if (field === 'fecha_hora_llamada') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'id_llamada') {
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

  loadHistory() {
    this.isLoading = true;
    this.emergencyService.getEmergencyHistory(this.filters).subscribe({
      next: (data) => {
        this.calls = data;
        this.applySort();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading emergency history:', err);
        this.isLoading = false;
      }
    });
  }

  clearFilters() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.filters = {
      start_date: this.formatDate(thirtyDaysAgo),
      end_date: this.formatDate(today),
      priority: 'all',
      status: 'all',
      search: ''
    };
    this.loadHistory();
  }

  getPriorityClass(priority: string): string {
    const p = (priority || '').toUpperCase();
    switch (p) {
      case 'CRITICAL':
      case 'CRITICA':
        return 'bg-error-container text-on-error-container border border-error/20 font-black';
      case 'HIGH':
      case 'ALTA':
        return 'bg-orange-500/10 text-orange-600 border border-orange-500/20 font-bold';
      case 'MEDIUM':
      case 'MEDIA':
        return 'bg-secondary-container text-on-secondary-container border border-secondary/20 font-bold';
      default:
        return 'bg-surface-variant text-on-surface-variant border border-outline-variant font-medium';
    }
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'pendiente':
      case 'pending':
        return 'bg-error-container text-on-error-container border-error/20';
      case 'despachado':
      case 'dispatched':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'en_sitio':
      case 'on site':
      case 'on_site':
        return 'bg-purple-500/15 text-purple-600 border-purple-500/20';
      case 'resuelto':
      case 'resolved':
        return 'bg-success-container text-on-success-container border-success/20';
      case 'falsa_alarma':
      case 'false alarm':
        return 'bg-surface-variant text-on-surface-variant border-outline-variant';
      default:
        return 'bg-surface-variant text-on-surface-variant border-outline-variant';
    }
  }

  selectedCallDetails: EmergencyCall | null = null;

  viewCallDetails(call: EmergencyCall) {
    this.selectedCallDetails = call;
  }

  closeCallDetails() {
    this.selectedCallDetails = null;
  }
}
