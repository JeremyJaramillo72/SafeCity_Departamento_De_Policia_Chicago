import { RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { CategoryService } from '../../administracion_seguridad/services/category.service';
import * as L from 'leaflet';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-traffic-control',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './traffic-control.html',
  styleUrls: ['../incident-form.css']
})
export class TrafficControlComponent implements OnInit, OnDestroy {
  showProfileDropdown = false;
  profile: string | null = '';
  showForm = false;
  editingId: string | null = null;
  showDetailModal = false;
  selectedViolation: any = null;

  // KPIs
  totalViolations = 0;
  totalFines = 0;
  pendingViolations = 0;
  courtRequiredCount = 0;
  
  // Lists
  violations: any[] = [];
  filteredViolations: any[] = [];
  leyes: string[] = [
    'EXCESO_VELOCIDAD',
    'CONDUCCION_TEMERARIA',
    'DUI',
    'PASAR_SEMAFORO_ROJO',
    'SIN_LICENCIA'
  ];

  // Filters
  filterSearch = '';
  filterLeyes = 'ALL';
  filterStatus = 'ALL';
  sortField = 'fecha_hora';
  sortAscending = false;
  showKpis = true;

  filters = {
    search_nombre: '',
    search_vehiculo: '',
    ley_transito: 'Todas las Infracciones',
    date_range: 'Todo el Tiempo'
  };

  isViolationDropdownOpen = false;
  violationSearch = 'Todas las Infracciones';

  private searchSubject = new Subject<void>();

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  get totalCitationsCount(): number {
    return this.pagination.total || this.violations.length;
  }

  get totalFinesAmount(): number {
    return this.violations.reduce((sum, v) => sum + (Number(v.monto_multa) || 0), 0);
  }

  get duiViolationsCount(): number {
    return this.violations.filter(v => v.ley_transito && (v.ley_transito.toLowerCase().includes('dui') || v.ley_transito.toLowerCase().includes('alcohol') || (v.nivel_bac && Number(v.nivel_bac) > 0))).length;
  }

  get speedingViolationsCount(): number {
    return this.violations.filter(v => v.ley_transito && (v.ley_transito.toLowerCase().includes('velocidad') || v.ley_transito.toLowerCase().includes('speeding'))).length;
  }
  newViolation: any = {
    ubicacion: '',
    latitude: '',
    longitude: '',
    ley_transito: '',
    monto_multa: 0,
    nivel_bac: 0.0,
    limite_velocidad: 0,
    velocidad_registrada: 0,
    placa_vehiculo: '',
    estado_placa: '',
    marca_vehiculo: '',
    modelo_vehiculo: '',
    anio_vehiculo: null,
    color_vehiculo: '',
    licencia_conductor: '',
    estado_licencia: '',
    nombre_conductor: '',
    direccion_conductor: '',
    fecha_nacimiento: '',
    condiciones_climaticas: '',
    condiciones_trafico: '',
    comentarios: '',
    evidencia_url: ''
  };

  selectedFile: File | null = null;
  isUploading = false;
  isLoading = false;
  error = '';
  success = '';
  
  // Pagination
  pagination = { page: 1, per_page: 10, total: 0, total_pages: 1 };
  Math = Math;

  // Map variables
  showMapModal = false;
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  mapSearchQuery = '';
  mapSearchSuggestions: any[] = [];
  isSearchingMap = false;
  isPinningLocation = false;
  mapSearchError = '';
  private searchTimeout: any;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories('traffic_law', false).subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          this.leyes = cats.map(c => c.valor);
        }
      },
      error: (err) => console.error('Failed to load traffic laws:', err)
    });

    this.profile = this.authService.getRole();
    
    this.searchSubject.pipe(
      debounceTime(400)
    ).subscribe(() => {
      this.applyFilters();
    });

    this.loadViolations();
  }

  ngOnDestroy() {
    this.closeMapModal();
  }

  loadViolations() {
    let params: any = {
      page: this.pagination.page.toString(),
      limit: this.pagination.per_page.toString()
    };
    
    if (this.filters.search_nombre) {
      params.search_nombre = this.filters.search_nombre;
    }
    if (this.filters.search_vehiculo) {
      params.search_vehiculo = this.filters.search_vehiculo;
    }
    if (this.filters.ley_transito && this.filters.ley_transito !== 'Todas las Infracciones' && this.filters.ley_transito !== 'All Violations') {
      params.ley_transito = this.filters.ley_transito;
    }
    if (this.filters.date_range && this.filters.date_range !== 'Todo el Tiempo' && this.filters.date_range !== 'All Time') {
      params.date_range = this.filters.date_range;
    }

    this.http.get<any>('http://localhost:8000/api/operativa/traffic-violations/', { params })
      .subscribe({
        next: (res) => {
          this.violations = res.data;
          this.pagination = res.pagination;
          this.applySort();
        },
        error: (err) => console.error(err)
      });
  }

  sortViolations(field: string) {
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
    this.violations.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_hora') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'monto_multa') {
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

  applyFilters() {
    this.pagination.page = 1;
    this.loadViolations();
  }

  nextPage() {
    if (this.pagination.page < this.pagination.total_pages) {
      this.pagination.page++;
      this.loadViolations();
    }
  }

  prevPage() {
    if (this.pagination.page > 1) {
      this.pagination.page--;
      this.loadViolations();
    }
  }

  onSearchNombreChange(value: string) {
    this.filters.search_nombre = value;
    this.searchSubject.next();
  }

  onSearchVehiculoChange(value: string) {
    this.filters.search_vehiculo = value;
    this.searchSubject.next();
  }

  get filteredViolationsList() {
    const list = ['Todas las Infracciones', ...this.leyes];
    return list.filter(v => {
      const display = v === 'Todas las Infracciones' || v === 'All Violations' ? 'Todas las Infracciones' : this.translateViolation(v);
      return display.toLowerCase().includes(this.violationSearch.toLowerCase());
    });
  }

  selectViolation(violation: string) {
    if (violation === 'Todas las Infracciones' || violation === 'All Violations') {
      this.filters.ley_transito = 'Todas las Infracciones';
    } else {
      this.filters.ley_transito = violation;
    }
    this.violationSearch = (violation === 'Todas las Infracciones' || violation === 'All Violations') ? 'Todas las Infracciones' : this.translateViolation(violation);
    this.isViolationDropdownOpen = false;
    this.applyFilters();
  }

  submitViolation() {
    console.log('submitViolation called', this.newViolation);
    this.isLoading = true;
    this.error = '';
    this.success = '';
    
    if (this.editingId) {
      // Update
      this.http.put(`http://localhost:8000/api/operativa/traffic-violations/${this.editingId}/`, this.newViolation)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.success = '¡Citación actualizada con éxito!';
            setTimeout(() => {
              this.showForm = false;
              this.success = '';
              this.newViolation = {
                ubicacion: '', latitude: '', longitude: '', ley_transito: '', monto_multa: 0, nivel_bac: 0.0, 
                limite_velocidad: 0, velocidad_registrada: 0, placa_vehiculo: '', estado_placa: '', 
                marca_vehiculo: '', modelo_vehiculo: '', anio_vehiculo: null, color_vehiculo: '', 
                licencia_conductor: '', estado_licencia: '', nombre_conductor: '', direccion_conductor: '', 
                fecha_nacimiento: '', condiciones_climaticas: '', condiciones_trafico: '', comentarios: '', evidencia_url: ''
              };
              this.loadViolations();
            }, 1500);
          },
          error: (err) => {
            console.error(err);
            this.error = err?.error?.error || err?.message || 'Error al actualizar la citación';
            this.isLoading = false;
          }
        });
    } else {
      // Create new
      const payload = {
        ...this.newViolation,
        id_oficial: this.authService.getOfficerId()
      };

      this.http.post('http://localhost:8000/api/operativa/traffic-violations/', payload)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.success = '¡Citación registrada con éxito!';
            setTimeout(() => {
              this.showForm = false;
              this.success = '';
              this.newViolation = {
                ubicacion: '', latitude: '', longitude: '', ley_transito: '', monto_multa: 0, nivel_bac: 0.0, 
                limite_velocidad: 0, velocidad_registrada: 0, placa_vehiculo: '', estado_placa: '', 
                marca_vehiculo: '', modelo_vehiculo: '', anio_vehiculo: null, color_vehiculo: '', 
                licencia_conductor: '', estado_licencia: '', nombre_conductor: '', direccion_conductor: '', 
                fecha_nacimiento: '', condiciones_climaticas: '', condiciones_trafico: '', comentarios: '', evidencia_url: ''
              };
              this.loadViolations();
            }, 1500);
          },
          error: (err) => {
            console.error('POST error:', err);
            this.error = err?.error?.error || err?.message || 'Error al guardar la citación';
            this.isLoading = false;
          }
        });
    }
  }

  editViolation(v: any) {
    this.editingId = v.id_infraccion;
    this.newViolation = { ...v };
    this.showForm = true;
  }

  viewViolation(v: any) {
    this.selectedViolation = v;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.selectedViolation = null;
    this.showDetailModal = false;
  }

  deleteViolation(id: string) {
    if (!confirm('¿Está seguro de que desea eliminar esta infracción?')) return;
    this.http.delete(`http://localhost:8000/api/operativa/traffic-violations/${id}/`)
      .subscribe({
        next: () => this.loadViolations(),
        error: (err) => console.error(err)
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.error = '';
      const formData = new FormData();
      formData.append('file', file);
      
      this.http.post<any>('http://localhost:8000/api/criminal/evidence/upload/', formData).subscribe({
        next: (res) => {
          this.newViolation.evidencia_url = res.url;
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Error uploading image', err);
          this.isUploading = false;
          this.error = 'Error al subir la imagen a Cloudinary.';
        }
      });
    }
  }

  // --- MAP LOGIC ---

  openMapModal() {
    this.showMapModal = true;
    this.isPinningLocation = false;
    this.mapSearchQuery = this.newViolation.ubicacion || '';
    this.clearMapSearch();
    setTimeout(() => {
      this.initModalMap();
    }, 150);
  }

  openNewForm() {
    this.editingId = null;
    this.newViolation = {
      ubicacion: '', latitude: '', longitude: '', ley_transito: '', monto_multa: 0, nivel_bac: 0.0, 
      limite_velocidad: 0, velocidad_registrada: 0, placa_vehiculo: '', estado_placa: '', 
      marca_vehiculo: '', modelo_vehiculo: '', anio_vehiculo: null, color_vehiculo: '', 
      licencia_conductor: '', estado_licencia: '', nombre_conductor: '', direccion_conductor: '', 
      fecha_nacimiento: '', condiciones_climaticas: '', condiciones_trafico: '', comentarios: '', evidencia_url: ''
    };
    this.showForm = true;
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

  clearMapSearch() {
    this.mapSearchQuery = '';
    this.mapSearchSuggestions = [];
    this.mapSearchError = '';
  }

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
        if (!res.ok) throw new Error('Error en el servicio de búsqueda');
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
          this.mapSearchError = 'No se encontraron resultados en Chicago.';
        }
        this.cdr.detectChanges();
      })
      .catch(err => {
        this.isSearchingMap = false;
        this.mapSearchError = 'Error al buscar en el mapa.';
        console.error(err);
        this.cdr.detectChanges();
      });
  }

  selectMapSuggestion(sug: any) {
    if (!this.map) return;
    const lat = sug.lat;
    const lng = sug.lng;
    
    this.map.flyTo([lat, lng], 17, { duration: 1.2 });
    const formatted = sug.display_name.split(',')[0] + (sug.display_name.split(',')[1] ? ', ' + sug.display_name.split(',')[1] : '');
    this.newViolation.ubicacion = formatted;
    this.newViolation.latitude = lat.toFixed(6);
    this.newViolation.longitude = lng.toFixed(6);
    this.mapSearchQuery = formatted;
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
      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    }

    this.cdr.detectChanges();
  }

  initModalMap() {
    const container = document.getElementById('modal-traffic-map');
    if (!container) return;

    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }

    const defaultLat = this.newViolation.latitude ? parseFloat(this.newViolation.latitude) : 41.8781;
    const defaultLng = this.newViolation.longitude ? parseFloat(this.newViolation.longitude) : -87.6298;

    this.map = L.map('modal-traffic-map', {
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

    if (this.newViolation.latitude && this.newViolation.longitude) {
      const latVal = parseFloat(this.newViolation.latitude);
      const lngVal = parseFloat(this.newViolation.longitude);
      if (!isNaN(latVal) && !isNaN(lngVal)) {
        this.marker = L.marker([latVal, lngVal], { icon: customIcon }).addTo(this.map);
      }
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.ngZone.run(() => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        this.newViolation.latitude = lat.toFixed(6);
        this.newViolation.longitude = lng.toFixed(6);
        this.isPinningLocation = true;

        if (this.marker) {
          this.marker.setLatLng(e.latlng);
        } else {
          this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map!);
        }

        // Reverse geocoding
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
              
              this.newViolation.ubicacion = parts.length > 0 ? parts.join(', ') : (data.display_name ? data.display_name.split(',').slice(0, 2).join(',') : `Ubicación Chicago`);
            } else {
              this.newViolation.ubicacion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            }
            this.mapSearchQuery = this.newViolation.ubicacion;
            this.cdr.detectChanges();
          })
          .catch(err => {
            console.error('Reverse geocoding error', err);
            this.newViolation.ubicacion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            this.mapSearchQuery = this.newViolation.ubicacion;
            this.cdr.detectChanges();
          });
      });
    });
  }

  translateViolation(code: string): string {
    const mapping: any = {
      'EXCESO_VELOCIDAD': 'Exceso de Velocidad',
      'CONDUCCION_TEMERARIA': 'Conducción Temeraria',
      'DUI': 'Conducción Bajo Efectos (DUI)',
      'PASAR_SEMAFORO_ROJO': 'Semáforo en Rojo',
      'SIN_LICENCIA': 'Sin Licencia de Conducir'
    };
    return mapping[code] || code;
  }
}
