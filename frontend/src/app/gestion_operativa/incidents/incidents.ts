import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { IncidentService } from '../../gestion_operativa/services/incident.service';
import { IncidentCacheService } from '../../gestion_operativa/services/incident-cache.service';
import { CategoryService } from '../../administracion_seguridad/services/category.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InvestigacionEspecialService } from '../../investigacion_especial/services/investigacion-especial.service';
import { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';

@Component({
  selector: 'app-incidents',
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent],
  templateUrl: './incidents.html',
  styleUrl: './incidents.css',
})
export class IncidentsComponent implements OnInit {
  showProfileDropdown = false;
  profile: string | null = 'oficial';
  Math = Math;
  incidents: any[] = [];
  patrols: string[] = ['Todas las Patrullas'];
  
  // Stats KPIs (Reporte y Resumen de Incidentes por Patrulla)
  activeCount = 0;
  closedCount = 0;
  predominantType = 'N/A';

  filters = {
    search: '',
    date_range: 'Todo el Historial',
    district: 'Todos los Distritos',
    type: 'Todos los Tipos',
    patrol: 'Todas las Patrullas',
    status: 'all'
  };

  pagination: any = {
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  };

  districts = [
    'Todos los Distritos', 'Distrito 1 - Central', 'Distrito 2 - Wentworth', 'Distrito 3 - Grand Crossing',
    'Distrito 4 - South Chicago', 'Distrito 5 - Calumet', 'Distrito 6 - Gresham', 'Distrito 7 - Englewood',
    'Distrito 8 - Chicago Lawn', 'Distrito 9 - Deering', 'Distrito 10 - Ogden', 'Distrito 11 - Harrison',
    'Distrito 12 - Near West', 'Distrito 14 - Shakespeare', 'Distrito 15 - Austin', 'Distrito 16 - Jefferson Park',
    'Distrito 17 - Albany Park', 'Distrito 18 - Near North', 'Distrito 19 - Town Hall', 'Distrito 20 - Lincoln',
    'Distrito 22 - Morgan Park', 'Distrito 24 - Rogers Park', 'Distrito 25 - Grand Central'
  ];

  crimeTypes = [
    'Todos los Tipos', 'HOMICIDE', 'BATTERY', 'THEFT', 'CRIMINAL DAMAGE', 'NARCOTICS', 'ASSAULT', 'BURGLARY',
    'MOTOR VEHICLE THEFT', 'ROBBERY', 'DECEPTIVE PRACTICE', 'WEAPONS VIOLATION', 'CRIMINAL TRESPASS',
    'PROSTITUTION', 'SEX OFFENSE', 'PUBLIC PEACE VIOLATION', 'KIDNAPPING', 'ARSON'
  ];

  // Searchable Comboboxes State

  statuses = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'active', label: 'Solo Activos (En Investigación)' },
    { value: 'closed', label: 'Solo Cerrados (Arresto Efectuado)' },
    { value: 'high_unresolved', label: 'Alta Prioridad Sin Resolver' }
  ];
  showStatusDropdown = false;
  statusSearchQuery = '';
  filteredStatuses = [...this.statuses];
  showPatrolDropdown = false;
  patrolSearchQuery = '';
  filteredPatrols: string[] = ['Todas las Patrullas'];

  showDistrictDropdown = false;
  districtSearchQuery = '';
  filteredDistricts: string[] = [];

  showCrimeTypeDropdown = false;
  crimeTypeSearchQuery = '';
  filteredCrimeTypes: string[] = [];

  private searchSubject = new Subject<string>();

  solicitudesPendientes: any[] = [];
  showRequestsModal = false;

  constructor(
    public authService: AuthService, 
    private dataService: IncidentService,
    private incidentCache: IncidentCacheService,
    private router: Router,
    private categoryService: CategoryService,
    private investigacionService: InvestigacionEspecialService,
    private logisticsService: LogisticsService
  ) {}

  ngOnInit() {
    this.filteredDistricts = [...this.districts];
    this.filteredCrimeTypes = [...this.crimeTypes];
    this.filteredPatrols = [...this.patrols];

    this.loadPatrolUnits();
    this.categoryService.getCategories('district', false).subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          const formatted = cats.map(c => `Distrito ${parseInt(c.valor, 10)}`);
          this.districts = ['Todos los Distritos', ...Array.from(new Set(formatted))];
          this.filteredDistricts = [...this.districts];
        }
      },
      error: (err) => console.error('Failed to load districts filter:', err)
    });

    this.categoryService.getCategories('primary_type', false).subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          this.crimeTypes = ['Todos los Tipos', ...cats.map(c => c.valor)];
          this.filteredCrimeTypes = [...this.crimeTypes];
        }
      },
      error: (err) => console.error('Failed to load crime types filter:', err)
    });

    this.profile = this.authService.getRole();
    if (!this.profile) {
      this.router.navigate(['/login']);
    }

    // Load assignment requests if administrador (Sheriff)
    if (this.profile === 'administrador') {
      this.loadSolicitudes();
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

  loadPatrolUnits() {
    this.logisticsService.getVehicles().subscribe({
      next: (vehicles: any[]) => {
        const unitSet = new Set<string>();
        unitSet.add('Todas las Patrullas');

        if (vehicles && vehicles.length > 0) {
          vehicles.forEach(v => {
            if (v.placa_vehiculo && v.tipo_vehiculo) {
              unitSet.add(`${v.placa_vehiculo} (${v.tipo_vehiculo})`);
            }
            if (v.placa_vehiculo) {
              unitSet.add(v.placa_vehiculo);
            }
          });
        }

        this.logisticsService.getPatrolShifts().subscribe({
          next: (shifts: any[]) => {
            if (shifts && shifts.length > 0) {
              shifts.forEach(s => {
                if (s.vehicle_plate) {
                  unitSet.add(s.vehicle_plate);
                }
              });
            }
            this.patrols = Array.from(unitSet);
            this.filteredPatrols = [...this.patrols];
          },
          error: () => {
            this.patrols = Array.from(unitSet);
            this.filteredPatrols = [...this.patrols];
          }
        });
      },
      error: (err) => {
        console.error('Failed to load patrol vehicles:', err);
        this.patrols = [
          'Todas las Patrullas',
          'CPD-001 (SUV Patrol)', 'CPD-002 (Sedan)', 'CPD-003 (SUV Patrol)', 'CPD-004 (Sedan)',
          'CPD-005 (Transport Van)', 'CPD-006 (SUV Patrol)', 'CPD-007 (Sedan)', 'CPD-008 (SUV Patrol)',
          'CPD-009 (K9 Unit)', 'CPD-010 (Sedan)', 'CPD-011 (SUV Patrol)', 'CPD-012 (Sedan)',
          'CPD-013 (Armored)', 'CPD-014 (SUV Patrol)', 'CPD-015 (Sedan)', 'AAA123', 'CPD-101010'
        ];
        this.filteredPatrols = [...this.patrols];
      }
    });
  }

  // Patrol Combobox Methods
  onPatrolFocus() {
    this.showPatrolDropdown = true;
    if (this.filters.patrol === 'Todas las Patrullas' || this.filters.patrol === 'All Patrols') {
      this.filteredPatrols = [...this.patrols];
    } else {
      this.patrolSearchQuery = this.filters.patrol;
      this.filteredPatrols = this.patrols.filter(p => p.toLowerCase().includes(this.patrolSearchQuery.toLowerCase().trim()));
    }
  }

  onPatrolSearchInput(query: string) {
    this.patrolSearchQuery = query;
    this.showPatrolDropdown = true;
    const q = query.toLowerCase().trim();

    if (!q) {
      this.filters.patrol = 'Todas las Patrullas';
      this.filteredPatrols = [...this.patrols];
      this.applyFilters();
      return;
    }

    this.filteredPatrols = this.patrols.filter(p => p.toLowerCase().includes(q));

    const exactMatch = this.patrols.find(p => p.toLowerCase() === q);
    if (exactMatch) {
      this.filters.patrol = exactMatch;
    } else {
      this.filters.patrol = query;
    }
    this.applyFilters();
  }

  selectPatrol(p: string) {
    this.filters.patrol = p;
    this.patrolSearchQuery = (p === 'Todas las Patrullas' || p === 'All Patrols') ? '' : p;
    this.showPatrolDropdown = false;
    this.applyFilters();
  }

  clearPatrolSelection() {
    this.filters.patrol = 'Todas las Patrullas';
    this.patrolSearchQuery = '';
    this.filteredPatrols = [...this.patrols];
    this.showPatrolDropdown = false;
    this.applyFilters();
  }


  getStatusLabel(val: string) {
    return this.statuses.find(s => s.value === val)?.label || val;
  }

  onStatusFocus() {
    this.showStatusDropdown = true;
    if (this.filters.status === 'all') {
      this.filteredStatuses = [...this.statuses];
    } else {
      this.statusSearchQuery = this.getStatusLabel(this.filters.status);
      this.filteredStatuses = this.statuses.filter(s => s.label.toLowerCase().includes(this.statusSearchQuery.toLowerCase().trim()));
    }
  }

  onStatusSearchInput(query: string) {
    this.statusSearchQuery = query;
    this.showStatusDropdown = true;
    const q = query.toLowerCase().trim();

    if (!q) {
      this.filters.status = 'all';
      this.filteredStatuses = [...this.statuses];
      this.applyFilters();
      return;
    }
    this.filteredStatuses = this.statuses.filter(s => s.label.toLowerCase().includes(q));
  }

  selectStatus(s: any) {
    this.filters.status = s.value;
    this.statusSearchQuery = s.value === 'all' ? '' : s.label;
    this.showStatusDropdown = false;
    this.applyFilters();
  }

  clearStatusSelection() {
    this.filters.status = 'all';
    this.statusSearchQuery = '';
    this.filteredStatuses = [...this.statuses];
    this.showStatusDropdown = false;
    this.applyFilters();
  }

  onDistrictFocus() {
    this.showDistrictDropdown = true;
    if (this.filters.district === 'Todos los Distritos' || this.filters.district === 'All Districts') {
      this.filteredDistricts = [...this.districts];
    } else {
      this.districtSearchQuery = this.filters.district;
      this.filteredDistricts = this.districts.filter(d => d.toLowerCase().includes(this.districtSearchQuery.toLowerCase().trim()));
    }
  }

  onDistrictSearchInput(query: string) {
    this.districtSearchQuery = query;
    this.showDistrictDropdown = true;
    const q = query.toLowerCase().trim();

    if (!q) {
      this.filters.district = 'Todos los Distritos';
      this.filteredDistricts = [...this.districts];
      this.applyFilters();
      return;
    }
    this.filteredDistricts = this.districts.filter(d => d.toLowerCase().includes(q));
  }

  selectDistrict(d: string) {
    this.filters.district = d;
    this.districtSearchQuery = (d === 'Todos los Distritos' || d === 'All Districts') ? '' : d;
    this.showDistrictDropdown = false;
    this.applyFilters();
  }

  clearDistrictSelection() {
    this.filters.district = 'Todos los Distritos';
    this.districtSearchQuery = '';
    this.filteredDistricts = [...this.districts];
    this.showDistrictDropdown = false;
    this.applyFilters();
  }

  onCrimeTypeFocus() {
    this.showCrimeTypeDropdown = true;
    if (this.filters.type === 'Todos los Tipos' || this.filters.type === 'All Types') {
      this.filteredCrimeTypes = [...this.crimeTypes];
    } else {
      this.crimeTypeSearchQuery = this.filters.type;
      this.filteredCrimeTypes = this.crimeTypes.filter(c => c.toLowerCase().includes(this.crimeTypeSearchQuery.toLowerCase().trim()));
    }
  }

  onCrimeTypeSearchInput(query: string) {
    this.crimeTypeSearchQuery = query;
    this.showCrimeTypeDropdown = true;
    const q = query.toLowerCase().trim();

    if (!q) {
      this.filters.type = 'Todos los Tipos';
      this.filteredCrimeTypes = [...this.crimeTypes];
      this.applyFilters();
      return;
    }
    this.filteredCrimeTypes = this.crimeTypes.filter(c => c.toLowerCase().includes(q));
  }

  selectCrimeType(c: string) {
    this.filters.type = c;
    this.crimeTypeSearchQuery = (c === 'Todos los Tipos' || c === 'All Types') ? '' : c;
    this.showCrimeTypeDropdown = false;
    this.applyFilters();
  }

  clearCrimeTypeSelection() {
    this.filters.type = 'Todos los Tipos';
    this.crimeTypeSearchQuery = '';
    this.filteredCrimeTypes = [...this.crimeTypes];
    this.showCrimeTypeDropdown = false;
    this.applyFilters();
  }

  loadSolicitudes() {
    this.investigacionService.obtenerSolicitudes('Pendiente').subscribe({
      next: (data) => {
        this.solicitudesPendientes = data;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes de asignación:', err);
      }
    });
  }

  resolverSolicitud(idSolicitud: string, accion: string) {
    const idSheriff = this.authService.getOfficerId();
    const nombreSheriff = this.authService.getOfficerName();
    if (!idSheriff || !nombreSheriff) {
      alert('Error: No se pudo obtener la información de credenciales del Sheriff.');
      return;
    }

    this.investigacionService.resolverSolicitud(idSolicitud, accion, idSheriff, nombreSheriff).subscribe({
      next: () => {
        this.loadSolicitudes(); // Reload requests list
        this.loadIncidents(this.pagination.page); // Reload incident list to show updated status
      },
      error: (err) => {
        alert('Error al resolver la solicitud: ' + (err.error?.error || 'Desconocido'));
      }
    });
  }

  openRequestsModal() {
    this.showRequestsModal = true;
    this.loadSolicitudes();
  }

  closeRequestsModal() {
    this.showRequestsModal = false;
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
        this.calculateStats();
      },
      error: (err) => {
        console.error('Error loading incidents:', err);
      }
    });
  }

  calculateStats() {
    this.activeCount = this.incidents.filter(i => !i.arrest).length;
    this.closedCount = this.incidents.filter(i => i.arrest).length;

    if (this.incidents.length > 0) {
      const typeCounts: Record<string, number> = {};
      this.incidents.forEach(i => {
        const type = i.primary_type || 'OTRO';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      let maxCount = 0;
      let topType = 'N/A';
      for (const [type, count] of Object.entries(typeCounts)) {
        if (count > maxCount) {
          maxCount = count;
          topType = type;
        }
      }
      this.predominantType = topType;
    } else {
      this.predominantType = 'N/A';
    }
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
