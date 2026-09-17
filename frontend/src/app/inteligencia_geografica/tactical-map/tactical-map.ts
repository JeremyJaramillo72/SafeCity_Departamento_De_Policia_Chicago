import { RouterLink } from '@angular/router';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import { IncidentService } from '../../gestion_operativa/services/incident.service';
import { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';
import { PredictionService, PredictiveTrendsResponse } from '../services/prediction.service';
import Chart from 'chart.js/auto';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as L from 'leaflet';
import { heatLayer } from './leaflet-heat';

// Extend Leaflet's type definition to include heatLayer
declare module 'leaflet' {
  function heatLayer(latlngs: any[], options?: any): any;
}

@Component({
  selector: 'app-tactical-map',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './tactical-map.html',
  styleUrls: ['./tactical-map.css']
})
export class TacticalMapComponent implements OnInit, AfterViewInit, OnDestroy {
  showProfileDropdown = false;
  private map: L.Map | undefined;
  isLoading = true;
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private dataLayer: any; // Keep reference to current heatmap/markers layer to remove it

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = 0; // 0 = All months
  availableYears: number[] = [];
  months: {value: number, label: string}[] = [
    {value: 0, label: 'Todos los Meses'},
    {value: 1, label: 'Enero'}, {value: 2, label: 'Febrero'},
    {value: 3, label: 'Marzo'}, {value: 4, label: 'Abril'},
    {value: 5, label: 'Mayo'}, {value: 6, label: 'Junio'},
    {value: 7, label: 'Julio'}, {value: 8, label: 'Agosto'},
    {value: 9, label: 'Septiembre'}, {value: 10, label: 'Octubre'},
    {value: 11, label: 'Noviembre'}, {value: 12, label: 'Diciembre'}
  ];

  // Tactical General search & layer mode variables
  mapMode: 'heat' | 'markers' = 'heat';
  baseMapMode: 'dark' | 'satellite' = 'satellite';
  showDistricts = false;

  mapSearchQuery = '';
  mapSearchSuggestions: any[] = [];
  isSearchingMap = false;
  mapSearchError = '';
  private searchMarker: L.Marker | undefined;
  private searchTimeout: any;

  showPredictiveMode = false;
  predictiveData: PredictiveTrendsResponse | null = null;
  predictiveChart: any;

  // Patrols
  private patrolSimulations: {
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
  private simulationInterval: any;
  private shiftMarkers: L.Layer[] = [];

  private darkTileLayer: any;
  private satelliteTileLayer: any;
  private districtsLayer: any;
  private districtBadgesLayer = L.layerGroup();

  constructor(public authService: AuthService, private dataService: IncidentService, private logisticsService: LogisticsService, private predictionService: PredictionService) {}

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let y = 2001; y <= currentYear; y++) {
      this.availableYears.push(y);
    }
    
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.map) {
        this.loadCrimeData();
      }
    });
    this.loadActivePatrols();
  }

  ngAfterViewInit() {
    // Small timeout ensures the DOM element is fully rendered before Leaflet mounts
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy() {
    this.stopSimulationLoop();
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  onSearchChange(value: string) {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  onPeriodFilterChange() {
    if (this.map) {
      this.loadCrimeData();
    }
  }

  setMapMode(mode: 'heat' | 'markers') {
    this.mapMode = mode;
    this.loadCrimeData();
  }

  setBaseMapMode(mode: 'dark' | 'satellite') {
    if (!this.map) return;
    this.baseMapMode = mode;
    if (mode === 'satellite') {
      if (this.map.hasLayer(this.darkTileLayer)) {
        this.map.removeLayer(this.darkTileLayer);
      }
      this.satelliteTileLayer.addTo(this.map);
    } else {
      if (this.map.hasLayer(this.satelliteTileLayer)) {
        this.map.removeLayer(this.satelliteTileLayer);
      }
      this.darkTileLayer.addTo(this.map);
    }
  }

  togglePredictiveMode() {
    this.showPredictiveMode = !this.showPredictiveMode;
    if (this.showPredictiveMode) {
      if (!this.predictiveData) {
        this.isLoading = true;
        this.predictionService.getPredictiveTrends().subscribe({
          next: (res) => {
            this.predictiveData = res;
            this.isLoading = false;
            setTimeout(() => this.renderPredictiveChart(), 100);
          },
          error: (err) => {
            console.error('Error fetching predictive trends:', err);
            this.isLoading = false;
          }
        });
      } else {
        setTimeout(() => this.renderPredictiveChart(), 100);
      }
    } else {
      if (this.predictiveChart) {
        this.predictiveChart.destroy();
        this.predictiveChart = null;
      }
    }
  }

  renderPredictiveChart() {
    if (!this.predictiveData) return;
    const canvas = document.getElementById('predictiveChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    if (this.predictiveChart) {
      this.predictiveChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const histLen = this.predictiveData.historical.actual.length;
    
    const combinedLabels = [...this.predictiveData.historical.labels, ...this.predictiveData.forecast.labels];
    const actualData = [...this.predictiveData.historical.actual, ...Array(this.predictiveData.forecast.labels.length).fill(null)];
    const trendData = [...this.predictiveData.historical.trend, ...Array(this.predictiveData.forecast.labels.length).fill(null)];
    
    const lastTrendVal = this.predictiveData.historical.trend[histLen - 1];
    const forecastData = [
      ...Array(histLen - 1).fill(null),
      lastTrendVal,
      ...this.predictiveData.forecast.predicted
    ];

    this.predictiveChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: combinedLabels,
        datasets: [
          {
            label: 'Incidentes Históricos',
            data: actualData,
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 1
          },
          {
            label: 'Tendencia (Fit)',
            data: trendData,
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: 'Proyección IA (12 meses)',
            data: forecastData,
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            borderDash: [5, 5],
            fill: true,
            tension: 0.3,
            pointRadius: 2,
            pointBackgroundColor: '#f43f5e'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#cbd5e1', font: { family: 'Inter', size: 10 } }
          }
        },
        scales: {
          x: { ticks: { color: '#64748b', maxRotation: 45, minRotation: 45, font: { size: 9 } }, grid: { color: '#334155' } },
          y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: '#334155' }, beginAtZero: true }
        }
      }
    });
  }

  toggleDistricts() {
    if (!this.map) return;
    this.showDistricts = !this.showDistricts;
    
    if (this.showDistricts) {
      if (this.districtsLayer) {
        this.districtsLayer.addTo(this.map);
        this.districtBadgesLayer.addTo(this.map);
      } else {
        this.isLoading = true;
        // Fetch geojson from Chicago Open Data API
        fetch('https://data.cityofchicago.org/resource/9vmg-9p8p.geojson')
          .then(res => {
            if (!res.ok) throw new Error('Cargado fallido');
            return res.json();
          })
          .then(geoJsonData => {
            this.isLoading = false;
            
            // Clear any existing badges
            this.districtBadgesLayer.clearLayers();

            this.districtsLayer = L.geoJSON(geoJsonData, {
              filter: (feature: any) => {
                // Keep only Polygon and MultiPolygon geometries to eliminate point-based rendering/lag
                const type = feature?.geometry?.type;
                return type === 'Polygon' || type === 'MultiPolygon';
              },
              style: {
                color: '#3b82f6', // Premium blue district outline
                weight: 2,
                opacity: 0.6,
                fillColor: '#3b82f6',
                fillOpacity: 0.08
              },
              onEachFeature: (feature: any, layer: any) => {
                if (feature.properties && feature.properties.dist_num) {
                  // Bind tactical tooltip on hover
                  layer.bindTooltip(`Distrito ${feature.properties.dist_num}`, {
                    sticky: true,
                    className: 'district-tooltip'
                  });

                  // Calculate polygon centroid to place a clean glassmorphic label badge
                  if (typeof layer.getBounds === 'function') {
                    const center = layer.getBounds().getCenter();
                    const badgeIcon = L.divIcon({
                      html: `
                        <div class="flex items-center justify-center w-7 h-7 rounded-full bg-slate-950/90 border border-blue-500 font-mono text-[10px] font-black text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)] select-none transition-transform hover:scale-110">
                          ${feature.properties.dist_num}
                        </div>
                      `,
                      className: 'district-center-badge',
                      iconSize: [28, 28],
                      iconAnchor: [14, 14]
                    });

                    const districtBadge = L.marker(center, {
                      icon: badgeIcon,
                      interactive: false
                    });
                    
                    this.districtBadgesLayer.addLayer(districtBadge);
                  }
                }
              }
            });

            if (this.showDistricts) {
              this.districtsLayer.addTo(this.map!);
              this.districtBadgesLayer.addTo(this.map!);
            }
          })
          .catch(err => {
            this.isLoading = false;
            console.error('Error loading district boundaries:', err);
          });
      }
    } else {
      if (this.districtsLayer && this.map.hasLayer(this.districtsLayer)) {
        this.map.removeLayer(this.districtsLayer);
      }
      if (this.map.hasLayer(this.districtBadgesLayer)) {
        this.map.removeLayer(this.districtBadgesLayer);
      }
    }
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
        if (!res.ok) throw new Error('Error in search service');
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
      })
      .catch(err => {
        this.isSearchingMap = false;
        this.mapSearchError = 'Error al buscar en el mapa.';
        console.error(err);
      });
  }

  selectMapSuggestion(sug: any) {
    if (!this.map) return;
    
    const lat = sug.lat;
    const lng = sug.lng;
    
    this.map.setView([lat, lng], 16);
    
    if (this.searchMarker) {
      this.searchMarker.setLatLng([lat, lng]);
    } else {
      this.searchMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          html: '<span class="material-symbols-outlined text-primary text-3xl notranslate" translate="no" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5))">location_on</span>',
          className: 'custom-search-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        })
      }).addTo(this.map);
    }
    
    this.mapSearchSuggestions = [];
    this.mapSearchQuery = sug.display_name.split(',')[0] + ', ' + sug.display_name.split(',')[1];
  }

  clearMapSearch() {
    this.mapSearchQuery = '';
    this.mapSearchSuggestions = [];
    this.mapSearchError = '';
    if (this.map && this.searchMarker) {
      this.map.removeLayer(this.searchMarker);
      this.searchMarker = undefined;
    }
  }

  private initMap() {
    const container = document.getElementById('tactical-map-container');
    if (!container) {
      console.error('Tactical map container not found');
      return;
    }

    this.map = L.map('tactical-map-container', {
      zoomControl: false,
      attributionControl: false
    }).setView([41.8781, -87.6298], 11);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Define Tile Layers
    this.darkTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      className: 'tactical-dark-tiles',
      maxZoom: 19
    });

    this.satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 20
    });

    // Add default tile layer
    if (this.baseMapMode === 'satellite') {
      this.satelliteTileLayer.addTo(this.map);
    } else {
      this.darkTileLayer.addTo(this.map);
    }

    this.loadCrimeData();
  }

  private loadCrimeData() {
    this.isLoading = true;
    const params: any = { search: this.searchQuery };
    if (this.selectedYear) params.year = this.selectedYear;
    if (this.selectedMonth) params.month = this.selectedMonth;
    
    this.dataService.getCrimes(1, 5000, params).subscribe({
      next: (response) => {
        if (!this.map) return;

        // Clear existing layer
        if (this.dataLayer) {
          this.map.removeLayer(this.dataLayer);
        }

        const rawData = response.data || [];

        if (this.mapMode === 'heat') {
          const heatData: [number, number, number][] = [];
          rawData.forEach((crime: any) => {
            const lat = parseFloat(crime.latitude);
            const lng = parseFloat(crime.longitude);
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              heatData.push([lat, lng, 1]);
            }
          });

          if (heatData.length > 0 && typeof heatLayer === 'function') {
            this.dataLayer = heatLayer(heatData, {
              radius: 20,
              blur: 15,
              maxZoom: 14,
              gradient: {
                0.3: '#1e3a8a',
                0.5: '#eab308',
                0.7: '#ea580c',
                1.0: '#dc2626'
              }
            });
            this.dataLayer.addTo(this.map);
          }
        } else {
          // Render beautiful interactive circle markers for each crime
          const markers = rawData.map((crime: any) => {
            const lat = parseFloat(crime.latitude);
            const lng = parseFloat(crime.longitude);
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              // Color matching crime profile
              let color = '#3b82f6'; // blue standard
              if (crime.primary_type.includes('HOMICIDE') || crime.primary_type.includes('WEAPONS') || crime.primary_type.includes('ARSON')) {
                color = '#ef4444'; // critical red
              } else if (crime.primary_type.includes('ROBBERY') || crime.primary_type.includes('BURGLARY') || crime.primary_type.includes('ASSAULT')) {
                color = '#f97316'; // orange major
              } else if (crime.primary_type.includes('NARCOTICS')) {
                color = '#a855f7'; // purple narcotics
              }

              const marker = L.circleMarker([lat, lng], {
                radius: 6,
                color: color,
                fillColor: color,
                fillOpacity: 0.65,
                weight: 1.5
              });

              const popupContent = `
                <div class="p-2 select-none" style="min-width: 200px; font-family: sans-serif;">
                  <div class="flex justify-between items-center mb-1" style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 10px; font-weight: bold; background: rgba(59, 130, 246, 0.1); color: #60a5fa; padding: 2px 6px; border-radius: 4px; font-family: monospace;">
                      #${crime.case_number}
                    </span>
                    <span style="font-size: 9px; color: #94a3b8; font-family: monospace;">${crime.date ? crime.date.substring(0, 10) : ''}</span>
                  </div>
                  <h4 style="font-size: 13px; font-weight: bold; color: #ffffff; margin: 6px 0 2px 0; text-transform: uppercase;">${crime.primary_type}</h4>
                  <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 6px 0; font-weight: 500;">${crime.description}</p>
                  <div style="font-size: 10px; color: #94a3b8; display: flex; align-items: center; gap: 4px; margin-top: 4px;">
                    <span style="font-size: 12px; margin-right: 2px;" class="material-symbols-outlined notranslate" translate="no">location_on</span>
                    <span>${crime.block}</span>
                  </div>
                </div>
              `;

              marker.bindPopup(popupContent, {
                className: 'leaflet-dark-popup',
                maxWidth: 300
              });
              return marker;
            }
            return null;
          }).filter((m: any) => m !== null);

          this.dataLayer = L.layerGroup(markers);
          this.dataLayer.addTo(this.map);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading crime data for map:', err);
        this.isLoading = false;
      }
    });
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
    // Wait until map is ready
    if (!this.map) {
      setTimeout(() => this.drawActivePatrolsOnMap(shifts), 500);
      return;
    }

    this.stopSimulationLoop();

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
          this.updatePatrolTooltip(marker, shift, 'En Patrullaje Activo');

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
        this.updatePatrolTooltip(sim.marker, sim.shift, 'En Patrullaje (Punto Fijo)');
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
      
      this.updatePatrolTooltip(sim.marker, sim.shift, 'En Patrullaje Activo');
    });
  }
}