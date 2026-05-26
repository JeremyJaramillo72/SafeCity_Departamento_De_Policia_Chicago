import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../../gestion_operativa/services/incident.service';
import { LogisticsService } from '../../logistica_patrullaje/services/logistics.service';
import { IntelService } from '../../inteligencia_criminal/services/intel.service';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-criminal-intel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './criminal-intel.html',
})
export class CriminalIntelComponent implements OnInit {
  isLoading = true;
  activeTab: 'suspects' | 'evidence' | 'witnesses' = 'suspects';
  showKpis = true;

  // Autocomplete Incidents State
  caseSuggestions: any[] = [];
  showCaseSuggestions = false;
  isSearchingCases = false;

  // Core Data
  suspects: any[] = [];
  gangs: any[] = [];
  evidences: any[] = [];
  witnesses: any[] = [];
  victims: any[] = [];
  officers: any[] = [];

  // Suspect Modal CRUD State
  showSuspectModal = false;
  isEditingSuspect = false;
  isSavingSuspect = false;
  currentSuspect: any = {
    case_number: '',
    nombres: '',
    identificacion: '',
    genero: 'Masculino',
    telefono: '',
    direccion: '',
    alias_conocido: '',
    fecha_nacimiento: '',
    antecedentes: false,
    declaracion: '',
    id_banda: 0
  };

  // Gang Modal CRUD State
  showGangModal = false;
  isEditingGang = false;
  isSavingGang = false;
  currentGang: any = {
    nombre_banda: '',
    zona_operacion: '',
    nivel_peligrosidad: 'Media'
  };

  // Evidence Modal CRUD State
  showEvidenceModal = false;
  isEditingEvidence = false;
  isSavingEvidence = false;
  currentEvidence: any = {
    case_number: '',
    tipo_evidencia: '',
    id_oficial: 1
  };

  // Witness Modal CRUD State
  showWitnessModal = false;
  isEditingWitness = false;
  isSavingWitness = false;
  currentWitness: any = {
    case_number: '',
    nombres: '',
    identificacion: '',
    genero: 'Masculino',
    telefono: '',
    direccion: '',
    testimonio: '',
    es_anonimo: false
  };

  // Victim Modal CRUD State
  showVictimModal = false;
  isEditingVictim = false;
  isSavingVictim = false;
  currentVictim: any = {
    case_number: '',
    nombres: '',
    identificacion: '',
    genero: 'Masculino',
    telefono: '',
    direccion: ''
  };

  constructor(
    private dataService: IntelService,
    private incidentService: IncidentService,
    private logisticsService: LogisticsService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const role = this.authService.getRole();
    if (role !== 'administrador') {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;
    this.dataService.getSuspects().subscribe({
      next: (data) => this.suspects = data,
      error: (err) => console.error(err)
    });
    this.dataService.getGangs().subscribe({
      next: (data) => this.gangs = data,
      error: (err) => console.error(err)
    });
    this.dataService.getEvidences().subscribe({
      next: (data) => this.evidences = data,
      error: (err) => console.error(err)
    });
    this.dataService.getWitnesses().subscribe({
      next: (data) => this.witnesses = data,
      error: (err) => console.error(err)
    });
    this.dataService.getVictims().subscribe({
      next: (data) => this.victims = data,
      error: (err) => console.error(err)
    });
    this.logisticsService.getOfficers().subscribe({
      next: (data) => {
        this.officers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }

  // Autocomplete Incident Methods
  searchCases(term: string) {
    if (!term || term.trim().length < 2) {
      this.caseSuggestions = [];
      this.showCaseSuggestions = false;
      return;
    }
    this.isSearchingCases = true;
    this.showCaseSuggestions = true;
    this.incidentService.getIncidents(1, 10, { search: term }).subscribe({
      next: (res) => {
        this.caseSuggestions = res.data || [];
        this.isSearchingCases = false;
      },
      error: (err) => {
        console.error(err);
        this.isSearchingCases = false;
      }
    });
  }

  selectCaseNumber(caseNumber: string, targetEntity: 'suspect' | 'evidence' | 'witness' | 'victim') {
    if (targetEntity === 'suspect') {
      this.currentSuspect.case_number = caseNumber;
    } else if (targetEntity === 'evidence') {
      this.currentEvidence.case_number = caseNumber;
    } else if (targetEntity === 'witness') {
      this.currentWitness.case_number = caseNumber;
    } else if (targetEntity === 'victim') {
      this.currentVictim.case_number = caseNumber;
    }
    this.showCaseSuggestions = false;
    this.caseSuggestions = [];
  }

  setActiveTab(tab: 'suspects' | 'evidence' | 'witnesses') {
    this.activeTab = tab;
  }

  // ==========================================
  // SUSPECT CRUD METHODS
  // ==========================================
  openCreateSuspectModal() {
    this.isEditingSuspect = false;
    this.currentSuspect = {
      case_number: '',
      nombres: '',
      identificacion: '',
      genero: 'Masculino',
      telefono: '',
      direccion: '',
      alias_conocido: '',
      fecha_nacimiento: new Date().toISOString().split('T')[0],
      antecedentes: false,
      declaracion: '',
      id_banda: this.gangs[0]?.id_banda || 0
    };
    this.showSuspectModal = true;
  }

  openEditSuspectModal(suspect: any) {
    this.isEditingSuspect = true;
    this.currentSuspect = { ...suspect };
    this.showSuspectModal = true;
  }

  closeSuspectModal() {
    this.showSuspectModal = false;
  }

  saveSuspect() {
    this.isSavingSuspect = true;
    if (this.isEditingSuspect) {
      this.dataService.updateSuspect(this.currentSuspect.id_sospechoso, this.currentSuspect).subscribe({
        next: () => {
          this.isSavingSuspect = false;
          this.closeSuspectModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingSuspect = false;
        }
      });
    } else {
      this.dataService.createSuspect(this.currentSuspect).subscribe({
        next: () => {
          this.isSavingSuspect = false;
          this.closeSuspectModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingSuspect = false;
        }
      });
    }
  }

  deleteSuspect(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de eliminar este sospechoso del archivo criminal?')) {
      this.dataService.deleteSuspect(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // GANG CRUD METHODS
  // ==========================================
  openCreateGangModal() {
    this.isEditingGang = false;
    this.currentGang = {
      nombre_banda: '',
      zona_operacion: '',
      nivel_peligrosidad: 'Media'
    };
    this.showGangModal = true;
  }

  openEditGangModal(gang: any) {
    this.isEditingGang = true;
    this.currentGang = { ...gang };
    this.showGangModal = true;
  }

  closeGangModal() {
    this.showGangModal = false;
  }

  saveGang() {
    this.isSavingGang = true;
    if (this.isEditingGang) {
      this.dataService.updateGang(this.currentGang.id_banda, this.currentGang).subscribe({
        next: () => {
          this.isSavingGang = false;
          this.closeGangModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingGang = false;
        }
      });
    } else {
      this.dataService.createGang(this.currentGang).subscribe({
        next: () => {
          this.isSavingGang = false;
          this.closeGangModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingGang = false;
        }
      });
    }
  }

  deleteGang(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de eliminar esta banda criminal y desvincular sus miembros?')) {
      this.dataService.deleteGang(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // EVIDENCE CRUD METHODS
  // ==========================================
  openCreateEvidenceModal() {
    this.isEditingEvidence = false;
    this.currentEvidence = {
      case_number: '',
      tipo_evidencia: '',
      id_oficial: this.authService.getOfficerId()
    };
    this.showEvidenceModal = true;
  }

  openEditEvidenceModal(evidence: any) {
    this.isEditingEvidence = true;
    this.currentEvidence = { ...evidence };
    this.showEvidenceModal = true;
  }

  closeEvidenceModal() {
    this.showEvidenceModal = false;
  }

  saveEvidence() {
    this.isSavingEvidence = true;
    this.currentEvidence.id_oficial = this.authService.getOfficerId();
    if (this.isEditingEvidence) {
      this.dataService.updateEvidence(this.currentEvidence.id_evidencia, this.currentEvidence).subscribe({
        next: () => {
          this.isSavingEvidence = false;
          this.closeEvidenceModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingEvidence = false;
        }
      });
    } else {
      this.dataService.createEvidence(this.currentEvidence).subscribe({
        next: () => {
          this.isSavingEvidence = false;
          this.closeEvidenceModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingEvidence = false;
        }
      });
    }
  }

  deleteEvidence(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de eliminar este registro de evidencia confiscada?')) {
      this.dataService.deleteEvidence(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // WITNESS CRUD METHODS
  // ==========================================
  openCreateWitnessModal() {
    this.isEditingWitness = false;
    this.currentWitness = {
      case_number: '',
      nombres: '',
      identificacion: '',
      genero: 'Masculino',
      telefono: '',
      direccion: '',
      testimonio: '',
      es_anonimo: false
    };
    this.showWitnessModal = true;
  }

  openEditWitnessModal(witness: any) {
    this.isEditingWitness = true;
    this.currentWitness = { ...witness };
    this.showWitnessModal = true;
  }

  closeWitnessModal() {
    this.showWitnessModal = false;
  }

  saveWitness() {
    this.isSavingWitness = true;
    if (this.isEditingWitness) {
      this.dataService.updateWitness(this.currentWitness.id_testigo, this.currentWitness).subscribe({
        next: () => {
          this.isSavingWitness = false;
          this.closeWitnessModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingWitness = false;
        }
      });
    } else {
      this.dataService.createWitness(this.currentWitness).subscribe({
        next: () => {
          this.isSavingWitness = false;
          this.closeWitnessModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingWitness = false;
        }
      });
    }
  }

  deleteWitness(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de remover la declaración del testigo?')) {
      this.dataService.deleteWitness(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }

  // ==========================================
  // VICTIM CRUD METHODS
  // ==========================================
  openCreateVictimModal() {
    this.isEditingVictim = false;
    this.currentVictim = {
      case_number: '',
      nombres: '',
      identificacion: '',
      genero: 'Masculino',
      telefono: '',
      direccion: ''
    };
    this.showVictimModal = true;
  }

  openEditVictimModal(victim: any) {
    this.isEditingVictim = true;
    this.currentVictim = { ...victim };
    this.showVictimModal = true;
  }

  closeVictimModal() {
    this.showVictimModal = false;
  }

  saveVictim() {
    this.isSavingVictim = true;
    if (this.isEditingVictim) {
      this.dataService.updateVictim(this.currentVictim.id_victima, this.currentVictim).subscribe({
        next: () => {
          this.isSavingVictim = false;
          this.closeVictimModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingVictim = false;
        }
      });
    } else {
      this.dataService.createVictim(this.currentVictim).subscribe({
        next: () => {
          this.isSavingVictim = false;
          this.closeVictimModal();
          this.loadAllData();
        },
        error: (err) => {
          console.error(err);
          this.isSavingVictim = false;
        }
      });
    }
  }

  deleteVictim(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Está seguro de remover a esta víctima del archivo del caso?')) {
      this.dataService.deleteVictim(id).subscribe({
        next: () => this.loadAllData(),
        error: (err) => console.error(err)
      });
    }
  }
}
