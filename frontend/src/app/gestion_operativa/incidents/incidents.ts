import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { IncidentService } from '../../gestion_operativa/services/incident.service';
import { IncidentCacheService } from '../../gestion_operativa/services/incident-cache.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-incidents',
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent],
  templateUrl: './incidents.html',
  styleUrl: './incidents.css',
})
export class IncidentsComponent implements OnInit {
  profile: string | null = 'oficial';
  Math = Math;
  incidents: any[] = [];
  
  filters = {
    search: '',
    date_range: 'All Time',
    district: 'All Districts',
    type: 'All Types'
  };

  pagination: any = {
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  };

  private searchSubject = new Subject<string>();

  constructor(
    private authService: AuthService, 
    private dataService: IncidentService,
    private incidentCache: IncidentCacheService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    if (!this.profile) {
      this.router.navigate(['/login']);
    }

    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(400), // Wait 400ms after last keystroke
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });

    this.loadIncidents(1);
  }

  onSearchChange(value: string) {
    this.filters.search = value;
    this.searchSubject.next(value);
  }

  loadIncidents(page: number) {
    this.dataService.getIncidents(page, 10, this.filters).subscribe({
      next: (res) => {
        this.incidents = res.data;
        this.pagination = res.pagination;
      },
      error: (err) => {
        console.error('Error loading incidents:', err);
      }
    });
  }

  applyFilters() {
    this.loadIncidents(1); // Reload from page 1 when filters change
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
    // Find the full incident object from the already-loaded list
    const incident = this.incidents.find(i => i.case_number === caseNumber);
    if (incident) {
      this.incidentCache.set(incident);
    }
    this.router.navigate(['/incidents', caseNumber]);
  }
}
