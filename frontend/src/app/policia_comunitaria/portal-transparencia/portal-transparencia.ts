import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-portal-transparencia',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FormsModule],
  templateUrl: './portal-transparencia.html',
  styleUrls: ['./portal-transparencia.css']
})
export class PortalTransparenciaComponent implements OnInit {
  public quejas: any[] = [];
  public usoFuerza: any[] = [];
  public isLoading = true;
  public searchTerm: string = '';
  public activeTab: 'all' | 'complaints' | 'force' = 'all';
  public showKpis = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  get activeQuejasCount(): number {
    return this.quejas.filter(q => q.estado !== 'Resuelta' && q.estado !== 'Desestimada').length;
  }

  get resolvedQuejasCount(): number {
    return this.quejas.filter(q => q.estado === 'Resuelta').length;
  }

  get lethalForceCount(): number {
    return this.usoFuerza.filter(u => u.tipo_fuerza && u.tipo_fuerza.toLowerCase().includes('fuego')).length;
  }

  get nonLethalForceCount(): number {
    return this.usoFuerza.filter(u => !u.tipo_fuerza || !u.tipo_fuerza.toLowerCase().includes('fuego')).length;
  }

  get uniqueOfficersInvolved(): number {
    const officers = new Set<string>();
    this.quejas.forEach(q => { if (q.id_oficial_implicado) officers.add(q.id_oficial_implicado.toString()); });
    this.usoFuerza.forEach(u => { if (u.id_oficial) officers.add(u.id_oficial.toString()); });
    return officers.size;
  }

  get filteredQuejas() {
    if (!this.searchTerm) return this.quejas;
    const term = this.searchTerm.toLowerCase();
    return this.quejas.filter(q => 
      q.nombre_ciudadano.toLowerCase().includes(term) ||
      (q.descripcion && q.descripcion.toLowerCase().includes(term)) ||
      q.estado.toLowerCase().includes(term) ||
      (q.id_oficial_implicado && q.id_oficial_implicado.toString().includes(term))
    );
  }

  get filteredUsoFuerza() {
    if (!this.searchTerm) return this.usoFuerza;
    const term = this.searchTerm.toLowerCase();
    return this.usoFuerza.filter(u => 
      u.id_oficial.toString().includes(term) ||
      (u.id_incidente && u.id_incidente.toLowerCase().includes(term)) ||
      u.tipo_fuerza.toLowerCase().includes(term) ||
      (u.justificacion_legal && u.justificacion_legal.toLowerCase().includes(term)) ||
      (u.ubicacion && u.ubicacion.toLowerCase().includes(term))
    );
  }

  loadData() {
    this.isLoading = true;
    let loadedQuejas = false;
    let loadedUso = false;

    const checkDone = () => {
      if (loadedQuejas && loadedUso) {
        this.isLoading = false;
      }
    };

    this.http.get<any[]>(`http://localhost:8000/api/comunidad/quejas/`).subscribe({
      next: (data) => {
        this.quejas = data;
        loadedQuejas = true;
        checkDone();
      },
      error: (err) => {
        console.error('Error loading quejas:', err);
        loadedQuejas = true;
        checkDone();
      }
    });

    this.http.get<any[]>(`http://localhost:8000/api/comunidad/uso-fuerza/`).subscribe({
      next: (data) => {
        this.usoFuerza = data;
        loadedUso = true;
        checkDone();
      },
      error: (err) => {
        console.error('Error loading uso-fuerza:', err);
        loadedUso = true;
        checkDone();
      }
    });
  }
}
