import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { IncidentCacheService } from '../services/incident-cache.service';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-incident-detail',
  imports: [RouterLink, CommonModule, SidebarComponent, FormsModule],
  templateUrl: './incident-detail.html',
  styleUrl: './incident-detail.css',
})
export class IncidentDetailComponent implements OnInit {
  profile: string | null = null;
  incident: any = null;
  isLoading = true;
  hasError = false;
  caseNumber = '';
  showDeleteModal = false;
  isDeleting = false;
  deleteError = '';

  timelineLogs: any[] = [];
  newNoteComment = '';
  isSavingNote = false;
  noteError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private dataService: DataService,
    private incidentCache: IncidentCacheService
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
      status_label: data.status_label || (data.arrest ? 'Closed - Arrest Made' : 'Active Investigation'),
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
      case 'CRITICAL': return 'bg-error-container text-on-error-container';
      case 'HIGH': return 'bg-tertiary-container text-on-tertiary-container';
      default: return 'bg-secondary-container text-on-secondary-container';
    }
  }

  getFbiCodeLabel(): string {
    const codes: Record<string, string> = {
      '01A': 'Murder/Non-Neg. Manslaughter', '02': 'Criminal Sexual Assault',
      '03': 'Robbery', '04A': 'Aggravated Assault', '04B': 'Aggravated Battery',
      '05': 'Burglary', '06': 'Larceny', '07': 'Motor Vehicle Theft',
      '09': 'Arson', '10': 'Forgery & Counterfeiting', '11': 'Fraud',
      '14': 'Weapons Violation', '15': 'Sex Offense', '17': 'Gambling',
      '18': 'Offenses Involving Children', '19': 'Narcotics', '20': 'Liquor Law',
      '22': 'Stalking', '24': 'Disorderly Conduct', '26': 'Misc. Non-Index',
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
        this.deleteError = err.error?.error || 'Failed to delete. Please try again.';
      }
    });
  }
}
