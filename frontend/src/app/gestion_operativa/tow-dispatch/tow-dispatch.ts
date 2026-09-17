import { RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-tow-dispatch',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './tow-dispatch.html',
  styleUrls: ['../incident-form.css']
})
export class TowDispatchComponent implements OnInit, OnDestroy {
  showProfileDropdown = false;
  profile: string | null = '';
  showForm = false;

  dispatches: any[] = [];
  filteredDispatches: any[] = [];
  sortField = '';
  sortAscending = true;
  showKpis = true;

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  get totalDispatchesCount(): number {
    return this.dispatches.length;
  }

  get pendingDispatchesCount(): number {
    return this.dispatches.filter(d => d.estado === 'Pendiente' || d.estado === 'Pending').length;
  }

  get inTransitDispatchesCount(): number {
    return this.dispatches.filter(d => d.estado === 'En Camino' || d.estado === 'In Transit' || d.estado === 'Asignado').length;
  }

  get completedDispatchesCount(): number {
    return this.dispatches.filter(d => d.estado === 'Completado' || d.estado === 'Completed').length;
  }
  filters = {
    search_location: '',
    estado: 'All',
    date_range: 'All Time'
  };
  newDispatch = {
    ubicacion: '',
    motivo: '',
    placa_vehiculo: '',
    marca_modelo: '',
    prioridad: 'Media',
    tipo_grua: 'Plataforma',
    comentarios: '',
    evidencia_url: ''
  };
  isUploading = false;

  selectedDispatch: any = null;
  showDetailModal = false;
  editingId: string | null = null;

  loading = false;
  isLoading = false;
  error = '';
  success = '';

  // Map properties
  map: L.Map | undefined;
  marker: L.Marker | undefined;
  showMapModal = false;
  mapSearchQuery = '';
  mapSearchResults: any[] = [];
  isSearchingMap = false;
  isPinningLocation = false;
  selectedLat = '';
  selectedLng = '';
  private searchTimeout: any;

  constructor(
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    this.loadDispatches();
  }

  ngOnDestroy() {
  }

  loadDispatches() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8000/api/operativa/tow-dispatch/').subscribe({
      next: (data) => {
        this.dispatches = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tow dispatches', err);
        this.error = 'Error al cargar los datos';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredDispatches = this.dispatches.filter(d => {
      const matchLocation = !this.filters.search_location || (d.ubicacion && d.ubicacion.toLowerCase().includes(this.filters.search_location.toLowerCase())) || (d.id_despacho && d.id_despacho.toLowerCase().includes(this.filters.search_location.toLowerCase()));
      const matchEstado = !this.filters.estado || ['ALL', 'TODOS', 'TODAS', 'TODOS LOS ESTADOS'].includes(this.filters.estado.toUpperCase()) || d.estado === this.filters.estado;
      
      let matchDate = true;
      if (this.filters.date_range && !['ALL TIME', 'TODO EL TIEMPO', 'TODO'].includes(this.filters.date_range.toUpperCase())) {
        const dDate = new Date(d.fecha_hora);
        const now = new Date();
        const diffHours = (now.getTime() - dDate.getTime()) / (1000 * 60 * 60);
        if (this.filters.date_range === '24h') matchDate = diffHours <= 24;
        else if (this.filters.date_range === '7d') matchDate = diffHours <= 24 * 7;
        else if (this.filters.date_range === '30d') matchDate = diffHours <= 24 * 30;
      }
      return matchLocation && matchEstado && matchDate;
    });
    this.applySort();
  }

  sortDispatches(field: string) {
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
    this.filteredDispatches.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_hora') {
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

  openNewForm() {
    this.showForm = true;
    this.error = '';
    this.success = '';
    this.newDispatch = {
      ubicacion: '',
      motivo: '',
      placa_vehiculo: '',
      marca_modelo: '',
      prioridad: 'Media',
      tipo_grua: 'Plataforma',
      comentarios: '',
      evidencia_url: ''
    };
  }

  closeForm() {
    this.showForm = false;
    this.selectedLat = '';
    this.selectedLng = '';
    this.editingId = null;
    this.newDispatch = {
      ubicacion: '',
      motivo: '',
      placa_vehiculo: '',
      marca_modelo: '',
      prioridad: 'Media',
      tipo_grua: 'Plataforma',
      comentarios: '',
      evidencia_url: ''
    };
  }

  editDispatch(dispatch: any) {
    this.selectedLat = '';
    this.selectedLng = '';
    this.editingId = dispatch.id_despacho;
    this.newDispatch = { ...dispatch };
    this.showForm = true;
  }

  submitDispatch() {
    this.error = '';
    this.success = '';
    
    if (!this.newDispatch.ubicacion || !this.newDispatch.motivo) {
        this.error = 'Por favor complete todos los campos obligatorios.';
        return;
    }

    if (this.editingId) {
      // Update
      this.http.put(`http://localhost:8000/api/operativa/tow-dispatch/${this.editingId}/`, this.newDispatch).subscribe({
        next: (res) => {
          this.success = '¡Despacho de grúa actualizado con éxito!';
          setTimeout(() => {
            this.closeForm();
            this.loadDispatches();
          }, 1500);
        },
        error: (err) => {
          console.error('Error updating tow dispatch', err);
          this.error = 'Error al actualizar la solicitud de despacho.';
        }
      });
    } else {
      // Create new
      this.http.post('http://localhost:8000/api/operativa/tow-dispatch/', this.newDispatch).subscribe({
        next: (res) => {
          this.success = '¡Despacho de grúa solicitado con éxito!';
          setTimeout(() => {
            this.closeForm();
            this.loadDispatches();
          }, 1500);
        },
        error: (err) => {
          console.error('Error creating tow dispatch', err);
          this.error = 'Error al crear la solicitud de despacho.';
        }
      });
    }
  }

  createDispatch() {
    this.submitDispatch();
  }

  resetForm() {
    this.closeForm();
  }

  viewDispatch(dispatch: any) {
    this.selectedDispatch = dispatch;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedDispatch = null;
  }

  deleteDispatch(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar este informe de despacho de grúa?')) {
      this.http.delete(`http://localhost:8000/api/operativa/tow-dispatch/${id}/`).subscribe({
        next: () => {
          this.success = 'Informe de despacho eliminado con éxito';
          this.loadDispatches();
          setTimeout(() => this.success = '', 2500);
        },
        error: (err) => {
          console.error('Error deleting tow dispatch', err);
          this.error = 'No se pudo eliminar el informe de despacho.';
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  // --- Leaflet Map Methods ---
  openMapModal() {
    this.showMapModal = true;
    this.isPinningLocation = false;
    this.mapSearchQuery = this.newDispatch.ubicacion || '';
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

  private initMap(): void {
    const mapElement = document.getElementById('modal-tow-map');
    if (!mapElement) return;

    if (this.map) {
      this.map.remove();
      this.marker = undefined;
    }

    const defaultLat = this.selectedLat ? parseFloat(this.selectedLat) : 41.8781;
    const defaultLng = this.selectedLng ? parseFloat(this.selectedLng) : -87.6298;
    
    this.map = L.map('modal-tow-map', {
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

    if (this.selectedLat && this.selectedLng) {
      this.setMarker(defaultLat, defaultLng, this.newDispatch.ubicacion);
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
    
    this.selectedLat = lat.toFixed(6);
    this.selectedLng = lng.toFixed(6);

    if (address) {
      this.newDispatch.ubicacion = address;
    } else {
      this.newDispatch.ubicacion = 'Identifying address...';
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
              
              this.newDispatch.ubicacion = parts.length > 0 ? parts.join(', ') : (result.display_name ? result.display_name.split(',').slice(0, 2).join(',') : `Chicago Location`);
            } else if (result && result.display_name) {
              this.newDispatch.ubicacion = result.display_name.split(',').slice(0, 2).join(',');
            } else {
              this.newDispatch.ubicacion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            }
            this.mapSearchQuery = this.newDispatch.ubicacion;
          },
          error: (err) => {
            console.error('Error reverse geocoding', err);
            this.newDispatch.ubicacion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            this.mapSearchQuery = this.newDispatch.ubicacion;
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
    this.newDispatch.ubicacion = formatted;
    this.mapSearchQuery = formatted;
    this.selectedLat = lat.toFixed(6);
    this.selectedLng = lon.toFixed(6);
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
          this.newDispatch.evidencia_url = res.url;
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
}
