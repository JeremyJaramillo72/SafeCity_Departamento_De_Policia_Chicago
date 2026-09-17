import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import * as vis from 'vis-network/standalone';
import * as L from 'leaflet';
import { IncidentService } from '../../gestion_operativa/services/incident.service';
import { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';
import { IntelService } from '../../inteligencia_criminal/services/intel.service';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-criminal-intel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './criminal-intel.html',
  styles: [`
    .gangs-scroll-container {
      overflow-y: auto !important;
      scrollbar-width: thin !important;
      scrollbar-color: rgba(148, 163, 184, 0.35) transparent !important;
    }
    .gangs-scroll-container::-webkit-scrollbar {
      width: 5px !important;
      height: 5px !important;
    }
    .gangs-scroll-container::-webkit-scrollbar-track {
      background: transparent !important;
    }
    .gangs-scroll-container::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.3) !important;
      border-radius: 9999px !important;
    }
    .gangs-scroll-container::-webkit-scrollbar-thumb:hover {
      background: rgba(99, 102, 241, 0.5) !important;
    }
  `]
})
export class CriminalIntelComponent implements OnInit {
  @ViewChild('graphContainer', { static: false }) graphContainer!: ElementRef;
  showProfileDropdown = false;
  isLoading = true;
  activeTab: 'suspects' | 'vehicles' | 'evidence' | 'witnesses' | 'missing' | 'case_reports' | 'recidivism' | 'graph_network' = 'suspects';
  
  // Graph Network State
  graphNodesCount = 0;
  graphEdgesCount = 0;
  graphAnomaliesCount = 0;
  graphSearchQuery = '';
  graphDataLoaded = false;
  isGraphFullscreen = false;
  graphNodes: any[] = [];
  graphEdges: any[] = [];
  private networkInstance: vis.Network | null = null;

  recidivismStats: any = {
    total_suspects: 16,
    repeat_offenders: 3,
    recidivism_rate: 18.75,
    top_repeat_offenders: []
  };
  showKpis = true;
  pendingPersonId = '';

  // OT13: Suspect Vehicles Directory State
  suspectVehicles: any[] = [];
  filterVehicleEstado = '';
  searchQueryVehicle = '';
  sortFieldVehicle = '';
  sortAscendingVehicle = true;
  isLoadingVehicles = false;
  vehiclePage = 1;
  vehiclePageSize = 10;
  showVehicleDetailModal = false;
  selectedVehicleDetail: any = null;

  // OT7: Case Evidence & Testimonies Relational Report State

  selectedCaseDetail: any = null;
  showCaseDetailModal = false;

  globalSearchQuery = '';

  isUploadingImage = false;

  // Autocomplete Incidents State
  caseSuggestions: any[] = [];
  showCaseSuggestions = false;
  isSearchingCases = false;

  wasSuspectCasesModalOpen = false;

  // Core Data
  showSuspectCasesModal = false;
  selectedSuspectName = '';
  selectedSuspectCases: any[] = [];

  openSuspectCasesModal(suspect: any) {
    this.selectedSuspectName = suspect.nombre || suspect.nombres;
    this.selectedSuspectCases = this.suspects.filter(s => s.id_sospechoso === suspect.id_sospechoso);
    this.showSuspectCasesModal = true;
  }

  closeSuspectCasesModal() {
    this.showSuspectCasesModal = false;
  }

  closeCaseDetailModal() {
    this.showCaseDetailModal = false;
  }

  loadCaseReports() {
    // Case reports loader
  }

  suspects: any[] = [];
  sortFieldSuspect = '';
  sortAscendingSuspect = true;
  gangs: any[] = [];
  gangSearchQuery: string = '';
  evidences: any[] = [];
  sortFieldEvidence = '';
  sortAscendingEvidence = true;
  witnesses: any[] = [];
  sortFieldWitness = '';
  sortAscendingWitness = true;
  victims: any[] = [];
  sortFieldVictim = '';
  sortAscendingVictim = true;
  officers: any[] = [];

  // Missing Persons State
  missingPersons: any[] = [];
  filteredMissingPersons: any[] = [];
  searchQueryMissing = '';
  sortFieldMissing = '';
  sortAscendingMissing = true;
  showMissingModal = false;
  isSavingMissingPerson = false;
  photoWarning = '';

  // Map Picker State
  showMapModal = false;
  isSearchingMap = false;
  isPinningLocation = false;
  selectedMapAddress = '';
  mapContext: 'missing_person' | 'suspect' | 'gang' | 'witness' | 'victim' = 'missing_person';
  mapSearchQuery = '';
  mapSearchSuggestions: any[] = [];
  mapSearchError = '';
  private searchTimeout: any;
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  // Quick Case State
  showCreateCaseModal = false;
  isSavingCase = false;
  quickCase: any = {
    case_number: '',
    date: '',
    primary_type: 'MISSING PERSON',
    description: 'MISSING PERSON REPORT',
    block: '',
    location_description: 'STREET'
  };

  currentMissingPerson: any = {
    case_number: '',
    nombre_completo: '',
    edad: null,
    tiene_dependencia_medicamentos: false,
    fotografia: '',
    descripcion_fisica: '',
    vestimenta: '',
    ultima_ubicacion: '',
    reportante_nombre: '',
    reportante_telefono: ''
  };

  showUpdateStatusModal = false;
  isUpdatingStatus = false;
  updatingPerson: any = {
    id: '',
    nombre_completo: '',
    estado: 'Active Search'
  };

  showDetailsModal = false;
  viewingPerson: any = null;

  filterMissingEstado = '';
  filterMissingRiesgo = '';

  // Suspect Modal CRUD State
  showSuspectModal = false;
  isEditingSuspect = false;
  isSavingSuspect = false;
  currentSuspect: any = {
    case_number: '',
    nombres: '',
    identificacion: '',
    genero: 'M',
    telefono: '',
    direccion: '',
    alias_conocido: '',
    fecha_nacimiento: '',
    antecedentes: false,
    declaracion: '',
    id_banda: 0
  };

  // Gang Modal CRUD State
  showGangModal = false;
  isEditingGang = false;
  isSavingGang = false;
  currentGang: any = {
    nombre_banda: '',
    zona_operacion: '',
    nivel_peligrosidad: 'Medium'
  };

  // Modal Flotante de Vista Previa de Imagen / Zoom
  previewImageModal = false;
  previewImageData: { url: string; title: string; subtitle?: string; risk?: string } | null = null;

  openImagePreview(url: string, title: string, subtitle: string = '', risk: string = '', event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!url) return;
    this.previewImageData = { url, title, subtitle, risk };
    this.previewImageModal = true;
  }

  closeImagePreview(): void {
    this.previewImageModal = false;
    setTimeout(() => {
      this.previewImageData = null;
    }, 250);
  }

  // Evidence Modal CRUD State
  showEvidenceModal = false;
  isEditingEvidence = false;
  isSavingEvidence = false;
  currentEvidence: any = {
    case_number: '',
    tipo_evidencia: '',
    id_oficial: 1,
    url_fotografia: ''
  };

  // Custody Transfer State
  showCustodyLogModal = false;
  showTransferModal = false;
  isTransferring = false;
  selectedEvidence: any = null;
  custodyLogs: any[] = [];
  transferData = {
    oficial_destino: '',
    observaciones: ''
  };

  // Witness Modal CRUD State
  showWitnessModal = false;
  isEditingWitness = false;
  isSavingWitness = false;
  currentWitness: any = {
    case_number: '',
    nombres: '',
    identificacion: '',
    genero: 'M',
    telefono: '',
    direccion: '',
    testimonio: '',
    es_anonimo: false
  };

  // Victim Modal CRUD State
  showVictimModal = false;
  isEditingVictim = false;
  isSavingVictim = false;
  currentVictim: any = {
    case_number: '',
    nombres: '',
    identificacion: '',
    genero: 'M',
    telefono: '',
    direccion: ''
  };

  constructor(
    private dataService: IntelService,
    private incidentService: IncidentService,
    private logisticsService: LogisticsService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadAllData();
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'] as any;
      }
      if (params['id']) {
        this.pendingPersonId = params['id'];
        this.checkAndOpenFromQuery();
      }
    });
  }

  loadAllData() {
    this.isLoading = true;
    this.dataService.getSuspects().subscribe({
      next: (data) => {
        this.suspects = data;
        this.applySuspectSort();
      },
      error: (err) => console.error(err)
    });
    this.dataService.getGangs().subscribe({
      next: (data) => this.gangs = data,
      error: (err) => console.error(err)
    });
    this.loadRecidivismStats();
    this.dataService.getEvidences().subscribe({
      next: (data) => {
        this.evidences = data;
        this.applyEvidenceSort();
      },
      error: (err) => console.error(err)
    });
    this.dataService.getWitnesses().subscribe({
      next: (data) => {
        this.witnesses = data;
        this.applyWitnessSort();
      },
      error: (err) => console.error(err)
    });
    this.dataService.getVictims().subscribe({
      next: (data) => {
        this.victims = data;
        this.applyVictimSort();
      },
      error: (err) => console.error(err)
    });
    this.logisticsService.getOfficers().subscribe({
      next: (data) => {
        this.officers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
    this.loadMissingPersons();
    this.loadSuspectVehicles();
  }

  loadRecidivismStats() {
    this.http.get<any>('http://localhost:8000/api/criminal/recidivism-stats/').subscribe({
      next: (data) => {
        if (data) this.recidivismStats = data;
      },
      error: (err) => console.error('Error loading recidivism stats:', err)
    });
  }

  loadGraphData() {
    this.http.get<any>('http://localhost:8000/api/criminal/graph-network/').subscribe({
      next: (res) => {
        this.graphNodesCount = res.nodes?.length || 0;
        this.graphEdgesCount = res.edges?.length || 0;
        this.graphAnomaliesCount = res.anomalies_count || 0;
        this.graphNodes = res.nodes || [];
        this.graphEdges = res.edges || [];
        this.graphDataLoaded = true;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.initGraph(this.graphNodes, this.graphEdges);
        }, 150);
      },
      error: (err) => {
        console.error('Error loading graph network data:', err);
      }
    });
  }

  initGraph(nodes: any[], edges: any[], retries = 0) {
    if (typeof window !== 'undefined' && !(window as any).global) {
      (window as any).global = window;
    }
    
    const container = this.graphContainer?.nativeElement || (typeof document !== 'undefined' ? document.getElementById('graph-network-container') : null);
    
    if (!container) {
      if (retries < 15) {
        setTimeout(() => this.initGraph(nodes, edges, retries + 1), 100);
      } else {
        console.error("Graph container not found in DOM");
      }
      return;
    }

    if (typeof vis.Network !== 'function') {
      container.innerHTML = `<div class="text-error font-bold p-10 bg-error/10 rounded-lg h-full flex items-center justify-center">Error: vis-network failed to load. Type = ${typeof vis.Network}</div>`;
      return;
    }

    // Format nodes for vis-network
    const visNodes = nodes.map(n => {
      let color = '#3b82f6'; // blue for suspect
      let shape = 'dot';
      let size = 15;
      
      if (n.group === 'gang') {
        color = '#8b5cf6'; // purple
        shape = 'diamond';
        size = 25;
      } else if (n.group === 'incident') {
        color = '#10b981'; // green
        shape = 'square';
        size = 15;
      }
      
      if (n.is_anomaly) {
        color = '#ef4444'; // red for anomalies
        size = 30; // larger
      }

      return {
        id: n.id,
        label: n.label,
        shape: shape,
        color: {
          background: color,
          border: n.is_anomaly ? '#b91c1c' : '#1e293b'
        },
        size: size,
        font: { color: '#e2e8f0' },
        title: n.anomaly_reason ? `ANOMALY: ${n.anomaly_reason}` : n.label
      };
    });

    const visEdges = edges.map(e => ({
      from: e.from,
      to: e.to,
      label: e.label,
      arrows: 'to'
    }));

    const data = {
      nodes: visNodes,
      edges: visEdges
    };

    const options = {
      nodes: {
        borderWidth: 2,
        shadow: true,
        font: {
          color: '#f8fafc',
          strokeWidth: 3,
          strokeColor: '#0f172a' // Dark background stroke for high contrast
        }
      },
      edges: {
        width: 1,
        color: { color: '#475569', highlight: '#94a3b8' },
        font: { 
          align: 'middle', 
          size: 10, 
          color: '#94a3b8',
          strokeWidth: 2,
          strokeColor: '#0f172a'
        },
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.5
        }
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -10000,
          centralGravity: 0.15,
          springLength: 300,
          springConstant: 0.05,
          damping: 0.09
        },
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true
      }
    };

    if (this.networkInstance) {
      this.networkInstance.destroy();
      this.networkInstance = null;
    }

    try {
      this.networkInstance = new vis.Network(container, data, options);
      console.log("Graph rendered with", visNodes.length, "nodes");
    } catch (e: any) {
      console.error("Failed to render graph:", e);
      container.innerHTML = `<div class="text-error font-bold p-6 bg-error/10 rounded-lg h-full flex flex-col gap-2 overflow-auto">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-2xl">error</span><span>Error de ejecución:</span></div>
        <pre class="font-data-mono text-[10px] text-on-surface whitespace-pre-wrap">${e.stack || e.message || String(e)}</pre>
      </div>`;
    }
  }

  searchGraph() {
    if (!this.networkInstance) return;
    
    if (!this.graphSearchQuery.trim()) {
      this.networkInstance.unselectAll();
      return;
    }
    
    const query = this.graphSearchQuery.toLowerCase();
    const matchedIds = this.graphNodes
      .filter(n => n.label && n.label.toLowerCase().includes(query))
      .map(n => n.id);
      
    if (matchedIds.length > 0) {
      this.networkInstance.selectNodes(matchedIds);
      if (matchedIds.length === 1) {
        this.networkInstance.focus(matchedIds[0], { 
          scale: 1.2, 
          animation: { duration: 1000, easingFunction: 'easeInOutQuad' } 
        });
      } else {
        this.networkInstance.fit({
          nodes: matchedIds,
          animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
        });
      }
    } else {
      this.networkInstance.unselectAll();
    }
  }

  // ==== Missing Persons Methods ====// --- OT13: Suspect Vehicles Methods ---
  loadSuspectVehicles() {
    this.isLoadingVehicles = true;
    const filters: any = {};
    if (this.globalSearchQuery) filters.search = this.globalSearchQuery;
    if (this.filterVehicleEstado) filters.estado = this.filterVehicleEstado;

    this.dataService.getSuspectVehiclesDirectory(filters).subscribe({
      next: (data) => {
        this.suspectVehicles = data;
        this.applyVehicleSort();
        this.isLoadingVehicles = false;
      },
      error: (err) => {
        console.error('Error loading suspect vehicles:', err);
        this.isLoadingVehicles = false;
      }
    });
  }

  getFilteredSuspectVehicles() {
    let result = this.suspectVehicles;
    if (this.filterVehicleEstado && this.filterVehicleEstado !== 'ALL') {
      result = result.filter(v => v.estado_reporte === this.filterVehicleEstado);
    }
    const q = (this.searchQueryVehicle || this.globalSearchQuery || '').trim().toLowerCase();
    if (q) {
      result = result.filter(v =>
        v.placa?.toLowerCase().includes(q) ||
        v.marca?.toLowerCase().includes(q) ||
        v.modelo?.toLowerCase().includes(q) ||
        v.case_number?.toLowerCase().includes(q) ||
        v.sospechoso_nombre?.toLowerCase().includes(q) ||
        v.sospechoso_alias?.toLowerCase().includes(q) ||
        v.sospechoso_identificacion?.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getPaginatedSuspectVehicles() {
    const filtered = this.getFilteredSuspectVehicles();
    const start = (this.vehiclePage - 1) * this.vehiclePageSize;
    return filtered.slice(start, start + this.vehiclePageSize);
  }

  get totalVehiclePages() {
    return Math.ceil(this.getFilteredSuspectVehicles().length / this.vehiclePageSize) || 1;
  }

  changeVehiclePage(delta: number) {
    const newPage = this.vehiclePage + delta;
    if (newPage >= 1 && newPage <= this.totalVehiclePages) {
      this.vehiclePage = newPage;
    }
  }

  sortVehicles(field: string) {
    if (this.sortFieldVehicle === field) {
      this.sortAscendingVehicle = !this.sortAscendingVehicle;
    } else {
      this.sortFieldVehicle = field;
      this.sortAscendingVehicle = true;
    }
    this.applyVehicleSort();
  }

  applyVehicleSort() {
    if (!this.sortFieldVehicle) return;
    const field = this.sortFieldVehicle;
    const direction = this.sortAscendingVehicle ? 1 : -1;
    this.suspectVehicles.sort((a, b) => {
      let valA = a[field] || '';
      let valB = b[field] || '';
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  openVehicleDetailModal(vehicle: any) {
    this.selectedVehicleDetail = vehicle;
    this.showVehicleDetailModal = true;
  }

  closeVehicleDetailModal() {
    this.showVehicleDetailModal = false;
    this.selectedVehicleDetail = null;
  }

  // Suspects sorting and filtering
  getFilteredSuspects() {
    if (!this.globalSearchQuery) return this.suspects;
    const q = this.globalSearchQuery.toLowerCase();
    return this.suspects.filter(s => 
      s.nombres?.toLowerCase().includes(q) ||
      s.alias_conocido?.toLowerCase().includes(q) ||
      s.case_number?.toLowerCase().includes(q) ||
      s.identificacion?.toLowerCase().includes(q)
    );
  }

  getGroupedSuspects() {
    const map = new Map<number, any>();
    const suspectsToProcess = this.getFilteredSuspects();
    for (const s of suspectsToProcess) {
      if (!map.has(s.id_sospechoso)) {
        map.set(s.id_sospechoso, {
          id_sospechoso: s.id_sospechoso,
          nombre: s.nombres || s.nombre,
          total_casos: 0,
          original: s
        });
      }
      map.get(s.id_sospechoso).total_casos++;
    }
    const result = Array.from(map.values());
    result.sort((a, b) => b.total_casos - a.total_casos || b.id_sospechoso - a.id_sospechoso);
    return result;
  }

  sortSuspects(field: string) {
    if (this.sortFieldSuspect === field) {
      this.sortAscendingSuspect = !this.sortAscendingSuspect;
    } else {
      this.sortFieldSuspect = field;
      this.sortAscendingSuspect = true;
    }
    this.applySuspectSort();
  }
  applySuspectSort() {
    if (!this.sortFieldSuspect) return;
    const field = this.sortFieldSuspect;
    const direction = this.sortAscendingSuspect ? 1 : -1;
    this.suspects.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'antecedentes') {
        valA = a.antecedentes ? 1 : 0;
        valB = b.antecedentes ? 1 : 0;
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  // Evidence sorting and filtering
  getFilteredEvidences() {
    if (!this.globalSearchQuery) return this.evidences;
    const q = this.globalSearchQuery.toLowerCase().trim();
    return this.evidences.filter(e => 
      e.tipo_evidencia?.toLowerCase().includes(q) ||
      e.case_number?.toLowerCase().includes(q) ||
      e.officer_name?.toLowerCase().includes(q) ||
      e.fecha_recoleccion?.toLowerCase().includes(q)
    );
  }

  sortEvidences(field: string) {
    if (this.sortFieldEvidence === field) {
      this.sortAscendingEvidence = !this.sortAscendingEvidence;
    } else {
      this.sortFieldEvidence = field;
      this.sortAscendingEvidence = true;
    }
    this.applyEvidenceSort();
  }
  applyEvidenceSort() {
    if (!this.sortFieldEvidence) return;
    const field = this.sortFieldEvidence;
    const direction = this.sortAscendingEvidence ? 1 : -1;
    this.evidences.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_recoleccion') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  // Witnesses sorting and filtering
  getFilteredWitnesses() {
    if (!this.globalSearchQuery) return this.witnesses;
    const q = this.globalSearchQuery.toLowerCase().trim();
    return this.witnesses.filter(w => 
      w.nombres?.toLowerCase().includes(q) ||
      w.case_number?.toLowerCase().includes(q) ||
      w.identificacion?.toLowerCase().includes(q) ||
      w.testimonio?.toLowerCase().includes(q) ||
      w.telefono?.toLowerCase().includes(q) ||
      w.direccion?.toLowerCase().includes(q)
    );
  }

  sortWitnesses(field: string) {
    if (this.sortFieldWitness === field) {
      this.sortAscendingWitness = !this.sortAscendingWitness;
    } else {
      this.sortFieldWitness = field;
      this.sortAscendingWitness = true;
    }
    this.applyWitnessSort();
  }
  applyWitnessSort() {
    if (!this.sortFieldWitness) return;
    const field = this.sortFieldWitness;
    const direction = this.sortAscendingWitness ? 1 : -1;
    this.witnesses.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      valA = (valA || '').toString().toLowerCase();
      valB = (valB || '').toString().toLowerCase();
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  // Victims sorting and filtering
  getFilteredVictims() {
    if (!this.globalSearchQuery) return this.victims;
    const q = this.globalSearchQuery.toLowerCase().trim();
    return this.victims.filter(v => 
      v.nombres?.toLowerCase().includes(q) ||
      v.case_number?.toLowerCase().includes(q) ||
      v.identificacion?.toLowerCase().includes(q) ||
      v.telefono?.toLowerCase().includes(q) ||
      v.direccion?.toLowerCase().includes(q)
    );
  }

  sortVictims(field: string) {
    if (this.sortFieldVictim === field) {
      this.sortAscendingVictim = !this.sortAscendingVictim;
    } else {
      this.sortFieldVictim = field;
      this.sortAscendingVictim = true;
    }
    this.applyVictimSort();
  }
  applyVictimSort() {
    if (!this.sortFieldVictim) return;
    const field = this.sortFieldVictim;
    const direction = this.sortAscendingVictim ? 1 : -1;
    this.victims.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      valA = (valA || '').toString().toLowerCase();
      valB = (valB || '').toString().toLowerCase();
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  // Autocomplete Incident Methods
  searchCases(term: string) {
    if (!term || term.trim().length < 2) {
      this.caseSuggestions = [];
      this.showCaseSuggestions = false;
      return;
    }
    this.isSearchingCases = true;
    this.showCaseSuggestions = true;
    this.incidentService.getIncidents(1, 10, { search: term }).subscribe({
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

  selectCaseNumber(caseNumber: string, targetEntity: 'suspect' | 'evidence' | 'witness' | 'victim' | 'missing') {
    if (targetEntity === 'suspect') {
      this.currentSuspect.case_number = caseNumber;
    } else if (targetEntity === 'evidence') {
      this.currentEvidence.case_number = caseNumber;
    } else if (targetEntity === 'witness') {
      this.currentWitness.case_number = caseNumber;
    } else if (targetEntity === 'victim') {
      this.currentVictim.case_number = caseNumber;
    } else if (targetEntity === 'missing') {
      this.currentMissingPerson.case_number = caseNumber;
    }
    this.showCaseSuggestions = false;
    this.caseSuggestions = [];
  }

  setActiveTab(tab: any) {
    this.activeTab = tab;
    if (tab === 'graph_network') {
      if (!this.graphDataLoaded) {
        this.loadGraphData();
      } else {
        setTimeout(() => {
          this.initGraph(this.graphNodes, this.graphEdges);
        }, 100);
      }
    }
    if (tab === 'missing') {
      this.loadMissingPersons();
    } else if (tab === 'vehicles') {
      this.loadSuspectVehicles();
    } else if (tab === 'case_reports') {
      this.loadCaseReports();
    }
    this.cdr.detectChanges();
  }

  // ==========================================
  // SUSPECT CRUD METHODS
  // ==========================================
  openCreateSuspectModal() {
    this.isEditingSuspect = false;
    this.currentSuspect = {
      case_number: '',
      nombres: '',
      identificacion: '',
      genero: 'M',
      telefono: '',
      direccion: '',
      alias_conocido: '',
      fecha_nacimiento: new Date().toISOString().split('T')[0],
      antecedentes: false,
      declaracion: '',
      id_banda: this.gangs[0]?.id_banda || 0
    };
    this.showSuspectModal = true;
  }

  openEditSuspectModal(suspect: any) {
    this.isEditingSuspect = true;
    this.currentSuspect = { ...suspect };
    this.wasSuspectCasesModalOpen = this.showSuspectCasesModal;
    if (this.showSuspectCasesModal) {
      this.closeSuspectCasesModal();
    }
    this.showSuspectModal = true;
  }

  closeSuspectModal() {
    this.showSuspectModal = false;
    if (this.wasSuspectCasesModalOpen) {
      // Re-filter just in case data changed
      this.selectedSuspectCases = this.suspects.filter(s => s.id_sospechoso === this.currentSuspect.id_sospechoso);
      this.showSuspectCasesModal = true;
      this.wasSuspectCasesModalOpen = false;
    }
  }

  saveSuspect() {
    this.isSavingSuspect = true;
    if (this.isEditingSuspect) {
      this.dataService.updateSuspect(this.currentSuspect.id_sospechoso, this.currentSuspect).subscribe({
        next: () => {
          this.isSavingSuspect = false;
          this.closeSuspectModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingSuspect = false;
        }
      });
    } else {
      this.dataService.createSuspect(this.currentSuspect).subscribe({
        next: () => {
          this.isSavingSuspect = false;
          this.closeSuspectModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingSuspect = false;
        }
      });
    }
  }

  deleteSuspect(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar este sospechoso del expediente criminal?')) {
      this.dataService.deleteSuspect(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // GANG CRUD METHODS
  // ==========================================
  openCreateGangModal() {
    this.isEditingGang = false;
    this.currentGang = {
      nombre_banda: '',
      zona_operacion: '',
      nivel_peligrosidad: 'Medium'
    };
    this.showGangModal = true;
  }

  openEditGangModal(gang: any) {
    this.isEditingGang = true;
    this.currentGang = { ...gang };
    this.showGangModal = true;
  }

  closeGangModal() {
    this.showGangModal = false;
  }

  saveGang() {
    this.isSavingGang = true;
    if (this.isEditingGang) {
      this.dataService.updateGang(this.currentGang.id_banda, this.currentGang).subscribe({
        next: () => {
          this.isSavingGang = false;
          this.closeGangModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingGang = false;
        }
      });
    } else {
      this.dataService.createGang(this.currentGang).subscribe({
        next: () => {
          this.isSavingGang = false;
          this.closeGangModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingGang = false;
        }
      });
    }
  }

  deleteGang(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar esta banda criminal y desvincular a sus miembros?')) {
      this.dataService.deleteGang(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }

  getFilteredGangs(): any[] {
    if (!this.gangs) return [];
    let list = [...this.gangs];
    if (this.gangSearchQuery && this.gangSearchQuery.trim()) {
      const q = this.gangSearchQuery.toLowerCase().trim();
      list = list.filter(g => 
        (g.nombre_banda && g.nombre_banda.toLowerCase().includes(q)) ||
        (g.zona_operacion && g.zona_operacion.toLowerCase().includes(q)) ||
        (g.nivel_peligrosidad && g.nivel_peligrosidad.toLowerCase().includes(q))
      );
    }
    // Sort newest created first so newly registered gangs appear at the top
    return list.sort((a, b) => (b.id_banda || 0) - (a.id_banda || 0));
  }

  // ==========================================
  // EVIDENCE CRUD METHODS
  // ==========================================
  openCreateEvidenceModal() {
    this.isEditingEvidence = false;
    this.currentEvidence = {
      case_number: '',
      tipo_evidencia: '',
      id_oficial: this.authService.getOfficerId(),
      url_fotografia: ''
    };
    this.showEvidenceModal = true;
  }

  openEditEvidenceModal(evidence: any) {
    this.isEditingEvidence = true;
    this.currentEvidence = { ...evidence };
    this.showEvidenceModal = true;
  }

  closeEvidenceModal() {
    this.showEvidenceModal = false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.isUploadingImage = true;
    this.dataService.uploadEvidenceImage(file).subscribe({
      next: (res) => {
        this.currentEvidence.url_fotografia = res.url;
        this.isUploadingImage = false;
      },
      error: (err) => {
        console.error('Error uploading image:', err);
        alert('Error al subir la imagen: ' + (err.error?.error || err.message));
        this.isUploadingImage = false;
      }
    });
  }

  saveEvidence() {
    this.isSavingEvidence = true;
    this.currentEvidence.id_oficial = this.authService.getOfficerId();
    if (this.isEditingEvidence) {
      this.dataService.updateEvidence(this.currentEvidence.id_evidencia, this.currentEvidence).subscribe({
        next: () => {
          this.isSavingEvidence = false;
          this.closeEvidenceModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingEvidence = false;
        }
      });
    } else {
      this.dataService.createEvidence(this.currentEvidence).subscribe({
        next: () => {
          this.isSavingEvidence = false;
          this.closeEvidenceModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingEvidence = false;
        }
      });
    }
  }

  deleteEvidence(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar este registro de evidencia confiscada?')) {
      this.dataService.deleteEvidence(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }
  // ==========================================
  // CUSTODY TRANSFER METHODS
  // ==========================================
  openCustodyLogModal(evidence: any): void {
    this.selectedEvidence = evidence;
    this.loadCustodyLog(evidence.id_evidencia);
    this.showCustodyLogModal = true;
  }

  loadCustodyLog(id_evidencia: number): void {
    this.dataService.getEvidenceCustodyLog(id_evidencia).subscribe({
      next: (data) => { this.custodyLogs = data; },
      error: (err) => console.error(err)
    });
  }

  openTransferModal(evidence: any): void {
    this.selectedEvidence = evidence;
    this.showCustodyLogModal = false;
    this.transferData = { oficial_destino: '', observaciones: '' };
    this.showTransferModal = true;
  }

  confirmTransfer(): void {
    if (!this.transferData.oficial_destino) return;
    this.isTransferring = true;
    this.dataService.transferEvidenceCustody(
      this.selectedEvidence.id_evidencia, 
      this.transferData
    ).subscribe({
      next: () => {
        this.isTransferring = false;
        this.closeTransferModal();
        this.loadAllData();
      },
      error: () => { this.isTransferring = false; }
    });
  }

  closeCustodyModal(): void { this.showCustodyLogModal = false; }
  closeTransferModal(): void { this.showTransferModal = false; }

  // ==========================================
  // WITNESS CRUD METHODS
  // ==========================================
  openCreateWitnessModal() {
    this.isEditingWitness = false;
    this.currentWitness = {
      case_number: '',
      nombres: '',
      identificacion: '',
      genero: 'M',
      telefono: '',
      direccion: '',
      testimonio: '',
      es_anonimo: false
    };
    this.showWitnessModal = true;
  }

  openEditWitnessModal(witness: any) {
    this.isEditingWitness = true;
    this.currentWitness = { ...witness };
    this.showWitnessModal = true;
  }

  closeWitnessModal() {
    this.showWitnessModal = false;
  }

  saveWitness() {
    this.isSavingWitness = true;
    if (this.isEditingWitness) {
      this.dataService.updateWitness(this.currentWitness.id_testigo, this.currentWitness).subscribe({
        next: () => {
          this.isSavingWitness = false;
          this.closeWitnessModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingWitness = false;
        }
      });
    } else {
      this.dataService.createWitness(this.currentWitness).subscribe({
        next: () => {
          this.isSavingWitness = false;
          this.closeWitnessModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingWitness = false;
        }
      });
    }
  }

  deleteWitness(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar el testimonio de este testigo?')) {
      this.dataService.deleteWitness(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // VICTIM CRUD METHODS
  // ==========================================
  openCreateVictimModal() {
    this.isEditingWitness = false;
    this.currentVictim = {
      case_number: '',
      nombres: '',
      identificacion: '',
      genero: 'M',
      telefono: '',
      direccion: ''
    };
    this.showVictimModal = true;
  }

  openEditVictimModal(victim: any) {
    this.isEditingVictim = true;
    this.currentVictim = { ...victim };
    this.showVictimModal = true;
  }

  closeVictimModal() {
    this.showVictimModal = false;
  }

  saveVictim() {
    this.isSavingVictim = true;
    if (this.isEditingVictim) {
      this.dataService.updateVictim(this.currentVictim.id_victima, this.currentVictim).subscribe({
        next: () => {
          this.isSavingVictim = false;
          this.closeVictimModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingVictim = false;
        }
      });
    } else {
      this.dataService.createVictim(this.currentVictim).subscribe({
        next: () => {
          this.isSavingVictim = false;
          this.closeVictimModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingVictim = false;
        }
      });
    }
  }

  deleteVictim(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar a esta víctima del expediente del caso?')) {
      this.dataService.deleteVictim(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // MISSING PERSONS METHODS
  // ==========================================
  loadMissingPersons() {
    this.isLoading = true;
    const filters = {
      estado: this.filterMissingEstado,
      nivel_riesgo: this.filterMissingRiesgo
    };
    this.dataService.getMissingPersons(filters).subscribe({
      next: (data) => {
        this.missingPersons = data;
        this.applyMissingFilters();
        this.isLoading = false;
        this.checkAndOpenFromQuery();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  checkAndOpenFromQuery() {
    if (this.pendingPersonId && this.missingPersons.length > 0) {
      const person = this.missingPersons.find(p => p.id === this.pendingPersonId);
      if (person) {
        this.openDetailsModal(person);
      }
      this.pendingPersonId = ''; // Clear after opening
    }
  }

  applyMissingFilters() {
    const query = (this.searchQueryMissing || '').trim().toLowerCase();
    this.filteredMissingPersons = this.missingPersons.filter(item => {
      const matchEstado = !this.filterMissingEstado || item.estado === this.filterMissingEstado;
      const matchRiesgo = !this.filterMissingRiesgo || item.nivel_riesgo === this.filterMissingRiesgo;
      const matchQuery = !query ||
        (item.nombre_completo && item.nombre_completo.toLowerCase().includes(query)) ||
        (item.case_number && item.case_number.toLowerCase().includes(query)) ||
        (item.ultima_ubicacion && item.ultima_ubicacion.toLowerCase().includes(query)) ||
        (item.descripcion_fisica && item.descripcion_fisica.toLowerCase().includes(query)) ||
        (item.vestimenta && item.vestimenta.toLowerCase().includes(query)) ||
        (item.datos_reportante && item.datos_reportante.toLowerCase().includes(query));
      return matchEstado && matchRiesgo && matchQuery;
    });
    this.applyMissingSort();
  }

  // Missing Persons sorting methods
  sortMissing(field: string) {
    if (this.sortFieldMissing === field) {
      this.sortAscendingMissing = !this.sortAscendingMissing;
    } else {
      this.sortFieldMissing = field;
      this.sortAscendingMissing = true;
    }
    this.applyMissingSort();
  }
  applyMissingSort() {
    if (!this.sortFieldMissing) return;
    const field = this.sortFieldMissing;
    const direction = this.sortAscendingMissing ? 1 : -1;
    this.filteredMissingPersons.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'edad') {
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

  get calculatedRiskLevel(): string {
    if (this.currentMissingPerson.edad && this.currentMissingPerson.edad < 12) {
      return 'CRITICAL';
    }
    if (this.currentMissingPerson.tiene_dependencia_medicamentos) {
      return 'HIGH';
    }
    return 'MEDIUM';
  }

  openCreateMissingModal() {
    this.photoWarning = '';
    this.currentMissingPerson = {
      case_number: '',
      nombre_completo: '',
      edad: null,
      tiene_dependencia_medicamentos: false,
      fotografia: '',
      descripcion_fisica: '',
      vestimenta: '',
      ultima_ubicacion: '',
      reportante_nombre: '',
      reportante_telefono: ''
    };
    this.showMissingModal = true;
  }

  closeMissingModal() {
    this.showMissingModal = false;
  }

  // ==========================================
  // QUICK CASE CREATION
  // ==========================================
  openCreateCaseModal() {
    this.quickCase = {
      case_number: `MP${Math.floor(Date.now() / 1000)}`,
      date: new Date().toISOString(),
      primary_type: 'MISSING PERSON',
      description: 'REPORTE DE PERSONA DESAPARECIDA',
      block: this.currentMissingPerson.ultima_ubicacion || 'NO ESPECIFICADO',
      location_description: 'STREET'
    };
    this.showCreateCaseModal = true;
  }

  closeCreateCaseModal() {
    this.showCreateCaseModal = false;
  }

  saveQuickCase() {
    if (!this.quickCase.block || this.quickCase.block.trim() === '') {
      alert('Error: Debe especificar una Cuadra / Ubicación para el caso.');
      return;
    }
    
    this.isSavingCase = true;
    this.incidentService.createIncident(this.quickCase).subscribe({
      next: (res) => {
        this.isSavingCase = false;
        // Associate directly to the missing person form
        this.currentMissingPerson.case_number = this.quickCase.case_number;
        this.closeCreateCaseModal();
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el caso: ' + (err.error?.error || err.message));
        this.isSavingCase = false;
      }
    });
  }

  // ==========================================
  // MAP PICKER FOR LAST LOCATION
  // ==========================================
  openMapModal(context: 'missing_person' | 'suspect' | 'gang' | 'witness' | 'victim' = 'missing_person') {
    this.mapContext = context;
    this.mapSearchQuery = '';
    this.mapSearchSuggestions = [];
    this.mapSearchError = '';
    this.isPinningLocation = false;
    
    // Pre-fill existing address if present
    if (context === 'suspect' && this.currentSuspect.direccion) {
      this.selectedMapAddress = this.currentSuspect.direccion;
      this.mapSearchQuery = this.currentSuspect.direccion;
    } else if (context === 'gang' && this.currentGang.zona_operacion) {
      this.selectedMapAddress = this.currentGang.zona_operacion;
      this.mapSearchQuery = this.currentGang.zona_operacion;
    } else if (context === 'witness' && this.currentWitness.direccion) {
      this.selectedMapAddress = this.currentWitness.direccion;
      this.mapSearchQuery = this.currentWitness.direccion;
    } else if (context === 'victim' && this.currentVictim.direccion) {
      this.selectedMapAddress = this.currentVictim.direccion;
      this.mapSearchQuery = this.currentVictim.direccion;
    } else if (context === 'missing_person' && this.currentMissingPerson.ultima_ubicacion) {
      this.selectedMapAddress = this.currentMissingPerson.ultima_ubicacion;
      this.mapSearchQuery = this.currentMissingPerson.ultima_ubicacion;
    } else {
      this.selectedMapAddress = '';
    }

    this.showMapModal = true;
    setTimeout(() => this.initMap(), 120);
  }

  closeMapModal() {
    this.showMapModal = false;
    this.isSearchingMap = false;
    this.isPinningLocation = false;
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }
  }

  onSearchQueryChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      const query = this.mapSearchQuery.trim();
      if (query.length >= 3) {
        this.searchMapLocation();
      } else if (query.length === 0) {
        this.clearMapSearch();
      }
    }, 400);
  }

  searchStreet() {
    this.searchMapLocation();
  }

  searchMapLocation() {
    if (!this.mapSearchQuery.trim()) {
      this.mapSearchSuggestions = [];
      return;
    }
    this.mapSearchError = '';
    this.isSearchingMap = true;
    const queryStr = this.mapSearchQuery.trim();
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr)}, Chicago, IL&format=json&limit=5`;
    
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.setMapSuggestions(data);
          this.isSearchingMap = false;
        } else {
          const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr)}, IL&format=json&limit=5`;
          this.http.get<any[]>(fallbackUrl).subscribe({
            next: (fallbackData) => {
              this.isSearchingMap = false;
              if (fallbackData && fallbackData.length > 0) {
                this.setMapSuggestions(fallbackData);
              } else {
                this.mapSearchSuggestions = [];
                this.mapSearchError = 'No se encontraron resultados en Chicago.';
                this.cdr.detectChanges();
              }
            },
            error: (err) => {
              this.isSearchingMap = false;
              this.mapSearchSuggestions = [];
              this.mapSearchError = 'Error al buscar en el mapa.';
              this.cdr.detectChanges();
            }
          });
        }
      },
      error: (err) => {
        console.error('Geocoding error:', err);
        this.isSearchingMap = false;
        this.mapSearchError = 'Error al buscar en el mapa.';
        this.cdr.detectChanges();
      }
    });
  }

  private setMapSuggestions(data: any[]) {
    this.mapSearchSuggestions = data.map((item: any) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon)
    }));
    this.cdr.detectChanges();
  }

  selectMapSuggestion(sug: any) {
    if (!this.map) return;
    const lat = sug.lat;
    const lng = sug.lon;
    
    // Fly smoothly to that street with high zoom
    this.map.flyTo([lat, lng], 17, { duration: 1.2 });
    
    const formattedAddr = sug.display_name.split(',')[0] + (sug.display_name.split(',')[1] ? ', ' + sug.display_name.split(',')[1] : '');
    this.selectedMapAddress = formattedAddr;
    this.mapSearchQuery = formattedAddr;
    this.mapSearchSuggestions = [];
    this.isPinningLocation = true;

    // Place or move marker
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: #06b6d4; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(6,182,212,0.9); animation: pulse 2s infinite;"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    }
    
    this.cdr.detectChanges();
  }

  confirmMapLocation() {
    const finalAddress = this.selectedMapAddress || this.mapSearchQuery;
    if (!finalAddress) return;

    if (this.mapContext === 'suspect') {
      this.currentSuspect.direccion = finalAddress;
    } else if (this.mapContext === 'gang') {
      this.currentGang.zona_operacion = finalAddress;
    } else if (this.mapContext === 'witness') {
      this.currentWitness.direccion = finalAddress;
    } else if (this.mapContext === 'victim') {
      this.currentVictim.direccion = finalAddress;
    } else {
      this.currentMissingPerson.ultima_ubicacion = finalAddress;
    }

    this.closeMapModal();
    this.cdr.detectChanges();
  }

  clearMapSearch() {
    this.mapSearchQuery = '';
    this.mapSearchSuggestions = [];
    this.mapSearchError = '';
  }

  private initMap() {
    const container = document.getElementById('modal-criminal-map') || document.getElementById('modal-missing-map');
    if (!container) return;

    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }

    this.map = L.map(container.id, {
      zoomControl: false,
      attributionControl: false
    }).setView([41.8781, -87.6298], 12);

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
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map!);
      }
      
      this.isPinningLocation = true;
      this.selectedMapAddress = 'Identificando dirección...';
      this.cdr.detectChanges();

      // Reverse geocoding
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&email=safecity.project@gmail.com`)
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {
            const road = data.address.road || data.address.pedestrian || data.address.suburb || '';
            const houseNumber = data.address.house_number || '';
            const neighbourhood = data.address.neighbourhood || data.address.city_district || '';
            
            let parts = [];
            if (road) parts.push(houseNumber ? `${houseNumber} ${road}` : road);
            if (neighbourhood) parts.push(neighbourhood);
            
            const addr = parts.length > 0 ? parts.join(', ') : (data.display_name ? data.display_name.split(',').slice(0, 2).join(',') : 'Ubicación en Chicago');
            this.selectedMapAddress = addr;
            this.mapSearchQuery = addr;
            this.cdr.detectChanges();
          } else {
            this.selectedMapAddress = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
            this.mapSearchQuery = this.selectedMapAddress;
            this.cdr.detectChanges();
          }
        })
        .catch(err => {
          console.error('Reverse geocode error:', err);
          this.selectedMapAddress = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
          this.mapSearchQuery = this.selectedMapAddress;
          this.cdr.detectChanges();
        });
    });
  }

  onMissingPhotoSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.isUploadingImage = true;
    this.dataService.uploadEvidenceImage(file).subscribe({
      next: (res) => {
        this.currentMissingPerson.fotografia = res.url;
        this.isUploadingImage = false;
        this.photoWarning = '';
      },
      error: (err) => {
        console.error('Error uploading missing person image:', err);
        alert('Error al subir la imagen: ' + (err.error?.error || err.message));
        this.isUploadingImage = false;
      }
    });
  }

  saveMissingPerson() {
    if (!this.currentMissingPerson.fotografia && !this.photoWarning) {
      this.photoWarning = 'Se recomienda adjuntar una fotografía para facilitar la búsqueda. ¿Desea guardar sin fotografía?';
      return;
    }

    this.isSavingMissingPerson = true;
    const payload = {
      case_number: this.currentMissingPerson.case_number,
      nombre_completo: this.currentMissingPerson.nombre_completo,
      edad: this.currentMissingPerson.edad,
      tiene_dependencia_medicamentos: this.currentMissingPerson.tiene_dependencia_medicamentos ? 1 : 0,
      fotografia: this.currentMissingPerson.fotografia,
      descripcion_fisica: this.currentMissingPerson.descripcion_fisica,
      vestimenta: this.currentMissingPerson.vestimenta,
      ultima_ubicacion: this.currentMissingPerson.ultima_ubicacion,
      datos_reportante: `${this.currentMissingPerson.reportante_nombre} | Tel: ${this.currentMissingPerson.reportante_telefono}`
    };

    const req = this.currentMissingPerson.id 
      ? this.dataService.updateMissingPerson(this.currentMissingPerson.id, payload)
      : this.dataService.createMissingPerson(payload);

    req.subscribe({
      next: (res) => {
        this.isSavingMissingPerson = false;
        this.closeMissingModal();
        this.loadMissingPersons();
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar persona desaparecida: ' + (err.error?.error || err.message));
        this.isSavingMissingPerson = false;
      }
    });
  }

  editMissingPerson(person: any) {
    let repName = '';
    let repTel = '';
    if (person.datos_reportante) {
      const parts = person.datos_reportante.split(' | Tel: ');
      repName = parts[0] || '';
      repTel = parts[1] || '';
    }
    
    this.currentMissingPerson = {
      id: person.id,
      case_number: person.case_number || '',
      nombre_completo: person.nombre_completo,
      edad: person.edad,
      tiene_dependencia_medicamentos: person.tiene_dependencia_medicamentos === 1,
      fotografia: person.fotografia || '',
      descripcion_fisica: person.descripcion_fisica,
      vestimenta: person.vestimenta,
      ultima_ubicacion: person.ultima_ubicacion,
      reportante_nombre: repName,
      reportante_telefono: repTel
    };
    this.photoWarning = '';
    this.showMissingModal = true;
  }

  confirmDeleteMissingPerson(person: any) {
    if (confirm(`¿Está seguro de que desea eliminar el registro de la persona desaparecida: ${person.nombre_completo}?`)) {
      this.dataService.deleteMissingPerson(person.id).subscribe({
        next: () => {
          this.loadMissingPersons();
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar el registro: ' + (err.error?.error || err.message));
        }
      });
    }
  }

  openUpdateStatusModal(person: any) {
    this.updatingPerson = {
      id: person.id,
      nombre_completo: person.nombre_completo,
      estado: person.estado
    };
    this.showUpdateStatusModal = true;
  }

  openDetailsModal(person: any) {
    this.viewingPerson = person;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    setTimeout(() => {
      this.viewingPerson = null;
    }, 300);
  }

  closeUpdateStatusModal() {
    this.showUpdateStatusModal = false;
  }

  updateMissingPersonStatus() {
    this.isUpdatingStatus = true;
    this.dataService.updateMissingPersonStatus(this.updatingPerson.id, this.updatingPerson.estado).subscribe({
      next: () => {
        this.isUpdatingStatus = false;
        this.closeUpdateStatusModal();
        this.loadMissingPersons();
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar el estado: ' + (err.error?.error || err.message));
        this.isUpdatingStatus = false;
      }
    });
  }
}

