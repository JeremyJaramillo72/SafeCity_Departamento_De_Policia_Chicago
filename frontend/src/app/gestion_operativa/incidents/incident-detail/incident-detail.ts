import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../administracion_seguridad/services/auth.service';
import { IncidentService } from '../../../gestion_operativa/services/incident.service';
import { IncidentCacheService } from '../../../gestion_operativa/services/incident-cache.service';
import { SidebarComponent } from '../../../sidebar/sidebar';
import { InvestigacionEspecialService } from '../../../investigacion_especial/services/investigacion-especial.service';
import { LogisticsService } from '../../../logistica_patrullaje/services/logistics.service';

@Component({
  selector: 'app-incident-detail',
  imports: [RouterLink, CommonModule, SidebarComponent, FormsModule],
  templateUrl: './incident-detail.html',
  styleUrl: './incident-detail.css',
})
export class IncidentDetailComponent implements OnInit {
  showProfileDropdown = false;
  profile: string | null = null;
  incident: any = null;
  isLoading = true;
  hasError = false;
  caseNumber = '';
  showDeleteModal = false;
  isDeleting = false;
  deleteError = '';
  isDownloading = false;

  timelineLogs: any[] = [];
  newNoteComment = '';
  isSavingNote = false;
  noteError = '';

  // Lightbox Modal for Evidence Images
  showImageModal = false;
  selectedImageUrl = '';

  viewImage(url: string) {
    if (!url) return;
    this.selectedImageUrl = url;
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
    this.selectedImageUrl = '';
  }

  // Detective Assignment
  availableDetectives: any[] = [];
  detectiveSearchQuery = '';
  showDetectiveDropdown = false;
  selectedDetective: any = null;

  // Toast Notifications
  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === message) {
        this.toastMessage = null;
      }
    }, 4000);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private dataService: IncidentService,
    private incidentCache: IncidentCacheService,
    private investigacionService: InvestigacionEspecialService,
    private logisticsService: LogisticsService
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    if (!this.profile) {
      this.router.navigate(['/login']);
      return;
    }

    this.caseNumber = this.route.snapshot.paramMap.get('caseNumber') || '';
    if (!this.caseNumber) {
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.logisticsService.getOfficers().subscribe({
      next: (data) => {
        // Assign a mock status for realism (Available, Busy, Off Duty)
        this.availableDetectives = data.map((det: any) => {
          let status = 'Available';
          if (det.id_oficial % 3 === 0) status = 'Busy';
          if (det.id_oficial % 5 === 0) status = 'Off Duty';
          return { ...det, current_status: status };
        });
      },
      error: (err) => console.error('Failed to load officers', err)
    });

    // Try cache first (fast path — data already loaded in incidents list)
    const cached = this.incidentCache.get();
    if (cached && cached.case_number === this.caseNumber) {
      console.log('[IncidentDetail] Using cached data for', this.caseNumber);
      // Enrich cached data with fields that the list view doesn't have
      this.incident = this.enrichIncident(cached);
      this.timelineLogs = this.incident.timeline_logs || [];
      this.isLoading = false;
      // Also fetch full detail in background to fill in missing fields
      this.fetchFullDetail();
    } else {
      // No cache: fetch from API
      console.log('[IncidentDetail] No cache, fetching from API:', this.caseNumber);
      this.fetchFullDetail();
    }
  }

  enrichIncident(data: any): any {
    // Compute derived fields from list data
    const primaryType = data.primary_type || '';
    const criticalTypes = ['HOMICIDE', 'ASSAULT', 'ROBBERY', 'KIDNAPPING', 'ARSON', 'BATTERY'];
    const highTypes = ['BURGLARY', 'MOTOR VEHICLE THEFT', 'WEAPONS VIOLATION', 'SEX OFFENSE'];
    let severity = 'MODERATE';
    if (criticalTypes.some(t => primaryType.toUpperCase().includes(t))) severity = 'CRITICAL';
    else if (highTypes.some(t => primaryType.toUpperCase().includes(t))) severity = 'HIGH';

    return {
      ...data,
      severity: data.severity || severity,
      status_label: data.status_label || (data.arrest ? 'Cerrado - Con Arresto' : 'Investigación Activa'),
      iucr: data.iucr || 'N/A',
      fbi_code: data.fbi_code || 'N/A',
      beat: data.beat || 'N/A',
      location_description: data.location_description || 'N/A',
      community_area: data.community_area || 'N/A',
      year: data.year || 'N/A',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      updated_on: data.updated_on || null,
    };
  }

  fetchFullDetail() {
    this.dataService.getIncidentDetail(this.caseNumber).subscribe({
      next: (data) => {
        console.log('[IncidentDetail] Full API data received:', data);
        this.incident = data;
        this.timelineLogs = data.timeline_logs || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[IncidentDetail] API error:', err);
        // If we already have cached data, keep showing it
        if (!this.incident) {
          this.hasError = true;
        }
        this.isLoading = false;
      }
    });
  }

  getSeverityClass(): string {
    if (!this.incident) return '';
    switch (this.incident.severity) {
      case 'CRITICAL':
      case 'CRÍTICA': return 'bg-error-container text-on-error-container';
      case 'HIGH':
      case 'ALTA': return 'bg-tertiary-container text-on-tertiary-container';
      default: return 'bg-secondary-container text-on-secondary-container';
    }
  }

  getFbiCodeLabel(): string {
    const codes: Record<string, string> = {
      '01A': 'Homicidio / Asesinato No Negligente', '02': 'Agresión Sexual Criminal',
      '03': 'Robo', '04A': 'Asalto Agravado', '04B': 'Agresión Agravada',
      '05': 'Allanamiento / Robo en Morada', '06': 'Hurto', '07': 'Robo de Vehículo Motorizado',
      '09': 'Incendio Provocado', '10': 'Falsificación', '11': 'Fraude',
      '14': 'Violación de Armas', '15': 'Delito Sexual', '17': 'Juego Ilegal',
      '18': 'Delitos Contra Menores', '19': 'Narcóticos', '20': 'Infracción Ley de Licores',
      '22': 'Acoso (Stalking)', '24': 'Conducta Desordenada', '26': 'Otras Infracciones',
    };
    return codes[this.incident?.fbi_code] || this.incident?.fbi_code || 'N/A';
  }

  addNote() {
    const comment = this.newNoteComment.trim();
    if (!comment) return;

    this.isSavingNote = true;
    this.noteError = '';

    const payload = {
      id_oficial: this.authService.getOfficerId(),
      oficial: this.authService.getOfficerName(),
      comentario: comment,
      accion: 'Nota de Progreso'
    };

    this.dataService.createIncidentLog(this.caseNumber, payload).subscribe({
      next: (newLog) => {
        // Prepend new log note instantly to our local timeline
        this.timelineLogs = [newLog, ...this.timelineLogs];
        this.newNoteComment = '';
        this.isSavingNote = false;
      },
      error: (err) => {
        console.error('Error saving note:', err);
        this.noteError = err.error?.error || 'No se pudo guardar la nota de seguimiento.';
        this.isSavingNote = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/incidents']);
  }

  editIncident() {
    if (this.incident) {
      this.incidentCache.set(this.incident);
    }
    this.router.navigate(['/incidents', this.caseNumber, 'edit']);
  }

  confirmDelete() {
    this.showDeleteModal = true;
    this.deleteError = '';
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.deleteError = '';
  }

  executeDelete() {
    this.isDeleting = true;
    this.deleteError = '';
    this.dataService.deleteIncident(this.caseNumber).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.router.navigate(['/incidents']);
      },
      error: (err) => {
        this.isDeleting = false;
        this.deleteError = err.error?.error || 'Error al eliminar. Por favor intente nuevamente.';
      }
    });
  }

  // --- Detective Actions ---
  isDetective(): boolean {
    return this.profile === 'detective' || this.profile === 'administracion_seguridad' || this.profile === 'administrador';
  }

  showAssignModal = false;
  showEscalateModal = false;

  openAssignModal() {
    this.showAssignModal = true;
    this.detectiveSearchQuery = '';
    this.selectedDetective = null;
  }
  
  cancelAssignModal() {
    this.showAssignModal = false;
  }

  getFilteredDetectives() {
    const q = this.detectiveSearchQuery.trim().toLowerCase();
    if (!q) return this.availableDetectives.slice(0, 50); // limit for perf
    return this.availableDetectives.filter(d => 
      (d.nombres && d.nombres.toLowerCase().includes(q)) || 
      (d.apellidos && d.apellidos.toLowerCase().includes(q)) ||
      (d.placa_policial && d.placa_policial.toLowerCase().includes(q))
    ).slice(0, 50);
  }

  selectDetective(det: any) {
    if (det.current_status !== 'Available') {
      this.showToast(`No se puede asignar a este detective. Estado: ${det.current_status === 'Busy' ? 'Ocupado' : 'Fuera de Servicio'}`, 'error');
      return;
    }
    this.selectedDetective = det;
    this.detectiveSearchQuery = `${det.nombres} ${det.apellidos}`;
    this.showDetectiveDropdown = false;
  }

  confirmAssign() {
    this.showAssignModal = false;
    let officerId, officerName;
    
    if (this.selectedDetective) {
      officerId = this.selectedDetective.id_oficial;
      officerName = `${this.selectedDetective.nombres} ${this.selectedDetective.apellidos}`;
    } else {
      officerId = this.authService.getOfficerId();
      officerName = this.authService.getOfficerName();
    }
    
    this.investigacionService.assignInvestigation(this.caseNumber, officerId, officerName).subscribe({
      next: () => {
        this.showToast('Caso asignado con éxito.', 'success');
        this.fetchFullDetail(); // refresh
      },
      error: (err) => {
        this.showToast(err.error?.error || 'No se pudo asignar el caso.', 'error');
      }
    });
  }

  solicitarAsignacion() {
    const idDetective = this.authService.getOfficerId();
    const nombreDetective = this.authService.getOfficerName();
    if (!idDetective || !nombreDetective) {
      this.showToast('No se pudieron obtener las credenciales del oficial.', 'error');
      return;
    }
    this.investigacionService.solicitarAsignacion(this.caseNumber, idDetective, nombreDetective).subscribe({
      next: () => {
        this.showToast('Solicitud de asignación enviada con éxito a la Jefatura.', 'success');
        this.fetchFullDetail();
      },
      error: (err) => {
        this.showToast(err.error?.error || 'No se pudo solicitar la asignación.', 'error');
      }
    });
  }

  openEscalateModal() {
    this.showEscalateModal = true;
  }

  cancelEscalateModal() {
    this.showEscalateModal = false;
  }

  confirmEscalate() {
    this.showEscalateModal = false;
    const officerId = this.authService.getOfficerId();
    const officerName = this.authService.getOfficerName();
    this.investigacionService.escalateInvestigation(this.caseNumber, officerId, officerName).subscribe({
      next: () => {
        this.showToast('Investigación escalada a caso mayor.', 'success');
        this.fetchFullDetail(); // refresh
      },
      error: (err) => {
        this.showToast(err.error?.error || 'No se pudo escalar la investigación.', 'error');
      }
    });
  }

  showCloseModal = false;
  finalReportText = '';

  openCloseModal() {
    this.showCloseModal = true;
    this.finalReportText = '';
  }
  cancelCloseModal() {
    this.showCloseModal = false;
  }
  confirmCloseInvestigation() {
    if (!this.finalReportText.trim()) {
      this.showToast('Debe ingresar un informe final para cerrar la investigación.', 'error');
      return;
    }
    const officerId = this.authService.getOfficerId();
    const officerName = this.authService.getOfficerName();
    this.investigacionService.closeInvestigation(this.caseNumber, this.finalReportText, officerId, officerName).subscribe({
      next: () => {
        this.showCloseModal = false;
        this.showToast('Investigación cerrada con éxito.', 'success');
        this.fetchFullDetail(); // refresh
      },
      error: (err) => {
        this.showToast(err.error?.error || 'No se pudo cerrar la investigación.', 'error');
      }
    });
  }

  showReopenModal = false;
  reopenReasonText = '';

  openReopenModal() {
    this.showReopenModal = true;
    this.reopenReasonText = '';
  }
  
  cancelReopenModal() {
    this.showReopenModal = false;
  }
  
  confirmReopenInvestigation() {
    if (!this.reopenReasonText.trim()) {
      this.showToast('Debe ingresar un motivo o nueva evidencia para reabrir el caso.', 'error');
      return;
    }
    const officerId = this.authService.getOfficerId();
    const officerName = this.authService.getOfficerName();
    this.investigacionService.reopenInvestigation(this.caseNumber, this.reopenReasonText, officerId, officerName).subscribe({
      next: () => {
        this.showReopenModal = false;
        this.showToast('Investigación reabierta con éxito.', 'success');
        this.fetchFullDetail(); // refresh
      },
      error: (err) => {
        this.showToast(err.error?.error || 'No se pudo reabrir la investigación.', 'error');
      }
    });
  }

  downloadReport() {
    if (this.isDownloading || !this.caseNumber) return;
    this.isDownloading = true;
    
    this.investigacionService.downloadCaseReport(this.caseNumber).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Caso_${this.caseNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isDownloading = false;
        this.showToast('Informe de investigación generado con éxito.', 'success');
      },
      error: (err: any) => {
        console.error('Error downloading report:', err);
        this.showToast(err.error?.error || 'No se pudo generar el informe.', 'error');
        this.isDownloading = false;
      }
    });
  }
}
