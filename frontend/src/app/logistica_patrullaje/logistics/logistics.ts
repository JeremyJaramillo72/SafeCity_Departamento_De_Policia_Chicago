import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';
import { MaintenanceAIService, PredictiveVehicle } from '../../logistica_patrullaje/services/maintenance-ai.service';
import { HrAIService, IAOfficer } from '../../logistica_patrullaje/services/hr-ai.service';
import { CategoryService } from '../../administracion_seguridad/services/category.service';

import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar';
import * as L from 'leaflet';

@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent],
  templateUrl: './logistics.html',
})
export class LogisticsComponent implements OnInit, OnDestroy {
  showProfileDropdown = false;
  profile: string | null = 'oficial';
  isLoading = true;
  hasError = false;
  showKpis = true;

  kpis: any = {
    total_vehicles: 0,
    operational_vehicles: 0,
    total_officers: 0,
    total_equipment: 0,
    operational_equipment: 0
  };

  activePatrols: any[] = [];
  
  // Tabs State
  activeTab: 'vehicles' | 'officers' | 'patrols' | 'maintenance' = 'vehicles';

  // Preventive Maintenance (OT8) State
  preventiveMaintenanceList: any[] = [];
  maintenanceKpis: any = {
    total_vehicles: 0,
    overdue_count: 0,
    due_soon_count: 0,
    up_to_date_count: 0,
    in_maintenance_count: 0,
    avg_mileage: 0
  };
  maintenanceFilterStatus: string = 'ALL';
  maintenanceSearchQuery: string = '';
  showMaintenanceModal: boolean = false;
  isPredictiveMode: boolean = false;
  isPredicting: boolean = false;
  predictiveVehicles: PredictiveVehicle[] = [];
  selectedAIVehicle: PredictiveVehicle | null = null;
  showAIModal: boolean = false;
  
  isSubmittingMaintenance: boolean = false;
  currentMaintenanceForm: any = {
    id_vehiculo: null,
    placa_vehiculo: '',
    kilometraje_actual: 0,
    notas: '',
    reportado_por: 'Fleet Manager'
  };

  // Quadrant Shift Planning (OT15) State
  selectedQuadrantFilter: string = 'ALL';
  todayShiftStatusFilter: string = 'ALL';
  patrolSearchQuery: string = '';
  quadrantKpis: any = {
    total_shifts_today: 0,
    covered_quadrants_count: 0,
    unassigned_quadrants_count: 0,
    unassigned_quadrants_list: []
  };
  availableQuadrantsList: string[] = ['BEAT-101', 'BEAT-102', 'BEAT-103', 'BEAT-104', 'BEAT-105', 'BEAT-201', 'BEAT-202'];
  todayQuadrantShifts: any[] = [];




  // Vehicles CRUD State
  vehicles: any[] = [];
  sortField = '';
  sortAscending = true;
  showVehicleModal = false;
  isEditingVehicle = false;
  currentVehicle: any = {
    codigo_beat: '',
    placa_vehiculo: '',
    tipo_vehiculo: 'SUV Patrol',
    estado_mantenimiento: 'operativo'
  };
  isSavingVehicle = false;

  // Officers CRUD State
  officers: any[] = [];
  sortFieldOfficer = '';
  sortAscendingOfficer = true;
  showOfficerModal = false;
  isEditingOfficer = false;
  isBurnoutPredictiveMode = false;
  isPredictingBurnout = false;
  burnoutPredictions: IAOfficer[] = [];
  showBurnoutModal = false;
  selectedAIOfficer: IAOfficer | null = null;
  
  currentOfficer: any = {
    placa_policial: '',
    nombres: '',
    apellidos: '',
    correo_electronico: '',
    telefono_contacto: '',
    fecha_ingreso: '',
    id_rol: 2,
    url_fotografia: '/assets/avatars/default.jpg'
  };
  isSavingOfficer = false;

  // Patrol Shifts CRUD State
  patrolShifts: any[] = [];
  globalSearchQuery: string = '';
  showShiftModal = false;
  showLiveMapModal = false;
  isEditingShift = false;
  currentShift: any = {
    id_oficial: 0,
    oficiales_adicionales: [],
    id_vehiculo: 0,
    fecha_turno: '',
    hora_inicio: '08:00',
    hora_fin: '16:00',
    ruta_coordenadas: '[]'
  };
  isSavingShift = false;

  // Additional Officers Dropdown State
  officerSearchQuery: string = '';
  showOfficerDropdown: boolean = false;

  // Lead Officer Dropdown State
  leadOfficerSearchQuery: string = '';
  showLeadOfficerDropdown: boolean = false;

  isOfficerOnDutyToday(officerId: number): boolean {
    const today = new Date().toISOString().split('T')[0];
    const todaysAllShifts = this.patrolShifts.filter(s => s.fecha_turno === today);
    return todaysAllShifts.some(s => {
      // Exclude the current shift if we are editing it, so we can keep the selected officer
      if (this.isEditingShift && s.id_turno === this.currentShift.id_turno) return false;
      if (s.id_oficial === officerId) return true;
      if (s.oficiales_adicionales && s.oficiales_adicionales.includes(officerId)) return true;
      return false;
    });
  }

  getFilteredOfficers() {
    if (!this.officers) return [];
    const q = (this.officerSearchQuery || '').toLowerCase().trim();
    return this.officers.filter(o => {
      if (o.id_rol === 4 || o.id_rol === 6) return false;
      if (this.currentShift.id_oficial === o.id_oficial) return false;
      if (this.currentShift.oficiales_adicionales?.includes(o.id_oficial)) return false;
      if (this.isOfficerOnDutyToday(o.id_oficial)) return false;
      if (!q) return true;
      const n = (o.nombres || '').toLowerCase();
      const a = (o.apellidos || '').toLowerCase();
      const p = (o.placa_policial || '').toLowerCase();
      return n.includes(q) || a.includes(q) || p.includes(q);
    });
  }

  selectOfficer(officer: any) {
    if (!this.currentShift.oficiales_adicionales) {
      this.currentShift.oficiales_adicionales = [];
    }
    this.currentShift.oficiales_adicionales.push(officer.id_oficial);
    this.officerSearchQuery = '';
    this.showOfficerDropdown = false;
  }

  hideOfficerDropdown() {
    setTimeout(() => {
      this.showOfficerDropdown = false;
    }, 200);
  }

  getFilteredLeadOfficers() {
    if (!this.officers) return [];
    const q = (this.leadOfficerSearchQuery || '').toLowerCase().trim();
    return this.officers.filter(o => {
      if (o.id_rol === 4 || o.id_rol === 6) return false;
      if (this.currentShift.oficiales_adicionales?.includes(o.id_oficial)) return false;
      if (this.isOfficerOnDutyToday(o.id_oficial)) return false;
      if (!q) return true;
      const n = (o.nombres || '').toLowerCase();
      const a = (o.apellidos || '').toLowerCase();
      const p = (o.placa_policial || '').toLowerCase();
      return n.includes(q) || a.includes(q) || p.includes(q);
    });
  }

  selectLeadOfficer(officer: any) {
    this.currentShift.id_oficial = officer.id_oficial;
    this.showLeadOfficerDropdown = false;
    this.leadOfficerSearchQuery = '';
  }

  hideLeadOfficerDropdown() {
    setTimeout(() => {
      this.showLeadOfficerDropdown = false;
    }, 200);
  }

  removeLeadOfficer() {
    this.currentShift.id_oficial = 0;
  }

  removeOfficer(officerId: number) {
    if (this.currentShift.oficiales_adicionales) {
      this.currentShift.oficiales_adicionales = this.currentShift.oficiales_adicionales.filter((id: number) => id !== officerId);
    }
  }

  getOfficerName(officerId: number): string {
    const off = this.officers.find(o => o.id_oficial === officerId);
    if (!off) return 'Desconocido';
    const n = off.nombres.charAt(0).toUpperCase() + off.nombres.slice(1).toLowerCase();
    const a = off.apellidos.charAt(0).toUpperCase() + off.apellidos.slice(1).toLowerCase();
    return `Ofc. ${n} ${a}`;
  }

  // Leaflet Map State
  private map: L.Map | undefined;
  private routePolyline: L.Polyline | undefined;
  private previewPolyline: L.Polyline | undefined;
  private drawMarkers: L.Layer[] = [];
  private shiftMarkers: L.Layer[] = [];
  selectedShiftId: number | null = null;
  drawingMode = false;
  drawnCoordinates: [number, number][] = [];

  // Map Simulation Loop & Stations
  private policeStations: [number, number][] = [
    [41.8586, -87.6272], // Central
    [41.9032, -87.6432], // Near North
    [41.7796, -87.6534]  // Englewood
  ];
  private simulationInterval: any;
  patrolSimulations: {
    marker: L.Marker,
    shift: any,
    coords: [number, number][],
    color: string,
    isReturning?: boolean,
    returnTarget?: [number, number],
    returnPolyline?: L.Polyline,
    polyline?: L.Polyline,
    routeIndex?: number
  }[] = [];

  // Decommission State (Baja)
  showBajaModal = false;
  motivoBaja = '';
  isSubmittingBaja = false;
  selectedVehicle: any = null;

  vehicleTypes: string[] = ['SUV Patrol', 'Sedan', 'Transport Van', 'K9 Unit', 'Armored'];

  constructor(
    public authService: AuthService, 
    private dataService: LogisticsService,
    private aiService: MaintenanceAIService,
    private hrAiService: HrAIService,
    private router: Router,
    private categoryService: CategoryService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  fleetTrend: any = {
    current_fleet_size: 17,
    monthly_trend: []
  };

  ngOnInit() {
    this.categoryService.getCategories('vehicle_type', false).subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          this.vehicleTypes = cats.map(c => c.valor);
        }
      },
      error: (err) => console.error('Failed to load vehicle types:', err)
    });

    this.loadLogistics();
    this.loadVehicles();
    this.loadOfficers();
    this.loadPatrolShifts();
    this.loadPreventiveMaintenance();
    this.loadTodayQuadrantShifts();
    this.loadFleetTrend();
    this.loadBurnoutPredictions();
  }

  get officersOnDutyTodayCount(): number {
    if (!this.officers || this.officers.length === 0) return 0;
    const today = new Date().toISOString().split('T')[0];
    const activeShiftOfficerIds = new Set<number>();
    if (this.patrolShifts && this.patrolShifts.length > 0) {
      this.patrolShifts.filter(s => s.fecha_turno === today).forEach(s => {
        if (s.id_oficial) activeShiftOfficerIds.add(Number(s.id_oficial));
        if (s.oficiales_adicionales && Array.isArray(s.oficiales_adicionales)) {
          s.oficiales_adicionales.forEach((id: number) => activeShiftOfficerIds.add(Number(id)));
        }
      });
    }
    if (this.todayQuadrantShifts && this.todayQuadrantShifts.length > 0) {
      this.todayQuadrantShifts.forEach(s => {
        if (s.id_oficial) activeShiftOfficerIds.add(Number(s.id_oficial));
      });
    }
    const count = activeShiftOfficerIds.size > 0 ? activeShiftOfficerIds.size : (this.activePatrols?.length || 0);
    return Math.min(count, this.kpis.total_officers || this.officers.length);
  }

  getOfficersOnDutyPercentage(): number {
    const total = this.kpis.total_officers || this.officers?.length || 1;
    return Math.round((this.officersOnDutyTodayCount / total) * 100);
  }

  get highBurnoutRiskCount(): number {
    if (!this.burnoutPredictions || this.burnoutPredictions.length === 0) return 0;
    return this.burnoutPredictions.filter(o => (o.ia_prediction?.probabilidad_burnout || 0) >= 60).length;
  }

  get criticalBurnoutRiskCount(): number {
    if (!this.burnoutPredictions || this.burnoutPredictions.length === 0) return 0;
    return this.burnoutPredictions.filter(o => o.ia_prediction?.nivel_estres === 'CRITICAL').length;
  }

  get warningBurnoutRiskCount(): number {
    if (!this.burnoutPredictions || this.burnoutPredictions.length === 0) return 0;
    return this.burnoutPredictions.filter(o => o.ia_prediction?.nivel_estres === 'WARNING').length;
  }

  get optimalBurnoutCount(): number {
    if (!this.burnoutPredictions || this.burnoutPredictions.length === 0) return 0;
    return this.burnoutPredictions.filter(o => o.ia_prediction?.nivel_estres === 'OPTIMAL').length;
  }

  get totalBurnoutAlertsCount(): number {
    return this.criticalBurnoutRiskCount + this.warningBurnoutRiskCount;
  }

  get optimalReadinessOfficersCount(): number {
    const total = this.kpis.total_officers || this.officers?.length || 0;
    if (total === 0) return 0;
    return Math.max(0, total - this.highBurnoutRiskCount);
  }

  getOfficerBurnoutPrediction(officerId: number): IAOfficer | undefined {
    if (!this.burnoutPredictions || this.burnoutPredictions.length === 0) return undefined;
    return this.burnoutPredictions.find(p => p.id_oficial === officerId);
  }

  loadFleetTrend() {
    this.dataService.getFleetAvailabilityTrend().subscribe({
      next: (data: any) => {
        if (data) {
          this.fleetTrend = data;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => console.error('Error loading fleet trend:', err)
    });
  }

  ngOnDestroy() {
    this.destroyMap();
  }

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  // Tab switcher
  setActiveTab(tab: 'vehicles' | 'officers' | 'patrols' | 'maintenance') {
    this.activeTab = tab;
    // Detener mapas y simulaciones al cambiar de tab principal
    if (tab !== 'patrols') {
      this.stopSimulationLoop();
      this.destroyMap();
      this.showShiftModal = false;
      this.showLiveMapModal = false;
    }
    if (tab === 'maintenance') {
      this.loadPreventiveMaintenance();
      this.loadFleetTrend();
    }
    if (tab === 'patrols') {
      this.loadTodayQuadrantShifts();
    }
  }

  loadTodayQuadrantShifts() {
    this.dataService.getTodayQuadrantShifts(this.selectedQuadrantFilter, this.todayShiftStatusFilter, this.patrolSearchQuery).subscribe({
      next: (data) => {
        if (data.kpis) this.quadrantKpis = data.kpis;
        if (data.available_quadrants) this.availableQuadrantsList = data.available_quadrants;
        if (data.shifts && data.shifts.length > 0) {
          this.todayQuadrantShifts = data.shifts;
        } else if (this.patrolShifts && this.patrolShifts.length > 0) {
          this.todayQuadrantShifts = this.patrolShifts;
        }
      },
      error: (err) => {
        console.error('Error loading today quadrant shifts:', err);
        if (this.patrolShifts && this.patrolShifts.length > 0) {
          this.todayQuadrantShifts = this.patrolShifts;
        }
      }
    });
  }

  get dynamicQuadrantsList(): string[] {
    const set = new Set<string>();
    if (this.patrolShifts) {
      this.patrolShifts.forEach(s => {
        const b = s.beat || s.codigo_beat;
        if (b) set.add(b);
      });
    }
    if (this.vehicles) {
      this.vehicles.forEach(v => {
        if (v.codigo_beat) set.add(v.codigo_beat);
      });
    }
    if (set.size === 0) return ['B-101', 'B-102', 'B-103', 'B-104', 'B-105', 'B-201', 'B-202', 'B-203'];
    return Array.from(set).sort();
  }

  getShiftStatus(shift: any): string {
    if (shift?.shift_status) return shift.shift_status;
    if (shift?.estado_turno) {
      const s = shift.estado_turno.toLowerCase();
      if (s === 'activo' || s === 'active' || s === 'en_curso') return 'ACTIVE';
      if (s === 'completado' || s === 'completed' || s === 'finalizado') return 'COMPLETED';
      if (s === 'programado' || s === 'scheduled') return 'SCHEDULED';
      return shift.estado_turno.toUpperCase();
    }
    const today = new Date().toISOString().split('T')[0];
    if (shift?.fecha_turno === today) {
      return 'ACTIVE';
    }
    return 'SCHEDULED';
  }

  get displayQuadrantShifts(): any[] {
    let list = (this.todayQuadrantShifts && this.todayQuadrantShifts.length > 0)
      ? this.todayQuadrantShifts
      : (this.patrolShifts || []);

    if (this.selectedQuadrantFilter && this.selectedQuadrantFilter !== 'ALL') {
      list = list.filter(s => (s.beat === this.selectedQuadrantFilter || s.codigo_beat === this.selectedQuadrantFilter));
    }

    const search = (this.globalSearchQuery || this.patrolSearchQuery || '').toLowerCase().trim();
    if (!search) return list;
    return list.filter(s => {
      const officer = (s.officer_name || '').toLowerCase();
      const plate = (s.vehicle_plate || '').toLowerCase();
      const beat = (s.codigo_beat || s.beat || '').toLowerCase();
      const status = this.getShiftStatus(s).toLowerCase();
      const schedule = `${s.hora_inicio || ''} ${s.hora_fin || ''} ${s.fecha_turno || ''}`.toLowerCase();
      return officer.includes(search) || plate.includes(search) || beat.includes(search) || status.includes(search) || schedule.includes(search);
    });
  }

  onQuadrantFilterChange(quadrant: string) {
    this.selectedQuadrantFilter = quadrant;
    this.loadTodayQuadrantShifts();
  }

  onTodayShiftStatusFilterChange(status: string) {
    this.todayShiftStatusFilter = status;
    this.loadTodayQuadrantShifts();
  }

  getShiftStatusBadgeClass(status: string): string {
    const s = (status || 'ACTIVE').toUpperCase();
    switch (s) {
      case 'ACTIVE':
        return 'bg-secondary-container text-on-secondary-container border border-secondary/20 font-bold';
      case 'UPCOMING':
        return 'bg-tertiary-container text-on-tertiary-container border border-tertiary/20 font-bold';
      case 'COMPLETED':
        return 'bg-surface-container-highest text-on-surface-variant border border-outline/20 font-bold';
      case 'SCHEDULED':
      default:
        return 'bg-primary-container text-on-primary-container border border-primary/20 font-bold';
    }
  }

  getShiftStatusDotClass(status: string): string {
    const s = (status || 'ACTIVE').toUpperCase();
    switch (s) {
      case 'ACTIVE':
        return 'bg-secondary animate-pulse';
      case 'UPCOMING':
        return 'bg-tertiary';
      case 'COMPLETED':
        return 'bg-outline';
      case 'SCHEDULED':
      default:
        return 'bg-primary';
    }
  }



  loadPreventiveMaintenance() {
    this.dataService.getPreventiveMaintenance(this.maintenanceSearchQuery, this.maintenanceFilterStatus).subscribe({
      next: (data) => {
        if (data.kpis) this.maintenanceKpis = data.kpis;
        if (data.vehicles) this.preventiveMaintenanceList = data.vehicles;
      },
      error: (err) => {
        console.error('Error loading preventive maintenance:', err);
      }
    });
  }

  get filteredPreventiveMaintenanceList(): any[] {
    if (!this.preventiveMaintenanceList) return [];
    const search = (this.globalSearchQuery || this.maintenanceSearchQuery || '').toLowerCase().trim();
    if (!search) return this.preventiveMaintenanceList;
    return this.preventiveMaintenanceList.filter(v => {
      const plate = (v.placa_vehiculo || '').toLowerCase();
      const type = (v.tipo_vehiculo || '').toLowerCase();
      const beat = (v.codigo_beat || '').toLowerCase();
      const status = (v.estado_preventivo || '').toLowerCase();
      const mileage = (v.kilometraje_actual || '').toString();
      return plate.includes(search) || type.includes(search) || beat.includes(search) || status.includes(search) || mileage.includes(search);
    });
  }

  get filteredPredictiveVehicles(): PredictiveVehicle[] {
    if (!this.predictiveVehicles) return [];
    if (!this.globalSearchQuery?.trim()) return this.predictiveVehicles;
    const q = this.globalSearchQuery.toLowerCase().trim();
    return this.predictiveVehicles.filter(v => {
      const plate = (v.placa || '').toLowerCase();
      const type = (v.tipo || '').toLowerCase();
      const risk = (v.ia_prediction?.nivel_riesgo || '').toLowerCase();
      return plate.includes(q) || type.includes(q) || risk.includes(q);
    });
  }

  setMaintenanceFilter(status: string) {
    this.maintenanceFilterStatus = status;
    this.loadPreventiveMaintenance();
  }

  togglePredictiveMode() {
    this.isPredictiveMode = !this.isPredictiveMode;
    if (this.isPredictiveMode && this.predictiveVehicles.length === 0) {
      this.loadPredictiveMaintenance();
    }
  }

  loadPredictiveMaintenance() {
    this.isPredicting = true;
    this.aiService.getPredictiveMaintenance().subscribe({
      next: (data) => {
        if (data && data.fleet_predictions) {
          this.predictiveVehicles = data.fleet_predictions;
        }
        this.isPredicting = false;
      },
      error: (err) => {
        console.error('Error loading AI predictive maintenance:', err);
        this.isPredicting = false;
      }
    });
  }

  openAIModal(vehicle: PredictiveVehicle) {
    this.selectedAIVehicle = vehicle;
    this.showAIModal = true;
  }
  
  closeAIModal() {
    this.showAIModal = false;
    this.selectedAIVehicle = null;
  }

  openMaintenanceModal(vehicle: any) {
    this.currentMaintenanceForm = {
      id_vehiculo: vehicle.id_vehiculo,
      placa_vehiculo: vehicle.placa_vehiculo,
      kilometraje_actual: vehicle.kilometraje_actual || 0,
      notas: '',
      reportado_por: 'Fleet Manager'
    };
    this.showMaintenanceModal = true;
  }

  closeMaintenanceModal() {
    this.showMaintenanceModal = false;
  }

  submitMaintenanceInspection() {
    if (!this.currentMaintenanceForm.id_vehiculo) return;
    this.isSubmittingMaintenance = true;
    this.dataService.logPreventiveMaintenance(this.currentMaintenanceForm).subscribe({
      next: (res) => {
        this.isSubmittingMaintenance = false;
        this.closeMaintenanceModal();
        this.loadPreventiveMaintenance();
        this.loadVehicles();
        this.loadLogistics();
      },
      error: (err) => {
        console.error('Error logging preventive maintenance:', err);
        this.isSubmittingMaintenance = false;
      }
    });
  }

  getMaintenanceBadgeClass(status: string): string {
    switch (status) {
      case 'OVERDUE':
        return 'bg-error-container text-on-error-container border border-error/20 font-bold';
      case 'DUE_SOON':
        return 'bg-tertiary-container text-on-tertiary-container border border-tertiary/20 font-bold';
      case 'IN_MAINTENANCE':
        return 'bg-surface-container-highest text-on-surface-variant border border-outline/20 font-bold';
      case 'UP_TO_DATE':
      default:
        return 'bg-secondary-container text-on-secondary-container border border-secondary/20 font-bold';
    }
  }

  getMaintenanceBadgeDotClass(status: string): string {
    switch (status) {
      case 'OVERDUE':
        return 'bg-error animate-pulse';
      case 'DUE_SOON':
        return 'bg-tertiary';
      case 'IN_MAINTENANCE':
        return 'bg-outline';
      case 'UP_TO_DATE':
      default:
        return 'bg-secondary';
    }
  }


  loadLogistics() {
    this.isLoading = true;
    this.hasError = false;
    
    this.dataService.getLogisticsDashboard().subscribe({
      next: (data) => {
        if (data.kpis) this.kpis = data.kpis;
        if (data.active_patrols) this.activePatrols = data.active_patrols;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading logistics:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  getAvailableVehicles() {
    if (!this.vehicles) return [];
    
    const fecha = this.currentShift.fecha_turno;
    const hInicio = this.currentShift.hora_inicio;
    const hFin = this.currentShift.hora_fin;
    
    if (!fecha || !hInicio || !hFin) return this.vehicles;
    
    return this.vehicles.map(v => {
      let isBusy = false;
      if (v.status === 'In Repair') {
          isBusy = true;
      } else {
          isBusy = this.patrolShifts.some(shift => {
            if (shift.id_turno === this.currentShift.id_turno) return false; // editing same shift
            if (shift.id_vehiculo !== v.id_vehiculo) return false;
            
            if (shift.fecha_turno === fecha) {
              if (shift.hora_inicio < hFin && shift.hora_fin > hInicio) {
                return true;
              }
            }
            return false;
          });
      }
      
      return {
        ...v,
        disabled: isBusy
      };
    });
  }

  // ==========================================
  // DECOMMISSION VEHICLE METHODS
  // ==========================================
  loadVehicles() {
    this.dataService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        if (this.vehicles && this.vehicles.length > 0) {
          const op = this.vehicles.filter(v => {
            const s = (v.estado_mantenimiento || v.status || '').toLowerCase();
            return s === 'operativo' || s === 'operational';
          }).length;
          this.kpis.total_vehicles = this.vehicles.length;
          this.kpis.operational_vehicles = op;
        }
        this.applyVehicleSort();
      },
      error: (err) => console.error('Error loading vehicles:', err)
    });
  }

  sortVehicles(field: string) {
    if (this.sortField === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortField = field;
      this.sortAscending = true;
    }
    this.applyVehicleSort();
  }

  applyVehicleSort() {
    if (!this.sortField) return;
    const field = this.sortField;
    const direction = this.sortAscending ? 1 : -1;
    this.vehicles.sort((a, b) => {
      const valA = (a[field] || '').toString().toLowerCase();
      const valB = (b[field] || '').toString().toLowerCase();
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  get filteredVehicles(): any[] {
    if (!this.vehicles) return [];
    if (!this.globalSearchQuery?.trim()) return this.vehicles;
    const q = this.globalSearchQuery.toLowerCase().trim();
    return this.vehicles.filter(v => {
      const plate = (v.placa_vehiculo || '').toLowerCase();
      const type = (v.tipo_vehiculo || '').toLowerCase();
      const beat = (v.codigo_beat || '').toLowerCase();
      const status = (this.getVehicleStatusLabel(v.estado_mantenimiento) || v.estado_mantenimiento || '').toLowerCase();
      return plate.includes(q) || type.includes(q) || beat.includes(q) || status.includes(q);
    });
  }

  openCreateVehicleModal() {
    this.isEditingVehicle = false;
    this.currentVehicle = {
      codigo_beat: '',
      placa_vehiculo: '',
      tipo_vehiculo: 'SUV Patrol',
      estado_mantenimiento: 'operativo'
    };
    this.showVehicleModal = true;
  }

  openEditVehicleModal(vehicle: any) {
    this.isEditingVehicle = true;
    this.currentVehicle = { ...vehicle };
    this.showVehicleModal = true;
  }

  closeVehicleModal() {
    this.showVehicleModal = false;
  }

  saveVehicle() {
    this.isSavingVehicle = true;
    if (this.isEditingVehicle) {
      this.dataService.updateVehicle(this.currentVehicle.id_vehiculo, this.currentVehicle).subscribe({
        next: () => {
          this.isSavingVehicle = false;
          this.closeVehicleModal();
          this.loadVehicles();
          this.loadLogistics();
        },
        error: (err) => {
          console.error(err);
          this.isSavingVehicle = false;
        }
      });
    } else {
      this.dataService.createVehicle(this.currentVehicle).subscribe({
        next: () => {
          this.isSavingVehicle = false;
          this.closeVehicleModal();
          this.loadVehicles();
          this.loadLogistics();
        },
        error: (err) => {
          console.error(err);
          this.isSavingVehicle = false;
        }
      });
    }
  }

  deleteVehicle(vehicleOrId: any, event: Event) {
    event.stopPropagation();
    let veh = vehicleOrId;
    if (typeof vehicleOrId === 'number' || typeof vehicleOrId === 'string') {
      veh = this.vehicles.find(v => v.id_vehiculo == vehicleOrId || v.placa_vehiculo === vehicleOrId || v.id == vehicleOrId);
    }
    if (veh) {
      this.openBajaModal(veh);
    }
  }

  openBajaModal(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.motivoBaja = '';
    this.showBajaModal = true;
  }

  closeBajaModal() {
    this.showBajaModal = false;
    this.selectedVehicle = null;
    this.motivoBaja = '';
  }

  submitBaja() {
    if (!this.selectedVehicle) return;
    this.isSubmittingBaja = true;
    const targetId = this.selectedVehicle.id_vehiculo || this.selectedVehicle.placa_vehiculo || this.selectedVehicle.id;
    const payload = { motivo: this.motivoBaja, comentarios: 'Dado de baja desde consola logística' };
    
    this.dataService.decommissionVehicle(targetId, payload).subscribe({
      next: () => {
        this.loadVehicles();
        this.loadLogistics();
        this.isSubmittingBaja = false;
        this.closeBajaModal();
      },
      error: (err) => {
        console.error('Error decommissioning vehicle:', err);
        alert(err.error?.error || 'No se pudo dar de baja el vehículo. Verifique si tiene tickets de mantenimiento abiertos.');
        this.isSubmittingBaja = false;
      }
    });
  }

  // ==========================================
  // OFFICERS CRUD METHODS
  // ==========================================
  loadOfficers() {
    this.dataService.getOfficers().subscribe({
      next: (data) => {
        this.officers = data;
        this.applyOfficerSort();
      },
      error: (err) => console.error('Error loading officers:', err)
    });
  }

  sortOfficers(field: string) {
    if (this.sortFieldOfficer === field) {
      this.sortAscendingOfficer = !this.sortAscendingOfficer;
    } else {
      this.sortFieldOfficer = field;
      this.sortAscendingOfficer = true;
    }
    this.applyOfficerSort();
  }

  applyOfficerSort() {
    if (!this.sortFieldOfficer) return;
    const field = this.sortFieldOfficer;
    const direction = this.sortAscendingOfficer ? 1 : -1;
    this.officers.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'nombres') {
        valA = `${a.nombres} ${a.apellidos}`;
        valB = `${b.nombres} ${b.apellidos}`;
      }
      valA = (valA || '').toString().toLowerCase();
      valB = (valB || '').toString().toLowerCase();
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  get filteredOfficerRoster(): any[] {
    if (!this.officers) return [];
    if (!this.globalSearchQuery?.trim()) return this.officers;
    const q = this.globalSearchQuery.toLowerCase().trim();
    return this.officers.filter(o => {
      const name = `${o.nombres || ''} ${o.apellidos || ''}`.toLowerCase();
      const badge = (o.placa_policial || '').toLowerCase();
      const email = (o.correo_electronico || '').toLowerCase();
      const phone = (o.telefono_contacto || '').toLowerCase();
      const role = (o.id_rol === 1 ? 'comandante commander' : 'patrullero patrol officer').toLowerCase();
      return name.includes(q) || badge.includes(q) || email.includes(q) || phone.includes(q) || role.includes(q);
    });
  }

  get filteredBurnoutPredictions(): IAOfficer[] {
    if (!this.burnoutPredictions) return [];
    if (!this.globalSearchQuery?.trim()) return this.burnoutPredictions;
    const q = this.globalSearchQuery.toLowerCase().trim();
    return this.burnoutPredictions.filter(o => {
      const name = (o.nombre_completo || '').toLowerCase();
      const badge = (o.placa_policial || '').toLowerCase();
      const stress = (o.ia_prediction?.nivel_estres || '').toLowerCase();
      return name.includes(q) || badge.includes(q) || stress.includes(q);
    });
  }

  openCreateOfficerModal() {
    this.isEditingOfficer = false;
    this.currentOfficer = {
      placa_policial: '',
      nombres: '',
      apellidos: '',
      correo_electronico: '',
      telefono_contacto: '',
      fecha_ingreso: new Date().toISOString().split('T')[0],
      id_rol: 2,
      url_fotografia: '/assets/avatars/default.jpg'
    };
    this.showOfficerModal = true;
  }

  openEditOfficerModal(officer: any) {
    this.isEditingOfficer = true;
    this.currentOfficer = { ...officer };
    this.showOfficerModal = true;
  }

  closeOfficerModal() {
    this.showOfficerModal = false;
  }

  saveOfficer() {
    this.isSavingOfficer = true;
    if (this.isEditingOfficer) {
      this.dataService.updateOfficer(this.currentOfficer.id_oficial, this.currentOfficer).subscribe({
        next: () => {
          this.isSavingOfficer = false;
          this.closeOfficerModal();
          this.loadOfficers();
          this.loadLogistics();
        },
        error: (err) => {
          console.error(err);
          this.isSavingOfficer = false;
        }
      });
    } else {
      this.dataService.createOfficer(this.currentOfficer).subscribe({
        next: () => {
          this.isSavingOfficer = false;
          this.closeOfficerModal();
          this.loadOfficers();
          this.loadLogistics();
        },
        error: (err) => {
          console.error(err);
          this.isSavingOfficer = false;
        }
      });
    }
  }

  deleteOfficer(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar este oficial del sistema?')) {
      this.dataService.deleteOfficer(id).subscribe({
        next: () => {
          this.loadOfficers();
          this.loadLogistics();
        },
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // HR AI BURNOUT PREDICTION (OE4)
  // ==========================================
  toggleBurnoutPredictiveMode() {
    this.isBurnoutPredictiveMode = !this.isBurnoutPredictiveMode;
    if (this.isBurnoutPredictiveMode) {
      this.loadBurnoutPredictions();
    }
  }

  loadBurnoutPredictions() {
    this.isPredictingBurnout = true;
    this.hrAiService.getPredictBurnout().subscribe({
      next: (res) => {
        // Simulate a tiny delay for effect
        setTimeout(() => {
          this.burnoutPredictions = res.burnout_predictions;
          this.isPredictingBurnout = false;
          this.cdr.detectChanges();
        }, 1200);
      },
      error: (err) => {
        console.error('Error fetching burnout predictions:', err);
        this.isPredictingBurnout = false;
        this.cdr.detectChanges();
      }
    });
  }

  openBurnoutModal(officer: IAOfficer) {
    this.selectedAIOfficer = officer;
    this.showBurnoutModal = true;
  }

  closeBurnoutModal() {
    this.showBurnoutModal = false;
    this.selectedAIOfficer = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 128; // Perfect thumbnail sizing for police roster avatars
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
            // Compress to JPEG with 0.7 quality to yield extremely lightweight Base64 string (<10KB)
            this.currentOfficer.url_fotografia = canvas.toDataURL('image/jpeg', 0.7);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // ==========================================
  // PATROL SHIFTS CRUD METHODS
  // ==========================================
  loadPatrolShifts() {
    this.dataService.getPatrolShifts().subscribe({
      next: (data) => {
        this.patrolShifts = data;
        this.drawAllActiveShiftsOnMap();
      },
      error: (err) => console.error('Error loading shifts:', err)
    });
  }

  openCreateShiftModal() {
    this.isEditingShift = false;
    this.currentShift = {
      id_oficial: 0,
      oficiales_adicionales: [],
      id_vehiculo: 0,
      fecha_turno: new Date().toISOString().split('T')[0],
      hora_inicio: '08:00',
      hora_fin: '16:00',
      ruta_coordenadas: '[]'
    };
    this.drawnCoordinates = [];
    this.drawingMode = false;
    this.showShiftModal = true;
    
    this.selectedShiftId = null;
    if (this.previewPolyline && this.map) {
      this.map.removeLayer(this.previewPolyline);
      this.previewPolyline = undefined;
    }

    setTimeout(() => {
        this.initMap('shift-drawing-map');
        this.startRouteDrawing();
    }, 200);
  }

  openEditShiftModal(shift: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isEditingShift = true;
    this.currentShift = { ...shift };
    if (!this.currentShift.oficiales_adicionales) {
      this.currentShift.oficiales_adicionales = [];
    }
    
    try {
      this.drawnCoordinates = JSON.parse(this.currentShift.ruta_coordenadas || '[]');
    } catch (e) {
      this.drawnCoordinates = [];
    }
    
    this.drawingMode = false;
    this.showShiftModal = true;
    
    this.selectedShiftId = null;
    if (this.previewPolyline && this.map) {
      this.map.removeLayer(this.previewPolyline);
      this.previewPolyline = undefined;
    }

    setTimeout(() => {
        this.initMap('shift-drawing-map');
        this.startRouteDrawing();
        // Redraw existing route
        if (this.drawnCoordinates.length > 0) {
            this.routePolyline = L.polyline(this.drawnCoordinates, {
                color: '#dc2626', weight: 4, dashArray: '5, 8', opacity: 0.8
            }).addTo(this.map!);
            this.map!.fitBounds(this.routePolyline.getBounds(), { padding: [50, 50] });
        }
    }, 200);
  }

  closeShiftModal() {
    this.showShiftModal = false;
    this.stopRouteDrawing();
    this.destroyMap();
    this.loadPatrolShifts(); // Refresh
  }

  openLiveMapModal() {
    this.showLiveMapModal = true;
    setTimeout(() => {
      this.initMap('live-patrol-map');
    }, 200);
  }

  closeLiveMapModal() {
    this.showLiveMapModal = false;
    this.destroyMap();
  }    

  get filteredPatrolShifts() {
    if (!this.patrolShifts) return [];
    if (!this.globalSearchQuery.trim()) return this.patrolShifts;
    const q = this.globalSearchQuery.toLowerCase().trim();
    return this.patrolShifts.filter(s => {
        const officerName = (s.officer_name || '').toLowerCase();
        const vehiclePlate = (s.vehicle_plate || '').toLowerCase();
        const vehicleBeat = (s.vehicle_beat || '').toLowerCase();
        return officerName.includes(q) || vehiclePlate.includes(q) || vehicleBeat.includes(q);
    });
  }

  get todayShifts() {
      const today = new Date().toISOString().split('T')[0];
      return this.filteredPatrolShifts.filter(s => s.fecha_turno === today);
  }

  get pastShifts() {
      const today = new Date().toISOString().split('T')[0];
      return this.filteredPatrolShifts.filter(s => s.fecha_turno !== today);
  }

  saveShift() {
    this.isSavingShift = true;
    this.currentShift.ruta_coordenadas = JSON.stringify(this.drawnCoordinates);

    if (this.isEditingShift) {
      this.dataService.updatePatrolShift(this.currentShift.id_turno, this.currentShift).subscribe({
        next: () => {
          this.isSavingShift = false;
          this.closeShiftModal();
          this.loadPatrolShifts();
          this.loadTodayQuadrantShifts();
          this.loadLogistics();
        },
        error: (err) => {
          console.error(err);
          this.isSavingShift = false;
        }
      });
    } else {
      this.dataService.createPatrolShift(this.currentShift).subscribe({
        next: () => {
          this.isSavingShift = false;
          this.closeShiftModal();
          this.loadPatrolShifts();
          this.loadTodayQuadrantShifts();
          this.loadLogistics();
        },
        error: (err) => {
          console.error(err);
          this.isSavingShift = false;
        }
      });
    }
  }

  deleteShift(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar este turno de patrullaje?')) {
      this.dataService.deletePatrolShift(id).subscribe({
        next: () => {
          this.loadPatrolShifts();
          this.loadTodayQuadrantShifts();
          this.loadLogistics();
          if (this.selectedShiftId === id) {
            this.selectedShiftId = null;
            if (this.previewPolyline && this.map) {
              this.map.removeLayer(this.previewPolyline);
              this.previewPolyline = undefined;
            }
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  deletePatrolShift(id: number, event: Event) {
    this.deleteShift(id, event);
  }


  // ==========================================
  // LEAFLET PATROL ROUTE MAP LOGIC
  // ==========================================
  private initMap(containerId: string, retryCount = 0) {
    const container = document.getElementById(containerId);
    if (!container) {
      if (retryCount < 10) {
        setTimeout(() => this.initMap(containerId, retryCount + 1), 100);
      } else {
        console.error(`Map container ${containerId} not found after retries`);
      }
      return;
    }

    this.destroyMap();

    // Clean up _leaflet_id to prevent Leaflet container duplicate initialization crashes
    try {
      (container as any)._leaflet_id = null;
    } catch (e) {}

    this.map = L.map(containerId, {
      zoomControl: false,
      attributionControl: false
    }).setView([41.8781, -87.6298], 11);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // High-resolution satellite tiles
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    }).addTo(this.map);

    // Click on map to add waypoints only if drawing mode
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (!this.drawingMode || !this.showShiftModal) return;
      this.addWaypoint(e.latlng.lat, e.latlng.lng);
    });

    if (containerId === 'live-patrol-map') {
        this.drawAllActiveShiftsOnMap();
    }
    
    this.drawPoliceStations();
    this.loadPatrolShifts();
  }

  private drawPoliceStations() {
    if (!this.map) return;
    
    const stationIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container-lowest border-2 border-primary shadow-[0_0_12px_rgba(59,130,246,0.3)] text-primary">
          <span class="material-symbols-outlined text-[20px] notranslate" translate="no">local_police</span>
        </div>
      `,
      className: 'custom-station-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    this.policeStations.forEach((coords, i) => {
      const names = ['Estación Central', 'Estación Norte', 'Estación Englewood'];
      L.marker(coords, { icon: stationIcon, zIndexOffset: -100 }).addTo(this.map!)
        .bindTooltip(`<div class="font-bold text-xs uppercase tracking-wider">${names[i]}</div>`, { direction: 'top', offset: [0, -10] });
    });
  }

  private destroyMap() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.patrolSimulations.forEach(sim => {
      if (sim.returnPolyline && this.map) {
        this.map.removeLayer(sim.returnPolyline);
      }
    });
    this.patrolSimulations = [];
    
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    this.routePolyline = undefined;
    this.previewPolyline = undefined;
    this.drawMarkers = [];
    this.shiftMarkers = [];
  }

  // Start Drawing Mode inside map (used within modal)
  startRouteDrawing() {
    this.drawingMode = true;
    if (!this.map) return;

    // Clear previous drawing elements
    this.clearDrawElements();

    // Hide all other active shift routes when drawing a new one
    this.shiftMarkers.forEach(m => this.map!.removeLayer(m));

    // Redraw polyline if there are coordinates
    if (this.drawnCoordinates.length > 0) {
      this.routePolyline = L.polyline(this.drawnCoordinates, {
        color: '#dc2626', // Bright red drawing line
        weight: 4,
        dashArray: '5, 8',
        opacity: 0.8
      }).addTo(this.map);

      this.drawnCoordinates.forEach(coord => {
        const marker = L.circleMarker(coord, {
          radius: 6,
          color: '#ffffff',
          fillColor: '#dc2626',
          fillOpacity: 1,
          weight: 2
        }).addTo(this.map!);
        
        marker.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          this.removeWaypoint(coord[0], coord[1]);
        });
        
        this.drawMarkers.push(marker);
      });

      // Fit map to coordinates
      this.map.fitBounds(this.routePolyline.getBounds());
    }
  }

  stopRouteDrawing() {
    this.drawingMode = false;
    this.clearDrawElements();
  }

  addWaypoint(lat: number, lng: number) {
    if (!this.map) return;

    const newCoord: [number, number] = [lat, lng];
    this.drawnCoordinates.push(newCoord);

    // Draw node marker
    const marker = L.circleMarker(newCoord, {
      radius: 6,
      color: '#ffffff',
      fillColor: '#dc2626',
      fillOpacity: 1,
      weight: 2
    }).addTo(this.map);
    
    marker.on('click', (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e);
      this.removeWaypoint(lat, lng);
    });
    
    this.drawMarkers.push(marker);

    // Update polyline
    if (this.routePolyline) {
      this.routePolyline.setLatLngs(this.drawnCoordinates);
    } else {
      this.routePolyline = L.polyline(this.drawnCoordinates, {
        color: '#dc2626',
        weight: 4,
        dashArray: '5, 8',
        opacity: 0.8
      }).addTo(this.map);
    }
  }

  removeWaypoint(lat: number, lng: number) {
    const index = this.drawnCoordinates.findIndex(c => c[0] === lat && c[1] === lng);
    if (index > -1) {
      this.drawnCoordinates.splice(index, 1);
      this.startRouteDrawing();
    }
  }

  clearRoutePoints() {
    this.drawnCoordinates = [];
    this.clearDrawElements();
  }

  private clearDrawElements() {
    if (this.map) {
      if (this.routePolyline) {
        this.map.removeLayer(this.routePolyline);
        this.routePolyline = undefined;
      }
      this.drawMarkers.forEach(m => this.map!.removeLayer(m));
      this.drawMarkers = [];
    }
  }

  // Draw routes for all active shifts on the map matching CAD Emergency Dispatch style
  private drawAllActiveShiftsOnMap() {
    if (!this.map) return;

    this.stopSimulationLoop();

    // Clear existing shift markers & lines
    this.shiftMarkers.forEach(m => this.map!.removeLayer(m));
    this.shiftMarkers = [];
    this.patrolSimulations = [];

    // Also clear existing preview polyline if active
    if (this.previewPolyline) {
      this.map.removeLayer(this.previewPolyline);
      this.previewPolyline = undefined;
    }

    const ROUTE_PALETTE = [
      '#3b82f6', // Blue (Downtown Loop)
      '#10b981', // Emerald (Near North)
      '#06b6d4', // Cyan (West Loop)
      '#a855f7', // Purple (Lincoln Park)
      '#f59e0b', // Amber (West Town)
      '#ec4899', // Pink (South Loop)
      '#84cc16', // Lime (Logan Square)
      '#6366f1'  // Indigo (Pilsen)
    ];

    this.patrolShifts.forEach((shift, index) => {
      try {
        const coords: [number, number][] = JSON.parse(shift.ruta_coordenadas || '[]');
        if (coords.length > 0) {
          const shiftColor = ROUTE_PALETTE[index % ROUTE_PALETTE.length];

          // 1. Draw Patrol Route Polyline with glowing dashed style matching vehicle color
          const shiftPolyline = L.polyline(coords, {
            color: shiftColor,
            weight: 3.5,
            opacity: 0.75,
            dashArray: '6, 8'
          }).addTo(this.map!);
          
          this.shiftMarkers.push(shiftPolyline as any);

          // 2. Draw Patrol Vehicle Pill Marker with Plate tag & Car icon
          const firstPoint = coords[0];
          const unitPlate = shift.vehicle_plate || `CPD-00${index + 1}`;
          const policeIcon = L.divIcon({
            html: `
              <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/95 border-2 shadow-[0_0_12px_rgba(0,0,0,0.8)] cursor-pointer hover:scale-115 transition-transform" style="border-color: ${shiftColor};">
                <span class="material-symbols-outlined text-[13px] notranslate" translate="no" style="color: ${shiftColor};">directions_car</span>
                <span class="text-[10px] font-mono font-black tracking-tight text-white whitespace-nowrap">${unitPlate}</span>
              </div>
            `,
            className: 'custom-patrol-vehicle-badge',
            iconSize: [68, 24],
            iconAnchor: [34, 12]
          });

          const marker = L.marker(firstPoint, { icon: policeIcon }).addTo(this.map!);
          this.updateTooltip(marker, shift, 'En Patrullaje Activo');

          this.shiftMarkers.push(marker);

          this.patrolSimulations.push({
            marker: marker,
            shift: shift,
            coords: coords,
            color: shiftColor,
            polyline: shiftPolyline,
            routeIndex: index
          });
        }
      } catch (e) {
        console.error('Error drawing active shift marker:', e);
      }
    });

    this.startSimulationLoop();
  }

  private updateTooltip(marker: L.Marker, shift: any, status: string) {
    const content = `
      <div class="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs border border-slate-700 font-sans min-w-[160px]">
        <div class="font-bold text-primary flex items-center gap-1.5 mb-1">
          <span class="material-symbols-outlined text-[14px]">local_police</span>
          Ofc. ${shift.officer_name || 'Patrulla'}
        </div>
        <div class="text-slate-300 font-mono font-bold text-[11px] mb-0.5">Unidad: ${shift.vehicle_plate || 'Patrulla'}</div>
        <div class="text-slate-400 text-[10px] mb-1">Sector: ${shift.cuadrante || shift.beat || shift.codigo_beat || 'Central'}</div>
        <div class="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block">
          ${status}
        </div>
      </div>
    `;

    if (marker.getTooltip()) {
      marker.setTooltipContent(content);
    } else {
      marker.bindTooltip(content, { permanent: false, direction: 'top', className: 'leaflet-dark-tooltip' });
    }
  }

  private startSimulationLoop() {
    this.stopSimulationLoop();
    this.updatePatrolPositions();
    this.simulationInterval = setInterval(() => {
      this.updatePatrolPositions();
    }, 1000);
  }

  private stopSimulationLoop() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  private updatePatrolPositions() {
    if (!this.map) return;
    const now = new Date();
    
    this.patrolSimulations.forEach(sim => {
      if (!sim.coords || sim.coords.length === 0) return;

      const totalSegments = sim.coords.length - 1;
      if (totalSegments <= 0) {
        sim.marker.setLatLng(sim.coords[0]);
        this.updateTooltip(sim.marker, sim.shift, 'En Patrullaje (Punto Fijo)');
        return;
      }

      // Smooth realistic patrol cruising speed (140 seconds per circuit) strictly on assigned route coordinates
      const cycleDurationSec = 140;
      const timeSeconds = (now.getTime() / 1000) + (((sim.routeIndex || 0)) * 16.0);
      const normalizedTime = (timeSeconds % cycleDurationSec) / cycleDurationSec;
      
      let pingPong = normalizedTime * 2;
      if (pingPong > 1) {
        pingPong = 2 - pingPong;
      }
      
      const currentPos = pingPong * totalSegments;
      const idx = Math.min(Math.floor(currentPos), totalSegments - 1);
      const remainder = currentPos - idx;
      
      const p1 = sim.coords[idx];
      const p2 = sim.coords[idx + 1] || p1;
      const lat = p1[0] + (p2[0] - p1[0]) * remainder;
      const lng = p1[1] + (p2[1] - p1[1]) * remainder;
      sim.marker.setLatLng([lat, lng]);
      
      this.updateTooltip(sim.marker, sim.shift, 'En Patrullaje Activo');
    });
  }

  // Highlight a single shift and show its neon glowing path
  selectShift(shift: any) {
    if (!this.map) return;
    this.selectedShiftId = shift.id_turno;

    // Clear previous highlight
    if (this.previewPolyline) {
      this.map.removeLayer(this.previewPolyline);
      this.previewPolyline = undefined;
    }

    try {
      const coords: [number, number][] = JSON.parse(shift.ruta_coordenadas || '[]');
      if (coords.length > 0) {
        if (coords.length === 1) {
          // Centering fallback if there is only 1 point in the route
          this.map.setView(coords[0], 15);
        } else {
          // Neon cyan glowing polyline
          this.previewPolyline = L.polyline(coords, {
            color: '#06b6d4',
            weight: 6,
            opacity: 0.9,
            lineJoin: 'round'
          }).addTo(this.map);

          // Fit map view to the route
          this.map.fitBounds(this.previewPolyline.getBounds(), { padding: [50, 50] });
        }
      }
    } catch (e) {
      console.error('Error parsing route coordinates:', e);
    }
  }

  // ==========================================
  // VIEW / STATS PERCENTAGES
  // ==========================================
  getVehicleMaintenancePercentage(): number {
    if (this.kpis.total_vehicles === 0) return 0;
    const maintenance = this.kpis.total_vehicles - this.kpis.operational_vehicles;
    return Math.round((maintenance / this.kpis.total_vehicles) * 100);
  }

  getEquipmentMaintenancePercentage(): number {
    if (this.kpis.total_equipment === 0) return 0;
    const maintenance = this.kpis.total_equipment - this.kpis.operational_equipment;
    return Math.round((maintenance / this.kpis.total_equipment) * 100);
  }

  getVehicleStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'operativo' || s === 'operational') {
      return 'bg-secondary-container text-on-secondary-container border border-secondary/20';
    } else if (s === 'baja' || s === 'decommissioned' || s === 'dado_de_baja') {
      return 'bg-slate-700 text-slate-100 border border-slate-600 font-bold shadow-xs';
    } else {
      return 'bg-error-container text-on-error-container border border-error/20';
    }
  }

  getVehicleStatusDotClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'operativo' || s === 'operational') {
      return 'bg-secondary';
    } else if (s === 'baja' || s === 'decommissioned' || s === 'dado_de_baja') {
      return 'bg-slate-400';
    } else {
      return 'bg-error';
    }
  }

  getVehicleStatusLabel(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'operativo' || s === 'operational') return 'OPERATIVO';
    if (s === 'dado_de_baja' || s === 'baja' || s === 'decommissioned') return 'DADO DE BAJA';
    if (s === 'mantenimiento' || s === 'en_mantenimiento' || s === 'in repair' || s === 'maintenance') return 'EN MANTENIMIENTO';
    if (s === 'dañado' || s === 'damaged') return 'DAÑADO';
    return (status || '').toUpperCase();
  }




}
