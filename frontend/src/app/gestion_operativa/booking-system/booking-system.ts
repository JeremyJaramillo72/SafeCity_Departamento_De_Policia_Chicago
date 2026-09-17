import { RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { IncidentService } from '../services/incident.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-booking-system',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './booking-system.html',
})
export class BookingSystemComponent implements OnInit, OnDestroy {
  showProfileDropdown = false;
  activeTab: 'cells' | 'list' | 'booking' | 'visits' = 'cells';
  isLoading = false;
  editingId: string | null = null;
  
  bookings: any[] = [];
  selectedBooking: any = null;
  bookingLogs: any[] = [];
  
  // Cells state
  cellsData: any[] = [];
  cellBlocks = [
    { block: 'A', cells: ['C-101', 'C-102', 'C-103', 'C-104', 'C-105'] },
    { block: 'B', cells: ['C-201', 'C-202', 'C-203', 'C-204', 'C-205'] },
    { block: 'Solitary', cells: ['S-01', 'S-02', 'S-03'] }
  ];
  
  newBooking = {
    nombre_detenido: '',
    alias: '',
    fecha_nacimiento: '',
    genero: '',
    nacionalidad: '',
    id_incidente_asociado: '',
    cargo_principal: '',
    gravedad_cargo: 'Delito Menor',
    estatura: null as number | null,
    peso: null as number | null,
    senas_particulares: '',
    numero_celda: '',
    estado_salud: 'Estable',
    nivel_intoxicacion: 'Sobrio',
    articulos_retenidos: '',
    dinero_retenido: 0,
    id_sospechoso: null as number | null,
    hora_ingreso: '',
    hora_salida: '',
    custodia_estado: 'Activa',
    motivo_salida: '',
    permiso_visitas: 'No especificado',
    permiso_llamadas: 'No especificado',
    permiso_patio: 'No especificado'
  };



  // Autocomplete Incident State
  caseSuggestions: any[] = [];
  showCaseSuggestions = false;
  isSearchingCases = false;

  // Autocomplete Suspects State
  suspectSuggestions: any[] = [];
  showSuspectSuggestions = false;
  isSearchingSuspects = false;
  associatedSuspects: any[] = []; // Suspects linked to the selected incident
  suspectCases: any[] = []; // Cases linked to the selected suspect

  // Autocomplete Active Bookings State (for Visits)
  bookingSuggestions: any[] = [];
  showBookingSuggestions = false;
  isSearchingBookings = false;
  visitFilterType: string = 'ALL';

  // Belongings (Locker-style evidence inventory)
  belongings: any[] = [];
  newBelonging = {
    nombre: '',
    categoria: 'Other',
    estado: 'Good'
  };
  belongingCategories = ['Cash/Documents', 'Electronics', 'Jewelry/Accessory', 'Clothing', 'Keys', 'Other'];
  belongingConditions = ['Excellent', 'Good', 'Worn', 'Damaged'];

  // Filters & Pagination
  filters = {
    search_nombre: '',
    search_sospechoso: '',
    custodia_estado: 'Todos',
    date_range: 'All Time'
  };

  pagination = { page: 1, per_page: 10, total: 0, total_pages: 1 };
  Math = Math;
  private searchSubject = new Subject<void>();

  showReleaseModal = false;
  releaseMotivo = '';
  releasingId: string | null = null;

  // Visitas y Llamadas
  showVisitModal = false;
  visitsList: any[] = [];
  isLoadingVisits = false;
  isSubmittingVisit = false;
  newVisit = {
    tipo: 'VISITA',
    id_ingreso: '',
    nombre_detenido: '',
    nombre_visitante: '',
    relacion: '',
    telefono: '',
    duracion_minutos: '',
    notas: '',
    fecha_hora: ''
  };

  openVisitModal() {
    this.newVisit = {
      tipo: 'VISITA',
      id_ingreso: '',
      nombre_detenido: '',
      nombre_visitante: '',
      relacion: '',
      telefono: '',
      duracion_minutos: '',
      notas: '',
      fecha_hora: new Date().toISOString().slice(0, 16)
    };
    this.bookingSuggestions = [];
    this.showBookingSuggestions = false;
    this.showVisitModal = true;
  }

  closeVisitModal() {
    this.showVisitModal = false;
  }

  submitVisit() {
    if (!this.newVisit.tipo || !this.newVisit.nombre_visitante.trim()) return;
    this.isSubmittingVisit = true;

    const tipoLabel = this.newVisit.tipo === 'VISITA' ? 'Visita' :
                      this.newVisit.tipo === 'VISITA_LEGAL' ? 'Visita Legal' :
                      this.newVisit.tipo === 'VISITA_FAMILIAR' ? 'Visita Familiar' : 'Llamada Telefónica';

    const descObj = {
      nombre_visitante: String(this.newVisit.nombre_visitante || '').trim(),
      relacion: String(this.newVisit.relacion || '').trim() || 'Sin especificar',
      telefono: String(this.newVisit.telefono || '').trim() || '—',
      duracion_minutos: String(this.newVisit.duracion_minutos || '').trim(),
      notas: String(this.newVisit.notas || '').trim(),
      texto_plano: `${tipoLabel} de ${this.newVisit.nombre_visitante} (${this.newVisit.relacion || 'Sin especificar'}).` +
        (this.newVisit.telefono ? ` Tel: ${this.newVisit.telefono}.` : '') +
        (this.newVisit.duracion_minutos ? ` Duración: ${this.newVisit.duracion_minutos} min.` : '') +
        (this.newVisit.notas ? ` Notas: ${this.newVisit.notas}.` : '')
    };

    const payload = {
      id_ingreso: this.newVisit.id_ingreso || null,
      tipo_accion: this.newVisit.tipo,
      descripcion: JSON.stringify(descObj),
      fecha_hora: this.newVisit.fecha_hora || new Date().toISOString()
    };

    this.http.post('http://localhost:8000/api/operativa/bookings/logs/', payload).subscribe({
      next: () => {
        this.isSubmittingVisit = false;
        this.showVisitModal = false;
        this.loadVisits();
      },
      error: () => {
        this.isSubmittingVisit = false;
        alert('Error al registrar. Por favor intente nuevamente.');
      }
    });
  }

  switchTab(tab: any) {
    this.activeTab = tab;
    if (tab === 'cells') {
      this.loadCells();
    } else if (tab === 'visits') {
      this.loadVisits();
    }
  }

  loadVisits() {
    this.isLoadingVisits = true;
    this.http.get<any[]>('http://localhost:8000/api/operativa/bookings/logs/?tipo=visitas').subscribe({
      next: (data) => {
        this.visitsList = data;
        this.isLoadingVisits = false;
      },
      error: () => { this.isLoadingVisits = false; }
    });
  }

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private incidentService: IncidentService
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(400)
    ).subscribe(() => {
      this.applyFilters();
    });

    this.loadBookings();
    this.loadCells();
    this.loadVisits();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  getLocalISOString(date: Date): string {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
  }

  loadCells() {
    const ts = new Date().getTime();
    this.http.get<any>(`http://localhost:8000/api/operativa/cells/?t=${ts}`).subscribe({
      next: (res) => {
        this.cellsData = res.data || [];
      },
      error: (err) => console.error('Error loading cells:', err)
    });
  }

  get availableCells(): string[] {
    const allCells = this.cellBlocks.flatMap(b => b.cells);
    const occupiedCells = this.cellsData.map(c => c.numero_celda);
    return allCells.filter(c => !occupiedCells.includes(c));
  }

  calculateAge(dob: string): number | null {
    if (!dob) return null;
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  getCellData(cellId: string) {
    if (!this.cellsData) return undefined;
    return this.cellsData.find(c => c.numero_celda && c.numero_celda.trim() === cellId.trim());
  }

  getMinutesSinceRound(ultima_ronda: string): number {
    if (!ultima_ronda) return 0;
    const now = new Date();
    const utcStr = ultima_ronda.endsWith('Z') ? ultima_ronda : ultima_ronda + 'Z';
    const lastRound = new Date(utcStr);
    return Math.floor((now.getTime() - lastRound.getTime()) / 60000);
  }

  showRoundModal = false;
  roundIngresoId: string | null = null;

  registrarRonda(id_ingreso: string) {
    this.roundIngresoId = id_ingreso;
    this.showRoundModal = true;
  }

  confirmRegistrarRonda() {
    if (!this.roundIngresoId) return;
    this.isLoading = true;
    const id_ingreso = this.roundIngresoId;
    const rondaLog = { tipo_accion: 'RONDA_SUPERVISION', descripcion: 'Ronda de supervisión regular OK.' };
    this.http.post(`http://localhost:8000/api/operativa/bookings/${id_ingreso}/logs/`, rondaLog).subscribe({
      next: () => {
        this.loadCells();
        this.isLoading = false;
        this.showRoundModal = false;
        this.roundIngresoId = null;
      },
      error: (err) => {
        alert('Error al registrar la ronda');
        this.isLoading = false;
        this.showRoundModal = false;
        this.roundIngresoId = null;
      }
    });
  }

  loadBookings() {
    let params: any = {
      page: this.pagination.page.toString(),
      limit: this.pagination.per_page.toString()
    };
    
    if (this.filters.search_nombre) {
      params.search_nombre = this.filters.search_nombre;
    }
    if (this.filters.search_sospechoso) {
      params.search_sospechoso = this.filters.search_sospechoso;
    }
    // Force filter only active bookings for the tactical view
    params.custodia_estado = 'Activa';
    if (this.filters.date_range && this.filters.date_range !== 'All Time') {
      params.date_range = this.filters.date_range;
    }

    this.http.get<any>('http://localhost:8000/api/operativa/bookings/', { params }).subscribe({
      next: (res) => {
        this.bookings = res.data;
        this.pagination = res.pagination;
      },
      error: (err) => console.error(err)
    });
  }

  applyFilters() {
    this.pagination.page = 1;
    this.loadBookings();
  }

  nextPage() {
    if (this.pagination.page < this.pagination.total_pages) {
      this.pagination.page++;
      this.loadBookings();
    }
  }

  prevPage() {
    if (this.pagination.page > 1) {
      this.pagination.page--;
      this.loadBookings();
    }
  }

  onSearchNombreChange(value: string) {
    this.filters.search_nombre = value;
    this.searchSubject.next();
  }

  onSearchSospechosoChange(value: string) {
    this.filters.search_sospechoso = value;
    this.searchSubject.next();
  }

  openNewForm() {
    this.editingId = null;
    this.newBooking = {
      nombre_detenido: '',
      alias: '',
      fecha_nacimiento: '',
      genero: '',
      nacionalidad: '',
      id_incidente_asociado: '',
      cargo_principal: '',
      gravedad_cargo: 'Delito Menor',
      estatura: null,
      peso: null,
      senas_particulares: '',
      numero_celda: '',
      estado_salud: 'Estable',
      nivel_intoxicacion: 'Sobrio',
      articulos_retenidos: '',
      dinero_retenido: 0,
      id_sospechoso: null,
      hora_ingreso: this.getLocalISOString(new Date()),
      hora_salida: '',
      custodia_estado: 'Activa',
      motivo_salida: '',
      permiso_visitas: 'No especificado',
      permiso_llamadas: 'No especificado',
      permiso_patio: 'No especificado'
    };
    this.belongings = [];
    this.associatedSuspects = [];
    this.suspectCases = [];
    this.activeTab = 'booking';
    this.loadCells();
  }

  editBooking(b: any) {
    this.editingId = b.id_ingreso;
    this.loadCells();
    
    const entryDate = b.hora_ingreso ? new Date(b.hora_ingreso) : new Date();
    const exitDate = b.hora_salida ? new Date(b.hora_salida) : null;

    this.newBooking = {
      nombre_detenido: b.nombre_detenido || '',
      alias: b.alias || '',
      fecha_nacimiento: b.fecha_nacimiento || '',
      genero: b.genero || '',
      nacionalidad: b.nacionalidad || '',
      id_incidente_asociado: b.id_incidente_asociado || '',
      cargo_principal: b.cargo_principal || '',
      gravedad_cargo: b.gravedad_cargo || 'Delito Menor',
      estatura: b.estatura || null,
      peso: b.peso || null,
      senas_particulares: b.senas_particulares || '',
      numero_celda: b.numero_celda || '',
      estado_salud: b.estado_salud || 'Estable',
      nivel_intoxicacion: b.nivel_intoxicacion || 'Sobrio',
      articulos_retenidos: b.articulos_retenidos || '',
      dinero_retenido: b.dinero_retenido || 0,
      id_sospechoso: b.id_sospechoso || null,
      hora_ingreso: b.hora_ingreso ? this.getLocalISOString(entryDate) : '',
      hora_salida: exitDate ? this.getLocalISOString(exitDate) : '',
      custodia_estado: b.custodia_estado || 'Activa',
      motivo_salida: b.motivo_salida || '',
      permiso_visitas: b.permiso_visitas || 'No especificado',
      permiso_llamadas: b.permiso_llamadas || 'No especificado',
      permiso_patio: b.permiso_patio || 'No especificado'
    };

    // Load belongings
    this.belongings = [];
    this.suspectCases = [];
    const articulos = b.articulos_retenidos;
    if (articulos) {
      try {
        const parsed = JSON.parse(articulos);
        if (Array.isArray(parsed)) {
          this.belongings = parsed;
        } else {
          this.belongings = [{ nombre: articulos, categoria: 'Otro', estado: 'Bueno' }];
        }
      } catch (e) {
        this.belongings = articulos.split(',').map((item: string) => ({
          nombre: item.trim(),
          categoria: 'Otro',
          estado: 'Bueno'
        })).filter((item: any) => item.nombre.length > 0);
      }
    }

    // Load associated suspects
    this.associatedSuspects = [];
    if (b.id_incidente_asociado) {
      this.incidentService.getIncidentDetail(b.id_incidente_asociado).subscribe({
        next: (res) => {
          if (res && res.suspects) {
            this.associatedSuspects = res.suspects;
          }
        },
        error: (err) => console.error('Error fetching incident suspects:', err)
      });
    }

    this.activeTab = 'booking';
  }

  deleteBooking(id: string) {
    if (!confirm('¿Está seguro de que desea eliminar este registro de custodia y su bitácora?')) return;
    this.http.delete(`http://localhost:8000/api/operativa/bookings/${id}/`).subscribe({
      next: () => {
        if (this.selectedBooking?.id_ingreso === id) {
          this.selectedBooking = null;
        }
        this.loadBookings();
        this.loadCells();
      },
      error: (err) => console.error(err)
    });
  }

  // Autocomplete Incident Methods
  searchCases(term: any) {
    const termStr = term ? term.toString() : '';
    if (!termStr || termStr.trim().length < 2) {
      this.caseSuggestions = [];
      this.showCaseSuggestions = false;
      return;
    }
    this.isSearchingCases = true;
    this.showCaseSuggestions = true;
    this.incidentService.getIncidents(1, 10, { search: termStr }).subscribe({
      next: (res) => {
        this.caseSuggestions = res.data || [];
        this.isSearchingCases = false;
      },
      error: (err) => {
        console.error(err);
        this.isSearchingCases = false;
      }
    });
  }

  selectCase(caseObj: any) {
    this.newBooking.id_incidente_asociado = caseObj.case_number;
    this.newBooking.cargo_principal = caseObj.primary_type || caseObj.description;
    
    // Determine gravity
    const criticalTypes = ['HOMICIDE', 'ASSAULT', 'ROBBERY', 'KIDNAPPING', 'ARSON', 'BATTERY'];
    const highTypes = ['BURGLARY', 'MOTOR VEHICLE THEFT', 'WEAPONS VIOLATION', 'SEX OFFENSE'];
    const pt = (caseObj.primary_type || '').toUpperCase();
    if (criticalTypes.some(t => pt.includes(t))) {
      this.newBooking.gravedad_cargo = 'Delito Grave';
    } else if (highTypes.some(t => pt.includes(t))) {
      this.newBooking.gravedad_cargo = 'Delito Grave';
    } else {
      this.newBooking.gravedad_cargo = 'Delito Menor';
    }

    this.showCaseSuggestions = false;
    this.associatedSuspects = [];

    // Fetch incident details to get associated suspects
    this.incidentService.getIncidentDetail(caseObj.case_number).subscribe({
      next: (res) => {
        if (res && res.suspects) {
          this.associatedSuspects = res.suspects;
          // Auto-select if there's exactly 1 suspect!
          if (this.associatedSuspects.length === 1) {
            this.selectSuspect(this.associatedSuspects[0]);
          }
        }
      },
      error: (err) => console.error('Error fetching incident suspects:', err)
    });
  }

  // Autocomplete Suspect Methods (Global)
  searchSuspects(term: any) {
    const termStr = term ? term.toString() : '';
    if (!termStr || termStr.trim().length < 2) {
      this.suspectSuggestions = [];
      this.showSuspectSuggestions = false;
      return;
    }
    this.isSearchingSuspects = true;
    this.showSuspectSuggestions = true;
    this.http.get<any[]>(`http://localhost:8000/api/criminal/suspects/?search=${encodeURIComponent(termStr)}`).subscribe({
      next: (res) => {
        this.suspectSuggestions = res || [];
        this.isSearchingSuspects = false;
      },
      error: (err) => {
        console.error(err);
        this.isSearchingSuspects = false;
      }
    });
  }

  selectSuspect(suspect: any) {
    this.newBooking.id_sospechoso = suspect.id_sospechoso;
    this.newBooking.nombre_detenido = suspect.nombres;
    this.newBooking.alias = suspect.alias_conocido || '';
    this.newBooking.genero = suspect.genero === 'M' || suspect.genero === 'Masculino' ? 'M' : 
                            (suspect.genero === 'F' || suspect.genero === 'Femenino' ? 'F' : 'Otro');
    
    if (suspect.fecha_nacimiento && suspect.fecha_nacimiento !== 'None' && suspect.fecha_nacimiento !== 'null') {
      const parts = suspect.fecha_nacimiento.split(' ');
      this.newBooking.fecha_nacimiento = parts[0];
    } else {
      this.newBooking.fecha_nacimiento = '';
    }
    
    this.showSuspectSuggestions = false;

    // Fetch cases associated with this suspect
    this.suspectCases = [];
    this.http.get<any[]>(`http://localhost:8000/api/criminal/suspects/${suspect.id_sospechoso}/cases/`).subscribe({
      next: (cases) => {
        this.suspectCases = cases || [];
        if (this.suspectCases.length === 1) {
          this.selectSuspectCase(this.suspectCases[0]);
        }
      },
      error: (err) => console.error('Error fetching cases for suspect:', err)
    });
  }

  selectSuspectCase(caseObj: any) {
    this.newBooking.id_incidente_asociado = caseObj.case_number;
    this.suspectCases = [];
    
    // Also auto-detect case gravity cargo severity
    const pt = (caseObj.primary_type || '').toUpperCase();
    const criticalTypes = ['HOMICIDE', 'CRIM SEXUAL ASSAULT', 'ROBBERY', 'KIDNAPPING'];
    const highTypes = ['BURGLARY', 'ASSAULT', 'BATTERY', 'WEAPONS VIOLATION'];
    if (criticalTypes.some(t => pt.includes(t))) {
      this.newBooking.gravedad_cargo = 'Delito Grave';
    } else if (highTypes.some(t => pt.includes(t))) {
      this.newBooking.gravedad_cargo = 'Delito Grave';
    } else {
      this.newBooking.gravedad_cargo = 'Delito Menor';
    }
  }

  // Autocomplete Active Bookings for Visits/Calls
  searchActiveBookings(term: any) {
    const termStr = term ? term.toString() : '';
    if (!termStr || termStr.trim().length < 2) {
      this.bookingSuggestions = [];
      this.showBookingSuggestions = false;
      return;
    }
    this.isSearchingBookings = true;
    this.showBookingSuggestions = true;
    this.http.get<any>(`http://localhost:8000/api/operativa/bookings/?custodia_estado=Activa&search_term=${encodeURIComponent(termStr)}`).subscribe({
      next: (res) => {
        this.bookingSuggestions = res.data || [];
        this.isSearchingBookings = false;
      },
      error: (err) => {
        console.error(err);
        this.isSearchingBookings = false;
      }
    });
  }

  selectBookingForVisit(booking: any) {
    this.newVisit.id_ingreso = booking.id_ingreso;
    this.newVisit.nombre_detenido = booking.nombre_detenido;
    this.showBookingSuggestions = false;
  }

  parseLogDescription(desc: string): any {
    if (!desc) {
      return { texto_plano: '' };
    }
    const trimmed = desc.trim();
    if (trimmed.startsWith('{')) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        // Fallback
      }
    }
    return { texto_plano: desc };
  }

  searchQuery: string = '';

  get filteredVisits(): any[] {
    if (!this.visitsList) return [];
    let list = this.visitsList;
    if (this.visitFilterType && this.visitFilterType !== 'ALL') {
      list = list.filter(v => v.tipo_accion === this.visitFilterType);
    }
    if (this.searchQuery?.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(v => 
        (v.nombre_detenido || '').toLowerCase().includes(q) ||
        (v.descripcion || '').toLowerCase().includes(q) ||
        (v.tipo_accion || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  // Belongings Locker Methods
  addBelonging() {
    if (!this.newBelonging.nombre.trim()) return;
    this.belongings.push({
      nombre: this.newBelonging.nombre.trim(),
      categoria: this.newBelonging.categoria,
      estado: this.newBelonging.estado
    });
    this.newBelonging.nombre = '';
    this.newBelonging.categoria = 'Other';
    this.newBelonging.estado = 'Good';
  }

  removeBelonging(index: number) {
    this.belongings.splice(index, 1);
  }

  formatBelongings(articulosStr: string): string {
    if (!articulosStr) return 'Ninguno';
    try {
      const parsed = JSON.parse(articulosStr);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) return 'Ninguno';
        const names = parsed.map(b => b.nombre || b.description);
        if (names.length <= 2) {
          return names.join(', ');
        }
        return `${names.slice(0, 2).join(', ')}... (+${names.length - 2})`;
      }
    } catch (e) {
      // Not JSON
    }
    return articulosStr;
  }

  submitBooking() {
    this.isLoading = true;
    
    // Serialize belongings list as JSON string
    this.newBooking.articulos_retenidos = JSON.stringify(this.belongings);

    const formatToUTCStr = (val: string) => {
      if (!val) return '';
      try {
        return new Date(val).toISOString();
      } catch (e) {
        return val;
      }
    };

    const payload = {
      ...this.newBooking,
      hora_ingreso: formatToUTCStr(this.newBooking.hora_ingreso),
      hora_salida: formatToUTCStr(this.newBooking.hora_salida)
    };

    if (this.editingId) {
      // Update
      this.http.put(`http://localhost:8000/api/operativa/bookings/${this.editingId}/`, payload).subscribe({
        next: () => {
          this.activeTab = 'list';
          this.editingId = null;
          this.loadBookings();
          this.loadCells();
          this.isLoading = false;
        },
        error: (err) => {
          alert('Error al actualizar el ingreso: ' + (err?.error?.error || err?.message));
          this.isLoading = false;
        }
      });
    } else {
      // Create new
      const createPayload = {
        ...payload,
        id_oficial: this.authService.getOfficerId()
      };
      this.http.post('http://localhost:8000/api/operativa/bookings/', createPayload).subscribe({
        next: () => {
          this.activeTab = 'list';
          this.loadBookings();
          this.loadCells();
          this.isLoading = false;
        },
        error: (err) => {
          alert('Error al registrar el ingreso: ' + (err?.error?.error || err?.message));
          this.isLoading = false;
        }
      });
    }
  }



  openReleaseModal(b: any) {
    this.releasingId = b.id_ingreso;
    this.releaseMotivo = '';
    this.showReleaseModal = true;
  }

  closeReleaseModal() {
    this.showReleaseModal = false;
    this.releasingId = null;
    this.releaseMotivo = '';
  }

  confirmRelease() {
    if (!this.releasingId) return;
    this.isLoading = true;
    
    const payload = {
      motivo_salida: this.releaseMotivo,
      custodia_estado: 'Liberado'
    };

    this.http.post(`http://localhost:8000/api/operativa/bookings/${this.releasingId}/release/`, payload).subscribe({
      next: () => {
        this.closeReleaseModal();

        this.loadBookings();
        this.loadCells();
        this.isLoading = false;
      },
      error: (err) => {
        alert('Error al liberar al detenido: ' + (err?.error?.error || err?.message));
        this.isLoading = false;
      }
    });
  }

  translateCondition(cond: string): string {
    const mapping: any = {
      'Excelente': 'Excellent',
      'Bueno': 'Good',
      'Desgastado': 'Worn',
      'Damaged': 'Damaged'
    };
    return mapping[cond] || cond;
  }

  translateCategory(cat: string): string {
    const mapping: any = {
      'Documentos/Dinero': 'Cash/Documents',
      'Electronics': 'Electronics',
      'Joya/Accesorio': 'Jewelry/Accessory',
      'Prenda de Vestir': 'Clothing',
      'Llaves': 'Keys',
      'Otro': 'Other'
    };
    return mapping[cat] || cat;
  }
}
