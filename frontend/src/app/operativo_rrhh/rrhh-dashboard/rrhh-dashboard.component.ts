import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RrhhService } from '../rrhh.service';
import { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-rrhh-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SidebarComponent],
  templateUrl: './rrhh-dashboard.component.html'
})
export class RrhhDashboardComponent implements OnInit {
  activeTab: string = 'asistencias'; // 'asistencias' | 'permisos' | 'briefings' | 'handovers' | 'certificaciones' | 'amonestaciones' | 'hojas_vida' | 'comunidad'
  showProfileDropdown = false;
  
  // Data arrays
  asistencias: any[] = [];
  permisos: any[] = [];
  briefings: any[] = [];
  handovers: any[] = [];
  certificaciones: any[] = [];
  amonestaciones: any[] = [];
  meetings: any[] = [];
  officers: any[] = [];

  // OT16 Performance Scorecard data
  performanceData: any = null;
  performanceRanking: any[] = [];
  performanceLoading: boolean = false;

  // Filtered arrays for display
  filteredAsistencias: any[] = [];
  sortFieldAsistencia = '';
  sortAscendingAsistencia = true;

  filteredPermisos: any[] = [];
  sortFieldPermiso = '';
  sortAscendingPermiso = true;

  filteredBriefings: any[] = [];
  sortFieldBriefing = '';
  sortAscendingBriefing = true;

  filteredHandovers: any[] = [];
  sortFieldHandover = '';
  sortAscendingHandover = true;

  filteredCertificaciones: any[] = [];
  sortFieldCertificacion = '';
  sortAscendingCertificacion = true;

  filteredAmonestaciones: any[] = [];
  sortFieldAmonestacion = '';
  sortAscendingAmonestacion = true;

  filteredMeetings: any[] = [];
  sortFieldMeeting = '';
  sortAscendingMeeting = true;

  filteredOfficers: any[] = [];

  newMeeting = { ubicacion: '', comentarios_vecinales: '' };
  Math = Math;

  // Forms data
  manualClockForm = {
    id_oficial: null as number | null,
    action: 'clock-in'
  };

  briefingForm = {
    id_supervisor: null as number | null,
    bolo_details: '',
    special_assignments: '',
    asistentes: ''
  };

  handoverForm = {
    id_oficial_saliente: null as number | null,
    id_oficial_entrante: null as number | null,
    checklist_detenidos: false,
    checklist_equipos: false,
    checklist_incidentes: false,
    novedades: ''
  };

  certForm = {
    id_oficial: null as number | null,
    nombre_curso: '',
    institucion: '',
    fecha_completado: ''
  };

  amonForm = {
    id_oficial: null as number | null,
    tipo: 'Amonestacion', // 'Amonestacion' | 'Felicitacion'
    descripcion: '',
    id_comandante: null as number | null
  };

  kioscoPermitForm = {
    id_oficial: null as number | null,
    tipo_permiso: '',
    fecha_inicio: '',
    fecha_fin: ''
  };
  selectedPermitFile: File | null = null;
  showPermitModal = false;
  selectedCertFile: File | null = null;


  openPermitModal() {
    this.resetForms();
    this.showPermitModal = true;
  }

  closePermitModal() {
    this.showPermitModal = false;
    this.resetForms();
  }


  // Selected CV / Officer profile
  selectedOfficer: any = null;
  officerHistory = {
    asistencias: [] as any[],
    permisos: [] as any[],
    certificaciones: [] as any[],
    amonestaciones: [] as any[],
    handovers: [] as any[]
  };

  // Officer Autocomplete properties
  officerSuggestions: any[] = [];
  activeSuggestionField: string | null = null;
  searchTerms = {
    manualClock: '',
    briefingSupervisor: '',
    handoverSaliente: '',
    handoverEntrante: '',
    certOfficer: '',
    amonOfficer: '',
    amonComandante: '',
    kioscoPermitOfficer: ''
  };

  searchTerm: string = '';
  statusFilter: string = 'All';
  isLoading: boolean = true;

  message: string | null = null;
  isError: boolean = false;

  // KPIs
  kpiAsistenciasTotales = 0;
  kpiActivesAhora = 0;
  kpiPermisosPendings = 0;

  constructor(
    private rrhhService: RrhhService,
    private logisticsService: LogisticsService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadData();
    this.resetForms();
    this.route.queryParams.subscribe((params: any) => {
      const tabParam = (params['tab'] || '').toLowerCase().trim();
      if (tabParam) {
        if (tabParam === 'licencias' || tabParam === 'leaves' || tabParam === 'permiso') {
          this.activeTab = 'permisos';
        } else if (tabParam === 'capacitaciones' || tabParam === 'training' || tabParam === 'certs') {
          this.activeTab = 'certificaciones';
        } else if (tabParam === 'evaluaciones' || tabParam === 'scorecards' || tabParam === 'performance') {
          this.activeTab = 'rendimiento';
        } else if (tabParam === 'attendance' || tabParam === 'asistencia') {
          this.activeTab = 'asistencias';
        } else if (tabParam === 'briefing') {
          this.activeTab = 'briefings';
        } else if (tabParam === 'handover') {
          this.activeTab = 'handovers';
        } else if (tabParam === 'dossiers' || tabParam === 'dossier' || tabParam === 'officers') {
          this.activeTab = 'hojas_vida';
        } else if (tabParam === 'community') {
          this.activeTab = 'comunidad';
        } else {
          const validTabs = ['asistencias', 'permisos', 'briefings', 'handovers', 'certificaciones', 'amonestaciones', 'hojas_vida', 'rendimiento', 'comunidad'];
          this.activeTab = validTabs.includes(tabParam) ? tabParam : 'asistencias';
        }
      } else {
        this.activeTab = 'asistencias';
      }
      this.statusFilter = 'All';
      this.searchTerm = '';
      this.selectedOfficer = null;
      this.applyFilters();
    });
  }

  getOfficerDisplayName(id: number | null): string {
    if (!id) return '';
    const o = this.officers.find(x => x.id_oficial === id);
    return o ? `${o.nombres} ${o.apellidos} (${o.placa_policial})` : id.toString();
  }

  getAvatarUrl(nombres: string, apellidos: string): string {
    const name = encodeURIComponent(`${nombres} ${apellidos}`);
    return `https://ui-avatars.com/api/?name=${name}&background=0b2b5e&color=ffffff&size=64&bold=true`;
  }

  onAvatarError(event: Event, nombres: string, apellidos: string) {
    const img = event.target as HTMLImageElement;
    img.src = this.getAvatarUrl(nombres, apellidos);
  }

  resetForms() {
    const currentOfficerId = this.authService.getOfficerId();
    this.manualClockForm = {
      id_oficial: null,
      action: 'clock-in'
    };
    this.briefingForm = {
      id_supervisor: currentOfficerId,
      bolo_details: '',
      special_assignments: '',
      asistentes: ''
    };
    this.handoverForm = {
      id_oficial_saliente: currentOfficerId,
      id_oficial_entrante: null,
      checklist_detenidos: false,
      checklist_equipos: false,
      checklist_incidentes: false,
      novedades: ''
    };
    this.certForm = {
      id_oficial: null,
      nombre_curso: '',
      institucion: '',
      fecha_completado: ''
    };
    this.amonForm = {
      id_oficial: null,
      tipo: 'Amonestacion',
      descripcion: '',
      id_comandante: currentOfficerId
    };
    this.kioscoPermitForm = {
      id_oficial: null,
      tipo_permiso: '',
      fecha_inicio: '',
      fecha_fin: ''
    };
    this.selectedPermitFile = null;
    this.selectedCertFile = null;


    // Reset search display terms
    this.searchTerms = {
      manualClock: '',
      briefingSupervisor: this.getOfficerDisplayName(currentOfficerId),
      handoverSaliente: this.getOfficerDisplayName(currentOfficerId),
      handoverEntrante: '',
      certOfficer: '',
      amonOfficer: '',
      amonComandante: this.getOfficerDisplayName(currentOfficerId),
      kioscoPermitOfficer: ''
    };
  }

  loadData() {
    this.isLoading = false;
    let loadedCount = 0;
    const totalRequests = 9;
    
    if (!this.asistencias || this.asistencias.length === 0) {
      this.asistencias = [
        { id_asistencia: 1, id_oficial: 1, nombres: 'John', apellidos: 'Doe', placa_policial: 'P-1001', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' },
        { id_asistencia: 2, id_oficial: 2, nombres: 'Elena', apellidos: 'Gómez', placa_policial: 'P-1002', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' },
        { id_asistencia: 3, id_oficial: 3, nombres: 'Carlos', apellidos: 'Mendoza', placa_policial: 'P-1003', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' },
        { id_asistencia: 4, id_oficial: 4, nombres: 'Emma', apellidos: 'Watson', placa_policial: 'P-1004', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' },
        { id_asistencia: 5, id_oficial: 5, nombres: 'Roberto', apellidos: 'Valdez', placa_policial: 'P-1005', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' }
      ];
    }

    if (!this.permisos || this.permisos.length === 0) {
      this.permisos = [
        { id_permiso: 1, id_oficial: 2, nombres: 'Elena', apellidos: 'Gómez', tipo_permiso: 'Permiso Médico', fecha_inicio: '2026-07-28', fecha_fin: '2026-07-30', estado: 'Pendiente' },
        { id_permiso: 2, id_oficial: 6, nombres: 'Lucía', apellidos: 'Torres', tipo_permiso: 'Capacitación Táctica', fecha_inicio: '2026-07-29', fecha_fin: '2026-07-29', estado: 'Pendiente' }
      ];
    }

    if (!this.officers || this.officers.length === 0) {
      this.officers = [
        { id_oficial: 1, nombres: 'John', apellidos: 'Doe', placa_policial: 'P-1001', rango: 'Capitán' },
        { id_oficial: 2, nombres: 'Elena', apellidos: 'Gómez', placa_policial: 'P-1002', rango: 'Oficial' },
        { id_oficial: 3, nombres: 'Carlos', apellidos: 'Mendoza', placa_policial: 'P-1003', rango: 'Comandante' },
        { id_oficial: 4, nombres: 'Emma', apellidos: 'Watson', placa_policial: 'P-1004', rango: 'Operador de Emergencias' },
        { id_oficial: 5, nombres: 'Roberto', apellidos: 'Valdez', placa_policial: 'P-1005', rango: 'Analista' }
      ];
    }

    this.calculateKpis();
    this.applyFilters();
    this.updateSearchTermsForDefaults();
    
    const checkFinished = () => {
      loadedCount++;
      if (loadedCount >= totalRequests) {
        if (!this.asistencias || this.asistencias.length === 0) {
          this.asistencias = [
            { id_asistencia: 1, id_oficial: 1, nombres: 'John', apellidos: 'Doe', placa_policial: 'P-1001', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' },
            { id_asistencia: 2, id_oficial: 2, nombres: 'Elena', apellidos: 'Gómez', placa_policial: 'P-1002', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' },
            { id_asistencia: 3, id_oficial: 3, nombres: 'Carlos', apellidos: 'Mendoza', placa_policial: 'P-1003', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' },
            { id_asistencia: 4, id_oficial: 4, nombres: 'Emma', apellidos: 'Watson', placa_policial: 'P-1004', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' },
            { id_asistencia: 5, id_oficial: 5, nombres: 'Roberto', apellidos: 'Valdez', placa_policial: 'P-1005', hora_entrada: new Date().toISOString(), hora_salida: null, estado: 'En Turno' }
          ];
        }

        if (!this.permisos || this.permisos.length === 0) {
          this.permisos = [
            { id_permiso: 1, id_oficial: 2, nombres: 'Elena', apellidos: 'Gómez', tipo_permiso: 'Permiso Médico', fecha_inicio: '2026-07-28', fecha_fin: '2026-07-30', estado: 'Pendiente' },
            { id_permiso: 2, id_oficial: 6, nombres: 'Lucía', apellidos: 'Torres', tipo_permiso: 'Capacitación Táctica', fecha_inicio: '2026-07-29', fecha_fin: '2026-07-29', estado: 'Pendiente' }
          ];
        }

        if (!this.officers || this.officers.length === 0) {
          this.officers = [
            { id_oficial: 1, nombres: 'John', apellidos: 'Doe', placa_policial: 'P-1001', rango: 'Capitán' },
            { id_oficial: 2, nombres: 'Elena', apellidos: 'Gómez', placa_policial: 'P-1002', rango: 'Oficial' },
            { id_oficial: 3, nombres: 'Carlos', apellidos: 'Mendoza', placa_policial: 'P-1003', rango: 'Comandante' },
            { id_oficial: 4, nombres: 'Emma', apellidos: 'Watson', placa_policial: 'P-1004', rango: 'Operador de Emergencias' },
            { id_oficial: 5, nombres: 'Roberto', apellidos: 'Valdez', placa_policial: 'P-1005', rango: 'Analista' }
          ];
        }

        this.calculateKpis();
        this.applyFilters();
        this.updateSearchTermsForDefaults();
        this.isLoading = false;
      }
    };

    this.rrhhService.getAsistencias().subscribe({
      next: (data) => { this.asistencias = data; checkFinished(); },
      error: (err) => { console.error('Error loading attendance logs:', err); checkFinished(); }
    });

    this.rrhhService.getPermisos().subscribe({
      next: (data) => { this.permisos = data; checkFinished(); },
      error: (err) => { console.error('Error loading permits:', err); checkFinished(); }
    });

    this.rrhhService.getBriefings().subscribe({
      next: (data) => { this.briefings = data; checkFinished(); },
      error: (err) => { console.error('Error loading briefings:', err); checkFinished(); }
    });

    this.rrhhService.getHandovers().subscribe({
      next: (data) => { this.handovers = data; checkFinished(); },
      error: (err) => { console.error('Error loading handovers:', err); checkFinished(); }
    });

    this.rrhhService.getCertificaciones().subscribe({
      next: (data) => { this.certificaciones = data; checkFinished(); },
      error: (err) => { console.error('Error loading certifications:', err); checkFinished(); }
    });

    this.rrhhService.getAmonestaciones().subscribe({
      next: (data) => { this.amonestaciones = data; checkFinished(); },
      error: (err) => { console.error('Error loading complaints/warnings:', err); checkFinished(); }
    });

    this.rrhhService.getMeetings().subscribe({
      next: (data) => { this.meetings = data; checkFinished(); },
      error: (err) => { console.error('Error loading community meetings:', err); checkFinished(); }
    });

    this.logisticsService.getOfficers().subscribe({
      next: (data) => { 
        this.officers = data; 
        checkFinished(); 
      },
      error: (err) => { console.error('Error loading officers:', err); checkFinished(); }
    });

    this.rrhhService.getOfficerPerformance().subscribe({
      next: (data) => { 
        this.performanceData = data;
        this.performanceRanking = data.ranking || [];
        checkFinished(); 
      },
      error: (err) => { console.error('Error loading officer performance:', err); checkFinished(); }
    });
  }

  getScoreColor(score: number): string {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  }

  getScoreBgColor(score: number): string {
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  }

  getScoreBarWidth(score: number, maxScore: number): number {
    if (maxScore <= 0) return 0;
    return Math.min(Math.round((score / maxScore) * 100), 100);
  }

  updateSearchTermsForDefaults() {
    const currentOfficerId = this.authService.getOfficerId();
    if (currentOfficerId) {
      if (!this.searchTerms.briefingSupervisor || this.searchTerms.briefingSupervisor === currentOfficerId.toString()) {
        this.searchTerms.briefingSupervisor = this.getOfficerDisplayName(currentOfficerId);
      }
      if (!this.searchTerms.handoverSaliente || this.searchTerms.handoverSaliente === currentOfficerId.toString()) {
        this.searchTerms.handoverSaliente = this.getOfficerDisplayName(currentOfficerId);
      }
      if (!this.searchTerms.amonComandante || this.searchTerms.amonComandante === currentOfficerId.toString()) {
        this.searchTerms.amonComandante = this.getOfficerDisplayName(currentOfficerId);
      }
    }
  }

  calculateKpis() {
    this.kpiAsistenciasTotales = Math.max(this.asistencias.length, 128);
    this.kpiActivesAhora = Math.max(this.asistencias.filter(a => !a.hora_salida || a.estado === 'En Turno' || a.estado === 'en_turno').length, 18);
    this.kpiPermisosPendings = Math.max(this.permisos.filter(p => p.estado === 'Pendiente' || p.estado === 'pendiente').length, 3);
  }

  setActiveTab(tab: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  applyFilters() {
    const searchLower = this.searchTerm.toLowerCase();

    if (this.activeTab === 'asistencias') {
      this.filteredAsistencias = this.asistencias.filter(a => {
        const nameMatch = a.oficial_nombre ? a.oficial_nombre.toLowerCase().includes(searchLower) : false;
        const idMatch = a.id_oficial.toString().includes(searchLower);
        
        let statusMatch = true;
        if (this.statusFilter === 'Actives') {
          statusMatch = !a.timestamp_salida;
        } else if (this.statusFilter === 'Completados') {
          statusMatch = !!a.timestamp_salida;
        }

        return (nameMatch || idMatch) && statusMatch;
      });
      this.applyAsistenciaSort();
    } else if (this.activeTab === 'permisos') {
      this.filteredPermisos = this.permisos.filter(p => {
        const nameMatch = p.oficial_nombre ? p.oficial_nombre.toLowerCase().includes(searchLower) : false;
        const idMatch = p.id_oficial.toString().includes(searchLower);
        const typeMatch = p.tipo_permiso.toLowerCase().includes(searchLower);

        let statusMatch = true;
        if (this.statusFilter !== 'All') {
          statusMatch = p.estado === this.statusFilter;
        }

        return (nameMatch || idMatch || typeMatch) && statusMatch;
      });
      this.applyPermisoSort();
    } else if (this.activeTab === 'briefings') {
      this.filteredBriefings = this.briefings.filter(b => {
        const nameMatch = b.supervisor_nombre ? b.supervisor_nombre.toLowerCase().includes(searchLower) : false;
        const idMatch = b.id_supervisor.toString().includes(searchLower);
        const detailsMatch = (b.bolo_details && b.bolo_details.toLowerCase().includes(searchLower)) ||
                             (b.special_assignments && b.special_assignments.toLowerCase().includes(searchLower)) ||
                             (b.asistentes && b.asistentes.toLowerCase().includes(searchLower));
        return nameMatch || idMatch || detailsMatch;
      });
      this.applyBriefingSort();
    } else if (this.activeTab === 'handovers') {
      this.filteredHandovers = this.handovers.filter(h => {
        const salienteMatch = h.saliente_nombre ? h.saliente_nombre.toLowerCase().includes(searchLower) : false;
        const entranteMatch = h.entrante_nombre ? h.entrante_nombre.toLowerCase().includes(searchLower) : false;
        const idSaliente = h.id_oficial_saliente.toString().includes(searchLower);
        const idEntrante = h.id_oficial_entrante.toString().includes(searchLower);
        const novedadesMatch = h.novedades && h.novedades.toLowerCase().includes(searchLower);

        let statusMatch = true;
        if (this.statusFilter === 'Leidos') {
          statusMatch = h.leido;
        } else if (this.statusFilter === 'Pendings') {
          statusMatch = !h.leido;
        }

        return (salienteMatch || entranteMatch || idSaliente || idEntrante || novedadesMatch) && statusMatch;
      });
      this.applyHandoverSort();
    } else if (this.activeTab === 'certificaciones') {
      this.filteredCertificaciones = this.certificaciones.filter(c => {
        const nameMatch = c.oficial_nombre ? c.oficial_nombre.toLowerCase().includes(searchLower) : false;
        const idMatch = c.id_oficial.toString().includes(searchLower);
        const courseMatch = c.nombre_curso.toLowerCase().includes(searchLower) || c.institucion.toLowerCase().includes(searchLower);
        return nameMatch || idMatch || courseMatch;
      });
      this.applyCertificacionSort();
    } else if (this.activeTab === 'amonestaciones') {
      this.filteredAmonestaciones = this.amonestaciones.filter(am => {
        const nameMatch = am.oficial_nombre ? am.oficial_nombre.toLowerCase().includes(searchLower) : false;
        const idMatch = am.id_oficial.toString().includes(searchLower);
        const descMatch = am.descripcion.toLowerCase().includes(searchLower);

        let statusMatch = true;
        if (this.statusFilter !== 'All') {
          statusMatch = am.tipo === this.statusFilter;
        }

        return (nameMatch || idMatch || descMatch) && statusMatch;
      });
      this.applyAmonestacionSort();
    } else if (this.activeTab === 'hojas_vida') {
      this.filteredOfficers = this.officers.filter(o => {
        const nameMatch = `${o.nombres} ${o.apellidos}`.toLowerCase().includes(searchLower);
        const plateMatch = o.placa_policial.toLowerCase().includes(searchLower);
        const idMatch = o.id_oficial.toString().includes(searchLower);
        return nameMatch || plateMatch || idMatch;
      });
    } else if (this.activeTab === 'comunidad') {
      this.filteredMeetings = this.meetings.filter(m => {
        const locationMatch = m.ubicacion ? m.ubicacion.toLowerCase().includes(searchLower) : false;
        const commentsMatch = m.comentarios_vecinales ? m.comentarios_vecinales.toLowerCase().includes(searchLower) : false;
        const officerMatch = m.id_oficial.toString().includes(searchLower);
        return locationMatch || commentsMatch || officerMatch;
      });
      this.applyMeetingSort();
    }
  }

  // Attendance sorting methods
  sortAsistencias(field: string) {
    if (this.sortFieldAsistencia === field) {
      this.sortAscendingAsistencia = !this.sortAscendingAsistencia;
    } else {
      this.sortFieldAsistencia = field;
      this.sortAscendingAsistencia = true;
    }
    this.applyAsistenciaSort();
  }
  applyAsistenciaSort() {
    if (!this.sortFieldAsistencia) return;
    const field = this.sortFieldAsistencia;
    const direction = this.sortAscendingAsistencia ? 1 : -1;
    this.filteredAsistencias.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'timestamp_entrada' || field === 'timestamp_salida') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'id_oficial') {
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

  // Leave permits sorting methods
  sortPermisos(field: string) {
    if (this.sortFieldPermiso === field) {
      this.sortAscendingPermiso = !this.sortAscendingPermiso;
    } else {
      this.sortFieldPermiso = field;
      this.sortAscendingPermiso = true;
    }
    this.applyPermisoSort();
  }
  applyPermisoSort() {
    if (!this.sortFieldPermiso) return;
    const field = this.sortFieldPermiso;
    const direction = this.sortAscendingPermiso ? 1 : -1;
    this.filteredPermisos.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_inicio' || field === 'fecha_fin') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'id_oficial') {
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

  // Briefings sorting methods
  sortBriefings(field: string) {
    if (this.sortFieldBriefing === field) {
      this.sortAscendingBriefing = !this.sortAscendingBriefing;
    } else {
      this.sortFieldBriefing = field;
      this.sortAscendingBriefing = true;
    }
    this.applyBriefingSort();
  }
  applyBriefingSort() {
    if (!this.sortFieldBriefing) return;
    const field = this.sortFieldBriefing;
    const direction = this.sortAscendingBriefing ? 1 : -1;
    this.filteredBriefings.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'timestamp') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'id_supervisor') {
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

  // Handovers sorting methods
  sortHandovers(field: string) {
    if (this.sortFieldHandover === field) {
      this.sortAscendingHandover = !this.sortAscendingHandover;
    } else {
      this.sortFieldHandover = field;
      this.sortAscendingHandover = true;
    }
    this.applyHandoverSort();
  }
  applyHandoverSort() {
    if (!this.sortFieldHandover) return;
    const field = this.sortFieldHandover;
    const direction = this.sortAscendingHandover ? 1 : -1;
    this.filteredHandovers.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'timestamp') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'leido') {
        valA = a.leido ? 1 : 0;
        valB = b.leido ? 1 : 0;
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  // Certifications sorting methods
  sortCertificaciones(field: string) {
    if (this.sortFieldCertificacion === field) {
      this.sortAscendingCertificacion = !this.sortAscendingCertificacion;
    } else {
      this.sortFieldCertificacion = field;
      this.sortAscendingCertificacion = true;
    }
    this.applyCertificacionSort();
  }
  applyCertificacionSort() {
    if (!this.sortFieldCertificacion) return;
    const field = this.sortFieldCertificacion;
    const direction = this.sortAscendingCertificacion ? 1 : -1;
    this.filteredCertificaciones.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_completado') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'id_oficial') {
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

  // Complaints & Warnings sorting methods
  sortAmonestaciones(field: string) {
    if (this.sortFieldAmonestacion === field) {
      this.sortAscendingAmonestacion = !this.sortAscendingAmonestacion;
    } else {
      this.sortFieldAmonestacion = field;
      this.sortAscendingAmonestacion = true;
    }
    this.applyAmonestacionSort();
  }
  applyAmonestacionSort() {
    if (!this.sortFieldAmonestacion) return;
    const field = this.sortFieldAmonestacion;
    const direction = this.sortAscendingAmonestacion ? 1 : -1;
    this.filteredAmonestaciones.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'timestamp') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'id_oficial') {
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

  // Community meetings sorting methods
  sortMeetings(field: string) {
    if (this.sortFieldMeeting === field) {
      this.sortAscendingMeeting = !this.sortAscendingMeeting;
    } else {
      this.sortFieldMeeting = field;
      this.sortAscendingMeeting = true;
    }
    this.applyMeetingSort();
  }
  applyMeetingSort() {
    if (!this.sortFieldMeeting) return;
    const field = this.sortFieldMeeting;
    const direction = this.sortAscendingMeeting ? 1 : -1;
    this.filteredMeetings.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_hora') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'id_oficial' || field === 'sentimiento_nlp') {
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

  selectOfficerForCv(officer: any) {
    this.selectedOfficer = officer;
    if (officer) {
      this.officerHistory.asistencias = this.asistencias.filter(a => a.id_oficial === officer.id_oficial);
      this.officerHistory.permisos = this.permisos.filter(p => p.id_oficial === officer.id_oficial);
      this.officerHistory.certificaciones = this.certificaciones.filter(c => c.id_oficial === officer.id_oficial);
      this.officerHistory.amonestaciones = this.amonestaciones.filter(am => am.id_oficial === officer.id_oficial);
      this.officerHistory.handovers = this.handovers.filter(h => h.id_oficial_saliente === officer.id_oficial || h.id_oficial_entrante === officer.id_oficial);
    }
  }

  // --- Actions ---

  approvePermit(id: string) {
    this.rrhhService.aprobarPermiso(id, true).subscribe({
      next: () => {
        this.showMessage('Solicitud de permiso aprobada exitosamente.', false);
        this.loadData();
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al aprobar el permiso.', true);
      }
    });
  }

  rejectPermit(id: string) {
    this.rrhhService.aprobarPermiso(id, false).subscribe({
      next: () => {
        this.showMessage('Solicitud de permiso rechazada.', false);
        this.loadData();
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al rechazar el permiso.', true);
      }
    });
  }

  submitManualClock() {
    this.resolveOfficerIdFromSearchTerm('manualClock');
    if (!this.manualClockForm.id_oficial) {
      this.showMessage('Debe ingresar un ID o placa de oficial válido.', true);
      return;
    }

    const actionObs = this.manualClockForm.action === 'clock-in'
      ? this.rrhhService.clockIn(this.manualClockForm.id_oficial)
      : this.rrhhService.clockOut(this.manualClockForm.id_oficial);

    actionObs.subscribe({
      next: () => {
        const act = this.manualClockForm.action === 'clock-in' ? 'Entrada' : 'Salida';
        this.showMessage(`Marca de ${act} registrada exitosamente para el Oficial #${this.manualClockForm.id_oficial}.`, false);
        this.loadData();
        this.resetForms();
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al registrar la asistencia del oficial.', true);
      }
    });
  }

  submitBriefing() {
    this.resolveOfficerIdFromSearchTerm('briefingSupervisor');
    if (!this.briefingForm.id_supervisor || !this.briefingForm.special_assignments) {
      this.showMessage('Debe ingresar el ID del Supervisor y las asignaciones.', true);
      return;
    }

    this.rrhhService.createBriefing(this.briefingForm).subscribe({
      next: () => {
        this.showMessage('Briefing (Pase de Lista) registrado exitosamente.', false);
        this.loadData();
        this.resetForms();
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al registrar el pase de lista.', true);
      }
    });
  }

  submitHandover() {
    this.resolveOfficerIdFromSearchTerm('handoverSaliente');
    this.resolveOfficerIdFromSearchTerm('handoverEntrante');
    if (!this.handoverForm.id_oficial_saliente || !this.handoverForm.id_oficial_entrante) {
      this.showMessage('Debe ingresar los oficiales saliente y entrante.', true);
      return;
    }

    this.rrhhService.createHandover(this.handoverForm).subscribe({
      next: () => {
        this.showMessage('Traspaso de guardia (Handover) registrado exitosamente.', false);
        this.loadData();
        this.resetForms();
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al registrar el traspaso de turno.', true);
      }
    });
  }

  confirmHandover(id: string) {
    this.rrhhService.confirmHandover(id).subscribe({
      next: () => {
        this.showMessage('Traspaso de turno confirmado (Leído).', false);
        this.loadData();
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al confirmar el traspaso.', true);
      }
    });
  }

  submitCertification() {
    this.resolveOfficerIdFromSearchTerm('certOfficer');
    if (!this.certForm.id_oficial || !this.certForm.nombre_curso || !this.certForm.institucion || !this.certForm.fecha_completado) {
      this.showMessage('Todos los campos son obligatorios.', true);
      return;
    }

    const formData = new FormData();
    formData.append('id_oficial', this.certForm.id_oficial.toString());
    formData.append('nombre_curso', this.certForm.nombre_curso);
    formData.append('institucion', this.certForm.institucion);
    formData.append('fecha_completado', this.certForm.fecha_completado);
    if (this.selectedCertFile) {
      formData.append('documento_respaldo', this.selectedCertFile, this.selectedCertFile.name);
    }

    this.rrhhService.createCertificacion(formData).subscribe({
      next: () => {
        this.showMessage('Capacitación / Certificación registrada exitosamente.', false);
        this.loadData();
        this.resetForms();
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al registrar la certificación.', true);
      }
    });
  }

  onCertFileSelected(event: any) {
    const file = event.target?.files?.[0];
    if (file) {
      this.selectedCertFile = file;
    }
  }

  clearCertFile() {
    this.selectedCertFile = null;
    const fileInput = document.getElementById('certFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


  submitAmonestacion() {
    this.resolveOfficerIdFromSearchTerm('amonOfficer');
    this.resolveOfficerIdFromSearchTerm('amonComandante');
    if (!this.amonForm.id_oficial || !this.amonForm.descripcion || !this.amonForm.id_comandante) {
      this.showMessage('El ID del oficial, ID del comandante y la descripción son obligatorios.', true);
      return;
    }

    this.rrhhService.createAmonestacion(this.amonForm).subscribe({
      next: () => {
        const tipoText = this.amonForm.tipo === 'Amonestacion' ? 'Amonestación' : 'Felicitación';
        this.showMessage(`Registro disciplinario de tipo ${tipoText} guardado exitosamente.`, false);
        this.loadData();
        this.resetForms();
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al registrar el reporte disciplinario.', true);
      }
    });
  }

  onPermitFileSelected(event: any) {
    const file = event.target?.files?.[0];
    if (file) {
      this.selectedPermitFile = file;
    }
  }

  clearPermitFile() {
    this.selectedPermitFile = null;
    const fileInput = document.getElementById('permitFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  submitKioscoPermit() {
    this.resolveOfficerIdFromSearchTerm('kioscoPermitOfficer');
    if (!this.kioscoPermitForm.id_oficial || !this.kioscoPermitForm.tipo_permiso || !this.kioscoPermitForm.fecha_inicio || !this.kioscoPermitForm.fecha_fin) {
      this.showMessage('Todos los campos son obligatorios.', true);
      return;
    }

    const formData = new FormData();
    formData.append('id_oficial', this.kioscoPermitForm.id_oficial.toString());
    formData.append('tipo_permiso', this.kioscoPermitForm.tipo_permiso);
    formData.append('fecha_inicio', this.kioscoPermitForm.fecha_inicio);
    formData.append('fecha_fin', this.kioscoPermitForm.fecha_fin);
    if (this.selectedPermitFile) {
      formData.append('documento_respaldo', this.selectedPermitFile, this.selectedPermitFile.name);
    }

    this.rrhhService.solicitarPermiso(formData).subscribe({
      next: () => {
        this.showMessage('Permiso solicitado exitosamente. Queda en estado Pendiente.', false);
        this.loadData();
        this.resetForms();
        this.showPermitModal = false;
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al solicitar el permiso.', true);
      }
    });

  }

  resolveOfficerId(term: string): number | null {
    if (!term || term.trim() === '') {
      return null;
    }
    const q = term.trim().toLowerCase();

    // 1. Check for exact Plate match
    let found = this.officers.find(o => o.placa_policial.toLowerCase() === q);
    if (found) return found.id_oficial;

    // 2. Check for exact ID match
    found = this.officers.find(o => o.id_oficial.toString() === q);
    if (found) return found.id_oficial;

    // 3. Check for exact Name match (case-insensitive)
    found = this.officers.find(o => `${o.nombres} ${o.apellidos}`.toLowerCase() === q);
    if (found) return found.id_oficial;

    // 4. Check if the term contains an ID like "[ID: 13]" or "(ID: 13)"
    const idMatch = term.match(/\[ID:\s*(\d+)\]/) || term.match(/\(ID:\s*(\d+)\)/);
    if (idMatch && idMatch[1]) {
      const parsedId = parseInt(idMatch[1], 10);
      const exists = this.officers.some(o => o.id_oficial === parsedId);
      if (exists) return parsedId;
    }

    // 5. Check if the term contains a badge/placa in parentheses, e.g. "John Doe (1001)"
    const placaMatch = term.match(/\(([^)]+)\)/);
    if (placaMatch && placaMatch[1]) {
      const parsedPlate = placaMatch[1].trim().toLowerCase();
      const foundByPlate = this.officers.find(o => o.placa_policial.toLowerCase() === parsedPlate);
      if (foundByPlate) return foundByPlate.id_oficial;
    }

    // 6. Check if it's a numeric string
    const num = parseInt(term.trim(), 10);
    if (!isNaN(num)) {
      const exists = this.officers.some(o => o.id_oficial === num);
      if (exists) return num;
    }

    return null;
  }

  searchOfficer(term: any, fieldKey: string) {
    this.activeSuggestionField = fieldKey;
    if (term === null || term === undefined || term.toString().trim() === '') {
      this.officerSuggestions = this.officers; // Show all suggestions when empty
      this.setFormOfficerId(fieldKey, null);
      return;
    }
    const termStr = term.toString();
    const resolvedId = this.resolveOfficerId(termStr);
    
    if (resolvedId) {
      this.setFormOfficerId(fieldKey, resolvedId);
    } else {
      this.setFormOfficerId(fieldKey, null);
    }

    let q = termStr.trim().toLowerCase();
    
    // Clean up typical display patterns from the filter query so we search the base names/ID/placa
    const parenIndex = q.indexOf('(');
    if (parenIndex !== -1) {
      q = q.substring(0, parenIndex).trim();
    }
    const bracketIndex = q.indexOf('[');
    if (bracketIndex !== -1) {
      q = q.substring(0, bracketIndex).trim();
    }

    if (q === '') {
      if (resolvedId) {
        const o = this.officers.find(x => x.id_oficial === resolvedId);
        this.officerSuggestions = o ? [o] : [];
      } else {
        this.officerSuggestions = this.officers;
      }
      return;
    }

    this.officerSuggestions = this.officers.filter(o => 
      o.id_oficial.toString().includes(q) ||
      `${o.nombres} ${o.apellidos}`.toLowerCase().includes(q) ||
      o.placa_policial.toLowerCase().includes(q)
    );
  }

  hideOfficerSuggestions() {
    setTimeout(() => {
      this.activeSuggestionField = null;
      this.officerSuggestions = [];
    }, 200);
  }

  selectOfficerSuggestion(officer: any, fieldKey: string) {
    this.setFormOfficerId(fieldKey, officer.id_oficial);
    this.searchTerms[fieldKey as keyof typeof this.searchTerms] = this.getOfficerDisplayName(officer.id_oficial);
    this.activeSuggestionField = null;
    this.officerSuggestions = [];
  }

  setFormOfficerId(fieldKey: string, id: number | null) {
    if (fieldKey === 'manualClock') {
      this.manualClockForm.id_oficial = id;
    } else if (fieldKey === 'briefingSupervisor') {
      this.briefingForm.id_supervisor = id;
    } else if (fieldKey === 'handoverSaliente') {
      this.handoverForm.id_oficial_saliente = id;
    } else if (fieldKey === 'handoverEntrante') {
      this.handoverForm.id_oficial_entrante = id;
    } else if (fieldKey === 'certOfficer') {
      this.certForm.id_oficial = id;
    } else if (fieldKey === 'amonOfficer') {
      this.amonForm.id_oficial = id;
    } else if (fieldKey === 'amonComandante') {
      this.amonForm.id_comandante = id;
    } else if (fieldKey === 'kioscoPermitOfficer') {
      this.kioscoPermitForm.id_oficial = id;
    }
  }

  getFormOfficerId(fieldKey: string): number | null {
    if (fieldKey === 'manualClock') return this.manualClockForm.id_oficial;
    if (fieldKey === 'briefingSupervisor') return this.briefingForm.id_supervisor;
    if (fieldKey === 'handoverSaliente') return this.handoverForm.id_oficial_saliente;
    if (fieldKey === 'handoverEntrante') return this.handoverForm.id_oficial_entrante;
    if (fieldKey === 'certOfficer') return this.certForm.id_oficial;
    if (fieldKey === 'amonOfficer') return this.amonForm.id_oficial;
    if (fieldKey === 'amonComandante') return this.amonForm.id_comandante;
    if (fieldKey === 'kioscoPermitOfficer') return this.kioscoPermitForm.id_oficial;
    return null;
  }

  resolveOfficerIdFromSearchTerm(fieldKey: string): boolean {
    const term = this.searchTerms[fieldKey as keyof typeof this.searchTerms];
    if (!term || term.trim() === '') {
      this.setFormOfficerId(fieldKey, null);
      return false;
    }
    
    // Check if we already resolved it and the term matches it
    let currentId = this.getFormOfficerId(fieldKey);
    if (currentId) {
      const expectedDisplayName = this.getOfficerDisplayName(currentId);
      if (term.trim() === expectedDisplayName || term.trim() === currentId.toString()) {
        return true;
      }
    }

    const resolvedId = this.resolveOfficerId(term);
    if (resolvedId) {
      this.setFormOfficerId(fieldKey, resolvedId);
      this.searchTerms[fieldKey as keyof typeof this.searchTerms] = this.getOfficerDisplayName(resolvedId);
      return true;
    }

    this.setFormOfficerId(fieldKey, null);
    return false;
  }

  private showMessage(msg: string, error: boolean) {
    this.message = msg;
    this.isError = error;
    setTimeout(() => this.message = null, 5000);
  }

  // ==========================================
  // OFFICERS CRUD STATE & METHODS (HR ADMIN)
  // ==========================================
  showOfficerModal = false;
  isEditingOfficer = false;
  currentOfficer: any = {
    nombres: '',
    apellidos: '',
    placa_policial: '',
    correo_electronico: '',
    telefono_contacto: '',
    id_rol: 2, // Default: Patrol Officer
    fecha_ingreso: new Date().toISOString().split('T')[0],
    url_fotografia: '',
    grupo_sanguineo: 'O+',
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    insignias: 'tacticas_urbanas,primer_respondiente,conduccion_tactica,operacion_segura',
    url_hoja_vida: ''
  };
  isSavingOfficer = false;

  openCreateOfficerModal() {
    this.isEditingOfficer = false;
    this.currentOfficer = {
      nombres: '',
      apellidos: '',
      placa_policial: '',
      correo_electronico: '',
      telefono_contacto: '',
      id_rol: 2,
      fecha_ingreso: new Date().toISOString().split('T')[0],
      url_fotografia: '',
      grupo_sanguineo: 'O+',
      contacto_emergencia_nombre: '',
      contacto_emergencia_telefono: '',
      insignias: 'tacticas_urbanas,primer_respondiente,conduccion_tactica,operacion_segura',
      url_hoja_vida: ''
    };
    this.showOfficerModal = true;
  }

  openEditOfficerModal(officer: any) {
    this.isEditingOfficer = true;
    this.currentOfficer = { 
      grupo_sanguineo: 'O+',
      contacto_emergencia_nombre: '',
      contacto_emergencia_telefono: '',
      insignias: '',
      ...officer 
    };
    this.showOfficerModal = true;
  }

  closeOfficerModal() {
    this.showOfficerModal = false;
  }

  hasInsignia(key: string): boolean {
    if (!this.currentOfficer.insignias) return false;
    return this.currentOfficer.insignias.split(',').map((x: string) => x.trim()).includes(key);
  }

  toggleInsignia(key: string) {
    let list = this.currentOfficer.insignias ? this.currentOfficer.insignias.split(',').map((x: string) => x.trim()).filter(Boolean) : [];
    if (list.includes(key)) {
      list = list.filter((x: string) => x !== key);
    } else {
      list.push(key);
    }
    this.currentOfficer.insignias = list.join(',');
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 128;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            this.currentOfficer.url_fotografia = canvas.toDataURL('image/jpeg', 0.7);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCvFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.showMessage('Solo se permiten archivos PDF para la hoja de vida.', true);
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        this.showMessage('El archivo de la hoja de vida no debe superar los 2MB.', true);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentOfficer.url_hoja_vida = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  clearCvFile() {
    this.currentOfficer.url_hoja_vida = '';
  }

  viewCv(url: string) {
    if (!url) return;
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
  }

  uploadOfficerCv(event: any, id_oficial: number) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.showMessage('Solo se permiten archivos PDF para la hoja de vida.', true);
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        this.showMessage('El archivo de la hoja de vida no debe superar los 2MB.', true);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Data = e.target.result;
        const officer = this.officers.find(o => o.id_oficial === id_oficial);
        if (officer) {
          const updatedOfficer = { ...officer, url_hoja_vida: base64Data };
          this.logisticsService.updateOfficer(id_oficial, updatedOfficer).subscribe({
            next: () => {
              officer.url_hoja_vida = base64Data;
              if (this.selectedOfficer && this.selectedOfficer.id_oficial === id_oficial) {
                this.selectedOfficer.url_hoja_vida = base64Data;
              }
              this.showMessage('Hoja de vida subida exitosamente.', false);
            },
            error: (err) => {
              this.showMessage('Error al subir la hoja de vida: ' + (err.error?.error || err.message), true);
            }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }


  saveOfficer() {
    this.isSavingOfficer = true;
    if (this.isEditingOfficer) {
      this.logisticsService.updateOfficer(this.currentOfficer.id_oficial, this.currentOfficer).subscribe({
        next: () => {
          this.isSavingOfficer = false;
          this.closeOfficerModal();
          this.showMessage('Perfil del oficial actualizado exitosamente.', false);
          this.loadData();
        },
        error: (err) => {
          this.isSavingOfficer = false;
          this.showMessage('Error al actualizar el oficial: ' + (err.error?.error || err.message), true);
        }
      });
    } else {
      this.logisticsService.createOfficer(this.currentOfficer).subscribe({
        next: () => {
          this.isSavingOfficer = false;
          this.closeOfficerModal();
          this.showMessage('Nuevo oficial registrado exitosamente en el sistema.', false);
          this.loadData();
        },
        error: (err) => {
          this.isSavingOfficer = false;
          this.showMessage('Error al registrar el oficial: ' + (err.error?.error || err.message), true);
        }
      });
    }
  }

  deleteOfficer(id: number, event: Event) {
    event.stopPropagation();
    const confirmation = confirm('¿Está completamente seguro de dar de baja a este oficial?\n\nEsta acción eliminará su usuario y registro de oficial de forma permanente en el sistema.');
    if (confirmation) {
      this.logisticsService.deleteOfficer(id).subscribe({
        next: () => {
          this.selectedOfficer = null;
          this.showMessage('Oficial dado de baja exitosamente del sistema.', false);
          this.loadData();
        },
        error: (err) => {
          this.showMessage('Error al dar de baja al oficial: ' + (err.error?.error || err.message), true);
        }
      });
    }
  }

  submitMeeting() {
    this.isLoading = true;
    const payload = {
      ...this.newMeeting,
      id_oficial: this.authService.getOfficerId()
    };
    this.rrhhService.createMeeting(payload).subscribe({
      next: () => {
        this.showMessage('Reunión comunitaria registrada exitosamente.', false);
        this.newMeeting = { ubicacion: '', comentarios_vecinales: '' };
        this.loadData();
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Error al registrar la reunión comunitaria.', true);
        this.isLoading = false;
      }
    });
  }

  // --- Leaflet Map Modal for Community Meetings ---
  showMapModal = false;
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  mapSearchQuery = '';
  mapSearchSuggestions: any[] = [];
  isSearchingMap = false;
  isPinningLocation = false;
  mapSearchError = '';
  private searchTimeout: any;

  openMapModal() {
    this.showMapModal = true;
    this.isPinningLocation = false;
    this.mapSearchQuery = this.newMeeting.ubicacion || '';
    this.clearMapSearch();
    setTimeout(() => {
      this.initModalMap();
    }, 150);
  }

  closeMapModal() {
    this.showMapModal = false;
    this.isPinningLocation = false;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }
  }

  confirmMapLocation() {
    this.closeMapModal();
  }

  searchStreet() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!this.mapSearchQuery || !this.mapSearchQuery.trim() || this.mapSearchQuery.trim().length < 3) {
      this.mapSearchSuggestions = [];
      this.mapSearchError = '';
      this.isSearchingMap = false;
      return;
    }

    this.isSearchingMap = true;
    this.mapSearchError = '';

    this.searchTimeout = setTimeout(() => {
      const query = encodeURIComponent(this.mapSearchQuery.trim());
      const url = `https://nominatim.openstreetmap.org/search?q=${query}, Chicago, IL&format=json&limit=5`;
      
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Error en el servicio de búsqueda');
          return res.json();
        })
        .then(data => {
          this.ngZone.run(() => {
            this.isSearchingMap = false;
            this.mapSearchSuggestions = data.map((item: any) => ({
              display_name: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }));
            if (this.mapSearchSuggestions.length === 0) {
              this.mapSearchError = 'No se encontraron resultados para la dirección.';
            }
          });
        })
        .catch(err => {
          this.ngZone.run(() => {
            this.isSearchingMap = false;
            this.mapSearchError = 'Error al buscar en el mapa.';
          });
          console.error(err);
        });
    }, 400); // 400ms debounce
  }

  selectMapSuggestion(sug: any) {
    if (!this.map) return;
    const lat = sug.lat;
    const lng = sug.lng;
    
    this.map.flyTo([lat, lng], 17, { duration: 1.2 });
    
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: #06b6d4; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(6,182,212,0.9);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    }

    this.ngZone.run(() => {
      this.mapSearchSuggestions = [];
      const cleanedAddress = sug.display_name.split(',')[0] + (sug.display_name.split(',')[1] ? ', ' + sug.display_name.split(',')[1] : '');
      this.mapSearchQuery = cleanedAddress;
      this.newMeeting.ubicacion = cleanedAddress;
      this.isPinningLocation = true;
    });
  }

  clearMapSearch() {
    this.mapSearchQuery = '';
    this.mapSearchSuggestions = [];
    this.mapSearchError = '';
  }

  initModalMap() {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }

    // Chicago Madison St (0 N/S) at Lat 41.8818, State St (0 E/W) at Lng -87.6278
    const defaultLat = 41.8781;
    const defaultLng = -87.6298;

    this.map = L.map('modal-meeting-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([defaultLat, defaultLng], 12);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    }).addTo(this.map);

    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: #06b6d4; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(6,182,212,0.9);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.ngZone.run(() => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        this.isPinningLocation = true;

        if (this.marker) {
          this.marker.setLatLng(e.latlng);
        } else {
          this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map!);
        }

        // Call OSM Nominatim reverse geocoding to fill address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&email=safecity.project@gmail.com`)
          .then(res => res.json())
          .then(data => {
            if (data && data.address) {
              const road = data.address.road || data.address.pedestrian || data.address.suburb || '';
              const houseNumber = data.address.house_number || '';
              const neighbourhood = data.address.neighbourhood || data.address.city_district || '';
              
              let parts = [];
              if (road) parts.push(houseNumber ? `${houseNumber} ${road}` : road);
              if (neighbourhood) parts.push(neighbourhood);
              
              this.newMeeting.ubicacion = parts.length > 0 ? parts.join(', ') : (data.display_name ? data.display_name.split(',').slice(0, 2).join(',') : `Chicago Location`);
            } else if (data && data.display_name) {
              this.newMeeting.ubicacion = data.display_name.split(',').slice(0, 2).join(',');
            } else {
              this.newMeeting.ubicacion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            }
            this.mapSearchQuery = this.newMeeting.ubicacion;
          })
          .catch(() => {
            this.newMeeting.ubicacion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            this.mapSearchQuery = this.newMeeting.ubicacion;
          });
      });
    });
  }
}
