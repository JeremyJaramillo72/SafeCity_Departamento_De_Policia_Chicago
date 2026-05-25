import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar';
import { DataService } from '../services/data.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as L from 'leaflet';

// Extend Leaflet's type definition to include heatLayer
declare module 'leaflet' {
  function heatLayer(latlngs: any[], options?: any): any;
}

@Component({
  selector: 'app-tactical-map',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './tactical-map.html',
  styleUrls: ['./tactical-map.css']
})
export class TacticalMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: L.Map | undefined;
  isLoading = true;
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private dataLayer: any; // Keep reference to current heatmap/markers layer to remove it

  // Tactical General search & layer mode variables
  mapMode: 'heat' | 'markers' = 'heat';
  mapSearchQuery = '';
  mapSearchSuggestions: any[] = [];
  isSearchingMap = false;
  mapSearchError = '';
  private searchMarker: L.Marker | undefined;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.map) {
        this.loadCrimeData();
      }
    });
  }

  ngAfterViewInit() {
    // Small timeout ensures the DOM element is fully rendered before Leaflet mounts
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  onSearchChange(value: string) {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  setMapMode(mode: 'heat' | 'markers') {
    this.mapMode = mode;
    this.loadCrimeData();
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

    // Dark mode CartoDB tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    this.loadCrimeData();
  }

  private loadCrimeData() {
    this.isLoading = true;
    this.dataService.getCrimes(1, 1000, { search: this.searchQuery }).subscribe({
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

          if (heatData.length > 0 && (L as any).heatLayer) {
            this.dataLayer = (L as any).heatLayer(heatData, {
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
}
