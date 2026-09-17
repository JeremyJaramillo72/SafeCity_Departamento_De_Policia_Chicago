import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../../sidebar/sidebar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../administracion_seguridad/services/auth.service';

@Component({
  selector: 'app-arrests-log',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './arrests-log.html',
})
export class ArrestsLogComponent implements OnInit {
  showProfileDropdown = false;
  bookingsData: any[] = [];
  filteredBookings: any[] = [];
  isLoading = false;

  filters = {
    search: '',
    status: 'Todos',
  };

  selectedBooking: any = null;
  bookingLogs: any[] = [];
  sidebarMode: 'view' | 'add' = 'view';

  newLog = { 
    tipo_accion: 'RONDA_SUPERVISION', 
    descripcion: '',
    visitorName: '',
    visitorRelation: '',
    phoneNumber: ''
  };
  isSubmittingLog = false;

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.http.get<any>('http://localhost:8000/api/operativa/bookings/?limit=1000').subscribe({
      next: (res) => {
        this.bookingsData = res.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching bookings', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    if (this.bookingsData) {
      this.filteredBookings = this.bookingsData.filter((b) => {
        let matchesSearch = true;
        let matchesStatus = true;

        if (this.filters.search) {
          const q = this.filters.search.toLowerCase();
          matchesSearch =
            (b.nombre_detenido || '').toLowerCase().includes(q) ||
            (b.id_ingreso || '').toLowerCase().includes(q) ||
            (b.identificacion || '').toLowerCase().includes(q);
        }

        if (this.filters.status !== 'Todos') {
          matchesStatus = (b.custodia_estado === this.filters.status);
        }

        return matchesSearch && matchesStatus;
      });
    }
  }

  viewLogs(booking: any, mode: 'view' | 'add' = 'view') {
    this.selectedBooking = booking;
    this.sidebarMode = mode;
    this.loadLogs();
  }

  closeLogs() {
    this.selectedBooking = null;
    this.bookingLogs = [];
  }

  loadLogs() {
    if (!this.selectedBooking) return;
    this.http.get<any[]>(`http://localhost:8000/api/operativa/bookings/${this.selectedBooking.id_ingreso}/logs/`).subscribe({
      next: (data) => this.bookingLogs = data,
      error: (err) => console.error(err)
    });
  }

  addLogEntry() {
    if (!this.selectedBooking) return;
    
    let finalDescription = this.newLog.descripcion.trim();
    if (this.newLog.tipo_accion.includes('VISITA')) {
      finalDescription = `Visitante: ${this.newLog.visitorName} (${this.newLog.visitorRelation}). ${finalDescription}`;
    } else if (this.newLog.tipo_accion === 'LLAMADA_TELEFONICA') {
      finalDescription = `Llamada a: ${this.newLog.visitorName} (${this.newLog.visitorRelation}) - Tel: ${this.newLog.phoneNumber}. ${finalDescription}`;
    }

    if (!finalDescription) return;

    const payload = {
      tipo_accion: this.newLog.tipo_accion,
      descripcion: finalDescription
    };
    
    this.isSubmittingLog = true;
    this.http.post(`http://localhost:8000/api/operativa/bookings/${this.selectedBooking.id_ingreso}/logs/`, payload).subscribe({
      next: () => {
        this.loadLogs(); // Refresh logs
        this.newLog.descripcion = ''; // Reset description
        this.newLog.visitorName = '';
        this.newLog.visitorRelation = '';
        this.newLog.phoneNumber = '';
        this.sidebarMode = 'view';
        this.isSubmittingLog = false;
      },
      error: (err) => {
        console.error('Error adding log entry', err);
        this.isSubmittingLog = false;
      }
    });
  }

  exportCSV() {
    if (!this.selectedBooking || this.bookingLogs.length === 0) {
      alert('No hay registros de bitácora para exportar.');
      return;
    }
    
    const headers = ['Fecha/Hora', 'Tipo de Acción', 'Descripción', 'ID de Ingreso', 'Detenido'];
    const rows = this.bookingLogs.map(log => [
      log.fecha_hora,
      log.tipo_accion,
      `"${(log.descripcion || '').replace(/"/g, '""')}"`,
      this.selectedBooking.id_ingreso,
      `"${(this.selectedBooking.nombre_detenido || this.selectedBooking.nombre_sospechoso || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bitacora_${this.selectedBooking.id_ingreso}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
