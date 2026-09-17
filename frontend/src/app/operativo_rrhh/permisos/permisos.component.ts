import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RrhhService, SolicitudPermiso } from '../rrhh.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="bg-[#0A1128] font-body-md text-white min-h-screen w-full flex flex-col">
    <!-- TopNavBar Component -->
    <header class="sticky top-0 bg-[#0A1128]/95 border-b border-[#0066FF]/30 flex justify-between items-center h-16 w-full px-lg z-40 shadow-md backdrop-blur-sm">
        <div class="flex items-center gap-4">
            <a routerLink="/kiosco" class="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer" title="Volver al Kiosco">
                <span class="material-symbols-outlined notranslate" translate="no">arrow_back</span>
            </a>
            <div class="h-8 w-8 bg-[#0066FF]/20 rounded-md flex items-center justify-center border border-[#0066FF]/50">
                <span class="material-symbols-outlined text-[#0066FF] text-lg notranslate" translate="no">edit_document</span>
            </div>
            <span class="font-headline-md text-headline-md font-black tracking-tight text-white">SafeCity <span class="text-[#0066FF]">Permisos RRHH</span></span>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-lg lg:p-xl flex flex-col items-center justify-start mt-8 relative">
        <div class="w-full max-w-2xl z-10">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="font-display-lg text-display-lg font-bold text-white mb-2">Solicitud de Permiso</h1>
                <p class="font-body-md text-gray-400">Complete el formulario para solicitar una ausencia o permiso médico.</p>
            </div>

            <!-- Card -->
            <div class="bg-[#111836] border border-[#0066FF]/30 rounded-2xl p-8 shadow-2xl">
                <form (ngSubmit)="submit()" #permisoForm="ngForm" class="flex flex-col gap-6">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block font-label-caps text-label-caps text-gray-400 mb-2 tracking-widest">ID DE OFICIAL</label>
                            <input type="number" [(ngModel)]="solicitud.id_oficial" name="id_oficial" required
                                   class="w-full bg-[#0A1128] border border-white/10 focus:border-[#0066FF] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 min-h-[48px] transition-all"
                                   placeholder="Ej. 1042">
                        </div>

                        <div>
                            <label class="block font-label-caps text-label-caps text-gray-400 mb-2 tracking-widest">TIPO DE PERMISO</label>
                            <select [(ngModel)]="solicitud.tipo_permiso" name="tipo_permiso" required
                                    class="w-full bg-[#0A1128] border border-white/10 focus:border-[#0066FF] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 min-h-[48px] transition-all appearance-none cursor-pointer">
                                <option value="" disabled selected>Seleccione...</option>
                                <option value="Vacaciones">Vacaciones Anuales</option>
                                <option value="Baja Médica">Baja Médica / Permiso de Salud</option>
                                <option value="Asunto Personal">Asunto Personal / Familiar</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block font-label-caps text-label-caps text-gray-400 mb-2 tracking-widest">FECHA DE INICIO</label>
                            <input type="date" [(ngModel)]="solicitud.fecha_inicio" name="fecha_inicio" required
                                   class="w-full bg-[#0A1128] border border-white/10 focus:border-[#0066FF] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 min-h-[48px] transition-all [color-scheme:dark]">
                        </div>
                        <div>
                            <label class="block font-label-caps text-label-caps text-gray-400 mb-2 tracking-widest">FECHA DE FIN</label>
                            <input type="date" [(ngModel)]="solicitud.fecha_fin" name="fecha_fin" required
                                   class="w-full bg-[#0A1128] border border-white/10 focus:border-[#0066FF] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 min-h-[48px] transition-all [color-scheme:dark]">
                        </div>
                    </div>

                    <div class="pt-6 border-t border-white/10 mt-2">
                        <button type="submit" [disabled]="!permisoForm.valid || loading"
                                class="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-bold rounded-xl min-h-[56px] flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#0066FF]/20 cursor-pointer">
                            <span *ngIf="loading" class="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-3"></span>
                            <span class="font-label-caps tracking-widest text-xs">ENVIAR SOLICITUD</span>
                        </button>
                    </div>

                    <div *ngIf="message" class="p-4 rounded-xl flex items-start gap-3 animate-fade-in" [ngClass]="isError ? 'bg-[#D32F2F]/20 border border-[#D32F2F]/50 text-red-200' : 'bg-[#2E7D32]/20 border border-[#2E7D32]/50 text-green-200'">
                        <span class="material-symbols-outlined mt-0.5 notranslate" translate="no">{{ isError ? 'error' : 'check_circle' }}</span>
                        <p class="font-body-sm">{{ message }}</p>
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>
  `
})
export class PermisosComponent {
  solicitud: SolicitudPermiso = {
    id_oficial: null as any,
    tipo_permiso: '',
    fecha_inicio: '',
    fecha_fin: ''
  };
  loading = false;
  message: string | null = null;
  isError = false;

  constructor(private rrhhService: RrhhService) {}

  submit() {
    this.loading = true;
    this.message = null;
    this.rrhhService.solicitarPermiso(this.solicitud).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Permiso solicitado exitosamente. Queda pendiente de aprobación por el Comandante.';
        this.isError = false;
        this.solicitud = { id_oficial: null as any, tipo_permiso: '', fecha_inicio: '', fecha_fin: '' };
        setTimeout(() => this.message = null, 8000);
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.error || 'Ocurrió un error al enviar la solicitud.';
        this.isError = true;
      }
    });
  }
}
