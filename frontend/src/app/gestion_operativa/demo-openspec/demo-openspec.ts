import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-demo-openspec',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './demo-openspec.html'
})
export class DemoOpenspecComponent implements OnInit {
  
  // ==========================================
  // ESTADO CENTRAL (OpenSpec Routing Interno)
  // ==========================================
  vistaActual: 'listado' | 'creacion' | 'detalle' = 'listado';
  selectedIncident: any = null;
  Math = Math;

  // ==========================================
  // MOCK DATA: VISTA LISTADO
  // ==========================================
  pagination = { total: 1237089 };
  activeCount = 7;
  closedCount = 3;
  predominantType = 'CRIMINAL DAMAGE';

  filters = {
    search: '',
    patrol: 'Todas las Patrullas',
    status: 'Todos los Estados',
    district: 'Todos los Distritos',
    type: 'Todos los Tipos'
  };

  incidents = [
    {
      case_number: 'JB-102333', date: '2026-10-24T14:30:00', primary_type: 'HOMICIDE', 
      block: '025XX W 68TH ST', patrol_assigned: 'CPD-001 (SUV Patrol)', district: '008', arrest: false
    },
    {
      case_number: 'JB-878476', date: '2026-10-24T12:15:00', primary_type: 'BATTERY', 
      block: '059XX S HERMITAGE AVE', patrol_assigned: 'CPD-005 (Transport Van)', district: '007', arrest: true
    },
    {
      case_number: 'JB-102363', date: '2026-10-23T23:00:00', primary_type: 'THEFT', 
      block: '001XX E WACKER DR', patrol_assigned: 'CPD-011 (SUV Patrol)', district: '001', arrest: false
    },
    {
      case_number: 'JB-100511', date: '2026-10-23T22:42:00', primary_type: 'ROBBERY', 
      block: '018XX W 79TH ST', patrol_assigned: 'CPD-004 (Sedan)', district: '006', arrest: false
    },
    {
      case_number: 'JB-878382', date: '2026-10-23T20:55:00', primary_type: 'WEAPONS VIOLATION', 
      block: '028XX N HAMLIN AVE', patrol_assigned: 'CPD-015 (Sedan)', district: '025', arrest: true
    }
  ];

  // ==========================================
  // MOCK DATA: VISTA CREACIÓN
  // ==========================================
  nuevoIncidente = {
    case_number: 'JB-123456', date: new Date().toISOString().slice(0,16), block: '', primary_type: '', 
    location_description: '', district: '', iucr: '', arrest: false, domestic: false
  };

  iucrCatalog = [
    { code: '0110', name: 'HOMICIDE - FIRST DEGREE' },
    { code: '041A', name: 'BATTERY - AGGRAVATED' },
    { code: '0820', name: 'THEFT - $500 AND UNDER' },
    { code: '143A', name: 'WEAPONS VIOLATION' }
  ];

  // ==========================================
  // MOCK DATA: VISTA DETALLE
  // ==========================================
  timelineLogs: any[] = [];
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' = 'MODERATE';

  constructor() {}

  ngOnInit(): void {}

  // ==========================================
  // CONTROLADORES DE VISTA Y LÓGICA (OpenSpec)
  // ==========================================

  cambiarVista(vista: 'listado' | 'creacion' | 'detalle', incidente?: any) {
    this.vistaActual = vista;
    
    if (vista === 'detalle' && incidente) {
      this.selectedIncident = incidente;
      this.severity = this.calculateSeverity(incidente.primary_type);
      
      // Generar bitácora forense simulada
      this.timelineLogs = [
        { date: incidente.date, officer: 'Oficial Despacho #902', action: 'Incidente registrado inicial en CAD.' },
        { date: this.addMinutes(incidente.date, 15), officer: incidente.patrol_assigned, action: 'Unidad en el sitio. Escena asegurada.' }
      ];
      
      if (incidente.arrest) {
        this.timelineLogs.unshift({ date: this.addMinutes(incidente.date, 45), officer: incidente.patrol_assigned, action: 'Sujeto bajo custodia policial.' });
      }
    }

    // Resetear formulario si entra a creación
    if (vista === 'creacion') {
      this.nuevoIncidente.case_number = 'JB-' + Math.floor(100000 + Math.random() * 900000);
      this.nuevoIncidente.block = '';
      this.nuevoIncidente.iucr = '';
    }
  }

  guardarIncidente() {
    // Simulador de persistencia en ClickHouse (Mock)
    this.incidents.unshift({
      case_number: this.nuevoIncidente.case_number,
      date: this.nuevoIncidente.date,
      primary_type: this.iucrCatalog.find(i => i.code === this.nuevoIncidente.iucr)?.name.split('-')[0].trim() || 'UNKNOWN',
      block: this.nuevoIncidente.block || 'UBICACIÓN GPS DESCONOCIDA',
      patrol_assigned: 'Pendiente de Asignación',
      district: this.nuevoIncidente.district || '001',
      arrest: this.nuevoIncidente.arrest
    });
    this.pagination.total++;
    this.activeCount++;
    this.cambiarVista('listado');
  }

  // Lógica de Severidad Forense (Sección 2.3)
  calculateSeverity(type: string): 'CRITICAL' | 'HIGH' | 'MODERATE' {
    const criticals = ['HOMICIDE', 'BATTERY', 'ROBBERY', 'KIDNAPPING'];
    const highs = ['BURGLARY', 'WEAPONS VIOLATION', 'SEX OFFENSE'];
    if (criticals.includes(type)) return 'CRITICAL';
    if (highs.includes(type)) return 'HIGH';
    return 'MODERATE';
  }

  // Helper para simular tiempos
  addMinutes(dateStr: string, minutes: number): string {
    let d = new Date(dateStr);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toISOString();
  }
}
