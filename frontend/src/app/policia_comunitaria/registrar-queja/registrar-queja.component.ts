import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-registrar-queja',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './registrar-queja.component.html',
  styleUrls: []
})
export class RegistrarQuejaComponent implements OnInit {
  public formData = {
    nombre_ciudadano: '',
    contacto_ciudadano: '',
    id_oficial_implicado: null,
    fecha_incidente: '',
    descripcion: ''
  };
  
  public isLoading = false;
  public successMessage = '';
  public errorMessage = '';
  public officialList: any[] = [];
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOfficials();
  }
  
  loadOfficials() {
    this.http.get<any[]>(`${environment.apiUrl}/api/auth/users/`).subscribe(users => {
      this.officialList = users.filter(u => u.role === 'oficial' || u.role === 'agente_transito' || u.role === 'detective');
    });
  }

  submitComplaint() {
    if (!this.formData.nombre_ciudadano || !this.formData.descripcion || !this.formData.fecha_incidente) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.post(`${environment.apiUrl}/api/comunidad/quejas/`, this.formData)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = 'Su queja ciudadana ha sido registrada exitosamente. Un investigador de Asuntos Internos la revisará pronto.';
          this.formData = {
            nombre_ciudadano: '',
            contacto_ciudadano: '',
            id_oficial_implicado: null,
            fecha_incidente: '',
            descripcion: ''
          };
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Hubo un error al enviar la queja. Por favor, intente nuevamente.';
        }
      });
  }
}
