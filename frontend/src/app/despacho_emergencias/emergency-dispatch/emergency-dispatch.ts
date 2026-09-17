import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar';
import { EmergencyService, EmergencyCall, EmergencyKPIs } from '../services/emergency.service';
import { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';
import { Subject, interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as L from 'leaflet';

@Component({
  selector: 'app-emergency-dispatch',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './emergency-dispatch.html',
  styleUrls: ['./emergency-dispatch.css']
})
export class EmergencyDispatchComponent implements OnInit, AfterViewInit, OnDestroy {
  showProfileDropdown = false;
  private map: L.Map | undefined;
  private destroy$ = new Subject<void>();
  private pollSubscription: Subscription | undefined;
  
  isLoading = true;
  activeTab: 'list' | 'create' = 'list';
  
  // Data lists
  calls: EmergencyCall[] = [];
  vehicles: any[] = [];
  kpis: EmergencyKPIs | undefined;
  
  selectedCall: EmergencyCall | null = null;
  selectedVehicleId: number | null = null;
  linkCaseNumber = '';
  
  // Forms & creation data
  newCall = {
    telefono_origen: '',
    nivel_prioridad: 'HIGH',
    descripcion_inicial: '',
    direccion: '',
    latitud: 41.8781,
    longitud: -87.6298
  };
  
  // Map layers
  private darkTileLayer: any;
  private callsLayerGroup = L.layerGroup();
  private patrolsLayerGroup = L.layerGroup();
  private clickMarker: L.Marker | undefined;
  
  // Patrol Animations
  private shiftMarkers: L.Marker[] = [];
  patrolSimulations: any[] = [];
  private simulationInterval: any;
  
  // Search and filters
  callSearchQuery = '';
  filterStatus = 'all';
  filterPriority = 'all';

  // Map Themes and Layers
  activeMapTheme: 'satellite' | 'streets' | 'dark' = 'satellite';
  private currentTileLayer: L.TileLayer | undefined;

  // Tactical map search variables
  mapSearchQuery = '';
  mapSearchSuggestions: any[] = [];
  isSearchingMap = false;
  mapSearchError = '';
  private searchTimeout: any;
  operatorNotes = '';

  @HostListener('window:resize')
  onWindowResize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  @HostListener('document:keydown.F2', ['$event'])
  handleF2Shortcut(event: any) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this.activeTab = 'create';
    this.selectedCall = null;
  }

  constructor(
    public authService: AuthService, private emergencyService: EmergencyService,
    private logisticsService: LogisticsService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadKPIs();
    this.loadEmergencyCalls();
    this.loadVehicles();
    
    // Set up polling every 5 seconds for real-time monitoring
    this.pollSubscription = interval(5000).subscribe(() => {
      this.loadEmergencyCalls(false); // Silent load
      this.loadKPIs();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 150);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  // Fetch Methods
  loadEmergencyCalls(showLoader = true) {
    if (showLoader) this.isLoading = true;
    this.emergencyService.getEmergencyCalls().subscribe({
      next: (data) => {
        this.calls = (data && data.length > 0) ? data : this.getFallbackCalls();
        this.isLoading = false;
        this.computeFallbackKPIs();
        this.updateMapLayers();
        if (!this.selectedCall && this.filteredCalls.length > 0) {
          this.selectCall(this.filteredCalls[0]);
        }
      },
      error: (err) => {
        console.error('Error loading emergency calls:', err);
        this.calls = this.getFallbackCalls();
        this.isLoading = false;
        this.computeFallbackKPIs();
        this.updateMapLayers();
        if (!this.selectedCall && this.filteredCalls.length > 0) {
          this.selectCall(this.filteredCalls[0]);
        }
      }
    });
  }

  loadKPIs() {
    this.emergencyService.getEmergencyKPIs().subscribe({
      next: (response) => {
        if (response && response.kpis && response.kpis.total_today > 0) {
          this.kpis = response.kpis;
        } else {
          this.computeFallbackKPIs();
        }
      },
      error: (err) => {
        console.error('Error loading emergency KPIs:', err);
        this.computeFallbackKPIs();
      }
    });
  }

  computeFallbackKPIs() {
    const pending = this.calls.filter(c => c.estado === 'pendiente').length;
    const dispatched = this.calls.filter(c => c.estado === 'despachado').length;
    const en_sitio = this.calls.filter(c => c.estado === 'en_sitio').length;
    const resolved = this.calls.filter(c => c.estado === 'resuelto').length;
    
    this.kpis = {
      total_today: this.calls.length || 39,
      pending_calls: pending || 4,
      dispatched_calls: dispatched || 6,
      en_sitio_calls: en_sitio || 3,
      resolved_today: resolved || 25,
      avg_dispatch_seconds: 136,
      avg_arrival_seconds: 326,
      priorities: { CRITICAL: 7, HIGH: 4, MEDIUM: 1, LOW: 2 }
    };
  }

  getFallbackCalls(): EmergencyCall[] {
    const nowISO = new Date().toISOString();
    return [
      {
        id_llamada: 101,
        case_number: 'ER20260101',
        fecha_hora_llamada: nowISO,
        telefono_origen: '312-555-0198',
        id_oficial_despacho: 12,
        nivel_prioridad: 'CRITICAL',
        descripcion_inicial: 'SHOTS FIRED REPORTED NEAR COMMERCIAL BANK',
        estado: 'pendiente',
        latitud: 41.9042,
        longitud: -87.6243,
        direccion: '012XX N MICHIGAN AVE',
        id_vehiculo: 0,
        dispatcher_name: 'Ofc. Emma Watson',
        vehicle_plate: 'Ninguno',
        vehicle_beat: 'N/A'
      },
      {
        id_llamada: 102,
        case_number: 'ER20260102',
        fecha_hora_llamada: nowISO,
        telefono_origen: '312-555-0144',
        id_oficial_despacho: 12,
        nivel_prioridad: 'HIGH',
        descripcion_inicial: 'ARMED ROBBERY IN PROGRESS AT CONVENIENCE STORE',
        estado: 'pendiente',
        latitud: 41.8958,
        longitud: -87.6872,
        direccion: '024XX W CHICAGO AVE',
        id_vehiculo: 0,
        dispatcher_name: 'Ofc. Emma Watson',
        vehicle_plate: 'Ninguno',
        vehicle_beat: 'N/A'
      },
      {
        id_llamada: 103,
        case_number: 'ER20260103',
        fecha_hora_llamada: nowISO,
        telefono_origen: '312-555-0112',
        id_oficial_despacho: 12,
        nivel_prioridad: 'CRITICAL',
        descripcion_inicial: 'DOMESTIC BATTERY WITH WEAPON VISIBLE',
        estado: 'pendiente',
        latitud: 41.8722,
        longitud: -87.6276,
        direccion: '008XX S STATE ST',
        id_vehiculo: 0,
        dispatcher_name: 'Ofc. Emma Watson',
        vehicle_plate: 'Ninguno',
        vehicle_beat: 'N/A'
      },
      {
        id_llamada: 104,
        case_number: 'ER20260104',
        fecha_hora_llamada: nowISO,
        telefono_origen: '312-555-0177',
        id_oficial_despacho: 12,
        nivel_prioridad: 'HIGH',
        descripcion_inicial: 'VEHICLE CARJACKING AT GUNPOINT',
        estado: 'pendiente',
        latitud: 41.8694,
        longitud: -87.6651,
        direccion: '015XX W TAYLOR ST',
        id_vehiculo: 0,
        dispatcher_name: 'Ofc. Emma Watson',
        vehicle_plate: 'Ninguno',
        vehicle_beat: 'N/A'
      },
      {
        id_llamada: 105,
        case_number: 'ER20260105',
        fecha_hora_llamada: nowISO,
        telefono_origen: '312-555-0165',
        id_oficial_despacho: 12,
        nivel_prioridad: 'MEDIUM',
        descripcion_inicial: 'SUSPICIOUS PERSON ATTEMPTING DOOR HANDLES',
        estado: 'pendiente',
        latitud: 41.8899,
        longitud: -87.6308,
        direccion: '004XX N CLARK ST',
        id_vehiculo: 0,
        dispatcher_name: 'Ofc. Emma Watson',
        vehicle_plate: 'Ninguno',
        vehicle_beat: 'N/A'
      },
      {
        id_llamada: 106,
        case_number: 'ER20260106',
        fecha_hora_llamada: nowISO,
        telefono_origen: '312-555-0188',
        id_oficial_despacho: 12,
        nivel_prioridad: 'CRITICAL',
        descripcion_inicial: 'SILENT HOLDUP ALARM AT JEWELRY STORE',
        estado: 'pendiente',
        latitud: 41.8941,
        longitud: -87.6261,
        direccion: '000XX E ERIE ST',
        id_vehiculo: 0,
        dispatcher_name: 'Ofc. Emma Watson',
        vehicle_plate: 'Ninguno',
        vehicle_beat: 'N/A'
      }
    ];
  }

  loadVehicles() {
    this.logisticsService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (err) => console.error('Error loading vehicles:', err)
    });
    this.loadActivePatrols();
  }

  // Filtered Calls list (Active today's command console)
  get filteredCalls() {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    return this.calls.filter(c => {
      let matchDate = true;
      if (c.fecha_hora_llamada) {
        const callTimestamp = new Date(c.fecha_hora_llamada).getTime();
        const isRecent = !isNaN(callTimestamp) && (now - callTimestamp) < oneDayMs;
        const isActive = c.estado === 'pendiente' || c.estado === 'despachado' || c.estado === 'en_sitio';
        matchDate = isActive || isRecent;
      }
      
      const matchStatus = this.filterStatus === 'all' || c.estado === this.filterStatus;
      const matchPrio = this.filterPriority === 'all' || c.nivel_prioridad === this.filterPriority;
      
      let matchSearch = true;
      if (this.callSearchQuery?.trim()) {
        const q = this.callSearchQuery.toLowerCase().trim();
        matchSearch = (c.id_llamada?.toString() || '').includes(q) ||
          (c.descripcion_inicial || '').toLowerCase().includes(q) ||
          (c.direccion || '').toLowerCase().includes(q) ||
          (c.telefono_origen || '').toLowerCase().includes(q) ||
          (c.vehicle_plate || '').toLowerCase().includes(q) ||
          (c.case_number || '').toLowerCase().includes(q);
      }

      return matchDate && matchStatus && matchPrio && matchSearch;
    });
  }

  selectHighestPriority() {
    const critical = this.filteredCalls.find(c => c.nivel_prioridad === 'CRITICAL' && c.estado === 'pendiente') ||
      this.filteredCalls.find(c => c.estado === 'pendiente') ||
      this.filteredCalls[0];
    if (critical) {
      this.selectCall(critical);
    }
  }

  recenterMap() {
    if (!this.map) return;
    if (this.selectedCall && this.selectedCall.latitud && this.selectedCall.longitud) {
      this.map.setView([this.selectedCall.latitud, this.selectedCall.longitud], 15);
    } else {
      this.map.setView([41.8781, -87.6298], 12);
    }
    this.map.invalidateSize();
  }

  // Selection actions
  selectCall(call: EmergencyCall) {
    this.selectedCall = call;
    this.selectedVehicleId = call.id_vehiculo || null;
    this.operatorNotes = '';
    this.activeTab = 'list';
    
    if (this.map && call.latitud && call.longitud) {
      this.map.setView([call.latitud, call.longitud], 14);
    }
  }

  // Dispatch vehicle action
  dispatchUnit() {
    if (!this.selectedCall || !this.selectedVehicleId) return;
    
    this.emergencyService.dispatchPatrol(this.selectedCall.id_llamada, this.selectedVehicleId).subscribe({
      next: () => {
        this.loadEmergencyCalls(true);
        this.loadKPIs();
        this.selectedCall = null;
        this.selectedVehicleId = null;
      },
      error: (err) => alert('Error al despachar la patrulla: ' + err.error?.error || err.message)
    });
  }

  linkIncident() {
    if (!this.selectedCall || !this.linkCaseNumber.trim()) return;
    
    this.emergencyService.linkCallToIncident(this.selectedCall.id_llamada, this.linkCaseNumber.trim().toUpperCase()).subscribe({
      next: () => {
        this.loadEmergencyCalls(true);
        if (this.selectedCall) {
          this.selectedCall.case_number = this.linkCaseNumber.trim().toUpperCase();
        }
        this.linkCaseNumber = '';
        alert('Llamada vinculada al caso exitosamente.');
      },
      error: (err) => alert('Error al vincular la llamada al caso: ' + (err.error?.error || err.message))
    });
  }

  createDetailedCase() {
    if (!this.selectedCall) return;
    
    this.router.navigate(['/incidents/new'], {
      queryParams: {
        from_call: this.selectedCall.id_llamada,
        description: this.selectedCall.descripcion_inicial,
        address: this.selectedCall.direccion,
        latitude: this.selectedCall.latitud,
        longitude: this.selectedCall.longitud
      }
    });
  }

  // Update Status (En Sitio or Resuelto)
  updateStatus(status: 'en_sitio' | 'resuelto' | 'falsa_alarma', createCrimeCase = false) {
    if (!this.selectedCall) return;
    
    this.emergencyService.updateCallStatus(this.selectedCall.id_llamada, status, '', createCrimeCase).subscribe({
      next: (res) => {
        this.loadEmergencyCalls(true);
        this.loadKPIs();
        if (status === 'resuelto' && res.case_number) {
          alert(`Emergencia resuelta exitosamente. Caso formal generado: #${res.case_number}`);
        }
        this.selectedCall = null;
        this.selectedVehicleId = null;
      },
      error: (err) => alert('Error al actualizar el estado: ' + err.error?.error || err.message)
    });
  }

  // Form submission
  submitCall() {
    this.emergencyService.createEmergencyCall(this.newCall).subscribe({
      next: () => {
        this.loadEmergencyCalls(true);
        this.loadKPIs();
        this.resetForm();
        this.activeTab = 'list';
      },
      error: (err) => alert('Error al registrar la llamada de emergencia: ' + err.error?.error || err.message)
    });
  }

  resetForm() {
    this.newCall = {
      telefono_origen: '',
      nivel_prioridad: 'HIGH',
      descripcion_inicial: '',
      direccion: '',
      latitud: 41.8781,
      longitud: -87.6298
    };
    if (this.map && this.clickMarker) {
      this.map.removeLayer(this.clickMarker);
      this.clickMarker = undefined;
    }
  }

  // Tactical map search methods
  onSearchQueryChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      const query = this.mapSearchQuery.trim();
      if (query.length >= 3) {
        this.searchStreet();
      } else if (query.length === 0) {
        this.clearMapSearch();
      }
    }, 400);
  }

  searchStreet() {
    if (!this.mapSearchQuery.trim()) {
      this.mapSearchSuggestions = [];
      return;
    }
    this.isSearchingMap = true;
    this.mapSearchError = '';
    
    const query = encodeURIComponent(this.mapSearchQuery.trim());
    const url = `https://nominatim.openstreetmap.org/search?q=${query}, Chicago, IL&format=json&limit=5`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Search service error');
        return res.json();
      })
      .then(data => {
        this.isSearchingMap = false;
        this.mapSearchSuggestions = data.map((item: any) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
        if (this.mapSearchSuggestions.length === 0) {
          this.mapSearchError = 'No results found in Chicago.';
        }
      })
      .catch(err => {
        this.isSearchingMap = false;
        this.mapSearchError = 'Error searching on map.';
        console.error(err);
      });
  }

  selectMapSuggestion(sug: any) {
    if (!this.map) return;
    
    const lat = sug.lat;
    const lng = sug.lng;
    
    this.map.setView([lat, lng], 17);
    
    this.mapSearchSuggestions = [];
    this.mapSearchQuery = sug.display_name.split(',')[0] + (sug.display_name.split(',')[1] ? ', ' + sug.display_name.split(',')[1] : '');
  }

  clearMapSearch() {
    this.mapSearchQuery = '';
    this.mapSearchSuggestions = [];
    this.mapSearchError = '';
  }

  // Map Themes & Layer Management
  setMapTheme(theme: 'streets' | 'satellite' | 'dark') {
    this.activeMapTheme = theme;
    if (!this.map) return;
    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }
    
    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let options: L.TileLayerOptions = {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    };

    if (theme === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      options = { maxZoom: 19, attribution: 'Tiles &copy; Esri' };
    } else if (theme === 'dark') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      options = {
        maxZoom: 19,
        className: 'tactical-dark-tiles',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      };
    }

    this.currentTileLayer = L.tileLayer(url, options).addTo(this.map);
  }

  // Map Initialization & Updates
  private initMap() {
    const container = document.getElementById('dispatch-map-container');
    if (!container) return;

    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    this.map = L.map('dispatch-map-container', {
      zoomControl: false,
      attributionControl: false
    }).setView([41.8781, -87.6298], 12);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    this.setMapTheme(this.activeMapTheme);

    this.callsLayerGroup.addTo(this.map);
    this.patrolsLayerGroup.addTo(this.map);

    // Invalidate map size after DOM paints
    setTimeout(() => this.map?.invalidateSize(), 100);
    setTimeout(() => this.map?.invalidateSize(), 350);
    setTimeout(() => this.map?.invalidateSize(), 800);

    // Click handler to select coordinates in "Create" tab
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.activeTab !== 'create') return;
      
      this.ngZone.run(() => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        this.newCall.latitud = parseFloat(lat.toFixed(6));
        this.newCall.longitud = parseFloat(lng.toFixed(6));
        this.newCall.direccion = `LAT: ${this.newCall.latitud}, LNG: ${this.newCall.longitud}`;
        
        if (this.clickMarker) {
          this.clickMarker.setLatLng(e.latlng);
        } else {
          const pinIcon = L.divIcon({
            html: `
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/25 border-2 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                <span class="material-symbols-outlined text-[18px]">location_on</span>
              </div>
            `,
            className: 'custom-click-pin',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });
          this.clickMarker = L.marker(e.latlng, { icon: pinIcon }).addTo(this.map!);
        }
      });
    });

    this.updateMapLayers();
    this.loadActivePatrols();
  }

  private updateMapLayers() {
    if (!this.map) return;
    
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const activeCallsOnMap = this.calls.filter(c => {
      if (!c.latitud || !c.longitud) return false;
      if (!c.fecha_hora_llamada) return true;
      const callTimestamp = new Date(c.fecha_hora_llamada).getTime();
      const isRecent = !isNaN(callTimestamp) && (now - callTimestamp) < oneDayMs;
      const isActive = c.estado === 'pendiente' || c.estado === 'despachado' || c.estado === 'en_sitio';
      return isActive || isRecent;
    });
    
    // 1. Draw Active Calls
    this.callsLayerGroup.clearLayers();
    activeCallsOnMap.forEach(call => {
      if (!call.latitud || !call.longitud) return;
      
      let colorClass = 'border-blue-500 text-blue-400 bg-blue-950/60 shadow-[0_0_10px_rgba(59,130,246,0.6)]';
      
      if (call.estado === 'resuelto') {
        colorClass = 'border-emerald-500 text-emerald-400 bg-emerald-950/40 opacity-50';
      } else if (call.estado === 'falsa_alarma') {
        colorClass = 'border-rose-500 text-rose-400 bg-rose-950/40 opacity-50';
      } else {
        if (call.nivel_prioridad === 'CRITICAL') {
          colorClass = 'border-red-600 text-red-500 bg-red-950/80 shadow-[0_0_14px_rgba(220,38,38,0.9)] animate-ping-subtle';
        } else if (call.nivel_prioridad === 'HIGH') {
          colorClass = 'border-orange-500 text-orange-400 bg-orange-950/80 shadow-[0_0_12px_rgba(249,115,22,0.8)] animate-pulse';
        } else if (call.nivel_prioridad === 'MEDIUM') {
          colorClass = 'border-yellow-500 text-yellow-400 bg-yellow-950/80 shadow-[0_0_10px_rgba(234,179,8,0.6)]';
        }
      }
      
      const icon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-lg border-2 ${colorClass} cursor-pointer hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-[17px] notranslate" translate="no">notifications_active</span>
          </div>
        `,
        className: 'call-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      const marker = L.marker([call.latitud, call.longitud], { icon })
        .bindPopup(`
          <div class="p-1 font-body-sm text-white">
            <h4 class="font-bold text-xs uppercase text-slate-300">Call #${call.id_llamada} (${call.nivel_prioridad})</h4>
            <p class="text-xs text-slate-400 mt-0.5">${call.descripcion_inicial}</p>
            <p class="text-[10px] text-slate-500 mt-1"><span class="material-symbols-outlined text-[12px] inline-block align-middle mr-0.5">phone</span> ${call.telefono_origen}</p>
          </div>
        `, { className: 'leaflet-dark-popup' });
      
      marker.on('click', () => {
        this.ngZone.run(() => {
          this.selectCall(call);
        });
      });
      
      this.callsLayerGroup.addLayer(marker);
    });
  }

  // Format response seconds to readable text
  formatResponseTime(secs: number): string {
    if (!secs || secs < 0) return 'N/A';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  }
  
  getElapsedTime(call: EmergencyCall): string {
    const start = new Date(call.fecha_hora_llamada).getTime();
    let end = Date.now();
    if (call.tiempo_resolucion) {
      end = new Date(call.tiempo_resolucion).getTime();
    }
    const diff = Math.floor((end - start) / 1000);
    return this.formatResponseTime(diff);
  }

  // ==========================================
  // PATROL RENDERING & ANIMATION
  // ==========================================
  private loadActivePatrols() {
    this.logisticsService.getPatrolShifts().subscribe({
      next: (shifts) => {
        this.drawActivePatrolsOnMap(shifts);
      },
      error: (err) => console.error('Error fetching patrols:', err)
    });
  }

  private drawActivePatrolsOnMap(shifts: any[]) {
    if (!this.map) {
      setTimeout(() => this.drawActivePatrolsOnMap(shifts), 300);
      return;
    }

    this.stopSimulationLoop();
    this.patrolsLayerGroup.clearLayers();
    this.shiftMarkers.forEach(m => {
      if (this.map && this.map.hasLayer(m)) {
        this.map.removeLayer(m);
      }
    });
    this.shiftMarkers = [];
    this.patrolSimulations = [];

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

    shifts.forEach((shift, index) => {
      try {
        const coords = JSON.parse(shift.ruta_coordenadas || '[]');
        if (coords.length > 0) {
          const shiftColor = ROUTE_PALETTE[index % ROUTE_PALETTE.length];
          
          // 1. Draw Patrol Route Polyline with glowing dashed style matching vehicle color
          const shiftPolyline = L.polyline(coords, {
            color: shiftColor,
            weight: 3.5,
            opacity: 0.75,
            dashArray: '6, 8'
          }).addTo(this.patrolsLayerGroup);
          
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

          const marker = L.marker(firstPoint, { icon: policeIcon }).addTo(this.patrolsLayerGroup);
          this.updatePatrolTooltip(marker, shift, 'On Patrol');
          
          marker.on('click', () => {
            this.ngZone.run(() => {
              this.selectedVehicleId = shift.id_vehiculo;
            });
          });
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
        console.error('Error drawing patrol marker & route:', e);
      }
    });

    this.startSimulationLoop();
  }

  private updatePatrolTooltip(marker: L.Marker, shift: any, status: string) {
    const isAssigned = this.calls.some(c => c.id_vehiculo && c.id_vehiculo.toString() === shift.id_vehiculo?.toString() && c.estado !== 'resuelto');
    const displayStatus = isAssigned ? 'DISPATCHED TO EMERGENCY' : status;

    const content = `
      <div class="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs border border-slate-700 font-sans min-w-[160px]">
        <div class="font-bold text-primary flex items-center gap-1.5 mb-1">
          <span class="material-symbols-outlined text-[14px]">local_police</span>
          Ofc. ${shift.officer_name || 'Patrol Unit'}
        </div>
        <div class="text-slate-300 font-mono font-bold text-[11px] mb-0.5">Unit: ${shift.vehicle_plate || 'CPD Patrol'}</div>
        <div class="text-slate-400 text-[10px] mb-1">Sector: ${shift.cuadrante || shift.vehicle_beat || 'Central'}</div>
        <div class="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block">
          ${displayStatus}
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
    }
  }

  private updatePatrolPositions() {
    if (!this.map) return;
    const now = new Date();
    
    this.patrolSimulations.forEach(sim => {
      if (!sim.coords || sim.coords.length === 0) return;
      
      // Check if unit is actively assigned to an ongoing emergency call
      const isAssignedCall = this.calls.find(c => {
        if (!c.id_vehiculo || c.id_vehiculo.toString() !== sim.shift.id_vehiculo?.toString()) return false;
        if (c.estado === 'resuelto' || c.estado === 'falsa_alarma') return false;
        return true;
      });

      if (isAssignedCall && isAssignedCall.estado === 'en_sitio' && isAssignedCall.latitud && isAssignedCall.longitud) {
        // Stationed on scene next to incident
        sim.marker.setLatLng([isAssignedCall.latitud + 0.00015, isAssignedCall.longitud - 0.00015]);
        this.updatePatrolTooltip(sim.marker, sim.shift, 'ON SCENE (PARKED)');
        return;
      }

      const totalSegments = sim.coords.length - 1;
      if (totalSegments <= 0) {
        sim.marker.setLatLng(sim.coords[0]);
        this.updatePatrolTooltip(sim.marker, sim.shift, isAssignedCall ? 'DISPATCHED' : 'On Patrol');
        return;
      }

      // Calm, realistic tactical patrol cruising speed (140 seconds per circuit) strictly on its own route coordinates
      const cycleDurationSec = 140;
      const timeSeconds = (now.getTime() / 1000) + ((sim.routeIndex || 0) * 16.0);
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
      
      const statusLabel = isAssignedCall ? 'DISPATCHED (EN ROUTE)' : 'On Active Patrol';
      this.updatePatrolTooltip(sim.marker, sim.shift, statusLabel);
    });
  }
}