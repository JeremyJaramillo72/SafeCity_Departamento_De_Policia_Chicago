import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../administracion_seguridad/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  // Password Recovery States
  showRecoveryModal: boolean = false;
  recoveryEmail: string = '';
  recoveryMessage: string = '';
  recoveryError: string = '';
  isSendingRecovery: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const role = this.authService.getRole();
          if (role === 'oficial') {
            this.router.navigate(['/incidents']);
          } else if (role === 'detective') {
            this.router.navigate(['/my-cases']);
          } else if (role === 'operador_emergencias') {
            this.router.navigate(['/dispatch']);
          } else if (role === 'recursos_humanos') {
            this.router.navigate(['/rrhh']);
          } else if (role === 'agente_transito') {
            this.router.navigate(['/traffic']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.error = 'Credenciales inválidas o error de conexión con el servidor.';
          console.error(err);
        }
      });
    }
  }

  openRecoveryModal() {
    this.showRecoveryModal = true;
    this.recoveryEmail = '';
    this.recoveryMessage = '';
    this.recoveryError = '';
    this.isSendingRecovery = false;
  }

  closeRecoveryModal() {
    this.showRecoveryModal = false;
  }

  onSendRecovery() {
    if (!this.recoveryEmail) {
      this.recoveryError = 'Por favor, ingrese su correo institucional.';
      return;
    }
    this.isSendingRecovery = true;
    this.recoveryError = '';
    this.recoveryMessage = '';
    
    this.authService.requestPasswordReset(this.recoveryEmail).subscribe({
      next: (res) => {
        this.isSendingRecovery = false;
        this.recoveryMessage = res.message || 'Se ha enviado un enlace de recuperación a su correo electrónico.';
      },
      error: (err) => {
        this.isSendingRecovery = false;
        this.recoveryError = err.error?.error || 'No se pudo enviar el correo de recuperación. Verifique su dirección institucional.';
        console.error(err);
      }
    });
  }
}
