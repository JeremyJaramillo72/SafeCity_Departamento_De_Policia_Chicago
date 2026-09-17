import { RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-traffic-accidents',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './traffic-accidents.html'
})
export class TrafficAccidentsComponent implements OnInit, OnDestroy {
  showProfileDropdown = false;
  profile: string | null = '';
  showForm = false;
  editingId: string | null = null;

  accidents: any[] = [];
  filteredAccidents: any[] = [];
  sortField = '';
  sortAscending = true;
  showKpis = true;

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  get totalAccidentsCount(): number {
    return this.accidents.length;
  }

  get fatalAccidentsCount(): number {
    return this.accidents.filter(a => Number(a.fallecidos) > 0 || (a.gravedad && a.gravedad.toUpperCase() === 'FATAL')).length;
  }

  get injuriesAccidentsCount(): number {
    return this.accidents.reduce((sum, a) => sum + (Number(a.heridos) || 0), 0);
  }

  get totalVehiclesInvolved(): number {
    return this.accidents.reduce((sum, a) => sum + (Number(a.vehiculos_involucrados) || 1), 0);
  }
  filters = {
    search_location: '',
    gravedad: 'All',
    date_range: 'All Time'
  };
  newAccident: any = {
    ubicacion: '',
    latitud: '',
    longitud: '',
    gravedad: 'Leve',
    vehiculos_involucrados: 1,
    heridos: 0,
    fallecidos: 0,
    causa_probable: '',
    vehiculos_detalle: [],
    heridos_detalle: [],
    evidencia_url: ''
  };
  isUploading = false;

  selectedAccident: any = null;
  showDetailModal = false;
  imageLoadError = false;

  showMapModal = false;
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  mapSearchQuery = '';
  mapSearchResults: any[] = [];
  isSearchingMap = false;
  isPinningLocation = false;
  private searchTimeout: any;

  loading = false;
  error = '';
  success = '';

  constructor(
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    this.loadAccidents();
  }

  ngOnDestroy() {
  }

  viewAccident(acc: any) {
    this.selectedAccident = acc;
    this.showDetailModal = true;
    this.imageLoadError = false;
    
    if (typeof this.selectedAccident.vehiculos_detalle === 'string') {
      try {
        this.selectedAccident.parsed_vehiculos = JSON.parse(this.selectedAccident.vehiculos_detalle);
      } catch (e) {
        this.selectedAccident.parsed_vehiculos = [];
      }
    } else {
      this.selectedAccident.parsed_vehiculos = this.selectedAccident.vehiculos_detalle || [];
    }

    if (typeof this.selectedAccident.heridos_detalle === 'string') {
      try {
        this.selectedAccident.parsed_heridos = JSON.parse(this.selectedAccident.heridos_detalle);
      } catch (e) {
        this.selectedAccident.parsed_heridos = [];
      }
    } else {
      this.selectedAccident.parsed_heridos = this.selectedAccident.heridos_detalle || [];
    }
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedAccident = null;
    this.imageLoadError = false;
  }

  onImageError(event: Event) {
    this.imageLoadError = true;
    console.error('[SafeCity] Image load failed for URL:', this.selectedAccident?.evidencia_url);
  }

  deleteAccident(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar este registro de accidente?')) {
      this.http.delete(`http://localhost:8000/api/operativa/traffic-accidents/${id}/`).subscribe({
        next: () => {
          this.success = 'Accidente eliminado con éxito';
          this.loadAccidents();
          setTimeout(() => this.success = '', 2500);
        },
        error: (err) => {
          console.error('Error deleting traffic accident', err);
          this.error = 'No se pudo eliminar el accidente.';
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  loadAccidents() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8000/api/operativa/traffic-accidents/').subscribe({
      next: (data) => {
        this.accidents = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading traffic accidents', err);
        this.error = 'Error al cargar los datos';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredAccidents = this.accidents.filter(acc => {
      const matchLocation = !this.filters.search_location || (acc.ubicacion && acc.ubicacion.toLowerCase().includes(this.filters.search_location.toLowerCase()));
      const matchGravedad = !this.filters.gravedad || ['ALL', 'TODOS', 'TODAS', 'TODAS LAS GRAVEDADES'].includes(this.filters.gravedad.toUpperCase()) || acc.gravedad === this.filters.gravedad;
      
      let matchDate = true;
      if (this.filters.date_range && !['ALL TIME', 'TODO EL TIEMPO', 'TODO'].includes(this.filters.date_range.toUpperCase())) {
        const accDate = new Date(acc.fecha_hora);
        const now = new Date();
        const diffHours = (now.getTime() - accDate.getTime()) / (1000 * 60 * 60);
        if (this.filters.date_range === '24h') matchDate = diffHours <= 24;
        else if (this.filters.date_range === '7d') matchDate = diffHours <= 24 * 7;
        else if (this.filters.date_range === '30d') matchDate = diffHours <= 24 * 30;
      }
      return matchLocation && matchGravedad && matchDate;
    });
    this.applySort();
  }

  sortAccidents(field: string) {
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
    this.filteredAccidents.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_hora') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (field === 'vehiculos_involucrados' || field === 'heridos' || field === 'fallecidos') {
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

  openNewForm() {
    this.showForm = true;
    this.error = '';
    this.success = '';
    this.newAccident = {
      ubicacion: '',
      latitud: '',
      longitud: '',
      gravedad: 'Leve',
      vehiculos_involucrados: 1,
      heridos: 0,
      fallecidos: 0,
      causa_probable: '',
      vehiculos_detalle: [],
      heridos_detalle: [],
      evidencia_url: ''
    };
  }

  openMapModal() {
    this.showMapModal = true;
    this.isPinningLocation = false;
    this.mapSearchQuery = this.newAccident.ubicacion || '';
    setTimeout(() => this.initMap(), 100);
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

  closeForm() {
    this.showForm = false;
    this.editingId = null;
    this.newAccident = {
      ubicacion: '',
      latitud: '',
      longitud: '',
      gravedad: 'Leve',
      vehiculos_involucrados: 1,
      heridos: 0,
      fallecidos: 0,
      causa_probable: '',
      vehiculos_detalle: [],
      heridos_detalle: [],
      evidencia_url: ''
    };
  }

  editAccident(acc: any) {
    this.editingId = acc.id_accidente;
    let vehs = acc.vehiculos_detalle;
    if (typeof vehs === 'string') {
      try { vehs = JSON.parse(vehs); } catch (e) { vehs = []; }
    }
    let heridos = acc.heridos_detalle;
    if (typeof heridos === 'string') {
      try { heridos = JSON.parse(heridos); } catch (e) { heridos = []; }
    }
    this.newAccident = {
      ...acc,
      vehiculos_detalle: vehs ? [...vehs] : [],
      heridos_detalle: heridos ? [...heridos] : []
    };
    this.showForm = true;
  }

  submitAccident() {
    this.error = '';
    this.success = '';
    
    if (!this.newAccident.ubicacion || !this.newAccident.gravedad) {
        this.error = 'Por favor complete todos los campos obligatorios.';
        return;
    }

    if (this.editingId) {
      // Update
      this.http.put(`http://localhost:8000/api/operativa/traffic-accidents/${this.editingId}/`, this.newAccident).subscribe({
        next: (res) => {
          this.success = '¡Accidente de tránsito actualizado con éxito!';
          setTimeout(() => {
            this.closeForm();
            this.loadAccidents();
          }, 1500);
        },
        error: (err) => {
          console.error('Error updating traffic accident', err);
          this.error = 'Error al actualizar el accidente de tránsito.';
        }
      });
    } else {
      // Create
      this.http.post('http://localhost:8000/api/operativa/traffic-accidents/', this.newAccident).subscribe({
        next: (res) => {
          this.success = '¡Accidente de tránsito registrado con éxito!';
          setTimeout(() => {
            this.closeForm();
            this.loadAccidents();
          }, 1500);
        },
        error: (err) => {
          console.error('Error recording traffic accident', err);
          this.error = 'Error al registrar el accidente de tránsito.';
        }
      });
    }
  }

  // --- Dynamic Form Array Methods ---
  addVehiculo() {
    this.newAccident.vehiculos_detalle.push({
      placa: '', marca: '', color: '', identificacion_conductor: '', conductor: ''
    });
    this.newAccident.vehiculos_involucrados = this.newAccident.vehiculos_detalle.length;
  }

  removeVehiculo(index: number) {
    this.newAccident.vehiculos_detalle.splice(index, 1);
    this.newAccident.vehiculos_involucrados = this.newAccident.vehiculos_detalle.length;
  }

  addHerido() {
    this.newAccident.heridos_detalle.push({
      nombre: '', identificacion: '', edad: null, genero: '', condicion: 'Leve', trasladado_hospital: false, ubicacion_traslado: ''
    });
    this.updateVictimCounters();
  }

  removeHerido(index: number) {
    this.newAccident.heridos_detalle.splice(index, 1);
    this.updateVictimCounters();
  }

  updateVictimCounters() {
    this.newAccident.fallecidos = this.newAccident.heridos_detalle.filter((h: any) => h.condicion === 'Fallecido').length;
    // Heridos are those who are not 'Fallecido'
    this.newAccident.heridos = this.newAccident.heridos_detalle.filter((h: any) => h.condicion !== 'Fallecido').length;
  }

  // --- Leaflet Map Methods ---
  private initMap(): void {
    const mapElement = document.getElementById('modal-accident-map');
    if (!mapElement) return;

    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }

    const defaultLat = this.newAccident.latitud ? parseFloat(this.newAccident.latitud.toString()) : 41.8781;
    const defaultLng = this.newAccident.longitud ? parseFloat(this.newAccident.longitud.toString()) : -87.6298;
    
    this.map = L.map('modal-accident-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([defaultLat, defaultLng], 12);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
      this.isPinningLocation = true;
    });

    if (this.newAccident.latitud && this.newAccident.longitud) {
      this.setMarker(defaultLat, defaultLng, this.newAccident.ubicacion);
    }
  }

  private setMarker(lat: number, lng: number, address?: string): void {
    if (!this.map) return;
    
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
    
    this.newAccident.latitud = lat.toFixed(6);
    this.newAccident.longitud = lng.toFixed(6);

    if (address) {
      this.newAccident.ubicacion = address;
    } else {
      this.newAccident.ubicacion = 'Identifying address...';
      this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&email=safecity.project@gmail.com`)
        .subscribe({
          next: (result) => {
            if (result && result.address) {
              const road = result.address.road || result.address.pedestrian || result.address.suburb || '';
              const houseNumber = result.address.house_number || '';
              const neighbourhood = result.address.neighbourhood || result.address.city_district || '';
              
              let parts = [];
              if (road) parts.push(houseNumber ? `${houseNumber} ${road}` : road);
              if (neighbourhood) parts.push(neighbourhood);
              
              this.newAccident.ubicacion = parts.length > 0 ? parts.join(', ') : (result.display_name ? result.display_name.split(',').slice(0, 2).join(',') : `Chicago Location`);
            } else if (result && result.display_name) {
              this.newAccident.ubicacion = result.display_name.split(',').slice(0, 2).join(',');
            } else {
              this.newAccident.ubicacion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            }
            this.mapSearchQuery = this.newAccident.ubicacion;
          },
          error: (err) => {
            console.error('Error reverse geocoding', err);
            this.newAccident.ubicacion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            this.mapSearchQuery = this.newAccident.ubicacion;
          }
        });
    }
  }

  onSearchQueryChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.searchLocation();
    }, 400);
  }

  searchLocation() {
    if (!this.mapSearchQuery || this.mapSearchQuery.trim().length < 3) {
      this.mapSearchResults = [];
      return;
    }
    this.isSearchingMap = true;
    
    let query = this.mapSearchQuery.trim();
    if (!query.toLowerCase().includes('chicago')) {
      query += ', Chicago, IL';
    }

    this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
      .subscribe({
        next: (results) => {
          this.mapSearchResults = results || [];
          this.isSearchingMap = false;
        },
        error: (err) => {
          console.error('Error searching location', err);
          this.isSearchingMap = false;
        }
      });
  }

  clearMapSearch() {
    this.mapSearchQuery = '';
    this.mapSearchResults = [];
  }

  selectLocation(result: any) {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    const formatted = result.display_name.split(',')[0] + (result.display_name.split(',')[1] ? ', ' + result.display_name.split(',')[1] : '');
    this.newAccident.ubicacion = formatted;
    this.mapSearchQuery = formatted;
    this.newAccident.latitud = lat.toFixed(6);
    this.newAccident.longitud = lon.toFixed(6);
    this.isPinningLocation = true;
    this.mapSearchResults = [];
    
    if (this.map) {
      this.map.flyTo([lat, lon], 17, { duration: 1.2 });
      this.setMarker(lat, lon, formatted);
    }
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
          this.newAccident.evidencia_url = res.url;
          this.isUploading = false;
        },
        error: (err) => {
          console.error('[SafeCity] Cloudinary upload error:', err);
          this.isUploading = false;
          this.error = 'Error al subir la imagen a Cloudinary. Verifique su conexión e intente nuevamente.';
          if (err.error?.error) {
            this.error += ` Detalle: ${err.error.error}`;
          }
        }
      });
    }
  }
}
