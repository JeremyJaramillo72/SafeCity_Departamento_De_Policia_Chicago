import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar';
import * as L from 'leaflet';

@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent],
  templateUrl: './logistics.html',
})
export class LogisticsComponent implements OnInit, OnDestroy {
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
  activeTab: 'vehicles' | 'officers' | 'patrols' = 'vehicles';

  // Vehicles CRUD State
  vehicles: any[] = [];
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
  showOfficerModal = false;
  isEditingOfficer = false;
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
  showShiftModal = false;
  isEditingShift = false;
  currentShift: any = {
    id_oficial: 0,
    id_vehiculo: 0,
    fecha_turno: '',
    hora_inicio: '08:00',
    hora_fin: '16:00',
    ruta_coordenadas: '[]'
  };
  isSavingShift = false;

  // Leaflet Map State
  private map: L.Map | undefined;
  private routePolyline: L.Polyline | undefined;
  private previewPolyline: L.Polyline | undefined;
  private drawMarkers: L.Layer[] = [];
  private shiftMarkers: L.Layer[] = [];
  selectedShiftId: number | null = null;
  drawingMode = false;
  drawnCoordinates: [number, number][] = [];

  constructor(
    private authService: AuthService, 
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    if (this.profile !== 'administrador') {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadLogistics();
    this.loadVehicles();
    this.loadOfficers();
    this.loadPatrolShifts();
  }

  ngOnDestroy() {
    this.destroyMap();
  }

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  // Tab switcher
  setActiveTab(tab: 'vehicles' | 'officers' | 'patrols') {
    this.activeTab = tab;
    if (tab === 'patrols') {
      setTimeout(() => this.initMap(), 150);
    } else {
      this.destroyMap();
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

  // ==========================================
  // VEHICLES CRUD METHODS
  // ==========================================
  loadVehicles() {
    this.dataService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (err) => console.error('Error loading vehicles:', err)
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

  deleteVehicle(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de eliminar este vehículo de la flota?')) {
      this.dataService.deleteVehicle(id).subscribe({
        next: () => {
          this.loadVehicles();
          this.loadLogistics();
        },
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // OFFICERS CRUD METHODS
  // ==========================================
  loadOfficers() {
    this.dataService.getOfficers().subscribe({
      next: (data) => {
        this.officers = data;
      },
      error: (err) => console.error('Error loading officers:', err)
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
    if (confirm('¿Está seguro de eliminar este oficial del sistema?')) {
      this.dataService.deleteOfficer(id).subscribe({
        next: () => {
          this.loadOfficers();
          this.loadLogistics();
        },
        error: (err) => console.error(err)
      });
    }
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
      id_oficial: this.officers[0]?.id_oficial || 0,
      id_vehiculo: this.vehicles[0]?.id_vehiculo || 0,
      fecha_turno: new Date().toISOString().split('T')[0],
      hora_inicio: '08:00',
      hora_fin: '16:00',
      ruta_coordenadas: '[]'
    };
    this.drawnCoordinates = [];
    this.drawingMode = false;
    this.showShiftModal = true;
    setTimeout(() => this.startRouteDrawing(), 200);
  }

  openEditShiftModal(shift: any) {
    this.isEditingShift = true;
    this.currentShift = { ...shift };
    this.showShiftModal = true;
    
    // Parse existing coordinates
    try {
      this.drawnCoordinates = JSON.parse(shift.ruta_coordenadas || '[]');
    } catch (e) {
      this.drawnCoordinates = [];
    }
    
    this.drawingMode = false;
    setTimeout(() => this.startRouteDrawing(), 200);
  }

  closeShiftModal() {
    this.showShiftModal = false;
    this.stopRouteDrawing();
    this.loadPatrolShifts(); // Refresh map overlays
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
    if (confirm('¿Está seguro de eliminar esta patrulla/turno asignado?')) {
      this.dataService.deletePatrolShift(id).subscribe({
        next: () => {
          this.loadPatrolShifts();
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

  // ==========================================
  // LEAFLET PATROL ROUTE MAP LOGIC
  // ==========================================
  private initMap(retryCount = 0) {
    const container = document.getElementById('patrol-route-map');
    if (!container) {
      if (retryCount < 10) {
        setTimeout(() => this.initMap(retryCount + 1), 100);
      } else {
        console.error('Patrol Route Map container not found after retries');
      }
      return;
    }

    this.destroyMap();

    // Clean up _leaflet_id to prevent Leaflet container duplicate initialization crashes
    try {
      (container as any)._leaflet_id = null;
    } catch (e) {}

    this.map = L.map('patrol-route-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([41.8781, -87.6298], 11);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Beautiful premium dark tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    // Setup map click listener for route drawing
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.drawingMode) {
        this.addWaypoint(e.latlng.lat, e.latlng.lng);
      }
    });

    this.loadPatrolShifts();
  }

  private destroyMap() {
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

  // Draw routes for all active shifts on the map in a subtle format
  private drawAllActiveShiftsOnMap() {
    if (!this.map) return;

    // Clear existing shift markers & lines
    this.shiftMarkers.forEach(m => this.map!.removeLayer(m));
    this.shiftMarkers = [];

    // Also clear existing preview polyline if active
    if (this.previewPolyline) {
      this.map.removeLayer(this.previewPolyline);
      this.previewPolyline = undefined;
    }

    this.patrolShifts.forEach(shift => {
      try {
        const coords: [number, number][] = JSON.parse(shift.ruta_coordenadas || '[]');
        if (coords.length > 0) {
          // Draw a nice subtle blue polyline for this shift's route by default
          if (coords.length > 1) {
            const shiftPolyline = L.polyline(coords, {
              color: '#3b82f6',
              weight: 3.5,
              opacity: 0.5,
              lineJoin: 'round'
            }).addTo(this.map!);
            this.shiftMarkers.push(shiftPolyline);
          }

          const firstPoint = coords[0];
          
          // Custom SVG icon for police vehicle marker
          const policeIcon = L.divIcon({
            html: `
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary text-primary shadow-[0_0_8px_rgba(6,182,212,0.5)] animate-pulse">
                <span class="material-symbols-outlined text-[18px]">local_police</span>
              </div>
            `,
            className: 'custom-leaflet-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker(firstPoint, { icon: policeIcon }).addTo(this.map!);
          marker.bindTooltip(`
            <div class="bg-surface p-2 rounded shadow-md text-on-surface text-body-sm font-body-sm border border-outline-variant font-semibold">
              <strong>Ofc. ${shift.officer_name}</strong><br>
              Placa: ${shift.vehicle_plate}<br>
              Beat: ${shift.beat}<br>
              Horario: ${shift.hora_inicio} - ${shift.hora_fin}
            </div>
          `, { permanent: false, direction: 'top' });

          this.shiftMarkers.push(marker);
        }
      } catch (e) {
        console.error('Error drawing active shift marker:', e);
      }
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
}
