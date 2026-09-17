import { RouterLink } from '@angular/router';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntelService } from '../services/intel.service';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-bolo-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './bolo-alerts.html',
  styleUrls: []
})
export class BoloAlertsComponent implements OnInit {
  showProfileDropdown = false;
  bolos: any[] = [];
  filterStatus: string = 'Active';
  searchTerm: string = '';
  selectedRisk: string = 'ALL';
  showKpis = true;

  // Modal Flotante de Vista Previa de Imagen / Zoom
  previewImageModal = false;
  previewImageData: { url: string; title: string; subtitle?: string; risk?: string } | null = null;

  openImagePreview(url: string, title: string, subtitle: string = '', risk: string = '', event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!url) return;
    this.previewImageData = { url, title, subtitle, risk };
    this.previewImageModal = true;
  }

  closeImagePreview(): void {
    this.previewImageModal = false;
    setTimeout(() => {
      this.previewImageData = null;
    }, 250);
  }

  // Modal de Creación
  showCreateModal = false;
  isSaving = false;
  newBolo: any = {
    tipo: 'Vehículo Sospechoso',
    titulo: '',
    descripcion: '',
    nivel_riesgo: 'Medium',
    fecha_expiracion_date: '',
    fecha_expiracion_time: '',
    foto_url: ''
  };

  constructor(public authService: AuthService, private intelService: IntelService) {}

  ngOnInit(): void {
    this.loadBolos();
  }

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  loadBolos(): void {
    this.intelService.getBolos().subscribe({
      next: (data) => {
        this.bolos = data;
      },
      error: (err) => console.error(err)
    });
  }

  get activeBolosCount(): number {
    return this.bolos.filter(b => b.estado === 'Active' || b.estado === 'Activo').length;
  }

  get criticalBolosCount(): number {
    return this.bolos.filter(b => {
      const r = (b.nivel_riesgo || '').toUpperCase();
      const isActive = b.estado === 'Active' || b.estado === 'Activo';
      return isActive && (r === 'CRITICAL' || r === 'CRITICO' || r === 'HIGH' || r === 'ALTO');
    }).length;
  }

  get inactiveBolosCount(): number {
    return this.bolos.filter(b => b.estado === 'Inactive' || b.estado === 'Inactivo').length;
  }

  get filteredBolos(): any[] {
    let result = this.bolos;

    // Filtrar por Estado
    if (this.filterStatus !== 'All') {
      result = result.filter(b => {
        if (this.filterStatus === 'Active') return b.estado === 'Active' || b.estado === 'Activo';
        if (this.filterStatus === 'Inactive') return b.estado === 'Inactive' || b.estado === 'Inactivo';
        return true;
      });
    }

    // Filtrar por Riesgo
    if (this.selectedRisk !== 'ALL') {
      result = result.filter(b => {
        const r = (b.nivel_riesgo || '').toUpperCase();
        if (this.selectedRisk === 'Critical') return r === 'CRITICAL' || r === 'CRITICO';
        if (this.selectedRisk === 'High') return r === 'HIGH' || r === 'ALTO';
        if (this.selectedRisk === 'Medium') return r === 'MEDIUM' || r === 'MEDIO';
        if (this.selectedRisk === 'Low') return r === 'LOW' || r === 'BAJO';
        return true;
      });
    }

    // Filtrar por Búsqueda
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      result = result.filter(b => 
        (b.titulo && b.titulo.toLowerCase().includes(term)) ||
        (b.descripcion && b.descripcion.toLowerCase().includes(term)) ||
        (b.tipo && b.tipo.toLowerCase().includes(term)) ||
        (b.case_number && b.case_number.toLowerCase().includes(term)) ||
        (b.creado_por && b.creado_por.toLowerCase().includes(term))
      );
    }

    return result;
  }

  openCreateModal(): void {
    this.newBolo = {
      tipo: 'Vehículo Sospechoso',
      titulo: '',
      descripcion: '',
      nivel_riesgo: 'Medium',
      fecha_expiracion_date: '',
      fecha_expiracion_time: '',
      foto_url: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.newBolo = {
      tipo: 'Vehículo Sospechoso',
      titulo: '',
      descripcion: '',
      nivel_riesgo: 'Medium',
      fecha_expiracion_date: '',
      fecha_expiracion_time: '',
      foto_url: ''
    };
    this.showCreateModal = false;
  }

  @ViewChild('fileInput') fileInput!: ElementRef;
  isUploading = false;

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.intelService.uploadEvidenceImage(file).subscribe({
        next: (res) => {
          this.newBolo.foto_url = res.url;
          this.isUploading = false;
        },
        error: (err) => {
          console.error(err);
          this.isUploading = false;
        }
      });
    }
  }

  saveBolo(): void {
    if (!this.newBolo.titulo || !this.newBolo.descripcion) return;
    this.isSaving = true;
    
    let dataToSave = { ...this.newBolo };
    
    if (this.newBolo.fecha_expiracion_date) {
      const timeStr = this.newBolo.fecha_expiracion_time || '00:00';
      const combinedDateTimeStr = `${this.newBolo.fecha_expiracion_date}T${timeStr}:00`;
      const parsedDate = new Date(combinedDateTimeStr);
      
      if (!isNaN(parsedDate.getTime())) {
        dataToSave.fecha_expiracion = parsedDate.toISOString();
      } else {
        dataToSave.fecha_expiracion = null;
      }
    } else {
      dataToSave.fecha_expiracion = null;
    }
    
    delete dataToSave.fecha_expiracion_date;
    delete dataToSave.fecha_expiracion_time;

    this.intelService.createBolo(dataToSave).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeCreateModal();
        this.loadBolos();
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
      }
    });
  }

  // Modal de Confirmación
  showConfirmModal = false;
  confirmConfig = {
    title: '',
    message: '',
    action: '',
    boloId: ''
  };

  openConfirmModal(action: string, boloId: string, title: string, message: string) {
    this.confirmConfig = { action, boloId, title, message };
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  executeConfirmAction() {
    const id = this.confirmConfig.boloId;
    if (this.confirmConfig.action === 'deactivate') {
      this.executeDeactivate(id);
    } else if (this.confirmConfig.action === 'reactivate') {
      this.executeReactivate(id);
    }
    this.closeConfirmModal();
  }

  deactivateBolo(id: string): void {
    this.openConfirmModal('deactivate', id, 'Desactivar Alerta', '¿Está seguro de que desea marcar esta alerta BOLO como INACTIVA?');
  }

  executeDeactivate(id: string): void {
    const bolo = this.bolos.find(b => b.id === id);
    if (bolo) bolo.estado = 'Inactive';
    
    this.intelService.updateBoloStatus(id, 'Inactive').subscribe({
      next: () => {},
      error: (err) => {
        console.error(err);
        if (bolo) bolo.estado = 'Active';
      }
    });
  }

  reactivateBolo(id: string): void {
    this.openConfirmModal('reactivate', id, 'Reactivar Alerta', '¿Desea reactivar esta alerta BOLO?');
  }

  executeReactivate(id: string): void {
    const bolo = this.bolos.find(b => b.id === id);
    if (bolo) bolo.estado = 'Active';

    this.intelService.updateBoloStatus(id, 'Active').subscribe({
      next: () => {},
      error: (err) => {
        console.error(err);
        if (bolo) bolo.estado = 'Inactive';
      }
    });
  }

  showDetailsModal = false;
  viewingPerson: any = null;
  isLoadingPerson = false;

  viewBoloDetails(bolo: any) {
    if ((bolo.tipo === 'Person Desaparecida' || bolo.tipo === 'Persona Desaparecida' || bolo.tipo === 'Missing Person') && bolo.id_referencia) {
      this.isLoadingPerson = true;
      this.intelService.getMissingPersons().subscribe({
        next: (persons) => {
          const person = persons.find((p: any) => p.id === bolo.id_referencia);
          if (person) {
            this.viewingPerson = person;
            this.showDetailsModal = true;
          }
          this.isLoadingPerson = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoadingPerson = false;
        }
      });
    }
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    setTimeout(() => {
      this.viewingPerson = null;
    }, 300);
  }

  getRiskLabel(risk: string): string {
    if(!risk) return 'Desconocido';
    const r = risk.toUpperCase();
    if (r === 'CRITICO' || r === 'CRITICAL') return 'Crítico';
    if (r === 'ALTA' || r === 'ALTO' || r === 'HIGH') return 'Alto';
    if (r === 'MEDIA' || r === 'MEDIO' || r === 'MEDIUM') return 'Medio';
    if (r === 'BAJA' || r === 'BAJO' || r === 'LOW') return 'Bajo';
    return risk;
  }

  getRiskColor(risk: string): string {
    if(!risk) return 'bg-surface-variant text-on-surface';
    const r = risk.toUpperCase();
    if (r === 'CRITICO' || r === 'CRITICAL') return 'bg-error text-white';
    if (r === 'ALTA' || r === 'ALTO' || r === 'HIGH') return 'bg-orange-600 text-white';
    if (r === 'MEDIA' || r === 'MEDIO' || r === 'MEDIUM') return 'bg-yellow-500 text-black';
    if (r === 'BAJA' || r === 'BAJO' || r === 'LOW') return 'bg-green-600 text-white';
    return 'bg-surface-variant text-on-surface';
  }
}

