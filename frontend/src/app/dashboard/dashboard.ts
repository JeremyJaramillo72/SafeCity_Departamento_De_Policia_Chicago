import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet.heat';
import { Chart, registerables } from 'chart.js';
import { SidebarComponent } from '../sidebar/sidebar';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  profile: string | null = 'oficial';
  kpis: any = {
    total_incidents: 0,
    total_arrests: 0,
    arrest_rate: 0,
    total_domestic: 0,
    active_officers: 0,
    unresolved_cases: 0,
    map_points: [],
    chart_data: [],
    recent_feed: []
  };

  private map: L.Map | undefined;
  private chart: Chart | undefined;

  constructor(
    private authService: AuthService, 
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    if (!this.profile) {
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    this.loadKPIs();
  }

  loadKPIs() {
    this.dataService.getDashboardKPIs().subscribe({
      next: (data) => {
        this.kpis = data;
        this.initMap();
        this.initChart();
      },
      error: (err) => {
        console.error('Error loading KPIs:', err);
      }
    });
  }

  initMap() {
    if (this.map) {
      this.map.remove();
    }
    
    // Default to Chicago coordinates
    this.map = L.map('tacticalMap').setView([41.8781, -87.6298], 11);

    // Dark Tactical Map Theme (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    // Prepare heatmap points
    if (this.kpis.map_points && this.kpis.map_points.length > 0) {
      const heatPoints = this.kpis.map_points.map((p: any) => [p.lat, p.lng, 0.5]); // lat, lng, intensity
      
      // @ts-ignore - leaflet.heat adds heatLayer to L
      L.heatLayer(heatPoints, {
        radius: 20,
        blur: 15,
        maxZoom: 15,
        gradient: {
          0.4: '#1f2937', // surface tint
          0.6: '#4ade80', // primary container
          0.8: '#facc15', // warning
          1.0: '#ef4444'  // error
        }
      }).addTo(this.map);
    }

    // Add Red Hotspots
    if (this.kpis.hotspots && this.kpis.hotspots.length > 0) {
      this.kpis.hotspots.forEach((spot: any) => {
        L.circleMarker([spot.lat, spot.lng], {
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.7,
          radius: 8,
          weight: 2
        }).bindTooltip(`<b>Hotspot</b><br>Incidents: ${spot.count}`, {
          className: 'bg-surface-container-lowest text-on-surface border border-error rounded shadow-lg',
          direction: 'top'
        }).addTo(this.map!);
      });
    }
  }

  initChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = document.getElementById('districtChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!this.kpis.chart_data || this.kpis.chart_data.length === 0) return;

    const labels = this.kpis.chart_data.map((d: any) => `D${d.district}`);
    const dataPoints = this.kpis.chart_data.map((d: any) => d.count);

    // Create a beautiful premium linear gradient for the bars
    const gradient = ctx.createLinearGradient(0, 200, 0, 0);
    gradient.addColorStop(0, '#0c2b5e'); // navy base
    gradient.addColorStop(1, '#3b82f6'); // blue bright top

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Incidents',
          data: dataPoints,
          backgroundColor: gradient,
          hoverBackgroundColor: '#60a5fa',
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#94a3b8' // slate text
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0b0f19', // glassmorphic dark background
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        }
      }
    });
  }
}
