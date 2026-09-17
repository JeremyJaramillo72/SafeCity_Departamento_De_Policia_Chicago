import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { IncidentService } from '../services/incident.service';

@Component({
  selector: 'app-auxiliary-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './auxiliary-reports.html',
})
export class AuxiliaryReportsComponent implements OnInit {
  showProfileDropdown = false;
  activeTab: 'taser' | 'tow' | 'community' = 'taser';
  isLoading = false;
  
  newTaser = { id_incidente: '', serial_taser: '', justificacion: '' };
  newTow = { ubicacion: '', motivo: '' };
  newMeeting = { ubicacion: '', comentarios_vecinales: '' };

  tasers: any[] = [];
  tows: any[] = [];
  meetings: any[] = [];

  // Incident Autocomplete for Taser Discharge
  caseSuggestions: any[] = [];
  showCaseSuggestions = false;
  isSearchingCases = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;
  Math = Math;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private incidentService: IncidentService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8000/api/operativa/taser-discharges/').subscribe({
      next: (d) => {
        this.tasers = d;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
    this.http.get<any[]>('http://localhost:8000/api/operativa/tow-dispatches/').subscribe(d => this.tows = d);
  }

  showToast(message: string, isError: boolean = false) {
    if (isError) {
      this.errorMessage = message;
      this.successMessage = null;
    } else {
      this.successMessage = message;
      this.errorMessage = null;
    }
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 4500);
  }

  searchCases(term: string) {
    if (!term || term.trim().length < 2) {
      this.caseSuggestions = [];
      this.showCaseSuggestions = false;
      return;
    }
    this.isSearchingCases = true;
    this.incidentService.getIncidents(1, 8, { search: term }).subscribe({
      next: (res: any) => {
        this.caseSuggestions = res.results || [];
        this.showCaseSuggestions = true;
        this.isSearchingCases = false;
      },
      error: () => {
        this.isSearchingCases = false;
      }
    });
  }

  selectCase(caseObj: any) {
    this.newTaser.id_incidente = caseObj.case_number;
    this.showCaseSuggestions = false;
    this.caseSuggestions = [];
  }



  submitTaser() {
    this.isLoading = true;
    const payload = {
      ...this.newTaser,
      id_oficial: this.authService.getOfficerId()
    };
    this.http.post('http://localhost:8000/api/operativa/taser-discharges/', payload).subscribe({
      next: () => {
        this.showToast('Informe de fuerza no letal (Taser) enviado con éxito a Asuntos Internos.');
        this.newTaser = { id_incidente: '', serial_taser: '', justificacion: '' };
        this.loadData();
      },
      error: (err) => {
        this.showToast('Error al enviar el informe de fuerza Taser.', true);
        this.isLoading = false;
      }
    });
  }

  submitTow() {
    this.isLoading = true;
    this.http.post('http://localhost:8000/api/operativa/tow-dispatches/', this.newTow).subscribe({
      next: () => {
        this.showToast('Grúa solicitada con éxito al centro de despacho logístico.');
        this.newTow = { ubicacion: '', motivo: '' };
        this.loadData();
      },
      error: (err) => {
        this.showToast('Error al enviar la solicitud de grúa.', true);
        this.isLoading = false;
      }
    });
  }
}
