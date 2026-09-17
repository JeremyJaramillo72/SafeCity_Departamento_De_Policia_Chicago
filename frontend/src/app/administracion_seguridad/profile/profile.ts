import { RouterLink, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  officer: any = null;
  loading: boolean = true;
  error: string = '';
  showProfileDropdown = false;
  isUploadingImage: boolean = false;
  
  // Toggle Password Form
  showPasswordForm: boolean = false;
  
  // Password Change Form
  passwordForm: FormGroup;
  passwordSuccess: string = '';
  passwordError: string = '';
  isSavingPassword: boolean = false;

  // Mock Activity Feed for realistic detail
  recentActivities = [
    { time: 'Hace 2 horas', event: 'Inicio de Turno', desc: 'Patrullaje en Sector Norte con la unidad móvil PM-402.', icon: 'schedule' },
    { time: 'Ayer', event: 'Registro de Incidente', desc: 'Creó el informe policial #INC-2026-8941 por robo a comercio.', icon: 'assignment' },
    { time: 'Hace 2 días', event: 'Aprobación de Dotación', desc: 'Firmó digitalmente el informe de estado de flota y patrullas.', icon: 'local_shipping' },
    { time: 'Hace 3 días', event: 'Curso Acreditado', desc: 'Obtuvo la acreditación en Tácticas de Desescalada Crítica.', icon: 'school' }
  ];

  // Certification badges
  badges = [
    { name: 'Tácticas Urbanas', desc: 'Entrenamiento táctico avanzado CQB', icon: 'shield', color: 'text-primary bg-primary/10 border-primary/20' },
    { name: 'Primer Respondiente', desc: 'Soporte vital básico y primeros auxilios', icon: 'medical_services', color: 'text-error bg-error/10 border-error/20' },
    { name: 'Conducción Táctica', desc: 'Control evasivo de vehículos de emergencia', icon: 'minor_crash', color: 'text-warning bg-warning/10 border-warning/20' },
    { name: 'Operación Segura', desc: 'Cero incidentes en patrullajes activos', icon: 'track_changes', color: 'text-success bg-success/10 border-success/20' }
  ];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private logisticsService: LogisticsService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById('avatar-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.isUploadingImage = true;
    this.error = '';
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('http://localhost:8000/api/criminal/evidence/upload/', formData).subscribe({
      next: (res) => {
        const secureUrl = res.url;
        if (secureUrl) {
          // Update officer object
          this.officer.url_fotografia = secureUrl;
          // Update officer in database
          this.logisticsService.updateOfficer(this.officer.id_oficial, this.officer).subscribe({
            next: () => {
              this.authService.updateProfileImage(secureUrl);
              this.isUploadingImage = false;
              // Clear input
              event.target.value = '';
            },
            error: (err) => {
              console.error('Error updating officer image:', err);
              this.error = 'No se pudo actualizar la foto de perfil en el registro.';
              this.isUploadingImage = false;
            }
          });
        } else {
          this.error = 'La respuesta del servidor no contiene una URL válida.';
          this.isUploadingImage = false;
        }
      },
      error: (err) => {
        console.error('Error uploading image:', err);
        this.error = 'Error al subir la imagen al servidor.';
        this.isUploadingImage = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    
    // Subscribe to query parameters to toggle password form
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'change-password') {
        this.showPasswordForm = true;
        // Smooth scroll to form section
        setTimeout(() => {
          const element = document.getElementById('password-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      } else {
        this.showPasswordForm = false;
      }
    });
  }

  loadProfile() {
    this.loading = true;
    this.error = '';
    const officerId = this.authService.getOfficerId();

    this.logisticsService.getOfficer(officerId).subscribe({
      next: (data) => {
        this.officer = data;
        this.updateBadges();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading officer profile:', err);
        this.error = 'No se pudo cargar la información del perfil del oficial.';
        this.loading = false;
      }
    });
  }

  updateBadges() {
    if (!this.officer || !this.officer.insignias) {
      this.badges = [];
      return;
    }
    const keys = this.officer.insignias.split(',');
    const badgeMap: { [key: string]: any } = {
      'tacticas_urbanas': { name: 'Tácticas Urbanas', desc: 'Entrenamiento táctico avanzado CQB', icon: 'shield', color: 'text-primary bg-primary/10 border-primary/20' },
      'primer_respondiente': { name: 'Primer Respondiente', desc: 'Soporte vital básico y primeros auxilios', icon: 'medical_services', color: 'text-error bg-error/10 border-error/20' },
      'conduccion_tactica': { name: 'Conducción Táctica', desc: 'Control evasivo de vehículos de emergencia', icon: 'minor_crash', color: 'text-warning bg-warning/10 border-warning/20' },
      'operacion_segura': { name: 'Operación Segura', desc: 'Cero incidentes en patrullajes activos', icon: 'track_changes', color: 'text-success bg-success/10 border-success/20' }
    };
    this.badges = keys
      .map((key: string) => badgeMap[key.trim()])
      .filter((b: any) => b !== undefined);
  }

  getRoleLabel(idRol: number): string {
    const role = this.authService.getRole();
    if (role === 'administrador_sistema') return 'Administrador de Sistema';
    if (role === 'recursos_humanos') return 'Jefe de Recursos Humanos';
    if (role === 'detective') return 'Detective de Inteligencia';
    if (role === 'operador_emergencias') return 'Operador de Emergencias 911';
    if (role === 'agente_transito') return 'Agente de Tránsito';
    if (idRol === 1) return 'Comisario / Jefe';
    return 'Oficial de Patrulla';
  }

  getDivisionLabel(): string {
    const role = this.authService.getRole();
    if (role === 'administrador_sistema') return 'División de Soporte y Ciberseguridad';
    if (role === 'recursos_humanos') return 'División de Recursos Humanos y Personal';
    if (role === 'detective') return 'División de Investigación y Análisis';
    if (role === 'operador_emergencias') return 'Centro de Despacho y Monitoreo 911';
    if (role === 'agente_transito') return 'División de Control y Tránsito Vial';
    if (role === 'administrador') return 'Estado Mayor de Operaciones';
    return 'División de Patrullaje Metropolitano';
  }

  onImgError(event: any) {
    event.target.src = this.authService.getFallbackProfileImage();
  }

  onChangePassword() {
    if (this.passwordForm.invalid) {
      this.passwordError = 'Por favor complete los campos correctamente (mínimo 6 caracteres).';
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden.';
      return;
    }

    this.isSavingPassword = true;
    this.passwordError = '';
    this.passwordSuccess = '';

    this.authService.changePassword(newPassword).subscribe({
      next: (res) => {
        this.isSavingPassword = false;
        this.passwordSuccess = res.message || 'Su contraseña ha sido cambiada exitosamente.';
        this.passwordForm.reset();
        
        // Collapse form after success
        setTimeout(() => {
          this.showPasswordForm = false;
          this.passwordSuccess = '';
        }, 2500);
      },
      error: (err) => {
        this.isSavingPassword = false;
        this.passwordError = err.error?.error || 'No se pudo cambiar la contraseña. Por favor intente nuevamente.';
        console.error('Error changing password:', err);
      }
    });
  }
}

