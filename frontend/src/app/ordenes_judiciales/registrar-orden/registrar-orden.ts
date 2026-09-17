import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router , RouterLink } from '@angular/router';
import { OrdenesService } from '../services/ordenes.service';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-registrar-orden',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './registrar-orden.html',
  styleUrl: './registrar-orden.css'
})
export class RegistrarOrdenComponent implements OnInit {
  showProfileDropdown = false;
  formData = {
    tipo_orden: 'Arresto',
    juez_emisor: '',
    tribunal: '',
    cargos: '',
    fecha_emision: '',
    fecha_vencimiento: '',
    sospechoso_nombre: '',
    sospechoso_identificacion: '',
    expediente_vinculado: ''
  };
  selectedFile: File | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';
  suspectSuggestions: any[] = [];
  showSuspectSuggestions = false;
  availableCases: string[] = [];
  isEditMode = false;
  ordenId: number | null = null;
  existingPdfUrl: string | null = null;

  constructor(
    public authService: AuthService, private ordenesService: OrdenesService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      const idStr = params.get('id');
      if (idStr) {
        this.isEditMode = true;
        this.ordenId = Number(idStr);
        this.loadOrden(this.ordenId);
      }
    });
  }

  loadOrden(id: number) {
    this.loading = true;
    this.ordenesService.obtenerOrden(id).subscribe({
      next: (orden) => {
        this.loading = false;
        this.formData = {
          tipo_orden: orden.tipo_orden || 'Arresto',
          juez_emisor: orden.juez_emisor || '',
          tribunal: orden.tribunal || '',
          cargos: orden.cargos || '',
          fecha_emision: orden.fecha_emision || '',
          fecha_vencimiento: orden.fecha_vencimiento || '',
          sospechoso_nombre: orden.sospechoso_nombre || '',
          sospechoso_identificacion: orden.sospechoso_identificacion || '',
          expediente_vinculado: orden.expediente_vinculado || ''
        };
        this.existingPdfUrl = orden.documento_pdf || null;
        
        if (orden.expediente_vinculado) {
          this.availableCases = [orden.expediente_vinculado];
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Error al cargar los datos de la orden judicial.';
        console.error(err);
      }
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  searchSuspects(term: string) {
    if (!term || term.trim().length < 2) {
      this.suspectSuggestions = [];
      this.showSuspectSuggestions = false;
      this.availableCases = [];
      return;
    }
    this.ordenesService.buscarSuspects(term).subscribe({
      next: (res: any[]) => {
        const groups: { [key: string]: any } = {};
        (res || []).forEach(s => {
          const key = (s.identificacion || s.nombres || '').trim();
          if (!key) return;
          if (!groups[key]) {
            groups[key] = {
              ...s,
              cases: s.case_number ? [s.case_number] : []
            };
          } else {
            if (s.case_number && !groups[key].cases.includes(s.case_number)) {
              groups[key].cases.push(s.case_number);
            }
          }
        });
        this.suspectSuggestions = Object.values(groups);
        this.showSuspectSuggestions = this.suspectSuggestions.length > 0;
      },
      error: (err) => {
        console.error('Error searching suspects:', err);
        this.suspectSuggestions = [];
        this.showSuspectSuggestions = false;
        this.availableCases = [];
      }
    });
  }

  selectSuspect(suspect: any) {
    this.formData.sospechoso_identificacion = suspect.identificacion || '';
    this.formData.sospechoso_nombre = suspect.nombres || '';
    this.availableCases = suspect.cases || [];
    
    if (this.availableCases.length === 1) {
      this.formData.expediente_vinculado = this.availableCases[0];
    } else {
      this.formData.expediente_vinculado = '';
    }
    
    this.showSuspectSuggestions = false;
  }

  hideSuggestionsWithDelay() {
    setTimeout(() => {
      this.showSuspectSuggestions = false;
    }, 250);
  }

  onSubmit() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const data = new FormData();
    Object.keys(this.formData).forEach(key => {
      data.append(key, (this.formData as any)[key]);
    });

    if (this.selectedFile) {
      data.append('documento_pdf', this.selectedFile);
    }

    if (this.isEditMode && this.ordenId !== null) {
      this.ordenesService.actualizarOrden(this.ordenId, data).subscribe({
        next: (res) => {
          this.loading = false;
          this.successMessage = 'Orden judicial actualizada exitosamente.';
          setTimeout(() => {
            this.router.navigate(['/ordenes']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Error al actualizar la orden. Verifique los datos ingresados.';
          console.error(err);
        }
      });
    } else {
      this.ordenesService.registrarOrden(data).subscribe({
        next: (res) => {
          this.loading = false;
          this.successMessage = `Orden judicial registrada exitosamente. ID: ${res.id}`;
          // Reset form
          this.formData = {
            tipo_orden: 'Arresto',
            juez_emisor: '',
            tribunal: '',
            cargos: '',
            fecha_emision: '',
            fecha_vencimiento: '',
            sospechoso_nombre: '',
            sospechoso_identificacion: '',
            expediente_vinculado: ''
          };
          this.selectedFile = null;
          this.suspectSuggestions = [];
          this.showSuspectSuggestions = false;
          this.availableCases = [];

          // Redirect to main panel after 1.5 seconds
          setTimeout(() => {
            this.router.navigate(['/ordenes']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Error al registrar la orden judicial. Verifique los datos y el documento PDF.';
          console.error(err);
        }
      });
    }
  }
}
