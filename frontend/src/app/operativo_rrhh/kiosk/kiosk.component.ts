import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RrhhService } from '../rrhh.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kiosk',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './kiosk.component.html'
})
export class KioskComponent implements OnInit, OnDestroy {
  idOfficer: number | null = null;
  loadingClockIn = false;
  loadingClockOut = false;
  message: string | null = null;
  isError = false;
  clockStr: string = '';
  private timer: any;

  constructor(private rrhhService: RrhhService) {}

  ngOnInit() {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateClock() {
    const now = new Date();
    this.clockStr = now.toLocaleTimeString('en-US', { hour12: false });
  }

  clockIn() {
    if (!this.idOfficer) {
      this.showMessage('Debe ingresar su ID de Oficial.', true);
      return;
    }
    this.loadingClockIn = true;
    this.message = null;
    this.rrhhService.clockIn(this.idOfficer).subscribe({
      next: (res) => {
        this.loadingClockIn = false;
        this.showMessage(`Entrada registrada exitosamente a las ${new Date().toLocaleTimeString()}. Turno activo.`, false);
        this.idOfficer = null;
      },
      error: (err) => {
        this.loadingClockIn = false;
        this.showMessage(err.error?.error || 'Error al procesar la asistencia.', true);
      }
    });
  }

  clockOut() {
    if (!this.idOfficer) {
      this.showMessage('Debe ingresar su ID de Oficial.', true);
      return;
    }
    this.loadingClockOut = true;
    this.message = null;
    this.rrhhService.clockOut(this.idOfficer).subscribe({
      next: (res) => {
        this.loadingClockOut = false;
        this.showMessage(`Salida registrada exitosamente. Fin de turno.`, false);
        this.idOfficer = null;
      },
      error: (err) => {
        this.loadingClockOut = false;
        this.showMessage(err.error?.error || 'Error al procesar la salida.', true);
      }
    });
  }

  private showMessage(msg: string, error: boolean) {
    this.message = msg;
    this.isError = error;
    setTimeout(() => this.message = null, 6000);
  }
}
