import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { SidebarComponent } from '../../sidebar/sidebar';
import { OrdenesService } from '../services/ordenes.service';
import { AuthService } from '../../administracion_seguridad/services/auth.service';

@Component({
  selector: 'app-ordenes-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './ordenes-dashboard.html',
  styleUrl: './ordenes-dashboard.css'
})
export class OrdenesDashboardComponent implements OnInit {
  showProfileDropdown = false;
  activeTab: 'warrants' | 'custody' = 'warrants';
  showKpis = true;

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  ordenes: any[] = [];
  searchQuery: string = '';
  sortField = '';
  sortAscending = true;
  
  verificacionResult: any = null;
  profile: string | null = '';

  // Digital Custody State
  custodyLogs: any[] = [];
  custodyFilters = {
    search: '',
    accion: 'ALL'
  };
  kpis = {
    total_custody_logs: 0,
    active_warrants_count: 0,
    executed_warrants_count: 0
  };

  // Execution Modal State
  showExecuteModal: boolean = false;
  ejecucionFormData = {
    ordenId: null,
    ubicacion: '',
    oficial_ejecutor: '',
    resultado: 'Exitosa',
    observaciones: ''
  };
  executing: boolean = false;
  execError: string = '';

  // Tactical map search variables
  showMapModal = false;
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  mapSearchQuery = '';
  mapSearchSuggestions: any[] = [];
  isSearchingMap = false;
  isPinningLocation = false;
  mapSearchError = '';
  searchTimeout: any;

  constructor(
    private ordenesService: OrdenesService,
    public authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    this.ejecucionFormData.oficial_ejecutor = this.authService.getOfficerName();
    this.loadOrdenes();
    this.loadCustodiaDigital();
  }

  switchTab(tab: 'warrants' | 'custody') {
    this.activeTab = tab;
    if (tab === 'warrants') {
      this.loadOrdenes();
    } else {
      this.loadCustodiaDigital();
    }
  }

  loadOrdenes() {
    this.ordenesService.getOrdenes().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.ordenes = res.length > 0 ? res : this.getMockWarrants();
        } else if (res && res.orders) {
          this.ordenes = res.orders.length > 0 ? res.orders : this.getMockWarrants();
          if (res.kpis) {
            this.kpis = res.kpis;
          }
        } else {
          this.ordenes = this.getMockWarrants();
        }
        this.calculateKpisFallback();
        this.verificacionResult = null;
        this.applySort();
      },
      error: (err) => console.error('Error fetching ordenes', err)
    });
  }

  calculateKpisFallback() {
    if (this.ordenes && this.ordenes.length > 0) {
      const active = this.ordenes.filter(o => o.estado === 'Activa' || o.estado === 'Active').length;
      const executed = this.ordenes.filter(o => o.estado === 'Ejecutada' || o.estado === 'Executed').length;
      this.kpis.active_warrants_count = active;
      this.kpis.executed_warrants_count = executed;
    }
  }

  loadCustodiaDigital() {
    this.ordenesService.getCustodiaDigital(this.custodyFilters.search, this.custodyFilters.accion).subscribe({
      next: (res) => {
        this.custodyLogs = (res.logs && res.logs.length > 0) ? res.logs : this.getMockCustodyLogs();
        if (res.kpis) {
          this.kpis = res.kpis;
        }
      },
      error: (err) => console.error('Error fetching digital custody logs', err)
    });
  }

  onSearchChange(val: string) {
    this.searchQuery = val;
    if (val.trim().length > 2) {
      this.ordenesService.verificarOrdenes(val).subscribe({
        next: (res) => {
          this.verificacionResult = res;
          this.ordenes = res.ordenes || [];
          this.applySort();
        },
        error: (err) => console.error(err)
      });
    } else {
      // Si borra, recargar todas
      if (val.trim().length === 0) {
         this.loadOrdenes();
      }
    }
  }

  sortOrdenes(field: string) {
    if (this.sortField === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortField = field;
      this.sortAscending = true;
    }
    this.applySort();
  }

  applySort() {
    if (!this.sortField) return;
    const field = this.sortField;
    const direction = this.sortAscending ? 1 : -1;
    this.ordenes.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_vencimiento') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'id') {
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

  openExecuteModal(ordenId: number) {
    this.showExecuteModal = true;
    this.execError = '';
    this.ejecucionFormData.ordenId = ordenId as any;
    this.ejecucionFormData.ubicacion = '';
    this.ejecucionFormData.resultado = 'Exitosa';
    this.ejecucionFormData.observaciones = '';
  }

  closeExecuteModal() {
    this.showExecuteModal = false;
  }

  submitEjecucion() {
    if (!this.ejecucionFormData.ordenId || !this.ejecucionFormData.ubicacion) return;
    
    this.executing = true;
    this.execError = '';

    const payload = {
      ubicacion: this.ejecucionFormData.ubicacion,
      oficial_ejecutor: this.ejecucionFormData.oficial_ejecutor,
      resultado: this.ejecucionFormData.resultado,
      observaciones: this.ejecucionFormData.observaciones
    };

    this.ordenesService.ejecutarOrden(this.ejecucionFormData.ordenId, payload).subscribe({
      next: (res) => {
        this.executing = false;
        this.closeExecuteModal();
        this.loadOrdenes(); // Refresh table
      },
      error: (err) => {
        this.executing = false;
        this.execError = err.error?.error || 'Error al ejecutar la orden judicial.';
      }
    });
  }

  canRegister(): boolean {
    return this.profile === 'administrador' || this.profile === 'detective' || this.profile === 'administrador_sistema';
  }

  eliminarOrden(id: number) {
    if (confirm('¿Está seguro de que desea eliminar esta orden judicial? Esta acción no se puede deshacer.')) {
      this.ordenesService.eliminarOrden(id).subscribe({
        next: () => {
          this.loadOrdenes();
        },
        error: (err) => {
          console.error('Error al eliminar la orden:', err);
          alert('Ocurrió un error al eliminar la orden judicial.');
        }
      });
    }
  }

  openMapModal() {
    this.showMapModal = true;
    this.isPinningLocation = false;
    this.mapSearchQuery = this.ejecucionFormData.ubicacion || '';
    this.clearMapSearch();
    setTimeout(() => {
      this.initModalMap();
    }, 150);
  }

  closeMapModal() {
    this.showMapModal = false;
    this.isPinningLocation = false;
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }
  }

  confirmMapLocation() {
    this.closeMapModal();
  }

  onSearchQueryChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.fetchMapSuggestions();
    }, 300);
  }

  fetchMapSuggestions() {
    if (!this.mapSearchQuery || this.mapSearchQuery.trim().length < 3) {
      this.mapSearchSuggestions = [];
      return;
    }
    this.isSearchingMap = true;
    this.mapSearchError = '';
    
    const query = encodeURIComponent(this.mapSearchQuery + ', Chicago, IL');
    this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`).subscribe({
      next: (res) => {
        this.mapSearchSuggestions = res || [];
        this.isSearchingMap = false;
      },
      error: () => {
        this.isSearchingMap = false;
        this.mapSearchError = 'Error al obtener sugerencias del mapa';
      }
    });
  }

  clearMapSearch() {
    this.mapSearchQuery = '';
    this.mapSearchSuggestions = [];
    this.mapSearchError = '';
  }

  selectMapSuggestion(sug: any) {
    const lat = parseFloat(sug.lat);
    const lng = parseFloat(sug.lon);
    
    if (this.map && !isNaN(lat) && !isNaN(lng)) {
      this.map.flyTo([lat, lng], 17, { duration: 1.2 });
      
      const cleanAddress = sug.display_name.split(',')[0] + (sug.display_name.split(',')[1] ? ', ' + sug.display_name.split(',')[1] : '');
      this.ejecucionFormData.ubicacion = cleanAddress;
      this.mapSearchQuery = cleanAddress;
      this.isPinningLocation = true;
      this.mapSearchSuggestions = [];

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: #06b6d4; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(6,182,212,0.9);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map!);
      }
    }
  }

  searchStreet() {
    if (this.mapSearchSuggestions.length > 0) {
      this.selectMapSuggestion(this.mapSearchSuggestions[0]);
    }
  }

  initModalMap() {
    const container = document.getElementById('modal-warrant-map');
    if (!container) return;

    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }

    this.map = L.map('modal-warrant-map', {
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

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      this.isPinningLocation = true;

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map!);
      }
      
      this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&email=safecity.project@gmail.com`).subscribe(res => {
         if (res && res.address) {
             const road = res.address.road || res.address.pedestrian || res.address.suburb || '';
             const houseNumber = res.address.house_number || '';
             const neighbourhood = res.address.neighbourhood || res.address.city_district || '';
             
             let parts = [];
             if (road) parts.push(houseNumber ? `${houseNumber} ${road}` : road);
             if (neighbourhood) parts.push(neighbourhood);
             
             this.ejecucionFormData.ubicacion = parts.length > 0 ? parts.join(', ') : (res.display_name ? res.display_name.split(',').slice(0, 2).join(',') : `Chicago Location`);
         } else if (res && res.display_name) {
             this.ejecucionFormData.ubicacion = res.display_name.split(',').slice(0, 2).join(',');
         } else {
             this.ejecucionFormData.ubicacion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
         }
         this.mapSearchQuery = this.ejecucionFormData.ubicacion;
      });
    });
  }

  getMockWarrants(): any[] {
    return [
      { id: 107, sospechoso_nombre: 'Samantha Reed', sospechoso_identificacion: 'DNI-662019', tipo_orden: 'Arresto', cargos: 'First Degree Commercial Burglary', fecha_vencimiento: '2026-10-15', estado: 'Active' },
      { id: 106, sospechoso_nombre: 'Viktor Reznov', sospechoso_identificacion: 'DNI-883920', tipo_orden: 'Allanamiento', cargos: 'Unlawful Possession of Automatic Weapons', fecha_vencimiento: '2026-12-10', estado: 'Active' },
      { id: 103, sospechoso_nombre: 'James Thornton', sospechoso_identificacion: 'DNI-710293', tipo_orden: 'Arresto', cargos: 'Aggravated Battery with a Deadly Weapon', fecha_vencimiento: '2026-10-01', estado: 'Active' },
      { id: 105, sospechoso_nombre: 'Antonio Morales', sospechoso_identificacion: 'DNI-559102', tipo_orden: 'Arresto', cargos: 'Grand Theft Auto & Chop Shop Operation', fecha_vencimiento: '2026-09-25', estado: 'Ejecutada' },
      { id: 108, sospechoso_nombre: 'Jeremy Jaramillo', sospechoso_identificacion: 'DNI-120030', tipo_orden: 'Arresto', cargos: 'Cyber Espionage and Data Theft', fecha_vencimiento: '2027-01-20', estado: 'Active' },
      { id: 109, sospechoso_nombre: 'Elara Vance', sospechoso_identificacion: 'DNI-991020', tipo_orden: 'Interceptación', cargos: 'Wire Fraud & Money Laundering', fecha_vencimiento: '2026-11-05', estado: 'Active' },
      { id: 110, sospechoso_nombre: 'Marcus Holloway', sospechoso_identificacion: 'DNI-445821', tipo_orden: 'Allanamiento', cargos: 'Illegal Distribution of Controlled Substances', fecha_vencimiento: '2026-08-30', estado: 'Ejecutada' }
    ];
  }

  getMockCustodyLogs(): any[] {
    let logs = [
      { id_transferencia: 1, codigo_qr: 'QR-A001', id_evidencia: '409', tipo_evidencia: 'Firearm - Glock 19', case_number: '2026-CR-019', tipo_accion: 'INGRESO', oficial_origen: 'Crime Scene Unit', oficial_destino: 'Ofc. Jaramillo (Evidence Room)', fecha_registro: '2026-08-01T10:15:00', observaciones: 'Sealed in evidence bag #B-99', hash_signature: '0xf3d4...8a1c' },
      { id_transferencia: 2, codigo_qr: 'QR-B042', id_evidencia: '415', tipo_evidencia: 'Laptop - Thinkpad T14', case_number: '2026-CR-022', tipo_accion: 'TRANSFERENCIA', oficial_origen: 'Ofc. Jaramillo (Evidence Room)', oficial_destino: 'Det. Sarah Connor (Cyber)', fecha_registro: '2026-08-02T09:30:00', observaciones: 'Transferred for digital forensics extraction', hash_signature: '0x11b9...5f22' },
      { id_transferencia: 3, codigo_qr: 'QR-C091', id_evidencia: '302', tipo_evidencia: 'Cash - $45,000 USD', case_number: '2026-CR-010', tipo_accion: 'SALIDA_JUDICIAL', oficial_origen: 'Ofc. Jaramillo (Evidence Room)', oficial_destino: 'District Attorney Office', fecha_registro: '2026-08-02T11:45:00', observaciones: 'Released to DA via Court Order #882', hash_signature: '0x99cc...2d4e' },
      { id_transferencia: 4, codigo_qr: 'QR-D112', id_evidencia: '198', tipo_evidencia: 'Narcotics - Cocaine 5kg', case_number: '2025-CR-110', tipo_accion: 'DESTRUCCION', oficial_origen: 'Evidence Room Vault', oficial_destino: 'Incineration Facility A', fecha_registro: '2026-08-02T14:00:00', observaciones: 'Incinerated under protocol by Commander authorization', hash_signature: '0x74fa...11c0' },
      { id_transferencia: 5, codigo_qr: 'QR-A002', id_evidencia: '410', tipo_evidencia: 'Mobile Phone - iPhone 14', case_number: '2026-CR-019', tipo_accion: 'INGRESO', oficial_origen: 'Crime Scene Unit', oficial_destino: 'Ofc. Jaramillo (Evidence Room)', fecha_registro: '2026-08-01T10:20:00', observaciones: 'Screen cracked, powered off', hash_signature: '0x2a3b...c911' },
      { id_transferencia: 6, codigo_qr: 'QR-B042', id_evidencia: '415', tipo_evidencia: 'Laptop - Thinkpad T14', case_number: '2026-CR-022', tipo_accion: 'INGRESO', oficial_origen: 'Patrol Unit Alpha', oficial_destino: 'Ofc. Jaramillo (Evidence Room)', fecha_registro: '2026-07-28T18:00:00', observaciones: 'Recovered from suspect vehicle trunk', hash_signature: '0x88f1...30ab' },
      { id_transferencia: 7, codigo_qr: 'QR-E333', id_evidencia: '501', tipo_evidencia: 'Biological - DNA Swab', case_number: '2026-CR-045', tipo_accion: 'TRANSFERENCIA', oficial_origen: 'Ofc. Jaramillo (Evidence Room)', oficial_destino: 'State Crime Lab', fecha_registro: '2026-08-02T16:15:00', observaciones: 'Sent for rapid DNA profiling', hash_signature: '0x00c4...9a8f' },
    ];
    if (this.custodyFilters.accion !== 'ALL') {
      logs = logs.filter(l => l.tipo_accion === this.custodyFilters.accion);
    }
    if (this.custodyFilters.search && this.custodyFilters.search.trim().length > 0) {
       const s = this.custodyFilters.search.toLowerCase();
       logs = logs.filter(l => 
          l.codigo_qr.toLowerCase().includes(s) || 
          l.tipo_evidencia.toLowerCase().includes(s) ||
          l.case_number.toLowerCase().includes(s)
       );
    }
    return logs;
  }
}
