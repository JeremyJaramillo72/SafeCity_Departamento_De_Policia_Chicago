import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SidebarComponent } from '../../sidebar/sidebar';
import { AuthService } from '../../administracion_seguridad/services/auth.service';

@Component({
  selector: 'app-uso-fuerza',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './uso-fuerza.component.html',
  styleUrls: []
})
export class UsoFuerzaComponent implements OnInit {
  public formData = {
    id_oficial: null as any,
    id_incidente: '',
    fecha_hora: '',
    ubicacion: '',
    tipo_fuerza: 'Fisica No Letal',
    justificacion_legal: '',
    hubo_heridos: false
  };
  
  public isLoading = false;
  public successMessage = '';
  public errorMessage = '';
  
  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit() {
    this.formData.id_oficial = this.authService.getOfficerId();
  }

  submitReport() {
    if (!this.formData.fecha_hora || !this.formData.ubicacion || !this.formData.justificacion_legal) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.post(`${environment.apiUrl}/api/comunidad/uso-fuerza/`, this.formData)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = 'El reporte de uso de fuerza ha sido registrado y enviado al departamento de Asuntos Internos.';
          
          // Keep officer ID, clear the rest
          const id = this.formData.id_oficial;
          this.formData = {
            id_oficial: id,
            id_incidente: '',
            fecha_hora: '',
            ubicacion: '',
            tipo_fuerza: 'Fisica No Letal',
            justificacion_legal: '',
            hubo_heridos: false
          };
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Hubo un error al registrar el reporte.';
        }
      });
  }
}
