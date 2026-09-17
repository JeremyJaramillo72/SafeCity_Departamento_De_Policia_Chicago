import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { InvestigacionEspecialService } from '../services/investigacion-especial.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-my-cases',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent],
  templateUrl: './my-cases.html',
})
export class MyCasesComponent implements OnInit {
  showProfileDropdown = false;
  profile: string | null = 'oficial';
  allCases: any[] = [];
  filteredCases: any[] = [];
  
  filters = {
    search: '',
    estado: 'All',
    prioridad: 'Todas'
  };

  constructor(
    public authService: AuthService, 
    private dataService: InvestigacionEspecialService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    if (!this.profile) {
      this.router.navigate(['/login']);
    }
    this.loadMyCases();
  }

  myRequests: any[] = [];
  showRequestsModal = false;

  openRequestsModal() {
    this.showRequestsModal = true;
  }

  closeRequestsModal() {
    this.showRequestsModal = false;
  }

  loadMyCases() {
    const officerId = this.authService.getOfficerId();
    if (officerId) {
      this.dataService.getMyInvestigations(officerId).subscribe({
        next: (data) => {
          this.allCases = data;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Error loading my cases:', err);
        }
      });

      // Cargar mis solicitudes pendientes de asignación
      this.dataService.obtenerSolicitudes('Pendiente', officerId).subscribe({
        next: (data) => {
          this.myRequests = data;
        },
        error: (err) => {
          console.error('Error loading my requests:', err);
        }
      });
    }
  }

  applyFilters() {
    let cases = [...this.allCases];

    // Filter by search
    if (this.filters.search) {
      const q = this.filters.search.toLowerCase().trim();
      cases = cases.filter(c => 
        c.case_number.toLowerCase().includes(q) || 
        c.primary_type.toLowerCase().includes(q)
      );
    }

    // Filter by status (estado)
    if (this.filters.estado !== 'All') {
      cases = cases.filter(c => c.estado === this.filters.estado);
    }

    // Filter by priority
    if (this.filters.prioridad === 'Caso Mayor') {
      cases = cases.filter(c => c.es_caso_mayor);
    } else if (this.filters.prioridad === 'Normal') {
      cases = cases.filter(c => !c.es_caso_mayor);
    }

    this.filteredCases = cases;
  }

  viewIncident(caseNumber: string) {
    this.router.navigate(['/incidents', caseNumber]);
  }
}
