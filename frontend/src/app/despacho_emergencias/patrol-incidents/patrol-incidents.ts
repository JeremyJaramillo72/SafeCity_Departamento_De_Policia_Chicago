import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { SidebarComponent } from '../../sidebar/sidebar';
import { EmergencyService } from '../services/emergency.service';
import { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';
import { IncidentCacheService } from '../../gestion_operativa/services/incident-cache.service';

@Component({
  selector: 'app-patrol-incidents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './patrol-incidents.html',
  styleUrls: ['./patrol-incidents.css']
})
export class PatrolIncidentsComponent implements OnInit {
  showProfileDropdown = false;
  isLoading = true;
  Math = Math;

  incidents: any[] = [];
  patrols: string[] = ['Todas las Patrullas'];

  filters = {
    patrol: 'Todas las Patrullas',
    status: 'all', // 'all', 'active', 'closed'
    type: 'Todos los Tipos',
    search: ''
  };

  pagination = {
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  };

  crimeTypes = [
    'Todos los Tipos', 'HOMICIDE', 'BATTERY', 'THEFT', 'CRIMINAL DAMAGE', 'NARCOTICS', 'ASSAULT', 'BURGLARY',
    'MOTOR VEHICLE THEFT', 'ROBBERY', 'DECEPTIVE PRACTICE', 'WEAPONS VIOLATION', 'CRIMINAL TRESPASS', 'ARSON'
  ];

  // Stats
  activeCount = 0;
  closedCount = 0;
  predominantType = 'N/A';

  private searchSubject = new Subject<string>();

  constructor(
    public authService: AuthService,
    private emergencyService: EmergencyService,
    private logisticsService: LogisticsService,
    private incidentCache: IncidentCacheService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPatrolUnits();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });

    this.loadIncidents(1);
  }

  loadPatrolUnits() {
    this.logisticsService.getPatrolShifts().subscribe({
      next: (shifts: any[]) => {
        if (shifts && shifts.length > 0) {
          const unitSet = new Set<string>();
          shifts.forEach(s => {
            if (s.vehicle_plate) {
              unitSet.add(`Patrulla ${s.vehicle_plate}`);
            }
            if (s.officer_name) {
              unitSet.add(`P-${s.id_turno || s.id} (${s.officer_name})`);
            }
          });
          this.patrols = ['Todas las Patrullas', ...Array.from(unitSet)];
        }
      },
      error: (err) => console.error('Error loading patrol units:', err)
    });
  }

  onSearchChange(value: string) {
    this.filters.search = value;
    this.searchSubject.next(value);
  }

  loadIncidents(page = 1) {
    this.isLoading = true;
    this.pagination.page = page;

    const payloadFilters = {
      page: page,
      limit: this.pagination.per_page,
      patrol: this.filters.patrol,
      status: this.filters.status,
      type: this.filters.type,
      search: this.filters.search
    };

    this.emergencyService.getPatrolIncidentsReport(payloadFilters).subscribe({
      next: (res: any) => {
        this.incidents = res.data || [];
        this.pagination = res.pagination || this.pagination;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading patrol incidents report:', err);
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    this.activeCount = this.incidents.filter(i => !i.arrest).length;
    this.closedCount = this.incidents.filter(i => i.arrest).length;

    // Calculate predominant type in current dataset
    if (this.incidents.length > 0) {
      const typeCounts: Record<string, number> = {};
      this.incidents.forEach(i => {
        const type = i.primary_type || 'OTHER';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      let maxCount = 0;
      let topType = 'N/A';
      Object.entries(typeCounts).forEach(([type, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topType = type;
        }
      });
      this.predominantType = topType;
    } else {
      this.predominantType = 'N/A';
    }
  }

  applyFilters() {
    this.loadIncidents(1);
  }

  nextPage() {
    if (this.pagination.page < this.pagination.total_pages) {
      this.loadIncidents(this.pagination.page + 1);
    }
  }

  prevPage() {
    if (this.pagination.page > 1) {
      this.loadIncidents(this.pagination.page - 1);
    }
  }

  viewIncident(caseNumber: string) {
    const incident = this.incidents.find(i => i.case_number === caseNumber);
    if (incident) {
      this.incidentCache.set(incident);
    }
    this.router.navigate(['/incidents', caseNumber]);
  }

  getSeverityClass(primaryType: string): string {
    const criticalTypes = ['HOMICIDE', 'ASSAULT', 'ROBBERY', 'KIDNAPPING', 'ARSON', 'BATTERY'];
    const highTypes = ['BURGLARY', 'MOTOR VEHICLE THEFT', 'WEAPONS VIOLATION', 'SEX OFFENSE'];

    if (criticalTypes.some(t => (primaryType || '').toUpperCase().includes(t))) {
      return 'bg-error-container text-on-error-container border border-error/20';
    } else if (highTypes.some(t => (primaryType || '').toUpperCase().includes(t))) {
      return 'bg-tertiary-container text-on-tertiary-container border border-tertiary/20';
    }
    return 'bg-secondary-container text-on-secondary-container border border-secondary/20';
  }
}
